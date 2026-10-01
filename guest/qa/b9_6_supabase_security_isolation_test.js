const fs=require('fs'),path=require('path');const ok=(x,m)=>{if(!x)throw new Error(m)};const root=path.resolve(__dirname,'..','..');
const report=fs.readFileSync(path.join(root,'guest','B9_6_SUPABASE_SECURITY_ISOLATION_2026-10-01.md'),'utf8');
ok(report.includes('PASS for the GUEST release surface'),'Supabase GUEST security audit is not PASS');
for(const fn of ['guest_webhook_secret','provision_weddly_license','activate_weddly_license'])ok(report.includes(fn),'missing privileged function audit: '+fn);
ok(report.includes('restricted to `service_role`'),'service-role restriction not recorded');
ok(report.includes('deliberately NOT modified'),'shared-product isolation exception not recorded');
console.log('B9.6 Supabase security isolation contract: PASS');