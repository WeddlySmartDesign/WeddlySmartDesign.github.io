# GUEST — Fase 11 · integración conjunta y PREVIEW aislada (20/10/2026)

**VENTA NO_GO. Producción, ONE/STUDIO y datos de clientes intactos.** Continúa la [fase 10](GUEST_AUDIT_CONTINUITY_PHASE10_CLOUDFLARE_PREVIEW_2026-10-20.md) con incidencia de «Lo esencial» de BOTÁNICA, pendiente de reparar después de las integraciones.

## Progreso independiente certificado
- [CI shadow-main 39461743474](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39461743474) **SUCCESS**: compuso virtualmente los cambios GUEST de [PR #144](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144) y [PR #145](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145) sobre `main` SHA exacto `1e7c81515b71f16105b68a928bb908cba702bebf` sin escribir ni desplegar main.
- [CI shadow-main navegador 39462831943](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39462831943) **SUCCESS**: 36/36 ficheros esperados (32 gestión exclusiva `guest/`, 4 de escaparate/checkout); enlaces locales, orden bridge/compositor, Javascript, sólo diseños individuales, bloqueo de venta y regresiones de frontend. Ejecutó **Chrome real headless** en viewport de escritorio y móvil emulado con **todos los destinos externos bloqueados**. Validó 15 fichas, CTA «Próxima apertura», rechazo del checkout sin diseño o con ID inválido, formulario de código GUEST y bloqueo de gestión sin sesión. **No equivale a dos teléfonos físicos, Stripe TEST ni E2E backend.**
- Se evitó un falso fallo inicial del corredor por el límite de buffer de 1 MiB al copiar un archivo grande: limitado de forma explícita a 64 MiB en el test; nueva CI verde.
- [CI constructor PREVIEW gestión 39463629881](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39463629881) **SUCCESS**: `guest/tools/build_guest_integration_preview_no_sale.cjs` crea un paquete de interfaz con solo archivos GUEST; no añade ONE/STUDIO ni media de designs. Encabezados CSP de escenario PREVIEW prohíben `connect-src`, formularios, iframes, workers, API remotas, Stripe, correos y cobros. Se verifica cada hash, `noindex`, y la ausencia de `catalog-assets`. **Esto sirve para UI aislada solamente; los flujos reales requerirán un entorno TEST aislado y más pruebas.**

## Nuevo intento de publicación aislada, con resultado externo pendiente de diagnóstico
- Se creó SIN tocar la rama production `guest-independent` la rama de preview `guest-integration-no-sale-preview-2026-10-20`, commit `595edae6a98645f17749ffa3687fe92787a0c6de`, derivada del HEAD `332a88120f5c75aa11fbe82639e89ed73bc588f9`.
- El único cambio respecto al HEAD base es `guest/tools/build_catalog_static_preview.cjs` que, solo en esta rama temporal, delega en el constructor GUEST de interfaz sin datos ni ventas, permitiendo conservar sin tocar la configuración global de producción de Cloudflare.
- Cloudflare Pages lanzó automáticamente el check para esta nueva rama (branch preview habilitado) y terminó con **FAILURE**. [Logs en panel de la implementación](https://dash.cloudflare.com/?to=/f029d3fb8f7ba933972945d4e57f31a2/pages/view/guest-weddlysmartdesign/30bb7b1c-09fc-4b86-9a64-de87a4b3d5bc). GitHub muestra `Cloudflare Pages — Build failed`, pero **no expone la línea causal**; CI builder GitHub con el mismo script había pasado. **No atribuir causa sin logs. No reintentar a ciegas.**
- Se requiere una **única intervención concreta** de titular desde su Chrome ya autenticado: abrir los logs de compilación de esa implementación, copiar o fotografiar la línea roja/error final, sin modificar configuraciones ni desplegar otra vez. A partir de esa evidencia, corregir exclusivamente la rama PREVIEW y volver a validar.
- No fusionar [PR #144](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/144) / [PR #145](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/145) sin autorización explícita: GitHub Pages `main` alberga GUEST existente y publicarlas antes de E2E real puede afectar a clientes o compras.

## Estado exacto
| Control | Estado |
| --- | --- |
| PREVIEW 16 diseños `eebba5b2` e integridad HTTPS | **PASS**, no cambia |
| BOTÁNICA PC «Lo esencial» cuadro visible | **BUG ABIERTO**, corregir tras integración y antes de venta |
| Código GUEST + escaparate integrados (simulación navegador sin red) | **PASS** |
| Constructor seguro de PREVIEW de integración (GitHub CI) | **PASS** |
| Despliegue Cloudflare PREVIEW de integración | **FAIL**, pendiente logs precisos |
| Fusión en main y circuitos Stripe TEST, correo, entrega, RSVP, móviles reales | **PENDIENTE**, no autorizados |
| Cobros y venta | **NO_GO** |

No volver a reconstruir ZIP 16 diseños, no cambiar configuración global, no tocar material maestro, no autorizar venta por QA estática.
