const fs=require('fs'),path=require('path');const ok=(x,m)=>{if(!x)throw new Error(m)};const root=path.resolve(__dirname,'..','..');
const stripe=fs.readFileSync(path.join(root,'guest','backend','guest-stripe-checkout','index.ts'),'utf8');
ok(stripe.includes("p.set('metadata[product]','guest')"),'Stripe session product identity is not GUEST');
ok(stripe.includes("p.set('payment_intent_data[metadata][product]','guest')"),'payment intent product identity is not GUEST');
ok(stripe.includes("metadata={product:'guest'"),'license metadata product identity is not GUEST');
ok(stripe.includes("metadata?.product||'')!=='guest'"),'paid-session validation does not enforce GUEST identity');
ok(!stripe.includes("metadata[product]','guests'"),'legacy Guests commercial identity remains in Stripe metadata');
console.log('B9.5 independent commercial identity: PASS');