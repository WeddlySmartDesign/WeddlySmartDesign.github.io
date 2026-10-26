(()=>{
'use strict';
// GUEST brand layer: the app wears the same identity as the web and the emails
// (Abril Fatface, Courier Prime, Hanken Grotesk; navy ink, envelope pink, postmark red).
// Loaded last on each top-level page; it also dresses every same-origin iframe inside.
if(window.__guestSellosV1)return;window.__guestSellosV1=true;
const FONTS='/css/fonts.css';
const CSS=`
:root{
  --s-ink:#1b2650;--s-ink-soft:#4a5480;--s-paper:#fbf7f4;--s-envelope:#f0c4bc;--s-envelope-soft:#f6dcd6;
  --s-postmark:#b3263a;--s-line:#e3d6d1;
  --s-display:'Abril Fatface',Georgia,'Times New Roman',serif;
  --s-mono:'Courier Prime','Courier New',monospace;
  --s-text:'Hanken Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
}
html,body,button,input,select,textarea,.btn,.nav button,.field,.choice,.small,p,li,label{font-family:var(--s-text)!important}
h1,h2,#coupleTitle,.coupleTitle{font-family:var(--s-display)!important;font-weight:400!important;letter-spacing:0!important}
h3{font-family:var(--s-text)!important;font-weight:700!important;letter-spacing:-.005em}
.sectiontag,.kicker,.eyebrow{font-family:var(--s-mono)!important;font-weight:400!important;letter-spacing:.12em!important;color:var(--s-postmark)!important;text-transform:uppercase}
.brand{gap:2px!important;flex-direction:column!important;align-items:flex-start!important}
.brand b,.brand>span:first-child{font:400 24px/1 var(--s-display)!important;letter-spacing:.02em!important;text-transform:none!important;color:var(--s-ink)!important}
.brand b+span,.brand>span+span{font:400 12px/1.1 var(--s-mono)!important;letter-spacing:0!important;color:var(--s-ink-soft)!important;margin-top:3px!important}
.btn,.metaBtn,#editWedding{border-radius:999px!important;font-weight:600!important;letter-spacing:.005em}
.nav button,#nav button{font-weight:600!important}
html[data-guest-theme="sellos"] :is(h1,h2,#coupleTitle){color:var(--s-ink)!important}
.stat b,.stat strong{font-family:var(--s-display)!important;font-weight:400!important}
html[data-guest-sellos-top]::before{content:"";position:fixed;z-index:2147483000;left:0;right:0;top:0;height:5px;pointer-events:none;
  background:repeating-linear-gradient(135deg,var(--s-postmark) 0 12px,var(--s-paper) 12px 20px,var(--s-ink) 20px 32px,var(--s-paper) 32px 40px)}
`;
function dress(d){
  try{
    if(!d||!d.head||d.getElementById('guestSellosCss'))return;
    const l=d.createElement('link');l.rel='stylesheet';l.href=FONTS;l.id='guestSellosFonts';d.head.appendChild(l);
    const s=d.createElement('style');s.id='guestSellosCss';s.textContent=CSS;d.head.appendChild(s);
  }catch{}
}
function walk(d,depth=0){
  if(!d||depth>8)return;
  dress(d);
  // Keep our sheet last so it wins over theme styles that are appended later.
  try{const s=d.getElementById('guestSellosCss');if(s&&s!==d.head.lastElementChild)d.head.appendChild(s)}catch{}
  try{d.querySelectorAll('iframe').forEach(f=>{try{walk(f.contentDocument,depth+1)}catch{}})}catch{}
}
if(window===window.top)document.documentElement.setAttribute('data-guest-sellos-top','');
const run=()=>walk(document);
if(document.head)run();else document.addEventListener('DOMContentLoaded',run);
addEventListener('load',run);
setInterval(run,600);
})();
