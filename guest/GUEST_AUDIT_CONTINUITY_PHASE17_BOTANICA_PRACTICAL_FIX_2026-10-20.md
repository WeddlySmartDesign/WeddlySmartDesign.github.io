# GUEST · Fase 17 · reparación visual acotada BOTÁNICA «Lo esencial» (20/10/2026)

Continuidad tras [Fase 16](GUEST_AUDIT_CONTINUITY_PHASE16_FIRST_REAL_STRIPE_TEST_2026-10-20.md).

## Incidencia comunicada
La propietaria observó en Chrome de escritorio un rectángulo/cuadro visible en la sección **«Lo esencial»** de BOTÁNICA V14.7 durante la revisión de la PREVIEW `eebba5b2.guest-weddlysmartdesign.pages.dev`. Existía grabación `20261020-1638-31.6856796.mp4`. El recorrido restante le pareció correcto. La causa **más probable en análisis de código** es la silueta de la capa de vídeo rectangular `.late-world > .film-breath`, de ancho `min(110vw,650px)`, altura proporcional `540/946`, visible con opacidad ~0.70 sobre papel. No se ha realizado inspección fotograma-a-fotograma del vídeo aportado, por lo que no confundir hipótesis CSS con diagnóstico visual humano de producción.

## Corrección realizada SIN tocar originales ni producción
- Original congelado BOTÁNICA V14.7: los **22 archivos** `guest/catalog-assets/botanica/14.7/source-chunks` se concatenan en 11.635.635 bytes, y mantienen SHA256 original `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`. V14 original visual aceptada también permanece intacta.
- Nuevo manifiesto `guest/catalog-patches/botanica/14.7/patch-manifest.json`, anclado a **esa SHA exacta**, con `commercialRelease:false` y `patchMode:css-only`. CSS `guest/catalog-patches/botanica/14.7/patch.css` aplica **solo** a `.late-world > .film-breath`, y únicamente a pantallas de **700 px o más**: máscara CSS radial con degradado transparente hacia el borde, conservando el vídeo, su movimiento y la zona central. NO altera estilos de foto, textos, enlaces, Agenda, Galería, Cierre, ni layout de móvil menor de 700px.
- Se amplió exclusivamente `guest/tools/build_catalog_static_preview.cjs` para admitir parche de estilo inyectado en `</head>` bajo allowlist de modo `css-only`, con controles de manifest, SHA, ancla única, sin JS y sin posibilidad de cambiar los masters. El modo anterior `patch.js` usado por otros diseños sigue funcionando igual.
- `guest/qa/botanica_practical_seam_desktop_browser_2026_10_20.cjs` verifica que **al eliminar el único fragmento CSS inyectado, el HTML de staging vuelve a coincidir byte a byte con V14.7**; verifica el SHA del original y 4 anchuras Chromium: 1440, 768, 390, 320 px; comprueba máscara solo en escritorio, vídeo conservado, título/texto, botones, sin desbordamiento horizontal ni errores JS y toma capturas de «Lo esencial» como artefactos.
- **[GitHub Actions 39475897384](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39475897384) COMPLETED/SUCCESS** — 4 tamaños Chrome con CSS realmente calculado.
- Se corrigió el viejo check `guest-static-stage-package.yml` que suponía erróneamente que un *master parcheado para PREVIEW* tendría el mismo SHA que el original. Ahora verifica master original reconstruido SHA, inyección CSS exacta y hash del archivo publicado indicado en manifiesto.
- **[GitHub Actions 39476440097](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39476440097) COMPLETED/SUCCESS** — paquete completo 15 fichas + 109 recursos, sin publicar ni activar venta. FALLOS históricos transitorios en runs 39475629829 y 39476152328 eran comprobaciones SHA obsoletas/de salto de línea en el TEST, no fallo visual; ambos corregidos antes del run final. No ocultarlos.

## PREVIEW GitHub separada
- Rama nueva **`guest-botanica-practical-desktop-fix-preview-2026-10-20`**, derivada del SHA fuente `e3fbb4c71bd94abf2fa7cbe99e4b349788946b49`; commit de disparo del despliegue `8bf9f71a0e50867970f26e5facda2d11d9e0343f` con únicamente fichero de lectura en rama PREVIEW.
- **PENDIENTE de confirmar en Cloudflare URL inmutable del despliegue y funcionamiento remoto**. No afirmar que se haya publicado con éxito por crear rama. El anterior `eebba5b2` NO se modifica y sigue siendo referencia antes de la reparación.

## Estado
**Corrección CSS creada + CI local/browser PASS, pero NO certificar visual final sin validar el resultado publicado contra el defecto observado por la propietaria.** Mantener NO_GO comercial; no tocar `main`, ONE/STUDIO, Stripe, Supabase ni licencias. Después de PREVIEW remota comprobar en el PC que el rectángulo ha desaparecido y en Android que no hay regresión; si persistiese, analizar otra capa en vez de ocultar elementos indiscriminadamente.


## Cierre técnico adicional: paquete BOTÁNICA aislado descargable (20/10)
- [GitHub Actions **39478510394**](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39478510394) **COMPLETED/SUCCESS** empaquetó una revisión visual **exclusivamente BOTÁNICA V14.7 corregida** para desplegar en una PREVIEW separada, sin copiar el catálogo completo ni habilitar cobros.
- Artefacto descargable desde la sección **Artifacts** del run: `BOTANICA_LO_ESENCIAL_CORREGIDA_PREVIEW_NO_VENTA_2026-10-20` (artifact ID 12289778552, ZIP comprimido 8.708.639 bytes). Contiene exactamente el HTML de BOTÁNICA con máscara y medios embebidos, landing visual neutra, `_headers` `noindex` y manifiesto SHA256 de los archivos. Cualquier ZIP sin ese nombre/manifiesto debe rechazarse.
- **No está publicado todavía por Cloudflare**: rama `guest-botanica-practical-desktop-fix-preview-2026-10-20` creada con control GitHub, pero sus commits `8bf9f71` y `68d500f` no recibieron check Cloudflare Pages, incluso tras disparador de raíz; PR temporal #146 DRAFT cerrada **SIN MERGE**.
- Para mostrar solo esta corrección sin alterar la PREVIEW de 16 entradas ya publicada, desde PC autorizado: descargar artefacto, extraer en carpeta nueva, abrir CMD en raíz con `index.html`, ejecutar una sola orden `npx --yes wrangler@4 pages deploy . --project-name guest-weddlysmartdesign --branch guest-botanica-lo-esencial-fix-2026-10-20`. Esta rama es distinta de `guest-independent`; deberá verificarse etiqueta **PREVIEW** y URL inmutable en consola, luego ver `Lo esencial` en desktop y móvil. Antes de ese check no marcar visual definitiva como PASS.
- `main` constatada intacta en `1e7c81515b71f16105b68a928bb908cba702bebf`. Ningún pago, licencia o Supabase tocado; prod y vieja PREVIEW `eebba5b2` conservados.


## Cierre visual confirmado por la propietaria (20/10/2026, desde PC)

**RESULTADO: APROBADO — incidencia «cuadro rectangular en Lo esencial» resuelta visualmente.**

La propietaria hizo el deploy mediante `wrangler 4.151.3` del artefacto aislado `BOTANICA_LO_ESENCIAL_CORREGIDA_PREVIEW_NO_VENTA_2026-10-20` en el proyecto Cloudflare Pages existente **`guest-weddlysmartdesign`**, rama PREVIEW **`guest-botanica-lo-esencial-fix-2026-10-20`**. La consola mostró literalmente `Success! Uploaded 2 files (1 already uploaded)` y `Deployment complete!`, con URL **inmutable**:
**https://55620fad.guest-weddlysmartdesign.pages.dev**

Ruta completa para revisión:
**https://55620fad.guest-weddlysmartdesign.pages.dev/guest/catalog-assets/botanica/14.7/**

El usuario abrió y revisó en su ordenador el diseño corregido y confirmó expresamente: **«ya se ve bien»**. Se acepta la corrección estética de esa incidencia; **no solicitar volver a corregir el mismo defecto salvo regresión nueva demostrada**.

Pruebas existentes: [Chrome cuatro tamaños — PASS](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39475897384), [staging con SHA original — PASS](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39476440097), [ZIP exclusivo BOTÁNICA — PASS](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39478510394). El máster original `botanica/14.7` permanece INMUTABLE. El parche CSS está versionado en `guest/catalog-patches/botanica/14.7/patch.css`, aplicado por el constructor de PREVIEW `guest/tools/build_catalog_static_preview.cjs`.

**Alcance exacto de la aprobación:** visual de «Lo esencial» **PC**, no certificación visual individual de dos teléfonos físicos ni validación completa de funciones comerciales. El parche actual se publica **solo en PREVIEW**. Al hacer el futuro lanzamiento comercial, habrá que utilizar el pipeline que incorpora este parche (o trasladarlo mediante una capa versionada equivalente) y comprobar el diseño final servido; **NO reemplazar el master congelado por una versión manual ni asumir que cualquier pipeline comercial lo aplica automáticamente**. `commercialRelease:false` y **NO_GO** de venta permanecen hasta las pruebas E2E y el consentimiento comercial.

`main`, producción, ONE, STUDIO, Supabase, Stripe LIVE y datos de clientes NO se modificaron con la corrección.
