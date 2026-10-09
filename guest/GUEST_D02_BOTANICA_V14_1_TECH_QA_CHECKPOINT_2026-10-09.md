# GUEST — D02 BOTÁNICA | Cierre técnico, 09/10/2026

## Estado y límite
**V14:** aprobada visualmente y FROZEN, bytes intactos. SHA256 `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39`.

**V14.1:** SHA256 `578965b817e67fe21de1890137f727c2f041cc70c45acb6268c02e5a1e6993f3`.  candidata técnica derivada únicamente de la V14 para corregir la representación de opciones reales del cuestionario, sin ajustes de composición, fuentes, fondos, transiciones o animaciones de la demo aprobada. No sustituye V14 ni constituye certificación comercial.

## Defectos reproducidos en V14
Matriz a 390px, 25 configuraciones independientes:
1. `locations.dressCode.enabled = true`: su texto se pierde completamente.
2. `cover.photo` presente, `story.photo` ausente: la fotografía no se usa.
3. Historia activada con foto pero `textMode = none`: se pierde la escena fotográfica.

No se ha tratado el fallo con excepciones por pareja. La candidata utiliza la foto principal como `photo-interlude` nativa que ya estaba diseñada en V14 (sin añadir una sección o escena artificial) y presenta vestimenta junto a los datos del lugar. Adicionalmente, lleva `fit/focusX/focusY` del cuestionario a las fotografías de historia/lugar/galería.

## QA automatizada ejecutada
- 25 configuraciones × anchos 320/360/390/430 px = **100 comprobaciones** (HTML sin medios incrustados **solo para acelerar QA**, con el mismo CSS, JS funcional y DOM de la candidata).
- Resultado: **100/100 sin errores de JavaScript, sin scroll horizontal, sin texto ni botones horizontalmente recortados**, ni fallos de la matriz seleccionada.
- Combinaciones comprobadas: pareja larga, un/dos lugares, foto/texto, Agenda 0/1/3/5, Práctico 0–4 y varios modos (bus de hasta 3 paradas/4 vueltas, hotel de reserva externa y códigos largos, regalo Bizum/banco/texto/enlace, música/enlace/solicitud, galería y contador OFF, foto de portada y vestimenta ON, textos largos).
- Interacciones: botones y enlaces de hotel/playlist/regalo/mapa renderizados; modal de información enseña código y nombre de reserva, «Ver datos» enseña IBAN, cierre de modal correcto y RSVP de demo muestra aviso si falta ruta; fotografía `full` y foco 0/100 conservados.
- Regresión visual con **la misma configuración normal y medios retirados solo en ambas copias de QA**: las escenas Portada, Agenda, Práctico, Galería y Cierre tienen dimensiones y píxeles **idénticos** a V14 (comparación de capturas a 390px con animaciones deshabilitadas para determinismo).
- Integridad de medios: coincidencia bit a bit de los **3 recursos `video/mp4` base64** y los **14 recursos `image/webp` base64** documentados dentro de HTML. Los cinco elementos `<video>` del DOM permanecen intactos.
- Sintaxis JS de 4 scripts internos: PASS.

## No se ha certificado / requisito aún abierto
- Las pruebas automáticas de medios sustituidos no prueban decodificación real de vídeos/Android ni fuentes remotas. Una comprobación Android de la candidata con foto y vestimenta activadas aún es necesaria antes de acreditar esas variantes a nivel visual.
- Falta **un segundo pedido real diferente procesado por el cuestionario y backend**, sin modificar el renderizador entre pedidos. No equivale a una fixture sintética.
- Falta comprobar integración real del backend, `public_load`, paquete final, estabilidad de `delivery_url`, personalización `rt/g/u/lang`, RSVP y paridad review/final con la plantilla Botánica registrada. Actualmente solo VEIL LIGHT está en registro comercial/backend; Botánica no debe publicarse ni asociarse a Stripe sin ese gate.
- Falta comprobar experiencia de propietaria desde Mobile Center y tiempo ≤5 minutos para pedidos Botánica.
- No introducir campos /subtítulos inexistentes ni una nueva app, otra lista de invitados o un RSVP alternativo.
- En el caso `story.textMode='preset'`, la resolución de `story.body` desde el backend es requisito explícito: esta candidata no inventa textos ni sustituye silenciosamente una selección de la pareja.

## Decisión de entrega
Conservar **V14 FROZEN** para seguridad visual. Guardar **V14.1 como candidata técnica con QA local parcial PASS**. Estado de catálogo: `certification-pending`; `scalabilityCertified: false`; `commercially-frozen`: NO. No publicar ni generar una venta con esta candidata hasta completar gates independientes.