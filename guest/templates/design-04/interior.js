/* AZULEJO · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('az');
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function seal(){const s=el('span','az-seal az-rv');const i=el('img');i.src='%%SEAL%%';i.alt='';s.setAttribute('aria-hidden','true');s.append(i);return s}
function head(inner,kicker,title,first){if(!first)inner.append(seal());inner.append(el('p','az-kicker az-rv',kicker),el('h2','az-title az-rv',title))}
function img(p,cls,alt,h){const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','az-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','az-in');sec.append(inner);return inner}
let A=null,openWin=null,io=null;
function render(vm){
 if(!document.querySelector('.az-band')){const t=el('img','az-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','az-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 // historia
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','az-p az-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'az-fade az-rv','Fotografía de la pareja'))}
 // lugares
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'az-fade az-rv','Fotografía del lugar',250));
  for(const v of vm.venues){const a=el('div','az-venue az-rv');a.append(el('span','az-v-k',v.label));a.append(el('div','az-v-name',v.name));if(v.time||v.address){const m=el('div','az-v-meta');if(v.time)m.append(el('b',null,v.time));if(v.time&&v.address)m.append(document.createTextNode(' · '));if(v.address)m.append(document.createTextNode(v.address));a.append(m)}if(v.links.length)a.append(links(v.links));inner.append(a)}
  if(vm.dress)inner.append(el('p','az-dress az-rv','Código de vestimenta: '+vm.dress))}
 // agenda: camino de azulejos (1–5) que se dan la vuelta al bajar; cada azulejo se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const path=el('div','az-path');path.setAttribute('role','group');path.setAttribute('aria-label','Momentos del día');const now=el('div','az-now');now.setAttribute('aria-live','polite');
  const tiles=M.map((m,i)=>{const b=el('button','az-tile');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.append(el('span','f'),el('span','b',m.time||'·'));b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};path.append(b);
   const d=el('div');if(m.time)d.append(el('span','az-tm',m.time));if(m.label)d.append(el('span','az-lb',m.label));now.append(d);return {b,d}});
  inner.append(path,now);if(M.length>1)inner.append(el('p','az-tap','Toca un azulejo para ver su momento'));A={path,tiles,n:M.length,pick:null,last:-1};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.tiles.findIndex(t=>t.d.classList.contains('on'));A.pickY=scrollY;A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));tick()},{passive:true})}
 // detalles: contraventanas (1–4) que se abren
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openWin=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const wins=el('div','az-wins az-rv'),tray=el('div','az-tray'),tin=el('div','az-tray-in');tray.id='az-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','az-win'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','az-tray');const fr=el('span','az-frame');fr.setAttribute('aria-hidden','true');const ci=el('img','c');ci.src='%%WINC%%';ci.alt='';const oi=el('img','o');oi.src='%%WINO%%';oi.alt='';fr.append(ci,oi);b.append(fr,el('span','az-win-lb',x.title));
   b.onclick=()=>{if(openWin===b){b.setAttribute('aria-expanded','false');openWin=null;tray.style.height='0px';return}openWin?.setAttribute('aria-expanded','false');openWin=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px';setTimeout(()=>{const r=tray.getBoundingClientRect();if(r.bottom>innerHeight-20)tray.scrollIntoView({block:'end',behavior:reducedMotion()?'auto':'smooth'})},850)};wins.append(b)});
  inner.append(wins,el('p','az-hint az-rv',D.length>1?'Abre cada ventana':'Abre la ventana'),tray)}
 // galería
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','az-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=img(p,'az-fade','Fotografía de la pareja');im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','az-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.az-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','az-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('az-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.path.getBoundingClientRect().top;const q=A.n<2?1:Math.max(0,Math.min(1,(vh*.8-y)/(vh*.45)));let cur=0;
 A.tiles.forEach((t,i)=>{const on=A.n<2||q>=(i+.5)/A.n||reducedMotion();t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;A.last=cur;if(A.pick!=null)cur=A.pick;A.tiles.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')})}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
window.__GUEST_INTERIOR__={render};
})();
