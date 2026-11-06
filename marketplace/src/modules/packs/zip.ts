// A small zip writer and reader with no dependencies. Works in Node 24 and in Workers: deflate and inflate use the
// web CompressionStream / DecompressionStream ("deflate-raw"), CRC-32 is computed here.
//
// Writer: UTF-8 names (flag bit 11), a fixed timestamp so the same files always give the same bytes, deflate unless
// it does not shrink the file (then stored). No zip64, no folder entries, no comments.
// Reader: built for untrusted uploads. It rejects encrypted entries, zip64, absolute paths, "..", backslashes,
// duplicate names (ignoring case) and methods other than store and deflate, and it enforces a cap on entries and on
// total uncompressed bytes before and while inflating, so a zip bomb stops early. Every CRC is checked.

export class ZipError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export interface ZipEntry { path: string; data: Uint8Array }
export interface ZipInput { path: string; data: Uint8Array | string }
export interface ZipLimits {
  /** Most entries (files and folders) the archive may list. */
  maxEntries: number;
  /** Most uncompressed bytes across all files. */
  maxTotalBytes: number;
  /** Most uncompressed bytes for one file (optional). */
  maxEntryBytes?: number;
}

export const DEFAULT_LIMITS: ZipLimits = { maxEntries: 500, maxTotalBytes: 20 * 1024 * 1024 };

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_END = 0x06054b50;
const SIG_ZIP64_LOCATOR = 0x07064b50;
const FLAG_ENCRYPTED = 0x0001;
const FLAG_STRONG_ENCRYPTION = 0x0040;
const FLAG_UTF8 = 0x0800;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;

// ---------- CRC-32 ----------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ---------- Streams ----------

/** A copy backed by a plain ArrayBuffer, which the web stream and crypto types expect. */
function own(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

function streamOf(bytes: Uint8Array): ReadableStream<Uint8Array<ArrayBuffer>> {
  const chunk = own(bytes);
  return new ReadableStream<Uint8Array<ArrayBuffer>>({ start(c) { c.enqueue(chunk); c.close(); } });
}

async function collect(stream: ReadableStream<Uint8Array>, max: number): Promise<Uint8Array | null> {
  const reader = stream.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    parts.push(value);
  }
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.byteLength; }
  return out;
}

export async function deflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const out = await collect(streamOf(bytes).pipeThrough(new CompressionStream("deflate-raw")), Number.MAX_SAFE_INTEGER);
  return out!;
}

/** Inflates raw deflate data. Returns null when the output would pass max bytes. Throws on corrupt data. */
export async function inflateRaw(bytes: Uint8Array, max: number): Promise<Uint8Array | null> {
  return collect(streamOf(bytes).pipeThrough(new DecompressionStream("deflate-raw")), max);
}

// ---------- Names ----------

const encoder = new TextEncoder();

/** Why a path is not a safe relative file name, or null when it is fine. Folders end with "/". */
export function unsafePathReason(path: string): string | null {
  if (!path) return "an empty name";
  if (path.includes("\\")) return "a backslash in its name";
  if (/[\u0000-\u001f\u007f]/.test(path)) return "a control character in its name";
  if (path.startsWith("/") || /^[a-zA-Z]:/.test(path)) return "an absolute path";
  const segments = path.replace(/\/$/, "").split("/");
  if (segments.some(s => s === "..")) return "a \"..\" in its path";
  if (segments.some(s => s === "" || s === ".")) return "an empty or \".\" folder in its path";
  return null;
}

// ---------- Writer ----------

/** "YYYY-MM-DD" to MS-DOS date and time (midnight). Default 1980-01-01, the earliest DOS date. */
function dosDateTime(date?: string): { date: number; time: number } {
  const m = date ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date) : null;
  if (!m) return { date: (0 << 9) | (1 << 5) | 1, time: 0 };
  const y = Math.min(Math.max(Number(m[1]), 1980), 2107);
  return { date: ((y - 1980) << 9) | (Number(m[2]) << 5) | Number(m[3]), time: 0 };
}

/**
 * Writes a zip. Same files and options give the same bytes. Names must be safe relative paths without duplicates.
 * opts.date ("YYYY-MM-DD") sets every entry's modified date; the default is a fixed 1980-01-01.
 */
export async function writeZip(files: ZipInput[], opts: { date?: string } = {}): Promise<Uint8Array> {
  if (files.length > 0xfffe) throw new ZipError("too_many_entries", "Too many files for a zip without zip64.");
  const { date, time } = dosDateTime(opts.date);
  const seen = new Set<string>();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const reason = unsafePathReason(f.path);
    if (reason || f.path.endsWith("/")) throw new ZipError("bad_name", `Cannot write ${JSON.stringify(f.path)}: ${reason ?? "a folder name"}.`);
    const key = f.path.toLowerCase();
    if (seen.has(key)) throw new ZipError("duplicate_name", `Cannot write ${f.path} twice.`);
    seen.add(key);
    const name = encoder.encode(f.path);
    const raw = typeof f.data === "string" ? encoder.encode(f.data) : f.data;
    const deflated = raw.length ? await deflateRaw(raw) : raw;
    const method = deflated.length < raw.length ? METHOD_DEFLATE : METHOD_STORE;
    const body = method === METHOD_DEFLATE ? deflated : raw;
    const crc = crc32(raw);
    if (raw.length >= 0xffffffff || body.length >= 0xffffffff || offset >= 0xffffffff) throw new ZipError("too_large", "A file is too large for a zip without zip64.");

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, SIG_LOCAL, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, FLAG_UTF8, true);
    lv.setUint16(8, method, true);
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, body.length, true);
    lv.setUint32(22, raw.length, true);
    lv.setUint16(26, name.length, true);
    lv.setUint16(28, 0, true);
    local.set(name, 30);

    const central = new Uint8Array(46 + name.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, SIG_CENTRAL, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, FLAG_UTF8, true);
    cv.setUint16(10, method, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, body.length, true);
    cv.setUint32(24, raw.length, true);
    cv.setUint16(28, name.length, true);
    // extra length, comment length, disk number, internal and external attributes stay 0
    cv.setUint32(42, offset, true);
    central.set(name, 46);

    locals.push(local, body);
    centrals.push(central);
    offset += local.length + body.length;
  }
  const cdSize = centrals.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, SIG_END, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  const out = new Uint8Array(offset + cdSize + end.length);
  let at = 0;
  for (const part of [...locals, ...centrals, end]) { out.set(part, at); at += part.length; }
  return out;
}

// ---------- Reader ----------

const decoder = new TextDecoder("utf-8", { fatal: true });

function findEnd(view: DataView): number {
  const len = view.byteLength;
  if (len < 22) return -1;
  const stop = Math.max(0, len - 22 - 0xffff);
  for (let i = len - 22; i >= stop; i--) {
    if (view.getUint32(i, true) === SIG_END && i + 22 + view.getUint16(i + 20, true) <= len) return i;
  }
  return -1;
}

/**
 * Reads every file in a zip, for untrusted input. Folders are checked but not returned. Throws ZipError with a plain
 * message when the archive breaks a rule or a limit.
 */
export async function readZip(input: Uint8Array, limits: ZipLimits = DEFAULT_LIMITS): Promise<ZipEntry[]> {
  const bytes = input;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const endAt = findEnd(view);
  if (endAt < 0) throw new ZipError("not_a_zip", "This is not a zip file, or it is damaged.");
  if (endAt >= 20 && view.getUint32(endAt - 20, true) === SIG_ZIP64_LOCATOR) throw new ZipError("zip64", "This zip uses zip64, which we do not accept. Zip the folder again with a standard zip tool.");
  const diskNo = view.getUint16(endAt + 4, true), cdDisk = view.getUint16(endAt + 6, true);
  const onDisk = view.getUint16(endAt + 8, true), total = view.getUint16(endAt + 10, true);
  const cdSize = view.getUint32(endAt + 12, true), cdOffset = view.getUint32(endAt + 16, true);
  if (total === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) throw new ZipError("zip64", "This zip uses zip64, which we do not accept. Zip the folder again with a standard zip tool.");
  if (diskNo !== 0 || cdDisk !== 0 || onDisk !== total) throw new ZipError("multi_disk", "This zip is split into parts. Zip the folder again as one file.");
  if (total > limits.maxEntries) throw new ZipError("too_many_entries", `This zip has ${total} entries. The most we accept is ${limits.maxEntries}.`);
  if (cdOffset + cdSize > endAt) throw new ZipError("corrupt", "This zip is damaged: its file list is out of place.");

  type Item = { path: string; folder: boolean; method: number; crc: number; csize: number; usize: number; localAt: number };
  const items: Item[] = [];
  const seen = new Set<string>();
  let declared = 0;
  let p = cdOffset;
  for (let i = 0; i < total; i++) {
    if (p + 46 > cdOffset + cdSize || view.getUint32(p, true) !== SIG_CENTRAL) throw new ZipError("corrupt", "This zip is damaged: its file list cannot be read.");
    const flags = view.getUint16(p + 8, true), method = view.getUint16(p + 10, true);
    const crc = view.getUint32(p + 16, true), csize = view.getUint32(p + 20, true), usize = view.getUint32(p + 24, true);
    const nameLen = view.getUint16(p + 28, true), extraLen = view.getUint16(p + 30, true), commentLen = view.getUint16(p + 32, true);
    const localAt = view.getUint32(p + 42, true);
    const next = p + 46 + nameLen + extraLen + commentLen;
    if (next > cdOffset + cdSize) throw new ZipError("corrupt", "This zip is damaged: its file list cannot be read.");
    let path: string;
    try { path = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen)); } catch { throw new ZipError("bad_name", "A file name in this zip is not valid UTF-8 text."); }
    if (flags & (FLAG_ENCRYPTED | FLAG_STRONG_ENCRYPTION) || method === 99) throw new ZipError("encrypted", `${path} is password-protected. Zip the folder again without a password.`);
    if (csize === 0xffffffff || usize === 0xffffffff || localAt === 0xffffffff) throw new ZipError("zip64", "This zip uses zip64, which we do not accept. Zip the folder again with a standard zip tool.");
    for (let e = p + 46 + nameLen; e + 4 <= p + 46 + nameLen + extraLen;) {
      const id = view.getUint16(e, true), size = view.getUint16(e + 2, true);
      if (id === 0x0001) throw new ZipError("zip64", "This zip uses zip64, which we do not accept. Zip the folder again with a standard zip tool.");
      e += 4 + size;
    }
    const reason = unsafePathReason(path);
    if (reason) throw new ZipError("unsafe_path", `This zip has a file with ${reason}: ${JSON.stringify(path.slice(0, 120))}. Use plain folder and file names.`);
    const key = path.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) throw new ZipError("duplicate_name", `This zip has ${path} more than once.`);
    seen.add(key);
    const folder = path.endsWith("/");
    if (!folder) {
      if (method !== METHOD_STORE && method !== METHOD_DEFLATE) throw new ZipError("unsupported_method", `${path} uses a compression we do not accept. Zip the folder again with a standard zip tool.`);
      if (limits.maxEntryBytes !== undefined && usize > limits.maxEntryBytes) throw new ZipError("entry_too_large", `${path} is too large (${usize} bytes). The most for one file is ${limits.maxEntryBytes} bytes.`);
      declared += usize;
      if (declared > limits.maxTotalBytes) throw new ZipError("too_large", `The files in this zip are too large in total. The most we accept is ${limits.maxTotalBytes} bytes unzipped.`);
    }
    items.push({ path, folder, method, crc, csize, usize, localAt });
    p = next;
  }

  const out: ZipEntry[] = [];
  let used = 0;
  for (const it of items) {
    if (it.folder) continue;
    if (it.localAt + 30 > cdOffset || view.getUint32(it.localAt, true) !== SIG_LOCAL) throw new ZipError("corrupt", `This zip is damaged: ${it.path} cannot be found.`);
    const start = it.localAt + 30 + view.getUint16(it.localAt + 26, true) + view.getUint16(it.localAt + 28, true);
    const end = start + it.csize;
    if (end > cdOffset) throw new ZipError("corrupt", `This zip is damaged: ${it.path} is cut short.`);
    const body = bytes.subarray(start, end);
    let data: Uint8Array | null;
    if (it.method === METHOD_STORE) {
      if (it.csize !== it.usize) throw new ZipError("corrupt", `This zip is damaged: ${it.path} has the wrong size.`);
      data = body;
    } else {
      try { data = await inflateRaw(body, Math.min(it.usize, limits.maxTotalBytes - used)); } catch { throw new ZipError("corrupt", `This zip is damaged: ${it.path} cannot be unzipped.`); }
      if (!data) throw new ZipError("corrupt", `This zip is damaged: ${it.path} is larger than it says.`);
    }
    if (data.length !== it.usize) throw new ZipError("corrupt", `This zip is damaged: ${it.path} has the wrong size.`);
    if (crc32(data) !== it.crc) throw new ZipError("corrupt", `This zip is damaged: ${it.path} failed its checksum.`);
    used += data.length;
    out.push({ path: it.path, data: own(data) });
  }
  return out;
}
