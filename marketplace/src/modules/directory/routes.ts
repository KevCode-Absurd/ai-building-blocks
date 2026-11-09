// API routes for the directory module. Paths and owners are listed in ARCHITECTURE.md.
// Every route is public: no sign-in, and nothing private (method, source_roles, look) or priced ever leaves them.
import { fail, json, str, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { AREAS } from "../../core/types.ts";
import { getRole } from "./roles.ts";
import { getPersona, listPersonas, searchPersonas } from "./service.ts";
import { agentCard, agentProfile, areaCounts, browseOrder, pickFeatured, relatedAgents, soulMarkdown } from "./views.ts";
import {executionPlan,checkExecutionDelivery} from './execution.ts';
import { TOOL_FILES } from "../packs/build.ts";
import { readPackIndex, skillOneFile } from "../mcp/pack-files.ts";

/** A static file from the built site, or null when it is missing (the app's fallback page answers missing files with HTML). */
async function builtFile(env: Env, base: string, path: string): Promise<string | null> {
  if (!env.ASSETS) return null;
  const res = await env.ASSETS.fetch(new Request(new URL(path, base)));
  if (!res.ok || (res.headers.get("content-type") ?? "").includes("text/html")) return null;
  return res.text();
}

/** Public, short-lived: browsers keep it a minute, shared caches five, then refresh in the background. */
const PUBLIC_CACHE = { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" };
const MAX_FEATURED = 12;

/** A plain-text answer for soul.md, which people and AI tools read as a file rather than as JSON. */
function textFile(body: string, status: number, type: string, cache = true): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": `${type}; charset=utf-8`,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      ...(cache ? PUBLIC_CACHE : { "cache-control": "no-store" }),
    },
  });
}

/** What /api/agents/:id returns, or null for an unknown or hidden agent. The website's profile page (src/pages.ts) sends
 *  the same answer inside the HTML, so the app can draw the profile without asking again. */
export async function agentPayload(env: Env, id: string) {
  const persona = await getPersona(env, id);
  if (!persona) return null;
  const neighbours = await listPersonas(env, { area: persona.area });
  return { agent: agentProfile(persona), related: relatedAgents(persona, neighbours).map(agentCard) };
}

/** What /api/agents?featured=N returns. The home page (src/pages.ts) sends it inside the HTML for N = HOME_FEATURED,
 *  so the strip paints with real cards and nothing moves when they arrive. total counts every live agent. */
export const HOME_FEATURED = 6;
export function featuredPayload(everyone: Awaited<ReturnType<typeof listPersonas>>, n: number) {
  return { total: everyone.length, agents: pickFeatured(everyone, n).map(agentCard) };
}

export const routes: Route[] = [
  {
    method:'POST',path:'/api/execution-plan',handler:async ctx=>{
      const input=await ctx.body<Record<string,unknown>>();
      if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(key=>!['request','tier'].includes(key)))return fail(400,'invalid_input','Send request and optional quick, standard or deep tier.');
      const request=str(input.request,'request',{max:4000});
      const tier=input.tier??'standard';
      if(tier!=='quick'&&tier!=='standard'&&tier!=='deep')return fail(400,'invalid_input','tier must be quick, standard or deep.');
      return json(executionPlan(request,tier));
    },
  },
  {
    method:'POST',path:'/api/execution-check',handler:async ctx=>{
      const input=await ctx.body<Record<string,unknown>>();
      if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(key=>!['request','production','job_card','team'].includes(key)))return fail(400,'invalid_input','Send request, production, job_card and team.');
      const request=str(input.request,'request',{max:4000});
      for(const key of ['production','job_card','team'])if(!input[key]||typeof input[key]!=='object'||Array.isArray(input[key]))return fail(400,'invalid_input',`${key} must be an object.`);
      return json(checkExecutionDelivery(request,input.production as Record<string,unknown>,input.job_card as Record<string,unknown>,input.team as Record<string,unknown>));
    },
  },
  {
    method: "GET", path: "/api/agents", handler: async ctx => {
      const everyone = await listPersonas(ctx.env);
      // ?featured=N: a few agents for the home page, one per area so the first cards show different kinds of work.
      // total is every live agent, so "See all N agents" always counts the real roster.
      const featured = ctx.url.searchParams.get("featured");
      if (featured !== null) {
        const n = Number(featured);
        if (!Number.isInteger(n) || n < 1 || n > MAX_FEATURED) return fail(400, "invalid_featured", `Ask for 1 to ${MAX_FEATURED} featured agents.`);
        return json(featuredPayload(everyone, n), 200, PUBLIC_CACHE);
      }

      const area = ctx.url.searchParams.get("area")?.trim() || "";
      const q = (ctx.url.searchParams.get("q") ?? "").trim();
      const roleId = ctx.url.searchParams.get("role")?.trim() || "";
      if (area && !(AREAS as readonly string[]).includes(area)) return fail(400, "unknown_area", "We do not have that area. Pick one from the list, or clear the filter.");
      if (q.length > 120) return fail(400, "search_too_long", "That search is too long. Try a few words, like \"SEO plan\".");
      const role = roleId ? getRole(roleId) : null;
      if (roleId && !role) return fail(400, "unknown_role", "We do not have that job role. Clear it to see every agent.");
      // One read: every live agent, then the role and the search, then the area. Chip counts cover the role and the
      // search across all areas, so each chip says how many agents it would show.
      const inRole = role ? everyone.filter(p => p.role === role.id) : everyone;
      const matching = q ? searchPersonas(inRole, q) : inRole;
      const inArea = area ? matching.filter(p => p.area === area) : matching;
      // Browsing (no search, no role): the most useful agents first, with kinds of work mixed (views.ts browseOrder).
      const shown = q || role ? inArea : browseOrder(inArea, { withinArea: !!area });
      return json({
        total: matching.length,
        area: area || null,
        q,
        /** With ?role=: the role's name and summary, for the page heading. */
        role: role ? { id: role.id, name: role.name, department: role.department, summary: role.summary } : null,
        areas: areaCounts(everyone, matching),
        agents: shown.map(agentCard),
      }, 200, PUBLIC_CACHE);
    },
  },
  {
    method: "GET", path: "/api/agents/:id", handler: async ctx => {
      const payload = await agentPayload(ctx.env, ctx.params.id);
      if (!payload) return fail(404, "agent_not_found", "We could not find that agent. It may have a new name. See every agent at /agents.");
      return json(payload, 200, PUBLIC_CACHE);
    },
  },
  {
    // The agent's personality as a markdown file. src/app.ts sends this path to the Worker, and wrangler.jsonc lists
    // it in assets.run_worker_first, so the browser app's fallback page never answers it.
    method: "GET", path: "/agents/:id/soul.md", handler: async ctx => {
      const origin = ctx.env.APP_ORIGIN.replace(/\/+$/, "");
      const persona = await getPersona(ctx.env, ctx.params.id);
      if (!persona) return textFile(`We could not find that agent. See every agent at ${origin}/agents\n`, 404, "text/plain", false);
      const md = soulMarkdown(persona, origin);
      if (!md) return textFile(`${persona.name} has no soul.md yet. Read ${persona.name}'s profile at ${origin}/agents/${persona.id}\n`, 404, "text/plain", false);
      return textFile(md, 200, "text/markdown");
    },
  },
  {
    // The capture and check tools every pack links to (context/README.md), served from the built packs with their
    // own content types. Only the names in TOOL_FILES are answered.
    method: "GET", path: "/tools/:file", handler: async ctx => {
      const origin = ctx.env.APP_ORIGIN.replace(/\/+$/, "");
      const tool = TOOL_FILES.find(t => t.name === ctx.params.file);
      if (!tool) return textFile(`There is no tool at this address. The tools are: ${TOOL_FILES.map(t => `${origin}/tools/${t.name}`).join(", ")}\n`, 404, "text/plain", false);
      const text = await builtFile(ctx.env, ctx.env.APP_ORIGIN, `/packs/tools/${tool.name}`);
      if (text === null) return textFile(`${tool.name} is not published yet. Capture by hand for now: WORK-METHOD.md, step 1, route 3.\n`, 404, "text/plain", false);
      return textFile(text, 200, tool.name.endsWith(".md") ? "text/markdown" : "text/javascript");
    },
  },
  {
    // One skill of an agent with the files the agent reads first, in one text file for chat apps: a smaller start
    // than the whole agent (/packs/<id>.txt). Assembled from the built pack; nothing runs a model.
    method: "GET", path: "/agents/:id/skills/:skill", handler: async ctx => {
      const origin = ctx.env.APP_ORIGIN.replace(/\/+$/, "");
      const m = /^([a-z0-9][a-z0-9-]{0,99})\.txt$/.exec(ctx.params.skill);
      const persona = m ? await getPersona(ctx.env, ctx.params.id) : null;
      if (!m || !persona || persona.status !== "live") return textFile(`We could not find that agent or skill. See every agent at ${origin}/agents\n`, 404, "text/plain", false);
      const index = await readPackIndex(ctx.env, persona.id);
      const text = index ? await skillOneFile(ctx.env, index, persona.name, persona.title, m[1]) : null;
      if (!text) return textFile(`${persona.name} has no skill called ${m[1]}. The skills are listed at ${origin}/packs/${persona.id}/files.json\n`, 404, "text/plain", false);
      return textFile(text, 200, "text/plain");
    },
  },
];

/** Work the 15-minute cron runs for this module. Seeding is done by ops (POST /api/ops/seed), not on a timer. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
