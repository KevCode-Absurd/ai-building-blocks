// Stable storage names are independent of the deployed release/version.
export const LIBRARY_KEYS = ["abb:v1", "abb:business", "abb:composer", "aib-council-draft"] as const;
export type LibraryData = Partial<Record<typeof LIBRARY_KEYS[number], string>>;
export type Library = { data: LibraryData; revision: number };
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === "string");
function validFlow(v: unknown): boolean {
  if (!record(v) || typeof v.id !== "string" || typeof v.name !== "string" || !Array.isArray(v.nodes) || !Array.isArray(v.edges)) return false;
  return v.nodes.every(n => record(n) && typeof n.id === "string" && typeof n.slug === "string") && v.edges.every(e => record(e) && typeof e.id === "string" && typeof e.from === "string" && typeof e.to === "string");
}
export function validateLibrary(value: unknown): LibraryData {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Invalid library");
  const data: LibraryData = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!LIBRARY_KEYS.includes(key as typeof LIBRARY_KEYS[number]) || typeof raw !== "string") throw Error("Invalid library entry");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw Error("Invalid saved data");
    if (key === "abb:v1" && (!Array.isArray(parsed.kits) || !parsed.kits.every((k: unknown) => record(k) && typeof k.id === "string" && typeof k.name === "string" && strings(k.slugs)) || !Array.isArray(parsed.flows) || !parsed.flows.every(validFlow) || !strings(parsed.recent) || parsed.draft != null && !validFlow(parsed.draft))) throw Error("Invalid kits and workflows");
    if (key === "abb:business" && (!record(parsed) || !Object.values(parsed).every(v => typeof v === "string"))) throw Error("Invalid context");
    if (key === "aib-council-draft" && !strings(parsed)) throw Error("Invalid council");
    data[key as keyof LibraryData] = raw;
  }
  return data;
}
