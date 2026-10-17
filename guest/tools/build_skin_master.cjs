#!/usr/bin/env node
'use strict';
/**
 * GUEST skin engine — genera el master.html autocontenido de un diseño a partir de:
 *   - el motor común de secciones guest/templates/_skin-engine/engine.html
 *   - la ficha de piel guest/templates/<id>/skin.json (colores, posiciones, tiempos)
 *   - los medios originales del diseño (vídeos de portada/cierre y fondos 4/5 pantallas)
 * Uso: node guest/tools/build_skin_master.cjs --skin guest/templates/<id>/skin.json --media <carpeta-medios> [--out master.html]
 * No toca catálogo, backend, pagos ni otros diseños. El registro sigue siendo register_visual_template.cjs.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const args=process.argv.slice(2),arg=k=>args.includes(k)?args[args.indexOf(k)+1]:null;
const skinPath=path.resolve(arg('--skin')||'');const mediaRoot=path.resolve(arg('--media')||'');
if(!fs.existsSync(skinPath))throw new Error('Missing --skin');if(!fs.existsSync(mediaRoot))throw new Error('Missing --media');
const skin=JSON.parse(fs.readFileSync(skinPath,'utf8'));
const engineDir=path.join(__dirname,'../templates/_skin-engine');
const out=path.resolve(arg('--out')||path.join(path.dirname(skinPath),'master.html'));
const mime={'.mp4':'video/mp4','.m4a':'audio/mp4','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.woff':'font/woff','.otf':'font/otf'};
const dataUri=p=>{const ext=path.extname(p).toLowerCase();if(!mime[ext])throw new Error('Unsupported media '+p);return 'data:'+mime[ext]+';base64,'+fs.readFileSync(p).toString('base64')};
const media=rel=>{const p=path.resolve(mediaRoot,rel);if(!p.startsWith(mediaRoot+path.sep)||!fs.existsSync(p))throw new Error('Missing media '+rel);return p};
function poster(videoRel){ // primer fotograma del vídeo original, para que la portada no aparezca vacía
 const tmp=path.join(require('node:os').tmpdir(),'skin-poster-'+crypto.createHash('sha1').update(videoRel).digest('hex').slice(0,10)+'.jpg');
 execFileSync('ffmpeg',['-v','error','-y','-ss','0','-i',media(videoRel),'-frames:v','1','-q:v','3',tmp]);return dataUri(tmp)}
const v=skin.theme;const required=['paper','ink','soft','accent','line','btn','cover-bg','cover-ink','cover-names','cover-halo','cover-btn','cover-btn-ink','cover-btn-line','hint-ink','hint-halo','hint-pulse','closing-scrim','closing-ink','closing-halo','closing-btn','closing-btn-ink','closing-btn-line'];
for(const k of required)if(!v[k])throw new Error('skin.theme missing '+k);
const vars=Object.entries(v).map(([k,x])=>`--${k}:${x};`).join('');
const bg=list=>list.map(r=>JSON.stringify(dataUri(media(r)))).join(',');
let html=fs.readFileSync(path.join(engineDir,'engine.html'),'utf8').replace('/*SKINS_CSS*/',()=>fs.readFileSync(path.join(engineDir,'skins.css'),'utf8'));
// Tipografías libres (OFL / GUST) incrustadas: solo las que usa cada piel.
const FONTS={Pinyon:[['Pinyon.ttf','truetype',400,'normal']],Garamond:[['Garamond.woff','woff',400,'normal']],GaramondSC:[['GaramondSC.otf','opentype',400,'normal']],
 Chorus:[['Chorus.otf','opentype',400,'normal']],Lora:[['Lora.ttf','truetype','400 700','normal'],['Lora-Italic.ttf','truetype','400 700','italic']],
 Adventor:[['Adventor.otf','opentype',400,'normal']],Baskerville:[['Baskerville.otf','opentype',400,'normal']],
 Pagella:[['Pagella.otf','opentype',400,'normal'],['Pagella-Italic.otf','opentype',400,'italic']],Poppins:[['Poppins-Light.ttf','truetype',300,'normal'],['Poppins.ttf','truetype',400,'normal']],
 Bonum:[['Bonum.otf','opentype',400,'normal'],['Bonum-Italic.otf','opentype',400,'italic']],
 Bangers:[['Bangers-Regular.ttf','truetype',400,'normal']],Kalam:[['Kalam-Regular.ttf','truetype',400,'normal'],['Kalam-Bold.ttf','truetype',700,'normal']]};
function fontFaces(list){return [...new Set(list)].map(f=>{if(!FONTS[f])throw new Error('Unknown font '+f);return FONTS[f].map(([file,fmt,w,st])=>`@font-face{font-family:'${f}';src:url('${dataUri(path.join(engineDir,'fonts',file))}') format('${fmt}');font-weight:${w};font-style:${st};font-display:swap}`).join('\n')}).join('\n')}
const rep={
 ID:skin.id,VERSION:skin.version,NAME:skin.displayName,NAME_UPPER:skin.displayName.toUpperCase(),TAP_LABEL:skin.tapLabel||'Toca para abrir',
 THEME_VARS:vars,COVER_TEXT_POS:skin.coverTextPosition,CLOSING_TEXT_POS:skin.closingTextPosition||'bottom:max(5svh,calc(env(safe-area-inset-bottom) + 14px))',CLOSING_SCRIM:skin.closingScrimPosition||'bottom:0;height:52%;background:var(--closing-scrim)',COVER_SCRIM:skin.coverScrim,
 COVER_TEXT_AT:String(Number(skin.coverTextAt)),CLOSING_TEXT_AT:String(Number(skin.closingTextAt)),
 FONT_FACES:fontFaces(['Pinyon','Garamond','GaramondSC',...(skin.fonts||[])]),LAYOUT:skin.layout||'base',
 COVER_VIDEO:dataUri(media(skin.media.coverVideo)),COVER_POSTER:poster(skin.media.coverVideo),
 CLOSING_VIDEO:dataUri(media(skin.media.closingVideo)),CLOSING_POSTER:poster(skin.media.closingVideo),
 BG5:bg(skin.media.backgrounds5),
 MOTIF:skin.motif?dataUri(path.join(path.dirname(skinPath),skin.motif)):'',MOTIF_IDLE:skin.motifIdle||'',
 FX:JSON.stringify({...(skin.fx||{}),sprites:((skin.fx||{}).sprites||[]).map(r=>dataUri(path.join(path.dirname(skinPath),r)))}),
 DEMO_PHOTOS:JSON.stringify(Object.fromEntries(['story','venue','g1','g2','g3','g4'].map(k=>[k,dataUri(path.join(engineDir,'demo-photos',k+'.jpg'))]))),BG4:bg(skin.media.backgrounds4)};
if(skin.media.backgrounds5.length!==5||skin.media.backgrounds4.length!==4)throw new Error('Backgrounds must be 5 + 4');
// Interior propio opcional de la piel (CSS+JS) con sus recursos incrustados; solo afecta a ese diseño.
let interiorCss='',interiorJs='';
if(skin.interior){const dir=path.dirname(skinPath),A={};for(const [k,r] of Object.entries(skin.interior.assets||{}))A[k]=dataUri(path.join(dir,r));
 const sub=s=>s.replace(/%%([A-Z0-9_]+)%%/g,(m,k)=>{if(!(k in A))throw new Error('Unknown interior asset '+k);return A[k]});
 interiorCss=sub(fs.readFileSync(path.join(dir,skin.interior.css),'utf8'));interiorJs='<script>'+sub(fs.readFileSync(path.join(dir,skin.interior.js),'utf8'))+'</script>'}
html=html.replace(/\{\{([A-Z0-9_]+)\}\}/g,(m,k)=>{if(!(k in rep))throw new Error('Unknown placeholder '+k);return rep[k]});
if(/\{\{[A-Z_]+\}\}/.test(html))throw new Error('Unresolved placeholder');
html=html.replace('/*INTERIOR_CSS*/',()=>interiorCss).replace('<!--INTERIOR_JS-->',()=>interiorJs);
fs.writeFileSync(out,html);
const manifest={id:skin.id,displayName:skin.displayName,version:skin.version,rendererApi:'GUEST_APPLY_CONFIG',masterHtml:path.basename(out),typographyVariants:['classic']};
fs.writeFileSync(path.join(path.dirname(out),'visual-plugin.json'),JSON.stringify(manifest,null,2)+'\n');
// --sync-catalog: si el diseño ya está registrado y sigue certification-pending (sin pedidos), actualiza su copia de catálogo y SHA.
let synced=false;
if(args.includes('--sync-catalog')){
 const root=path.join(__dirname,'../..'),statusPath=path.join(root,'guest/GUEST_PROJECT_STATUS_V1.json'),st=JSON.parse(fs.readFileSync(statusPath,'utf8'));
 const d=st.designs[skin.id];if(!d)throw new Error('Not registered yet: use register_visual_template.cjs --apply');
 if(d.status!=='certification-pending'||d.commerciallyCertified)throw new Error('Refusing to change a certified/frozen design: '+skin.id);
 const asset=path.join(root,d.catalogAsset);fs.writeFileSync(asset,html);const h=crypto.createHash('sha256').update(html).digest('hex');
 d.visualMasterSha256=h;d.candidateSha256=h;fs.writeFileSync(statusPath,JSON.stringify(st,null,2)+'\n');synced=true}
console.log(JSON.stringify({ok:true,synced,out,bytes:fs.statSync(out).size,sha256:crypto.createHash('sha256').update(html).digest('hex')},null,1));
