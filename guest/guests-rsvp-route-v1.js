(()=>{
'use strict';
const G=window.__GuestsProd;if(!G)return;const URL='guests-rsvp-operations-v2.html?v=140-mobile-ux';
function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
function go(){try{window.top.location.assign(URL)}catch{location.assign(URL)}}
function hook(d){if(!d?.documentElement||d.documentElement.dataset.wsdRsvpRouteV1==='1')return;d.documentElement.dataset.wsdRsvpRouteV1='1';d.addEventListener('click',e=>{const t=e.target?.closest?.('button,a');if(!t)return;const label=(t.textContent||'').trim();if(t.id!=='wsdOpenRsvpOps'&&!/^Abrir invitaciones y respuestas$/i.test(label))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();go()},true)}
function patch(){docs().forEach(hook)}
G.f?.addEventListener('load',()=>setTimeout(patch,100));addEventListener('guests-prod-open',patch);setInterval(patch,700);setTimeout(patch,150);
})();
