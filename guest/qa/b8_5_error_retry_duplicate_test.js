const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const root=path.resolve(__dirname,'..','..');
const stripe=fs.readFileSync(path.join(root,'guest','backend','guest-stripe-checkout','index.ts'),'utf8');
const orders=fs.readFileSync(path.join(root,'guest','backend','guest-orders-admin','index.ts'),'utf8');
const checkout=fs.readFileSync(path.join(root,'guest-checkout.html'),'utf8');
const ret=fs.readFileSync(path.join(root,'guest-checkout-return.html'),'utf8');
const order=fs.readFileSync(path.join(root,'guest-order.html'),'utf8');
const manager=fs.readFileSync(path.join(root,'guest-orders-admin.html'),'utf8');

ok(!fs.existsSync(path.join(root,'guest-deliver.html')),'duplicate delivery surface must stay removed');

ok(stripe.includes("checkoutAttemptId"),'checkout attempt id is not accepted by backend');
ok(stripe.includes("'Idempotency-Key':'guest-checkout/'+key"),'Stripe session creation is not idempotent per checkout attempt');
ok(checkout.includes('checkoutAttemptId:attemptId'),'checkout does not send stable attempt id');
ok(checkout.includes('if(busy||embedded||!'), 'checkout does not guard duplicate mount/create');
ok(checkout.includes('id="retryPayment"')&&checkout.includes("$('#retryPayment').onclick"),'checkout has no explicit retry path');

ok(stripe.includes('guest_order_submitted_at')&&stripe.includes('alreadySubmitted:true'),'duplicate personalization submission is not frozen');
ok(stripe.includes("guest-order-internal/")&&stripe.includes("guest-order-confirm/"),'order emails lack idempotency keys');
ok(order.includes('b.disabled=true')&&order.includes('b.disabled=false'),'order submission does not guard/recover double click');

ok(orders.includes("idempotencyKey:'guest-delivery/'+l.id"),'final delivery email lacks idempotency key');
ok(orders.includes("guest_personalization_status||'')!=='ready'"),'delivery is not gated by ready state');
ok(orders.includes("guest_personalization_status:'delivered'")&&orders.includes('guest_delivered_at'),'delivery completion is not recorded');
ok(manager.includes("if(!confirm('¿Enviar ahora el acceso final de GUEST a la pareja?')"),'final delivery lacks deliberate operator confirmation');
ok(manager.includes('button.disabled=true')&&manager.includes('button.disabled=false'),'manager actions do not guard/recover duplicate click');

ok(stripe.includes("if(m==='session_not_found')return json({ok:false,error:m},404)"),'missing Stripe session is not normalized');
ok(stripe.includes("if(m==='stripe_request_failed')return json({ok:false,error:m},502)"),'Stripe gateway failure is not normalized');
ok(stripe.includes("'stripe_temporarily_unavailable'")&&stripe.includes("return json({ok:false,error:m},503)"),'temporary Stripe outage is not recoverable');
ok(ret.includes('id="retry"')&&ret.includes("retry.onclick=()=>check(0)"),'payment confirmation has no safe retry action');
ok(ret.includes('no vuelvas a pagar'),'return flow does not warn against duplicate payment');
ok(order.includes('No hace falta repetir el pago'),'order flow does not warn against duplicate payment');

console.log('B8.5 error retry duplicate contract: PASS');