(()=>{
'use strict';
if(window.__guestVisualPremiumV1)return;window.__guestVisualPremiumV1=true;
const G=window.__GuestsProd;if(!G?.f)return;

const CSS=`
:root{
  --guest-bg:#F2EFE9;
  --guest-paper:#FBF8F3;
  --guest-card:#FFFFFF;
  --guest-ink:#2C2A26;
  --guest-muted:#736F63;
  --guest-olive:#525C43;
  --guest-line:#E4DED2;
  --guest-soft:#EEE8DF;
  --guest-shadow:0 10px 30px rgba(44,42,38,.055);
}
html,body{background:var(--guest-bg)!important;color:var(--guest-ink)!important}
body{padding-bottom:118px!important}
.wrap{max-width:720px!important;padding:22px 20px 32px!important}
.brand{
  display:flex!important;align-items:baseline!important;gap:8px!important;
  text-transform:none!important;letter-spacing:0!important;color:var(--guest-olive)!important;
  margin:2px 0 0!important;min-height:28px!important
}
.brand b{font:750 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.16em}
.brand span{font:600 18px/1 "Caveat","Segoe Print",cursive;color:var(--guest-muted)}
h1{font-size:44px!important;line-height:1.02!important;letter-spacing:-.025em!important;margin:17px 0 7px!important}
h2{font:500 30px/1.08 Georgia,serif!important;letter-spacing:-.015em!important;margin:20px 0 16px!important}
h3{line-height:1.18}
.weddingMeta{font-size:13px!important;line-height:1.35!important;margin:0 0 26px!important;gap:9px!important}
.metaBtn{min-height:40px;padding:8px 5px!important;text-underline-offset:4px!important}
.card,.step,.stat{
  border-color:var(--guest-line)!important;
  box-shadow:var(--guest-shadow)!important;
}
.card{border-radius:22px!important}
.step{border-radius:22px!important}
.stat{border-radius:20px!important}
.small{font-size:14px!important;line-height:1.5!important;color:var(--guest-muted)!important}
.sectiontag{font-size:11px!important;font-weight:800!important;letter-spacing:.145em!important;color:var(--guest-muted)!important}
.btn{
  min-height:48px!important;border-radius:14px!important;padding:12px 15px!important;
  font-size:14px!important;font-weight:780!important;line-height:1.2!important;
  transition:transform .14s ease,box-shadow .14s ease,background .14s ease
}
.btn:active{transform:scale(.985)}
.btn:not(.soft):not(.line){background:var(--guest-ink)!important}
.btn.soft{background:var(--guest-soft)!important}
.btn.line{border-color:var(--guest-line)!important}
.field,.choice{min-height:50px!important;border-color:#D7D0C6!important}
.field:focus-visible,.choice:focus-visible,.btn:focus-visible,.nav button:focus-visible,.metaBtn:focus-visible{
  outline:3px solid rgba(82,92,67,.28)!important;outline-offset:2px!important
}
.nav{
  left:50%!important;right:auto!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;
  transform:translateX(-50%)!important;width:calc(100% - 20px)!important;max-width:520px!important;
  border:1px solid rgba(221,213,200,.92)!important;border-radius:22px!important;
  padding:6px!important;background:rgba(255,255,255,.94)!important;
  box-shadow:0 14px 38px rgba(44,42,38,.14)!important;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)
}
.nav button{
  min-height:50px!important;border-radius:16px!important;padding:10px 4px!important;
  color:#5F5A54!important;font-size:13px!important;font-weight:750!important;
  transition:background .14s ease,color .14s ease,transform .14s ease
}
.nav button:active{transform:scale(.97)}
.nav button.on{background:var(--guest-olive)!important;color:#fff!important}
.sheet{background:rgba(30,28,25,.34)!important;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
.panel{
  border-radius:28px 28px 0 0!important;padding:24px 20px calc(28px + env(safe-area-inset-bottom))!important;
  max-height:90dvh!important;box-shadow:0 -14px 48px rgba(44,42,38,.12)!important
}
.toast{border-radius:18px!important;box-shadow:0 14px 34px rgba(0,0,0,.14)!important}
.pill{background:#F0ECE5!important;color:#5F5A54!important}
.pill.bad{background:#F6E8E4!important;color:#8A4035!important}
@media(max-width:520px){
  .wrap{padding:18px 16px 30px!important}
  h1{font-size:38px!important}
  h2{font-size:28px!important}
  .brand{margin-top:1px!important}
  .brand b{font-size:12px!important}
  .brand span{font-size:17px!important}
  .weddingMeta{margin-bottom:22px!important}
  .card{padding:18px!important}
  .step{padding:18px!important}
  .stat{padding:16px!important}
  .panel{padding-left:18px!important;padding-right:18px!important}
}
@media(max-width:350px){
  .wrap{padding-left:13px!important;padding-right:13px!important}
  h1{font-size:35px!important}
  .nav{width:calc(100% - 12px)!important}
  .nav button{font-size:12px!important}
}
@media(min-width:760px){
  .wrap{padding-top:30px!important;padding-bottom:40px!important}
  .nav{bottom:18px!important}
}
`;

function addFont(d){
  if(d.getElementById('guestPremiumFont'))return;
  const l=d.createElement('link');l.id='guestPremiumFont';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap';
  d.head.appendChild(l);
}
function brand(d){
  const el=d.querySelector('main.wrap>.brand');if(!el)return;
  if(el.dataset.guestPremiumBrand==='1')return;
  el.dataset.guestPremiumBrand='1';
  el.innerHTML='<b>GUEST</b><span>by WeddlySmartDesign</span>';
}
function apply(){
  let d;try{d=G.f.contentDocument}catch{return}
  if(!d?.head||!d.body)return;
  addFont(d);
  let s=d.getElementById('guestVisualPremiumV1');
  if(!s){s=d.createElement('style');s.id='guestVisualPremiumV1';s.textContent=CSS;d.head.appendChild(s)}
  d.documentElement.dataset.guestVisualPremium='1';
  brand(d);
}
G.f.addEventListener('load',()=>{[0,80,260,700].forEach(ms=>setTimeout(apply,ms))});
addEventListener('guests-prod-open',apply);
new MutationObserver(()=>apply()).observe(document.documentElement,{childList:true,subtree:true});
setInterval(apply,900);
apply();
})();