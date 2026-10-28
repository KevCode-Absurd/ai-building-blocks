import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export function git(root, args, options = {}) {
  return execFileSync('git', ['-c', 'core.longpaths=true', '-c', 'core.quotePath=false', ...args], { cwd: root, maxBuffer: 256 << 20, ...options });
}
export function checkedPath(file) {
  if (typeof file !== 'string' || !file || /[\r\n\0\\]/.test(file) || path.posix.isAbsolute(file) || file.split('/').some(part => !part || part === '.' || part === '..')) throw Error('Unsafe repository path');
  return file;
}
/** Exact blob bytes, including CRLF and embedded binary data. No shell interpolation. */
export function readBlobs(root, specs) {
  if (specs.some(spec => /[\r\n\0]/.test(spec))) throw Error('Unsafe Git object request');
  if (!specs.length) return [];
  const data = git(root, ['cat-file', '--batch'], { input: specs.join('\n') + '\n' });
  const blobs = []; let cursor = 0;
  for (const spec of specs) {
    const end = data.indexOf(10, cursor); if (end < 0) throw Error('Incomplete Git object header');
    const header = data.subarray(cursor, end).toString('utf8'); cursor = end + 1;
    if (header === `${spec} missing`) { blobs.push(null); continue; }
    const match = header.match(/^[a-f0-9]+ blob (\d+)$/); if (!match) throw Error('Unexpected Git object type');
    const size = Number(match[1]); if (!Number.isSafeInteger(size) || size < 0 || cursor + size >= data.length || data[cursor + size] !== 10) throw Error('Incomplete Git object');
    blobs.push(Buffer.from(data.subarray(cursor, cursor + size))); cursor += size + 1;
  }
  if (cursor !== data.length) throw Error('Unexpected trailing Git object data');
  return blobs;
}
export function changedContent(root = REPO, { base = 'HEAD', staged = true } = {}) {
  const entries = git(root, ['diff', ...(staged ? ['--cached'] : [base, 'HEAD']), '--name-status', '-z', '--find-renames=90%']).toString('utf8').split('\0').filter(Boolean);
  const changes = [];
  for (let i = 0; i < entries.length;) {
    const status = entries[i++], oldPath = checkedPath(entries[i++]), file = /^[RC]/.test(status) ? checkedPath(entries[i++]) : oldPath;
    changes.push({ status, oldPath, file });
  }
  const before = readBlobs(root, changes.map(change => `${base}:${change.oldPath}`));
  const after = readBlobs(root, changes.map(change => staged ? `:${change.file}` : `HEAD:${change.file}`));
  return changes.map((change, index) => ({ ...change, before: before[index], after: after[index] }));
}
export function workingContent(root = REPO) {
  const files = [...new Set([git(root, ['diff', 'HEAD', '--name-only', '-z']), git(root, ['ls-files', '--others', '--exclude-standard', '-z'])].flatMap(bytes => bytes.toString('utf8').split('\0').filter(Boolean)))];
  files.forEach(checkedPath);
  const before = readBlobs(root, files.map(file => `HEAD:${file}`));
  return files.map((file, index) => ({ file, oldPath: file, before: before[index], after: worktreeText(root, file) === null ? null : fs.readFileSync(path.join(root, file)) }));
}
export function worktreeText(root, file) {
  checkedPath(file); const absolute = path.resolve(root, file);
  if (!absolute.startsWith(path.resolve(root) + path.sep)) throw Error('Read escaped repository');
  if (!fs.existsSync(absolute)) return null;
  if (fs.lstatSync(absolute).isSymbolicLink()) throw Error('Do not follow source symlinks');
  if (!fs.realpathSync(absolute).startsWith(fs.realpathSync(root) + path.sep)) throw Error('Source link escaped repository');
  return fs.readFileSync(absolute, 'utf8');
}
