// API routes for the directory module. Paths and owners are listed in ARCHITECTURE.md.
// Every route is public: no sign-in, and nothing private (method, source_roles, look) or priced ever leaves them.
import { fail, json, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { AREAS } from "../../core/types.ts";
import { getRole } from "./roles.ts";
import { getPersona, listPersonas, searchPersonas } from "./service.ts";
import { agentCard, agentProfile, areaCounts, pickFeatured, relatedAgents, soulMarkdown } from "./views.ts";

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
      const shown = area ? matching.filter(p => p.area === area) : matching;
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
];

/** Work the 15-minute cron runs for this module. Seeding is done by ops (POST /api/ops/seed), not on a timer. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
