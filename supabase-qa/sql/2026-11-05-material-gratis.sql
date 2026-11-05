-- GUEST · contador del material gratis: admite el evento 'free' (clave = acción-detalle, sin datos personales)
create or replace function public.guest_web_hit(p_event text, p_k text default '') returns void language plpgsql security definer set search_path = public as $$
declare v_e text := lower(coalesce(p_event, '')); v_k text := left(regexp_replace(lower(coalesce(p_k, '')), '[^a-z0-9_./-]', '', 'g'), 40);
begin
  if v_e not in ('visit', 'page', 'design', 'want', 'checkout', 'quote_open', 'whatsapp', 'free') then return; end if;
  insert into guest_web_daily as w (day, event, k, n) values ((now() at time zone 'Europe/Madrid')::date, v_e, v_k, 1)
  on conflict (day, event, k) do update set n = w.n + 1;
end $$;
