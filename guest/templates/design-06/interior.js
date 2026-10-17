/* INVERNADERO · interior propio. Mismo modelo neutro del cuestionario; texto variable siempre con textContent. */
(()=>{'use strict';
document.documentElement.classList.add('iv');
const SVG='http://www.w3.org/2000/svg';
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function head(inner,kicker,title,first){if(!first)inner.append(el('span','iv-gap'));const h=el('h2','iv-title iv-rv',title);h.dataset.text=title;inner.append(el('p','iv-kicker iv-rv',kicker),h)}
function img(p,cls,alt,h){if(cls&&cls.includes('iv-fade')&&!img.raw){const f=el('figure','iv-glass '+cls.replace('iv-fade','').trim());img.raw=1;const i=img(p,'iv-ph',alt,h);img.raw=0;f.append(i,el('span','iv-fog'));return f}const i=el('img',cls);i.src=p.src;i.alt=p.alt||alt;i.loading='lazy';i.dataset.fit=p.fit;i.style.objectPosition=p.fx+'% '+p.fy+'%';if(h&&p.fit!=='full')i.style.height=h+'px';return i}
function links(list){const r=el('div','iv-links');for(const [u,l] of list){const a=el('a','link',l);a.href=u;a.target='_blank';a.rel='noopener noreferrer';r.append(a)}return r}
function scene(sec,show){sec.classList.toggle('invisible',!show);sec.replaceChildren();const inner=el('div','iv-in');sec.append(inner);return inner}
const STEM='M6 96 C 60 96, 80 40, 130 52 S 200 104, 250 70 S 310 22, 334 30';
let A=null,openEnv=null,io=null;
function post(){document.querySelectorAll('.iv-venue').forEach(v=>{const t=v.querySelector('.iv-v-time'),k=v.querySelector('.iv-v-k');if(t&&k&&t.textContent){k.after(t);t.style.display='block'}else if(t&&!t.textContent)t.remove()})}
function render(vm){
 if(!document.querySelector('.iv-band')){const t=el('img','iv-band');t.src='%%BANDTOP%%';t.alt='';t.setAttribute('aria-hidden','true');document.getElementById('cover').after(t);
  const b=el('img','iv-band');b.src='%%BANDBOT%%';b.alt='';b.setAttribute('aria-hidden','true');document.getElementById('closing').before(b)}
 const order=[];const mark=s=>{order.push(s);return order.length===1};
 let sec=document.getElementById('story'),inner=scene(sec,vm.story.show);
 if(vm.story.show){head(inner,'Nuestra historia','Érase una vez…',mark(sec));if(vm.story.text)inner.append(el('p','iv-p iv-rv',vm.story.text));if(vm.story.photo)inner.append(img(vm.story.photo,'iv-fade iv-rv','Fotografía de la pareja'))}
 sec=document.getElementById('locations');inner=scene(sec,vm.venues.length>0);
 if(vm.venues.length){head(inner,'Nos vemos aquí','El gran día',mark(sec));if(vm.venuePhoto)inner.append(img(vm.venuePhoto,'iv-fade iv-rv','Fotografía del lugar',250));
  const places=el('div','iv-places iv-rv');vm.venues.forEach(v=>{const a=el('div','iv-venue');const info=el('div','iv-v-info');info.append(el('span','iv-v-k',v.label),el('div','iv-v-name',v.name));if(v.address)info.append(el('div','iv-v-addr',v.address));if(v.links.length)info.append(links(v.links));a.append(el('i','iv-eye'),el('div','iv-v-time',v.time||''),info);places.append(a)});inner.append(places)
  if(vm.dress)inner.append(el('p','iv-dress iv-rv','Código de vestimenta: '+vm.dress))}
 // agenda: el tallo crece al bajar y despliega una hoja por momento; cada hoja se puede tocar
 const M=vm.moments;sec=document.getElementById('agenda');inner=scene(sec,M.length>0);A=null;
 if(M.length){head(inner,'Para que no te pierdas nada','El programa',mark(sec));const stem=el('div','iv-stem iv-rv');stem.setAttribute('role','group');stem.setAttribute('aria-label','Momentos del día');
  const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox','0 0 340 120');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
  svg.innerHTML=`<path class="bg" d="${STEM}" vector-effect="non-scaling-stroke"/><path class="fg" d="${STEM}" vector-effect="non-scaling-stroke"/>`;stem.append(svg);
  const fg=svg.querySelector('.fg'),L=fg.getTotalLength();fg.style.strokeDasharray=L;fg.style.strokeDashoffset=L;
  const now=el('div','iv-now');now.setAttribute('aria-live','polite');
  const leaves=M.map((m,i)=>{const f=M.length<2?.55:.12+.8*i/(M.length-1),pt=fg.getPointAtLength(L*f);const b=el('button','iv-lf');b.type='button';b.setAttribute('aria-label',(m.time?m.time+' ':'')+m.label);
   b.style.left=(pt.x/340*100)+'%';b.style.top=(pt.y/120*100)+'%';const lf=el('i');lf.style.setProperty('--r',(i%2?38:-38)+'deg');b.append(lf);b.onclick=()=>{A.pick=i;A.pickY=scrollY;tick()};stem.append(b);
   const d=el('div');if(m.time)d.append(el('span','iv-tm',m.time));if(m.label)d.append(el('span','iv-lb',m.label));now.append(d);return {b,d,f}});
  inner.append(stem,now);if(M.length>1)inner.append(el('p','iv-tap','Toca una hoja para ver su momento'));A={stem,fg,L,leaves,n:M.length,pick:null};
  let x0=null;now.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});now.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<40)return;const c=A.leaves.findIndex(t=>t.d.classList.contains('on'));A.pick=Math.max(0,Math.min(A.n-1,c+(dx<0?1:-1)));A.pickY=scrollY;tick()},{passive:true})}
 // detalles: sobres de semillas (1–4) que se abren
 const D=vm.details;sec=document.getElementById('practical');inner=scene(sec,D.length>0);openEnv=null;
 if(D.length){head(inner,'Todo lo que necesitas saber','Los detalles',mark(sec));const envs=el('div','iv-envs iv-rv'),tray=el('div','iv-tray'),tin=el('div','iv-tray-in');tray.id='iv-tray';tray.append(tin);
  D.forEach((x,i)=>{const b=el('button','iv-env'+(D.length%2&&i===D.length-1?' solo':''));b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','iv-tray');
   const pk=el('span','iv-pk');const lab=el('span','iv-lab');lab.append(el('i','iv-sprig'),el('span','iv-env-lb',x.title));pk.append(el('span','iv-flap'),lab);b.append(pk);
   b.onclick=()=>{if(openEnv===b){b.setAttribute('aria-expanded','false');openEnv=null;tray.style.height='0px';return}openEnv?.setAttribute('aria-expanded','false');openEnv=b;b.setAttribute('aria-expanded','true');fill(tin,x);tray.style.height=(tin.offsetHeight+16)+'px';setTimeout(()=>{const r=tray.getBoundingClientRect(),over=r.bottom-innerHeight+20;if(over>0)scrollBy({top:Math.min(over,r.top-80),behavior:reducedMotion()?'auto':'smooth'})},reducedMotion()?0:820)};envs.append(b)});
  inner.append(envs,el('p','iv-hint iv-rv',D.length>1?'Abre cada sobre':'Abre el sobre'),tray)}
 const G=vm.gallery;sec=document.getElementById('gallery');inner=scene(sec,G.length>0);
 if(G.length){head(inner,'Un poco de nosotros','Recuerdos',mark(sec));const glass=el('div','iv-glass iv-gal iv-rv');const track=el('div');track.id='gallery-items';glass.append(track,el('span','iv-fog'));track.setAttribute('role','region');track.setAttribute('aria-label','Galería de fotografías');
  G.forEach((p,i)=>{img.raw=1;const im=img(p,'iv-gimg','Fotografía de la pareja');img.raw=0;im.loading=i?'lazy':'eager';im.setAttribute('aria-label','Fotografía '+(i+1)+' de '+G.length);track.append(im)});inner.append(glass);
  if(G.length>1){const dots=el('div','iv-dots');const bs=G.map((_,i)=>{const b=el('button','gallery-dot');b.type='button';b.setAttribute('aria-label','Ver foto '+(i+1));b.onclick=()=>track.scrollTo({left:i*track.clientWidth,behavior:reducedMotion()?'auto':'smooth'});dots.append(b);return b});
   const upd=()=>{const k=Math.max(0,Math.min(bs.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));bs.forEach((b,i)=>b.setAttribute('aria-current',i===k?'true':'false'))};track.addEventListener('scroll',upd,{passive:true});inner.append(dots);upd()}}
 io?.disconnect();const items=[...document.querySelectorAll('.iv-rv')];
 if(reducedMotion()||typeof IntersectionObserver!=='function')items.forEach(e=>e.classList.add('in'));
 else{io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});items.forEach((e,i)=>{e.style.transitionDelay=(i%4)*110+'ms';io.observe(e)})}
 post();tick()}
function fill(tin,x){tin.replaceChildren(el('h3',null,x.title));const times=x.lines.filter(l=>/^(Ida|Vuelta):/.test(l)),rest=x.lines.filter(l=>!/^(Ida|Vuelta):/.test(l));
 for(const l of rest.slice(0,1))tin.append(el('p',null,l));if(times.length){const tt=el('div','iv-tt');for(const l of times){const m=l.match(/^(Ida|Vuelta):\s*(.*)$/);const s=el('span',null,m[1]);s.append(el('b',null,m[2]));tt.append(s)}tin.append(tt)}
 for(const l of rest.slice(1))tin.append(el('p',null,l));if(x.links.length)tin.append(links(x.links));
 if(x.more){const d=el('details');d.append(el('summary',null,x.more.label));for(const l of x.more.lines)d.append(el('p',null,l));d.addEventListener('toggle',()=>{document.getElementById('iv-tray').style.height=(tin.offsetHeight+16)+'px'});tin.append(d)}}
function tick(){if(!A)return;const vh=innerHeight,y=A.stem.getBoundingClientRect().top;const q=reducedMotion()||A.n<2?1:Math.max(0,Math.min(1,(vh*.82-y)/(vh*.5)));let cur=0;
 const grow=Math.max(q,.04);A.fg.style.strokeDashoffset=A.L*(1-grow);
 A.leaves.forEach((t,i)=>{const on=A.n<2||grow>=t.f-.02;t.b.classList.toggle('on',on);if(on)cur=i});
 if(A.pick!=null&&Math.abs(scrollY-(A.pickY||0))>90)A.pick=null;if(A.pick!=null)cur=A.pick;
 A.leaves.forEach((t,i)=>{t.d.classList.toggle('on',i===cur);t.b.classList.toggle('cur',i===cur);if(i===cur)t.b.classList.add('on')})}
let raf=0;addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;tick()})},{passive:true});addEventListener('resize',()=>tick());
window.__GUEST_INTERIOR__={render};
})();
