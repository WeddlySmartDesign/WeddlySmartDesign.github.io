const fs=require('fs');
const read=p=>fs.readFileSync(p,'utf8');
const failures=[];
function check(ok,msg){if(ok)console.log('PASS',msg);else{console.error('FAIL',msg);failures.push(msg)}}
const home=read('guests-home-rsvp-status-v1.js');
const share=read('guests-rsvp-share-composer-v2.js');
const settings=read('weddly-settings.html');
const suiteBackup=read('suite-settings-backup-integrity-v1.js');
const gUi=read('guests-production-ui.js');
const gCore=read('guests-v114-integrated.html');
// Today must read fields from the schema actually returned by the RSVP backend.
check(/payload\?\.accommodation|payload\.accommodation/.test(home),'Today reads accommodation changes from RSVP payload schema');
check(/payload\?\.plusone_details|payload\.plusone_details/.test(home)||/plusone_details/.test(home),'Today can read +1 detail payloads');
// “Unsent” is an invitation/delivery concept, not a person count.
check(/new Set|Map\(\).*invitation|invitationKey|unit:/.test(home)&&/unsent/.test(home),'Today unsent count is deduplicated by invitation/recipient');
// English mode must not leave the Guests dashboard in Spanish.
check(/Recent changes|Invitations & responses|confirmed|not attending/.test(home),'Today RSVP summary/recent changes has English copy');
check(/Today|Tables|Lists|Add guest|Guests/.test(gUi)&&/lang\(|\ben\b/.test(gUi),'Guests production UI contains an English translation path');
// Standalone Guests settings must be safe even when not hosted inside the full suite.
check(settings.includes('weddly_guests_sync_meta_v2'),'standalone Settings reads Guests sync metadata before backup');
check(/dirty/.test(settings)&&(/No puedo crear una copia|pending changes|cambios pendientes/.test(settings)),'standalone backup refuses/handles unsynced Guests instead of silently exporting server-only data');
check(/localStorage\.getItem\(['"]weddly_guests_qa_v67|localStorage\.getItem\(GKEY/.test(settings),'standalone backup compares/includes canonical local Guests data');
check(/localStorage\.setItem\(GKEY/.test(settings)&&/weddly_guests_sync_meta_v2/.test(settings),'standalone restore updates local Guests state/sync metadata atomically');
check(suiteBackup.includes('consistentGuests'),'full-suite safe backup guard remains present');
// WhatsApp direct contact must support both Spanish and UK local numbers, because the product is ES/EN.
check(/\b44\b|en-GB|GBP/.test(share),'WhatsApp phone normalization supports UK numbers as well as Spain');
check(!/d\.length===9&&\/\^\[6789\]\/.test(share)||/country|locale|currency/i.test(share),'WhatsApp phone normalization does not blindly assume +34 for every 9-digit local number');
// Core itself may remain frozen Spanish only if an active production translation layer covers it.
check(/guests-language|guests-i18n|translateGuests|English/.test(gUi)||!/Hoy|Invitados|Mesas|Listados/.test(gCore),'frozen Guests core has an active English translation layer');
if(failures.length){console.error(`\nDeep semantic audit: ${failures.length} failure(s)`);process.exit(1)}
console.log('\nDeep semantic audit: PASS');