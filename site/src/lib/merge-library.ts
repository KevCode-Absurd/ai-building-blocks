import { LIBRARY_KEYS, validateLibrary, type LibraryData } from "./library-data.ts";
import { WORK_KEY, mergeWork } from "./saved-work-data.ts";

const object = (value: any): value is Record<string, any> => !!value && typeof value === "object" && !Array.isArray(value);
const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical) : object(value) ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
export const sameSavedValue = (a: any, b: any) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
export class LibraryMergeConflict extends Error {
  constructor() { super("Both devices edited the same part of your work. Both copies are safe. Open saving settings to review your device copy before loading the account copy."); }
}

function order(base: string[], local: string[], remote: string[], retained: Set<string>): string[] {
  const common = new Set(base.filter(id => retained.has(id) && local.includes(id) && remote.includes(id)));
  const sequence = (ids: string[]) => ids.filter(id => common.has(id));
  const b = sequence(base), l = sequence(local), r = sequence(remote);
  const leftChanged = !sameSavedValue(b, l), rightChanged = !sameSavedValue(b, r);
  if (leftChanged && rightChanged && !sameSavedValue(l, r)) throw new LibraryMergeConflict();
  const primary = leftChanged ? local : remote, secondary = leftChanged ? remote : local;
  const result = primary.filter(id => retained.has(id));
  for (let i = 0; i < secondary.length; i++) {
    const id = secondary[i]; if (!retained.has(id) || result.includes(id)) continue;
    const previous = secondary.slice(0, i).reverse().find(key => result.includes(key));
    const next = secondary.slice(i + 1).find(key => result.includes(key));
    if (previous && next && result.indexOf(previous) > result.indexOf(next)) throw new LibraryMergeConflict();
    if (next) result.splice(result.indexOf(next), 0, id);
    else result.push(id);
  }
  return result;
}

function merge(base: any, local: any, remote: any, field = ""): any {
  if (sameSavedValue(local, base) || sameSavedValue(local, remote)) return remote;
  if (sameSavedValue(remote, base)) return local;
  if (field === "updated" && typeof local === "number" && typeof remote === "number") return Math.max(local, remote);
  if (object(local) && object(remote) && (base === undefined || object(base))) {
    const result: Record<string, any> = Object.create(null);
    for (const key of new Set([...Object.keys(remote), ...Object.keys(local), ...Object.keys(base ?? {})])) {
      const own = (value: any) => value && Object.hasOwn(value, key) ? value[key] : undefined;
      const value = merge(own(base), own(local), own(remote), key);
      if (value !== undefined) result[key] = value;
    }
    return result;
  }
  if (Array.isArray(local) && Array.isArray(remote) && (base === undefined || Array.isArray(base))) {
    const original: any[] = base ?? [];
    if ([...original, ...local, ...remote].every(value => typeof value === "string")) {
      const removed = new Set(original.filter(value => !local.includes(value) || !remote.includes(value)));
      const retained = new Set([...remote, ...local].filter(value => !removed.has(value)));
      return field === "recent" ? [...retained] : order(original, local, remote, retained);
    }
    const all = [...original, ...local, ...remote];
    const identity = all.every(value => object(value) && typeof value.id === "string") ? "id" : all.every(value => object(value) && typeof value.slug === "string") ? "slug" : null;
    if (identity) {
      const map = (items: any[]) => { const entries = new Map(items.map(value => [value[identity], value])); if (entries.size !== items.length) throw new LibraryMergeConflict(); return entries; };
      const b = map(original), l = map(local), r = map(remote), values = new Map<string, any>();
      for (const id of new Set([...r.keys(), ...l.keys(), ...b.keys()])) {
        const value = merge(b.get(id), l.get(id), r.get(id));
        if (value !== undefined) values.set(id, value);
      }
      return order([...b.keys()], [...l.keys()], [...r.keys()], new Set(values.keys())).map(id => values.get(id));
    }
  }
  // A deletion versus an edit, or two different edits to one scalar, needs a person.
  throw new LibraryMergeConflict();
}

/** Three-way merge uses the last acknowledged account copy, never timestamps as last-write-wins. */
export function mergeLibraries(base: LibraryData, local: LibraryData, remote: LibraryData): LibraryData {
  const result: LibraryData = {};
  for (const key of LIBRARY_KEYS) {
    if (local[key] === base[key] || local[key] === remote[key]) { if (remote[key] !== undefined) result[key] = remote[key]; continue; }
    if (remote[key] === base[key]) { if (local[key] !== undefined) result[key] = local[key]; continue; }
    // Calculator numbers and opened specialists: the newest entry wins, so they never block saving.
    if (key === WORK_KEY) { const value = mergeWork(remote[key], local[key]); if (value !== undefined) result[key] = value; continue; }
    const parse = (raw: string | undefined) => raw === undefined ? undefined : JSON.parse(raw);
    const value = merge(parse(base[key]), parse(local[key]), parse(remote[key]));
    if (value !== undefined) result[key] = JSON.stringify(value);
  }
  return validateLibrary(result);
}
