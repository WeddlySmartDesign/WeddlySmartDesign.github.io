/* GALA · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('ga');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const FAN='<svg class="ga-fan ga-rv" viewBox="0 0 120 44" aria-hidden="true"><path d="M60 42L10 42M60 42L110 42M60 42L22 16M60 42L98 16M60 42L42 6M60 42L78 6M60 42L60 2M30 42a30 30 0 0 1 60 0"/></svg>';
const RULE='<svg class="ga-rule ga-rv" viewBox="0 0 150 12" aria-hidden="true"><path d="M2 6h58M90 6h58M75 1l5 5-5 5-5-5z"/></svg>';
function head(inner,kicker,title,first){if(!first)inner.insertAdjacentHTML('beforeend',FAN);inner.append(el('p','ga-kicker ga-rv',kicker),el('h2','ga-title ga-rv',title));inner.insertAdjacentHTML('beforeend',RULE)}
function img(p,cls,alt,h){const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','ga-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','ga-in');sec.append(inner);return inner}
function minutes(t){const m=/^(\d{1,2}):(\d{2})/.exec(t||'');return m?(+m[1]%12)*60+(+m[2]):null}
let A=null,openTk=null,io=null;
function render(vm){
 if(!document.querySelector('.ga-band')){const t=el('img','ga-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','ga-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','ga-p ga-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'ga-fade ga-rv','Fotografía de la pareja'))}
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'ga-fade ga-rv','Fotografía del lugar',250));
  for(const v of vm.venues){const a=el('div','ga-venue ga-rv');a.append(el('span','ga-v-k',v.label));a.append(el('div','ga-v-name',v.name));if(v.time)a.append(el('div','ga-v-time',v.time));if(v.address)a.append(el('div','ga-v-addr',v.address));if(v.links.length)a.append(links(v.links));inner.append(a)}
  if(vm.dress)inner.append(el('p','ga-dress ga-rv','Código de vestimenta: '+vm.dress))}
 // agenda: reloj déco; cada momento en su hora, la aguja avanza al bajar y cada marca se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const clock=el('div','ga-clock ga-rv');clock.setAttribute('role','group');clock.setAttribute('aria-label','Momentos del día');
  const dial=document.createElementNS(SVG,'svg');dial.setAttribute('viewBox','0 0 200 200');dial.setAttribute('class','ga-dial');dial.setAttribute('aria-hidden','true');
  let h='<circle cx="100" cy="100" r="96" stroke-width="1"/><circle cx="100" cy="100" r="90" stroke-width=".5"/><circle cx="100" cy="100" r="58" stroke-width=".4" stroke-dasharray="1 3"/>';
  for(let i=0;i<60;i++){const a=i*6*Math.PI/180,r1=i%5?86:80;h+=`<line x1="${100+Math.sin(a)*r1}" y1="${100-Math.cos(a)*r1}" x2="${100+Math.sin(a)*90}" y2="${100-Math.cos(a)*90}" stroke-width="${i%5?.4:1}"/>`}
  [['XII',0],['III',90],['VI',180],['IX',270]].forEach(([t,d])=>{const a=d*Math.PI/180;h+=`<text x="${100+Math.sin(a)*68}" y="${103-Math.cos(a)*68}" text-anchor="middle">${t}</text>`});
  dial.innerHTML=h;const hand=document.createElementNS(SVG,'svg');hand.setAttribute('viewBox','0 0 200 200');hand.setAttribute('aria-hidden','true');hand.innerHTML='<g class="ga-hand"><line x1="100" y1="112" x2="100" y2="34"/><circle cx="100" cy="100" r="3.2"/></g>';clock.append(dial,hand);
  const now=el('div','ga-now');now.setAttribute('aria-live','polite');const used=[];
  const marks=M.map((m,i)=>{let mins=minutes(m.time);if(mins==null)mins=i*720/M.length;let r=78;while(used.some(u=>Math.abs(u.m-mins)<22&&u.r===r))r-=14;used.push({m:mins,r});
   const ang=mins/720*360,a=ang*Math.PI/180;const b=el('button','ga-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.style.left=(50+Math.sin(a)*r/2)+'%';b.style.top=(50-Math.cos(a)*r/2)+'%';b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};clock.append(b);
   const d=el('div');if(m.time)d.append(el('span','ga-tm',m.time));if(m.label)d.append(el('span','ga-lb',m.label));now.append(d);return {b,d,ang}});
  inner.append(clock,now);if(M.length>1)inner.append(el('p','ga-tap','Toca una marca del reloj para ver su momento'));A={clock,hand:hand.querySelector('.ga-hand'),marks,n:M.length,pick:null,turns:0,prev:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.marks.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: tiques de guardarropa (1–4)
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openTk=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const tix=el('div','ga-tix ga-rv'),tray=el('div','ga-tray'),tin=el('div','ga-tray-in');tray.id='ga-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','ga-tk'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','ga-tray');b.append(el('span','ga-no','Nº 0'+(i+1)),el('span','ga-tl',x.title));
   b.onclick=()=>{if(openTk===b){b.setAttribute('aria-expanded','false');openTk=null;tray.style.height='0px';return}openTk?.setAttribute('aria-expanded','false');openTk=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};tix.append(b)});
  inner.append(tix,el('p','ga-hint ga-rv',D.length>1?'Toca cada tique':'Toca el tique'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','ga-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=img(p,'ga-fade','Fotografía de la pareja');im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','ga-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.ga-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','ga-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('ga-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.clock.getBoundingClientRect().top;const q=A.n<2?1:Math.max(0,Math.min(1,(vh*.8-y)/(vh*.5)));let cur=0;
 A.marks.forEach((t,i)=>{const on=A.n<2||q>=(i+.5)/A.n||reducedMotion();t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.marks.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')});
 // la aguja siempre avanza en sentido horario hacia la marca actual
 const target=A.marks[cur].ang;if(A.prev==null)A.prev=target;let delta=target-(A.prev%360+360)%360;if(delta<0)delta+=360;if(cur<(A.lastCur??cur)&&delta>0)delta-=360;A.prev+=delta;A.lastCur=cur;A.hand.style.transform=`rotate(${A.prev}deg)`}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
window.__GUEST_INTERIOR__={render};
})();
