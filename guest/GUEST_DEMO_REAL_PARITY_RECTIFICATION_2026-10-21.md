# GUEST · Acceso a demostración del motor auténtico · 21/10/2026

## Motivo y rectificación
La DEMO `guest/guest-demo-capturas.html` entregada a la propietaria era una representación simplificada **rechazada** y no satisface la paridad con el módulo Invitados de ONE. **No comercializarla ni usarla para capturas publicitarias.** GUEST debe conservar gestión de personas, grupos/subgrupos, invitaciones/unidades, respuestas, plano visual interactivo, añadir y sentar, listados, eventos separados con invitación y envío propios, además de la gestión de dos dispositivos cuando existe licencia real. Queda excluida la edición por la pareja de la invitación comprada y del cuestionario RSVP.

## Corrección en PREVIEW sin tocar ONE/STUDIO/producción
- Rama aislada `guest-demo-capturas-2026-10-21`, derivada de la PREVIEW de integración `guest-integration-no-sale-preview-2026-10-20`.
- Nueva entrada: `guest/guest-demo-motor-real.html`, móvil primero. Contiene 20 invitados ficticios Clara y Mateo, 5 mesas, grupos/subgrupos, unidades y RSVP de demostración. Utiliza directamente los módulos originales `guest/guests-v114-integrated.html` y su plano `guest/guests-v081-visual-seating.html`, con los parches reales de sentar/multiselección.
- Dos páginas derivadas solo en esa rama, sin alterar fuente original: `guest/guest-demo-rsvp-real.html` (de `guests-rsvp-operations-v3.html`) y `guest/guest-demo-events-real.html` (de `guests-events-v3.html`).
- Invitación propia de preboda de demostración: `guest/guest-demo-event-invite-real.html` derivada de `guest/event-invite-v2.html`; nunca compartir sus tokens sintéticos como enlaces reales.
- `guest/guest-demo-real-backend.js`: respuestas locales de las APIs de RSVP y Eventos, íntegramente en `localStorage`; intercepta enlaces externos y simula marcados. No almacena ni solicita credenciales, no contiene datos de clientes, no realiza pagos ni envíos.
- El constructor de PREVIEW `guest/tools/build_guest_integration_preview_no_sale.cjs` se modificó **solo en esta rama** para pasar `frame-src 'none'` a `frame-src 'self'`: necesario para el iframe auténtico y su plano, manteniendo `connect-src 'none'`, `form-action 'none'`, noindex, sin producción ni pagos.
- El acceso de la demo no equivale al acceso entregado tras comprar una invitación. Es navegación ficticia; no certifica backend, correo, Stripe ni sincronización entre móviles.

## Auditoría documental del motor conservado
- `guest/guests-v114-integrated.html`: pestañas Hoy, Invitados, Mesas y Listados; crear/importar por grupo/subgrupo, RSVP y mesa, plano visual original.
- `guest/guests-v081-visual-seating.html`: salón con mesas arrastrables, dimensionables y rotables, asistentes sin sentar, selección múltiple y asignación.
- `guest/guests-seating-v2.js`: selecciona varios invitados, cambia forma redonda/rectangular/presidencial y opera «crear y sentar».
- `guest/guests-events-v3.html` + `guests-events-invite-addon-v2.js`: preboda y eventos con invitados independientes, arte ligero propio y envíos con RSVP.
- `guest/guests-rsvp-operations-live.html` exige licencia/token real y por eso NO sirve como demo pública sin sesión. No debilitar esa autorización; usar mock únicamente en PREVIEW.

## QA y límites
- JS de entrada y mock: comprobación sintáctica local Node PASS.
- Los archivos de la rama son exactamente documentos y scripts de interfaz; no se alteró backend.
- Comprobación funcional auténtica en dispositivo Android, operatividad de las interacciones de EVENTOS/RSVP en HTTP PREVIEW y enlace inmutable requieren certificación posterior. **No afirmar comercialización ni paridad E2E demostrada.**
- El programa debe conservar el estado GUEST **NO_GO para ventas** hasta los E2E originales completos.
