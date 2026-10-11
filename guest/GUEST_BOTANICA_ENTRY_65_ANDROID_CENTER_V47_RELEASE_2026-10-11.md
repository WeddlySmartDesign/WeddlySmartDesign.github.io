# GUEST — Entrada 65 · Centro Android V4.7 con Botánica integrado (sin modificar V4.6)

**11/10/2026.** Repositorio `WeddlySmartDesign/WeddlySmartDesign.github.io`, rama **`guest-independent`**, proyecto GUEST exclusivamente. Este registro es **la fuente de recuperación de la nueva versión operativa candidata**, independientemente del chat.

## Objetivo y decisión técnica

El último criterio comercial pendiente de Botánica era **`renderer` dentro del Centro GUEST operativo**, no la vista web de QA (ya aprobada por la propietaria en Android). La versión instalada disponible en Biblioteca, **V4.6**, solo reconocía VEIL LIGHT, aunque el catálogo público y la web de certificación ya renderizaban Botánica.

Se ha construido **V4.7 como archivo autónomo alternativo importable en el APK Android existente**. No se editó ni reemplazó la V4.6 original. Se conserva íntegro el motor nativo VEIL LIGHT y la gestión completa existente (login, pedidos, cuestionario, edición, revisión, aprobación, envío, entrega, contador); se incorpora Botánica únicamente mediante un adaptador aislado **TEST-only**.

## Entradas inmutables y comprobación de identidad

- Centro de partida desde Biblioteca personal: `/GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V4_6_CLEAN_FROZEN.html`. 30.038.021 bytes. SHA256: `a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133`.
- Master Botánica aprobado desde Biblioteca: `/GUEST by WeddlySmartDesign/BOTANICA/Candidatas/GUEST_D02_BOTANICA_ATELIER_V14_7_PHOTO_ONLY_VISUAL_QA_CANDIDATE_2026-10-09.html`. 11.635.635 bytes. SHA256: `fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a`.
- El builder aborta ante cualquier desviación de huella o de anclajes del workbench. **Ambos originales permanecieron intactos**.

## Artefacto final y recuperación independiente del chat

**Archivo HTML único**: `GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_INTEGRATED_2026-10-11.html` (**45.557.384 bytes**, SHA256 `3ce9f5fa97a623c0b358336d11bbcd58db586a4e60c34e93b24abcc44e1c0484`).

**Biblioteca personal (subida nueva, verificada, sin sobrescribir históricos):**
- `/GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_INTEGRATED_2026-10-11.html` (file_id `file_0000000093a481f49824b7ec2f34d3c2`; biblioteca `libfile_d8a8132501188191a95307c291d27464`).
- ZIP de seguridad `/GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_ANDROID_2026-10-11.zip` (33.440.759 bytes; file_id `file_00000000aaec81f48fa233dad85dc151`).
- Builder reproducible `/GUEST/MOBILE_CENTER/build_guest_mobile_center_v47_2026-10-11.py`, prueba `/GUEST/MOBILE_CENTER/test_guest_mobile_center_v47_2026-10-11.cjs` y manifiesto `/GUEST/MOBILE_CENTER/GUEST_MOBILE_CENTER_V4_7_MANIFEST_2026-10-11.json`. **No alterar ni reemplazar la bitácora histórica de Biblioteca v24**, cuyo overwrite dio errores de chat.

**Código reproducible guardado también en GitHub**:
- `guest/tools/build_mobile_center_v47_from_library.py`, input-bytes con SHA pinning exacto, original V4.6 y master V14.7.
- `guest/tests/mobile_center_v47_integrated_contract.cjs` (prueba dinámica de adaptador con DOM aislado y confirmación de bytes de master).
- `guest/tests/mobile_center_v47_source_contract.test.cjs` para GitHub Actions.
- Manifiesto de artefacto oficial en Biblioteca con SHA y tamaños exactos.

## Integración funcional (TEST únicamente)

1. Conserva el dispatcher VEIL LIGHT **sin alterar `VEIL_APPLY_CONFIG`**.
2. Añade un segundo dispatcher catalog-driven `botanica` visible como **«BOTÁNICA · SOLO PRUEBA»**. Rechaza cualquier pedido Botánica que no sea `mode=test` o cuya configuración no sea V14.7.
3. Embebe **los bytes completos, originales y aprobados** de Botánica 14.7 en base64 dentro del nuevo Centro **en el mismo único HTML**. El iframe usa `srcdoc`, cuyo contexto hereda el origen local del WebView. La primera carga localiza `BOTANICA_APPLY_CONFIG`, aplica `order.hydratedConfig` y muestra el visual sin exponer nombres originales durante carga.
4. Integra con el **workbench existente**, no con una página separada: botones **Ver invitación**, **Vista revisión** y **Vista final** usan el renderer según el `template_id` del pedido; la capa «CENTRO GUEST» regresa al mismo listado/pedido. La hoja de revisión del Centro sigue encima del iframe. Se conserva el flujo de pedidos reales en backend, pero Botánica queda deliberadamente bloqueada para venta.
5. El botón «Nueva prueba completa» admite **selector genérico VEIL LIGHT/BOTÁNICA TEST** sin duplicar motor ni crear infraestructura. La certificación de un solo clic histórica sigue seleccionando VEIL LIGHT; no se reabre esa prueba.
6. Para diseño 03 o diseño 1000 se mantiene el contrato de catálogo existente: artefacto visual y registro, sin rediseñar el motor de gestión ni tocar ONE/STUDIO. Este HTML offline incorpora el master aprobado de Botánica para funcionar autónomamente: **las futuras versiones del Centro deben generarse usando el builder genérico y registrar assets nuevos, NO editar V4.6**.

## Verificaciones efectivamente realizadas (no inventar otras)

- SHA256 de **ambos originales y del artefacto final** verificados; base64 embebido decodificado y comparado byte a byte con master aprobado.
- `node --check` del nuevo motor y del workbench V4.7: **PASS**.
- `node guest_center_v47_renderer_contract.cjs`: **PASS** con ejecución JavaScript simulada de adaptador, carga iframe mediante `srcdoc`, inyección de configuración, vuelta al centro y rechazo de pedido `production`.
- Los dos workflows de GitHub sobre la rama fueron confirmados verdes **antes** de este changeset; se integró una comprobación fuente/sintaxis del builder V4.7 en `guest-botanica-contract-qa.yml`; verificar último HEAD y run antes de afirmar success.
- **El navegador Chromium de este contenedor devolvió `ERR_BLOCKED_BY_ADMINISTRATOR` tanto para file:// como localhost**. Por lo tanto **NO existe prueba física Android/WebView de esta versión V4.7**; no afirmar que ha pasado el último criterio comercial ni marcar 11/11. La vista QA web anterior sí fue probada por la propietaria, pero es distinta.

## Instalación operativa real pendiente — una acción en Android

1. Descargar **el HTML V4.7 individual**, no hace falta extraer el ZIP ni instalar otro APK. Mantener el antiguo V4.6 en Biblioteca como copia de seguridad.
2. Abrir app instalada **GUEST Mobile Center** → menú (tres puntos) → **Actualizar centro** → elegir el HTML V4.7 desde Descargas. El APK Android V1 permanece instalado y conserva su icono; no necesita reinstalación ni servicio nuevo.
3. Abrir el Centro actualizado y entrar con el código de propietaria habitual.
4. Seleccionar uno de los pedidos **Botánica TEST entregados** ya existentes (sin crear más), pulsar **Ver invitación** y confirmar que se abre dentro del Centro, con el botón **CENTRO GUEST** operativo. Comprobar asimismo **Vista revisión** y, si corresponde, **Vista final**. La interfaz debe mostrar `GUEST · Centro móvil · V4.7 · Botánica TEST`, sin cambiar a una invitación VEIL. No compartir códigos ni URLs privadas.
5. Si no abre, conservar V4.6, informar del error visible y **no** habilitar venta. Nunca repetir pedidos, RSVP o medición.

## Regla comercial y punto exacto de continuidad

**10/11 criterios superados, 1/11 `renderer` pendiente de confirmación Android V4.7, `certification-pending`, venta NO-GO, D03 detenido**. La construcción real está hecha y persistida como artefacto independiente; falta comprobar el comportamiento del **Centro instalado** tras su actualización. Luego actualizar gate y, solo tras permiso comercial explícito, discutir cambio del catálogo. No tocar ONE, Partner, STUDIO, VEIL LIGHT congelado, `main`, master aprobado, Stripe, backend, base de datos ni licencias existentes. Coste adicional 0 €.

**Fuente de continuidad:** START_HERE.md + este documento + GUEST_PROJECT_STATUS_V1.json; Biblioteca guarda bytes íntegros; GitHub guarda código, QA y decisiones; el chat no es fuente de verdad.
