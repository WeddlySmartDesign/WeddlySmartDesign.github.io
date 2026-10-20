# GUEST · Fase 10 · Cloudflare PREVIEW 16 publicada y verificada (20/10/2026)

**Fuente canónica:** rama `guest-independent` y [auditoría fase 9](GUEST_AUDIT_CONTINUITY_PHASE9_FINAL_SURPRISE_AUDIT_2026-10-20.md). **Estado de venta: NO_GO.**

## Observación del despliegue aportada por la titular
- Cloudflare Pages, proyecto exclusivo: `guest-weddlysmartdesign`.
- La titular abrió el panel correctamente desde Chrome (el navegador de Work devolvía 403 de Cloudflare) y confirmó haber desactivado las **implementaciones automáticas de la rama de producción** `guest-independent`. No se modificó la rama de producción ni los ficheros originales.
- Se descargó desde la Biblioteca el ZIP verificado `GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip` (SHA256 `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`), y se extrajo en Windows.
- Wrangler 4.151.3, Node 24.22.0 y npm 11.19.1 comprobaron acceso OAuth y proyecto correcto.
- Orden exacta usada desde la carpeta extraída:
  `npx --yes wrangler@4 pages deploy . --project-name guest-weddlysmartdesign --branch guest-preproduction-16-2026-10-20`
- La consola declaró: **`Success! Uploaded 14 files (107 already uploaded)`**, `Uploading _headers` y `Deployment complete!`. Total 121 ficheros de staging, ZIP con 122 entradas incluyendo manifiesto no publicado por separado.
- **URL inmutable de ese PREVIEW (confirmada en consola):** `https://eebba5b2.guest-weddlysmartdesign.pages.dev`
- **Alias PREVIEW de rama:** `https://guest-preproduction-16-2026-10-20.guest-weddlysmartdesign.pages.dev`
- Ambas URLs son PREVIEW, NO producción. La URL principal de producción sigue siendo `https://guest-weddlysmartdesign.pages.dev`.

## Verificación REAL por Internet completada sin pedir intervención extra
- Se adaptó `guest/qa/verify_guest_preview_manifest_2026_10_20.py` para admitir los **dos hashes de manifiestos de staging permitidos** (ZIP de fase 5 y recuperación de fase 6) solo cuando coinciden TODOS los 121 triples `nombre/tamaño/SHA256` con la referencia canónica y las 16 identidades (id, versión, estado). No admite nuevos hashes ni variantes fuera de esta allowlist.
- Se añadieron pruebas negativas en `guest/tests/preview_verifier_offline_security_2026_10_20.py`.
- Se creó `.github/workflows/guest-preview-16-live-integrity.yml` en `guest-independent` con origen HTTPS exacto **`eebba5b2`**, sin secretos, datos, pagos, pedidos ni escritura a Cloudflare. El workflow comprueba manifiesto remoto SHA de origen, **120 ficheros servidos por HTTPS con SHA256/tamaño exactos**, y efecto `X-Robots-Tag: noindex`; `_headers` es configuración Cloudflare no descargable (archivo número 121 fijado por hash), y comprueba **16 renderizadores con rutas/versiones válidas**, excluyendo la comercialización de D03 histórico.
- **[GitHub Actions 39457669846](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39457669846) — COMPLETED / SUCCESS.** Job `verify-preview-only`: tests offline PASS, comprobación HTTP real PASS, informe subido. Es evidencia técnica de contenido PREVIEW y no de funcionamiento visual o comercial.
- **No se accedió ni se modificó Stripe, Supabase, Resend, ONE, STUDIO o production**, ni se habilitó venta.
  
## Lo que sigue — no confundir con E2E superado
1. La titular abre el **alias PREVIEW en Chrome** y confirma que se ve la portada de “GUEST by WeddlySmartDesign · Entorno de revisión visual”; probar acceso a los diseños y la animación/video en móvil real, en particular D09 Limoneros frente a su aprobado. El validador de SHA no es navegador visual.
2. Revisar individualmente diseños y corregir exclusivamente fallos demostrados en staging, sin modificar master original.
3. Preparar y validar integración segura de GUEST en GitHub Pages mediante [PR #144 DRAFT](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144) y [PR #145 DRAFT](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145), con autorización expresa para publicar tras regresiones; no fusionar por tener PREVIEW verde.
4. Stripe TEST **aislado** de las claves LIVE compartidas; dos recorridos auténticos con envío/recepción de Resend, revisión, aprobación, entrega, acceso posterior a entrega, RSVP sí/no y sincronización de dos móviles; sin datos de clientes ni pagos Live.
5. Decisión de titular sobre precios, derechos de música/fonts/videos, privacidad, licencias, diseños específicos y GO. Mantener bloqueo `NO_GO` hasta cierre y verificación.

**Nota:** la validación del enlace desde el navegador web automatizado de este chat devolvió “no accesible” (limitación de esa herramienta). La evidencia de HTTP proviene de una ejecución independiente GitHub Actions con salida **SUCCESS**, no de afirmar haber navegado visualmente la invitación.


## Incidencia visual nueva detectada por la titular en PREVIEW (20/10, después del primer recorrido PC)
- **Diseño:** BOTÁNICA, versión `14.7` en `https://eebba5b2.guest-weddlysmartdesign.pages.dev/guest/catalog-assets/botanica/14.7/`.
- **Zona:** «Lo esencial» / bloque de información práctica.
- **Síntoma observado por la titular:** se aprecia un **cuadro / rectángulo** no deseado durante el recorrido en **PC/escritorio**. Dice que el recorrido general funciona bien y sospecha que no se detectó en móvil por resultar menos visible. Existe grabación de pantalla enviada en la conversación del 20/10/2026, archivo `20261020-1638-31.6856796.mp4`. **No se ha caracterizado aún la causa ni confirmado el mismo fallo en móvil; no inventar causa ni marcar como solucionado.**
- **Decisión de orden solicitada por la titular:** primero terminar de **vincular/integrar** GUEST (gestión, catálogo individual, pruebas aisladas), luego corregir el cuadro de BOTÁNICA. **El diseño NO recibe aprobación visual final ni se puede vender hasta corregir y comprobar en PC y móvil.** El orden no autoriza publicar LIVE, tocar masters congelados, fusionar PR sin pruebas ni activar pagos.
- **Criterio de cierre del defecto:** analizar el elemento que forma el cuadro, parche acotado, prueba de regresión PC/Android sobre «Lo esencial», contraste de diseño íntegro y confirmación de propietaria. No modificar originales innecesariamente.

## Alias PREVIEW
La propietaria abrió el alias largo de rama `guest-preproduction-16-2026-10-20.guest-weddlysmartdesign.pages.dev` en Chrome y obtuvo la página Cloudflare **“Nothing is here yet”**. La URL individual **`eebba5b2.guest-weddlysmartdesign.pages.dev` sí funcionó**, mostró portada y abrió BOTÁNICA V14.7, además del PASS íntegro GitHub Actions. El alias no debe usarse como enlace de aceptación hasta diagnosticarlo; mantener URL individual como referencia comprobada. No confundir con fallo de archivos o revertir preview correctamente publicado.
