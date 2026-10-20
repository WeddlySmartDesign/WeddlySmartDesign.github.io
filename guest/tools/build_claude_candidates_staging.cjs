#!/usr/bin/env node
'use strict';
// TEST-ONLY: exact Claude masters -> losslessly split large base64 media for static preview.
// No sales, checkout, production deployment, passwords or customer data.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2);
const oi=args.indexOf('--output'),out=oi>=0?args[oi+1]:null;
if(!out||!path.isAbsolute(out)||out==='/tmp'||path.resolve(out)===root)throw Error('SAFE_ABSOLUTE_OUTPUT_REQUIRED');
if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('STAGE_OUTPUT_MUST_BE_EMPTY');
fs.mkdirSync(out,{recursive:true});
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const inventories=[
 require('../GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json'),
 require('../GUEST_CLAUDE_D10_D16_IMPORT_MANIFEST_2026-10-20.json')
];
const all=inventories.flatMap(x=>x.files),known=new Map(all.map(x=>[x.path,x]));
if(all.length!==211||known.size!==211)throw Error('CLAUDE_SOURCE_INVENTORY_DRIFT');
const ids=Array.from({length:13},(_,i)=>'design-'+String(i+4).padStart(2,'0'));
const names=['AZULEJO','GALA','INVERNADERO','REFLEJO','CAJA DE MÚSICA','LIMONEROS · VERSIÓN CLAUDE','CUENTO DE PAPEL','BOLA DE CRISTAL','ABANICO','VIÑETAS','VIÑETAS · ELLAS','VIÑETAS · ELLOS','EL MAPA'];
const limit=24*1024*1024,files=[];let total=0;
function write(rel,buf){
 if(rel.includes('..')||path.isAbsolute(rel))throw Error('UNSAFE_STAGE_OUTPUT');
 if(buf.length>limit)throw Error('HOSTING_FILE_TOO_LARGE:'+rel+':'+buf.length);
 const file=path.join(out,rel);fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,buf,{flag:'wx'});
 files.push({path:rel,bytes:buf.length,sha256:digest(buf)});total+=buf.length;
}
function exact(rel){
 const b=fs.readFileSync(path.join(root,rel)),m=known.get(rel);
 if(!m||m.bytes!==b.length||m.gitBlobSha1!==git(b))throw Error('ORIGINAL_CLAUDE_BLOB_CHANGED:'+rel);
 return b;
}
function split(buf,id){
 const src=buf.toString('utf8');
 if(Buffer.byteLength(src)!==buf.length)throw Error('VISUAL_SOURCE_NOT_UTF8:'+id);
 const assets=new Map(),mimeExt={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/svg+xml':'svg','video/mp4':'mp4','audio/mp4':'m4a','audio/x-m4a':'m4a','audio/mpeg':'mp3','audio/aac':'aac','audio/wav':'wav'};
 let occurrences=0;
 const updated=src.replace(/data:(image\/(?:jpeg|png|webp|gif|svg\+xml)|video\/mp4|audio\/(?:mp4|mpeg|x-m4a|aac|wav));base64,([A-Za-z0-9+/=]+)/g,(match,mime,b64)=>{
  const b=Buffer.from(b64,'base64');
  if(!b.length||b.toString('base64')!==b64)throw Error('NONCANONICAL_BASE64:'+id);
  const file=digest(b).slice(0,32)+'.'+mimeExt[mime];
  const prev=assets.get(file);
  if(prev&&!prev.bytes.equals(b))throw Error('MEDIA_DIGEST_COLLISION');
  assets.set(file,{bytes:b,mime});occurrences++;
  return './media/'+file;
 });
 const restored=updated.replace(/\.\/media\/([a-f0-9]{32}\.(?:jpg|png|webp|gif|svg|mp4|m4a|mp3|aac|wav))/g,(s,file)=>{
  const a=assets.get(file);return a?'data:'+a.mime+';base64,'+a.bytes.toString('base64'):s;
 });
 if(digest(Buffer.from(restored))!==digest(buf))throw Error('LOSSLESS_ROUNDTRIP_FAILED:'+id);
 const staged=Buffer.from(updated);
 if(staged.length>limit)throw Error('STAGED_HTML_OVER_24M:'+id);
 for(const [file,a] of assets)write('guest/catalog-assets/'+id+'/1.0.0/media/'+file,a.bytes);
 return{staged,mediaCount:assets.size,occurrences,sourceSha256:digest(buf)};
}
const designs=[];
for(let i=0;i<ids.length;i++){
 const id=ids[i],rel='guest/catalog-assets/'+id+'/1.0.0/index.html';
 const src=exact(rel),part=split(src,id);
 write(rel,part.staged);
 const skin=JSON.parse(fs.readFileSync(path.join(root,'guest/templates',id,'skin.json'),'utf8'));
 if(skin.id!==id||skin.displayName!==names[i])throw Error('SKIN_NAME_OR_ID_MISMATCH:'+id);
 designs.push({id,name:names[i],version:'1.0.0',status:'TEST_ONLY_NOT_SALE_APPROVED',originalSha256:part.sourceSha256,originalBytes:src.length,stagedSha256:digest(part.staged),stagedBytes:part.staged.length,mediaCount:part.mediaCount,occurrences:part.occurrences,href:'/'+rel});
}
const cards=designs.map(d=>'<li><a href="'+d.href+'">'+d.id+' — '+d.name+'</a></li>').join('');
const index='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>GUEST · Revisión interna de diseños</title><style>body{font:16px/1.5 system-ui;margin:0;background:#f7f2ed;color:#352b27}main{max-width:740px;padding:24px;margin:auto}h1{font:400 2.5rem Georgia}li{list-style:none;margin:9px 0;background:white;border:1px solid #e1dad4;border-radius:12px;padding:14px}ul{padding:0}a{color:inherit;text-decoration:none}</style></head><body><main><h1>Archivo de diseños</h1><p><strong>PREPRODUCCIÓN · NO APROBADO PARA VENTA NI ENVÍO A CLIENTES</strong>. Estas son muestras de diseño recuperadas, no invitaciones finales de un pedido.</p><ul>'+cards+'</ul></main></body></html>';
write('guest/qa/claude-designs-review.html',Buffer.from(index));
const manifest={schemaVersion:'guest-claude-review-precommercial-v1',date:'2026-10-20',status:'PREPRODUCTION_DO_NOT_SELL',approvedForSale:false,sourceCommit:'5b1e418b11c4af0a0b7753963b7079f897016f8d',designs,files:files.sort((a,b)=>a.path.localeCompare(b.path)),totalBytes:total};
fs.writeFileSync(path.join(out,'GUEST_DESIGN_STAGE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('PASS TEST-ONLY 13 CLAUDE DESIGNS',files.length,'ASSETS',total,'BYTES');
