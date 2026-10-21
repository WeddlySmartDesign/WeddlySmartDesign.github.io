# GUEST · DEMO para capturas de funciones · 21/10/2026

## Objetivo
Permitir a la titular obtener capturas desde Android de las funciones de GUEST sin disponer de una boda entregada y una licencia real.

## Fuente y publicación
- Repositorio: `WeddlySmartDesign/WeddlySmartDesign.github.io`.
- Rama aislada: `guest-demo-capturas-2026-10-21` (derivada de la rama GUEST PREVIEW `guest-integration-no-sale-preview-2026-10-20`).
- Único archivo modificado respecto de la rama de partida: `guest/guest-demo-capturas.html`.
- Commit validado: `e554523a5ed771ec56e1ac0e1069a5f29b4da310`.
- Cloudflare Pages marcó **SUCCESS** el despliegue PREVIEW correspondiente a `https://354213a1.guest-weddlysmartdesign.pages.dev`.
- Ruta para capturas: `https://354213a1.guest-weddlysmartdesign.pages.dev/guest/guest-demo-capturas.html`.
- La URL de rama anunciada por Cloudflare no debe sustituir a la inmutable sin verificación.
- Descarga local autónoma: `guest-demo-capturas.html` generada en la conversación; respaldo fuente TXT en Biblioteca → GUEST by WeddlySmartDesign.

## Alcance funcional demostrativo
Datos exclusivamente ficticios: boda Clara & Mateo (12/06/2027), 26 invitados de ejemplo y grupos/unidades. Inicio con indicadores, búsqueda y filtros de invitados, modificación manual de estado RSVP, marcado local de envíos, acompañante +1, cuatro mesas con asignación/aforo, grupos/subgrupos, cenas/brunch independientes con selección de invitados, exportación CSV, cinco temas visuales, invitación ilustrativa y enlace a BOTÁNICA PREVIEW.

La DEMO se inspira en la identidad visual y los módulos GUEST verificados documentalmente; **NO es el frontend productivo original ni certificación end-to-end**. En particular, no incluye motor real de envío, pagos, edición de invitación, configuración de preguntas RSVP, creación de licencias, entrega, servidor ni sincronización entre dos dispositivos. Todos los cambios se guardan exclusivamente en `localStorage` del navegador, sin acceso a datos reales. Al reiniciar la DEMO se recupera la boda ficticia. No compartir capturas como si fueran capturas de datos reales.

## Pruebas y correcciones
- JS sintaxis válida; sin dependencias externas ni llamadas `fetch` en la DEMO.
- Chromium headless local mediante `set_content` porque la política del contenedor bloquea navegación `file://`.
- Anchuras 320, 390 y 1440: portada sin overflow horizontal ni errores JavaScript.
- Chrome 390: inicio, pestañas Invitados/RSVP/Mesas/Más, evento extra, guardado de su lista, edición manual RSVP, exportación CSV y tema Blush: PASS.
- Incidencia detectada antes del despliegue final: formularios con control `name=id` interferían con `HTMLFormElement.id` y navegaban al guardar. Corregido identificando el formulario mediante `getAttribute('id')`; prueba repetida PASS.
- Cloudflare Pages check GitHub del último commit **SUCCESS**. El entorno de navegación externo no permitió inspeccionar la ruta desplegada por HTTPS; todavía falta comprobación visual Android real por titular.

## Aislamiento / reglas
- No tocar ONE, STUDIO, catálogo comercial, checkout ni datos de clientes.
- La DEMO pública sólo contiene datos ficticios y lleva `noindex`; no es un entorno seguro para introducir información personal porque no existe control de acceso.
- Toda mención a envíos, RSVP, gestión de invitados o exportaciones dentro de la DEMO significa **simulación local**, no prueba de interoperabilidad con el backend.
- VENTA GUEST: **NO_GO**, sin modificación respecto a auditorías anteriores.
