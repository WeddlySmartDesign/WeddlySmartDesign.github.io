const fs=require('fs');
const assert=(ok,msg)=>{if(!ok){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)};
const read=p=>fs.readFileSync(p,'utf8');
const css=read('guest/guests-essential-premium-v2.css');

assert(/\.cover-sub\{font-size:clamp\(14px/.test(css),'cover subtitle >= 14px');
assert(/\.cover-datevenue\{font-size:clamp\(14px/.test(css),'cover date/venue >= 14px');
assert(/\.historia-text\{font-size:clamp\(17px/.test(css),'story copy >= 17px');
assert(/\.agenda-row\{[\s\S]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/.test(css),'agenda reflows to 2-column mobile grid');
assert(/\.agenda-title\{font-size:20px!important/.test(css),'agenda title >= 20px');
assert(/\.agenda-place\{font-size:13px!important/.test(css),'agenda place >= 13px');
assert(/\.agenda-sep\{display:none!important/.test(css),'compressed horizontal agenda separators removed');
assert(/essential-05 \.cover-content\{padding-top:28%!important;padding-bottom:16%!important/.test(css),'Essential 05 excessive cover whitespace removed');

const shapes=[
 ['02','48% 48% 14px 14px'],
 ['03','120px 120px 8px 8px'],
 ['04','8px 86px 8px 86px'],
 ['05','4px 56px 4px 56px'],
 ['06','112px 112px 10px 10px']
];
for(const [id,radius] of shapes){
 assert(css.includes('body.essential-'+id+' .cover-photo-wrap')&&css.includes('border-radius:'+radius+'!important'),
   'Essential '+id+' has model-specific non-generic photo geometry');
}

for(let n=1;n<=6;n++){
 const id=String(n).padStart(2,'0');
 const html=read('guest/guests-rsvp-essential-'+id+'.html');
 assert(html.includes('guests-essential-premium-v2.css?v=20261001b'),'Essential '+id+' loads current premium CSS');
 assert(html.includes('essential-premium essential-'+id),'Essential '+id+' has scoped model class');
}

const customizer=read('guest/weddly-personalizacion-essential.html');
assert(customizer.includes("premiumClass = 'essential-premium '"),'customizer preview applies scoped premium model class');
assert(customizer.includes('guests-essential-premium-v2.css?v=20261001b'),'customizer preview shares delivered invitation CSS');

if(process.exitCode) process.exit(process.exitCode);
console.log('Essential visual contract static gate passed.');
