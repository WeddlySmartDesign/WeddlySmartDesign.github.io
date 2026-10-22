#!/usr/bin/env node
'use strict';
/** VEIL LIGHT (público: «Seda») · arreglo de portada bloqueada, 22/10/2026.
 * Problema visto en móviles reales: el cuerpo solo se desbloqueaba cuando el vídeo de entrada
 * llegaba a 4,96 s. Con vídeo lento o en pausa, la invitación se quedaba congelada o saltaba
 * a mitad de página (lugar) sin poder desplazarse.
 * Arreglo (validado por la propietaria en la web de venta, ronda 5 del 21/10/2026):
 *  1. bloqueo real también en <html> y en gestos táctiles mientras está cerrada;
 *  2. cualquier toque o intento de desplazar en la portada cerrada la abre desde el principio;
 *  3. si el vídeo no se reproduce en 1,8 s se abre sin animación; tope absoluto 6,5 s.
 * El máster de VEIL no está en Git (paquete de Biblioteca). Uso, siempre sobre una COPIA:
 *   node guest/tools/patch_veil_unlock_2026_10_22.cjs /abs/copia/index.html
 * Falla sin escribir si algún anclaje no aparece exactamente una vez. Idempotente.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const MARK='/* Mientras está cerrada, cualquier toque o intento de desplazar abre la invitación desde la portada */';
const PATCHES=[
 ['body.lock{overflow:hidden}',
  'body.lock{overflow:hidden;touch-action:none;overscroll-behavior:none} html:has(body.lock){overflow:hidden}'],
 [" entry.addEventListener('ended',()=>{entry.currentTime=CLEAN_VEIL_START;entry.play().catch(()=>{})});\n $('#openBtn').onclick=()=>{",
  " entry.addEventListener('ended',()=>{entry.currentTime=CLEAN_VEIL_START;entry.play().catch(()=>{})});\n "+MARK+"\n"+
  " cover.addEventListener('click',e=>{if(!started&&e.target!==$('#openBtn'))$('#openBtn').click()});\n"+
  " window.addEventListener('touchmove',e=>{if(!started){e.preventDefault();$('#openBtn').click()}},{passive:false});\n"+
  " window.addEventListener('scroll',()=>{if(document.body.classList.contains('lock')&&window.scrollY>0)window.scrollTo(0,0)},{passive:true});\n"+
  " $('#openBtn').onclick=()=>{"],
 ["   setTimeout(()=>entry.play().catch(()=>{}),230);\n };",
  "   setTimeout(()=>entry.play().catch(()=>{}),230);\n"+
  "    /* Si el vídeo aún no puede reproducirse, se abre sin esperar a la animación */\n"+
  "    const openNow=()=>{if(heroShown)return;heroShown=true;cover.classList.add('hero-ready','opening-complete');document.body.classList.remove('lock')};\n"+
  "    setTimeout(()=>{if(entry.readyState<3||entry.paused)openNow()},1800);\n"+
  "    setTimeout(openNow,6500);\n };"]
];
function patchVeilUnlock(html){
 if(html.includes(MARK))return {html,changed:false};
 for(const [from] of PATCHES){
  const n=html.split(from).length-1;
  if(n!==1)throw Error('VEIL_UNLOCK_ANCHOR_'+(n?'AMBIGUOUS':'MISSING')+': '+from.slice(0,60));
 }
 for(const [from,to] of PATCHES)html=html.replace(from,()=>to);
 return {html,changed:true};
}
module.exports={patchVeilUnlock,MARK};
if(require.main===module){
 const file=process.argv[2];
 if(!file||!path.isAbsolute(file))throw Error('ABSOLUTE_INDEX_HTML_REQUIRED');
 if(/catalog-assets\/veil-light\//.test(file.replace(/\\/g,'/'))&&!process.argv.includes('--allow-catalog-path'))
  throw Error('WORK_ON_A_COPY: pass --allow-catalog-path only for a new pinned version folder');
 const before=fs.readFileSync(file,'utf8');
 const {html,changed}=patchVeilUnlock(before);
 if(changed)fs.writeFileSync(file,html);
 const sha=crypto.createHash('sha256').update(html).digest('hex');
 console.log((changed?'PATCHED':'ALREADY_PATCHED')+' '+file+' sha256='+sha);
}
