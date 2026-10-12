# Entrada 93 — Limoneros D03 · animación REAL de entrada secuencial al llegar a Agenda

Fecha 12/10/2026. Rama guest-independent. Test-only y sin autorización comercial.

## Defecto y solución

La propietaria indicó que **no observaba ningún movimiento** en Agenda después de anteriores cambios CSS. La causa no era falta de CSS: el JS viejo observaba los cinco elementos independientemente (cada uno podía dispararse y finalizar cuando la persona aún no miraba la escena). Añadir solo animation-delay CSS tampoco garantizaba una entrada visible desde el punto real de lectura, y una variante anterior añadía un bucle de flotación que la autora rechazó por parecer un error del sistema.

**Reparación aplicada directamente a la plantilla D03:**
- `guest/catalog-patches/design-03/1.0.0/patch.js` commit `07e7be2cad16a5e38aa65bc54aea39e1271ba09c`: un IntersectionObserver único en toda la escena `#agenda`, inicia al cruzar 36% de intersección visible. Los 1–5 momentos se disparan **en orden**, con retraso progresivo `--d03-step` de 560 ms por elemento; cada uno aparece gradualmente desde abajo en 900 ms. Tras el último, escena estática, sin pulsos ni rebotes. Al abandonar la escena (menos de 13%) y regresar, reproduce de nuevo. Si no hay IntersectionObserver, no deja la lista oculta. Con `prefers-reduced-motion` muestra todos inmediatamente, respetando accesibilidad.
- `guest/catalog-patches/design-03/1.0.0/patch.css` commit `5d2e9801560cd4d67d55c176e23fe7aef1d34ba6`: CSS real `.d03-sequence-ready/.d03-sequence-start`, `@keyframes d03AgendaStepIn`, tonos oscuros de títulos pequeños en todas las escenas, tipografías del original conservadas. Cero rectángulos, flechas, líneas de rombos o animación continua. La plantilla solo muestra momentos proporcionados por el cuestionario.
- QA automatizado del navegador actualizado en `guest/tests/limoneros_visual_browser_acceptance.cjs` commit `5fa1171a509a1d61956c1f4268bc968dd1adef65`. Corrige un umbral antiguo que seguía exigiendo botones demasiado grandes de Lugar, aunque los botones discretos ya estaban aprobados por la autora.

## Evidencia REAL de animación (no solo código o capturas estáticas)

Chromium real en GitHub Actions (viewport 390×844; `reducedMotion:no-preference`), [GUEST D03 Synthetic Media Mobile Layout QA **run 38265776236**](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38265776236), **SUCCESS**. Inspección temporal de `getComputedStyle().opacity` de cada fila:
- 140 ms tras entrar: `[0.488, 0, 0, 0, 0]` — solamente la primera entra.
- ~1.09 s: `[1, 0.982, 0.132, 0, 0]` — tercera está empezando, últimas aún invisibles.
- ~3.54 s: `[1, 1, 1, 1, 1]` — todas completamente visibles, sin animación posterior.
- Al salir y regresar (140 ms): `[0.633, 0, 0, 0, 0]` — la secuencia se reinicia correctamente.
- **9/9** configuraciones de galería/fotos/lugares/prácticos en 320, 390 y 430 px pasan el QA normal de composición, con accesibilidad `reducedMotion:reduce` sin animaciones. Tres capturas de inicio/medio/final y el JSON `limoneros_v4_browser_acceptance.json` están en el artifact `guest-d03-synthetic-mobile-layout-qa` run 38265776236. Importante: estas capturas sintéticas son pruebas técnicas, no aprobación artística de la autora.

## Revisión de la autora

Archivo privado actual con sus 5 fotografías en Biblioteca:
`/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_AGENDA_ENTRADA_SECUENCIAL_REAL_2026-10-12.html`.
Copia exacta de conversación: `/mnt/data/LIMONEROS_D03_AGENDA_ENTRADA_SECUENCIAL_REAL_2026-10-12.html`. El HTML contiene JS con disparador real y CSS V9 insertados, sin las tres capas CSS de intentos antiguos de Agenda, conservando el Lugar con botones discretos aprobado, fotos/galería privadas y medios originales desde Cloudflare. El segundo script pasa `node --check`.

**Estado:** implementación y QA temporal real PASS; aceptación artística de Agenda pendiente de la propietaria. Si Android tiene activada la opción de accesibilidad «reducir/eliminar animaciones», la entrada se desactiva conscientemente. NO habilitar venta; 2 pedidos TEST y Android físico siguen pendientes. No tocar ONE, Partner, STUDIO ni arte original.
