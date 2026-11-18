import path from 'node:path';

// Canonicalize exported text, not the user's source tree. Keep binary and unknown
// formats byte-for-byte; resource digests must describe the actual served bytes.
const TEXT_EXTENSIONS = new Set(['.md', '.markdown', '.txt', '.json', '.jsonl', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.csv', '.tsv', '.py', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.sh', '.ps1', '.html', '.css', '.svg', '.xml']);
const TEXT_NAMES = /^(?:license|licence|copying|notice|readme)$/i;
export function publishedSourceBytes(name, bytes) {
  const buffer = Buffer.from(bytes);
  if (!TEXT_EXTENSIONS.has(path.extname(name).toLowerCase()) && !TEXT_NAMES.test(path.basename(name))) return buffer;
  if (buffer.includes(0) || !buffer.includes(13)) return buffer;
  try {
    // Preserve an intentional UTF-8 BOM; invalid UTF-8 is never replaced.
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(buffer);
    return Buffer.from(text.replace(/\r\n?/g, '\n'), 'utf8');
  } catch {
    return buffer;
  }
}
