# GUEST — BOTÁNICA D02 · PROGRESO DE CERTIFICACIÓN

Fecha: 2026-10-09
Rama: `guest-independent`

## Versiones protegidas

- V14 aprobada y congelada: no modificada.
- V14.5 candidata para QA técnico: SHA256 `ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84`.
- Estado del registro de catálogo: `certification-pending`, comercialmente inactiva.

## Evidencia heredada de comprobaciones previas

- 116 casos de configuración × tamaño y 8 equivalentes al formato del backend: PASS según checkpoint V14.5.
- Integridad multimedia original y paridad de escenas respecto a V14: PASS en el checkpoint anterior.
- Estas comprobaciones NO equivalen a dos pedidos reales end-to-end.

## Verificación realizada en esta continuación

- Confirmada en Supabase función `guest-invitation-flow` v12 con **solo VEIL LIGHT** habilitada.
- Confirmada correspondencia entre adapter Botánica V14.5 y registro `certification-pending` de GitHub.
- Confirmado que el empaquetador común bloquea explícitamente plantillas que no sean `commercially-frozen`. Ese bloqueo se conserva sin excepciones.
- Confirmados 5 elementos de vídeo y botón RSVP en el HTML V14.5.
- Cuatro bloques JavaScript extraídos del HTML han superado `node --check`.
- Intento de habilitar backend solo para pedidos `test` **NO EJECUTADO**: operación bloqueada por controles de seguridad del entorno. Backend permanece sin cambios.
- Intento de ejecutar pruebas locales con Chromium: `net::ERR_BLOCKED_BY_ADMINISTRATOR`, tanto URL local HTTP como `file://`; no hay resultados que se puedan declarar PASS de esa prueba.
- No hay conexión ni envíos a RSVP reales, ni nuevos pedidos de Supabase, ni cambios de Stripe o de venta.

## Próxima acción en entorno autorizado

1. Revisar versión e integridad del backend en el momento del despliegue.
2. Registrar Botánica V14.5 para `create_test` únicamente, con bloqueo explícito de pedidos `production`; conservar copia de reversión.
3. Crear dos pedidos de prueba diferentes desde el cuestionario común, no introducir datos en el HTML a mano.
4. Verificar preview = final con config idéntica, fotos/variantes, entrega de URL estable y límites de tipografía.
5. Verificar rutas personalizadas `rt`,`g`/`u`,`lang` con la aplicación RSVP real en sandbox/test, incluyendo registro de respuestas y ausencia de duplicados.
6. Certificar Mobile Center Android (objetivo tiempo activo <=5 min), revisar variantes visuales que no estaban en demo V14.
7. Solo si todo es PASS: fijar V14.5 como `commercially-frozen` y habilitar empaquetado definitivo. Publicar o vender solamente tras autorización específica.

**Conclusión:** Botánica V14.5 tiene la preparación técnica local documentada, pero continúa sin certificación comercial. No declarar segundo diseño completamente terminado todavía.