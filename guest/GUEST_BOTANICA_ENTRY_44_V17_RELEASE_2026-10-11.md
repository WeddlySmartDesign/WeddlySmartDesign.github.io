# GUEST/Botánica — Entrada 44 · bloqueo de lectura V16 resuelto en Supabase (11/10/2026)

**Alcance:** exclusivamente función Supabase GUEST `guest-invitation-flow`, proyecto existente `dnjsxequwgtyyauuofxj`, rama aislada `guest-independent`. Ni ONE, ONE Partner, STUDIO, VEIL LIGHT, `main` ni el diseño visual Botánica han sido modificados. No se han añadido suscripciones, pagos, dominios, proyectos, tablas o endpoints.

## Resultado verificado: V17 real, fuente correcta

- Antes del cambio: la función mostraba metadatos `version=16 ACTIVE` pero `get_edge_function` devolvía fuente V15 de 67.621 caracteres, SHA de paquete `e343b56befa4328253bf08ff3797fbbae7a111c18c7918fa7549f330769ac5c9`, sin `order.mode` en `public_load`.
- Se recuperó de la **Biblioteca canónica** `/GUEST by WeddlySmartDesign/Normativa/Continuidad GUEST/GUEST_V16_EDGE_GENERADO_VALIDADO_2026-10-11.ts`, 67.780 bytes, SHA256 `35672e22f3c08ac4b8de1934022e4b6dd25d3a19943d319dd33a00baacc0f0ab` (según documento fuente Entrada 40). Se comparó contra el código leído efectivamente: **diferencia exactamente una sola sustitución, sin cambios adicionales**. El `public_load` del pedido `delivered` validado por token pasa de devolver `{id,label,config}` a devolver `{id,mode:order.mode==='test'?'test':'production',label,config}`. No se exponen capacidades ni habilita producción de diseños pendientes.
- Después de superar previamente las pruebas locales con dos bodas Botánica (CI `38129305501`, PASS), se publicó UNA vez exclusivamente `guest-invitation-flow`, conservando `verify_jwt=false` como configuración anterior (la función implementa autenticación propia). **Supabase responde V17 ACTIVE**; digest nuevo `accea6d258ff2bdd9b1366f174ea48f4852798105da4d103f5ec4835151d5aa2`, entrada `_17/source/index.ts`.
- **Lectura independiente tras deploy:** `get_edge_function` **AHORA devuelve realmente la fuente nueva**, 67.666 caracteres, exactamente una aparición de `mode:order.mode==='test'?'test':'production'`, y el digest V17 esperado. Se elimina la anterior contradicción de lectura V16 frente a V15. No se ha supuesto su éxito solo por el número de versión.
- Se verificó por lectura que `guest-stripe-checkout` sigue **v24 ACTIVE, SHA `9b865715fe11b646c0d2a416f9d3b1161b212682db8f932b782951680a172e8c`**; esta operación no ha modificado checkout. La base conserva **2 pedidos TEST VEIL LIGHT delivered + 1 diseñando, sin Botánica**. No se generaron datos falsos en Cloud.

## Precisión de certificación y reversión

- **RESUELTO:** lectura del código servido por despliegue Supabase v17 coincide con la candidata V16 aislada; `public_load` incluye el campo necesario para final TEST bajo un token válido. Esto es prueba de **despliegue e integridad de fuente**, NO de haber ejecutado `public_load` con un pedido TEST real.
- **AÚN NO PROBADO:** valor efectivo `GUEST_CATALOG_PUBLIC_ORIGIN` después de la configuración que la propietaria ya completó, dos pedidos reales de prueba Botánica vía gestor autenticado, fotos firmadas reales, cambio/aprobación, envío/enlace final real Cloudflare con `p/rt/g/u/lang`, RSVP persistido en cloud y su gestión, revisión en Android y medición de tiempo. La herramienta actual no proporciona sesión legítima `x-weddly-manager`; no forjar sesiones ni crear pedidos mediante INSERT SQL. No pedir repetir configuración de Supabase ni compartir secretos.
- **Rollback disponible si se detecta regresión real:** fuente íntegra V15 conservada en la misma Biblioteca como `GUEST_V15_EDGE_GENERADO_VALIDADO_2026-10-11.ts` (SHA256 `3ec968731ba09c6df76abac667ebe1fa3f6de916b82efe1b64c17bfca4ace0ad`). No ejecutarlo sin una regresión demostrada.
- **Admisión y catálogo:** Botánica **3/11 PASS, 8 PENDING, NO-GO para venta**, `certification-pending`. No activar Stripe ni comenzar diseño 03. El empaquetado multi-diseño genérico sigue validado, con futuro contrato **HTML visual + `visual-plugin.json` + registro/QA**.

## Siguiente acción ÚNICA

Usar sesión **auténtica ya autorizada del centro GUEST** para ejecutar los DOS encargos Botánica en Supabase Cloud sin cargos ni comunicaciones reales, con el flujo de cuestionario, fotos, revisión, cambios, aprobación, entrega HTTPS, RSVP y gestión. Revisión final de propietaria en Android físico y autorización comercial expresa. No repetir suites aisladas ni construir infraestructura adicional por cada nuevo diseño. Coste nuevo: 0 €.
