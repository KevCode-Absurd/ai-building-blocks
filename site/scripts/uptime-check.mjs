#!/usr/bin/env node
// Read-only uptime check for the live site (docs/MONITORING.md). Four GET/POST reads, no sign-in, nothing written:
// the home page, one item page, the public API status and the public MCP tool list. Prints one JSON line and exits 1
// when any check fails, so any scheduler (cron, Task Scheduler, a CI schedule) can alert on the exit code.
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const DEFAULT_SITE = 'https://useaiblocks.com';
export const DEFAULT_ITEM = '/skills/website-brand-brain-builder';
const TIMEOUT_MS = 15_000;

/** Each check: a name, the request and what a healthy answer looks like. */
export function checks(item = DEFAULT_ITEM) {
  return [
    {name: 'home', path: '/', expect: async r => r.status === 200 && /text\/html/.test(r.headers.get('content-type') ?? '') && /AI Blocks/.test(await r.text())},
    {name: 'item page', path: item, expect: async r => r.status === 200 && /<h1/.test(await r.text())},
    {name: 'api status', path: '/api/v1/status', expect: async r => r.status === 200 && (await r.json()).model_calls === false},
    {name: 'mcp', path: '/mcp', init: {method: 'POST', headers: {'content-type': 'application/json', accept: 'application/json, text/event-stream'}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'tools/list', params: {}})},
      expect: async r => r.status === 200 && Array.isArray((await r.json()).result?.tools)},
  ];
}

export async function runUptime({site = DEFAULT_SITE, item = DEFAULT_ITEM, fetcher = fetch, now = Date.now} = {}) {
  const results = [];
  for (const check of checks(item)) {
    const started = now();
    try {
      const response = await fetcher(site + check.path, {redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS), ...check.init});
      const ok = await check.expect(response);
      results.push({name: check.name, path: check.path, ok, status: response.status, ms: now() - started});
    } catch (error) {
      results.push({name: check.name, path: check.path, ok: false, status: 0, ms: now() - started, error: error?.name ?? 'Error'});
    }
  }
  return {site, at: new Date(now()).toISOString(), ok: results.every(r => r.ok), results};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
  const report = await runUptime({site: arg('--site') ?? DEFAULT_SITE, item: arg('--item') ?? DEFAULT_ITEM});
  console.log(JSON.stringify(report));
  if (!report.ok) process.exitCode = 1;
}
