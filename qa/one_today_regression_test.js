const fs=require('fs');
const assert=require('assert');

const src=fs.readFileSync('suite-today-v1.js','utf8');
const app=fs.readFileSync('app.html','utf8');

function has(re,msg){ assert(re.test(src),msg); }
function hasApp(re,msg){ assert(re.test(app),msg); }

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
has(/todayPlanItem>\.todayRead/,'Planning read button must sit below the row and remain inside the item');
has(/white-space:normal/,'Planning read button must be allowed to wrap rather than overflow');
console.log('Planning read controls must stay inside the card');

// Approved ONE grouped header: four module buttons live inside one soft-green container.
hasApp(/\.tabs\{[^}]*padding:4px[^}]*background:var\(--soft\)[^}]*border:1px solid var\(--line\)[^}]*border-radius:14px/,'Approved ONE grouped header container must remain');
hasApp(/\.tab\{[^}]*border:0[^}]*background:transparent[^}]*color:var\(--muted\)/,'Approved ONE grouped header buttons must remain integrated, not separate white pills');
hasApp(/\.tab\.on\{[^}]*background:var\(--dark\)[^}]*color:#fff/,'Approved ONE active module state must remain dark green');
console.log('Approved ONE grouped header: PASS');


/* Behavioral tests on the real functions, not only source-shape checks. */
const vm=require('vm');
function extractFunction(name){
  const token='function '+name+'(';
  const start=src.indexOf(token);
  assert(start>=0,'Missing function '+name);
  const open=src.indexOf('{',start);
  let depth=0,quote='',escp=false;
  for(let i=open;i<src.length;i++){
    const ch=src[i];
    if(quote){
      if(escp){escp=false;continue}
      if(ch==='\\'){escp=true;continue}
      if(ch===quote)quote='';
      continue;
    }
    if(ch==="'"||ch==='"'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'){depth--;if(depth===0)return src.slice(start,i+1)}
  }
  throw new Error('Unclosed function '+name);
}
function makeCtx(extra={}){
  const ctx={console,Math,Number,String,Array,Object,Date,Set,JSON,...extra};
  vm.createContext(ctx);
  return ctx;
}
function loadFns(ctx,names){for(const n of names)vm.runInContext(extractFunction(n),ctx)}

/* Payments parity with the real Payments math. */
{
  const ctx=makeCtx({pay:()=>({settings:{guests:100}})});
  loadFns(ctx,['roundMoney','payCostItem','providerPaymentSummary','activePayProvider']);
  assert.strictEqual(ctx.activePayProvider({status:'hired'}),true);
  assert.strictEqual(ctx.activePayProvider({status:'shortlisted'}),false);
  const cost=ctx.providerPaymentSummary({
    priceType:'fixed',priceFixed:1000,priceExtra:100,
    payments:[
      {status:'paid',kind:'payment',amount:400},
      {status:'paid',kind:'refund',amount:500},
      {status:'scheduled',kind:'payment',amount:200}
    ]
  });
  assert.strictEqual(cost.contracted,1100,'Today must match Payments contracted cost');
  assert.strictEqual(cost.unscheduled,900,'Refund excess must clamp paidNet to zero exactly as Payments does');
  const qty=ctx.providerPaymentSummary({
    costItems:[{mode:'qty',qty:3,rate:125}],
    payments:[{status:'scheduled',kind:'payment',amount:75}]
  });
  assert.strictEqual(qty.contracted,375,'v20 quantity x unit-price costs must be honored');
  assert.strictEqual(qty.unscheduled,300,'Unscheduled amount must respect scheduled payments');
}

/* Payments visual priority: overdue -> nearest <=30d -> grouped unscheduled. */
{
  const map={payOverdue:'Pago vencido',payToday:'Vence hoy',payUpcoming:'Próximo pago',unscheduledPending:'pendientes de programar'};
  const ctx=makeCtx({
    paymentItems:()=>[
      {key:'due-over',n:-2,p:'A',a:800,d:'2026-09-12'},
      {key:'due-21',n:21,p:'B',a:4500,d:'2026-10-15'},
      {key:'due-28',n:28,p:'C',a:300,d:'2026-10-22'}
    ],
    paymentDoc:()=>null,
    paymentDueCard:x=>({key:x.key,title:x.key,meta:''}),
    unscheduledPayments:()=>({count:6,total:16400,rows:[{id:'a',a:1}]}),
    lng:()=> 'es',t:k=>map[k]||k,hashKey:()=> 'group',money:n=>String(n)
  });
  loadFns(ctx,['corePaymentTitle','paymentInfo']);
  const info=ctx.paymentInfo();
  assert.strictEqual(info.over,1);
  assert.strictEqual(info.next,2);
  assert.deepStrictEqual(Array.from(info.items.slice(0,3).map(x=>x.key)),['due-over','due-21','pay:unscheduled:group']);
}

/* Guests approved synthesis: critical -> grouped RSVP -> grouped operations. */
{
  const tr={guestCriticalMany:'cambios de alergias/intolerancias',guestRsvp:'cambios RSVP',guestOps:'cambios operativos'};
  const ctx=makeCtx({lng:()=> 'es',t:k=>tr[k]||k,hashKey:s=>'k'+String(s).length});
  loadFns(ctx,['guestText','guestCat','guestBreakdown','guestGroupKey','guestPriority']);
  const recent=[];
  for(let i=0;i<5;i++)recent.push({key:'a'+i,kind:'rsvpAnswer',title:'R'+i,meta:'',ts:100+i});
  recent.push({key:'att',kind:'attendance',title:'A',meta:'',ts:200});
  recent.push({key:'plus',kind:'plus',title:'P',meta:'',ts:201});
  recent.push({key:'m1',kind:'meal',title:'M1',meta:'',ts:210});
  recent.push({key:'m2',kind:'meal',title:'M2',meta:'',ts:211});
  recent.push({key:'tr',kind:'transport',title:'T',meta:'',ts:212});
  recent.push({key:'st',kind:'stay',title:'S',meta:'',ts:213});
  recent.push({key:'tb1',kind:'table',title:'TB1',meta:'',ts:214});
  recent.push({key:'tb2',kind:'table',title:'TB2',meta:'',ts:215});
  const out=ctx.guestPriority({
    alerts:[{key:'crit',title:'Laura Martínez',meta:'Ha actualizado alergias o intolerancias'}],
    recent
  });
  assert.strictEqual(out.primary.length,3);
  assert.strictEqual(out.primary[0].title,'Laura Martínez');
  assert.strictEqual(out.primary[1].title,'7 cambios RSVP');
  assert.strictEqual(out.primary[1].meta,'5 respuestas · 1 cambio de asistencia · 1 acompañante');
  assert.strictEqual(out.primary[2].title,'6 cambios operativos');
  assert.strictEqual(out.primary[2].meta,'2 menús · 1 transporte · 1 alojamiento · 2 mesas');
  assert.strictEqual(out.primary[1].members.length,7);
  assert.strictEqual(out.primary[2].members.length,6);
}

/* Today is read-only with respect to module data. */
{
  const setters=[...src.matchAll(/localStorage\.setItem\(([^;\n]+)/g)].map(m=>m[0]);
  assert.strictEqual(setters.length,1,'Today must only write its own local cache');
  assert(/todayCacheKey\(\)/.test(setters[0]),'Today local write must target only todayCacheKey');
  assert(!/\b(saveData|pushRemote|saveRemote|writeLocal)\s*\(/.test(src),'Today must never mutate module state');
  assert(!/method\s*:\s*['"]POST['"]/.test(src),'Today must not POST into module APIs');
}

/* Access gate and cache-safety invariants. */
{
  const sw=fs.readFileSync('sw.js','utf8');
  has(/function accessOk\(\)\{return document\.documentElement\.dataset\.oneAccessValidated==='1'\}/,'Today must require validated ONE access');
  hasApp(/document\.documentElement\.dataset\.oneAccessValidated='1'/,'Shell must explicitly mark validated access');
  assert(/\.\(\?:html\|js\|css\)\$/.test(sw)||/html\|js\|css/.test(sw),'Service worker must treat HTML/JS/CSS as fresh');
  assert(/cache:'no-store'/.test(sw)||/cache:"no-store"/.test(sw),'Service worker must request fresh app assets');
}
console.log('ONE Today behavioral QA: PASS');
