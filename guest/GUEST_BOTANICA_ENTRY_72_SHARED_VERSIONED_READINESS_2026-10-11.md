# GUEST — Entrada 72 · reconciliación de compatibilidad versionada
Fecha 11/10/2026. Rama exclusiva guest-independent.

## Causa y corrección
Los cinco sharedBlockers del contrato anterior estaban referidos literalmente a backend V12, cuestionario congelado V3 y Centro V4.6. Esos componentes **siguen congelados y no se han reparado ni reescrito**. Sus cinco valores `false` se conservan como `sharedBlockersLegacyV1`, sin falsificar la historia.

La puerta técnica actual comprueba: (1) backend Supabase Edge guest-invitation-flow ACTIVE V18 con Botánica TEST-only, (2) salida schemaVersion de V18, (3) persistencia de Story none en V18, (4) cuestionario común hospedado con modalidad solo fotografía, probado con navegador simulado y pedidos Cloud separados, y (5) Centro integrado V4.8 demostrado en Android físico y regreso confirmado. Evidencias permanentes: Entradas 51, 70 y 71. Ningún marcador afirma una única ejecución completa de UI→Cloud que no se haya realizado.

Se agregan fuentes individuales `sharedBlockerEvidence` y la admisión rechaza cualquier estado que carezca del archivo respaldatorio. Una mutación del test retira evidencia para comprobar que la puerta falla. Los 11 gates técnicos de Botánica siguen PASS.

## Qué NO implica
El nuevo estado puede superar el examen **técnico** `--admit botanica`, pero no habilita ventas, ni promueve `certification-pending`, ni configura precios, checkout, Stripe o un pedido pagado. Es una decisión posterior protegida por autorización expresa y QA comercial. La versión V4.9 para el motor genérico D03+ es una candidata aparte y **todavía no ha sido probada en el APK físico ni confirmada su publicación actualizada en Cloudflare**.

## Artefacto nuevo genérico V4.9
Existe copia independiente de V4.8, preservando Botánica y VEIL sin reescribirlos y agregando fallback al visor remoto de catálogo común. V4.9: **45.561.955 bytes**, SHA256 `4a163fbb556dbe363b6765107a0e6c99dcd4cdf5b44f2fd2755cc2f69b0eab5c`. Persistencia en Google Drive carpeta Weddly: `GUEST_MOBILE_CENTER_V4_9_GENERIC_TEST_NO_SALE_2026-10-11.html`, ID `1dRdOET4UwaaWJsUKGo_jn-5pkxY52sGh`. Master Botánica embebido sigue SHA `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`. Builder reproducible desde V4.8 guardado en `guest/tools/build_mobile_center_v49_from_v48.cjs`, QA fuente y mitigación de `about:blank` en visor compartido. No sustituir V4.8 que ya pasó Android.

## Próximo paso exacto
Verificar QA/paquete del HEAD actual, sincronizar nuevo visor común de GitHub con Cloudflare staging sin venta y probar puente remoto y V4.9 en móvil físico para una plantilla registrada nueva, **sin repetir las pruebas Botánica ya realizadas**. No crear pedidos adicionales ni tocar ONE, Partner, STUDIO, VEIL o main. Mantener checkout cerrado hasta permiso explícito. Biblioteca histórica v24 intacta.
