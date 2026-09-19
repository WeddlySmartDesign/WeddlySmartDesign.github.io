(()=>{
'use strict';
const API='https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/weddly-stripe-checkout';
let dialog=null,embedded=null,stripe=null,config=null,edition='essential',busy=false;

const euro=cents=>(Number(cents||0)/100).toLocaleString('es-ES',{style:'currency',currency:'EUR'});
function inject(){
  if(document.getElementById('oneCheckout'))return;
  const d=document.createElement('dialog');d.className='one-checkout';d.id='oneCheckout';d.setAttribute('aria-labelledby','oneCheckoutTitle');
  d.innerHTML=`<div class="one-checkout-shell">
    <header class="one-checkout-top"><div class="one-checkout-brand">WeddlySmartDesign</div><button class="one-checkout-close" type="button" aria-label="Cerrar">×</button></header>
    <div class="one-checkout-body">
      <div class="one-checkout-kicker">ONE · pago único</div>
      <h2 id="oneCheckoutTitle">Elige tu ONE.</h2>
      <p class="one-checkout-lead">La gestión completa es la misma. Solo cambia la colección de invitaciones.</p>
      <div class="one-editions">
        <button class="one-edition selected" type="button" data-edition="essential">
          <span><strong class="one-edition-name">ONE Essential</strong><span class="one-edition-copy">ONE completo + 6 diseños Essential.</span></span>
          <span class="one-edition-price"><b class="one-price-current" data-price-current="essential">39,90 €</b><s class="one-price-normal" data-price-normal="essential">49,90 €</s></span>
        </button>
        <button class="one-edition" type="button" data-edition="signature">
          <span><strong class="one-edition-name">ONE Signature</strong><span class="one-edition-copy">ONE completo + 6 Essential + 4 Signature + personalización premium.</span></span>
          <span class="one-edition-price"><b class="one-price-current" data-price-current="signature">49,90 €</b><s class="one-price-normal" data-price-normal="signature">59,90 €</s></span>
        </button>
      </div>
      <div class="one-launch-note" id="oneLaunchNote">Precio especial de lanzamiento.</div>
      <div class="one-same-product"><strong>No compras una versión recortada.</strong> Invitados, RSVP, mesas, pagos y Planning están completos en Essential y Signature.</div>
      <div class="one-consent">
        <label><input id="oneImmediateConsent" type="checkbox"><span>Solicito que el acceso a ONE comience inmediatamente después del pago y acepto las Condiciones de contratación. Entiendo que el inicio inmediato del contenido digital puede afectar al derecho de desistimiento cuando resulte legalmente aplicable.</span></label>
        <div class="one-consent-actions"><button type="button" data-one-legal="terms-policy">Ver Condiciones</button><button type="button" data-one-legal="privacy-policy">Privacidad</button></div>
      </div>
      <div class="one-payment-wrap"><div class="one-payment-placeholder" id="onePaymentState">Marca la casilla anterior y el pago aparecerá aquí, sin salir de WeddlySmartDesign.</div><div id="oneStripeMount"></div></div>
      <p class="one-checkout-foot">Pago procesado de forma segura por Stripe. ONE solo se activa después de confirmar el cobro.</p>
    </div>
  </div>`;
  document.body.appendChild(d);dialog=d;
  d.querySelector('.one-checkout-close').onclick=close;
  d.addEventListener('click',e=>{if(e.target===d)close()});
  d.querySelectorAll('[data-edition]').forEach(b=>b.onclick=()=>select(b.dataset.edition));
  d.querySelector('#oneImmediateConsent').onchange=()=>{if(d.querySelector('#oneImmediateConsent').checked)mount();else destroy()};
  d.querySelectorAll('[data-one-legal]').forEach(b=>b.onclick=()=>{const legal=document.getElementById(b.dataset.oneLegal);if(legal?.showModal&&!legal.open)legal.showModal()});
  document.querySelectorAll('.action-buy,#buyOneButton,.buy-button[data-checkout-pending]').forEach(a=>{
    a.addEventListener('click',e=>{e.preventDefault();open()});
    a.removeAttribute('data-checkout-pending');
  });
}
async function api(body){
  const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'});
  const x=await r.json().catch(()=>({}));if(!r.ok||!x?.ok)throw new Error(x?.error||'checkout_unavailable');return x;
}
async function loadConfig(){
  if(config)return config;
  config=await api({action:'config'});
  for(const ed of ['essential','signature']){
    const p=config.prices?.[ed];if(!p)continue;
    const cur=dialog.querySelector('[data-price-current="'+ed+'"]'),norm=dialog.querySelector('[data-price-normal="'+ed+'"]');
    if(cur)cur.textContent=euro(p.current);if(norm)norm.textContent=euro(p.normal);
  }
  const note=dialog.querySelector('#oneLaunchNote');if(note)note.hidden=!config.launch;
  return config;
}
function loadStripeJs(){
  if(window.Stripe)return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const old=document.querySelector('script[data-wsd-stripe]');if(old){old.addEventListener('load',resolve,{once:true});old.addEventListener('error',reject,{once:true});return}
    const s=document.createElement('script');s.src='https://js.stripe.com/v3/';s.async=true;s.dataset.wsdStripe='1';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
  });
}
async function open(){
  if(!dialog)inject();
  if(!dialog.open)dialog.showModal();
  try{await loadConfig()}catch{const st=dialog.querySelector('#onePaymentState');st.className='one-payment-error';st.textContent='El pago está preparado, pero Stripe todavía no está conectado a esta versión de prueba.'}
}
function close(){destroy();if(dialog?.open)dialog.close()}
async function select(next){
  if(!['essential','signature'].includes(next)||next===edition)return;
  edition=next;dialog.querySelectorAll('[data-edition]').forEach(x=>x.classList.toggle('selected',x.dataset.edition===edition));
  if(dialog.querySelector('#oneImmediateConsent')?.checked){await destroy();mount()}
}
async function destroy(){
  try{embedded?.destroy?.()}catch{}embedded=null;
  const mount=dialog?.querySelector('#oneStripeMount');if(mount)mount.innerHTML='';
  const st=dialog?.querySelector('#onePaymentState');if(st&&!busy){st.className='one-payment-placeholder';st.textContent='Marca la casilla anterior y el pago aparecerá aquí, sin salir de WeddlySmartDesign.'}
}
async function mount(){
  if(busy||embedded)return;busy=true;
  const st=dialog.querySelector('#onePaymentState');st.className='one-payment-placeholder';st.textContent='Preparando el pago seguro…';
  try{
    const cfg=await loadConfig();await loadStripeJs();
    if(!stripe)stripe=window.Stripe(cfg.publishableKey);
    embedded=await stripe.initEmbeddedCheckout({fetchClientSecret:async()=>{
      const x=await api({action:'create',edition,immediateAccessConsent:true});return x.clientSecret;
    }});
    st.textContent='';st.style.display='none';embedded.mount('#oneStripeMount');
  }catch(e){
    st.style.display='block';st.className='one-payment-error';
    st.textContent=e?.message==='consent_required'?'Necesitamos tu confirmación de acceso inmediato antes de abrir el pago.':'Stripe todavía no está listo en esta versión. Tu selección no se ha cobrado.';
  }finally{busy=false}
}
function boot(){inject()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();