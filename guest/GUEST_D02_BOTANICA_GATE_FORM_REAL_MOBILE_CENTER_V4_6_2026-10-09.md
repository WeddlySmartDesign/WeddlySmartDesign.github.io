# GUEST D02 · BOTÁNICA — GATE DE CUESTIONARIO Y MOBILE CENTER (9 OCTUBRE 2026)

**Estado: PREPRODUCCIÓN AISLADA. NO PUBLICAR, NO DESPLEGAR, NO ACTIVAR VENTAS.**

## Decisión inequívoca

La **V14** es la invitación aprobada visualmente e inmutable. La **V14.7** continúa como única candidata de certificación del renderizador; **no se ha creado una V14.8** ni se ha tocado su diseño. El Mobile Center **V4.6** congelado también es inmutable. Esta prueba genera una **copia independiente de Mobile Center V4.6** con una única actualización de su formulario embebido, nunca una sustitución de la versión congelada.

## Origen del defecto probado

El `guest-invitation-config-v1` permite `story.textMode:'none'`. La Edge Function `guest-invitation-flow` v12, todavía única desplegada, normaliza todo texto no personalizado a `preset`. En el antiguo cuestionario guiado V3 también faltaba la elección **«Solo fotografía, sin texto»** y el propio cuestionario decía que la sección podía contener texto, foto o ambos.

**Nuevo hecho demostrado:** la copia del cuestionario incrustada literalmente dentro de `GUEST_MOBILE_CENTER_V4_6_CLEAN_FROZEN.html` es **100 % idéntica por bytes** al cuestionario guiado V3 de Biblioteca: 514 154 bytes y SHA256 `4a0a8e46057d24e2cf1775cdf5665025123b73e21feb2585bda2a90afe6c0b51`. Ya no es una conjetura sobre cuál contiene el Mobile Center V4.6. Aun así, esto no demuestra qué revisión exacta está sirviendo cualquier URL pública actual: comprobar esa ruta antes de activar el cambio.

## Fuentes y candidatos (todos independientes)

- `GUEST_MOBILE_CENTER_V4_6_CLEAN_FROZEN.html`: **congelado**, SHA256 `a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133`; no modificar.
- `GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V3_MOBILE_CLEAR.html`: formulario original, SHA256 `4a0a8e46057d24e2cf1775cdf5665025123b73e21feb2585bda2a90afe6c0b51`.
- `GUEST_QUESTIONNAIRE_COMUN_V3_CANDIDATA_SOLO_FOTO_NO_PUBLICAR_2026-10-09.html`: **candidata solo para QA**, SHA256 `48ad877566894c5092d81805ae4d20a3293cc23929669b5ab28b921be71d683e`.
- `GUEST_MOBILE_CENTER_V4_6_SOLO_FOTO_INTEGRACION_CANDIDATA_NO_PUBLICAR_2026-10-09.html`: **copia independiente no publicada**, SHA256 `90bb178a97cb46b3525406eb0dcc7272b2a002fa080e61f456f857bbb8d3e003`.

**Demostración de invariancia:** se ha extraído el único contenido `GUIDED_QUESTIONNAIRE_B64` del Mobile Center congelado y sustituido por el nuevo formulario. Al reponer exactamente esa cadena, el contenido entero vuelve a ser **idéntico byte por byte** al congelado; no han cambiado botones, scripts externos, renderer, arquitectura ni otros recursos. El script `stage_mobile_center_form_none.py` reproduce la copia y comprueba todos los hashes antes de escribir, rechazando la sobrescritura de fuentes o candidatos existentes.

## Pruebas completadas

1. Script de formulario `node --check`: **PASS**.
2. Navegador Chromium local, formulario cargado sin red con `fetch` simulado: 360/390/430 px, **3/3 PASS**: existe la opción «Solo fotografía», se bloquea sin foto, permite continuar con foto, almacena `textMode:'none'` y `presetId:null`, sin scroll horizontal.
3. Regresión de estados históricos y edición: **3/3 PASS**: preset, texto personalizado (incluida validación de vacío) y restauración de una elección `none` previamente guardada.
4. Proyección puramente funcional del `buildConfig` real (Edge v12) ensayada en memoria, **128 configuraciones** con dos plantillas, modos de Historia, módulos opcionales, fotos y lugares: 32 casos `none` alterados únicamente en `story.textMode`; los otros 96 casos no cambian, sin diferencias en demás campos ni pérdida de foto. **No se ha ejecutado la Edge Function real ni desplegado la propuesta.** La escritura de una copia reproducible del código del backend en GitHub fue bloqueada; no se ha intentado eludir ese control.
5. Integridad del Mobile Center candidato: **PASS**, comprobación byte a byte excluyendo únicamente la cadena del cuestionario embebido; recuperación exacta del congelado. `stage_mobile_center_form_none.py` reproduce el SHA256 del candidato.

## Contrato y validaciones todavía pendientes

- Confirmar la versión de Mobile Center realmente publicada y el modo de carga para pedidos nuevos; no sustituir a ciegas V4.6 ni una copia pública con estado más reciente.
- Adaptar `buildConfig` a `textMode:'none'` **en una operación test-only autorizada**; realizar pruebas de VEIL LIGHT y no migrar ni alterar pedidos previos. El acceso de despliegue está bloqueado por controles del entorno y **no debe eludirse**.
- Confirmar que la validación real del pedido exige foto cuando `story.enabled=true` y `textMode:'none'`, coherente con el formulario; comprobar firma/TTL de fotos y ausencia de contenido ficticio.
- Ejecutar los **dos pedidos E2E** del cuestionario común, con contraste visual/funcional, revisión/aprobación/final, URL estable, RSVP `rt/g/u/lang` y respuestas en GUEST existente.
- Validación final Android de la propietaria y tiempo de gestión ≤5 min, antes de certificar comercialmente. La publicación/cobro requiere autorización independiente.

## Ubicación persistente

Biblioteca: `/GUEST by WeddlySmartDesign/BOTANICA/Preproduccion/` (formulario candidato y paquete de pruebas). El Mobile Center candidato y la rutina de parche se conservan también allí; todo debe recuperarse desde este documento y `guest/GUEST_D02_BOTANICA_READ_FIRST.md` al cambiar de chat.

**ESTADO INVARIABLE: Botánica `certification-pending`, backend solo VEIL LIGHT, ONE/Partner/STUDIO y VEIL LIGHT congelados y no modificados.**