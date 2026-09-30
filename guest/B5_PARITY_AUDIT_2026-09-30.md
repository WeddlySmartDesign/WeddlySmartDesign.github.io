# GUEST by WeddlySmartDesign — B5 · AUDITORÍA DE PARIDAD CON EL ÚLTIMO GUESTS DE ONE
Fecha: 2026-09-30
Estado: PASS · BLOQUE CERRADO

## Fuente auditada
- ONE / main HEAD: `6e054a21480624c7f04c6879c7ad72ed55c7307d`
- Rama GUEST: `guest-independent`
- Fuente principal Guests: `guests-v116-production.html`
- Núcleo integrado: `guests-v114-integrated.html`
- Lock: `guest/SOURCE_LOCK.json`

Se verificó que main sigue exactamente en el commit bloqueado y que todos los SHA incluidos en SOURCE_LOCK coinciden con main.

## Inventario completo
Se auditó el inventario raíz que compone/acompaña Guests en ONE:
- 179 archivos fuente
- 179/179 presentes en `/guest`
- 0 archivos fuente ausentes
- 156 copias permanecen byte a byte idénticas
- 23 tienen cambios intencionados de aislamiento, rutas, marca o producto
- En los 23 archivos modificados se verificó preservación de todas las funciones con nombre de la fuente ONE: 0 funciones fuente perdidas

El gate automático queda endurecido para impedir que en el futuro:
- falte una copia de un archivo fuente;
- se modifique por accidente un archivo que debe permanecer idéntico;
- desaparezca una función de un archivo cuya divergencia está autorizada.

## Capas tardías de ONE detectadas fuera de los archivos guests-*
La auditoría encontró mejoras aplicadas desde el shell de ONE que no estaban incluidas en la extracción inicial.

### 1. Coherencia visual de Invitados
Fuente ONE: `suite-visual-coherence-v1.js`

Aplicaba al módulo:
- ancho y jerarquía visual;
- tarjetas redondeadas;
- navegación inferior;
- targets táctiles de 48 px.

Estado GUEST:
PORTADO a `guest/guest-one-parity-v1.js`, preservando la marca propia GUEST.

### 2. Navegación rápida y swipe en Invitados
Fuente ONE: `suite-swipe-navigation-v1.js`

Aplicaba:
- cambio inmediato de pestaña;
- swipe horizontal entre vistas;
- protección ante formularios, modales y plano de mesas.

Estado GUEST:
PORTADO a `guest/guest-one-parity-v1.js`.

### 3. Hotfix tardío de guardado de invitación
Fuente ONE: `suite-install-one-v1.js`

El shell de ONE incorporaba resiliencia para que un fallo al refrescar la configuración RSVP después de guardar la personalización no hiciera aparecer como fallido un diseño que ya se había guardado.

Hallazgo B5:
La extracción inicial de GUEST NO heredaba este hotfix porque vivía en el shell de ONE.

Corrección:
- portado directamente a `guests-personalizacion-essential.html`;
- aplicado también a Signature para mantener el mismo comportamiento robusto.

### 4. APIs de edición de invitación
Hallazgo B5:
Los wrappers de personalización Essential y Signature seguían llamando a:
- `weddly-rsvp`
- `weddly-personalization`

Esto rompía el aislamiento técnico aunque el resto del runtime ya usaba endpoints GUEST.

Corrección:
Ambos wrappers usan ahora:
- `guest-rsvp`
- `guest-personalization`

El gate QA incluye desde ahora estos dos archivos para que no puedan volver a apuntar a ONE.

## Capas ONE evaluadas y no copiadas literalmente

### ONE Today global
Fuente: `suite-today-v1.js`

No se copia el dashboard global porque agrega Pagos + Invitados + Planning y GUEST no contiene esos módulos.

Se verificó equivalencia de la parte que sí pertenece a invitados dentro del Hoy propio de GUEST:
- nuevas respuestas RSVP;
- cambio de asistencia;
- menú;
- +1;
- transporte;
- alojamiento;
- alergias/intolerancias;
- respuestas personalizadas;
- cambios de mesa;
- cambios recientes;
- marcar como leído;
- persistencia del leído dentro del estado Guests.

Por tanto no existe pérdida funcional de Invitados.

### Servicios desde Ajustes de ONE
Fuente: `suite-wedding-services-v1.js`

ONE duplicaba en Ajustes controles de transporte/alojamiento.
GUEST no copia esa duplicación porque la configuración permanece en su editor RSVP, junto al resto de preguntas, y `guests-service-visibility-v1.js` mantiene la visibilidad operativa.

No se ha eliminado la capacidad; se evita duplicar controles en dos lugares.

### Backup combinado ONE
Fuente: `suite-settings-backup-integrity-v1.js`

Es una función transversal Pagos + Invitados de ONE.
No forma parte del runtime independiente de GUEST y no se considera una pérdida del motor Guests.

## Backend — paridad comprobada
Se comparó el contenido fuente de las Edge Functions vigentes de ONE con sus clones GUEST.

Paridad exacta de contenido:
- `weddly-rsvp` v18 = `guest-rsvp` v1
- `weddly-personalization` v13 = `guest-personalization` v1
- `weddly-guests-state` v8 = `guest-state` v1
- `weddly-rsvp-ensure` v7 = `guest-rsvp-ensure` v1
- `weddly-event-state` v7 = `guest-event-state` v1
- `weddly-event-invite` v11 = `guest-event-invite` v1
- `weddly-test-access` v17 = `guest-access-check` v1

Resultado: las reglas de +1, placeholders, preguntas personalizadas, niños, menús sin valores inventados, transporte, alojamiento, eventos y sincronización parten de la misma lógica de backend que la última versión ONE.

## Funcionalidades finales verificadas en la paridad
- Invitados y unidades/invitaciones
- grupos y subgrupos
- RSVP enviado / pendiente / confirmado / no asiste
- +1 como persona real y vinculada
- reutilización segura de placeholder +1
- menú sin defaults inventados
- alergias/intolerancias
- transporte
- alojamiento
- niños opt-in
- preguntas personalizadas
- cambios recientes
- cambios de mesa en Hoy
- mesas, capacidad y plano
- sincronización de seating
- listados de mesas
- catering
- transporte
- listados de eventos extra
- Essential 01–06
- Signature 01–04
- edición/personalización
- eventos extra con activación no forzada
- navegación móvil validada heredada de ONE
- resiliencia de guardado de invitación heredada del shell final de ONE

## Cambios realizados durante B5
- nuevo `guest/guest-one-parity-v1.js`;
- cargado por `guest/index.html` y `guest/guests-v116-production.html`;
- Essential y Signature aislados de APIs ONE;
- resiliencia de guardado portada;
- SOURCE_LOCK ampliado con las capas del shell de ONE que afectaban a Guests;
- QA endurecido a inventario completo + divergencias permitidas + capas tardías.

## Conclusión
B5 = PASS.

No se ha detectado ninguna mejora funcional vigente de Guests en ONE que falte actualmente en GUEST después de las correcciones de este bloque.

La extracción inicial sí tenía huecos: visual/swipe del shell, hotfix de guardado y dos endpoints heredados. Han quedado corregidos antes de cerrar el bloque.

## SIGUIENTE BLOQUE
B6 · QA funcional y móvil del producto GUEST independiente.

Se ejecutará por micromódulos:
- B6.1 shell / instalación / navegación / Ajustes
- B6.2 Hoy + Invitados
- B6.3 Invitación + RSVP + Essential/Signature
- B6.4 Mesas + listados
- B6.5 Eventos extra
- B6.6 sincronización dos dispositivos + estados de error
