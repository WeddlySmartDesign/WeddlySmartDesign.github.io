# GUEST — Fase 6: paquete recuperado; PREVIEW pendiente de inicio de sesión

Fecha: 20/10/2026. Rama exclusiva: `guest-independent`.
Base comprobada antes del trabajo: `ae5d2518008171c06444b2a383e292f51a06ac11`.
**VENTA NO_GO. NO HAY DESPLIEGUE PREVIEW PUBLICADO POR ESTA FASE.**

## Fuentes leídas y estado
Se leyeron directamente de GitHub `guest/START_HERE.md`, fase 5 y fase 4, el empaquetador VEIL y el workflow de empaquetado.
HEAD tenía CI real satisfactoria: GUEST Independent QA `39415549594` y Catalog and Continuity QA `39415549478`.
No se repitieron las certificaciones Claude ni se modificaron originales.

## Recuperación real del paquete completo
El ZIP original fase 5 no apareció en dos búsquedas de archivos por nombre exacto y simplificado. No se asumió que el archivo estuviera disponible.
Se siguió el procedimiento documentado:
1. Descarga real del artifact GitHub Actions `12256198854`, run `39404436794`, 110 entradas, 212479038 bytes, SHA256 `ae91e6f567902c1c254a312c4106d897a7182daa31806826ff985f04421fa37b`: PASS contra metadatos GitHub.
2. Materialización del ZIP VEIL LIGHT guardado: `GUEST_VEIL_LIGHT_DELIVERY_PACKAGE_STAGING_2026-10-20.zip`, Library `libfile_d718d152c98c81919772809c69d6d11e`, 10.014.950 bytes, SHA256 `5d91e6643cb09f17d241379e103e8885044b1dc9ee4f2bb6697708bc3043566e`, 12 entradas.
3. Ejecución del `guest/tools/merge_veil_stage.cjs` canónico de HEAD contra una copia extraída del stage. El código verifica por sí mismo el HTML original y diez recursos. HTML VEIL derivado: `2d5041e3722000a0d307b3392c82ad1cad42df8ef8e329b4989662b33578f899`, idéntico al documentado en fase 5.
4. Verificación de **121/121 hashes y longitudes**, **16/16 rutas iframe con HTML y applyApi registrado**. Botánica conserva expresamente `BOTANICA_APPLY_CONFIG`; el resto tiene `GUEST_APPLY_CONFIG`.
5. ZIP reconstruido solo a partir de los 121 nombres del manifiesto + manifiesto, excluyendo archivos temporales ajenos a la lista. **122 entradas físicas**, máximo **24178059 bytes** por recurso. No se alteró el contenido de recursos de la copia verificada.

### Identidad exacta del ZIP recuperado
- Nombre: `GUEST_PREPRODUCTION_16_VERIFICADO.zip`
- Bytes: **223405228**
- SHA256: `0fd69d40d5ee85862a71ba7eb34bba188563d79f9b2d0a0022524dbb6009a1bb`
- SHA256 `GUEST_STAGE_MANIFEST.json`: `4b8c39645af44a63577f5dfa0cafc4583c2036b8a12db8af14b5871684fccaad`
- El contenedor ZIP se regeneró con metadatos normalizados y compresión DEFLATE nivel 6. **NO se afirma que su SHA coincida con el ZIP original fase 5** `e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`. Son fuentes verificadas y contenido manifestado completo, no recuperación byte a byte de aquel contenedor.
- Se preserva `PREPRODUCTION_DO_NOT_SELL`, `commercialApproved=false`, `productionPromotionForbidden=true`, noindex y D03 histórico archivado.
- Informe: [preview16_recovered_verification_2026-10-20.json](qa-reports/preview16_recovered_verification_2026-10-20.json).
- Manifiesto completo recuperado: [preview16_recovered_manifest_2026-10-20.json](qa-reports/preview16_recovered_manifest_2026-10-20.json).

## Cloudflare: lo observado, sin inferir resultados
Se abrió realmente el navegador autorizado en `https://dash.cloudflare.com`. El sitio mostró el formulario **Sign in to Cloudflare**, no una sesión autenticada.
Se abrió la solicitud segura `browserAuth` con los métodos que la página ofrecía. El resultado fue **declined**; no contenía motivo adicional. **No se conoce la causa ni se atribuye al usuario un error.**
No se leyó, pidió por chat, imprimió ni introdujo contraseña alguna.
Se respetó el cierre de la solicitud: sin repetirla ni usar otra vía de autenticación.
No se pudo entrar al proyecto `guest-weddlysmartdesign`, subir el ZIP ni obtener URL de PREVIEW.
**Producción y cobros permanecen sin modificar.** El único bloqueo para la carga inmediata en esta fase es completar el inicio de sesión autorizado; el flujo E2E posterior todavía no está ejecutado.

## Persistencia y ubicación local
El ZIP reconstruido existe en la sesión local:
`/workspace/scratch/4310437c84c7/GUEST_PREPRODUCTION_16_VERIFICADO.zip`.
Para carga con navegador sincronizado, corresponde a:
`/home/oai/share/4310437c84c7/GUEST_PREPRODUCTION_16_VERIFICADO.zip`.
No pedir a la propietaria descargarlo ni volver a subir diseños.

Se intentó guardarlo de forma persistente con el helper oficial de archivos. Falló antes de invocar escrituras, con **HTTP 403 en hosted apps tools/list**, tanto con el helper de la fuente de skill inicial como con el actual instalado. **No hay confirmación de ZIP guardado de forma persistente por esta fase.** No afirmar lo contrario. Los informes y el procedimiento se guardan en GitHub.
El artifact fuente de 15 entradas figura con caducidad `2026-10-23T09:58:05Z`; verificar disponibilidad si la sesión local se pierde. La copia VEIL original sí está guardada y su identidad consta arriba.

## Continuidad exacta
1. Solo si la propietaria pide reabrir el acceso tras la solicitud cerrada, volver a mostrar inicio de sesión seguro o el traspaso manual documentado cuando lo solicite. No pedir credenciales por chat. No confundir entrar en su navegador personal con iniciar sesión en el navegador remoto.
2. Una vez autenticado, seleccionar EXCLUSIVAMENTE `guest-weddlysmartdesign` → nuevo despliegue **PREVIEW**. No Production. Antes de carga, cotejar el SHA del ZIP recuperado anterior.
3. Subir el ZIP completo. Recoger la URL real; no sustituir producción ni activar cobros.
4. Descargar y comprobar por HTTPS los 121 recursos contra el manifiesto, 16 rutas iframe, medios, noindex y acceso anónimo denegado del flujo final. Esta fase NO es prueba visual ni Android.
5. Después, dos pedidos sintéticos reales en Stripe **TEST**, cuestionario, revisión/aprobación, correo enviado y recibido, entrega, acceso GUEST después de entrega y RSVP sí/no persistido, con sincronización. No usar clientes ni Stripe LIVE para simular.
6. Antes de venta, confirmar decisiones comerciales de titular: diseño elegido (D09 no sustituye a D03 sin comprobar identidad), aprobación de candidatos, precios y derechos. Mantener NO_GO hasta pruebas y autorizaciones.

## Resultado por flujo
| Flujo | Estado en esta fase |
| --- | --- |
| Recuperación de fuentes | PASS real |
| Integridad de stage y 16 renderizadores | PASS estático real |
| Inicio de sesión Cloudflare | NO COMPLETADO |
| Publicación PREVIEW | NO EJECUTADA |
| Cotejo HTTPS del nuevo paquete | NO EJECUTADO |
| Visual, Android físico y dos móviles | NO EJECUTADO |
| Compra Stripe TEST y webhook de nuevo catálogo | NO EJECUTADO |
| Revisión, correo nuevo, entrega y RSVP completo | NO EJECUTADO |
| Venta | NO_GO |

ONE, ONE Partner, STUDIO, diseños originales, backend, datos de clientes, configuración comercial y producción no fueron modificados.

## Preparación autónoma posterior al bloqueo de acceso — 20/10/2026
La propietaria informó de que tanto el acceso seguro como el control directo daban error y no podía entrar. Esto no permite identificar la causa técnica; no atribuirlo a contraseña, Cloudflare, móvil ni bloqueo antibot sin evidencia. No se han repetido intentos de inicio de sesión.

- ZIP local revalidado: SHA256 `0fd69d40d5ee85862a71ba7eb34bba188563d79f9b2d0a0022524dbb6009a1bb` correcto; comprobación CRC de las 122 entradas PASS; visor final, revisión y cuestionario presentes; `_headers` con `noindex, nofollow, noarchive`.
- Consulta REAL actual de cuentas Stripe: solo `WeddlySmartDesign`, `livemode=true`. No hay contexto TEST expuesto en la conexión actual. No se hizo ninguna llamada de cobro ni cambio de modo.
- Lectura del código de `guest/backend/guest-stripe-checkout/index.ts` en `7060d890`: Stripe usa `STRIPE_SECRET_KEY` y configuración `STRIPE_PUBLISHABLE_KEY` con respaldo de clave pública Live. No existe selector de modo TEST por petición. **La conexión solo Live no prueba qué clave privada tiene el backend**; ese valor no se inspeccionó. Antes del E2E debe acreditarse un entorno Stripe TEST aislado, sin sustituir claves compartidas con ONE ni activar venta.
- Preparado comprobador de solo lectura: [verify_guest_preview_manifest_2026_10_20.py](qa/verify_guest_preview_manifest_2026_10_20.py). Solo admite un subdominio PREVIEW de `guest-weddlysmartdesign.pages.dev`; rechaza producción, otros dominios, HTTP y parámetros/tokens. Verifica manifiesto remoto, 121 SHA256/longitudes, encabezado noindex y 16 rutas iframe. Sin escrituras, cookies ni pagos. Sintaxis y guardas offline PASS; **NO ejecutado contra PREVIEW porque no existe URL desplegada por esta fase**.
- Preparada [matriz de pruebas reales](GUEST_PREVIEW_E2E_MATRIX_2026-10-20.md). Sus estados pendientes no se convierten en PASS por disponer del script.
- El cierre posible sin acceso en este punto es preparación de verificación y documentación. Siguen pendientes la publicación autorizada, la acreditación de Stripe TEST, las pruebas E2E reales y las autorizaciones comerciales. Guardado persistente del ZIP continúa sin confirmar como se documentó arriba.
