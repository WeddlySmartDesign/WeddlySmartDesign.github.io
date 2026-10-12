# Entrada 88 — Auditoría visual de vídeo Android de la autora · Limoneros

**Fecha:** 12/10/2026. **Origen:** vídeo original de revisión en chat (39,61 segundos, móvil Android). No se sube ese vídeo privado a GitHub. **Estado:** AUDITORÍA VISUAL, SIN CAMBIO DE DISEÑO NI APROBACIÓN.

## Lo que se ve (evidencia visual directa)

- 00–04 s, Historia: el texto «Nuestra historia / Érase una vez...» se lee y existe foto de pareja, pero se ve como fotografía horizontal rectangular superpuesta al lienzo pintado, con borde visual abrupto, sin tratamiento integrado. La transición entre portada e Historia todavía muestra en portada «Descubrir nuestra historia ↓»; no incorporar nuevas flechas a ningún botón.
- 04–12 s, Lugares: la fotografía cargada es de la celebración (mesas) pero aparece en la cabecera general antes de «Ceremonia». Ceremonia y Celebración tienen «Cómo llegar» y «Web del lugar», pero hay excesiva similitud tipográfica entre datos y acciones; revisar lectura y destino preciso de cada botón cuando exista configuración real.
- 12–20 s, Agenda: cinco momentos cargados y sin rombos, pero composición sigue siendo lista estática con vacíos excesivos y repetición de filas; animación sutil por entrada ya existe técnicamente, pero vídeo no demuestra una solución visual suficientemente editorial.
- 20–27 s, Práctico: cuatro secciones y enlaces cargados, sin recuadros ni flechas. El bloque tiene varias líneas muy juntas y mucha información del cuestionario: necesitan jerarquía/aire sin comprometer los campos ni inventar datos.
- 27–33 s, Galería: cuatro fotografías reales dispuestas en cuadrícula 2 × 2; composición uniforme, dos encuadres verticales muy próximos, y vacío excesivo antes de la transición oscura de la escena de cierre. Fotografía y galería SÍ se muestran en el HTML de revisión privado; no confundir con la demo pública sin foto.
- 32–39, Cierre: animación original intacta, pero la frase sobrepuesta «Lo más bonito será celebrarlo juntos.» coincide visualmente con las golondrinas y la banda «Os esperamos» de la escena de vídeo, restando legibilidad y dañando la estética. CTA abajo parece rectángulo ajeno al trabajo editorial; validar su acabado visual, nunca alterar el archivo de vídeo.

## Modo obligatorio de corrección, pantalla a pantalla

1. **Historia (primero):** integrar foto sin marco/arco ni recreación, conservar la autoría y tipografías embebidas. Probar variantes de cuestionario preset/custom/none, con y sin foto, vertical/horizontal; no confundir variantes de `story.textMode` con tres tipografías si no está probado. Aplicar CSS/JS del catálogo D03 REAL, no imagen estática. Solo pasar a Lugares tras verificación Android/artística de la autora.
2. **Lugares:** ordenar semánticamente foto opcional y sedes; 1/2 sedes, mapa y web por cada sede; no flechas.
3. **Agenda:** rehacer diseño editorial, 1–5 momentos, animación sutil no invasiva, sin rombos/líneas descentradas.
4. **Práctico:** 0–4 módulos, densidad alta y campos reales con links, sin cajas, respetar arte de golondrinas.
5. **Galería:** 0–4 imágenes, varios aspectos, composición editorial y uso del espacio sin rellenar con contenido inventado.
6. **Cierre:** reposicionar la frase fuera de aves/banda y armonizar CTA sin modificar vídeo, validar legibilidad durante toda la animación.

**Control crítico:** NO proclamar nuevamente diseño finalizado o aceptado por QA sintético. La inspección anterior de GitHub/CI cubre carga y desbordamientos, NO sustituye aceptación editorial. No solicitar otra vez los materiales originales. No tocar productos ni artes congelados. Mantener `commercialReady=false`, `ownerVisualApproved=false`.

**Continuidad:** se ha revisado el vídeo y se empieza con Historia, sin cambios cosméticos todavía en esta entrada. Documento de referencia para siguientes microbloques: `GUEST_UNIVERSAL_DESIGN_ACCEPTANCE_CONTRACT_V1.md`, `guest/START_HERE.md`, `guest/GUEST_PROJECT_STATUS_V1.json`.
