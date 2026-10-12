# Entrada 80 — Integración repetible de diseños GUEST (12/10/2026)

## Problema operativo
D03 Limoneros entregado ya diseñado. Su máster V1 y QA local están recuperados (Entrada 79), pero la publicación quedó detenida durante transferencia Git blobs. No repetir diseño ni exigir reenvíos.

## Punto técnico comunicado en el chat anterior
El usuario identifica integración de blobs **014–019** y referencia inválida del **bloque 036**. Esta información describe el checkpoint de trabajo, pero los SHA de los blobs aún requieren comprobación directa antes de cualquier árbol o commit. No afirmar integración realizada.

## Protocolo obligatorio D03 y D04+
1. Recuperar el paquete ya almacenado en Biblioteca; fijar SHA256 del máster y conservarlo inmutable.
2. Inspeccionar el formato canónico de publicación de diseños en guest-independent. Resolver una vez la transferencia de archivos grandes, con verificación de SHA y referencias existentes; no reconstruir assets ni repetir subidas completadas.
3. Crear commit únicamente cuando el árbol contenga todos los fragmentos correctos y se pueda reconstituir el máster exacto; nunca actualizar refs con SHA no comprobado.
4. Registrar D03 como TEST/no-sale, ejecutar únicamente pruebas de integración y regresión relevantes; no reabrir Botánica ni plataforma.
5. Documentar automáticamente cada avance significativo: archivos/SHAs/commit, pruebas, errores, solución y siguiente operación exacta. Actualizar START_HERE y STATUS tras cada checkpoint recuperable.
6. Preparar un script/runbook de publicación idempotente para D04+; objetivo: recibir diseño ya hecho, validar, integrar, comprobar y solicitar una única revisión móvil.

## Restricciones
No tocar ONE, ONE Partner, STUDIO, VEIL LIGHT, Botánica ni main. Sin habilitar ventas antes de gates comerciales. La usuaria no debe programar ni resolver transferencia.

## Estado al crear esta entrada
**D03 V1 recuperado y verificado localmente; blobs 014–019 y bloque 036 pendientes de comprobación de identidad y enlace; integración GitHub/Cloudflare/Android NO certificada.**
