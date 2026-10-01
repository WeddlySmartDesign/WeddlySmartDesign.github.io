const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const root=path.resolve(__dirname,'..','..');
const state=fs.readFileSync(path.join(root,'guest','CURRENT_STATE.md'),'utf8');
const release=['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html','guest-legal.html','guest/index.html','guest/access.html','guest/guest.webmanifest','guest/guest-sw.js'];
for(const f of release)ok(fs.existsSync(path.join(root,f)),'release artifact missing '+f);
ok(/B8\.4–B8\.6 awaiting canonical CI seal|B8.*NOT declared sealed/i.test(state),'checkpoint must not falsely mark B8 sealed before canonical CI');
ok(/Only after both seals exist may GUEST be considered ready for an explicit publication step/i.test(state),'release hold rule missing from checkpoint');
console.log('B9.3 pre-release hold contract: PASS');