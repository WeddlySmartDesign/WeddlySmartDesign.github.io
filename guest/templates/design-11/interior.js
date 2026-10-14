/* BOLA DE CRISTAL · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('bc');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// entre secciones: tres motas de purpurina que caen, nada más
function head(inner,kicker,title,first){if(!first){const b=el('span','bc-gl bc-rv');b.setAttribute('aria-hidden','true');b.append(el('i'),el('i'),el('i'));inner.append(b)}inner.append(el('p','bc-kicker bc-rv',kicker),el('h2','bc-title bc-rv',title))}
// fotos sin marco: bordes empañados como cristal y un destello que las cruza al aparecer
function img(p,cls,alt,h){const w=el('div','bc-ph '+cls);const i=el('img');i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;w.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';w.append(i,el('span','bc-shine'));return w}
function links(list){const r=el('div','bc-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','bc-in');sec.append(inner);return inner}
const PETALS=['%%PET1%%','%%PET2%%','%%PET3%%','%%PET4%%'];
// la estela dorada del cierre, en pequeño: el programa sigue su espiral
const TRAIL='M14 96 C 54 20, 104 20, 120 70 S 176 132, 214 78 S 290 8, 326 56';
let A=null,openStone=null,io=null;
function render(vm){
 if(!document.querySelector('.bc-band')){const t=el('img','bc-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','bc-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','bc-p bc-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'bc-rv','Fotografía de la pareja'))}
 // lugar: grabado en una losa de travertino, como los nombres en la peana de la bola
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'bc-rv','Fotografía del lugar',250));
  const places=el('div','bc-places bc-rv');vm.venues.forEach(v=>{const a=el('div','bc-venue');const info=el('div','bc-v-info');info.append(el('span','bc-v-k',v.label),el('div','bc-v-name',v.name));if(v.address)info.append(el('div','bc-v-addr',v.address));if(v.links.length)info.append(links(v.links));a.append(el('div','bc-v-time',v.time||''),info);places.append(a)});inner.append(places)
  if(vm.dress)inner.append(el('p','bc-dress bc-rv','Código de vestimenta: '+vm.dress))}
 // agenda: la estela de luz se dibuja al bajar; cada momento es un destello que se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const sky=el('div','bc-sky bc-rv');sky.setAttribute('role','group');sky.setAttribute('aria-label','Momentos del día');
  const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox','0 0 340 140');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
  svg.innerHTML=`<defs><linearGradient id="bcg" x1="0" x2="1"><stop offset="0" stop-color="#d9b56a" stop-opacity=".2"/><stop offset=".5" stop-color="#c99a3c"/><stop offset="1" stop-color="#e6c57f"/></linearGradient></defs><path class="bc-tr-bg" d="${TRAIL}" vector-effect="non-scaling-stroke"/><path class="bc-tr" d="${TRAIL}" vector-effect="non-scaling-stroke"/>`;sky.append(svg);
  const tr=svg.querySelector('.bc-tr'),L=tr.getTotalLength();tr.style.strokeDasharray=L;tr.style.strokeDashoffset=L;
  const now=el('div','bc-now');
  const pts=M.map((m,i)=>{const f=M.length<2?.5:.06+.88*i/(M.length-1),pt=tr.getPointAtLength(L*f);const b=el('button','bc-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);
   b.style.left=(pt.x/340*100)+'%';b.style.top=(pt.y/140*100)+'%';b.append(el('i'));b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};sky.append(b);
   const d=el('div');d.append(el('span','bc-tm',m.time||''));if(m.label)d.append(el('span','bc-lb',m.label));d.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};now.append(d);return {b,d,f}});
  inner.append(sky,now);if(M.length>1)inner.append(el('p','bc-hint bc-rv','Toca un destello o un momento para resaltarlo'));A={sky,tr,L,pts,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.pts.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: cantos de travertino con un pétalo encima (1–4); al tocar, el pétalo se levanta y se abre su información
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openStone=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const grid=el('div','bc-stones bc-rv'),tray=el('div','bc-tray'),tin=el('div','bc-tray-in');tray.id='bc-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','bc-s'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','bc-tray');
   const st=el('span','bc-stone');st.setAttribute('aria-hidden','true');const pe=el('img','bc-pet');pe.src=PETALS[i%PETALS.length];pe.alt='';pe.style.setProperty('--r',(i%2?24:-30)+'deg');st.append(pe);b.append(st,el('span','bc-s-lb',x.title));
   b.onclick=()=>{grid.classList.add('used');if(openStone===b){b.setAttribute('aria-expanded','false');openStone=null;tray.style.height='0px';return}openStone?.setAttribute('aria-expanded','false');openStone=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};grid.append(b)});
  inner.append(grid,el('p','bc-hint bc-rv',D.length>1?'Toca cada piedra para abrir su información':'Toca la piedra para abrir su información'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','bc-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=el('img','bc-gimg');im.src=p.src;im.alt=p.alt||'Fotografía de la pareja';im.dataset.fit=p.fit;im.style.objectPosition=p.fx+'% '+p.fy+'%';im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','bc-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.bc-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','bc-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('bc-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.sky.getBoundingClientRect().top;const q=reducedMotion()||A.n<2?1:Math.max(0,Math.min(1,(vh*.85-y)/(vh*.5)));let cur=0;
 A.tr.style.strokeDashoffset=A.L*(1-Math.max(q,.04));
 A.pts.forEach((t,i)=>{const on=A.n<2||q>=t.f-.02;t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.pts.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')})}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
// sonido: música tras abrir la portada, botón para silenciar; se apaga despacio con el cierre
const music=new Audio('%%MUSIC%%');music.loop=true;music.volume=0;let fadeT=null,soundOn=false;
const sb=el('button','bc-snd','♪');sb.type='button';sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');
function setSound(on){soundOn=on;sb.setAttribute('aria-pressed',String(on));sb.setAttribute('aria-label',on?'Silenciar música':'Activar música');clearInterval(fadeT);
 if(on){const p=music.play();if(p&&p.catch)p.catch(()=>{});fadeT=setInterval(()=>{music.volume=Math.min(.6,music.volume+.03);if(music.volume>=.6)clearInterval(fadeT)},90)}
 else fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-.06);if(music.volume<=0){music.pause();clearInterval(fadeT)}},60)}
sb.onclick=()=>setSound(!soundOn);
addEventListener('DOMContentLoaded',()=>{document.body.append(sb);const cover=document.getElementById('cover');
 const start=()=>{if(window.__GUEST_SUPPRESS_SOUND__)return;sb.classList.add('show');setSound(true);cover.removeEventListener('click',start)};cover.addEventListener('click',start);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&soundOn)music.pause();else if(!document.hidden&&soundOn)music.play().catch(()=>{})});
 const xv=document.getElementById('closing-video');
 const cl=document.getElementById('closing');if(cl&&!cl.querySelector('.bc-wait')){const w=el('p','bc-wait','Os esperamos');w.setAttribute('aria-hidden','true');cl.append(w);
  if(xv){xv.addEventListener('timeupdate',()=>{if(xv.currentTime>=1.2)w.classList.add('on')});xv.addEventListener('play',()=>{if(xv.currentTime<.5)w.classList.remove('on')})}
  if(reducedMotion())w.classList.add('on');new MutationObserver(()=>{if(cl.classList.contains('revealed'))w.classList.add('on')}).observe(cl,{attributes:true,attributeFilter:['class']})}
 if(xv)xv.addEventListener('play',()=>{if(!soundOn)return;const left=Math.max(3,((xv.duration||12)-(xv.currentTime||0))*.95),step=music.volume/(left*10);
  soundOn=false;sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');clearInterval(fadeT);
  fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-step);if(music.volume<=0){music.pause();clearInterval(fadeT)}},100)})});
window.__GUEST_INTERIOR__={render};
})();
