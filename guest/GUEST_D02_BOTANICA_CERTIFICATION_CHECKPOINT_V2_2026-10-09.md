# BOTÁNICA — CHECKPOINT DE CONTINUIDAD V2

**Proyecto:** GUEST by WeddlySmartDesign · Diseño 02 · 2026-10-09

## Fuentes de verdad / seguridad

- Rama aislada: `guest-independent` del repo `WeddlySmartDesign/WeddlySmartDesign.github.io`.
- **V14** visualmente aprobada, congelada y no modificable: SHA256 `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39`.
- **V14.5** candidata de certificación: SHA256 `ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84`.
- No tocar VEIL LIGHT, ONE, ONE Partner, STUDIO; no desplegar ni activar ventas o Stripe sin autorización y cumplimiento de controles.

## Evidencia de QA (no equivale a E2E real)

1. 116 escenarios de interfaz en 320/360/390/430px y 8 fixtures de backend: PASS según checkpoint V14.5.
2. Paridad visual en cinco escenas de la configuración aprobada y medios incrustados idénticos a V14: PASS según checkpoint V14.5.
3. **Siete pruebas aisladas del código de catálogo/RSVP**: PASS en Node. Script versionado en `guest/tests/botanica_catalog_bridge_offline.test.cjs`, ejecución:

   ```bash
   node guest/tests/botanica_catalog_bridge_offline.test.cjs
   ```

   Prueba el registro `certification-pending`, el adaptador `BOTANICA_APPLY_CONFIG`, parámetros `rt/g/u/lang`, preferencia por unidad de invitación, ausencia de token, error simulado de backend y bloqueo del empaquetador comercial. **No solicita datos ni realiza comunicaciones reales**.
4. Se comprobó integridad de V14 y V14.5 por SHA256 de nuevo el 2026-10-09. Conservan los hashes previstos.

## Integración backend: bloqueada, no desplegada

- Proyecto Supabase: `dnjsxequwgtyyauuofxj`.
- Edge Function real `guest-invitation-flow` sigue en versión **12**, `ezbr_sha256=69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`, con **solo VEIL LIGHT** en `CATALOG_TEMPLATES`.
- La herramienta rechazó el despliegue de una ampliación para pruebas. **No intentar evadir los controles del entorno**. No se ha modificado ni la función ni la base de datos ni la tienda.
- Propuesta guardada **solo como documentación, no ejecutada**: `guest/GUEST_D02_BOTANICA_TEST_ONLY_BACKEND_CHANGESET_NOT_DEPLOYED_2026-10-09.md`. Incluye guard `template_test_only` para rechazar pedidos de producción Botánica y mantener VEIL LIGHT sin cambios.
- Registro GitHub actualizado previamente: Botánica v14.5, `certification-pending`, `scalabilityCertified:false`, `operationalPilotPass:false`. El build sigue bloqueado.

## Gates que faltan

- En un entorno con autorización operativa: backend test-only controlado, con respaldo y verificación de rutas de pedido de producción; no activar compras.
- Crear **dos pedidos de prueba diferentes a través del cuestionario común**; no editar el HTML para acomodar cada pedido.
- Verificar paridad previsualización/final, fotos reales, accesorios opcionales, enlaces y firma de archivos; probar URL entregada/RSVP personalizado/escritura de respuesta en GUEST sin duplicados.
- Certificación de móvil Android y tiempo activo ≤5 min para un pedido normal, solo cuando la parte automatizada esté cerrada.
- Si todo pasa y se autoriza: cambiar a `commercially-frozen` y empaquetar. **Publicación/venta es otra aprobación explícita**.

**Estado final hoy: PREPARACIÓN TÉCNICA Y CONTRATO AISLADO VERIFICADOS. INTEGRACIÓN REAL y CERTIFICACIÓN COMERCIAL PENDIENTES.**