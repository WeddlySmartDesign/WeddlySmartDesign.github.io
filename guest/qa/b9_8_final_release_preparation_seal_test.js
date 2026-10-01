const {spawnSync}=require('child_process');const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..','..');
const gates=[
'guest/qa/b8_6_commercial_final_seal_test.js',
'guest/qa/b9_1_deployment_pwa_isolation_test.js',
'guest/qa/b9_2_public_release_routes_test.js',
'guest/qa/b9_3_pre_release_hold_test.js',
'guest/qa/b9_4_surface_security_test.js',
'guest/qa/b9_5_commercial_identity_test.js',
'guest/qa/b9_6_supabase_security_isolation_test.js',
'guest/qa/b9_7_privacy_indexing_test.js'
];
for(const f of gates){if(!fs.existsSync(path.join(root,f)))throw new Error('missing release gate '+f);const r=spawnSync(process.execPath,[path.join(root,f)],{cwd:root,encoding:'utf8'});if(r.status!==0)throw new Error('release gate failed '+f+'\n'+r.stdout+'\n'+r.stderr)}
const state=fs.readFileSync(path.join(root,'guest','CURRENT_STATE.md'),'utf8');
if(!state.includes('Do not merge/publish to `main` automatically.'))throw new Error('explicit publication hold missing');
console.log('B9.8 aggregate release preparation seal: PASS');