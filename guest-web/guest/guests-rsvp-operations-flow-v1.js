(()=>{
'use strict';
// GUEST is delivered with the approved invitation: no design or RSVP-form editor steps.
// Keep the existing send, recipient and response operations untouched.
function clean(){
  document.getElementById('wsdOpsFlow')?.remove();
  document.getElementById('wsdOpsFlowStyle')?.remove();
  document.getElementById('editInvitation')?.remove();
  document.getElementById('wsdEditRsvp')?.remove();
}
[0,80,260,600].forEach(ms=>setTimeout(clean,ms));
})();
