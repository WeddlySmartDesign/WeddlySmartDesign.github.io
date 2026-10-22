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


## Cierre de publicación real de la PREVIEW (segunda revisión)
- Commit Cloudflare `7c8ed28e23feb448fc1cf8053580d6f6c54bf568`: **SUCCESS**, URL inmutable `https://265a5e27.guest-weddlysmartdesign.pages.dev`.
- Ruta real **de acceso privado**, funcional a nivel de HTTP y CSS/JS: `https://265a5e27.guest-weddlysmartdesign.pages.dev/guest/access.html`.
- Ruta real **de aplicación autenticada**: `https://265a5e27.guest-weddlysmartdesign.pages.dev/guest/index.html`.
- También publica rutas secundarias de RSVP v3/v114, `guest.webmanifest` y las hojas/script necesarios sin fallback.
- [GitHub Actions 39785011784](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39785011784) — **SUCCESS: HTTP real de rutas de acceso, app protegida, invitados, mesas, eventos, archivos JS, subrutas RSVP, webmanifest, Botánica 11 MB, manifiesto de 15 candidatos y cabecera noindex**.
- [GitHub Actions 39784651694](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39784651694) — **SUCCESS: reconstrucción fuente→bundle con 15 masters SHA, scripts de acceso GUEST, sin cobros ni secretos**.
- El alias anunciado por Cloudflare para la rama puede ser `https://guest-cloudflare-full-app-pr.guest-weddlysmartdesign.pages.dev`. **Preferir enlace inmutable `265a5e27`**, no depender del alias para certificar una revisión fija.
- URL estable `https://guest-weddlysmartdesign.pages.dev/guest/index.html` **sigue sin publicar la app**: es portada de preproducción hasta la promoción comercial autorizada.
- No se ha probado autenticación E2E de un cliente verdadero en el dominio PREVIEW ni se ha hecho ningún cobro, envío real o modificación de pedido. **Estado comercial NO_GO**.


## Auditoría ampliada de integridad y acceso (22/10/2026, continuación)

- **Previsualización reparada para marcos del mismo origen:** el CSP generado originalmente contenía `frame-ancestors 'none'` sobre todas las rutas de GUEST, lo que impedía incrustar el motor `guests-v114-integrated.html` en la pantalla `guest/index.html` aunque `frame-src 'self'` estuviera permitido. En `guest-cloudflare-full-app-preview-2026-10-22`, se corrigió a `frame-ancestors 'self'` (solo el dominio propio, no terceros). Despliegue PREVIEW [`703d2f0`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/commit/703d2f0dabd9f3988f9d951b379353502d208718) **SUCCESS** en `https://bc6b3fa9.guest-weddlysmartdesign.pages.dev`.
- **Integridad total de recursos CDN:** [GitHub Actions run 39787401560](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39787401560) **PASS: 223 archivos reales publicados descargados por HTTPS y comparados con el manifiesto en tamaño y SHA256 exactos, incluidos 15 masters visuales**. El mismo comprobador contra `https://775213e7.guest-weddlysmartdesign.pages.dev` [run 39788551824](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39788551824) **PASS 223/223** tras la corrección adicional de sincronización. En ambos casos, esta verificación **no certifica** navegación de cliente con licencia o comercialización de masters.
- **Rechazo explícito de licencia sin abrir caché:** `guest/guests-production-sync.js` (rama candidata y rama Cloudflare PREVIEW) ahora distingue `401/403` auténticos del servidor de un error de red; **no abre datos locales cuando la licencia ha sido revocada** y ofrece recuperar acceso válido. En cambio, cuando falla físicamente la red, el acceso offline ya implementado sigue permitido para sesiones previamente configuradas. [Código revisado](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/blob/guest-finalization-candidate-2026-10-22/guest/guests-production-sync.js).
- **Validación navegador contra HTTPS público:** workflow `guest-cloudflare-browser-real-preview-2026-10-22.yml` prepara escenarios sintéticos (sin tokens reales) de no token, `401/403`, red caída, RSVP 20 personas, colores y compartir, en móvil Chromium. La comprobación simple del archivo remoto puede fluctuar durante propagación de CDN; se introdujo retry y diagnóstico de tamaño, manteniendo comprobaciones estrictas. No contar como PASS hasta consultar el run verde más reciente.
- **Diagnóstico independente de variación por perfil HTTP**: [run 39789068892](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39789068892) **SUCCESS** con ambas modalidades `curl` y `Accept-Encoding: identity`; HTML genuino 4.238 bytes SHA `ec00589bb9e129cd96234bb2e71796662e1f83ac9918d4081a1f17d68a1c9117`, no portada de 877 bytes. No inferir fuga de datos ni mala configuración a partir de un único fallo de shell; seguir evidencia.
- **Pruebas de unidad de la rama candidata:** [GUEST Finalization Candidate run 39788015062](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39788015062) **SUCCESS** tras reforzar revocación; una prueba de navegador negativo específica `guest/qa/access_revoked_vs_offline_browser_2026_10_22.cjs` permanece disponible en ambas ramas.

**PENDIENTES NO ALTERADOS:** Stripe TEST dos pedidos, autoemail/comprobación de rebotes, cuestionario→diseño→aprobación→entrega→licencia real, dos móviles físicos, publicación web comercial móvil V5, precios/derechos de diseños, fusionado/documentación de GO. Ni PREVIEW protegida ni SHA verificado justifican activar LIVE.


## 22/10/2026 — Navegador real, seguridad de revocación y PWA
**Trabajo realizado sin intervenir producción, cobros ni datos reales:**
- [GitHub Actions Chrome real en Cloudflare 39793573548](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39793573548) **SUCCESS**. Ejecuta sobre el origen HTTPS de PREVIEW con backend sintético interceptado: GUEST carga el iframe **real** de Invitados, Hoy, navegación y respuesta de estado; un token explícitamente revocado (403) **no** descubre datos de una boda almacenados localmente. No equivale a comprobar una licencia comercial real.
- **Causa del fallo previo del navegador:** Pages canonicaliza `/guest/guests-v114-integrated.html` a `/guest/guests-v114-integrated`, y una aserción de QA buscaba solamente la primera terminación. Se actualizó el test para admitir ambas formas; no se renombró el motor ni se debilitó el acceso.
- **Privacidad:** `guest/guests-production-sync.js` ya distingue una red caída de un token revocado `401/403` y no abre caché de datos cuando el servidor lo rechaza. La validación explícita de red caída continúa probándose con HTTP simulado.
- **PWA offline:** `guest/guest-sw.js` abandonó el antiguo `guests-v116-production.html` y ahora precarga atomícamente 44 archivos del motor actual, excluyendo consultas API y parámetros de enlace; URL limpias de Cloudflare (sin `.html`) mapean al archivo HTML exacto ya almacenado. **La prueba local de contrato y empaquetado debe quedar verde en el último commit antes de certificar offline**. No confundir precaché verificada con prueba física real Android/iPhone.
- [Integridad CDN 39788551824](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39788551824) **PASS 223/223** tamaños y SHA-256 de todos los archivos públicos, 15 modelos incluidos. Se ejecutó contra la versión de la PREVIEW anterior a los cambios de PWA; el paquete nuevo volverá a verificarse antes de su certificación.
- **Regresiones extensas HTTPS en curso:** el workflow `guest-cloudflare-browser-real-preview-2026-10-22.yml` está configurado para Chrome del runner y comprueba Hoy/Invitados, móvil, 20 RSVP, roles al compartir, temas y token revocado sin compras ni escrituras remotas. No declarar PASS hasta ver el resultado en GitHub Actions.
- **Ramas de intervención:** `guest-finalization-candidate-2026-10-22` para solución revisada y `guest-cloudflare-full-app-preview-2026-10-22` para publicación aislada. El sitio comercial estable y el `main` no se sustituyen.

**GO_COMERCIAL = NO.** Siguen las pruebas de dos compras Stripe TEST completas, enlace real de cuestionario, máster/visor final, aprobación, entrega con licencia, correos, RSVP público, dos dispositivos físicos, web comercial móvil V5, derechos de medios y decisión final. No activar cobros antes de certificar.
