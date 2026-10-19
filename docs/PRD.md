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

1. **One page.** Header, hero, library, builder (§5).
2. **Library.** Everything, by type (prompts, skills, workflows, agents), with search, plain task filters and level. Fast: one prebuilt JSON index, no server.
3. **Block drawer.** Name, one-line summary, what it needs and gives, the skill itself, the ecommerce add-on where one exists, what it connects to, "Copy skill", "Download", "Save to kit", "Add to builder".
4. **Two categories behind the scenes.** General and ecommerce stay in the catalogue files; the page doesn't split by business.
5. **Kits.** Save blocks into named kits. Kits persist in the browser now and move to a free account later (accounts hold no business data; decided 18 Oct).
6. **Canvas (workflow builder).** Drag blocks from a side panel onto a canvas, connect an output to an input, reorder, see when a connection's types don't match, save, and download the handoff pack. Persisted like kits.
7. **Handoff pack export (deterministic).** A zip containing `HANDOFF.md`, `workflow.json` and `skills/<slug>/SKILL.md` for every block used. Rules in §6.
8. **No brand examples on the site** (decided 18 Oct). Brand examples stay in test sets, not on the page.
9. **Your own skills** (added 19 Oct, next). "Add your own skill" in My kits and the builder: drop in or paste a `SKILL.md`, pick what it needs and gives, and use it in kits and workflows next to ours, marked "Yours". It stays in this browser and is never run on the site. The handoff pack carries it and says we didn't test it. Spec: `docs/planning/11_YOUR_OWN_SKILLS.md` §1. Submitting a skill to the library comes after launch (same doc, §2).

**Not in v0:** skill submissions to the library, paid skills, comments, votes, boards as communities, accounts on a server, running models on the site, the intake engine UI, mini tools, the course pages beyond an outline. They follow the final plan's timeline.

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

## 5 · Design (revised 18 Oct: jobs first, a page for every block)

Anyone should land, understand it and start in under a minute. A visitor is hiring a block for one job (write ad copy, audit a landing page, read ad results), so the site is organised by job and every page leads with the outcome.

- **Home:** a header (Library, Builder, My kits, light/dark), the headline **"Making humanity AI native"** over a slowly turning globe of 0s and 1s, the subhead in mono ("Stop doing the work AI could do for you. Save hours every week, and spend them on the work only you can do.") then two buttons, **Browse the blocks** and **Build a workflow**. Then the library, then the builder. The subhead types itself out once like a terminal.
- **Library:** a big search box, then **8 job functions** as the main way in (Copywriter, Meta media buyer, Graphic designer, Video editor, CRO specialist, Brand strategist, Social media manager, Founder). Picking one shows the jobs it covers as chips (for a copywriter: write ad copy, write and build a landing page, make an offer). Then **Prompts, Skills, Workflows** tabs and three dropdowns: **Business** (any business, online stores), **You have** (what you start from: reviews, a product page, ad results…) and **Level**. Every count reflects the other choices. Filters live in the URL. Agents are left out for now.
- **A page for every block** at `/prompts/<name>`, `/skills/<name>` or `/workflows/<name>`, not a side drawer. Order (`docs/PAGE-FORMAT.md`, "Page order"): the outcome as the headline and a subhead that explains it, actions (copy the skill, download, save to kit, **add to a workflow**; for workflows, download it and open it in the builder), then **See it work** (the output first, then "See what went in"), what it does step by step, what you give it and what you get (with the shape every run hands back), how to use it (with a box to paste your details once and copy the skill with them), get the most out of it, test it, improve it for your business, words explained, the full skill file and the online-store add-on, and what to use it with. Content comes from `page.yaml` in each block's folder; writing rules in `brand/COPYWRITING.md` (wins) and `docs/WRITING.md`.
- **Add to a workflow** (a pop-up on every prompt and skill page): start a new workflow with this block, add it to one of yours, or copy a ready workflow. The steps show as a list: drag them or use the arrows to reorder, remove any, add more from suggestions ("what usually comes next") or a search. Saving keeps it in this browser, and "Open in the builder" shows it on the canvas. Hand-drawn connections are kept unless steps are moved.
- **Your business:** "My business" in the header holds the business details (name, what you sell, who buys, why they pick you, proof, voice, website, what never to say), typed once and kept in this browser. Every "Copy the skill" and the paste-your-details box add them after the skill, and every workflow download carries them as `my-business.md`, which HANDOFF.md tells the AI to read first.
- **After a download:** the same dialog that lists what you'll need turns into how to run the folder in Claude, Claude Code, ChatGPT or any other AI (the choice is shared with skill pages), with the first message to paste, what it will ask for and what comes back.
- **Builder bar:** one row at any width. When the canvas is narrow, Share, New, Delete and Saved workflows fold into **More**.
- **Preview:** each step lights up in order and a card shows the first lines of what it made for Sprout, at full size; clicking a step shows a longer piece of its real result.
- **Builder suggestions:** the palette opens on **Suggested**: with an empty canvas, good first steps and where ready workflows start; after a block, what follows it in ready workflows, then blocks that use what it hands back. Also **All** and **My kits**, and a search.
- **Library cards** show a peek of the real output and a "View the skill" link. The home subhead types itself out once; `/` jumps to search.
- **Examples:** one real brand, anonymized ("Sprout", a US greens-gummy brand, name and details changed), built from its public site, ads and reviews in `knowledge/example-businesses/sprout/`. Results files there are practice numbers and say so.
- **Names:** every block has a plain, verb-first name ("Write ads from one real product fact"); folders and skill files use the same name, so the handoff and the site match.
- **Not shown to people:** the internal roles. The general/ecommerce split shows only as the Business filter. The store add-on appears inside a page as "Extra steps for online stores".
- **Look:** monochrome, dark by default with a remembered light mode, with an old-computer character: Space Grotesk for headings and text, JetBrains Mono for the subhead, file names, counts and step numbers; code windows with pinstriped title bars and line numbers; hard offset shadows on hover. The globe draws the real world map in 0s and 1s and is the only thing that moves on its own; hovering colours it, digits near the cursor scramble, and it can be dragged to spin. It holds still for reduced motion (hover and drag still work).
- **No brand names** on the site.

## 6 · The handoff pack (deterministic export)

Built in the browser by plain code from the saved workflow. Same workflow in, same pack out.

- `HANDOFF.md`: what the workflow makes; what to prepare (the inputs nothing inside the chain provides); then each step in order with the block's name and slug, what it does, which earlier step's output it reads, what it must produce, and the check before moving on; then the run rules (stop on a failed check, write `MISSING:` instead of guessing, ask before anything that publishes or spends).
- `workflow.json`: the graph (nodes, edges, order, versions) for tools and agents.
- `skills/<slug>/SKILL.md` (and `boards/ecommerce.md` when the ecommerce add-on is on), so the agent uses the same skill names.
- `README.txt`: three lines on how to use it ("Upload this folder to Claude, then say: follow HANDOFF.md").

Order is a topological sort of the graph, ties broken by canvas position (top to bottom, left to right). A cycle is refused with a clear message.

## 7 · Technical approach

- **Site:** Vite + TypeScript, written in React and run on Preact (react is aliased to preact/compat, a fraction of the size), static build, no server. Deploys to any static host.
- **Speed (19 Oct):** the home page loads about 68 kB in 6 requests. Markdown is turned into HTML when the index is built, so no Markdown library ships. The zip library loads only on download, the builder only when someone scrolls near it, and the globe after the text. Fonts are served from the site (Latin only, preloaded), and the library list is preloaded alongside the code.
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
