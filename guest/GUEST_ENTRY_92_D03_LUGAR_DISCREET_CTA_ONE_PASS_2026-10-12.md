# Entrada 92 — Limoneros D03: Lugar, CTA secundarios y discretos

Fecha: 12/10/2026. Rama `guest-independent`. Diseño `design-03`, TEST only, `certification-pending`, NO SALE.

## Feedback real de la autora y decisión de cierre operativo
La autora vio la corrección anterior en Chrome Android: **«No me entusiasma porque le veo demasiado protagonismo a los botones. Pero si vamos a necesitar 5 intentos más, lo dejamos así»**. No tomar esta frase por aprobación estética inequívoca: expresa fatiga de iteraciones. Aplicar **un único ajuste editorial más y continuar con Agenda**, sin pedir cinco revisiones adicionales.

## Cambio en plantilla REAL
- `guest/catalog-patches/design-03/1.0.0/patch.css`, commit `7867cac2114b9261ac472aad0f07c287a018597f`. Únicamente acciones de `#locations`, sin tocar foto fundida aprobada, titulares legibles, HTML máster, vídeos, cuestionario, otros diseños/productos.
- Grilla de CTAs centrada, anchuras de **156px / 98px** (320 CSS px: **146px / 92px**), manteniendo orden «Cómo llegar» y «Web», botones de **44px** de zona pulsable.
- Diseño sin protagonismo: tipografía original smallcaps **peso 400**, fuente 16–18px, borde fino transparente `rgba(87,53,71,.37)`, fondo casi transparente `rgba(255,249,239,.14)`, **sin sombra ni flechas**. Se conserva `:focus-visible`, enlaces condicionales del esquema y etiquetas por sede; el estado hover no tapa el lienzo.
- Actualizar QA común de navegador [commit `339598eabaafc90b9913a3b4d4ba101f394e47cc`] para medir discretamente CTA sin exigir fondo opaco y peso 600; test 9/9 Chromium [run 38262383953](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38262383953) SUCCESS y catálogo offline [38262383793](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38262383793) SUCCESS.
- **Comprobación adicional con fotos de la autora** en HTML local y Chromium real 320, 390 y 430 CSS px: 3/3 PASS. Cuatro enlaces para las dos sedes; etiqueta `Web`; foto real cargada; 44px de altura pulsable; estilos computados fondo .14, borde 1px, peso 400; sin scroll horizontal. Capturas 320/390/430 de prueba local. Esto no implica la validación artística de Android.
- Preview PRIVADA con las cinco fotos reales, conservadas localmente, en Biblioteca: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_LUGAR_BOTONES_SUTILES_FINAL_2026-10-12.html` (SHA256 `4b9338e7b95494a4bc13b298950d287c478f76f343f0b5367dc6605f4cf71a41`), mismo archivo exacto en conversación `/mnt/data/LIMONEROS_D03_LUGAR_BOTONES_SUTILES_FINAL_2026-10-12.html`. **No se suben fotografías privadas a Cloudflare o GitHub**.
- Cloudflare stage real [run 38262290236](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38262290236) SUCCESS con último CSS. No declarar aprobación estética por este test. No habilitar pagos.

## Continuidad
Prioridad de la autora: **no seguir consumiendo rondas de revisión de estos botones**. La propuesta discreta queda disponible, sin marcar `ownerVisualApproved=true`; **siguiente microbloque Agenda**. No tocar foto fundida ni titulares ya aceptados ni hacer nuevos cambios en Lugares salvo petición expresa. Respetar contrato universal GUEST: la plantilla se alimenta por cuestionario real y soporta configuraciones máximas y opcionales sin inventar datos.
