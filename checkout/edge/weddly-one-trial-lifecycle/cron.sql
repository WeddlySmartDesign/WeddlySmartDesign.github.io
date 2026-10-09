-- ONE only: isolated expiry and feedback mail scheduler.
-- Public website, ONE app, and other products remain unchanged.
create schema if not exists private;
create or replace function private.run_one_trial_lifecycle_cron()
returns bigint
language plpgsql
security definer
set search_path = ''
as $body$
declare
  cron_secret text;
begin
  select secret into cron_secret from public.internal_trial_reminder_config where id = 1;
  if cron_secret is null or length(cron_secret) < 24 then
    raise exception 'one_trial_cron_secret_missing';
  end if;
  return net.http_post(
    url := 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-one-trial-lifecycle',
    headers := pg_catalog.jsonb_build_object('Content-Type','application/json','x-weddly-cron-secret',cron_secret),
    body := '{"mode":"run"}'::pg_catalog.jsonb,
    timeout_milliseconds := 10000
  );
end;
$body$;
revoke all on function private.run_one_trial_lifecycle_cron() from public;
-- 08:30 UTC = 10:30 CEST or 09:30 CET, both in the morning in Spain.
select cron.schedule(
  'one-trial-lifecycle-daily',
  '30 8 * * *',
  'select private.run_one_trial_lifecycle_cron();'
);
