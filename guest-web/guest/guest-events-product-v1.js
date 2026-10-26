(()=>{
'use strict';
function txt(el){return String(el?.textContent||'').replace(/\s+/g,' ').trim()}
function brand(){
  const b=document.querySelector('main.wrap>.brand');
  if(b)b.innerHTML='<b style="display:block;font:700 20px/1 system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.08em">GUEST</b><span style="display:block;font:600 17px/1.05 Caveat,Segoe Print,cursive;margin-top:3px">by WeddlySmartDesign</span>';
  const h=document.querySelector('main.wrap>h1');
  if(h&&/Un evento extra|Extra event/i.test(txt(h)))h.textContent='Cada evento, con todos sus detalles.';
  const lead=document.querySelector('main.wrap>.lead');
  if(lead&&/Invitados, tareas|Guests, tasks/i.test(txt(lead)))lead.textContent='Preboda, brunch u otro evento: invitados, invitación propia, confirmaciones, tareas y pagos separados de la boda principal.';
}
function simplify(){
  // ONE parity: preserve the event's original budget, payments and tasks.
  // GUEST-only change is branding, not removal of functional modules.
  brand();
}
let queued=false;const run=()=>{queued=false;simplify()};new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(run)}}).observe(document.documentElement,{childList:true,subtree:true});addEventListener('load',run);setTimeout(run,60);setTimeout(run,350);
})();