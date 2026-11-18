import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

function validateImageDimensions(file, bytes) {
  if (file.kind === 'image' && (bytes.length < 24 || bytes.readUInt32BE(16) !== file.width || bytes.readUInt32BE(20) !== file.height)) throw new Error('Public image dimensions changed');
}

// Input must already be projected by publicBenchmark. The supplied directory is
// a separate privacy-reviewed staging area, never a private run/source folder.
// Return verified bytes before the publisher creates any public files.
export function readReviewedBenchmarkFiles(data, directory) {
  const files = data.cases.flatMap(c => c.outputs.flatMap(o => o.files));
  if (!files.length) return [];
  if (!directory) throw new Error('Reviewed benchmark files require --artifact-dir');
  const root = fs.realpathSync(directory), seen = new Map();
  let total = 0;
  return files.flatMap(file => {
    if (seen.has(file.filename)) {
      const cached = seen.get(file.filename);
      if (cached.identity !== `${file.sha256}:${file.bytes}`) throw new Error('Conflicting public artifact filename');
      // Every rendered reference needs validation, even when its bytes were
      // already checked for an earlier download or another case's image.
      validateImageDimensions(file, cached.bytes);
      return [];
    }
    const filename = fs.realpathSync(path.join(root, file.filename));
    if (path.dirname(filename) !== root) throw new Error('Public artifact escapes its reviewed staging directory');
    const stat = fs.statSync(filename);
    if (!stat.isFile() || stat.size !== file.bytes || stat.size > 15000000) throw new Error('Public artifact size changed');
    total += stat.size;
    if (total > 60000000) throw new Error('Public benchmark artifact budget exceeded');
    const bytes = fs.readFileSync(filename);
    if (createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error('Reviewed public artifact hash changed');
    if (file.filename.endsWith('.png') && !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Public PNG signature is invalid');
    validateImageDimensions(file, bytes);
    seen.set(file.filename, { identity: `${file.sha256}:${file.bytes}`, bytes });
    return [{ filename: file.filename, bytes }];
  });
}
