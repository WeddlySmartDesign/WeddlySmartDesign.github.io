# Entrada 81 — D03 Limoneros: restauración de identidad visual y paridad con cuestionario (12/10/2026)

## Motivo prioritario
La propietaria mostró vídeo móvil `1000095397.mp4` (38,87 s) y denunció la degradación de su diseño por los controles/typografía impuestos y discrepancia con cuestionario. La labor correcta consiste en incorporar su arte, no rediseñarlo ni pedirle soporte técnico. Esta entrada reemplaza la valoración estética insuficiente de Entrada 79.

## Inspección verificada
- Capturas del vídeo aportado: tapa pintada de limoneros y puerta; transición a gradiente 4/5 escenas; cierre nocturno con caligrafía orgánica propia. El V1 añadió banner fijo TEST, botones rectangulares y tipografía de sistema `--sans` en CTA y textos, desentonando con los medios.
- El master V1 recuperado sigue **intacto**: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/GUEST_D03_LIMONEROS_MASTER_V1_TEST_NO_SALE.zip`; master 28.673.474 bytes SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`.
- El contrato autoritativo consultado en repo: `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json`. Fallo objetivo en V1: `bus.message/details/url`, `accommodation.message/details/url`, `gift.message/text/note` NO son los campos del esquema; varios apartados desaparecían aunque la pareja los rellenara. Ese error no fue detectado por QA original.

## Corrección V2 realizada y probada (NO sale, NO deploy)
- Derivada del V1 byte-verificado mediante parche determinista `patch_limoneros_v2.py`, **PERSISTIDO en Biblioteca**:
  `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/patch_limoneros_v2.py`.
- Archivo local de revisión: `GUEST_D03_LIMONEROS_V2_REVISION_VISUAL_CUESTIONARIO_TEST.html` (28.677.081 B; SHA256 `43249ed1728d790cbb7e43eadd9c2180e167aaab0c86c53280866cc7c2cf2a1e`).
- Preserva fondos, vídeos, escenas y CSS base; elimina franja invasiva TEST solo visualmente (el gate TEST/no-sale permanece), aplica tipografía editorial ya embebida y sustituye rectángulos genéricos por navegación sobria; suprime el nombre grande superpuesto que chocaba con caligrafía ya incorporada en el vídeo de cierre.
- Alinea prácticas con schema: autobús `pickupPoints/outboundTimes/returnTimes/note/mapsUrl`; alojamiento `mode/name/address/bookingCode/.../externalBookingUrl/websiteUrl/mapsUrl`; regalo `mode/displayText/details/iban/bicSwift/bizumPhone/externalUrl`; música `mode/prompt/url` sin fingir un enlace si es `guest_request`; `closing.line=null` oculta texto en vez de insertar frase ajena. Se mantiene RSVP únicamente a la ruta del motor GUEST.
- Tests reales en Chromium headless vía `set_content` (el entorno bloquea HTTP localhost): 320, 360, 390, 430 px; sin scroll lateral, sin errores JS; texto real en cada práctica y control editorial sin fondo rectangular; `node --check` PASS. Pruebas de variantes: **single venue/story none/closed CTA**; **two venues/5 scenes/5 moments/2 gallery photos/bus/hotel/bank/music/active RSVP**; **gallery none/gift none**; **unsafe URLs fail closed**: 4/4 PASS.
- Evidencia persistida en Biblioteca: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/GUEST_D03_LIMONEROS_V2_BROWSER_QA.json`, `GUEST_D03_LIMONEROS_V2_QUESTIONNAIRE_MATRIX_QA.json`, `test_questionnaire_matrix_v2.py`.
- La copia completa HTML V2 **NO pudo subirse a Biblioteca por límite de almacenamiento**; no eliminar archivos de la usuaria sin autorización. Se preserva el parche pequeño reproducible y las pruebas; reconstruir aplicándolo al máster V1 original al reanudar. En este chat se generó un HTML descargable.
- No se ha tocado el máster congelado V1, Botánica, VEIL, ONE, Partner, STUDIO, `main`, backend ni precios. No se ha aprobado todavía estética V2 por la autora.

## Checklist de continuación (sin convertir en nuevo macroproyecto)
1. **Usar V2 corregida como candidata de integración y no V1**. Al recuperar: leer ZIP V1 de Library, aplicar `patch_limoneros_v2.py` y verificar SHA256 esperado `43249ed...`. No pedir originales ni repetir diseño.
2. Estandarizar media externos (HTML ligero + archivos mp4/jpeg con hashes) para evitar blobs 001-039 y Cloudflare >25 MiB. Ya existe prueba técnica previa `externalize_visual_assets.py` en working folder, aun no versionada: adaptar para SHA V2 y dejar pipeline común reusable D04+.
3. Integrar exclusivamente rama `guest-independent`, no venta; registrar `design-03` en catálogo TEST y pasar CI/Cloudflare; revisar ataduras de cuestionario y URLs remotas reales, más Android TEST. Solo entonces pedir **una única revisión visual** a la autora. No presentar Chromium como Android ni QA de esquema como E2E.
4. Respetar expresamente su criterio artístico: vídeos/fondos entregados = referencia de diseño; NO introducir banners y botones de interfaz en la invitación. Cualquier cambio no esencial al sistema debe preservar la atmósfera original.

## Estado
**Visual V2 + correcciones cuestionario = PREVIEW LOCAL TEST, browser QA de variantes PASS; revisión artística, despliegue e integración pendientes. Venta prohibida.**
