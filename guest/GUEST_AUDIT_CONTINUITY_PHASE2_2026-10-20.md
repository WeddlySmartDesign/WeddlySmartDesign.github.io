# GUEST — Continuidad real tras «Auditar módulo GUEST» (20/10/2026)

## Alcance y decisiones inalterables
Producto **GUEST by WeddlySmartDesign**, independiente de ONE, ONE Partner y STUDIO. Invitaciones por **diseño individual**, sin Essential/Signature/Atelier. La pareja NO puede editar la invitación final ni configurar preguntas RSVP en la app GUEST: esas preguntas nacen del cuestionario común; la licencia de gestión solo se activa tras entrega `delivered`. Nunca modificar los másters originales/congelados ni activar pagos sin pruebas comerciales reales.

## Inventario y corrección Limoneros
El inventario canónico contiene **15 diseños diferentes**, con **16 entradas técnicas** porque se conserva también `design-03` LIMONEROS **HISTÓRICO INCORRECTO**. El candidato nuevo `design-09` = «LIMONEROS · VERSIÓN CLAUDE» se mantiene separado, en prueba; no asumir todavía su aprobación visual definitiva. Los **211 blobs** originales de 13 skins Claude D04–D16 ya estaban recuperados con hashes íntegros en GitHub, y NO hay que pedir nuevos ZIP ni medios a la propietaria. Fuente: `GUEST_FULL_DESIGN_INVENTORY_2026-10-20.md`.

## Cambios reales guardados hoy en `guest-independent`
1. Catálogo: añadidas las **13 identidades** D04–D16 a los tres registros comunes: `GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json`, `GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`, `GUEST_CATALOG_OWNER_RENDERERS_V2.json`. Cada nueva entrada queda `certification-pending`, `scalabilityCertified=false`, `operationalPilotPass=false`, `visualRobustnessPass=false`, 11/11 puertas en `pass:false`, `iframe.src=null` y `GUEST_APPLY_CONFIG`. **Cero URLs supuestas, precios nuevos o aprobaciones inventadas.** Commits `cacff91d`, `44b22495`, `599980d2`. Relectura posterior de GitHub de esos tres JSON: **16 identidades, 13 cierres comerciales seguros, 0 desajustes de versiones/identidades**, y D03 histórico permanece `certification-pending`.
2. Nueva herramienta de empaquetado solo TEST `guest/tools/stage_claude_candidate_media.cjs`: valida SHA del blob original Git y bytes contra ambos manifiestos, extrae `data:*;base64` a ficheros multimedia únicos SHA256 conservando bytes y un `index.html` reescrito, comprueba tamaño individual menor de 25 MiB, emite manifiesto y rechaza escrituras dentro del repo o sobre carpeta existente. No toca originales, no despliega ni vende. Commit `db71d997`.
3. QA privada `guest/tests/claude_asset_stage_2026_10_20.test.cjs` (commit `6dcfd807`) y `guest/tests/catalog_15_candidate_consistency.test.cjs` (commit `dc20b95c`); conectadas al workflow **GUEST Independent QA** en `a06d43bf` y `068db79c`. La QA corre en GitHub Actions al subir cambios. **No se ha podido obtener aún resultado de las ejecuciones posteriores a estos commits; no marcar PASS ni dar por aprobadas las 13 reproducciones.** En particular los HTML máster originales de D04 (~27,45 MB) y D07 (~30,95 MB) exceden el objetivo del asset individual y exigen staging y prueba real.
4. Página `guest.html`: ya contiene **15 tarjetas de diseños individuales**, pero son **tarjetas informativas sin compra ni vista completa**, marcadas `noindex`. No considerar esa web un escaparate comercial validado. El `guest-checkout.html` rechaza intentar comprar sin `catalog_template` y usa aprobación/precio del servidor.

## Verificación externa REAL (solo lectura, 20/10/2026)
Proyecto Supabase **dnjsxequwgtyyauuofxj**, estado ACTIVE_HEALTHY. Con `list_edge_functions`, `get_edge_function` y `fetch_file` de GitHub, se verificaron seis funciones **ACTIVE** y su fuente **100 % idéntica** a `guest/backend/<slug>/index.ts`, no simple coincidencia documental:

| Función | ACTIVE |
|---|---:|
| `guest-invitation-flow` | v21 |
| `guest-stripe-checkout` | v26 |
| `guest-rsvp` | v6 |
| `guest-personalization` | v3 |
| `guest-rsvp-ensure` | v3 |
| `guest-license-access` | v5 |

**Los apuntes anteriores de v20/v25 están OBSOLETOS**: los despliegues actuales son v21/v26. V21 contiene los trece IDs D04–D16 con bandera `testOnly`; el validador bloquea su producción. No se ejecutó deployment nuevo en esta continuación.

Consulta SQL agregada, sin datos personales, a `public.guest_invitation_orders`:
- `botanica`: 4 pedidos TEST `delivered`; 1 TEST `review_sent`.
- `veil-light`: 2 pedidos TEST `delivered`; 1 TEST `designing`.
- No existen pedidos TEST de D03 ni de D04–D16 en el registro observado. No se ha creado ninguno.

## Puertas aún BLOQUEANTES — no comercializar
1. Obtener **PASS real de GitHub Actions** para el staging de 13 másters, examinar informe de tamaño/media y después validar la carga HTML/video, interacciones y apariencia móvil de cada skin con el cuestionario común.
2. Resolver la publicación **de un staging controlado** (GitHub Pages/Cloudflare, sin indexar ni cobros) y la ruta `catalog-final.html`, hoy incompatible con VEIL nativo y con `src:null` de todos los diseños pendientes. No inventar host, URL ni integración.
3. Certificar el `design-09` frente al original Limoneros incorrecto y la identidad visual de cada candidato, sin sobrescribir másters. Derechos de fuentes, música y activos en uso comercial por verificar.
4. Probar con cuenta y datos ficticios **compra Stripe → cuestionario → revisión → aprobación → entrega `p` → activación GUEST → vínculo RSVP `rt` → confirmación/denegación persistidas → sincronización en dos móviles reales**, y recepción efectiva de correos; distinguir pruebas simuladas, SQL, test Cloud y E2E completo.
5. Confirmar precios reales por diseño, documentación legal e indexación cuando exista GO; ahora no alterar pagos/activación comercial. Evitar cualquier acceso desde aplicación de pareja a editor de invitación/preguntas RSVP.
6. Intervención de propietaria solo si llega a ser estrictamente indelegable: decisión visual de la **variante correcta** de Limoneros y permisos de recursos; solicitarla de forma agrupada, nunca pedir de nuevo los 13 diseños.

## Estado de continuidad
`CANDIDATES_REGISTERED_TEST_ONLY`, **NO_GO** comercial. Registro y código backend alineados en 15 candidatos válidos; staging y CI reciente pendientes de ejecución comprobada; venta **no autorizada**, Cloudflare y pruebas físicas no certificadas. Mantener aislamiento ONE/Partner/STUDIO y no confundir `testOnly` con autorización de público.
