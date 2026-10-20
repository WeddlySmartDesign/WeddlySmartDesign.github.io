# GUEST · Recuperación comprobada de diseños en rama Claude (20/10/2026)

## Corrección de información que afectaba al lanzamiento
La propietaria ha confirmado que **hay dos Limoneros** y que la versión antigua almacenada en el módulo GUEST **NO es la correcta**. No pedirle más subidas antes de inspeccionar GitHub. Se ha localizado la rama **`claude/guest-skins-d04-d08`**, commit exacto `5b1e418b11c4af0a0b7753963b7079f897016f8d`; no confundir con `claude/clever-cori-gtvgbd` (antiguo módulo invitados). La rama Claude contiene **más diseños además de los cinco buscados** (D10–D16); NO presumir que esos extras forman parte de los ocho elegidos para venta.

### Inventario recuperado sin intervención humana
| ID de origen | Identidad del diseño | Estado |
| --- | --- | --- |
| `veil-light` | VEIL LIGHT | máster aprobado anterior, conservar |
| `botanica` | BOTÁNICA | candidato anterior, conservar |
| `design-04` | AZULEJO | recuperado de Claude como candidato |
| `design-05` | GALA | recuperado de Claude como candidato |
| `design-06` | INVERNADERO | recuperado de Claude como candidato |
| `design-07` | REFLEJO | recuperado de Claude como candidato |
| `design-08` | CAJA DE MÚSICA | recuperado de Claude como candidato |
| `design-09` | **LIMONEROS · VERSIÓN CLAUDE** | **alternativa distinta a design-03** recuperada, candidata a correcta; no considerar aprobada visualmente sin prueba de esa versión |

**El viejo `design-03` LIMONEROS permanece como histórico**, inalterado, **no debe publicarse ni seleccionarse por error para la venta**. El nuevo `design-09` no se ha renombrado ni sobreescrito sobre D03: preservar trazabilidad de qué variante es cuál. Su `skin.json` indica explícitamente `displayName: "LIMONEROS · VERSIÓN CLAUDE"` y origen de vídeos/fondos D03, pero código/composición editorial distinta (incluye nuevas fuentes y recursos), por lo que NO asumir identidad byte a byte con viejo Limoneros.

## Traslado REAL ejecutado
- Se han incorporado **127 archivos existentes**, todos bajo `guest/**`, desde SHA de blobs Git **originales de Claude** a `guest-independent` sin descarga/manual y sin reconstrucción generativa, con commit `6b53a91aa15100bc58555739d4402a804b92a1bc`. Se copiaron másters preparados en `guest/catalog-assets/design-04..09/1.0.0/index.html`, las pieles `guest/templates/design-04..09/skin.json`, CSS/JS e imágenes auxiliares, el motor común `guest/templates/_skin-engine/**`, adaptadores D04–D09 y la herramienta `build_skin_master.cjs`.
- 148.872.423 bytes de ficheros recuperados; los seis `templates/design-XX/master.html` duplicados de los `catalog-assets/.../index.html` **no se duplicaron** porque el original idéntico está preservado inmutable en la rama Claude. El constructor conserva materiales para regenerar; no se modificó ningún archivo del origen.
- Relectura directa de GitHub tras transferencia: **127/127 hashes Git idénticos**, ningún conflicto de ruta; el viejo D03 conserva su blob original `020c46846403a77574b71a92cd22c3d00408b235`, mientras el nuevo D09 posee SHA `3d689aaf7995c8dcaac8e82d319016506496172f`.
- **Manifiesto auditado** `guest/GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json`: pin exacto por SHA Git y bytes de los 127 archivos, rama/commit origen, protección de design-03 y design-09.
- **Test sin red ni ventas** `guest/tests/claude_designs_import_integrity_2026_10_20.test.cjs`: recalcula SHA Git blob de cada archivo, comprueba identidad de los seis diseños, función común `GUEST_APPLY_CONFIG` y que el antiguo D03 sigue pendiente y ninguno se publica accidentalmente. Integrado en `GUEST Independent QA`.
- Control `guest/qa/catalog_commercial_go_no_go_2026_10_20.cjs` actualizado para reconocer el material localizado: **no faltan ya los cinco masters del grupo D04–D08**, pero sí el registro/certificación comercial y la prueba de entrega y compra. No activar cobros.
- Branch `claude/guest-skins-d04-d08` preservada y totalmente intacta. ONE, ONE Partner, STUDIO, VEIL congelado y Botánica congelada **sin alteraciones**.

## Estado y puertas comerciales
**Hay OCHO opciones de diseño materialmente localizadas** tomando VEIL + Botánica + las cinco D04–D08 + alternativa Claude D09 en lugar del histórico D03. Esto no demuestra que estos ocho sean definitivamente la selección comercial aprobada: falta su validación visual/versionado y pruebas reales.

**Aún NO VENDER**: el backend activo `guest-invitation-flow` V20 solo conoce VEIL/BOTÁNICA/D03 (D03/BOTÁNICA testOnly); el registro de `guest-independent` conserva únicamente los tres iniciales; el final `catalog-final.html` carece de URLs de máster publicadas; `guest.html` muestra textos obsoletos por colecciones; aún falta SSL/publicación y E2E real. NO fusionar la rama Claude completa: contiene cambios ajenos y potencialmente obsoletos a código de invitaciones, checkout, y módulos actuales. La integración de los diseños se hace por archivos y fuentes exactas, con aislamiento y autorización apropiada.

## Punto de continuidad técnica sin pedir a la usuaria trabajo
1. Pasar la matriz independiente completa con el control de hash de los 127 blobs importados; resolver si fallase.
2. Comparar el registro de Claude (D04–D16) y sus evidencias con el registro GUEST actual, **añadiendo SOLO los candidatos que forman parte de los ocho**, pero conservando `certification-pending` y `testOnly` en backend hasta completar QA. Mantener D03 histórico fuera de catálogo y no renombrar D09 prematuramente.
3. Unificar el empaquetado estático y las URLs de visualización de las ocho opciones, resolver archivos HTML mayores del límite de hosting sin recomprimir los vídeos del máster, conservar hashes y animaciones.
4. Certificar la identidad visual y funcional específica de Claude D09 y D04–D08 en móvil y bajo el cuestionario común, **sin pedir más medios a la propietaria**. Revisar derechos de música/fuentes antes de vender.
5. Certificar compra→cuestionario→revisión→aprobación→entrega→acceso GUEST→envío/RSVP→dos móviles con datos de prueba separados de clientes. Publicar y activar ventas solo al tener pruebas reales de todo el recorrido y autorización comercial.

**Intervención de la usuaria solicitada ahora: NINGUNA.** No necesita subir diseños: están localizados en GitHub. Si se necesita reconocer cuál de las dos versiones Limoneros es la aprobada tras comparar previews, solicitar solo esa decisión visual, no los archivos.
