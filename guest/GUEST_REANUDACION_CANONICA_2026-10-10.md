# GUEST by WeddlySmartDesign — REANUDACIÓN CANÓNICA Y ENTREGA DE TURNO

**Actualizado:** 10/10/2026 · **Naturaleza:** documentación operativa y evidencia, **NO autorización comercial**.
**Repositorio:** `WeddlySmartDesign/WeddlySmartDesign.github.io` · **ÚNICA rama de trabajo:** `guest-independent`.
**Checkpoint de partida verificado:** `04ec83d352e305fb27debe3c8f141ea453844adc` (antes de añadir este documento). Los commits de documentación posteriores actualizan este punto, no el código de venta.

## LEE ESTO PRIMERO

**El trabajo no está comercialmente terminado.** Botánica está visualmente aprobada en su master inmutable V14.7, con un paquete de preproducción íntegro. Se ha desplegado el sistema común de invitaciones y pagos, pero **no hay un alojamiento HTTPS público operativo para esa invitación, ni un pedido comercial completo comprobado desde un Android físico**. La plantilla **NO debe venderse** hasta una prueba completa y aceptación explícita.

**Restricciones absolutas:** no tocar ONE, ONE Partner, STUDIO, `main`, VEIL LIGHT congelado ni el HTML aprobado de Botánica. No rediseñar, reconstruir sistema de invitados ni reabrir investigación. No crear costes ni suscripciones nuevas; no habilitar ventas pendientes. La usuaria solo debe autorizar, si es imprescindible, el acceso gratuito a un alojamiento y revisar la versión final en móvil: **no debe editar HTML, instalar sistemas, diseñar ni depurar**.

## 1. Fuente de verdad y secuencia exacta de lectura

1. `guest/START_HERE.md` — punto de entrada y alertas de continuidad.
2. **Bitácora íntegra, acumulativa y única en Library:** `/GUEST by WeddlySmartDesign/Normativa/Continuidad GUEST/GUEST_BITACORA_COMPLETA_ACTUALIZADA_2026-10-10.md`. Entradas históricas 01–33 y entrada 34 de reconciliación en este cierre. Los hitos históricos describen el estado **en su momento**; los posteriores sustituyen al estado de despliegue anterior, no borran la historia.
3. `guest/GUEST_PROJECT_STATUS_V1.json` — identidades de plantilla, SHA, releases y bloqueos estructurados. No confundir `visuallyApprovedFrozenVersion: 14` con la **candidata técnica 14.7** con hash propio.
4. `guest/GUEST_CATALOG_ADMISSION_EVIDENCE_V1.json` — los 11 criterios de admisión. Registra **3 PASS formales / 8 pendientes** para Botánica. Mantener esa evidencia sin promociones artificiales.
5. `guest/GUEST_STATIC_HOSTING_RELEASE_RUNBOOK_2026-10-10.md` — acciones de publicación, comprobación, rollback y prohibiciones.
6. `guest/GUEST_NEW_DESIGN_ONLY_VISUAL_CONTRACT_2026-10-10.md` — incorporación única de futuros diseños: HTML visual + ficha, nunca nuevo checkout/backend.

## 2. Realmente desplegado en Supabase (verificado directamente)

Proyecto compartido de servicios: `dnjsxequwgtyyauuofxj`. **Solo se tocaron funciones de GUEST**.

| Componente | Estado comprobado | Prueba |
|---|---|---|
| `guest-invitation-flow` | **V14 ACTIVE** | Digest `84bdc6814b9738081036b7fb144da7d5556d64ab24c3f6b858ef1dc79e50e63e`; fuente inmutable `GUEST_V14_EDGE_VALIDADO_2026-10-10.ts` en Library, 66.594 bytes, SHA `d87ce43ad51422984e75c7738ba902630f3ab7cc60266fce5f7773764913139f` |
| `guest-stripe-checkout` | **V22 ACTIVE** | Digest `9c2628eb373d59e4595579529bffc9e45c347daae6936e4eefae9b785db69d0b`; mantiene modo antiguo de Essential/Signature y bloquea venta de plantilla sin aprobación mediante allowlist de servidor |
| `guest-rsvp` | V4 ACTIVE, no modificado en estos cierres | Misma versión de la lectura anterior |
| `guest-license-access` | V3 ACTIVE, no modificado | Misma versión |
| `guest-orders-admin` | V3 ACTIVE, no modificado | Misma versión |
| `weddly-app` (ONE) | V70 ACTIVE, no modificado | Misma versión |
| `wedding-sync` (ONE) | V18 ACTIVE, no modificado | Misma versión |

V14 **solo** amplía V13 con un control de origen de entrega alternativo `GUEST_CATALOG_PUBLIC_ORIGIN`, opcional, estrictamente HTTPS y ruta `/guest/catalog-final.html?p=<token>`; el origen y flujo heredados se mantienen. **No se ha comprobado una configuración de origen público real ni una invitación publicada**. No dar por establecida una variable secreta que no es legible por las herramientas.

**Rollbacks sin mezclar funciones:** V13 completo en Library `GUEST_V13_EDGE_GENERADO_VALIDADO_2026-10-10.ts` (65.519 bytes; digest Cloud anterior `2bc1fd8d2b6c0831b4e46b3ac8d565cbcc6ada5b10750b9fbaaa14714dd808d5`); checkout V21 en GitHub commit `2ceeb4d9006f36dabed1cd8dc5d79db05d2e55ef` (digest Cloud anterior `083a61f9549f2758f07577a67f0efc9417621ba9e7482edb6465d32f75be4b6f`). Revertir solo el servicio afectado tras verificar fuente exacta y JWT `false`, y documentar la intervención.

## 3. Artefactos y calidad verificados, sin confundirlos con publicación

**ZIP Botánica listo para alojar:** Library `/GUEST by WeddlySmartDesign/Normativa/Continuidad GUEST/GUEST_BOTANICA_V14_7_PAQUETE_HOSTING_GRATUITO_PREPRODUCCION_2026-10-10.zip`.

- ZIP **9.133.859 bytes**, SHA-256 `dd0729f27b30812a722ba18439335303ce20d7df78a28f14d8341bd8419b86dc`, **11 archivos**, comprobados en la copia montada.
- HTML maestro `guest/catalog-assets/botanica/14.7/index.html`: **11.635.635 bytes**, SHA-256 `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`, **intacto**.
- Resto: cuestionario común V3, página genérica `guest-review-v1.html`, página genérica `guest/catalog-final.html`, visor compartido y runtime, manifiesto de renderizadores **solo para staging**, `_headers` `noindex`, índice informativo y `botanica/solo_revision_visual.html`.
- `GUEST_STAGE_MANIFEST.json` dice inequívocamente `PREPRODUCTION_DO_NOT_SELL`, `commercialApproved: false`, `hostingConnected: false`, `mobileLiveVerified: false`. El registro **canónico** del repo conserva Botánica `certification-pending` y `src: null`; la ruta `src` del ZIP solo habilita carga del master dentro del paquete de staging.
- Paquete de consulta protegido en Vercel `weddly-owner-demos` **READY pero SSO/privado, no enlace para invitados**. No utilizarlo como prueba de venta.

**Pruebas pasadas:** Supabase desechable [CI `38075826054`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38075826054) `SUCCESS`: dos bodas sintéticas, contrato V14, guard de URL, persistencia y RSVP local real. Pruebas de empaquetado D03 ficticio sin alterar catálogo real, paquete estático sin secretos y navegador Chromium móvil para las páginas comunes. En commit `04ec83d3`: [catálogo `38076412993`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38076412993) **SUCCESS** y [QA general `38076413020`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38076413020) **SUCCESS**. **Son pruebas automatizadas, no sustituyen pedidos reales/Android físico.**

## 4. Pendiente P0: solo pasos de ejecución, sin reiniciar el proyecto

1. **Conexión gratuita de un hosting estático realmente apto para venta** (Cloudflare Pages Free preferente, u otro gratuito autorizado y con límites comprobados). No hay actualmente cuenta Cloudflare conectada ni una publicación verificable. No usar Vercel Hobby de previews privados ni `main` como tienda nueva; no crear Railway aparte de los proyectos congelados. No iniciar servicios que generen gasto.
2. **Publicar el ZIP íntegro y verificar rutas HTTP(S) accesibles sin SSO**, manifest, foto/vídeo (11,6 MB), `noindex`, sin filtraciones de token y sin mostrar los nombres demo antes de aplicar la configuración real. Revisar `botanica/solo_revision_visual.html` en Android.
3. **Con el host real ya verificado**, configurar de forma autorizada `GUEST_CATALOG_PUBLIC_ORIGIN` únicamente en la función de GUEST. NO cambiar `WEDDLY_SITE_ORIGIN`. Releer Cloud V14 y comprobar que origina solo enlaces al dominio exacto y ruta con capacidad del pedido.
4. **Probar al menos dos bodas distintas completas**, sin datos/clientes reales ni cargos indebidos: selección de plantilla certificada según evidencias → checkout seguro → licencia → pedido V14 → cuestionario común y fotografías → centro de revisión → aprobación/cambios → enlace público final HTTPS → invitaciones personalizadas `rt/g/u/lang` → RSVP y persistencia en motor GUEST → gestión y listados.
5. **Revisión final física Android** de Botánica y evidencia de intervención propietaria hasta 5 minutos. Cerrar los **11/11 gates** con pruebas verificables; solo después considerar `commercially-frozen` y permitir Stripe con plantilla/versión/edición/precio real aprobado. No inventar precios Atelier ni publicar botones comerciales antes.

**Resultado actual:** Botánica **NO-GO**, 3/11 PASS formales y 8 pendientes. La gestión de invitados y el sistema de venta común están construidos; el bloqueo determinante es la publicación pública y la certificación real. Es falso que el ZIP por sí solo constituya una invitación comercial entregada.

## 5. Regla para diseños 03, 04 ... 1000

Al reanudar, **no empezar D03 hasta cerrar Botánica**. El sistema ya permite alta de un nuevo diseño con HTML final que exponga la API común + `visual-plugin.json` y el registrador `guest/tools/register_visual_template.cjs`; el empaquetador único `guest/tools/build_catalog_static_preview.cjs --template <id>` fija SHA y genera la misma publicación. Deben reutilizarse cuestionario, pagos, licencias, pedido, aprobación, entrega, RSVP, listado y centro móvil. Cada diseño requiere su calidad visual y pruebas automatizadas, **no nueva infraestructura ni depuración de otro checkout**. Cualquier requisito de código específico por nombre de diseño se considera defecto del sistema común.

## 6. Mandato de documentación y protección de cartera

- **Una sola bitácora maestra** en Biblioteca, acumulativa, sin numeraciones duplicadas. Cada hito añade un número y evidencia, sin sobrescribir la historia ni crear un resumen paralelo que la suplante.
- Actualizar `guest/START_HERE.md`, `guest/GUEST_PROJECT_STATUS_V1.json`, este relevo y bitácora cuando cambie el punto real de continuidad. Leer GitHub HEAD y GitHub Actions **antes** de cambiar un desplegado, no deducir que el último commit ya pasó CI.
- No editar ONE, ONE Partner, STUDIO, VEIL LIGHT congelado, visual Botánica V14.7, ni la rama `main` por un trabajo GUEST. Sin costes adicionales y sin compras ficticias que envíen correo a compradores.
- Si la cuenta del nuevo alojamiento no está conectada, declararlo como dependencia externa precisa; **no inventar publicación, dominio, HTTP 200, configuración o certificación comercial**. La usuaria solamente debería dar acceso por la vía segura del servicio y hacer una revisión final desde el móvil.

**Este documento sirve como mapa breve. Los detalles históricos y excepciones están completos en las 34 entradas de la bitácora y en los runbooks de GitHub.**