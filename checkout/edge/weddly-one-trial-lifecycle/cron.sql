-- Scheduled and active on 2026-10-09 for ONE only.
-- pg_cron executes at 08:30 UTC (09:30 winter / 10:30 summer in Madrid).
-- The shared secret stays in the existing private DB configuration, never in this file.
select cron.schedule(
 'one-trial-lifecycle-daily',
 '30 8 * * *',
 $cmd$
 select net.http_post(
   url := 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-one-trial-lifecycle',
   headers := jsonb_build_object(
      'Content-Type','application/json',
      'x-weddly-cron-secret',(select secret from public.internal_trial_reminder_config where id = 1)
   ),
   body := '{"mode":"run"}'::jsonb,
   timeout_milliseconds := 10000
 );
 $cmd$
) as jobid;
