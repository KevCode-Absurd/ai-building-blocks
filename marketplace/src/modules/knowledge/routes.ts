// Public API for vertical knowledge libraries (knowledge/<vertical>/). No sign-in, no model, nothing private:
// licensed and study-only cards are never in the built index.
//   GET /api/knowledge/:vertical             what the library holds: modules with card counts, sources count
//   GET /api/knowledge/:vertical/ask?q=...   the best cards for a question (&module=LPG,OFF &jurisdiction=IN
//                                            &marketplace=US &mode=dtc_first &platform=shopify &scope=baseline &k=6)
import { fail, json, type Route } from "../../core/http.ts";
import { answerJson, cardQuery, verticalIndex } from "./service.ts";

const PUBLIC_CACHE = { "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
const MAX_Q = 300;

export const routes: Route[] = [
  {
    method: "GET", path: "/api/knowledge/:vertical", handler: async ctx => {
      const v = await verticalIndex(ctx.env, ctx.params.vertical);
      if (!v) return fail(404, "unknown_library", "We do not have a knowledge library by that name yet. Try /api/knowledge/ecommerce.");
      const { vertical, counts, sources, cards } = v.file;
      return json({
        id: vertical.id, name: vertical.name, summary: vertical.summary, updated: vertical.updated,
        cards: cards.length, sources: sources.length, baseline: cards.filter(c => c.scope === "baseline").length,
        modules: vertical.modules.map(m => ({ code: m.code, name: m.name, cards: counts[m.code] ?? 0 })),
        tiers: vertical.tiers,
      }, 200, PUBLIC_CACHE);
    },
  },
  {
    method: "GET", path: "/api/knowledge/:vertical/ask", handler: async ctx => {
      const v = await verticalIndex(ctx.env, ctx.params.vertical);
      if (!v) return fail(404, "unknown_library", "We do not have a knowledge library by that name yet. Try /api/knowledge/ecommerce.");
      const q = (ctx.url.searchParams.get("q") ?? "").trim();
      if (q.length < 3) return fail(400, "question_too_short", "Ask a question of a few words, like \"how many hooks should I test per week\".");
      if (q.length > MAX_Q) return fail(400, "question_too_long", `Keep the question under ${MAX_Q} characters.`);
      const raw = Object.fromEntries(ctx.url.searchParams);
      const answer = v.index.ask(q, { ...cardQuery(v.file.vertical, raw), today: new Date().toISOString().slice(0, 10) });
      return json({ library: v.file.vertical.id, ...answerJson(answer) }, 200, PUBLIC_CACHE);
    },
  },
];
