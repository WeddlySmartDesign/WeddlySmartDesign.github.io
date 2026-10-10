-- GUEST LOCAL-ONLY CI FIXTURE; never run against WeddlySmartDesign or STUDIO.
-- Minimal independent subset of production shapes; NOT a production migration.
-- The runner provisions an empty disposable PostgreSQL, never uploads real data.
create table public.guest_invitation_orders (
 id uuid primary key default gen_random_uuid(),
 mode text not null default 'production' check (mode in ('test','production')),
 license_id uuid,
 buyer_email text not null default '',
 template_id text not null default 'veil-light',
 template_version text not null default '2026-10-06',
 status text not null default 'draft'
  check (status in ('draft','submitted','designing','review_ready','review_sent','changes_requested','approved','delivered','cancelled')),
 questionnaire_token_hash text not null unique check (char_length(questionnaire_token_hash)=64),
 review_token_hash text unique,
 public_token_hash text unique,
 questionnaire jsonb not null default '{}'::jsonb check (jsonb_typeof(questionnaire)='object'),
 resolved_config jsonb not null default '{}'::jsonb check (jsonb_typeof(resolved_config)='object'),
 files jsonb not null default '[]'::jsonb check (jsonb_typeof(files)='array'),
 owner_notes text not null default '',
 revision_count integer not null default 0 check (revision_count between 0 and 20),
 revision_requests jsonb not null default '[]'::jsonb check (jsonb_typeof(revision_requests)='array'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 submitted_at timestamptz,
 designing_at timestamptz,
 review_sent_at timestamptz,
 approved_at timestamptz,
 delivered_at timestamptz,
 delivery_url text,
 checkout_session_id text
);
create table public.guest_rsvp_forms (
 id uuid primary key default gen_random_uuid(),
 wedding_id uuid,
 public_token_hash text not null unique check (char_length(public_token_hash)=64),
 manage_token_hash text not null unique check (char_length(manage_token_hash)=64),
 status text not null default 'active' check (status in ('active','paused','closed')),
 config jsonb not null default '{}'::jsonb check (jsonb_typeof(config)='object'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 public_token text,
 claimed_at timestamptz
);
create table public.guest_rsvp_submissions (
 id uuid primary key default gen_random_uuid(),
 form_id uuid not null references public.guest_rsvp_forms(id) on delete cascade,
 client_submission_id text not null,
 guest_key text,
 name text not null,
 attend boolean not null,
 age smallint check (age is null or age between 0 and 120),
 meal_required boolean,
 meal text,
 allergy text,
 transport boolean not null default false,
 plusone text,
 source text not null default 'guest' check(source in ('guest','manual')),
 payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload)='object'),
 received_at timestamptz not null default now(),
 applied_at timestamptz,
 unique(form_id,client_submission_id)
);
-- Data API: only local service_role may write/read test records. No anon/authenticated policies.
alter table public.guest_invitation_orders enable row level security;
alter table public.guest_rsvp_forms enable row level security;
alter table public.guest_rsvp_submissions enable row level security;
revoke all on public.guest_invitation_orders,public.guest_rsvp_forms,public.guest_rsvp_submissions from anon,authenticated;
grant all on public.guest_invitation_orders,public.guest_rsvp_forms,public.guest_rsvp_submissions to service_role;

-- Pseudo-owner for realistic manager auth: disposable PostgreSQL only; no real licenses.
create table public.licenses(
 id uuid primary key,
 source text not null default 'manual',
 status text not null default 'active',
 metadata jsonb not null default '{}'::jsonb
);
insert into public.licenses(id,source,status,metadata)
 values('11111111-2222-4333-8444-555555555555','internal_owner','active','{"grant_type":"owner"}'::jsonb);
alter table public.licenses enable row level security;
revoke all on public.licenses from anon,authenticated;
grant all on public.licenses to service_role;
-- These are local-only buckets; NOT copied from production, NOT made publicly reachable.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('guest-invitation-uploads','guest-invitation-uploads',false,15728640,ARRAY['image/jpeg','image/png','image/webp','image/heic','image/heif']);

-- RSVP integration uses the real GUEST guest_app_state versioned update contract.
-- Never insert real wedding data. This exists ONLY in disposable local CI.
create table public.guest_app_state (
 wedding_id uuid primary key,
 version integer not null default 0,
 state jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
insert into public.guest_app_state(wedding_id,version,state)
values ('22222222-3333-4444-8555-666666666666',0,
 '{"guests":{
   "fictional-g-1":{"name":"Fictitious Person","invitationUnitId":"fictional-u-1","invitationUnitLabel":"Fictitious Household"},
   "fictional-g-2":{"name":"Fictitious Relative","invitationUnitId":"fictional-u-1","invitationUnitLabel":"Fictitious Household"}
 }}'::jsonb);
alter table public.guest_app_state enable row level security;
revoke all on public.guest_app_state from anon,authenticated;
grant all on public.guest_app_state to service_role;
