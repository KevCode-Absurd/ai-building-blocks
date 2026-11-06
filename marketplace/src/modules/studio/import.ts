// Studio: start an agent from a trained pack. Owner: studio module.
//
// An approved expert downloads a training pack (<agent-id>-train.zip), trains it with their own AI (instructions.md),
// zips the folder and uploads it here: POST /api/studio/import?job_type_id=<id>, body = the zip (application/zip,
// at most 2 MB). The pack is checked, a draft studio agent is created through createStudioAgent (so the same job
// type rules apply), and its playbook is set through savePlaybook (playbook_source 'expert'). The whole pack is kept
// in studio_pack_imports. Uploading again for the same job updates that agent (new playbook, new pack row).
// The import counts for the interview and markup steps (service.ts stepStatus) and lets buildVersion run without
// studio examples or marks; the test bench against plain AI and ops review still apply in full before publishing.
//
// The playbook is composed from playbook.md, then "Rules I learned", then a short "How I work and write" from soul.md
// and personality.md, then the expert's knowledge (their "My know-how" first). It must fit the studio's 20,000
// characters: knowledge is trimmed first, then "How I work and write", then the playbook text. Rules are never trimmed.
import type { Env } from "../../env.ts";
import type { ExpertRow } from "../../core/access.ts";
import { requireApprovedExpert } from "../../core/access.ts";
import { all, first, newId, nowIso, parseJson } from "../../core/db.ts";
import { eventStatement } from "../../core/events.ts";
import { fail, HttpError, json, type Ctx } from "../../core/http.ts";
import { getJobType } from "../catalogue/index.ts";
import { readZip, ZipError } from "../packs/zip.ts";
import { SKILL_MIRRORS, TEMPLATE_MARKER, uploadedManifestSchema } from "../packs/format.ts";
import { looksLikeSecret } from "./package.ts";
import { LIMITS, addExample, createStudioAgent, getStudio, savePlaybook, type AgentSummary } from "./service.ts";

export const IMPORT_LIMITS = {
  /** The uploaded zip. */
  zipBytes: 2 * 1024 * 1024,
  /** One file, unzipped. */
  fileBytes: 200 * 1024,
  /** All files, unzipped. Keeps a studio_pack_imports row under D1's 2 MB row limit. */
  totalBytes: 1_500_000,
  entries: 300,
} as const;

const ZIP_TYPES = ["application/zip", "application/x-zip-compressed"];
const TEXT_FILE = /\.(md|json|txt|csv)$/i;
/** Files operating systems add to zips on their own. They are skipped, never stored. */
const OS_JUNK = /(^|\/)(__MACOSX\/|\.DS_Store$|Thumbs\.db$|desktop\.ini$)/i;
export const REQUIRED_FILES = ["pack.json", "soul.md", "personality.md", "playbook.md", "knowledge.md"] as const;
const BASE_METHOD = /base method: make it yours/i;

export interface PackImportResult {
  agentId: string;
  agent: AgentSummary;
  /** True when this upload updated the agent the expert started from an earlier pack for the same job. */
  updated: boolean;
  playbookChars: number;
  trimmed: string[];
  warnings: string[];
  /** Pack examples added as studio examples (only with examples_rights=1). */
  examplesAdded: number;
}

// ---------- Reading the upload ----------

/** The request body as bytes, refusing anything that is not a zip or is over the size limit. */
export async function readZipBody(req: Request, max: number = IMPORT_LIMITS.zipBytes): Promise<Uint8Array> {
  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!ZIP_TYPES.includes(type)) return fail(415, "zip_required", "Upload your pack as one .zip file (application/zip).");
  const tooBig = () => fail(413, "pack_too_large", `Your pack is too large. Zipped, it can be up to ${Math.round(max / 1024 / 1024)} MB.`);
  if (Number(req.headers.get("content-length") ?? 0) > max) return tooBig();
  if (!req.body) return fail(400, "empty_upload", "The upload was empty. Choose your pack's .zip file and try again.");
  const reader = req.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) { await reader.cancel().catch(() => {}); return tooBig(); }
    parts.push(value);
  }
  if (!total) return fail(400, "empty_upload", "The upload was empty. Choose your pack's .zip file and try again.");
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.byteLength; }
  return out;
}

const decoder = new TextDecoder("utf-8", { fatal: true });

/**
 * Unzips and checks a trained pack: zip limits, text files only, size per file, UTF-8, no secrets. A single top
 * folder (as in "seo-specialist-agent/") is removed so paths start at the pack root. Returns files in zip order.
 */
export async function readPackFiles(zip: Uint8Array): Promise<{ path: string; content: string }[]> {
  let entries;
  try {
    entries = await readZip(zip, { maxEntries: IMPORT_LIMITS.entries, maxTotalBytes: IMPORT_LIMITS.totalBytes, maxEntryBytes: IMPORT_LIMITS.fileBytes });
  } catch (err) {
    if (err instanceof ZipError) {
      const status = ["entry_too_large", "too_large", "too_many_entries"].includes(err.code) ? 413 : 400;
      return fail(status, err.code, err.message);
    }
    throw err;
  }
  let files = entries.filter(e => !OS_JUNK.test(e.path));
  if (!files.some(f => f.path === "pack.json")) {
    const tops = new Set(files.map(f => f.path.split("/")[0]));
    if (tops.size === 1 && files.every(f => f.path.includes("/"))) {
      const prefix = `${[...tops][0]}/`;
      files = files.map(f => ({ path: f.path.slice(prefix.length), data: f.data }));
    }
  }
  if (!files.length) return fail(400, "empty_pack", "Your zip has no files in it. Zip your pack folder and try again.");
  const out: { path: string; content: string }[] = [];
  for (const f of files) {
    if (!TEXT_FILE.test(f.path)) return fail(400, "file_type_not_allowed", `Your pack has a file we do not accept: ${f.path}. Packs can hold .md, .json, .txt and .csv files only. Remove it and zip the folder again.`);
    let content: string;
    try { content = decoder.decode(f.data); } catch { return fail(400, "not_utf8", `${f.path} is not plain UTF-8 text. Save it as UTF-8 and zip the folder again.`); }
    content = content.replace(/^\uFEFF/, "");
    if (looksLikeSecret(content)) return fail(400, "remove_secret", `${f.path} looks like it has a password or key in it. Remove it, then zip the folder and upload it again.`);
    out.push({ path: f.path, content });
  }
  return out;
}

// ---------- The playbook ----------

const stripComments = (md: string) => md.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n?/g, "\n");

/** Splits out one "## <title>" section (up to the next "## " heading). Title is matched as a regex, case-insensitive. */
function takeSection(md: string, title: RegExp): { section: string | null; rest: string } {
  const lines = md.split("\n");
  const start = lines.findIndex(l => /^##\s+/.test(l) && title.test(l.replace(/^##\s+/, "").trim()));
  if (start < 0) return { section: null, rest: md };
  let end = lines.findIndex((l, i) => i > start && /^##\s+/.test(l));
  if (end < 0) end = lines.length;
  return { section: lines.slice(start + 1, end).join("\n").trim(), rest: [...lines.slice(0, start), ...lines.slice(end)].join("\n") };
}

/** Removes the H1 and moves every heading down one level, so a file nests under one "## " section. */
function nest(md: string): string {
  return md.replace(/^#\s+.*\n?/m, "").replace(/^(#{1,5})(\s)/gm, "#$1$2").trim();
}

/** Cuts markdown to at most max characters at a paragraph (or line) boundary. Empty when nothing useful fits. */
function fitText(md: string, max: number): string {
  const text = md.trim();
  if (text.length <= max) return text;
  if (max < 120) return "";
  const cut = text.slice(0, max);
  const at = Math.max(cut.lastIndexOf("\n\n"), cut.lastIndexOf("\n"));
  const out = (at > max * 0.5 ? cut.slice(0, at) : cut.replace(/\s+\S*$/, "")).trim();
  // Headings alone are not worth keeping.
  return out.split("\n").some(l => l.trim() && !/^#{1,6}\s/.test(l)) ? out : "";
}

/**
 * The studio playbook from a trained pack, within max characters. Order: playbook.md (without its rules), "Rules I
 * learned", "How I work and write" (soul.md and personality.md, short), "What I know" (knowledge.md, "My know-how"
 * or "My specialty" first). Trims knowledge first, then how I work and write, then the playbook; never the rules.
 */
export function composePlaybook(files: { playbook: string; soul: string; personality: string; knowledge: string }, max: number = LIMITS.playbookChars): { playbook: string; trimmed: string[] } {
  const split = takeSection(stripComments(files.playbook), /^rules i learned$/i);
  const body = split.rest.trim();
  const rules = split.section ? `## Rules I learned\n\n${split.section}` : "";
  const how = ["## How I work and write", nest(stripComments(files.soul)), nest(stripComments(files.personality))].filter(Boolean).join("\n\n");
  const k = stripComments(files.knowledge);
  const own = takeSection(k, /^my know-how$/i).section !== null ? takeSection(k, /^my know-how$/i) : takeSection(k, /^my specialty$/i);
  const knowledge = ["## What I know", own.section ? `### My know-how\n\n${own.section.replace(/^(#{2,5})(\s)/gm, "#$1$2")}` : "", nest(own.rest)].filter(Boolean).join("\n\n");

  const parts = { body, rules, how: fitText(how, 3000), knowledge };
  const trimmed: string[] = [];
  if (parts.how !== how.trim()) trimmed.push("how_i_work_and_write");
  const SEP = 2; // "\n\n" between parts
  const size = () => [parts.body, parts.rules, parts.how, parts.knowledge].filter(Boolean).reduce((n, p, i) => n + p.length + (i ? SEP : 0), 0);
  const shrink = (key: "knowledge" | "how" | "body", label: string, floor = "") => {
    const over = size() - max;
    if (over <= 0) return;
    const before = parts[key];
    const next = fitText(before, before.length - over - SEP);
    parts[key] = next.length > floor.length ? next : floor;
    if (parts[key] !== before && !trimmed.includes(label)) trimmed.push(label);
  };
  shrink("knowledge", "knowledge");
  shrink("how", "how_i_work_and_write");
  shrink("body", "playbook");
  if (size() > max) return fail(413, "rules_too_long", `Your "Rules I learned" section is too long for the studio's ${max.toLocaleString("en-US")}-character playbook. Merge or shorten the rules, then upload again.`);
  return { playbook: [parts.body, parts.rules, parts.how, parts.knowledge].filter(Boolean).join("\n\n"), trimmed };
}

// ---------- The import ----------

const encoder = new TextEncoder();

async function sha256Bytes(bytes: Uint8Array): Promise<string> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const digest = await crypto.subtle.digest("SHA-256", copy);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

const isTemplate = (text: string) => text.replace(/^\uFEFF/, "").trimStart().startsWith(TEMPLATE_MARKER);

export async function importTrainedPack(env: Env, input: { expert: ExpertRow; actor: string; jobTypeId: string; zip: Uint8Array; examplesRights?: boolean }): Promise<PackImportResult> {
  const files = await readPackFiles(input.zip);
  const byPath = new Map(files.map(f => [f.path, f.content]));
  const missing = REQUIRED_FILES.filter(p => !byPath.get(p)?.trim());
  if (missing.length) return fail(400, "pack_incomplete", `Your pack is missing ${missing.join(", ")} at the top of the folder. Zip the whole trained pack folder and upload it again.`);

  let manifestRaw: unknown;
  try { manifestRaw = JSON.parse(byPath.get("pack.json")!); } catch { return fail(400, "invalid_pack_json", "pack.json is not valid JSON. Ask your training coach to fix it, then upload again."); }
  const parsed = uploadedManifestSchema.safeParse(manifestRaw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail(400, "invalid_pack_json", `pack.json is not an AI Blocks pack manifest (${issue.path.join(".") || "file"}: ${issue.message}). Start from a training pack downloaded from AI Blocks.`);
  }
  const manifest = parsed.data;
  if (manifest.kind !== "train") return fail(400, "not_a_training_pack", "This is an agent pack, not a trained training pack. Download the training pack, train it, then upload that.");
  for (const p of ["soul.md", "personality.md"] as const) {
    if (isTemplate(byPath.get(p)!)) return fail(400, "pack_not_trained", `${p} is still the blank template. Finish training with instructions.md so your coach writes it, then upload again.`);
  }
  if (!manifest.job_types.includes(input.jobTypeId)) {
    const titles = manifest.job_types.map(id => getJobType(id)?.title ?? id);
    return fail(400, "job_type_not_in_pack", `Your pack is not set up for that job. It lists: ${titles.join(", ")}. Choose one of those.`);
  }

  const { playbook, trimmed } = composePlaybook({
    playbook: byPath.get("playbook.md")!, soul: byPath.get("soul.md")!, personality: byPath.get("personality.md")!, knowledge: byPath.get("knowledge.md")!,
  });
  if (playbook.trim().length < 100) return fail(400, "playbook_too_short", "Your playbook.md is almost empty. Finish training so it says how you work, then upload again.");

  // What is stored. Every hash is worked out here; the hashes listed in the uploaded pack.json are never trusted.
  // examples/ is the expert's past work: kept apart from the rest, for review and testing only, never shown or shared.
  // The zip's .agents/skills and .claude/skills copies are dropped when they match skills/ (they are rebuilt from it).
  const withHashes = await Promise.all(files.map(async f => {
    const bytes = encoder.encode(f.content);
    return { path: f.path, bytes: bytes.byteLength, sha256: await sha256Bytes(bytes), content: f.content };
  }));
  const mirrorOf = (p: string) => SKILL_MIRRORS.find(m => p.startsWith(m));
  const keep = withHashes.filter(f => {
    const m = mirrorOf(f.path);
    return !m || byPath.get(`skills/${f.path.slice(m.length)}`) !== f.content;
  });
  const examples = keep.filter(f => f.path.startsWith("examples/"));
  const packFiles = keep.filter(f => !f.path.startsWith("examples/"));
  const stored = JSON.stringify(packFiles), storedExamples = JSON.stringify(examples);
  if (stored.length + storedExamples.length > 1_900_000) return fail(413, "pack_too_large", "Your pack is too large to store. Remove large files such as long examples, then upload again.");
  const warnings: string[] = [];
  const marked = (byPath.get("playbook.md")!.match(new RegExp(BASE_METHOD.source, "gi")) ?? []).length;
  if (marked) warnings.push(`playbook.md still has ${marked} section${marked === 1 ? "" : "s"} marked "base method: make it yours". Edit them in your playbook if they are not how you work.`);
  if (trimmed.length) warnings.push(`Your pack was longer than the studio's ${LIMITS.playbookChars.toLocaleString("en-US")}-character playbook, so we shortened: ${trimmed.join(", ").replace(/_/g, " ")}. Your rules were kept in full.`);

  // Re-uploading for the same job updates the agent this expert already started from a pack: a new playbook save and
  // a new pack row. Otherwise the studio's own path: createStudioAgent checks the job is approved for this expert and
  // that they have no other agent for it (an agent built in the studio is not overwritten by a pack: that is a 409).
  const previous = await first<{ id: string }>(env.DB,
    `SELECT a.id FROM agents a WHERE a.expert_id = ? AND a.job_type_id = ? AND a.kind = 'expert' AND a.status != 'retired'
       AND EXISTS (SELECT 1 FROM studio_pack_imports i WHERE i.agent_id = a.id) ORDER BY a.created_at DESC LIMIT 1`, input.expert.id, input.jobTypeId);
  if (previous && !parseJson<string[]>(input.expert.job_types, []).includes(input.jobTypeId)) {
    return fail(403, "job_type_not_approved", "You can build agents only for the jobs you were approved for. To add another job, contact us.");
  }
  const agentId = previous?.id ?? (await createStudioAgent(env, { expert: input.expert, actor: input.actor, jobTypeId: input.jobTypeId })).id;
  await savePlaybook(env, { expertId: input.expert.id, actor: input.actor, agentId, playbook });
  const sha256 = await sha256Bytes(input.zip), now = nowIso(), db = env.DB;
  await db.batch([
    db.prepare("INSERT INTO studio_pack_imports (id, agent_id, files, examples, examples_rights, sha256, bytes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(newId("pack"), agentId, stored, storedExamples, input.examplesRights ? 1 : 0, sha256, input.zip.byteLength, now),
    eventStatement(db, { actor: input.actor, actorKind: "expert", entity: "agent", entityId: agentId, type: "studio.pack_imported", data: {
      job_type_id: input.jobTypeId, update: !!previous, sha256, bytes: input.zip.byteLength, files: packFiles.length, examples: examples.length,
      examples_rights: !!input.examplesRights, playbook_chars: playbook.length, trimmed,
      trained_by: manifest.trained_by ?? null, based_on: manifest.based_on ?? (manifest.agent_id ? { agent_id: manifest.agent_id } : null),
    } }, now),
  ]);

  // Pack examples become studio examples only when the expert confirmed their rights at upload. Each goes through
  // addExample, so the studio's own checks and limits apply; one that does not fit is skipped with a note.
  let examplesAdded = 0;
  if (input.examplesRights) {
    const have = await all<{ title: string; result: string }>(env.DB, "SELECT title, result FROM studio_examples WHERE agent_id = ?", agentId);
    for (const ex of examples.filter(e => !/^examples\/readme\.md$/i.test(e.path) && /\.md$/i.test(e.path))) {
      const parsedEx = exampleFromMarkdown(ex.path, ex.content);
      if (typeof parsedEx === "string") { warnings.push(parsedEx); continue; }
      if (have.some(h => h.title === parsedEx.title && h.result === parsedEx.result)) continue;
      try {
        await addExample(env, { expertId: input.expert.id, actor: input.actor, agentId, body: { ...parsedEx, rightsConfirmed: true } });
        have.push(parsedEx);
        examplesAdded++;
      } catch (err) {
        if (!(err instanceof HttpError)) throw err;
        warnings.push(`${ex.path} was not added as a studio example: ${err.message}`);
      }
    }
  } else if (examples.some(e => !/^examples\/readme\.md$/i.test(e.path))) {
    warnings.push("Your examples were kept private for our review only. To teach your agent with them, upload again with the box ticked that says you own them or may use them, and that names are taken out.");
  }
  const { agent } = await getStudio(env, { expertId: input.expert.id, agentId });
  return { agentId, agent, updated: !!previous, playbookChars: playbook.length, trimmed, warnings, examplesAdded };
}

/**
 * A pack example (the shape in packs/shared/train/examples-README.md) as studio example fields, or the reason it
 * cannot be one. "## The brief" and "## What I delivered" are needed; "Rights:" picks own work or client permission.
 */
export function exampleFromMarkdown(path: string, md: string): { title: string; brief: string; audience: string; result: string; notes: string; rights: "own_work" | "client_permission" } | string {
  const text = stripComments(md);
  const section = (title: RegExp) => takeSection(text, title).section?.trim() ?? "";
  const title = (/^#\s+(.+)$/m.exec(text)?.[1] ?? path.split("/").pop()!.replace(/\.md$/i, "").replace(/[-_]+/g, " ")).trim().slice(0, 120);
  const brief = section(/^the brief$/i);
  const result = section(/^what i delivered$/i);
  if (!brief || !result) return `${path} was not added as a studio example: it needs a "## The brief" and a "## What I delivered" section.`;
  const audience = section(/^(who it was for|audience|the client)$/i) || "As described in the brief.";
  const notes = [section(/^what made it good$/i), section(/^the result$/i) && `Result: ${section(/^the result$/i)}`].filter(Boolean).join("\n\n").slice(0, 1000);
  const rights = /^rights:.*client/im.test(text) ? "client_permission" : "own_work";
  return { title, brief, audience: audience.slice(0, 300), result, notes, rights };
}

/**
 * POST /api/studio/import?job_type_id=<id>[&examples_rights=1], body = the trained pack's zip. Approved experts only.
 * examples_rights=1 is the expert's confirmation that they own the pack's examples or may use them, and that they are
 * anonymised; only then do the examples become studio examples. 201 for a new agent, 200 when it updated one.
 */
export async function importPackRoute(ctx: Ctx): Promise<Response> {
  const a = await requireApprovedExpert(ctx);
  const jobTypeId = (ctx.url.searchParams.get("job_type_id") ?? "").trim();
  if (!jobTypeId) return fail(400, "job_type_required", "Choose the job this agent is for, then upload your pack.");
  if (jobTypeId.length > 80) return fail(400, "unknown_job_type", "Pick a job from the menu.");
  const examplesRights = ctx.url.searchParams.get("examples_rights") === "1";
  const zip = await readZipBody(ctx.req);
  const result = await importTrainedPack(ctx.env, { expert: a.expert, actor: a.user.id, jobTypeId, zip, examplesRights });
  return json(result, result.updated ? 200 : 201);
}
