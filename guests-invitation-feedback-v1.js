(()=>{
'use strict';
const frame=document.getElementById('editor');if(!frame)return;
function patch(){
  try{
    const d=frame.contentDocument;if(!d?.body)return;
    if(!d.documentElement.dataset.wsdInvitationFeedback){d.documentElement.dataset.wsdInvitationFeedback='1';const s=d.createElement('script');s.src='guests-invitation-editor-feedback-inner-v1.js?v=1';d.head.appendChild(s)}
  }catch{}
}
frame.addEventListener('load',()=>{setTimeout(patch,30);setTimeout(patch,200);setTimeout(patch,700)});[60,250,800].forEach(ms=>setTimeout(patch,ms));
})();