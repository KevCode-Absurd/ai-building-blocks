import { validateLibrary, type LibraryData } from "./library-data.ts";
import { WORK_KEY, mergeWork } from "./saved-work-data.ts";

export type BrowserSave = { id: string; capturedAt: number; data: LibraryData };
type Entry = Record<string, any>;
const empty = () => ({ kits: [], flows: [], recent: [], currentFlow: null, draft: null } as Entry);
const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (a: Entry, b: Entry) => {
  const { id: _a, ...left } = a, { id: _b, ...right } = b;
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
};
export function browserSaves(data: LibraryData): BrowserSave[] {
  try { const state = JSON.parse(data["abb:v1"] ?? "{}"); return Array.isArray(state.browserSaves) ? state.browserSaves.filter((entry: BrowserSave) => typeof entry?.id === "string" && entry.data && typeof entry.data === "object") : []; } catch { return []; }
}
const sameData = (a: LibraryData, b: LibraryData) => JSON.stringify(canonical(Object.fromEntries(Object.entries(a).map(([key, raw]) => [key, JSON.parse(raw)])))) === JSON.stringify(canonical(Object.fromEntries(Object.entries(b).map(([key, raw]) => [key, JSON.parse(raw)]))));

/** Add only. Keep the account's current draft/details; retain the complete browser copy as a receipt. */
export function mergeSignUpSaves(account: LibraryData, incoming: BrowserSave): LibraryData {
  if (browserSaves(account).some(save => save.id === incoming.id)) return account;
  const guest = validateLibrary(incoming.data), result = { ...account };
  const history = browserSaves(account);
  // A fresh sign-in has a new nonce. Recognize already transferred content too.
  if (history.some(save => sameData(save.data, guest))) return account;
  const previous = history.map(save => JSON.parse(save.data["abb:v1"] ?? "null") ?? empty());
  const remote = JSON.parse(account["abb:v1"] ?? "null") ?? empty();
  const local = JSON.parse(guest["abb:v1"] ?? "null") ?? empty();
  for (const field of ["kits", "flows"]) {
    const merged: Entry[] = [...remote[field]];
    for (const entry of local[field]) {
      // Do not restore an old browser item that was deliberately deleted or edited in the account.
      if (previous.some(saved => saved[field].some((value: Entry) => same(value, entry)))) continue;
      if (merged.some(value => same(value, entry))) continue;
      merged.push(merged.some(value => value.id === entry.id) ? { ...entry, id: crypto.randomUUID() } : entry);
    }
    remote[field] = merged;
  }
  const oldDraft = local.draft && previous.some(saved => saved.draft && same(saved.draft, local.draft));
  if (!oldDraft && !remote.draft && local.draft) remote.draft = local.draft;
  else if (!oldDraft && local.draft && !same(remote.draft, local.draft) && !remote.flows.some((flow: Entry) => same(flow, local.draft))) remote.flows.push({ ...local.draft, id: crypto.randomUUID() });
  remote.recent = [...new Set([...remote.recent, ...local.recent])];
  // This also preserves alternate planner/context/council data without replacing the active account copy.
  remote.browserSaves = [...browserSaves(account), { ...incoming, data: guest }];
  result["abb:v1"] = JSON.stringify(remote);
  for (const [key, raw] of Object.entries(guest)) if (result[key as keyof LibraryData] === undefined) result[key as keyof LibraryData] = raw;
  if (guest[WORK_KEY] && account[WORK_KEY]) result[WORK_KEY] = mergeWork(account[WORK_KEY], guest[WORK_KEY]);
  return validateLibrary(result);
}
