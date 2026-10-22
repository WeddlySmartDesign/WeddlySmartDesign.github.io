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
