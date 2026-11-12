(()=>{
'use strict';
// TEMPORAL: registra quién reescribe la lista de invitados quitando personas. No publicar.
const KEY='weddly_guests_qa_v67',LOGK='wsd_diag_log';
const ids=v=>{try{return Object.keys(JSON.parse(v||'null')?.guests||{})}catch{return null}};
function log(m){try{const a=JSON.parse(sessionStorage.getItem(LOGK)||'[]');a.push(new Date().toISOString().slice(11,23)+' '+m);sessionStorage.setItem(LOGK,JSON.stringify(a.slice(-30)));render()}catch{}}
function wrap(win,label){
  try{const P=win.Storage.prototype;if(P.__wsdDiag)return;P.__wsdDiag=1;const orig=P.setItem;
    P.setItem=function(k,v){
      if(String(k)===KEY&&this===win.localStorage){
        const before=ids(win.localStorage.getItem(KEY)),after=ids(String(v));
        if(before&&after){const lost=before.filter(x=>!after.includes(x)),gain=after.filter(x=>!before.includes(x));
          if(lost.length||gain.length){let s='';try{s=(new Error().stack||'').split('\n').slice(2,5).map(x=>x.replace(/https?:\/\/[^/]+\//,'').trim().slice(0,70)).join(' < ')}catch{}
            log(label+' guests '+before.length+'->'+after.length+(lost.length?' PIERDE '+lost.join(','):'')+' | '+s)}}}
      return orig.call(this,k,v)}}catch{}
}
function scan(win,depth,label){if(!win||depth>4)return;wrap(win,label);try{for(let i=0;i<win.frames.length;i++)scan(win.frames[i],depth+1,label+'>'+(win.frames[i].location.pathname.split('/').pop()||'f'+i).slice(0,24))}catch{}}
let box;
function render(){try{if(!box){box=document.createElement('pre');box.style.cssText='position:fixed;left:0;right:0;bottom:0;max-height:38vh;overflow:auto;margin:0;padding:6px;background:#000c;color:#9f9;font:10px/1.3 monospace;z-index:2147483647;white-space:pre-wrap;pointer-events:none';document.documentElement.appendChild(box)}
  box.textContent='DIAG\n'+JSON.parse(sessionStorage.getItem(LOGK)||'[]').join('\n')}catch{}}
scan(window,0,'outer');setInterval(()=>scan(window,0,'outer'),300);
const of=window.fetch;window.fetch=function(i,n){try{const u=typeof i==='string'?i:i?.url||'';if(u.includes('guest-state')&&n?.method==='PUT'){const b=JSON.parse(n.body);log('PUT v'+b.version+' guests='+Object.keys(b.state?.guests||{}).length)}else if(u.includes('guest-state')){return of.call(this,i,n).then(r=>{r.clone().json().then(x=>log('GET v'+x.version+' guests='+Object.keys(x.state?.guests||{}).length)).catch(()=>{});return r})}}catch{}return of.call(this,i,n)};
log('diag activo');render();
})();
