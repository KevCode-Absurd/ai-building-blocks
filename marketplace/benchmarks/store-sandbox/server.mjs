import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store, StoreError } from './store.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.jpg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.svg':'image/svg+xml' };

export function createServer({ seed = JSON.parse(fs.readFileSync(path.join(here, 'fixture.json'))), stateDir, assetDir } = {}) {
  if (!stateDir) throw new Error('Explicit stateDir required; keep private state outside the repository.');
  const store = new Store({ seed, stateDir });
  const publicFiles = new Map([['/', 'index.html'], ['/app.js','app.js'], ['/style.css','style.css']]);
  // Only allow explicitly referenced asset basenames. Never expose the private source directory.
  const assetNames = new Set([seed.hero, seed.logo, ...(seed.products.flatMap(p => p.images || [])), 'heading.woff2','body.woff2'].filter(Boolean).filter(x => /^\/assets\/[\w.-]+$/.test(x)).map(x => x.split('/').pop()));
  for (const name of ['heading.woff2','body.woff2']) if (assetDir && fs.existsSync(path.join(assetDir, name))) assetNames.add(name);
  const server = http.createServer(async (req, res) => {
    const send = (status, data) => { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); res.end(JSON.stringify(data)); };
    res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'");
    try {
      const address = server.address(), expectedHost = `127.0.0.1:${address.port}`;
      if (req.headers.host !== expectedHost) throw new StoreError(403, 'Use the exact 127.0.0.1 loopback origin');
      const url = new URL(req.url, `http://${expectedHost}`), segments = url.pathname.split('/').filter(Boolean);
      if (req.headers.origin && req.headers.origin !== `http://${expectedHost}`) throw new StoreError(403, 'Cross-origin access rejected');
      if (req.headers['sec-fetch-site'] === 'cross-site') throw new StoreError(403, 'Cross-site access rejected');
      if (req.method === 'GET' && !url.pathname.startsWith('/api/')) {
        let file;
        if (publicFiles.has(url.pathname)) file = path.join(here, publicFiles.get(url.pathname));
        else if (segments[0] === 'assets' && segments.length === 2 && assetDir && assetNames.has(segments[1])) file = path.join(assetDir, segments[1]);
        if (!file || !fs.existsSync(file)) throw new StoreError(404, 'File not found');
        res.writeHead(200, { 'Content-Type':mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' }); fs.createReadStream(file).pipe(res); return;
      }
      if (req.method === 'GET' && url.pathname === '/api/ready') return send(200, { ready:true, provider:'local-store-sandbox', simulated:true, externalPayments:false, externalMessages:false, brand:seed.brand });
      let payload = {};
      if (!['GET','HEAD'].includes(req.method)) {
        if (!(req.headers['content-type'] || '').startsWith('application/json')) throw new StoreError(415, 'JSON required');
        let text = ''; for await (const chunk of req) { text += chunk; if (text.length > 65536) throw new StoreError(413, 'Request too large'); }
        try { payload = JSON.parse(text || '{}'); } catch { throw new StoreError(400, 'Invalid JSON'); }
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new StoreError(400, 'JSON object required');
      }
      if (req.method === 'POST' && url.pathname === '/api/datasets') return send(201, store.create());
      if (segments[0] !== 'api' || segments[1] !== 'datasets' || !segments[2]) throw new StoreError(404, 'Endpoint not found');
      const dataset = segments[2], resource = segments[3], entityId = segments[4], action = segments[5];
      const state = store.read(dataset);
      if (req.method === 'GET') {
        if (resource === 'catalog') return send(200, store.catalog(state));
        if (resource === 'state') return send(200, state);
        if (['customers','carts','reservations','orders','outbox','flows','payments','refunds','events','audit'].includes(resource)) {
          const result = entityId ? Object.hasOwn(state[resource], entityId) ? state[resource][entityId] : undefined : state[resource];
          if (!result) throw new StoreError(404, 'Record not found');
          if (resource === 'orders' && action === 'receipt') return send(200, { ...result, receiptId:`receipt_${result.id}`, paid: result.status === 'paid', simulated:true, label:'SIMULATED RECEIPT — NO MONEY MOVED' });
          return send(200, result);
        }
      }
      let operation, input = payload;
      if (req.method === 'POST') {
        if (resource === 'customers' && !entityId) operation = 'customer.create';
        if (resource === 'carts' && !entityId) operation = 'cart.create';
        if (resource === 'reservations' && !entityId) operation = 'reserve';
        if (resource === 'reservations' && action === 'cancel') { operation = 'reservation.cancel'; input = { id:entityId }; }
        if (resource === 'payments' && !entityId) operation = 'payment';
        if (resource === 'orders' && ['refund','cancel'].includes(action)) { operation = `order.${action}`; input = { id:entityId }; }
        if (resource === 'flows' && entityId === 'run') operation = 'flows.run';
        if (resource === 'clock' && entityId === 'advance') operation = 'clock.advance';
        if (resource === 'events' && !entityId) operation = 'event';
      }
      if (req.method === 'PATCH') {
        if (resource === 'customers' && entityId) { operation = 'customer.update'; input = { ...payload, id:entityId }; }
        if (resource === 'carts' && entityId) { operation = 'cart.update'; input = { ...payload, id:entityId }; }
        if (resource === 'flows' && entityId) { operation = 'flows.configure'; input = { ...payload, type:entityId }; }
      }
      if (!operation) throw new StoreError(404, 'Endpoint not found');
      const key = req.headers['idempotency-key'];
      if (['reserve','payment','reservation.cancel','order.refund','order.cancel'].includes(operation) && !key) throw new StoreError(400, 'Idempotency-Key required');
      return send(200, store.transact(dataset, operation, input, key));
    } catch (error) { send(error.status || 500, { error: error.status ? error.message : 'Internal error', simulated:true }); if (!error.status) console.error(error); }
  });
  server.on('close', () => store.close()); return { server, store };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flags = Object.fromEntries(process.argv.slice(2).map((arg, i, all) => arg.startsWith('--') ? [arg.slice(2), all[i+1]] : null).filter(Boolean));
  if (!flags.state) throw new Error('Usage: node server.mjs --state <private-state-directory> [--seed <private-seed.json>] [--assets <private-assets>] [--port 4318]');
  const seed = flags.seed ? JSON.parse(fs.readFileSync(flags.seed,'utf8')) : undefined;
  const { server } = createServer({ seed, stateDir:flags.state, assetDir:flags.assets ? path.resolve(flags.assets) : undefined });
  server.listen(Number(flags.port || 4318), '127.0.0.1', () => console.log(`PRIVATE TEST STORE http://127.0.0.1:${server.address().port} — simulated payments and local-only messages`));
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
