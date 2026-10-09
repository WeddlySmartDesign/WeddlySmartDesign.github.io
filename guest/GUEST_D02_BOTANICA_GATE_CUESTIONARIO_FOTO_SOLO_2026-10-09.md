# GUEST — Botánica D02 · Gate de cuestionario / Historia solo fotografía

Fecha: 2026-10-09. **Estado: CANDIDATA AISLADA, NO DESPLEGADA, NO APROBADA PARA VENTAS.**

## Alcance y antecedentes

- La **V14 visualmente aprobada y congelada** continúa inmutable.
- La **V14.7** sigue siendo la única candidata técnica de Botánica. No existe una V14.8 por este trabajo.
- La Edge Function `guest-invitation-flow` en Supabase (proyecto `dnjsxequwgtyyauuofxj`) permanece en versión v12, identificador `69ef41f9867eb048b052632141be9b8e5ea53aa78a63ade1883e1e88da7b28ac`, solo VEIL LIGHT admitido. **No se ha desplegado ni cambiado**.
- El esquema conceptual común permite `story.textMode` = `preset`, `custom`, `none`. Sin embargo, el **artefacto histórico de cuestionario guiado V3** evaluado solo ofrecía 5 presets y texto propio. Y el `buildConfig` desplegado convertía `none` a `preset`. El texto visible del formulario ya prometía “texto, foto o ambas cosas”; esta discordancia impedía producir Historia solo fotográfica desde ese cuestionario.
- **No está verificado que el artefacto V3 sea exactamente el cuestionario público más reciente.** Antes de usar los cambios debe recuperarse y compararse la versión realmente servida por el Mobile Center o los pedidos actuales.

## Candidato del cuestionario (no sustituye el producto común)

Basado exclusivamente en `GUEST_QUESTIONNAIRE_VEIL_LIGHT_GUIDED_V3_MOBILE_CLEAR.html`; se han hecho seis cambios localizados:
1. Explicar en Historia que existe la modalidad de solo foto.
2. Añadir la opción explícita «Solo fotografía, sin texto» en la misma selección de presets.
3. Serializar `textMode:'none'` y `presetId:null` para esa elección.
4. Restaurar esa opción al reabrir un cuestionario guardado.
5. Rechazar continuar si se elige solo foto pero no se ha subido ninguna fotografía.
6. Mostrar «Solo fotografía, sin texto» correctamente en la página de revisión.

**Fuente de cuestionario estudiada**: SHA-256 `4a0a8e46057d24e2cf1775cdf5665025123b73e21feb2585bda2a90afe6c0b51`, 514,154 bytes.

**Candidato aislado**: `GUEST_QUESTIONNAIRE_COMUN_V3_CANDIDATA_SOLO_FOTO_NO_PUBLICAR_2026-10-09.html` — SHA-256 `48ad877566894c5092d81805ae4d20a3293cc23929669b5ab28b921be71d683e`, 514,653 bytes.

## Pruebas reproducibles ejecutadas hoy

- `node --check` sobre el script del HTML: **PASS**.
- Playwright Chromium nativo, interacciones de la usuaria simuladas con `fetch` interceptado localmente: **3/3** casos de la opción «Solo fotografía» a 360, 390 y 430 px. Opción visible, sin foto = bloqueo con mensaje, con foto = avance, `none`/`null` serializados, 0 desplazamiento lateral. **Sin comunicaciones reales**.
- Regresión de opciones existentes y persistencia: **3/3** — preset existente, texto propio con validación de vacío, restauración de `none` al reabrir. **Sin comunicaciones reales**.
- Se ejecutaron además **128 simulaciones** sobre la función pura de configuración extraída de la Edge Function v12, comparando comportamiento original frente a la única corrección de `story.textMode`. Resultado: 32/128 casos `none` requieren cambio; cero diferencias en el resto de campos y cero pérdidas fotográficas; 96 casos no afectados. **Esto no prueba que el sistema completo funcione ni autoriza un despliegue**. No se almacenó ni publicó el código completo de backend.
- Captura de prueba: `BOTANICA_QA_CUESTIONARIO_SOLO_FOTO_390.png`.

## Pendientes obligatorios antes de certificar Botánica

1. **Identificar formulario compartido realmente activo**. No reemplazarlo por esta versión V3 sin cotejar los cambios acumulados y la integración común del catálogo.
2. Reconciliar `textMode:'none'` entre formulario real, Edge Function, esquema y renderizadores de todas las plantillas. **Regresión VEIL LIGHT obligatoria** (normal y casos límites), conservando versiones de pedidos existentes.
3. El despliegue de test-only backend anterior fue bloqueado por los controles del entorno: **no intentar eludir el bloqueo**. Solo un entorno autorizado puede ejecutar la habilitación con `template_test_only` y rollback verificable.
4. Crear y revisar dos pedidos diferentes desde el cuestionario común real. Comprobar previsualización, aprobación, entrega, recurso multimedia firmado y RSVP individual/unidad/idioma con GUEST existente.
5. Android de propietaria y tiempo de atención de pedido ≤5 minutos. Hasta todos los PASS, Botánica `certification-pending` y **sin ventas**.

## Comandos locales de reproducción

```bash
python test_form_candidate.py
python test_existing_story_modes.py
```

Son ensayos de formulario HTML en Chromium con respuestas simuladas; nunca probarlos con un token de cliente real. El archivo original y la candidata se empaquetan con las dos pruebas. Los scripts buscan primero el HTML en la carpeta superior a `QA`, por lo que pueden ejecutarse tras descomprimir el ZIP. Requieren Python, Playwright y Chromium instalado; usan Chromium del sistema en `/usr/bin/chromium`. No abren la página mediante URL ni consumen API real.