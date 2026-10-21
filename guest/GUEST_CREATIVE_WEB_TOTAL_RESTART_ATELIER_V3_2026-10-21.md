# GUEST — REINICIO TOTAL DIRECCIÓN ARTÍSTICA WEB · V3 (21/10/2026)

**Fuente de decisión:** rechazo completo por la propietaria de Atelier V2; esta V3 reemplaza la V2, **NO está aprobada como diseño final**. Prototipo NO comercial, NO publicar.

## Por qué se descarta la V2
- Home y catálogo genéricos, con aspecto de diseño de IA; no daban protagonismo a la obra real.
- Confundía la invitación completa con un clip de portada de unos pocos segundos.
- No enseñaba el **vídeo de cierre** ni la secuencia animada intermedia. No representaba correctamente el producto vendido.
- La acumulación de fichas no escala con nuevas invitaciones.
- No presentaba visualmente las verdaderas funciones de gestión GUEST.

**Acción realizada:** se han borrado los cuatro frames de escritorio/móvil de las dos páginas del archivo Figma V2; se han reconstruido dos nuevas páginas en el mismo archivo para eliminar la maqueta descartada. También se retiraron los dos ZIP de V2 y su HTML local de este entorno. **NO se tocó ninguna producción**, tampoco las invitaciones máster, ONE/STUDIO ni el archivo Figma comparativo inicial.

## Contrato artístico de la V3
1. Las invitaciones son el producto estrella. Hero en movimiento con vídeo **auténtico** de VEIL LIGHT. Nada de vídeos de stock, móviles ficticios ni imágenes IA.
2. Cada invitación tiene **tres actos**: apertura original completa; interior original con secciones y microanimaciones (se accede al HTML auténtico mediante Cloudflare PREVIEW, sin reconstrucción falseada); vídeo de cierre original completo.
3. Catálogo como **escenario único + filmstrip horizontal** y botón de galería paginada/buscable. Escalabilidad mediante `catalog.js` y paginación de 6 diseños por página; no se añaden 15 tarjetas verticales al home.
4. Segunda mitad de la web: «el primer wow emociona; el siguiente organiza todo». Cuatro demostraciones **ilustrativas e interactivas, con personas ficticias**: preboda/eventos adicionales, confirmaciones/avisos, mesas (clic/arrastre), dos móviles reflejando un mismo valor de ejemplo. **No se confunden con pantallas verdaderas del producto** ni sincronización backend.
5. Otra sección presenta añadir invitados, seguimiento de quienes faltan y asientos/listados de forma funcional, no por promesas comparativas sin probar.
6. Flujo real: selección diseño individual → compra/cuestionario → producción/revisión/aprobación → entrega final → GUEST incluido desde esa entrega. Sin editores de invitación/RSVP de la pareja, sin colecciones rígidas.
7. No atribuir a GUEST exclusividad de funciones ya presentes en La Qualité. No prometer recordatorios **automáticos** hasta confirmar código y pruebas: se presenta solamente seguimiento de pendientes y preparación ilustrativa de aviso. App web móvil/no afirmar app nativa de tiendas.

## Evidencia obtenida del ZIP sellado de GUEST
- Archivo fuente **`GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip`** (SHA256 `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`), descargado de Biblioteca sin alterar originales.
- 15 identidades de diseño actual: VEIL LIGHT, BOTÁNICA, AZULEJO, GALA, INVERNADERO, REFLEJO, CAJA DE MÚSICA, LIMONEROS · VERSIÓN CLAUDE, CUENTO DE PAPEL, BOLA DE CRISTAL, ABANICO, VIÑETAS, VIÑETAS · ELLAS, VIÑETAS · ELLOS, EL MAPA.
- Se excluye el histórico D03 incorrecto del prototipo y se **oculta D09** (versión Claude) hasta confirmar la identidad visual con la propietaria. **14 muestras visibles, 15 identidades rastreadas**. No son diseños comercialmente certificados, sino recursos de PREVIEW.
- Se localizaron realmente los 30 streams apertura/cierre de las 15 identidades: tanto `video.source.src` externos como `data:video/mp4;base64` embebidos. En BOTÁNICA V14.7, `setupFilm()` asigna **`MEDIA.opening`** tanto a `coverVideo` como a `finalVideo`. Se ha conservado ese hecho: no se ha inventado un cierre distinto, caso pendiente de validación/solución artística.
- Cada MP4 del prototipo es un **duplicado binario exacto** del MP4 fuente, SHA256 30/30 PASS. No vídeos recortados a 6 segundos. Duraciones fuente: aprox. 5 a 14.5 segundos.
- Los recursos del centro de cada invitación se abren con el enlace REAL de Cloudflare PREVIEW inmutable `https://eebba5b2.guest-weddlysmartdesign.pages.dev`. En modo «Se descubre», existe opción de cargar el original en iframe y opción visible de pestaña externa si la política de origen impide embeberlo.

## Archivos fuente y prototipo
- **Nuevo artefacto de revisión generado en esta conversación:** `/mnt/data/GUEST_Atelier_Artistico_V3_REDENO_TOTAL_14_DISENOS.zip`, tamaño **138757483 B**, SHA256 **`ba90f13ff20e9bbdd289fb5a04f6c3e43669152bcc71b01c21a97842ddb7fcb5`**, **73 entradas**, ZIP CRC PASS.
- Dentro de ese ZIP, `index.html`, `styles.css`, `app.js`, `catalog.js`, `media/` con 30 originales y 30 JPG, `asset_register.json`, `LEEME_PRIMERO.txt`, `qa_check.py` y `QA_RESULTADO.txt`.
- El prototipo se abre descomprimiendo y ejecutando **`index.html`**; los vídeos se cargan cuando el usuario los selecciona. El paquete es pesado (135 MB de originales) por exigencia de fidelidad; las optimizaciones para venta requerirán política de streaming respetuosa con todos los movimientos y son tarea FUTURA.
- **Biblioteca:** se intentó subir el nuevo ZIP a `/GUEST by WeddlySmartDesign/Direccion_Artistica_Web/`, pero falló con error `library_storage_limit_exceeded`. La carpeta se creó, **NO hay backup de este ZIP en Biblioteca**. No borrar otros materiales del usuario para hacer espacio. La fuente puede recuperarse del ZIP adjunto a esta conversación más el ZIP original sellado, pero no declarar persistencia de binario independiente de esta conversación.

## Figma V3, fichero de la antigua V2 reutilizado y reconstruido
`https://www.figma.com/design/fxp6FswR9VSLQf2xQtBRos`
- Página 01 «REDISEÑO RADICAL · PORTADA»: desktop node `10:2`, mobile node `10:25`.
- Página 02 «REDISEÑO · GALERÍA VIVA + GUEST»: desktop node `11:2`, mobile node `11:28`.
- Son capas **editables** con tipografía real Instrument Serif y firma Caveat para `by WeddlySmartDesign`. Espacios de vídeo **son contenedores estáticos tipográficos** porque no ha sido posible importar directamente las imágenes del contenedor a Figma. El arte audiovisual real está en el ZIP HTML. No presentar esos rectángulos como material final ni como capturas reales.

## QA realizado y límites
- `python qa_check.py`: **PASS**: 15 identidades, 30 MP4 comparados SHA-256 con original, 30 posters, 14 visibles, ausencia checkout, `noindex`, galería controlada, 4 wows visuales, URLs reales de preview y DOM IDs únicos.
- `node --check app.js` y `node --check catalog.js`: PASS.
- CSS: `tinycss2` 233 reglas, **0 errores de sintaxis**.
- ZIP físico: `testzip()==None`, 73 entradas.
- **Navegador visual del contenedor NO ejecutable:** `ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a `file://` y `127.0.0.1`. Ninguna prueba de reproducción en Chrome/Android físico ni del iframe remoto está certificada como PASS. No prometer cierre visual.
- **NO** se ejecutaron compras, envíos, sincronización real ni datos personales; NO se activaron pagos, no se publicaron ramas, no se modificaron Supabase, Cloudflare o Stripe.

## Pendientes antes de una web final / comercial
1. Review real en navegador PC + Android de la nueva dirección artística, calidad de vídeo, diseño móvil y tratamiento de los tres actos; ajustar defectos sin tocar los másteres.
2. Decidir y validar qué identidad LIMONEROS es definitiva, y revisar BOTÁNICA cierre repetido y defecto PC «Lo esencial».
3. Optimizar streaming/video bajo demanda y dar acceso al catálogo definitivo creciente sin saturar ancho de banda.
4. Confirmación precisa del copy de funciones, permisos, derechos, precios y condiciones; certificación completa Stripe TEST E2E, correos, entrega, acceso y RSVP en 2 móviles; aprobar GO por diseño. Hasta entonces **NO_GO**.
