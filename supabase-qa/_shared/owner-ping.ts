// Cada email que recibe la propietaria también le llega como aviso al móvil:
// se guarda en guest_owner_events y un disparador de la base de datos lo envía (guest-automation, push_dispatch).
// Nunca falla hacia fuera: si no se puede guardar, el email ya ha salido igual.
export async function ownerPing(title: string, opts: { dedupe?: string; body?: string; url?: string; test?: boolean } = {}) {
  try {
    const base = String(Deno.env.get('SUPABASE_URL') || '');
    const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
    const key = keys ? JSON.parse(keys).default : String(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
    if (!base || !key) return;
    const headers: Record<string, string> = { apikey: key, 'content-type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' };
    if (key.startsWith('eyJ')) headers.Authorization = 'Bearer ' + key;
    const r = await fetch(base + '/rest/v1/guest_owner_events?on_conflict=dedupe', {
      method: 'POST', headers,
      body: JSON.stringify({ title: String(title).slice(0, 140), body: opts.body ? String(opts.body).slice(0, 240) : null, url: opts.url || null, test: !!opts.test, dedupe: opts.dedupe ? String(opts.dedupe).slice(0, 200) : null })
    });
    if (!r.ok) console.warn('owner_ping', r.status, await r.text());
  } catch (e) { console.warn('owner_ping', e); }
}
