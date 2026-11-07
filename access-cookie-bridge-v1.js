(()=>{
'use strict';
const TOKEN='weddly_shared_wedding_token',COOKIE='weddly_member_access',MAX_AGE=60*60*24*30;
function valid(v){return typeof v==='string'&&v.length>=40}
function readCookie(){try{const part=document.cookie.split('; ').find(x=>x.startsWith(COOKIE+'='));return part?decodeURIComponent(part.slice(COOKIE.length+1)):''}catch{return''}}
function writeCookie(v){if(!valid(v))return;try{document.cookie=`${COOKIE}=${encodeURIComponent(v)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax; Secure`}catch{}}
function readLocal(){try{return localStorage.getItem(TOKEN)||''}catch{return''}}
function writeLocal(v){if(!valid(v))return;try{localStorage.setItem(TOKEN,v)}catch{}}
function sync(){const local=readLocal(),cookie=readCookie();if(valid(local)){if(local!==cookie)writeCookie(local);return local}if(valid(cookie)){writeLocal(cookie);return cookie}return''}
window.__WSD_ACCESS_BRIDGE={sync,remember(v){if(valid(v)){writeLocal(v);writeCookie(v)}return v},cookie:readCookie};
sync();
})();
