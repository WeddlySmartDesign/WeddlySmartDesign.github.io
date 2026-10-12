# Entrada 100 — Limoneros D03 · aprobación de Galería y Cierre, corrección de reproducción de los MP4

**Fecha: 12/10/2026. Rama exclusiva: `guest-independent`.** Esta entrada registra dos aprobaciones **expresas** de la propietaria; no se deben pedir otra vez. No modifica el máster visual ni archivos MP4 originales ni los productos congelados.

## Aprobaciones textuales de la propietaria

1. Tras revisar la **Galería** con carrusel 1 foto por paso, fotografías **fundidas en el fondo** y título fuera de las golondrinas, la propietaria respondió: **«Aprobado. Vamos con el cierre»**. **Galería APROBADA visualmente**. Se conservan reglas universales 0–4 fotos, sin collage, sin flechas.
2. Tras revisar la explicación de la causa de portada/cierre estáticos, la corrección de bucles de los MP4 originales y el botón **«Confirmar asistencia»** en estilo discreto integrado con el paisaje nocturno, la propietaria respondió: **«Aprobado»**. **Cierre, presentación del botón RSVP y reproducción esperada de ambos vídeos APROBADOS visualmente**. La aprobación no significa que ya existan pedidos reales o certificación comercial.

**Otros bloques**: Historia y Lugar se aceptaron en revisiones anteriores; Práctico recibió una aceptación operativa expresa («No puedo más, así que aprobado») y queda aprobado sin atribuir entusiasmo. **Agenda sigue sin aceptación estética definitiva**: la propietaria la consideró demasiado básica pese a probarse la entrada escalonada. La aprobación de Cierre NO equivale a `ownerVisualApproved` de todo D03.

## Causa concreta y archivos modificados

- Archivos MP4 originales de portada y cierre reproducían una sola vez, y el vídeo quedaba en el último frame; en una reproducción larga/tras scroll parecía estático. No son imágenes, y los MP4 originales **NO se reencodifican ni reemplazan**.
- `guest/catalog-patches/design-03/1.0.0/patch.js` commit **`2cbf6100c69b02909c0fe2ea336926ccc88c4a95`**: `installCinematicPlayback()` mantiene vídeos `muted` y `playsInline`, añade `loop`, reproducción en la escena visible, pausa al salir y reactivación al entrar (y eventos de visibilidad). Al reiniciar el clip original de cierre, reinicia la entrada de texto `#closing.started` para sincronizar la frase con el nuevo ciclo. Respeta `prefers-reduced-motion`, no añade vídeos falsos.
- `guest/catalog-patches/design-03/1.0.0/patch.css` commit **`be94b11badd6b618aea7243227ec890ecce21547`**: acción RSVP con contorno fino, esquinas redondeadas y fondo oscuro casi transparente, 50 px mínimo y contraste suficiente; sin recuadro rectangular ni flechas, siguiendo la discreción aprobada en Lugar.
- **Importante para las revisiones privadas Android**: abrir un HTML desde `content://download` no permite resolver rutas relativas de MP4; la preview privada aprobada `LIMONEROS_D03_PORTADA_CIERRE_VIDEOS_RSVP_CORREGIDOS_2026-10-12.html` se generó apuntando a los **medios originales publicados por HTTPS**. No atribuir al motor del cuestionario un fallo exclusivo de la ruta local. No confundir el archivo privado (fotos insertadas solo en esa descarga) con la URL pública test-only.

## Evidencia técnica

- Prueba adicional Chromium con los **dos MP4 reales**, comprobó avance `currentTime` y reinicio del clip de portada ~8.5 s y cierre ~9 s; sin usar vídeos sintéticos de duración reducida para justificar visualmente la aprobación.
- GitHub Actions **SUCCESS** en commit `be94b11b`: catálogo `38282995424`, etapa estática `38282995317`, diseño móvil sintético `38282995505`, lectura pública `38282995824`, independiente `38282995429`. QA de regresión de loop y RSVP en commit `fa9fa7ec`, browser `38289775235` y catálogo `38289775176` SUCCESS (independiente de último commit seguía ejecutándose en el momento de registrar la aprobación).
- El botón «Confirmar asistencia» **NO cambia destino ni semántica RSVP**; únicamente su aspecto. El cierre mantiene original nocturno con pájaros/guirnaldas.

## Regla de continuidad

**NO reabrir Galería ni Cierre para pedir otra aprobación visual.** Mantener estados aprobados en `GUEST_PROJECT_STATUS_V1.json`. Lo siguiente es completar las puertas comerciales pendientes, priorizando la revisión estética global de Agenda **solo si resulta necesaria para cerrar el diseño**, casos con campos opcionales y **2 pedidos TEST reales**, paridad de preview/final y RSVP, prueba Android física. **No habilitar Stripe/venta** sin pruebas completas ni alterar ONE, ONE Partner, STUDIO, Botánica ni diseños congelados.

**Estado global: `certification-pending`, `commercialReady=false`, `backendRealE2eVerified=false`, `androidPhysicalVerified=false`.**
