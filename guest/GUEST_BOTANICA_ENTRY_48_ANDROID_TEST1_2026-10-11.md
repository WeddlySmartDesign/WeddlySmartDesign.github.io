# GUEST / Botánica — Entrada 48 · primera inspección Android real de entrega TEST

**Fecha:** 11/10/2026. Fuente: captura y vídeo de 12,3 s aportados por la propietaria en el chat, Android. **Esta evidencia NO es una prueba automatizada ni certifica el diseño completo.** Proteger archivos y no publicar grabación o tokens en el repositorio.

## Hechos observados directamente en captura y vídeo

- Abre la **URL final Cloudflare** de una invitación Botánica desde la recuperación privada. Carga el visual del master V14.7 con las flores, tipografía serif y secciones. Aparece la banda `VISTA DE PRUEBA · NO ENVIAR A INVITADOS`.
- La portada muestra **«QA Botánica y Una sede»**, fecha **12/06/2027** y el usuario puede desplazarse desde portada/cuenta atrás, historia, sede hasta el cierre.
- La historia muestra **«Historia ajustada tras la revisión de prueba»**. En el bloque de localización figura **«CEREMONIA Y CELEBRACIÓN · Lugar ficticio · 17:00»**, escenario **`locations.mode=shared`**, NO el escenario `split`/dos sedes. **Aunque la propietaria llame a este enlace «Test 1», la página corresponde a la variante de una sede y revisión**, probablemente por ordenar por entrega reciente. No marcar el ensayo de dos sedes como revisado todavía.
- El cierre enseña la llamada **«¿Nos acompañáis?»**, botón visible **«Confirmar asistencia»**, nombres y agradecimiento. **El vídeo no muestra pulsación del botón**, ni confirmación RSVP, almacenamiento o gestión. En el último tramo se aprecia una franja de fondo claro debajo del diseño de cierre, cuya causa y valoración visual quedan pendientes de comparación con el segundo escenario. No modificar el master congelado sobre esta observación aislada.
- Portada, titulares y bloques principales se ven legibles y **sin cortes evidentes** en este móvil concreto. No se han probado enlaces, formularios, estados de accesibilidad, diferencias de navegador, certificados de medios de tamaño real, sonido o continuidad de todas las animaciones.

## Limitación crítica del RSVP (confirmado desde código de plataforma)

En `guest/guest-catalog-delivery-runtime-v1.js`, `rsvpUrl()` devuelve literalmente `'#'` cuando la URL final no tiene el contexto de destinatario `rt`. Los dos pedidos `create_test` entregan solamente enlace final `...?p=`; no tienen licencia vinculada ni `rt/g/u`. **Por ello, aunque el botón se vea en el visual, los enlaces TEST actuales NO son válidos para acreditar el flujo de RSVP o guardado de respuestas.** No se debe pedir pulsar o evaluar ese botón hasta existir un enlace legítimo de destinatario/persona o unidad con token y acceso de gestión, sin reutilizar capacidades ni simular resultados con SQL.

## Estado y siguientes pasos

- **Parcialmente verificado en Android físico:** carga y desplazamiento de la **variante una sede**, se lee el cambio de historia, aparece el aviso TEST y el cierre. No marcar aún `owner-android` ni `review-final-parity` completamente PASS porque solo existe una vista y no se ha comparado directamente con revisión ni variantes de fotos/dos sedes.
- **Pendiente:** abrir segundo pedido (dos sedes, Story sin texto + PNG ficticio), contrastar portada/secciones/fotografía sin pantalla rota, comportamiento botón con contexto RSVP válido (no `#`), persistencia en Cloud por invitado/unidad, integración real de gestión, medición de tiempo, aprobación comercial expresa.
- Botánica continúa **5/11 PASS, 6 PENDING, NO-GO venta**. No comenzar diseño 03, no modificar ONE/Partner/STUDIO/VEIL LIGHT/`main` ni master aprobado. Coste adicional 0 €. La bitácora de Biblioteca conserva Entradas 1–48.

**Siguiente petición a la propietaria:** abrir el **otro** enlace de «Abrir invitación final en Android», el de **dos sedes**, y compartir grabación breve sin exponer URL con tokens. NO crear más pedidos ni completar un cuestionario de nuevo.
