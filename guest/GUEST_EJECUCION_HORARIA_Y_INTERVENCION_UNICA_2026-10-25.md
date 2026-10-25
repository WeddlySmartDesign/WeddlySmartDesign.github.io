# GUEST — EJECUCIÓN HORARIA Y ÚNICA INTERVENCIÓN NECESARIA
**Actualización:** 25/10/2026 (Europe/Madrid). **Venta:** `NO_GO`. **Prioridad:** continuar el trabajo técnico sin involucrar a la titular.

## Tarea horaria activa
Está programada una ejecución de GUEST cada hora. En cada paso debe consultar los últimos SHA reales del repo, el PR #147 (módulo) y PR #149 (Cloudflare), START_HERE y el checklist, elegir un fallo P0 real, **hacer cambios y pruebas autónomas**, corregir y reintentar, registrar resultados y solo entonces actualizar el estado. No repetir tareas cerradas. No prometer trabajo simultáneo fuera de las ejecuciones.

**No tocar:** ONE, STUDIO, Partner, `main`, masters originales; no combinar cuentas con táppika ni BNfit. No usar credenciales personales/corporativas ni pedir PC. No activar checkout LIVE, enviar correos a clientes ni publicar producción sin GO.

## Hechos comprobados el 25/10 — diferenciar de antecedentes
1. **La usuaria confirma la conexión de GUEST con Stripe modo pruebas.**
2. Existen **dos canales diferentes**: (a) el plugin Stripe en ChatGPT solo muestra WeddlySmartDesign `livemode:true` (no usar para pruebas), (b) el sandbox independiente GUEST en GitHub Actions Environment `guest-stripe-sandbox`, solo rama `guest-independent`, con secreto `GUEST_STRIPE_TEST_SECRET_KEY` cifrado; nunca divulgar claves.
3. Hay prueba Stripe TEST auténtica anterior el **20/10**: [run 39473359246](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39473359246) SUCCESS, una sesión Checkout `cs_test_` impagada `livemode:false`, sin crear cargo. Workflow anterior **permanece `if:false`** y no se reactivó.
4. **Nueva prueba Stripe TEST 25/10:** [run 40185593736](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/40185593736) **SUCCESS**, consulta REAL de solo lectura `GET /v1/checkout/sessions?limit=5` con el secreto cifrado del environment. Respuesta `livemode:false`, 2 sesiones TEST inspeccionadas (1 `complete`, 1 `expired`), una o más con metadatos GUEST; **NO se sabe por ello si el estado de pago es `paid`**. Cero sesiones creadas, cargos, licencias, emails o secretos expuestos. [Script seguro](qa/stripe_sandbox_readonly_2026_10_25.cjs).
5. **Consulta de verificación ampliada** a estado `paid`/`unpaid` y fijación de diseño/versión: [workflow seguro](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/workflows/guest-stripe-sandbox-readonly-2026-10-25.yml), run de commit `024bf3c2a8f21d6e1691cda265558111982e61ee`; comprobar resultado final antes de afirmar que haya pedido pagado.
6. **Supabase — fuente en directo:** `dnjsxequwgtyyauuofxj` (Weddly), `kijigxprredusnaaazow` (STUDIO) activos; `pwhcivzdmmkyuodzzqfq` (GUEST-Botanica-Certificacion-Temporal) INACTIVE. No reactivar una tercera instancia ni contratar plan sin autorización. Probar antes si es posible E2E en CI con backend efímero en GitHub Actions, preservando datos y costos.
7. **CI del producto:** rama `guest-independent` verde en los runs del 25/10; rama de auditoría `guest-audit-stripe-test-2026-10-25` tiene QA móvil de **Viñetas ELLAS = Lucía/Martina, ELLOS = Álvaro/Pablo** sin modificar masters. No sustituir los nombres de origen.
8. **Estado anterior de despliegue que sigue siendo la referencia:** la app íntegra en Cloudflare PREVIEW por PR #149, integridad 223/223, Chrome HTTPS + PWA QA, sin producción comercial; PR #147 con Hoy/mesas/compartir/cinco temas. Ambos PR siguen en DRAFT. Verificar el último SHA de cada uno antes de actuar.
9. **Regla de pago existente:** la instancia Supabase real es un backend vivo, pero no una copia aislada exclusivamente TEST. No completar pruebas Stripe de compra contra LIVE por comodidad; aislar backend, emails y dominios de prueba antes del primer pago simulado.

## Trabajo AUTÓNOMO pendiente, por prioridad (responsabilidad de ChatGPT)
- [ ] **C-01:** Verificar esta nueva conectividad de Stripe TEST, estado de sesión completa, credenciales aisladas, metadatos, importes de prueba. Sin cargo, sin usar plugin LIVE.
- [ ] **C-02:** Disponer de E2E TEST seguro con backend efímero/aislado; cubrir dos compras TEST completas, firma e idempotencia de webhook, pedido vinculado, licencia solo tras entrega, cuestionario, aprobación, correo al destinatario de prueba y URL final. No dar GO con un MOCK.
- [ ] **C-03:** Integrar y verificar sin regresiones los PR #147 (módulo) y #149 (publicación) en una rama GUEST de preproducción, sin tocar ONE; salvaguardar rollback. Mantener permisos/guardias 401/403 y PWA sin fuga.
- [ ] **C-04:** Resolver visor final de VEIL (nativo) y 14 maestros iframe, URL por diseño, Limoneros correcto D09, D03 histórico inhabilitado, personalización real por cuestionario. SHA de multimedia y assets, vídeo portada/cierre y QA táctil.
- [ ] **C-05:** Completar/pulir web comercial V5 mobile-first, catálogo de diseños individuales, proceso 24 h/48–72 h, precios y plazos coherentes con el servicio; revisar la navegación, diferenciación, marca y versión móvil real en Preview.
- [ ] **C-06:** Verificar en PREVIEW con licencia segura: GUEST acceso del titular y segunda persona, notificaciones Hoy agrupadas y persistentes, envío RSVP, lista de invitados, menús, grupos, plano interactivo, prejornada/eventos, revisiones documentales, exportación, PWA offline/online, seguridad y aislamiento entre bodas.
- [ ] **C-07:** Auditar derechos de imágenes, música, vídeo, fuentes, textos comerciales, condiciones/IVA/soporte y copias; registrar qué documentos necesitan aprobación legal real. Nunca afirmar derechos sin comprobantes.
- [ ] **C-08:** Consolidar en GitHub TODO lo probado y el go/no-go por diseño; preparar un solo paquete de aprobación comercial y solo después promover GUEST final bajo URL estable. Nunca abrir LIVE por aprobar un PR o salir 30/30 verde.

## UNA ÚNICA intervención agrupada para la propietaria — **todavía no solicitar**
Preparar para cuando no reste trabajo autónomo, preferiblemente fuera del horario 08:00–17:00:
**A. Accesos/autorizaciones:** si la ejecución necesita una aprobación interactiva o iniciar sesión en Cloudflare/Supabase/Stripe TEST, solicitar *una sesión segura* donde se confirme identidad sin dar contraseñas por chat; solo si resulta ineludible. Si es imprescindible elevar el plan para una tercera base Supabase, exponer coste y alternativas gratuitas primero, **sin modificar STUDIO**.
**B. Decisiones comerciales:** una única hoja para aceptar precios de cada diseño, IVA y condiciones, derechos de uso y licencias de recursos (música, fotos, Recraft, tipografías), plazos de servicio y cualquier valoración visual definitiva que dependa de la titular. No reabrir diseños aprobados sin defecto verificable.
**C. Aceptación real:** si no puede certificarse autónomamente, una sesión corta de prueba física en móvil + segundo dispositivo autorizado, con operaciones guiadas **no técnicas** (solo pulsar botones), y decisión explícita final GO/NO_GO para activar cobros LIVE.

**Regla:** no pedirle scripts, repositorios, permisos fragmentados, descargas, ediciones o pruebas durante el trabajo. Agrupar exclusivamente asuntos indelegables.

## Fuentes de continuidad
- [Checklist maestro de pendientes](GUEST_CIERRE_PENDIENTES_Y_ENLACES_2026-10-22.md)
- [START_HERE](START_HERE.md)
- [Cierre técnico previo](GUEST_FINALIZATION_CONTINUITY_REAL_STATUS_2026-10-22.md)
- [PR #147 módulo](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/147)
- [PR #149 Cloudflare preview](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/149)

**Estado:** GUEST TEST Stripe conectado y probado en lectura; **compra y entrega completa aún NO_GO**. La tarea horaria permanece activa hasta certificación/GO explícito y, entonces, se desactivará.
