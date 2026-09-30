(()=>{
'use strict';
if(document.getElementById('wsdEssentialReadability'))return;
const style=document.createElement('style');
style.id='wsdEssentialReadability';
style.textContent=`
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
/* Secondary information on plain invitation surfaces must remain readable. */
.askline,.city,.agenda-place,.card-detail,.lead,.footer-thanks{color:var(--ink)!important}
.caption{text-shadow:0 1px 4px rgba(255,255,255,.82)}
@media (max-width:640px){
  .brand{font-size:11px!important;line-height:1.35!important}
  .eyebrow,.subtitle,.cover-sub,.askline,.fact,.waiting,.city,.agenda-node,.card-detail,.footer-name,.footer-thanks{font-size:12px!important;line-height:1.45!important}
  .agenda-place{font-size:11px!important;line-height:1.4!important;letter-spacing:.01em!important}
  .agenda-time{font-size:12.5px!important;line-height:1.35!important}
  .agenda-title{font-size:14px!important;line-height:1.3!important}
  .historia-text,.story-text,.lead,.cover-datevenue{font-size:14px!important;line-height:1.6!important}
  .card-detail{line-height:1.5!important}
  .card-btn,.cta{font-size:13px!important;min-height:44px!important;align-items:center!important;justify-content:center!important}
  input,textarea,select,.field{font-size:16px!important;line-height:1.35!important}
  .burger{width:40px!important;height:40px!important;padding:12px 10px!important}
  .burger span{width:100%!important;flex:0 0 auto!important}
}
`;
document.head.appendChild(style);

/* Preserve each template's palette; only add an opposite-colour shadow when text actually sits on a CSS image. */
const selectors='.cover-kicker,.cover-sub,.cover-names,.cover-datevenue,.cover-waiting,.kicker,.subtitle,.names,.waiting,.caption';
function luminance(rgb){
  const m=String(rgb||'').match(/[\d.]+/g);if(!m||m.length<3)return 0;
  const c=m.slice(0,3).map(v=>{v=Number(v)/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
  return .2126*c[0]+.7152*c[1]+.0722*c[2];
}
function onImage(el){
  for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
    const bg=getComputedStyle(p).backgroundImage;
    if(bg&&bg!=='none')return true;
  }
  return false;
}
function protectImageText(){
  document.querySelectorAll(selectors).forEach(el=>{
    if(!onImage(el))return;
    const light=luminance(getComputedStyle(el).color)>.46;
    el.style.textShadow=light?'0 1px 4px rgba(0,0,0,.55)':'0 1px 4px rgba(255,255,255,.82)';
  });
}
requestAnimationFrame(protectImageText);
if(document.readyState==='complete')protectImageText();
else window.addEventListener('load',protectImageText,{once:true});
})();
