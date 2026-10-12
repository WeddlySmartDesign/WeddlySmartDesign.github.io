# GUEST · Entrada 80 — Limoneros: 39 blobs completos, integración automatizada preparada (12/10/2026)

## Hechos efectivamente verificados
- Rama exclusiva `guest-independent`, sin tocar ONE, ONE Partner, STUDIO, VEIL LIGHT ni máster Botánica.
- Fuente: Biblioteca `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/GUEST_D03_LIMONEROS_MASTER_V1_TEST_NO_SALE.zip` (24.903.943 bytes, SHA256 `001ea39f5f47475102547777e34935f1732a6f8dcc0b46e5bbfba87fb3520f96`).
- `master.html` original: **28.673.474 bytes**, SHA256 **`a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`**. No se ha rediseñado ni cambiado su contenido.
- Se recuperó mediante SHA Git el corte canónico de **39 blobs de 750.000 bytes** (último fragmento 173.474 bytes), incluidos 014–019 y 036. Los objetos ya existentes de GitHub se contrastaron por `fetch_blob` frente a los SHA calculados **del HTML original**.
- **Bloques 037 y 038 realmente ausentes**: codificados a base64 desde el HTML original, copiados temporalmente a la Biblioteca y enviados con `GitHub create_blob(base64)`. GitHub devolvió exactamente sus SHA esperados:
  - 037: `eeace19a16b8dbc458bce4ec65a88849452a960c`, 750.000 bytes.
  - 038: `a5d731077abc333046d7b133ab6b2feaf898c9d9`, 750.000 bytes.
  - 007 dio un resultado transitorio de no encontrado pero la comprobación posterior por el mismo SHA encontró el objeto; se trata como objeto confirmado. No confundir retorno textual del conector con integridad de bytes: los SHA son la prueba de identidad del objeto.
- Por tanto, **los 39 objetos del HTML V1 están presentes como Git blobs recuperables**. Los blobs NO equivale a un diseño registrado, un commit de instalación ni una publicación.

## Incorporación segura preparada sin volver a subir 28,7 MB
- `guest/tools/limoneros_existing_blobs_v1.json`: lista completa ordenada, longitudes y SHA Git, más tamaño y SHA256 final obligatorios. Commit `5aa313909b1412a01214797eaa492039451edd69`.
- `guest/tools/install_limoneros_from_existing_blobs.py`: ejecutor de una sola vez, valida rama, repositorio, estado no registrado, cada uno de los 39 SHA, reensambla bytes exactos y verifica SHA256, usa el registrador existente, ejecuta preflight y stage NO-SALE, solo entonces prepara un commit atómico con HTML original, plugin, adaptador y tres registros canónicos. Commit `2639b3b53ad0f0203f557500fe6e4d820aa3b645`. Si falta un objeto, cambia un hash, falla QA o se mueve la rama, **no modifica producción** y no hace push.
- `.github/workflows/guest-limoneros-install.yml`: workflow limitado a la rama `guest-independent` y a su propio fichero, `contents: write`, corre el ejecutor. Commit `6deae18aee505937a9c9264cede922d9398baeb0`.
- **El flujo de instalación está creado pero su resultado de ejecución NO está confirmado al cerrar esta entrada.** No afirmar que la integración terminó hasta que el HEAD de `guest-independent` muestre commit `feat(guest): install verified Limoneros V1 TEST-only without touching frozen designs` y se comprueben registro/asset/QA.

## Incidencia CI común detectada al verificar runs anteriores
- Tres ejecuciones de `GUEST Catalog and Continuity QA` fallaron en `guest/tests/multi_design_dropin_pipeline.test.cjs`: la prueba sintética trataba `design-03` como si siempre tuviera estado `not-started`, después de que el estado documental se corrigiera a candidata recuperada. No es un error de los medios ni de la plantilla.
- Se corrigió **solo la fixture temporal de pruebas**: ahora parte siempre del catálogo histórico VEIL/Botánica dentro de su directorio `tmp` y puede simular dos plantillas nuevas sin asumir que una ID real sigue vacía. Ningún dato real o diseño sellado se cambió. Commits `0c3e61d1d9f8a11ac979d72065edc386fb3b48d9` y `215212b6c191705ad22e4eea2d47269a20a3a102`.
- Pendiente leer CI reciente (éxito/fallo) tras esta corrección. No marcar PASS sin un workflow exitoso.

## Reanudación exacta
1. Verificar HEAD actual `guest-independent` y si figura un commit de instalación V1. Si sí, leer `guest/catalog-assets/design-03/1.0.0/index.html` metadata SHA, los registros, y los runs de QA y Cloudflare. Si no, comprobar ejecución del workflow de instalación y su log; no volver a pedir ZIP ni reenviar blobs.
2. Si workflow bloqueado por permisos o disparo, el problema es **orquestación GitHub Actions**, no Limoneros. Resolverlo una vez de forma segura con los archivos y 39 objetos ya preservados, sin volver a enviar contenidos binarios.
3. Una vez instalado, ejecutar QA catálogo y smoke Cloudflare; preparar backend V18 exclusivamente TEST; probar el visor remoto Android y aprobación final una vez. Venta seguirá BLOQUEADA.
4. Para siguientes diseños, reutilizar el pipeline y el corte/verificación de blobs o preferir carga de máster al repositorio en una única operación; no repetir el trabajo de recepción/QA que ya esté hecho.

**Estado honesto:** recuperación binaria completa y automatización reproducible creada; integración final y CI todavía por comprobar.
