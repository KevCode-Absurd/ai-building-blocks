/** Build public catalogue metadata off the input/render thread; no queries or networking. */
import { buildLibrarySearchIndex } from "./library-search-core";
import type { SearchDocument } from "./library-search-core";
const scope = globalThis as unknown as Worker;
scope.onmessage = (event: MessageEvent<{ documents: SearchDocument[]; sourceHash: string }>) => {
  try { scope.postMessage({ index: buildLibrarySearchIndex(event.data.documents, event.data.sourceHash) }); }
  catch { scope.postMessage({ error: "Public metadata could not be prepared" }); }
};
