# GUEST by WeddlySmartDesign
## MANUAL MAESTRO DE DISEÑO, PRODUCCIÓN Y CONTROL DE CALIDAD
### Diseños 03, 04, 05 y 06 · Edición 1.0 · 9 de octubre de 2026

**Estado del documento:** GUÍA OPERATIVA PROPUESTA, consolidada a partir de instrucciones explícitas, documentación canónica, contratos técnicos, certificaciones y errores de VEIL LIGHT/BOTÁNICA. El presente documento no altera ninguna plantilla, catálogo, esquema ni flujo de producción. Se convierte en requisito de trabajo para los cuatro diseños restantes; cualquier contradicción con el contrato canónico o esquema vigente obliga a detener el cambio y verificar la fuente antes de implementarlo.

> **Regla rectora:** El trabajo de la propietaria consiste en revisar el diseño acabado en Android y decidir si transmite la calidad buscada. No consiste en encontrar defectos, recordar los requisitos, probar versiones rotas, recolocar elementos, aprender herramientas ni ejecutar tareas manuales. Ninguna candidata pasa a sus manos sin una revisión interna completa y evidencias.

---

## 0. CÓMO UTILIZAR ESTE MANUAL (LECTURA OBLIGATORIA)

Antes de cualquier trabajo sobre GUEST:

1. Abrir `guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md` y los contratos citados en §18 de ese archivo; comprobar la rama activa `guest-independent`, el estado del catálogo y el último máster sellado.
2. Leer **este manual entero**, especialmente los apartados de esquema, escenas, diseño global, QA y versionado. No confiar exclusivamente en lo recordado de un chat; ni un chat largo ni un nuevo chat cambian las reglas.
3. Crear la ficha específica del diseño nuevo, con su universo estético propio y correspondencia uno-a-uno con el cuestionario. Escribir sus *invariantes*: qué no debe cambiar mientras se afina una sección.
4. Ejecutar los controles y registrar las pruebas antes de mostrar ningún enlace a la propietaria.
5. Si falta una fuente técnica o no se puede probar algo, declararlo **pendiente**, no fingir que se ha comprobado.

**Precedencia documental:** contrato y esquema vigentes de GUEST en repositorio > máster canónico de producto > checkpoints de diseños cerrados > esta guía de procedimiento > ideas de trabajo/propuestas > mensajes informales de un chat. Una decisión explícita nueva de la propietaria puede cambiar una norma, pero debe documentarse con fecha y alcance antes de aplicarse. Nunca resolver silenciosamente una contradicción.

## 1. INVENTARIO REAL Y ESTADOS

| Activo | Lo verificado | Lo que NO debe inferirse |
|---|---|---|
| **Diseño 01 — VEIL LIGHT** | Versión **5.3.3** `commercially-frozen`, certificada en registro de plantillas. Las pruebas V5.2 se documentaron separadamente (231/231 estados en 3 anchos y segundo pedido distinto). | No usar VEIL LIGHT como gramática visual obligatoria de los demás diseños: su **sistema de producción** se comparte, no su estética. |
| **Diseño 02 — Botánica / Atelier** | **V14** aprobada por la propietaria el 09/10/2026. Fuente `GUEST_D02_BOTANICA_ATELIER_V14_PORTADA_Y_LEGIBILIDAD_2026-10-09.html`; respaldo idéntico `GUEST_D02_BOTANICA_ATELIER_V14_FROZEN_2026-10-09.html`; SHA-256 **27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39**. | Aprobación visual y copia congelada **NO** equivalen a certificación de escalabilidad ni a registro comercial. El registro consultado aún mostraba solo VEIL LIGHT. No incorporar Botánica a venta sin gates. |
| **Diseños 03–06** | **Pendientes**. Son los cuatro diseños que quedan para completar el objetivo de seis. | No hay que inventar nombres, estilos, precios, recursos, aprobaciones ni detalles de dirección artística todavía no verificados. |

**Regla de congelación:** conservar exactamente los bytes de cualquier edición aprobada, un checksum, la fecha, una nota de alcance y la ruta de recuperación. Las nuevas candidatas **nunca** se editan sobre un archivo `FROZEN`. Todo cambio empieza copiando la última base **verificada**, y conserva su antecesora. Guardar tanto el HTML autocontenido como el checkpoint. El estado no se anuncia hasta que la copia existe y su integridad está comprobada.

**Importante:** congelar no es publicar; la publicación/Stripe en vivo para el nuevo catálogo sigue bloqueada hasta autorización expresa.

## 2. OBJETIVO COMERCIAL Y LÍMITES INNEGOCIABLES

GUEST **se compra por la invitación digital premium**. La gestión de invitados es un diferencial incluido y posterior, no el mensaje visual dominante de la venta. El recorrido único es: catálogo → elección → compra → cuestionario común → preparación → revisión móvil interna → revisión de pareja → ajustes acotados → aprobación → entrega de una invitación final estable → gestión incluida de invitados → envío por vías existentes → RSVP existente → mesas/listados/logística/eventos extra.

- **Un solo producto y una sola infraestructura:** catálogo, modelo de pedido, cuestionario, `guest-invitation-config-v1`, adaptador de plantillas, revisión, aprobación, entrega, destinatario, RSVP y gestión de invitados.
- Nunca reconstruir ni clonar GUEST, ni crear una segunda lista de invitados, un segundo emisor, un segundo RSVP o una segunda aplicación de mesas.
- **Intangibles absolutos:** ONE, ONE Partner, STUDIO y versiones `FROZEN`; trabajar únicamente en `guest-independent` cuando proceda editar GUEST.
- Sin anuncios, pagos, publicación, fusión a `main` ni rutas públicas nuevas por iniciativa propia.
- En la invitación de boda entregada **no mostrar branding de GUEST/WeddlySmartDesign**. En mensajes operativos, explicar funciones antes que nombres internos; nunca dar por hecho que la pareja conoce GUEST.
- **La propietaria no diseña ni codifica**: en condiciones normales solo abre la invitación terminada desde Android y emite valoración ligera. Meta operativa de **≤5 minutos de intervención por pedido**, no por diseño del catálogo.
- No contratar aplicaciones ni gastar créditos porque sí. Usar primero herramientas y recursos existentes; un nuevo gasto requiere una limitación real y retorno defendible.

## 3. PROCESO DE CREACIÓN: INVESTIGACIÓN → HUECO → SOLUCIÓN

Un diseño nuevo no nace de variar el color del anterior ni de añadir funciones al azar. Aplicar obligatoriamente esta secuencia:

**A. Referencias:** utilizar la investigación competitiva ya cerrada como punto de partida; contrastar solo novedades útiles cuando la dirección nueva lo necesite. Referencias segmentadas: La Qualité, The Digital Yes, The Digital Invite, The Sealed Invite; Join Wedding, InviteVault, Zinggly, Invitation RSVP; Fixdate, Joy, Paperless Post, Bliss & Bone; alternativas funcionales económicas. Ninguna marca es referencia única ni se copia literalmente.

**B. Análisis:** extraer el mejor tratamiento de entrada, ritmo, tipografía, fotografía, interacción, servicio de personalización, claridad y cierre; identificar lo que estas soluciones hacen mal o no resuelven.

**C. Diferenciación defendible:** diseñar una experiencia completa, coherente, emocional y con movimiento controlado. Debe dar sensación de personalización profunda sobre un sistema industrializado. **No debe parecer una plantilla reproducible sin dificultad en Canva.** Evitar confundir lujo con exceso de ornamentos.

**D. Decisión antes de código:** aprobar internamente una idea de arte global: un material/lenguaje dominante, paleta, tipografías, ritmo de escenas, puntos de movimiento, transiciones, usos fotográficos, acciones y tratamiento de módulos opcionales. Contrastar esta ficha con las otras cinco direcciones para garantizar **seis diseños realmente distintos**.

**E. Rechazo temprano:** si la propuesta no tiene un diferencial visual verificable o depende de correcciones manuales por pareja, se descarta o se replantea **antes** de producir veinte versiones superficiales.

## 4. REGLAS DE IDENTIDAD Y COMPOSICIÓN PREMIUM

### 4.1 Lo obligatorio
- Una **dirección artística dominante por plantilla**, reconocible desde la apertura hasta el cierre: mismos principios de luz, textura, color, tipografía, fotografía, proporción y movimiento.
- Impacto emocional en apertura y cierre; cuerpo editorial cuidado y útil. Las escenas informativas no necesitan superar visualmente a las emocionales, pero deben tener intención, dignidad y legibilidad.
- **Fotografías integradas**, con encuadre y punto focal correctos. No retratos deformados, recortes arbitrarios, fotos pegadas dentro de arcos o marcos decorativos estándar, ni bloque de foto que parezca un añadido barato.
- Tipografías coherentes con identidad y **legibles en móvil real**; jerarquía clara de titulares, subtítulos, hora, notas, enlaces y CTA.
- Espacio de respiración intencional, sin vacíos accidentales ni secciones kilométricas de texto. Evitar el estilo «página corporativa/editorial», fichas SaaS, tarjetas repetidas, grids estrechos, numeraciones ornamentales y looks de IA genérica.
- Acciones inequívocamente clicables. Si hay botón, **no añadir flecha redundante**. Evitar `+`/acordeones como solución para ocultar información necesaria o obligar a múltiples toques en una invitación que debe fluir.
- Copy humano, cercano, como una pareja hablando a quienes quiere; nunca redacción publicitaria corporativa dentro de la invitación.

### 4.2 Prohibiciones explícitas aprendidas
- No reemplazar una escena rica por simple texto sobre beige, ni usar difuminados como «parche» para corregir un problema de posición. La difuminación debe servir a la **unión visual entre escenas**, con protección real de contraste.
- No crear un bloque práctico de cuatro fichas idénticas ni una sección tan compacta que obligue a leer tipografía diminuta.
- No alargar la invitación por decoración vacía, botones para contenido ya visible, títulos repetidos o descripciones no recogidas por el cuestionario.
- No usar líneas móviles y texto como dos efectos incoherentes: la coreografía ha de sincronizarse por evento, sin agrupar accidentalmente los últimos dos elementos.
- No modificar el fondo/imagen/vídeo/música de un bloque congelado cuando el encargo solo dice «ajustar tipografía de Agenda».
- No introducir cambios globales o compartidos que alteren tres escenas al intentar corregir una.

## 5. CONTRATO ÚNICO DE DATOS Y CUESTIONARIO (NUNCA INVENTAR CAMPOS)

**Única fuente de datos:** `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json`, bajo `guest-invitation-config-v1`; contrastar siempre esquema y cuestionario efectivos, nunca una captura aislada de una pareja. El diseño recibe `applyConfig(config)` a través de su adaptador y solo representa los datos realmente disponibles. Si falta un campo indispensable, abrir revisión de producto del esquema **una sola vez**, no crear una excepción secreta por diseño.

### 5.1 Mapa de escenas por dato

| Escena | Fuente y estados | Criterio de diseño y QA |
|---|---|---|
| **Portada / apertura** | `couple.name1`, `name2` (hasta 30 cada uno), `wedding.date`, `wedding.coverPlace` (hasta 36), hora/visibilidad y foto opcional | Nombres y signos centrados; tratamiento neutro para iniciales con acentos; no quemar texto dentro del vídeo; nombres largos sin cortar ni desplazar manualmente. |
| **Cuenta atrás** | `countdown.enabled`, fecha | Ocultar entera en OFF; números extremos, días de una cifra o >99, fecha y zona horaria correctos. |
| **Nuestra historia** | `story.enabled`, `textMode` preset/custom/none, `body` (hasta 450), foto opcional | Ni frases extras de diseño ni texto inventado. Foto crop/full; no truncar la historia; permitir texto sin foto y viceversa según contrato. |
| **Lugares** | `locations.mode` shared/split; hasta 2 lugares; `time`, `name` (hasta 55), `address` (hasta 100), URL de mapa/web, foto y vestimenta opcional | Un lugar no deja dos tarjetas; dos lugares no se solapan; botones reales según URLs, no flechas; dirección/cultivo seguro. |
| **Agenda** | `agenda.enabled`; de **1 a 5** momentos; **solo `time` y `label`**; `label` máx. 28 | **No crear subtítulo, descripción ni segunda frase** por momento: el cuestionario no lo recoge. Mantener orden y ritmo, permitir menos de cinco, hora de madrugada y nombres largos. |
| **Práctico** | Submódulos independientes `bus`, `accommodation`, `gift`, `playlist` | 0–4 apartados; mostrar exactamente los datos y acciones pertinentes; si está OFF, no deja hueco ni botones ficticios. |
| **Confirmar asistencia** | `rsvp` + ruta resuelta externamente | Un único CTA integrado y visualmente claro abre el **RSVP existente**; no duplicar formulario. Mantener +1, niños, menús, alergias y preguntas en el motor/config existentes. |
| **Galería** | `gallery.enabled` y 0–4 fotos | OFF desaparece y el resto se reencadena; crop/full, fotos verticales, horizontales, panorámicas, distintas proporciones y focos. |
| **Cierre** | Datos de boda + `closing.line` opcional (máx. 80) | Legible con fondo real y música/vídeo, RSVP coherente, sin información cortada, final digno y bien unido a Galería cuando exista. |

**Terminología importante:** «Historia» contiene la frase que el formulario permite; si el formulario habilita una sola frase para un contenido, la plantilla muestra **solo esa frase**. El mismo principio se aplica a Agenda y a cualquier otro módulo: **nunca crear datos visuales inexistentes**.

### 5.2 Práctico: subcontrato obligatorio

**Transporte/autobús:** hasta 3 paradas, 3 horarios de ida y 4 de vuelta, nota opcional hasta 120, posible mapa; preferencia por horarios visibles y grandes. No repetir horarios en un botón «Ver horarios» si ya están escritos. Si hay más trayectos/horarios, la composición se adapta sin solapamiento.

**Alojamiento:** seis modalidades (`on_site`, `room_block`, `couple_managed`, `recommended`, `external_booking`, `none`); nombre, dirección, mapa, URL hotel, reserva, código, descuento, fecha límite, precio, teléfono y nota **solo donde procedan y estén cumplimentados**. Que «Información» y «Ver hotel» estén visualmente alineados y su diferencia funcional sea evidente. No mostrar «Ver hotel» sin URL real. El código de reserva largo debe envolver correctamente.

**Regalo:** modos `bank`, `bizum`, `external_link`, `short_text`, `none`; texto visible sin inventar, datos sensibles presentados solo si el flujo correspondiente los muestra, acción explicada y funcional. Si es solo texto, no inventar «Ver datos» vacío.

**Música:** `external_link`, `guest_request`, `none`; enlazar solo a URL válida si existe; no simular una playlist. Ajustar el copy y las acciones al modo real.

**Proporción:** aspirar a una escena corta en el caso representativo. **No es físicamente defendible prometer que cuatro módulos con la máxima cantidad de texto quepan siempre en una sola pantalla sin reducir la letra.** Regla de prioridad: información necesaria y accesible → tipografía legible → diseño compacto → altura mínima. Los detalles secundarios pueden abrirse con una acción **claramente etiquetada**, pero no esconder en acordeones lo que el invitado necesita entender de un vistazo.

## 6. CINEMATOGRAFÍA, ANIMACIÓN Y RENDIMIENTO

- Los efectos existen para que el contenido tenga ritmo: no por acumular partículas, destellos, zooms o adornos.
- La apertura y el cierre deben sentirse memorables, con transiciones dirigidas; Agenda puede tener una animación contextual más tranquila porque es informativa.
- Para escenas complejas, producción validada: **arte coherente → image-to-video bien integrado → tipografía, nombres, fecha y botones nativos en HTML/CSS**. El vídeo debe ser neutro respecto de la pareja.
- No animar un JPG plano como bloque si destruye profundidad; no recortar una foto en regiones duplicadas; no reconstruir pintura generativa compleja con SVG rudimentario.
- No gastar más créditos de vídeo si el clip aprobado basta, y no generar a calidad final hasta estabilizar encuadre y área segura de texto.
- Scroll: cada momento de Agenda debe activarse individualmente. Los cinco momentos no pueden mostrarse animando dos de golpe ni saltando el último; los efectos no deben dejar texto invisible al terminar.
- Animaciones que dependan de entrada en viewport o `IntersectionObserver`: verificar avance lento, rápido, hacia atrás, refresco y `prefers-reduced-motion`. En modo reducido el contenido sigue visible y legible.
- Controlar latencia, carga de media, autoplay restringido, imágenes de respaldo y ausencia de flashes o cortes de fondo al cargar. Nunca atribuir la calidad de una animación a una captura estática.

## 7. FONDOS, TRANSICIONES Y FLUJO GLOBAL: PRUEBA OBLIGATORIA

**Diseñar cada escena en el contexto de la invitación completa**, aunque solo se pida retocar un título. Debe existir una *prueba de scroll continuo* antes de enseñar cualquier candidata.

Límites críticos: Apertura→Portada, Portada→Historia, Historia→Lugares, Lugares→Agenda, **Agenda→Práctico**, Práctico→Galería, **Galería→Cierre**, y los saltos cuando un módulo opcional se omite.

Qué detectar: corte horizontal duro, fin abrupto de vídeo, foto que aparece en el primer píxel sin papel de transición, niebla inferior innecesaria, flor que tapa la última palabra, beige excesivo, fondo floral agotado antes de Regalo, distinta intensidad sin criterio, desaparece texto bajo barra del sistema, composición cambiada por un nuevo navegador/alto de ventana.

Una transición **no es un gradiente genérico**: se calcula y se valida para los dos lados del límite en el dispositivo real. El fondo y el efecto de una escena aprobada se declaran protegidos. No tocar los recursos originales si la solicitud es tipográfica o funcional.

## 8. ARQUITECTURA DE EDICIÓN SEGURA

**Regla de aislamiento:** un cambio de Agenda solo modifica selectores, nodos y scripts locales de Agenda. No se permiten reglas CSS amplias para `.chapter`, `.film-breath`, `h2`, `.late-world`, etc. cuando afectan otras escenas; si son inevitables, se debe demostrar que las demás escenas no cambian.

1. Antes de editar: base exacta, hash y *baseline* visual completa en móviles 320/360/390/430.
2. Definir alcance permitido y prohibido. Ejemplo: «cambiar animación de Agenda; intactos fondos, vídeos, Práctico, Galería y Cierre».
3. Revisar dependencias CSS/JS, clases compartidas, orden de reglas, wrappers, `z-index`, pseudo-elementos, efectos de viewport y configuraciones.
4. Implementar con clases/funciones locales; sin concatenar parches sucesivos ni añadir una pila indefinida de CSS `!important`.
5. Tras editar: diff de DOM/CSS/JS y comprobación por sección; verificar que los recursos que debían estar intactos tienen hashes idénticos.
6. Comprobar que los eventos click/touch funcionan. No basta que un enlace parezca botón.
7. Probar fuente y vídeo **real** en Chrome Android; si las fuentes externas no cargan en el entorno automatizado, indicar explícitamente la limitación y comprobar la fuente real antes de cerrar.
8. Si aparece regresión: rollback inmediato al último checkpoint válido, investigar causa raíz y arreglar una vez de forma genérica. No encadenar cuatro versiones defectuosas.

**Prohibidos:** `if (name === "Lucía")`, `I&H`, coordenadas por pareja, estilos por pedido, dependencias del texto de ejemplo, links de prueba vendidos como reales, contenido de un pedido antiguo reutilizado en otro.

**Versiones por pedido:** fijar `template_id` y `template_version` al crear pedido. No actualizar bodas en curso silenciosamente tras una nueva versión del catálogo.

## 9. FASES Y GATES DE TRABAJO — NINGUNO SE PUEDE OMITIR

| Gate | Responsable | Salida obligatoria | Bloqueo |
|---|---|---|---|
| **G0. Contexto** | Asistente | Canónico leído, rama/versiones verificadas, esquema leído, restricciones y artefactos localizados | Fuente incierta o conflicto sin resolver: NO avanzar. |
| **G1. Dirección artística** | Asistente | Comparativa de referencias, hueco y concepto original, paleta/material, mood, recorrido de escenas y firmas visuales | Si recuerda a una landing genérica o un duplicado de D01/D02: descartar. |
| **G2. Prueba de apertura** | Asistente + revisión ligera de propietaria si imprescindible | Static y motion con área segura para nombres; clip aprobable | No construir 8 secciones alrededor de una apertura que no funciona. |
| **G3. Sistema modular** | Asistente | Render integral con datos del cuestionario común, 0–4 prácticos, 1–2 lugares, 1–5 momentos, galería opcional, cierre y CTA a RSVP existente | Ningún campo ficticio ni funcionalidad duplicada. |
| **G4. Pre-QA interno** | Asistente | Capturas/tomas de todo el recorrido, diagnóstico en scroll, contraste y controles | No enviar versiones rotas/visualmente inconsistentes. |
| **G5. Revisión artística Android** | Propietaria | Dictamen visual — aprobar, corrección acotada o rechazo | Su papel NO es detectar errores básicos ni hacer diseño manual. |
| **G6. Congelación visual** | Asistente | Copia idéntica + SHA + acta + ruta de recuperación | No afirmar «congelado» sin bytes guardados y comparación. |
| **G7. Certificación de escalabilidad** | Asistente | Matriz extrema + dos pedidos diferentes sin tocar render entre ambos + QA móvil | No llamar `commercially-frozen` sin PASS real. |
| **G8. Integración comercial** | Asistente, aprobación explícita para publicar | Paridad revisión/entrega, URL estable, recipient context/RSVP, workflow ≤5 min, registro correcto | No publicar ni conectar Stripe hasta autorización. |

En cada gate indicar `PASS / FAIL / BLOCKED / NOT RUN`. **Una prueba no ejecutada jamás aparece como PASS**.

## 10. MATRIZ MÍNIMA DE ESCALABILIDAD Y DISPOSITIVOS

**Paridad exigida con el piloto VEIL LIGHT:** la plantilla nueva deberá ejecutar al menos la misma cobertura conceptual de **77 configuraciones** probadas en **360×800, 390×844 y 430×932** (231 corridas), incorporando además 320 px como control de diseño estrecho, y casos específicos que exija su dirección visual. No declarar que el nuevo diseño ya pasó 231 pruebas: deben ejecutarse sobre cada nuevo renderer.

Casos obligatorios:

- **Identidad:** nombres cortos, largos, acentos, espacios, lugares cortos/largos, diferentes tratamientos tipográficos seguros. Sin iniciales grabadas en vídeo.
- **Portada/contador:** muestra/oculta ciudad y hora, sin foto/con foto, día 1, <10 y >99 días, cuenta atrás OFF.
- **Historia:** OFF, preset/custom/none, texto hasta 450, sin foto, retrato/horizontal/cuadrado, crop/full, foco desplazado hasta extremos.
- **Lugares:** un lugar compartido, dos separados, con/sin foto, dirección larga, mapas ausentes, vestimenta ON/OFF.
- **Agenda:** OFF y 1/2/3/4/5 momentos; etiquetas al límite de 28, medianoche y madrugada, activar secuencialmente uno por uno, scroll lento/rápido/regreso.
- **Práctico:** 0/1/2/3/4 módulos; bus máximos, seis modos de hotel, código largo, hotel sin URL, regalos bank/bizum/texto/enlace, música link/petición, sin URLs, notas al máximo; alineaciones, textos y botones.
- **RSVP:** sin +1/niños y con +1/niños; menú/alergias/preguntas, transporte y alojamiento, una sola CTA, contexto rt/g/u/lang.
- **Galería/cierre:** OFF, 1–4 fotos mezcladas y panorama, final sin galería, frase al límite de longitud, fotos con foco extremo, transición y cierre sin cortes.
- **Pantalla:** 320/360/390/430 px, tamaños de fuente, Android Chrome, barras del sistema y diferentes alturas; sin scroll horizontal ni elementos fuera de ventana; orientación y teclado cuando haya interacción relevante.
- **Accesibilidad:** reduce motion, zoom razonable, foco visible, texto contrastado sobre imagen/vídeo, botones pulsables y no ocultos por barra inferior.
- **Rendimiento:** vídeo falla o tarda, poster de respaldo, sin pantalla en blanco ni recursos inaccesibles, sin errores JS, sin enlaces vacíos.

**Evidencias exigidas:** nombre de caso, versión exacta, viewport, logs JS, desbordamiento, elementos visibles, capturas, scroll/video del recorrido, control de enlaces, resultado, motivo de FAIL. El ensayo visual sin medios reales **no certifica** la composición final.

### 10.1 Dos pedidos reales completamente distintos

Antes de certificar venta: generar una boda normal con foto y otra radicalmente distinta mediante el cuestionario real (preferentemente nombres largos/acento, dos lugares, agenda cinco, cuatro prácticos, galería OFF). Ambos pedidos deben renderizar desde los **mismos bytes** de la misma plantilla, sin cambiar CSS, JS, tiempo de animación, posiciones ni recursos del renderer por pareja. Comparar resultado interno de cuestionario → configuración backend → revisión → artefacto final → CTA RSVP.

El caso VEIL LIGHT enseñó por qué: existía una excepción `I&H` para iniciales, ajustes fallidos de nombre largo, convergencia de dos lugares y textos de código de reserva. Eso se corrige **genéricamente**; no se parchea cliente por cliente.

## 11. QA DE INTERACCIÓN Y ESCALABILIDAD COMERCIAL

- El cuestionario que usa el cliente es **uno**. Cada diseño añade solo **referencias visuales** propias, nunca un nuevo formulario de producto ni campos particulares no admitidos.
- Toda pregunta corresponde a un dato consumible o a una decisión funcional. Los ejemplos muestran pedidos habituales, no casos extremos de QA.
- La invitación usa el adaptador equivalente a `VEIL_APPLY_CONFIG`; la capa de catálogo y destinatarios no altera bytes visuales de una plantilla comercialmente congelada.
- Entrega con `delivery_url` estable y plantilla/versión fijada; los parámetros comunes del destinatario son `rt`, `g` o `u` y `lang`.
- El botón de confirmar abre el RSVP existente. Los resultados vuelven al sistema de invitados, sin app paralela.
- `preview` y artefacto final han de coincidir en tipografía, escena, fondos, botones, tamaño de textos y RSVP, salvo diferencias deliberadas justificadas por el flujo.
- El centro móvil debe permitir revisar y entregar **sin aprender diseño ni código**, idealmente solo mirar y validar. Si una configuración soportada exige recolocar a mano, se para la venta de esa plantilla.

## 12. ERRORARIO DE BOTÁNICA — CAUSA → PROHIBICIÓN → PRUEBA PREVENTIVA

| Error repetido real | Por qué no puede repetirse | Control obligatorio |
|---|---|---|
| Crear subtítulos de Agenda que el cuestionario no recoge | Rompe la escalabilidad: contenido ficticio | Comparar DOM con el esquema: un `time` + un `label` por momento, nada más. |
| Cambiar fondos al ajustar tamaño de letras | Se rompe una escena congelada sin mandato | Diff de assets/gradientes y captura de todo el recorrido. |
| Desaparecer la unión Galería→Cierre o Agenda→Práctico | La escena no se revisó con la anterior y la siguiente | Vídeo de scroll continuo + captura a mitad de cada frontera. |
| Blur inferior en cierre; flor tapa «Cartagena»/«este día» | Solución cosmética tapa información necesaria | Test de contraste con vídeo/fotograma más oscuro y claro + zona segura para el texto. |
| «¿Nos» descentrado, fecha/frase rompen líneas | Falta comprobación del viewport real y jerarquía | Screenshots Android y casos de texto extremo; centrado visual, no solo CSS `text-align`. |
| Práctico demasiado largo o comprimido, botones desalineados | Se compactó solo con márgenes/letra o se dispersaron CTA | Medir altura de sección, mínimos legibles y ejes compartidos; máximo de datos del esquema. |
| Texto flotante «Información» vs botón «Ver hotel» | Jerarquía/categorías ambiguas | Revisar agrupación visual y significado de cada acción; nunca URL simulada. |
| Fondo floral acaba antes de Regalo / queda solo beige | Altura del contenedor y fondo desacoplados | Captura del último práctico, transición hacia galería y variante con 4 módulos. |
| Flechas redundantes y signos `+` para expandirlo todo | Señales web genéricas y más pulsaciones | Auditoría de controles: un CTA claro, no decoración funcional repetida. |
| `V7` rompió tres bloques tras animar Agenda | CSS/JS compartido, cambio sin pruebas de regresión | Scope CSS/JS local + diff DOM y screenshots de vecinos + rollback automático si FAIL. |
| Dos últimos momentos animan en bloque | Índice y umbral compartidos erróneos | Test de scroll cuadro a cuadro en 1–5 momentos, avance y retroceso. |
| Entregar como «final» sin validar animaciones | Se confundió compilación sin errores con calidad real | Gates separados: sintaxis ≠ funcionamiento ≠ escalabilidad ≠ evaluación artística. |
| Sucesión V1–V14 con cambios mínimos sin mejorar | No se fijó criterio de aceptación previo | Si dos iteraciones no mejoran de forma medible, volver a dirección artística; no enviar un tercer parche cosmético. |
| Se dijo «congelado» sin copia y checksum | Riesgo de pérdida o retroceso | Guardar `.html` + `.md` + SHA, comprobar byte-equal antes de confirmarlo. |
| Reutilizar nombres de prueba y copiar código de pedidos | Diseños no reproducibles en nuevos pedidos | Dos pedidos reales dispares; matriz de acentos, nombres y fotos. |

## 13. GESTIÓN DEL FEEDBACK SIN AGOTAR A LA PROPIETARIA

**Responsabilidad de ChatGPT:** dirigir, investigar, diseñar, programar, contrastar, comprobar y conservar evidencias. Un cambio pedido se aplica **antes de responder**, siempre que exista acceso y herramientas; si no, explicar el bloqueo sin inventar que ya se hizo.

- El feedback debe consolidarse y corregirse **en lote lógico** (por ejemplo, tipografía y contraste del mismo capítulo), no con un archivo nuevo por cada pixel.
- **Antes de preguntar** comprobar si existe información ya escrita en el cuestionario, contratos, chats o checkpoints. No devolver a la propietaria la tarea de reconstruir nuestro contexto.
- La respuesta de entrega: **un enlace correcto**, un resumen muy corto de cambios reales y estado de QA **honesto**. No explicaciones largas salvo que las pida.
- No presentar una versión igual como nuevo rediseño; demostrar diferencias de composición cuando se promete un cambio importante.
- La propietaria no debe editar en Canva, exportar vídeos, generar recursos ni hacer pruebas técnicas. Su feedback Android solo valida aquello que un simulador no puede garantizar.
- Si critica una versión: evaluarla independientemente y detectar fallos nuevos, sin pedirle que repita el diagnóstico ya conocido.
- Nunca declarar «premium» por cansancio o tras una sola captura. Buscar defectos primero, después reconocer los aciertos. Si hay fallos estructurales, NO CONGELAR como final comercial.
- La perfección visual no debe degenerar en sobretrabajo infinito: distinguir **bloqueante** (contraste, datos, continuidad, botones, identidad, escalabilidad) de **opcional** (una animación más espectacular sin mejora funcional evidente). Una mejora opcional no reabre un congelado.

## 14. LISTA DE ENTREGA — TODOS LOS CONTROLES MARCADOS ANTES DE ENVIAR LINK

### Visual
- [ ] Identidad original del diseño y diferenciación con D01/D02.
- [ ] Portada, historia, lugares, agenda, práctico, galería y cierre evaluados en **conjunto**.
- [ ] Todas las fronteras entre escenas limpias, incluidas transiciones cuando se oculta una sección.
- [ ] Tipografías reales cargadas, tamaños y contraste legibles; ningún texto bajo flor, imagen, barra o botón.
- [ ] Sin arcos/marcos/flechas/plus superfluos; CTA claros.
- [ ] Movimiento integrado, sin saltos ni elementos que se activen juntos por accidente.
- [ ] No hay scroll horizontal ni bloques con altura injustificable.

### Contrato/función
- [ ] Todo contenido procede del esquema; sin texto ficticio.
- [ ] 1 o 2 lugares, 1–5 momentos y 0–4 prácticos probados, con ON/OFF.
- [ ] Botones de hotel, mapa, música, regalo y RSVP reales y correctos; nada vacío/inútil.
- [ ] Cambiar de pareja no exige editar la plantilla.
- [ ] Módulos ocultos no dejan espacios fantasmas ni rompen transiciones.
- [ ] Cero errores JS, cargas fallidas relevantes y desbordamientos.

### Versión/integridad
- [ ] Archivo fuente y versión identificados, con hash.
- [ ] Cambios autorizados aislados, comparados con baseline completo.
- [ ] Recursos de escenas protegidas idénticos a los aprobados.
- [ ] Capturas y vídeo de scroll comprobados.
- [ ] Candidata NO sustituye al congelado anterior.
- [ ] Si se comunica «final», consta certificación completa y aprobación que corresponde a ese estado.

**Regla automática de bloqueo:** basta un cuadro sin marcar en categorías *función, integridad o legibilidad* para impedir la entrega como versión candidata aprobable. En tal caso se corrige internamente o se comunica `BLOCKED` con causa concreta; no se manda a la propietaria a descubrirlo.

## 15. FORMATO DE CHECKPOINT / ACTA PARA CADA CAMBIO

```text
GUEST / DISEÑO NN / VERSION Vx / FECHA
Estado: CANDIDATE | VISUALLY-APPROVED | VISUAL-FROZEN | QA-CERTIFIED | COMMERCIALLY-FROZEN
Base exacta y SHA-256:
Artefacto nuevo y SHA-256:
Alcance permitido (selectores/escenas):
Protegidos (escenas/assets/config):
Diferencias de composición visibles:
Datos del esquema utilizados:
Matrices ejecutadas (casos × viewport):
Prueba scroll continuo (resultado y ruta):
Botones/RSVP (resultado):
Errores JS / desbordamientos:
Paridad preview/final:
Pedido 1 / Pedido 2 (sin ediciones por pedido):
Limitaciones / NOT RUN explícitos:
Veredicto y responsable:
Siguiente acción única:
```

Esto debe acompañar todo archivo `FROZEN` y cada revisión significativa. Si cambia una decisión, actualizar el checkpoint **antes de seguir**.

## 16. PLAN REUTILIZABLE PARA LOS CUATRO DISEÑOS RESTANTES

1. **D03**: empezar por ficha de arte propia y mapeo del esquema; no heredar CSS de Botánica ni construir otro flujo comercial. Validar una escena emocional distintiva y su motion gate antes del resto.
2. **D04**: reutilizar el **proceso y el motor**, nunca la dirección visual D01/D02/D03. Revisar diferencias del catálogo global, evitar estilos demasiado parecidos.
3. **D05**: repetir gates, aprovechar componentes técnicos certificados sin cambios, someter la estética a evaluación independiente.
4. **D06**: no rebajar umbral para alcanzar la cifra de seis. Si no da el nivel, no se vende; mejor cinco plantillas sólidas (mínimo de lanzamiento) que seis con una débil.

**Cada diseño tiene su propio expediente**: brief/identidad, estados del cuestionario, storyboard global, recursos, baseline, matriz de pruebas, revisiones aprobadas, congelación y certificación. Un solo checkpoint maestro de catálogo resume los seis.

### Lo que se replica y lo que jamás se replica

| Sí se reutiliza, sin duplicarlo | Debe ser específico de cada diseño |
|---|---|
| Cuestionario, esquema, datos, adaptador, pipeline de entrega, controles de propietaria | Paleta, material dominante, tipografías seguras y escalas propias |
| Destinatarios, enlace final, RSVP y motor de gestión | Apertura, fotografía, art direction y cierre |
| Matriz QA, estrategia de versiones, bloqueo por fallos | Coreografía, fondos y transición, personalidad de Agenda/Práctico |
| Integraciones backend y semántica de acciones | Composición responsive certificada y recursos multimedia |

## 17. REGLAS DE CAMBIO Y CRITERIO DE TERMINACIÓN

- **No trabajar por agotamiento:** un diseño se valida por criterios, no por contar iteraciones.
- **No seguir parcheando lo que no funciona:** dos ciclos sin mejora visual importante → revisión profunda del enfoque y propuesta distinta, pero sobre copia, nunca sobre congelado.
- **No pedir pruebas repetidas para fallos ya detectables:** toda corrección incluye QA regresivo completo por el asistente.
- **No exagerar verificaciones:** «sin errores de sintaxis» no es «funciona en Android»; «aprobado visualmente» no es «100% escalable»; «guardado localmente» no es «publicado».
- **Nunca cambiar un hecho para complacer:** documentar limitaciones con precisión; las restricciones técnicas son reales.
- **Cierre comercial solo con todos los gates:** cuando un diseño supera G0–G8 y se fija en registro `commercially-frozen`, dejar de intervenir salvo defecto reproducible. Las mejoras futuras se hacen en nueva versión, preservando pedidos existentes.

## 18. FUENTES CANÓNICAS Y EVIDENCIA CONSULTADA

Documentos del repositorio `WeddlySmartDesign/WeddlySmartDesign.github.io`, rama `guest-independent` (consultados el 09/10/2026):

1. `guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md` — máxima prioridad de dirección producto.
2. `guest/CURRENT_STATE.md` — histórico de pruebas/descartes, reglas creativas y secuencia de VEIL LIGHT.
3. `guest/GUEST_PRODUCT_DIRECTION_CANONICAL_2026-10-07.md` — producto/comercial/integración.
4. `guest/GUEST_CATALOG_PIPELINE_CONTRACT_V1.md` — pipeline y contrato común.
5. `guest/GUEST_CATALOG_TEMPLATE_PLUGIN_CONTRACT_V1.md` — interfaces, permisos y estados por diseño.
6. `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json` — fuente de datos normativa, límites y modos.
7. `guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json` — VEIL LIGHT 5.3.3 en registro comercial consultado.
8. `guest/GUEST_REAL_INVITATION_CONTENT_MOTION_REQUIREMENTS_2026-10-02.md` — especificación de imagen/movimiento.
9. `guest/GUEST_CATALOG_BRIDGE_CHECKPOINT_2026-10-07.md` y `guest/GUEST_CATALOG_DELIVERY_ARTIFACT_QA_2026-10-07.md` — entrega e integración.

Checkpoints consultados y lecciones visuales aportadas por la propietaria:

10. `GUEST_VEIL_LIGHT_V5_2_SCALABILITY_CERTIFICATION_2026-10-06.md` — matriz 231, segundo pedido, corrección genérica, congelación técnica V5.2.
11. `GUEST_D02_BOTANICA_CHECKPOINT_CIERRE_VALIDADO_2026-10-08.md` — cierre, difuminado, fecha/frase y centrado.
12. `GUEST_D02_BOTANICA_CHECKPOINT_RECUPERACION_ESCENAS_2026-10-08.md` — cortes Agenda→Práctico/Galería→Cierre, animaciones y datos.
13. `GUEST_D02_BOTANICA_ATELIER_V11_FROZEN_CHECKPOINT_2026-10-09.md` — aprobación visual V11 y distinción de QA.
14. Vídeos, capturas e instrucciones aportados durante D02 (octubre 2026), incluida la aprobación final de **V14** y los fallos repetidos de Práctico, Agenda, transiciones y congelaciones.

**Limitación declarada:** no se ha realizado en este trabajo una certificación E2E nueva sobre Botánica V14 ni se ha publicado D03–D06; el manual es una norma de trabajo, no una prueba sustitutiva del producto. El registro del catálogo consultado puede cambiar con futuros commits: verificar siempre en vivo antes de cada nueva tarea.

---

## COMPROMISO OPERATIVO FINAL

**Antes de cada entrega, el asistente responde internamente estas siete preguntas:**

1. ¿Es verdaderamente distinta y más premium, o solo otra distribución del mismo contenido?
2. ¿Funciona el recorrido entero con los fondos y las transiciones correctas, no solo la pantalla modificada?
3. ¿Todo procede del cuestionario único, sin inventar un campo ni omitir un dato necesario?
4. ¿He probado todos los estados aplicables, acciones y viewports, sin usar a la propietaria como QA?
5. ¿He respetado todos los congelados, he aislado el cambio y sé volver al último checkpoint verificado?
6. ¿Puedo demostrar lo que digo que he mejorado y decir con exactitud lo que **no** he comprobado?
7. ¿Podrá la propietaria revisar el diseño terminado desde Android y el producto entregar un pedido normal con ≤5 minutos de intervención?

**Si alguna respuesta es «no» o «no lo sé», aún no está listo para entregar como diseño terminado.**