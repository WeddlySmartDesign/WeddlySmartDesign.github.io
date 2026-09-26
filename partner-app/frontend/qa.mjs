import { readFile } from "node:fs/promises";

const files={
  html:await readFile(new URL("./index.html",import.meta.url),"utf8"),
  demo:await readFile(new URL("./demo.html",import.meta.url),"utf8"),
  manifest:JSON.parse(await readFile(new URL("./manifest.webmanifest",import.meta.url),"utf8")),
  sw:await readFile(new URL("./sw.js",import.meta.url),"utf8"),
  server:await readFile(new URL("./server.mjs",import.meta.url),"utf8")
};

const failures=[];
const assert=(ok,msg)=>{if(!ok)failures.push(msg)};

assert(files.html.includes("ONE Partner"),"Missing ONE Partner identity");
assert(files.html.includes("WeddlySmartDesign"),"Missing WeddlySmartDesign identity");
assert(!files.html.includes("WEDDLYSMARTDESIGN"),"Brand casing regression");
assert(files.html.includes('class="byBrand">by WeddlySmartDesign</span>'),"Public signature must be exactly by WeddlySmartDesign");
assert(files.html.includes('font-family:"Caveat",cursive'),"by WeddlySmartDesign must use Caveat");
assert(files.html.includes("partner_end_relationship"),"Client offboarding flow missing");
assert(files.html.includes("partner_archived_weddings"),"Finalized weddings archive missing");
assert(files.html.includes("partner_register_document"),"Professional document upload missing");
assert(files.html.includes("one-partner-documents"),"Private Partner document bucket missing");
assert(files.html.includes('href="/demo.html"'),"Full demo link missing from sign-in");
for(const marker of ["Hoy","Conformidad profesional","Cierres profesionales","Listados vinculados","Entregas a proveedores","Decisiones confirmadas","Contactos operativos","Responsabilidades compartidas","Documentos profesionales","Dar de baja esta pareja","Finalizadas"]){
  assert(files.demo.includes(marker),"Demo missing: "+marker);
}
assert(files.demo.includes("Vista previa de ONE Partner · datos ficticios"),"Demo must be clearly marked as fictitious");
assert(!files.html.includes("weddly_shared_wedding_token"),"Professional frontend must never read the ONE couple member token");
assert(!files.html.includes("weddly_pro_v7"),"Professional frontend must not reuse ONE Payments storage");
assert(!files.html.includes("weddly_guests_qa_v67"),"Professional frontend must not reuse ONE Guests storage");
assert(!files.html.includes("/app.html"),"Professional frontend must not navigate into ONE shell");
assert(!files.html.includes("/one.html"),"Professional frontend must not depend on ONE commercial web");
assert(files.html.includes("https://weddlysmartdesign.github.io/partner-access.html?r="),"Couple authorization must use isolated partner-access surface");

assert(files.html.includes('rel="manifest" href="/manifest.webmanifest"'),"Manifest link missing");
assert(files.html.includes("serviceWorker.register('/sw.js')"),"Service worker registration missing");
assert(files.manifest.display==="standalone","PWA display must remain standalone");
assert(files.manifest.start_url==="/"&&files.manifest.scope==="/","PWA scope/start_url regression");

assert(files.sw.includes('url.origin!==self.location.origin'),"Service worker must ignore cross-origin traffic");
assert(!files.sw.includes("supabase.co"),"Service worker must not cache Supabase traffic");
assert(!files.sw.includes("partner_wedding"),"Service worker must not contain Partner data/API caching logic");

for(const required of [
  "Content-Security-Policy","X-Content-Type-Options","X-Frame-Options",
  "Permissions-Policy","Cross-Origin-Opener-Policy","Strict-Transport-Security"
]) assert(files.server.includes(required),"Missing security header: "+required);
assert(files.server.includes("frame-ancestors 'none'"),"CSP must block framing");
assert(files.server.includes("connect-src https://dnjsxequwgtyyauuofxj.supabase.co"),"CSP connect-src must remain restricted to Supabase");
assert(files.server.includes("https://fonts.googleapis.com"),"CSP must explicitly allow Caveat stylesheet only");
assert(files.server.includes("https://fonts.gstatic.com"),"CSP must explicitly allow Caveat font files");

const moduleMatch=files.html.match(/<script type="module">([\s\S]*?)<\/script>/);
assert(!!moduleMatch,"Module script missing");
if(moduleMatch){
  const body=moduleMatch[1].replace(/^\s*import\s+[^;]+;\s*/m,"");
  try{new Function("return (async()=>{"+body+"})")}catch(e){failures.push("Frontend JavaScript syntax error: "+e.message)}
}

const ids=[...files.html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
assert(duplicates.length===0,"Duplicate static IDs: "+duplicates.join(", "));

if(failures.length){
  console.error("ONE Partner QA FAILED");
  failures.forEach(x=>console.error("- "+x));
  process.exit(1);
}
console.log("ONE Partner QA OK");
