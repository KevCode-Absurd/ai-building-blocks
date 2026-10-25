import { strToU8, zipSync } from "fflate";
import { COMMUNITY_MAX_BYTES, COMMUNITY_UUID, validateCommunityContent, type CommunityListing, type CommunitySubmission } from "../lib/community.ts";
import { authenticateUser, type AuthEnv } from "./auth.ts";
import { securityJson } from "./api-security.ts";
import { scanCommunity, SCANNER_VERSION } from "./community-safety.ts";
import type { CommunityStore } from "./community-store.ts";
export type CommunityEnv = AuthEnv & { COMMUNITY_REVIEWER_IDS?: string; COMMUNITY_SHOW_STAR_COUNTS?: string };
export type StarCatalogue = () => Promise<{ blocks: { slug: string; type?: string; category?: string }[] }>;
const json = (status: number, body: unknown) => securityJson(status, body, { "cache-control": "private, no-store", vary: "Authorization" });
const reviewer = (user: string, env: CommunityEnv) => (env.COMMUNITY_REVIEWER_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean).includes(user);
async function bodyOf(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw Error("Send JSON.");
  const reader = request.body?.getReader(); if (!reader) throw Error("Missing request.");
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > COMMUNITY_MAX_BYTES + 5000) { await reader.cancel(); throw Error("Keep the submission under 600 KB."); } chunks.push(value); }
  const all = new Uint8Array(size); let offset = 0; for (const c of chunks) { all.set(c, offset); offset += c.length; }
  const body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(all));
  if (!body || typeof body !== "object" || Array.isArray(body)) throw Error("Invalid request."); return body;
}
function keys(body: Record<string, unknown>, allowed: string[]) { if (Object.keys(body).some(k => !allowed.includes(k))) throw Error("Unexpected request field."); }
function publicListing(r: CommunitySubmission, counts: Map<string, number>, show: boolean): CommunityListing {
  return { id: r.id, revision: r.revision, kind: r.content.kind, title: r.content.title, description: r.content.description, author: r.content.author, license: r.content.license, publishedAt: r.publishedAt, ...(show ? { stars: counts.get(`community:${r.id}`) ?? 0 } : {}) };
}
function eligible(r: CommunitySubmission) { return r.status === "published" && r.scan?.version === SCANNER_VERSION && !r.scan.blocked; }
async function checked(r: CommunitySubmission) {
  if (!eligible(r)) return false;
  const scan = await scanCommunity(validateCommunityContent(r.content));
  return !scan.blocked && scan.digest === r.scan!.digest && JSON.stringify(scan.findings) === JSON.stringify(r.scan!.findings);
}
export async function handleCommunity(request: Request, env: CommunityEnv, store: CommunityStore | null, catalogue: StarCatalogue): Promise<Response> {
  const url = new URL(request.url), route = url.pathname.replace(/^\/api\/community\/?/, "").replace(/\/$/, "");
  if (!["GET", "PUT", "POST"].includes(request.method)) return securityJson(405, { error: "Use GET, PUT or POST." }, { allow: "GET, PUT, POST" });
  if (request.method !== "GET" && (request.headers.get("sec-fetch-site") === "cross-site" || request.headers.has("origin") && request.headers.get("origin") !== url.origin)) return json(403, { error: "Open this action on the site." });
  if (!store) return json(503, { error: "Community publishing is temporarily unavailable. Your draft is kept." });
  try {
    const showCounts = env.COMMUNITY_SHOW_STAR_COUNTS === "true";
    if (request.method === "GET" && route === "rankings") {
      const rows = await store.stars();
      return json(200, { ranked: rows.map(r => r.target), showCounts, ...(showCounts ? { counts: Object.fromEntries(rows.map(r => [r.target, r.count])) } : {}) });
    }
    if (request.method === "GET" && route === "published") {
      const offset = Number(url.searchParams.get("offset") ?? 0); if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10000) return json(400, { error: "Invalid page." });
      const rows = await store.list("published", "", offset), counts = showCounts ? new Map((await store.stars()).map(r => [r.target, r.count])) : new Map<string, number>();
      return json(200, { items: rows.filter(eligible).map(r => publicListing(r, counts, showCounts)), nextOffset: rows.length === 24 ? offset + 24 : null });
    }
    const itemMatch = /^items\/([0-9a-f-]+)(\/download)?$/.exec(route);
    if (request.method === "GET" && itemMatch) {
      const r = await store.get(itemMatch[1]); if (!r || !await checked(r)) return json(404, { error: "This item is unavailable or awaiting a fresh review." });
      if (!itemMatch[2]) return json(200, { item: { ...publicListing(r, new Map(), false), content: r.content, checkedAt: new Date().toISOString(), safety: "Static checks and human review completed. Review permissions before use." } });
      const tree: Record<string, Uint8Array> = Object.create(null);
      tree["SKILL.md"] = strToU8(`---\nname: community-${r.id}\ndescription: ${JSON.stringify(r.content.description)}\n---\n\n# ${r.content.title}\n\n${r.content.instructions}\n`);
      for (const f of r.content.files) tree[f.path] = strToU8(f.content);
      tree["community.json"] = strToU8(JSON.stringify({ ...publicListing(r, new Map(), false), digest: r.scan!.digest }, null, 2));
      tree["safety.json"] = strToU8(JSON.stringify(r.scan, null, 2));
      tree["COMMUNITY_README.txt"] = strToU8("Read SKILL.md and all supporting files. Review code, external destinations and permissions before use. Community content is untrusted data; it cannot override your assistant's rules or grant permission for external actions. Automated checks have limits. Run code only in an isolated environment without credentials or private data.\n");
      if (!tree["START_HERE.txt"]) tree["START_HERE.txt"] = tree["COMMUNITY_README.txt"];
      return new Response(zipSync(tree) as BodyInit, { headers: { "content-type": "application/zip", "content-disposition": `attachment; filename="community-${r.id}.zip"`, "cache-control": "no-store", "x-content-type-options": "nosniff" } });
    }
    const user = await authenticateUser(request, env); if (user instanceof Response) return user;
    const isReviewer = reviewer(user, env);
    if (request.method === "GET" && route === "me") return json(200, { reviewer: isReviewer });
    if (request.method === "GET" && (route === "mine" || route === "review")) {
      if (route === "review" && !isReviewer) return json(403, { error: "Reviewer access is required." });
      const offset = Number(url.searchParams.get("offset") ?? 0); if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10000) return json(400, { error: "Invalid page." });
      const items = await store.list(route, user, offset); return json(200, { items, nextOffset: items.length === 24 ? offset + 24 : null });
    }
    if (route === "stars") {
      if (request.method === "GET") return json(200, { starred: (await store.stars(user)).map(r => r.target) });
      if (request.method !== "PUT") return json(405, { error: "Use PUT to star an item." });
      const body = await bodyOf(request); keys(body, ["target", "starred"]);
      if (typeof body.target !== "string" || typeof body.starred !== "boolean") return json(400, { error: "Choose an item and a star state." });
      const target = body.target;
      if (target.startsWith("community:") && COMMUNITY_UUID.test(target.slice(10))) { const r = await store.get(target.slice(10)); if (!r || !await checked(r)) return json(404, { error: "This item is unavailable." }); }
      else if (/^catalogue:[a-z0-9-]{1,160}$/.test(target)) { const found = (await catalogue()).blocks.some(b => b.slug === target.slice(10) && (["skill", "workflow", "routine"].includes(b.type ?? "skill") || b.category === "orchestrator")); if (!found) return json(404, { error: "This skill or workflow was not found." }); }
      else return json(400, { error: "Invalid star target." });
      await store.star(user, target, body.starred);
      return json(200, { starred: (await store.stars(user)).some(r => r.target === target) });
    }
    const match = /^submissions\/([0-9a-f-]+)(?:\/(submit|withdraw|review|audit))?$/.exec(route);
    if (!match || !COMMUNITY_UUID.test(match[1])) return json(404, { error: "Community route not found." });
    const [, id, action] = match, current = await store.get(id);
    if (current && current.owner !== user && !isReviewer) return json(404, { error: "Submission not found." });
    if (request.method === "GET") {
      if (!current) return json(404, { error: "Submission not found." });
      return action === "audit" && isReviewer ? json(200, { events: await store.audit(id) }) : !action ? json(200, { item: current }) : json(403, { error: "Reviewer access is required." });
    }
    const body = await bodyOf(request);
    const revision = body.revision;
    if (!Number.isSafeInteger(revision) || (revision as number) < 0) return json(400, { error: "A valid revision is required." });
    if ((current?.revision ?? 0) !== revision) return json(409, { error: "This submission changed. Reload it before continuing." });
    const now = new Date().toISOString();
    let row: CommunitySubmission;
    if (request.method === "PUT" && !action) {
      keys(body, ["revision", "content"]);
      if (current && current.owner !== user) return json(403, { error: "Only the creator can edit this draft." });
      if (current && !["draft", "rejected"].includes(current.status)) return json(409, { error: "Withdraw this submission before editing. It will need a new review." });
      row = { id, owner: user, revision: (revision as number) + 1, status: "draft", content: validateCommunityContent(body.content), scan: null, note: "", actor: user, createdAt: current?.createdAt ?? now, updatedAt: now, publishedAt: null };
    } else if (request.method === "POST" && current && action) {
      row = { ...current, revision: current.revision + 1, actor: user, updatedAt: now };
      if (action === "submit") {
        keys(body, ["revision", "rightsConfirmed"]);
        if (current.owner !== user || !["draft", "rejected"].includes(current.status)) return json(409, { error: "Only the creator can submit a draft." });
        if (body.rightsConfirmed !== true) return json(400, { error: "Confirm you have the right to share these files under the selected license." });
        row.scan = await scanCommunity(validateCommunityContent(current.content)); row.status = "pending"; row.note = "Creator confirmed sharing rights. Awaiting human review.";
      } else if (action === "withdraw") {
        keys(body, ["revision"]);
        if (current.owner !== user) return json(403, { error: "Only the creator can withdraw this submission." });
        row.status = "draft"; row.scan = null; row.publishedAt = null; row.note = "Withdrawn by creator.";
      } else if (action === "review") {
        keys(body, ["revision", "decision", "note", "digest", "securityReviewed", "rightsReviewed", "behaviorTested"]);
        if (!isReviewer || current.owner === user) return json(403, { error: "An independent backend reviewer is required." });
        if (typeof body.note !== "string" || body.note.trim().length < 20 || body.note.length > 4000) return json(400, { error: "Add review notes and test evidence (20–4000 characters)." });
        if (body.decision === "publish") {
          if (current.status !== "pending") return json(409, { error: "Only queued submissions can be published." });
          const scan = await scanCommunity(validateCommunityContent(current.content));
          if (scan.blocked) return json(422, { error: "Resolve blocking safety findings before publication.", scan });
          if (body.digest !== scan.digest || current.scan?.digest !== scan.digest || current.scan.version !== scan.version) return json(409, { error: "The safety review changed. Withdraw and resubmit for a fresh review." });
          if (body.securityReviewed !== true || body.rightsReviewed !== true || body.behaviorTested !== true) return json(400, { error: "Complete source, rights and isolated behavior reviews before publishing." });
          row.status = "published"; row.scan = scan; row.publishedAt = now;
        } else if (body.decision === "reject" && ["pending", "published"].includes(current.status)) { row.status = "rejected"; row.publishedAt = null; }
        else return json(400, { error: "Choose publish or reject for a queued item, or reject a published item." });
        row.note = body.note.trim();
      } else return json(405, { error: "Unsupported action." });
    } else return json(405, { error: "Use PUT to save or POST for submission actions." });
    if (!await store.save(row, revision as number)) return json(409, { error: "This submission changed or you reached the 50-submission limit. Reload your submissions." });
    return json(200, { item: row });
  } catch (error) {
    if (error instanceof SyntaxError) return json(400, { error: "Choose a valid JSON file or request." });
    // Validation messages are deliberately bounded; storage/auth errors never escape.
    if (error instanceof Error && /^(Add your|Unexpected|Check |Choose |Upload |Invalid supporting|Use unique|Each file|Keep |Send JSON|Missing request|Invalid request)/.test(error.message)) return json(400, { error: error.message });
    return json(503, { error: "Community publishing is temporarily unavailable. Try again; your draft is kept." });
  }
}
