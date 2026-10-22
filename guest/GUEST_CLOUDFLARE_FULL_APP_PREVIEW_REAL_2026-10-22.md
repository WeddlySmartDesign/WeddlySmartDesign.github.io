# GUEST · Cloudflare — reconstrucción de la PREVIEW con aplicación completa (22/10/2026)

## Alcance y estado
**Exclusivamente GUEST, sin tocar ONE/Partner/STUDIO, sin activar cobros ni cambiar producción.**
La URL estable `https://guest-weddlysmartdesign.pages.dev/guest/index.html` servía erróneamente el HTML genérico de preproducción de 877 bytes, al igual que las URLs de candidatas que usaban el mismo builder. HTTP 200 no significa aplicación funcional.

## Causa raíz verificada
Cloudflare Pages usa el comando de compilación registrado:
`node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`.

El builder de GUEST, correctamente diseñado para una galería artística sin ventas, **solo copiaba los 15 masters visuales**, las rutas del cuestionario/revisión y una portada raíz sin acceso. No incluía el runtime de `guest/index.html`, sus módulos `guests-*.js`, el control de acceso, Ajustes, Eventos, RSVP ni el plano. Pages usa una respuesta fallback, devolviendo la portada de 877 bytes para rutas no publicadas, engañosamente con status 200.

## Corrección ejecutada en rama aislada
- **Rama GitHub:** `guest-cloudflare-full-app-preview-2026-10-22`, creada desde `guest-finalization-candidate-2026-10-22`, NO desde la rama de producción.
- Archivo modificado exclusivamente en esta rama: `guest/tools/build_catalog_static_preview.cjs`.
- Nuevo bloque condicionado al valor exacto `CF_PAGES_BRANCH=guest-cloudflare-full-app-preview-2026-10-22` (o `GUEST_FULL_APP_PREVIEW_QA=1` más bandera explícita de verificación en CI). Si no coincide, el constructor original se conserva.
- Agrega el runtime de la aplicación **con licencia**: `/guest/index.html`, `/guest/access.html`, `/guest/guest-settings.html`, Invitados V114, plano interactivo V081, eventos V3, RSVP privado y público, seguimiento Hoy, control documental, temas, sincronización, módulos JS y PWA. También se incluyen rutas secundarias enlazadas por RSVP para evitar falsos 200 fallback.
- Revisión visual/artística mantiene sus 15 masters y los SHA verificados, **sin cambios a los originales**.
- `/` continúa siendo portada de preproducción, añadiendo un enlace directo de acceso privado `/guest/access.html`. No hay enlace de compra activo ni se promociona tienda.
- `_headers` para esta rama exige `X-Robots-Tag:noindex`, CSP de origen restringido y `Cache-Control:no-store`, con API solo al proyecto Supabase GUEST ya existente. Aplicación protegida por `guests-access-layer.js` y licencia previamente entregada; no se crean accesos demo remotos.
- Los documentos internos `guest/GUEST_PROJECT_STATUS_V1.json`, source locks, informes QA y material confidencial no se copian al bundle público.

## Evidencias
- [Build de staging completo y sin ventas](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39783993013) — **SUCCESS**. Valida 15 masters SHA, manifiesto, control de acceso, scripts y ausencia de JSON internos.
- **Deploy Cloudflare de primer commit `fe448a633c39f008f7f0219203cfd1dec12c2c67`: COMPLETED / SUCCESS**. URL inmutable: `https://4ed5f3b4.guest-weddlysmartdesign.pages.dev`. Enlace de acceso preview: `https://4ed5f3b4.guest-weddlysmartdesign.pages.dev/guest/access.html`; aplicación autenticada: `https://4ed5f3b4.guest-weddlysmartdesign.pages.dev/guest/index.html`.
- [Verificación pública de HTTPS real](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39784380686) — **SUCCESS**: `/guest/index.html` contiene los scripts completos y supera tamaño de la portada, acceso, Ajustes, Invitados, plano, eventos, RSVP, JS, master Botánica grande, manifiesto 15 candidatos, `noindex`. Sin acceso a datos de terceros, sin pagos ni licencias.
- Se añadió mejora posterior `7c8ed28e23feb448fc1cf8053580d6f6c54bf568` para incorporar las redirecciones secundarias de RSVP y `guest.webmanifest`. **Confirmar check Cloudflare del commit posterior antes de anunciar URL nueva**, y volver a ejecutar HTTP contra esa URL. No reutilizar la URL antigua como evidencia de la mejora posterior.
- [Full regression 30/30](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39745953137) — SUCCESS para el código funcional base. Los 30 tests se ejecutaron contra la app en localhost; no certifican aún en vivo la ruta UI de un usuario con licencia.

## Restricciones y siguientes pruebas
1. La URL PREVIEW no es URL definitiva para clientes y se publica con `noindex`. No activar Stripe LIVE ni fusionar el PR #147/esta rama sin autorizarlo.
2. Navegación física móvil real y acceso de dos miembros con licencia/test después de entrega; verificar cache, CORS, CSP, impresión y multimedia; un HTTP 200 del HTML no lo certifica.
3. Dos compras reales en entorno Stripe TEST, recibo/email, formulario, aprobación, entrega, activación, RSVP y mesas/listados. No sustituir por 8 pedidos TEST anteriores sin checkout.
4. Publicación del sitio comercial mobile-first V5 y certificación por diseño, incluido Limoneros correcto, derechos de medios y precios.
5. Promoción a `guest-independent` y el dominio estable únicamente después de verificaciones y aprobación comercial; no actualizar por suposición la rama de producción de Cloudflare.

**Estado:** bloqueo técnico de empaquetado de app **resuelto en PREVIEW**, estado comercial `NO_GO`; los riesgos de las rutas LIVE y ventas continúan identificados.
