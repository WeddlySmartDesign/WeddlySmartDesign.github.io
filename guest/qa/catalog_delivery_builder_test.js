const fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
const root=path.resolve(__dirname,'..','..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-catalog-builder-'));
const input=path.join(tmp,'in.html'),output=path.join(tmp,'out.html');
fs.writeFileSync(input,'<!doctype html><html><body><a id="rsvpBtn"></a><script>window.VEIL_APPLY_CONFIG=function(c){window.__cfg=c}</script><script id="wsd-final-script">legacy()</script></body></html>');
const r=cp.spawnSync(process.execPath,[path.join(root,'guest/tools/build_catalog_delivery.js'),input,output,'gif1_p_test_token_1234567890','veil-light'],{encoding:'utf8'});
if(r.status!==0)throw new Error(r.stderr||r.stdout);
const s=fs.readFileSync(output,'utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(!s.includes('id="wsd-final-script"'),'legacy final loader remained');
ok(s.includes('guest-catalog-delivery-runtime'),'generic delivery runtime missing');
ok(s.includes('guest-catalog-template-adapter'),'template adapter missing');
ok(s.includes('gif1_p_test_token_1234567890'),'public token missing');
ok(s.includes("root['veil-light']"),'VEIL LIGHT adapter not bundled');
ok(s.includes("q.get('rt')"),'recipient context not bundled');
ok(s.includes("action:'public_load'"),'public load contract not bundled');

// Positive offline certification packaging for a synthetic pending Botánica.
// This exercises the real CLI while production stays frozen and unmodified.
const crypto=require('node:crypto');
const qaRoot=path.join(tmp,'synthetic-qa-root'),qaGuest=path.join(qaRoot,'guest');
fs.mkdirSync(path.join(qaGuest,'tools'),{recursive:true});
fs.copyFileSync(path.join(root,'guest/tools/build_catalog_delivery.js'),path.join(qaGuest,'tools/build_catalog_delivery.js'));
fs.copyFileSync(path.join(root,'guest/guest-catalog-delivery-runtime-v1.js'),path.join(qaGuest,'guest-catalog-delivery-runtime-v1.js'));
fs.copyFileSync(path.join(root,'guest/guest-catalog-template-botanica-adapter-v1.js'),path.join(qaGuest,'guest-catalog-template-botanica-adapter-v1.js'));
const candidate=path.join(tmp,'candidate-botanica.html');
fs.writeFileSync(candidate,'<!doctype html><html><head></head><body><script>window.BOTANICA_APPLY_CONFIG=function(c){window.__bot=c}</script></body></html>');
const candidateHash=crypto.createHash('sha256').update(fs.readFileSync(candidate)).digest('hex');
fs.writeFileSync(path.join(qaGuest,'GUEST_CATALOG_TEMPLATE_REGISTRY_V1.json'),JSON.stringify({templates:[
 {id:'veil-light',version:'5.3.3',status:'commercially-frozen'},
 {id:'botanica',version:'14.7',status:'certification-pending'}
]}));
fs.writeFileSync(path.join(qaGuest,'GUEST_PROJECT_STATUS_V1.json'),JSON.stringify({designs:{
 botanica:{version:'14.7',status:'certification-pending',candidateSha256:candidateHash}
}}));
const qaScript=path.join(qaGuest,'tools/build_catalog_delivery.js');
const testOutput=path.join(tmp,'botanica-internal-only.html');
const args=[candidate,testOutput,'gif1_p_synthetic_no_real_order','botanica'];
const flow='https://guest-qa-isolated.supabase.co/functions/v1/guest-invitation-flow';
function invoke(extra,src=args){return cp.spawnSync(process.execPath,[qaScript,...src,...extra],{encoding:'utf8'})}
const staged=invoke(['--test-only','--flow-url',flow]);
ok(staged.status===0,'isolated Botánica candidate must package with pinned source: '+staged.stderr);
const pilot=fs.readFileSync(testOutput,'utf8');
ok(pilot.includes('SOLO PRUEBA · NO PUBLICAR'),'internal preview requires visible nonpublication warning');
ok(pilot.includes('noindex,nofollow,noarchive'),'internal preview should discourage indexing');
ok(pilot.includes(flow),'internal preview should use only isolated GUEST FLOW');
ok(!pilot.includes('dnjsxequwgtyyauuofxj'),'internal preview must not contain live ONE/GUEST backend');
ok(!pilot.includes('kijigxprredusnaaazow'),'internal preview must not contain STUDIO backend');
ok(pilot.includes('BOTANICA_APPLY_CONFIG'),'generic wrapper must preserve synthetic Botánica renderer');
ok(pilot.includes("root.botanica"),'generic adapter must be present');
ok(invoke([]).status!==0,'pending design must never package via commercial path');
ok(invoke(['--test-only']).status!==0,'test-only must require isolated FLOW URL');
ok(invoke(['--test-only','--flow-url','https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-invitation-flow']).status!==0,'production project must be rejected');
ok(invoke(['--test-only','--flow-url','https://kijigxprredusnaaazow.supabase.co/functions/v1/guest-invitation-flow']).status!==0,'STUDIO project must be rejected');
ok(invoke(['--test-only','--flow-url','http://guest-qa-isolated.supabase.co/functions/v1/guest-invitation-flow']).status!==0,'HTTP must be rejected');
ok(invoke(['--test-only','--flow-url','https://guest-qa-isolated.supabase.co/functions/v1/not-guest']).status!==0,'unexpected function route must be rejected');
const changed=path.join(tmp,'candidate-botanica-tampered.html');
fs.writeFileSync(changed,fs.readFileSync(candidate,'utf8')+'changed');
ok(invoke(['--test-only','--flow-url',flow],[changed,path.join(tmp,'tampered-out.html'),args[2],args[3]]).status!==0,'candidate checksum drift must be rejected');
ok(!fs.existsSync(path.join(tmp,'tampered-out.html')),'invalid asset must never emit output');

console.log('CATALOG DELIVERY BUILDER PASS');
