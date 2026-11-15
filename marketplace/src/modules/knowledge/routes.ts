// Public API for vertical knowledge libraries (knowledge/<vertical>/). No sign-in, no model, nothing private:
// licensed and study-only cards are never in the built index.
//   GET /api/knowledge/:vertical             what the library holds: modules with card counts, sources count
//   GET /api/knowledge/:vertical/ask?q=...   the best cards for a question (&module=LPG,OFF &jurisdiction=IN
//                                            &marketplace=US &mode=dtc_first &platform=shopify &scope=baseline &k=6)
//   GET /api/knowledge/:vertical/shelf       the shelves (prompts, skills, tools, minds): counts, and with ?q= how many
//                                            of each match, so the page can show a count on every tab
//   GET /api/knowledge/:vertical/shelf/:kind ?q= &stage= &offset= &limit=  one shelf, best match first (or in the
//                                            store's order of work with no q)
//   GET /api/knowledge/:vertical/shelf/:kind/:slug  one item and its full text
import { fail, json, type Route } from "../../core/http.ts";
import { answerJson, cardQuery, shelfText, verticalIndex, verticalShelf } from "./service.ts";
import { isShelfKind, SHELF_KINDS, type ShelfItem } from "./shelf.ts";

const PUBLIC_CACHE = { "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" };
const MAX_Q = 300;
const MAX_SHELF_Q = 120, PAGE = 24, MAX_PAGE = 60;
const NO_SHELF = "We do not have shelves for that kind of business yet. Try /api/knowledge/ecommerce/shelf.";

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
  {
    method: "GET", path: "/api/knowledge/:vertical/shelf", handler: async ctx => {
      const shelf = await verticalShelf(ctx.env, ctx.params.vertical);
      if (!shelf) return fail(404, "unknown_shelf", NO_SHELF);
      const q = (ctx.url.searchParams.get("q") ?? "").trim().slice(0, MAX_SHELF_Q);
      const counts = Object.fromEntries(SHELF_KINDS.map(k => [k, shelf.file[k].length]));
      const found = q ? Object.fromEntries(SHELF_KINDS.map(k => [k, shelf.search[k].search(q).length])) : undefined;
      return json({ vertical: shelf.file.vertical, built: shelf.file.built, stages: shelf.file.stages, counts, ...(q ? { q, found } : {}) }, 200, PUBLIC_CACHE);
    },
  },
  {
    method: "GET", path: "/api/knowledge/:vertical/shelf/:kind", handler: async ctx => {
      const shelf = await verticalShelf(ctx.env, ctx.params.vertical);
      if (!shelf) return fail(404, "unknown_shelf", NO_SHELF);
      const kind = ctx.params.kind;
      if (!isShelfKind(kind)) return fail(404, "unknown_kind", `Pick one of ${SHELF_KINDS.join(", ")}.`);
      const p = ctx.url.searchParams;
      const q = (p.get("q") ?? "").trim().slice(0, MAX_SHELF_Q);
      const stage = (p.get("stage") ?? "").trim();
      const offset = Math.max(0, Math.min(10_000, Number.parseInt(p.get("offset") ?? "0", 10) || 0));
      const limit = Math.max(1, Math.min(MAX_PAGE, Number.parseInt(p.get("limit") ?? `${PAGE}`, 10) || PAGE));
      const all = shelf.search[kind].search(q, stage);
      // Counts per stage for this request (without the stage filter), so the chips can say how many each holds.
      const byStage: Record<string, number> = {};
      for (const it of stage ? shelf.search[kind].search(q) : all) byStage[it.stage] = (byStage[it.stage] ?? 0) + 1;
      const stages = shelf.file.stages.filter(s => byStage[s.id]).map(s => ({ ...s, n: byStage[s.id] }));
      return json({ vertical: shelf.file.vertical, kind, total: all.length, offset, limit, ...(q ? { q } : {}), ...(stage ? { stage } : {}),
        stages, items: all.slice(offset, offset + limit) }, 200, PUBLIC_CACHE);
    },
  },
  {
    method: "GET", path: "/api/knowledge/:vertical/shelf/:kind/:slug", handler: async ctx => {
      const shelf = await verticalShelf(ctx.env, ctx.params.vertical);
      if (!shelf) return fail(404, "unknown_shelf", NO_SHELF);
      const kind = ctx.params.kind;
      if (!isShelfKind(kind)) return fail(404, "unknown_kind", `Pick one of ${SHELF_KINDS.join(", ")}.`);
      const item = (shelf.file[kind] as ShelfItem[]).find(i => i.slug === ctx.params.slug);
      if (!item) return fail(404, "unknown_item", "We could not find that item. It may have a new name.");
      const text = await shelfText(ctx.env, item.path);
      if (text === null) return fail(503, "item_text_missing", "This item's text is not ready yet. Try again in a minute.");
      // A prompt's text alone, for the copy button.
      const prompt = kind === "prompts" ? await shelfText(ctx.env, item.path.replace(/\.md$/, ".txt")) : null;
      return json({ vertical: shelf.file.vertical, kind, item, text, ...(prompt ? { prompt } : {}) }, 200, PUBLIC_CACHE);
    },
  },
];
