# GUEST Design 02 — BOTÁNICA CINEMÁTICA · reconstrucción editorial

Fecha: 2026-10-08. Estado: **CANDIDATA COMPLETA DE REVISIÓN VISUAL. NO APROBADA, NO CERTIFICADA, NO COMERCIALMENTE CONGELADA.**

## Entrega íntegra revisable
- Archivo autocontenido en la conversación: `GUEST_D02_BOTANICA_CINEMATICA_REVISION_FINAL.html` (aprox. 11.6 MB).
- SHA256: `c48ec291874c9b63d5edd2297a03ffd799555d134a3748bae3480b6f63abb1de`
- Nota: el nombre del archivo no representa URL de producción ni archivo desplegado en GitHub Pages. No inventar link. Es necesario conservar o trasladar el HTML completo para futura integración.

## Cambios verdaderos de arquitectura (no parches V22)
- Se descartaron como base V15F/V18/V20/V21/V22 y el primer rebuild fallido.
- Apertura y cierre comparten el vídeo A01 aprobado en alta intensidad, cada uno con su tratamiento de entrada/salida en papel marfil.
- A02 mantiene **movimiento real** dentro del cuerpo. Se precompuso offline sobre el mismo color RGB del papel `#f7f1e8` con disolución cromática en **los propios fotogramas**, no con máscaras CSS Android ni overlay fijo. Se conservó un segundo tratamiento derivado de A01 para la continuidad del tramo práctico-galería. Ningún recurso requiere créditos Recraft nuevos.
- El cuerpo es una sola superficie editorial; no fondos completos de 100vh independientes, ni espejos, mosaicos, tarjetas de fondo, máscaras CSS o fixed/sticky.
- Fotografía de pareja real en Story, fotografías reales en Lugar/es y Galería sin tintar ni deformar. La foto en Story y Lugar recibe movimiento mínimo de cámara y transición a papel sin destruir nitidez.
- Práctico es visual editorial con filas enteras accesibles y signos + (no flechas), con contenido al abrir; no bloques de SaaS.
- Orden contractual: Portada → Contador → Story → Lugar/es → Agenda → Práctico → Galería → RSVP + Cierre (mismo acto).
- Contenido y variaciones mediante `BOTANICA_APPLY_CONFIG(config)`; sin ajustes manuales por pareja en el prototipo. No se integra aún con las rutas reales del contrato común. Los enlaces RSVP/direcciones sin URL configurada abren un aviso de muestra: **NO son un RSVP de producción**.

## QA completado
- Captura visual integral del default 390×844; movimiento real y reproducción nativa de los cinco elementos de vídeo comprobados; sin JS errors.
- Quince pruebas de estructura de contenido: anchos 360, 390 y 430px por cinco variantes (default, máximo con nombres largos y dos lugares, mínimo con módulos ausentes, sin fotografía, dos lugares con foto).
- Cero errores de ejecución, cero desbordamientos horizontales, cero cajas de texto examinadas fuera de viewport en las 15 variantes.
- Prácticos expanden y cierran; el botón RSVP abre un aviso de prototipo cuando no tiene la ruta real.
- Comprobado en HTML que no existe fondo fixed/sticky, CSS mask ni tiled/mirrored wallpaper.

## GATES NO SUPERADAS / pendientes
1. Evaluación real por propietaria en Android: continuidad, valor de A01/A02, calidad visual y diferencia contra Canva premium.
2. Revisión sobre motores de ejecución reales Android/Chrome más allá del navegador Chromium del QA automatizado.
3. Adaptador al cuestionario/schema/renderer común GUEST, destinatario y RSVP real sin reimplantar motores existentes.
4. Validación de segundo pedido completo, variaciones ES/EN, fotos opcionales y revisión propietaria <5 minutos.
5. Aprobación comercial y congelación **solo** después de esos gates.

REGLAS ABSOLUTAS: no tocar ONE, ONE Partner, STUDIO, VEIL LIGHT congelado ni el core GUEST; no enviar/publicar/conectar Stripe mientras no se certifique.

## Criterio de continuidad
No regresar a la arquitectura de parches de fondos. Si esta candidata no supera el listón premium en Android, comparar con V14/V15E como evidencia visual; evitar otra sucesión de retoques ciegos.