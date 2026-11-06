// A small line diff (no packages). Stores how a buyer changed a draft, so it can be replayed, counted and summed up.
//   const ops = lineDiff(draft, edited);   // [{ op: "=", n: 3 }, { op: "-", lines: [...] }, { op: "+", lines: [...] }]
//   applyLineDiff(draft, ops) === edited (with "\n" line endings)

export type DiffOp = { op: "="; n: number } | { op: "-"; lines: string[] } | { op: "+"; lines: string[] };

export interface StoredEdits {
  format: "ai-blocks-line-diff/1";
  draftId: string;
  added: number;
  removed: number;
  ops: DiffOp[];
}

/** Past this many changed lines the middle part is stored as one replaced block (keeps memory and time small). */
const MAX_EDITS = 1500;

export const splitLines = (text: string): string[] => text.replace(/\r\n?/g, "\n").split("\n");

function push(ops: DiffOp[], op: "=" | "-" | "+", line: string) {
  const last = ops[ops.length - 1];
  if (op === "=") {
    if (last?.op === "=") last.n++; else ops.push({ op: "=", n: 1 });
  } else if (last?.op === op) {
    last.lines.push(line);
  } else {
    ops.push({ op, lines: [line] });
  }
}

/**
 * Myers' shortest edit script between two line arrays: one mark per step ("=" keep, "-" remove from a, "+" add from b).
 * Time and memory grow with the number of changed lines, not the length. Null when more than maxEdits lines changed.
 */
function editScript(A: string[], B: string[], maxEdits: number): ("=" | "-" | "+")[] | null {
  const n = A.length, m = B.length, max = n + m;
  if (max === 0) return [];
  const off = max + 1;
  const v = new Int32Array(2 * max + 3);
  const trace: Int32Array[] = [];
  let done = false;
  for (let d = 0; d <= Math.min(max, maxEdits) && !done; d++) {
    trace.push(v.slice(off - d - 1, off + d + 2)); // v before step d, for k in [-d-1, d+1]
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && v[off + k - 1] < v[off + k + 1]) ? v[off + k + 1] : v[off + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && A[x] === B[y]) { x++; y++; }
      v[off + k] = x;
      if (x >= n && y >= m) { done = true; break; }
    }
  }
  if (!done) return null;
  const out: ("=" | "-" | "+")[] = [];
  let x = n, y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const snap = trace[d], at = (k: number) => snap[k + d + 1];
    const k = x - y;
    const prevK = k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1;
    const prevX = at(prevK), prevY = prevX - prevK;
    while (x > prevX && y > prevY) { out.push("="); x--; y--; }
    if (d > 0) out.push(x === prevX ? "+" : "-");
    x = prevX; y = prevY;
  }
  return out.reverse();
}

/** Line diff from a to b: equal runs as counts, removed and added lines in full. */
export function lineDiff(a: string, b: string): DiffOp[] {
  const A = splitLines(a), B = splitLines(b);
  const ops: DiffOp[] = [];
  let start = 0;
  while (start < A.length && start < B.length && A[start] === B[start]) start++;
  let endA = A.length, endB = B.length;
  while (endA > start && endB > start && A[endA - 1] === B[endB - 1]) { endA--; endB--; }
  for (let i = 0; i < start; i++) push(ops, "=", A[i]);

  const midA = A.slice(start, endA), midB = B.slice(start, endB);
  const script = editScript(midA, midB, MAX_EDITS);
  if (script) {
    let i = 0, j = 0;
    for (const s of script) {
      if (s === "=") { push(ops, "=", midA[i]); i++; j++; }
      else if (s === "-") { push(ops, "-", midA[i]); i++; }
      else { push(ops, "+", midB[j]); j++; }
    }
  } else {
    for (const line of midA) push(ops, "-", line);
    for (const line of midB) push(ops, "+", line);
  }

  for (let i = endA; i < A.length; i++) push(ops, "=", A[i]);
  return ops;
}

/** Rebuilds b from a and the diff. Throws if the diff does not fit a. */
export function applyLineDiff(a: string, ops: DiffOp[]): string {
  const A = splitLines(a), out: string[] = [];
  let i = 0;
  for (const op of ops) {
    if (op.op === "=") { out.push(...A.slice(i, i + op.n)); i += op.n; }
    else if (op.op === "-") {
      for (const line of op.lines) { if (A[i] !== line) throw new Error("diff_does_not_apply"); i++; }
    } else out.push(...op.lines);
  }
  if (i !== A.length) throw new Error("diff_does_not_apply");
  return out.join("\n");
}

export function diffStats(ops: DiffOp[]): { added: number; removed: number } {
  let added = 0, removed = 0;
  for (const op of ops) { if (op.op === "+") added += op.lines.length; else if (op.op === "-") removed += op.lines.length; }
  return { added, removed };
}

export const hasChanges = (ops: DiffOp[]) => ops.some(op => op.op !== "=");

/** The buyer's edits as stored in decisions.edits, or null when nothing changed. */
export function editsRecord(draftId: string, draft: string, edited: string | undefined): StoredEdits | null {
  if (edited === undefined || edited === null) return null;
  const ops = lineDiff(draft, edited);
  if (!hasChanges(ops)) return null;
  return { format: "ai-blocks-line-diff/1", draftId, ...diffStats(ops), ops };
}

/** A short plain summary of the edits for the agent: what was removed and what was added, blank lines skipped. */
export function summarizeDiff(ops: DiffOp[], maxChars = 2000): string {
  const parts: string[] = [];
  for (const op of ops) {
    if (op.op === "=") continue;
    const lines = op.lines.filter(l => l.trim());
    if (!lines.length) continue;
    const mark = op.op === "-" ? "-" : "+";
    parts.push(...lines.map(l => `${mark} ${l.trim()}`));
  }
  let text = "";
  for (const p of parts) {
    if (text.length + p.length + 1 > maxChars) { text += "\n(more edits not shown)"; break; }
    text += (text ? "\n" : "") + p;
  }
  return text;
}
