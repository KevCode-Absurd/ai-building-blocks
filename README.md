# AI Blocks (useaiblocks.com)

A **free, evergreen library** of AI building blocks for any business. It isn't only skills: it has prompts, skills, workflows, agents, minds, AI specialists and mini tools. Each comes ready-made, with a plain how-to guide for setting it up yourself. Every listing comes with:
- a plain-words explanation and a real before and after
- the right model for the job, with its cost
- downloads that run in Claude, ChatGPT, Codex or any AI
- a safety badge, and credit to the original when it came from elsewhere

Blocks that passed the safety scan and have a real input and output sample are marked Tested. Imported ones say "Imported, not yet tested".

> **Status (2026-11-02): live at useaiblocks.com since 22 Oct 2026.** The catalogue source holds about 5,500 items: 3,781 skills, 598 workflows, 462 agents, 180 prompts and 505 minds, plus 70 mini tools. `site/public/data/blocks.json` is built from these by `npm run index` and leaves out anything in `catalogue-items/quarantine.yaml`.

## What's new

**AI specialists (30 Oct to 2 Nov).** Every agent and workflow in the library is now an AI specialist at `/roles`, with its own expertise, checks and a worked example. Pick one and download its base pack before you set up any task. The pack holds the setup files, the full source methods it relies on, licences and pinned hashes. Focused setups cover React, Shopify themes and CRM records. `tools/eval-roles.mjs` tests specialists on their own golden tasks, and `tools/role-feedback.mjs` adds reviewed lessons. Details: [docs/public-mcp/base-specialist-packs.md](docs/public-mcp/base-specialist-packs.md).

**Outcome delivery (30 Oct to 2 Nov).** The MCP server now helps the user's own AI go from a problem to a measured result. It scopes the request, finds gaps in the evidence, ranks recommendations the user picks from, plans a specialist team with checked handoffs, and records the experiment. Plans are built from research, not fixed playbooks. Business results stay "intended" until measured. Details: [docs/public-mcp/outcome-delivery.md](docs/public-mcp/outcome-delivery.md).

**MCP and saved work (29 to 30 Oct).** The public MCP server (`/mcp`) has search, items, skills, workflows, workflow planning and specialist tools (`find_specialist`, `prepare_specialist`). Signed-in users can save private versioned workflows, memory and team checkpoints and reach them from their AI. A company MCP serves a team's own items.

**Quality and release (27 to 31 Oct).** A content pass fixed inputs, prerequisites, licence notes, credits and documented APIs across the catalogue. Builds are reproducible across clean runners and time zones. `tools/release.mjs` runs the ordered production release. Mobile pages, Minds and skill pages open with less startup work.

**Earlier:** Agency Agents (25 Oct, 283 imported agent profiles with skill adapters and pinned sources), Minds (23 Oct, 505 minds you can use alone or seat as an advisory council) and Apps (19 Oct, example app tours at `/apps` and the starter pack in [app-starter/](app-starter/)).

## How it's organised

| Layer | What's in it |
|---|---|
| **General library** | Listings any business can use: prompts, skills, workflows and agents, each with a setup guide |
| **Industry boards** | /ecommerce first, /saas next: focused versions, comments and advice. Job-role boards (marketing, finance, operations, product) come later |
| **Minds** | 505 minds for everyday and work tasks. Use one alone or seat an advisory council |
| **AI specialists** | Every agent and workflow as a downloadable specialist with expertise, checks and a worked example |
| **Tools** | Plain guides to AI tools, plus **mini tools**: free calculators that work on the site, as a download, in a sheet, inside your own AI, or embedded |
| **Apps** | Example app tours and a starter pack that turns skills and workflows into an app with sign-in and teams |

Filters are job, type, level (Beginner to Expert), board and tool. A board version adds the industry's fields, examples, thresholds and wording. It never forks the general listing.

**Simple by default.** Every job is a ladder: by hand → ask → connect → save → schedule → mini app → full app → share → act. People see only their next step.

**Free first.** There's no paywall at the start. Workflow composition with AI needs a free account. Money comes later, one stream at a time: affiliates, advertising, consulting, memberships, premium workflows and a creator marketplace (70/30).

We also bring in good skills from GitHub and elsewhere. We check them for malware and prompt injection, then credit, improve and explain them ([how](docs/IMPORTING-SKILLS.md)).

## Start here

| Read | What it is |
|---|---|
| [RULES.md](RULES.md) | Ground rules for anyone, person or AI agent, working in this repo |
| [site/README.md](site/README.md) | The website: build, test, Cloudflare deploy, crawl files, the workflow composer |
| [tools/README.md](tools/README.md) | The command-line tools that check, build and test the catalogue |
| [catalogue-items/README.md](catalogue-items/README.md) | How catalogue items are laid out |
| [docs/QUALITY-BAR.md](docs/QUALITY-BAR.md) | What every item page must meet |
| [docs/WRITING.md](docs/WRITING.md), [docs/PAGE-FORMAT.md](docs/PAGE-FORMAT.md) | How pages are written and structured |
| [docs/public-mcp/](docs/public-mcp/) | Specialist packs and outcome delivery through MCP |
| [docs/APPS-PRD.md](docs/APPS-PRD.md) | The Apps section and starter pack |
| [NOTICE.md](NOTICE.md) | Credits and licences for imported items |

## Folder map

```
catalogue-items/   the product: one folder per item, each with item.yaml
  general/         listings any business can use
  ecommerce/       the /ecommerce board
  imported/        openly licensed skills, copied as they are, with credit
  agents/          agents, including Agency Agents imports
  orchestrators/   ready workflows that chain blocks
  minds/           minds and their roster
  _types.yaml      shared input/output types, so parts connect
  _models.yaml     model classes (cheap / mid / top / routed) mapped to today's models
site/              the website (Preact, TypeScript, Vite, Cloudflare Workers, D1)
tools/             check, build, import, test and release tools
mini-tools/        free calculators, one formula file each
app-starter/       the app starter pack
example-app-site/  the saved example app tour
brand/             brand guide, copywriting and exports
docs/              quality bar, writing rules, page format, MCP and app docs
```

To build and run the site locally, use Node 22:

```bash
cd site && npm ci && npm run dev
```

## Relationship to other repos

- **[Creative Engine](https://github.com/KevCode-Absurd/creative-engine)** is a read-only source of tested methods. We copy those methods in, repackage them and record where each came from. Creative Engine is never edited from here.
