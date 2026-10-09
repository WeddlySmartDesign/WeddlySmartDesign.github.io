# GUEST — cierre de continuidad y control de errores entre chats

**Fecha:** 09/10/2026 · **rama:** `guest-independent` · **naturaleza:** evidencia de documentación y QA local, NO sello de venta.

## Una sola fuente; duplicados retirados

- **Entrada única:** `guest/START_HERE.md` (ya existente, preservado y enriquecido; no se sustituyó por otro punto de entrada).
- **Único estado estructurado:** `guest/GUEST_PROJECT_STATUS_V1.json` (ya existente; versiones, evidencias y backend observado).
- **Único procedimiento para diseños 03–1000:** `guest/DESIGN_NEW_RUNBOOK.md` (ya existente).
- **Único motor de validación de continuidad:** `guest/qa/handoff_gate.cjs`; la antigua ruta `guest/qa/continuity_entry_guard.cjs` se convirtió en **delegado de compatibilidad**, sin reglas duplicadas.
- Se retiró un archivo de estado provisional creado durante esta consolidación para no mantener dos fuentes contradictorias.
- **Autoridad de producto**: `guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md`; fuente de datos: `guest/GUEST_INVITATION_CONFIG_SCHEMA_V1.json`. La bitácora `guest/CURRENT_STATE.md` conserva historial, pero no decide estado actual.

## Defensas nuevas versionadas

- `guest/qa/handoff_gate.cjs` comprueba ahora que el esquema siga aceptando Historia sin texto y 2 sedes/4 fotos, que el índice apunte al estado único, que GitHub Actions invoque el control y sus mutaciones, y que un diseño 03+ no se registre mientras la plataforma común no esté realmente certificada.
- `guest/tests/handoff_gate_test.cjs`: línea base + **11 mutaciones antirregresión**, incluida modificación del esquema y desconexión intencionada del CI; compatibilidad con el estado comercial futuro completo.
- `.github/workflows/guest-botanica-contract-qa.yml`: disparo por cambios en `guest/**` dentro de `guest-independent`, pruebas aisladas del puente y catálogo, preflight V2, handoff y test de mutaciones. Lectura del repositorio solamente; no necesita credenciales de Supabase/Stripe ni despliega nada.
- `guest/qa/continuity_entry_guard.cjs`: solo redirige al gate canónico, para que invocaciones antiguas no se queden con reglas obsoletas.

## Evidencia de ejecución

En una **copia local aislada, basada en el checkpoint del repositorio** (ver archivo `QA_HANDOFF.txt` adjunto), han pasado:

1. `handoff_gate.cjs` — PASS: estado de Botánica V14.7 coherente; VEIL LIGHT certificado.
2. `handoff_gate_test.cjs` — PASS: base + 11 fallos provocados y estado comercial futuro permitido cuando hay evidencias.
3. `catalog_preflight_v2.cjs` — PASS: admisión comercial, mutaciones, registro de plugin nuevo, visor genérico y generación protegida del registro para backend.

**Alcance de la evidencia:** validación local de código/documentación. Se verificó mediante el conector que la Edge Function desplegada `guest-invitation-flow` permanecía en v12 con el digest `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac` y sin Botánica. **No se ha confirmado en esta sesión una ejecución verde de GitHub Actions posterior al commit**, ni se ha desplegado código nuevo, ni se han creado pedidos/RSVP reales.

## Estado comercial que NO debe alterarse por este trabajo

- Diseño 01 **VEIL LIGHT V5.3.3**: `commercially-frozen`; inmóvil.
- Diseño 02 **BOTÁNICA V14**: arte aprobado congelado; V14.7 candidata; `certification-pending`, 3/11 puertas apoyadas, 8 pendientes.
- Contrato/backend: V2 implementado en rama; **pendiente integración real** del cuestionario común, la normalización de Historia, el registro test-only y el visor del Mobile Center. El entorno bloqueó despliegues anteriores. No intentar eludir los controles.
- **D03+**: no empezar integración/diseño de producto mientras falte certificación de plataforma compartida; cuando se cierre, cada diseño aportará solo `master.html` y `visual-plugin.json` y será admitido por los gates comunes.

## Uso desde el siguiente chat

**Primero** leer `guest/START_HERE.md`. **Después** ejecutar `node guest/qa/handoff_gate.cjs && node guest/tests/handoff_gate_test.cjs && node guest/qa/catalog_preflight_v2.cjs`. Si cualquiera falla, resolver lo reportado con la fuente vigente, sin adivinar ni saltarse controles. Para nuevas plantillas seguir **solo** `guest/DESIGN_NEW_RUNBOOK.md`; para D02 continuar con `guest/GUEST_D02_BOTANICA_READ_FIRST.md`.

**No confundir este sello documental/QA con la certificación comercial de Botánica.** La venta exige despliegue autorizado, dos pedidos reales en test, entrega, RSVP persistente y Android, además de aprobación explícita separada para publicar y cobrar.