(()=>{
'use strict';
function txt(el){return String(el?.textContent||'').replace(/\s+/g,' ').trim()}
function brand(){
  const b=document.querySelector('main.wrap>.brand');
  if(b)b.innerHTML='<b style="display:block;font:700 20px/1 system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.08em">GUEST</b><span style="display:block;font:600 17px/1.05 Caveat,Segoe Print,cursive;margin-top:3px">by WeddlySmartDesign</span>';
  const h=document.querySelector('main.wrap>h1');
  if(h&&/Un evento extra|Extra event/i.test(txt(h)))h.textContent='Cada evento, con sus invitados.';
  const lead=document.querySelector('main.wrap>.lead');
  if(lead&&/Invitados, tareas|Guests, tasks/i.test(txt(lead)))lead.textContent='Preboda, brunch u otro momento de la boda: decidís quién está invitado y gestionáis sus respuestas sin mezclarlo con la celebración principal.';
}
function simplify(){
  brand();
  document.querySelectorAll('.sectionTitle').forEach(s=>{
    const h=s.querySelector('h2'),t=txt(h);
    if(/Presupuesto y pagos|Budget & payments|Tareas específicas|Specific tasks/i.test(t)){
      const next=s.nextElementSibling;s.remove();if(next&&(next.classList.contains('budgetHero')||next.classList.contains('card')))next.remove();
    }
  });
  document.querySelectorAll('.summary').forEach(s=>{const kids=[...s.children];if(kids.length>1){kids.slice(1).forEach(x=>x.remove());s.style.gridTemplateColumns='1fr'}});
  document.querySelectorAll('.hero .lead,.card.hero .lead').forEach(p=>{if(/tareas, presupuesto, pagos|tasks, budget, payments/i.test(txt(p)))p.textContent='Actívala para elegir invitados, preparar su invitación y gestionar las confirmaciones de este evento.'});
}
let queued=false;const run=()=>{queued=false;simplify()};new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(run)}}).observe(document.documentElement,{childList:true,subtree:true});addEventListener('load',run);setTimeout(run,60);setTimeout(run,350);
})();