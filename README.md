# AI Building Blocks (working name)

A global platform of **tested AI building blocks and expert implementation** for digital businesses. There are six levels: **prompt → skill → routine → workflow → agent → system**. Each block does one exact job. It also comes with:
- a real, labelled example
- the right model for the job, with its cost
- downloads that run in Claude, ChatGPT, Codex or any AI
- help when setup gets complex

**Who it's for:** brands, dropshippers, agencies, software companies, creators and other digital businesses. We start with exact marketing jobs, where our tested methods are deepest, and then earn the right to cover sales, support and operations. Ecommerce is the **first industry pack**, not the product.

> **Status (2026-10-17): planning and scaffolding only.** No catalogue items, tools or site have been built yet. "AI Building Blocks" is a working name. The final brand name is still open.

## Start here

| Read | What it is |
|---|---|
| [docs/final-plan/Final-Plan.pdf](docs/final-plan/Final-Plan.pdf) | **Read this first.** The final plan, covering what we build, who for, go-to-market, the build, and a week-by-week execution plan, in plain language. |
| [docs/FINAL_PLAN.md](docs/FINAL_PLAN.md) | The same plan as Markdown, for quick reference and for agents working in this repo. |
| [DECISIONS.md](DECISIONS.md) | Every decision so far, dated, so later work doesn't undo it. |
| [RULES.md](RULES.md) | Ground rules for anyone, person or AI agent, working in this repo. |
| [docs/planning/](docs/planning/) | The detailed planning pack: maps, gaps, site architecture, production principles, build plan, sources-to-skills. It was written ecommerce-first; where it differs, the final plan wins. |
| [docs/inventory/](docs/inventory/) | Every existing skill, prompt, workflow and course item we found (1,338 rows), with rights and proposed names. **Private.** |
| [docs/business/](docs/business/) | The business plan, the five-stream financial model and the earlier handoff. |

## How the catalogue is organised

Every part can be found in four ways:

| Find by | Examples |
|---|---|
| **Job** | "audit my Meta ads", "make 30 static ads for a sale", "audit this landing page" |
| **Function** | business brain, research and strategy, creative and content, paid media, website and conversion, lifecycle and retention, analytics and profit, AI operations |
| **Industry pack** | ecommerce and D2C first; then agencies, software and apps, creators and courses, service businesses |
| **Host** | Claude Code, Claude Projects, ChatGPT, Codex, any AI via a router, or no AI (Starter checklists) |

Each job has one core part. An industry pack adds the brain fields, examples, thresholds and wording for that industry. Packs never fork the part.

## Folder map

```
catalogue-items/   the product: one folder per part, each with item.yaml (empty until Section 1)
  _types.yaml      shared input/output types, so parts connect to each other
  _models.yaml     model classes (cheap / mid / top / routed) mapped to today's models
  _names.yaml      old name → proposed name for all 226 own items
  stacks/          ready-made chains for a goal (e.g. holiday sale pack)
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
