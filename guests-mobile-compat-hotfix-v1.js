(()=>{
  const G=window.__GuestsProd;if(!G)return;
  const KEY='weddly_guests_qa_v67';
  const SUITE=new URLSearchParams(location.search).get('suite')==='1'||new URLSearchParams(location.search).get('_wsd_suite')==='1';
  const OPS='guests-rsvp-operations-live.html?v=137';
  const DESIGN='guests-rsvp-design-manage.html';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const en=()=>{try{const x=JSON.parse(localStorage.getItem('weddly_pro_v7')||'null');if(x?.settings?.lang==='en')return true;if(x?.settings?.lang==='es')return false}catch{}try{return localStorage.getItem('weddly_access_lang')==='en'}catch{return false}};
  function docs(){const out=[];try{let d=G.f.contentDocument;for(let i=0;i<8&&d;i++){out.push(d);const f=d.querySelector('iframe');if(!f||!f.contentDocument)break;d=f.contentDocument}}catch{}return out}
  const appDoc=()=>docs().find(d=>d.getElementById('invitados')&&d.getElementById('sheet')&&d.getElementById('panel'))||null;
  function suiteOpen(view,url){if(!SUITE)return false;try{window.parent.postMessage({type:'wsd-suite-open',view,url},location.origin);return true}catch{return false}}
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{guests:{},tables:{},meta:{}}}catch{return{guests:{},tables:{},meta:{}}}}
  function norm(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
  function digits(v){return String(v||'').replace(/\D/g,'')}
  function refreshCore(){try{G.f.src=G.APP+'&contacts='+Date.now();window.dispatchEvent(new Event('guests-prod-open'))}catch{}}
  function importPeople(people){
    const S=read();S.guests=S.guests||{};
    const all=Object.values(S.guests);
    let added=0,skipped=0;
    for(const p of people){
      const name=String(p.name||'').trim(),phone=String(p.phone||'').trim(),email=String(p.email||'').trim();
      if(!name){skipped++;continue}
      const exists=all.some(g=>(phone&&digits(g.phone)===digits(phone))||(email&&norm(g.email)===norm(email))||(!phone&&!email&&norm(g.name)===norm(name)));
      if(exists){skipped++;continue}
      const id='g_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
      const g={name,rsvp:'pending',meal:'',mealRequired:true,table:'',transport:false,group:'',unitId:''};
      if(phone)g.phone=phone;if(email)g.email=email;S.guests[id]=g;all.push(g);added++;
    }
    try{localStorage.setItem(KEY,JSON.stringify(S))}catch{return{added:0,skipped:people.length,error:true}}
    return{added,skipped,error:false};
  }
  function unfoldVcard(text){return String(text||'').replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,'')}
  function unescapeV(v){return String(v||'').replace(/\\n/gi,' ').replace(/\\,/g,',').replace(/\\;/g,';').replace(/\\\\/g,'\\').trim()}
  function parseVcards(text){
    const blocks=unfoldVcard(text).split(/BEGIN:VCARD/i).slice(1),out=[];
    for(const b of blocks){
      const lines=b.split(/\r?\n/),get=key=>{const l=lines.find(x=>new RegExp('^'+key+'(?:;[^:]*)?:','i').test(x));return l?unescapeV(l.slice(l.indexOf(':')+1)):''};
      let name=get('FN');if(!name){const n=get('N').split(';');name=[n[1],n[0]].filter(Boolean).join(' ').trim()}
      const phone=get('TEL'),email=get('EMAIL');if(name)out.push({name,phone,email});
    }
    return out;
  }
  function closeSheet(d){d.getElementById('sheet')?.classList.remove('on');const p=d.getElementById('panel');if(p)p.innerHTML=''}
  function resultSheet(d,res){
    const p=d.getElementById('panel'),sheet=d.getElementById('sheet');if(!p||!sheet)return;
    const l=en()?{tag:'CONTACTS',title:'Contacts added',msg:`${res.added} added · ${res.skipped} already existed or could not be read.`,done:'Done'}:{tag:'CONTACTOS',title:'Contactos añadidos',msg:`${res.added} añadidos · ${res.skipped} ya existían o no se pudieron leer.`,done:'Hecho'};
    p.innerHTML=`<div class="sectiontag">${l.tag}</div><h2>${l.title}</h2><p class="small">${esc(l.msg)}</p><div class="actions one"><button class="btn" id="wsdContactsDone">${l.done}</button></div>`;sheet.classList.add('on');p.querySelector('#wsdContactsDone').onclick=()=>{closeSheet(d);if(res.added)refreshCore()};
  }
  async function directContacts(d){
    try{
      const nav=window.top.navigator;if(!nav.contacts?.select)throw new Error('unsupported');
      const props=nav.contacts.getProperties?await nav.contacts.getProperties():['name','tel','email'];
      const wanted=['name','tel','email'].filter(x=>props.includes(x));
      const cs=await nav.contacts.select(wanted,{multiple:true});
      const people=(cs||[]).map(c=>({name:Array.isArray(c.name)?c.name[0]:c.name||'',phone:Array.isArray(c.tel)?c.tel[0]:c.tel||'',email:Array.isArray(c.email)?c.email[0]:c.email||''}));
      if(people.length)resultSheet(d,importPeople(people));
    }catch(e){if(e?.name!=='AbortError')openFallback(d)}
  }
  function openFallback(d){
    const p=d.getElementById('panel'),sheet=d.getElementById('sheet');if(!p||!sheet)return;
    const l=en()?{tag:'CONTACTS',title:'Add from contacts',body:'Safari on iPhone does not allow a web app to open your address book directly. Export or share the contacts you want as a vCard (.vcf), then choose that file here. You can also keep using “Create my list” for manual entry.',pick:'Choose .vcf file',cancel:'Cancel',bad:'That file could not be read.'}:{tag:'CONTACTOS',title:'Añadir desde la agenda',body:'Safari en iPhone no permite que una web app abra directamente tu agenda. Exporta o comparte los contactos que quieras como una tarjeta vCard (.vcf) y selecciona aquí ese archivo. También puedes seguir usando «Crear mi lista» para introducirlos manualmente.',pick:'Elegir archivo .vcf',cancel:'Cancelar',bad:'No se ha podido leer ese archivo.'};
    p.innerHTML=`<div class="sectiontag">${l.tag}</div><h2>${l.title}</h2><p class="small">${l.body}</p><input id="wsdVcfFile" class="hidden" type="file" accept=".vcf,text/vcard,text/x-vcard"><div class="actions"><button class="btn soft" id="wsdContactsCancel">${l.cancel}</button><button class="btn" id="wsdVcfPick">${l.pick}</button></div><div id="wsdVcfErr" class="error"></div>`;sheet.classList.add('on');
    p.querySelector('#wsdContactsCancel').onclick=()=>closeSheet(d);p.querySelector('#wsdVcfPick').onclick=()=>p.querySelector('#wsdVcfFile').click();
    p.querySelector('#wsdVcfFile').onchange=async e=>{try{const f=e.target.files?.[0];if(!f)return;const people=parseVcards(await f.text());if(!people.length)throw 0;resultSheet(d,importPeople(people))}catch{const er=p.querySelector('#wsdVcfErr');if(er)er.textContent=l.bad}};
  }
  function openContacts(d){const nav=window.top.navigator;if(nav.contacts?.select)directContacts(d);else openFallback(d)}
  function patchContacts(d){
    if(!d||d.getElementById('wsdContactsBtn'))return;
    const importBtn=d.getElementById('importBtn');if(!importBtn)return;
    const step=importBtn.closest('.step'),minor=step?.querySelector('.minor');if(!minor)return;
    const b=d.createElement('button');b.type='button';b.className='btn line';b.id='wsdContactsBtn';b.textContent=en()?'Add from contacts':'Añadir desde agenda';b.onclick=e=>{e.preventDefault();e.stopPropagation();openContacts(d)};minor.appendChild(b);
  }
  function hookSuiteNav(d){
    if(!SUITE||!d?.documentElement||d.documentElement.dataset.wsdSuiteNavHotfix==='1')return;
    d.documentElement.dataset.wsdSuiteNavHotfix='1';
    d.addEventListener('click',e=>{
      const t=e.target?.closest?.('button,a');if(!t)return;
      if(t.id==='wsdOpenRsvpOps'){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();suiteOpen('guests-rsvp',OPS);return;
      }
      if(t.id==='wsdEditInvitation'||t.id==='wsdEditInvitationInline'){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();suiteOpen('guests-design',DESIGN);
      }
    },true);
  }
  function patch(){try{const d=appDoc();if(!d)return;hookSuiteNav(d);patchContacts(d)}catch{}}
  G.f.addEventListener('load',()=>{setTimeout(patch,100);setTimeout(patch,350)});
  addEventListener('guests-prod-open',patch);setInterval(patch,500);setTimeout(patch,500);
})();