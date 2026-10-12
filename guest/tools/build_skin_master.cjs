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
const mime={'.mp4':'video/mp4','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.woff':'font/woff','.otf':'font/otf'};
const dataUri=p=>{const ext=path.extname(p).toLowerCase();if(!mime[ext])throw new Error('Unsupported media '+p);return 'data:'+mime[ext]+';base64,'+fs.readFileSync(p).toString('base64')};
const media=rel=>{const p=path.resolve(mediaRoot,rel);if(!p.startsWith(mediaRoot+path.sep)||!fs.existsSync(p))throw new Error('Missing media '+rel);return p};
function poster(videoRel){ // primer fotograma del vídeo original, para que la portada no aparezca vacía
 const tmp=path.join(require('node:os').tmpdir(),'skin-poster-'+crypto.createHash('sha1').update(videoRel).digest('hex').slice(0,10)+'.jpg');
 execFileSync('ffmpeg',['-v','error','-y','-ss','0','-i',media(videoRel),'-frames:v','1','-q:v','3',tmp]);return dataUri(tmp)}
const v=skin.theme;const required=['paper','ink','soft','accent','line','btn','cover-bg','cover-ink','cover-names','cover-halo','cover-btn','cover-btn-ink','cover-btn-line','hint-ink','hint-halo','hint-pulse','closing-scrim','closing-ink','closing-halo','closing-btn','closing-btn-ink','closing-btn-line'];
for(const k of required)if(!v[k])throw new Error('skin.theme missing '+k);
const vars=Object.entries(v).map(([k,x])=>`--${k}:${x};`).join('');
const bg=list=>list.map(r=>JSON.stringify(dataUri(media(r)))).join(',');
let html=fs.readFileSync(path.join(engineDir,'engine.html'),'utf8');
const rep={
 ID:skin.id,VERSION:skin.version,NAME:skin.displayName,NAME_UPPER:skin.displayName.toUpperCase(),TAP_LABEL:skin.tapLabel||'Toca para abrir',
 THEME_VARS:vars,COVER_TEXT_POS:skin.coverTextPosition,CLOSING_TEXT_POS:skin.closingTextPosition||'bottom:max(5svh,calc(env(safe-area-inset-bottom) + 14px))',CLOSING_SCRIM:skin.closingScrimPosition||'bottom:0;height:52%;background:var(--closing-scrim)',COVER_SCRIM:skin.coverScrim,
 COVER_TEXT_AT:String(Number(skin.coverTextAt)),CLOSING_TEXT_AT:String(Number(skin.closingTextAt)),
 FONT_SCRIPT:dataUri(path.join(engineDir,'fonts/Pinyon.ttf')),FONT_SERIF:dataUri(path.join(engineDir,'fonts/Garamond.woff')),FONT_SC:dataUri(path.join(engineDir,'fonts/GaramondSC.otf')),
 COVER_VIDEO:dataUri(media(skin.media.coverVideo)),COVER_POSTER:poster(skin.media.coverVideo),
 CLOSING_VIDEO:dataUri(media(skin.media.closingVideo)),CLOSING_POSTER:poster(skin.media.closingVideo),
 BG5:bg(skin.media.backgrounds5),BG4:bg(skin.media.backgrounds4)};
if(skin.media.backgrounds5.length!==5||skin.media.backgrounds4.length!==4)throw new Error('Backgrounds must be 5 + 4');
html=html.replace(/\{\{([A-Z0-9_]+)\}\}/g,(m,k)=>{if(!(k in rep))throw new Error('Unknown placeholder '+k);return rep[k]});
if(/\{\{[A-Z_]+\}\}/.test(html))throw new Error('Unresolved placeholder');
fs.writeFileSync(out,html);
const manifest={id:skin.id,displayName:skin.displayName,version:skin.version,rendererApi:'GUEST_APPLY_CONFIG',masterHtml:path.basename(out),typographyVariants:['classic']};
fs.writeFileSync(path.join(path.dirname(out),'visual-plugin.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({ok:true,out,bytes:fs.statSync(out).size,sha256:crypto.createHash('sha256').update(html).digest('hex')},null,1));
