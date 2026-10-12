# Entrada 85 — Limoneros D03: parche editorial HTTPS comprobado y comportamiento del cuestionario (12/10/2026)

## Estado real y alcance de esta entrada

Se continúa desde Entrada 84 sin recibir ni modificar de nuevo los vídeos, fondos, ZIP ni máster visual original. D03 permanece **`certification-pending`, TEST-only, NO SALE**. NO modificar VEIL LIGHT, Botánica, ONE, ONE Partner, STUDIO, master/main ni pagos/Stripe.

### 1. Publicación online certificada para visualización TEST

- GitHub Actions «GUEST Limoneros Real Published Preview QA», run [38235402146](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38235402146): **SUCCESS**. Antes, el último informe online existente estaba en falso por `CATALOG_TEMPLATE_UNCERTIFIED_OR_DRIFT:design-03`, una discrepancia del campo de estado reparada en Entrada 84. No se consideró válida aquella prueba histórica.
- Informe persistente **`guest/qa-reports/limoneros_cloudflare_live_check.json`**, `checkedAtUtc=2026-10-12T10:17:45.387246+00:00`.
- URL real TEST: https://guest-weddlysmartdesign.pages.dev/guest/catalog-assets/design-03/1.0.0/index.html
- **HTTP 200**; HTML servido **idéntico byte a byte** al compilado de este parche: **1.033.961 bytes**, SHA256 `435b3aa79ea1f2bde68bbf7050c5618b1bbfdd6e8c5fc60d513fd75504e3dce9`; `noindex` confirmado.
- Parche CSS de botones/jerarquía editorial embebido, SHA256 `e19a077141b050815b8cf058018d14e71764486689ac5d1d698b2fc3600e2ef8`.
- Parche JS de correspondencia de cuestionario embebido, SHA256 `8cbb606cda910dc6c0d8fc8b5216c14249079ae79baf9aacbc826daf75f7e767`. Se comprobaron `limonerosClosingIntro` y `pickupPoints` dentro de la versión pública, no solo en el código fuente.
- **15/15 multimedia HTTP 200 + SHA y tamaño exacto**: dos vídeos MP4 y 13 imágenes JPG. Máster original sigue SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`. No se ha alterado ninguno.
- Cambio permanente: `.github/workflows/guest-limoneros-live-probe.yml` ahora se dispara también con modificaciones al parche D03, estado o registry; verifica que el parche incorporado coincide con Cloudflare, persiste evidencia y **falla el workflow si la publicación no coincide**. Antes el workflow podía terminar en verde pese a guardar `online:false`.
- Cambio permanente genérico: `.github/workflows/guest-static-stage-package.yml` recompila también al cambiar parches, estado o registry. Run [38235417193](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38235417193) **SUCCESS**, empaquetado precomercial seguro **NO LIVE/NO SALE**.

### 2. Prueba dinámica del cuestionario, sin simular que es producción

- Nuevo `guest/tests/limoneros_questionnaire_runtime_mapping.test.cjs`, incorporado a `guest/qa/catalog_preflight_v2.cjs`.
- Ejecuta de verdad `patch.js` en VM Node con un doble DOM determinista, no se limita a comprobar cadenas en el archivo: un cuestionario sintético **con cuatro módulos activos** (transporte, alojamiento, regalos, playlist), otro con **todos desactivados** y cierre opcional nulo, y variante de enlaces peligrosos bloqueados.
- Verifica que el renderizador original sigue recibiendo configuración; que se muestran horarios/paradas de bus; nombre, reserva y código del alojamiento; información de regalos solo dentro del control desplegable; música y enlaces HTTP(S); ocultación de secciones desactivadas; cierre sin inventar frase, y no mutación del cuestionario.
- QA catálogo [run 38235740279](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38235740279): **SUCCESS**. Este test es **SINTÉTICO OFFLINE**, no confirma dos encargos TEST auténticos, RSVP ni el APK Android.
- Lectura agregada de Supabase compartido, sin extraer PII ni hacer escrituras: `SELECT template_id, mode, status, count(*) FROM guest_invitation_orders WHERE template_id='design-03' GROUP BY ...` devolvió **0 filas**. A 12/10 no hay evidencia de pedidos TEST D03 en el backend real.
- La Edge Function `guest-invitation-flow` V19 permanece protegida por autenticación de gestor HMAC para `create_test`. No insertar filas vía SQL ni generar credenciales artificiales para fingir el recorrido. No hubo cambios a Supabase ni checkout en esta entrada.

### 3. Pendientes exactos, sin volver atrás

1. **E2E real**: dos pedidos TEST D03 creados mediante la interfaz de gestor autenticada, pasando cuestionario real y comprobando la misma configuración en edición, revisión, entrega y RSVP; sin emails reales ni pagos y con registros de prueba no personales.
2. **Android**: comprobar **una sola vez** el renderer remoto D03 a través del Centro GUEST V5 candidato, ida y regreso; no repetir las pruebas ya cerradas de Botánica. No puede declararse desde Node/Cloudflare.
3. **Aprobación artística** de la propietaria sobre la URL HTTPS ya verificada; no dar por aprobado el resultado porque los CSS y vídeos carguen.
4. Solo después, cerrar gates de D03, congelar su versión y realizar **proceso comercial separado bajo autorización expresa**. Hasta entonces `commercialReady=false`, `ownerVisualApproved=false`, `backendRealE2eVerified=false`, `androidPhysicalVerified=false`.

**Continuidad:** no pedir de nuevo los materiales, no rehacer el HTML, no rediseñar el motor. El siguiente trabajo es **pedido autenticado TEST + paridad/RSVP + Android**. El nuevo HTML de Limoneros (patch) **sí está publicado**; el pendiente ya no es despliegue del parche.


## Actualización — portada de Limoneros corregida en el HTML publicado (12/10/2026)

**Solicitud visual concreta de la propietaria:** en la portada, «NOS CASAMOS» y «Faltan X días» se veían demasiado pequeños. **Se modificó el CSS REAL**, no la captura de imagen, sin tocar arte, medios, nombres ni otros textos:

- En `guest/catalog-patches/design-03/1.0.0/patch.css`, `.cover-tag` / `#cover .cover-tag` ahora usan `font-size:clamp(23px,6.4vw,29px)`, `line-height:1.18` para «NOS CASAMOS».
- `.countdown` ahora usa `font:400 clamp(22px,6vw,27px)/1.2 var(--smallcaps)`, con `letter-spacing:.065em`, para «Faltan X días». El número de días sigue siendo dinámico desde la fecha del cuestionario, no una cifra escrita en la plantilla.
- Código: commit `89645e3055002786cb501024ebcf6593f3b17a0e`. Controles de catálogo y paquete NO-SALE PASS. **Readback REAL** HTTPS de la nueva versión: [GitHub Actions 38239237591](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38239237591) SUCCESS, HTML byte-exacto, CSS nuevo embebido y 15/15 MP4/JPG sin cambios, HTTP 200; evidencia `guest/qa-reports/limoneros_cloudflare_live_check.json`, 2026-10-12T10:54:34Z.
- **No declarar aprobación estética** hasta que la propietaria vea la portada actualizada en móvil. Pendientes las demás pantallas y la matriz universal de máximo/ausencias; no inferir que toda la plantilla está terminada. Permanece TEST-only/NO-SALE.
