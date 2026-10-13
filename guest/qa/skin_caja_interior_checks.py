import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch();bad=[]
    for w in [320,390,430]:
      pg=await br.new_page(viewport={'width':w,'height':760});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('file:///home/claude/guest-wt/guest/templates/design-08/master.html');await pg.wait_for_timeout(600)
      for a in range(0,6):
        for d in range(0,5):
          r=await pg.evaluate("""([a,d])=>{const f=window.__GUEST_SKIN__.fixture('full');f.agenda.moments=f.agenda.moments.slice(0,a);f.agenda.enabled=a>0;const ks=['bus','accommodation','gift','playlist'];ks.forEach((k,i)=>f.practical[k].enabled=i<d);window.GUEST_APPLY_CONFIG(f);
            return {notes:document.querySelectorAll('.cj-note').length,drawers:document.querySelectorAll('.cj-drawer').length,ag:!document.getElementById('agenda').classList.contains('invisible'),pr:!document.getElementById('practical').classList.contains('invisible'),ox:document.documentElement.scrollWidth-document.documentElement.clientWidth}}""",[a,d])
          if r['notes']!=a or r['drawers']!=d or r['ag']!=(a>0) or r['pr']!=(d>0) or r['ox']>0: bad.append((w,a,d,r))
      # tocar una nota anterior y abrir cajón
      await pg.evaluate("window.GUEST_APPLY_CONFIG(window.__GUEST_SKIN__.fixture('full'))");await pg.evaluate("document.querySelector('.cj-staff').scrollIntoView({block:'start'})");await pg.wait_for_timeout(400)
      await pg.click('.cj-note >> nth=0');await pg.wait_for_timeout(300)
      cur=await pg.evaluate("[...document.querySelectorAll('.cj-now div')].findIndex(d=>d.classList.contains('on'))")
      await pg.evaluate("document.querySelector('.cj-drawer').scrollIntoView({block:'center'})");await pg.click('.cj-drawer >> nth=1');await pg.wait_for_timeout(900)
      tr=await pg.evaluate("[document.getElementById('cj-tray').offsetHeight,document.querySelector('.cj-tray-in h3').textContent,[...document.querySelectorAll('.cj-tray-in a.link')].map(a=>a.textContent)]")
      if cur!=0 or tr[0]<60: bad.append((w,'interaction',cur,tr))
      if errs: bad.append((w,'errors',errs))
      print(w,cur,tr)
      await pg.close()
    print('bad',bad);await br.close()
asyncio.run(main())
