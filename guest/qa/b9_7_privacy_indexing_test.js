const fs=require('fs'),path=require('path');const ok=(x,m)=>{if(!x)throw new Error(m)};const root=path.resolve(__dirname,'..','..');
const canonical=['guest/index.html','guest/guests-v116-production.html','guest/guest-settings.html','guest/access.html','guest/guests-rsvp-v116-single-live.html','guest/event-invite.html','guest/event-invite-v2.html'];
for(const f of canonical){const c=fs.readFileSync(path.join(root,f),'utf8');ok(/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(c)||/<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots/i.test(c),'canonical GUEST surface can be indexed: '+f)}
const publicRoot=['guest-checkout.html','guest-checkout-return.html','guest-order.html','guest-orders-admin.html'];
for(const f of publicRoot){const c=fs.readFileSync(path.join(root,f),'utf8');ok(c.includes('noindex'),'sensitive root GUEST surface can be indexed: '+f)}
console.log('B9.7 canonical privacy/indexing gate: PASS');