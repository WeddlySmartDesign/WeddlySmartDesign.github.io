# GUEST · Web comercial V5 móvil primero (21/10/2026)

**Estado:** revisión artística y de experiencia, NO aprobada comercialmente, NO publicada y sin habilitar cobros. **V2/V3 rechazadas y V4 descartada como dirección artística vigente**. Se preservan las invitaciones máster, Cloudflare PROD, ONE, STUDIO y PR #144/#145.

## Contexto y siete correcciones de la propietaria
La revisión del vídeo `20261021-0818-45.4077933.mp4` y las observaciones del 21/10 establecen:
1. Evitar parecido artístico con La Qualité (https://laqualite.es/). Revisar su MODELO de comercialización, nunca replicar colores, disposición editorial o promesas de exclusividad. La Qualité sí anuncia RSVP, mesas, exportaciones y avisos.
2. Las fotos del catálogo deben enseñar el **estado de portada una vez terminada la apertura**, con nombres, fecha y lugar, no solo el decorado.
3. Debe figurar LIMONEROS. No incluir sin revisión el D03 incorrecto en venta.
4. Hero con movimiento real del original, no dos fotos estáticas.
5. Todos los diseños visibles/recorribles en un carrusel móvil desde la propia página, sin botón «ver todas» y sin alargarla con cientos de tarjetas.
6. Mucho menos texto, proceso entero y plazos comerciales: cuestionario por correo en menos de 24 h tras la compra; propuesta de invitación en 48–72 h tras recibir datos completos; modificaciones necesarias hasta aprobación; solo entonces entrega de invitación y acceso a app. **Verificar capacidad operativa y contratos antes de venta**.
7. Sección mucho más visual con la utilidad real del motor GUEST, sin términos que exijan conocimiento previo del producto: envío, invitados/grupos, RSVP, menús/alergias, preboda y otros eventos con invitados seleccionados, mesas, dos móviles, listados, transporte/alojamiento. No anunciar automatización de recordatorios sin pruebas.

## Entregable y pruebas
**ZIP físico creado en conversación actual:** `/mnt/data/GUEST_WEB_V5_MOBILE_FIRST_REVISION_2026-10-21.zip`
- 217015932 bytes; SHA256 de contenedor `70619e3f69fe09132290720213763979b38cc0957525c23586d175f1b943b7ec`
- 129 entradas, manifiesto SHA256 de 127 recursos + README.
- 15 invitaciones completas: 14 HTML y recursos procedentes íntegramente del prototipo V4 basado en el ZIP sellado `GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip`; LIMONEROS como n.º 15 con HTML de Biblioteca `LIMONEROS_D03_GALERIA_FUNDIDA_GOLONDRINAS_LIBRES_2026-10-12.html` y medios del renderizador D03 original. **LIMONEROS es candidata a revisar**, porque posteriores cambios de cierre/vídeos del 12/10 podrían no estar incluidos; no sustituye la versión comercial certificada.
- Recurso de movimiento auténtico de portada `hero-azulejo-original.mp4`, copiado de la apertura original design-04 sin transformarlo.
- **15 pósteres móviles con fondo de final de vídeo auténtico** y tipografía/textos sacados de los propios HTML/CSS de cada invitación. Se capturó el estado visual con script sin reproducción del vídeo, insertando los datos ficticios de las muestras (habitualmente Lucía y Pablo; VEIL LIGHT Isabel y Hugo), con marcadores de fecha y ciudad.
- HTML móvil primero, galería horizontal swipe con 15 entradas visibles desde el primer nivel, índice de posición, flechas de accesibilidad, enlace a invitación completa en un gesto.
- Dos métricas de proceso `<24 h` cuestionario y `48–72 h` propuesta; línea editorial corta de 5 pasos y revisiones antes de la entrega conjunta.
- Seis experiencias ilustrativas táctiles con estado local y datos ficticios: invitaciones/envíos, confirmaciones y seguimiento, preboda/otros eventos, asientos/mesas, dos móviles sincronizados **solo en simulación**, logística/exportación de muestra CSV. Los controles no envían mensajes ni escriben en backend.
- Datos de contacto, precios y nombres comerciales no inventados. Identificadores numerados exclusivamente para revisión; no hay Stripe, Supabase, formularios reales ni enlaces al checkout.

## QA ejecutada
- Script de browser por renderización HTML/CSS/JS en memoria `guest_v5_dev/qa_v5.py` con pruebas interactivas **320 / 390 / 1440px**; 15 tarjetas, 0 overflow, cero errores JS; enlace interno a la invitación completa, métricas de plazo, cambio de asientos, RSVP ficticio, simulación de dos móviles, preboda, marcado de envío y listas presentes. **PASS en los tres tamaños**.
- 15 capturas de portada final construidas con CSS/DOM del original sobre fotograma final real y renderizadas sin video: `assets/finished-01.webp` a `finished-15.webp`.
- Archivo ZIP existente y central directory leído, 129 entradas, 15 rutas `invitaciones/NN/index.html` presentes; contrastes SHA256 de recurso con manifiesto superados en `index.html`, JS, varias miniaturas y muestras de invitaciones. **ZIP CRC 129/129 PASS real:** `ZipFile.testzip() is None` en 4,37 segundos, tras la creación; adicionalmente SHA256 puntual del ZIP frente al manifiesto y hash del contenedor verificados.
- No hay pruebas de vídeo/autoplay/Android físico desde esta entrega. Prototipo local en PC, no URL publicada ni E2E comercial.

## Continuidad
1. Revisar estéticamente la web V5 **desde el móvil** y completar QA visual de reproducción nativa (en PC Chrome/Edge también).
2. Resolver cuál es el máster final de LIMONEROS aprobado tras las correcciones posteriores al checkpoint de galería y sustituir SOLO esa muestra si procede; no recuperar el D03 original incorrecto.
3. Confirmar nombres comerciales y catálogo elegible; venta solo de diseños certificados.
4. Aprobar realmente compromisos de <24 h, 48–72 h y revisiones sin límite, costes, derechos, textos legales, capacidad de producción.
5. Integrar en PREVIEW no-sell, verificar E2E TEST aislado y dos móviles físicos, con autorización antes de cualquier GO, Stripe Live, producción o fusión.

**Importante**: Archivo ZIP de revisión V5 creado en `/mnt/data` y vinculado en la conversación. No hay afirmación de haberlo subido a Biblioteca (cuota previamente agotada). Los masters visuales de GUEST no se modificaron.
