(()=>{
'use strict';
if(window.__guestOneParityV1)return;window.__guestOneParityV1=true;
const G=window.__GuestsProd;if(!G||!G.f)return;
const frame=G.f;
function visible(el){if(!el)return false;const w=el.ownerDocument?.defaultView||window,cs=w.getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)!==0}
function modalOpen(d){return [...d.querySelectorAll('.overlay.show,.overlay.on,.sheet.show,.sheet.on,.plan.on')].some(visible)}
function ensureStyle(d){
  if(d.getElementById('guestOneParityStyle'))return;
  const s=d.createElement('style');s.id='guestOneParityStyle';s.textContent=`
    .wrap{max-width:680px!important;padding-top:20px!important}
    h1{font-family:ui-serif,Georgia,Cambria,"Times New Roman",serif!important;font-weight:500!important}
    .card,.stat,.step{border-radius:20px!important}
    .nav{background:#fff!important;gap:4px!important}
    .nav button{min-height:48px!important;border-radius:13px!important;color:#2c2a26!important}
    .nav button.on{background:#eef0e9!important;color:#525c43!important}
    .guest-swipe-live{will-change:transform!important;animation:none!important;transition:none!important;backface-visibility:hidden!important}
    .guest-swipe-arrive{will-change:transform!important;animation:none!important;backface-visibility:hidden!important}
  `;d.head?.appendChild(s)
}
function clean(v){if(!v)return;v.classList.remove('guest-swipe-live','guest-swipe-arrive');v.style.removeProperty('transform');v.style.removeProperty('transition');v.style.removeProperty('will-change');v.style.removeProperty('backface-visibility')}
function arrive(v,from){if(!v)return;clean(v);v.classList.add('guest-swipe-arrive');v.style.transform=`translate3d(${from}px,0,0)`;requestAnimationFrame(()=>{v.style.transition='transform .085s cubic-bezier(.22,.8,.28,1)';v.style.transform='translate3d(0,0,0)';setTimeout(()=>clean(v),105)})}
function installFastNav(d){
  const nav=d.getElementById('nav');if(!nav||nav.dataset.guestFastNav==='1')return;
  nav.dataset.guestFastNav='1';
  nav.addEventListener('click',e=>{
    const b=e.target?.closest?.('button[data-go]');if(!b)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
    const id=b.dataset.go;
    d.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===id));
    nav.querySelectorAll('button[data-go]').forEach(x=>x.classList.toggle('on',x===b));
    try{d.defaultView.scrollTo({top:0,behavior:'auto'})}catch{}
  },true)
}
function bindSwipe(d){
  if(!d?.body||d.documentElement.dataset.guestSwipeParity==='1')return;
  d.documentElement.dataset.guestSwipeParity='1';ensureStyle(d);installFastNav(d);
  const nav=d.getElementById('nav');if(!nav)return;
  const safeBlock='input,textarea,select,label,[contenteditable="true"],#nav,.sheet,.panel,.plan';
  let g=null,suppressUntil=0;
  try{d.documentElement.style.touchAction='pan-y';d.body.style.touchAction='pan-y'}catch{}
  const buttons=()=>[...nav.querySelectorAll('button[data-go]')].filter(visible);
  function activate(index,dir){
    const bs=buttons();if(index<0||index>=bs.length)return false;
    const id=bs[index].dataset.go,old=d.querySelector('.view.on');clean(old);
    d.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===id));
    bs.forEach((b,i)=>b.classList.toggle('on',i===index));
    const fresh=d.querySelector('.view.on');if(fresh)arrive(fresh,dir>0?16:-16);
    try{d.defaultView.scrollTo({top:0,behavior:'auto'})}catch{}
    suppressUntil=Date.now()+420;return true
  }
  d.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}},true);
  d.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||modalOpen(d)){g=null;return}
    const t=e.target;if(!(t instanceof d.defaultView.Element)||t.closest(safeBlock)){g=null;return}
    const p=e.touches[0],w=d.defaultView.innerWidth||d.documentElement.clientWidth||0;if(p.clientX<16||p.clientX>w-16){g=null;return}
    const bs=buttons();let i=bs.findIndex(b=>b.classList.contains('on'));if(i<0)i=0;
    const view=d.querySelector('.view.on');if(!view){g=null;return}
    g={x:p.clientX,y:p.clientY,i,view,axis:'',dx:0,done:false}
  },{passive:true});
  d.addEventListener('touchmove',e=>{
    if(!g||g.done||e.touches.length!==1)return;
    const p=e.touches[0],dx=p.clientX-g.x,dy=p.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!g.axis){if(ax<2&&ay<2)return;if(ay>ax*1.28){g.axis='v';clean(g.view);return}g.axis='h'}
    if(g.axis!=='h')return;
    e.preventDefault();suppressUntil=Date.now()+420;g.dx=dx;
    const dir=dx<0?1:-1,ni=g.i+dir,valid=ni>=0&&ni<buttons().length;
    g.view.classList.add('guest-swipe-live');g.view.style.transform=`translate3d(${valid?Math.max(-58,Math.min(58,dx)):dx*.16}px,0,0)`;
    if(valid&&ax>=18){const s=g;g.done=true;g=null;activate(s.i+dir,dir)}
  },{passive:false});
  function finish(e,cancel=false){
    if(!g)return;const s=g;g=null;if(cancel||s.axis!=='h'){clean(s.view);return}
    const p=e?.changedTouches?.[0],dx=p?p.clientX-s.x:s.dx,dir=dx<0?1:-1,ni=s.i+dir;
    if(Math.abs(dx)>=10&&activate(ni,dir))return;
    s.view.style.transition='transform .07s ease-out';s.view.style.transform='translate3d(0,0,0)';setTimeout(()=>clean(s.view),85)
  }
  d.addEventListener('touchend',e=>finish(e,false),{passive:true});
  d.addEventListener('touchcancel',e=>finish(e,true),{passive:true})
}
function appDoc(){try{return frame.contentDocument}catch{return null}}
function patch(){const d=appDoc();if(!d?.body)return;ensureStyle(d);bindSwipe(d)}
frame.addEventListener('load',()=>{setTimeout(patch,20);setTimeout(patch,120);setTimeout(patch,500)});
addEventListener('guests-prod-open',()=>setTimeout(patch,30));
setTimeout(patch,250);
})();