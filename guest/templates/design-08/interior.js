/* CAJA DE MÚSICA · interior propio. Recibe el modelo neutro del motor (mismos datos del cuestionario);
   nunca inventa campos y oculta lo que no existe. Todo el texto variable se inserta con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('cj');
const ORN='<svg class="cj-orn cj-rv" viewBox="0 0 150 22" aria-hidden="true"><path d="M4 11h52M94 11h52"/><path d="M60 11c4-8 12-8 15 0s11 8 15 0"/><path d="M68 11c3 5 11 5 14 0"/></svg>';
const BAR='<svg class="cj-bar cj-rv" viewBox="0 0 150 40" aria-hidden="true"><path d="M5 8h140M5 14h140M5 20h140M5 26h140M5 32h140"/><ellipse cx="52" cy="23" rx="4.4" ry="3.1" transform="rotate(-22 52 23)"/><ellipse cx="75" cy="14" rx="4.4" ry="3.1" transform="rotate(-22 75 14)"/><ellipse cx="98" cy="20" rx="4.4" ry="3.1" transform="rotate(-22 98 20)"/></svg>';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function head(inner,kicker,title){inner.append(el('p','cj-kicker cj-rv',kicker),el('h2','cj-title cj-rv',title));inner.insertAdjacentHTML('beforeend',ORN)}
function img(p,cls,alt,h){const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','cj-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','cj-in');sec.append(inner);return inner}
let agendaState=null,openDrawer=null,io=null;
function render(vm){
 // franjas de continuidad con los vídeos (fondos de la autora)
 if(!document.querySelector('.cj-band')){const t=el('img','cj-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','cj-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 // historia
 let inner=scene(document.getElementById('story'),vm.story.show);
 if(vm.story.show){head(inner,'nuestra historia','Érase una vez…');if(vm.story.text)inner.append(el('p','cj-p cj-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'cj-fade cj-rv','Fotografía de la pareja'))}
 // lugares: programa de concierto
 inner=scene(document.getElementById('locations'),vm.venues.length>0);
 if(vm.venues.length){head(inner,'nos vemos aquí','El gran día');if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'cj-fade cj-rv','Fotografía del lugar',250));
  const prog=el('div','cj-prog');for(const v of vm.venues){const a=el('div','cj-act cj-rv');a.append(el('span','cj-act-k',v.label.toLowerCase()));const row=el('div','cj-act-row');row.append(el('span','cj-act-name',v.name));if(v.time){row.append(el('span','cj-act-dots'),el('span','cj-act-time',v.time))}a.append(row);if(v.address)a.append(el('div','cj-act-addr',v.address));if(v.links.length)a.append(links(v.links.map(([u,l])=>[u,l.toLowerCase()])));prog.append(a)}
  inner.append(prog);if(vm.dress)inner.append(el('p','cj-dress cj-rv','Código de vestimenta: '+vm.dress))}
 // agenda: partitura (1–5 momentos), avanza al bajar y cada nota se puede tocar
 const M=vm.moments;inner=scene(document.getElementById('agenda'),M.length>0);agendaState=null;
 if(M.length){head(inner,'para que no te pierdas nada','El programa');
  const staff=el('div','cj-staff');staff.setAttribute('role','group');staff.setAttribute('aria-label','Momentos del día');for(let k=0;k<5;k++){const l=el('i');l.style.top=(k*21)+'px';staff.append(l)}
  staff.append(el('span','cj-clef','𝄞'));const ph=el('span','cj-ph');staff.append(ph);
  const now=el('div','cj-now');now.setAttribute('aria-live','polite');const pitch=[52,31,42,21,63];
  const notes=M.map((m,i)=>{const b=el('button','cj-note');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);b.style.left=(22+(i+.5)*(76/M.length))+'%';b.style.top=pitch[i%5]+'px';const h=el('span','cj-head');b.append(h);b.onclick=()=>{agendaState.pick=i;agendaState.pickY=scrollY;agendaTick()};staff.append(b);
   const d=el('div');if(m.time)d.append(el('span','cj-tm',m.time));if(m.label)d.append(el('span','cj-lb',m.label));now.append(d);return {h,d}});
  inner.append(staff,now,el('p','cj-count'));if(M.length>1)inner.append(el('p','cj-tap','Toca una nota para ver su momento'));
  agendaState={staff,ph,notes,count:inner.querySelector('.cj-count'),n:M.length,pick:null,last:-1};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=agendaState.notes.findIndex(x=>x.d.classList.contains('on'));agendaState.pickY=scrollY;agendaState.pick=Math.max(0,Math.min(agendaState.n-1,c+(dx<0?1:-1)));agendaTick()},{passive:true})}
 // detalles: cajones (1–4), solo los que existen
 const D=vm.details;inner=scene(document.getElementById('practical'),D.length>0);openDrawer=null;
 if(D.length){head(inner,'todo lo que necesitas saber','Los detalles');const cab=el('div','cj-cab cj-rv'),tray=el('div','cj-tray'),tin=el('div','cj-tray-in');tray.append(tin);tray.id='cj-tray';
  const KEY={times:'transporte',accommodation:'alojamiento',gift:'regalos',playlist:'música'};
  D.forEach((x,i)=>{const b=el('button','cj-drawer'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','cj-tray');b.setAttribute('aria-label',x.title);b.append(el('span','cj-plate',KEY[x.kind]||x.title.toLowerCase()),el('span','cj-knob'));
   b.onclick=()=>{woodClick();if(openDrawer===b){b.setAttribute('aria-expanded','false');openDrawer=null;tray.style.height='0px';return}openDrawer?.setAttribute('aria-expanded','false');openDrawer=b;b.setAttribute('aria-expanded','true');fillTray(tin,x);tray.style.height=(tin.offsetHeight+12)+'px'};cab.append(b)});
  inner.append(cab,el('p','cj-hint cj-rv',D.length>1?'Abre cada cajón':'Abre el cajón'),tray)}
 // galería: una foto fundida por vista, deslizar y puntos accesibles
 const G=vm.gallery;inner=scene(document.getElementById('gallery'),G.length>0);
 if(G.length){head(inner,'un poco de nosotros','Recuerdos');const track=el('div','cj-rv');track.id='gallery-items';track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{const im=img(p,'cj-fade','Fotografía de la pareja');im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(track);
  if(G.length>1){const dots=el('div','cj-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 // compás entre secciones visibles (nunca sobre el contenido)
 const vis=[...document.querySelectorAll('[data-bg]:not(.invisible)')];vis.forEach((s,k)=>{if(k>0)s.querySelector('.cj-in').insertAdjacentHTML('afterbegin',BAR)});
 // entradas suaves
 io?.disconnect();const items=[...document.querySelectorAll('.cj-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 agendaTick();
}
function fillTray(tin,x){tin.replaceChildren(el('h3',null,x.title));
 const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));
 if(times.length){const tt=el('div','cj-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1].toLowerCase());s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));
 if(x.links.length)tin.append(links(x.links.map(([u,l])=>[u,l.toLowerCase()])));
 if(x.more){const d=el('details'),s=el('summary',null,x.more.label.toLowerCase());d.append(s);for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{const tr=document.getElementById('cj-tray');tr.style.height=(tin.offsetHeight+12)+'px'});tin.append(d)}}
function agendaTick(){const A=agendaState;if(!A)return;const vh=innerHeight;const y=A.staff.getBoundingClientRect().top;const q=A.n<2?1:Math.max(0,Math.min(1,(vh*.78-y)/(vh*.5)));const x=22+q*76;A.ph.style.left=x+'%';let cur=0;
 A.notes.forEach((o,i)=>{const nx=22+(i+.5)*(76/A.n);const on=x>=nx-1||A.n<2;o.h.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;A.last=cur;if(A.pick!=null)cur=A.pick;
 A.notes.forEach((o,i)=>{o.d.classList.toggle('on',i===cur);o.h.classList.toggle('cur',i===cur);if(i===cur)o.h.classList.add('on')});A.count.textContent=A.n>1?(cur+1)+' · '+A.n:''}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;agendaTick()})},{passive:true});addEventListener('resize',()=>agendaTick());
// sonido: melodía de la caja tras tocar la portada, botón para silenciar; clic de madera al abrir un cajón
const music=new Audio('%%MUSIC%%');music.loop=true;music.volume=0;let fadeT=null,AC=null,soundOn=false;
const sb=el('button','cj-snd','♪');sb.type='button';sb.setAttribute('aria-pressed','false');sb.setAttribute('aria-label','Activar música');
function setSound(on){soundOn=on;sb.setAttribute('aria-pressed',String(on));sb.setAttribute('aria-label',on?'Silenciar música':'Activar música');clearInterval(fadeT);
 if(on){const p=music.play();if(p&&p.catch)p.catch(()=>{});fadeT=setInterval(()=>{music.volume=Math.min(.6,music.volume+.04);if(music.volume>=.6)clearInterval(fadeT)},90)}
 else fadeT=setInterval(()=>{music.volume=Math.max(0,music.volume-.06);if(music.volume<=0){music.pause();clearInterval(fadeT)}},60)}
sb.onclick=()=>setSound(!soundOn);
function woodClick(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;const b=AC.createBuffer(1,Math.floor(AC.sampleRate*.09),AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,6);
 const src=AC.createBufferSource();src.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=1700;f.Q.value=2.2;const g=AC.createGain();g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.09);src.connect(f).connect(g).connect(AC.destination);src.start(t)}catch(e){}
 try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}
addEventListener('DOMContentLoaded',()=>{document.body.append(sb);const cover=document.getElementById('cover');
 const start=()=>{if(window.__GUEST_SUPPRESS_SOUND__)return;sb.classList.add('show');setSound(true);cover.removeEventListener('click',start)};cover.addEventListener('click',start);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&soundOn)music.pause();else if(!document.hidden&&soundOn)music.play().catch(()=>{})})});
window.__GUEST_INTERIOR__={render};
})();
