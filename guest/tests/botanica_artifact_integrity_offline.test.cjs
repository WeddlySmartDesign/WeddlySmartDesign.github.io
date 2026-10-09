'use strict';
// Independent source/media integrity check for GUEST D02. No network, no deployment.
// Usage: node guest/tests/botanica_artifact_integrity_offline.test.cjs <V14 frozen.html> <V14.5 candidate.html>
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const [frozenPath,candidatePath]=process.argv.slice(2);
if(!frozenPath||!candidatePath){console.error('Usage: node botanica_artifact_integrity_offline.test.cjs <V14 frozen.html> <V14.5 candidate.html>');process.exit(2)}
const hash = bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const expected={frozen:'27ede39dbf1e04dc7ee8e758601127eaf9de6e705f1f14a026df09fb72795c39',candidate:'ba8b6515e5bb2ba81c3ea3dbd88199b4a3abc66919caefa1e3d37ced8ce61e84'};
const files=[frozenPath,candidatePath].map(p=>({path:path.resolve(p),bytes:fs.readFileSync(p)}));
assert.equal(hash(files[0].bytes),expected.frozen,'Visual master V14 has changed');
assert.equal(hash(files[1].bytes),expected.candidate,'QA candidate V14.5 has changed');
console.log('PASS: frozen and candidate SHA256 match archived manifest');
const media = bytes=>[...bytes.toString('utf8').matchAll(/data:(video\/mp4|image\/webp);base64,([A-Za-z0-9+/=]+)/g)].map(m=>({type:m[1],sha:hash(Buffer.from(m[2],'base64'))}));
const a=media(files[0].bytes),b=media(files[1].bytes);
assert.equal(a.filter(x=>x.type==='video/mp4').length,3,'V14 master missing embedded MP4 payload');
assert.equal(a.filter(x=>x.type==='image/webp').length,14,'V14 master missing embedded WebP payload');
assert.deepEqual(b,a,'Candidate multimedia differs from the frozen V14');
console.log('PASS: 3 MP4 + 14 WebP embedded resources match bit-for-bit');
const source=files[1].bytes.toString('utf8');
assert.match(source,/BOTANICA_APPLY_CONFIG/,'Candidate missing common renderer entry');
console.log('PASS: D02 renderer interface is present');
console.log('RESULT: 3 offline integrity gates PASS; no publication or E2E certification implied');