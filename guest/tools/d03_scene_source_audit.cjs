#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../catalog-assets/design-03/1.0.0/index.html'),'utf8');
const compact=src.replace(/data:(?:image|video)\/[\w.+-]+;base64,[A-Za-z0-9+/=]+/g,m=>'DATA_MEDIA_REMOVED_'+m.length);
const matchAll=(re,limit=100)=>[...compact.matchAll(re)].slice(0,limit).map(m=>m[0]);
const style=compact.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1]||'';
const scripts=[...compact.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
const wanted=/(story|photo|image|gallery|location|place|venue|agenda|moment|practical|countdown|cover|typograph|font|anim|scroll|--serif|--smallcaps)/i;
const styleRows=style.split('}').filter(x=>!x.includes('@font-face')).map(x=>(x+'}').trim().slice(0,850));
const htmlTags=matchAll(/<(?:section|div|article|figure|img|picture|a|button|p|h[1-6])\b[^>]{0,280}>/gi,300).filter(x=>wanted.test(x));
const scriptFns=[];scripts.forEach((s,si)=>{const lines=s.split('\n');for(let i=0;i<lines.length;i++){if(/(?:function\s+(?:render|apply|set|update|select|sync|show)[\w]*|const\s+(?:render|apply|set|update)[\w]*\s*=|GUEST_APPLY_CONFIG|fontVariants|typographyVariant|story\.photo|location\.photo|venue\.photo)/i.test(lines[i]))scriptFns.push({script:si,line:i+1,context:lines.slice(Math.max(0,i-1),Math.min(lines.length,i+14)).join('\n').slice(0,2200)});}});
const report={generatedAt:new Date().toISOString(),sourceCharacters:src.length,reducedCharacters:compact.length,sceneTags:htmlTags.slice(0,140),cssRules:styleRows.slice(0,150),scriptFunctions:scriptFns.slice(0,95),sceneHtml:(compact.match(/<section data-scene id="story"[\\s\\S]{0,18000}/)||[])[0]?.split('<script>')[0]?.slice(0,8500),sources:{styleBytes:style.length,scriptCount:scripts.length}};
const out=path.join(__dirname,'../qa-reports/d03_scene_source_audit.json');fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log('PASS audited source, no media embedded in report',report.sourceCharacters,report.sceneTags.length,report.cssRules.length,report.scriptFunctions.length);
