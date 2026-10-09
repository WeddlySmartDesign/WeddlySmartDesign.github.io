> **ÚLTIMA SITUACIÓN V14.7 (09/10/2026):** Esta sigue siendo una PROPUESTA documental, **NO DESPLEGADA**. Antes de ejecutar en un entorno autorizado, reconciliar con el backend v12 la normalización de `story.textMode='none'` a `preset`: el esquema permite texto ausente/foto-only, mientras la Edge Function actual lo convierte en texto predefinido. Cualquier corrección necesita prueba de regresión global (especialmente VEIL LIGHT) y no puede introducir excepciones por plantilla/pareja ni exponer producción. Mantener el guard `template_test_only` y verificar todas las rutas de creación antes del despliegue.

> **ACTUALIZACIÓN (09/10/2026):** La candidata vigente y el registro del catálogo son V14.7, no V14.5. La V14.7 corrige Historia solo fotográfica. Este documento continúa siendo una **propuesta NO DESPLEGADA**; la operación estuvo bloqueada y NO debe eludirse. La Edge Function real sigue en v12 sin Botánica.\n\n# GUEST / Botánica D02 — cambio preparado, NO DESPLEGADO

**9 octubre 2026 · Solo documentado, no aplicado al backend**

## Estado verificado

- Proyecto Supabase: `dnjsxequwgtyyauuofxj`.
- Edge Function: `guest-invitation-flow`, versión desplegada 12.
- SHA-256 de la versión desplegada al recopilar la propuesta: `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`.
- `CATALOG_TEMPLATES`: solo `veil-light`. **Botánica NO tiene pedidos reales posibles.**
- Registro GitHub: `botanica` versión `14.7`, `status: certification-pending`, `scalabilityCertified: false`.
- El empaquetador estándar bloquea expresamente versiones distintas de `commercially-frozen`.

## Cambio mínimo para un entorno autorizado (propuesta sin ejecutar)

Aplicar **solo si la función desplegada y los contratos siguen coincidiendo**. Antes de aplicar, hacer respaldo del código de Edge Function. Si difieren, no despliegue automático.

**1. Registro de pruebas:** generar primero el registro con `node guest/tools/generate_backend_catalog_registry.cjs --mode test-only` (fuente común de catálogo, evidencias y visor) y cotejarlo con la función desplegada. La entrada `botanica` debe conservar `version:'14.7'`, `renderer:'botanica-v14-7'` y `testOnly:true`, sin alterar `veil-light`. El fragmento siguiente es solo una referencia documental, no código autorizado para desplegar directamente:

```ts
const CATALOG_TEMPLATES:any={
  'veil-light':{id:'veil-light',version:'5.3.3',renderer:'veil-light-v5-3-3',active:true,typographyVariants:['classic','romantic','contemporary'],defaultTypographyVariant:'classic'},
  'botanica':{id:'botanica',version:'14.7',renderer:'botanica-v14-7',active:true,testOnly:true,typographyVariants:['classic'],defaultTypographyVariant:'classic'}
};
```

**2. Guardar inmediatamente la barrera de producción en `createOrder`:**

```ts
async function createOrder(c:any,mode:'test'|'production',buyerEmail:string,licenseId:string|null,checkoutSessionId:string|null,templateId='veil-light'){
  const spec=templateSpec(templateId);
  if(spec.testOnly===true && mode!=='test')throw new Error('template_test_only');
  // Resto de createOrder sin cambios.
}
```

Este guard debe cubrir **todas** las rutas que crean pedidos (incluido el checkout) y no solo `create_test`. Confirmar eso leyendo la función íntegra antes de autorizar su despliegue. No cambiar Stripe, `main`, VEIL LIGHT, ONE, Partner ni STUDIO.

## Ensayos imprescindibles tras el despliegue autorizado

1. `create_test` con `templateId='botanica'` devuelve pedido de prueba V14.7; `create_test` de VEIL LIGHT mantiene comportamiento; cualquier pedido de producción Botánica se rechaza, sin cobro.
2. Dos pedidos **muy diferentes** desde el mismo cuestionario compartido y sin edición del HTML. Usar direcciones de prueba seguras; no enviar mensajes a clientes.
3. Comparar configuración de borrador/revisión/final y recursos firmados. Todas las variantes activadas/desactivadas se respetan.
4. En preproducción: validar página final, URL estable, enlace RSVP `rt`,`g`/`u`,`lang`, confirmación con el motor existente, persistencia sin duplicados.
5. Android: dos invitaciones distintas, botones y fotos, sin desplazamiento lateral; medir trabajo activo de la propietaria (objetivo máximo cinco minutos). Registrar evidencia, no suponer el resultado.
6. Solo después de todos los PASS, elevar el registro a `commercially-frozen`, nunca antes. **El alta en ventas y la publicación necesitan autorización independiente**.

## Rollback de seguridad

Si algo falla, restablecer inmediatamente el Edge Function anterior (v12 SHA indicado), verificar `CATALOG_TEMPLATES` sin `botanica`, conservar `certification-pending` y no borrar pedidos/cuentas ajenos a las pruebas.

## Evidencia ya ejecutada fuera del backend

- 116 escenarios de renderizado y 8 fixtures con forma de backend según checkpoint V14.7.
- 7 pruebas locales del contrato de entrega offline: registro congelado, adaptador, RSVP invitado, RSVP unidad, ruta ausente, respuesta de error y bloqueo de empaquetado comercial. `node guest/tests/botanica_catalog_bridge_offline.test.cjs`.
- GitHub: archivo en rama `guest-independent`, sin publicación.

**ESTADO:** cambio de backend DOCUMENTADO y pendiente de autorización del entorno; NO ejecutado. Certificación comercial Botánica NO completada.