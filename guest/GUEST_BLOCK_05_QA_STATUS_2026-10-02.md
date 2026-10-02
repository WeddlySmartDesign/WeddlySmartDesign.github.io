# GUEST — BLOQUE 05: estado de QA

Fecha: 2026-10-02
Rama exclusiva: guest-independent
Estado: ABIERTO. Gate NO aprobado. No avanzar a catálogo.

## Microbloque 05.1 — baseline comprobado
Confirmados los commits 75cee74101df0e3cf76f6b673fe8c2ad08167e0a, 89f1a8c9e0c403d572d67969d34adde7b41302d7 y 10607e62b339bceea1db28f280c0b1eec80be327. Head inicial: 10607e62b339bceea1db28f280c0b1eec80be327. Leídos los tres archivos pedidos.

Existe también GUEST_GOLD_STANDARD_PILOT_SPEC_2026-10-02.md con tiempos diferentes (1,5–3 s frente a 3,5–5 s). Prevalece el PILOT_01 nombrado explícitamente por la propietaria; el candidato termina apertura a 3,7 s. No se modifica ninguna especificación sellada.

## Microbloque 05.2 — candidato preparado, NO validado visualmente
Archivo separado: gold-01-qa-candidate.html; commit 3884532d83e1e4bcf5f2a3d6f0482ae8b5fee795. El prototipo original permanece intacto en repositorio.

Correcciones de código: tipografía y controles ampliados; hero sin padding de sección heredado y sin columna estrecha para nombres; profundidad de transición; bloqueo de scroll y foco durante entrada; foco al terminar; reduced motion; lectura sin JS; etiquetas explícitas; radios nativos obligatorios; menú condicionado a asistencia; confirmación explícita de simulación sin guardar ni enviar datos; calendario ICS descargable con fechas UTC; mapa de zona ficticia; firma Caveat con capitalización correcta; composición ampliada en escritorio.

Retirado control de música falso: falta implementar música real opcional. No se considera requisito resuelto.

Verificación realizada: sintaxis JS mediante node --check (pasa); inspección estática de código. No equivale a validar interacciones en navegador.

## Bloqueo observado
agent-browser no está instalado; Playwright sí, pero no tiene ejecutable Chromium. Dos intentos de instalación (CLI disponible y CLI del runtime) reciben archivos truncados/no ZIP. No se ha podido renderizar el candidato. No existen capturas ni pruebas de viewport válidas en esta sesión.

## Pendientes antes de cerrar BLOQUE 05
1. Recuperar navegador y revisar baseline/candidato en 360x800, 390x844, 412x915, 430 px y escritorio; capturar apertura, interior, RSVP y cierre.
2. Validar errores de consola, flujo sí/no, teclado, calendario, scroll, fotos cargadas, fuentes, reduced motion y JS desactivado.
3. Implementar configuración parametrizada real y una segunda pareja con nombres largos, fecha, fotos y módulos distintos; medir esfuerzo. Actualmente los contenidos continúan hardcoded.
4. Música real opcional; confirmar requisitos de apertura y cierre completo.
5. Mejorar dirección de arte del lugar (SVG actual muy básico), cierre y momentos distintivos si la revisión lo confirma.
6. Comparación visual directa con referencias selladas. No se han asignado notas ni afirmado superioridad sin evidencia.
7. Segunda iteración seria solo tras revisión visual. Este candidato es corrección técnica parcial y NO cuenta como segunda iteración seria del gate.
8. Prueba móvil real final, sin trasladar QA básico a la propietaria.

## Límites preservados
Solo dos archivos nuevos bajo guest/. Sin modificar ONE, ONE Partner, STUDIO, motor GUEST, main, producción, compra o catálogo. Sin compra de herramientas. Un bloqueo de entorno no demuestra inviabilidad comercial; no procede aprobar ni descartar GUEST por él.
