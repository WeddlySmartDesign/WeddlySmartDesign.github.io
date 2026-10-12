# Entrada 89 — D03 Limoneros, microbloque Historia corregido en plantilla real

**Fecha:** 12/10/2026. **Rama:** `guest-independent`. **Estado:** microbloque Historia IMPLEMENTADO y comprobado técnicamente; **aprobación estética de la autora PENDIENTE**. Solo Historia, NO avanzar a Lugares sin revisión.

## Petición visual, original y respeto al cuestionario

La autora, tras revisión en vídeo de 39,61 s, acepta integrar la fotografía original de pareja en la pintura de Historia **sin marco, arco ni aspecto de fotografía rectangular pegada**, manteniendo las fuentes originales. La fotografía NO es un campo inventado; procede de `story.photo` y se muestra solo cuando el cuestionario la informa. `story.textMode` real ofrece `preset`, `custom`, `none`; la prueba de estos tres valores no equivale a certificar tres variantes de tipografía, que siguen siendo una obligación universal separada de la plataforma.

## Cambio ejecutable aplicado en la plantilla real

- Archivo exclusivo de D03: `guest/catalog-patches/design-03/1.0.0/patch.css`. Commit de implementación **`4148be90878d3792f543f5a0cb9582323e1f0ead`**.
- `#story .media-photo:not(.invisible)` ahora conserva el ajuste `fit` solicitado, imagen centrada y la tipografía Garamond/Pinyon/GaramondSC ya embebida en el original, pero elimina `box-shadow`, bordes y arcos.
- Borde fundido en papel mediante dos máscaras progresivas CSS (`mask-image` horizontal y vertical, composición `intersect`; `-webkit-mask-image` + `-webkit-mask-composite:source-in` para Chromium Android). Fondo artístico original y su textura intactos; sin transformar ni difuminar rostros en el centro.
- Cotas móviles: fotografía responsiva dentro del ancho sin overflow, altura de 33svh acotada en foto recortada y `height:auto;max-height:42svh;object-fit:contain` cuando `data-fit=full`. Sin fotografía, aplica el layout de texto existente, sin crear bloque falso.
- Original congelado SHA256 `a6fa4d81f73e6b5c913f8fd3cd3d285327249ee631a8707d0635d447d0c96482` no modificado; tampoco vídeos, fondos, fuentes ni productos congelados.

## QA y demostración privada

- Test navegador `guest/tests/limoneros_visual_browser_acceptance.cjs` incluye desde el commit **`c601530532c3b554f319866a867fc66a3c251029`** comprobación automática de doble máscara, `boxShadow:none`, `borderRadius:0px`, no overflow y los casos con/sin foto. Chrome/Chromium 320, 390 y 430 px, lleno/reducido/sin galería, total **9/9 PASS**, [workflow `38255054520`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38255054520).
- QA catálogo continuidad [`38255054582`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38255054582) **SUCCESS** y QA independiente [`38255054623`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38255054623) **SUCCESS**.
- **Archivo privado de revisión creado con LAS CINCO FOTOS reales que ya entregó la autora**, sin exponerlas públicamente ni pedir nuevos materiales: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_HISTORIA_INTEGRADA_REVISION_2026-10-12.html` en Biblioteca, y archivo exacto del chat `/mnt/data/LIMONEROS_D03_HISTORIA_INTEGRADA_REVISION_2026-10-12.html`. Tamaño 3.415.631 bytes, SHA256 `0ce8eff125c82bfb900ec3e27645b109852441d89aaf860635740d0e0caeb63b`. Demostración TEST, enlaces de prueba y medios de la plantilla en Cloudflare; conexión requerida para fondos/vídeos. La prueba automática usa solo imágenes sintéticas, mientras **el archivo privado de la autora sí contiene sus fotos originales**.
- La capacidad de construir/validar el HTML en CI no prueba que el último `patch.css` esté ya desplegado a Cloudflare; exigir nueva evidencia de lectura HTTPS byte exacta antes de declarar publicación de este último ajuste. Tampoco afirma que una prueba Android física haya aprobado esta variante.

## Próximo paso

**Enseñar exclusivamente Historia del HTML privado actualizado a la autora** y atender solo ajustes que ella señale antes de pasar a Lugares. No pedir de nuevo fotos, no añadir botones/flechas/cajas, no alterar fuente original ni avanzar a otros módulos. Mantener `ownerVisualApproved=false`, `commercialReady=false`, `backendRealE2eVerified=false`.

## Feedback Android de la autora y afinado de escala (12/10/2026)

La autora revisó una captura REAL desde Chrome Android del HTML privado con foto original: **«Queda bien. Quizás algo pequeña pero así fundida queda bien»**. Se acepta expresamente **el lenguaje artístico de foto fundida en pintura** de Historia; se interpreta «algo pequeña» como oportunidad de ajuste leve, **no como rechazo del diseño**. Se aplicó en CSS real exclusivo de D03 el commit `ec4ca7ab7ebbf78512e5b4373bed889eaf2088b1`, aumentando de `clamp(205px,33svh,330px)` a `clamp(225px,37svh,360px)`, y móvil estrecho de `clamp(188px,31svh,282px)` a `clamp(205px,35svh,310px)`; `data-fit=full` puede usar hasta `46svh`. **Mask, imagen, tipografías, vídeo y contenido intactos.** La validación de estos nuevos valores por CI y la lectura HTTPS real se deben comprobar; no declarar automáticamente que la propietaria ha visto esta última ampliación. La autora ha aprobado la dirección visual de Historia y podemos avanzar a **Lugares** tras dejar constancia de la ampliación; no significa aprobación global de Limoneros.

- HTML privado reemitido con escala ligeramente mayor **y las cinco fotos originales** para verificación opcional (sin requerir repetir aprobación): `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_HISTORIA_FOTO_AMPLIADA_2026-10-12.html` (SHA256 `96e28dca3382785e158d8ac2af91260c0aaa24aace1e8f748a2e1fe673cb5a9d`, **3.415.519 bytes**). Copia descargable verificada en conversación `/mnt/data/LIMONEROS_D03_HISTORIA_FOTO_AMPLIADA_2026-10-12.html`. QA de escalas 320/390/430 en run `38255965503` **PASS**, lectura real Cloudflare run `38255965483` **PASS**, CSS publicado con SHA `4f3cc3720feec47cb85af4fbe210b9621ea79f1dd369d7d14b408ade389b5fe1`. No confundir revisión visual positiva previa con aprobación global.
