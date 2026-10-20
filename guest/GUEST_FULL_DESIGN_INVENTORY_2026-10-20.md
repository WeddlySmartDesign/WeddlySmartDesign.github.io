# GUEST — Inventario exhaustivo de diseños recuperados (20/10/2026)

## Hallazgo clave
La fuente `claude/guest-skins-d04-d08` contenía más material del que se había reconocido en el registro comercial original y en la primera recuperación. El usuario ha confirmado que existen varios diseños adicionales, incluyendo **Abanico, Bola de nieve, Mapa y tres variantes de cómic**. En el código, el que recuerda como «Bola de nieve» figura como **BOLA DE CRISTAL**; no sustituir ese nombre sin verificar identidad visual con la propietaria.

**15 diseños diferentes potenciales localizados**, más **1 variante histórica incorrecta de Limoneros** archivada:

| Orden | ID interno | Identidad encontrada | Origen | Tratamiento |
| --- | --- | --- | --- | --- |
| 1 | `veil-light` | VEIL LIGHT | motor GUEST / Biblioteca | máster aprobado; no modificar |
| 2 | `botanica` | BOTÁNICA | motor GUEST / Biblioteca | máster anterior congelado; pendiente QA comercial |
| 3 | `design-09` | LIMONEROS · VERSIÓN CLAUDE | rama Claude | **candidata correcta** de las dos versiones; comprobar identidad visual |
| 4 | `design-04` | AZULEJO | rama Claude | candidata, sin venta |
| 5 | `design-05` | GALA | rama Claude | candidata, sin venta |
| 6 | `design-06` | INVERNADERO | rama Claude | candidata, sin venta |
| 7 | `design-07` | REFLEJO | rama Claude | candidata, sin venta |
| 8 | `design-08` | CAJA DE MÚSICA | rama Claude | candidata, sin venta |
| 9 | `design-10` | CUENTO DE PAPEL | rama Claude | candidata, sin venta |
| 10 | `design-11` | BOLA DE CRISTAL | rama Claude | candidata, sin venta |
| 11 | `design-12` | ABANICO | rama Claude | candidata, sin venta |
| 12 | `design-13` | VIÑETAS | rama Claude | cómic primera versión; candidata, sin venta |
| 13 | `design-14` | VIÑETAS · ELLAS | rama Claude | cómic segunda versión; candidata, sin venta |
| 14 | `design-15` | VIÑETAS · ELLOS | rama Claude | cómic tercera versión; candidata, sin venta |
| 15 | `design-16` | EL MAPA | rama Claude | candidata, sin venta |
| archivado | `design-03` | LIMONEROS (versión anterior incorrecta) | motor GUEST | **NO seleccionar para venta**, preservar sin alterar |

## Descubrimiento y recuperación comprobados
- Fuente: `WeddlySmartDesign/WeddlySmartDesign.github.io` rama `claude/guest-skins-d04-d08`, SHA fijada `5b1e418b11c4af0a0b7753963b7079f897016f8d`.
- La primera fase incorporó 127 ficheros originales de D04–D09, 148.872.423 bytes, commit `6b53a91aa15100bc58555739d4402a804b92a1bc`. Manifiesto `GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json`.
- **Segunda fase completa:** siete diseños D10–D16, 84 blobs originales Git, 118.195.733 bytes; commit `a7ac960d590dc66bea9fcb497a4f3ff0e7e7e530`. Todos los 84 SHA de blob y tamaños han sido **releídos y comparados contra la rama Claude**, 84/84 idénticos. Manifiesto `GUEST_CLAUDE_D10_D16_IMPORT_MANIFEST_2026-10-20.json`.
- Rutas fuente copiadas **sin recompresión ni recreación**: `guest/templates/design-10..16/skin.json`, `interior.css`, `interior.js`, `skin-assets/*`, `guest/catalog-assets/design-10..16/1.0.0/index.html` autocontenidos y adaptadores `guest-catalog-template-design-XX-adapter-v1.js`.
- Los siete `guest/templates/design-XX/master.html` de más de 12MB son duplicados bit a bit de `guest/catalog-assets/design-XX/1.0.0/index.html`: permanecen en la rama Claude origen, y su copia única vive en el branch GUEST para evitar duplicación inútil. No se han perdido los másters.
- Total adicional recuperado de Claude desde esta auditoría: **211 blobs originales**, aprox. 267 MB, de **D04–D16** (13 diseños). Los dos existentes VEIL y BOTÁNICA + los 13 hacen **15 diseños no duplicados**. Se encontró también D03 antiguo (16 artefactos de identidad, pero no 16 diseños diferentes a comercializar).
- Las tres variantes de cómic son **tres skins independientes**: VIÑETAS, VIÑETAS · ELLAS y VIÑETAS · ELLOS; no colapsarlas en un solo producto.
- La rama `claude/clever-cori-gtvgbd` existe pero es una rama antigua del módulo de invitados; no era la rama de diseños.
- Los assets D10–D16 **pueden incorporar música** (Bola de cristal y variantes VIÑETAS); verificar derechos antes de venta. No compartir archivos de fuentes, ni inferir permisos comerciales por su presencia en Git.

## Protección y pruebas
- Nuevo test `guest/tests/claude_d10_d16_integrity_2026_10_20.test.cjs` recalcula SHA de cada uno de los 84 blobs, confirma ID, nombre, versión, máster autocontenido, duplicado D03 intacto y ausencia de aprobación comercial. Ya integrado en `GUEST Independent QA`.
- Se mantiene `guest/tests/claude_designs_import_integrity_2026_10_20.test.cjs` para los 127 de la primera fase.
- **No se ha abierto la venta** de D10–D16 ni alterado precio/checkout, status de compra, backend Supabase, certificación de CI anterior o entorno Cloudflare. El registro de 3 diseños sigue deliberadamente intacto porque la herramienta de admisión exige evidencia por diseño y el pipeline TEST-only se bloquea si se registra como certificado sin cumplir; añadirlos gradualmente sin falsificar gates.
- Para GUEST al público: este inventario NO equivale a que los 15 hayan pasado QA de móvil ni a que los 15 estén en el catálogo de venta. Certificar renderer, entrega final con token, encuesta / preguntas RSVP, música/licencia, ambos móviles, compra/Stripe y E2E antes de declarar GO.

## Próxima acción operativa de ChatGPT
Trabajar con los **15 encontrados** como cartera de candidatos, no volver a pedir la subida de los 7 ni de los 5 anteriores. Mantener D03 antiguo bloqueado comercialmente y D09 separado para verificar versión correcta. Conservar toda la infraestructura de ONE, Partner y STUDIO aislada. Completar empaquetado/publicación con control de límites de archivos por activo, certificación de la reproducción, y validez comercial del pipeline. Pedir autorización a la propietaria solo cuando sea imprescindible (por ejemplo, identidad visual entre dos Limoneros o comprobación de permisos de música) y agruparlo en una sola intervención.
