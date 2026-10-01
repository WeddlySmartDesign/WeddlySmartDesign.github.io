# GUEST by WeddlySmartDesign — CHECKPOINT 01 · CONTINUIDAD SELLADA
Fecha: 2026-09-30

## Regla de trabajo
Este documento es el punto de reanudación obligatorio.
No volver al mandato inicial del proyecto ni reconstruir bloques ya cerrados.
Si una sesión se interrumpe, continuar desde "SIGUIENTE BLOQUE".
Solo reabrir un bloque cerrado si una comprobación objetiva detecta una regresión.

## Estado verificado antes del sellado
Rama exclusiva: `guest-independent`
HEAD verificado: `b9c9ec84aaac8788baecfeda8ee29d0a13db0cb1`
`main` no se ha modificado para crear GUEST.

## FUENTE DE VERDAD DE ONE — CERRADO
GUEST no parte de Guests v67.
La extracción se realizó desde el estado más reciente de `main` disponible el 30/09/2026:
`6e054a21480624c7f04c6879c7ad72ed55c7307d`

La procedencia exacta está bloqueada en:
`guest/SOURCE_LOCK.json`

Incluye referencias SHA de:
- guests.html
- guests-v116-production.html
- guests-v114-integrated.html
- Hoy/cambios recientes
- mesas + seating sync hotfix
- RSVP flow/flex
- preguntas personalizadas
- niños opt-in
- listados de eventos extra
- visibilidad de servicios
- Essential live
- Signature live
- personalización Essential/Signature
- invitaciones de eventos

Este punto no se vuelve a reconstruir desde versiones históricas.

## TRABAJO REALIZADO — CERRADO

### B0 · Extracción independiente
- baseline de GUEST extraído en rama propia
- copia aislada del runtime Guests
- contrato de independencia en PRODUCT_BASELINE.md
- ONE / ONE Partner / STUDIO fuera del ciclo de cambios

### B1 · App GUEST independiente
- entrada canónica `guest/index.html`
- shell GUEST by WeddlySmartDesign
- PWA propia: manifest, service worker e icono
- Ajustes propios
- instalación en dispositivo
- acceso para dos dispositivos / pareja
- soporte propio
- navegación fuera de la suite ONE
- RSVP y títulos adaptados a GUEST
- eventos extra simplificados al alcance GUEST
- branding público Essential/Signature adaptado
- outputs operativos con marca GUEST

### B2 · Aislamiento técnico
- runtime activo dirigido a backend aislado de GUEST
- gate QA que rechaza endpoints compartidos de ONE en runtime activo
- rutas públicas de eventos acotadas al producto
- bootstrap seguro para preparación interna
- control de procedencia respecto a la última versión ONE

### B3 · Flujo comercial base
- `guest.html`: web comercial invitation-first
- `guest-checkout.html`: checkout independiente
- `guest-checkout-return.html`: confirmación de pago
- `guest-order.html`: recogida de datos para personalización
- `guest-legal.html`: adaptación legal base
- Essential 01–06
- Signature 01–04
- promesa de personalización 24–48 h
- opciones RSVP de compra/intake
- backend comercial apuntando a `guest-stripe-checkout`

### B4 · QA automático base
Workflow:
`.github/workflows/guest-independent-qa.yml`

Gate:
`guest/qa/guest_independent_regression_test.js`

Comprueba, entre otros:
- marca GUEST
- aislamiento PWA
- ausencia de Pagos/Planning/ONE Partner/STUDIO en shell
- capas recientes de Hoy, mesas, +1 y eventos
- niños opt-in
- preguntas personalizadas
- alojamiento opt-in
- Essential 01–06 y Signature 01–04
- ajustes / pareja / instalación
- rutas confinadas
- endpoints GUEST aislados
- flujo comercial y formulario de pedido

## NO CONSIDERAR AÚN RELEASE
Este checkpoint sella continuidad, no lanzamiento comercial.
No publicar como final hasta completar los bloques siguientes.

## SIGUIENTE BLOQUE — B5
### Auditoría estricta de paridad con el último Guests usado por ONE
Objetivo único:
Demostrar que GUEST conserva todas las mejoras funcionales vigentes en ONE antes de seguir añadiendo producto.

Método:
1. recorrer la dependencia real de Guests desde la producción actual de ONE
2. contrastarla con SOURCE_LOCK y la copia GUEST
3. verificar una por una las mejoras finales conocidas
4. detectar cualquier archivo/dependencia no incluida
5. corregir SOLO GUEST si falta algo
6. ejecutar el gate de regresión
7. cerrar B5 con un informe PASS/FAIL y nuevo checkpoint

No empezar B6 hasta cerrar B5.

## Después de B5
B6 = QA funcional/móvil del producto GUEST independiente.
B7 = revisión UX/visual premium y simplificación.
B8 = QA del flujo comercial completo.
B9 = preparación de despliegue final independiente.
