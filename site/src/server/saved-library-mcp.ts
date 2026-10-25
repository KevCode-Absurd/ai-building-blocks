import { Inflate } from "fflate";
import type { LibraryStore } from "./account-library.ts";
import type { MindStore } from "./account-minds.ts";
import { CompanyMcpService, companyMcpTools } from "./company-mcp.ts";
import { memorySpaces, type ItemRow, type SpaceStore } from "./spaces.ts";
import { PublicApiError } from "./public-catalogue.ts";
import { customMindMarkdown, validateCustomMinds } from "../lib/custom-minds.ts";
import { sha256 } from "../lib/workflow-execution.ts";
import { validateLibrary, type LibraryData } from "../lib/library-data.ts";

type Dict = Record<string, unknown>;
type PublicService = { callTool(name: string, args: unknown): Promise<unknown> };
export type SavedLibraryMcpOptions = { userId: string; publicService?: PublicService; spaces?: SpaceStore; minds?: MindStore };
const obj = (v: unknown): v is Dict => !!v && typeof v === "object" && !Array.isArray(v);
const fail = (status: number, code: string, message: string): never => { throw new PublicApiError(status, code, message); };
const names: Record<string, string> = { list_saved_items: "list_company_items", get_saved_item: "get_company_item", get_saved_resource: "get_company_resource", prepare_saved_workflow: "prepare_company_workflow" };
const reverseNames = Object.fromEntries(Object.entries(names).map(([saved, company]) => [company, saved]));
export const savedLibraryMcpTools = companyMcpTools.map(tool => ({ ...tool, name: reverseNames[tool.name], description: tool.description.replaceAll("company workspace", "personal saved library").replaceAll("company", "saved personal") }));
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const remap = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(remap);
  if (!obj(v)) return v;
  return Object.fromEntries(Object.entries(v).map(([key, value]) => [key, key === "tool" && typeof value === "string" && reverseNames[value] ? reverseNames[value] : key === "trust" && value === "untrusted-company-authored-source" ? "untrusted-saved-personal-source" : remap(value)]));
};

/** Decode the existing packFlow format without importing browser storage or changing steps. */
function packedFlow(code: unknown): Dict {
  if (typeof code !== "string" || code.length > 200000 || !/^[A-Za-z0-9_-]+$/.test(code)) throw Error("Invalid saved graph");
  const input = Uint8Array.from(atob(code.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
  const chunks: Uint8Array[] = []; let total = 0;
  const inflate = new Inflate(chunk => { total += chunk.length; if (total > 1_048_576) throw Error("Expanded saved graph is too large"); chunks.push(chunk); });
  for (let at = 0; at < input.length; at += 512) inflate.push(input.subarray(at, at + 512), at + 512 >= input.length);
  const bytes = new Uint8Array(total); let at = 0; for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.length; }
  const d = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  if (!obj(d) || d.v !== 1 || !Array.isArray(d.s) || d.s.length > 40 || d.s.some(s => typeof s !== "string") || !Array.isArray(d.p) || d.p.length !== d.s.length || !Array.isArray(d.e)) throw Error("Incomplete saved graph");
  const slugs = d.s as string[], positions = d.p as unknown[];
  const vector = (key: string) => { if (d[key] !== undefined && (!Array.isArray(d[key]) || d[key].length > slugs.length)) throw Error("Invalid saved graph vector"); return (d[key] ?? []) as unknown[]; };
  const roles = vector("r"), notes = vector("o"), mind = vector("k"), minds = vector("ks"), bindings = vector("b");
  const nodes = slugs.map((slug, index) => {
    const p = positions[index]; if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite)) throw Error("Invalid saved graph layout");
    const assigned = bindings[index];
    if (assigned !== undefined && !Array.isArray(assigned)) throw Error("Invalid saved graph bindings");
    return { id: `s${index}`, slug, x: p[0] * 10, y: p[1] * 10, ...(roles[index] ? { role: roles[index] } : {}), ...(notes[index] ? { notes: notes[index] } : {}), ...(mind[index] ? { mind: mind[index] } : {}), ...(minds[index] ? { minds: minds[index] } : {}), ...(Array.isArray(d.m) && d.m.includes(index) ? { ecommerce: true } : {}), ...(Array.isArray(assigned) ? { bindings: assigned.map(b => { if (!obj(b) || !Number.isInteger(b.f) || Number(b.f) < 0 || Number(b.f) >= slugs.length) throw Error("Invalid saved graph binding"); return { type: b.t, from: `s${b.f}`, instruction: b.i }; }) } : {}) };
  });
  const edges = d.e.map((pair, index) => { if (!Array.isArray(pair) || pair.length !== 2 || pair.some(n => !Number.isInteger(n) || n < 0 || n >= nodes.length)) throw Error("Invalid saved graph edge"); return { id: `e${index}`, from: `s${pair[0]}`, to: `s${pair[1]}` }; });
  return { nodes, edges, name: d.n, goal: d.g, notes: d.gn, customSkills: d.cs, customMinds: d.cm, governingSkills: d.gs, overseer: d.ov, ...(d.t !== undefined ? { team: { minds: d.t, mode: d.tm ?? "split" } } : {}) };
}

/** Map the already-saved composition deterministically; never call its paid composer. */
function compositionData(source: unknown): Dict {
  if (!obj(source) || source.format !== "ai-blocks-composition/1") return { composition_source: source };
  if (source.flowCode !== undefined) {
    try { return { ...packedFlow(source.flowCode), composition_source: source }; }
    catch { return { composition_source: source, preparation_blocker: "The saved edited graph cannot be reconstructed completely. Do not fall back to its older composition plan." }; }
  }
  const plan = source.plan;
  if (!obj(plan) || !Array.isArray(plan.steps) || !Array.isArray(plan.dependencies) || plan.steps.length > 40 || !Array.isArray(plan.bindings)) return { composition_source: source };
  try {
    const steps = plan.steps;
    const nodes = steps.map((step, index) => {
      if (!obj(step) || typeof step.slug !== "string" || typeof step.reason !== "string" || typeof step.notes !== "string") throw Error();
      const bindings = (plan.bindings as unknown[]).filter(b => obj(b) && b.step === index + 1).map(b => { if (!obj(b) || !Number.isInteger(b.from) || Number(b.from) < 1 || Number(b.from) > steps.length) throw Error(); return { type: b.type, from: `s${Number(b.from) - 1}`, instruction: b.instruction }; });
      return { id: `s${index}`, slug: step.slug, x: 40 + index % 3 * 360, y: 110 + Math.floor(index / 3) * 190, notes: [step.reason, step.notes, ...bindings.map(b => `Read ${b.from} as ${b.type}: ${b.instruction}`)].filter(Boolean).join("\n\n"), bindings };
    });
    const edges = (plan.dependencies as unknown[]).map((pair, index) => { if (!Array.isArray(pair) || pair.length !== 2 || pair.some(n => !Number.isInteger(n) || n < 0 || n >= nodes.length)) throw Error(); return { id: `e${index}`, from: `s${pair[0]}`, to: `s${pair[1]}` }; });
    return { name: plan.title, goal: source.goal, notes: [plan.summary, ...(Array.isArray(plan.assumptions) ? plan.assumptions : []), source.context && `Additional user context:\n${source.context}`].filter(Boolean).join("\n\n"), customSkills: source.customSkills, nodes, edges, composition_source: source };
  } catch { return { composition_source: source, preparation_blocker: "The saved composition graph is incomplete; preserve and review its source before execution." }; }
}

/** Account identity is supplied only by the delegated-token wrapper, never tool arguments. */
export class SavedLibraryMcpService {
  private store: LibraryStore;
  private options: SavedLibraryMcpOptions;
  constructor(store: LibraryStore, options: SavedLibraryMcpOptions) { this.store = store; this.options = options; }

  private async snapshot() {
    const user = this.options.userId;
    if (!user || typeof user !== "string") return fail(401, "authentication_required", "Sign in to connect your saved library.");
    const [library, personalSpace, profiles] = await Promise.all([this.store.get(user), this.options.spaces?.spaceByUser(user), this.options.minds?.get(user)]);
    let data: LibraryData;
    try { data = validateLibrary(library.data); if (new TextEncoder().encode(JSON.stringify(data)).length > 4_000_000) throw Error(); }
    catch { return fail(503, "saved_library_invalid", "Your saved account library needs review. Its source has not been changed."); }
    const snapshot = memorySpaces(), spaceId = "authenticated-personal-saved-library";
    await snapshot.addSpace({ id: spaceId, name: "My saved library", created: "1970-01-01T00:00:00.000Z", updated: String(library.revision), userId: user, ownerHash: "", shareToken: "", ipHash: "", access: { mode: "invited", emails: [], domain: "" } });
    const sources = new Map<string, string>();
    const origins = new Map<string, { workflow_item_id: string; workflow_title: string; skill_slug: string }>();
    const accountMinds = profiles ? validateCustomMinds(profiles.minds) : [];
    const mindsBySlug = new Map(accountMinds.map(m => [m.slug, m]));
    const add = async (source: string, rawId: string, kind: ItemRow["kind"], title: string, value: unknown, body = "", updated: unknown = 0, summary = "") => {
      const itemId = `saved-${await sha256(new TextEncoder().encode(`${source}\0${rawId}`))}`;
      if (sources.has(itemId)) return fail(503, "saved_library_duplicate", "The saved library contains duplicate identifiers. Review it before reuse.");
      sources.set(itemId, source);
      let portable = clone(value);
      if ((kind === "workflow" || kind === "agent") && obj(portable) && (portable.customMinds === undefined || Array.isArray(portable.customMinds))) {
        const selected = new Set<unknown>();
        const nodes = Array.isArray(portable.nodes) ? portable.nodes : [];
        for (const node of nodes) if (obj(node)) { selected.add(node.slug); selected.add(node.mind); if (Array.isArray(node.minds)) node.minds.forEach(s => selected.add(s)); }
        selected.add(portable.overseer);
        if (obj(portable.team) && Array.isArray(portable.team.minds)) portable.team.minds.forEach(s => selected.add(s));
        const embedded = (portable.customMinds ?? []) as unknown[];
        const embeddedSlugs = new Set(embedded.filter(obj).map(m => m.slug));
        const resolved = accountMinds.filter(m => selected.has(m.slug) && !embeddedSlugs.has(m.slug));
        if (resolved.length) {
          portable.customMinds = [...embedded, ...resolved];
          portable.saved_profile_resolution = await Promise.all(resolved.map(async m => ({ slug: m.slug, source: "account-minds", revision_sha256: await sha256(new TextEncoder().encode(JSON.stringify(m))), original_embedding: "absent", precedence: "Existing embedded profiles remain authoritative." })));
        }
      }
      await snapshot.addItem({ id: itemId, spaceId, kind, title, body, data: portable, summary, visibility: "private", hidden: false, created: "1970-01-01T00:00:00.000Z", updated: String(updated) });
      if ((kind === "workflow" || kind === "agent") && obj(portable) && Array.isArray(portable.customSkills)) {
        if (portable.customSkills.length > 8) return fail(503, "saved_library_invalid", "A saved workflow contains too many custom skills to index safely.");
        for (const skill of portable.customSkills) {
          if (!obj(skill) || typeof skill.slug !== "string" || !/^custom-[a-z0-9-]{1,70}$/.test(skill.slug) || typeof skill.name !== "string" || typeof skill.markdown !== "string") return fail(503, "saved_library_invalid", "A saved custom skill needs review before it can be reused.");
          const prefix = `skills/${skill.slug}/`;
          const files = obj(portable.files) ? Object.fromEntries(Object.entries(portable.files).filter(([path]) => path.startsWith(prefix) && path !== `${prefix}SKILL.md`).map(([path, content]) => [path.slice(prefix.length), content])) : {};
          const embeddedId = await add(`${source}/embedded-skills/${rawId}`, skill.slug, "skill", skill.name, { custom_skill: skill, files, saved_origin: { workflow_item_id: itemId, workflow_title: title, skill_slug: skill.slug } }, skill.markdown, updated, typeof skill.summary === "string" ? skill.summary : "Custom skill embedded in a saved workflow.");
          origins.set(embeddedId, { workflow_item_id: itemId, workflow_title: title, skill_slug: skill.slug });
        }
      }
      return itemId;
    };
    const index = async (entries: LibraryData, prefix: string, depth = 0): Promise<void> => {
      if (depth > 5) return fail(503, "saved_library_nested", "Saved browser receipts are nested too deeply to index safely.");
      const state = JSON.parse(entries["abb:v1"] ?? "{}");
      for (const [i, kit] of (Array.isArray(state.kits) ? state.kits : []).entries()) {
        if (!obj(kit) || typeof kit.id !== "string" || typeof kit.name !== "string") return fail(503, "saved_library_invalid", "A saved kit needs review.");
        await add(`${prefix}/kits`, kit.id, "kit", kit.name, kit, "", kit.updated, `Saved kit ${i + 1}`);
      }
      for (const flow of Array.isArray(state.flows) ? state.flows : []) {
        if (!obj(flow) || typeof flow.id !== "string" || typeof flow.name !== "string") return fail(503, "saved_library_invalid", "A saved workflow needs review.");
        await add(`${prefix}/workflows`, flow.id, flow.kind === "agent" || flow.type === "agent" ? "agent" : "workflow", flow.name, flow, "", flow.updated);
      }
      if (obj(state.draft)) await add(`${prefix}/draft`, String(state.draft.id), "workflow", typeof state.draft.name === "string" ? state.draft.name : "Saved workflow draft", state.draft, "", state.draft.updated, "Current saved builder draft; no execution is implied.");
      if (entries["abb:composer"]) {
        const composition: unknown = JSON.parse(entries["abb:composer"]);
        await add(`${prefix}/composition`, "current", "workflow", obj(composition) && obj(composition.plan) && typeof composition.plan.title === "string" ? composition.plan.title : "Saved composition", compositionData(composition), "", 0, "Saved planner source and edited graph, when present.");
      }
      for (const receipt of Array.isArray(state.browserSaves) ? state.browserSaves : []) {
        if (!obj(receipt) || typeof receipt.id !== "string" || !obj(receipt.data)) return fail(503, "saved_library_invalid", "A saved browser receipt needs review.");
        let receiptData: LibraryData;
        try { receiptData = validateLibrary(receipt.data); } catch { return fail(503, "saved_library_invalid", "A saved browser receipt needs review."); }
        await index(receiptData, `${prefix}/browser-receipt/${receipt.id}`, depth + 1);
      }
    };
    await index(data, "account");
    if (personalSpace && this.options.spaces) for (const item of await this.options.spaces.items(personalSpace.id)) {
      if (item.hidden || item.spaceId !== personalSpace.id) continue;
      let itemData = item.data;
      if (obj(itemData) && Array.isArray(itemData.companySkills)) {
        const mapped = await Promise.all(itemData.companySkills.map(async mapping => obj(mapping) && typeof mapping.item_id === "string" ? { ...mapping, item_id: `saved-${await sha256(new TextEncoder().encode(`own-space\0${mapping.item_id}`))}` } : mapping));
        itemData = { ...itemData, companySkills: mapped, saved_original_data: item.data };
      }
      await add("own-space", item.id, item.kind, item.title, itemData, item.body, item.updated, item.summary);
    }
    for (const mind of mindsBySlug.values()) await add("account-minds", mind.slug, "skill", mind.name, { profile: mind }, customMindMarkdown(mind), profiles?.revision, mind.specialty);
    return { service: new CompanyMcpService(snapshot, { userId: user, verifiedEmails: async () => [], publicService: this.options.publicService }), sources, origins };
  }

  async callTool(name: string, args: unknown = {}): Promise<unknown> {
    if (!Object.hasOwn(names, name)) return fail(404, "unknown_tool", "Unknown saved-library tool.");
    const snapshot = await this.snapshot();
    const result = await snapshot.service.callTool(names[name], args);
    const output = remap(result);
    if (obj(output)) {
      if (typeof output.item_id === "string") { output.saved_source = snapshot.sources.get(output.item_id); if (snapshot.origins.has(output.item_id)) output.saved_origin = snapshot.origins.get(output.item_id); }
      if (Array.isArray(output.items)) output.items = output.items.map(item => obj(item) ? { ...item, saved_source: snapshot.sources.get(String(item.item_id)), ...(snapshot.origins.has(String(item.item_id)) ? { saved_origin: snapshot.origins.get(String(item.item_id)) } : {}) } : item);
      output.scope = "authenticated-account-saves-only";
      output.unsynced_device_saves = "Unavailable until the user syncs or imports them through the existing account-saving flow.";
    }
    return output;
  }
}
