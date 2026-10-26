// Avisos de plazos para la propietaria de GUEST.
// La web promete la propuesta en 48–72 h desde que llega el cuestionario; la entrega tras
// aprobar no tiene plazo público, así que usamos 48 h como plazo interno.
// Lo llama pg_cron cada hora. No guarda estado: cada aviso sale cuando el plazo cruza un umbral
// dentro de la última hora, y la clave de idempotencia de Resend evita duplicados si se llama
// varias veces. Solo escribe a las direcciones de la propietaria.
import { createClient } from 'npm:@supabase/supabase-js@2';

const OWNER = ['weddlysmartdesign@gmail.com'];
// El panel de la web publicada (o de la copia de lanzamiento mientras se prueba) sirve para pedidos reales y de prueba.
const APP = String(Deno.env.get('GUEST_LIVE_ORIGIN') || 'https://guest.weddlysmartdesign.com').replace(/\/$/, '') + '/guest/panel-pruebas.html';
const H = 3600_000;
const PROPOSAL_DUE = 72 * H, PROPOSAL_GOAL = 48 * H, DELIVERY_DUE = 48 * H;
const DIGEST_UTC_HOUR = 7; // 08:00–09:00 en Madrid según la época del año

const secretKey = () => { const x = Deno.env.get('SUPABASE_SECRET_KEYS'); return x ? JSON.parse(x).default : (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''); };
const db = () => createClient(Deno.env.get('SUPABASE_URL')!, secretKey(), { auth: { persistSession: false } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const label = (o: any) => [o.questionnaire?.couple?.name1, o.questionnaire?.couple?.name2].filter(Boolean).join(' & ') || o.buyer_email || 'Pedido sin nombres';
const when = (t: number) => new Date(t).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
const left = (ms: number) => { if (ms <= 0) return 'vencido'; const h = Math.floor(ms / H); return h >= 24 ? `quedan ${Math.floor(h / 24)} d ${h % 24} h` : `quedan ${h} h ${Math.floor((ms % H) / 60000)} min`; };

async function send(subject: string, html: string, key: string) {
  const apiKey = String(Deno.env.get('RESEND_API_KEY') || '').trim(), raw = String(Deno.env.get('WEDDLY_RESEND_FROM') || '').trim();
  const m = raw.match(/<([^>]+)>/), addr = (m?.[1] || (/^[^\s<>]+@[^\s<>]+$/.test(raw) ? raw : '')).trim();
  if (!apiKey || !addr) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey, 'Idempotency-Key': key },
    body: JSON.stringify({ from: 'GUEST · Plazos <' + addr + '>', to: OWNER, subject, html })
  });
  if (!r.ok) console.warn('resend_failed', r.status, await r.text());
  return r.ok;
}
const box = (title: string, body: string) => `<div lang="es" style="font-family:Arial,sans-serif;color:#1b2650;max-width:560px">
  <h2 style="font-family:Georgia,serif;font-weight:400;font-size:26px;margin:0 0 12px">${title}</h2>${body}
  <p style="margin:22px 0"><a href="${APP}" style="display:inline-block;background:#1b2650;color:#fbf7f4;padding:13px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Abrir mis pedidos</a></p></div>`;

// Plazo de cada pedido abierto, o null si no te toca a ti.
function deadline(o: any) {
  // Los pedidos de prueba antiguos (pilotos) no cuentan.
  if (o.mode === 'test' && Date.now() - Date.parse(o.created_at) > 14 * 24 * H) return null;
  const sub = Date.parse(o.submitted_at || ''), app = Date.parse(o.approved_at || '');
  if (['submitted', 'designing', 'review_ready'].includes(o.status) && sub) return { kind: 'proposal', start: sub, due: sub + PROPOSAL_DUE, goal: sub + PROPOSAL_GOAL, what: o.revision_count ? 'Enviar la versión corregida' : 'Enviar la propuesta' };
  if (o.status === 'approved' && app) return { kind: 'delivery', start: app, due: app + DELIVERY_DUE, goal: app + 24 * H, what: 'Entregar la invitación' };
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 });
  const now = Date.now(), hourAgo = now - H;
  const { data: rows, error } = await db().from('guest_invitation_orders')
    .select('id,mode,status,buyer_email,questionnaire,created_at,submitted_at,approved_at,revision_count,updated_at')
    .in('status', ['draft', 'submitted', 'designing', 'review_ready', 'approved']).limit(500);
  if (error) { console.error(error); return new Response(JSON.stringify({ ok: false }), { status: 500 }); }
  const sent: string[] = [];
  const open = (rows || []).map((o) => ({ o, d: deadline(o) })).filter((x) => x.d) as { o: any; d: any }[];

  // Avisos al cruzar un umbral en la última hora.
  for (const { o, d } of open) {
    const marks: [number, string, string][] = [
      [d.goal, d.kind === 'proposal' ? 'Quedan 24 h' : 'Lleva 24 h aprobada', 'goal'],
      [d.due - 6 * H, 'Quedan 6 h', '6h'],
      [d.due, 'Plazo vencido', 'due']
    ];
    for (const [t, tag, id] of marks) {
      if (t > hourAgo && t <= now) {
        const subject = `${tag} · ${d.what.toLowerCase()} a ${label(o)}${o.mode === 'test' ? ' (prueba)' : ''}`;
        const html = box(esc(tag) + '.', `<p style="font-size:16px;line-height:1.55;margin:0"><b>${esc(label(o))}</b>: ${esc(d.what.toLowerCase())}.</p>
          <p style="font-size:15px;line-height:1.55;color:#4a5480">Plazo: ${esc(when(d.due))} (${esc(left(d.due - now))}).</p>`);
        if (await send(subject, html, `guest-deadline/${o.id}/${d.kind}/${d.start}/${id}`)) sent.push(o.id + ':' + id);
      }
    }
  }

  // Resumen de la mañana, solo si hay algo.
  const date = new Date(now);
  if (date.getUTCHours() === DIGEST_UTC_HOUR) {
    open.sort((a, b) => a.d.due - b.d.due);
    const stale = (rows || []).filter((o) => o.status === 'draft' && now - Date.parse(o.created_at) > 3 * 24 * H);
    if (open.length || stale.length) {
      const li = (t: string) => `<li style="margin:0 0 10px;font-size:15px;line-height:1.5">${t}</li>`;
      const html = box(open.length ? `Hoy tienes ${open.length} ${open.length === 1 ? 'pendiente' : 'pendientes'}.` : 'Nada urgente hoy.',
        (open.length ? `<ul style="padding-left:18px;margin:0">${open.map(({ o, d }) => li(`<b>${esc(label(o))}</b>${o.mode === 'test' ? ' (prueba)' : ''}: ${esc(d.what.toLowerCase())}.<br><span style="color:${d.due - now < 12 * H ? '#b3263a' : '#4a5480'}">Antes del ${esc(when(d.due))} · ${esc(left(d.due - now))}</span>`)).join('')}</ul>` : '') +
        (stale.length ? `<p style="font-size:15px;margin:18px 0 6px"><b>Sin rellenar el cuestionario desde hace más de 3 días</b> (quizá convenga escribirles):</p><ul style="padding-left:18px;margin:0">${stale.map((o) => li(`${esc(o.buyer_email || label(o))} · compró el ${esc(when(Date.parse(o.created_at)))}`)).join('')}</ul>` : ''));
      if (await send(open.length ? `Pedidos de hoy: ${open.length} ${open.length === 1 ? 'pendiente' : 'pendientes'}` : 'Pedidos de hoy: parejas sin cuestionario', html, `guest-digest/${date.toISOString().slice(0, 10)}`)) sent.push('digest');
    }
  }
  return new Response(JSON.stringify({ ok: true, open: open.length, sent }), { headers: { 'Content-Type': 'application/json' } });
});
