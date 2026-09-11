(()=>{
'use strict';
if(window.__wsdSuiteSwipeNavigation)return;window.__wsdSuiteSwipeNavigation=true;
const payFrame=document.getElementById('paymentsFrame');
const guestFrame=document.getElementById('guestsFrame');
const planningFrame=document.getElementById('planningFrame');
if(!payFrame||!guestFrame||!planningFrame)return;

const EDGE=22, START_X=5, COMMIT_X=26, H_RATIO=1.04;
const blockedSelector='input,textarea,select,button,a,label,[contenteditable="true"],[role="button"],[data-no-swipe],.sheet,.overlay,.modal,.panel,.plan,.filters,.tableTools';
function visible(el){if(!el)return false;const w=el.ownerDocument?.defaultView||window,cs=w.getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)!==0}
function horizontalScroller(el){for(let n=el;n&&n.nodeType===1;n=n.parentElement){try{const cs=n.ownerDocument.defaultView.getComputedStyle(n),ox=cs.overflowX;if((ox==='auto'||ox==='scroll')&&n.scrollWidth>n.clientWidth+6)return true}catch{}}return false}
function modalOpen(d){return [...d.querySelectorAll('.overlay.show,.overlay.on,.sheet.show,.sheet.on,.plan.on')].some(visible)}
function ensureStyle(d){if(d.getElementById('wsd-swipe-nav-style'))return;const s=d.createElement('style');s.id='wsd-swipe-nav-style';s.textContent=`
  .wsd-swipe-live{will-change:transform!important;animation:none!important;transition:none!important;backface-visibility:hidden!important}
  .wsd-swipe-arrive{will-change:transform!important;animation:none!important;backface-visibility:hidden!important}
`;d.head?.appendChild(s)}
function clean(v){if(!v)return;v.classList.remove('wsd-swipe-live','wsd-swipe-arrive');v.style.removeProperty('transform');v.style.removeProperty('transition');v.style.removeProperty('will-change');v.style.removeProperty('backface-visibility')}
function arrive(v,from){if(!v)return;clean(v);v.classList.add('wsd-swipe-arrive');v.style.transform=`translate3d(${from}px,0,0)`;requestAnimationFrame(()=>{v.style.transition='transform .095s cubic-bezier(.22,.8,.28,1)';v.style.transform='translate3d(0,0,0)';setTimeout(()=>clean(v),115)})}
function bind(d,getButtons,activeClass,getActiveView){
  if(!d?.documentElement||d.documentElement.dataset.wsdSwipeNavigation==='3')return;
  d.documentElement.dataset.wsdSwipeNavigation='3';ensureStyle(d);let g=null;
  function commit(s,dir){
    const ni=s.i+dir;if(ni<0||ni>=s.buttons.length){clean(s.view);return false}
    const w=d.defaultView.innerWidth||d.documentElement.clientWidth||360;
    clean(s.view);s.buttons[ni].click();
    requestAnimationFrame(()=>arrive(getActiveView(),dir>0?Math.min(24,w*.065):-Math.min(24,w*.065)));
    return true;
  }
  d.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||modalOpen(d)){g=null;return}
    const t=e.target;if(!(t instanceof d.defaultView.Element)||t.closest(blockedSelector)||horizontalScroller(t)){g=null;return}
    const p=e.touches[0],w=d.defaultView.innerWidth||d.documentElement.clientWidth||0;if(p.clientX<EDGE||p.clientX>w-EDGE){g=null;return}
    const buttons=getButtons().filter(visible);if(buttons.length<2){g=null;return}
    let i=buttons.findIndex(b=>b.classList.contains(activeClass)||b.getAttribute('aria-current')==='page');if(i<0)i=0;
    const view=getActiveView();if(!view){g=null;return}
    g={x:p.clientX,y:p.clientY,i,buttons,view,axis:'',dx:0,committed:false};
  },{passive:true});
  d.addEventListener('touchmove',e=>{
    if(!g||g.committed||e.touches.length!==1)return;
    const p=e.touches[0],dx=p.clientX-g.x,dy=p.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(!g.axis){if(ax<START_X&&ay<START_X)return;if(ay>ax){g.axis='v';clean(g.view);return}if(ax>=ay*H_RATIO)g.axis='h';else return}
    if(g.axis!=='h')return;e.preventDefault();g.dx=dx;
    const dir=dx<0?1:-1,ni=g.i+dir,valid=ni>=0&&ni<g.buttons.length;
    const shown=valid?Math.max(-56,Math.min(56,dx)):dx*.18;
    g.view.classList.add('wsd-swipe-live');g.view.style.transform=`translate3d(${shown}px,0,0)`;
    if(valid&&ax>=COMMIT_X){const s=g;s.committed=true;g=null;commit(s,dir)}
  },{passive:false});
  function finish(e,cancel=false){
    if(!g)return;const s=g;g=null;if(s.axis!=='h'||cancel){clean(s.view);return}
    const p=e?.changedTouches?.[0],dx=p?p.clientX-s.x:s.dx,dir=dx<0?1:-1;
    if(Math.abs(dx)>=18&&commit(s,dir))return;
    s.view.style.transition='transform .08s ease-out';s.view.style.transform='translate3d(0,0,0)';setTimeout(()=>clean(s.view),95);
  }
  d.addEventListener('touchend',e=>finish(e,false),{passive:true});d.addEventListener('touchcancel',e=>finish(e,true),{passive:true});
}
function bindPayments(){try{const d=payFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('nav button')].filter(b=>b.id!=='nav-settings'),'active',()=>d.querySelector('.view.active'))}catch{}}
function bindPlanning(){try{const d=planningFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('.nav button[data-view]')],'on',()=>d.querySelector('.view.on'))}catch{}}
function bindGuests(){try{const shell=guestFrame.contentDocument,inner=shell?.getElementById('app');if(!inner)return;if(!inner.dataset.wsdSwipeHook){inner.dataset.wsdSwipeHook='1';inner.addEventListener('load',()=>setTimeout(bindGuests,35))}const d=inner.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('.nav button[data-go]')],'on',()=>d.querySelector('.view.on'))}catch{}}
function retry(fn){[35,140,360,850].forEach(ms=>setTimeout(fn,ms))}
payFrame.addEventListener('load',()=>retry(bindPayments));planningFrame.addEventListener('load',()=>retry(bindPlanning));guestFrame.addEventListener('load',()=>retry(bindGuests));retry(bindPayments);retry(bindPlanning);retry(bindGuests);
})();
