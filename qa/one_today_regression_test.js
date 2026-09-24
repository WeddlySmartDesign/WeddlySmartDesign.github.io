const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('suite-today-v1.js','utf8');

function has(re,msg){ assert(re.test(src),msg); }

// ONE · Hoy — invariantes aprobados.
// Invitados NO puede volver a "alertas + recientes -> primeros 3".
has(/function\s+guestPriority\s*\(/,'Hoy/Invitados debe conservar guestPriority()');
has(/function\s+guestBreakdown\s*\(/,'Hoy/Invitados debe conservar el desglose agrupado');
has(/function\s+guestGroupKey\s*\(/,'Hoy/Invitados debe conservar claves estables por grupo');
has(/function\s+guestItemRead\s*\(/,'Hoy/Invitados debe conservar lectura por grupo');
has(/function\s+guestItemRow\s*\(/,'Hoy/Invitados debe renderizar grupos con lectura propia');
has(/guestRsvp:'cambios RSVP'/,'Hoy/Invitados debe conservar el bloque Cambios RSVP');
has(/guestOps:'cambios operativos'/,'Hoy/Invitados debe conservar el bloque Cambios operativos');
has(/add\(c\.answer[^\n]+respuestas/,'Hoy/Invitados debe desglosar respuestas RSVP');
has(/add\(c\.attendance[^\n]+cambios de asistencia/,'Hoy/Invitados debe desglosar cambios de asistencia');
has(/add\(c\.plus[^\n]+acompañante/,'Hoy/Invitados debe desglosar acompañantes');
has(/add\(c\.meal[^\n]+menú/,'Hoy/Invitados debe desglosar menús');
has(/add\(c\.transport[^\n]+transporte/,'Hoy/Invitados debe desglosar transporte');
has(/add\(c\.stay[^\n]+alojamiento/,'Hoy/Invitados debe desglosar alojamiento');
has(/add\(c\.table[^\n]+mesa/,'Hoy/Invitados debe desglosar mesas');
has(/renderGuests\(\)[\s\S]*?guestPriority\(g\)/,'renderGuests debe consumir la agrupación aprobada');
assert(!/function\s+renderGuests\(\)[\s\S]{0,500}g\.alerts\.concat\(g\.recent\)[\s\S]{0,250}slice\(0,3\)/.test(src),
  'REGRESIÓN: Invitados ha vuelto a cortar alertas+recientes sin agrupar');

// Pagos: un próximo <=30 días no puede quedar tapado por saldos sin programar.
has(/function\s+paymentInfo\s*\(/,'Hoy/Pagos debe conservar paymentInfo()');
has(/add\(first,urgent\[0\]\)/,'Hoy/Pagos debe priorizar vencido/vence hoy');
has(/add\(first,upcoming\[0\]\)/,'Hoy/Pagos debe reservar hueco para próximo pago <=30 días');
has(/add\(first,unsItem\)/,'Hoy/Pagos debe agrupar saldos sin programar como tercer bloque');
has(/function\s+unscheduledPayments\s*\(/,'Hoy/Pagos debe calcular saldos sin programar agrupados');

// Lectura compartida y scroll móvil siguen siendo invariantes.
has(/readButtonMany\(x\.members\)/,'Los grupos de Invitados deben marcar todos sus miembros como leídos');
has(/currentUnread\.guests=\[\.\.\.new Set/,'Marcar todos debe incluir todos los miembros agrupados');
has(/oldTop=oldScroll\?oldScroll\.scrollTop:0/,'Hoy debe conservar posición de scroll al actualizarse');

console.log('ONE Today regression guard: PASS');

// Planning mobile layout: read action must remain inside its card.
has(/todayCard todayCardPlanning/,'Planning card must keep its dedicated layout hook');
has(/todayPlanDeadline/,'Planning must keep the deadline in a bounded top-row column');
has(/todayItemMain\{min-width:0;flex:1 1 auto\}/,'Planning/main item text must be allowed to shrink inside flex rows');
has(/todayPlanItem>\\.todayRead/,'Planning read button must sit below the row and remain inside the item');
has(/white-space:normal/,'Planning read button must be allowed to wrap rather than overflow');
console.log('Planning read controls must stay inside the card');
