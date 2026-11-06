-- GUEST · panel de colaboradores (proveedores que recomiendan GUEST bajo comisión)
-- guest_partners: una fila por colaborador. 'token' es el secreto de su enlace privado (#k=...).
-- guest_partner_paid: una fila por venta ya abonada (así no se paga dos veces).
-- Ambas tablas solo se leen/escriben desde la función guest-partners (clave de servicio).
create table if not exists public.guest_partners (
  slug text primary key,
  name text not null,
  email text,
  token text not null unique,
  pct numeric not null default 15,
  fixed_cents integer,
  active boolean not null default true,
  test boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);
create table if not exists public.guest_partner_paid (
  order_id uuid primary key,
  partner_slug text not null references public.guest_partners(slug),
  cents integer not null,
  paid_at timestamptz not null default now(),
  note text
);
alter table public.guest_partners enable row level security;
alter table public.guest_partner_paid enable row level security;
