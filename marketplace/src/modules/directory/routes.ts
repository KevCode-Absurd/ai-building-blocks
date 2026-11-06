// API routes for the directory module. Paths and owners are listed in ARCHITECTURE.md.
// Both routes are public: no sign-in, and nothing private (method, source_roles, look) ever leaves them.
import { fail, json, type Route } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import { AREAS } from "../../core/types.ts";
import { getPersona, listPersonas, searchPersonas } from "./service.ts";
import { agentCard, agentProfile, areaCounts, relatedAgents } from "./views.ts";

/** Public, short-lived: browsers keep it a minute, shared caches five, then refresh in the background. */
const PUBLIC_CACHE = { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" };

export const routes: Route[] = [
  {
    method: "GET", path: "/api/agents", handler: async ctx => {
      const area = ctx.url.searchParams.get("area")?.trim() || "";
      const q = (ctx.url.searchParams.get("q") ?? "").trim();
      if (area && !(AREAS as readonly string[]).includes(area)) return fail(400, "unknown_area", "We do not have that area. Pick one from the list, or clear the filter.");
      if (q.length > 120) return fail(400, "search_too_long", "That search is too long. Try a few words, like \"SEO plan\".");
      // One read: every live agent, then the search, then the area. Chip counts cover the search across all areas,
      // so each chip says how many agents it would show.
      const everyone = await listPersonas(ctx.env);
      const matching = q ? searchPersonas(everyone, q) : everyone;
      const shown = area ? matching.filter(p => p.area === area) : matching;
      return json({
        total: matching.length,
        area: area || null,
        q,
        areas: areaCounts(everyone, matching),
        agents: shown.map(agentCard),
      }, 200, PUBLIC_CACHE);
    },
  },
  {
    method: "GET", path: "/api/agents/:id", handler: async ctx => {
      const persona = await getPersona(ctx.env, ctx.params.id);
      if (!persona) return fail(404, "agent_not_found", "We could not find that agent. It may have a new name. See every agent at /agents.");
      const neighbours = await listPersonas(ctx.env, { area: persona.area });
      return json({
        agent: agentProfile(persona),
        related: relatedAgents(persona, neighbours).map(agentCard),
      }, 200, PUBLIC_CACHE);
    },
  },
];

/** Work the 15-minute cron runs for this module. Seeding is done by ops (POST /api/ops/seed), not on a timer. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
