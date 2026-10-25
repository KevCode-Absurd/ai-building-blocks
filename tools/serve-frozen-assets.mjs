// Read-only local preview of an exact frozen Cloudflare assets directory.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
const rootArg=process.argv[2],portArg=process.argv[3]??'5195';
assert(rootArg,'Usage: node tools/serve-frozen-assets.mjs <assets-directory> [port]');
const root=await fs.realpath(path.resolve(rootArg)),port=Number(portArg);
assert(Number.isInteger(port)&&port>0&&port<65536);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.zip':'application/zip','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url??'/',`http://${req.headers.host??'127.0.0.1'}`);
  if(url.pathname.startsWith('/api/')){res.writeHead(404,{'content-type':'application/json'});res.end('{"error":"Read-only frozen assets preview"}');return;}
  let target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  assert(target===root||target.startsWith(root+path.sep),'path traversal');
  let stat=await fs.stat(target).catch(()=>null);
  if(stat?.isDirectory()){target=path.join(target,'index.html');stat=await fs.stat(target).catch(()=>null);}
  if(!stat&&!path.extname(target)){const html=await fs.stat(target+'.html').catch(()=>null);if(html){target+='.html';stat=html;}else{target=path.join(root,'index.html');stat=await fs.stat(target);}}
  if(!stat||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'content-type':types[path.extname(target).toLowerCase()]??'application/octet-stream','x-content-type-options':'nosniff'});
  if(req.method==='HEAD'){res.end();return;}
  res.end(await fs.readFile(target));
 }catch(error){res.writeHead(error?.message==='path traversal'?400:404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(JSON.stringify({status:'ready',origin:`http://127.0.0.1:${port}`,assets:root,readOnly:true})));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));
