(()=>{
'use strict';
if(window.__wsdSuiteSwipeNavigation)return;window.__wsdSuiteSwipeNavigation=true;
const payFrame=document.getElementById('paymentsFrame');
const guestFrame=document.getElementById('guestsFrame');
const planningFrame=document.getElementById('planningFrame');
if(!payFrame||!guestFrame||!planningFrame)return;

const EDGE=28, MIN_X=68, MAX_MS=750, RATIO=1.25;
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
function ensureAnim(d){
  if(d.getElementById('wsd-swipe-nav-style'))return;
  const s=d.createElement('style');s.id='wsd-swipe-nav-style';s.textContent=`
    @keyframes wsdSwipeNext{from{opacity:.72;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
    @keyframes wsdSwipePrev{from{opacity:.72;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
    .wsd-swipe-next{animation:wsdSwipeNext .16s ease-out both!important}
    .wsd-swipe-prev{animation:wsdSwipePrev .16s ease-out both!important}
  `;d.head?.appendChild(s);
}
function animate(d,selector,next){
  ensureAnim(d);
  requestAnimationFrame(()=>{
    const v=d.querySelector(selector);if(!v)return;
    const c=next?'wsd-swipe-next':'wsd-swipe-prev';v.classList.remove('wsd-swipe-next','wsd-swipe-prev');void v.offsetWidth;v.classList.add(c);setTimeout(()=>v.classList.remove(c),190);
  });
}
function bind(d,getButtons,activeClass,activeViewSelector){
  if(!d?.documentElement||d.documentElement.dataset.wsdSwipeNavigation==='1')return;
  d.documentElement.dataset.wsdSwipeNavigation='1';
  let start=null;
  d.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||modalOpen(d)){start=null;return}
    const t=e.target;if(!(t instanceof d.defaultView.Element)||t.closest(blockedSelector)||horizontalScroller(t)){start=null;return}
    const p=e.touches[0],w=d.defaultView.innerWidth||d.documentElement.clientWidth||0;
    if(p.clientX<EDGE||p.clientX>w-EDGE){start=null;return}
    start={x:p.clientX,y:p.clientY,time:Date.now()};
  },{passive:true});
  d.addEventListener('touchend',e=>{
    if(!start||e.changedTouches.length!==1){start=null;return}
    const s=start;start=null;
    if(Date.now()-s.time>MAX_MS||modalOpen(d))return;
    const p=e.changedTouches[0],dx=p.clientX-s.x,dy=p.clientY-s.y,ax=Math.abs(dx),ay=Math.abs(dy);
    if(ax<MIN_X||ax<ay*RATIO)return;
    const buttons=getButtons().filter(visible);if(buttons.length<2)return;
    let i=buttons.findIndex(b=>b.classList.contains(activeClass)||b.getAttribute('aria-current')==='page');
    if(i<0)i=0;
    const goingNext=dx<0,ni=i+(goingNext?1:-1);if(ni<0||ni>=buttons.length)return;
    buttons[ni].click();animate(d,activeViewSelector,goingNext);
  },{passive:true});
  d.addEventListener('touchcancel',()=>{start=null},{passive:true});
}
function bindPayments(){
  try{const d=payFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('nav button')],'active','.view.active')}catch{}
}
function bindPlanning(){
  try{const d=planningFrame.contentDocument;if(!d?.body)return;bind(d,()=>[...d.querySelectorAll('.nav button[data-view]')],'on','.view.on')}catch{}
}
function bindGuests(){
  try{
    const shell=guestFrame.contentDocument,inner=shell?.getElementById('app');if(!inner)return;
    if(!inner.dataset.wsdSwipeHook){inner.dataset.wsdSwipeHook='1';inner.addEventListener('load',()=>setTimeout(bindGuests,50));}
    const d=inner.contentDocument;if(!d?.body)return;
    bind(d,()=>[...d.querySelectorAll('.nav button[data-go]')],'on','.view.on');
  }catch{}
}
function retry(fn){[50,200,550,1300].forEach(ms=>setTimeout(fn,ms))}
payFrame.addEventListener('load',()=>retry(bindPayments));
planningFrame.addEventListener('load',()=>retry(bindPlanning));
guestFrame.addEventListener('load',()=>retry(bindGuests));
retry(bindPayments);retry(bindPlanning);retry(bindGuests);
})();
