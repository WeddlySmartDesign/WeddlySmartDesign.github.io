/* CUENTO DE PAPEL · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('cu');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROMAN=['i','ii','iii','iv','v','vi'];let chap=0;
const SUN='<img class="cu-sun cu-rv" src="%%SOL%%" alt="" aria-hidden="true">';
function head(inner,kicker,title,first){if(first)chap=0;chap++;if(!first)inner.insertAdjacentHTML('beforeend',SUN);inner.append(el('span','cu-ch cu-rv','capítulo '+ROMAN[chap-1]),el('h2','cu-title cu-rv',title),el('p','cu-kicker cu-rv',kicker))}
function img(p,cls,alt,h){const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','cu-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','cu-in');sec.append(inner);return inner}
const NUBES=['%%NUBE1%%','%%NUBE2%%'];
const RIDGE='M14 106 Q 80 84 170 102 T 326 97';
const BALLOON='<svg viewBox="0 0 34 48"><path d="M17 1C7 1 1 8 1 17c0 9 9 16 13 21h6c4-5 13-12 13-21C33 8 27 1 17 1z" fill="#f3e9d6"/><path d="M17 1c-5 0-8 8-8 16 0 9 3 16 5 21h3V1z" fill="#d9a441"/><path d="M17 1c5 0 8 8 8 16 0 9-3 16-5 21h-3V1z" fill="#b5684a"/><path d="M14 38l1 5M20 38l-1 5" stroke="#6b5a4a" stroke-width=".8"/><rect x="13.5" y="42.5" width="7" height="5" rx="1" fill="#8a6a4a"/></svg>';
let A=null,openEnv=null,io=null;
function render(vm){
 if(!document.querySelector('.cu-band')){const t=el('img','cu-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','cu-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','cu-p cu-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'cu-fade cu-rv','Fotografía de la pareja'))}
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'cu-fade cu-rv','Fotografía del lugar',250));
  for(const v of vm.venues){const a=el('div','cu-venue cu-rv');a.append(el('span','cu-v-k',v.label));a.append(el('div','cu-v-name',v.name));if(v.time)a.append(el('div','cu-v-time',v.time));if(v.address)a.append(el('div','cu-v-addr',v.address));if(v.links.length)a.append(links(v.links));inner.append(a)}
  if(vm.dress)inner.append(el('p','cu-dress cu-rv','Código de vestimenta: '+vm.dress))}
 // agenda: paisaje de papel; cada momento es una banderita en la colina y el globo viaja hasta la del momento en curso
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const land=el('div','cu-land cu-rv');land.setAttribute('role','group');land.setAttribute('aria-label','Momentos del día');
  const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox','0 0 340 150');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
  svg.innerHTML=`<path class="h" d="M0 92 Q 60 58 120 80 T 240 72 T 340 80 V150 H0Z" fill="#c4d6dd"/><path class="h" d="M0 110 Q 80 82 170 102 T 340 96 V150H0Z" fill="#c9d6c0"/><path class="h" d="M0 132 Q 90 112 180 128 T 340 122 V150H0Z" fill="#a3bba9"/><path class="r" d="${RIDGE}" fill="none" stroke="none"/>`;land.append(svg);
  const ridge=svg.querySelector('.r'),L=ridge.getTotalLength();const bal=el('span','cu-bal');bal.innerHTML=BALLOON;land.append(bal);
  const now=el('div','cu-now');now.setAttribute('aria-live','polite');
  const leaves=M.map((m,i)=>{const f=M.length<2?.5:.06+.88*i/(M.length-1),pt=ridge.getPointAtLength(L*f);const b=el('button','cu-flag');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);
   const x=pt.x/340*100,y=pt.y/150*100;b.style.left=x+'%';b.style.top=y+'%';b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};land.append(b);
   const d=el('div');if(m.time)d.append(el('span','cu-tm',m.time));if(m.label)d.append(el('span','cu-lb',m.label));now.append(d);return {b,d,f,x,y}});
  inner.append(land,now);if(M.length>1)inner.append(el('p','cu-tap','Toca una banderita para ver su momento'));A={stem:land,bal,leaves,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.leaves.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: nubes de papel recortadas de la portada (1–4); al tocar una se eleva y se abre su página
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openEnv=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const envs=el('div','cu-clouds cu-rv'),tray=el('div','cu-tray'),tin=el('div','cu-tray-in');tray.id='cu-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','cu-cl'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','cu-tray');
   const cl=el('img','cu-nube');cl.src=NUBES[i%2];cl.alt='';cl.setAttribute('aria-hidden','true');b.append(cl,el('span','cu-cl-lb',x.title));
   b.onclick=()=>{if(openEnv===b){b.setAttribute('aria-expanded','false');openEnv=null;tray.style.height='0px';return}openEnv?.setAttribute('aria-expanded','false');openEnv=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};envs.append(b)});
  inner.append(envs,el('p','cu-hint cu-rv',D.length>1?'Toca cada nube':'Toca la nube'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','cu-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=img(p,'cu-fade','Fotografía de la pareja');im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','cu-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.cu-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','cu-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('cu-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.stem.getBoundingClientRect().top;const q=reducedMotion()||A.n<2?1:Math.max(0,Math.min(1,(vh*.82-y)/(vh*.5)));let cur=0;
 A.leaves.forEach((t,i)=>{const on=A.n<2||q>=(A.n<2?0:i/(A.n-1))*.98;t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.leaves.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')});
 const c=A.leaves[cur];A.bal.style.left=c.x+'%';A.bal.style.top=c.y+'%'}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
window.__GUEST_INTERIOR__={render};
})();
