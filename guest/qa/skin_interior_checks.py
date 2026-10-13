#!/usr/bin/env python3
"""Comprobación de interiores propios (D04–D08): nº de momentos y bloques prácticos pintados = datos del
cuestionario, sin desbordes; tocar un momento anterior lo muestra; abrir un bloque muestra su contenido.
Uso: python3 guest/qa/skin_interior_checks.py design-08:.cj-note:.cj-drawer:.cj-now design-04:.az-tile:.az-win:.az-now"""
import asyncio,sys,os
from playwright.async_api import async_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
async def check(br,spec):
  D,NOTE,DRAW,NOW=spec.split(':');bad=[]
  for w in [320,390,430]:
    pg=await br.new_page(viewport={'width':w,'height':760});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(f'file://{ROOT}/templates/{D}/master.html');await pg.wait_for_timeout(600)
    for a in range(0,6):
      for d in range(0,5):
        r=await pg.evaluate("""([a,d,N,R])=>{const f=window.__GUEST_SKIN__.fixture('full');f.agenda.moments=f.agenda.moments.slice(0,a);f.agenda.enabled=a>0;['bus','accommodation','gift','playlist'].forEach((k,i)=>f.practical[k].enabled=i<d);window.GUEST_APPLY_CONFIG(f);
          return {n:document.querySelectorAll(N).length,dr:document.querySelectorAll(R).length,ag:!document.getElementById('agenda').classList.contains('invisible'),pr:!document.getElementById('practical').classList.contains('invisible'),ox:document.documentElement.scrollWidth-document.documentElement.clientWidth}}""",[a,d,NOTE,DRAW])
        if r['n']!=a or r['dr']!=d or r['ag']!=(a>0) or r['pr']!=(d>0) or r['ox']>0:bad.append((w,a,d,r))
    await pg.evaluate("window.GUEST_APPLY_CONFIG(window.__GUEST_SKIN__.fixture('full'))")
    await pg.evaluate(f"document.querySelector('{NOTE}').scrollIntoView({{block:'center',behavior:'instant'}})");await pg.wait_for_timeout(500)
    await pg.click(f'{NOTE} >> nth=0');await pg.wait_for_timeout(400)
    cur=await pg.evaluate(f"[...document.querySelectorAll('{NOW} > div')].findIndex(d=>d.classList.contains('on'))")
    await pg.evaluate(f"document.querySelector('{DRAW}').scrollIntoView({{block:'center',behavior:'instant'}})");await pg.click(f'{DRAW} >> nth=1');await pg.wait_for_timeout(1000)
    tr=await pg.evaluate(f"(()=>{{const b=document.querySelectorAll('{DRAW}')[1];const t=document.getElementById(b.getAttribute('aria-controls'));return [t.offsetHeight,t.querySelector('h3')?.textContent||'']}})()")
    if cur!=0 or tr[0]<60:bad.append((w,'interaction',cur,tr))
    if errs:bad.append((w,'errors',errs))
    await pg.close()
  return D,bad
async def main():
  async with async_playwright() as p:
    br=await p.chromium.launch();ok=True
    for spec in sys.argv[1:]:
      D,bad=await check(br,spec);print(D,'PASS' if not bad else 'FAIL',bad[:5]);ok=ok and not bad
    await br.close();sys.exit(0 if ok else 1)
asyncio.run(main())
