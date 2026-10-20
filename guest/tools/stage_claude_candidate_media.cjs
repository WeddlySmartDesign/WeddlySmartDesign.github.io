#!/usr/bin/env node
'use strict';
/**
 * GUEST candidate asset packager — PREPRODUCTION ONLY.
 *
 * Replaces embedded base64 media in the recovered Claude masters with byte-identical
 * SHA256-pinned files. NEVER edits the originals or publishes the resulting files.
 *
 * Usage:
 *   node guest/tools/stage_claude_candidate_media.cjs --out /tmp/guest-skins-stage
 *   node guest/tools/stage_claude_candidate_media.cjs --self-test
 *
 * The 13 candidates MUST remain certification-pending / TEST only. Cloudflare
 * deployment, checkout, visual approval, third-party font/music licenses, real
 * phone tests and Stripe remain separate gates.
 */
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');

const repo=path.resolve(__dirname,'../..');
const args=process.argv.slice(2);
const arg=k=>{const i=args.indexOf(k);return i<0?null:args[i+1]};
const SHA=b=>crypto.createHash('sha256').update(b).digest('hex');
const BLOB=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const LIMIT=25*1024*1024;
const mimeExt={
 'image/jpeg':'jpg','image/jpg':'jpg','image/png':'png','image/webp':'webp',
 'image/gif':'gif','image/avif':'avif','image/svg+xml':'svg',
 'video/mp4':'mp4','video/webm':'webm','audio/mpeg':'mp3',
 'audio/mp4':'m4a','audio/ogg':'ogg','audio/wav':'wav',
 'font/ttf':'ttf','font/woff':'woff','font/woff2':'woff2',
 'font/otf':'otf','application/font-woff':'woff',
 'application/octet-stream':'bin'
};
function fail(reason){throw new Error('GUEST candidate stage: '+reason)}
function parse(file){return JSON.parse(fs.readFileSync(path.join(repo,file),'utf8'))}
function entries(){
 const first=parse('guest/GUEST_CLAUDE_SOURCE_IMPORT_MANIFEST_2026-10-20.json');
 const second=parse('guest/GUEST_CLAUDE_D10_D16_IMPORT_MANIFEST_2026-10-20.json');
 const ids=[...first.selectedCandidateIds,...second.designs.map(x=>x.id)];
 if(ids.length!==13||new Set(ids).size!==13||ids.includes('design-03'))fail('unsafe candidate inventory');
 const all=[...first.files,...second.files],out=[];
 for(const id of ids){
  const f=all.find(x=>x.path==='guest/catalog-assets/'+id+'/1.0.0/index.html');
  if(!f||!f.gitBlobSha1||!Number.isInteger(f.bytes))fail('master manifest missing '+id);
  out.push({id,...f});
 }
 return out;
}
function decode64(str){
 if(str.length%4===1||!/^[A-Za-z0-9+/]+={0,2}$/.test(str))fail('invalid base64 media');
 const buffer=Buffer.from(str,'base64');
 if(buffer.toString('base64')!==str)fail('noncanonical base64 media');
 return buffer;
}
function unpack(html,folder){
 const assets=new Map(),mediaFiles=[];
 // All recovered skin engine data URIs use the exact "data:MIME;base64," form.
 const replaced=html.replace(/data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/]+={0,2})/gi,(raw,mime,value)=>{
  const type=mime.toLowerCase(),ext=mimeExt[type];
  if(!ext)fail('unhandled embedded media '+type);
  const bytes=decode64(value),hash=SHA(bytes);
  const filename='media/'+hash+'.'+ext;
  if(!assets.has(filename)){
   if(bytes.length>LIMIT)fail('single media file over 25 MiB: '+filename);
   assets.set(filename,{bytes,hash,type});
  }else if(!assets.get(filename).bytes.equals(bytes))fail('SHA collision');
  return filename;
 });
 if(!assets.size)fail('expected base64 media but found none');
 if(/data:[a-z0-9.+-]+\/[a-z0-9.+-]+;base64,/i.test(replaced))fail('media remained embedded');
 fs.mkdirSync(path.join(folder,'media'),{recursive:true});
 for(const [filename,{bytes,hash,type}] of assets){
  const target=path.join(folder,filename);
  fs.writeFileSync(target,bytes,{flag:'wx'});
  if(SHA(fs.readFileSync(target))!==hash)fail('written asset mismatch '+filename);
  mediaFiles.push({path:filename,bytes:bytes.length,sha256:hash,mime:type});
 }
 const htmlBytes=Buffer.from(replaced,'utf8');
 if(htmlBytes.length>LIMIT)fail('HTML still exceeds 25 MiB: '+htmlBytes.length);
 const output=path.join(folder,'index.html');
 fs.writeFileSync(output,htmlBytes,{flag:'wx'});
 if(SHA(fs.readFileSync(output))!==SHA(htmlBytes))fail('staged HTML integrity');
 if(!replaced.includes('GUEST_APPLY_CONFIG')||!replaced.includes('</body>'))fail('renderer contract lost');
 return {htmlBytes:htmlBytes.length,htmlSha256:SHA(htmlBytes),embeddingsReplaced:(html.match(/data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+);base64,/gi)||[]).length,uniqueMedia:mediaFiles.length,mediaBytes:mediaFiles.reduce((sum,x)=>sum+x.bytes,0),mediaFiles};
}
function selfTest(){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-extract-selftest-'));
 try{
  const b=Buffer.from('example test bytes, do not publish');
  const input='<html><body><script>var x="data:image/png;base64,'+b.toString('base64')+'";</script><img src="data:image/png;base64,'+b.toString('base64')+'"><script>function GUEST_APPLY_CONFIG(){}</script></body></html>';
  const r=unpack(input,tmp);
  const rewritten=fs.readFileSync(path.join(tmp,'index.html'),'utf8');
  if(r.embeddingsReplaced!==2||r.uniqueMedia!==1||rewritten.includes('data:image/png;base64,')||!fs.readFileSync(path.join(tmp,r.mediaFiles[0].path)).equals(b))fail('self-test did not preserve bytes');
  console.log('PASS GUEST extraction / 2 replacements / 1 identical original media');
 }finally{fs.rmSync(tmp,{recursive:true,force:true})}
}
function main(){
 if(args.includes('--self-test'))return selfTest();
 const dest=arg('--out');
 if(!dest)fail('required --out DIR (unpublished staging directory)');
 const root=path.resolve(dest);
 if(root===repo||root.startsWith(repo+path.sep))fail('staged assets must not be written inside repository/public tree');
 if(fs.existsSync(root))fail('output already exists; refusing to overwrite');
 fs.mkdirSync(root,{recursive:true});
 const report={schemaVersion:'guest-staged-media-report-v1',designs:[],publishAuthorized:false,salesAuthorized:false,sourceUnchanged:true};
 try{
  for(const entry of entries()){
   const f=path.join(repo,entry.path),buf=fs.readFileSync(f);
   if(buf.length!==entry.bytes||BLOB(buf)!==entry.gitBlobSha1)fail('original Git SHA/bytes mismatch '+entry.id);
   const input=buf.toString('utf8');
   if(Buffer.byteLength(input)!==buf.length)fail('non UTF-8 master '+entry.id);
   const out=path.join(root,entry.id);
   const data=unpack(input,out);
   report.designs.push({id:entry.id,originalBytes:buf.length,originalGitBlobSha1:entry.gitBlobSha1,originalSha256:SHA(buf),...data});
  }
  if(report.designs.length!==13)fail('missing packaged design');
  fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({ok:true,preproductionOnly:true,notPublished:true,templates:report.designs.map(x=>({id:x.id,sourceBytes:x.originalBytes,htmlBytes:x.htmlBytes,media:x.uniqueMedia,maxMediaBytes:Math.max(...x.mediaFiles.map(m=>m.bytes))})),output:root},null,2));
 }catch(err){fs.rmSync(root,{recursive:true,force:true});throw err}
}
main();
