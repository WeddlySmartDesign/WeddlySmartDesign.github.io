(()=>{
'use strict';
if(window.__wsdSuiteSwipeNavigation)return;window.__wsdSuiteSwipeNavigation=true;
const payFrame=document.getElementById('paymentsFrame');
const guestFrame=document.getElementById('guestsFrame');
const planningFrame=document.getElementById('planningFrame');
if(!payFrame||!guestFrame||!planningFrame)return;

const EDGE=28, COMMIT_X=56, MAX_MS=900, START_X=9, H_RATIO=1.12;
const blockedSelector='input,textarea,select,button,a,label,[contenteditable="true"],[role="button"],[data-no-swipe],.sheet,.overlay,.modal,.panel,.plan,.filters,.tableTools';

function visible(el){
  if(!el)return false;
  const w=el.ownerDocument?.defaultView||window,cs=w.getComputedStyle(el);
  return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)!==0;
}
function horizontalScroller(el){
  for(let n=el;n&&n.nodeType===1;n=n.parentElement){
    try{const cs=n.ownerDocument.defaultView.getComputedStyle(n),ox=cs.overflowX;if((ox==='auto'||ox==='scroll')&&n.scrollWidth>n.clientWidth+6)return true}catch{}
  }
  return false;
}
function modalOpen(d){
  return [...d.querySelectorAll('.overlay.show,.overlay.on,.sheet.show,.sheet.on,.plan.on')].some(visible);
}
function ensureStyle(d){
  if(d.getElementById('wsd-swipe-nav-style'))return;
  const s=d.createElement('style');s.id='wsd-swipe-nav-style';s.textContent=`
    .wsd-swipe-moving{will-change:transform,opacity!important;animation:none!important}
    .wsd-swipe-settle{transition:transform .14s cubic-bezier(.2,.8,.2,1),opacity .14s ease!important;animation:none!important}
    .wsd-swipe-enter{animation:none!important;will-change:transform,opacity!important}
  `;d.head?.appendChild(s);
}
function clean(v){
  if(!v)return;v.classList.remove('wsd-swipe-moving','wsd-swipe-settle','wsd-swipe-enter');v.style.removeProperty('transform');v.style.removeProperty('opacity');v.style.removeProperty('transition');v.style.removeProperty('will-change');
}
function enter(v,from){
  if(!v)return;clean(v);v.classList.add('wsd-swipe-enter');v.style.transform=`translate3d(${from}px,0,0)`;v.style.opacity='.72';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{v.style.transition='transform .18s cubic-bezier(.2,.8,.2,1),opacity .16s ease';v.style.transform='translate3d(0,0,0)';v.style.opacity='1';setTimeout(()=>clean(v),210)}));
}
function bind(d,getButtons,activeClass,getActiveView){
  if(!d?.documentElement||d.documentElement.dataset.wsdSwipeNavigation==='2')return;
  d.documentElement.dataset.wsdSwipeNavigation='2';ensureStyle(d);
  let g=null;
  d.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||modalOpen(d)){g=null;return}
    const t=e.target;if(!(t instanceof d.defaultView.Element)||t.closest(blockedSelector)||horizontalScroller(t)){g=null;return}
    const p=e.touches[0],w=d.defaultView.innerWidth||d.documentElement.clientWidth||0;if(p.clientX<EDGE||p.clientX>w-EDGE){g=null;return}
    const buttons=getButtons().filter(visible);if(buttons.length<2){g=null;return}
    let i=buttons.findIndex(b=>b.classList.contains(activeClass)||b.getAttribute('aria-current')==='page');if(i<0)i=0;
    const view=getActiveView();if(!view){g=null;return}
    g={x:p.clientX,y:p.clientY,lastX:p.clientX,time:Date.now(),lastTime:Date.now(),i,buttons,view,axis:'',dx:0};
  },{passive:true});
  d.addEventListener('touchmove',e=>{
    if(!g||e.touches.length!==1)return;const p=e.touches[0],dx=p.clientX-g.x,dy=p.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!g.axis){
      if(ax<START_X&&ay<START_X)return;
      if(ay>ax){g.axis='v';clean(g.view);return}
      if(ax>ay*H_RATIO)g.axis='h';else return;
    }
    if(g.axis!=='h')return;e.preventDefault();
    const dir=dx<0?1:-1,ni=g.i+dir,boundary=ni<0||ni>=g.buttons.length,shown=boundary?dx*.22:dx;
    g.dx=dx;g.lastX=p.clientX;g.lastTime=Date.now();g.view.classList.add('wsd-swipe-moving');g.view.style.transform=`translate3d(${shown}px,0,0)`;g.view.style.opacity=String(Math.max(.7,1-Math.min(Math.abs(shown),140)/520));
  },{passive:false});
  function finish(e,cancel=false){
    if(!g)return;const s=g;g=null;if(s.axis!=='h'){clean(s.view);return}
    const p=e?.changedTouches?.[0],dx=p?p.clientX-s.x:s.dx,elapsed=Math.max(1,Date.now()-s.time),velocity=Math.abs(dx)/elapsed,dir=dx<0?1:-1,ni=s.i+dir,valid=ni>=0&&ni<s.buttons.length,commit=!cancel&&valid&&(Math.abs(dx)>=COMMIT_X||velocity>.42);
    if(!commit){s.view.classList.remove('wsd-swipe-moving');s.view.classList.add('wsd-swipe-settle');s.view.style.transform='translate3d(0,0,0)';s.view.style.opacity='1';setTimeout(()=>clean(s.view),170);return}
    const w=d.defaultView.innerWidth||d.documentElement.clientWidth||360;s.view.classList.remove('wsd-swipe-moving');s.view.classList.add('wsd-swipe-settle');s.view.style.transform=`translate3d(${dir>0?-Math.min(92,w*.18):Math.min(92,w*.18)}px,0,0)`;s.view.style.opacity='.45';
    setTimeout(()=>{clean(s.view);s.buttons[ni].click();requestAnimationFrame(()=>enter(getActiveView(),dir>0?Math.min(42,w*.1):-Math.min(42,w*.1)))},105);
  }
  d.addEventListener('touchend',e=>finish(e,false),{passive:true});d.addEventListener('touchcancel',e=>finish(e,true),{passive:true});
}
function bindPayments(){try{const d=payFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('nav button')].filter(b=>b.id!=='nav-settings'),'active',()=>d.querySelector('.view.active'))}catch{}}
function bindPlanning(){try{const d=planningFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('.nav button[data-view]')],'on',()=>d.querySelector('.view.on'))}catch{}}
function bindGuests(){try{const shell=guestFrame.contentDocument,inner=shell?.getElementById('app');if(!inner)return;if(!inner.dataset.wsdSwipeHook){inner.dataset.wsdSwipeHook='1';inner.addEventListener('load',()=>setTimeout(bindGuests,50));}const d=inner.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('.nav button[data-go]')],'on',()=>d.querySelector('.view.on'))}catch{}}
function retry(fn){[50,200,550,1300].forEach(ms=>setTimeout(fn,ms))}
payFrame.addEventListener('load',()=>retry(bindPayments));planningFrame.addEventListener('load',()=>retry(bindPlanning));guestFrame.addEventListener('load',()=>retry(bindGuests));retry(bindPayments);retry(bindPlanning);retry(bindGuests);
})();
