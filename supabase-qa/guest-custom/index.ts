// Diseño a medida de GUEST: solicitud desde la web, presupuesto y cobro en dos partes.
// - multipart 'submit' (público): guarda la solicitud con sus fotos de inspiración y avisa.
// - 'pay' / 'pay_status' / 'quote_load' (público, con enlace firmado): la pareja paga la señal,
//   el resto o una ronda extra con Stripe Checkout; cada pago genera su factura.
// - 'list' | 'detail' | 'update' | 'quote' | 'final' | 'extra' | 'deliver' (sesión de propietaria): para la app de pedidos.
//   'deliver' crea el acceso a la app de invitados (licencia) y se lo manda a la pareja con la invitación.
// - 'tick' (pg_cron cada hora): registra pagos de quien cerró la página antes de volver, avisa a la
//   propietaria de su plazo de 48 h para presupuestar y recuerda a las parejas los pagos pendientes.
// COPIA DE PRUEBA: Stripe solo en modo test y emails a las parejas solo si son de la propietaria.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { guestMail, mBtn, mP, mSteps, mNote, mList, DESIGN_NAMES } from './guest-mail.ts';

const QA = true;
const APP_ORIGIN = 'https://guest-stripe-pago-2026-10-24.guest-invitaciones.pages.dev';
const OWNER = ['weddlysmartdesign@gmail.com'];
const OWNER_EMAILS = ['weddlysmartdesign@gmail.com', 'pilarrodriguezbonilla@gmail.com', 'info@weddlysmartdesign.com'];
// Condiciones del diseño a medida (guest-legal.html, apartado 5).
export const TIERS: Record<string, { name: string; cents: number; what: string }> = {
  adapt: { name: 'Adaptación', cents: 12000, what: 'Uno de nuestros diseños adaptado a vuestra boda: colores, tipografías y un detalle propio.' },
  cover: { name: 'Portada propia', cents: 18000, what: 'Una portada nueva con ilustración propia sobre uno de nuestros diseños.' },
  new: { name: 'Diseño nuevo', cents: 25000, what: 'Un diseño completamente nuevo, con su propia apertura y su propio cierre.' },
  unsure: { name: 'Por decidir', cents: 12000, what: 'Nos contáis la idea y os aconsejamos el nivel que encaja.' }
};
const ROUNDS = 2, EXTRA_CENTS = 2000;
const WISHES = ['Colores', 'Tipografía', 'Ilustración de portada', 'Apertura animada', 'Fotos', 'Secciones nuevas', 'Bilingüe', 'Otra cosa'];
const H = 3600_000, D = 24 * H, QUOTE_DUE = 48 * H;
// Solo avisa de lo que cruza la última hora: la tarea corre cada hora y no guarda estado.
// Ventana de 3 h por si falla una pasada; la clave de idempotencia de Resend evita duplicados.
const crossed = (t: number, now: number) => t > now - 3 * H && t <= now;
const site = () => String(Deno.env.get('WEDDLY_SITE_ORIGIN') || 'https://weddlysmartdesign.github.io').replace(/\/$/, '');
const URGENCY: Record<string, string> = { normal: 'Sin prisa', soon: 'En unas semanas', urgent: 'Lo antes posible' };

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, x-weddly-manager', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
const secretKey = () => { const x = Deno.env.get('SUPABASE_SECRET_KEYS'); return x ? JSON.parse(x).default : (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''); };
const db = () => createClient(Deno.env.get('SUPABASE_URL')!, secretKey(), { auth: { persistSession: false } });
const txt = (v: unknown, max = 500) => String(v ?? '').trim().slice(0, max);
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const euros = (c: number) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const day = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
const first = (name: string) => txt(name, 80).split(/\s+/)[0] || '';
const deposit = (r: any) => Math.round(Number(r.quote_cents || 0) / 2);
const rest = (r: any) => Number(r.quote_cents || 0) - deposit(r);
const tierName = (r: any) => TIERS[r.tier]?.name || 'A medida';

async function hmacHex(v: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secretKey()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(v));
  return Array.from(new Uint8Array(s)).map((x) => x.toString(16).padStart(2, '0')).join('');
}
// Enlace de la pareja para ver el presupuesto y pagar.
const coupleToken = async (id: string) => 'gc1_' + id + '_' + (await hmacHex('guest-custom-v1|' + id)).slice(0, 40);
async function fromToken(c: any, t: string) {
  const m = String(t || '').match(/^gc1_([0-9a-f-]{36})_([0-9a-f]{40})$/);
  if (!m || (await coupleToken(m[1])) !== t) return null;
  const { data } = await c.from('guest_custom_requests').select('*').eq('id', m[1]).maybeSingle();
  return data;
}
const payUrl = async (r: any) => APP_ORIGIN + '/a-medida.html?p=' + encodeURIComponent(await coupleToken(r.id));
// Mismo enlace firmado que guest-automation para guest/factura.html.
const invoiceUrl = async (id: string) => APP_ORIGIN + '/guest/factura.html?f=' + encodeURIComponent(id + '.' + (await hmacHex('guest-invoice-v1|' + id)).slice(0, 32));

async function send(to: string[], subject: string, html: string, key: string) {
  const list = to.map((x) => x.toLowerCase()).filter((x) => !QA || OWNER_EMAILS.includes(x));
  const apiKey = txt(Deno.env.get('RESEND_API_KEY')), raw = txt(Deno.env.get('WEDDLY_RESEND_FROM'));
  const m = raw.match(/<([^>]+)>/), addr = (m?.[1] || (/^[^\s<>]+@[^\s<>]+$/.test(raw) ? raw : '')).trim();
  if (!apiKey || !addr || !list.length) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey, 'Idempotency-Key': key },
    body: JSON.stringify({ from: 'GUEST by WeddlySmartDesign <' + addr + '>', to: list, reply_to: 'info@weddlysmartdesign.com', subject: (QA ? '[PRUEBA] ' : '') + subject, html })
  });
  if (!r.ok) console.warn('resend_failed', r.status, await r.text());
  return r.ok;
}
const toCouple = (r: any, subject: string, html: string, key: string) => send([r.email], subject, html, key);
const toOwner = (subject: string, kicker: string, title: string, body: string, key: string) =>
  send(OWNER, subject, guestMail({ owner: true, kicker, title, preheader: title, body: body + mBtn(APP_ORIGIN + '/guest/panel-pruebas.html#/medida', 'Abrir mis pedidos') }), key);

/* ---------- Stripe ---------- */
function stripeKey() { return txt(Deno.env.get(QA ? 'GUEST_STRIPE_TEST_SECRET_KEY' : 'STRIPE_SECRET_KEY')); }
async function stripe(path: string, init: RequestInit = {}) {
  const key = stripeKey();
  if (!key || (QA && !key.startsWith('sk_test_'))) throw Error('stripe_key_missing');
  const r = await fetch('https://api.stripe.com/v1/' + path, { ...init, headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded', ...(init.headers || {}) } });
  const j = await r.json();
  if (!r.ok) throw Error('stripe_' + (j?.error?.code || r.status));
  return j;
}
function partOf(r: any): { part: string; cents: number; label: string } | null {
  if (r.status === 'quoted') return { part: 'deposit', cents: deposit(r), label: 'Señal del 50 %' };
  if (r.status === 'final_sent') return { part: 'final', cents: rest(r), label: 'Resto del 50 %' };
  return null;
}
async function checkout(r: any, part: string, cents: number, label: string) {
  const t = await coupleToken(r.id), p = new URLSearchParams();
  p.set('mode', 'payment'); p.set('locale', 'es'); p.set('submit_type', 'pay');
  p.set('customer_email', r.email);
  p.set('success_url', APP_ORIGIN + '/a-medida.html?p=' + encodeURIComponent(t) + '&s={CHECKOUT_SESSION_ID}');
  p.set('cancel_url', APP_ORIGIN + '/a-medida.html?p=' + encodeURIComponent(t));
  p.set('line_items[0][quantity]', '1'); p.set('line_items[0][price_data][currency]', 'eur');
  p.set('line_items[0][price_data][unit_amount]', String(cents));
  p.set('line_items[0][price_data][product_data][name]', `Invitación a medida · ${tierName(r)} · ${label}`);
  p.set('metadata[product]', 'guest_custom'); p.set('metadata[custom_request]', r.id); p.set('metadata[part]', part);
  p.set('payment_intent_data[metadata][custom_request]', r.id); p.set('payment_intent_data[metadata][part]', part);
  return await stripe('checkout/sessions', { method: 'POST', headers: { 'Idempotency-Key': `guest-custom/${r.id}/${part}/${r.updated_at}/${r.extra_rounds}` }, body: p.toString() });
}
// Aplica un pago confirmado por Stripe una sola vez: estado, factura y avisos.
async function applyPayment(c: any, r: any, sessionId: string) {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return r;
  if ((r.paid_sessions || []).includes(sessionId)) return r;
  const s = await stripe('checkout/sessions/' + encodeURIComponent(sessionId));
  if (s.metadata?.custom_request !== r.id || s.payment_status !== 'paid') return r;
  const part = String(s.metadata?.part || ''), ts = new Date().toISOString();
  const patch: any = { paid_sessions: [...(r.paid_sessions || []), sessionId], updated_at: ts };
  if (part === 'deposit') Object.assign(patch, { status: 'accepted', deposit_session: sessionId, deposit_paid_at: ts });
  if (part === 'final') Object.assign(patch, { status: 'paid', final_session: sessionId, final_paid_at: ts });
  if (part === 'extra') Object.assign(patch, { extra_rounds: Number(r.extra_rounds || 0) + 1, extra_session: null });
  const { data: next, error } = await c.from('guest_custom_requests').update(patch).eq('id', r.id).not('paid_sessions', 'cs', `{${sessionId}}`).select('*').maybeSingle();
  if (error) throw error;
  if (!next) return r;
  const label = part === 'deposit' ? 'señal del 50 %' : part === 'final' ? 'resto del 50 %' : 'ronda de cambios extra';
  const { data: inv, error: ie } = await c.rpc('guest_issue_custom_invoice', { p_request: r.id, p_mode: s.livemode ? 'production' : 'test', p_email: r.email, p_name: s.customer_details?.name || r.name, p_concept: `Invitación digital a medida (${tierName(r).toLowerCase()}) · ${label}`, p_total_cents: s.amount_total, p_stripe_ref: s.payment_intent || sessionId });
  if (ie) console.error('custom_invoice_failed', ie);
  const invBtn = inv ? mBtn(await invoiceUrl(inv.id), 'Ver la factura', true) : '';
  if (part === 'deposit') {
    let qUrl = '';
    try { const e = await ensureOrder(c, next); qUrl = e.questionnaireUrl; } catch (e) { console.error('custom_order_failed', r.id, e); }
    await toCouple(r, 'Empezamos vuestra invitación', guestMail({ kicker: 'Señal recibida', title: 'Empezamos vuestra invitación.', preheader: 'Rellenad el cuestionario y nos ponemos con vuestro diseño.',
      body: mP(`Gracias, ${esc(first(r.name))}. Ya tenemos la señal de ${esc(euros(s.amount_total))}. Para empezar necesitamos los datos de vuestra boda: nombres, fecha, lugares, vuestra historia y fotos.`)
        + (qUrl ? mBtn(qUrl, 'Rellenar el cuestionario') : mP('En unas horas os mandamos el enlace del cuestionario.'))
        + mSteps([['Rellenáis el cuestionario', 'Se guarda solo: podéis dejarlo y seguir cuando queráis.'], ['Os mandamos la primera propuesta', r.quote_days ? `En unos ${r.quote_days} días desde que tengamos vuestros datos.` : 'En cuanto esté lista.'], ['La revisáis', `Tenéis ${ROUNDS} rondas de cambios incluidas. Cada ronda extra cuesta ${euros(EXTRA_CENTS)}.`], ['Pagáis el resto al aprobarla', 'Y os llega sola, con la app de invitados.']], 'Cómo sigue')
        + invBtn }), `guest-custom-deposit/${r.id}`);
    await toOwner(`Señal pagada · ${r.name}`, 'Diseño a medida', 'Han pagado la señal.', mP(`<b>${esc(r.name)}</b> ha pagado ${esc(euros(s.amount_total))} de su ${esc(tierName(r).toLowerCase())}. Ya puedes empezar.`), `guest-custom-deposit-owner/${r.id}`);
  } else if (part === 'final') {
    let delivered = false;
    if (next.order_id) {
      try {
        const j = await callFlow('custom_deliver', String(next.order_id), { orderId: next.order_id });
        await c.from('guest_custom_requests').update({ status: 'delivered', delivery_url: j.inviteUrl || null, delivered_at: ts, updated_at: ts }).eq('id', r.id);
        delivered = true;
      } catch (e) { console.error('custom_deliver_failed', r.id, e); }
    }
    await toCouple(r, 'Pago completado', guestMail({ kicker: 'Pago completado', title: delivered ? 'Todo pagado. Ya la tenéis.' : 'Todo pagado. Os la entregamos.', preheader: delivered ? 'Os acaba de llegar otro email con vuestra invitación y la app.' : 'En breve os llega vuestra invitación.',
      body: mP(`Gracias, ${esc(first(r.name))}. Ya tenemos el resto del pago. ${delivered ? 'Os acaba de llegar otro email con la invitación definitiva y el acceso a la app de invitados.' : 'En breve os llega la invitación definitiva junto con el acceso a la app de invitados.'}`) + invBtn }), `guest-custom-final/${r.id}`);
    await toOwner(`Pago final · ${r.name}`, 'Diseño a medida', delivered ? 'Entregada sola.' : 'Ya puedes entregar.', mP(`<b>${esc(r.name)}</b> ha pagado el resto (${esc(euros(s.amount_total))}).`) + (delivered ? mP('Les ha llegado la invitación definitiva con la app. No tienes que hacer nada.', true) : next.order_id ? mP('<b>La entrega automática ha fallado.</b> Abre su pedido en Pedidos y pulsa «Entregar».') : ''), `guest-custom-final-owner/${r.id}`);
  } else {
    await toCouple(r, 'Ronda extra pagada', guestMail({ kicker: 'Ronda extra', title: 'Recibido. Contadnos los cambios.', preheader: 'Ya podéis pedirnos la nueva ronda.',
      body: mP('Ya tenemos el pago de la ronda extra. Respondednos a este email o por WhatsApp con todos los cambios juntos y nos ponemos.') + invBtn }), `guest-custom-extra/${sessionId}`);
    await toOwner(`Ronda extra pagada · ${r.name}`, 'Diseño a medida', 'Han pagado una ronda extra.', mP(`<b>${esc(r.name)}</b> ha pagado ${esc(euros(s.amount_total))}.`), `guest-custom-extra-owner/${sessionId}`);
  }
  return next;
}
// Comprueba en Stripe los pagos pendientes de esta solicitud (por si cerraron la página antes de volver).
async function refresh(c: any, r: any) {
  for (const sid of [r.status === 'quoted' ? r.deposit_session : null, r.status === 'final_sent' ? r.final_session : null, r.extra_session]) {
    if (sid) { try { r = await applyPayment(c, r, sid); } catch (e) { console.warn('refresh', String(e)); } }
  }
  return r;
}

/* ---------- Sesión de propietaria (igual que guest-invitation-flow) ---------- */
function unb64url(s: string) { let v = s.replaceAll('-', '+').replaceAll('_', '/'); while (v.length % 4) v += '='; return atob(v); }
async function managerOk(c: any, req: Request) {
  const parts = txt(req.headers.get('x-weddly-manager'), 2000).split('.');
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
async function signed(c: any, r: any) {
  const out = [];
  for (const f of Array.isArray(r.files) ? r.files : []) {
    const { data } = await c.storage.from('guest-custom-uploads').createSignedUrl(f.path, 7200);
    out.push({ name: f.name, url: data?.signedUrl || '' });
  }
  return out;
}
const view = (r: any) => ({ id: r.id, createdAt: r.created_at, updatedAt: r.updated_at, test: r.mode === 'test', status: r.status, tier: r.tier, tierName: tierName(r), suggestedCents: TIERS[r.tier]?.cents || 12000, baseDesign: r.base_design, baseDesignName: DESIGN_NAMES[r.base_design] || null, wishes: r.wishes, idea: r.idea, links: r.links, weddingDate: r.wedding_date, urgency: r.urgency, urgencyLabel: URGENCY[r.urgency] || '', name: r.name, email: r.email, phone: r.phone, contactPref: r.contact_pref, quoteCents: r.quote_cents, quoteDays: r.quote_days, quoteNote: r.quote_note, quotedAt: r.quoted_at, depositPaidAt: r.deposit_paid_at, finalPaidAt: r.final_paid_at, extraRounds: r.extra_rounds, ownerNotes: r.owner_notes, quoteDueAt: r.status === 'new' ? new Date(Date.parse(r.created_at) + QUOTE_DUE).toISOString() : null, deliveryUrl: r.delivery_url, deliveredAt: r.delivered_at, hasAccess: !!r.license_id, fileCount: (r.files || []).length, roundsUsed: r.rounds_used || 0, orderId: r.order_id || null, refundedAt: r.refunded_at, refundNote: r.refund_note, depositCents: r.deposit_paid_at ? deposit(r) : 0, finalCents: r.final_paid_at ? rest(r) : 0 });

/* ---------- Entrega con la app de invitados ---------- */
function activationCode() { const a = crypto.randomUUID().replaceAll('-', '').toUpperCase(), b = crypto.randomUUID().replaceAll('-', '').toUpperCase(); return `WSD-GUEST-${a.slice(0, 8)}-${a.slice(8, 16)}-${b.slice(0, 8)}`; }
async function sha256(v: string) { const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)); return Array.from(new Uint8Array(h)).map((x) => x.toString(16).padStart(2, '0')).join(''); }
// Licencia de dos personas para una boda. Si ya existe, devuelve la misma. guest-license-access solo
// abre la app con product 'guests'; no hay pedido del catálogo, así que no espera a una entrega.
async function access(c: any, r: any) {
  const code = activationCode();
  const { data, error } = await c.rpc('provision_weddly_license', { p_source: 'custom', p_source_order_id: 'custom-' + r.id, p_buyer_email: r.email, p_product_ref: 'guest_custom',
    p_metadata: { product: 'guests', edition: 'custom', access_kind: 'paid', payment_provider: 'stripe', custom_request_id: r.id, test: r.mode === 'test', amount_total: r.quote_cents, currency: 'eur' },
    p_activation_code: code, p_purchase_hash: await sha256(code.replace(/[^A-Z0-9]/g, '')) });
  if (error) throw error;
  const row = data?.[0];
  if (!row?.license_id || !row?.activation_code) throw Error('license_provision_failed');
  return { licenseId: String(row.license_id), url: site() + '/guest/access.html#code=' + encodeURIComponent(String(row.activation_code)) };
}

// El a medida usa el mismo sistema que el catálogo: al pagar la señal se crea su pedido (cuestionario,
// revisión con marca de agua y rondas, entrega con la app). Las llamadas a guest-invitation-flow-qa van firmadas.
const FLOW_FN = () => txt(Deno.env.get('SUPABASE_URL')).replace(/\/$/, '') + '/functions/v1/guest-invitation-flow-qa';
const internalSig = async (action: string, id: string) => (await hmacHex('guest-internal-v1|' + action + '|' + id)).slice(0, 40);
async function callFlow(action: string, id: string, body: Record<string, unknown>) {
  const r = await fetch(FLOW_FN(), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action, ...body, sig: await internalSig(action, id) }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw Error('flow_' + (j?.error || r.status));
  return j;
}
async function ensureOrder(c: any, r: any): Promise<{ r: any; questionnaireUrl: string }> {
  const a = await access(c, r);
  const j = await callFlow('custom_create', r.id, { requestId: r.id, email: r.email, licenseId: a.licenseId, templateId: r.base_design || 'veil-light', included: ROUNDS, extraCents: EXTRA_CENTS, tierName: tierName(r) });
  if (r.order_id !== j.orderId || r.license_id !== a.licenseId) {
    const { data } = await c.from('guest_custom_requests').update({ order_id: j.orderId, license_id: a.licenseId }).eq('id', r.id).select('*').single();
    if (data) r = data;
  }
  return { r, questionnaireUrl: String(j.questionnaireUrl || '') };
}
// Al aprobar el diseño (desde la página de revisión o desde la app): pedir el 50 % restante.
async function askFinal(c: any, r: any) {
  const ts = new Date().toISOString();
  const { data: q, error } = await c.from('guest_custom_requests').update({ status: 'final_sent', updated_at: ts, final_sent_at: ts, final_session: null }).eq('id', r.id).select('*').single();
  if (error) throw error;
  const ok = await toCouple(q, 'Último paso: el resto del pago', guestMail({ kicker: 'Diseño aprobado', title: 'Último paso.', preheader: `Pagad ${euros(rest(q))} y os la entregamos.`,
    body: mP(`¡Qué bien que os encante, ${esc(first(q.name))}! Para entregaros la invitación definitiva con la app de invitados solo falta el resto del pago.`) + mBtn(await payUrl(q), `Pagar ${euros(rest(q))}`)
      + mP('En cuanto lo paguéis, os llega sola la invitación definitiva, sin marca de agua, con el acceso a la app.', true) }), `guest-custom-final-ask/${q.id}`);
  return { q, ok };
}

/* ---------- Tarea de cada hora ---------- */
async function tick(c: any) {
  const now = Date.now(), done: string[] = [];
  const { data, error } = await c.from('guest_custom_requests').select('*').in('status', ['new', 'quoted', 'accepted', 'designing', 'final_sent']).limit(500);
  if (error) throw error;
  for (let r of data || []) {
    // 1. Pagos hechos sin volver a la página.
    if (r.deposit_session || r.final_session || r.extra_session) { const before = r.status + r.extra_rounds; r = await refresh(c, r); if (r.status + r.extra_rounds !== before) done.push('paid:' + r.id); }
    // Señal pagada sin pedido (falló al crearlo): se reintenta y se les manda el cuestionario.
    if (['accepted', 'designing'].includes(r.status) && !r.order_id) {
      try { const e = await ensureOrder(c, r); r = e.r; if (e.questionnaireUrl) await toCouple(r, 'Vuestro cuestionario', guestMail({ kicker: 'Diseño a medida', title: 'Contadnos los datos de vuestra boda.', preheader: 'Con esto empezamos vuestro diseño.', body: mP('Para empezar vuestro diseño necesitamos los datos de la boda. Se guarda solo: podéis dejarlo y seguir cuando queráis.') + mBtn(e.questionnaireUrl, 'Rellenar el cuestionario') }), `guest-custom-questionnaire/${r.id}`); done.push('order:' + r.id); } catch (e) { console.error('custom_order_retry', r.id, e); }
    }
    // 2. Plazo de 48 h para mandar el presupuesto.
    if (r.status === 'new') {
      const due = Date.parse(r.created_at) + QUOTE_DUE;
      for (const [t, tag, id] of [[due - 12 * H, 'Quedan 12 h', '12h'], [due, 'Plazo vencido', 'due']] as [number, string, string][]) {
        if (!crossed(t, now)) continue;
        if (await toOwner(`${tag} · presupuesto para ${r.name}${r.mode === 'test' ? ' (prueba)' : ''}`, 'Plazos', tag + '.', mP(`<b>${esc(r.name)}</b> espera el presupuesto de su ${esc(tierName(r).toLowerCase())}. En la web prometemos contestar en 48 h.`), `guest-custom-due/${r.id}/${id}`)) done.push('due:' + r.id + ':' + id);
      }
    }
    // 3. Recordatorios de pago a la pareja.
    const remind = async (from: string | null, ids: [number, string, string, string][], btn: string, link: string) => {
      for (const [days, id, title, text] of ids) {
        if (!from || !crossed(Date.parse(from) + days * D, now)) continue;
        if (await toCouple(r, title.replace(/\.$/, ''), guestMail({ kicker: 'Recordatorio', title, preheader: text, body: mP(esc(text)) + mBtn(link, btn) }), `guest-custom-remind/${r.id}/${id}/${from}`)) done.push('remind:' + r.id + ':' + id);
      }
    };
    if (r.status === 'quoted') await remind(r.quoted_at, [
      [3, 'q3d', 'Vuestro presupuesto sigue en pie.', `Os mandamos el precio cerrado de vuestra invitación a medida: ${euros(r.quote_cents)}, IVA incluido. Si os encaja, pagáis la mitad y empezamos. Si queréis ajustar algo antes, respondednos.`],
      [7, 'q7d', '¿Seguimos con vuestra invitación?', 'No queremos que se os pase. Si tenéis cualquier duda sobre el presupuesto o preferís hablarlo por WhatsApp, respondednos y lo vemos.']
    ], `Ver el presupuesto`, await payUrl(r));
    if (r.status === 'final_sent') {
      await remind(r.final_sent_at, [
        [3, 'f3d', 'Vuestra invitación está lista para entregar.', `Solo falta el resto del pago (${euros(rest(r))}) para mandaros la invitación definitiva con la app de invitados.`],
        [7, 'f7d', '¿Os ayudamos con el último pago?', `Vuestra invitación está terminada y esperando. En cuanto paguéis el resto (${euros(rest(r))}) os la mandamos con la app. Si tenéis algún problema con el pago, respondednos.`]
      ], `Pagar ${euros(rest(r))}`, await payUrl(r));
      // Si a los 10 días siguen sin pagar, te toca hablar con ellos.
      if (r.final_sent_at && crossed(Date.parse(r.final_sent_at) + 10 * D, now) && await toOwner(`Sin pagar el resto · ${r.name}`, 'Diseño a medida', 'Llevan 10 días sin pagar el resto.', mP(`<b>${esc(r.name)}</b> tiene el enlace del pago final (${esc(euros(rest(r)))}) desde hace 10 días. Ya les han llegado dos recordatorios: mejor escribirles por WhatsApp.`), `guest-custom-final-stuck/${r.id}`)) done.push('stuck:' + r.id);
    }
    // Plazo de la primera propuesta que les prometiste al presupuestar.
    if (['accepted', 'designing'].includes(r.status) && !r.rounds_used && r.deposit_paid_at && r.quote_days) {
      const due = Date.parse(r.deposit_paid_at) + r.quote_days * D;
      for (const [t, tag, id] of [[due - D, 'Mañana toca la primera propuesta', '1d'], [due, 'Hoy toca la primera propuesta', 'due']] as [number, string, string][]) {
        if (crossed(t, now) && await toOwner(`${tag} · ${r.name}`, 'Plazos', tag + '.', mP(`A <b>${esc(r.name)}</b> le dijiste que tendría la primera propuesta en unos ${r.quote_days} días desde la señal. Cuando se la mandes, pulsa «He mandado una propuesta» en su pedido.`), `guest-custom-proposal/${r.id}/${id}`)) done.push('proposal:' + r.id + ':' + id);
      }
    }
  }
  return { checked: (data || []).length, done };
}

/* ---------- Entrada ---------- */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  const c = db();
  try {
    if ((req.headers.get('content-type') || '').includes('multipart/form-data')) {
      const fd = await req.formData();
      if (String(fd.get('action') || '') !== 'submit') return json({ ok: false, error: 'invalid_action' }, 400);
      if (txt(fd.get('website'))) return json({ ok: true }); // trampa para robots
      const tier = txt(fd.get('tier'), 10), name = txt(fd.get('name'), 120), email = txt(fd.get('email'), 200).toLowerCase(), phone = txt(fd.get('phone'), 40);
      const idea = txt(fd.get('idea'), 3000), date = txt(fd.get('wedding_date'), 10), base = txt(fd.get('base_design'), 40);
      const errors: string[] = [];
      if (!TIERS[tier]) errors.push('tier');
      if (!name) errors.push('name');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
      if (idea.length < 10) errors.push('idea');
      if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('wedding_date');
      if (fd.get('consent') !== 'true') errors.push('consent');
      const files = fd.getAll('files').filter((f) => f instanceof File && f.size > 0) as File[];
      if (files.length > 3) errors.push('files');
      for (const f of files) if (f.size > 10485760 || !['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(f.type)) errors.push('files');
      if (errors.length) return json({ ok: false, error: 'validation_failed', fields: [...new Set(errors)] }, 400);
      const id = crypto.randomUUID(), stored: any[] = [];
      for (const [i, f] of files.entries()) {
        const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/heic': 'heic', 'image/heif': 'heif' } as any)[f.type];
        const path = `${id}/${i + 1}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const { error } = await c.storage.from('guest-custom-uploads').upload(path, f, { contentType: f.type, upsert: false });
        if (error) throw error;
        stored.push({ path, name: txt(f.name, 160), size: f.size });
      }
      const row = { id, mode: QA ? 'test' : 'production', tier, base_design: DESIGN_NAMES[base] ? base : null, wishes: String(fd.get('wishes') || '').split('|').map((x) => txt(x, 40)).filter((x) => WISHES.includes(x)), idea, links: txt(fd.get('links'), 1200), files: stored, wedding_date: date || null, urgency: URGENCY[txt(fd.get('urgency'), 10)] ? txt(fd.get('urgency'), 10) : 'normal', name, email, phone, contact_pref: fd.get('contact_pref') === 'email' ? 'email' : 'whatsapp' };
      const { data: r, error } = await c.from('guest_custom_requests').insert(row).select('*').single();
      if (error) throw error;
      await toCouple(r, 'Hemos recibido vuestra idea', guestMail({ kicker: 'Diseño a medida', title: 'Recibido. Os contestamos en 48 h.', preheader: 'Os mandamos un precio cerrado antes de empezar.',
        body: mP(`Gracias, ${esc(first(name))}. Ya tenemos vuestra idea y las referencias.`)
          + mSteps([['Os mandamos el presupuesto', 'Con un precio cerrado y el plazo, en menos de 48 h.'], ['Pagáis la mitad para empezar', 'Con un enlace de pago seguro.'], ['Diseñamos y lo revisáis', `${ROUNDS} rondas de cambios incluidas.`], ['Pagáis el resto al aprobarla', 'Y os la entregamos con la app de invitados.']], 'Cómo sigue')
          + mP('Si se nos ocurre alguna duda, os escribimos ' + (row.contact_pref === 'email' ? 'por email.' : 'por WhatsApp.'), true) }), `guest-custom-received/${id}`);
      await toOwner(`Nueva solicitud a medida · ${name}`, 'Diseño a medida', `${tierName(r)} para ${first(name)}.`,
        mList([`<b>Nivel:</b> ${esc(tierName(r))} · desde ${esc(euros(TIERS[tier].cents))}`, ...(r.base_design ? [`<b>Diseño base:</b> ${esc(DESIGN_NAMES[r.base_design])}`] : []), ...(r.wishes.length ? [`<b>Quieren cambiar:</b> ${esc(r.wishes.join(', '))}`] : []), `<b>La idea:</b> ${esc(idea).replaceAll('\n', '<br>')}`, ...(r.wedding_date ? [`<b>Boda:</b> ${esc(day(r.wedding_date))} · ${esc(URGENCY[r.urgency])}`] : []), `<b>Contacto:</b> ${esc(email)}${phone ? ' · ' + esc(phone) : ''}`, ...(stored.length ? [`${stored.length} ${stored.length === 1 ? 'foto' : 'fotos'} de inspiración en la app`] : [])]),
        `guest-custom-new/${id}`);
      return json({ ok: true });
    }

    let b: any = {}; try { b = JSON.parse((await req.text()) || '{}'); } catch { return json({ ok: false, error: 'invalid_json' }, 400); }
    const action = txt(b.action, 40);
    if (action === 'tick') return json({ ok: true, ...(await tick(c)) });

    if (action === 'order_approved') {
      const id = txt(b.requestId, 40);
      if (!/^[0-9a-f-]{36}$/.test(id) || txt(b.sig, 60) !== await internalSig('order_approved', id)) return json({ ok: false, error: 'forbidden' }, 403);
      const { data: r } = await c.from('guest_custom_requests').select('*').eq('id', id).maybeSingle();
      if (!r) return json({ ok: false, error: 'not_found' }, 404);
      if (['final_sent', 'paid', 'delivered'].includes(r.status)) return json({ ok: true, already: true });
      if (!['accepted', 'designing'].includes(r.status)) return json({ ok: false, error: 'invalid_status' }, 409);
      const { ok } = await askFinal(c, r);
      await toOwner(`Diseño aprobado · ${r.name}`, 'Diseño a medida', 'Han aprobado su diseño.', mP(`<b>${esc(r.name)}</b> ha aprobado su invitación a medida. Les ha llegado el enlace para pagar el resto (${esc(euros(rest(r)))}); al pagarlo se les entrega sola.`), `guest-custom-approved-owner/${r.id}`);
      return json({ ok: true, emailed: ok });
    }
    if (action === 'draft_status') {
      // Público: solo dice si la invitación a medida ya está pagada entera (para quitar la marca de borrador).
      const id = txt(b.id, 40); if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ ok: false, error: 'invalid_id' }, 400);
      const { data } = await c.from('guest_custom_requests').select('status').eq('id', id).maybeSingle();
      return json({ ok: true, final: ['paid', 'delivered'].includes(data?.status) });
    }

    if (['quote_load', 'pay', 'pay_status'].includes(action)) {
      let r = await fromToken(c, txt(b.t, 200));
      if (!r) return json({ ok: false, error: 'invalid_token' }, 403);
      if (action === 'pay_status' && b.s) r = await applyPayment(c, r, txt(b.s, 300));
      else if (action !== 'pay') r = await refresh(c, r);
      if (action === 'pay') {
        const what = b.part === 'extra' ? { part: 'extra', cents: EXTRA_CENTS, label: 'Ronda de cambios extra' } : partOf(r);
        if (!what || (b.part === 'extra' && (r.order_id || !['accepted', 'designing'].includes(r.status)))) return json({ ok: false, error: 'nothing_to_pay' }, 409);
        const s = await checkout(r, what.part, what.cents, what.label);
        await c.from('guest_custom_requests').update({ [{ deposit: 'deposit_session', final: 'final_session', extra: 'extra_session' }[what.part]!]: s.id }).eq('id', r.id);
        return json({ ok: true, url: s.url });
      }
      const due = partOf(r);
      return json({ ok: true, request: { name: first(r.name), status: r.status, tierName: tierName(r), what: TIERS[r.tier]?.what, quoteCents: r.quote_cents, quoteDays: r.quote_days, quoteNote: r.quote_note, depositCents: deposit(r), restCents: rest(r), due: due ? { part: due.part, cents: due.cents, label: due.label } : null, rounds: ROUNDS, extraCents: EXTRA_CENTS, extraRounds: r.extra_rounds, canBuyExtra: !r.order_id && ['accepted', 'designing'].includes(r.status), withApp: !!r.order_id } });
    }

    if (!(await managerOk(c, req))) return json({ ok: false, error: 'manager_required' }, 403);

    if (action === 'list') {
      const { data, error } = await c.from('guest_custom_requests').select('*').order('created_at', { ascending: false }).limit(300);
      if (error) throw error;
      const rows = [];
      for (const r of data || []) rows.push(view(['quoted', 'final_sent'].includes(r.status) ? await refresh(c, r) : r));
      return json({ ok: true, requests: rows, rounds: ROUNDS, extraCents: EXTRA_CENTS, tiers: TIERS });
    }
    const { data: r } = await c.from('guest_custom_requests').select('*').eq('id', txt(b.id, 40)).maybeSingle();
    if (!r) return json({ ok: false, error: 'not_found' }, 404);

    if (action === 'detail') return json({ ok: true, request: { ...view(r), files: await signed(c, r), payUrl: await payUrl(r), accessUrl: r.license_id ? (await access(c, r)).url : null } });

    if (action === 'update') {
      const patch: any = { updated_at: new Date().toISOString() };
      if (typeof b.ownerNotes === 'string') patch.owner_notes = txt(b.ownerNotes, 5000);
      if (['designing', 'declined', 'new'].includes(b.status)) patch.status = b.status;
      const { data, error } = await c.from('guest_custom_requests').update(patch).eq('id', r.id).select('*').single();
      if (error) throw error;
      return json({ ok: true, request: view(data) });
    }

    if (action === 'quote') {
      if (!['new', 'quoted'].includes(r.status)) return json({ ok: false, error: 'invalid_status' }, 409);
      const cents = Math.round(Number(b.cents)), days = Math.round(Number(b.days || 0));
      if (!Number.isInteger(cents) || cents < 5000 || cents > 500000) return json({ ok: false, error: 'invalid_amount' }, 400);
      const ts = new Date().toISOString();
      const { data: q, error } = await c.from('guest_custom_requests').update({ status: 'quoted', quote_cents: cents, quote_days: days > 0 && days < 120 ? days : null, quote_note: txt(b.note, 1200), quoted_at: ts, updated_at: ts, deposit_session: null }).eq('id', r.id).select('*').single();
      if (error) throw error;
      const ok = await toCouple(q, 'Vuestro presupuesto', guestMail({ kicker: 'Presupuesto', title: `${euros(cents)}, todo incluido.`, preheader: `Precio cerrado, IVA incluido. Pagáis la mitad para empezar.`,
        body: mP(`${esc(first(q.name))}, aquí tenéis el precio cerrado de vuestra invitación a medida: <b>${esc(tierName(q).toLowerCase())}</b>, con la app de invitados incluida.`)
          + (q.quote_note ? mNote(esc(q.quote_note).replaceAll('\n', '<br>')) : '')
          + mSteps([['Pagáis la señal: ' + euros(deposit(q)), 'La mitad, para empezar.'], ['Diseñamos', q.quote_days ? `Primera propuesta en unos ${q.quote_days} días.` : 'Os mandamos la primera propuesta.'], ['Revisáis', `${ROUNDS} rondas de cambios incluidas. Cada ronda extra: ${euros(EXTRA_CENTS)}.`], ['Pagáis el resto: ' + euros(rest(q)), 'Al aprobarla. Y os la entregamos.']], 'Cómo funciona')
          + mBtn(await payUrl(q), `Aceptar y pagar ${euros(deposit(q))}`)
          + mP('IVA incluido. Al ser un diseño exclusivo, la señal cubre el trabajo desde el primer día y no se devuelve una vez empezado.', true) }), `guest-custom-quote/${q.id}/${ts}`);
      return json({ ok: true, emailed: ok, payUrl: await payUrl(q), request: view(q) });
    }

    if (action === 'final') {
      if (!['accepted', 'designing'].includes(r.status)) return json({ ok: false, error: 'invalid_status' }, 409);
      const { q, ok } = await askFinal(c, r);
      return json({ ok: true, emailed: ok, payUrl: await payUrl(q), request: view(q) });
    }

    if (action === 'extra') {
      if (!['accepted', 'designing'].includes(r.status)) return json({ ok: false, error: 'invalid_status' }, 409);
      const n = Number(r.extra_rounds || 0) + 1;
      const ok = await toCouple(r, 'Ronda de cambios extra', guestMail({ kicker: 'Cambios', title: 'Una ronda más.', preheader: `Las ${ROUNDS} rondas incluidas ya están usadas.`,
        body: mP(`Ya hemos hecho las ${ROUNDS} rondas de cambios incluidas. Para una ronda más, el precio es de <b>${esc(euros(EXTRA_CENTS))}</b>. Os aconsejamos juntar todos los cambios en ella.`) + mBtn((await payUrl(r)) + '&extra=1', `Pagar ${euros(EXTRA_CENTS)}`) }), `guest-custom-extra-ask/${r.id}/${n}`);
      return json({ ok: true, emailed: ok, payUrl: (await payUrl(r)) + '&extra=1' });
    }
    if (action === 'round') {
      // Lleva la cuenta de las propuestas mandadas, para saber cuándo se acaban las rondas incluidas.
      if (!['accepted', 'designing'].includes(r.status)) return json({ ok: false, error: 'invalid_status' }, 409);
      const n = Math.max(0, Math.min(50, Number(r.rounds_used || 0) + (b.undo ? -1 : 1)));
      const { data, error } = await c.from('guest_custom_requests').update({ rounds_used: n, status: 'designing', updated_at: new Date().toISOString() }).eq('id', r.id).select('*').single();
      if (error) throw error;
      return json({ ok: true, request: view(data) });
    }
    if (action === 'refund') {
      // Devuelve lo pagado (la señal, el resto o todo) con su factura rectificativa. Las rondas extra no se devuelven.
      const parts = b.part === 'deposit' ? ['deposit'] : b.part === 'final' ? ['final'] : ['deposit', 'final'];
      const sessions = parts.map((p) => [p, p === 'deposit' ? (r.deposit_paid_at ? r.deposit_session : null) : (r.final_paid_at ? r.final_session : null)]).filter((x) => x[1]) as [string, string][];
      if (!sessions.length || r.status === 'refunded') return json({ ok: false, error: 'nothing_to_refund' }, 409);
      const ts = new Date().toISOString(), done: any[] = [];
      for (const [part, sid] of sessions) {
        const s = await stripe('checkout/sessions/' + encodeURIComponent(sid));
        if (!s.payment_intent) continue;
        const refund = await stripe('refunds', { method: 'POST', headers: { 'Idempotency-Key': `guest-custom-refund/${r.id}/${part}` }, body: new URLSearchParams({ payment_intent: s.payment_intent, 'metadata[custom_request]': r.id, 'metadata[part]': part }).toString() });
        const { data: orig } = await c.from('guest_invoices').select('*').eq('custom_request_id', r.id).eq('stripe_ref', s.payment_intent).maybeSingle();
        let rect: any = null;
        if (orig) {
          const { data, error } = await c.rpc('guest_issue_custom_rectificative', { p_request: r.id, p_original: orig.id, p_mode: orig.mode, p_email: orig.buyer_email, p_name: orig.buyer_name, p_concept: 'Devolución de ' + orig.concept.charAt(0).toLowerCase() + orig.concept.slice(1), p_total_cents: -Math.abs(Number(refund.amount || orig.total_cents)), p_stripe_ref: refund.id });
          if (error) console.error('custom_rectificative_failed', error); else rect = data;
        }
        done.push({ part, cents: Number(refund.amount || 0), rect });
      }
      if (!done.length) return json({ ok: false, error: 'nothing_to_refund' }, 409);
      const total = done.reduce((a, x) => a + x.cents, 0);
      const all = parts.length === 2 || (!r.final_paid_at && parts[0] === 'deposit');
      const patch: any = { refunded_at: ts, refund_note: [r.refund_note, `${ts.slice(0, 10)}: devuelto ${euros(total)} (${done.map((x) => x.part === 'deposit' ? 'señal' : 'resto').join(' y ')})`].filter(Boolean).join('\n'), updated_at: ts };
      if (all) patch.status = 'refunded';
      const { data: q, error } = await c.from('guest_custom_requests').update(patch).eq('id', r.id).select('*').single();
      if (error) throw error;
      if (all && r.license_id) await c.from('licenses').update({ status: 'inactive', updated_at: ts }).eq('id', r.license_id).eq('status', 'active');
      const invBtns = (await Promise.all(done.filter((x) => x.rect).map(async (x) => mBtn(await invoiceUrl(x.rect.id), 'Ver la factura de la devolución', true)))).join('');
      await toCouple(r, 'Devolución realizada', guestMail({ kicker: 'Devolución', title: 'Os hemos devuelto el importe.', preheader: `${euros(total)} a la misma tarjeta.`,
        body: mP(`Hemos hecho la devolución de <b>${esc(euros(total))}</b> a la misma tarjeta con la que pagasteis. Según el banco, suele verse en 5 a 10 días.`) + invBtns }), `guest-custom-refund/${r.id}/${parts.join('-')}`);
      return json({ ok: true, refundedCents: total, request: view(q) });
    }
    if (action === 'deliver') {
      if (!['paid', 'delivered'].includes(r.status)) return json({ ok: false, error: 'invalid_status' }, 409);
      if (r.order_id) {
        // Pedido del sistema del catálogo: se entrega igual que el catálogo (enlace final y app).
        const j = await callFlow('custom_deliver', String(r.order_id), { orderId: r.order_id }).catch((e) => ({ ok: false, error: String(e?.message || e) }));
        if (!j.ok) return json({ ok: false, error: 'deliver_failed', detail: j.error }, 409);
        const ts = new Date().toISOString();
        const { data: q } = await c.from('guest_custom_requests').update({ status: 'delivered', delivery_url: j.inviteUrl || r.delivery_url, delivered_at: r.delivered_at || ts, updated_at: ts }).eq('id', r.id).select('*').single();
        return json({ ok: true, request: view(q || r) });
      }
      let invite = '';
      if (b.url) { try { const u = new URL(txt(b.url, 600)); if (u.protocol !== 'https:' || u.username || u.password) throw 0; invite = u.toString(); } catch { return json({ ok: false, error: 'invalid_url' }, 400); } }
      const a = await access(c, r), ts = new Date().toISOString();
      const ok = await toCouple(r, 'Vuestra invitación está lista para compartir', guestMail({ kicker: 'Entrega', title: 'Lista para compartir.', preheader: 'Vuestra invitación a medida y el acceso a la app de invitados.',
        body: mP(`Vuestra invitación a medida está terminada, ${esc(first(r.name))}. Aquí tenéis lo que necesitáis:`)
          + (invite ? mBtn(invite, 'Ver nuestra invitación') : '')
          + mBtn(a.url, 'Abrir la app de invitados', !!invite)
          + mSteps([['Añadid a vuestros invitados', 'Uno a uno, por grupos o desde los contactos del móvil.'], ['Enviad la invitación', 'Desde la app, por WhatsApp, a quien elijáis.'], ['Las respuestas llegan solas', 'Asistencia, acompañantes, menús, alergias y transporte, todo reunido.']], 'Con la app')
          + mNote('<b>Guardad este email.</b> Es vuestro acceso a la app. Abridlo desde el móvil, en Safari o Chrome (no dentro de la app del correo), y añadidla a la pantalla de inicio. Para vuestra pareja: en la app, <b>Ajustes › Invitar a mi pareja</b>.')
          + mP(`¿Primera vez? <a href="${APP_ORIGIN}/guia.html" style="color:#1b2650;font-weight:600">Guía de la app, paso a paso</a>.`, true) }), `guest-custom-deliver/${r.id}/${invite}`);
      const { data: q, error } = await c.from('guest_custom_requests').update({ status: 'delivered', license_id: a.licenseId, delivery_url: invite || r.delivery_url, delivered_at: r.delivered_at || ts, updated_at: ts }).eq('id', r.id).select('*').single();
      if (error) throw error;
      return json({ ok: true, emailed: ok, accessUrl: a.url, request: view(q) });
    }
    return json({ ok: false, error: 'invalid_action' }, 400);
  } catch (e) {
    console.error(e);
    const m = String((e as Error)?.message || '');
    return json({ ok: false, error: m.startsWith('stripe_') ? m : 'server_error' }, m.startsWith('stripe_') ? 502 : 500);
  }
});
