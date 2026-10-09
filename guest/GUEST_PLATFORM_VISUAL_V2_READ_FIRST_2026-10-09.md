> **PUNTO ÚNICO DE CONTINUIDAD (09/10/2026):** Antes de leer este documento o hacer cambios, abrir **[`guest/START_HERE.md`](START_HERE.md)** y **[`guest/DESIGN_NEW_RUNBOOK.md`](DESIGN_NEW_RUNBOOK.md)**. Este archivo mantiene su valor de política o evidencia histórica en su ámbito, pero los encabezados antiguos que digan «vigente» no sustituyen el estado actual del índice y los registros verificables. **No modificar congelados ni certificar ventas sin gates reales.**

# GUEST — Punto de recuperación único de la infraestructura visual V2

**2026-10-09 · Rama `guest-independent` · Solo documentación, tooling y pruebas.**

## Norma no negociable

Cada diseño nuevo aporta **dos entradas**: `master.html` (arte visual) y `visual-plugin.json` (id/versión/variantes). Todo lo demás lo atiende un solo pipeline GUEST: cuestionario, pedidos, preview, aprobación, entrega, gestión, RSVP. No se permiten motores duplicados, formularios privados por plantilla ni excepciones por pareja.

**La interfaz común para todos los nuevos diseños es `window.GUEST_APPLY_CONFIG(config)`**. VEIL LIGHT V5.3.3 y Botánica V14.7 conservan adaptadores de compatibilidad, sin modificar su diseño visual congelado.

## Código ya implementado y probado localmente

- `guest/tools/register_visual_template.cjs`: da de alta un diseño en los tres registros a partir de un único manifiesto y crea el HTML versionado y adaptador. Nunca certifica ni publica.
- `guest/GUEST_CATALOG_OWNER_RENDERERS_V2.json`: la misma tabla para resolver cualquier diseño en el centro propietario.
- `guest/catalog/guest-catalog-owner-viewer-v2.js`: visor genérico, con control de origen, versión, modo test/producción y fallos seguros. No incrusta vídeos en el centro.
- `guest/tools/generate_backend_catalog_registry.cjs`: genera entrada de backend según estado de certificación. Producción incluye solo diseños certificados. Pruebas añade candidatos test-only protegidos por guard en todas las rutas de creación. **Generar no equivale a desplegar**.
- `guest/qa/catalog_admission_gate.cjs` y `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json`: puerta estricta de venta, incluida comprobación de registro y adaptador común. Es imposible reutilizar el sello histórico VEIL como certificado de otro diseño.
- `guest/qa/catalog_preflight_v2.cjs`: una sola batería automatizada de pruebas; incluye casos mutantes y alta de un tercer diseño ficticio sin cambios en el visor.
- `.github/workflows/guest-botanica-contract-qa.yml`: conectado al preflight estructural V2 en cada cambio pertinente.
- `guest/templates/_example`: contrato y ejemplo mínimo para el futuro diseño 03.

Ejecutar **sin efectos externos**:

```bash
node guest/qa/catalog_preflight_v2.cjs
node guest/qa/catalog_admission_gate.cjs --admit botanica
```

La primera prueba debe pasar. La segunda **debe fallar** hasta que Botánica complete E2E y Android; de lo contrario hay una regresión de seguridad.

## Estado exacto en este checkpoint

- V14 de Botánica aprobada y congelada. V14.7 candidata en Biblioteca; no modificada.
- VEIL LIGHT V5.3.3 congelada y comercialmente certificada, sin cambios.
- Registro de Botánica: `certification-pending`, con 3/11 controles locales/históricos respaldados y 8/11 pendientes.
- Supabase `guest-invitation-flow` desplegada v12 NO modificada; solo reconoce VEIL LIGHT. Despliegue de pruebas para Botánica **bloqueado por el entorno**.
- Mobile Center V4.6 comercial congelado NO usa el visor V2; hay candidatos de preproducción de Botánica, no publicados.
- Cuestionario común original V3 NO soporta «Solo foto» y tiene incidencia de campos de regalo, corregidas solo en candidato QA. El backend v12 transforma `story.textMode=none` a `preset` y no emite `schemaVersion`.
- Dos pedidos Botánica **simulados localmente** pasan; los pedidos reales E2E, URL entregada, RSVP persistente y Android siguen sin poder certificarse.

## Lo que falta para declarar el sistema COMPLETAMENTE CERRADO

1. **Desplegar legítimamente y con tests** la versión común del cuestionario y su normalización en Edge Function (incluye `schemaVersion`, Story `none` y regalos), protegiendo el comportamiento ya certificado de VEIL.
2. Actualizar una sola vez el Mobile Center distribuido para que utilice el registro y visor genérico V2. Comprobar ambos diseños, Android, rendimiento y vuelta a GUEST; no editar V4.6 sellado.
3. Instalar un proceso de publicación/autorización que utilice el generador común de registros, respete `testOnly` y solo mueva plantillas certificadas a producción.
4. Completar dos pedidos **reales** distintos con Botánica, incluida revisión/final, enlaces de entrega, RSVP individual/unidad, persistencia y la operativa propietaria <=5 minutos.
5. Registrar evidencia de cada gate y exigir `--admit botanica` PASS. Solo después habilitar la venta mediante **decisión explícita**.

**No se puede declarar completado el sistema sin los cinco puntos.** Las barreras de esta sesión no se deben eludir; en cuanto el entorno de despliegue permita ejecutar y verificar, esa es la secuencia obligatoria. No empezar D03 construyendo sistemas paralelos. Nunca solicitar a la propietaria que vuelva a diseñar o reproducir instrucciones antiguas.

Documentación extensa: `guest/GUEST_CATALOGO_VISUAL_SISTEMA_COMUN_V2_2026-10-09.md` y `guest/GUEST_CATALOG_RELEASE_GATES_D02_D06_2026-10-09.md`. Estado específico D02: `guest/GUEST_D02_BOTANICA_READ_FIRST.md`.