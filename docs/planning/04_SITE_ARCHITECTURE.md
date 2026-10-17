# 04 · Site architecture (plan only, nothing built)

**What this is:** how the catalogue site is organised. It covers what pages exist, what every item page shows, how items are stored, and how the decisions so far (levels, tiers, dependencies, model guidance, efficiency, examples, marketplace) fit together.

**Decisions it follows** (from Kevin, 2026-10-17):
- **Parts, not a finished car.** The catalogue has six levels: prompt → skill → routine → workflow → agent → system.
- **Reuse Creative Engine.** Build on its parts; brand brain comes first.
- **Every item gets the same core content:** a plain explanation, an example output, how to run it with or without Claude Code, ChatGPT and Codex, the items above and below it, and the recommended model.
- **Examples use public data** from known brands (Grüns, AG1, IM8). They are labelled as examples, carry no invented claims, and are shown with and without the brand brain.
- **Users can tweak everything.** Depth tiers run from Starter to Production. Routing alternatives such as OpenRouter are allowed.
- **Marketplace later,** with a 70/30 split in the creator's favour.

---

## 1. Navigation: five ways into the same catalogue

Every item sits on one shared map. The site just offers different doors into it.

| Door | Shows | Who it's for |
|---|---|---|
| **By business area** (main nav) | The 7 groups and 28 modules from `01_ECOMMERCE_BUSINESS_MAP.md` | "I need help with email" |
| **By goal (stacks)** | Ready-made chains such as Competitor-inspired ads, BFCM pack, Launch a product, Fix my PDP, Weekly Meta check | "I want this outcome" |
| **By level** | Prompts · Skills · Routines · Workflows · Agents · Systems | "I just want prompts" or "show me agents" |
| **By stage** | S0 Explore → S5 Large, filtering to what matters at that size | "What should a store my size use?" |
| **By tool** | Works in Claude Code / ChatGPT / Codex / any AI via a router | "I only use ChatGPT" |

Filters on every list: tier (Starter → Production), needs brand brain (yes/no), complexity and cost (C1–C4), free/paid, author (Creative Engine / creator), and tested on an example (always yes before publishing).

---

## 2. Page types

| Page | Purpose | Notes |
|---|---|---|
| **Home** | Start with the brand brain, then browse by goal | Hero: "Make your brand brain, then plug it into any part" |
| **Brand brain hub** | Build, download and update your brand brain | Item #1. Exports as a Claude Code folder, a ChatGPT/Claude Project .md, or a short GPT-instructions block |
| **Module page** (e.g. M21 Email) | Explains the module, lists its items by level and tier, links its stacks | Includes a "what good looks like at your stage" box |
| **Item page** | One part (see §3) | The core page of the site |
| **Stack / recipe page** | A best-practice chain for a goal, step by step | Shows which step needs what; one-click download of the whole bundle |
| **Model guide** | Which model class suits which complexity, current price per class | Fed by the model tests (§6) |
| **How-to-use guides** | Setup once per tool: Claude Code, ChatGPT (Projects, custom GPTs), Claude.ai Projects, Codex, OpenRouter / LiteLLM / Portkey | Each item page links into these instead of repeating them |
| **Help me build this** | Implementation and consulting request | A button on every agent and system page |
| **Pricing** | Free vs subscription | See §9 |
| **My workspace** (logged in) | My brand brains, saved prompts, my forks ("make my version"), run history | No real data is shown publicly |
| **Creator marketplace** (later) | Submit, list and sell items | Opens once there is traffic (§10) |

---

## 3. The item page (the same template for every level)

Sections in order. Bold ones are new this week.

1. **Header:** name in plain words, one-line promise, level badge, tier badge, module, "tested on example ✓", version, author.
2. **What it does:** 3–5 sentences for a shop owner, with no jargon.
3. **Example output:** run on a public brand and labelled "Example made from public info about Grüns, not affiliated."
   - Tabs: **Without brand brain** / **With brand brain** / **With brand brain + references**.
   - Under each tab, notes that explain what each part of the output means.
4. **Inputs:** what you give it, using the shared types in §5. Each input is marked Required, Recommended (with the quality difference shown in the examples) or Optional.
5. **Above and below (dependencies):**
   - **Needs:** required items.
   - **Improves with:** recommended items.
   - **Feeds into:** what uses its output next.
   - Shown as a small chain diagram. Clicking any node opens that item.
6. **Which model to use** (complexity C1–C4):
   - Recommended model class, budget pick, and "not worth it" pick, each with tested quality %, cost per run and speed.
   - For workflows and agents: a model per step plus the total cost per run.
7. **Run it efficiently:**
   - **Caching order:** the stable parts (brand brain, skill instructions, references) go first and the new input goes last, so prompt caching works on Claude, OpenAI and Gemini.
   - **Reuse:** save the filled-in prompt; reuse earlier outputs as inputs, such as saved personas or a reference shortlist.
   - **When quality drops and how to avoid it:**
     - long chats: start fresh after N runs
     - auto-compaction dropping brand details: reload the brand brain section
     - too many references: cap at K
     - several jobs in one run: one product per run
   - **Token budget:** tokens per run, plus a **lean mode** (fewer references, short brand brain card).
   - **Routing:** works directly in Claude/ChatGPT/Codex or through OpenRouter, LiteLLM or Portkey. Skill files stay model-neutral.
8. **How to run it**, in tabs:
   - **Claude Code:** download the skill folder, put it in `.claude/skills/`, run `/name`.
   - **ChatGPT:** Project knowledge files plus the instructions block, or a custom GPT.
   - **Claude.ai Projects.**
   - **Codex:** `AGENTS.md` + skill folder.
   - **Any AI / router:** a plain prompt with placeholders.
   - **No AI:** a checklist or sheet version where one makes sense (Starter tier).
9. **Edit points:** the 3–6 places users usually change (tone, length, number of variants, thresholds), plus "Make my version" (fork into My workspace).
10. **Tiers:** links to the Starter / Standard / Advanced / Production versions of the same job, with what you gain at each step up.
11. **Quality checklist:** what a good output must pass. The same checklist grades the model tests.
12. **Changelog and stats:** version history, "tested on N example brands", ratings, and "used by N brands" once live.
13. **Get help:** "Help me build this" (paid implementation) and affiliate links to the tools it needs (Klaviyo, Foreplay, Higgsfield…), clearly marked.

---

## 4. How items are stored: content as files, one manifest per item

The catalogue is a folder of items, each with a manifest. The site, the downloads, the dependency map and the model-test runner all read from the same files. This is also the layout we use when we start bringing in skills section by section.

```
catalogue-items/
  _types.yaml                 shared input/output types (§5)
  _models.yaml                model classes → today's models + prices (§6)
  M17-creative/
    skill/static-ad-generator/
      item.yaml               the manifest (below)
      SKILL.md                the skill itself, model-neutral
      references/             its reference files
      lean/                   short version for lean mode
      exports/                built automatically: chatgpt.md, gpt-instructions.txt, codex/, prompt.txt
      examples/
        gruns/without-brain/  output + notes on each part
        gruns/with-brain/
        gruns/with-brain+refs/
      tests/
        checklist.yaml        quality checklist
        model-runs.csv        model × quality × cost × time
  stacks/
    competitor-inspired-ads.yaml
    bfcm-pack.yaml
```

**`item.yaml` fields:**

| Group | Fields |
|---|---|
| Identity | `id`, `name`, `slug`, `promise`, `level`, `tier`, `module`, `stage_fit[]`, `version`, `author` (house / creator id), `license`, `price`, `status` (draft / tested / published) |
| Contract | `inputs[]` (type, required/recommended/optional), `outputs[]` (type) |
| Dependencies | `needs[]`, `improves_with[]`, `feeds_into[]` (mostly computed from types; manual overrides allowed) |
| Models | `complexity` (C1–C4), `model.recommended`, `model.budget`, `model.not_worth_it`, `steps[]` (for workflows: per-step complexity and model) |
| Efficiency | `cache_order[]`, `context_budget_tokens`, `lean_mode`, `degrades_when[]`, `reuse[]`, `routers_ok[]` |
| Run guides | `runs_in[]` (claude-code, chatgpt, claude-projects, codex, router, manual) |
| Edits and upgrades | `edit_points[]`, `tiers` {starter, standard, advanced, production → item ids} |
| Provenance | `examples[]` (brand, with/without brain, date), `learned_from[]` (internal only; course and purchased sources are never shown or bundled) |

---

## 5. Shared input/output types: how dependencies build themselves

Each item declares typed inputs and outputs. When one item's output type matches another's input, they connect. The "above and below" links, the stack builder and the system builder's checks are all computed from this.

Starting type list:
- **Brand and product:** `brand_brain`, `product_data`, `offer`, `persona`
- **Research:** `voc_reviews`, `competitor_set`, `reference_set`, `ad_breakdowns`, `shortlist`
- **Creative:** `brief`, `hooks`, `ad_copy`, `script`, `image_prompt`, `static_ads`, `video_ads`
- **Data and pages:** `performance_sheet`, `landing_page`, `pdp_copy`, `email_flow`, `audit_report`, `plan`

These are the same names the inventory CSVs already use.

**Build checks:**
- Missing a **required** input blocks a system build.
- Missing a **recommended** input warns the user and shows the with/without example so they can see what they lose.

**How the brand brain behaves:**

| Item | Brand brain is | Because |
|---|---|---|
| Ad analysis | Optional | It reads the numbers |
| Brief writer, ad generator, email writer, PDP copy | Recommended or required | They write in the brand's voice and must stay inside its claims |

---

## 6. Model guidance and testing

**Complexity classes.** The first guess per item is already in the master CSV's `complexity` and `model_class` columns.

| Class | Task type | Model class |
|---|---|---|
| C1 | Reformat, extract, fill a template, write an image prompt | cheap: DeepSeek / Gemini Flash / GPT mini / Haiku |
| C2 | Short rules-based writing (hooks, headlines, ad copy variants) | mid: Sonnet / GPT standard / Gemini Pro |
| C3 | Long multi-input reasoning (full script, strategy brief, audit) | top: Opus / top GPT |
| C4 | Workflows and agents | per step: a top model plans, cheap models run the repeated steps |
| + media | image generation, video generation, video understanding | named per step (e.g. Gemini for ad breakdowns) |

**The model test** (runs before publishing and again when a big new model ships):
1. Run the item on the same example input with one cheap, one mid and one top model.
2. Grade each output against the item's quality checklist. Use blind judging; Creative Engine already has a blind judge.
3. Record quality %, cost per run and time in `tests/model-runs.csv`. Creative Engine's cost ledger already logs cost per call.
4. The item page shows the recommended, budget and not-worth-it picks from that data.

`_models.yaml` maps each class to today's models. Pages name classes, so when models change only one file updates.

---

## 7. Downloads and bundles

| Format | What's inside |
|---|---|
| **Claude Code** | `.claude/skills/<slug>/` with SKILL.md, references and a `depends.yaml` that names the brand brain path and other parts |
| **ChatGPT / Claude Projects** | One combined `.md` for Project knowledge, an instructions block, and the order of use ("load brand brain first, then…") |
| **Custom GPT** | Instructions text plus knowledge files, within GPT size limits (uses lean mode) |
| **Codex** | `AGENTS.md` snippet plus the skill folder |
| **Any AI / router** | `prompt.txt` with `{placeholders}` and the recommended model string for OpenRouter / LiteLLM |
| **Stack bundle** | All parts of a stack plus a run order. Prompt on download: "Works much better with Brand Brain + Reference shortlist. Get the bundle?" |

---

## 8. Example policy (what's shown on the site)

- Examples come from **public information about well-known brands** (Grüns, AG1, IM8 and similar).
- Every example is labelled: "Example made from public info, not affiliated with <brand>."
- No invented claims. Use only what the brand says publicly (its site, its ads, public reviews).
- Never show private client data. Gehna stays out unless it later becomes a permitted case study.
- Never show third-party course or swipe-library images. Reference ads shown on the site are links or IDs from the user's own connector, never re-hosted copies.
- Every published item has at least one example. Recommended inputs get a with/without pair.

---

## 9. Money: where each revenue stream sits on the site

| Stream | Where | When |
|---|---|---|
| **Free tier** | All prompts, Starter tiers, brand brain builder, guides | Launch |
| **Affiliates** | "Tools this needs" box on item pages, How-to-use guides, clearly marked | Launch |
| **Subscription** | Skills, workflows, agents and systems above Starter; model-test data; lean modes; stack bundles; workspace (saved prompts, forks, history) | Soft launch → paid tier |
| **Implementation / consulting** | "Help me build this" on agent and system pages | Launch (manual at first) |
| **Advertising** | Sponsored tool slots in module pages (limited, labelled) | Last, once traffic exists |
| **Marketplace (70% creator / 30% platform)** | Creator listings | Later |

---

## 10. Marketplace (later): what the architecture must already allow

Nothing is built now, but the manifest is ready for it:
- `author`, `license` and `price` are already fields.
- Every listing must pass the same item page template, include a tested example and a quality checklist, and use the shared types, so creator items plug into the dependency map.
- Payouts:
  - one-off sales split 70/30
  - subscription usage pool, split by each creator's share of runs
  - remix shares to the original author when someone publishes a fork
- Review before listing (example present, no rights problems, none of the "will not adopt" patterns from `03` §5), plus ratings and "used by N brands".
- Stripe Connect for payouts (later decision).

---

## 11. Build order for content, section by section (no site build yet)

This is the order for bringing skills in, renaming, optimising and testing. The site comes after the first batches exist.

1. **Brand brain** (BRAIN): one builder, three export formats, Grüns example.
2. **M17 Creative and static ads:** the strongest area. Rename, merge duplicates, package the studio chain, sprint planner, reference remixer and hook generator. Add the competitor-ads stack.
3. **M18 Scripts:** the script chain, hooks and primary text. Video production waits until it renders reliably.
4. **M06 Research and M08 Offers:** VOC pipeline, personas, offer designer (add contribution maths).
5. **M11 / M15 Pages and CRO:** landing page builder, CRO auditor. Add a **PDP copy skill**.
6. **M21 Email/SMS:** revive or rebuild from the archived retention skills.
7. **M19 Meta analysis:** Starter (sheet + prompt) → Standard (weekly skill) first; agents later.
8. **M28 BFCM pack:** the launch showcase, chaining items from steps 1–7.
9. Then M22 SEO, M20 Google, M25 Profit, M26 Creators, M23 Support.

**Per item, the same pipeline:** rename → tighten for ecommerce → write `item.yaml` → make examples (with/without brand brain) → run the model test → pass the checklist → mark tested.
