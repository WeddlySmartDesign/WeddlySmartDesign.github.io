# GUEST — BLOQUE 05: estado de QA

Fecha: 2026-10-02
Rama exclusiva: `guest-independent`
Estado: **PASS INTERNO / PRUEBA ANDROID REAL PENDIENTE**. No avanzar a catálogo ni publicar todavía.

## Baseline preservado
- Dirección competitiva sellada: `75cee74101df0e3cf76f6b673fe8c2ad08167e0a`.
- GOLD STANDARD PILOT 01 sellado: `89f1a8c9e0c403d572d67969d34adde7b41302d7`.
- Prototipo original preservado: `guest/gold-01-prototype.html` — `10607e62b339bceea1db28f280c0b1eec80be327`.
- Candidato técnico previo preservado: `guest/gold-01-qa-candidate.html` — baseline `3884532d83e1e4bcf5f2a3d6f0482ae8b5fee795`.
- ONE, ONE Partner, STUDIO, `main`, compra, producción y motor GUEST no se han modificado.

## Iteración visual seria — GOLD 01 gate candidate
Candidato aislado:
- `guest/gold-01-gate-candidate.html`
- `guest/gold-01-gate-overlay.css`
- `guest/gold-01-gate-overlay.js`

Dirección aplicada:
- apertura editorial en tres bandas verticales; no sobre, no sello ni monograma circular;
- revelado fotográfico progresivo y hero full-bleed;
- interior con continuidad editorial y puente fotográfico;
- bloque de lugar con dos composiciones arquitectónicas distintas según pareja;
- RSVP integrado en el mismo sistema tipográfico, espacial y cromático;
- cierre full-screen con disparador propio al entrar realmente en viewport y lenguaje de tres bandas que retoma la apertura;
- segunda pareja parametrizada con nombres largos, fecha, ciudad, finca, programa, paleta y fotografías diferentes sin rediseñar estructura.

El control de música falso sigue eliminado. No se anuncia ni simula música en este piloto. La música real opcional deberá implementarse antes de ofrecerla como prestación comercial, pero no bloquea el gate visual del piloto.

## QA automatizado canónico
Workflow aislado: `.github/workflows/guest-gold01-visual-gate.yml`
Test: `guest/qa/gold01_visual_gate_test.mjs`

Run canónico: **36992651725** — `success`
HEAD del run: **c147cf705776bb4f531a9352b2b08bd1288f1a84**

Cobertura:
- 2 parejas parametrizadas;
- 6 viewports por pareja: 360x800, 375x812, 390x844, 412x915, 430x932 y 1440x1000;
- 12/12 casos PASS;
- 0 errores de consola en los 12 casos;
- sin overflow horizontal;
- apertura completa + foco;
- RSVP sí/no;
- campos condicionales;
- descarga ICS con datos de la pareja activa;
- cierre;
- teclado;
- `prefers-reduced-motion`;
- capturas de apertura inicial, movimiento intermedio, hero, puente editorial, lugar, programa, RSVP y cierre;
- capturas visuales adicionales de escritorio.

## Hallazgos detectados y corregidos durante QA
1. El candidato anterior seguía usando recursos demasiado reconocibles de landing premium: monograma circular, dos hojas/puertas y tarjeta inclinada final.
   - Corregido con un sistema de tres bandas y cierre espejo de la apertura.
2. El cierre heredaba el observador genérico y podía completar su animación antes de que el invitado llegara al final.
   - Corregido con `gate-close-in` y observador dedicado a entrada real en viewport.
3. La ilustración de lugar era demasiado genérica y se reutilizaba igual entre parejas.
   - Corregido con variantes arquitectónicas distintas dentro del mismo sistema parametrizable.
4. Se comprobó visualmente escritorio, no solo overflow técnico.
   - Resultado: composición centrada y estable; móvil sigue siendo el soporte primario.

## Gate GOLD STANDARD A–H
- **A IMPACTO — PASS interno.** La diferencia depende de movimiento editorial real y continuidad, no de una plantilla estática.
- **B COHERENCIA — PASS interno.** El nivel se mantiene después del hero.
- **C DIFERENCIACIÓN — PASS interno.** No depende de sobre lacrado ni replica la apertura de La Qualité.
- **D PERSONALIZACIÓN — PASS.** Dos parejas con identidad distinta funcionan sobre el mismo sistema.
- **E OPERATIVA — PASS.** La propietaria no ha diseñado ni manipulado assets/código.
- **F COSTE — PASS.** Sin herramienta nueva de pago.
- **G PERFORMANCE/MÓVIL — PASS automatizado; PENDIENTE Android real.**
- **H RSVP — PASS interno.** Visualmente nativo y funcional en el piloto.

## Estado de aprobación
No se declara todavía BLOQUE 05 completamente SELLADO porque el GOLD STANDARD exige prueba en Android Chrome real de la propietaria.

La intervención de la propietaria queda limitada a:
1. abrir el candidato terminado en su móvil;
2. recorrer apertura → interior → RSVP → cierre;
3. indicar únicamente si percibe un problema real de fluidez, legibilidad o nivel visual.

No debe diseñar, ajustar, probar código ni hacer QA técnico.

## NEXT ACTION
**Prueba Android real de GOLD 01.**

Si no aparece un defecto real de dispositivo o una objeción visual de nivel:
- sellar BLOQUE 05;
- congelar GOLD 01 como primer sistema visual aprobado;
- pasar al siguiente bloque lógico de industrialización sin construir todavía un catálogo masivo.

Si aparece un defecto:
- corregir solo el defecto reproducido;
- repetir gate afectado;
- no reabrir investigación ni bloques 01–04.
