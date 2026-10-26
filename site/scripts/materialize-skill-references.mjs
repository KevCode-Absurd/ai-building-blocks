// Materialize referenced public supporting files from unchanged, verified ZIP bytes.
// Never executes source content. Exported archives and instruction bytes remain untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { unzipSync } from 'fflate';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const attributeText = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
function canonicalFile(file) {
  if (typeof file !== 'string' || !file || /[\\\x00-\x1f\x7f:?*"<>|#]/.test(file) || file.startsWith('/') || path.posix.normalize(file) !== file) return null;
  if (file.split('/').some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part) || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) return null;
  return file;
}
function verifySelectedEntries(bytes, expected) {
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) if (bytes.readUInt32LE(i) === 0x06054b50 && i + 22 + bytes.readUInt16LE(i + 20) === bytes.length) { end = i; break; }
  assert(end >= 0, 'Verified ZIP has no canonical central directory.');
  assert(bytes.readUInt16LE(end + 4) === 0 && bytes.readUInt16LE(end + 6) === 0, 'Multi-disk ZIP is unsupported.');
  const count = bytes.readUInt16LE(end + 10), start = bytes.readUInt32LE(end + 16), size = bytes.readUInt32LE(end + 12);
  assert(count !== 0xffff && start !== 0xffffffff && size !== 0xffffffff && start + size <= end, 'Unsupported ZIP central directory.');
  assert.equal(bytes.readUInt16LE(end + 8), count, 'Inconsistent ZIP entry count.');
  const found = new Set(); let offset = start;
  for (let i = 0; i < count; i++) {
    assert(offset + 46 <= start + size && bytes.readUInt32LE(offset) === 0x02014b50, 'Invalid ZIP directory entry.');
    const flags = bytes.readUInt16LE(offset + 8), length = bytes.readUInt16LE(offset + 28), extra = bytes.readUInt16LE(offset + 30), comment = bytes.readUInt16LE(offset + 32);
    const next = offset + 46 + length + extra + comment;
    assert(next <= start + size, 'Truncated ZIP directory entry.');
    const name = bytes.subarray(offset + 46, offset + 46 + length).toString(flags & 2048 ? 'utf8' : 'latin1');
    if (expected.has(name)) {
      assert(!found.has(name), 'Duplicate referenced ZIP entry.'); found.add(name);
      const attributes = bytes.readUInt32LE(offset + 38);
      assert(((attributes >>> 16) & 0o170000) !== 0o120000 && !(attributes & 16), 'Referenced ZIP entry is not a regular file.');
      assert(!(flags & 1), 'Encrypted supporting files are unsupported.');
      assert(bytes.readUInt32LE(offset + 24) <= MAX_FILE_BYTES, 'Referenced file exceeds the static-asset limit.');
    }
    offset = next;
  }
  assert.equal(offset, start + size, 'ZIP central-directory size mismatch.');
  assert.equal(found.size, expected.size, 'Referenced file is absent from the exact verified ZIP directory.');
}
export async function materializeSkillReferences(assets, frozenPublic) {
  const catalogue = JSON.parse(await fs.readFile(path.join(assets, 'data/blocks.json'), 'utf8'));
  const details = new Map(), wanted = new Map(), casePaths = new Map();
  for (const block of catalogue.blocks) {
    const file = path.join(assets, 'data/pages', block.slug + '.json');
    try { details.set(block.slug, JSON.parse(await fs.readFile(file, 'utf8'))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const metadata = await fs.readdir(path.join(assets, 'metadata'), { recursive: true });
  for (const record of metadata.filter(file => file.endsWith('.json'))) {
    const page = record === 'index.json' ? 'index.html' : record.slice(0, -5) + '.html';
    let html; try { html = await fs.readFile(path.join(assets, page), 'utf8'); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    for (const tag of html.matchAll(/<(?:a|img|source|video|audio|script|link)\b[^>]*\b(?:href|src)="([^"]+)"[^>]*>/gi)) {
      let url; try { url = new URL(attributeText(tag[1]), 'https://useaiblocks.com'); } catch { continue; }
      if (url.origin !== 'https://useaiblocks.com') continue;
      const match = url.pathname.match(/^\/skills\/([a-z0-9-]+)\/(.+)$/); if (!match) continue;
      let relative; try { relative = decodeURIComponent(match[2]); } catch { continue; }
      const file = canonicalFile(relative); if (!file || file !== relative) continue;
      const listed = details.get(match[1])?.files;
      if (!Array.isArray(listed) || !listed.includes(file)) continue;
      assert(!/\.(?:html?|svg|xhtml|xml)$/i.test(file), 'Active supporting documents must remain in their complete ZIP: ' + file);
      const destination = `skills/${match[1]}/${file}`;
      try { await fs.access(path.join(assets, destination)); continue; } catch { /* materialize missing exact references only */ }
      const folded = destination.toLocaleLowerCase('en-US');
      assert(!casePaths.has(folded) || casePaths.get(folded) === destination, 'Supporting paths collide by case.'); casePaths.set(folded, destination);
      if (!wanted.has(match[1])) wanted.set(match[1], new Map());
      const group = wanted.get(match[1]); if (!group.has(file)) group.set(file, new Set()); group.get(file).add(page);
    }
  }
  const mapping = {}; let bytesWritten = 0, archivesRead = 0;
  for (const [slug, files] of wanted) {
    const archive = `skills/${slug}.zip`, archiveBytes = await fs.readFile(path.join(assets, archive)), archiveSha256 = sha(archiveBytes);
    const expected = new Set([...files.keys()].map(file => `${slug}/${file}`)), seen = new Set();
    verifySelectedEntries(archiveBytes, expected);
    const entries = unzipSync(archiveBytes, { filter: entry => {
      if (!expected.has(entry.name)) return false;
      assert(!seen.has(entry.name), 'Duplicate referenced archive entry.'); seen.add(entry.name);
      assert(entry.originalSize <= MAX_FILE_BYTES, 'Referenced file exceeds the static-asset limit.');
      return true;
    } });
    archivesRead++;
    for (const [file, referringPages] of files) {
      const entry = `${slug}/${file}`, bytes = entries[entry]; assert(bytes, `Referenced supporting file missing from verified ZIP: ${entry}`);
      assert(bytes.byteLength <= MAX_FILE_BYTES, 'Referenced file exceeds the static-asset limit.');
      const destination = `skills/${slug}/${file}`;
      for (const root of [assets, frozenPublic]) {
        const output = path.resolve(root, destination), inside = path.relative(path.resolve(root), output);
        assert(inside && !inside.startsWith('..') && !path.isAbsolute(inside), 'Supporting file escapes the intended asset root.');
        await fs.mkdir(path.dirname(output), { recursive: true }); await fs.writeFile(output, bytes);
      }
      bytesWritten += bytes.byteLength; assert(bytesWritten <= 512 * 1024 * 1024, 'Derived supporting assets exceed the reviewed capacity guard.');
      mapping[destination] = { archive, archiveSha256, entry, sha256: sha(bytes), bytes: bytes.byteLength, referringPages: [...referringPages].sort() };
    }
    assert.equal(sha(await fs.readFile(path.join(assets, archive))), archiveSha256, 'Verified source ZIP changed while deriving references.');
  }
  return { count: Object.keys(mapping).length, archivesRead, bytesWritten, mapping };
}
