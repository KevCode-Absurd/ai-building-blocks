// Run only after the owner copies the synthetic space's private link.
// Clipboard contents, keys, cookies and authorization headers never reach output.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const base = stagingTarget();
const tag = 'Staging launch verification owner-20261022';
const slug = 'website-brand-brain-builder';
const credential = JSON.parse(fs.readFileSync('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === '--link-file'), 'Only the ignored synthetic owner-link file is supported.');
const linkFile = process.argv[2] === '--link-file' ? 'site/.wrangler/staging-owner-link.txt' : null;
const clipboard = (linkFile ? fs.readFileSync(linkFile, 'utf8') : execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'Get-Clipboard -Raw'], { encoding: 'utf8', windowsHide: true })).trim();
let link;
try { link = new URL(clipboard); } catch { throw Error('Clipboard is not a valid staging private link.'); }
assert(link.origin === base && link.pathname === '/space' && !link.search && !link.username && !link.password, 'Clipboard must be the synthetic staging space private link.');
const fragment = new URLSearchParams(link.hash.slice(1));
const ownerKey = fragment.get('key');
assert(fragment.size === 1 && /^[A-Za-z0-9_-]{32}$/.test(ownerKey || ''), 'Clipboard must contain the app-created private link.');
async function get(route, owner = false) {
  const response = await fetch(base + route, { headers: { 'x-preview-access': credential, ...(owner ? { authorization: 'Bearer ' + ownerKey } : {}) }, redirect: 'manual', signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, 'Staging readback failed.');
  return response.json();
}
const space = await get('/api/spaces/me', true);
assert.equal(space.space.name, tag, 'Only the explicitly named synthetic space may be captured.');
assert.equal(space.items.length, 0, 'Use a fresh empty synthetic verification space.');
const comments = await get('/api/comments?slug=' + slug);
const matches = comments.comments.filter(comment => comment.body === tag).sort((a, b) => String(b.at).localeCompare(String(a.at)) || b.id.localeCompare(a.id));
assert(matches.length >= 1 && matches.length <= 6, 'Expected a bounded set of exact-tag synthetic comments.');
assert(matches.every(comment => /^[a-f0-9-]{36}$/i.test(comment.id)), 'Invalid synthetic comment identifier.');
assert(/^[A-Za-z0-9_-]{32}$/.test(space.shareToken), 'Invalid app-created share token.');
const fixture = { verificationTag: tag, commentSlug: slug, commentId: matches[0].id, commentIds: matches.map(comment => comment.id), ownerKey, shareToken: space.shareToken, spaceId: space.space.id };
fs.writeFileSync('site/.wrangler/staging-live-fixtures.json', JSON.stringify(fixture));
// Clear only the copied synthetic link; preserve a clipboard the owner changed.
if (linkFile) fs.unlinkSync(linkFile);
else execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', 'if ((Get-Clipboard -Raw).Trim() -ceq $env:STAGING_CAPTURED_LINK) { Set-Clipboard -Value "" }'], { env: { ...process.env, STAGING_CAPTURED_LINK: clipboard }, stdio: 'ignore', windowsHide: true });
console.log(JSON.stringify({ status: 'captured', syntheticSpaceVerified: true, syntheticCommentVerified: true, secretValuesPrinted: false, productionTouched: false }));
