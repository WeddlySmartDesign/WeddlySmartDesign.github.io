# GUEST — Fase 8 · fuente de despliegue persistente y validación previa

Fecha: 20/10/2026. Rama **`guest-independent`**. Este registro continúa [fase 7](GUEST_AUDIT_CONTINUITY_PHASE7_PREVIEW_VERIFIER_2026-10-20.md). **NO_GO comercial**. No requiere intervención de la propietaria hasta una sesión autorizada de Cloudflare, después de su jornada.

## Resultado NUEVO y verificable: paquete preservado en Biblioteca
Se ha confirmado en el contenedor el paquete físico previamente creado de fase 5 y se ha guardado **correctamente en la Biblioteca persistente**, superando el bloqueo anterior de backup.

- **Ruta Library confirmada:** `/GUEST by WeddlySmartDesign/GUEST_PREPRODUCTION_16_VERIFICADO_2026-10-20.zip`
- Library file ID confirmado: `libfile_d8a6d57dbb648191a58db59b1c2b74fc`. Estado de operación de Library: `upload: succeeded`.
- Archivo físico guardado: `GUEST_PREPRODUCTION_16_VERIFICADO.zip`; tamaño **223596068 bytes**, SHA256 **`e09ad244e617c4d423a6591425ad407bdd04f9a0f0a4d0b9bf26d6a3595f6216`**; hash recalculado EN ESTA FASE directamente sobre el fichero.
- ZIP original: **122 entradas físicas, 121 hashes SHA256/tamaño PASS reales, CRC ZIP PASS**, manifiesto `GUEST_STAGE_MANIFEST.json` SHA256 `ba0e5928a601b42df93c62e0315ceb3b6b23bd4b9bf49b44527e89da7349b05c`, 16 renderizadores, estado `PREPRODUCTION_DO_NOT_SELL`.
- **Muy importante:** la fase 6 regeneró un ZIP con los **mismos 121 recursos** pero orden/metadatos ZIP diferentes, hash `0fd69d40d5ee85862a71ba7eb34bba188563d79f9b2d0a0022524dbb6009a1bb` y manifiesto SHA `4b8c39645af44a63577f5dfa0cafc4583c2036b8a12db8af14b5871684fccaad`. Se compararon los 121 triples ordenados `name:size:sha256` entre Library ZIP de fase 5 y manifiesto recuperado en fase 6: coincidencia de huella de conjunto **FNV32 `64cc237d`** y comprobación puntual de archivos críticos (VEIL, Botánica, registro). Esta huella es un índice auxiliar, **NO es prueba criptográfica de igualdad global entre archivos externos**; la prueba criptográfica íntegra es cada archivo de la ZIP local contra su propio manifiesto, 121/121. No afirmar que los contenedores ZIP son el mismo fichero.
- No se reescribió ni tocó el máster artístico; la Biblioteca contiene el **paquete físico subible** sin necesidad de recuperar los artifacts de GitHub que pueden caducar. **NO pedir a la propietaria reenviar diseños**.

## Validación repetible antes de subir a Cloudflare
Nuevo verificador **`guest/qa/verify_guest_upload_zip.py`**, fail-closed:
- Entradas: `--zip` del paquete de Biblioteca, `--manifest guest/qa-reports/preview16_recovered_manifest_2026-10-20.json`, opcional `--report`.
- Rechaza toda ZIP que no tenga uno de los dos SHA256 de fichero previamente verificados, cualquier fichero extra o ausente, cualquier diferencia de manifiesto en nombres, tamaños y hashes, y cualquier recurso cuyo SHA256 real no coincida. Verifica 121 recursos en streaming, registro 16/16, D03 NO vendible, portada noindex sin checkout y reglas `_headers` exactas.
- Su modo `--fixture-only` y pruebas negativas `guest/tests/upload_zip_verifier_security.test.py` se han integrado en CI GUEST. La ejecución contra un ZIP real requiere disponer de ese archivo en el entorno autorizado; en este turno se revalidó directamente el paquete local 121/121 con un procedimiento independiente.
- Posteriormente `guest/qa/verify_guest_preview_manifest_2026_10_20.py` verifica **120 recursos HTTP** en Cloudflare PREVIEW + cabeceras noindex, los 16 iframe y la configuración `_headers` fijada. Nunca se debe decir que `_headers` se descargó por HTTP.

## Primer paso real CUANDO se resuelva Work en móvil
1. Iniciar sesión en el navegador autorizado **solo para el proyecto Cloudflare `guest-weddlysmartdesign`**, sin compartir contraseñas ni repetir intentos fallidos. La propietaria pospuso esta acción por fallo del teclado de Work.
2. Desde el entorno autorizado, **recuperar el ZIP ya guardado en Biblioteca**, cotejar SHA256 exacto `e09ad...`, ejecutar script local; no reconstruir diseños ni pedir archivos de nuevo.
3. Publicar en **PREVIEW**, NUNCA en Production ni modificar One, STUDIO, ramas principales ni backend; obtener URL real Cloudflare.
4. Ejecutar verificador HTTPS, inspeccionar visualmente y registrar defectos/soluciones. Solo después se podrá preparar un **entorno Stripe TEST aislado** (sin sustituir claves Live ni modificar ONE) y ejecutar **dos pruebas de compra con envío de correos reales a un destinatario TEST autorizado**, entrega, acceso de gestión y RSVP sí/no y revisión en dos móviles. En Edge Function, `order.mode='test'` simula correo y NO vale como evidencia de Resend entregado.
5. Agrupar al final las decisiones de la titular que sí son indelegables: identidad visual correcta de D09, precios por diseño, derechos musicales/tipografías/medios, documentación de venta y autorización comercial. **No activar ventas por QA offline.**

## Límites confirmados de este turno
- **Cloudflare PREVIEW NO publicada** por ausencia de sesión autorizada y por decisión explícita de posponerla; no hay URL PREVIEW real del ZIP completo.
- Prueba Chromium local del ZIP con navegador del contenedor **bloqueada por `net::ERR_BLOCKED_BY_ADMINISTRATOR`**; coincidente con fase 5; no se clasifica como defecto de diseño ni prueba visual PASS. Se usa como única fuente objetiva de QA visual offline las pruebas CI de los diseños que ya superaron GitHub Actions, no un navegador imposible.
- No hubo pagos, correos nuevos, cambios en Stripe/Supabase/Resend/Cloudflare ni datos reales. Producción intacta. **Venta sigue NO_GO**.

El objetivo de esta fase es que el último gran bloqueo material —la caducidad del paquete binario— quede resuelto de modo persistente. Sin nueva autenticación no se puede certificar ni publicar, pero todo el trabajo offline y su prueba de integridad están conservados.
