/* ABANICO · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('ab');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function head(inner,kicker,title){inner.append(el('p','ab-kicker ab-rv',kicker),el('h2','ab-title ab-rv',title))}
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
  const places=el('div','ab-places ab-rv');vm.venues.forEach(v=>{const a=el('div','ab-venue');const info=el('div','ab-v-info');info.append(el('span','ab-v-k',v.label),el('div','ab-v-name',v.name));if(v.address)info.append(el('div','ab-v-addr',v.address));if(v.links.length)info.append(links(v.links));a.append(el('div','ab-v-time',v.time||''),info);places.append(a)});inner.append(places)
  if(vm.dress)inner.append(el('p','ab-dress ab-rv','Código de vestimenta: '+vm.dress))}
 // agenda: un abanico que se abre al bajar; cada varilla es un momento y se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const sky=el('div','ab-sky ab-rv');sky.setAttribute('role','group');sky.setAttribute('aria-label','Momentos del día');
  const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox',`0 0 ${FW} ${FH}`);svg.setAttribute('aria-hidden','true');
  let defs='',body='';const ord=WG.map((c,j)=>[c,j]).sort((x,y)=>Math.abs(x[0])-Math.abs(y[0]));
  WG.forEach((c,j)=>{defs+=`<clipPath id="ab-w${j}"><path d="${sector(j?c-WW/2-.5:-178,j<NW-1?c+WW/2+.5:178)}"/></clipPath>`});
  ord.forEach(([c,j])=>{body+=`<g class="ab-wg" data-j="${j}"><image href="%%FANB%%" width="${FW}" height="${FH}" clip-path="url(#ab-w${j})"/></g>`});
  svg.innerHTML=`<defs>${defs}</defs><g class="ab-body">${body}</g><image href="%%FANP%%" width="${FW}" height="${FH}"/>`;sky.append(svg);
  const wgs=[...svg.querySelectorAll('.ab-wg')].map(g=>[g,WG[+g.dataset.j]]);
  const now=el('div','ab-now');
  const pts=M.map((m,i)=>{const b=el('button','ab-mk');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.append(el('i'));b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};sky.append(b);
   const d=el('div');d.append(el('span','ab-tm',m.time||''));if(m.label)d.append(el('span','ab-lb',m.label));d.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};now.append(d);return {b,d,f:M.length<2?.5:i/(M.length-1)}});
  inner.append(sky,now);if(M.length>1)inner.append(el('p','ab-hint ab-rv','Toca un momento para resaltarlo'));A={sky,svg,wgs,pts,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.pts.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: muestras de seda marfil con filo dorado; un reflejo las recorre hasta el primer toque
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openFan=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const grid=el('div','ab-sws ab-rv'),tray=el('div','ab-tray'),tin=el('div','ab-tray-in');tray.id='ab-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','ab-sw'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','ab-tray');
   b.style.setProperty('--i',i);b.append(el('span','ab-sw-lb',x.title));
   b.onclick=()=>{grid.classList.add('used');if(openFan===b){b.setAttribute('aria-expanded','false');openFan=null;tray.style.height='0px';return}openFan?.setAttribute('aria-expanded','false');openFan=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px'};grid.append(b)});
  inner.append(grid,el('p','ab-hint ab-rv',D.length>1?'Toca cada seda para abrir su información':'Toca la seda para abrir su información'),tray)}
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
// el abanico del programa: el abanico real (tela pintada a pinceladas) cortado en gajos que giran sobre el remache; se abre según se baja
const FW=680,FH=583,CX=346.14,CY=379.96,RL=374.11,T0=-69.03,T1=66.39,NW=24,WW=(T1-T0+3)/NW;
const WG=Array.from({length:NW},(_,j)=>T0-1.5+WW*(j+.5));
const P=(deg,r)=>{const a=(deg-90)*Math.PI/180;return [CX+Math.cos(a)*r,CY+Math.sin(a)*r]};
const f2=v=>v.toFixed(1);
function sector(a,b){const [x1,y1]=P(a,RL*1.3),[x2,y2]=P(b,RL*1.3);return `M${f2(CX)} ${f2(CY)} L${f2(x1)} ${f2(y1)} A${f2(RL*1.3)} ${f2(RL*1.3)} 0 ${b-a>180?1:0} 1 ${f2(x2)} ${f2(y2)} Z`}
function tick(){if(!A)return;const vh=innerHeight,y=A.sky.getBoundingClientRect().top;const q=reducedMotion()?1:Math.max(0,Math.min(1,(vh*.9-y)/(vh*.5)));
 const k=.03+.97*(q*q*(3-2*q));let cur=0;
 A.wgs.forEach(([g,c])=>g.setAttribute('transform',`rotate(${f2((k-1)*c)} ${CX} ${CY})`));
 A.pts.forEach((t,i)=>{const deg=k*(T0+8+(T1-T0-16)*t.f),[mx,my]=P(deg,RL+20);t.b.style.left=(mx/FW*100)+'%';t.b.style.top=(my/FH*100)+'%';const on=q>.2+.75*(A.n<2?0:i/(A.n-1))||q>=1;t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.pts.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')})}
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
