/* GUEST · ajustes de estilo por pedido (títulos, tipografías, tamaños y colores).
 * Se aplica encima de cualquier diseño del catálogo, después de su propio APPLY_CONFIG.
 * No toca los datos de la pareja: solo etiqueta elementos y añade una hoja de estilo.
 */
(()=>{'use strict';
if(window.GUEST_STYLE_V1)return;

// Fuentes de Google Fonts (ya declaradas en la privacidad por las propias invitaciones).
const FONTS=[
 ['pinyon','Pinyon Script','cursive','Caligráfica'],['great-vibes','Great Vibes','cursive','Caligráfica'],['parisienne','Parisienne','cursive','Caligráfica'],
 ['alex-brush','Alex Brush','cursive','Caligráfica'],['allura','Allura','cursive','Caligráfica'],['italianno','Italianno','cursive','Caligráfica'],['dancing','Dancing Script','cursive','Caligráfica'],
 ['playfair','Playfair Display','serif','Clásica'],['cormorant','Cormorant Garamond','serif','Clásica'],['eb-garamond','EB Garamond','serif','Clásica'],['lora','Lora','serif','Clásica'],
 ['baskerville','Libre Baskerville','serif','Clásica'],['bodoni','Bodoni Moda','serif','Clásica'],['cinzel','Cinzel','serif','Clásica'],['marcellus','Marcellus','serif','Clásica'],
 ['montserrat','Montserrat','sans-serif','Moderna'],['josefin','Josefin Sans','sans-serif','Moderna'],['raleway','Raleway','sans-serif','Moderna'],['lato','Lato','sans-serif','Moderna'],
 ['jost','Jost','sans-serif','Moderna'],['poppins','Poppins','sans-serif','Moderna'],
 ['kalam','Kalam','cursive','Divertida'],['amatic','Amatic SC','cursive','Divertida'],['bangers','Bangers','cursive','Divertida']
].map(([id,name,fallback,kind])=>({id,name,kind,family:`'${name}', ${fallback}`}));
const FONT=Object.fromEntries(FONTS.map(f=>[f.id,f]));
const ROLES=['names','titles','kickers','body','button'];
const SECTION_LABEL={welcome:'Bienvenida',countdown:'Cuenta atrás',story:'Vuestra historia',locations:'Lugares',venue:'Lugares',places:'Lugares',agenda:'Programa',practical:'Detalles',gallery:'Galería',rsvp:'Confirmación',close:'Final',closing:'Final',finale:'Final'};
const BUTTON_SEL='#rsvp-link,#rsvpBtn,button#rsvp,a.rsvp-button';
const NAMES_SEL='#cover h1,h1.cover-names,h1.hero-names,#closing-names,.closing-sign,#finalNames,#close h2';
const HEX=/^#[0-9a-f]{6}$/i;

const short=(el,max=70)=>el&&el.children.length===0&&el.textContent.trim().length>0&&el.textContent.trim().length<=max;
function hostOf(el){return el.closest('section[id],footer[id],header[id]')}

// Marca cada elemento con su papel una sola vez (data-wsd) y guarda el texto original.
function tag(doc){
 if(doc.documentElement.dataset.wsdTagged)return;
 const set=(el,role)=>{if(el&&!el.dataset.wsd)el.dataset.wsd=role};
 doc.querySelectorAll(NAMES_SEL).forEach(el=>set(el,'names'));
 doc.querySelectorAll(BUTTON_SEL).forEach(el=>set(el,'button'));
 doc.querySelectorAll('h2').forEach(h=>{
  const sec=hostOf(h);if(!sec||h.dataset.wsd)return;
  set(h,'titles');
  if(!sec.querySelector('[data-wsd-key="'+sec.id+':title"]'))h.dataset.wsdKey=sec.id+':title';
  const k=h.previousElementSibling;
  if(short(k)&&!k.dataset.wsd){set(k,'kickers');k.dataset.wsdKey=sec.id+':kicker'}
 });
 const h1=doc.querySelector('#cover h1,h1');const tagEl=h1&&h1.previousElementSibling;
 if(short(tagEl,40)){set(tagEl,'kickers');tagEl.dataset.wsdKey='coverTag'}
 doc.querySelectorAll('[class$="-wait"],[class*="-wait "]').forEach(el=>{if(short(el,40)){set(el,'kickers');el.dataset.wsdKey='wait'}});
 doc.querySelectorAll('section p,section li,section dd,section address,footer p,.bodycopy').forEach(el=>{if(!el.dataset.wsd&&!el.closest('[data-wsd]')&&!el.querySelector(BUTTON_SEL))set(el,'body')});
 doc.documentElement.dataset.wsdTagged='1';
}

// El primer nodo de texto con contenido: así se respetan iconos o adornos dentro del botón.
function textNode(el){const w=el.ownerDocument.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(n.nodeValue.trim())return n;return null}
function setText(el,value){
 if(el.dataset.wsdOrig==null)el.dataset.wsdOrig=el.innerHTML;
 if(value==null||value===''){if(el.dataset.wsdOrig!=null&&el.innerHTML!==el.dataset.wsdOrig)el.innerHTML=el.dataset.wsdOrig;return}
 if(el.children.length&&el.dataset.wsd==='button'){const n=textNode(el);if(n){n.nodeValue=value;return}}
 el.textContent=value;
}

// Texto original legible (los <br> cuentan como espacio)
function plain(doc,e){if(!e)return null;const d=doc.createElement('div');d.innerHTML=(e.dataset.wsdOrig??e.innerHTML).replace(/<br\s*\/?>/gi,' ');return d.textContent.replace(/\s+/g,' ').trim()}

function scan(doc){
 tag(doc);
 const sections=[],seen=new Set();
 doc.querySelectorAll('[data-wsd-key$=":title"],[data-wsd-key$=":kicker"]').forEach(el=>{
  const id=el.dataset.wsdKey.split(':')[0];if(seen.has(id))return;seen.add(id);
  const t=doc.querySelector(`[data-wsd-key="${id}:title"]`),k=doc.querySelector(`[data-wsd-key="${id}:kicker"]`);
  const orig=(e)=>plain(doc,e);
  sections.push({id,label:SECTION_LABEL[id]||id,title:orig(t),kicker:orig(k)});
 });
 const one=(sel)=>plain(doc,doc.querySelector(sel));
 return{sections,coverTag:one('[data-wsd-key="coverTag"]'),wait:one('[data-wsd-key="wait"]'),button:one('[data-wsd="button"]')};
}

function css(style){
 const out=[],f=style.fonts||{},s=style.sizes||{},c=style.colors||{};
 for(const r of ROLES){
  const sel=`[data-wsd="${r}"]`,rules=[];
  if(FONT[f[r]])rules.push(`font-family:${FONT[f[r]].family}!important`);
  const z=Number(s[r]);if(z&&z!==1)rules.push(`zoom:${z}`);
  if(r==='button'){
   if(HEX.test(c.button||''))rules.push(`background:${c.button}!important`,`border-color:${c.button}!important`);
   if(HEX.test(c.buttonText||''))rules.push(`color:${c.buttonText}!important`,`-webkit-text-fill-color:${c.buttonText}!important`);
  }else if(HEX.test(c[r]||''))rules.push(`color:${c[r]}!important`,`-webkit-text-fill-color:${c[r]}!important`);
  if(r==='kickers'&&['upper','none'].includes(style.kickerCase))rules.push(`text-transform:${style.kickerCase==='upper'?'uppercase':'none'}!important`);
  if(rules.length)out.push(`${sel},${sel} *{${rules.filter(x=>!x.startsWith('zoom')&&!x.startsWith('background')&&!x.startsWith('border')).join(';')}}${sel}{${rules.join(';')}}`);
 }
 for(const [id,t] of Object.entries(style.texts||{}))if(t&&t.hideKicker)out.push(`[data-wsd-key="${CSS.escape(id)}:kicker"]{display:none!important}`);
 return out.join('\n');
}

function fontsLink(doc,ids){
 const want=[...new Set(ids.filter(id=>FONT[id]))].sort();
 let link=doc.getElementById('wsd-fonts');
 const href=want.length?'https://fonts.googleapis.com/css2?'+want.map(id=>'family='+FONT[id].name.replace(/ /g,'+')+':wght@400;700').join('&')+'&display=swap':'';
 if(!href){link?.remove();return}
 if(!link){link=doc.createElement('link');link.id='wsd-fonts';link.rel='stylesheet';doc.head.appendChild(link)}
 if(link.getAttribute('href')!==href)link.setAttribute('href',href);
}

function apply(doc,style){
 if(!doc||!doc.documentElement)return;
 style=style&&typeof style==='object'?style:{};
 tag(doc);
 fontsLink(doc,Object.values(style.fonts||{}));
 let el=doc.getElementById('wsd-style');
 if(!el){el=doc.createElement('style');el.id='wsd-style';(doc.head||doc.documentElement).appendChild(el)}
 el.textContent=css(style);
 const texts=style.texts||{};
 doc.querySelectorAll('[data-wsd-key]').forEach(node=>{
  const key=node.dataset.wsdKey;let v=null;
  if(key==='coverTag'||key==='wait')v=style[key];
  else{const [id,part]=key.split(':');v=texts[id]?.[part]}
  setText(node,typeof v==='string'?v.trim():'');
 });
 doc.querySelectorAll('[data-wsd="button"]').forEach(b=>setText(b,typeof style.button==='string'?style.button.trim():''));
}

// Algo cambiado respecto al diseño original
function isEmpty(style){if(!style)return true;const has=(o)=>o&&Object.values(o).some(v=>v&&(typeof v!=='object'||has(v)));return !has(style)}

window.GUEST_STYLE_V1=Object.freeze({version:'1.0.0',FONTS,ROLES,scan,apply,css,isEmpty});
})();
