# Entrada 91 — Limoneros D03 · Lugar: títulos y botones legibles

**Fecha 12/10/2026.** Rama `guest-independent`. **Corrección sobre la plantilla REAL**, no edición de captura. Estado de D03: `certification-pending`, TEST ONLY, NO SALE. Únicamente escena **Lugares**; Historia ya aceptada en dirección y tamaño por la autora.

## Petición exacta (captura original de la propietaria)
- Foto de celebración fundida: **la autora dice «La foto muy bien»**; no cambiar encuadre, fotos ni fondo.
- Sustituir el CTA largo «Web del lugar» por «Web» o «Ver»; decisión: **«Web»** para ambas sedes, utilizando exclusivamente el campo real `websiteUrl`, sin inventar URL.
- Los textos de los CTA y «Nos vemos aquí», «Ceremonia» y «Celebración» estaban poco visibles. Corregir tamaño, peso y contraste manteniendo las tipografías embebidas originales, nunca sans genérico.

## Cambio implementado
- `guest/catalog-patches/design-03/1.0.0/patch.css` commit `a89c4a84e881541cdc379b7791a916b8a6c0acc2`: refuerzo de kicker y subtítulos `var(--smallcaps)`, peso 600 y tamaño responsive >=19 CSS px; color #4a2b40 y espaciado reducido. CTA de 50 px de alto, dos columnas, borde completo suavemente redondeado, fondo crema translúcido 0.86 y contraste oscuro, sin flechas. **Se corrige un error previo:** CSS V4 declaraba `background:transparent!important;border:0!important` y por eso el estilo de botón que aparecía en la revisión anterior se reducía a una curva inferior. Los nuevos overrides `!important` se han probado con estilos computados, no suposiciones. Respeta `focus-visible` y `prefers-reduced-motion`.
- El código del **mismo parche real** trae el fundido aprobado de la foto opcional del lugar (doble gradiente horizontal/vertical, sin sombra ni marcos) para no depender de un estilo insertado únicamente en el HTML privado. El `fit=full` del esquema se mantiene.
- `guest/catalog-patches/design-03/1.0.0/patch.js` commit `3b2a1fd8d9299391cf4e0229733e7ebcb652e401`: después del renderizador canónico se sustituye **solo el rótulo textual** «Web del lugar» por «Web» en las acciones ya creadas. Web y Mapa son independientes para ceremonia y celebración, solo aparecen cuando los respectivos `websiteUrl`/`mapsUrl` existen.

## Evidencia y archivos privados
- Test Chromium reforzado con lectura de estilos **reales** por ancho [run `38259872696`](https://github.com/WeddlySmartDesign/WeddlySmartDesign.github.io/actions/runs/38259872696) **SUCCESS**, 9/9 combinaciones. Test `guest/tests/limoneros_visual_browser_acceptance.cjs` commit `59123b669ac97b68454d3d2a0f083cf2a20624a7` valida texto de enlaces «Web»/«Cómo llegar», tipografías/tamaños/peso, fondo, border radius, doble máscara sin sombra y 2 sedes.
- Validación adicional de navegador Chromium **con las cinco fotografías reales dentro del HTML privado** (no placeholders sintéticos) ejecutada en entorno local con `page.set_content`, ancho 320/390/430: **3/3 PASS**, 0 errores JS, sin scroll lateral; títulos 600 y >=19px; 4 botones por dos sedes, fondo computado `rgba(255,249,239,0.86)`, borde 1px y radios 999px, 50px alto, foto cargada con máscara y sin sombra. Captura 390 `/mnt/data/limoneros_lugar_v7_390.png`. URLs en la fixture privada son claramente de ejemplo; los pedidos auténticos usarán las URLs del cuestionario.
- Preview privada basada en paquete Cloudflare-stage real `38259716522` (no CSS improvisado encima del HTML anterior), incluye **cinco fotos de autora solo en archivo local/Biblioteca**, sin subirlas a GitHub ni al sitio público: `/GUEST by WeddlySmartDesign/DESIGN_03_LIMONEROS/LIMONEROS_D03_LUGAR_WEB_BOTONES_LEGIBLES_2026-10-12.html`. SHA256 `d765bfe4d7ae213079edda51f6c0079a9b5dd471f6d83795d2abaaeea3a402b7`, 3.419.719 bytes. Mismo archivo de esta conversación `/mnt/data/LIMONEROS_D03_LUGAR_WEB_BOTONES_LEGIBLES_2026-10-12.html`. Necesita internet para cargar vídeos y fondos desde Cloudflare.
- QA técnico de catálogo `38259872701` SUCCESS; QA independiente `38259872769` SUCCESS.
- **Advertencia de despliegue**: la ejecución automática de lectura pública posterior al commit JS `38259716235` produjo FAIL por desajuste de HTML servido vs stage generado, aunque HTTP 200 y build local correcto (cache o pendiente de publicación). **La versión privada está correcta y comprobada, pero NO afirmar que la URL pública haya recibido ya estos últimos ajustes sin una lectura exacta nueva**.

## Punto de continuidad
Esperar única revisión visual de **Lugares** en el HTML privado anterior; sin tocar fotografía, Historia, Agenda, Práctico, Galería ni Cierre. Foto Lugar aceptada; tipografía y botones **aún pendientes de aprobación visual final de la autora**. No modificar ONE, ONE Partner, STUDIO, Botánica, VEIL LIGHT ni rama main. Después seguir microbloque Agenda.

