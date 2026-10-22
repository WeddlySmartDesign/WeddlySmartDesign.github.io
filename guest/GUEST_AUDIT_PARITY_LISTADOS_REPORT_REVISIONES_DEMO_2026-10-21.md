# GUEST — Auditoría de paridad ONE, revisión documental y demostración sin navegación doble — 21/10/2026

## Incidencia notificada
La propietaria revisó `guest/guest-demo-motor-real.html` y constató (1) ausencia de revisiones documentales en los listados; (2) menú externo horizontal arriba más barra inferior nativa; (3) duplicación del encabezado «GUEST by WeddlySmartDesign» en cabecera exterior y pantallas interiores; (4) desconexión visual/funcional respecto a la última experiencia ONE.

### Diagnóstico reproducible
La página de DEMO anterior cargaba directamente `guests-v114-integrated.html` y solo tres parches de mesas, saltándose las 24 capas de GUEST que se ejecutan al entrar por `guest/index.html`. El archivo `guests-copy-control-v1.js` YA ESTÁ en GUEST real y en ONE. Ambos implementan las mismas 15 funciones estáticas de control de copia. Ausencia en DEMO ≠ pérdida de la función en GUEST producto.

## Matriz de carga: GUEST real vs nueva PREVIEW
- Fuente de runtime: `guest/index.html` → 26 referencias externas: 24 módulos funcionales/visuales y 2 módulos de autorización/sincronización de cuentas.
- PREVIEW rectificada: `guest/guest-demo-one-parity-full.html` → esos **24 módulos** conservados y **solo** exclusión deliberada de `guests-access-layer.js` y `guests-production-sync.js`; sustituidos por una capa local de datos ficticios y APIs simuladas. No utiliza licencias reales ni levanta una réplica paralela del motor.
- Núcleo auténtico: `guest/guests-v114-integrated.html`, incluido plano `guest/guests-v081-visual-seating.html`, con las mejoras `guests-seating-v2.js` y `guests-seating-sync-hotfix-v1.js`.
- Gestión de altas, importación y personas: `guests-import-audit-v1.js`, `guests-people-manager-v1.js`, `guests-people-polish-v1.js`.
- Informes: `guests-production-ops.js`, `guests-service-visibility-v1.js`, `guests-custom-lists-v1.js`, `guests-extra-event-lists-v1.js`, **`guests-copy-control-v1.js`**. Informes premium `guest-visual-tables-lists-v1.js`.
- RSVP: `guest-demo-rsvp-real.html` cargaba el núcleo V3 sin parches; corregido para incorporar los 13 scripts del runtime `guests-rsvp-operations-live.html`, incluido el compositor de invitaciones, sin habilitar el envío auténtico de invitación premium no entregada.
- Eventos: `guest-demo-events-real.html` ejecuta el motor existente `guests-events-v3.js`; en PREVIEW de paridad se retira la capa simplificadora que ocultaba campos originales.
- Visuales: `guest-visual-premium-v1.js`, `guest-visual-hoy-invitados-v1.js`, `guest-visual-tables-lists-v1.js`. Solo un encabezado con marca en la pantalla interior; el contenedor superior exterior y sus botones eliminados.
- Navegación: barra inferior nativa Hoy/Invitados/Mesas/Listados; los botones originales abren RSVP y Preboda en su pantalla. En vistas independientes aparece solo un botón «Volver a invitados», no un segundo menú ni una segunda marca.
- Ruta antigua `guest/guest-demo-motor-real.html` en rama PREVIEW redirige a `guest/guest-demo-one-parity-full.html`, evitando versiones simultáneas con UX distinta.

## Revisiones documentales efectivas
La capa `guests-copy-control-v1.js` conserva la lógica completa de ONE:
- Numeración de copias `C001, C002...` y revisión `R01, R02...`.
- Incremento de revisión solo cuando cambia la huella de contenido del informe; nuevas copias de revisión idéntica mantienen la revisión.
- Estados: sin copia, revisión vigente pendiente de marcar como entregada, entregada vigente, o desactualizada tras cambios.
- Marca de última copia entregada y de su revisión.
- Historial de copias con tipo de archivo y fecha.
- Inserción de código/control en PDF imprimible y en CSV.
- Alcance de informes: mesas, catering, transporte, alojamiento, preguntas RSVP personalizadas y eventos extra.

La DEMO inyecta exclusivamente para pruebas unas respuestas con preguntas personalizadas y un evento (preboda), sin mezclar información de clientes. El mock deja abrir una ventana local en blanco para que los PDF de la capa real puedan imprimirse y bloquea las URLs remotas; no efectúa pagos, email o envíos.

## Desviación de paridad REAL en GUEST, independiente de la DEMO
Se detectó que `guest/guest-events-product-v1.js` **elimina del DOM** las secciones «Presupuesto y pagos» y «Tareas específicas» de los eventos. El motor original sigue incluyendo estas funciones. En QA históricas `guest/qa/b6_5_extra_events_test.js`, `guest/qa/b7_5_extra_events_visual_test.js` y `guest/qa/guest_independent_regression_test.js` se EXIGE su desaparición. Esto contradice la instrucción actual de conservar exactamente el módulo Invitados de ONE excepto el editor de la invitación principal y el configurador RSVP.

Para no alterar una rama de producto ni hacer pasar pruebas antiguas, se creó la rama AISLADA `guest-one-parity-verification-2026-10-21`: archivo `guest/guests-events-v3.html` cambiado únicamente para no ejecutar esa capa. No se fusionó en `guest-independent` ni producción; se requiere actualizar criterios y tests B6/B7 deliberadamente si se consolida la paridad de eventos. En la PREVIEW de capturas esa capa se eliminó del HTML ya el 21/10.

## Seguridad y límites de QA
- PREVIEW en `guest-demo-capturas-2026-10-21`, Cloudflare despliega automáticamente; no es el comercial ni `main`.
- Restricción de PREVIEW `connect-src 'none'` y `frame-src 'self'`: URLs externas a Supabase simuladas localmente y marcos únicamente del mismo origen. No se usan tokens, correo o datos de clientes.
- Las 5 entradas fuente HTML/JS de demostración inspeccionadas sintácticamente: 5 resultados PASS.
- Comparación del manifiesto HTML: **24 de 24 capas de cliente cargadas**; exclusiones esperadas, solo acceso y sincronización reales (no corresponden a una DEMO con datos ficticios).
- Cloudflare build/deploy del commit nuevo y logs de integración confirman despliegue de PREVIEW, NO una navegación en Chrome/iPhone real. Pruebas visuales de interacción física, ruta HTTP completa, modales, impresión y ausencia de regresiones en dos teléfonos **no certificadas** aún; no afirmar lo contrario.
- Compra, invitación definitiva vinculada a licencia, envío WhatsApp auténtico, dos móviles reales y el E2E del catálogo **no están simulados como reales**. GUEST comercial continúa NO_GO hasta los recorridos TEST y físicos exigidos.

## Política de continuidad
No reconstruir ONE. No modificar producción ONE, STUDIO, Partner ni masters de las invitaciones. Para hacer capturas de características, usar únicamente la página nueva de captura con motor completo, con datos ficticios identificados fuera de la imagen comercial. No presentar ficticios como experiencias reales de clientes.

## Incidencia visual — 22/10/2026 · Aviso de conexión y cambio de color en la PREVIEW

La propietaria aporta captura de la PREVIEW de «Clara & Mateo» (20 invitados), con pastilla «Pendiente de conexión» y dificultad para cambiar la paleta de colores.

**Diagnóstico:**
- La PREVIEW aislada no carga `guests-production-sync.js` ni el backend real. No dispone de cuenta, licencia ni dos móviles sincronizados. Cualquier aviso de conexión en esta pantalla NO demuestra una caída del wifi/móvil ni indica el estado de producción; es impropio de la vista editorial.
- La entrada anterior `guest-demo-one-parity-full.html` utilizaba capas UI del producto, cuyo botón `Ajustes` navega a `guest-settings.html` mediante `window.top.location.assign`. Eso abandonaba el contenedor local ficticio y no permitía un retorno fiable.
- `guest-settings.html` guarda el estilo en `weddly_personal_theme_v51`, con las cinco opciones Nordic, Blush, Arena, Slate, Editorial. La capa `guest-visual-premium-v1.js`, aplicada después de `guests-production-ui.js`, contiene variables CSS con la paleta verde por defecto y reglas !important que pueden ocultar visualmente cambios de tema; requiere una corrección de coherencia en la interfaz real antes de certificar el cambio de estilo fuera de la PREVIEW.

**Cambios realizados, exclusivamente en la rama `guest-demo-capturas-2026-10-21`:**
- `guest/guest-demo-settings-real.html` deriva de los ajustes reales. Guarda el tema en almacenamiento local, envía un aviso seguro al contenedor y regresa a la misma PREVIEW. Se evita consultar acceso real y se muestra explícitamente que la sincronización está desactivada en la muestra.
- `guest/guest-demo-one-parity-full.html`: abre Ajustes dentro de un marco superpuesto conservando el módulo original y sus 24 capas. Intercepta el clic al nivel de la ventana del iframe para evitar la navegación a la aplicación real; elimina únicamente cualquier pastilla local con el texto exacto de «Pendiente de conexión». Protege los nombres y el tema local ficticio.
- `guest/guest-demo-theme-preview-v1.js`: aplica las cinco paletas aprobadas después de la capa premium, actualizando fondo, tarjetas, barra inferior, botones y acentos, sin alterar el producto comercial.
- Análisis sintáctico de los nuevos scripts de PREVIEW superado, con las cinco opciones presentes. Cloudflare despliega por rama; comprobar `check-runs` del commit final antes de comunicar URL.

**Límites:** no se han modificado `guest-independent` (salvo documentación), ONE, STUDIO, backend, licencias, ni producción. La ausencia de backend real en PREVIEW es deliberada y, por definición, no permite una prueba de sincronización. Publicación de Cloudflare y revisión estática no equivalen a verificar clics y visual de un móvil real. Antes de vender, corregir y probar coherencia de estilos en el runtime comercial aislado.
