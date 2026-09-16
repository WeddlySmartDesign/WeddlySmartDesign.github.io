(()=>{
'use strict';
if(window.__wsdRsvpCalendarActionV2)return;window.__wsdRsvpCalendarActionV2=true;
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-rsvp',q=new URLSearchParams(location.search),token=q.get('t')||'';
let configPromise=null;
function lang(){const v=q.get('lang');if(v==='es'||v==='en')return v;return(document.documentElement.lang||navigator.language||'es').toLowerCase().startsWith('en')?'en':'es'}
const T=(es,en)=>lang()==='en'?en:es;
async function config(){if(configPromise)return configPromise;configPromise=(async()=>{if(!token)return{};try{const r=await fetch(API+'?token='+encodeURIComponent(token),{cache:'no-store'}),x=await r.json().catch(()=>({}));return r.ok&&x?.ok?(x.form?.config||{}):{}}catch{return{}}})();return configPromise}
function ymd(d){return[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('')}
function basic(d){return ymd(d)+'T'+[String(d.getHours()).padStart(2,'0'),String(d.getMinutes()).padStart(2,'0'),'00'].join('')}
function span(c){if(!c?.date)return null;if(c.time){const a=new Date(`${c.date}T${c.time}:00`),b=new Date(a.getTime()+4*3600000);if(Number.isNaN(a.getTime()))return null;return{start:basic(a),end:basic(b)}}const a=new Date(c.date+'T12:00:00');if(Number.isNaN(a.getTime()))return null;const start=ymd(a);a.setDate(a.getDate()+1);return{start,end:ymd(a)}}
function title(c){return c?.title?T('Boda · ','Wedding · ')+c.title:T('Nuestra boda','Our wedding')}
function googleUrl(c){const s=span(c);if(!s)return'';const u=new URL('https://calendar.google.com/calendar/render');u.searchParams.set('action','TEMPLATE');u.searchParams.set('text',title(c));u.searchParams.set('dates',s.start+'/'+s.end);u.searchParams.set('details',T('Invitación de boda','Wedding invitation'));if(c.venue)u.searchParams.set('location',c.venue);return u.href}
function esc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function ics(c){const s=span(c);if(!s)return'';return['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Weddly Smart Design//Wedding//ES','BEGIN:VEVENT','UID:'+Date.now()+'@weddlysmartdesign','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART:'+s.start,'DTEND:'+s.end,'SUMMARY:'+esc(title(c)),'LOCATION:'+esc(c.venue||''),'DESCRIPTION:'+esc(T('Invitación de boda','Wedding invitation')),'END:VEVENT','END:VCALENDAR'].join('\r\n')}
function download(c){const txt=ics(c);if(!txt)return;const a=document.createElement('a'),url=URL.createObjectURL(new Blob([txt],{type:'text/calendar;charset=utf-8'}));a.href=url;a.download=lang()==='en'?'wedding.ics':'boda.ics';a.rel='noopener';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},1200)}
async function openCalendar(){const c=await config(),url=googleUrl(c);if(!url)return;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';document.body.appendChild(a);a.click();a.remove()}
async function fallback(){download(await config())}
function patch(){const primary=document.getElementById('calendarBtn')||document.getElementById('wsdCalendarBtn');if(!primary)return;primary.textContent=T('Añadir al calendario','Add to calendar');primary.dataset.wsdCalendarV2='1';let secondary=document.getElementById('wsdCalendarDownload');if(!secondary){secondary=document.createElement('button');secondary.type='button';secondary.id='wsdCalendarDownload';secondary.className='btn secondary';secondary.textContent=T('Descargar archivo .ics','Download .ics file');secondary.onclick=e=>{e.preventDefault();e.stopPropagation();fallback()};primary.insertAdjacentElement('afterend',secondary)}}
document.addEventListener('click',e=>{const b=e.target?.closest?.('#calendarBtn,#wsdCalendarBtn');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openCalendar()},true);
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch()})}).observe(document.documentElement,{childList:true,subtree:true});[0,120,400,900].forEach(ms=>setTimeout(patch,ms));
})();
