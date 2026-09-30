# GUEST by WeddlySmartDesign — B6.6 · SINCRONIZACIÓN DOS DISPOSITIVOS + ESTADOS DE ERROR
Fecha: 2026-09-30
Estado: PASS · MICROMÓDULO CERRADO

## Alcance validado

### Dos dispositivos autorizados
- Dispositivo principal y dispositivo de pareja cargan la misma boda remota.
- Ajustes reconoce cuando ya hay dos dispositivos conectados.
- El dispositivo secundario no puede generar una nueva invitación de pareja.
- Un cambio guardado en un dispositivo llega al backend y aparece en el otro.
- El refresco al volver al primer plano recupera cambios remotos sin intervención manual.

### Cambios simultáneos
- Ediciones simultáneas de campos distintos se combinan.
- Un 409 de versión provoca lectura del estado servidor, merge y reintento.
- No se pierde el cambio del primer dispositivo cuando el segundo confirma después.
- En conflicto sobre el mismo campo se conserva la elección local del dispositivo que está resolviendo el 409 y el resultado final se propaga al otro dispositivo.
- La metadata de sincronización vuelve a limpio después de resolver el conflicto.

### Dispositivo desactualizado / sin conexión
- Un cambio sin conexión queda marcado como dirty.
- El backend no recibe el cambio mientras el dispositivo está offline.
- El otro dispositivo puede seguir trabajando y guardando.
- Al recuperar conexión, el dispositivo desactualizado combina su cambio local con los cambios remotos hechos mientras estaba desconectado.
- Tras la recuperación, ambos dispositivos convergen al mismo estado.
- Un cambio pendiente se reintenta al volver online sin requerir recargar la app.
- La bandera dirty se limpia solo después de una sincronización correcta.

### Arranque y acceso
- Con datos locales y sin red, GUEST abre la copia guardada.
- Acceso inactivo 401/403 se confirma antes de bloquear.
- La pantalla de bloqueo conserva los datos y ofrece volver a Acceso.
- El bloqueo se identifica visualmente como GUEST by WeddlySmartDesign.
- Los textos de error de arranque hablan de GUEST, no del antiguo módulo “Invitados”.

### Aislamiento
- Cero llamadas a endpoints `weddly-*` durante el recorrido de sincronización.
- La sincronización usa `guest-state`.
- El estado local y remoto sigue confinado al producto GUEST.

## Incidencias reales detectadas y corregidas

### 1. Bloqueo real del envío por debounce infinito
Archivo:
`guest/guests-production-sync.js`

Problema:
El watcher de estado sucio se ejecutaba cada 300 ms y llamaba a `queue()`.
`queue()` cancelaba y volvía a crear un temporizador de 450 ms.
Mientras el estado siguiera distinto de `G.last`, el watcher podía reiniciar el temporizador antes de que `push()` llegara a ejecutarse.

Consecuencia:
Un cambio local podía quedarse marcado como pendiente sin llegar nunca al backend.

Corrección:
`queue()` ya no reinicia un envío que ya está programado. Una vez creado el temporizador de sincronización, las comprobaciones posteriores no pueden posponerlo indefinidamente.

Commit de producto:
`b3047ee612247ba639776190218d4d4c2a003e4e`

### 2. Branding heredado en bloqueo de acceso
Archivo:
`guest/guests-access-layer.js`

Problema:
La pantalla que aparece al confirmar un acceso inactivo todavía mostraba “Weddly Smart Design” como cabecera heredada.

Corrección:
Ahora muestra:
- GUEST
- by WeddlySmartDesign

Commit:
`24224e84441250db31a1539d4e4fd73b5c8038d4`

### 3. Copy de error heredado
Archivo:
`guest/guests-production-sync.js`

Se sustituyó:
- “No hemos podido abrir Invitados”
por:
- “No hemos podido abrir GUEST”

Y:
- “Este dispositivo todavía no tiene acceso a vuestra boda”
por:
- “Este dispositivo todavía no tiene acceso a vuestro GUEST”

Commit:
`fb75139774f325f742cb4af688c26b07c88f622c`

## QA automatizado

Workflow:
`.github/workflows/guest-independent-qa.yml`

Job:
`b6-two-device-sync`

Test:
`guest/qa/b6_6_two_device_sync_test.js`

La prueba usa dos procesos Chromium separados para representar dos dispositivos reales y realiza las ediciones mediante la interfaz real de People Manager.

Commit final validado:
`d1cba6988daa14240981104eca71b1a5090bfdee`

Resultados:
- regression: SUCCESS
- b6-shell-mobile: SUCCESS
- b6-today-guests: SUCCESS
- b6-invitation-rsvp: SUCCESS
- b6-tables-lists: SUCCESS
- b6-extra-events: SUCCESS
- b6-two-device-sync: SUCCESS

## Criterio de cierre

B6.6 = PASS.

No reabrir salvo regresión objetiva.

## CIERRE DE B6

Todos los micromódulos B6.1–B6.6 están cerrados en PASS.

El siguiente bloque es:
B7 · Revisión UX / visual premium y simplificación.
