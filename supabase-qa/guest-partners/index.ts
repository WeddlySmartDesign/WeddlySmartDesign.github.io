// Colaboradores de GUEST (proveedores que recomiendan las invitaciones bajo comisión).
// - action 'portal' (público, con el token secreto del colaborador): sus ventas, comisión y pagos. Sin datos de las parejas.
// - Con la sesión de propietaria (x-weddly-manager): 'list' | 'create' | 'update' | 'mark_paid' | 'rotate'.
// Las ventas salen de los pedidos reales (Stripe): licencia con guest_ref_partner (enlace ?c=) o código de socio (guest_promo_partner).
import { createClient } from 'npm:@supabase/supabase-js@2';

const LIVE_ORIGIN = 'https://guest.weddlysmartdesign.com';
const DESIGNS: Record<string, string> = { 'design-09': 'Azahar', 'design-11': 'Cristal', 'design-07': 'Espejo', 'veil-light': 'Seda', 'design-12': 'Abanico', 'design-05': 'Gala', 'design-06': 'Invernadero', 'design-08': 'Melodía', 'design-10': 'Cuento', 'botanica': 'Botánica', 'design-16': 'Rumbo', 'design-04': 'Brisa', 'design-13': 'Viñeta', 'design-14': 'Ellas', 'design-15': 'Ellos' };
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, x-weddly-manager', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const secretKey = () => { const x = Deno.env.get('SUPABASE_SECRET_KEYS'); return x ? JSON.parse(x).default : (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''); };
const db = () => createClient(Deno.env.get('SUPABASE_URL')!, secretKey(), { auth: { persistSession: false } });

/* ---------- Sesión de propietaria (igual que guest-automation) ---------- */
async function hmacHex(v: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secretKey()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(v));
  return Array.from(new Uint8Array(s)).map((x) => x.toString(16).padStart(2, '0')).join('');
}
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

/* ---------- Ventas de un colaborador ---------- */
const commissionOf = (p: any, cents: number) => p.fixed_cents != null ? Number(p.fixed_cents) : Math.round(cents * Number(p.pct) / 100);

async function salesOf(c: any, p: any) {
  const s = String(p.slug).replace(/[^a-z0-9-]/g, '');
  const { data: lic } = await c.from('licenses').select('id,status,metadata,created_at')
    .or(`metadata->>guest_ref_partner.eq.${s},metadata->>guest_promo_partner.eq.${s}`).limit(1000);
  const mine = (lic || []).filter((l: any) => {
    const m = l.metadata || {};
    if (m.guest_promo_partner && m.guest_promo_kind === 'partner' && m.guest_promo_partner !== p.slug) return false; // lo reclama el código de otro
    return m.guest_promo_partner === p.slug ? true : m.guest_ref_partner === p.slug;
  });
  const ids = mine.map((l: any) => l.id);
  const { data: ord } = ids.length ? await c.from('guest_invitation_orders').select('id,license_id,status,checkout_session_id,template_id,original_template_id,approved_at,delivered_at,created_at').in('license_id', ids) : { data: [] };
  const byLic = new Map((ord || []).map((o: any) => [o.license_id, o]));
  const { data: paidRows } = await c.from('guest_partner_paid').select('order_id,paid_at,cents').eq('partner_slug', p.slug);
  const paid = new Map((paidRows || []).map((r: any) => [r.order_id, r]));
  const real = (o: any) => String(o.checkout_session_id || '').startsWith('cs_live_') || (p.test && String(o.checkout_session_id || '').startsWith('cs_test_'));
  const sales: any[] = [], gifts: any[] = [];
  for (const l of mine) {
    const o: any = byLic.get(l.id); if (!o || !real(o)) continue;
    const m = l.metadata || {}, total = Number(m.amount_total || 0);
    const at = m.purchased_at || o.created_at, design = DESIGNS[o.original_template_id || o.template_id] || 'Invitación';
    if (m.guest_promo_kind === 'gift' || total <= 0) { if (m.guest_promo_partner === p.slug) gifts.push({ at, design }); continue; }
    const refunded = l.status === 'cancelled';
    const pay: any = paid.get(o.id);
    const state = refunded ? 'devuelta' : pay ? 'pagada' : (o.approved_at || o.delivered_at) ? 'confirmada' : 'proceso';
    sales.push({ orderId: o.id, at, design, paidCents: total, commissionCents: refunded ? 0 : commissionOf(p, total), state, paidAt: pay?.paid_at || null });
  }
  sales.sort((a, b) => Date.parse(a.at) - Date.parse(b.at)); sales.forEach((x, i) => x.n = i + 1);
  gifts.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const sum = (st: string) => sales.filter((x) => x.state === st).reduce((a, x) => a + x.commissionCents, 0);
  return { sales, gifts, totals: { processing: sum('proceso'), confirmed: sum('confirmada'), paid: sum('pagada') } };
}

const terms = (p: any) => p.fixed_cents != null ? { kind: 'fixed', cents: p.fixed_cents } : { kind: 'pct', pct: Number(p.pct) };
const portalUrl = (p: any) => `${LIVE_ORIGIN}/colaborador.html#k=${p.token}`;

async function codesOf(c: any, slug: string) {
  const { data } = await c.from('guest_partner_codes').select('kind,code').eq('partner_slug', slug).eq('mode', 'live');
  return { partner: (data || []).find((x: any) => x.kind === 'partner')?.code || null, gift: (data || []).filter((x: any) => x.kind === 'gift').map((x: any) => x.code) };
}

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
const codeBase = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 14) || 'COLAB';
const newToken = () => { const b = crypto.getRandomValues(new Uint8Array(18)); return btoa(String.fromCharCode(...b)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, ''); };


/* Alta de un colaborador (la usan el panel de la propietaria y el botón de la página de profesionales). */
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
async function addPartner(c: any, o: { name: string; slug?: string; email?: string | null; pct?: number; fixed?: number | null; test?: boolean; note?: string | null; noCodes?: boolean }) {
  const name = o.name.trim().slice(0, 80), fixed = o.fixed ?? null, pct = o.pct ?? 15;
  let slug = slugify(o.slug || '');
  if (!slug) {
    // Si ya tiene códigos creados (p. ej. por la campaña de mensajes), se reutiliza su identificador para que sus ventas cuenten.
    const { data: rows } = await c.from('guest_partner_codes').select('partner_slug,partner_name').eq('mode', 'live').limit(2000);
    const hit = (rows || []).find((r: any) => r.partner_name && norm(r.partner_name) === norm(name) && !String(r.partner_slug).startsWith('etsy'));
    slug = hit ? hit.partner_slug : slugify(name) || 'colaborador';
  }
  const base = slug;
  if ((await c.from('guest_partners').select('slug').eq('slug', slug).maybeSingle()).data) {
    if (o.slug) return { exists: true as const };
    for (let i = 2; (await c.from('guest_partners').select('slug').eq('slug', slug).maybeSingle()).data; i++) slug = base + '-' + i;
  }
  const p = { slug, name, email: o.email || null, token: newToken(), pct, fixed_cents: fixed, test: !!o.test, note: o.note || null };
  const { error } = await c.from('guest_partners').insert(p);
  if (error) throw new Error('insert_failed: ' + error.message);
  let codes = await codesOf(c, slug);
  if (!p.test && !o.noCodes && fixed == null && !codes.partner) {
    const code = codeBase(name) + '10';
    const taken = (await c.from('guest_partner_codes').select('code').eq('code', code).maybeSingle()).data;
    const ins = await c.from('guest_partner_codes').insert({ mode: 'live', kind: 'partner', code: taken ? code.slice(0, 11) + String(10 + Math.floor(Math.random() * 90)) : code, partner_slug: slug, partner_name: name });
    if (!ins.error) {
      const r = await fetch(Deno.env.get('SUPABASE_URL') + '/functions/v1/guest-order-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'promo_sync' }) });
      if (!r.ok) console.warn('promo_sync', r.status, await r.text());
      codes = await codesOf(c, slug);
    } else console.warn('partner_code', ins.error.message);
  }
  return { exists: false as const, p, codes };
}
const outPartner = (p: any, codes: any) => ({ slug: p.slug, name: p.name, terms: terms(p), panel: portalUrl(p), link: `${LIVE_ORIGIN}/?c=${p.slug}`, codes });
async function ping(c: any, title: string, body: string, dedupe: string) {
  try { await c.from('guest_owner_events').insert({ title, body, url: '/guest/panel-pruebas.html#/colaboradores', test: false, dedupe }); } catch (e) { console.warn('ping', e); }
}


/* ---------- Resumen mensual (lo llama pg_cron el día 1) ---------- */
const euros = (c: number) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const esc = (x: unknown) => String(x ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]!));
const mailHtml = (title: string, body: string) => `<div style="background:#f0c4bc;padding:24px 12px"><div style="max-width:520px;margin:0 auto;background:#fbf7f4;border-radius:8px;padding:28px 24px;font:400 16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;color:#1b2650"><p style="margin:0 0 6px;font:700 20px/1 Georgia,serif;letter-spacing:.02em">GUEST</p><h1 style="margin:14px 0 14px;font:400 24px/1.2 Georgia,serif">${esc(title)}</h1>${body}<p style="margin:22px 0 0;font-size:13px;color:#4a5480">GUEST by WeddlySmartDesign</p></div></div>`;
async function sendMail(to: string[], subject: string, html: string, idem: string) {
  const apiKey = String(Deno.env.get('RESEND_API_KEY') || '').trim(), raw = String(Deno.env.get('WEDDLY_RESEND_FROM') || '').trim();
  const m = raw.match(/<([^>]+)>/), addr = (m?.[1] || (/^[^\s<>]+@[^\s<>]+$/.test(raw) ? raw : '')).trim();
  if (!apiKey || !addr) return false;
  const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey, 'Idempotency-Key': idem },
    body: JSON.stringify({ from: 'GUEST by WeddlySmartDesign <' + addr + '>', to, subject, html }) });
  if (!res.ok) console.warn('mail_failed', res.status, await res.text());
  return res.ok;
}
async function monthly(c: any, now = new Date()) {
  const madrid = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
  const prev = new Date(madrid.getFullYear(), madrid.getMonth() - 1, 1);
  const key = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
  const monthName = prev.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const inMonth = (t: string) => { const d = new Date(new Date(t).toLocaleString('en-US', { timeZone: 'Europe/Madrid' })); return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth(); };
  // Una sola vez por mes aunque alguien llame a la función de nuevo.
  const flag = 'partner-monthly-' + key;
  if ((await c.from('guest_owner_settings').select('key').eq('key', flag).maybeSingle()).data) return { month: key, skipped: true };
  const { data: ps } = await c.from('guest_partners').select('*').eq('active', true).eq('test', false);
  const due: string[] = []; let sent = 0, totalDue = 0;
  for (const p of ps || []) {
    const r = await salesOf(c, p), t = r.totals, mine = r.sales.filter((x) => inMonth(x.at));
    if (t.confirmed > 0) { due.push(`<li>${esc(p.name)}: <b>${euros(t.confirmed)}</b></li>`); totalDue += t.confirmed; }
    if (p.email && (mine.length || t.confirmed > 0)) {
      const body = `<p style="margin:0 0 14px">Este es tu resumen de ${esc(monthName)}.</p><p style="margin:0 0 14px">Ventas del mes por tu recomendación: <b>${mine.length}</b>.<br>Pendiente de pago (ya confirmado): <b>${euros(t.confirmed)}</b>.<br>Por confirmar: <b>${euros(t.processing)}</b>.<br>Ya pagado: <b>${euros(t.paid)}</b>.</p>${t.confirmed > 0 ? '<p style="margin:0 0 14px">En los próximos días te hacemos el pago de lo pendiente.</p>' : ''}<p style="margin:0 0 6px"><a href="${portalUrl(p)}" style="display:inline-block;background:#1b2650;color:#fbf7f4;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:600">Ver mi panel</a></p>`;
      if (await sendMail([p.email], 'Tu resumen de ' + monthName + ' · GUEST', mailHtml('Tu resumen de ' + monthName, body), `guest-partner-monthly/${p.slug}/${key}`)) sent++;
    }
  }
  if (due.length) await sendMail(['weddlysmartdesign@gmail.com'], 'Colaboradores a pagar este mes · ' + euros(totalDue), mailHtml('A quién pagar este mes', `<p style="margin:0 0 10px">Lo confirmado y pendiente de pago, por colaborador:</p><ul style="margin:0 0 14px;padding-left:18px">${due.join('')}</ul><p style="margin:0">Haz la transferencia o el Bizum y, en tu panel de pedidos, pestaña Colaboradores, pulsa «Marcar pagado».</p>`), 'guest-partner-owner-monthly/' + key);
  await c.from('guest_owner_settings').upsert({ key: flag, value: { at: now.toISOString(), sent, owed: totalDue } }, { onConflict: 'key', ignoreDuplicates: true });
  return { month: key, partnersMailed: sent, owed: totalDue };
}

/* ---------- Entrada ---------- */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  const c = db();
  let b: any = {}; try { b = JSON.parse((await req.text()) || '{}'); } catch { return json({ ok: false, error: 'invalid_json' }, 400); }
  const action = String(b.action || '');
  try {
    if (action === 'claim') {
      // Botón «Quiero recomendar GUEST»: quien entra desde un enlace de la campaña (?c=<identificador>) crea su panel con un toque.
      const ref = slugify(String(b.ref || '')).slice(0, 60), name = String(b.name || '').trim().slice(0, 80);
      if (!ref || name.length < 2) return json({ ok: false, error: 'invalid' }, 400);
      if (/^(etsy|prueba)/.test(ref)) return json({ ok: false, error: 'invalid' }, 400);
      // Solo enlaces de la campaña (identificador dm-… o con códigos creados) y con tope por hora, para que nadie reparta altas falsas.
      const known = ref.startsWith('dm-') || (await c.from('guest_partner_codes').select('id').eq('partner_slug', ref).limit(1)).data?.length;
      if (!known) return json({ ok: false, error: 'unknown_ref' }, 403);
      const { count } = await c.from('guest_partners').select('slug', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 3600_000).toISOString());
      if ((count || 0) >= 15) return json({ ok: false, error: 'busy' }, 429);
      const r = await addPartner(c, { name, slug: ref });
      if (r.exists) return json({ ok: false, error: 'already_claimed' }, 409);
      await ping(c, 'Nuevo colaborador: ' + name, 'Se ha apuntado desde la página de profesionales. Ya tiene su panel.', 'guest-partner-claim/' + ref);
      return json({ ok: true, partner: outPartner(r.p, r.codes) });
    }

    if (action === 'monthly') return json({ ok: true, ...(await monthly(c)) });

    if (action === 'portal') {
      const k = String(b.token || '').trim();
      if (!/^[A-Za-z0-9_-]{20,40}$/.test(k)) return json({ ok: false, error: 'invalid_token' }, 403);
      const { data: p } = await c.from('guest_partners').select('*').eq('token', k).maybeSingle();
      if (!p || !p.active) return json({ ok: false, error: 'invalid_token' }, 403);
      const r = await salesOf(c, p), codes = await codesOf(c, p.slug);
      return json({ ok: true, name: p.name, terms: terms(p), link: `${LIVE_ORIGIN}/?c=${p.slug}`, code: codes.partner, test: !!p.test,
        sales: r.sales.map(({ orderId, ...x }) => x), gifts: r.gifts, totals: r.totals });
    }

    if (!(await managerOk(c, req))) return json({ ok: false, error: 'manager_required' }, 403);

    if (action === 'list') {
      const { data: ps } = await c.from('guest_partners').select('*').order('created_at', { ascending: false });
      const out = [];
      for (const p of ps || []) {
        const r = await salesOf(c, p);
        out.push({ slug: p.slug, name: p.name, email: p.email, active: p.active, test: p.test, note: p.note, terms: terms(p), panel: portalUrl(p), link: `${LIVE_ORIGIN}/?c=${p.slug}`,
          codes: await codesOf(c, p.slug), sales: r.sales.length, gifts: r.gifts.length, totals: r.totals });
      }
      return json({ ok: true, partners: out });
    }

    if (action === 'create') {
      const name = String(b.name || '').trim();
      if (name.length < 2) return json({ ok: false, error: 'name_required' }, 400);
      const fixed = b.fixed_cents != null && b.fixed_cents !== '' ? Math.round(Number(b.fixed_cents)) : null;
      if (fixed != null && !(fixed > 0 && fixed < 100000)) return json({ ok: false, error: 'invalid_fixed' }, 400);
      const pct = b.pct != null && b.pct !== '' ? Number(b.pct) : 15;
      if (!(pct > 0 && pct <= 50)) return json({ ok: false, error: 'invalid_pct' }, 400);
      const r = await addPartner(c, { name, slug: b.slug ? String(b.slug) : '', email: String(b.email || '').trim().toLowerCase() || null, pct, fixed, test: !!b.test, note: String(b.note || '').slice(0, 300) || null, noCodes: !!b.no_codes });
      if (r.exists) return json({ ok: false, error: 'already_exists' }, 409);
      return json({ ok: true, partner: outPartner(r.p, r.codes) });
    }

    if (action === 'update') {
      const slug = String(b.slug || ''), patch: any = {};
      if ('email' in b) patch.email = String(b.email || '').trim().toLowerCase() || null;
      if ('note' in b) patch.note = String(b.note || '').slice(0, 300) || null;
      if ('active' in b) patch.active = !!b.active;
      if ('pct' in b && b.pct !== '') { const v = Number(b.pct); if (!(v > 0 && v <= 50)) return json({ ok: false, error: 'invalid_pct' }, 400); patch.pct = v; patch.fixed_cents = null; }
      if ('fixed_cents' in b) { patch.fixed_cents = b.fixed_cents === null || b.fixed_cents === '' ? null : Math.round(Number(b.fixed_cents)); }
      const { error } = await c.from('guest_partners').update(patch).eq('slug', slug);
      return error ? json({ ok: false, error: 'update_failed' }, 500) : json({ ok: true });
    }

    if (action === 'rotate') {
      const token = newToken();
      const { data, error } = await c.from('guest_partners').update({ token }).eq('slug', String(b.slug || '')).select('slug,token').maybeSingle();
      return error || !data ? json({ ok: false, error: 'not_found' }, 404) : json({ ok: true, panel: portalUrl(data) });
    }

    if (action === 'mark_paid') {
      const slug = String(b.slug || '');
      const { data: p } = await c.from('guest_partners').select('*').eq('slug', slug).maybeSingle();
      if (!p) return json({ ok: false, error: 'not_found' }, 404);
      const r = await salesOf(c, p), due = r.sales.filter((x) => x.state === 'confirmada');
      if (!due.length) return json({ ok: true, paid: 0, cents: 0 });
      const note = String(b.note || '').slice(0, 200) || null;
      const { error } = await c.from('guest_partner_paid').insert(due.map((x) => ({ order_id: x.orderId, partner_slug: slug, cents: x.commissionCents, note })));
      if (error) return json({ ok: false, error: 'insert_failed', detail: error.message }, 500);
      return json({ ok: true, paid: due.length, cents: due.reduce((a, x) => a + x.commissionCents, 0) });
    }

    return json({ ok: false, error: 'unknown_action' }, 400);
  } catch (e) {
    console.error('guest-partners', e);
    return json({ ok: false, error: 'server_error' }, 500);
  }
});
