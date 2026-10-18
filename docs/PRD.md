# PRD · AI Building Blocks, v0

**Status:** approved to build, 18 Oct 2026 (Kevin: "go ahead and start building it out"). This PRD turns the final plan (`docs/FINAL_PLAN.md`), the deck (v4) and the engineering framework (`docs/planning/10_AI_ENGINEERING_FRAMEWORK.md`) into what we build first. Where this PRD is more specific, it wins for v0; where it is silent, those documents apply.

## 1 · The product in one paragraph

A free library of AI building blocks for any business. Each block is a small, well-written part (a skill, a prompt, a checker, a connector) with a plain name, a clear contract (what goes in, what comes out) and a real example. People browse the library, keep the blocks they like in **kits**, and snap blocks together on a **canvas** to make their own workflow. One click downloads that workflow as a **handoff pack**: an ordered, plain-language handoff document plus every skill file, so Claude (or any capable AI agent) can run the whole thing step by step. The pack is built by plain code, not by an AI, so it is the same every time.

## 2 · Who it's for and the first jobs

| Person | What they come to do | What v0 gives them |
|---|---|---|
| A founder or marketer at any small digital business | "I need ad copy / a landing page / to understand my customers" | Find a block in under a minute; copy or download it; see a real before and after |
| An ecommerce operator (the first board) | "Make me a week of ads for my product" | Ecommerce versions of each block and ready-made chains (brand brain → research → script → images) |
| A builder who already uses Claude | "I want my own pipeline" | The canvas: drag blocks in, connect them, download the handoff pack, hand it to Claude |

## 3 · What v0 includes

1. **One page.** Header, hero, then the sections in §5.
2. **Library.** Every block, with search, filters (category, job, type, role, level) and three shelves: **Most popular**, **Recently added**, **Start here**. Fast: one prebuilt JSON index, no server.
3. **Block drawer.** Name, one-line summary, what it needs and gives, the skill itself, the ecommerce add-on where one exists, what it connects to, "Copy skill", "Download", "Save to kit", "Add to builder".
4. **Two categories.** **General** (any business) and **Ecommerce** (online stores). A general block can carry an ecommerce add-on; the add-on never forks the block.
5. **Kits.** Save blocks into named kits. Kits persist in the browser now and move to a free account later (accounts hold no business data; decided 18 Oct).
6. **Canvas (workflow builder).** Drag blocks from a side panel onto a canvas, connect an output to an input, reorder, see when a connection's types don't match, save, and download the handoff pack. Persisted like kits.
7. **Handoff pack export (deterministic).** A zip containing `HANDOFF.md`, `workflow.json` and `skills/<slug>/SKILL.md` for every block used. Rules in §6.
8. **No brand examples on the site** (decided 18 Oct). Brand examples stay in test sets, not on the page.

**Not in v0:** comments, votes, boards as communities, accounts on a server, running models on the site, the intake engine UI, mini tools, the course pages beyond an outline. They follow the final plan's timeline.

## 4 · Building blocks: the parts and how they connect

Every block has a **type** (what it is) and a **role** (what it does in a chain).

| Type | Meaning |
|---|---|
| `prompt` | One call, copy and paste |
| `skill` | A SKILL.md with steps, checks and references; the main unit |
| `workflow` | An ordered chain of skills with typed handoffs |
| `routine` | A workflow on a schedule |
| `agent` | Plans, checks in code, asks approval, then acts |

| Role | What it does | Examples |
|---|---|---|
| `source` | Brings information in | Brand brain builder, review collector, store inspection |
| `compress` | Turns a lot of information into a short, usable digest | Review mining, persona builder, brief writer |
| `make` | Writes the thing | Ad copy, video script, landing page |
| `render` | Produces media | Image prompt writer, photoshoot, video director |
| `check` | Gates quality before anything moves on | Ad policy check, brand voice check, pre-launch checklist |
| `orchestrate` | Wires blocks together, passes outputs to inputs, decides the order | "Brand brain → script → images" |

Blocks connect through **typed ports** listed in `catalogue-items/_types.yaml` (`brand_brain`, `voc_reviews`, `persona`, `brief`, `script`, `image_prompt`, …). An output connects to an input when their types match. The canvas warns (but allows) when they don't, because a person can bridge the gap by hand.

### 4.1 Folder and file format

```
catalogue-items/
  general/<slug>/      item.yaml, SKILL.md, boards/ecommerce.md (optional add-on)
  ecommerce/<slug>/    item.yaml, SKILL.md
  orchestrators/<slug>/ item.yaml, SKILL.md
  _types.yaml  _models.yaml  _names.yaml
```

`item.yaml` fields (v0):

```yaml
slug: review-mining-to-angle-library       # descriptive, kebab-case, says what it does
name: Review Mining to Angle Library        # human title
summary: One sentence, plain words, what you get.
category: general | ecommerce | orchestrator
boards: [ecommerce]                         # general blocks with an ecommerce add-on
type: prompt | skill | workflow | routine | agent
role: source | compress | make | render | check | orchestrate
job: brand | research | offer | copy | image | video | page | ads | email | organic | analysis | ops
level: beginner | intermediate | advanced | expert
inputs:  [{type: voc_reviews, required: true}]
outputs: [{type: shortlist}]
uses: [other-slug]                          # blocks this one calls or reads
example: anime                              # id of an example picture, if any
origin: own | rebuilt                       # rebuilt = written from scratch in our words from a course idea
source_ids: [CES-103]
old_name: review-mining
version: 1.0.0
```

Orchestrators (`category: orchestrator`, `type: workflow`, `role: orchestrate`) add `steps: [{uses: <slug>, note: <what this step passes on>}]`, in order. The canvas opens them as a chain, and their SKILL.md says how each step's output becomes the next step's input.

`SKILL.md` follows the one prompt standard (framework §3): frontmatter `name` and `description` (when to use it), then **What it does**, **Inputs** (labelled, outside text treated as data), **Steps**, **Output** (exact format and length), **Checks** (what fails the run), **If something is missing** (write `MISSING:` instead of guessing), **Avoid**. No filler, no repeated rules, no history notes.

### 4.2 Rules for the skill pass

- **Rename** every block to a descriptive name that says what it does and what it makes.
- **Tighten.** Cut anything that repeats, explains the obvious, or tells the history of the skill. Keep every rule that changes the output.
- **Split general from ecommerce.** If the method works for any business, the main skill is general and the ecommerce detail moves into `boards/ecommerce.md`. If it only makes sense for physical products (PDP images, photoshoots), it lives in `ecommerce/`.
- **Rights.** Own material is tightened. Course-derived material is rebuilt from scratch in our own words with new names and new examples, never copied (RULES.md §2).
- **Sources stay read-only.** We copy from Creative Engine; we never edit it.

## 5 · Design (revised 18 Oct: one page, x.ai-like)

One page: a header, the headline **"Making humanity AI native"**, a subhead on saving time and doing ten times more (become the 10x human), then the content: how it works, the library, ready workflows, the builder, how we test, get started. Blocks and workflows open in a side drawer, so nobody leaves the page.

- **Look:** modelled on x.ai. Dark first (near-black #0a0a0a, panels #161616, soft grey text, white pill buttons) with a matching light mode; it follows the system until the person picks one.
- **Type:** one neutral sans (Geist) with a mono (Geist Mono) for skill names and the terminal demo.
- **Colour:** monochrome; small role colours only where they say what a block does.
- **Hero visual:** a request and the handoff running step by step, as two terminal-style panels.
- **No brands:** no brand names or brand pictures anywhere on the page.
- **Easy to use:** section links in the header with the current section highlighted, plain labels, one clear primary action per section, keyboard and screen-reader friendly, phone width without sideways scroll.

## 6 · The handoff pack (deterministic export)

Built in the browser by plain code from the saved workflow. Same workflow in, same pack out.

- `HANDOFF.md`: what the workflow makes; what to prepare (the inputs nothing inside the chain provides); then each step in order with the block's name and slug, what it does, which earlier step's output it reads, what it must produce, and the check before moving on; then the run rules (stop on a failed check, write `MISSING:` instead of guessing, ask before anything that publishes or spends).
- `workflow.json`: the graph (nodes, edges, order, versions) for tools and agents.
- `skills/<slug>/SKILL.md` (and `boards/ecommerce.md` when the ecommerce add-on is on), so the agent uses the same skill names.
- `README.txt`: three lines on how to use it ("Upload this folder to Claude, then say: follow HANDOFF.md").

Order is a topological sort of the graph, ties broken by canvas position (top to bottom, left to right). A cycle is refused with a clear message.

## 7 · Technical approach

- **Site:** Vite + React + TypeScript, static build, no server. Deploys to any static host.
- **Data:** a build script reads `catalogue-items/**` and writes one `blocks.json` index plus per-block skill text, so the library loads fast.
- **Persistence:** kits, canvases and recent items in `localStorage` behind one small storage module, so moving them to an account later changes one file.
- **Zip:** built in the browser with a small zip library.
- **Testing a block's output:** Claude credits only for now (Kevin, 18 Oct). Runs follow the framework's test rules.

## 8 · Done means

- Every Creative Engine skill has a renamed, tightened block in `catalogue-items/`, in the right category, with `item.yaml`.
- The site builds, loads the library from the index, and the canvas exports a handoff pack whose `HANDOFF.md` lists the steps in the right order.
- The page reads clearly at desktop and phone width, in dark and light, checked in the browser and by the end-to-end tests (`site/e2e/`).
- Everything is committed and pushed.

## 9 · Order of work

1. This PRD.
2. The skill pass (sub-agents, one per family), then a merge and name check.
3. The orchestrators and a handful of ready-made workflows.
4. The site: design system, homepage, library, block page.
5. Kits, the canvas and the handoff export.
6. Check in the browser, commit, push.
