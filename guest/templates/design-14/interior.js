/* VIÑETAS · ELLAS (versión de «Viñetas») · interior propio: cada sección es una viñeta de cómic. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('vn');
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// cada sección: viñeta con su cartela (caja amarilla) y título rotulado
function panel(sec,show,kicker,title,tilt){sec.classList.toggle('invisible',!show);sec.replaceChildren();const p=el('div','vn-panel vn-rv');p.style.setProperty('--tilt',tilt+'deg');
 if(show){p.append(el('p','vn-cap',kicker),el('h2','vn-title',title))}sec.append(p);return p}
function img(p,alt,h){const w=el('div','vn-ph vn-rv');const i=el('img');i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;w.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';w.append(i);return w}
function links(list){const r=el('div','vn-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
// estrella de cómic (para horas)
function burst(text,cls){const b=el('span','vn-burst '+(cls||''));b.append(el('span',null,text));return b}
let A=null,openB=null,io=null;
function render(vm){
 let p=panel(document.getElementById('story'),vm.story.show,'Nuestra historia','Érase una vez…',-.6);
 if(vm.story.show){if(vm.story.text)p.append(el('p','vn-p',vm.story.text));if(vm.story.photo)p.append(img(vm.story.photo,'Fotografía de la pareja'))}
 // lugar: cada sede en su viñeta interior, con la hora en una estrella de cómic
 p=panel(document.getElementById('locations'),vm.venues.length>0,'Nos vemos aquí','El gran día',.5);
 if(vm.venues.length){if(vm.venuePhoto)p.append(img(vm.venuePhoto,'Fotografía del lugar',230));
  vm.venues.forEach((v,i)=>{const a=el('div','vn-venue vn-rv');a.append(burst(v.time||'★',i%2?'alt':''));const info=el('div','vn-v-info');info.append(el('span','vn-v-k',v.label),el('div','vn-v-name',v.name));if(v.address)info.append(el('div','vn-v-addr',v.address));if(v.links.length)info.append(links(v.links));a.append(info);p.append(a)});
  if(vm.dress){const d=el('p','vn-say vn-rv');d.append(el('b',null,'Código de vestimenta'),document.createTextNode(vm.dress));p.append(d)}}
 // programa: una tira de viñetas pequeñas; al bajar van apareciendo y la del momento en curso salta
 const M=vm.moments;p=panel(document.getElementById('agenda'),M.length>0,'Para que no te pierdas nada','El programa',-.4);A=null;
 if(M.length){const now=el('div','vn-now');now.setAttribute('role','group');now.setAttribute('aria-label','Momentos del día');
  const rows=M.map((m,i)=>{const r=el('div','vn-m');const b=el('button','vn-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.append(burst(m.time||'·',i%2?'alt':''));
   const lb=el('span','vn-lb',m.label||'');r.append(b,lb);const pick=()=>{A.pick=i;A.pickY=scrollY;tick()};b.onclick=pick;lb.onclick=pick;now.append(r);return r});
  p.append(now);if(M.length>1)p.append(el('p','vn-hint','Toca un momento para resaltarlo'));A={now,rows,n:M.length,pick:null}}
 // detalles: bocadillos que se pueden tocar; se abren en un bocadillo grande
 const D=vm.details;p=panel(document.getElementById('practical'),D.length>0,'Todo lo que necesitas saber','Los detalles',.6);openB=null;
 if(D.length){const grid=el('div','vn-bubbles'),tray=el('div','vn-tray'),tin=el('div','vn-tray-in');tray.id='vn-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','vn-b'+(i%2?' r':'')+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','vn-tray');
   b.append(el('span','vn-b-lb',x.title),el('span','vn-b-dot','!'));
   b.onclick=()=>{grid.classList.add('used');if(openB===b){b.setAttribute('aria-expanded','false');openB=null;tray.style.height='0px';return}openB?.setAttribute('aria-expanded','false');openB=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+22)+'px'};grid.append(b)});
  p.append(grid,el('p','vn-hint',D.length>1?'Toca cada bocadillo para leerlo':'Toca el bocadillo para leerlo'),tray)}
 const G=vm.gallery;p=panel(document.getElementById('gallery'),G.length>0,'Un poco de nosotros','Recuerdos',-.5);
 if(G.length){const track=el('div');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((g,i)=>{const im=el('img','vn-gimg');im.src=g.src;im.alt=g.alt||'Fotografía de la pareja';im.dataset.fit=g.fit;im.style.objectPosition=g.fx+'% '+g.fy+'%';im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});p.append(track);
  if(G.length>1){const dots=el('div','vn-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});p.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.vn-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});items.forEach(e=>io.observe(e))}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','vn-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('vn-tray').style.height=(tin.offsetHeight+22)+'px'});tin.append(d)}}
// programa: las viñetas aparecen según se baja; la última visible es «la de ahora», salvo que se toque otra
function tick(){if(!A)return;const vh=innerHeight;let cur=0;
 A.rows.forEach((r,i)=>{const y=r.getBoundingClientRect().top;const vis=reducedMotion()||y<vh*.86;r.classList.toggle('in',vis);if(vis&&y<vh*.62)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.rows.forEach((r,i)=>{r.classList.toggle('on',i===cur);if(i===cur)r.classList.add('in')})}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
// sonido: música tras abrir la portada, botón para silenciar; se apaga despacio con el cierre
const music=new Audio('%%MUSIC%%');music.loop=true;music.volume=0;let fadeT=null,soundOn=false;
const sb=el('button','vn-snd','♪');sb.type='button';sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');
function setSound(on){soundOn=on;sb.setAttribute('aria-pressed',String(on));sb.setAttribute('aria-label',on?'Silenciar música':'Activar música');clearInterval(fadeT);
 if(on){const p=music.play();if(p&&p.catch)p.catch(()=>{});fadeT=setInterval(()=>{music.volume=Math.min(.55,music.volume+.03);if(music.volume>=.55)clearInterval(fadeT)},90)}
 else fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-.06);if(music.volume<=0){music.pause();clearInterval(fadeT)}},60)}
sb.onclick=()=>setSound(!soundOn);
addEventListener('DOMContentLoaded',()=>{document.body.append(sb);const cover=document.getElementById('cover');
 const start=()=>{if(window.__GUEST_SUPPRESS_SOUND__)return;sb.classList.add('show');setSound(true);cover.removeEventListener('click',start)};cover.addEventListener('click',start);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&soundOn)music.pause();else if(!document.hidden&&soundOn)music.play().catch(()=>{})});
 const xv=document.getElementById('closing-video');
 // «¡Os esperamos!» en un bocadillo, cuando estallan los fuegos
 const cl=document.getElementById('closing');if(cl&&!cl.querySelector('.vn-wait')){const w=el('p','vn-wait','¡Os esperamos!');w.setAttribute('aria-hidden','true');cl.append(w);
  if(xv){xv.addEventListener('timeupdate',()=>{if(xv.currentTime>=5.9)w.classList.add('on')});xv.addEventListener('play',()=>{if(xv.currentTime<.5)w.classList.remove('on')})}
  if(reducedMotion())w.classList.add('on');new MutationObserver(()=>{if(cl.classList.contains('revealed'))w.classList.add('on')}).observe(cl,{attributes:true,attributeFilter:['class']})}
 if(xv)xv.addEventListener('play',()=>{if(!soundOn)return;const left=Math.max(3,((xv.duration||12)-(xv.currentTime||0))*.95),step=music.volume/(left*10);
  soundOn=false;sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');clearInterval(fadeT);
  fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-step);if(music.volume<=0){music.pause();clearInterval(fadeT)}},100)})});
window.__GUEST_INTERIOR__={render};
})();
