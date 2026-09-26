import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root=fileURLToPath(new URL(".",import.meta.url));
const port=Number(process.env.PORT||3000);

const types={
  ".html":"text/html; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",
  ".mjs":"text/javascript; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".webmanifest":"application/manifest+json; charset=utf-8",
  ".svg":"image/svg+xml; charset=utf-8",
  ".png":"image/png"
};

const csp=[
  "default-src 'none'",
  "script-src 'self' 'unsafe-inline' https://esm.sh",
  "connect-src https://dnjsxequwgtyyauuofxj.supabase.co",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data:",
  "font-src https://fonts.gstatic.com data:",
  "manifest-src 'self'",
  "worker-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join("; ");

function headers(type,cache="no-store"){
  return {
    "Content-Type":type,
    "Cache-Control":cache,
    "Content-Security-Policy":csp,
    "Referrer-Policy":"no-referrer",
    "X-Content-Type-Options":"nosniff",
    "X-Frame-Options":"DENY",
    "Permissions-Policy":"camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy":"same-origin",
    "Strict-Transport-Security":"max-age=31536000; includeSubDomains"
  };
}

http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url||"/","http://local");
    let path=decodeURIComponent(url.pathname);
    if(path==="/") path="/index.html";
    const safe=normalize(path).replace(/^([.][.][/\\])+/, "").replace(/^[/\\]+/,"");
    const file=join(root,safe);
    if(!file.startsWith(root)){res.writeHead(403,headers("text/plain; charset=utf-8"));return res.end("Forbidden")}
    const body=await readFile(file);
    const ext=extname(file).toLowerCase();
    const cache=ext===".html"?"no-store":ext===".webmanifest"||ext===".js"||ext===".mjs"||ext===".svg"?"public, max-age=300":"public, max-age=86400";
    res.writeHead(200,headers(types[ext]||"application/octet-stream",cache));
    res.end(body);
  }catch(err){
    if(err?.code==="ENOENT"){
      try{
        const body=await readFile(join(root,"index.html"));
        res.writeHead(200,headers(types[".html"],"no-store"));
        return res.end(body);
      }catch{}
    }
    res.writeHead(500,headers("text/plain; charset=utf-8"));
    res.end("ONE Partner");
  }
}).listen(port,"0.0.0.0");
