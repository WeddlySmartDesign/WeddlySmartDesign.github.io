# GUEST — Entrada 79 · Limoneros V1 REAL recuperado desde Biblioteca (12/10/2026)

**CORRECCIÓN PRIORITARIA A ENTRADA 78:** se encontró y verificó el archivo real previamente creado. No pedir de nuevo ZIP ni reconstruir el máster. La búsqueda previa no había encontrado la subcarpeta de Biblioteca; la propietaria facilitó un vídeo del trabajo anterior que motivó examinar la lista integral de Biblioteca.

## Fuente recuperada (persistente, preexistente)
- Directorio Library: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/`.
- Original preexistente: `GUEST_D03_LIMONEROS_MASTER_V1_TEST_NO_SALE.zip`; fecha de creación registrada en Biblioteca: 2026-10-11 21:55:27 UTC; 24.903.943 bytes.
- SHA256 ZIP comprobado: `001ea39f5f47475102547777e34935f1732a6f8dcc0b46e5bbfba87fb3520f96`.
- ZIP íntegro, CRC de seis entradas PASS. Contiene: `master.html`, `visual-plugin.json`, `README_CANDIDATE.md`, `GUEST_D03_LIMONEROS_CANDIDATE_EVIDENCE.json`, `QA_mobile_390.png`, `QA_cover_end.png`.
- `master.html`: 28.673.474 bytes; SHA256 **`a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482`**. Coincide exactamente con `assetSha256` y `assetBytes` del expediente V1 recuperado.
- ID `design-03`, versión `1.0.0`, nombre `LIMONEROS`, `rendererApi=GUEST_APPLY_CONFIG`. Contrato `guest-invitation-config-v1`. `master.html` autónomo con vídeos incrustados (portada/cierre), cinco fondos intermedios y fallback de cuatro fondos.
- `guest_transfer_test.txt` (30.020 bytes) se conserva en mismo directorio, evidencia de prueba de transferencia anterior, no es máster ni sustituto.

## Pruebas realmente documentadas en el ZIP recuperado
- Informe del paquete: `LOCAL_CHROMIUM_HEADLESS_PASS_SUBSET`. Chromium con `set_content` porque `file://` y localhost bloqueados en aquel entorno.
- Viewports 320, 360, 390 y 430 px por 844 de alto, sin scroll horizontal ni errores JS **según pruebas registradas**; variantes con 4/5 intermedias, 1 sede, story none, sin extras y 5 momentos.
- Existen dos capturas QA en el propio ZIP, incluida tira completa `QA_mobile_390.png` y `QA_cover_end.png`.
- Comprobación independiente en recuperación: parser HTML detecta 2 `<video>`, 1 script principal, 13 referencias `data:image/`, 2 referencias `data:video/`; `node --check` sobre JS principal **PASS**; se encuentra `window.GUEST_APPLY_CONFIG` y rama Story none. No confundir sintaxis con ejecución Android real.

## Qué NO estaba hecho, conforme al README V1
- No estaba registrado el máster en GitHub ni desplegado Cloudflare. No QA CI del código D03. Tampoco backend TEST V18 extendido a D03, visor Android remoto D03 o prueba E2E real. Venta NO autorizada.
- La transferencia mediante blobs/chunks aparece en vídeo como trabajo EN CURSO (no prueba de commit completo). El HEAD de la rama antes del rescate no incluía D03.

## Punto exacto para continuar, SIN rehacer diseño ni plataforma
1. Usar el ZIP **ya existente** como fuente byte-exacta; no pedir recursos originales a la propietaria. No reconstruir HTML ni reinsertar vídeos/fondos ni rehacer QA ya documentada.
2. Resolver solamente transferencia/publicación técnica del máster 28,7 MB a la estructura común de chunks/manifest en `guest-independent`. La dificultad anterior ocurrió durante intentos de blobs/lotes para GitHub.
3. Registrar V1 `certification-pending`, TEST-only, hash del original intacto; Cloudflare autodeploy Git, CI y backend TEST controlado. En ningún caso rediseñar.
4. Validar visor genérico Android en una sola aceptación visual y los gates pendientes, después congelar máster. No tocar ONE, ONE Partner, STUDIO, VEIL, Botánica, `main`; no venta ni cobro.

**Conclusión:** candidata técnica local verdadera, con contenido y pruebas recuperados y verificables. No certificada ni publicada.
