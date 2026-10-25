# AI Blocks (useaiblocks.com)

**Agency Agents (25 Oct):** 283 source agent profiles across 18 divisions, packaged as agents with skill adapters, setup guides, MIT licences and pinned source hashes. Originals stay unchanged in each download. Intake and package checks: `reports/2026-10-25-agency-agents-import.json` and `reports/2026-10-25-agency-agents-checks.json`. These entries have not had model behavior tests.

**Minds (23 Oct):** 505 ready minds, including 200 new profiles for everyday tasks across cooking, home, learning, relationships, work, money, wellbeing, communities, technology and creative practice. Search by task or name, use a mind on its own, or seat an advisory council. Portrait motion plays once per visit and then rests. Source review: `reports/2026-10-23-minds-editorial-audit.json`.

**Apps (19 Oct):** `/apps` shows example apps as click-through tours (one client app with every detail replaced by Sprout, and Mercatura's three standalone apps plus the combined one), and the **app starter pack** in `app-starter/` turns skills and workflows into an app with sign-in and teams. PRD: `docs/APPS-PRD.md`. `node tools/check-masking.mjs` keeps the client app anonymous and runs with every build.

A **free, evergreen library** of tested AI building blocks for any business. It isn't only skills: it has prompts, skills, routines, workflows, applications, and people's own agents and bots. Each comes ready-made and with a plain how-to guide for setting it up yourself. Every listing comes with:
- a plain-words explanation and a real before and after
- the right model for the job, with its cost
- downloads that run in Claude, ChatGPT, Codex or any AI
- a safety badge, and credit to the original when it came from elsewhere

**How it's organised:** general listings any business can use come first. **Industry boards** come next, and work like subreddits with listings, downloads, comments and advice: **/ecommerce** first, then **/saas**, then more by demand. Job-role boards (marketing, finance, operations, product) follow. We also bring in good skills from GitHub and elsewhere. We check them for malware and prompt injection, then credit, improve and explain them.

**Simple by default.** Every job is a ladder: by hand → ask → connect → save → schedule → mini app → full app → share → act. People see only their next step, from Beginner to Expert.

**Free first.** There's no paywall and no selling at the start. Money comes later, one stream at a time: affiliates, advertising (site and YouTube), consulting and implementation, memberships, premium workflows, and a creator marketplace (70/30).

> **Status (2026-10-18): building v0 (Kevin approved building on 18 Oct).** The PRD is `docs/PRD.md`. `catalogue-items/` holds 166 renamed and tightened blocks (152 general, 14 ecommerce) plus 7 ready-made workflows; none is marked tested yet. `site/` is the first version of the website: homepage, library, block pages, kits, the drag-and-drop canvas and the handoff pack download. "AI Building Blocks" is a working name.

## Start here

| Read | What it is |
|---|---|
| [docs/final-plan/Final-Plan.pdf](docs/final-plan/Final-Plan.pdf) | **Read this first.** The final plan (v4), covering what we build, how it's organised, the intake engine (any video, article or skill library in; building blocks out), growth, money later, the build, and a week-by-week plan, in plain language. |
| [docs/business-deck/Business-and-Build-Deck.pdf](docs/business-deck/Business-and-Build-Deck.pdf) | The business and build deck (43 slides): problem, who it serves, 10× value, TAM/SAM/SOM, ecommerce beachhead, adjacent markets, competitors, money, go to market, the site (votes, stars, kits, no stored data), architecture, tech stack and the build phases. |
| [docs/FINAL_PLAN.md](docs/FINAL_PLAN.md) | The same plan as Markdown, for quick reference and for agents working in this repo. |
| [DECISIONS.md](DECISIONS.md) | Every decision so far, dated, so later work doesn't undo it. |
| [RULES.md](RULES.md) | Ground rules for anyone, person or AI agent, working in this repo. |
| [docs/planning/](docs/planning/) | The detailed planning pack: maps, gaps, site architecture, production principles, build plan, sources-to-skills. It was written ecommerce-first; where it differs, the final plan wins. |
| [docs/inventory/](docs/inventory/) | Every existing skill, prompt, workflow and course item we found (1,338 rows), with rights and proposed names. **Private.** |
| [docs/business/](docs/business/) | The business plan, the five-stream financial model and the earlier handoff. |

## How the library is organised

| Layer | What's in it |
|---|---|
| **General library** | Listings any business can use, as prompts, skills, routines, workflows, applications and agents, each with a setup guide |
| **Industry boards** | /ecommerce first, /saas next: focused versions, comments and advice |
| **Job-role boards** (later) | /marketing, /finance, /operations, /product |
| **Tools** | Plain guides to AI tools and how each is used in an industry, plus **mini tools**: free calculators that work on the site, as a download, in a sheet, inside your own AI, or embedded |

Filters are job, type, level (Beginner to Expert), board and tool. A board version adds the industry's brain fields, examples, thresholds and wording. It never forks the general listing.

New listings come in through the **intake engine**: paste a YouTube video, reel, article, post or GitHub skill library, and it becomes idea cards matched to our jobs and workflows, then credited, safety-checked listings ([design](docs/planning/08_INTAKE_ENGINE.md)).

## Folder map

```
catalogue-items/   the product: one folder per part, each with item.yaml (empty until Section 1)
  _types.yaml      shared input/output types, so parts connect to each other
  _models.yaml     model classes (cheap / mid / top / routed) mapped to today's models
  _names.yaml      old name → proposed name for all 226 own items
  stacks/          ready-made chains for a goal (e.g. brand brain → ads → copy)
test-brands/       public test cases across business types, built only from saved public pages
tools/             the "item factory" command-line tools (planned, not built)
knowledge/         source pieces used to build parts (planned)
reports/           one report per section and per model-test round
site/              the catalogue website (Phase 6)
docs/              final plan, planning pack, inventory, business, archive
```

## Relationship to other repos

- **[Creative Engine](https://github.com/KevCode-Absurd/creative-engine)** is a read-only source of tested methods. We copy those methods in, repackage them and record where each came from. Creative Engine is never edited from here.
- **`ecommerce-workflow-platform`** is the first scaffold of this repo, made on 17 Oct 2026 under an ecommerce-only name. It is superseded by this repo and can be archived.
