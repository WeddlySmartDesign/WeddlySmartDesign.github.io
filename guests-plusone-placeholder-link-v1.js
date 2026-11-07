(()=>{
'use strict';
if(window.__wsdPlusOnePlaceholderLinkV1)return;window.__wsdPlusOnePlaceholderLinkV1=true;
const KEY='weddly_guests_qa_v67',SAFE_PATCH_WRITE='wsd-safe-patch-write-v1';
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,' ').replace(/[()\[\],.;:–—-]/g,' ').replace(/\s+/g,' ').trim();
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&typeof x==='object'?x:null}catch{return null}}
function persistLatest(patches){
  if(!patches.length)return false;const latest=read();if(!latest?.guests)return false;let changed=false;
  for(const x of patches){const p=latest.guests[x.id];if(!p||typeof p!=='object'||p.source==='rsvp_plus_one'||p.rsvpPlaceholderResolved===true)continue;const existing=String(p.rsvpPlaceholderFor||'');if(existing&&latest.guests[existing])continue;if(!latest.guests[x.target])continue;p.rsvpPlaceholderFor=x.target;p.rsvpPlaceholderKind='plus_one';p.rsvpPlaceholderPending=true;p.rsvpPlaceholderDetectedAt=p.rsvpPlaceholderDetectedAt||x.detectedAt;changed=true}
  if(!changed)return false;try{Storage.prototype.setItem.call(localStorage,KEY,JSON.stringify(latest));void SAFE_PATCH_WRITE;return true}catch{return false}
}
function cleanPendingNote(v){return norm(v).replace(/\s+(nombre pendiente|nombre por confirmar|sin nombre|nombre desconocido|no se su nombre|no sabemos su nombre|por confirmar|pending name|name pending|unknown name|name unknown)$/,'').trim()}
function targetFromLabel(label){
  const n=cleanPendingNote(label);
  const patterns=[/^pareja de (.+)$/,/^acompanante de (.+)$/,/^novio de (.+)$/,/^novia de (.+)$/,/^esposo de (.+)$/,/^esposa de (.+)$/,/^marido de (.+)$/,/^mujer de (.+)$/,/^\+1 de (.+)$/,/^plus one de (.+)$/,/^partner of (.+)$/,/^guest of (.+)$/,/^(.+) partner$/,/^(.+) plus one$/];
  for(const re of patterns){const m=n.match(re);if(m?.[1])return{target:cleanPendingNote(m[1]),generic:false}}
  if(/^(pareja|acompanante|novio|novia|esposo|esposa|marido|mujer|\+1|plus one|partner|guest)$/.test(n))return{target:'',generic:true};
  return null;
}
function sameScope(a,b){const ag=norm(a?.group),bg=norm(b?.group),au=norm(a?.unitId),bu=norm(b?.unitId);if(au&&bu)return au===bu&&(!ag||!bg||ag===bg);if(ag&&bg)return ag===bg;return false}
function candidateFor(S,id,p){
  const gs=S.guests||{},parsed=targetFromLabel(p?.name);if(!parsed)return'';const direct=String(p?.invitationRecipientId||'');if(direct&&direct!==id&&gs[direct])return direct;if(!parsed.target)return'';
  const all=Object.entries(gs).filter(([gid,g])=>gid!==id&&g&&g.source!=='rsvp_plus_one'&&!targetFromLabel(g.name)),words=parsed.target.split(' ').filter(Boolean),isFull=words.length>1,matches=all.filter(([,g])=>{const n=norm(g.name);return isFull?n===parsed.target:n.split(' ')[0]===parsed.target});if(matches.length===1)return String(matches[0][0]);const scoped=matches.filter(([,g])=>sameScope(p,g));if(scoped.length===1)return String(scoped[0][0]);return'';
}
function scan(){
  const S=read();if(!S?.guests)return;const patches=[],detectedAt=new Date().toISOString();
  for(const [id,p] of Object.entries(S.guests)){
    if(!p||typeof p!=='object'||p.source==='rsvp_plus_one'||p.rsvpPlaceholderResolved===true)continue;const parsed=targetFromLabel(p.name);if(!parsed)continue;const existing=String(p.rsvpPlaceholderFor||'');if(existing&&S.guests[existing])continue;const target=candidateFor(S,id,p);if(target)patches.push({id,target,detectedAt});
  }
  persistLatest(patches);
}
let last='';setInterval(()=>{let raw='';try{raw=localStorage.getItem(KEY)||''}catch{}if(raw===last)return;last=raw;scan();try{last=localStorage.getItem(KEY)||''}catch{}},650);
[60,250,800,1800].forEach(ms=>setTimeout(scan,ms));addEventListener('storage',e=>{if(e.key===KEY)setTimeout(scan,0)});
})();
