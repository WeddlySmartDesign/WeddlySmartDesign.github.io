const { chromium } = require('playwright');
const fs=require('fs'),path=require('path');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const repoRoot=path.resolve(__dirname,'..','..');
const base=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173';

function staticAudit(){
  const landing=fs.readFileSync(path.join(repoRoot,'guest.html'),'utf8');
  const checkout=fs.readFileSync(path.join(repoRoot,'guest-checkout.html'),'utf8');
  const required=[
    ['guest.html','guest-checkout.html?edition=essential'],
    ['guest.html','guest-checkout.html?edition=signature'],
    ['guest-checkout.html','guest.html#comprar'],
    ['guest-checkout.html','guest-legal.html#contratacion'],
    ['guest-checkout.html','guest-legal.html#privacidad']
  ];
  for(const [file,needle] of required){
    const src=file==='guest.html'?landing:checkout;
    ok(src.includes(needle),file+' missing route '+needle);
  }
  for(const p of ['guest.html','guest-checkout.html','guest-checkout-return.html','guest-order.html','guest-legal.html']){
    ok(fs.existsSync(path.join(repoRoot,p)),'missing commercial file '+p);
  }
  const joined=landing+'\n'+checkout;
  ok(!/ONE Partner|STUDIO|one\.html|partner\.html/i.test(joined),'foreign product dependency in commercial entry flow');
  ok(joined.includes('/functions/v1/guest-stripe-checkout'),'GUEST checkout endpoint missing');
}

async function mockConfig(page){
  await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout',async route=>{
    let body={}; try{body=route.request().postDataJSON()||{}}catch{}
    if(body.action==='config'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
        ok:true,publishableKey:'pk_test_guest',
        prices:{essential:{current:3990},signature:{current:4990}}
      })});
      return;
    }
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})});
  });
}
async function noOverflow(page,label){
  const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
  ok(x.sw<=x.cw+2&&x.bw<=x.cw+2,label+' overflow '+JSON.stringify(x));
}
async function verifyEdition(browser,edition,w,h){
  const ctx=await browser.newContext({viewport:{width:w,height:h},isMobile:w<600,hasTouch:w<600});
  const page=await ctx.newPage();
  await mockConfig(page);
  await page.goto(base+'/guest.html',{waitUntil:'domcontentloaded'});
  await noOverflow(page,'landing '+w);
  const link=page.locator('a.buychoice[href="guest-checkout.html?edition='+edition+'"]');
  ok(await link.count()===1,'landing missing '+edition+' buy link');
  await link.click();
  await page.waitForURL(new RegExp('guest-checkout\\.html\\?edition='+edition+'$'));
  await page.waitForSelector('.edition.selected');
  ok(await page.locator('.edition.selected').getAttribute('data-edition')===edition,'checkout did not preserve '+edition);
  ok(!(await page.locator('#consent').isChecked()),'consent must be opt-in');
  ok(await page.locator('#state').innerText()==='Marca la casilla anterior para abrir el pago seguro.','payment opened before consent');
  const back=await page.locator('a.back').getAttribute('href');
  ok(back==='guest.html#comprar','checkout back route wrong');
  const legal=await page.locator('.consent a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
  ok(legal.includes('guest-legal.html#contratacion')&&legal.includes('guest-legal.html#privacidad'),'legal routes incomplete');
  await noOverflow(page,'checkout '+edition+' '+w);
  const body=await page.locator('body').innerText();
  ok(body.includes('GUEST')&&body.includes('WeddlySmartDesign'),'checkout brand missing');
  ok(!/ONE Partner|STUDIO/.test(body),'foreign product visible in checkout');
  await ctx.close();
}
(async()=>{
  staticAudit();
  const browser=await chromium.launch({headless:true});
  for(const [w,h] of [[390,844],[1366,900]]){
    await verifyEdition(browser,'essential',w,h);
    await verifyEdition(browser,'signature',w,h);
  }
  await browser.close();
  console.log('B8.1 commercial entry flow: PASS');
})().catch(e=>{console.error('B8.1 FAIL:',e.stack||e);process.exit(1)});
