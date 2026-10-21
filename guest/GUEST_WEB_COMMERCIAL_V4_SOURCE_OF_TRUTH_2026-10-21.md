# GUEST — WEB COMERCIAL · REINICIO REAL V4 · 21/10/2026

**Estado:** NUEVA DIRECCIÓN ARTÍSTICA PARA REVISIÓN DE LA TITULAR. SIN PUBLICAR, SIN ACTIVAR VENTAS, SIN APROBACIÓN FINAL.

## 0. Corrección de entendimiento (prevalece sobre las V2 y V3 rechazadas)
La titular explicó que:
- El **producto es la invitación de boda completa**, no un clip ni un motor técnico.
- El acceso desde móvil debe ser inmediato: un toque en la muestra abre **todo el recorrido real** de la invitación, con apertura, nombres, fecha, lugares, información animada y cierre, sin separar en «tres actos» en la web comercial.
- Los nombres técnicos de catálogo («VIÑETAS · ELLAS», etc.) NO son nombres comerciales. No enseñarlos públicamente hasta que se apruebe nomenclatura. En esta V4 se usa una identificación provisional neutral («Invitación 01»…).
- El flujo explicado a una pareja que no conoce GUEST es: **ve la invitación → compra el diseño → envía datos/fotos → recibe el diseño realizado → pide TODOS los ajustes que necesite → aprueba → recibe la invitación definitiva dentro de la aplicación móvil de gestión**, desde donde la comparte y organiza la boda. No incluir editor de invitación ni editor RSVP para pareja.
- Explicar visualmente beneficios añadidos **después** de mostrar claramente el producto y el proceso, sin depender de conocer marcas o terminología técnica.
- La web debe permitir catálogo futuro creciente sin hacer infinita la portada: seis muestras iniciales y galería independiente, buscable/paginada, y registro de diseño.
- **La Qualité** (https://laqualite.es/) se revisó como referencia del **concepto comercial** (catálogo de invitaciones completas en un toque, oferta comprensible, proceso, gestión incluida), NO como identidad visual a copiar. LaQualité ya anuncia varias funciones de gestión, por lo que no se afirma exclusividad no probada de GUEST.

## 1. Entregable creado
Paquete de revisión en archivo físico de la conversación:
**GUEST_WEB_V4_REHECHA_INVITACIONES_COMPLETAS.zip**.
- Tamaño: **185291772 bytes**.
- SHA256: **bef4eb8008b41e0f430ab3859af152499b80d3670d4740610c77338ecfea68bd**.
- 110 entradas ZIP, CRC íntegro PASS.
- **109/109 recursos** coincidentes por SHA256 contra `MANIFIESTO_INTEGRIDAD.json` dentro del paquete (el manifiesto se incluye como archivo 110).
- Los **14 recorridos originales completos de preproducción**, bajo `invitaciones/01…14/index.html` con sus respectivos medios; no solo imágenes iniciales ni clips.
- 14 imágenes JPG de catálogo extraídas de originales sin ilustraciones inventadas.
- Web nueva: `index.html`, `styles.css`, `app.js`, `designs.js`, `LEEME_PRIMERO.md`.
- Dos capturas de previsualización elaboradas a partir de la interfaz real del prototipo: `GUEST_WEB_V4_PREVIEW_ESCRITORIO.jpg` y `GUEST_WEB_V4_PREVIEW_MOVIL.jpg`, suministradas como archivos separados del chat.
- **No está desplegado en Internet**. En Biblioteca no se intentó guardar por el límite de cuota previamente comprobado. La fuente canónica de las invitaciones continúa en el ZIP sellado de Biblioteca.

## 2. Qué muestra el prototipo
1. Inicio editorial basado en **fotogramas auténticos** del diseño elegido; acceso directo a su invitación completa. Sin teléfonos genéricos, nomenclatura técnica ni menú de vídeo por fases.
2. **Seis muestras visibles en home**, cada una con enlace directo a su `index.html` real. Galería desplegable independiente con búsqueda y 8 entradas por página para los demás. Adaptación a móvil 390 y 320.
3. Información completa de proceso de compra y confección, explícitamente: elección+compra, cuestionario, revisión de propuesta, cambios necesarios, aprobación y entrega final dentro de la app. Sin botones de compra LIVE.
4. Sección visual tras el proceso con 5 pestañas interactivas **de ejemplo**, no falsas capturas de producción: envío de invitación, confirmaciones/avisos, preboda/eventos, mesas (mover invitado), dos móviles (cifra ilustrativa compartida). Personajes, cifras y contenido en las demostraciones son sintéticos; sin backend. Puede probárselas sin introducir información personal.
5. No depende del nombre comercial GUEST: se explica como **«Compráis una invitación y recibís también una app para organizarlo todo»**. La marca GUEST solo figura en la cabecera/firma.

## 3. Preservación de originales y muestras
- Archivo de origen exclusivamente de lectura: `GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip` (SHA256 `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`).
- D03 histórico incorrecto y D09 «LIMONEROS Claude» pendiente de identidad artística quedan **fuera de galería pública**.
- Se utilizan configuraciones de demostración presentes en fuentes originales, no se inventan nombres/fechas de una pareja real. En VEIL LIGHT: **Isabel y Hugo, Madrid, 18/09/2027**; en diversos otros: **Lucía y Pablo, Murcia, 18/09/2027**.
- La copia de VEIL LIGHT del prototipo se ha adaptado **solo para muestra**, eliminando de ella los cinco bloques de protección de *entrega autentificada* del código del prototipo y dejando que se muestre su escenario ficticio por defecto. **La invitación original de PREVIEW, su acceso con token y el backend comercial no se modificaron**. No usar esa copia de demostración para entrega a clientes ni mezclarla con producción.
- Los banners internos `stage-notice` de diagnóstico «REVISIÓN TEST · NO VENTA» se ocultan en las copias locales por CSS de revisión. La web de muestra lleva su propio aviso visible de no venta. **No hacer estas adaptaciones en los masters originales**.

## 4. QA REALIZADO Y LIMITACIONES
- QA de la web mediante Chromium local `page.set_content` e inyección de fotos originales: **1440, 390, 320** sin overflow horizontal, cero errores JavaScript. 6 tarjetas iniciales; galería 8+6 paginada; abrir/cerrar; mover invitado en representación de mesas y mantener cifras consistentes en simulación de dos móviles. PASS.
- Fuente HTML completa de VEIL LIGHT evaluada en navegador con escenario ficticio: contenido de nombres/fecha/lugar presente, primera pantalla de «ABRIR INVITACIÓN» visible. No hubo envío a backend.
- CSS/JS sintaxis y directorios físicos verificados. SHA256/CRC del ZIP íntegros.
- **No hay validación visual completa de las 14 invitaciones en Android real** ni audio/vídeo real desde el visor `file://` en el navegador automatizado por bloqueo del entorno (ERR_BLOCKED_BY_ADMINISTRATOR). No declarar ese requisito PASS sin probarlo.
- No se ha publicado la web, no hay Stripe, cobros, correos, entrega real ni sincronización E2E. El estado comercial global continúa **NO_GO**. Tampoco se han modificado ONE/STUDIO ni PR #144/#145.

## 5. Instrucciones de continuidad
Si hay revisiones artísticas: **partir de V4**, no V2/V3. Inspeccionar primero las 14 experiencias reales y evaluar el recorrido en móvil; la web V4 es **candidata en revisión** y NO diseño aprobado. La propietaria valorará su arte, facilidad de uso y comunicación. Cambios de nomenclatura comercial y selección final de diseños se decidirán sin exponer IDs técnicos en el sitio público. Revisar antes de venta las capacidades legalmente prometidas, el plazo 48–72 h documentado en contrato, revisiones necesarias, derechos y E2E. No activar producción sin autorización.
