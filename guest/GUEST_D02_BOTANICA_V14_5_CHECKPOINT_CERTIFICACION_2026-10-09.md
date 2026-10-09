# GUEST — Botánica Atelier D02 | Certificación técnica preparatoria
Fecha: 09/10/2026 · Rama: `guest-independent` · **NO comercialmente certificada**

## Estado inmutable
- **Versión visual aprobada:** `GUEST_D02_BOTANICA_ATELIER_V14_FROZEN_2026-10-09.html`.
- SHA256 V14: `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39`.
- El máster V14 sigue literalmente intacto; no contiene los parches QA.

## Candidata técnica (aislada de V14)
- `GUEST_D02_BOTANICA_ATELIER_V14_5_TECHNICAL_CANDIDATE_2026-10-09.html`
- SHA256 V14.5: `ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84`.
- La V14.5 NO es una nueva aprobación estética. Es un candidato para certificar escalabilidad sobre el diseño congelado.

## Cambios técnicos genéricos, únicamente al recibir variantes no idénticas a la demo
1. `cover.photo` y foto de Historia se muestran mediante la composición de interludio fotográfico existente; una historia sin texto pero con foto no pierde la imagen.
2. `fit / focusX / focusY` se respetan para historia, lugares y galería.
3. `locations.dressCode` se representa en el primer lugar si se activa.
4. Los enlaces `locations.items[].websiteUrl` pueden verse como **Sitio web**, junto a «Cómo llegar» cuando hay URL.
5. Se reconoce el formato de configuración realmente producido por `guest-invitation-flow` v12 (sin `schemaVersion` explícito). La V14 aprobada trataba ese formato como legado y fallaría al renderizar pedidos.
6. Los cinco textos estándar de Historia se resuelven usando **exactamente los literales `story-01`–`story-05` de la función backend**, cuando `textMode=preset` deja `body=''`.
7. Los datos de Regalo que ya entrega el backend en `practical.gift.details` vuelven a ser accesibles mediante «Ver datos» para banco y Bizum.
8. Un RSVP sin ruta o con `#` conserva el aviso de demostración; la ruta real personalizada se recibe del flujo compartido.
9. Frases personalizadas largas de cierre y localidades largas se adaptan mediante clases condicionales, sin cambiar el texto/diseño estándar aprobado.

## Evidencia ejecutada (en este contenedor)
- **29 casos × 4 tamaños (320, 360, 390, 430 px) = 116 pruebas**. Resultado: 116/116 sin errores de JavaScript, horizontal overflow, texto recortado en comprobaciones o ausencia indebida de módulos.
- **8 casos** con configuración equivalente al formato real de `buildConfig()` de Supabase, sin `schemaVersion`, con Historia predefinida sin `body`, banco en `gift.details`; dos perfiles de boda muy diferentes × 4 anchos. Resultado 8/8 PASS.
- **Verificación de interacción**: modal Información muestra nombre/código de reserva, Ver datos expone el IBAN, enlaces presentes a hotel/playlist/mapa, cierre de diálogo, RSVP sin ruta ofrece aviso y modo foto sin texto conserva fotografía. PASS.
- **Integridad audiovisual**: los 3 payloads MP4 base64 y los 14 recursos WebP base64 coinciden exactamente con V14. Carga de los 5 elementos `<video>` sobre HTML completo: readyState 4, currentTime > 0, sin media error y sin JS errors.
- **Regresión visual de cinco escenas** a 390px, imágenes QA sin medios incrustados en ambas copias y animaciones congeladas: Portada / Agenda / Práctico / Galería / Cierre = idénticas píxel a píxel al aplicar la configuración normal.
- **Sintaxis:** JavaScript sin error y renderizador carga en Chromium.

## Integración registrada sin publicar
- Registrado `botanica` v14.5 en `guest/GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json` como `certification-pending`, con `scalabilityCertified:false`, `operationalPilotPass:false`, `visualRobustnessPass:false`.
- Adaptador `guest/guest-catalog-template-botanica-adapter-v1.js` comunica `BOTANICA_APPLY_CONFIG` con el pipeline común.
- El empaquetador estándar rechaza intencionadamente plantillas no `commercially-frozen`; **no se ha saltado ese control**.
- Se ha confirmado que Supabase `guest-invitation-flow` v12 aún tiene `CATALOG_TEMPLATES` con **solo VEIL LIGHT**. Los pedidos reales Botánica no se pueden crear hasta habilitar el registro en backend. No se ha desplegado ni modificado producción.

## Gates que faltan antes de marcar `commercially-frozen`
- Registrar D02 en backend real y probar creación de dos pedidos `test` desde el **cuestionario compartido**, no desde fixtures; verificar resolución de fotos y datos, paridad preview/final, aprobación y URL de entrega estable, sin edición por pareja.
- Probar consumidor de contexto real `rt`, `g` o `u`, `lang`, y llegada de respuesta al motor RSVP existente sin crear uno nuevo.
- Certificar operación Mobile Center con usuaria real y tiempo activo ≤5 minutos.
- Revisar en Android las variantes nuevas críticas (fotos con/sin historia, vestimenta y cierres largos) porque no están incluidas en la aprobación visual V14 original.
- Solo cuando todos esos gates pasen, elevar a `commercially-frozen`; no publicar ni conectar Stripe sin aprobación expresa.

## Regla de recuperación
El diseño congelado V14 es el respaldo de seguridad. Toda modificación posterior se realiza sobre V14.5 candidata o sus sucesoras, nunca sobre el congelado, sin alterar el flujo de VEIL LIGHT ni ONE, ONE Partner, STUDIO.