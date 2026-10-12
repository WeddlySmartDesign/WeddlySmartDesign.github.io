# Entrada 90 — Limoneros · corrección REAL del tamaño de Historia

**Fecha:** 12/10/2026. Rama `guest-independent`. Diseño D03, **NO SALE / certification-pending**.

## Error detectado tras la captura real de Android

La propietaria recibió una supuesta «foto ampliada» que visualmente parecía idéntica. **Tenía razón**. El HTML de prueba usaba `story.photo.fit='full'`. En el CSS `object-fit:contain;height:auto` la altura efectiva del paisaje horizontal estaba determinada por su proporción intrínseca y ancho de pantalla; subir `max-height:42svh` a `46svh` **no cambiaba la imagen mostrada**, pues no alcanzaba ninguno de los dos máximos. Se declara el intento anterior inefectivo; no volver a prometer «más grande» por modificar un límite no vinculante.

## Corrección real, visible y compatible con el cuestionario

- `guest/catalog-patches/design-03/1.0.0/patch.css` commit **`a61330f162880b54dc77115eca2bc3733b0c2e05`**: para `#story .media-photo:not(.invisible):not([data-fit="full"])` fijar **altura física efectiva** `clamp(280px,43svh,410px)` en móvil y `clamp(270px,41svh,360px)` en 320–360; `object-fit:cover`; mantener máscaras suaves de los cuatro bordes, cero marco/arco/sombra, fotos y tipografías de autora intactas.
- **No eliminar ni quebrar `fit=full`:** sigue disponible para parejas que prefieran mantener el encuadre completo, con altura intrínseca natural. En la revisión visual solicitada la autora desea mayor presencia de la pareja, por eso el **fixture privado** presenta la foto con la opción **válida del esquema `fit=crop`** y el parámetro de enfoque `focusX=55` (real, no campo inventado). Ninguno de esos valores queda forzado para todas las parejas.
- **QA navegador ampliado:** `guest/tests/limoneros_visual_browser_acceptance.cjs` commit **`b035ac9220c292f21cf52fc052675fffee8f5767`** verifica `storyPhotoFit='crop'` y altura realmente visible **>=270px**, además de máscara, ausencia de marco y 320/390/430. Run [`38257640217`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38257640217) **SUCCESS**, 9/9 variantes móviles.
- Compilación del verdadero escenario Cloudflare stage del commit CSS `a61330f1`, [`38257299930`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38257299930) **SUCCESS**. Lectura HTTPS bit exacta `38257300044` **SUCCESS**.
- **Nuevo HTML privado con las cinco fotos originales** reconstruido desde el stage GitHub de ese commit (no solamente parche de captura). Mantiene video/fondos originales y foto privada en blob. Archivo `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_HISTORIA_FOTO_VISIBLE_AMPLIADA_2026-10-12.html` en Biblioteca, mismo archivo descargable de esta conversación `/mnt/data/LIMONEROS_D03_HISTORIA_FOTO_VISIBLE_AMPLIADA_2026-10-12.html`, SHA256 **`76859b83b547d89a5578d307de053b60645b2f135fac9a33260f34d318b51ebf`**, 3.416.575 bytes. Revisión TEST sin compra. La foto de pareja ahora usa crop; revisar visualmente en Chrome Android.

## Continuidad

**Solo Historia está siendo evaluada.** Mantener su fundido y tipografías; esperar criterio de la propietaria sobre esta corrección realmente visible. Las demás escenas continúan pendientes de aprobación artística según Entrada 88. Seguir contrato universal: foto/2 lugares/5 momentos/4 práctico y las ausencias; no inventar datos. **No repetir el error de declarar resultados visuales a partir de un QA técnico.** ONE/Partner/STUDIO, Botánica/VEIL y `main` no se tocan.
