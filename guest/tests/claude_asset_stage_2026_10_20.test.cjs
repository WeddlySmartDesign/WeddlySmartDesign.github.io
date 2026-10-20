'use strict';
/** Preproduction packaging QA only; generated assets are deleted, never deployed. */
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const tool='guest/tools/stage_claude_candidate_media.cjs';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'guest-qa-media-'));
const out=path.join(tmp,'unpublished');
const run=argv=>execFileSync(process.execPath,[tool,...argv],{cwd:path.resolve(__dirname,'../..'),encoding:'utf8',timeout:180000,maxBuffer:1024*1024*4});
try{
 assert.match(run(['--self-test']),/PASS GUEST extraction/);
 const result=JSON.parse(run(['--out',out]));
 assert.equal(result.ok,true);
 assert.equal(result.notPublished,true);
 assert.equal(result.templates.length,13);
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));
 assert.equal(manifest.publishAuthorized,false);
 assert.equal(manifest.salesAuthorized,false);
 assert.equal(manifest.sourceUnchanged,true);
 assert.equal(manifest.designs.length,13);
 assert(!manifest.designs.some(d=>d.id==='design-03'),'Historical Limoneros accidentally included');
 for(const d of manifest.designs){
  assert.match(d.id,/^design-(0[4-9]|1[0-6])$/);
  assert(d.embeddingsReplaced>0,'No media split '+d.id);
  assert(d.uniqueMedia>0,'No staged media '+d.id);
  assert(d.htmlBytes<25*1024*1024,'Unsafe oversize HTML '+d.id);
  assert.equal(d.mediaFiles.length,d.uniqueMedia);
  const dir=path.join(out,d.id);
  assert(fs.existsSync(path.join(dir,'index.html')));
  const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  assert(html.includes('GUEST_APPLY_CONFIG'),'Renderer API missing '+d.id);
  for(const media of d.mediaFiles){
   const target=path.join(dir,media.path);
   assert(fs.existsSync(target),'Missing staged resource '+d.id+'/'+media.path);
   assert(fs.statSync(target).size<=25*1024*1024,'Oversize resource '+target);
   assert(html.includes(media.path),'Orphan extracted media '+media.path);
  }
 }
 assert(manifest.designs.some(d=>d.id==='design-04'&&d.originalBytes>25*1024*1024));
 assert(manifest.designs.some(d=>d.id==='design-07'&&d.originalBytes>25*1024*1024));
 console.log('PASS 13 Claude candidates packed with original Git SHAs, no file >25MiB, no code/master mutation, no sale/publication');
}finally{
 fs.rmSync(tmp,{recursive:true,force:true});
}
