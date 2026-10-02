# GUEST GOLD STANDARD — PILOT 01
Fecha: 2026-10-02
Estado: BLOQUE 04 SELLADO
Rama de trabajo: guest-independent

## Objetivo
Demostrar o refutar la viabilidad de GUEST con UNA invitación completa que alcance estándar premium real sin trabajo de diseño de la propietaria y sin comprar herramientas nuevas.

El piloto NO se usa como catálogo. Es una prueba de producto.

## Dirección elegida
Nombre interno: GOLD 01 — EDITORIAL MOTION

Motivo:
- evita competir en ornamentación recargada;
- recoge lo mejor detectado en referencias premium: primera impresión, movimiento y remate;
- mantiene un interior más sobrio y coherente;
- permite demostrar exclusividad sin depender del cliché del sobre lacrado;
- es altamente parametrizable y, por tanto, escalable.

No se usa públicamente el nombre hasta cerrar catálogo/naming.

## 1. Apertura
Objetivo: producir el “esto no lo hago en Canva” en los primeros 5 segundos.

Reglas:
- NO sobre digital como recurso principal.
- Entrada a pantalla completa.
- Una única interacción deliberada: “Entrar / Abrir nuestra invitación”.
- Ese gesto habilita también el audio por limitaciones de autoplay móvil.
- Transición en 3 capas: superficie/imagen -> información mínima -> escena principal.
- Duración objetivo total: 3,5–5,0 s.
- Nada rebota, gira o aparece porque sí.
- Movimiento con easing orgánico y profundidad; máximo 1 movimiento protagonista + 2 secundarios.
- Debe poder cambiar nombres, fecha, fotografía y paleta sin rehacer la animación.

Primera propuesta técnica:
una portada editorial dividida en capas verticales que se desplazan con distinta velocidad y revelan la foto/nombres como si se abriera una composición impresa, no un sobre.

## 2. Portada principal
Debe sentirse como dirección de arte, no como una card.

Elementos:
- nombres como elemento protagonista;
- fecha y lugar secundarios;
- fotografía integrada, nunca metida en círculo/arco/marco gratuito;
- monograma opcional;
- indicador de scroll extremadamente discreto;
- control de música pequeño y coherente con la estética.

Prohibido:
- marcos decorativos genéricos;
- fotos deformadas;
- textos pequeños;
- acumulación de iconos;
- etiquetas tipo app.

## 3. Lenguaje de movimiento
Sistema único para toda la invitación:
- scroll reveal suave y breve;
- máscaras/clip-path para fotos;
- líneas o tipografía que entren como composición editorial;
- parallax muy limitado (solo donde aporte profundidad);
- transiciones de sección con continuidad visual;
- ninguna animación continua salvo un detalle ambiental muy sutil.

Performance:
- priorizar CSS/SVG/JS sobre vídeo;
- vídeo solo si existe un caso visual que CSS/SVG no pueda resolver con calidad;
- nada de librerías pesadas en el piloto salvo necesidad demostrada.

Accesibilidad:
- respetar prefers-reduced-motion;
- no bloquear lectura por animaciones.

## 4. Interior
El interior debe mantener el nivel de portada. No se acepta “wow inicial + landing genérica”.

Arquitectura base:
1. apertura;
2. portada;
3. cuenta atrás;
4. detalles esenciales;
5. lugar/ubicación;
6. programa;
7. bloques elegibles;
8. RSVP;
9. cierre.

Bloques elegibles:
- historia;
- alojamiento;
- transporte;
- dress code;
- regalos;
- niños;
- +1;
- preguntas personalizadas;
- evento extra;
- galería.

Cada bloque tiene variantes internas, pero comparte el mismo sistema visual del diseño.

## 5. RSVP
Criterio clave: no puede parecer un formulario externo incrustado.

Debe:
- utilizar la misma tipografía, espaciado, botones, fondos y microinteracciones;
- dividir preguntas largas en grupos legibles;
- mostrar progreso si el número de preguntas lo requiere;
- mantener controles táctiles grandes;
- cerrar con confirmación visual coherente con la invitación.

El motor GUEST existente se reutiliza; no se reescribe funcionalidad salvo adaptador visual necesario.

## 6. Cierre
El cierre es parte del producto, no un pie de página.

Debe incluir:
- frase final personalizable;
- nombres/monograma;
- escena animada breve que cierre la experiencia;
- posibilidad de fotografía final o recurso gráfico;
- CTA de confirmar solo si todavía no se ha hecho.

Objetivo emocional: sensación de final deliberado, no de “se acabó la web”.

## 7. Personalización industrializable
La personalización debe parecer amplia sin rediseñar.

Variables permitidas:
- nombres;
- fecha/hora;
- uno o varios lugares;
- textos;
- fotos;
- paleta dentro de combinaciones preaprobadas;
- música;
- monograma/iniciales;
- bloques activos;
- contenido de cada bloque;
- ilustración del lugar cuando aplique.

Variables BLOQUEADAS:
- estructura;
- sistema tipográfico principal;
- lógica de movimiento;
- jerarquía;
- número y posición de elementos esenciales;
- ritmo de la experiencia.

Objetivo operativo futuro:
una compra normal debe resolverse alimentando parámetros y assets, no diseñando desde cero.

## 8. Activos visuales
Herramientas autorizadas en piloto:
- HTML/CSS/JS;
- SVG;
- Canva Premium ya disponible;
- generación de imagen/ilustración si aporta valor.

No se compra software adicional durante piloto.

Si un activo externo requiere trabajo manual recurrente de la propietaria, se descarta esa solución.

## 9. Calidad móvil
Dispositivos objetivo primario: móvil vertical.

Debe probarse como mínimo en:
- 360x800;
- 390x844;
- 412x915;
- Android Chrome real de la propietaria.

Criterios:
- nada ilegible;
- nada cortado;
- ningún botón fuera;
- fotos sin deformación;
- 60fps percibidos en las transiciones principales en dispositivo razonable;
- carga inicial visual útil rápida;
- imágenes no críticas lazy-loaded.

Objetivo técnico inicial:
- evitar vídeo grande en above-the-fold;
- assets de imagen optimizados WebP/AVIF cuando sea viable;
- no cargar todas las fotos al inicio.

## 10. Gate de viabilidad
El piloto se aprueba SOLO si cumple todas:

A. IMPACTO
La apertura genera una diferencia clara frente a una plantilla Canva.

B. COHERENCIA
El interior mantiene el nivel visual; no cae después de la portada.

C. DIFERENCIACIÓN
No depende del sobre lacrado ni replica visualmente a La Qualité.

D. PERSONALIZACIÓN
Una segunda pareja puede usarlo cambiando datos/activos sin rediseño estructural.

E. OPERATIVA
La propietaria solo revisa en móvil y da feedback; no diseña.

F. COSTE
No requiere herramienta nueva de pago para funcionar.

G. PERFORMANCE
Funciona correctamente en móvil real.

H. RSVP
El formulario parece parte nativa del diseño.

Si una segunda iteración razonable sigue fallando en A, B, D o E: GUEST se descarta.

## 11. Benchmark de aprobación
Comparación obligatoria contra:
- La Qualité: apertura/cierre y percepción de servicio premium.
- Join Wedding: fluidez, mobile-first y experiencia integrada.
- Bliss & Bone: dirección gráfica y consistencia de catálogo.
- una referencia española adicional de servicio semi-personalizado.

No se exige ganar cada característica aislada. Se exige que la experiencia global de GUEST tenga una razón defendible para existir.

## 12. Siguiente microbloque
BLOQUE 05:
- construir prototype aislado guest/gold-01-prototype.html;
- no conectar a compra ni producción;
- usar datos ficticios;
- implementar apertura + portada + 2 secciones + RSVP visual + cierre;
- revisar técnicamente antes de mostrarlo.
