# GUEST/Botánica — Entrada 56 · corrección pendiente del gate de continuidad (NO afecta RSVP Cloud)

Fecha: 11/10/2026. Rama: `guest-independent`. Continuación inmediata de [Entrada 55](GUEST_BOTANICA_ENTRY_55_CLOUD_RSVP_OWNER_ANDROID_2026-10-11.md). Documento correctivo **sin modificar producto, base de datos ni licencias**.

## Qué está comprobado

- Los dos vídeos enviados por la propietaria muestran **la misma invitación Botánica «Una sede»**, porque los enlaces son para **destinatario individual** y **unidad de dos** de **la misma boda**, no dos diseños. La captura anterior registraba un paso intermedio de la certificación (su texto visible aún decía «Validando autorización…»). Las lecturas posteriores de Supabase **sí** evidencian un pedido Botánica TEST enlazado, dos submissions de origen `guest`, ambas `applied`, asistencia sí/no, y estados `confirmed` y `declined` para dos personas de una unidad ficticia. **No repetir la prueba**.
- Formal gate `recipient-rsvp` consta PASS con prueba Cloud y límites de interfaz registrados en `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`; JSON de estado declara **8/11 PASS, 3 PENDING** (renderer gestor, revisión/final, owner-touch). Venta NO-GO.
- `guest/GUEST_CONTINUITY_LEDGER_FROM_LIBRARY_V24_2026-10-11.md` ya incluye Entrada 55 y el `guest/GUEST_PROJECT_STATUS_V1.json` apunta a Entrada 55. La Biblioteca histórica v24 intacta.

## Fallo CI preciso, visible y no ocultado

GitHub Actions `GUEST Catalog and Continuity QA (offline)` run [38146501181](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38146501181): **FAIL**. El error es: `FAIL current-state/evidence disagreement: recipientRsvpPersistence`. El QA independiente en el mismo HEAD es SUCCESS.

Causa exacta leída del código `guest/qa/handoff_gate.cjs` (líneas 70–75): exige que `s.commercialGate.recipientRsvpPersistence === 'PASS'` coincida con `gates['recipient-rsvp'].pass===true`. El último cambio de estado almacenó por error **el texto completo «PASS real GUEST Cloud Botánica TEST ...»** en lugar del literal `PASS`. **Esto es una inconsistencia de formato documental/CI, NO un defecto de RSVP ni una refutación de los registros en Cloud**.

**Corrección mínima pendiente, sin cambiar criterios**:
1. Abrir `guest/GUEST_PROJECT_STATUS_V1.json` en rama `guest-independent`.
2. Sustituir únicamente `commercialGate.recipientRsvpPersistence` por la cadena exacta `"PASS"`.
3. Conservar la descripción extensa en un campo separado `commercialGate.recipientRsvpPersistenceScope` o referenciar `runtime.botanicaEntry55CloudRsvp` y Entrada 55 (ya existentes); **no borrar el historial ni desactivar checks**.
4. Ejecutar ambos workflows y exigir `SUCCESS` **en el mismo HEAD** antes de afirmar QA verde.

Se intentó aplicar esa corrección con la herramienta GitHub del chat y fue **bloqueada por controles del entorno**; no se forzó ni se recurrió a mecanismos alternativos para sortearlo. **NO afirmar que esta modificación quedó aplicada.** El fichero JSON de estado es grande (~105 KB), así que una futura sesión con acceso autorizado de edición por diff limitado será el camino normal. No falsificar PASS mediante scripts de CI ni relajar `handoff_gate.cjs` para ocultar el error.

## Estado y continuidad al cierre de esta entrada

**Evidencia Cloud: 8/11 gates con RSVP real acreditado; 3 pendientes comerciales. QA de continuidad: FAIL por la inconsistencia textual indicada; QA independiente: SUCCESS; estado comercial: NO-GO.** No pedir repetir licencias, pedidos, RSVP, vídeos, configuraciones Cloudflare/Supabase o credenciales. No tocar ONE, ONE Partner, STUDIO, VEIL LIGHT, `main`, master aprobado Botánica ni Stripe.

**Siguiente acción prioritaria y única:** corregir un solo valor de JSON `recipientRsvpPersistence` a `PASS` sin más cambios, verificar QA verde, luego continuar paridad revisión/final, renderer Centro real y tiempo activo. Mantener documentación append-only GitHub; Biblioteca v24 se preserva.
