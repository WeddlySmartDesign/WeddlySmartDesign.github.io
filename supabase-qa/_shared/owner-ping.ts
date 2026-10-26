// Cada email que recibe la propietaria también le llega como aviso al móvil:
// se guarda en guest_owner_events y un disparador de la base de datos lo envía (guest-automation, push_dispatch).
// Nunca falla hacia fuera: si no se puede guardar, el email ya ha salido igual.
const PANEL = '/guest/panel-pruebas.html';
const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
// Lleva el aviso a la ficha concreta: primero el botón del propio email; si no, el id que va en la clave.
export function panelLink(dedupe = '', html = '', fallback = PANEL) {
  const inMail = String(html).match(new RegExp('panel-pruebas\\.html(#/(?:pedido|medida)/' + UUID + ')'));
  if (inMail) return PANEL + inMail[1];
  const id = String(dedupe).match(new RegExp('^guest-([a-z-]+)/(' + UUID + ')'));
  if (id) return PANEL + (id[1].startsWith('custom') ? '#/medida/' : '#/pedido/') + id[2];
  return fallback;
}

export async function ownerPing(title: string, opts: { dedupe?: string; body?: string; url?: string; test?: boolean; html?: string } = {}) {
  try {
    const url = panelLink(opts.dedupe, opts.html, opts.url || '') || null;
    const base = String(Deno.env.get('SUPABASE_URL') || '');
    const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
    const key = keys ? JSON.parse(keys).default : String(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
    if (!base || !key) return;
    const headers: Record<string, string> = { apikey: key, 'content-type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' };
    if (key.startsWith('eyJ')) headers.Authorization = 'Bearer ' + key;
    const r = await fetch(base + '/rest/v1/guest_owner_events?on_conflict=dedupe', {
      method: 'POST', headers,
      body: JSON.stringify({ title: String(title).slice(0, 140), body: opts.body ? String(opts.body).slice(0, 240) : null, url, test: !!opts.test, dedupe: opts.dedupe ? String(opts.dedupe).slice(0, 200) : null })
    });
    if (!r.ok) console.warn('owner_ping', r.status, await r.text());
  } catch (e) { console.warn('owner_ping', e); }
}
