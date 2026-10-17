# Creative Engine: skills and prompts inventory (source prefix CES)

**Source:** local clone of `github.com/KevCode-Absurd/creative-engine` (branch main) at `C:\Users\kevin\Documents\Codex\2026-09-22\https-drive-google-com-drive-u\outputs\creative-engine`.
**Rows:** `creative-engine-skills.csv`, 260 rows, ids CES-001 to CES-260.
**Date:** 2026-10-17. The pass was read-only. Nothing in the repo was changed, and no media files were opened (they were counted only).

## 1. What was covered

| Block | Rows | Notes |
|---|---:|---|
| `skills/` skill folders | 123 | Every folder except `_library`. Each SKILL.md, CARD.md and its references, examples and templates was read. The three Factories were read through their entry docs and schemas, then sampled and counted (they hold 1,955, 10,009 and 7,803 files). |
| Sub-skills inside folders | 29 | 20 native image types in `native-ad-types/`, plus `operator-creative/` and its 9 stage cards |
| Loose files in `skills/` | 16 | 14 .docx files, `ai-copy-blacklist.md` and `README.md` |
| `skills/_library/` | 10 | The archive folder plus 9 sets: ai-cmo, ai-operator, copy-machine, creator-os-starter, design, hopkins-transcript, rea, starpop, _digests. None of it is active. |
| `.claude/skills/` | 9 | The Copy Machine package, installed for the dev agent. The app reads none of it. |
| `prompts/` | 73 | Every app step prompt. Each one's caller in `src/` was found by grep. |

These docs set the status and rights columns: `docs/creative-skills-readiness-2026-10-09.md`, `docs/skill-pass/*` (the 2026-10-05 dry runs), `docs/skill-value-chain/*` (the blind-judged Grüns before/after run), `docs/SKILLS-INTAKE.md` ("Used" means the skill went out in a real call), `skills/_library/INDEX.md`, `docs/PLAYBOOK-PLAN.md`, `docs/COURSES-PLAN.md`, `docs/courses/*`, `docs/bootcamp-audit/*` and `docs/ai-operator-audit/*`.

## 2. Counts

**By level:** skill 104 · prompt 97 · knowledge 32 · workflow 15 · asset 10 · routine 1 · agent 1 (the in-app chat router, `chat-turn.md`).
The prompt count includes the 20 native image-type cards and a few small card skills.

**By area:**

| Area | Rows | Area | Rows |
|---|---:|---|---:|
| CW copywriting | 69 | SY setup / tooling | 13 |
| CPS static and image production | 49 | RS research / VOC / personas | 12 |
| CPV video and UGC production | 48 | BF brand foundation | 10 |
| CS creative strategy | 23 | OF offer and pricing | 5 |
| WS site, PDP, LP, CRO | 17 | ST strategy and audits | 4 |
| RT retention / email | 4 (all .docx notes) | OG organic | 3 |
| PA paid media | 2 | AN analysis | 1 |
| CR, CX, OP, FN | 0 | | |

**By status:**

| Status | Rows | Meaning |
|---|---:|---|
| tested-with-examples | 58 | Ran in a documented real or paid run |
| built-untested | 168 | Built; dry runs on paper only |
| course-notes-only | 28 | Archive or .docx notes |
| unknown | 5 | |
| draft | 1 | motion-reel |

**By rights:** own 141 · course 107 · purchased 11 · third-party-ads 1.

**By role** (tagged at the start of `notes`):

| Role | Rows |
|---|---:|
| User-facing | 97 |
| Support (principles that other skills load) | 50 |
| Library / data | 36 |
| QA / check | 30 |
| Internal plumbing | 22 |
| Archive | 19 |
| Superseded / retired | 6 |

## 3. Skill families and how they chain

The repo is one system. The skills feed app step prompts, and the code decides what each step is sent: a `CARD.md` in place of a full SKILL.md, named copy-craft parts, one stage brief, one format part. The `brand brain` sits at the root of almost every `depends_on`.

1. **Brand foundation → brand brain.**
   - `brand-brain` (course) or `founder-interview` + `Context Questions` docx → markdown brain.
   - `brand-convert.md` turns that into brand.json (products, offers, personas, claims with status, voice).
   - `voice-card.md` writes the style card. `creative-kit.md` writes the production kit (packshot per product, handling, presenters). `competitor-profile.md` profiles competitors. `operator-creative/brand` keeps evidence records.
   - Output: `brand_brain` plus `product_data`, which every later step reads.
2. **Research → themes → personas and guardrails.**
   - `pii-names` → `clean` → `extract` (typed VOC insights with exact quotes) → `cluster` / `assign` (themes).
   - `guardrails` turns refund and complaint themes into script rules. `review-mining` builds the angle library.
   - `persona-build`, `builder-start` and `persona-doubts` produce personas, angles and objection/proof pairs.
3. **Offer.**
   - `offer-building` (method, the 7 failures, industries.json) drives `offer-build`, `offer-research`, `offer-set` and `offer-words`.
   - `offer-ad-bank` makes the sale's static ad set.
4. **Strategy and planning.**
   - `concept-suggest` and `operator-creative/concept` build concepts as persona × angle × offer.
   - Also in this family: `brief-v2`, `strategic-audit` (Coverage), `generate-50` with `sprint-plan` (the 50-ad sprint), `format-library`, `reference-reading` and `script-surfaces` (which format a script should be made in).
5. **Video scripts** (the deepest family).
   - Writer: `copy-floor` + `ad-principles` + `buyer-stage` (one awareness file and one sophistication file) + one `script-types` recipe + one `script-format-*` core → `script-flow.md`.
   - The older path is `script.md` with `script-from-research` and `ad-script-principles`.
   - Checks: `script-readaloud` (12 checks) → `script-fact-check` → `script-patch` → `voice-check` (`script-voice-pass` then `brand-voice-check`) and `copy-pass` (`copy-principles`). `audit-judge` and `line-repair` cover claims.
   - Hooks: `script-hooks` (with the `-same` / `-different` fragments and `hook-bank`) → `script-hook-handoff` → `script-hook-texts`.
   - Feed copy: `script-primary-text` → `script-caption-check`.
   - Variants of a winner: `script-transpose` / `transpose.md`, `ad-reference-exact`, `script-reference-structure` / `-principles`, and `reference-hooks` + `reference-hooks-check` (new hooks cut onto a working ad).
6. **Static ads (the studio)**, which is the best-tested chain.
   - Inputs: a library reference from `Static Ad Factory`, or a concept from `tof-statics`, `review-ads`, `indirect-ads`, the native family (`native-ads`, `native-ad-copy`, `native-ad-creative`, 20 `native-ad-types`) or `scroll-stopper-static-ads`.
   - `studio-plan` (with the `operator-creative/static-plan` card) → `studio-words` (`copy-craft` parts) → `words-read` / `words-fix`.
   - Then `studio-feed` / `-focused` (long primary text) → `sense-check` → `studio-prompt` (`image-prompt-craft` or the `operator-creative/image-prompt` card) → render.
   - Afterwards: `ad-review` / `operator-creative/review`. `studio-variants` gives word tests over one picture. `image-plan.md` cuts statics and carousels from an approved script (`image-ad-copy`).
7. **PDP and photoshoot.**
   - `PDP Image Factory` with `product-image-templates` (12 frames) for the gallery.
   - `Photoshoot Factory`, `flash-photography`, `instant-photoshoot` and `asset-generator-cmo` for product photos.
   - `wide-face-portrait` and `image-upscaling` for finishing.
8. **Video production.**
   - The approved script goes to a format production skill: `realistic-ai-ugc`, `ai-ugc-hooks`, `ai-satisfying-hooks`, `podcast-ad`, `talking-object-ad`, `claymation-ads`, `comic-book-ad` or `zack-d-films-ads`.
   - Or to one of the 10 Starpop director looks, plus `cinematic-ad-directing` and `anime-comic-animation`.
   - Every video job is also sent `video-director` and the `production-principles` CARD.
   - Then `shot-plan.md` → clips → `motion-plan` (`ecommerce-motion-finishing`), or the editors `ecommerce-video-editing` and `organic-video-editing`.
   - `motion-reel` (a code-rendered reel) is not wired.
9. **Landing pages and CRO.**
   - `landing-pages` (CARD, kinds/listicle and advertorial, checklist.json) → `lp-write.md`.
   - Page-type sources: `five-reasons-lp-pro`, `advertorial-v1`, `clone-from-screenshot`.
   - Rules and audits: `cro-brain`, `cro-audit`, `ecommerce-funnel-inspection`.
   - Design and build: `ecommerce-page-design`, `shopify-liquid-themes`.
10. **Learning loop** (internal). `feedback-learn` → `creative-lessons` register, then `edit-rule`, `lesson-compact`, and `skill-propose` / `skill-tighten`, which propose admin-approved skill edits.
11. **QA before launch.** `creative-qa` (an advisory card), `ad-compliance` (a Meta policy digest), and the `.claude` `launch-readiness-preflight` (purchased, not used by the app).

## 4. Strongest and tested

These 58 rows carry documented run evidence; the basis for each is in its `notes`. The main evidence is the Grüns 25-pair blind-judged before/after static eval and its avatar-to-storyboard journey (`docs/skill-value-chain/final-run.md`), the real calls in SKILLS-INTAKE, and the real-brand e2e records.

- **Static studio chain:**
  - Prompts: `studio-plan`, `studio-words`, `studio-prompt`, `studio-feed` and `-focused`, `sense-check`, `ad-review`, `words-read`, `words-fix`.
  - Skills: `image-prompt-craft`, `copy-craft`, `copy-floor`, the `operator-creative` cards (static-plan, static-copy, image-prompt, concept, review, avatar-storyboard, static-template-process) and `Static Ad Factory`.
  - The judging results were mixed for statics and clearly better for the storyboard.
- **Script chain:** `script-flow`, `ad-principles`, `buyer-stage`, `script-readaloud`, `script-fact-check`, `script-patch`, `script-hooks`, `script-hook-handoff`, `script-primary-text`, `script-caption-check`.
- **Video:** `shot-plan`, `video-director`, `production-principles`. SKILLS-INTAKE "Used": `ai-ugc-hooks`, `realistic-ai-ugc`, `ugc-script`, `claymation-ads`.
- **Libraries in real calls:** `Photoshoot Factory` (1 real run, 10 frames, 48 lessons), `PDP Image Factory`, `generate-50` / `sprint-plan`, `cro-brain`, `landing-pages` + `lp-write`, `wide-face-portrait`.
- **Look formats:** the image parts of 8 look formats were exercised in the Grüns static set: clay-world, comic, wool, paper, watercolour, anime, cinematic-3d, collage. Their video parts are untested.

**Built but untested** (marked with care):
- The 12 Nu Reach playbook bricks (`review-mining`, `review-ads`, `indirect-ads`, `offer-ad-bank`, `hook-bank`, `format-library`, `creative-qa`, `organic-content` and others) were tested only in mock mode.
- The 10 Starpop director skills have no renders.
- Most AI CMO video formats (podcast, talking object, comic, explainer, satisfying) are "Wired", with paid checks still open.

**Best candidates for a catalogue:**

| Kind | Items |
|---|---|
| Principles | `ad-script-principles` (13 sections, split by bought-once and bought-again), `ad-principles`, `buyer-stage`, `script-types` (19 architectures) |
| Pipelines | The studio static pipeline as a workflow; the script → hooks → primary-text chain |
| Research | `extract` → `cluster` → `persona-build` |
| Offers | `offer-building` + `offer-build` |
| Pages | `landing-pages` + `lp-write` |
| Video standards | `production-principles` + `video-director` |

## 5. Internal plumbing (do not publish as-is)

These 22 rows are app glue: JSON contracts, `{placeholder}` templates, rule fragments and loops.
- Research and brand: `assign`, `clean`, `pii-names`, `brand-convert`, `creative-kit`.
- Learning loop: `edit-rule`, `feedback-learn`, `lesson-compact`, `skill-propose`, `skill-tighten`.
- Other glue: `format-example-plan`, `chat-turn` (the app's router).
- Rule fragments: `script-hooks-same` / `-different`, `script-rules-brief` / `-flow` / `-free` / `-strict`, `studio-rules-free` / `-strict`.
- Also `operator-systems` (context-packet contracts) and `skills/README.md`.

A second group works but carries app-specific schemas, so it would need re-wrapping before it could stand alone: `shot-plan`, `studio-plan`, `studio-prompt`, `image-plan` and `script.md`.

Archive rows are never sent by the app: `_library/*` and the `.claude` Copy Machine skills.

## 6. Duplicates and overlaps

- **Script writers, three generations.**
  - `video-ad-copywriter` (original) → `video-ad-scripts` (all-in-one, superseded 2026-10-05) → the family `script-from-research`, `script.md` and `script-flow.md`.
  - `ad-principles` overlaps `ad-script-principles`. `ad-principles/formats/*` are short duplicates of `script-format-{ugc,founder,claymation,vsl,static}`, and the default writer is sent those short notes.
- **Static copy, overlapping generations.**
  - `image-ad-copywriter` (superseded) → `image-ad-copy` → `studio-plan`/`studio-words` + `operator-creative/static-copy`.
  - `ad-copy-flow.md` is a one-call alternative used only by an audit script.
- **Voice and copy checks.** `script-voice-pass`, `brand-voice-check`, `copy-principles`, `copy-craft` (tells/editor), `words-read`, `audit-judge`, `script-readaloud` and the `.claude` `copy-chief` all police the same "machine copy" shapes. `ai-copy-blacklist.md` is now a 5-line pointer.
- **Repair prompts.** Twins: `line-repair` and `plan-repair`; `script-patch` and `words-fix`.
- **Primary text.** Twins: `studio-feed` and `studio-feed-focused`.
- **Clay.** `claymation-ads` + `script-format-claymation` (1 character, real pack) versus `claymation-animation` + `script-format-clay-world` (a whole clay world, sculpted pack). The names suggest the wrong pairs.
- **Comics.** `comic-book-ad` (a printed page on a desk) versus `anime-comic-animation` (a drawn hero).
- **Explainers.** `zack-d-films-ads` and `script-format-explainer` overlap `editorial-collage-animation`, `motion-graphics-animation` and `cinematic-3d-animation`.
- **Motion.** `motion-reel` (code-built) overlaps `motion-graphics-animation`, `ecommerce-motion-finishing` and `operator-creative/video-editing`.
- **Photo factories.** `Photoshoot Factory`, `instant-photoshoot`, `flash-photography` and `asset-generator-cmo` overlap. So do `PDP Image Factory` and `product-image-templates`.
- **Concept and static families.** `tof-statics` is the successor of `scroll-stopper-static-ads`; `Static Ad Factory`, `operator-creative/static-plan` and `format-library` sit in the same space. `indirect-ads` overlaps the native family.
- **Brief and audit.** `brief-v2` and `strategic-audit` share near-identical `awareness-levels.md` and `hook-library.md` references.
- **Landing pages.**
  - `five-reasons-lp` (superseded) duplicates `five-reasons-lp-pro`; its template is the same as pro's design A.
  - `advertorial-v1` overlaps `landing-pages/kinds/advertorial.md`.
  - `cro-brain` overlaps the `Must-Haves`, `PDP` and `Shopify CRO` docx.
- **Brand intake.** `brand-brain`, `founder-interview`, `operator-creative/brand`, the `Context Questions` docx and the `.claude` `feed-the-machine` / `brand-positioning`.
- **Hooks.** `hook-bank`, `15 Avatar Hooks.docx`, `Perfect Meta Ad Structure.docx`, `ai-ugc-hooks` and `copy-craft/parts/hooks`.
- **Email.** The 4 retention docx overlap each other (flow guide, post-purchase flow, 50 frameworks, Klaviyo audit).
- **Archive copies.** `.claude/skills/*` are byte-identical to `_library/copy-machine/*` apart from their agent wrappers. `_library/ai-cmo` holds the originals of about 34 active skills.

## 7. Naming problems (a `proposed_name` is given in each row)

| Kind of problem | Names (and proposed replacements) |
|---|---|
| Internal or cryptic | `copy-floor` → plain-copy-priority-order; `taste` → creative-direction-lever-snippets; `brief-v2`; `generate-50`; `operator-creative` / `-performance` / `-systems`; `script-surfaces`; `transpose`; `clean`; `assign`; `extract`; `cluster`; `words-read` / `words-fix`; `line-repair`; `sense-check`; `edit-rule`; `chat-turn`; `creative-kit`; `tof-statics`; `PDP Image Factory`; `copy-pass`; `audit-judge` |
| A real creator's name | `zack-d-films-ads` → cgi-mechanism-explainer-ad (renaming it touches formats.ts, taxonomy.ts, catalogue.ts and format-gallery.ts) |
| Tool or vendor names | `foreplay-*`, `gpt-image-ads`, `asset-generator-cmo` |
| Pairs that look the same | `claymation-ads` / `claymation-animation`; `script-format-claymation` / `-clay-world`; `image-ad-copy` / `image-ad-copywriter`; `video-ad-scripts` / `video-ad-copywriter`; `review` / `review-ads` / `review-mining`; `native-ads` / `native-ad-copy` / `native-ad-creative` / `native-ad-types` |
| Format names unclear to a shop owner | The `script-format-*` names (wool, paper, skeleton, song): renamed to `<format>-ad-format-rules` |

Counts in the README are stale:
- native-ad-types has 20 types (README: 12).
- copy-craft has 17 parts (README: 15).
- native-ad-copy has 10 forms (README: 9).
- script-types has 19 types (README: 15).
- Anime has 8 looks (README: 5).

## 8. Rights: course-derived and purchased material

There are 107 `course` rows and 11 `purchased` rows. The `notes` column names each source.

- **Nu Reach Media "E-Commerce Playbook" (about 38 rows).**
  - The 14 .docx files repeat its pages.
  - Built from it: hook-bank, review-mining, review-ads, indirect-ads, offer-ad-bank, format-library, creative-qa, organic-content, 8 native image types, and parts of offer-building.
- **skool AI CMO (about 36 rows).** The AI CMO skills were copied in via Remix. This covers all the video formats (UGC, hooks, podcast, talking object, claymation, comic, satisfying, Zack D), the three Factories, Winning Ad Examples, tof-statics, scroll-stopper, generate-50, the photoshoot skills, brand-brain, brand-guide, brief-v2, strategic-audit, foreplay ×2, five-reasons ×2, advertorial-v1, clone-from-screenshot, cro-audit, cro-brain, shopify-liquid-themes and gpt-image-ads.
- **Starpop looks by @davidaistar (21 rows).** 10 director skills plus their paired `script-format-*` looks.
- **skool AI Operator (14 rows).** The operator-creative / -performance / -systems cards and buyer-stage.
- **Video courses.**
  - Nuova Era AI Academy: 22 of the 23 production-principles references, cinematic-ad-directing and wide-face-portrait.
  - skool AI Video Bootcamp: image-upscaling, plus additions to realistic-ai-ugc, cinematic-ad-directing and image-prompt-craft.
  - AI Video School: cited only as background by video-director.
- **The Copy Machine (purchased).**
  - The 9 `.claude` skills and `_library/copy-machine` are verbatim; copy-craft is a distillation of them.
  - The licence forbids redistribution of the source files.
- **Third-party ads and images.**
  - `Winning Ad Examples` holds 1,084 Foreplay ads.
  - The Static Ad Factory library (3,886 torn-down ads) comes from Foreplay. The Photoshoot Factory looks are Pinterest pins.
  - `zack-d-films-ads/reference` holds another brand's mp4 and a voice-clone sample of a real voice artist.
- **Open source, listed as own with a note.** Creator OS Starter (MIT: the video editors and carousel QA), Anthropic frontend-design and Impeccable (Apache-2.0: ecommerce-page-design), and REA (MIT: ecommerce-funnel-inspection). Keep the licences with these.
- **Mostly own** (Kevin's synthesis and app work): ad-script-principles, ad-principles, script-from-research and its family, script-types, the script-format cores that are not looks, the copy-floor / taste / creative-lessons support skills, image-prompt-craft, video-director, landing-pages (with ThrillX structures credited), and all 73 prompts.

## 9. Ecommerce gaps (nothing in this library covers them)

- **Retention and lifecycle.** There is no email or SMS skill or prompt. The only material is 4 course .docx notes: flows, post-purchase, email frameworks, Klaviyo audit.
- **Paid media buying and analysis.** Missing: campaign structure, budgets and scaling, account audit, creative-fatigue tripwires. The AI Operator Facebook and Google Ads packs sit unadapted in `_library`. Of the operator-performance methods, only the paired evaluation has been run. PB-12 (refresh a winner, tripwires) is on hold.
- **Sales calendar, BFCM and promotions.** PB-06 (sale plan) is on hold, and no seasonal or launch planner exists.
- **Creators and affiliates.** Only organic-content's seeding part exists. There is no creator brief library, rights or whitelisting, or payment model as a skill.
- **Customer care, operations and inventory, finance and attribution.** Nothing beyond offer margin maths.
- **Marketplaces and SEO.** Missing: Amazon listings, PDP copy as text (PDP coverage here is images), and SEO/GEO content.
- **Measurement.** The video formats' paid checks are open, the Starpop looks and video parts have no renders, and nothing reads ad performance data. Coverage runs on simulated data.

## 10. Quality flags from the readers

- **Contradictions.**
  - `video-director`'s multi-shot hard cuts conflict with older single-take rules in `ai-satisfying-hooks`, `podcast-ad` and `ai-ugc-hooks` (its SKILL and CARD disagree with each other).
  - The skill-pass docs still say production skills are cut to 12,000 characters; code now sends `CARD.md`.
- **Bloat.** `realistic-ai-ugc` (28.5k chars), `podcast-ad`, `indirect-ads` and `native-ad-creative` have skin/makeup paragraphs bolted on from production-principles. `production-principles/SKILL.md` section 6 is repetitive.
- **App limits that cap a format.** Long-copy static is capped at 60 seconds of script, an AI VSL cannot run past 90 seconds, a podcast plan holds only 1 presenter, and song ads need an outside music tool.
- **Missing source.** `offer-building` cites a transcript under `data/audit`, which is not in the checkout.
- **Risky behaviour.** `cro-audit/capture.js` clicks through age and region gates. Course files contain "PASTE THIS" install texts and Foreplay credit-spending ingest steps, aimed at an AI agent. The readers treated these as data and did not act on them.
