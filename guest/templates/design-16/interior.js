/* EL MAPA · interior propio: una guía de viaje hacia la boda. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. Sin música. */
(()=>{'use strict';
document.documentElement.classList.add('mp');
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// cada sección es una página de la guía: rótulo en versalitas con la rosa de los vientos y título en cursiva
function page(sec,show,kicker,title){sec.classList.toggle('invisible',!show);sec.replaceChildren();const p=el('div','mp-page mp-rv');
 if(show){const k=el('p','mp-cap');k.append(el('i','mp-rose'),document.createTextNode(kicker));p.append(k,el('h2','mp-title',title))}sec.append(p);return p}
function img(p,alt,h){const w=el('figure','mp-ph mp-rv');const i=el('img');i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;w.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';w.append(i);return w}
function links(list){const r=el('div','mp-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
// sello de correos con la hora (perforado)
function stamp(text,alt){const s=el('span','mp-stamp'+(alt?' alt':''));s.append(el('b',null,text));return s}
// alfiler del mapa
function pin(){const s=el('span','mp-pin');s.setAttribute('aria-hidden','true');return s}
let A=null,openB=null,io=null;
function render(vm){
 let p=page(document.getElementById('story'),vm.story.show,'Nuestra historia','Cómo empezó el viaje');
 if(vm.story.show){if(vm.story.text)p.append(el('p','mp-p',vm.story.text));if(vm.story.photo)p.append(img(vm.story.photo,'Fotografía de la pareja'))}
 // lugar: cada sede es una postal con su sello (la hora) y su matasellos
 p=page(document.getElementById('locations'),vm.venues.length>0,'El destino','Nos vemos aquí');
 if(vm.venues.length){if(vm.venuePhoto)p.append(img(vm.venuePhoto,'Fotografía del lugar',220));
  vm.venues.forEach((v,i)=>{const c=el('div','mp-card mp-rv');c.append(stamp(v.time||'✦',i%2));const info=el('div','mp-c-info');info.append(el('span','mp-c-k',v.label),el('div','mp-c-name',v.name));if(v.address)info.append(el('div','mp-c-addr',v.address));if(v.links.length)info.append(links(v.links));c.append(info);p.append(c)});
  if(vm.dress){const d=el('p','mp-note mp-rv');d.append(el('b',null,'Código de vestimenta'),document.createTextNode(vm.dress));p.append(d)}}
 // programa: el recorrido del día; cada momento es un alfiler en el camino y el del momento en curso se marca
 const M=vm.moments;p=page(document.getElementById('agenda'),M.length>0,'El recorrido','El programa');A=null;
 if(M.length){const now=el('div','mp-now');now.setAttribute('role','group');now.setAttribute('aria-label','Momentos del día');
  const rows=M.map((m,i)=>{const r=el('div','mp-m');const b=el('button','mp-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.append(pin(),el('span','mp-t',m.time||'·'));
   const lb=el('span','mp-lb',m.label||'');r.append(b,lb);const pick=()=>{A.pick=i;A.pickY=scrollY;tick()};b.onclick=pick;lb.onclick=pick;now.append(r);return r});
  p.append(now);if(M.length>1)p.append(el('p','mp-hint','Toca un alfiler para marcarlo'));A={now,rows,n:M.length,pick:null}}
 // detalles: billetes que se pican al tocarlos y se abren en un billete grande
 const D=vm.details;p=page(document.getElementById('practical'),D.length>0,'Antes de salir','Los detalles');openB=null;
 if(D.length){const grid=el('div','mp-tickets'),tray=el('div','mp-tray'),tin=el('div','mp-tray-in');tray.id='mp-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','mp-b'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','mp-tray');
   b.append(el('span','mp-b-no','Nº '+String(i+1).padStart(2,'0')),el('span','mp-b-lb',x.title));
   b.onclick=()=>{grid.classList.add('used');if(openB===b){b.setAttribute('aria-expanded','false');openB=null;tray.style.height='0px';return}openB?.setAttribute('aria-expanded','false');openB=b;b.setAttribute('aria-expanded','true');b.classList.add('punched');fill(tin,x);tray.style.height=(tin.offsetHeight+26)+'px'};grid.append(b)});
  p.append(grid,el('p','mp-hint',D.length>1?'Toca cada billete para leerlo':'Toca el billete para leerlo'),tray)}
 const G=vm.gallery;p=page(document.getElementById('gallery'),G.length>0,'Recuerdos de viaje','Nosotros');
 if(G.length){const track=el('div');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((g,i)=>{const im=el('img','mp-gimg');im.src=g.src;im.alt=g.alt||'Fotografía de la pareja';im.dataset.fit=g.fit;im.style.objectPosition=g.fx+'% '+g.fy+'%';im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});p.append(track);
  if(G.length>1){const dots=el('div','mp-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});p.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.mp-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});items.forEach(e=>io.observe(e))}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','mp-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('mp-tray').style.height=(tin.offsetHeight+26)+'px'});tin.append(d)}}
// el camino se va dibujando al bajar; el último alfiler a la vista es «el de ahora», salvo que se toque otro
function tick(){if(!A)return;const vh=innerHeight;let cur=0;
 A.rows.forEach((r,i)=>{const y=r.getBoundingClientRect().top;const vis=reducedMotion()||y<vh*.86;r.classList.toggle('in',vis);if(vis&&y<vh*.62)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>vh*.4)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.rows.forEach((r,i)=>{r.classList.toggle('on',i===cur);if(i===cur)r.classList.add('in')});
 const last=A.rows.filter(r=>r.classList.contains('in')).pop();if(last){const nb=A.now.getBoundingClientRect(),lb=last.getBoundingClientRect();A.now.style.setProperty('--drawn',Math.max(0,lb.top+lb.height/2-nb.top)+'px')}}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
addEventListener('DOMContentLoaded',()=>{
 // «Os esperamos» en cursiva cuando el sello cierra la carta
 const cl=document.getElementById('closing'),xv=document.getElementById('closing-video');
 if(cl&&!cl.querySelector('.mp-wait')){const w=el('p','mp-wait','Os esperamos');w.setAttribute('aria-hidden','true');cl.append(w);
  if(xv){xv.addEventListener('timeupdate',()=>{if(xv.currentTime>=4.7)w.classList.add('on')});xv.addEventListener('play',()=>{if(xv.currentTime<.5)w.classList.remove('on')})}
  if(reducedMotion())w.classList.add('on');new MutationObserver(()=>{if(cl.classList.contains('revealed'))w.classList.add('on')}).observe(cl,{attributes:true,attributeFilter:['class']})}});
window.__GUEST_INTERIOR__={render};
})();
