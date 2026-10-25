export type CommunityContent = {
  kind: "skill" | "workflow";
  title: string;
  description: string;
  author: string;
  license: "MIT" | "Apache-2.0" | "CC-BY-4.0";
  instructions: string;
  files: { path: string; content: string }[];
};
export type SafetyFinding = { rule: string; severity: "block" | "review"; file: string; line: number; message: string };
export type SafetyReport = { version: string; digest: string; checkedAt: string; findings: SafetyFinding[]; blocked: boolean };
export type CommunitySubmission = {
  id: string; owner: string; revision: number; status: "draft" | "pending" | "published" | "rejected";
  content: CommunityContent; scan: SafetyReport | null; note: string; actor: string;
  createdAt: string; updatedAt: string; publishedAt: string | null;
};
export type CommunityListing = { id: string; revision: number; kind: "skill" | "workflow"; title: string; description: string; author: string; license: string; publishedAt: string | null; stars?: number };
export const COMMUNITY_MAX_BYTES = 600_000;
export const COMMUNITY_MAX_FILES = 40;
export const COMMUNITY_FILE_BYTES = 100_000;
export const COMMUNITY_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const bytes = (s: string) => new TextEncoder().encode(s).length;
export function validateCommunityContent(value: unknown): CommunityContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Add your skill or workflow details.");
  const v = value as Record<string, unknown>;
  if (Object.keys(v).some(k => !["kind", "title", "description", "author", "license", "instructions", "files"].includes(k))) throw Error("Unexpected submission field.");
  const text = (key: string, min: number, max: number) => {
    const s = v[key];
    if (typeof s !== "string" || s.trim().length < min || s.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(s)) throw Error(`Check ${key} (${min}–${max} characters).`);
    return s.trim();
  };
  if (v.kind !== "skill" && v.kind !== "workflow") throw Error("Choose a skill or workflow.");
  if (!["MIT", "Apache-2.0", "CC-BY-4.0"].includes(v.license as string)) throw Error("Choose a sharing license.");
  if (!Array.isArray(v.files) || v.files.length > COMMUNITY_MAX_FILES) throw Error("Upload up to 40 supporting text files.");
  const seen = new Set<string>(["skill.md", "community.json", "safety.json", "community_readme.txt"]);
  const files = v.files.map(f => {
    if (!f || typeof f !== "object" || Object.keys(f).some(k => !["path", "content"].includes(k)) || typeof f.path !== "string" || typeof f.content !== "string") throw Error("Invalid supporting file.");
    const path = (f.path as string).toLowerCase() === "start_here.txt" ? "START_HERE.txt" : f.path as string, content = f.content as string;
    if (path.length > 160 || !/^[a-zA-Z0-9_./-]+\.(md|txt|json|yaml|yml|csv|py|js|mjs|ts|sh|ps1)$/i.test(path) || path.split("/").some(p => !p || p === "." || p === ".." || p.startsWith(".")) || seen.has(path.toLowerCase())) throw Error("Use unique, relative text-file paths. SKILL.md is reserved for the main instructions.");
    if (bytes(content) > COMMUNITY_FILE_BYTES || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(content)) throw Error("Each file must be UTF-8 text under 100 KB with no hidden control characters.");
    seen.add(path.toLowerCase()); return { path, content };
  });
  const result: CommunityContent = { kind: v.kind, title: text("title", 3, 100), description: text("description", 20, 1000), author: text("author", 2, 80), instructions: text("instructions", 30, 100_000), license: v.license as CommunityContent["license"], files };
  if (bytes(JSON.stringify(result)) > COMMUNITY_MAX_BYTES) throw Error("Keep the complete submission under 600 KB.");
  return result;
}
