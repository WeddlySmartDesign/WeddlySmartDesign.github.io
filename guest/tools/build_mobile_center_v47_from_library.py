#!/usr/bin/env python3
"""GUEST Mobile Center v4.7: isolated TEST-only Botánica adapter.

Reproducible from two immutable Library inputs. Never edits input files.
No ONE, VEIL frozen visual, Stripe, Supabase, or GitHub production changes.
"""
from pathlib import Path
from hashlib import sha256
import base64, re, json, sys

CENTER_SHA = 'a95984b658e560a9c3fca4bd92315b41c1b92cc4f6d47fffeed890da6f1f2133'
BOTANICA_SHA = 'fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a'
CENTER_FILE = 'GUEST_MOBILE_CENTER_V4_6_CLEAN_FROZEN.html'
BOTANICA_FILE = 'GUEST_D02_BOTANICA_ATELIER_V14_7_PHOTO_ONLY_VISUAL_QA_CANDIDATE_2026-10-09.html'
OUTFILE = 'GUEST_MOBILE_CENTER_V4_7_BOTANICA_TEST_INTEGRATED_2026-10-11.html'

def replace_exact(source, old, new, label):
    count = source.count(old)
    if count != 1:
        raise ValueError(f'SOURCE_DRIFT {label}: expected 1 occurrence, got {count}')
    return source.replace(old,new,1)

ENGINE = r'''<script id="guest-v47-renderer-engine">
(()=>{'use strict';
if(window.GUEST_CENTER_V47)throw Error('guest_center_v47_duplicate');
// The approved Botánica template is embedded as base64 in this single local file.
// Importing this HTML into the existing Android app needs no extra file, APK,
// new hosting or new service. The only permitted new template is Botánica TEST.
const asset=document.getElementById('guest-v47-botanica-master');
if(!asset||asset.dataset.sha256!=='fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a')throw Error('botanica_asset_pin_failed');
let panel=null, host=null, child=null, generation=0, decoded=null, active=false;
function init(){
 if(panel)return;
 panel=document.createElement('section');panel.id='guest-v47-preview';
 panel.style.cssText='display:none;position:fixed;inset:0;z-index:100000;background:#f8f4ed;overflow:hidden;font:15px system-ui,sans-serif';
 panel.innerHTML='<header style="height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 14px;background:#f8f4ed;border-bottom:1px solid #d9ccbe"><strong>GUEST · BOTÁNICA · SOLO PRUEBA</strong><button id="guest-v47-back" type="button" style="min-height:40px;background:#48392f;color:#fff;border:0;border-radius:10px;padding:9px 16px;font:700 15px system-ui">CENTRO GUEST</button></header><div id="guest-v47-content" style="height:calc(100% - 54px);width:100%;background:#fff;overflow:hidden"><p role="status" style="padding:18px">Preparando el diseño aprobado…</p></div>';
 document.body.append(panel);
 host=panel.querySelector('#guest-v47-content');
 panel.querySelector('#guest-v47-back').addEventListener('click',()=>{
   const back=document.getElementById('wsdProdBtn');
   if(back&&typeof back.click==='function')back.click();
   else close();
 });
}
function text(){
 if(decoded!==null)return decoded;
 const b64=asset.textContent.trim(),bin=atob(b64),u8=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
 decoded=new TextDecoder('utf-8',{fatal:true}).decode(u8);return decoded;
}
function close(){generation++;active=false;if(panel)panel.style.display='none';if(child){child.remove();child=null}if(host)host.replaceChildren();}
function show(){if(active){init();panel.style.display='block';}}
function apply(order,config){
 if(String(order?.mode)!=='test')throw Error('botanica_only_test_orders');
 if(String(order?.template_id||order?.templateId)!=='botanica')throw Error('botanica_wrong_template');
 if(config?.template?.id!=='botanica'||String(config?.template?.version)!=='14.7')throw Error('botanica_config_version_mismatch');
 const pinned=order?.template_version||order?.templateVersion||config.template.version;
 if(String(pinned)!=='14.7')throw Error('botanica_order_version_mismatch');
 init();close();active=true;
 const k=++generation;
 const iframe=document.createElement('iframe');child=iframe;
 iframe.title='Botánica 14.7 · vista del Centro GUEST · prueba';
 iframe.setAttribute('referrerpolicy','no-referrer');
 iframe.style.cssText='display:block;width:100%;height:100%;border:0;visibility:hidden';
 iframe.addEventListener('load',()=>{
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
 iframe.srcdoc=text();
}
window.GUEST_CENTER_V47=Object.freeze({version:'4.7.0-test',apply,show,close,active:()=>active});
})();
</script>
'''

def build(center_file,botanica_file,outdir):
    center_bytes=center_file.read_bytes();bot_bytes=botanica_file.read_bytes();
    if sha256(center_bytes).hexdigest()!=CENTER_SHA:raise ValueError('frozen V4.6 checksum mismatch')
    if sha256(bot_bytes).hexdigest()!=BOTANICA_SHA:raise ValueError('frozen Botánica V14.7 checksum mismatch')
    source=center_bytes.decode('utf-8');
    asset_b64=base64.b64encode(bot_bytes).decode('ascii')
    embed='<script id="guest-v47-botanica-master" type="application/octet-stream" data-sha256="'+BOTANICA_SHA+'">'+asset_b64+'</script>\n'
    source=replace_exact(source,'<script id="wsd-production-workbench-script">',embed+ENGINE+'<script id="wsd-production-workbench-script">','inject assets before existing workbench')
    legacy="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}}};\nfunction rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);return r}\nfunction applyOrderConfig(order,cfg){return rendererFor(order).apply(cfg)}"
    patched="const CATALOG_RENDERERS={'veil-light':{label:'VEIL LIGHT',apply:c=>{if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('renderer_unavailable');return window.VEIL_APPLY_CONFIG(c)}},'botanica':{label:'BOTÁNICA · SOLO PRUEBA',apply:(c,o)=>window.GUEST_CENTER_V47.apply(o,c)}};\nfunction rendererFor(order){const id=String(order?.template_id||order?.templateId||'veil-light');const r=CATALOG_RENDERERS[id];if(!r)throw new Error('template_renderer_unavailable:'+id);if(id==='botanica'&&order?.mode!=='test')throw new Error('botanica_only_test_orders');return r}\nfunction applyOrderConfig(order,cfg){if(String(order?.template_id||order?.templateId||'')!=='botanica')window.GUEST_CENTER_V47.close();return rendererFor(order).apply(cfg,order)}"
    source=replace_exact(source,legacy,patched,'replace only dispatcher without changing frozen VEIL')
    source=replace_exact(source,'function openCenter(){\n  closeTool();','function openCenter(){\n  window.GUEST_CENTER_V47.close();\n  closeTool();','go back from integrated preview')
    source=replace_exact(source,'function hideCenter(){\n  root.classList.add(\'off\');',"function hideCenter(){\n  if(window.GUEST_CENTER_V47.active())window.GUEST_CENTER_V47.show();\n  root.classList.add('off');",'show integrated preview when owner hides center')
    # The production workbench already supports customer orders for all registered
    # templates. Only the optional QA creation button was still VEIL-only.
    source=replace_exact(source,
      "const x=await call(FLOW,{action:'create_test',email:'',templateId:'veil-light'});await openQuestionnaireWith(x.qToken,false);",
      "const x=await call(FLOW,{action:'create_test',email:'',templateId:String(document.getElementById('guest-v47-template')?.value||'veil-light')});await openQuestionnaireWith(x.qToken,false);",
      'generic new TEST order picker')
    insert="""const guestV47Choice=document.createElement('select');guestV47Choice.id='guest-v47-template';guestV47Choice.setAttribute('aria-label','Diseño de prueba');guestV47Choice.style.cssText='width:100%;min-height:48px;margin:8px 0;background:#fff;border-radius:12px;font:16px system-ui';guestV47Choice.innerHTML='<option value=\"veil-light\">VEIL LIGHT · congelado</option><option value=\"botanica\">BOTÁNICA 14.7 · SOLO PRUEBA</option>';document.getElementById('wpNewTest').insertAdjacentElement('beforebegin',guestV47Choice);\n"""
    source=replace_exact(source,"const reopen=document.createElement('button');reopen.id='wsdProdBtn';",insert+"const reopen=document.createElement('button');reopen.id='wsdProdBtn';",'new design is catalog pick, not copy-pasted logic')
    source=replace_exact(source,'GUEST · Centro móvil · V4.6','GUEST · Centro móvil · V4.7 · Botánica TEST','version visible')
    out=outdir/OUTFILE
    if out.exists():raise FileExistsError('Will not overwrite prior V4.7 release')
    out.write_bytes(source.encode('utf-8'))
    bundle=out.read_bytes()
    manifest={
      'schemaVersion':'guest-owner-center-integrated-v47-test-2026-10-11',
      'sourceCenter':{'file':CENTER_FILE,'sha256':CENTER_SHA,'byteCount':len(center_bytes),'frozenUnmodified':True},
      'sourceBotanica':{'file':BOTANICA_FILE,'sha256':BOTANICA_SHA,'byteCount':len(bot_bytes),'frozenUnmodified':True},
      'artifact':{'file':OUTFILE,'sha256':sha256(bundle).hexdigest(),'byteCount':len(bundle)},
      'architecture':'single-file Android existing APK import; frozen VEIL native and Botánica TEST embedded same-origin iframe.srcdoc',
      'restrictions':['Botánica production sale disabled','no new services','no changes to frozen originals','no changes ONE Partner STUDIO main'],
      'acceptance':'operator must import v4.7 file via Android app Update center and verify genuine TEST order in app before marking renderer gate PASS'
    }
    (outdir/'GUEST_MOBILE_CENTER_V4_7_MANIFEST_2026-10-11.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(manifest,ensure_ascii=False,indent=2))
    return out

if __name__=='__main__':
 outdir=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/mnt/data/guest_center_v47_release')
 outdir.mkdir(parents=True,exist_ok=True)
 build(Path('/mnt/data/guest_audit_v46')/CENTER_FILE,Path('/mnt/data/guest_center_v47_inputs')/BOTANICA_FILE,outdir)