import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

// Reads public/_headers the way Cloudflare does: every matching rule applies, and a header set by two rules is joined
// with a comma (which would break X-Frame-Options), so each path must get each frame header from one rule only.
const rules = [];
for (const line of fs.readFileSync('public/_headers', 'utf8').split(/\r?\n/)) {
  if (!line.trim() || line.trimStart().startsWith('#')) continue;
  if (!/^\s/.test(line)) { rules.push({path: line.trim(), headers: []}); continue; }
  const at = line.indexOf(':');
  rules.at(-1).headers.push([line.slice(0, at).trim().toLowerCase(), line.slice(at + 1).trim()]);
}
const matcher = pattern => new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/:\w+/g, '[^/]+') + '$');
function headersFor(path) {
  const out = {};
  for (const rule of rules) if (matcher(rule.path).test(path)) for (const [name, value] of rule.headers) out[name] = out[name] ? `${out[name]}, ${value}` : value;
  return out;
}
const reportOnly = headersFor('/')['content-security-policy-report-only'] ?? '';
const directive = name => reportOnly.split(';').map(s => s.trim()).find(s => s.startsWith(name + ' ')) ?? '';

test('every page is HTTPS-only for a year and carries a report-only content policy that reports to us', () => {
  for (const path of ['/', '/skills/website-brand-brain-builder', '/tools/break-even', '/data/blocks.json']) {
    assert.equal(headersFor(path)['strict-transport-security'], 'max-age=31536000; includeSubDomains', path);
    assert.equal(headersFor(path)['content-security-policy-report-only'], reportOnly, path);
  }
  for (const part of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", 'report-uri /api/client-error']) assert.ok(reportOnly.includes(part), part);
  assert.doesNotMatch(directive('script-src'), /'unsafe-inline'|'unsafe-eval'/);
  // Analytics, Clarity, Clerk and Turnstile keep working once this is enforced.
  for (const origin of ['https://www.googletagmanager.com', 'https://*.clarity.ms', 'https://challenges.cloudflare.com', 'https://clerk.useaiblocks.com']) assert.ok(directive('script-src').includes(origin), origin);
  for (const origin of ['https://*.google-analytics.com', 'https://*.clarity.ms', 'https://clerk.useaiblocks.com']) assert.ok(directive('connect-src').includes(origin), origin);
  assert.ok(directive('frame-src').includes('https://challenges.cloudflare.com'));
  assert.equal(headersFor('/')['content-security-policy'], undefined, 'nothing is enforced yet on ordinary pages');
});

test('the inline scripts in index.html are allowed by hash, so the policy can be enforced later without unsafe-inline', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const inline = [...html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)].filter(([, attrs = '']) => !/\ssrc=/.test(attrs) && !/type="(?!module|text\/javascript)/.test(attrs)).map(m => m[2]);
  assert.ok(inline.length >= 3);
  for (const code of inline) {
    const hash = `'sha256-${createHash('sha256').update(code).digest('base64')}'`;
    assert.ok(directive('script-src').includes(hash), `index.html inline script ${hash} is missing from public/_headers; update the hash there`);
  }
});

test('account, sign-in and publishing pages refuse every frame; embeds and the support chat keep theirs', () => {
  for (const path of ['/account', '/account/settings', '/space', '/space/abc', '/sign-in', '/sign-in/factor-one', '/sign-up', '/sign-up/verify', '/publish', '/my-submissions', '/admin', '/admin/community']) {
    const h = headersFor(path);
    assert.equal(h['x-frame-options'], 'DENY', path);
    assert.equal(h['content-security-policy'], "frame-ancestors 'none'", path);
  }
  for (const path of ['/connect-mcp', '/connect-mcp.html']) {
    assert.equal(headersFor(path)['x-frame-options'], 'DENY');
    assert.equal(headersFor(path)['content-security-policy'], "frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  }
  for (const path of ['/support-chat-frame', '/support-chat-frame.html']) {
    assert.equal(headersFor(path)['x-frame-options'], 'SAMEORIGIN');
    assert.equal(headersFor(path)['content-security-policy'], "frame-ancestors 'self'; base-uri 'self'");
  }
  for (const path of ['/', '/mini-tools/break-even', '/skills/website-brand-brain-builder', '/accounting']) assert.equal(headersFor(path)['x-frame-options'], undefined, path);
});

test('item pages go stale for at most 10 minutes after a deploy; hashed code stays cached for a year', () => {
  assert.equal(headersFor('/skills/website-brand-brain-builder')['cache-control'], 'public, max-age=300, stale-while-revalidate=600');
  assert.equal(headersFor('/assets/index-abc.js')['cache-control'], 'public, max-age=31536000, immutable');
  assert.ok(rules.length <= 100, 'Cloudflare reads at most 100 header rules');
  for (const rule of rules) for (const [, value] of rule.headers) assert.ok(value.length <= 2000, rule.path);
});
