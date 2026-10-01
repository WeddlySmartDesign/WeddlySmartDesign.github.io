# GUEST B9.6 — Supabase security isolation audit
Date: 2026-10-01

## Result
PASS for the GUEST release surface.

## Verified
- All `public.guest_*` tables inspected have RLS enabled.
- No direct `anon` / `authenticated` table grants were found for the GUEST tables in the release circuit.
- `public.guest_webhook_secret()` is SECURITY DEFINER but EXECUTE is restricted to `service_role`.
- `public.provision_weddly_license(...)` is SECURITY DEFINER and EXECUTE is restricted to `service_role`.
- `public.activate_weddly_license(...)` is SECURITY DEFINER and EXECUTE is restricted to `service_role`.
- GUEST browser surfaces reach data through dedicated Edge Functions/custom tokens rather than direct privileged database access.

## External/shared-project advisory
Supabase also reports `public.normalize_weddly_license_inactive()` executable by anon/authenticated. This is a shared legacy Weddly license function, not a GUEST-specific release primitive. It is deliberately NOT modified in this branch because doing so could alter ONE/Partner/other frozen products.

Other Supabase advisor findings belonging to Partner, ONE or unrelated shared-project tables are outside the GUEST isolation boundary and must not be changed from this project.

## Gate
GUEST B9 security passes only while the three privileged functions above remain service-role-only and public GUEST pages expose no service-role credentials.
