/* ABANICO · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('ab');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// abanico pequeño en SVG: n pliegues de papel marfil que se despliegan desde el remache
function miniFan(n,span,cls){const s=document.createElementNS(SVG,'svg');s.setAttribute('viewBox','0 0 100 60');s.setAttribute('aria-hidden','true');s.setAttribute('class','ab-fan '+(cls||''));
 const R=52,RI=14,cx=50,cy=56,w=span/n;let h='';
 for(let i=0;i<n;i++){const a=-span/2+w*i;
  const pt=(ang,rr)=>{const r=(ang-90)*Math.PI/180;return (cx+Math.cos(r)*rr).toFixed(2)+' '+(cy+Math.sin(r)*rr).toFixed(2)};
  h+=`<g class="ab-pl" style="--a:${(a+w/2).toFixed(2)}deg;--d:${i}"><path d="M${pt(-w/2,RI)} L${pt(-w/2,R)} A${R} ${R} 0 0 1 ${pt(w/2,R)} L${pt(w/2,RI)} Z" class="${i%2?'ab-pa':'ab-pb'}"/><line x1="${cx}" y1="${cy}" x2="${pt(-w/2,R+1).split(' ')[0]}" y2="${pt(-w/2,R+1).split(' ')[1]}" class="ab-rib"/></g>`}
 h+=`<circle cx="${cx}" cy="${cy}" r="3.2" class="ab-pin"/>`;s.innerHTML=h;return s}
function head(inner,kicker,title,first){if(!first){const b=el('span','ab-sep ab-rv');b.append(miniFan(7,110));inner.append(b)}inner.append(el('p','ab-kicker ab-rv',kicker),el('h2','ab-title ab-rv',title))}
function img(p,cls,alt,h){const w=el('div','ab-ph '+cls);const i=el('img');i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;w.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';w.append(i,el('span','ab-shine'));return w}
function links(list){const r=el('div','ab-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','ab-in');sec.append(inner);return inner}
let A=null,openFan=null,io=null;
function render(vm){
 if(!document.querySelector('.ab-band')){const t=el('img','ab-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','ab-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','ab-p ab-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'ab-rv','Fotografía de la pareja'))}
 // lugar: sobre una hoja de abanico de seda marfil con filo dorado
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'ab-rv','Fotografía del lugar',250));
  const places=el('div','ab-places ab-rv');places.append(miniFan(7,110,'ab-pfan'));vm.venues.forEach(v=>{const a=el('div','ab-venue');const info=el('div','ab-v-info');info.append(el('span','ab-v-k',v.label),el('div','ab-v-name',v.name));if(v.address)info.append(el('div','ab-v-addr',v.address));if(v.links.length)info.append(links(v.links));a.append(el('div','ab-v-time',v.time||''),info);places.append(a)});inner.append(places)
  if(vm.dress)inner.append(el('p','ab-dress ab-rv','Código de vestimenta: '+vm.dress))}
 // agenda: un abanico que se abre al bajar; cada varilla es un momento y se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const sky=el('div','ab-sky ab-rv');sky.setAttribute('role','group');sky.setAttribute('aria-label','Momentos del día');
  const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox','0 0 340 190');svg.setAttribute('aria-hidden','true');
  svg.innerHTML='<defs><linearGradient id="abg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b8924c"/><stop offset="1" stop-color="#e9cf8e"/></linearGradient></defs><path class="ab-leaf" d=""/><g class="ab-ribs"></g><circle cx="170" cy="178" r="6" class="ab-pin"/>';sky.append(svg);
  const now=el('div','ab-now');const ribs=svg.querySelector('.ab-ribs');
  const pts=M.map((m,i)=>{const ln=document.createElementNS(SVG,'line');ln.setAttribute('x1','170');ln.setAttribute('y1','178');ln.setAttribute('class','ab-r');ribs.append(ln);
   const b=el('button','ab-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.append(el('i'));b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};sky.append(b);
   const d=el('div');d.append(el('span','ab-tm',m.time||''));if(m.label)d.append(el('span','ab-lb',m.label));d.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};now.append(d);return {b,d,ln,f:M.length<2?1:i/(M.length-1)}});
  inner.append(sky,now);if(M.length>1)inner.append(el('p','ab-hint ab-rv','Toca una varilla o un momento para resaltarlo'));A={sky,svg,leaf:svg.querySelector('.ab-leaf'),pts,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.pts.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: abanicos cerrados que se abren al tocarlos y despliegan su información
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openFan=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const grid=el('div','ab-fans ab-rv'),tray=el('div','ab-tray'),tin=el('div','ab-tray-in');tray.id='ab-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','ab-f'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','ab-tray');
   const ic=el('span','ab-fi');ic.setAttribute('aria-hidden','true');ic.append(miniFan(9,130,'big'));b.append(ic,el('span','ab-f-lb',x.title));
   b.onclick=()=>{grid.classList.add('used');if(openFan===b){b.setAttribute('aria-expanded','false');openFan=null;tray.style.height='0px';return}openFan?.setAttribute('aria-expanded','false');openFan=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};grid.append(b)});
  inner.append(grid,el('p','ab-hint ab-rv',D.length>1?'Toca cada abanico para abrir su información':'Toca el abanico para abrir su información'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const track=el('div','ab-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=el('img','ab-gimg');im.src=p.src;im.alt=p.alt||'Fotografía de la pareja';im.dataset.fit=p.fit;im.style.objectPosition=p.fx+'% '+p.fy+'%';im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','ab-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.ab-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','ab-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('ab-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
// el abanico del programa: se abre según se baja (de cerrado a 140°)
const CX=170,CY=178,RL=160,RI=40;
const P=(deg,r)=>{const a=(deg-90)*Math.PI/180;return [CX+Math.cos(a)*r,CY+Math.sin(a)*r]};
function tick(){if(!A)return;const vh=innerHeight,y=A.sky.getBoundingClientRect().top;const q=reducedMotion()?1:Math.max(0,Math.min(1,(vh*.88-y)/(vh*.5)));
 const span=8+132*(q*q*(3-2*q)),a0=-span/2;let cur=0;
 A.pts.forEach((t,i)=>{const deg=A.n<2?0:a0+span*t.f,[x,y2]=P(deg,RL+6);t.ln.setAttribute('x2',x.toFixed(1));t.ln.setAttribute('y2',y2.toFixed(1));
  const [mx,my]=P(deg,RL+16);t.b.style.left=(mx/340*100)+'%';t.b.style.top=(my/190*100)+'%';const on=q>.15+.8*t.f||A.n<2||q>=1;t.b.classList.toggle('on',on);if(on)cur=i});
 const [x1,y1]=P(a0,RL),[x2,y2]=P(a0+span,RL),[x3,y3]=P(a0+span,RI),[x4,y4]=P(a0,RI);
 A.leaf.setAttribute('d',`M${x4} ${y4} L${x1} ${y1} A${RL} ${RL} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${RI} ${RI} 0 0 0 ${x4} ${y4} Z`);
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.pts.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);t.ln.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')})}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
// sonido: música tras abrir la portada, botón para silenciar; se apaga despacio con el cierre
const music=new Audio('%%MUSIC%%');music.loop=true;music.volume=0;let fadeT=null,soundOn=false;
const sb=el('button','ab-snd','♪');sb.type='button';sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');
function setSound(on){soundOn=on;sb.setAttribute('aria-pressed',String(on));sb.setAttribute('aria-label',on?'Silenciar música':'Activar música');clearInterval(fadeT);
 if(on){const p=music.play();if(p&&p.catch)p.catch(()=>{});fadeT=setInterval(()=>{music.volume=Math.min(.6,music.volume+.03);if(music.volume>=.6)clearInterval(fadeT)},90)}
 else fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-.06);if(music.volume<=0){music.pause();clearInterval(fadeT)}},60)}
sb.onclick=()=>setSound(!soundOn);
addEventListener('DOMContentLoaded',()=>{document.body.append(sb);const cover=document.getElementById('cover');
 const start=()=>{if(window.__GUEST_SUPPRESS_SOUND__)return;sb.classList.add('show');setSound(true);cover.removeEventListener('click',start)};cover.addEventListener('click',start);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&soundOn)music.pause();else if(!document.hidden&&soundOn)music.play().catch(()=>{})});
 const xv=document.getElementById('closing-video');
 // «Os esperamos» llega cuando la cinta termina de atar el abanico
 const cl=document.getElementById('closing');if(cl&&!cl.querySelector('.ab-wait')){const w=el('p','ab-wait','Os esperamos');w.setAttribute('aria-hidden','true');cl.append(w);
  if(xv){xv.addEventListener('timeupdate',()=>{if(xv.currentTime>=5.6)w.classList.add('on')});xv.addEventListener('play',()=>{if(xv.currentTime<.5)w.classList.remove('on')})}
  if(reducedMotion())w.classList.add('on');new MutationObserver(()=>{if(cl.classList.contains('revealed'))w.classList.add('on')}).observe(cl,{attributes:true,attributeFilter:['class']})}
 if(xv)xv.addEventListener('play',()=>{if(!soundOn)return;const left=Math.max(3,((xv.duration||12)-(xv.currentTime||0))*.95),step=music.volume/(left*10);
  soundOn=false;sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');clearInterval(fadeT);
  fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-step);if(music.volume<=0){music.pause();clearInterval(fadeT)}},100)})});
window.__GUEST_INTERIOR__={render};
})();
