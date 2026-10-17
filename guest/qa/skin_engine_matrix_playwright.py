import asyncio,json,copy
from playwright.async_api import async_playwright
IDS=['design-04','design-05','design-06','design-07','design-08','design-09','design-10','design-11','design-12','design-13','design-14','design-15']
R='/home/claude/guest-wt/guest/'
SC=json.load(open('/tmp/claude-0/qa/scen.json'));normal=SC['normal'];stress=SC['stress']
def cfg(x):
    return x.get('config',x.get('resolved_config',x))
CHECK="""()=>{const vis=s=>!s.classList.contains('invisible');const sec=[...document.querySelectorAll('section')].filter(vis).map(s=>s.id);
 const orphans=[...document.querySelectorAll('.location-links,.gallery-nav,#moments,#practical-items')].filter(e=>e.offsetParent&&!e.childElementCount).length;
 const deadLinks=[...document.querySelectorAll('a.link')].filter(a=>!/^https?:/.test(a.href)).length;
 const small=[...document.querySelectorAll('a.link,summary,.gallery-dot,.rsvp-button,.entry-button')].filter(e=>e.offsetParent&&e.getBoundingClientRect().height<42).length;
 const imgs=document.querySelectorAll('#gallery-items img').length,dots=document.querySelectorAll('.gallery-dot').length;
 return {sec,orphans,deadLinks,small,imgs,dots,ox:document.documentElement.scrollWidth-document.documentElement.clientWidth}}"""
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch();fails=[];n=0
    for i in IDS:
      for w in [320,360,390,430]:
        pg=await br.new_page(viewport={'width':w,'height':780});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(f'file://{R}templates/{i}/master.html');await pg.wait_for_timeout(500)
        cases={'full':'fixture("full")','reduced':'fixture("reduced")','without-gallery':'fixture("without-gallery")'}
        scen={}
        for k,c in [('normal',cfg(normal)),('stress',cfg(stress))]:
            c=copy.deepcopy(c);c['template']={'id':i,'version':'1.0.0','typographyVariant':'classic'};scen[k]=c
        for k,expr in cases.items():
            r=await pg.evaluate(f"()=>{{window.GUEST_APPLY_CONFIG(window.__GUEST_SKIN__.{expr});return 1}}");m=await pg.evaluate(CHECK);n+=1
            if m['ox']>0 or m['orphans'] or m['deadLinks'] or m['small']:fails.append((i,w,k,m))
        for k,c in scen.items():
            try:await pg.evaluate("c=>{const fix=o=>{if(o&&typeof o==='object'){for(const k in o){if(typeof o[k]==='string'&&o[k].startsWith('upload:'))o[k]=window.__GUEST_SKIN__.fixture('full').story.photo.src;else fix(o[k])}}};fix(c);return window.GUEST_APPLY_CONFIG(c)}",c)
            except Exception as e:fails.append((i,w,k,str(e)[:200]));continue
            m=await pg.evaluate(CHECK);n+=1
            if m['ox']>0 or m['orphans'] or m['deadLinks'] or m['small']:fails.append((i,w,k,m))
        # galería 0..4 y navegación real del carrusel
        for g in range(5):
            r=await pg.evaluate("""g=>{const f=window.__GUEST_SKIN__.fixture('full');f.gallery.photos=f.gallery.photos.slice(0,g);f.gallery.enabled=g>0;window.GUEST_APPLY_CONFIG(f);return 1}""",g)
            m=await pg.evaluate(CHECK);n+=1
            exp_dots=g if g>1 else 0
            ok=m['imgs']==g and m['dots']==exp_dots and (('gallery' in m['sec'])==(g>0)) and m['ox']==0
            if g>=2:
                await pg.evaluate("document.getElementById('gallery').scrollIntoView()");await pg.wait_for_timeout(100)
                await pg.click(f'.gallery-dot >> nth={g-1}');await pg.wait_for_timeout(700)
                cur=await pg.evaluate("[...document.querySelectorAll('.gallery-dot')].findIndex(b=>b.getAttribute('aria-current')==='true')")
                ok=ok and cur==g-1
            if not ok:fails.append((i,w,'gallery'+str(g),m))
        # ausencias: sin historia, sin agenda, 1-4 momentos, práctico 0-3 módulos, 1 sede, sin countdown
        r=await pg.evaluate("""()=>{const out=[];const base=()=>window.__GUEST_SKIN__.fixture('without-gallery');
          const tests={noStory:f=>{f.story.enabled=false},storyTextOnly:f=>{f.story.photo=null},storyPhotoOnly:f=>{f.story.textMode='none'},noAgenda:f=>{f.agenda.enabled=false},
           m1:f=>{f.agenda.moments=f.agenda.moments.slice(0,1)},m3:f=>{f.agenda.moments=f.agenda.moments.slice(0,3)},
           p0:f=>{for(const k of ['bus','accommodation','gift','playlist'])f.practical[k].enabled=false},p1:f=>{for(const k of ['bus','accommodation','gift'])f.practical[k].enabled=false},
           noUrls:f=>{f.practical.playlist.url=null;f.practical.accommodation.websiteUrl=null;f.practical.accommodation.mapsUrl=null;f.locations.items.forEach(x=>{x.mapsUrl=null;x.websiteUrl=null})},
           oneVenue:f=>{f.locations.items=f.locations.items.slice(0,1)},noCountdown:f=>{f.countdown.enabled=false},longNames:f=>{f.couple={name1:'María de los Ángeles Inmaculada',name2:'Juan Bautista Fernández'};f.wedding.coverPlace='Santiago de Compostela, Galicia'},
           onlyLocations:f=>{f.story.enabled=false;f.agenda.enabled=false;for(const k of ['bus','accommodation','gift','playlist'])f.practical[k].enabled=false}};
          for(const [k,fn] of Object.entries(tests)){const f=base();fn(f);const r=window.GUEST_APPLY_CONFIG(f);
            const dead=[...document.querySelectorAll('a.link')].filter(a=>!/^https?:/.test(a.href)).length,emptyBlocks=[...document.querySelectorAll('.practical-item')].filter(b=>b.children.length<2).length;
            out.push([k,r.visibleScenes,r.sceneKinds.join('/'),dead,emptyBlocks,document.documentElement.scrollWidth-document.documentElement.clientWidth,document.getElementById('countdown').classList.contains('invisible')])}
          return out}""")
        for row in r:
            if row[3] or row[4] or row[5]>0: fails.append((i,w,'absence',row))
            n+=1
        if w==390: print(i,json.dumps(r,ensure_ascii=False))
        if errs:fails.append((i,w,'errors',errs))
        await pg.close()
    print('checks',n,'fails',len(fails));[print(f) for f in fails[:30]]
    await br.close()
asyncio.run(main())
