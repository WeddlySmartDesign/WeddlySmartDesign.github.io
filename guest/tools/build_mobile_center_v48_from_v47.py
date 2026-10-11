#!/usr/bin/env python3
"""Isolated, SHA-pinned V4.7 Android Center iframe load-order hotfix (no master edits)."""
from pathlib import Path
from hashlib import sha256
import sys, json, re
PIN = '3ce9f5fa97a623c0b358336d11bbcd58db586a4e60c34e93b24abcc44e1c0484'
BASENAME = 'GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_INTEGRATED_2026-10-11.html'
OUTPUT = 'GUEST_MOBILE_CENTER_V4_8_BOTANICA_ANDROID_RENDERER_FIXED_2026-10-11.html'
FRAGMENT_OLD = ''' iframe.addEventListener('load',()=>{
  if(k!==generation||!active||!iframe.isConnected)return;
  try{
   const adapt=iframe.contentWindow?.BOTANICA_APPLY_CONFIG;
   if(typeof adapt!=='function')throw Error('adapter_not_found');
   adapt(structuredClone(config));
   iframe.style.visibility='visible';
  }catch(e){
   if(k!==generation)return;
   host.replaceChildren();const x=document.createElement('p');
   x.style.cssText='padding:20px;color:#a32e2e;font:16px system-ui';
   x.textContent='No se ha podido visualizar Botánica: '+String(e?.message||e);host.append(x);
  }
 },{once:true});
 host.replaceChildren(iframe);
 // srcdoc inherits this Android app's local document origin; a data: URL
 // would not allow access to the frozen adapter and is deliberately avoided.
 iframe.srcdoc=text();'''
FRAGMENT_NEW = ''' // Set srcdoc BEFORE attaching the iframe: the old implementation attached
 // a once-only load listener, appended an empty iframe, then set srcdoc.
 // Android WebView may first deliver an about:blank load and consume that
 // listener, producing adapter_not_found before Botánica ever starts.
 iframe.srcdoc=text();
 let finished=false, watchdog;
 const fail=(reason)=>{
  if(k!==generation||!active||finished)return;
  finished=true;clearTimeout(watchdog);
  host.replaceChildren();const x=document.createElement('p');
  x.style.cssText='padding:20px;color:#a32e2e;font:16px system-ui';
  x.textContent='No se ha podido visualizar Botánica: '+String(reason);host.append(x);
 };
 iframe.addEventListener('load',()=>{
  if(k!==generation||!active||finished||!iframe.isConnected)return;
  try{
   const win=iframe.contentWindow, doc=win&&win.document;
   // Never consume a load from the initial empty about:blank document.
   if(!doc||!doc.getElementById('invitation'))return;
   const adapt=win.BOTANICA_APPLY_CONFIG;
   if(typeof adapt!=='function')throw Error('adapter_not_found_after_master_loaded');
   adapt(structuredClone(config));
   finished=true;clearTimeout(watchdog);
   iframe.style.visibility='visible';
  }catch(e){fail(e?.message||e)}
 });
 host.replaceChildren(iframe);
 watchdog=setTimeout(()=>{
  if(k===generation&&active&&!finished)fail('iframe_load_timeout');
 },45000);'''
def replace_one(s,a,b,label):
 n=s.count(a)
 if n!=1:raise ValueError(f'SOURCE_DRIFT_{label}: expected once, got {n}')
 return s.replace(a,b,1)
def build(infile,outfile):
 raw=Path(infile).read_bytes()
 if sha256(raw).hexdigest()!=PIN or len(raw)!=45557384:raise ValueError('FROZEN_V47_SHA_SIZE_MISMATCH')
 s=raw.decode('utf8')
 s=replace_one(s,FRAGMENT_OLD,FRAGMENT_NEW,'renderer_boot')
 s=replace_one(s,"version:'4.7.0-test'","version:'4.8.0-test'",'engine_version')
 s=replace_one(s,'GUEST · Centro móvil · V4.7 · Botánica TEST','GUEST · Centro móvil · V4.8 · Botánica TEST','center_version')
 # Lift the visual preview bar below the Android status bar; no change to invitation.
 s=replace_one(s,"height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 14px", "height:86px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:30px 14px 8px",'header_safe_area')
 s=replace_one(s,'height:calc(100% - 54px);width:100%;background:#fff', 'height:calc(100% - 86px);width:100%;background:#fff','viewport_safe_area')
 s=replace_one(s,"if(window.GUEST_CENTER_V47.active())window.GUEST_CENTER_V47.show();\n  root.classList.add('off');\n  reopen.style.display='block';", "if(window.GUEST_CENTER_V47.active())window.GUEST_CENTER_V47.show();\n  root.classList.add('off');\n  reopen.style.display=window.GUEST_CENTER_V47.active()?'none':'block';",'hide_duplicate_back_button')
 # strictly unchanged approved master script (large embedded base64)
 a=re.search(r'(<script id="guest-v47-botanica-master" type="application/octet-stream" data-sha256="([a-f0-9]{64})">)([A-Za-z0-9+/=]+)(</script>)',s)
 if not a or a.group(2)!='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a':raise ValueError('EMBEDDED_BOTANICA_PIN_MISMATCH')
 import base64
 if sha256(base64.b64decode(a.group(3))).hexdigest()!=a.group(2):raise ValueError('EMBEDDED_MASTER_INVALID')
 data=s.encode('utf8')
 with open(outfile,'xb') as f:f.write(data)
 print(json.dumps({'output':str(outfile),'sha256':sha256(data).hexdigest(),'sizeBytes':len(data),'baseSha256':PIN,'botanicaMasterSha256':a.group(2)},indent=2))
if __name__=='__main__':
 inp=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent/BASENAME
 out=Path(sys.argv[2]) if len(sys.argv)>2 else Path('/mnt/data')/OUTPUT
 build(inp,out)
