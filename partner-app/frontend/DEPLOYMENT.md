# ONE Partner frontend deployment

The file `partner-app/frontend/index.html` is the current real professional frontend.

## Mandatory origin isolation

Do not deploy the professional frontend under `https://weddlysmartdesign.github.io/`.

ONE and the couple authorization surface use that origin. A professional app on the same origin could access ONE browser storage. The professional frontend must therefore use a different origin.

Do not use the Supabase Edge Function or Supabase Storage as the final HTML host. They were tested and are not suitable for the final browser-rendered frontend in this project.

## Runtime dependencies

The frontend is static HTML/JS and talks directly to:
- Supabase Auth
- authenticated Partner RPCs
- the existing couple authorization URL at `https://weddlysmartdesign.github.io/partner-access.html?r=...`

No couple member capability is ever available in the professional browser.

## Required hosting properties

- HTTPS
- independent origin from ONE
- static HTML hosting
- SPA-style auth callback / password-recovery URL support
- no third-party script injection
- ability to set a custom domain later
- cache-control that allows predictable releases

## Before production

1. Deploy this exact frontend to the independent origin.
2. Add that origin to Supabase Auth redirect URLs.
3. Set password-recovery redirects to that origin.
4. Run the full Partner E2E suite.
5. Only after E2E passes should the Edge Function HTML version be retired as a UI surface.

