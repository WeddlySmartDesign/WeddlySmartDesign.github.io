/* LIMONEROS (versión Claude) · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('lm');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function head(inner,kicker,title,first){if(!first){const b=el('span','lm-bl lm-rv');b.setAttribute('aria-hidden','true');const l=el('img');l.src='%%LEMON2%%';l.alt='';b.append(l);inner.append(b)}inner.append(el('p','lm-kicker lm-rv',kicker),el('h2','lm-title lm-rv',title))}
function img(p,cls,alt,h){const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','lm-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','lm-in');sec.append(inner);return inner}
const LEMONS=['%%LEMON1%%','%%LEMON2%%','%%LEMON3%%','%%LEMON4%%'];
const ARC='M16 118 Q 170 -34 324 118';
let A=null,openEnv=null,io=null;
function render(vm){
 if(!document.querySelector('.lm-band')){const t=el('img','lm-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','lm-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','lm-p lm-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'lm-fade lm-rv','Fotografía de la pareja'))}
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'lm-fade lm-rv','Fotografía del lugar',250));
  for(const v of vm.venues){const a=el('div','lm-venue lm-rv');a.append(el('span','lm-v-k',v.label));a.append(el('div','lm-v-name',v.name));if(v.time)a.append(el('div','lm-v-time',v.time));if(v.address)a.append(el('div','lm-v-addr',v.address));if(v.links.length)a.append(links(v.links));inner.append(a)}
  if(vm.dress)inner.append(el('p','lm-dress lm-rv','Código de vestimenta: '+vm.dress))}
 // agenda: el sol recorre su arco al bajar y se va poniendo; cada momento es una marca pulsable en su camino
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const sky=el('div','lm-sky lm-rv');sky.setAttribute('role','group');sky.setAttribute('aria-label','Momentos del día');
  const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox','0 0 340 150');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
  svg.innerHTML=`<path class="lm-arc" d="${ARC}" vector-effect="non-scaling-stroke"/><line class="lm-hz" x1="0" y1="118" x2="340" y2="118" vector-effect="non-scaling-stroke"/>`;sky.append(svg);
  const arc=svg.querySelector('.lm-arc'),L=arc.getTotalLength();const sun=el('span','lm-sun');sky.append(sun);
  const now=el('div','lm-now');now.setAttribute('aria-live','polite');
  const leaves=M.map((m,i)=>{const f=M.length<2?.5:.1+.8*i/(M.length-1),pt=arc.getPointAtLength(L*f);const b=el('button','lm-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);
   b.style.left=(pt.x/340*100)+'%';b.style.top=(pt.y/150*100)+'%';b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};sky.append(b);
   const d=el('div');if(m.time)d.append(el('span','lm-tm',m.time));if(m.label)d.append(el('span','lm-lb',m.label));now.append(d);return {b,d,f,x:pt.x/340*100,y:pt.y/150*100}});
  inner.append(sky,now);if(M.length>1)inner.append(el('p','lm-tap','Toca una marca del camino del sol'));A={stem:sky,sun,leaves,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.leaves.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: limones pintados (1–4); al tocar uno se abre su información
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openEnv=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const envs=el('div','lm-wraps lm-rv'),tray=el('div','lm-tray'),tin=el('div','lm-tray-in');tray.id='lm-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','lm-w'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','lm-tray');
   const lm=el('img','lm-lemon');lm.src=LEMONS[i%LEMONS.length];lm.alt='';lm.setAttribute('aria-hidden','true');b.append(lm,el('span','lm-w-lb',x.title));
   b.onclick=()=>{if(openEnv===b){b.setAttribute('aria-expanded','false');openEnv=null;tray.style.height='0px';return}openEnv?.setAttribute('aria-expanded','false');openEnv=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};envs.append(b)});
  inner.append(envs,el('p','lm-hint lm-rv',D.length>1?'Toca cada limón':'Toca el limón'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','lm-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=img(p,'lm-fade','Fotografía de la pareja');im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','lm-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.lm-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','lm-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('lm-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.stem.getBoundingClientRect().top;const q=reducedMotion()||A.n<2?1:Math.max(0,Math.min(1,(vh*.82-y)/(vh*.5)));let cur=0;
 A.leaves.forEach((t,i)=>{const on=A.n<2||q>=(A.n<2?0:i/(A.n-1))*.98;t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.leaves.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')});
 const c=A.leaves[cur],k=A.n<2?.5:cur/(A.n-1);A.sun.style.left=c.x+'%';A.sun.style.top=c.y+'%';A.sun.style.setProperty('--sun',`rgb(${240-8*k|0},${176-70*k|0},${96-6*k|0})`)}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
window.__GUEST_INTERIOR__={render};
})();
