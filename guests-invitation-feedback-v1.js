(()=>{
'use strict';
const frame=document.getElementById('editor');if(!frame)return;
const qs=new URLSearchParams(location.search),inSuite=qs.get('suite')==='1'||qs.get('_wsd_suite')==='1';
function goFlexForm(){if(inSuite&&parent!==window){parent.postMessage({type:'wsd-suite-open',view:'guests-rsvp',url:'guests-rsvp-form-flex.html?v=1'},location.origin);return}location.assign('guests-rsvp-form-flex.html?v=1')}
function patch(){
  try{
    const d=frame.contentDocument;if(!d?.body)return;
    if(!d.documentElement.dataset.wsdInvitationFeedback){d.documentElement.dataset.wsdInvitationFeedback='1';const s=d.createElement('script');s.src='guests-invitation-editor-feedback-inner-v1.js?v=1';d.head.appendChild(s)}
    if(!d.documentElement.dataset.wsdFlexFormHook){d.documentElement.dataset.wsdFlexFormHook='1';d.addEventListener('click',e=>{const b=e.target?.closest?.('#weddlyOpenRsvpForm');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();goFlexForm()},true)}
  }catch{}
}
frame.addEventListener('load',()=>{setTimeout(patch,30);setTimeout(patch,200);setTimeout(patch,700)});[60,250,800].forEach(ms=>setTimeout(patch,ms));
})();