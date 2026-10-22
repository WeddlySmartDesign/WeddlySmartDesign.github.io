# GUEST — Continuidad del cierre técnico y puerta comercial (22/10/2026)

## Instrucción de la titular
Dejar **GUEST totalmente terminado**, con autonomía, sin requerir revisiones manuales de código por la titular. Debe conservar íntegro el último motor de Invitados de ONE, salvo edición de la invitación premium y configuración de las preguntas RSVP por la pareja. La venta por diseños individuales solo está permitida con flujo real completo y verificado.

## Cambios técnicos implementados, NO fusionados a producción
Rama candidata: `guest-finalization-candidate-2026-10-22`.
PR borrador hacia `guest-independent`: **[#147](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/pull/147)**. No fusionar a `main` ni habilitar cobros automáticamente.

1. **Hoy agrupado:** respuestas por fecha y tipo de evento, incluida preboda; 20 llegadas se ven como 1 grupo, 16 sí y 4 no en prueba; cada respuesta individual disponible, sin borrarla al agrupar.
2. **Novedades separadas de actividad:** mover un invitado no se cuenta como RSVP ni como alerta nueva; registro seudónimo de este/otro dispositivo, sin tokens. Para un mismo invitado se conservan rectificaciones.
3. **Marcar leído por ID estable:** se guardan los IDs de respuestas en `meta.hoyReadNotificationIdsV1`, no solo un sello temporal global. Las respuestas tardías, incluso con fecha anterior, aparecen como nuevas si el ID no había sido leído; el merge de estado opera por keys.
4. **Problemas que necesitan atención:** menús pendientes, mesas sobreaforadas y acceso a los avisos restantes si hay más de 3+2 tarjetas iniciales. Leer novedades no elimina los problemas; solo se resuelven al modificar los datos reales.
5. **Compartir acceso:** Ajustes muestra controles siempre, habilitados solo para titular autorizado sin segundo miembro, y explica acceso ya vinculado, fallo de conexión, permiso de segundo miembro o licencia inexistente.
6. **Cinco estilos**: Nordic, Blush, Arena, Slate y Editorial persistentes, corregida la precedencia CSS de barra inferior.
7. **ONE paridad de eventos:** se restauran tareas, presupuesto, pagos y sus 3 indicadores dentro de cada evento, sin alterar envíos ni RSVP propias.
8. **Alias** `/guest/guests.html` redirige a `/guest/index.html` completo, no a una versión incompleta.
9. **DEMO aislada para capturas:** rama `guest-demo-capturas-2026-10-21` actualizada con última bandeja Hoy y cambios de mesa. Sigue usando datos ficticios y API simulada, sin dinero ni datos reales.

## Pruebas automatizadas reales
- [Regresión completa en GitHub Actions, run 39743098561](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39743098561) — **PASS, 10 pasos funcionales**: B6.2 Hoy/Invitados, B7.2 Hoy en 320/390/430px, histórico y preboda, 20 RSVP + respuesta tardía y actividad de mesa, permiso de compartir en 4 estados, temas premium, B6.5 eventos + invitación independiente, B7.5 eventos + tareas/pagos, paridad estática ONE. El código fuente de ONE no se ha tocado.
- [Control comercial/15 modelos, run 39743098479](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39743098479) — **PASS en código y paquete estático, pero informe NO_GO comercial**.
- Cloudflare Pages publica PREVIEW aislada de la rama candidata, no producción. Confirmar check del commit `6bf38c8a63889c88b704e80b79d03efe6242d7b5` antes de citar el URL.

## Bloqueos reales para afirmar «listo para vender»
La auditoría comercial independiente sigue devolviendo `NO_GO`, principalmente porque:
- **Masters públicos:** diseños registrados pero todavía sin URL real completa de master final o sin certificación de aceptación; la verificación de 15 candidatos NO equivale a que los 15 estén publicados. No volver a activar D03 archivado por error.
- **Cloudflare:** el ZIP PREPRODUCTION de 16 entradas técnicas y 223.596.068 bytes (SHA256 `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`) sigue en Biblioteca; requiere despliegue PREVIEW íntegro y validación de 121 recursos antes de poder publicar cualquier diseño con licencia.
- **E2E TEST autorizado:** 2 pedidos de catálogo completos y sin edición manual técnica: compra de prueba → webhook/estado → cuestionario (<24h) → diseño aprobado → entrega final → licencia GUEST → acceso del titular y segundo miembro → envío de invitación y RSVP pública → actualización de mesa, catering, eventos y listados → correo entregado y enlace seguro. Verificar idempotencia, reintentos, expiración, seguridad y rollback.
- **Compatibilidad final:** inspección de móviles físicos Android/iPhone y segunda sesión sincronizada; Chromium en GitHub no sustituye esos ensayos.
- **Autorización de publicación:** no activar Stripe LIVE/cobros ni sustituir `main` sin las evidencias anteriores y la autorización comercial de la propietaria.

## Instrucciones de continuación
1. No reiniciar el trabajo; fuente del cierre: PR #147 y este documento.
2. Consultar íntegramente acciones y diferencias antes de ampliar cambios. Corregir fallos descubiertos y probarlos, no delegar QA en la titular.
3. Publicar paquete de 16 entradas **solo** como PREVIEW usando acceso autorizado de Cloudflare y las credenciales de la titular únicamente mediante login seguro. No pedir secretos por chat.
4. Una vez comprobados los ciclos reales y aprobaciones, consolidar las ramas GUEST sin modificar ONE/STUDIO/masters y registrar el GO por **cada diseño individual**, no por colecciones.
5. Toda operación realizada debe quedar en documentación verificable fuera del chat; no afirmar «entregado» hasta constatarlo.

**Situación al cierre de esta auditoría:** módulo de gestión con candidato probado en navegador; no liberación comercial certificada, no se han activado cobros, no se ha modificado producción.


## 22/10/2026 — Comprobación directa final de servicios y regresión extensa (sin alterar producción)

### Evidencia verificable del estado técnico
- **GitHub rama de cierre**, commit `25fca51fd9e34614087db8ae836142c7073c46a0`: [matriz extensa de regresión](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39745953137) **30/30 trabajos SUCCESS**. Las dos pruebas antiguas que fallaban al principio se revisaron para verificar el comportamiento aprobado de ONE: opción Compartir visible pero bloqueada cuando el segundo miembro ya está vinculado; tareas, presupuesto y pagos preservados en eventos adicionales. No se relajaron las comprobaciones de permisos ni de aforo/RSVP.
- [Regresión específica de módulo](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39745953236) **SUCCESS** (incluye ráfaga de 20 RSVP, novedades agrupadas, actividades de mesas, leído por IDs, cambios tardíos, compartir y cinco paletas).
- [Preflight comercial aislado](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/39745953115) **SUCCESS de pruebas estáticas, salida comercial NO_GO**.
- **Cloudflare Pages PREVIEW del commit `25fca51` desplegada SUCCESS**: `https://b9fa74ec.guest-weddlysmartdesign.pages.dev` (y alias de rama `https://guest-finalization-candidate.guest-weddlysmartdesign.pages.dev`). Publicación de PREVIEW confirmada por el control Cloudflare, sin sustitución de producción, pago ni licencia. No certificada navegación física en Android/iPhone.

### Backend: cotejo GitHub↔Supabase en tiempo real
Las siguientes **7 funciones ACTIVAS** se compararon por igualdad exacta de contenido completo, sin mutarlas:
- `guest-stripe-checkout` v26 — 26.177 bytes, **idéntica**.
- `guest-invitation-flow` v21 — 72.878 bytes, **idéntica**.
- `guest-license-access` v5 — 8.495 bytes, **idéntica**.
- `guest-rsvp-ensure` v3 — 6.827 bytes, **idéntica**.
- `guest-rsvp` v6 — 28.022 bytes, **idéntica**.
- `guest-orders-admin` v4 — 12.824 bytes, **idéntica**.
- `guest-personalization` v3 — 10.247 bytes, **idéntica**.
Las 12 funciones `guest-*` están ACTIVE, pero las cinco restantes no se cotejaron por fuente raíz porque varias no tienen `guest/backend/<slug>/index.ts` en GitHub; no interpretar ACTIVE como prueba E2E.

### Evidencia de pedidos de prueba reales en base de datos (solo estadísticas, sin PII)
Consulta agregada, lectura exclusiva, en `public.guest_invitation_orders`:
- **8 pedidos `mode=test` y cero `mode=production`**: seis `delivered`, uno `designing`, uno `review_sent`.
- Seis `delivered` tienen token público de entrega y cuestionario enviado/recibido y aprobación registrada; cuatro de seis tienen `delivery_url`, solo **uno** está vinculado a una `license_id`.
- **0/8** poseen `checkout_session_id`; el código `create_test` **intencionalmente** crea pedidos sin compra, licencia y sesión. No es prueba de que falle el checkout; demuestra que todavía NO se ha ejecutado la compra Stripe TEST → webhook → licencia → pedido → correo → entrega en una cadena completa.
- El código `guest-stripe-checkout` solo provisiona licencia si `checkout.session.completed` tiene pago comprobado, y `guest-invitation-flow` `create_paid` valida licencia, ID `cs_test_...`/`cs_live_...`, producto, plantilla, versión y vínculo exacto. Es verificación de código, no del comportamiento remoto de Stripe.

### Correo y conexión Stripe
- Resend: dominio `weddlysmartdesign.com` **verified / sending enabled**. Historial de transaccionales confirma entrega de correos de prueba GUEST (pedido, datos recibidos, revisión, aprobación y entrega) el 6 y 7/10/2026. La cuenta tiene plantilla publicada de ONE, pero la integración GUEST envía directamente mediante API Resend con claves de idempotencia; no requiere esa plantilla ONE. Cero webhooks de Resend configurados: no impide un envío confirmado por API, pero se debe cubrir supervisión de rebotes o fallos antes de explotar ventas.
- Stripe conectado mediante herramienta: **únicamente cuenta WeddlySmartDesign en livemode=true**. No existe un contexto de prueba Stripe accesible en esta conexión. **No se intentó pago ni petición con cargo real.** Para probar compras de GUEST hay que habilitar contexto TEST o un ensayo seguro autorizado y aislarlo del catálogo LIVE; no cambiar de modo con suposiciones.
- Supabase advisors: tablas GUEST tienen RLS activo sin políticas cliente deliberadamente, pues el acceso transcurre por Edge Functions con autorización; no desactivar RLS. Avisos `SECURITY DEFINER` observados pertenecen a funciones internas/Partner, fuera del alcance aislado de GUEST; no cambiar ONE/Partner por una alerta de GUEST.

### Único camino de certificación aún faltante
1. Publicar y verificar los 16 diseños técnicos del ZIP íntegro y la ruta maestra `catalog-final` en Cloudflare **PREVIEW**, con integridad de todos los medios. No publicar un ZIP incompleto ni activar cobros.
2. Obtener entorno Stripe **TEST realmente autenticado**. Ejecutar al menos dos pedidos pagados ficticios de diseño certificado hasta `checkout_session_id` real de test, licencia emitida, creación automática del pedido, cuestionario, entrega y URL final; comprobar correos y reintentos.
3. Dos accesos independientes de la pareja, la invitación y su RSVP pública, sincronización PC↔móvil y móviles reales, gestión de mesas/listados/preboda. Probar expiración, aislamiento entre bodas, recuperación, facturación y rollback.
4. Registrar GO/NO_GO por **diseño individual** y solo habilitar venta tras aceptar las evidencias; no declarar 15 diseños comercialmente terminados por el test de staging estático.

**Estado:** código GUEST en PR #147 listo para revisión con 30/30 QA PASS; **NO certificación comercial**. No se mutaron datos de clientes, no se envió correo nuevo, no se hicieron pagos, no se tocaron ONE/STUDIO ni producción.
