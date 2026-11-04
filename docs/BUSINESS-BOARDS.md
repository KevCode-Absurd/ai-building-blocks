# Business boards

One page per kind of business at `/industries/<board>`, laid out in 8 stages: plan, build, get found, market, sell, deliver, keep customers, and money and team. Added 2026-11-04.

The 11 boards: online stores, Amazon and marketplace sellers, SaaS, apps, courses and coaching, creators and media, agencies and freelancers, local businesses and shops, digital products, AI and automation businesses, and wholesale and product brands. Startups raising money sit in the SaaS and apps money stage. Restaurants, clinics, gyms and estate agents sit in local businesses. `/industries/finance` and `/industries/engineering` stay as they were (by team, not by business).

## Where things live

| What | File |
|---|---|
| Board names, stage labels, page words and matching rules | `site/src/trust-pages/boards.mjs` |
| Names only, for the site bundle | `site/src/trust-pages/board-names.mjs` (a test keeps it in step) |
| Placing items, specialists and tools | `site/scripts/lib/board-map.mjs` |
| Hand fixes (remove, add, move stage) | `catalogue-items/boards.yaml` |
| The pages | `site/scripts/lib/board-pages.mjs`, called from `scripts/lib/trust-pages.mjs` |
| Playbooks | `site/public/playbooks/FOR-<BOARD>.md` |
| Review sheet | `node tools/map-boards.mjs board-review.csv` |

## How an item gets on a board

- **Made for it**: its words name that kind of business, its task only fits there (store setup fits online stores, code fits SaaS), or `boards.yaml` adds it. These show first, and the item's page says "For: <board>".
- **Useful to any business**: its task is general business work (email, ads, accounts). These fill a stage, marked "Any business", ranked by how close their words are to the board.
- Minds, personal, academic and investing items go on no board.

A stage gets its own page (`/industries/<board>/<stage>`) when it has at least 8 made-for items and specialists. Otherwise the board page links to the job pages.

The first pass was reviewed row by row: 557 wrong keyword matches came off and 33 stages moved. When you add items, run the review sheet and fix what is wrong in `boards.yaml`.

## The specialization layer

The brand file has a "Kind of business" choice. When it is set, every workflow pack, skill zip, mind pack and specialist download includes that board's playbook, and the brand file text names it. A playbook is written to the AI: how the business makes money, the numbers that matter, what matters at each stage, its words, what to ask the owner, and rules. It never gives benchmark figures, and the skill's own steps come first.
