'use strict';
// Usage: node guest/tests/botanica_artifact_integrity_offline.test.cjs <V14-frozen.html> <V14.5.html> [<V14.6.html>] [<V14.7.html>]
// Offline only: no browser, account, deployed API, network, or data mutation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const [frozen,v145,v146,v147]=process.argv.slice(2);
if(!frozen||!v145){
 console.error('Usage: node botanica_artifact_integrity_offline.test.cjs <V14> <V14.5> [<V14.6>]');process.exit(2);
}
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const expected={
  'V14':'27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39',
  'V14.5':'ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84',
  'V14.6':'35d0caf0a2ef716a51b7d5cdfd451ebc5ad5ae60bb9ad56aee4ed9c692820c85',
  'V14.7':'fffd3e0fcd5eb2f0d2f4582957b5fdd7358294cbc509ecb3ca15f0089098ec7a'
};
const input=[['V14',frozen],['V14.5',v145],...(v146?[['V14.6',v146]]:[]),...(v147?[['V14.7',v147]]:[])];
const htmls=new Map();
for(const [ver,file] of input){const bytes=fs.readFileSync(file);assert.equal(hash(bytes),expected[ver],ver+' SHA256 changed');htmls.set(ver,bytes.toString('utf8'));}
console.log('PASS: '+input.length+' immutable artifact hashes');
const media=s=>[...s.matchAll(/data:(video\/mp4|image\/webp);base64,([A-Za-z0-9+/=]+)/g)]
 .map(m=>({type:m[1],sha:hash(Buffer.from(m[2],'base64'))}));
const baseline=media(htmls.get('V14'));
assert.equal(baseline.filter(x=>x.type==='video/mp4').length,3,'Missing 3 MP4');
assert.equal(baseline.filter(x=>x.type==='image/webp').length,14,'Missing 14 WebP');
for(const [version,s] of htmls)assert.deepEqual(media(s),baseline,'Media drift in '+version);
console.log('PASS: 3 MP4 + 14 WebP are bit-identical across versions');
for(const [version,s] of htmls)assert.match(s,/BOTANICA_APPLY_CONFIG/,'Renderer missing in '+version);
console.log('PASS: common renderer interface present');
if(v146){
 const original="result.storyEnabled=input.story.enabled && input.story.textMode!=='none';";
 const corrected="result.storyEnabled=input.story.enabled && (input.story.textMode!=='none'||!!(input.story.photo?.src||input.cover.photo?.src));";
 assert.equal(htmls.get('V14.5').split(original).length-1,1,'Original condition not unique');
 assert.equal(htmls.get('V14.5').replace(original,corrected),htmls.get('V14.6'),'Unexpected changes between V14.5 and V14.6');
 console.log('PASS: V14.6 differs by photo-only visibility condition and nothing else');
}
if(v147){
 assert(v146,'V14.6 required to verify V14.7 delta');
 const a='const storyOn=CONF.storyEnabled!==false;';
 const b="const storyOn=CONF.storyEnabled!==false && !!String(CONF.copy?.story||'').trim();";
 const c="if(storyOn){$('storyTitle').textContent=CONF.copy.storyTitle;$('storyCopy').textContent=CONF.copy.story;}";
 const d="if(storyOn){$('storyTitle').textContent=CONF.copy.storyTitle;$('storyCopy').textContent=CONF.copy.story;}else{$('storyTitle').textContent='';$('storyCopy').textContent='';}";
 let html=htmls.get('V14.6');
 assert.equal(html.split(a).length-1,1,'V14.6 story condition not unique');
 assert.equal(html.split(c).length-1,1,'V14.6 copy condition not unique');
 html=html.replace(a,b).replace(c,d);
 assert.equal(html,htmls.get('V14.7'),'Unexpected edits from V14.6 to V14.7');
 console.log('PASS: V14.7 changes exactly two conditional lines; no visual/code drift elsewhere');
}
console.log('RESULT '+(v147?'5':v146?'4':'3')+' artifact gates PASS (E2E and Android remain pending)');