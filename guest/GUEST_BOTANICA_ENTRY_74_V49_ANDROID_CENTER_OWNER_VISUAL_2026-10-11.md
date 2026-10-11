# GUEST — Entrada 74 · V4.9 instalado en Android: Centro visible, motor remoto pendiente

Fecha: 11/10/2026. Rama: `guest-independent`. Este expediente registra la inspección de tres capturas enviadas por la propietaria. **Solo cambios documentales**; no se publica el material gráfico en GitHub para evitar exponer nombres/identificadores de pedidos.

## Confirmación real en el dispositivo
- Fotografías/capturas en conversación: `1000095358.jpg`, `1000095359.jpg` y `1000095360.jpg`.
- Se visualiza en Android la cabecera **«GUEST · CENTRO MÓVIL · V4.9 · CATÁLOGO TEST»**, la selección de encargos, varios encargos TEST existentes y su estado, panel de detalle, accesos a cuestionario/revisión/invitación y actualización.
- Se observa apertura del selector nativo de encargos con múltiples opciones sin errores mostrados. **PASS parcial de shell V4.9 y recuperación/listado de pedidos**. No afirmar de aquí que los botones de apertura de diseños de V4.9 se hayan accionado ni que el regreso al Centro esté revalidado en V4.9; el retorno previamente validado era V4.8.
- **Muy importante para escalabilidad:** los pedidos mostrados pertenecen a diseños existentes. El código V4.9 conserva Botánica en el motor incrustado y VEIL LIGHT en ruta nativa. Ninguna captura demuestra ejecutar la ruta **genérica remota D03+**, y aún no existe una plantilla tercera publicada para esta prueba. **El gate del motor genérico sigue PENDING**.

## Hallazgos de la revisión visual
1. El botón flotante de tres puntos se superpone parcialmente al encabezado en el móvil. Revisión de jerarquía y safe areas pendiente para la versión comercial consolidada, sin alterar V4.9 ya instalada.
2. En el pedido de benchmark que ya muestra estado **«Revisión enviada»**, las capturas sucesivas enseñan un contador mayor (de 1:21 a 1:35). Se revisó **el HTML V4.9 real**: el cronómetro incrementa con `setInterval` si hay `current`, pantalla visible, marca local `isTouchDone(current)!==true` y actividad reciente (<60s). La finalización solo ocurre al pulsar `send_review` localmente y guardar `guest_owner_touch_done_v1`; al abrir una revisión ya enviada en otra sesión, la marca local puede faltar y el contador suma tiempo improcedente. **Defecto real del indicador de tiempo:** no reinterpretar esos 1:21/1:35 como nuevo benchmark válido, no reabrir la medición de 41 s que ya tiene evidencia.
3. Las capturas muestran controles cerca del borde inferior de Android, pero no prueban que queden inaccesibles después de deslizar. No declarar un defecto funcional de navegación inferior sin prueba.

## Corrección futura necesaria sin molestar a la propietaria
- Ajustar la medición del Centro genérico para que `review_sent`, `approved` y `delivered` (y cualquier estado final pertinente) cierren la actividad, incluso al seleccionar/cargar desde otra sesión. Preservar marca local de mediciones antiguas; no falsear la duración histórica ni reiniciar el benchmark.
- Evitar superposición del botón de menú con encabezado y proporcionar jerarquía ajustable a móvil/safe area.
- Aplicar ambos ajustes en **una única candidata** al certificar el visor genérico D03+, no exigir sucesivas actualizaciones al usuario por problemas menores de visualización.

## Aceptación y pendientes precisos
- Botánica V14.7: **11/11 gates técnicos PASS** (Android V4.8 anteriormente); no hay motivo para repetir todo el circuito, RSVP, pedidos o cronómetro.
- Centro V4.9: **IMPORTACIÓN / SHELL / LISTA DE PEDIDOS PASS VISUAL REAL** según capturas; **V4.9 apertura-retorno no observada**; **render genérico remoto D03+ pendiente**.
- Cloudflare Pages: las capturas previas de configuración muestran GitHub integrado, rama `guest-independent`, comando `node guest/tools/build_catalog_static_preview.cjs --output "$PWD/dist" --template botanica`, destino `dist`, implementación automática y despliegue verde de último commit. Esto **refuta la necesidad de subir manualmente el ZIP** al proyecto conectado. Pero falta comprobar desde fuera el contenido HTTPS actualizado con un live smoke sobre el HEAD actual: estado de deploy verde por sí solo no es prueba exact-byte del renderer.
- Checkout sigue **NO VENTA**; GUEST catálogo entero no terminado; D03–D06 no diseñados.
- No tocar ONE, Partner, STUDIO, VEIL, máster Botánica, V4.8 aprobado, `main` ni archivos congelados; no reabrir prueba Android V4.8.

## Siguiente acción mínima
La propietaria no necesita volver a configurar Cloudflare. Si se desea una sola comprobación manual no redundante, en V4.9 seleccionar **un pedido TEST «Entregada»** → tocar **«Ver invitación»** → comprobar que abre → regresar con **«CENTRO GUEST»**. Esta prueba valida regresión V4.9 sobre motor existente, **no** prueba el renderer remoto de nuevos diseños; la certificación genérica debe tener su propio caso de aceptación sin construir D03 comercial primero.

Persistencia: GitHub `guest/START_HERE.md`, estado JSON e índice de continuidad apuntan a esta entrada. Biblioteca histórica sin cambios.
