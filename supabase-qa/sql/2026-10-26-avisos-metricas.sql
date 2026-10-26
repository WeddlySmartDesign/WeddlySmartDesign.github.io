-- GUEST · avisos al móvil y métricas de la web (solo crea cosas nuevas)
create table if not exists public.guest_owner_settings (key text primary key, value jsonb not null, updated_at timestamptz not null default now());
alter table public.guest_owner_settings enable row level security;
create table if not exists public.guest_owner_push_subs (endpoint text primary key, p256dh text not null, auth text not null, device text, created_at timestamptz not null default now(), last_ok_at timestamptz, fails int not null default 0);
alter table public.guest_owner_push_subs enable row level security;
create table if not exists public.guest_owner_events (id bigserial primary key, dedupe text unique, created_at timestamptz not null default now(), title text not null, body text, url text, test boolean not null default false, sent_at timestamptz, read_at timestamptz);
create index if not exists guest_owner_events_created on public.guest_owner_events (created_at desc);
alter table public.guest_owner_events enable row level security;
create or replace function public.guest_owner_event_dispatch() returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(url := 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-automation', body := '{"action":"push_dispatch"}'::jsonb, headers := '{"content-type":"application/json"}'::jsonb, timeout_milliseconds := 20000);
  return null;
end $$;
drop trigger if exists guest_owner_event_dispatch on public.guest_owner_events;
create trigger guest_owner_event_dispatch after insert on public.guest_owner_events for each statement execute function public.guest_owner_event_dispatch();
create table if not exists public.guest_web_daily (day date not null, event text not null, k text not null default '', n int not null default 0, primary key (day, event, k));
alter table public.guest_web_daily enable row level security;
create or replace function public.guest_web_hit(p_event text, p_k text default '') returns void language plpgsql security definer set search_path = public as $$
declare v_e text := lower(coalesce(p_event, '')); v_k text := left(regexp_replace(lower(coalesce(p_k, '')), '[^a-z0-9_./-]', '', 'g'), 40);
begin
  if v_e not in ('visit', 'page', 'design', 'want', 'checkout', 'quote_open', 'whatsapp') then return; end if;
  insert into guest_web_daily as w (day, event, k, n) values ((now() at time zone 'Europe/Madrid')::date, v_e, v_k, 1)
  on conflict (day, event, k) do update set n = w.n + 1;
end $$;
revoke all on function public.guest_web_hit(text, text) from public;
grant execute on function public.guest_web_hit(text, text) to anon, authenticated;
