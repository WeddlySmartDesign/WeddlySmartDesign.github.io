const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const BASE=process.env.GUEST_QA_BASE||'http://127.0.0.1:4173',TOKEN='x'.repeat(64);
const mockState={meta:{couple:['Prueba','Seguridad'],weddingDate:'2027-06-12'},guests:{test:{name:'Invitada prueba',rsvp:'confirmed'}},tables:{}};
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    async function scenario(name,{withToken,withCache,status,networkDown}){
      const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
      const page=await ctx.newPage();
      await page.addInitScript(({token,cache,local})=>{
        if(token)localStorage.setItem('weddly_shared_wedding_token',token);
        if(cache)localStorage.setItem('weddly_guests_qa_v67',JSON.stringify(local));
      },{token:withToken?TOKEN:'',cache:withCache,local:mockState});
      let stateCalls=0;
      await page.route('https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/**',async route=>{
        const name=new URL(route.request().url()).pathname.split('/').pop();
        if(name==='guest-state'){
          stateCalls++;
          if(networkDown)return route.abort('failed');
          if(status!==200)return route.fulfill({status,contentType:'application/json',body:JSON.stringify({ok:false,error:'invalid_access'})});
          return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,state:mockState,version:1})});
        }
        return route.fulfill({status:401,contentType:'application/json',body:'{"ok":false}'});
      });
      await page.goto(BASE+'/guest/index.html',{waitUntil:'domcontentloaded'});
      if(!withToken){
        await page.waitForFunction(()=>document.getElementById('msg')?.textContent?.includes('todavía no tiene acceso'),{timeout:7000});
        assert.equal(await page.locator('#app').isVisible(),false,'No token must not load existing cached wedding');
        assert.equal(stateCalls,0,'No token must not query backend');
      }else if(networkDown){
        await page.waitForFunction(()=>document.getElementById('app')?.style?.display==='block',{timeout:8000});
        assert.equal(await page.locator('#app').isVisible(),true,'Genuine network outage must allow cached offline access');
      }else if(status===401||status===403){
        await page.waitForFunction(()=>document.getElementById('msg')?.textContent?.includes('ya no está activo'),{timeout:8000});
        assert.equal(await page.locator('#app').isVisible(),false,name+': revoked token exposed cached wedding');
        assert.equal(await page.locator('#retry').isVisible(),true,name+': no return to access');
        assert.match(await page.locator('#retry').getAttribute('href'),/access\.html/);
      }
      await ctx.close();
      return{name,stateCalls,blocked:!networkDown};
    }
    const checks=[];
    checks.push(await scenario('no_token_cached_data',{withToken:false,withCache:true,status:401}));
    checks.push(await scenario('revoked_401_cached_data',{withToken:true,withCache:true,status:401}));
    checks.push(await scenario('revoked_403_cached_data',{withToken:true,withCache:true,status:403}));
    checks.push(await scenario('real_outage_cached_data',{withToken:true,withCache:true,networkDown:true}));
    console.log('PASS GUEST revocation vs network outage — no customer-data exposure on 401/403, offline retained',JSON.stringify(checks));
  }finally{await browser.close()}
})().catch(e=>{console.error('FAIL GUEST access security:',e.stack||e);process.exit(1)});
