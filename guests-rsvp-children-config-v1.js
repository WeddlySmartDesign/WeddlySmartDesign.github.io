(()=>{
'use strict';
if(window.__wsdRsvpChildrenConfig)return;window.__wsdRsvpChildrenConfig=true;
const T=(es,en)=>document.documentElement.lang==='en'?en:es;
function install(){
  if(document.getElementById('wsdChildrenConfig'))return;
  const plus=document.getElementById('plusQ')?.closest('label.question');if(!plus)return;
  if(!document.getElementById('wsdChildrenConfigStyle')){const s=document.createElement('style');s.id='wsdChildrenConfigStyle';s.textContent='.wsd-children-fixed{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:15px 0;border-bottom:1px solid var(--line)}.wsd-children-fixed b{display:block;font-size:15px}.wsd-children-fixed span{display:block;color:var(--muted);font-size:12px;line-height:1.4;margin-top:3px}.wsd-children-fixed .fixed{color:var(--dark)}';document.head.appendChild(s)}
  const row=document.createElement('div');row.id='wsdChildrenConfig';row.className='wsd-children-fixed';row.innerHTML=`<div><b>${T('Niños','Children')}</b><span>${T('Pregunta si vendrán niños y permite indicar nombre, edad, menú y alergias.','Asks whether children are coming and records name, age, meal and allergies.')}</span><span class="fixed">${T('Incluida','Included')}</span></div>`;plus.before(row)
}
const root=document.querySelector('.app')||document.body;if(root){const obs=new MutationObserver(()=>queueMicrotask(install));obs.observe(root,{childList:true,subtree:true})}
[0,80,250].forEach(ms=>setTimeout(install,ms));
})();