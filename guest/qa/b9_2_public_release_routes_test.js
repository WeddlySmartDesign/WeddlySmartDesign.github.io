const fs=require('fs'),path=require('path');const ok=(x,m)=>{if(!x)throw new Error(m)};const root=path.resolve(__dirname,'..','..');
const publicFiles=['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html','guest-legal.html','guest/access.html','guest/index.html','guest/guest-settings.html'];
for(const f of publicFiles)ok(fs.existsSync(path.join(root,f)),'missing public release file '+f);
const joined=publicFiles.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
for(const bad of ['ONE Partner','STUDIO','/one.html','/partner.html'])ok(!joined.includes(bad),'foreign release route/brand '+bad);
const landing=fs.readFileSync(path.join(root,'guest.html'),'utf8'),checkout=fs.readFileSync(path.join(root,'guest-checkout.html'),'utf8'),access=fs.readFileSync(path.join(root,'guest','access.html'),'utf8');
ok(landing.includes('guest-checkout.html?edition=essential')&&landing.includes('guest-checkout.html?edition=signature'),'landing purchase routes missing');
ok(checkout.includes('guest-checkout-return.html'),'checkout return route missing');
ok(access.includes("location.replace('index.html')"),'activation does not route into canonical app');
ok(!joined.includes('guest-orders-admin.html'),'public customer surfaces expose internal order manager');
const requiredInternal=[
 ['guest.html','guest-checkout.html'],['guest.html','guest-legal.html'],
 ['guest-checkout.html','guest.html'],['guest-checkout.html','guest-legal.html'],
 ['guest-checkout-return.html','guest-order.html'],['guest-checkout-return.html','guest.html'],
 ['guest-order.html','guest.html'],['guest-legal.html','guest.html'],
 ['guest/index.html','guest/access.html'],['guest/index.html','guest/guest-settings.html']
];
for(const [from,to] of requiredInternal){
 ok(fs.existsSync(path.join(root,to)),'broken internal release target '+from+' -> '+to);
}
ok(!joined.includes('guest-deliver.html'),'discarded delivery surface leaked into public release');
ok(fs.existsSync(path.join(root,'guest-orders-admin.html')),'private fulfillment manager missing from release artifact');

console.log('B9.2 public release routes: PASS');