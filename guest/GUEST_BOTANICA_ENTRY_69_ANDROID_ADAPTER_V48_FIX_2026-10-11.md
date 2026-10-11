# GUEST — Entrada 69: fallo real Android V4.7 `adapter_not_found` y candidata V4.8 corregida

**Fecha:** 11/10/2026. **Rama:** `guest-independent`. **Estado:** 10/11 PASS, último gate `renderer` Android aún PENDING, **NO-GO comercial**. No marcar como terminada la aceptación Android sin evidencia posterior.

## 1. Error real observado
La propietaria importó V4.7 integrada en el APK Android y envió captura `1000095303.jpg`: pantalla `GUEST · BOTÁNICA · SOLO PRUEBA`, error rojo literal **«No se ha podido visualizar Botánica: adapter_not_found»**, barra de Android superpuesta a cabecera y botón «CENTRO GUEST» duplicado en el fondo. **Es un error real del producto; no atribuirlo al chat ni al móvil**. No insertar la captura personal en repositorio público.

## 2. Causa de código localizada y alcance de inferencia
Se inspeccionó el **HTML oficial V4.7 real de 45.557.384 bytes** extraído de Biblioteca. El engine hacía:
1. Registrar listener `load` **con `{once:true}`**.
2. Insertar `iframe` inicialmente **vacío** mediante `host.replaceChildren(iframe)`.
3. **Solo después** asignar `iframe.srcdoc=text()`.

Esto permite que un primer `load` del documento vacío `about:blank` consuma el listener antes del documento Botánica; el adaptador no existe aún y se muestra exactamente `adapter_not_found`. El orden y la carrera son hechos verificables del código. **No hay traza interna de Android que pruebe inequívocamente que ese primer evento, y no un segundo fallo de ejecución del script, fue el que causó la captura**: tratarlo como diagnóstico causal fundamentado, pendiente de corroboración funcional en V4.8.

El TEST anterior de VM **no simulaba la primera carga vacía**, por eso dio verde. El fallo reveló una carencia real de QA; no debe repetirse.

## 3. Corrección aislada V4.8 (sin editar ningún FROZEN)
- **Base exacta:** `GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_INTEGRATED_2026-10-11.html`, 45.557.384 bytes, SHA256 `3ce9f5fa97a623c0b358336d11bbcd58db586a4e60c34e93b24abcc44e1c0484`.
- **Nuevo archivo independiente:** `GUEST_MOBILE_CENTER_V4_8_BOTANICA_ANDROID_RENDERER_FIXED_2026-10-11.html`, **45.558.028 bytes**, SHA256 **`5a35f482bce23684496a227f3e9161093a9ef93dd6c9d9fc99dfc41ec7b56835`**.
- El master Botánica embebido, extraído y recalculado a partir del HTML real V4.8, conserva SHA256 **`fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`** de 11.635.635 bytes. Nunca se editó el máster ni V4.6/V4.7.
- **Fix:** asignar `iframe.srcdoc` **antes** de adjuntarlo al DOM; no usar listener `load` de una sola vez; ignorar activación mientras el documento no tiene `#invitation`; conservar control de generación y `structuredClone(config)`; fallo visible después de 45 segundos si no termina. Se mantienen bloqueados pedidos Botánica de producción y versiones distintas de 14.7.
- **Otros dos defectos de captura:** cabecera del preview separada 30 px de la barra del sistema (86 px alto total); botón de regreso subyacente oculto mientras Botánica está activa, manteniendo botón superior y retorno legítimo al Centro.
- **Builder reproducible con PIN:** `guest/tools/build_mobile_center_v48_from_v47.py`. Rechaza bytes/hashes de V4.7 distintos, múltiples anclajes, reescritura de salida existente y cambio de SHA de master. Permite reconstruir sin tocar original.
- Regresión permanente nueva: `guest/tests/mobile_center_v48_boot_order_regression.py` y referencia añadida a `.github/workflows/guest-botanica-contract-qa.yml`. Primer commit fuente/tests: `6b652edac2d753a902b16b1317592e311e379c90`.

## 4. Verificaciones y límites
- Se ejecutó **sobre el HTML binario real V4.8**, no sobre código inventado: hash del archivo y del master exactos; script `node --check` PASS.
- Harness VM aislado sobre el engine extraído del archivo de 45 MB: PASS dos configuraciones TEST distintas `shared/split`, `srcdoc` preinstalado, evento de `load` vacío ignorado, evento real posterior configura diseño, eliminación del iframe anterior y rechazo de retorno tardío, copia aislada de datos, retorno a Centro/reapertura, rechazo producción y versión errónea. **No equivalen a prueba física Android ni Cloud comercial**.
- **GitHub**: comprobar siempre último estado de [QA catálogo V4.8 38166778122](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38166778122) y [QA Independiente V4.8 38166778099](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38166778099); la constatación de QA previa en HEAD Entrada 68 era verde, el CI nuevo está sujeto a lectura posterior.
- Esta sesión no tiene acceso a WebView Android físico: **el último criterio renderer no se promociona**. No hay demostración de que V4.8 resuelva todos los errores de ejecución propios de la WebView hasta verla funcionar realmente.

## 5. Custodia persistente y límite de Biblioteca resuelto sin costes
El intento de añadir un HTML nuevo de 45 MB en Biblioteca personal devolvió **`library_storage_limit_exceeded`**. **No se borró ningún archivo ni se reintentó sobrescribir la bitácora histórica v24**.

Se guardó una copia nueva de V4.8 en la conexión **Google Drive/Weddly**, sin nuevos costes y sin borrar contenido:
[**V4.8 Android en Google Drive**](https://drive.google.com/file/d/14UMLniCMMJJvtawWffRDWOm0nNrNe2Kw/view?usp=drivesdk).
Metadatos posteriores del fichero **verificados**: ID `14UMLniCMMJJvtawWffRDWOm0nNrNe2Kw`, nombre exacto y **45.558.028 bytes**. El hash SHA del artefacto se calculó antes de subirlo; Drive confirmó tamaño y existencia (no prueba byte-a-byte posterior de descarga). Copia entregada también en chat, con enlace temporal no válido como fuente futura. El builder y esta documentación están en GitHub.

## 6. Única acción operativa pendiente
**Solo actualizar el Centro:** descargar V4.8 de Drive o enlace verificado del chat → abrir APK GUEST Mobile Center instalado → menú **Actualizar centro** → importar V4.8 → usar un pedido **Botánica TEST ya entregado** → pulsar **Ver invitación** → volver con **CENTRO GUEST**. No crear pedidos, no repetir RSVP, no medir de nuevo los 41 s, no configurar Supabase ni iniciar diseño 03. Ante error, guardar texto/captura sin códigos privados y corregir exclusivamente la causa. Si esta prueba física pasa, contrastar CI, ejecutar gate renderer y solo después evaluar 11/11; **habilitar venta/Stripe requiere autorización comercial independiente**.

**No tocar ONE, ONE Partner, STUDIO, VEIL LIGHT, main, master visual Botánica, checkout, licencias ni pedidos existentes.**
