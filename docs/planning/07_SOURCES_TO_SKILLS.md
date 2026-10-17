# 07 · Turning learning sources and playbooks into skills

**Date:** 2026-10-17
**Status:** analysis only. Nothing has been converted yet.
**Question (Kevin):** the app has playbooks and learning sections, and we have many other sources of information. How do we turn those sources into skills? Start with what we have now.
**Short answer:** most knowledge shouldn't become a skill on its own. We break each source into small pieces of know-how (rules, steps, checks, thresholds, examples, pitfalls). Each piece goes to the part of a catalogue item where it does the most good. The learning library already lines up with the modules where we have the biggest gaps.

---

## 1. What we have right now

### 1.1 Creative Engine's Learning section: the biggest single source

**Where it lives:**
- Screen: `src/app/learning`
- Content: `src/lib/learning/content/deep/*.json`
- Tailoring: `src/lib/learning/tailor.ts`

**Size: 403 guides in 8 categories.**

| Category | Guides | Main topics | Module(s) it feeds | Do we already have items there? |
|---|---:|---|---|---|
| Creative studio | 137 | Meta creative strategy 50, copywriting 29+10, brand positioning 16, scripts 13, organic-to-paid 10 | M17, M18, BRAIN/M09 | **Yes, strong.** The guides enrich existing items. |
| Landing pages | 68 | Advertorials 15, conversion diagnosis 10, **product pages 7**, quiz funnels 4, store performance 4 | M11, M15 | Partly. **Fills the PDP copy gap.** |
| Insights | 55 | Offer research 10, customer research 5, positioning 4+, subscription offers 2 | M06, M08 | Yes. Enriches the VOC pipeline and offer designer. |
| **Retention** | 48 | Lifecycle flows 8, email copy 8, segmentation 5, measurement 5, SMS 4 | **M21** | **No (the biggest gap).** |
| **Customer experience** | 27 | First use, delivery messages, returns, unboxing, support recovery | **M23** | **No.** |
| Experiments | 25 | Hypotheses, sample design, validity, incrementality | M15 | Partly (test calculator) |
| **Ad monitoring** | 25 | Meta deployment and diagnosis 24, budget 1 | **M19** | **No (big gap, in demand).** |
| **Data** | 18 | Attribution reconciliation, tracking, cohort and acquisition economics | **M14, M25** | **No.** |

**Each guide is already structured like half a skill.** Its fields are:

| Field | Becomes |
|---|---|
| `title`, `summary` | name and promise |
| `whenToUse` | trigger: when this item applies |
| `steps` | 3 or more steps: the procedure |
| `example` | a worked example |
| `successMetric` | how to know it worked |
| `pitfall` | what goes wrong |
| `effort`, `tags` | effort level and tags |
| `body` | the long explanation |
| `sourceIds` | internal provenance |

**The tailor already turns guides into brand plans.** It reads the brand brain, personas, economics and app data, then picks 10 guides. For each one it writes:
- the adaptation for this brand
- the first deliverable
- a **decision rule** (continue, revise or stop)
- steps and prerequisites
- fit / impact / ease / confidence scores

It also labels placeholder numbers as placeholders. That's the "learn → do" bridge, and it's tested in the app.

**Rights (important):** the guides are rewritten in Creative Engine's own words, but they're **adaptations of the "Ecom Intelligence" course archive**. Their 256 source documents come from that archive's playbooks (coded `03-OFF-offers`, `07-LPG-landing-pages`, `10-MCR-paid-social-creative` and so on). The inventory marks them **course: reference only** until Kevin confirms what that course's terms allow.

### 1.2 Playbooks

| Playbook | Where | Rights | Use |
|---|---|---|---|
| Library learning playbook (learn from the reference library) | CE `docs/LIBRARY-LEARNING-PLAYBOOK.md` | **own** | Convert directly (M17) |
| Competitor playbook (ad sources and connections) | CE docs | **own** | Convert directly (M17 competitor-ads stack) |
| E-Commerce Playbook gap plan (15 builds) | CE `docs/PLAYBOOK-PLAN.md` | **own** | Already a build list |
| Ad Script Playbook | CE `docs/playbook-ad-scripts.md` | course (Blue Sense Digital masterclass) | Learn and rebuild (M18) |
| Meta Creative Playbook 2026 | CE `docs/playbook-meta-creative.md` | course (Blue Sense Digital) | Learn and rebuild (M17/M19) |
| The E-Commerce Playbook (Nu Reach Media), ~55 AI-workflow pages plus paid, offers, CRO, email, finance | CE `docs/ecommerce-playbook` | third-party | Learn and rebuild. Nothing in the app reads it. |
| CRO knowledge: 68 landing guides plus 400 landing, 177 CRO and 226 speed cards | CE `docs/landing-pages` | own plan, but the cards are course-derived | Learn and rebuild (M11/M15/M13) |
| SEO knowledge base: 72 guides from 593 cards | CE `docs/seo` | own plan, but the cards come from Ecom Intelligence | Learn and rebuild (M22) |
| `cro-brain` master (56 KB) | CE skill | course | Learn and rebuild. It's the CRO auditor's rubric today. |
| `copy-craft` (17 copy parts) | CE skill | **purchased** (from The Copy Machine, whose licence forbids redistribution) | Stays internal, or gets a clean rewrite from our own tests. Never publish it as is. |
| Gehna offer playbook | Ecommerce OS | private client | Never |

### 1.3 Kevin's own knowledge documents (full rights)

| Source | What's inside that can become items |
|---|---|
| `ecommerce-os-what-good-looks-like.pdf` | **62-check universal baseline** with Blocker/Major/Minor severity; S0–S5 stage model with thresholds and gates; 18 modules, each with goal, inputs, **124 named sub-agents**, human decision and failure mode |
| Financial Opportunity Playbook + `backlog.json` | **300 opportunities** (each with id, stage, group, line, action, proof metric, owner); CM1/CM2 definitions; diagnostic toolkit; offer simulator |
| Lifecycle Blueprint, Customer Delight Architecture | Two-journey system and post-purchase delight (M21, M23) |
| Business-in-a-Box (95 pp), Idea Maps, Opportunity Architecture | The whole-business map (already used for `01`) |
| 11 Oct Creative Engine Business & Implementation Plan | The agency loop and agent designs (SY) |

### 1.4 Creative Engine's learning from its own work (full rights, and tested)

This is the most valuable kind of source: rules **we** learned, with evidence.

| Source | What it is |
|---|---|
| `creative-lessons` register (G-001…G-010) | Rules from human corrections: opening and handling the product, hands, no children, no generated founders, physics, product consistency |
| Brand `lessons.json` | Per-brand rules from feedback, check failures and hand edits |
| Decisions log (537 KB, phases 1–47+) | Every build decision, with measured numbers |
| Creative judge (8 criteria), taste decisions table | Grading rules |
| Efficiency evals (blind A/B on context size and models) | When more context helped and when it hurt |
| Skill value-chain audit (25 before / 25 after) | Proof of which skill knowledge actually improved output |

### 1.5 Other courses and purchases

| Source | Knowledge rows | Where it points |
|---|---:|---|
| Course worksheets (.docx) in Ecommerce OS and CE | ~16 | PDP checklist, Klaviyo audit, email/SMS flow guide, post-purchase flow, 5-test ad checklist, TOF/MOF/BOF plan, brand enemy worksheet, brain questions |
| Skool AI Operator | 137 | Agent designs (SY), media-buying thresholds (M19), tracking checks (M14) |
| Skool AI Video | 264 | Video craft (M18), workflow and tooling (SY) |
| Skool AI CMO | 38 | Creative, email, CRO |
| Ecom Agent OS | 67 | **Benchmark only.** Its licence forbids similar products. |

---

## 2. Rights decide how a source may be converted

| Rights | Examples | How it may be converted |
|---|---|---|
| **Own** | Kevin's Ecommerce OS docs, CE lessons, decisions log, own playbooks | **Directly.** Reuse wording, structure and examples. |
| **Course / third-party** | 403 guides (Ecom Intelligence), Blue Sense playbooks, Nu Reach, Skool, worksheets | **Learn and rebuild.** General ideas and methods can guide our own items, written from scratch. Don't copy text, examples, names or a whole course's structure section for section. Each published item must stand on **our own tests and examples.** Provenance stays internal. |
| **Purchased, no redistribution** | Copy Machine (→ `copy-craft`), EAO | **Benchmark only.** No close rewrites. `copy-craft` gets a clean-room rewrite before anything built on it is published. |
| **Private client** | Gehna | **Never.** |

**One thing Kevin needs to check:** the terms of Ecom Intelligence, Blue Sense Digital and Nu Reach. If any of them allows derived commercial use, the 403 guides could be published far more directly (as Learn pages). Until then we treat them as private input. This isn't legal advice; read the terms or ask a lawyer before publishing derived guides.

---

## 3. The core idea: break sources into pieces of know-how, then put each piece where it works

A guide or playbook is a mix of different kinds of knowledge. Each kind belongs in a different part of a catalogue item (`04` §4 layout, `05` §21 checklist).

| Kind of knowledge in the source | Example from what we have | Goes into the item as |
|---|---|---|
| **When to use** | "Use when an ad has many selling points but no clear reason to choose" | The item's trigger and promise; routing in a stack |
| **Steps** | "Write the single belief → check it → sort material → build around it" | Skill procedure, or workflow steps |
| **Rules and principles** | "One belief per message"; "Never show the product unopened when the job is in-use" | `SKILL.md` rules (soft); **hard rules become code checks** |
| **Checklists** | 62-check baseline; PDP checklist; Klaviyo audit | An **audit skill** plus `tests/checklist.yaml` (the same list grades the output) |
| **Thresholds and numbers** | Stage gates; media-buying thresholds; "N days before judging a creative" | `thresholds.yaml`: dated, sourced and **editable** (edit points), never buried in prose |
| **Templates and frameworks** | Hook formulas, email structures, 19 script types, 20 native image types | Prompt templates and variants (one item with variants, not 20 items) |
| **Worked examples** | "Travel mug message centres on hot coffee" | Not reused when it's course content. We make **our own** examples on Grüns/AG1/IM8. Own examples become golden-set cases. |
| **Pitfalls** | "Removing proof for brevity leaves an unsupported claim" | Negative checks, `degrades_when`, red-team cases |
| **Success metrics and decision rules** | "Compare conversion and CAC under comparable traffic" | The eval, "how to know it worked", and the trigger for a routine |
| **Diagnostic trees** | "If CTR is fine but CVR fell, check the page, then the offer" | Workflow branching. Only becomes an agent if the next step truly can't be fixed in advance (`05` §1). |
| **Explanation / background** | The guide's long `body` | `references/` (loaded only on demand, `05` §8) or a **Learn page**. Usually not in the prompt. |
| **Lists of opportunities** | 300-opportunity backlog | Data plus a ranking routine ("find my top 10") |

**So each source piece ends up as one of five things:**
1. a **new skill or prompt** (it produces an output)
2. **part of an existing item** (a rule, step or reference)
3. a **check** (it judges an output)
4. a **Learn page** (it explains)
5. **dropped** (duplicate, outdated, contradicts our tests, or on the "won't adopt" list)

### 3.1 The test for which one

| Question | If yes |
|---|---|
| Does following it **produce a deliverable** (copy, plan, brief, audit)? | Skill or prompt (new, or a mode of an existing one) |
| Does it **judge** something? | Check or rubric |
| Is it a **sequence across tools or time** (weekly, after launch)? | Workflow or routine |
| Is it **only explanation**? | Reference file or Learn page |
| Does an item already do this job? | Merge into that item; don't make a new one |

### 3.2 Knowledge must earn its tokens

More knowledge in a prompt doesn't automatically mean better output. Creative Engine's own evidence:
- its efficiency evals found cases where more context **hurt**
- 8 overlapping copy checks policed the same thing

So every piece added to an item is tested **with vs without** on the golden set:
- If quality goes up, it stays.
- If not, it moves to `references/` or a Learn page, or it's dropped.

This is the same "with/without" method we use for the brand brain, applied to knowledge.

---

## 4. The conversion pipeline (source → item)

This adds four steps to the item factory in `06` §3. The per-item pipeline in `06` §8 is otherwise unchanged.

| # | Step | What happens | Output |
|---|---|---|---|
| 1 | **Register the source** | Path, owner, rights, date, version, hash. Rights decide what's allowed later (§2). | `knowledge/sources.yaml` |
| 2 | **Split into pieces** | Each source is cut into pieces of one kind from §3 (rule, step, check, threshold, template, example, pitfall, metric, explanation). The 403 guides are already split by field. PDFs and docs need a cheap model to split them, plus a spot check. | `knowledge/pieces/*.jsonl` |
| 3 | **Tag** | Module (M01–M28), kind, stage fit (S0–S5), evidence: **tested by us / source says / contradicted / outdated** | tags on each piece |
| 4 | **Group and resolve** | The same idea from 5 sources becomes one piece listing all 5. **Contradictions are flagged for Kevin**, not resolved silently. Known ones: the Google and Meta course clashes; the "CAPI within 5 minutes" rule against its own p95 check; the outdated AEM step. | `knowledge/clusters/*.yaml` + `contradictions.md` |
| 5 | **Map to items** | Each group is assigned to an existing item (enrich it) or a new item, using the §3.1 test | `knowledge/map.csv` (piece → item, field) |
| 6 | **Write in our words** | The item's `SKILL.md`, `checklist.yaml`, `thresholds.yaml` and references are written from the mapped pieces, model-neutral, in cache order. Course pieces are **paraphrased from scratch**, never pasted. | item files |
| 7 | **Test with vs without** | §3.2: each group of pieces must raise golden-set quality, or it leaves the prompt | `tests/knowledge-ablation.csv` |
| 8 | **Keep the links** | `item.yaml` gets `learned_from[]` (internal). When a source changes or a contradiction is settled, we know which items to recheck. | `item.yaml` |

New tools: `register-source`, `split-source`, `group-pieces`, `map-pieces`. They're small, and they reuse Creative Engine's lesson schema (`src/lib/learning/types.ts`) as the piece format, because it already has the right fields.

**Model classes:** splitting and tagging are C1 (cheap). Grouping and contradiction finding are C2. Writing the item is C3, with a review by me.

---

## 5. What this means for what we have now

### 5.1 The 403 guides line up with our gaps

The modules marked **Gap** in `03` (M19, M21, M23, M14, M25) are exactly where the guides are deep and our own items are thin:

| Gap module | Guides available | First items they'd seed (Starter → Standard) |
|---|---:|---|
| **M21 Email/SMS** | 48 retention | Welcome, abandoned-cart and post-purchase flow builders; segment planner; email copy writer; retention measurement sheet. Combine with the **archived retention module** and Kevin's Lifecycle Blueprint (own). |
| **M19 Meta analysis** | 24 deployment and diagnosis | Weekly Meta check (sheet + prompt → skill); "why did it drop" diagnostic workflow; launch checklist. **Every change is a proposal for approval; no auto-pausing.** |
| **M23 Support & returns** | 27 customer experience | Delivery-message set, returns recovery replies, first-use guide writer |
| **M14 Tracking** | ~10 data | Tracking health check (turns into a checklist and checks) |
| **M25 Profit** | ~8 data/economics, plus Kevin's 300-opportunity backlog (own) | Contribution margin calculator, "top 10 profit opportunities" ranker |
| **M11 PDP copy** (the gap inside M11) | 7 product pages + 15 advertorials | **PDP copy skill**, advertorial writer |

In the strong modules (M17, M18, M06, M08, M15), the guides become **rules, steps and checks inside existing items**. For example:
- Meta creative strategy guides → the sprint planner and concept generator
- offer research guides → the offer designer
- experiment guides → the test calculator and a hypothesis writer

### 5.2 Kevin's own documents become items directly

| Own source | Becomes | Level / module |
|---|---|---|
| 62-check universal baseline | `store-baseline-audit`: Starter = checklist sheet; Standard = a skill that reads the store and grades each check by severity | skill, M01 |
| S0–S5 stage model and gates | `store-stage-check`: tells a store its stage and what matters at that size. Also powers the site's "By stage" door. | prompt/skill, M01 |
| 18 modules × 124 named sub-agents | **A candidate item list per module**, our own design. Each sub-agent becomes a skill or workflow step when its section comes up. | many |
| 300-opportunity backlog | `profit-opportunity-ranker`: picks the top 10 for a brand from its numbers, with a proof metric for each | routine, M25 |
| Offer simulator and CM1/CM2 definitions | Contribution-floor maths for the offer designer (the M08 gap) | skill part, M08 |

### 5.3 Our own lessons become hard rules and checks

- **`creative-lessons` G-001…G-010 and brand `lessons.json`** become hard rules in the M17/M18 items, enforced by checks (for example, "product shown opened when the job is in-use"). They also become red-team and golden cases.
- **The decisions log** gives measured reasons: each item's changelog and "why it's built this way" note cites the decision.
- **The efficiency evals** give the first data for model guidance and lean mode.

### 5.4 The tailor becomes a catalogue item itself

`growth-plan-from-playbook` (workflow, C3): pick the 10 moves that matter most for this brand, each with an adaptation, first deliverable, decision rule and scores. It's the bridge from "Learn" to "Do". On the site, every Learn page gets a **"Make this into a plan for my brand"** button. That button runs the tailor on that page plus the user's brand brain, and links to the items that do the work.

This only works once there are **our own** Learn pages to read from (§2), so it ships after the first gap modules are rebuilt.

---

## 6. What changes on the site

| Addition | What it is |
|---|---|
| **Learn layer** | Short Learn pages in our own words, one per method (for example "One belief per message"). Each page shows *which items use this*. The item page gets a "Why this works" section linking back. |
| **Playbook = stack + Learn pages** | A playbook on the site is a stack (the items in order) plus the Learn pages that explain each step. "BFCM playbook" = the M28 stack + its Learn pages. |
| **"Turn your own playbook into skills"** (later, paid) | The same pipeline from §4, offered to users and agencies: upload your SOPs or playbook, get your own private items. It's a strong consulting and subscription feature, and it's how creators would bring their playbooks to the marketplace. |

---

## 7. Where it fits in the build plan (`06`)

- **Phase 1 (item factory):** add `register-source` and `split-source`. Register and split the 403 guides and Kevin's own docs first (cheap, mostly code, since the guides are already structured).
- **Every section, before "tighten for ecommerce":** pull the pieces mapped to that section's items, write them in, and run the with/without test.
- **Section 1 (brand brain):** uses the 16 brand-positioning guides, Kevin's own brain questions, and the brand-enemy idea (rebuilt in our own words).
- **Section 6 (M21)** is the first section to be **built mostly from knowledge**. It's the real test of this pipeline: 48 guides + the archived module + the Lifecycle Blueprint. If Kevin wants proof sooner, M21 can move up to straight after M17.
- **Sections 7 (M19) and later** use the same pattern for M23, M14 and M25.

---

## 8. Open questions for Kevin

1. **Course terms:** can we publish anything derived from Ecom Intelligence, Blue Sense Digital or Nu Reach? This decides whether the 403 guides become Learn pages or stay private input.
2. **"That app":** did you mean Creative Engine (its Learning section and playbooks are what this doc covers), or the separate cloud "ecommerce OS app"? If it's the cloud app, I need its repo to look at its playbooks too.
3. **`copy-craft`:** OK to plan a clean-room rewrite from our own tests, so the M17/M18 items that rely on it can be published?
4. **M21 timing:** keep it at section 6, or move it up to test the knowledge pipeline sooner?
