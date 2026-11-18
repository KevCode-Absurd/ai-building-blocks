#!/usr/bin/env node
// GET-only release readiness. The operator supplies an independently captured, read-only D1 hash snapshot.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const ORIGINS = new Set(['https://agents.useaiblocks.com', 'https://agents-staging.useaiblocks.com', 'http://127.0.0.1:5290']);
const PUBLIC_FIELDS = ['id', 'kind', 'name', 'title', 'tagline', 'area', 'role', 'vertical', 'portrait', 'accent', 'bio', 'capabilities', 'good_at', 'not_for', 'soul'];
export function publicProjection(profile) {
  if (!profile || typeof profile !== 'object') throw Error('Missing public agent profile');
  const out = Object.fromEntries(PUBLIC_FIELDS.map(key => [key, profile[key]]));
  out.outcomes = profile.outcomes?.map(row => Object.fromEntries(['id', 'title', 'deliverable', 'job_type_id'].map(key => [key, row[key]])));
  out.samples = profile.samples?.map(row => Object.fromEntries(['title', 'brief', 'job_type_id'].map(key => [key, row[key]])));
  return out;
}

export function parseD1Readback(doc) {
  const statements = Array.isArray(doc) ? doc : [doc];
  if (statements.length !== 1 || statements[0]?.success === false || !Array.isArray(statements[0]?.results)) throw Error('Expected one successful Wrangler D1 JSON result');
  const rows = statements[0].results;
  const seen = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || row.kind !== 'house' || !['live', 'hidden'].includes(row.status) || !/^[a-f0-9]{64}$/.test(row.content_hash ?? '') || seen.has(row.id)) throw Error('Malformed or duplicate house hash row');
    seen.add(row.id);
  }
  return new Map(rows.map(row => [row.id, row]));
}

export function compareReadback(expected, doc) {
  const rows = parseD1Readback(doc);
  return expected.flatMap(wanted => {
    const actual = rows.get(wanted.id);
    return !actual ? [{ id: wanted.id, reason: 'missing_seeded_row' }]
      : actual.status !== 'live' ? [{ id: wanted.id, reason: 'seeded_row_not_live' }]
      : actual.content_hash !== wanted.hash ? [{ id: wanted.id, reason: 'seeded_content_hash_differs' }] : [];
  });
}

export function validateCapture({ origin, database, deployedAt, modifiedAt, now = Date.now() }) {
  const target = origin === 'https://agents.useaiblocks.com' ? 'ai-blocks-agents' : origin === 'https://agents-staging.useaiblocks.com' ? 'ai-blocks-agents-staging' : null;
  const deployed = Date.parse(deployedAt);
  if (!target || database !== target) throw Error('D1 database must match the selected deployed origin');
  if (!Number.isFinite(deployed) || deployed > now || modifiedAt < deployed || modifiedAt > now + 5000 || now - modifiedAt > 1_800_000) throw Error('D1 snapshot must be captured after the declared deployment and within the last 30 minutes');
}

export function retryDelay(value, now) {
  if (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim())) return Math.max(1100, Number(value) * 1000);
  const date = typeof value === 'string' ? Date.parse(value) : NaN;
  return Number.isFinite(date) ? Math.max(1100, date - now) : 60_000;
}

export async function waitForRelease({ expected, origin, timeoutMs = 1_200_000, intervalMs = 30_000, fetchImpl = fetch, readD1, now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), onAttempt = () => {} }) {
  if (!ORIGINS.has(origin)) throw Error('Unapproved origin');
  if (!expected?.length || new Set(expected.map(row => row.id)).size !== expected.length) throw Error('Expected unique nonempty source roster');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 1_800_000 || !Number.isFinite(intervalMs) || intervalMs < 1 || intervalMs > 60_000) throw Error('Invalid bounded polling duration');
  const start = now(), deadline = start + timeoutMs, ids = expected.map(row => row.id).sort();
  let attempts = 0, last, nextRequestAt = start, rateLimitRetries = 0;
  const get = async route => {
    const url = new URL(route, origin);
    url.searchParams.set('_release_readback', `${start}-${attempts}`);
    while (now() < deadline) {
      if (nextRequestAt > now()) await sleep(Math.min(nextRequestAt - now(), deadline - now()));
      const remaining = deadline - now();
      if (remaining <= 0) break;
      // One global start-time budget covers the roster, every profile, subsequent attempts and retries.
      nextRequestAt = now() + 1100;
      const response = await fetchImpl(url, { method: 'GET', redirect: 'error', headers: { 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(Math.max(1, Math.min(10_000, remaining))) });
      if (response.status === 429) {
        rateLimitRetries++;
        nextRequestAt = Math.max(nextRequestAt, now() + retryDelay(response.headers?.get('retry-after'), now()));
        await response.body?.cancel();
        continue;
      }
      if (response.status !== 200) throw Error(`HTTP ${response.status} at ${url.pathname}`);
      return response.json();
    }
    throw Error(`Readiness deadline reached at ${url.pathname}`);
  };
  do {
    attempts++;
    last = { attempt: attempts, publicReady: false, databaseReady: false, profilesChecked: 0, issues: [] };
    try {
      const roster = await get('/api/agents?vertical=ecommerce');
      const actualIds = Array.isArray(roster.agents) ? roster.agents.map(row => row.id).sort() : [];
      if (roster.total !== ids.length || !isDeepStrictEqual(actualIds, ids)) last.issues.push({ reason: 'roster_differs', expected: ids.length, actual: actualIds.length, missing: ids.filter(id => !actualIds.includes(id)), unexpected: actualIds.filter(id => !ids.includes(id)) });
      else {
        for (const wanted of expected) {
            try {
              const received = publicProjection((await get('/api/agents/' + encodeURIComponent(wanted.id))).agent);
              const fields = Object.keys(wanted.public).filter(key => !isDeepStrictEqual(received[key], wanted.public[key]));
              last.profilesChecked++;
              if (fields.length) last.issues.push({ id: wanted.id, reason: 'public_profile_differs', fields });
            } catch (error) { last.issues.push({ id: wanted.id, reason: 'profile_unavailable', detail: error.message }); }
            if (now() >= deadline) break;
        }
      }
      if (last.profilesChecked !== expected.length) last.issues.push({ reason: 'profile_checks_incomplete', checked: last.profilesChecked, expected: expected.length });
      last.publicReady = last.issues.length === 0 && last.profilesChecked === expected.length;
    } catch (error) { last.issues.push({ reason: 'public_read_failed', detail: error.message }); }
    if (readD1) {
      try {
        const differences = compareReadback(expected, await readD1());
        last.databaseReady = differences.length === 0;
        last.issues.push(...differences);
      } catch (error) { last.issues.push({ reason: 'database_readback_unavailable', detail: error.message }); }
    } else last.issues.push({ reason: 'database_readback_not_supplied', detail: 'Public APIs omit method, source_roles and look; matching public profiles cannot certify seeded methods.' });
    last.rateLimitRetries = rateLimitRetries;
    onAttempt({ ...last, elapsedMs: now() - start });
    if (last.publicReady && last.databaseReady) return { status: 'READY', origin, expectedAgents: ids.length, attempts, elapsedMs: now() - start, ...last };
    if (last.publicReady && !readD1) return { status: 'PUBLIC_CURRENT_PRIVATE_UNVERIFIED', origin, expectedAgents: ids.length, attempts, elapsedMs: now() - start, ...last };
    if (now() >= deadline) break;
    await sleep(Math.min(intervalMs, deadline - now()));
  } while (now() < deadline);
  return { status: 'TIMEOUT', origin, expectedAgents: ids.length, attempts, elapsedMs: now() - start, ...last };
}

async function main() {
  const args = process.argv.slice(2), opts = {};
  for (let n = 0; n < args.length; n += 2) {
    if (!['--origin', '--out', '--timeout-seconds', '--interval-seconds', '--d1-readback', '--d1-database', '--deployed-at'].includes(args[n]) || !args[n + 1] || args[n + 1].startsWith('--')) throw Error('Use --origin, --out, --timeout-seconds, --interval-seconds and optional --d1-readback, --d1-database, --deployed-at');
    opts[args[n]] = args[n + 1];
  }
  if (!opts['--out']) throw Error('--out must name a private JSON report file');
  const [{ default: source }, { agentProfile }, { personaHash }] = await Promise.all([
    import('../../marketplace/src/modules/directory/data/personas-ecommerce.json', { with: { type: 'json' } }),
    import('../../marketplace/src/modules/directory/views.ts'),
    import('../../marketplace/src/modules/directory/service.ts'),
  ]);
  const expected = await Promise.all(source.filter(p => p.kind === 'house' && p.status === 'live').map(async p => ({ id: p.id, public: publicProjection(agentProfile(p)), hash: await personaHash(p) })));
  const capturePath = opts['--d1-readback'] && path.resolve(opts['--d1-readback']);
  const out = path.resolve(opts['--out']);
  if (capturePath === out) throw Error('Report must not overwrite the D1 readback');
  const origin = opts['--origin'] ?? 'https://agents.useaiblocks.com';
  if (capturePath && (!opts['--d1-database'] || !opts['--deployed-at'])) throw Error('D1 readback requires --d1-database and --deployed-at for capture binding');
  let capture = null;
  const report = await waitForRelease({ expected, origin, timeoutMs: Number(opts['--timeout-seconds'] ?? 1200) * 1000, intervalMs: Number(opts['--interval-seconds'] ?? 30) * 1000,
    readD1: capturePath ? async () => {
      const [bytes, stat] = await Promise.all([fs.readFile(capturePath), fs.stat(capturePath)]);
      validateCapture({ origin, database: opts['--d1-database'], deployedAt: opts['--deployed-at'], modifiedAt: stat.mtimeMs });
      capture = { path: capturePath, sha256: createHash('sha256').update(bytes).digest('hex'), modifiedAt: stat.mtime.toISOString(), database: opts['--d1-database'], declaredDeploymentAt: opts['--deployed-at'], binding: 'Operator-declared database and deployment; filesystem capture timestamp. Not cryptographic provenance.' };
      return JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
    } : undefined,
    onAttempt: result => console.log(JSON.stringify({ attempt: result.attempt, publicReady: result.publicReady, databaseReady: result.databaseReady, profilesChecked: result.profilesChecked, issues: result.issues, rateLimitRetries: result.rateLimitRetries, elapsedMs: result.elapsedMs })),
  });
  report.checkedAt = new Date().toISOString();
  report.databaseCapture = capture;
  report.expectedSource = {
    path: 'marketplace/src/modules/directory/data/personas-ecommerce.json',
    sha256: createHash('sha256').update(await fs.readFile(new URL('../../marketplace/src/modules/directory/data/personas-ecommerce.json', import.meta.url))).digest('hex'),
    projectedProfilesSha256: createHash('sha256').update(JSON.stringify(expected)).digest('hex'),
    hashAlgorithm: 'Application personaHash over source-controlled seeded fields, including full profile',
  };
  report.scope = 'GET-only public roster and profiles plus supplied D1 content hashes, compared to this checkout. No seed writes, model calls, pack build, runtime mutation or proof of future state. D1 receipt provenance is operator supplied.';
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, JSON.stringify(report, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
  console.log(JSON.stringify({ status: report.status, expectedAgents: report.expectedAgents, report: out }));
  process.exitCode = report.status === 'READY' ? 0 : report.status === 'TIMEOUT' ? 1 : 2;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) main().catch(error => { console.error(error.message); process.exitCode = 2; });
