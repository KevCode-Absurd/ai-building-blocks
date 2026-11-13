# Vertical knowledge libraries

Expert knowledge for one kind of business, stored once and pulled by any agent. E-commerce is the first vertical
(`ecommerce/`); SaaS and info products follow the same layout.

## Why cards, not documents

Agents do not read curated sources whole. A 4-hour course or a 270,000-word lecture series would swamp any context,
and most of it is what a good model already knows. So each source is turned into **knowledge cards**: one claim an
operator can act on, in our own words, with the conditions it holds under, when it fails, its numbers, the questions
people ask when they need it, and where it came from. The rules are Kevin's ecomOS ingestion spec (one claim per card,
conditions near the claim, the discard test, tiers, the counter-case test for scope). Small, self-contained, dated and
attributed passages are what retrieval works best on (Stanford CS329Z lecture 3), and they keep copyright clean:
cards restate ideas and facts; they never copy a source's text.

## Layout

```
knowledge/<vertical>/
  vertical.json          the modules (codes, names, review windows, required fields), tiers and constraints
  sources.json           every source: id, title, author, url, publish date, rights, tier, modules, why, card count
  cards/<CODE>.json      the cards whose primary module is CODE, sorted by id
  _held.json             cards the last import held back, with the reason (fix and re-import)
```

A card (`src/modules/knowledge/cards.ts`, type `Card`):

| Field | What it holds |
|---|---|
| `id` | Primary module and number, `LPG-0007`. Kept across re-imports of the same source and claim. |
| `modules` | 1 to 4 module codes, primary first, so cross-module agents find it (COGS is FIN and MEA). |
| `claim` | One sentence, the claim with its number. |
| `body` | 60 to 400 words: why it works, how to apply it, the numbers with their sample. Our own words. |
| `conditions`, `fails_when` | When it holds; when it does not (required on growth cards). |
| `scope` | `baseline` (true for almost every brand: no real counter-case) or `growth` (true under conditions). |
| `tier` | 1 platform docs, 2 large-sample research, 3 named practitioner with receipts, 4 opinion or undated. Never better than its source. |
| `numbers`, `topics` | The numbers with units and context; topics from the module's controlled list. |
| `asks` | 3 to 5 questions in a founder's own words. Retrieval matches these (doc2query), which bridges the gap between how people ask and how experts write. |
| `jurisdiction`, `marketplace`, `mode`, `platform`, `platforms` | Hard filters: a card for India never answers a US brand. Required where the module says so (FIN jurisdiction, AMZ marketplace and mode, PRD mode, SET and SPD platform). |
| `source`, `evidence` | The source id, and where in it (a heading or timestamp, at most one quote under 15 words). |
| `public` | False when the source's rights are `licensed` (books, paid courses) or `study_only`. Private cards stay in this private repo and are never built into packs, the API or the connector. |

## How a card gets here

1. **Extract** (one model pass per source, any capable model, following the vertical's card brief): read the source's
   header and topic summary, then the body for the specifics; write cards that pass the discard test.
2. **Import** (`node scripts/import-cards.mjs --vertical=<id> --from=<folder>`, no model): source ids, rights
   correction, module aliases, near-duplicate removal (Jaccard 0.6), validation, stable ids, then the files above.
3. **Build** (`npm run build`, in `scripts/build-packs.mjs`): only public cards from public sources become
   `/packs/knowledge/<vertical>/<CODE>.md`, `baseline.md`, `sources.md` and `index.json`. A card that fails
   validation stops the build.

## How agents pull it

- **In their pack.** A vertical agent (`persona.vertical`, `persona.modules`) carries `baseline.md`, its own modules'
  files and `sources.md` under `knowledge/<vertical>/`; a lead carries the constraint modules (for e-commerce MEA,
  FIN, OPS). `tools/ask-knowledge.mjs` and `knowledge-map.md` search them like the rest of the pack.
- **Through the connector.** `ask_vertical_knowledge` searches the whole library for any agent on any host, with the
  filters above. It is a named library lookup, not an open search of AI Blocks.
- **On the web.** `GET /api/knowledge/<vertical>` (what it holds) and `/api/knowledge/<vertical>/ask?q=...` (the best
  cards), used by the /e-commerce page.

Ranking (`CardIndex`): the per-agent retrieval engine over one passage per card, then hard filters, a tier prior
(1.3, 1.15, 1, 0.8), a 0.85 discount once a card's source is past its module's review window, and wild bets after
every baseline card. When the best card covers too little of the question the answer says so, and the agent asks or
researches instead of guessing.

## Checking it

- `node scripts/eval-vertical.mjs --vertical=ecommerce` scores retrieval on `test/fixtures/ecommerce-golden.json`, an
  independent set of founder questions written from the sources (not the cards): Hit@k by source, MRR, and whether
  questions the library cannot answer are refused.
- The build validates every card; `_held.json` lists what the last import held back.

## Adding a vertical (SaaS, info products)

Write `knowledge/<id>/vertical.json` with its modules, a card brief for extraction, extract and import, add agents with
`"vertical": "<id>"` and their `modules`, and add the id to the `ask_vertical_knowledge` enum. Nothing else changes.
