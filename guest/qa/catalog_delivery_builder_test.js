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
console.log('CATALOG DELIVERY BUILDER PASS');
