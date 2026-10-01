const fs=require('fs'),path=require('path');const ok=(x,m)=>{if(!x)throw new Error(m)};const root=path.resolve(__dirname,'..','..');
const r=fs.readFileSync(path.join(root,'guest','B9_9_SAFE_PROMOTION_STRATEGY_2026-10-01.md'),'utf8');
for(const x of ['DO NOT merge','allowlist','then-current `main`','no ONE, ONE Partner or STUDIO files','no legacy root `guests-*` files','explicit release authorization'])ok(r.includes(x),'safe promotion contract missing: '+x);
console.log('B9.9 safe promotion contract: PASS');