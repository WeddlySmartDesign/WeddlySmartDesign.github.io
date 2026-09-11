(()=>{
  function patch(){
    const card=document.getElementById('wsdInviteSheetCard');
    if(!card)return;
    const photo1=card.querySelector('#photo1');
    if(!photo1)return;
    const field=photo1.closest('.inviteField');
    if(!field)return;
    const label=field.querySelector('label');
    if(label)label.textContent=/cover/i.test(label.textContent||'')?'Cover photo':'Foto de portada';
    const pick=field.querySelector('.photoPick');
    if(pick){pick.style.display='block';const boxes=pick.querySelectorAll('.photoBox');if(boxes[1])boxes[1].remove();if(boxes[0])boxes[0].style.maxWidth='100%'}
  }
  new MutationObserver(()=>queueMicrotask(patch)).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(patch,250);
})();
