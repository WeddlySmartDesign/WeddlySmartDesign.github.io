# GUEST — Entrada 76 · entorno preparado para recibir la siguiente plantilla

Fecha 11/10/2026. Rama exclusiva \`guest-independent\`. Estado: **preparado para recibir los archivos del nuevo diseño**, pero **no incorporado ni certificado ningún diseño nuevo**. No se han modificado ONE, ONE Partner, STUDIO, VEIL LIGHT, máster de Botánica, ni \`main\`.

## Resultados constatados
- HEAD previo a esta documentación: \`71103b45077a768e3be81c71a6a63ff351a8e4dc\`.
- Workflow [GUEST Catalog and Continuity QA 38174810959](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38174810959): **SUCCESS**.
- Workflow [GUEST Independent QA 38174810996](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38174810996): **SUCCESS**.
- Workflow [GUEST Public Cloudflare Pages Live Smoke 38174810966](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38174810966): **SUCCESS**. Verifica desde GitHub Actions recursos HTTPS exactos frente a archivos de la rama, visor genérico JS actualizado, máster Botánica SHA256, cabeceras noindex, registro de staging \`PREPRODUCTION_DO_NOT_SELL\`, checkout no anunciado, pruebas negativas de acceso sin token. No es E2E de nueva plantilla ni pago.
- Botánica tiene 11/11 gates técnicos de diseño PASS y las anteriores pruebas físicas Android V4.8/V4.9 de apertura y regreso, sin repetir nada.

## Centro candidato V5.0 (no desplazar V4.9 todavía)
- Binario base: V4.9 test-only 45.561.955 bytes, SHA256 \`4a163fbb556dbe363b6765107a0e6c99dcd4cdf5b44f2fd2755cc2f69b0eab5c\`, desde Drive Weddly.
- Nueva candidata V5.0: \`GUEST_MOBILE_CENTER_V5_0_CATALOG_PREPARED_TEST_NO_SALE_2026-10-11.html\` **45.562.515 bytes**, SHA256 \`beb090309452251e207fc2ac37e82c6d8e5e96390a8ee6c62633ce5ab0cf4a1f\`; copia persistente verificada en [Google Drive /Weddly](https://drive.google.com/file/d/1wxxHCy8XhI5YiFPsMZGAQi6agrh3Lf9T/view?usp=drivesdk).
- Builder exacto reproducible firmado por SHA: \`guest/tools/build_mobile_center_v50_from_v49.cjs\`, prueba \`guest/tests/mobile_center_v50_status_menu_contract.test.cjs\` incluida en CI.
- Corrige conteo de tiempo activo en pedidos ya \`review_sent\`, \`approved\` o \`delivered\` consultando estado de detalle y listado, aunque falte marcador local de cierre; preserva histórico de 41 s. Limpia detalle obsoleto al cambiar de pedido.
- Añade espacio en el título para no superponerse a los tres puntos flotantes del contenedor Android. **No controla el menú nativo ni demuestra visualmente que su posición cambie**.
- SHA del máster Botánica embebido se recalculó y sigue **\`fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a\`**. La guardia \`botanica_only_test_orders\` y el fallback remoto genérico permanecen. Parser JS Node OK sobre el código real extraído del archivo final; sin prueba física V5.0, no venderlo como aprobado Android.
- Sin escritura en backend/Stripe durante la generación. V4.8 y V4.9 originales no se tocaron.

## Entrada del siguiente diseño — trabajo pendiente concreto
La propietaria indica que ya tiene un diseño nuevo, **pero en esta conversación no ha adjuntado ni el HTML final ni sus recursos**. No inventar su nombre, ID, versión ni su contenido. Pedir únicamente el archivo del diseño (HTML autocontenido preferiblemente o ZIP con assets; también sirve enlace existente accesible) y gestionar internamente:
1. Inspeccionar recurso real, calidad y si expone \`window.GUEST_APPLY_CONFIG(config)\`; identificar qué contenido corresponde a datos variables del esquema común y qué parte pertenece al arte. Si falta la API, añadir adaptador aislado al diseño candidato **sin tocar los congelados ni crear otra app**.
2. Crear \`guest/templates/<nuevo-id>/master.html\` + \`visual-plugin.json\` sin que la propietaria cree manifiestos; registrar con \`guest/tools/register_visual_template.cjs\` en \`guest-independent\`, siempre \`certification-pending\`, TEST-only, con SHA y safe defaults. Confirmar que el Cloudflare build común \`build_catalog_static_preview.cjs\` empaqueta el diseño completo sin editar el comando y que el viewer común lo encuentra por ID/version.
3. **Atención real al backend:** la Edge Function desplegada \`guest-invitation-flow\` V18 incluía como catálogo estático VEIL LIGHT y Botánica (Entrada 71). El script \`guest/tools/generate_backend_catalog_registry.cjs\` genera cualquier diseño adicional en modo TEST y sus tests prueban D03/D1000 sintéticos, pero **NO implica que el runtime de Supabase haya aprendido el nuevo ID**. Será imprescindible una incorporación controlada del registro de backend nuevo y validación/deploy TEST autorizado. Nunca omitir esta puerta ni marcar producción.
4. Ensayar generador de config, 1/2 sedes, story none/preset/custom, textos largos, galería, entrega/revisión, RSVP y owner Center vía **ruta remota genérica real**. Una prueba Android en el nuevo diseño, no otra repetición de Botánica. No duplicar cuestionario, motor RSVP, licencias, caja de pagos ni motor de envío.
5. Entregar versión completa de móvil para aprobación visual; solo entonces gates individuales y decisión comercial **aparte**. VEIL, Botánica, ONE, Partner, STUDIO permanecen sellados.

## Límites conocidos
- El centro genérico V4.9 ya abre y regresa a pedidos existentes en Android, pero **no ha visualizado una tercera plantilla por la ruta remota real**. La candidata V5.0 tampoco ha sido instalada físicamente.
- El catálogo actual está protegido como \`PREPRODUCTION_DO_NOT_SELL\`. El usuario no ha autorizado habilitar pagos ni se ha probado una compra real de la nueva plantilla.
- La Biblioteca histórica v24 está congelada y sin espacio; registrar hechos nuevos en GitHub y copias grandes en Drive, sin sobrescribir congelados.

**Próximo paso exacto: recibir HTML/ZIP del nuevo diseño para activar el pipeline de incorporación y completar la validación genérica; no más pruebas repetidas de Botánica.**
