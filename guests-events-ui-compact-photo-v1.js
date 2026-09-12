(()=>{
'use strict';
if(window.__wsdEventsCompactPhotoV1)return;
window.__wsdEventsCompactPhotoV1=true;

const INVITE_API='weddly-event-invite';
let removeHero=false;
let patchTimer=0;
const $=s=>document.querySelector(s);
const isEn=()=>{try{const q=new URLSearchParams(location.search).get('ownerDemo');if(q==='en')return true;if(q==='es')return false;return JSON.parse(localStorage.getItem('weddly_pro_v7')||'null')?.settings?.lang==='en'}catch{return false}};
const T=(es,en)=>isEn()?en:es;

function ensureStyle(){
  if($('#wsdEventsCompactPhotoCss'))return;
  const s=document.createElement('style');
  s.id='wsdEventsCompactPhotoCss';
  s.textContent=`
    #wsdEventGuestCompact{background:var(--soft,#eef0e9);border-radius:14px;padding:13px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px}
    #wsdEventGuestCompact b{display:block;font-size:14px}
    #wsdEventGuestCompact small{display:block;color:var(--muted,#736f63);font-size:11px;margin-top:3px}
    #wsdEventGuestCompact button{border:1px solid var(--line,#e4ded2);background:#fff;color:var(--ink,#2c2a26);border-radius:10px;min-height:40px;padding:8px 11px;font-weight:800;white-space:nowrap}
    .wsd-eg-hidden{display:none!important}
    #wsdRemoveEventPhoto{margin-top:9px;width:100%;min-height:40px;border:1px solid var(--line,#e4ddd2);border-radius:10px;background:#fff;color:var(--danger,#a84535);font-weight:800}
    #wsdRemoveEventPhoto[hidden]{display:none!important}
    .photoPick.wsd-single-photo{display:block!important}
    .photoPick.wsd-single-photo .photoBox{max-width:100%!important}
  `;
  document.head.appendChild(s);
}

function patchGuestList(){
  const search=$('#guestSearch'),list=$('#guestList');
  if(!search||!list)return;
  const field=search.closest('.field'),card=search.closest('.card');
  if(!field||!card)return;
  let compact=card.querySelector('#wsdEventGuestCompact');
  if(!compact){
    compact=document.createElement('div');
    compact.id='wsdEventGuestCompact';
    compact.innerHTML=`<div><b>${T('Invitados del evento','Event guests')}</b><small data-wsd-eg-count></small></div><button type="button" data-wsd-eg-toggle>${T('Ver lista','Show list')}</button>`;
    field.before(compact);
    card.dataset.wsdGuestListOpen='0';
    compact.querySelector('[data-wsd-eg-toggle]').onclick=()=>{
      const open=card.dataset.wsdGuestListOpen!=='1';
      card.dataset.wsdGuestListOpen=open?'1':'0';
      field.classList.toggle('wsd-eg-hidden',!open);
      list.classList.toggle('wsd-eg-hidden',!open);
      compact.querySelector('[data-wsd-eg-toggle]').textContent=open?T('Ocultar lista','Hide list'):T('Ver lista','Show list');
    };
  }
  const open=card.dataset.wsdGuestListOpen==='1';
  field.classList.toggle('wsd-eg-hidden',!open);
  list.classList.toggle('wsd-eg-hidden',!open);
  const boxes=[...list.querySelectorAll('[data-guest]')];
  const selected=boxes.filter(x=>x.checked).length;
  const count=compact.querySelector('[data-wsd-eg-count]');
  if(count)count.textContent=T(`${selected} seleccionados de ${boxes.length}`,`${selected} selected of ${boxes.length}`);
}

function emptyPhotoPreview(old){
  const d=document.createElement('div');
  d.id='photoPrev1';
  d.style.cssText='aspect-ratio:4/3;border-radius:10px;background:#eee8df;margin-bottom:8px;display:grid;place-items:center;color:#736f63;font-size:13px';
  d.textContent=T('Sin foto','No photo');
  old.replaceWith(d);
  return d;
}

function patchEditor(){
  const card=$('#wsdInviteSheetCard'),photo1=card?.querySelector('#photo1');
  if(!card||!photo1)return;
  const field=photo1.closest('.inviteField'),pick=photo1.closest('.photoPick');
  if(!field||!pick)return;
  const label=field.querySelector('label');
  if(label)label.textContent=T('Foto de portada','Cover photo');
  pick.classList.add('wsd-single-photo');
  const boxes=pick.querySelectorAll('.photoBox');
  [...boxes].slice(1).forEach(x=>x.remove());
  const first=pick.querySelector('.photoBox');
  if(!first)return;
  let remove=first.querySelector('#wsdRemoveEventPhoto');
  if(!remove){
    remove=document.createElement('button');
    remove.type='button';
    remove.id='wsdRemoveEventPhoto';
    remove.textContent=T('Quitar foto','Remove photo');
    first.appendChild(remove);
    remove.onclick=()=>{
      removeHero=true;
      const preview=first.querySelector('#photoPrev1');
      if(preview&&preview.tagName==='IMG')emptyPhotoPreview(preview);
      else if(preview){preview.textContent=T('Sin foto','No photo');preview.style.display='grid';preview.style.placeItems='center';preview.style.color='#736f63';preview.style.fontSize='13px'}
      photo1.value='';
      remove.hidden=true;
    };
  }
  remove.hidden=first.querySelector('#photoPrev1')?.tagName!=='IMG';
}

function patchAll(){ensureStyle();patchGuestList();patchEditor()}
function schedule(ms=0){clearTimeout(patchTimer);patchTimer=setTimeout(patchAll,ms)}

const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init)=>{
  let rewritten=false,nextInit=init;
  try{
    const url=typeof input==='string'?input:(input?.url||'');
    if(url.includes(INVITE_API)&&String(init?.method||'GET').toUpperCase()==='POST'&&typeof init?.body==='string'){
      const body=JSON.parse(init.body);
      if(body?.action==='save_payload'&&body.payload&&typeof body.payload==='object'){
        body.payload.secondPhoto='';
        if(removeHero)body.payload.heroPhoto='';
        nextInit={...init,body:JSON.stringify(body)};
        rewritten=true;
      }
    }
  }catch{}
  const p=nativeFetch(input,nextInit);
  if(!rewritten)return p;
  return Promise.resolve(p).then(r=>{if(r?.ok)removeHero=false;return r});
};

document.addEventListener('click',e=>{
  if(e.target?.closest?.('#inviteEdit')){removeHero=false;[0,80,220].forEach(ms=>setTimeout(patchEditor,ms))}
  if(e.target?.closest?.('#app')){setTimeout(patchGuestList,120);setTimeout(patchGuestList,700)}
},true);
document.addEventListener('change',e=>{
  if(e.target?.id==='photo1'){removeHero=false;[90,320,800].forEach(ms=>setTimeout(patchEditor,ms))}
  if(e.target?.closest?.('#app')){setTimeout(patchGuestList,120);setTimeout(patchGuestList,700)}
},true);
addEventListener('pageshow',()=>{[40,180,600,1400].forEach(ms=>setTimeout(patchAll,ms))});
[40,180,600,1400,2600].forEach(ms=>setTimeout(patchAll,ms));
})();
