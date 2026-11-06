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

/* ---------- Entrada ---------- */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  const c = db();
  let b: any = {}; try { b = JSON.parse((await req.text()) || '{}'); } catch { return json({ ok: false, error: 'invalid_json' }, 400); }
  const action = String(b.action || '');
  try {
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
      const name = String(b.name || '').trim().slice(0, 80);
      if (name.length < 2) return json({ ok: false, error: 'name_required' }, 400);
      const fixed = b.fixed_cents != null && b.fixed_cents !== '' ? Math.round(Number(b.fixed_cents)) : null;
      if (fixed != null && !(fixed > 0 && fixed < 100000)) return json({ ok: false, error: 'invalid_fixed' }, 400);
      const pct = b.pct != null && b.pct !== '' ? Number(b.pct) : 15;
      if (!(pct > 0 && pct <= 50)) return json({ ok: false, error: 'invalid_pct' }, 400);
      let slug = slugify(String(b.slug || name)) || 'colaborador';
      for (let i = 2; (await c.from('guest_partners').select('slug').eq('slug', slug).maybeSingle()).data; i++) slug = slugify(name) + '-' + i;
      const p = { slug, name, email: String(b.email || '').trim().toLowerCase() || null, token: newToken(), pct, fixed_cents: fixed, test: !!b.test, note: String(b.note || '').slice(0, 300) || null };
      const { error } = await c.from('guest_partners').insert(p);
      if (error) return json({ ok: false, error: 'insert_failed', detail: error.message }, 500);
      let codes = await codesOf(c, slug);
      if (!p.test && !b.no_codes) {
        const base = codeBase(name), rows: any[] = [];
        if (fixed == null && !codes.partner) rows.push({ mode: 'live', kind: 'partner', code: base + '10', partner_slug: slug, partner_name: name });
        if (!codes.gift.length) rows.push({ mode: 'live', kind: 'gift', code: 'REGALO' + base + String(100 + Math.floor(Math.random() * 900)), partner_slug: slug, partner_name: name, max_redemptions: 1 });
        if (rows.length) {
          const ins = await c.from('guest_partner_codes').insert(rows);
          if (ins.error) return json({ ok: true, partner: { slug, panel: portalUrl(p) }, warning: 'codes_failed', detail: ins.error.message });
          // Crea los códigos en Stripe (mismo paso que se hacía a mano).
          const r = await fetch(Deno.env.get('SUPABASE_URL') + '/functions/v1/guest-order-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'promo_sync' }) });
          if (!r.ok) console.warn('promo_sync', r.status, await r.text());
          codes = await codesOf(c, slug);
        }
      }
      return json({ ok: true, partner: { slug, name, terms: terms(p), panel: portalUrl(p), link: `${LIVE_ORIGIN}/?c=${slug}`, codes } });
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
