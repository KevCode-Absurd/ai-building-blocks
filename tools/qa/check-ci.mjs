import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { git, REPO } from './git-content.mjs';
export function selectCiBase(event, command = args => git(REPO, args).toString('utf8').trim()) {
  const supplied = event.pull_request?.base?.sha ?? event.before;
  if (supplied !== undefined && !/^[a-f0-9]{40}$/.test(supplied)) throw Error('Invalid CI base revision');
  if (supplied && !/^0+$/.test(supplied)) {
    command(['cat-file', '-e', `${supplied}^{commit}`]); return supplied;
  }
  // A new branch has no event.before. Its first new commit still has the inherited parent.
  try { return command(['rev-parse', '--verify', 'HEAD^']); }
  catch { return command(['hash-object', '-t', 'tree', '--stdin']); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (!process.env.GITHUB_EVENT_PATH) throw Error('GitHub event is required');
    const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    const base = selectCiBase(event, args => git(REPO, args, { ...(args[0] === 'hash-object' ? { input: '' } : {}) }).toString('utf8').trim());
    console.log(`Checking committed changes from ${base}.`);
    execFileSync(process.execPath, [fileURLToPath(new URL('./check.mjs', import.meta.url)), '--base', base], { cwd: REPO, stdio: 'inherit' });
  } catch { console.error('CI source review failed. Inspect the QA report and ensure the event base revision is present in the full checkout.'); process.exitCode = 1; }
}
