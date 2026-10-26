import { useCallback, useEffect, useMemo, useState } from "react";
import type { Block, Catalogue } from "./data";
import { buildLibrarySearchIndex, searchLibraryIndex, searchTokens, searchShardIds, validateLibrarySearchIndex } from "./library-search-core";
import type { LibrarySearchIndex, SearchHit, SearchDocument } from "./library-search-core";
import { makeSearchDocument } from "./search-document.mjs";
export { searchTokens, searchLibraryIndex } from "./library-search-core";
export type { SearchField, SearchHit, LibrarySearchIndex } from "./library-search-core";
const loaded = new Map<string, LibrarySearchIndex>();
const pending = new Map<string, Promise<LibrarySearchIndex>>();
const pendingChunks = new Map<string, Promise<void>>();
const failedChunks = new Set<string>();
type ExtraText = ((block: Block) => string) | undefined;
type MetadataEntry = { promise: Promise<LibrarySearchIndex>; index?: LibrarySearchIndex; readers: number; cancel: () => void };
const metadataCache = new WeakMap<Catalogue, Map<ExtraText, MetadataEntry>>();
export function publicSearchDocuments(catalogue: Catalogue, extraText?: ExtraText): SearchDocument[] {
  const minds = new Map((catalogue.minds?.roster ?? []).map(mind => [mind.slug, mind]));
  return catalogue.blocks.map(block => makeSearchDocument(block, block.type === 'mind' ? { when: minds.get(block.slug)?.useCases ?? [] } : {}, { extraText: extraText?.(block) ?? '' }));
}
/** Same deterministic wire index, yielding between small batches if Workers are unavailable. */
export async function buildMetadataInSlices(documents: SearchDocument[], sourceHash: string, cancelled = () => false): Promise<LibrarySearchIndex> {
  const docs = [...documents].sort((a,b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
  if (new Set(docs.map(doc => doc.slug)).size !== docs.length) throw Error("Duplicate search documents");
  const merged = new Map<string, [number, number][]>();
  const yieldInput = async () => { await new Promise(resolve => setTimeout(resolve, 0)); if (cancelled()) throw Error("Metadata preparation cancelled"); };
  for (let offset = 0; offset < docs.length; offset += 32) {
    await yieldInput();
    const part = buildLibrarySearchIndex(docs.slice(offset, offset + 32), sourceHash);
    part.terms.forEach((term, termId) => {
      let entries = merged.get(term); if (!entries) { entries = []; merged.set(term, entries); }
      const bytes = atob(part.postings[termId]); let id = 0, value = 0, shift = 0;
      for (let i = 0; i < bytes.length; i++) {
        const byte = bytes.charCodeAt(i); value += (byte & 127) * 2 ** shift;
        if (byte & 128) { shift += 7; continue; }
        id += Math.floor(value / 32); entries.push([offset + id, value % 32]); value = 0; shift = 0;
      }
    });
  }
  const terms = [...merged.keys()].sort(), postings: string[] = [];
  for (let offset = 0; offset < terms.length; offset += 64) {
    await yieldInput();
    for (const term of terms.slice(offset, offset + 64)) {
      let previous = 0, bytes = "";
      for (const [id, mask] of merged.get(term)!) {
        let value = (id - previous) * 32 + mask; previous = id;
        do { const byte = value & 127; value = Math.floor(value / 128); bytes += String.fromCharCode(byte | (value ? 128 : 0)); } while (value);
      }
      postings.push(btoa(bytes));
    }
  }
  return { version: 1, sourceHash, docs: docs.map(doc => doc.slug), terms, postings };
}
function acquireMetadata(catalogue: Catalogue, extraText: ExtraText): MetadataEntry {
  let cache = metadataCache.get(catalogue); if (!cache) { cache = new Map(); metadataCache.set(catalogue, cache); }
  const existing = cache.get(extraText); if (existing) { existing.readers++; return existing; }
  let worker: Worker | null = null, cancelled = false, fallbackStarted = false, stopTimer: ReturnType<typeof setTimeout> | undefined;
  let rejectPending: (reason: Error) => void = () => {};
  const entry: MetadataEntry = { promise: null!, readers: 1, cancel: () => { cancelled = true; worker?.terminate(); clearTimeout(stopTimer); rejectPending(Error("Metadata preparation cancelled")); if (cache!.get(extraText) === entry) cache!.delete(extraText); } };
  entry.promise = new Promise<LibrarySearchIndex>((resolve, reject) => {
    rejectPending = reject;
    const documents = publicSearchDocuments(catalogue, extraText), sourceHash = catalogue.sourceHash ?? "";
    const accept = (index: LibrarySearchIndex) => { if (!cancelled) { entry.index = index; resolve(index); } };
    const fallback = () => {
      if (fallbackStarted || cancelled) return; fallbackStarted = true; worker?.terminate(); clearTimeout(stopTimer);
      void buildMetadataInSlices(documents, sourceHash, () => cancelled).then(accept, reject);
    };
    try {
      if (typeof Worker === "undefined") { fallback(); return; }
      worker = new Worker(new URL("./library-search-worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = event => {
        try { const index = validateLibrarySearchIndex(event.data?.index, sourceHash); worker?.terminate(); clearTimeout(stopTimer); accept(index); }
        catch { fallback(); }
      };
      worker.onerror = event => { event.preventDefault(); fallback(); };
      worker.onmessageerror = fallback;
      worker.postMessage({ documents, sourceHash });
      stopTimer = setTimeout(fallback, 10000);
    } catch { fallback(); }
  }).catch(error => { if (cache!.get(extraText) === entry) cache!.delete(extraText); throw error; });
  cache.set(extraText, entry); return entry;
}
/** One public artifact; query text and private content never leave the browser. */
function loadManifest(sourceHash: string): Promise<LibrarySearchIndex> {
  if (loaded.has(sourceHash)) return Promise.resolve(loaded.get(sourceHash)!);
  if (pending.has(sourceHash)) return pending.get(sourceHash)!;
  const request = fetch("/data/library-search.json", { credentials: "omit", cache: "no-cache", signal: AbortSignal.timeout(15000) }).then(async response => {
    if (!response.ok) throw Error("Full search unavailable");
    const text = await response.text(); if (text.length > 24 * 1024 * 1024) throw Error("Full search index is too large");
    const index = validateLibrarySearchIndex(JSON.parse(text), sourceHash); loaded.set(sourceHash, index); return index;
  }).finally(() => { pending.delete(sourceHash); });
  pending.set(sourceHash, request); return request;
}
export async function loadLibrarySearchIndex(sourceHash: string, query = ""): Promise<LibrarySearchIndex> {
  const index = await loadManifest(sourceHash);
  await Promise.all(searchShardIds(index, query).map(id => {
    const chunk = index.shards!.files[id], key = sourceHash + ":" + chunk.sha256;
    if (pendingChunks.has(key)) return pendingChunks.get(key)!;
    const request = fetch(chunk.file, { credentials: "omit", cache: failedChunks.has(key) ? "reload" : "force-cache", signal: AbortSignal.timeout(15000) }).then(async response => {
      if (!response.ok) throw Error("Search chunk unavailable");
      const bytes = await response.arrayBuffer(); if (bytes.byteLength > 4 * 1024 * 1024) throw Error("Search chunk too large");
      const digest = await crypto.subtle.digest("SHA-256", bytes), hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2,"0")).join("");
      if (hash !== chunk.sha256) throw Error("Search chunk identity mismatch");
      const postings: unknown = JSON.parse(new TextDecoder().decode(bytes));
      if (!Array.isArray(postings) || postings.length !== chunk.terms || postings.some(value => typeof value !== "string" || !/^[A-Za-z\d+/]*={0,2}$/.test(value))) throw Error("Invalid search chunk");
      index.postings.splice(id * index.shards!.size, postings.length, ...postings);
      failedChunks.delete(key);
    }).catch(error => { failedChunks.add(key); throw error; }).finally(() => { pendingChunks.delete(key); });
    pendingChunks.set(key, request); return request;
  }));
  return index;
}
export function useLibrarySearch(catalogue: Catalogue, query: string, { extraText }: { extraText?: (block: Block) => string } = {}) {
  const sourceHash = catalogue.sourceHash ?? "";
  const [index, setIndex] = useState<LibrarySearchIndex | null>(() => loaded.get(sourceHash) ?? null);
  const [readyQuery, setReadyQuery] = useState("");
  const [loading, setLoading] = useState(false), [error, setError] = useState(""), [attempt, setAttempt] = useState(0);
  const active = searchTokens(query.slice(0, 300)).length > 0;
  const retry = useCallback(() => {
    // Re-read the small manifest as well: a deployment may have replaced a
    // missing chunk while retaining the same published catalogue bytes.
    loaded.delete(sourceHash); setIndex(null); setReadyQuery(""); setAttempt(value => value + 1);
  }, [sourceHash]);
  const [metadataState, setMetadata] = useState<{ catalogue: Catalogue; extraText: ExtraText; index: LibrarySearchIndex } | null>(null);
  const [metadataPending, setMetadataPending] = useState(true);
  const empty = useMemo(() => buildLibrarySearchIndex([], sourceHash), [sourceHash]);
  const metadata = metadataState?.catalogue === catalogue && metadataState.extraText === extraText ? metadataState.index : empty;
  useEffect(() => {
    let current = true; setMetadataPending(true);
    const entry = acquireMetadata(catalogue, extraText);
    if (entry.index) { setMetadata({ catalogue, extraText, index: entry.index }); setMetadataPending(false); }
    else entry.promise.then(index => { if (current) setMetadata({ catalogue, extraText, index }); }).catch(() => { /* Full public search can still load independently. */ }).finally(() => { if (current) setMetadataPending(false); });
    return () => { current = false; entry.readers--; if (!entry.readers && !entry.index) entry.cancel(); };
  }, [catalogue, extraText, attempt]);
  useEffect(() => {
    if (!active) { setLoading(false); setError(""); return; }
    const cached = loaded.get(sourceHash);
    if (cached && !searchShardIds(cached, query).length) { setIndex({ ...cached, postings: [...cached.postings] }); setReadyQuery(sourceHash + "\n" + query); setLoading(false); setError(""); return; }
    let current = true; setLoading(true); setError("");
    const timer = setTimeout(() => {
      if (!/^[a-f\d]{64}$/.test(sourceHash)) { setLoading(false); setError("Full search is unavailable. Results currently match names and descriptions only."); return; }
      loadLibrarySearchIndex(sourceHash, query).then(value => { if (current) { setIndex({ ...value, postings: [...value.postings] }); setReadyQuery(sourceHash + "\n" + query); } }).catch(() => { if (current) setError("Full search could not load. You can still search names and descriptions. Some results may be missing."); }).finally(() => { if (current) setLoading(false); });
    }, 150);
    return () => { current = false; clearTimeout(timer); };
  }, [active, sourceHash, attempt, query]);
  const currentIndex = index?.sourceHash === sourceHash ? index : null;
  const hits = useMemo(() => {
    const result = searchLibraryIndex(metadata, query);
    if (currentIndex) for (const [slug, hit] of searchLibraryIndex(currentIndex, query)) {
      const old = result.get(slug); if (!old || hit.score > old.score) result.set(slug, hit);
    }
    return result as Map<string, SearchHit>;
  }, [metadata, currentIndex, query]);
  return { hits, loading: active && (loading || metadataPending && !currentIndex), error: active ? error : "", retry, complete: !active || readyQuery === sourceHash + "\n" + query };
}
