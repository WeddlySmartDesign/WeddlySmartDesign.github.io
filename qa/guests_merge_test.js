'use strict';
const MISSING=Symbol('missing');
const clone=v=>v===MISSING?MISSING:(v===undefined?undefined:structuredClone(v));
const obj=v=>v!==MISSING&&v&&typeof v==='object'&&!Array.isArray(v);
const eq=(a,b)=>{if(a===MISSING||b===MISSING)return a===b;try{return JSON.stringify(a)===JSON.stringify(b)}catch{return a===b}};
function merge3(base,local,remote,path='',conflicts=[]){
  if(eq(local,base))return clone(remote);
  if(eq(remote,base))return clone(local);
  if(eq(local,remote))return clone(local);
  if((base===MISSING||obj(base))&&(local===MISSING||obj(local))&&(remote===MISSING||obj(remote))&&(obj(base)||obj(local)||obj(remote))){
    const out={},keys=new Set([...Object.keys(obj(base)?base:{}),...Object.keys(obj(local)?local:{}),...Object.keys(obj(remote)?remote:{})]);
    for(const k of keys){
      const bv=obj(base)&&Object.prototype.hasOwnProperty.call(base,k)?base[k]:MISSING;
      const lv=obj(local)&&Object.prototype.hasOwnProperty.call(local,k)?local[k]:MISSING;
      const rv=obj(remote)&&Object.prototype.hasOwnProperty.call(remote,k)?remote[k]:MISSING;
      const mv=merge3(bv,lv,rv,path?path+'.'+k:k,conflicts);if(mv!==MISSING)out[k]=mv;
    }
    return out;
  }
  conflicts.push(path||'$');return clone(local);
}
function assert(x,m){if(!x)throw new Error(m)}
const base={guests:{a:{table:'Mesa 1',meal:'A'},b:{table:'',meal:'B'}},tables:{t1:{cap:8}},meta:{couple:['A','B']}};
{
  const local=structuredClone(base),remote=structuredClone(base),conflicts=[];
  local.guests.a.table='Mesa 2';remote.guests.b.meal='Vegano';
  const merged=merge3(base,local,remote,'',conflicts);
  assert(merged.guests.a.table==='Mesa 2','local guest change was lost');
  assert(merged.guests.b.meal==='Vegano','remote guest change was lost');
  assert(conflicts.length===0,'non-conflicting edits were flagged as conflict');
}
{
  const local=structuredClone(base),remote=structuredClone(base),conflicts=[];
  local.guests.a.table='Mesa 2';remote.guests.a.table='Mesa 3';
  const merged=merge3(base,local,remote,'',conflicts);
  assert(merged.guests.a.table==='Mesa 2','same-field conflict rule must preserve current-device edit');
  assert(conflicts.includes('guests.a.table'),'same-field conflict was not recorded');
}
{
  const local=structuredClone(base),remote=structuredClone(base),conflicts=[];
  delete local.guests.a;remote.tables.t1.cap=10;
  const merged=merge3(base,local,remote,'',conflicts);
  assert(!('a' in merged.guests),'local deletion was lost');
  assert(merged.tables.t1.cap===10,'remote unrelated table change was lost');
}
{
  const local=structuredClone(base),remote=structuredClone(base),conflicts=[];
  local.guests.c={table:'',meal:'Pendiente'};remote.guests.d={table:'Mesa 4',meal:'Estándar'};
  const merged=merge3(base,local,remote,'',conflicts);
  assert(merged.guests.c&&merged.guests.d,'concurrent additions were not both preserved');
}
console.log('Guests three-way merge regression suite: PASS');
