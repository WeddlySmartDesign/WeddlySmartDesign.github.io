(()=>{
'use strict';
const IS_ANDROID=/Android/i.test(navigator.userAgent||'');
if(!IS_ANDROID)return;
const $=id=>document.getElementById(id);
const style=document.createElement('style');
style.textContent='#eventSheet.on #calendarEvent{display:block!important}';
document.head.appendChild(style);
function localBasic(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('')+'T'+[String(d.getHours()).padStart(2,'0'),String(d.getMinutes()).padStart(2,'0'),'00'].join('')}
function dayBasic(s){return String(s||'').replace(/-/g,'')}
function nextDayBasic(s){const [y,m,d]=String(s||'').split('-').map(Number),x=new Date(y,m-1,d+1,12);return [x.getFullYear(),String(x.getMonth()+1).padStart(2,'0'),String(x.getDate()).padStart(2,'0')].join('')}
function selectedText(id){const el=$(id);return el?.selectedOptions?.[0]?.value?String(el.selectedOptions[0].textContent||'').trim():''}
function formEvent(){const date=$('eventDate')?.value||'',time=$('eventTime')?.value||'',title=($('eventTitle')?.value||'').trim(),notes=($('eventNotes')?.value||'').trim();const provider=selectedText('eventProvider'),task=selectedText('eventTask'),owner=selectedText('eventOwner'),reminder=selectedText('eventReminder');return{date,time,title,notes,provider,task,owner,reminder}}
function googleCalendarUrl(ev){if(!ev?.date||!ev?.title)return'';let dates='';if(ev.time){const start=new Date(`${ev.date}T${ev.time}:00`),end=new Date(start.getTime()+60*60000);dates=`${localBasic(start)}/${localBasic(end)}`}else dates=`${dayBasic(ev.date)}/${nextDayBasic(ev.date)}`;const details=[];if(ev.notes)details.push(ev.notes);if(ev.provider)details.push(`Proveedor: ${ev.provider}`);if(ev.task)details.push(`Tarea: ${ev.task}`);if(ev.owner)details.push(`Responsable: ${ev.owner}`);if(ev.reminder)details.push(`Aviso elegido en Weddly Smart Design: ${ev.reminder}`);const p=new URLSearchParams({action:'TEMPLATE',text:ev.title,dates,details:details.join('\n')});try{const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;if(tz)p.set('ctz',tz)}catch{}return `https://calendar.google.com/calendar/render?${p.toString()}`}
function safeCalendarUrl(url){try{const u=new URL(url);return u.protocol==='https:'&&u.hostname==='calendar.google.com'?u.href:''}catch{return''}}
function navigateTop(url){url=safeCalendarUrl(url);if(!url)return false;const a=document.createElement('a');a.href=url;a.target='_top';a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();a.remove();return true}
function isNewEvent(){return !!$('deleteEvent')?.hidden}
function updateButton(){const b=$('calendarEvent');if(!b)return;const ev=formEvent(),valid=!!(ev.title&&ev.date),fresh=isNewEvent();b.hidden=false;b.style.display='block';b.disabled=!valid;b.setAttribute('aria-disabled',valid?'false':'true');b.textContent=document.documentElement.lang==='en'?(fresh?'Save + Google Calendar':'Add to Google Calendar'):(fresh?'Guardar + Google Calendar':'Añadir a Google Calendar');document.querySelectorAll('[data-event-cal]').forEach(x=>x.textContent='Google Calendar')}
function saveThenOpen(){const ev=formEvent(),url=googleCalendarUrl(ev);if(!url){updateButton();return}const form=$('eventForm');if(form&&!form.checkValidity()){form.reportValidity();updateButton();return}if(form){try{form.requestSubmit($('saveEvent')||undefined)}catch{try{form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))}catch{}}}navigateTop(url)}
function editButtonFor(id){return [...document.querySelectorAll('[data-event-edit]')].find(x=>x.dataset.eventEdit===id)||null}
function refreshAfterOpen(){[0,30,100,250].forEach(ms=>setTimeout(updateButton,ms))}
document.addEventListener('click',e=>{const add=e.target?.closest?.('[data-add-event]');if(add){refreshAfterOpen();return}const card=e.target?.closest?.('[data-event-cal]');if(card){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const edit=editButtonFor(card.dataset.eventCal);if(edit){edit.click();refreshAfterOpen();setTimeout(saveThenOpen,0)}return}const main=e.target?.closest?.('#calendarEvent');if(main){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();saveThenOpen()}},true);
['input','change'].forEach(type=>document.addEventListener(type,e=>{if(e.target?.closest?.('#eventForm'))updateButton()},true));
const sheet=$('eventSheet');if(sheet)new MutationObserver(()=>updateButton()).observe(sheet,{attributes:true,subtree:true,attributeFilter:['class','hidden']});new MutationObserver(()=>updateButton()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
updateButton();
})();