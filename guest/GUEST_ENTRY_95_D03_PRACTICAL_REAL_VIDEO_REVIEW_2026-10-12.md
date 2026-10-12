# Entrada 95 — D03 Limoneros · revisión del VÍDEO real de Práctico y corrección de jerarquía

Fecha: 12/10/2026, después de Entrada 94. Rama `guest-independent`. **Sólo Práctico. Certificación comercial y aprobación estética PENDIENTES**.

## Archivo y observación de la autora

La autora envió el vídeo Android privado `1000095467.mp4` de 7,6161 segundos (1220 × 2712), con grabación de desplazamiento por Práctico y el inicio de Galería. **No subir este vídeo personal a GitHub**. Inspección secuencial (0–7,2 s) demuestra:
- El paso de «lista de texto» a cuatro títulos caligráficos alternos se aprecia; se mantiene el fondo pintado y las golondrinas continúan visibles y libres al llegar a Galería.
- **Problema real:** en Transporte las horas «Ida» y «Vuelta» eran texto corrido entre parada y nota; lo importante carecía de jerarquía.
- **Problema real:** en Alojamiento `Ver hotel`, `Cómo llegar`, `Reservar` se acumulaban como enlaces subrayados diminutos y con mala relación visual, y el texto `Datos del alojamiento` parecía una línea suelta.
- En Regalos y Música el enlace resultaba poco distinguible del resto del texto.
- La composición de las cuatro secciones estaba desconectada, sin jerarquía de acción, aunque las fuentes Pinyon y el fondo original merecen conservarse. **La entrada 94 no era aprobación artística**.

## Corrección en plantilla REAL (NO solo mockup)

- `guest/catalog-patches/design-03/1.0.0/patch.js`, commit `41c75e6d1bf0edc31b445483ba12fb5eb71e9712`: sin crear campos de cuestionario, `Ida:` y `Vuelta:` del bus se subdividen en nodos de etiqueta y valor `d03-time-label/d03-time-value`. TextContent original permanece idéntico; semántica DOM del motor y las URLs de cada módulo se conservan.
- `guest/catalog-patches/design-03/1.0.0/patch.css`, commit `3836312d9ece17323da0ca8d3d8270dbe532e75f`: los tiempos reales del bus son un dúo tipográfico de 29–36px, no lista uniforme; enlaces más visibles pero discretos (borde fino, sin flecha, área táctil 44px); Alojamiento muestra `Ver hotel` y `Cómo llegar` juntos y `Reservar` en segunda fila centrada **solo si su modo/URL lo permite**. Los desplegables de Hotel y Regalos siguen siendo funcionalidades y no texto suelto; más contraste. No hay cajas, tarjetas, flechas, pictogramas, textos ficticios adicionales ni elementos sobre las aves.
- Contrato universal intacto `GUEST_UNIVERSAL_DESIGN_ACCEPTANCE_CONTRACT_V1.md`, `GUEST_INVITATION_CONFIG_SCHEMA_V1.json`: 0–4 módulos opcionales, hotel `room_block` sin «Reservar», `external_booking` condicionado a URL; sin web/mapa/playlist no aparece botón. Se preservan fuentes, foto, fondos y vídeo originales, los demás productos y diseños congelados.

## Validaciones ejecutadas

- GitHub Actions `guest-independent` en SHA `3836312d`: catálogo [`38270334334`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38270334334) SUCCESS; QA independiente [`38270334183`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38270334183) SUCCESS; Chromium sintético [`38270334411`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38270334411) SUCCESS; página publicada real [`38270334329`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38270334329) SUCCESS; stage [`38270334660`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38270334660) SUCCESS.
- **Prueba adicional Chromium sobre el HTML privado REAL, con las cinco fotos de la autora**, no sondas sintéticas: fondo original JPG inlineado para render local; viewports 320/390/430; **tres PASS**, 4 módulos, 2 valores destacados en Transporte, las tres acciones de Alojamiento y Música en su orden, todas las acciones al menos 44px, `documentElement.scrollWidth === innerWidth`, cero errores JS. Captura real `practico_v12_390.png`. No se ejecutó Android físico nuevo ni se afirmó compra.
- El vídeo del usuario NO valida aún la última versión V12: la autora debe verla y valorar arte. El HTML privado V12 usa el stage de GitHub y las cinco fotos propias embebidas; para vídeos/fondos en móvil requiere internet (imágenes servidas por Cloudflare, sin publicación de fotos personalizadas).

## Previsualización exacta

- Archivo nuevo `LIMONEROS_D03_PRACTICO_REVISION_VIDEO_2026-10-12.html` en Biblioteca `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/`, SHA256 `c72b9d553b6716a3fb578bb1f92cae0690e6b1b2458eba5835c77db37af42573`, 3.436.562 caracteres del HTML.
- Captura `LIMONEROS_D03_PRACTICO_REVISION_VIDEO_390_2026-10-12.png` en la misma carpeta.
- Conversación: `/mnt/data/LIMONEROS_D03_PRACTICO_REVISION_VIDEO_2026-10-12.html`; no olvidar que el fichero privado lleva imágenes reales y no debe exponerse en sitio público sin consentimiento.

## Continuidad

**Estado: Práctico revisado, deficiencias detectadas y corregidas técnicamente en V12; aceptación editorial PENDIENTE.** No declarar «resuelto y perfecto» sin revisar nuevo HTML la autora; no abrir nueva ronda de explicaciones ni pedir materiales de nuevo. Agenda sigue considerada «ultra básica» por su autora y pendiente, aunque animación secuencial probó funcionar; Galería y Cierre también pendientes. GUEST entero sigue `certification-pending` / TEST-only / NO SALE. No tocar ONE, Partner, STUDIO, Botánica ni VEIL.
