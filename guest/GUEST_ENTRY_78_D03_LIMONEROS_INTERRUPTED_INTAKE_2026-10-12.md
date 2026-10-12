# GUEST — Entrada 78 · Limoneros D03: interrupción y estado comprobado
Fecha: 12/10/2026. Rama: `guest-independent`. Continuidad documental, SIN cambio de código/productos, sin autorización de venta.

## Evidencia de la conversación de diseño (11/10/2026)
- La propietaria entregó los medios y recursos del diseño 03 **Limoneros**: `portada.mp4`, `cierre.mp4`, `jardin-limoneros-codigo.zip` y `jardin-limoneros-fondos-y-videos.zip`; además mostró capturas y tira completa.
- Definición pendiente de ensamblar: **portada en vídeo → historia → lugares → agenda → información práctica → galería → cierre en vídeo**, con **cinco fondos intermedios**. Para ello se prefieren los cinco fondos si están en el ZIP adjunto; la usuaria había preparado también la secuencia de cuatro fondos. El RSVP pertenece al cierre. La decisión no implica rediseñar la propuesta.
- En la última respuesta del chat anterior, el asistente informó de una **primera construcción local** con vídeos, cinco fondos y adaptador del cuestionario común, e indicó que estaban en curso pruebas de navegador. Esa información es un **reporte anterior**, NO un artefacto verificable ni QA aprobado.

## Comprobación actual al recuperar la continuidad
- `guest/START_HERE.md` sigue encabezado por Entrada 77, que describe la plataforma lista pero sin nuevo diseño registrado.
- `guest/GUEST_PROJECT_STATUS_V1.json` tenía `design-03.status = not-started`; se considera **desactualizado para recepción de recursos**, pero correcto en el sentido estricto de **no registrado / no certificado**.
- En el HEAD observado `4d120f16a09a9f7cfa86d7b97ac56d347d679bcf` no constaba ninguna incorporación de D03 en el código; tampoco se encontró archivo Entrada 78 anterior.
- La búsqueda en el Google Drive conectado de "limoneros", "GUEST_D03" y "jardin-limoneros" no devolvió una copia identificable. Las búsquedas de Library tampoco localizaron esos ZIP. Los adjuntos del chat anterior y el supuesto borrador local no están montados en el contenedor de la conversación actual. **Esto no demuestra pérdida definitiva**: limita la capacidad de validar o continuar con esos bytes en esta sesión.
- No se ha demostrado visualmente en Android ni incorporado a Cloudflare/Supabase el diseño 03; no hay evidencia de pruebas de CI específicas de Limoneros. Venta bloqueada.

## Punto exacto para continuar, sin repetir trabajo ya cerrado
1. **Recuperar los bytes originales** del ZIP de código y del ZIP de fondos/vídeos (preferir el adjunto original ya enviado; si la nueva conversación no puede acceder a él, pedir que se adjunten de nuevo esos mismos ZIP, sin nuevos trabajos de diseño). No dar por existente ni reutilizar un HTML local que no se pueda verificar.
2. Inspeccionar ZIP, archivos, medidas y consistencia con la tira visual; fijar secuencia de **cinco** pantallas intermedias y comprobar vídeo portada/cierre. Respetar diseño de la propietaria y no recrear recursos a ojo.
3. Construir/migrar exclusivamente D03 al plugin visual canónico; generar HTML + assets + `visual-plugin.json`, adaptar `window.GUEST_APPLY_CONFIG(config)`, registrar ID/version `certification-pending` `testOnly` con hash.
4. Ejecutar pruebas locales y CI, autodeploy Cloudflare TEST con bloqueo NO-SALE; preparar incorporación controlada en catálogo Supabase V18 solo después de registrar D03 (según Entrada 77), sin tocar sistema de cobros.
5. Una única aceptación móvil real del nuevo diseño y visor remoto genérico + V5.0 candidata; después congelar visual aprobado y documentar QA/resultado. No repetir Botánica ni reabrir plataforma.

## Límites absolutos
- No tocar ONE, ONE Partner, STUDIO, VEIL LIGHT, Botánica ni `main`.
- No ventas, Stripe, correos de compra ni permisos comerciales.
- La usuaria no debe programar ni montar infraestructura. Su participación es aportar/recuperar recursos originales si no están accesibles y revisar al final en Android.
- **Estado verdadero a 12/10/2026:** diseño recibido en chat anterior, primera versión local **declarada pero no recuperada**, integración y certificación **NO verificadas**, documentación de recuperación creada ahora.
