# Parches de muestra validados en la web de venta · 22/10/2026

La propietaria validó estos tres arreglos en la web de venta (`guest-web/invitaciones/02`, `12`, `13`
de la rama `guest-web-sellos-2026-10-22`). Aquí se llevan a los diseños reales.

## Ellas (design-14) y Ellos (design-15)
- Nombres de muestra coherentes con el diseño: **Ellas = Lucía & Martina**, **Ellos = Álvaro & Pablo**
  (antes ambos decían Lucía & Pablo). Cambia la portada (`#name-1`, `#name-2`) y la configuración
  por defecto `couple`. En una entrega real los nombres siguen llegando del cuestionario vía
  `GUEST_APPLY_CONFIG`; esto solo afecta a la muestra.
- Se actualizan las huellas fijadas en `GUEST_CLAUDE_D10_D16_IMPORT_MANIFEST_2026-10-20.json` y
  `GUEST_PROJECT_STATUS_V1.json`. Huellas nuevas (git blob sha1 / bytes / sha256):
  - design-14: `ed7bfa0753cc888ca4882ba7c98ce1aca5dee660` / 13071173 / `73bdac9c6b09f955f5322e9875b883572f2587da057eb658cd0e08682db1f1d0`
  - design-15: `75f8fc54e27ff4db9863d254ddfe0921e3c34fd5` / 12930552 / `4253b04bfabd5d4b061392ae9bd3e59658a4c233c6ede1cc0c2dc3077503878e`
- `qa-reports/preview16_recovered_manifest_2026-10-20.json` no se toca: es el registro histórico de lo
  que se desplegó en la vista previa 16.

## Seda (VEIL LIGHT)
- El máster de VEIL no está en Git (paquete de Biblioteca
  `GUEST_VEIL_LIGHT_DELIVERY_PACKAGE_STAGING_2026-10-20.zip`), así que no se puede parchear aquí.
- Arreglo listo para aplicar sobre una copia extraída: `node guest/tools/patch_veil_unlock_2026_10_22.cjs /abs/copia/index.html`.
  Comprobado: aplicado a la muestra original V5 reproduce byte a byte la versión aprobada
  (sha256 `f8be508a29e7f0a46deab2ed10ed638ef337f7533baecb75162996a37d124f4d`).
- Como VEIL está congelado comercialmente con huellas fijas (`merge_veil_stage.cjs`), al aplicarlo hay
  que publicar una versión nueva (p. ej. 5.3.4) y su manifiesto, no pisar la 5.3.3.

## Actualización · Seda aplicada en la puesta en escena (22/10/2026)
- La propietaria aportó el paquete `GUEST_VEIL_LIGHT_DELIVERY_PACKAGE_STAGING_2026-10-20.zip` (HTML 5.3.3 sha256
  `8f09e6bb…`, coincide con lo fijado en `merge_veil_stage.cjs`).
- En lugar de abrir una versión 5.3.4 (la 5.3.3 está fijada en backend, Stripe, registros y puertas de QA),
  `merge_veil_stage.cjs` aplica ahora `patchVeilUnlock` a la **copia derivada** que se publica en la puesta en
  escena, igual que ya inyectaba el puente `GUEST_APPLY_CONFIG`. El máster congelado no cambia y la versión
  comercial sigue siendo 5.3.3. Si los anclajes no cuadran, falla antes de escribir (`VEIL_UNLOCK_PATCH_NOT_APPLIED`).
- `bridge-manifest.json` y `GUEST_STAGE_MANIFEST.json` registran `unlockPatch: patch_veil_unlock_2026_10_22`.
  Derivada con el paquete real: sha256 `281ae7a7ffd27e3d861dd2e4289534a2af4d57b32d452452c7b70318ca59fe7d`.
- Prueba en navegador (390×780, vídeo que no arranca): la copia sin arreglo queda bloqueada; la derivada se abre
  en ~2,5 s y permite desplazarse.
- Copia de referencia con el arreglo, por si hiciera falta: `GUEST_VEIL_LIGHT_DELIVERY_PACKAGE_STAGING_5.3.4_2026-10-22.zip`
  (carpeta del proyecto, HTML sha256 `645f1b90…`). No se usa en el código.
