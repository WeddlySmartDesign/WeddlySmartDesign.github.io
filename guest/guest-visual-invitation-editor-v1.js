(()=>{
'use strict';
if(window.__guestB73Editor)return;window.__guestB73Editor=true;
const CSS=`
html[data-guest-b73-editor='1'] .panel{padding-top:20px!important}
html[data-guest-b73-editor='1'] .weddly-intbar{
 position:sticky!important;top:0!important;z-index:40!important;
 margin:0 -6px 12px!important;padding:8px 6px!important;
 background:color-mix(in srgb,var(--bg,#f6f4f0) 92%,transparent)!important;
 backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)
}
html[data-guest-b73-editor='1'] .weddly-intbar button{
 min-height:44px!important;border-radius:999px!important;padding:9px 12px!important;font-size:11px!important
}
html[data-guest-b73-editor='1'] #wsdInvitationFlow{gap:7px!important;margin:0 0 24px!important}
html[data-guest-b73-editor='1'] #wsdInvitationFlow button{min-height:46px!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:10.5px!important;line-height:1.2!important;padding:9px 7px!important}
html[data-guest-b73-editor='1'] .h1{font-size:25px!important;line-height:1.1!important;letter-spacing:-.015em}
html[data-guest-b73-editor='1'] .h1-sub{font-size:13px!important;line-height:1.5!important;margin-bottom:25px!important}
html[data-guest-b73-editor='1'] .section{margin-bottom:30px!important}
html[data-guest-b73-editor='1'] .step-label{font-size:11px!important;letter-spacing:.13em!important;margin-bottom:13px!important}
html[data-guest-b73-editor='1'] .tpl-card{min-height:48px;border-radius:15px!important}
html[data-guest-b73-editor='1'] .font-card{min-height:50px;border-radius:14px!important}
html[data-guest-b73-editor='1'] input[type=text],
html[data-guest-b73-editor='1'] input[type=date],
html[data-guest-b73-editor='1'] input[type=time],
html[data-guest-b73-editor='1'] input[type=url],
html[data-guest-b73-editor='1'] textarea,
html[data-guest-b73-editor='1'] select{min-height:48px!important;border-radius:12px!important;font-size:16px!important}
html[data-guest-b73-editor='1'] .toggle-row{min-height:50px!important}
html[data-guest-b73-editor='1'] .repeat-card{border-radius:15px!important}
html[data-guest-b73-editor='1'] .weddly-photo-card,html[data-guest-b73-editor='1'] .weddly-photo-empty{border-radius:15px!important}
html[data-guest-b73-editor='1'] .weddly-save-bottom{padding-top:16px!important;margin-bottom:22px!important}
html[data-guest-b73-editor='1'] .weddly-save-bottom button{min-height:52px!important;border-radius:14px!important;font-size:14px!important}
@media(max-width:560px){
 html[data-guest-b73-editor='1'] .panel{padding:16px 16px 48px!important}
 html[data-guest-b73-editor='1'] .tpl-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
 html[data-guest-b73-editor='1'] .row2{grid-template-columns:1fr!important;gap:0!important}
 html[data-guest-b73-editor='1'] .weddly-intbar{flex-wrap:nowrap!important;overflow-x:auto!important}
 html[data-guest-b73-editor='1'] .weddly-intbar button{flex:0 0 auto!important}
 html[data-guest-b73-editor='1'] .preview-pane{min-height:auto!important;padding:18px 10px 26px!important;position:relative!important}
 html[data-guest-b73-editor='1'] .phone-frame{max-width:360px!important}
}
@media(max-width:350px){
 html[data-guest-b73-editor='1'] .panel{padding-left:12px!important;padding-right:12px!important}
 html[data-guest-b73-editor='1'] #wsdInvitationFlow{gap:5px!important}
 html[data-guest-b73-editor='1'] #wsdInvitationFlow button{font-size:9.5px!important;padding-left:5px!important;padding-right:5px!important}
}
@media(min-width:760px){
 html[data-guest-b73-editor='1'] .panel{padding:24px 24px 54px!important}
 html[data-guest-b73-editor='1'] .weddly-intbar{top:0!important}
}
html[data-guest-b73-editor='1'] button:focus-visible,
html[data-guest-b73-editor='1'] a:focus-visible,
html[data-guest-b73-editor='1'] input:focus-visible,
html[data-guest-b73-editor='1'] select:focus-visible,
html[data-guest-b73-editor='1'] textarea:focus-visible{outline:3px solid rgba(82,92,67,.30)!important;outline-offset:2px!important}
@media(prefers-reduced-motion:reduce){
 html[data-guest-b73-editor='1'] *,html[data-guest-b73-editor='1'] *::before,html[data-guest-b73-editor='1'] *::after{scroll-behavior:auto!important}
 html[data-guest-b73-editor='1'] button,html[data-guest-b73-editor='1'] .weddly-intbar{transition:none!important;animation:none!important}
}
`;
function docs(){
 const out=[document];let f=document.getElementById('editor');
 for(let i=0;i<3&&f;i++){try{const d=f.contentDocument;if(!d)break;out.push(d);f=d.getElementById('editor')}catch{break}}
 return out;
}
function apply(d){
 if(!d?.head||!d.body)return;
 let s=d.getElementById('guestB73EditorStyle');if(!s){s=d.createElement('style');s.id='guestB73EditorStyle';s.textContent=CSS;d.head.appendChild(s)}
 d.documentElement.dataset.guestB73Editor='1';
}
function patch(){for(const d of docs())apply(d)}
for(const d of docs()){try{new MutationObserver(()=>requestAnimationFrame(patch)).observe(d.documentElement,{childList:true,subtree:true})}catch{}}
const f=document.getElementById('editor');f?.addEventListener('load',()=>[30,140,400].forEach(ms=>setTimeout(patch,ms)));
[20,100,300,700,1400].forEach(ms=>setTimeout(patch,ms));
})();