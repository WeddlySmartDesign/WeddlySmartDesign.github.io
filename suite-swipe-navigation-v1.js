(()=>{
'use strict';
if(window.__wsdSuiteSwipeNavigation)return;window.__wsdSuiteSwipeNavigation=true;
const payFrame=document.getElementById('paymentsFrame');
const guestFrame=document.getElementById('guestsFrame');
const planningFrame=document.getElementById('planningFrame');
if(!payFrame||!guestFrame||!planningFrame)return;

const blockedSelector='input,textarea,select,button,a,label,[contenteditable="true"],[role="button"],[data-no-swipe],.sheet,.overlay,.modal,.panel,.plan,.filters,.tableTools';
function visible(el){if(!el)return false;const w=el.ownerDocument?.defaultView||window,cs=w.getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)!==0}
function horizontalScroller(el){for(let n=el;n&&n.nodeType===1;n=n.parentElement){try{const cs=n.ownerDocument.defaultView.getComputedStyle(n),ox=cs.overflowX;if((ox==='auto'||ox==='scroll')&&n.scrollWidth>n.clientWidth+6)return true}catch{}}return false}
function modalOpen(d){return [...d.querySelectorAll('.overlay.show,.overlay.on,.sheet.show,.sheet.on,.plan.on')].some(visible)}
function ensureStyle(d){if(d.getElementById('wsd-swipe-nav-style'))return;const s=d.createElement('style');s.id='wsd-swipe-nav-style';s.textContent=`
  .wsd-swipe-live{will-change:transform!important;animation:none!important;transition:none!important;backface-visibility:hidden!important}
  .wsd-swipe-arrive{will-change:transform!important;animation:none!important;backface-visibility:hidden!important}
`;d.head?.appendChild(s)}
function clean(v){if(!v)return;v.classList.remove('wsd-swipe-live','wsd-swipe-arrive');v.style.removeProperty('transform');v.style.removeProperty('transition');v.style.removeProperty('will-change');v.style.removeProperty('backface-visibility')}
function arrive(v,from){if(!v)return;clean(v);v.classList.add('wsd-swipe-arrive');v.style.transform=`translate3d(${from}px,0,0)`;requestAnimationFrame(()=>{v.style.transition='transform .085s cubic-bezier(.22,.8,.28,1)';v.style.transform='translate3d(0,0,0)';setTimeout(()=>clean(v),105)})}

function bind(d,getButtons,activeClass,getActiveView,opts={}){
  if(!d?.documentElement||d.documentElement.dataset.wsdSwipeNavigation==='4')return;
  d.documentElement.dataset.wsdSwipeNavigation='4';ensureStyle(d);let g=null;
  const EDGE=opts.edge??22,START_X=opts.start??5,COMMIT_X=opts.commit??26,FINISH_X=opts.finish??18,H_RATIO=opts.ratio??1.04,MAX_MOVE=opts.maxMove??56,ANIMATE=opts.animate!==false;
  function commit(s,dir){
    const ni=s.i+dir;if(ni<0||ni>=s.buttons.length){clean(s.view);return false}
    const w=d.defaultView.innerWidth||d.documentElement.clientWidth||360;
    clean(s.view);s.buttons[ni].click();
    if(ANIMATE)requestAnimationFrame(()=>arrive(getActiveView(),dir>0?Math.min(22,w*.06):-Math.min(22,w*.06)));
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
    if(!g.axis){if(ax<START_X&&ay<START_X)return;if(ay>ax*1.22){g.axis='v';clean(g.view);return}if(ax>=ay*H_RATIO)g.axis='h';else return}
    if(g.axis!=='h')return;e.preventDefault();g.dx=dx;
    const dir=dx<0?1:-1,ni=g.i+dir,valid=ni>=0&&ni<g.buttons.length;
    const shown=valid?Math.max(-MAX_MOVE,Math.min(MAX_MOVE,dx)):dx*.18;
    g.view.classList.add('wsd-swipe-live');g.view.style.transform=`translate3d(${shown}px,0,0)`;
    if(valid&&ax>=COMMIT_X){const s=g;s.committed=true;g=null;commit(s,dir)}
  },{passive:false});
  function finish(e,cancel=false){
    if(!g)return;const s=g;g=null;if(s.axis!=='h'||cancel){clean(s.view);return}
    const p=e?.changedTouches?.[0],dx=p?p.clientX-s.x:s.dx,dir=dx<0?1:-1;
    if(Math.abs(dx)>=FINISH_X&&commit(s,dir))return;
    s.view.style.transition='transform .07s ease-out';s.view.style.transform='translate3d(0,0,0)';setTimeout(()=>clean(s.view),85);
  }
  d.addEventListener('touchend',e=>finish(e,false),{passive:true});d.addEventListener('touchcancel',e=>finish(e,true),{passive:true});
}

function installFastGuestNav(d){
  const nav=d.getElementById('nav');if(!nav||nav.dataset.wsdFastNav==='1')return;nav.dataset.wsdFastNav='1';
  nav.addEventListener('click',e=>{
    const b=e.target?.closest?.('button[data-go]');if(!b)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();
    const id=b.dataset.go;
    d.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===id));
    nav.querySelectorAll('button[data-go]').forEach(x=>x.classList.toggle('on',x===b));
    try{d.defaultView.scrollTo({top:0,behavior:'auto'})}catch{}
  },true);
}

function bindPayments(){try{const d=payFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('nav button')].filter(b=>b.id!=='nav-settings'),'active',()=>d.querySelector('.view.active'))}catch{}}
function bindPlanning(){try{const d=planningFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('.nav button[data-view]')],'on',()=>d.querySelector('.view.on'),{commit:22,finish:15,start:4,ratio:1.02})}catch{}}
function bindGuests(){try{const shell=guestFrame.contentDocument,inner=shell?.getElementById('app');if(!inner)return;if(!inner.dataset.wsdSwipeHook){inner.dataset.wsdSwipeHook='1';inner.addEventListener('load',()=>setTimeout(bindGuests,25))}const d=inner.contentDocument;if(!d?.body)return;installFastGuestNav(d);bind(d,()=>[...d.querySelectorAll('.nav button[data-go]')],'on',()=>d.querySelector('.view.on'),{edge:18,start:2,commit:14,finish:10,ratio:1,maxMove:44,animate:false})}catch{}}
function retry(fn){[25,90,220,520].forEach(ms=>setTimeout(fn,ms))}
payFrame.addEventListener('load',()=>retry(bindPayments));planningFrame.addEventListener('load',()=>retry(bindPlanning));guestFrame.addEventListener('load',()=>retry(bindGuests));retry(bindPayments);retry(bindPlanning);retry(bindGuests);
})();
