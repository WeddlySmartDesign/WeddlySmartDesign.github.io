# GUEST by WeddlySmartDesign · D02 Botánica — Cierre técnico local y puerta de certificación

**Fecha:** 09/10/2026  ·  **Rama:** `guest-independent`  ·  **Estado:** **CANDIDATA TÉCNICA; NO COMERCIALMENTE CERTIFICADA NI PUBLICADA.**

Este documento es **autónomo** y complementa `guest/GUEST_D02_BOTANICA_READ_FIRST.md`. No depende de que se conserve ningún chat.

## 1. Versiones y protección de lo aprobado

| Componente | Archivo y ubicación persistente | SHA-256 | Estado |
|---|---|---|---|
| Invitación visual | `/GUEST by WeddlySmartDesign/BOTANICA/Checkpoints/GUEST_D02_BOTANICA_ATELIER_V14_FROZEN_2026-10-09.html` | `27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39` | **APROBADA / INMUTABLE** |
| Invitación técnica | `/GUEST by WeddlySmartDesign/BOTANICA/Candidatas/GUEST_D02_BOTANICA_ATELIER_V14_7_PHOTO_ONLY_VISUAL_QA_CANDIDATE_2026-10-09.html` | `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a` | **Candidata D02, no comercial** |
| Cuestionario corregido de preproducción | `GUEST_QUESTIONNAIRE_COMUN_V3_SOLO_FOTO_REGALO_INTEGRADO_QA_2026-10-09.html` | `19b4c0764add067c13977677b9e87ced2e70c1736e7679a5f90bc5d8723229af` | **Copia independiente, NO publicar** |
| Mobile Center con cuestionario de preproducción | `GUEST_MOBILE_CENTER_V4_6_SOLO_FOTO_REGALO_INTEGRADO_CANDIDATA_NO_PUBLICAR_2026-10-09.html` | `0832f4fac4ae51f5a3e305a0d06284a3ff4bb1a121ece4a4e8b01e5368605c7a` | **Copia independiente, NO publicar** |

El Mobile Center comercial V4.6 permanece inalterado con SHA-256 `a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133`. La copia candidata difiere **únicamente** en la cadena base64 del cuestionario incrustado; está verificado que, al reponer esa cadena, el HTML es byte por byte idéntico al V4.6 congelado. La invitación V14 tampoco se ha tocado.

## 2. Dos pedidos completos de interfaz SIMULADOS — PASAN

Se han ejecutado localmente en Chromium, con el **cuestionario común real candidato** y sus siete pasos hasta la pantalla de envío. Peticiones `load`, `save`, `upload` y `submit` se interceptan con un *mock* en memoria. No existen cuentas, tokens, envíos ni datos de clientes reales.

- **Caso 1: Eva y Nico** (datos sintéticos): una sola ubicación; Historia únicamente fotográfica (`textMode:'none'`), sin agenda ni elementos prácticos ni galería. Se sube una foto ficticia, pasa la validación, se envía el formulario simulado y la V14.7 muestra el interludio fotográfico sin capítulo de texto vacío.
- **Caso 2: Alejandra María y Sebastián** (datos sintéticos): dos ubicaciones; Historia con texto personalizado; código de vestimenta; agenda, bus, hotel, regalo y playlist; galería con archivo ficticio. Se envía el formulario simulado y V14.7 incorpora los datos correspondientes sin errores de JavaScript ni desbordamiento horizontal.

**Resultado:** 2/2 envíos simulados y 2/2 aplicaciones de configuración a V14.7: PASS. Fuente reproducible `botanica_two_orders_simulated_E2E.py`, artefactos `BOTANICA_TWO_SYNTHETIC_ORDERS_REPORT.json`, `BOTANICA_D02_DOS_PEDIDOS_SIMULADOS_QA_LOG_2026-10-09.txt` y dos capturas. **NO equivale a dos pedidos reales, firma de fotos ni QA E2E de Supabase.** Los valores visuales de fotos en el renderizador son SVG ficticios; la prueba no mide tiempos reales de subida.

## 3. Incidencia adicional de formulario descubierta y corregida

El formulario V3 llamaba `renderGiftFields()` durante eventos `input` y `change` de cualquier campo, reconstruyendo el área de regalo con `innerHTML` en medio de una edición. Un pedido simulado complejo produjo el error JS: “Failed to set the 'innerHTML' property on 'Element' ... moved in a 'blur' event handler”.

La copia de preproducción introduce una guarda: **reconstruir campos de regalo solo cuando `giftMode` realmente cambia**. Además fusiona el caché de valores por modalidad, para que al ir de «cuenta bancaria» a «texto» y volver se conserven los datos ya escritos. Probado localmente: cambio banco → texto → banco → texto con los valores intactos, sin errores; 2/2 pedidos completos simulados PASAN; 3/3 regresiones de Historia (`preset`, `custom`, `none` rehidratado) PASAN. **Estas modificaciones no se han llevado a la versión congelada ni al backend real.**

## 4. DOS BLOQUEOS FUNCIONALES ADICIONALES, CONFIRMADOS EN CÓDIGO

1. El backend desplegado `guest-invitation-flow` v12 solo registra `veil-light`. Supabase conservaba el digest `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`, y los intentos previos de habilitar Botánica test-only fueron bloqueados por el entorno. **No desplegar desde una ruta alternativa para sortear controles.** En la Edge Function v12, `story.textMode:'none'` se convierte a `preset`; una prueba pura aislada compara 128 configuraciones con una corrección propuesta y únicamente cambian los 32 casos `none`. Eso es evidencia de código, NO validación de integración desplegada.
2. **Mobile Center V4.6 solo tiene un renderizador registrado:** `const CATALOG_RENDERERS={'veil-light':...}`. Por tanto, aunque Supabase aceptase un pedido Botánica, la vista de invitación de ese Mobile Center lanzaría `template_renderer_unavailable:botanica`. **Sustituir únicamente el cuestionario embebido NO resuelve la integración del nuevo diseño.** El trabajo autorizado pendiente debe añadir la selección de renderizador/visualización Botánica al catálogo sin alterar el V4.6 congelado, y certificar también que el cambio no afecta a VEIL LIGHT. No improvisar la inclusión de 11 MB de medios en el Mobile Center como solución comercial sin evaluar rendimiento y arquitectura de catálogo.

## 5. Condiciones de cierre TOTAL (NO CUMPLIDAS TODAVÍA)

1. Entorno **autorizado** para activar exclusivamente pedidos `mode='test'` de Botánica, con guarda de rechazo `template_test_only` en todas las rutas de creación, incluidos pagos; no activar Stripe ni venta pública.
2. Ajuste común y probado de cuestionario ↔ validador ↔ backend para `story.textMode='none'`, exigiendo una foto verdadera y manteniendo las modalidades `preset` y `custom`. Comprobar regresión VEIL LIGHT.
3. Un nuevo Mobile Center/catálogo de preproducción que resuelva `botanica` con su renderer sin modificar las versiones congeladas, manteniendo la misma operativa móvil.
4. Crear **dos pedidos E2E reales de prueba**, distintos, desde un único cuestionario sin editar plantilla entre pedidos. Comprobar cargas reales, imágenes firmadas, preview/review/final, URL final estable, contextos `rt,g/u,lang`, envío simulado y persistencia de RSVP en el motor **existente**, nunca en un RSVP paralelo. Sin correos ni datos de clientes reales durante QA.
5. Validación final en Android y medición de intervención de gestión ≤5 minutos. **Solo tras todas las evidencias** registrar `scalabilityCertified:true`, `operationalPilotPass:true` y `commercially-frozen`. Publicación y cobro requieren autorización separada.

## 6. Cómo retomar SIN ESTE CHAT

1. Abrir `guest/GUEST_CANONICAL_MASTER_DO_NOT_DRIFT_2026-10-07.md`, luego `guest/GUEST_D02_BOTANICA_READ_FIRST.md`, este documento y el manifiesto V3.
2. Verificar SHA-256 de todas las versiones antes de usarlas. Los archivos congelados se leen, **nunca** se sobreescriben.
3. Ejecutar localmente la prueba `botanica_two_orders_simulated_E2E.py` y el control de regresión de formulario antes de cualquier integración.
4. Si no hay posibilidad autorizada de desplegar y ejecutar pruebas reales, **detener el gate E2E**. No confundir simulación con pedido real ni afirmar «100 % terminado».

**Resumen de certificación hoy:** diseño visual V14 aprobado; renderizador V14.7 QA local aprobado para los casos probados; formulario y Mobile Center corregidos en copias aisladas; **integración real, propietario Android y certificación comercial NO APROBADOS**. ONE, Partner, STUDIO y VEIL LIGHT intactos.