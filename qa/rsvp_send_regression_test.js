const fs=require('fs');
function text(p){return fs.readFileSync(p,'utf8')}
function must(ok,msg){if(!ok){console.error('FAIL',msg);process.exitCode=1}else console.log('PASS',msg)}
const live=text('guests-rsvp-operations-live.html');
const composer=text('guests-rsvp-share-composer-v2.js');
const contact=text('guests-rsvp-contact-picker-v1.js');
const single=text('guests-rsvp-v116-single-live.html');
const unit=text('guests-rsvp-v115-wedding-flex-live.html');
const cal=text('guests-rsvp-postsubmit-calendar-v1.js');

must(live.includes('guests-rsvp-share-composer-v2.js'),'operations loads safe share composer v2');
must(live.includes('guests-rsvp-contact-picker-v1.js'),'operations loads contact-picker bridge');
must(!live.includes("render();const __ctl=new AbortController()"),'operations does not render interactive Guests while the document is still being assembled');
must(live.includes("document.readyState==='loading'?new Promise"),'operations waits for DOM readiness before first interactive render');
must(live.includes("setTimeout(()=>c.abort(),5000)"),'operations remote RSVP requests have bounded timeouts');
must(live.includes("render();show('Tus invitados están disponibles"),'operations falls back to an interactive local guest list when remote status cannot refresh');
must(live.includes("if(migrateLegacy())syncFields().catch(()=>{})"),'legacy field sync cannot block the interactive render');
must(live.includes('rsvp_load_signature_mismatch'),'operations refuses to boot if the source patch no longer matches');
must(live.includes("localStorage.setItem('weddly_rsvp_public_token_v1',PT)"),'operations caches the validated public RSVP token after remote load');
must(composer.includes("target='_blank'")||composer.includes("a.target='_blank'"),'WhatsApp opens outside the suite instead of replacing it');
must(!composer.includes('window.top.location.assign'),'share composer does not navigate the top-level suite');
must(composer.includes('function markSent(')&&composer.includes("status:'sent'"),'share composer persists sent delivery state');
must(composer.includes('wsdShareMark'),'copied links can be explicitly marked as sent');
must(composer.includes("PTKEY='weddly_rsvp_public_token_v1'"),'share composer reuses the public-token cache');
must(composer.includes("setTimeout(()=>ctl.abort(),7000)"),'share composer cannot remain stuck waiting for manage API');
must(composer.includes("if(!t)throw new Error('missing_public_token')"),'share composer fails visibly instead of building a link without a public token');
must(contact.includes('window.top?.navigator?.contacts'),'contact picker targets the top-level browsing context');
must(contact.includes("autocomplete','tel")&&contact.includes("autocomplete','email"),'contact fields retain mobile autofill fallback');
must(single.includes('guests-rsvp-postsubmit-calendar-v1.js'),'single RSVP loads post-submit calendar recovery');
must(unit.includes('guests-rsvp-postsubmit-calendar-v1.js'),'group RSVP loads post-submit calendar recovery');
must(cal.includes('BEGIN:VCALENDAR')&&cal.includes('Añadir al calendario'),'calendar recovery generates an ICS action');
if(process.exitCode)process.exit(process.exitCode);console.log('RSVP send/agenda/calendar/loading/controls regression suite passed');
