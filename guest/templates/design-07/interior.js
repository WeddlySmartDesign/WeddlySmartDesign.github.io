/* REFLEJO · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('rf');
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function head(inner,kicker,title,first){if(!first)inner.append(el('span','rf-gap'));const h=el('h2','rf-title rf-rv',title);h.dataset.text=title;inner.append(el('p','rf-kicker rf-rv',kicker),h)}
function img(p,cls,alt,h){const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','rf-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','rf-in');sec.append(inner);return inner}
let A=null,openEnv=null,io=null;
function render(vm){
 if(!document.querySelector('.rf-band')){const t=el('img','rf-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','rf-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','rf-p rf-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'rf-fade rf-rv','Fotografía de la pareja'))}
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'rf-fade rf-rv','Fotografía del lugar',250));
  const places=el('div','rf-places rf-rv');vm.venues.forEach(v=>{const a=el('div','rf-venue');const info=el('div','rf-v-info');info.append(el('span','rf-v-k',v.label),el('div','rf-v-name',v.name));if(v.address)info.append(el('div','rf-v-addr',v.address));if(v.links.length)info.append(links(v.links));a.append(el('div','rf-v-time',v.time||''),info);places.append(a)});inner.append(places)
  if(vm.dress)inner.append(el('p','rf-dress rf-rv','Código de vestimenta: '+vm.dress))}
 // agenda: velas flotantes (1–5) que se encienden al bajar y se reflejan en el agua; cada vela se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const pond=el('div','rf-pond rf-rv');pond.setAttribute('role','group');pond.setAttribute('aria-label','Momentos del día');
  const now=el('div','rf-now');now.setAttribute('aria-live','polite');
  const leaves=M.map((m,i)=>{const b=el('button','rf-cd');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.style.setProperty('--d',(-i*1.1)+'s');b.append(el('span','off'),el('span','lit'),el('span','rx'));
   b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};pond.append(b);
   const d=el('div');if(m.time)d.append(el('span','rf-tm',m.time));if(m.label)d.append(el('span','rf-lb',m.label));now.append(d);return {b,d,f:M.length<2?0:(i+.5)/M.length}});
  inner.append(pond,now);if(M.length>1)inner.append(el('p','rf-tap','Toca una vela para ver su momento'));A={stem:pond,leaves,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.leaves.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: espejos (1–4); al tocarlos los recorre un destello y se abre su bandeja
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openEnv=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const envs=el('div','rf-mirrors rf-rv'),tray=el('div','rf-tray'),tin=el('div','rf-tray-in');tray.id='rf-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','rf-mr'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','rf-tray');
   const gl=el('span','rf-gl');b.append(gl,el('span','rf-mr-lb',x.title));
   b.onclick=()=>{if(openEnv===b){b.setAttribute('aria-expanded','false');openEnv=null;tray.style.height='0px';return}openEnv?.setAttribute('aria-expanded','false');openEnv=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};envs.append(b)});
  inner.append(envs,el('p','rf-hint rf-rv',D.length>1?'Toca cada espejo':'Toca el espejo'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','rf-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=img(p,'rf-fade','Fotografía de la pareja');im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','rf-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.rf-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','rf-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('rf-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.stem.getBoundingClientRect().top;const q=reducedMotion()||A.n<2?1:Math.max(0,Math.min(1,(vh*.82-y)/(vh*.5)));let cur=0;
 A.leaves.forEach((t,i)=>{const on=A.n<2||q>=t.f;t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.leaves.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')})}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
window.__GUEST_INTERIOR__={render};
})();
