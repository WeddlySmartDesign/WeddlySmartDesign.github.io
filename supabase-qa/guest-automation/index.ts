// Automatismos de GUEST para la propietaria.
// - Cada hora (pg_cron, cuerpo vacío): avisos de plazos, recordatorios a las parejas, facturas de
//   las compras nuevas, petición de opinión tras la entrega, resumen de la mañana y de los lunes.
// - action 'invoice' (público, con token firmado): datos de una factura para guest/factura.html.
// - action 'stats' | 'refund' | 'invoices' | 'invoice_book' (con la sesión de propietaria): para la app de pedidos.
// Es sin estado: cada aviso sale cuando su momento cruza la última hora, y la clave de
// idempotencia de Resend evita duplicados. Las facturas sí se guardan (guest_invoices).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { guestMail, mBtn, mP, mNote, mList, DESIGN_NAMES } from './guest-mail.ts';

const APP_ORIGIN = 'https://guest-stripe-pago-2026-10-24.guest-invitaciones.pages.dev';
const OWNER = ['weddlysmartdesign@gmail.com'];
// Mientras se prueba, a las parejas solo se les escribe si la compra es real o si el email es de la propietaria.
const OWNER_EMAILS = ['weddlysmartdesign@gmail.com', 'pilarrodriguezbonilla@gmail.com', 'info@weddlysmartdesign.com'];
const ISSUER = { name: 'María del Pilar Rodríguez Bonilla', nif: '54095952K', address: 'Avda. Futbolista Antonio Ruiz Cervilla, 7 · 30107 Murcia', email: 'info@weddlysmartdesign.com', brand: 'GUEST by WeddlySmartDesign' };
const PRICE_CENTS = 5990;
const AUTOMATION_SINCE = Date.parse('2026-10-25T00:00:00Z');
const H = 3600_000, D = 24 * H;
const PROPOSAL_DUE = 72 * H, PROPOSAL_GOAL = 48 * H, DELIVERY_DUE = 48 * H;
const MORNING_UTC = 7;
const DESIGNS = DESIGN_NAMES;

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, x-weddly-manager', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const secretKey = () => { const x = Deno.env.get('SUPABASE_SECRET_KEYS'); return x ? JSON.parse(x).default : (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''); };
const db = () => createClient(Deno.env.get('SUPABASE_URL')!, secretKey(), { auth: { persistSession: false } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const names = (o: any) => [o.questionnaire?.couple?.name1, o.questionnaire?.couple?.name2].filter(Boolean).join(' & ');
const label = (o: any) => names(o) || o.buyer_email || 'Pedido sin nombres';
const emailOf = (o: any) => String(o.questionnaire?.contact?.email || o.buyer_email || '').trim().toLowerCase();
const isLive = (o: any) => String(o.checkout_session_id || '').startsWith('cs_live_');
// A medida: el pedido no tiene sesión de Stripe propia (se cobra en guest-custom); cuenta como real si su solicitud lo es.
const liveCustom = new Set<string>();
const canWriteCouple = (o: any) => isLive(o) || (!!o.custom_request_id && liveCustom.has(String(o.custom_request_id))) || OWNER_EMAILS.includes(emailOf(o));
const when = (t: number) => new Date(t).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
const left = (ms: number) => { if (ms <= 0) return 'vencido'; const h = Math.floor(ms / H); return h >= 24 ? `quedan ${Math.floor(h / 24)} d ${h % 24} h` : `quedan ${h} h ${Math.floor((ms % H) / 60000)} min`; };
const euros = (c: number) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

async function hmacHex(v: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secretKey()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(v));
  return Array.from(new Uint8Array(s)).map((x) => x.toString(16).padStart(2, '0')).join('');
}
// Mismos enlaces que genera guest-invitation-flow.
const capability = async (id: string, purpose: string) => 'gif1_' + purpose + '_' + id + '_' + (await hmacHex('guest-invitation-flow-v1|' + purpose + '|' + id)).slice(0, 40);
const invoiceToken = async (id: string) => id + '.' + (await hmacHex('guest-invoice-v1|' + id)).slice(0, 32);
const invoiceUrl = async (id: string) => APP_ORIGIN + '/guest/factura.html?f=' + encodeURIComponent(await invoiceToken(id));

async function send(to: string[], subject: string, html: string, key: string, from = 'GUEST by WeddlySmartDesign') {
  const apiKey = String(Deno.env.get('RESEND_API_KEY') || '').trim(), raw = String(Deno.env.get('WEDDLY_RESEND_FROM') || '').trim();
  const m = raw.match(/<([^>]+)>/), addr = (m?.[1] || (/^[^\s<>]+@[^\s<>]+$/.test(raw) ? raw : '')).trim();
  if (!apiKey || !addr || !to.length) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey, 'Idempotency-Key': key },
    body: JSON.stringify({ from: from + ' <' + addr + '>', to, reply_to: ISSUER.email, subject, html })
  });
  if (!r.ok) console.warn('resend_failed', r.status, await r.text());
  return r.ok;
}
const button = (href: string, text: string) => mBtn(href, text);
// title y kicker van sin escapar; body ya escapado.
const mail = (kicker: string, title: string, body: string, preheader = title) => guestMail({ kicker, title, body, preheader });
const ownerMail = (kicker: string, title: string, body: string) => guestMail({ owner: true, kicker, title, preheader: title, body: body + button(APP_ORIGIN + '/guest/panel-pruebas.html', 'Abrir mis pedidos') });
// Ventana de 3 h: si una pasada de la tarea falla, la siguiente aún manda el aviso. La clave de
// idempotencia de Resend (24 h) evita que salga dos veces.
const crossed = (t: number, now: number) => t > now - 3 * H && t <= now;
const AUTO_APPROVE_DAYS = 30;
const dayEs = (t: number) => new Date(t).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' });
// QA: guest-invitation-flow-qa. Al pasar a real, guest-invitation-flow.
const FLOW_URL = () => String(Deno.env.get('SUPABASE_URL') || '').replace(/\/$/, '') + '/functions/v1/guest-invitation-flow-qa';
async function flowCall(body: any) {
  const r = await fetch(FLOW_URL(), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
  return await r?.json().catch(() => null);
}
const internalSig = async (action: string, id: string) => (await hmacHex('guest-internal-v1|' + action + '|' + id)).slice(0, 40);
// Modo vacaciones (guest_settings.vacation = { until: 'YYYY-MM-DD' }): los avisos de plazo se paran hasta esa fecha.
async function vacation(c: any) {
  const { data } = await c.from('guest_settings').select('value').eq('key', 'vacation').maybeSingle();
  const until = Date.parse(String(data?.value?.until || '') + 'T23:59:59+01:00');
  return until && until > Date.now() ? { until } : null;
}

/* ---------- Plazos de la propietaria ---------- */
function deadline(o: any) {
  // A medida: sus plazos (días prometidos y pago final) los lleva guest-custom.
  if (o.custom_request_id) return null;
  if (o.mode === 'test' && Date.now() - Date.parse(o.created_at) > 14 * D) return null;
  const sub = Date.parse(o.submitted_at || ''), app = Date.parse(o.approved_at || '');
  if (['submitted', 'designing', 'review_ready'].includes(o.status) && sub) return { kind: 'proposal', start: sub, due: sub + PROPOSAL_DUE, goal: sub + PROPOSAL_GOAL, what: o.revision_count ? 'Enviar la versión corregida' : 'Enviar la propuesta' };
  if (o.status === 'approved' && app) return { kind: 'delivery', start: app, due: app + DELIVERY_DUE, goal: app + D, what: 'Entregar la invitación' };
  return null;
}

/* ---------- Facturas ---------- */
function stripeKey(sessionId: string) {
  const live = sessionId.startsWith('cs_live_');
  return String(Deno.env.get(live ? 'STRIPE_SECRET_KEY' : 'GUEST_STRIPE_TEST_SECRET_KEY') || '').trim();
}
async function stripe(path: string, sessionId: string, init: RequestInit = {}) {
  const key = stripeKey(sessionId);
  if (!key) throw Error('stripe_key_missing');
  const r = await fetch('https://api.stripe.com/v1/' + path, { ...init, headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded', ...(init.headers || {}) } });
  const j = await r.json();
  if (!r.ok) throw Error('stripe_' + (j?.error?.code || r.status));
  return j;
}
async function issueInvoice(c: any, o: any) {
  let total = PRICE_CENTS, name = names(o) || null, ref = o.checkout_session_id, taxId = '';
  try { const s = await stripe('checkout/sessions/' + encodeURIComponent(o.checkout_session_id), o.checkout_session_id); if (Number.isInteger(s.amount_total)) total = s.amount_total; name = s.customer_details?.name || name; ref = s.payment_intent || ref; taxId = String(s.customer_details?.tax_ids?.[0]?.value || '').slice(0, 30); } catch (e) { console.warn('invoice_session_lookup', String(e)); }
  const { data, error } = await c.rpc('guest_issue_invoice', { p_order: o.id, p_kind: 'invoice', p_mode: isLive(o) ? 'production' : 'test', p_email: emailOf(o), p_name: name, p_concept: 'Invitación digital personalizada · diseño ' + (DESIGNS[o.template_id] || o.template_id) + ', con app de gestión de invitados', p_total_cents: total, p_stripe_ref: ref, p_rectifies: null });
  if (error) throw error;
  // NIF opcional que piden en el pago (no forma parte de la huella de la factura).
  if (taxId && data?.id && !data.buyer_tax_id) { await c.from('guest_invoices').update({ buyer_tax_id: taxId }).eq('id', data.id); data.buyer_tax_id = taxId; }
  return data;
}

/* ---------- Estadísticas ---------- */
async function stats(c: any) {
  const [{ data: inv, error: ie }, { data: ord, error: oe }] = await Promise.all([
    c.from('guest_invoices').select('kind,mode,issued_at,total_cents,order_id,custom_request_id,extra_for_order').limit(5000),
    c.from('guest_invitation_orders').select('id,template_id,status,checkout_session_id,created_at').not('checkout_session_id', 'is', null).limit(5000)
  ]);
  if (ie) throw ie; if (oe) throw oe;
  const tpl = new Map((ord || []).map((o: any) => [o.id, o.template_id]));
  const now = new Date(), madrid = (d: Date) => new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const m = madrid(now), dow = (m.getDay() + 6) % 7;
  const weekStart = now.getTime() - (dow * D + m.getHours() * H + m.getMinutes() * 60000);
  const monthStart = now.getTime() - ((m.getDate() - 1) * D + m.getHours() * H + m.getMinutes() * 60000);
  const pick = (mode: string) => {
    const rows = (inv || []).filter((x: any) => x.mode === mode);
    const firstCustom = new Map<string, any>();
    [...rows].sort((a: any, b: any) => Date.parse(a.issued_at) - Date.parse(b.issued_at)).forEach((x: any) => { if (x.kind === 'invoice' && x.custom_request_id && !firstCustom.has(x.custom_request_id)) firstCustom.set(x.custom_request_id, x); });
    // Un diseño a medida se factura en dos o más pagos: cuenta como una venta, el día de la señal.
    const isSale = (x: any) => x.kind === 'invoice' && !x.extra_for_order && (!x.custom_request_id || firstCustom.get(x.custom_request_id) === x);
    const sum = (from: number, to = Infinity) => {
      const r = rows.filter((x: any) => { const t = Date.parse(x.issued_at); return t >= from && t < to; });
      return { sales: r.filter(isSale).length, refunds: r.filter((x: any) => x.kind === 'rectificative').length, cents: r.reduce((a: number, x: any) => a + x.total_cents, 0) };
    };
    const byDesign: Record<string, number> = {};
    rows.filter(isSale).forEach((x: any) => { const n = x.custom_request_id ? 'A medida' : DESIGNS[tpl.get(x.order_id) as string] || 'Otro'; byDesign[n] = (byDesign[n] || 0) + 1; });
    return { week: sum(weekStart), lastWeek: sum(weekStart - 7 * D, weekStart), month: sum(monthStart), total: sum(0), designs: Object.entries(byDesign).sort((a, b) => b[1] - a[1]) };
  };
  return { live: pick('production'), test: pick('test') };
}

/* ---------- Sesión de propietaria (igual que guest-invitation-flow) ---------- */
function unb64url(s: string) { let v = s.replaceAll('-', '+').replaceAll('_', '/'); while (v.length % 4) v += '='; return atob(v); }
async function managerOk(c: any, req: Request) {
  const parts = String(req.headers.get('x-weddly-manager') || '').trim().split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;
  const sig = await hmacHex('wsd-owner-manager-v1|' + parts[1]);
  if (sig.length !== parts[2].length) return false;
  let d = 0; for (let i = 0; i < sig.length; i++) d |= sig.charCodeAt(i) ^ parts[2].charCodeAt(i);
  if (d) return false;
  let p: any; try { p = JSON.parse(unb64url(parts[1])); } catch { return false; }
  if (!p?.ownerId || !p?.exp || Date.now() >= Number(p.exp)) return false;
  const { data: l } = await c.from('licenses').select('source,status,metadata').eq('id', String(p.ownerId)).maybeSingle();
  return !!l && l.source === 'internal_owner' && l.status === 'active' && l.metadata?.grant_type === 'owner';
}

/* ---------- Tarea de cada hora ---------- */
/* ---------- Borrado de datos (política de privacidad: hasta 90 días después de la boda + 30 de margen) ---------- */
const KEEP_AFTER_WEDDING = 120 * D;
const weddingAt = (date: any) => { const t = Date.parse(String(date || '').slice(0, 10) + 'T12:00:00Z'); return Number.isFinite(t) ? t : 0; };
async function retention(c: any, now: number) {
  const purged: string[] = [], soon: string[] = [];
  const { data: orders } = await c.from('guest_invitation_orders').select('id,questionnaire,files,status').is('purged_at', null).limit(2000);
  for (const o of orders || []) {
    const w = weddingAt(o.questionnaire?.couple?.date); if (!w) continue;
    const name = [o.questionnaire?.couple?.name1, o.questionnaire?.couple?.name2].filter(Boolean).join(' & ') || o.id.slice(0, 8);
    if (now < w + KEEP_AFTER_WEDDING) { if (now >= w + KEEP_AFTER_WEDDING - 7 * D) soon.push(name); continue; }
    const files = Array.isArray(o.files) ? o.files : [];
    const priv = files.map((f: any) => f.path).filter(Boolean), pub = files.map((f: any) => f.publicPath).filter(Boolean);
    if (priv.length) await c.storage.from('guest-invitation-uploads').remove(priv);
    if (pub.length) await c.storage.from('guest-invitation-public').remove(pub);
    const q = o.questionnaire || {};
    const { error } = await c.from('guest_invitation_orders').update({ questionnaire: { couple: { name1: q.couple?.name1 || '', name2: q.couple?.name2 || '', date: q.couple?.date || '' } }, files: [], resolved_config: {}, revision_requests: [], style_overrides: null, purged_at: new Date(now).toISOString() }).eq('id', o.id);
    if (error) console.error('purge_order', o.id, error); else purged.push(name);
  }
  const { data: customs } = await c.from('guest_custom_requests').select('id,name,wedding_date,files').is('purged_at', null).not('wedding_date', 'is', null).limit(2000);
  for (const r of customs || []) {
    const w = weddingAt(r.wedding_date); if (!w) continue;
    if (now < w + KEEP_AFTER_WEDDING) { if (now >= w + KEEP_AFTER_WEDDING - 7 * D) soon.push(r.name + ' (a medida)'); continue; }
    const paths = (r.files || []).map((f: any) => f.path).filter(Boolean);
    if (paths.length) await c.storage.from('guest-custom-uploads').remove(paths);
    const { error } = await c.from('guest_custom_requests').update({ files: [], idea: '', links: '', wishes: [], purged_at: new Date(now).toISOString() }).eq('id', r.id);
    if (error) console.error('purge_custom', r.id, error); else purged.push(r.name + ' (a medida)');
  }
  return { purged, soon };
}

async function tick(c: any) {
  const now = Date.now(), sent: string[] = [];
  const { data: rows, error } = await c.from('guest_invitation_orders')
    .select('id,mode,status,buyer_email,template_id,checkout_session_id,questionnaire,created_at,updated_at,submitted_at,review_sent_at,approved_at,delivered_at,revision_count,revision_requests,custom_request_id')
    .neq('status', 'cancelled').order('created_at', { ascending: false }).limit(1000);
  if (error) throw error;
  const all = rows || [];
  const { data: lc } = await c.from('guest_custom_requests').select('id').eq('mode', 'production').not('order_id', 'is', null).limit(2000);
  liveCustom.clear(); (lc || []).forEach((x: any) => liveCustom.add(String(x.id)));

  // 1. Plazos de la propietaria (parados en vacaciones).
  const away = await vacation(c);
  const open = all.map((o: any) => ({ o, d: deadline(o) })).filter((x: any) => x.d) as { o: any; d: any }[];
  // Tras las primeras ventas, una propuesta que lleva 48 h sin que la mires sale sola (guest-invitation-flow decide si toca).
  for (const { o, d } of open) if (d.kind === 'proposal' && o.checkout_session_id && now - d.start >= 48 * H) {
    const j = await flowCall({ action: 'auto_send', orderId: o.id, sig: await internalSig('auto_send', o.id) });
    if (j?.ok && j.sent) sent.push('auto-send:' + o.id);
  }
  for (const { o, d } of away ? [] : open) {
    for (const [t, tag, id] of [[d.goal, d.kind === 'proposal' ? 'Quedan 24 h' : 'Lleva 24 h aprobada', 'goal'], [d.due - 6 * H, 'Quedan 6 h', '6h'], [d.due, 'Plazo vencido', 'due']] as [number, string, string][]) {
      if (!crossed(t, now)) continue;
      const ok = await send(OWNER, `${tag} · ${d.what.toLowerCase()} a ${label(o)}${o.mode === 'test' ? ' (prueba)' : ''}`,
        ownerMail('Plazos', tag + '.', mP(`<b>${esc(label(o))}</b>: ${esc(d.what.toLowerCase())}.`) + mP(`Plazo: ${esc(when(d.due))} (${esc(left(d.due - now))}).`, true)),
        `guest-deadline/${o.id}/${d.kind}/${d.start}/${id}`, 'GUEST · Plazos');
      if (ok) sent.push('deadline:' + o.id + ':' + id);
    }
  }

  // 2. Recordatorios a las parejas.
  for (const o of all) {
    if (!canWriteCouple(o) || Date.parse(o.created_at) < AUTOMATION_SINCE) continue;
    const to = [emailOf(o)];
    if (o.status === 'draft') {
      // A los 2, 5, 15 y 30 días, y luego uno al mes durante un año: el cuestionario no caduca, ya han pagado.
      const born = Date.parse(o.created_at), later: [number, string, string, string][] = [];
      for (let m = 2; m <= 12; m++) later.push([born + 30 * m * D, 'q' + m + 'm', 'Vuestra invitación sigue esperándoos.', 'Cuando tengáis un rato, contadnos vuestra boda y nos ponemos con ella. Si aún os falta algún dato, rellenad lo que sepáis: se guarda solo y lo terminamos cuando lo tengáis.']);
      for (const [t, id, title, text] of [
        [born + 2 * D, 'q2d', 'Vuestra invitación os espera.', 'Para empezar a prepararla solo nos falta que nos contéis vuestra boda. Son unos minutos, se guarda solo y podéis dejarlo a medias.'],
        [born + 5 * D, 'q5d', '¿Os ayudamos con el cuestionario?', 'Aún no tenemos los datos de vuestra boda. Si algo no está claro o preferís contárnoslo por WhatsApp, respondednos y lo vemos juntos.'],
        [born + 15 * D, 'q15d', 'Aún no tenemos vuestros datos.', 'Vuestra invitación está pagada y esperando. Contadnos vuestra boda cuando podáis; si preferís hacerlo por WhatsApp, respondednos y os ayudamos.'],
        [born + 30 * D, 'q30d', 'Un mes esperando vuestra boda.', 'Aún no nos ha llegado el cuestionario. No caduca, pero cuanto antes lo tengamos, antes podréis enviar la invitación a vuestros invitados.'],
        ...later
      ] as [number, string, string, string][]) {
        if (!crossed(t, now)) continue;
        const link = APP_ORIGIN + '/guest/catalog-questionnaire.html?t=' + encodeURIComponent(await capability(o.id, 'q'));
        if (await send(to, title.replace(/\.$/, ''), mail('Recordatorio', title, mP(esc(text)) + button(link, 'Contadnos vuestra boda')), `guest-remind/${o.id}/${id}`)) sent.push('couple:' + o.id + ':' + id);
      }
    }
    if (o.status === 'review_sent' && o.review_sent_at) {
      for (const [t, id, title, text] of [
        [Date.parse(o.review_sent_at) + 3 * D, 'r3d', 'Vuestra invitación sigue esperando vuestro sí.', 'Ya está lista. Echadle un vistazo desde el móvil: si os encanta, la aprobáis; si queréis cambiar algo, lo podéis hacer vosotros mismos desde allí.'],
        [Date.parse(o.review_sent_at) + 7 * D, 'r7d', '¿Qué os ha parecido vuestra invitación?', 'No queremos que se os pase: en cuanto la aprobéis os la entregamos con la app para enviarla a vuestros invitados.'],
        [Date.parse(o.review_sent_at) + 14 * D, 'r14d', 'Vuestra invitación lleva dos semanas esperando.', `Si no nos decís nada, el ${dayEs(Date.parse(o.review_sent_at) + AUTO_APPROVE_DAYS * D)} la daremos por aprobada y os la entregaremos tal cual, con la app. Si queréis cambiar algo, hacedlo antes desde el enlace.`],
        [Date.parse(o.review_sent_at) + 25 * D, 'r25d', 'En 5 días damos vuestra invitación por aprobada.', `Como no nos habéis dicho nada, el ${dayEs(Date.parse(o.review_sent_at) + AUTO_APPROVE_DAYS * D)} la daremos por aprobada y os la entregaremos con la app. Si queréis cambiar algo, aún estáis a tiempo.`]
      ] as [number, string, string, string][]) {
        if (!crossed(t, now)) continue;
        const link = APP_ORIGIN + '/guest-review-v1.html?t=' + encodeURIComponent(await capability(o.id, 'r'));
        if (await send(to, title.replace(/\.$/, ''), mail('Recordatorio', title, mP(esc(text)) + button(link, 'Ver nuestra invitación')), `guest-remind/${o.id}/${id}/${o.review_sent_at}`)) sent.push('couple:' + o.id + ':' + id);
      }
      // 30 días sin respuesta: se aprueba como si pulsaran «Aprobar» (el catálogo se entrega solo; a medida pide el resto).
      if (now - Date.parse(o.review_sent_at) >= AUTO_APPROVE_DAYS * D) {
        const j = await flowCall({ action: 'review_respond', token: await capability(o.id, 'r'), decision: 'approve' });
        if (j?.ok) { sent.push('auto-approve:' + o.id); await send(OWNER, `Aprobada sola (30 días) · ${label(o)}`, ownerMail('Aprobada sola', 'Pasaron 30 días sin respuesta.', mP(`<b>${esc(label(o))}</b> no contestó a su propuesta en 30 días, así que se ha dado por aprobada${o.custom_request_id ? ' y les ha llegado el pago del resto' : ' y se ha entregado'}.`)), `guest-auto-approve/${o.id}`); }
        else console.error('auto_approve_failed', o.id, j?.error);
      }
    }
    // Pidieron un cambio, se les abrió el cuestionario y no lo han enviado.
    if (o.status === 'changes_requested') {
      const reqs = Array.isArray(o.revision_requests) ? o.revision_requests : [], lastAt = Date.parse(reqs[reqs.length - 1]?.at || o.updated_at);
      const m = String(reqs[reqs.length - 1]?.note || '').match(/^Parte: (.+)$/m), part = m ? ['La portada', 'Vuestra historia', 'Lugares y programa', 'Detalles prácticos', 'Confirmación y final'].indexOf(m[1].trim()) : -1;
      for (const [t, id, title, text] of [
        [lastAt + 2 * D, 'c2d', 'Vuestro cambio está a medias.', 'Abristeis la parte que queríais cambiar, pero aún no nos ha llegado. Cambiad lo que necesitéis y pulsad «Enviar los cambios»: os mandamos la versión nueva para revisar.'],
        [lastAt + 6 * D, 'c6d', '¿Os ayudamos con el cambio?', 'Seguimos esperando vuestro cambio para terminar la invitación. Si os resulta más fácil, respondednos a este email con lo que queréis cambiar y lo hacemos nosotros.']
      ] as [number, string, string, string][]) {
        if (!crossed(t, now)) continue;
        const link = APP_ORIGIN + '/guest/catalog-questionnaire.html?t=' + encodeURIComponent(await capability(o.id, 'q')) + (part >= 0 ? '&parte=' + part : '');
        if (await send(to, title.replace(/\.$/, ''), mail('Recordatorio', title, mP(esc(text)) + button(link, 'Hacer el cambio')), `guest-remind/${o.id}/${id}/${lastAt}`)) sent.push('couple:' + o.id + ':' + id);
      }
    }
    // 3. Opinión a los 7 días de la entrega.
    if (o.status === 'delivered' && o.delivered_at && crossed(Date.parse(o.delivered_at) + 7 * D, now)) {
      const html = mail('Una cosa más', '¿Qué tal la están recibiendo vuestros invitados?', mP(`Esperamos que estéis disfrutando de vuestra invitación${names(o) ? ', ' + esc(names(o)) : ''}.`)
        + mP('Si os ha gustado, nos ayudaría muchísimo que nos contarais qué os ha parecido respondiendo a este email, en dos líneas. Con vuestro permiso, la compartiremos para que otras parejas nos conozcan.')
        + mP('Y si la publicáis en Instagram o TikTok, etiquetadnos en <b>@weddlysmartdesign</b>: nos hace mucha ilusión verla en vuestras manos.') + button('https://www.instagram.com/weddlysmartdesign', 'Ir a nuestro Instagram'));
      if (await send(to, '¿Qué tal vuestra invitación?', html, `guest-review-ask/${o.id}`)) sent.push('opinion:' + o.id);
    }
  }

  // 4. Facturas de las compras nuevas.
  const paid = all.filter((o: any) => o.checkout_session_id && Date.parse(o.created_at) >= AUTOMATION_SINCE);
  if (paid.length) {
    const { data: have } = await c.from('guest_invoices').select('order_id').eq('kind', 'invoice').in('order_id', paid.map((o: any) => o.id));
    const done = new Set((have || []).map((x: any) => x.order_id));
    for (const o of paid.filter((o: any) => !done.has(o.id))) {
      try {
        const inv = await issueInvoice(c, o);
        sent.push('invoice:' + inv.number);
        if (canWriteCouple(o)) await send([emailOf(o)], `Vuestra factura ${inv.number}`, mail('Factura ' + inv.number, 'Vuestra factura.', mP(`Aquí tenéis la factura de vuestra invitación: <b>${esc(euros(inv.total_cents))}</b>, IVA incluido. Desde el enlace podéis guardarla en PDF.`) + button(await invoiceUrl(inv.id), 'Ver la factura')), `guest-invoice-mail/${inv.id}`);
      } catch (e) { console.error('invoice_failed', o.id, e); }
    }
  }

  // 5. Resumen de la mañana (y de la semana los lunes).
  const d = new Date(now);
  if (d.getUTCHours() === MORNING_UTC) {
    open.sort((a, b) => a.d.due - b.d.due);
    let ret = { purged: [] as string[], soon: [] as string[] };
    try { ret = await retention(c, now); } catch (e) { console.error('retention_failed', e); }
    const stale = all.filter((o: any) => o.status === 'draft' && now - Date.parse(o.created_at) > 3 * D && Date.parse(o.created_at) >= AUTOMATION_SINCE);
    let body = '';
    if (open.length) body += mList(open.map(({ o, d }) => `<b>${esc(label(o))}</b>${o.mode === 'test' ? ' (prueba)' : ''}: ${esc(d.what.toLowerCase())}.<br><span style="font-size:15px;color:${d.due - now < 12 * H ? '#b3263a' : '#4a5480'}">Antes del ${esc(when(d.due))} · ${esc(left(d.due - now))}</span>`));
    if (stale.length) body += mP('<b>Sin rellenar el cuestionario desde hace más de 3 días</b> (ya les ha llegado un recordatorio):') + mList(stale.map((o: any) => `${esc(o.buyer_email || label(o))}<br><span style="font-size:15px;color:#4a5480">Compró el ${esc(when(Date.parse(o.created_at)))}</span>`));
    // Pedidos parados en manos de la pareja: a partir de aquí conviene escribirles tú.
    const stuck = all.filter((o: any) => Date.parse(o.created_at) >= AUTOMATION_SINCE && ((o.status === 'review_sent' && now - Date.parse(o.review_sent_at) > 10 * D) || (o.status === 'changes_requested' && now - Date.parse(o.updated_at) > 8 * D)));
    if (stuck.length) body += mP('<b>Parados desde hace días</b> (ya les han llegado dos recordatorios; mejor un WhatsApp):') + mList(stuck.map((o: any) => `${esc(label(o))}<br><span style="font-size:15px;color:#4a5480">${o.status === 'review_sent' ? 'Sin aprobar su invitación' : 'Sin enviar su cambio'}</span>`));
    // Bodas que se acercan sin la invitación entregada.
    const soon = all.filter((o: any) => { const w = Date.parse((o.questionnaire?.couple?.date || '') + 'T12:00:00Z'); return o.mode === 'production' && o.status !== 'delivered' && w && w - now < 45 * D && w > now; });
    if (soon.length) body += mP('<b>Bodas en menos de 45 días sin la invitación entregada:</b>') + mList(soon.map((o: any) => `<b>${esc(label(o))}</b><br><span style="font-size:15px;color:#b3263a">Boda el ${esc(new Date(o.questionnaire.couple.date + 'T12:00:00Z').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }))}</span>`));
    if (ret.soon.length) body += mP('<b>Dentro de 7 días se borran sus datos y fotos</b> (lo promete la política de privacidad, 120 días después de la boda). Si quieres guardar algo, hazlo antes:') + mList(ret.soon.map((x) => esc(x)));
    if (ret.purged.length) body += mP('<b>Datos borrados hoy</b> (boda de hace más de 120 días; las facturas se conservan):') + mList(ret.purged.map((x) => esc(x)));
    const monday = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Madrid' })).getDay() === 1;
    if (monday) {
      try { if (await backup(c, d)) sent.push('backup'); } catch (e) { console.error('backup_failed', e); }
      const s = (await stats(c)).live;
      body += mNote(`<b>La semana pasada:</b> ${s.lastWeek.sales} ${s.lastWeek.sales === 1 ? 'venta' : 'ventas'} · ${esc(euros(s.lastWeek.cents))}${s.lastWeek.refunds ? ` · ${s.lastWeek.refunds} ${s.lastWeek.refunds === 1 ? 'devolución' : 'devoluciones'}` : ''}<br><b>Este mes:</b> ${s.month.sales} ${s.month.sales === 1 ? 'venta' : 'ventas'} · ${esc(euros(s.month.cents))}${s.designs.length ? `<br><b>El más vendido:</b> ${esc(s.designs[0][0])}` : ''}`);
    }
    if (body) {
      const title = open.length ? `Hoy tienes ${open.length} ${open.length === 1 ? 'pendiente' : 'pendientes'}.` : monday ? 'Tu semana en GUEST.' : 'Nada urgente hoy.';
      if (await send(OWNER, open.length ? `Pedidos de hoy: ${open.length} ${open.length === 1 ? 'pendiente' : 'pendientes'}` : monday ? 'Resumen de la semana' : 'Pedidos de hoy', ownerMail(monday ? 'Tu semana' : 'Buenos días', title, body), `guest-digest/${d.toISOString().slice(0, 10)}`, 'GUEST · Pedidos')) sent.push('digest');
    }
  }
  return { open: open.length, sent };
}

/* ---------- Copia de seguridad semanal ---------- */
// El plan gratis no guarda copias: cada lunes, pedidos, solicitudes a medida y facturas en CSV a tu email.
const csv = (rows: any[]) => { if (!rows.length) return ''; const cols = Object.keys(rows[0]); const q = (v: any) => { const t = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",\n;]/.test(t) ? '"' + t.replaceAll('"', '""') + '"' : t; }; return [cols.join(','), ...rows.map((r) => cols.map((k) => q(r[k])).join(','))].join('\n'); };
const b64 = (t: string) => { const bytes = new TextEncoder().encode('\ufeff' + t); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(bin); };
async function backup(c: any, d: Date) {
  const [o, r, i] = await Promise.all([
    c.from('guest_invitation_orders').select('id,mode,status,template_id,buyer_email,questionnaire,style_overrides,revision_count,extra_changes,design_changes,custom_request_id,checkout_session_id,license_id,delivery_url,created_at,submitted_at,review_sent_at,approved_at,delivered_at,purged_at').order('created_at').limit(5000),
    c.from('guest_custom_requests').select('id,mode,status,tier,base_design,name,email,phone,idea,wedding_date,quote_cents,credit_cents,extras,deposit_paid_at,final_paid_at,order_id,from_order_id,created_at,delivered_at,refunded_at').order('created_at').limit(5000),
    c.from('guest_invoices').select('*').order('created_at').limit(10000)
  ]);
  const day = d.toISOString().slice(0, 10), apiKey = String(Deno.env.get('RESEND_API_KEY') || '').trim(), raw = String(Deno.env.get('WEDDLY_RESEND_FROM') || '').trim();
  const m = raw.match(/<([^>]+)>/), addr = (m?.[1] || (/^[^\s<>]+@[^\s<>]+$/.test(raw) ? raw : '')).trim();
  if (!apiKey || !addr) return false;
  const attachments = [['pedidos', o.data], ['a-medida', r.data], ['facturas', i.data]].map(([n, rows]: any) => ({ filename: `guest-${n}-${day}.csv`, content: b64(csv(rows || [])) }));
  const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey, 'Idempotency-Key': 'guest-backup/' + day },
    body: JSON.stringify({ from: 'GUEST by WeddlySmartDesign <' + addr + '>', to: OWNER, subject: 'Copia de seguridad semanal · ' + day, html: ownerMail('Copia de seguridad', 'Tu copia de la semana.', mP(`Adjuntos: ${(o.data || []).length} pedidos, ${(r.data || []).length} solicitudes a medida y ${(i.data || []).length} facturas, en CSV (se abren con Excel). Guarda este email: si algún día falla el sistema, con esto se recupera todo.`)), attachments }) });
  if (!res.ok) console.warn('backup_mail_failed', res.status, await res.text());
  return res.ok;
}

/* ---------- Entrada ---------- */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  const c = db();
  let b: any = {}; try { b = JSON.parse((await req.text()) || '{}'); } catch { return json({ ok: false, error: 'invalid_json' }, 400); }
  const action = String(b.action || 'tick');
  try {
    if (action === 'tick') return json({ ok: true, ...(await tick(c)) });

    if (action === 'invoice') {
      const [id, sig] = String(b.token || '').split('.');
      if (!/^[0-9a-f-]{36}$/.test(id || '') || !sig || (await invoiceToken(id)) !== b.token) return json({ ok: false, error: 'invalid_token' }, 403);
      const { data: inv } = await c.from('guest_invoices').select('*').eq('id', id).maybeSingle();
      if (!inv) return json({ ok: false, error: 'not_found' }, 404);
      let rectifies = null;
      if (inv.rectifies) { const { data: r } = await c.from('guest_invoices').select('number,issued_at').eq('id', inv.rectifies).maybeSingle(); rectifies = r; }
      return json({ ok: true, issuer: ISSUER, invoice: { number: inv.number, kind: inv.kind, test: inv.mode === 'test', issuedAt: inv.issued_at, buyerTaxId: inv.buyer_tax_id || null, buyerName: inv.buyer_name, buyerEmail: inv.buyer_email, concept: inv.concept, totalCents: inv.total_cents, baseCents: inv.base_cents, vatCents: inv.vat_cents, vatRate: Number(inv.vat_rate), hash: inv.hash, rectifies } });
    }

    if (!(await managerOk(c, req))) return json({ ok: false, error: 'manager_required' }, 403);

    if (action === 'stats') return json({ ok: true, ...(await stats(c)) });

    if (action === 'invoices') {
      const oid = String(b.orderId || ''); if (!/^[0-9a-f-]{36}$/.test(oid)) return json({ ok: false, error: 'invalid_order' }, 400);
      const { data } = await c.from('guest_invoices').select('id,number,kind,total_cents,issued_at').or(`order_id.eq.${oid},extra_for_order.eq.${oid}`).order('issued_at');
      return json({ ok: true, invoices: await Promise.all((data || []).map(async (x: any) => ({ number: x.number, kind: x.kind, totalCents: x.total_cents, issuedAt: x.issued_at, url: await invoiceUrl(x.id) }))) });
    }

    // Libro de facturas: todas, para verlas juntas y pasarlas a la gestoría.
    if (action === 'invoice_book') {
      const { data, error } = await c.from('guest_invoices').select('id,number,kind,mode,issued_at,buyer_name,buyer_email,concept,base_cents,vat_cents,vat_rate,total_cents,rectifies').order('issued_at', { ascending: false }).limit(5000);
      if (error) throw error;
      const num = new Map((data || []).map((x: any) => [x.id, x.number]));
      return json({ ok: true, invoices: await Promise.all((data || []).map(async (x: any) => ({ number: x.number, kind: x.kind, test: x.mode === 'test', issuedAt: x.issued_at, buyerName: x.buyer_name, buyerEmail: x.buyer_email, concept: x.concept, baseCents: x.base_cents, vatCents: x.vat_cents, vatRate: Number(x.vat_rate), totalCents: x.total_cents, rectifies: x.rectifies ? num.get(x.rectifies) || null : null, url: await invoiceUrl(x.id) }))) });
    }

    if (action === 'refund') {
      const { data: o } = await c.from('guest_invitation_orders').select('*').eq('id', String(b.orderId || '')).maybeSingle();
      if (!o) return json({ ok: false, error: 'order_not_found' }, 404);
      if (o.status === 'cancelled') return json({ ok: false, error: 'already_refunded' }, 409);
      if (o.status === 'delivered') return json({ ok: false, error: 'already_delivered' }, 409);
      if (!o.checkout_session_id) return json({ ok: false, error: 'not_paid_online' }, 409);
      const s = await stripe('checkout/sessions/' + encodeURIComponent(o.checkout_session_id), o.checkout_session_id);
      if (!s.payment_intent) return json({ ok: false, error: 'no_payment' }, 409);
      const refund = await stripe('refunds', o.checkout_session_id, { method: 'POST', headers: { 'Idempotency-Key': 'guest-refund-' + o.id }, body: new URLSearchParams({ payment_intent: s.payment_intent, 'metadata[guest_order]': o.id }) });
      const ts = new Date().toISOString();
      await c.from('guest_invitation_orders').update({ status: 'cancelled', owner_notes: [o.owner_notes, `Devuelto ${ts} (${refund.id})`].filter(Boolean).join('\n'), updated_at: ts }).eq('id', o.id);
      if (o.license_id) await c.from('licenses').update({ status: 'inactive', updated_at: ts }).eq('id', o.license_id).eq('status', 'active');
      // Factura rectificativa si había factura.
      let original: any = (await c.from('guest_invoices').select('*').eq('order_id', o.id).eq('kind', 'invoice').maybeSingle()).data;
      if (!original) { try { original = await issueInvoice(c, o); } catch (e) { console.error('invoice_before_refund', e); } }
      let rect: any = null;
      if (original) {
        const { data, error } = await c.rpc('guest_issue_invoice', { p_order: o.id, p_kind: 'rectificative', p_mode: original.mode, p_email: original.buyer_email, p_name: original.buyer_name, p_concept: 'Devolución de ' + original.concept.charAt(0).toLowerCase() + original.concept.slice(1), p_total_cents: -Math.abs(Number(refund.amount || original.total_cents)), p_stripe_ref: refund.id, p_rectifies: original.id });
        if (error) console.error('rectificative_failed', error); else rect = data;
      }
      if (canWriteCouple(o)) await send([emailOf(o)], 'Devolución realizada', mail('Devolución', 'Os hemos devuelto el importe.', mP(`Hemos hecho la devolución de <b>${esc(euros(Number(refund.amount || PRICE_CENTS)))}</b> a la misma tarjeta con la que pagasteis. Según el banco, suele verse en 5 a 10 días.`) + (rect ? mP('Aquí tenéis la factura de la devolución:') + button(await invoiceUrl(rect.id), 'Ver la factura') : '') + mP('Sentimos que esta vez no haya sido. Si en el futuro necesitáis algo, aquí estaremos.', true)), `guest-refund-mail/${o.id}`);
      return json({ ok: true, status: 'cancelled', refundId: refund.id, amountCents: refund.amount, rectificative: rect?.number || null });
    }
    return json({ ok: false, error: 'invalid_action' }, 400);
  } catch (e) {
    console.error(e);
    const m = String((e as Error)?.message || '');
    return json({ ok: false, error: m.startsWith('stripe_') ? m : 'server_error' }, m.startsWith('stripe_') ? 502 : 500);
  }
});
