# GUEST / Botánica D02 — corrección de foto sin texto · 09/10/2026

## Resultado
- La V14 original sigue **aprobada/congelada e inmutable** (SHA-256: `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39`).
- La V14.5 se conserva como candidata técnica histórica (SHA-256: `ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84`).
- La V14.6 es una NUEVA candidata con un cambio exclusivamente lógico de la función `fromQuestionnaire` (SHA-256: `35d0caf0a2ef716a51b7d5cdfd451ebc5ad5ae60bb9ad56aee4ed9c692820c85`).

## Defecto reproducido
Cuando `story.enabled=true`, `story.textMode='none'` y existe `story.photo.src`, V14.5 calculaba `storyEnabled=false`; la foto se recibía pero la sección quedaba oculta. Se probó leyendo y ejecutando la función real extraída del HTML con Node VM. Se debe permitir una Historia solo fotográfica cuando el cuestionario habilita Historia.

## Cambio exacto en V14.6
Sustituir solo `result.storyEnabled=input.story.enabled && input.story.textMode!=='none';` por:

```js
result.storyEnabled=input.story.enabled && (input.story.textMode!=='none'||!!(input.story.photo?.src||input.cover.photo?.src));
```

No hay ningún otro cambio en el HTML y los 17 recursos incrustados de V14.5 se mantienen byte a byte.

## Evidencia local
- 11/11 escenarios de mapeo canónico PASS en V14.6, incluido modo fotografía sin texto, historia vacía apagada, historia desactivada, fuente portada como foto, presets, vestimenta, dos lugares, cinco momentos, secciones opcionales, regalo y RSVP.
- El mismo caso de foto sin texto **FALLA** en V14.5. Esto demuestra que el nuevo test detecta el error anterior.
- 4/4 scripts JS inline sin error de sintaxis.
- Multimedia 3 MP4 + 14 WebP = idénticos a V14.5; cambios de código limitados a una condición.
- Pruebas del puente RSVP simulado: 7/7 PASS tras poner adaptador y registro en versión `14.6`, siempre `certification-pending`.

## Faltan y NO se declaran superados
1. Android/visual de variante Historia solo fotografía y demás extremos sobre V14.6 (Chromium local informó `ERR_BLOCKED_BY_ADMINISTRATOR`).
2. Despliegue test-only de Supabase prohibido/bloqueado en la herramienta actual; **NO SE HA DESPLEGADO**. No evadir restricciones.
3. Dos pedidos diferentes desde cuestionario real + pruebas de review/final/entrega/RSVP, y métrica operativa ≤5 minutos.
4. Certificación comercial y publicación siguen separadas y **PENDIENTES**.

## Pruebas reproducibles
```bash
node guest/tests/botanica_schema_mapping_offline.test.cjs /ruta/GUEST_D02_BOTANICA_ATELIER_V14_6_PHOTO_ONLY_QA_CANDIDATE_2026-10-09.html
node guest/tests/botanica_catalog_bridge_offline.test.cjs
```

## Protecciones
Rama `guest-independent`. No tocar ONE, ONE Partner, STUDIO, VEIL LIGHT ni V14 congelada. No habilitar Stripe, `main` ni ventas. 

**Fuentes**: `guest/GUEST_D02_BOTANICA_READ_FIRST.md` y `guest/GUEST_D02_BOTANICA_ARTIFACT_MANIFEST_V2_2026-10-09.json`. Antes de cualquier cambio verificar huellas y estado de Supabase.