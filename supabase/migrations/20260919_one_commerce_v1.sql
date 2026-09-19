-- ONE commerce foundation (isolated feature branch)
-- No production changes are applied by this file until the migration is explicitly deployed.

create table if not exists public.commerce_products (
  code text primary key,
  name text not null,
  description text,
  access_product text not null default 'full',
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'eur' check (currency ~ '^[a-z]{3}$'),
  signature_included boolean not null default false,
  active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_orders (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_session_id text not null unique,
  provider_payment_intent_id text,
  product_code text not null references public.commerce_products(code),
  buyer_email text,
  amount_total integer,
  currency text,
  payment_status text not null default 'pending',
  license_id uuid references public.licenses(id) on delete set null,
  email_status text not null default 'pending',
  email_id text,
  terms_version text,
  immediate_access_acknowledged boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists commerce_orders_provider_payment_intent_uidx
  on public.commerce_orders(provider, provider_payment_intent_id)
  where provider_payment_intent_id is not null;

create index if not exists commerce_orders_buyer_email_idx
  on public.commerce_orders(lower(buyer_email));

create table if not exists public.commerce_webhook_events (
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  primary key (provider, event_id)
);

alter table public.commerce_products enable row level security;
alter table public.commerce_orders enable row level security;
alter table public.commerce_webhook_events enable row level security;

-- Service-role Edge Functions manage these tables.
-- There are intentionally no anon/authenticated policies.

insert into public.commerce_products
  (code,name,description,access_product,price_cents,currency,signature_included,active,metadata)
values
  ('one','ONE by WeddlySmartDesign',
   'Invitados, invitaciones y RSVP, mesas, pagos y planning conectados en una sola boda.',
   'full',0,'eur',false,false,
   '{"checkout_version":"v1","automatic_tax":false,"tax_behavior":"inclusive"}'::jsonb),
  ('one_signature','ONE + Signature by WeddlySmartDesign',
   'ONE completo con la colección premium Signature de invitaciones.',
   'full',0,'eur',true,false,
   '{"checkout_version":"v1","automatic_tax":false,"tax_behavior":"inclusive"}'::jsonb)
on conflict (code) do nothing;
