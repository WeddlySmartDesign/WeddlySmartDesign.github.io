(()=>{
'use strict';
const frame=document.getElementById('editor');if(!frame)return;
let watched=null,observer=null;
function patch(){
  try{
    const d=frame.contentDocument,w=frame.contentWindow;if(!d?.body||!w)return;
    if(d.documentElement.dataset.wsdInvitationFeedback)return;
    if(!d.getElementById('weddlyIntegrationBar')||!w.__weddlySaveEssential){
      if(watched!==d){
        observer?.disconnect();watched=d;
        observer=new MutationObserver(patch);observer.observe(d.documentElement,{childList:true,subtree:true});
      }
      return;
    }
    observer?.disconnect();
    w.__WSD_INVITATION_COLLECTIONS=window.__WSD_INVITATION_COLLECTIONS||{signature:false};
    d.documentElement.dataset.wsdInvitationFeedback='3';
    const s=d.createElement('script');s.src='guests-invitation-editor-feedback-inner-v1.js?v=3-included-collections';d.head.appendChild(s);
  }catch{}
}
frame.addEventListener('load',()=>{setTimeout(patch,30);setTimeout(patch,200);setTimeout(patch,700)});
[60,250,800].forEach(ms=>setTimeout(patch,ms));
})();