# GUEST — Publicación de Botánica en Cloudflare Pages Free (sin tocar ONE/STUDIO)

**Fecha:** 10/10/2026 · **Alcance:** preproducción. No habilita ventas, no cambia `main`.  
**Autorización de la propietaria:** "Te autorizo", relativa a conseguir un alojamiento gratuito y cerrar integración, conservando **coste incremental 0 €**.

## Decisión confirmada

- Cloudflare Pages Free permite archivos individuales de hasta **25 MiB** y solicita **0 € por las peticiones a archivos estáticos**. Botánica ocupa 11.635.635 bytes y cabe.
- Cuenta Cloudflare **NO conectada** a ChatGPT. No hay conector Cloudflare disponible ni credenciales Cloudflare en el entorno de ejecución. Nadie ha iniciado sesión ni ha creado un Pages de la propietaria. Por tanto **NO existe una URL pública de Botánica comprobada**.
- Vercel vinculado usa plan **Hobby**, no es la opción autorizada para venta comercial; no se altera. No usar GitHub Pages `main`, ONE, ONE Partner, STUDIO ni Railway.
- Para evitar que la propietaria tenga que subir un ZIP por cada diseño, se ha preparado **Cloudflare Pages Git integration** sobre **únicamente la rama `guest-independent`**. La integración de Git requiere OAuth directo de la propietaria, que el asistente no puede conceder desde su chat.

## Una sola conexión externa necesaria (pasos exactos)

1. Abrir **https://dash.cloudflare.com/**, crear o acceder a una cuenta gratuita (sin comprar plan ni dominio).
2. **Workers & Pages → Create application → Pages → Connect to Git**.
3. Autorizar GitHub y seleccionar **solo** el repositorio `WeddlySmartDesign/WeddlySmartDesign.github.io`. La rama de producción de este **nuevo proyecto Cloudflare GUEST** debe ser **`guest-independent`**, NUNCA `main`.
4. Configuración de despliegue estático:
   - **Project name**: `guest-weddlysmartdesign` (si está ocupado, elegir otro; no predecir la URL).
   - **Framework preset**: `None` / sin framework.
   - **Root directory**: raíz del repositorio (vacío o `/`, nunca `guest/`).
   - **Build command** (copiar literalmente): `node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`
   - **Build output directory**: `dist`
   - **Environment variable de build** (si es necesaria para runtime): `NODE_VERSION=22`.
   - **Plan**: Free 0 €; no activar Workers de pago, funciones, claves de Stripe o facturación.
5. Pulsar **Save and Deploy**. Guardar URL real de `*.pages.dev` que devuelva Cloudflare. **No declarar éxito sin URL HTTPS abierta a un usuario anónimo**.

El build reconstruye el master V14.7 desde **22 partes de texto** en la rama GUEST, valida SHA256 exacto, incluye el cuestionario común, las páginas de revisión y entrega y una **portada de preproducción noindex, sin pagos**. Si falla SHA o falta cualquier parte, el build debe fracasar. El proyecto no publica ONE, STUDIO ni la web comercial principal.

**IMPORTANTE:** El comando correcto es absoluto `"$PWD/dist"`. No usar `dist` a secas porque el packager lo deniega expresamente para evitar rutas equivocadas.

## Prueba de aceptación tras publicar (responsabilidad del asistente)

1. Abrir en navegador anónimo `https://HOST-REAL.pages.dev/`. Debe mostrar "GUEST by WeddlySmartDesign" y estado de revisión sin comprar.
2. Abrir `https://HOST-REAL.pages.dev/guest/catalog-assets/botanica/14.7/index.html`; comprobar respuesta 200, tamaño real completo, vídeo, animaciones y diseño en Android. SHA del repositorio: `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`.
3. Verificar la carga HTTPS de `/guest/catalog-questionnaire.html`, `/guest-review-v1.html` y `/guest/catalog-final.html`. Sin un token válido las páginas deben denegar acceso; no mostrar datos reales, secretos ni HTML original en modo comercial.
4. Verificar `/guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json` como **registro de staging**; el canónico del repo permanece `botanica.status='certification-pending'`, `src:null`.
5. Usar el dominio **exacto confirmado** para configurar una sola vez en la función **solo GUEST** la variable de entorno `GUEST_CATALOG_PUBLIC_ORIGIN` (V14). Si no se puede configurar con el conector, se precisará una acción delegada/ajuste explícitamente autorizado; **no cambiar `WEDDLY_SITE_ORIGIN`**.
6. Certificar pedido, formulario, publicación, capacidades `p/rt/g/u/lang`, RSVP contra `https://weddlysmartdesign.github.io/guest/guests-rsvp-v105.html`, persistencia y gestor. Dos casos con datos sintéticos completamente distintos, sin cobros a clientes.
7. Revisión real en Android. **No abrir el cobro de Botánica** hasta documentar **11/11 PASS**, edición/precio real aprobados y pruebas reales, aparte del entorno de preproducción.

## Escalabilidad para diseños 03…N

El único material nuevo será **HTML visual aprobado + `visual-plugin.json`**; si su tamaño impide la subida directa por la API GitHub disponible, el mismo emisor lo divide en fragmentos y actualiza el manifiesto inmutable. El packager es genérico por `--template id`, reconstruye el material con hash, usa el cuestionario, renderizado, checkout y RSVP compartidos. No inventar nuevas funciones Edge ni licencias por diseño.

## Fuentes y seguridad

Cloudflare Direct Upload permite ZIP mediante su dashboard, pero un proyecto creado así no puede convertirse más tarde a Git integration. **Elegir Git integration desde el principio** para evitar trabajo manual con futuros diseños.

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/

**Seguridad:** No solicitar contraseñas ni tokens en el chat, no insertar secretos en el repositorio, no alterar `main`. La integración Git puede leer el repositorio autorizado, pero la compilación produce exclusivamente `dist` con GUEST y no ejecuta despliegues de ONE/STUDIO. La versión de cloud actual sigue **invitaciones V14 y checkout V22**, Botánica **NO-GO / 3 de 11** mientras no se hagan las pruebas.
