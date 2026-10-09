# GUEST D02 BOTÁNICA — Bloqueo final de integración, constatado 09/10/2026

**Leer junto a:** `guest/GUEST_D02_BOTANICA_READ_FIRST.md` (rama `guest-independent`).

## Qué SÍ está resuelto

- Diseño 02 V14: aprobado visualmente por propietaria e INMUTABLE.
- Botánica V14.7: candidata técnica local con el caso foto-only corregido; archivo exacto protegido por SHA-256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`.
- Cuestionario común y Mobile Center: versión de preproducción con historia foto-only y reparación de campos de regalo; no publicada.
- Dos pedidos complejos/sencillos **simulados en local**; no equivalen a E2E de Supabase.
- Nueva prueba local de integración de vista de Botánica con el Mobile Center en un paquete de **dos archivos separados**, evitando insertar otros 11,6 MB dentro del HTML del Centro. No se edita ninguna versión congelada.
- Archivo de prueba del centro: `GUEST_MOBILE_CENTER_V4_7_BOTANICA_PREPRODUCCION_NO_PUBLICAR.html`. Mantiene el renderizador VEIL LIGHT y añade el renderer aislado Botánica para `template_id: botanica`, mediante iframe local de la V14.7. Botón CENTRO GUEST conserva la gestión. **Solo para preproducción, NO publicar.**
- Paquete íntegro verificado: `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/GUEST_BOTANICA_MOBILE_CENTER_RENDERER_TEST_ONLY_2026-10-09.zip`, SHA256 `67c12d03fa2f1aeb4478a06db84291ba83d8a337a50687433f2ed6c422246238`. El script del workbench pasa sintaxis Node y el ZIP pasa CRC.

## Qué NO está resuelto ni debe simularse como resuelto

1. Supabase Edge Function `guest-invitation-flow` v12, proyecto `dnjsxequwgtyyauuofxj`, **solo** admite `veil-light`; la operación test-only para habilitar Botánica fue bloqueada por la herramienta. NO eludir ese bloqueo mediante rutas alternativas.
2. El backend actual mapea `story.textMode='none'` a `preset`. La corrección pura propuesta cambia exclusivamente ese caso en los 128 escenarios analizados, pero **no ha sido desplegada**.
3. El Mobile Center V4.6 congelado solo admite `veil-light`. El nuevo renderizador se ha preparado en copia **no desplegada**. El ensayo del Centro con iframe en Chromium sobre servidor local fue bloqueado por el entorno con `net::ERR_BLOCKED_BY_ADMINISTRATOR`, por lo que no se marca como QA visual aprobada. No confundir su comprobación de sintaxis/estructura con una prueba de navegador completa.
4. Dos pedidos **reales** de prueba, carga de fotos firmadas, previsualización/revisión/final, URL de entrega, RSVP personalizado + persistencia y operación Android <=5 min siguen **PENDIENTES**.
5. Registro Botánica: `version:14.7`, `status:certification-pending`; no `commercially-frozen`. No activar Stripe ni ventas ni publicar en `main`.

## Siguiente procedimiento admisible

1. En entorno legítimamente autorizado: revisar patch test-only de la Edge Function, implementar guard `template_test_only`, preservar VEIL LIGHT y aprobar normalización `none` con validaciones de fotografía real. Comprobar estado de backend antes de cualquier escritura.
2. Servir preproducción del Mobile Center con sus recursos por URLs estables; ejecutar QA móvil y regresión de VEIL LIGHT.
3. Pasar dos pedidos reales de prueba (sin correos a clientes), comprobando el flujo final, entrega y RSVP sin sistemas paralelos.
4. Revisión propietaria final de Android y medición de intervención, registrar todas las evidencias. Solo después elevar a certificación comercial. La activación de ventas es otra decisión explícita.

**Estado:** código preparado y pruebas estáticas controladas; despliegue y E2E real bloqueados. Este checkpoint es autónomo y no requiere memoria de chat.