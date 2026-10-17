# Creative Engine app and docs (source prefix CEA)

Source: `C:\Users\kevin\Documents\Codex\2026-09-22\https-drive-google-com-drive-u\outputs\creative-engine` (local clone of github.com/KevCode-Absurd/creative-engine). This covers the app and its docs. `skills\` and `prompts\` are covered by the CES report; skill and prompt names appear here only to show what each workflow chains.
CSV: `creative-engine-app.csv` (104 rows: 5 system, 4 agent, 32 workflow, 1 routine, 21 skill, 8 asset, 33 knowledge).

Method: read-only. I read the README, HANDOFF, ARCHITECTURE (pathways and later phases), HANDOFF-NEXT-STEPS, the pipeline map, the readiness doc, the validation and integration reports, the module docs (competitor playbook, creator discovery, copy builder, CRO, SEO, landing pages, learning) and the tail of DECISIONS. I also ran **read-only** row counts on `data/creative-engine.db`, grouped by brand, task and model. I did not run the app, open any media, or read `.env` or `cookies-cmo.json`.

## 1. What it is, in one paragraph

Creative Engine (the platform brand is "Mercatura", the creative module "Creative Studio") is a Next.js 16 + SQLite app. It takes a **brand brain** and **customer research**, and turns them into Meta ad scripts, static and carousel image ads, PDP gallery images, photoshoots, video plans with Seedance prompt packs, landing pages, SEO and GEO work, and Meta-policy compliance reads. It handles several brands. Every model call is logged with its prompt, tokens and cost, and runs under spend caps. Each step uses a different model: Gemini 3.1 Pro writes, GPT-6 Sol writes the image and shot prompts, Claude Sonnet and Haiku check, extract and cluster, Gemini Flash looks at images, GPT Image 2.5 Sunburst renders, Nano Banana Pro draws people, and Seedance makes clips. The rule is that the model that judges is never the model that wrote. Feedback, check failures and hand edits all feed back as **lessons** into every writer. Since 2026-10-08 Kevin's rule has been "no more features", only better output.

## 2. The pipeline in plain words

```
Brand set-up ──► Brand brain (8 docs + brand.json + look + creative kit + claims + photos)
                    │
Customer files ──► Research pipeline ──► ranked themes + guardrails ──► Personas / Offers
                    │                                                    │
Reference library ──┼──────────────► Concepts / Brief V2 ◄───────────────┘
Competitor ads  ────┤                    │
                    │         ┌──────────┼──────────────┬───────────────┐
                    ▼         ▼          ▼              ▼               ▼
            Image ad studio  Script engine        Sprint (50/100)     Chat
            (statics, PDP,   (scripts, hooks,     plans + runs the     (1 call -> actions
             photoshoots)     captions)           image studio         on the engines)
                    │         │
                    │         ├─► Static/carousel from script
                    │         ├─► Video production (shot plan -> sheet -> storyboard -> clips -> join -> motion)
                    │         │        └─► Seedance prompt pack (render by hand) ─► Video editor
                    │         └─► Human creator brief (PDF)
                    ▼
     QA: sense check, 2 image looks, claims read, voice check, fact check, compliance
                    │
     Feedback / check failures / hand edits ──► Lessons ──► every prompt
                    │
     Landing pages / CRO Studio (page from the ad, store audit, Shopify export)
     SEO / AEO / GEO (site audit, blog studio, AI-answer visibility, citation outreach)
```

1. **Set up the brand.** The brand-brain skill (outside the app) or in-app onboarding (site read, pasted documents, founder questionnaire) writes 8 markdown docs and `brand.json`. Automated scans then add the look (fonts and colours computed from the live site), the claim register (claims quoted exactly from the site and ads, plus figures that disagree), a creative kit (visual rules, packaging and handling, presenters) and a tagged photo inventory.
2. **Research.** Customer files (calls, tickets, reviews, surveys, community) are cleaned, then names and contact details are redacted. Insights are extracted into 10 types, and code checks that every quote exists in the source. They are clustered into themes, ranked by intensity, frequency and source diversity, and failure modes become guardrails. This costs about 2 cents per item.
3. **Strategy.** Personas get doubt/proof pairs. Offers are designed: code does the maths, one model call proposes designs, and industry research uses web search. A concept is persona × angle × offer. "Plan my next ads" (Brief V2) produces 3 concepts × 3 variants. Coverage finds gaps in the ad account and turns them into briefs, but the account it reads is simulated.
4. **Make.** There are two engines.
   - **Image ad studio:** plan from a winning layout or a concept world, then a words pass, voice pass, prompt, a read before rendering, the render with real product photos and type specimen, 2 image checks plus a claims check, and at most 1 mend. It also makes PDP sets (12 frames) and photoshoots. The **sprint** plans 50 to 100 distinct ads and runs them through this engine.
   - **Script engine:** a story brief, 15 script kinds and 24 formats. A fact checker cites held facts, a second reader checks the draft, and fixes are patch-only (at most 2 loops). It also writes hooks, captions and headlines. A script then feeds statics, carousels, video, or a brief for a human creator.
5. **Check and learn.** Image and claim checks run on every output, and compliance reads against Meta's standards. The creative judge (blind, 8 criteria) and copy:test compare before and after. Corrections typed or spoken become lessons, repeated check failures and hand edits are turned into rules, and the lessons are injected into 22 prompts.
6. **Destination.** Landing pages and CRO Studio build a page from the ad's promise, audit the store from real captures, and export HTML or a Shopify section pack. SEO/AEO/GEO audits the storefront, writes source-bound blogs, measures AI-answer mentions across OpenAI, Gemini and Claude, and plans citation outreach.

## 3. What works end-to-end vs half-built

Evidence comes from the DB counts and the docs. **Every live run is on Grüns.** Grüns is a real public brand that Kevin does not own, built in "study mode" with **simulated** customer research. Nourish Plus is generated seed data. `testco` ("Kiln & Clay") is an empty brand. No real client brand has been run through the app yet. The handoff says one is "due soon".

| Workflow | State | Evidence |
|---|---|---|
| Research pipeline (VOC to themes) | **Works end-to-end** | 131 items → 682 insights → 212 themes (Grüns); seed brand too |
| Image ad studio (statics) | **Works end-to-end, heaviest use** | 195 sets, 1,473 GPT images, ~19.5c/ad. 6 in 10 images were redone, mostly because there is no photo of the opened daily pack |
| Script engine + script builder | **Works end-to-end** | 169 scripts. Blind-judged faults fell from 12.9 to 6.0 per script (n=3) |
| 50/100-ad sprint | **Works** | 13 sprints, 10 done. The first 100-ad plan leaked old prices, made-up testimony and health-claim overreach. The instructions were fixed |
| Static/carousel from script | Works | job_017, job_008; 11 output jobs in review |
| Photoshoot | Works, lightly used | 6 runs |
| PDP 12-frame set | Partly | 6 runs; the measured set was planned but not rendered |
| Competitor playbook (clone competitor statics) | **Works, live pilot** | AG1 via Apify → 5 Grüns drafts. A human had to fix the copy, the inherited claims and the product handling |
| Reference-to-ad (exact / structure / principles) | Works | 1,153 analysed refs, 91 tracked uses |
| Compliance read | Works | 3 checks |
| Feedback → lessons loop | Works | 12 feedback notes, 46 hand edits, 3,139 logged check failures, 10 brand lessons |
| Chat agent | Works | 3 chats |
| Brand look / claim scan / creative kit / photo inventory | Works | each run on Grüns |
| Offers / personas | Works | 6 offer builds, 24 personas |
| CRO audit + CRO Studio + landing builder | Works on Grüns | 2 page drafts; the CRO run data exists. Ad-performance inputs are simulated |
| SEO audit / blog / AI visibility | Works on Grüns | 80 visibility calls |
| **Video production (script → finished video)** | **Half-built** | Only 8 clips have ever been rendered in the app. No finished video has passed Kevin's review ("too slow, visuals too alike"). The test is waiting on a Higgsfield plan purchase. Join, motion finishing and caption tiles have never been used on a real clip. The only finished video was made by hand (`ugc-demo/`) |
| Seedance prompt packs, Creator Studio | Built, checked as text only | |
| Video editor | Software works | Exported real MP4s, but only from synthetic footage |
| Brand brain builder in-app (brand.json from docs) | **Never run** | Both brands arrived with a brand.json made outside the app |
| Copy builder, creator discovery, citation outreach | Built, no live run | No calls in the ledger; tested on mocks and fixtures only |
| Coverage, brain auto-learner | Built on a **simulated** ad account | No ad account is connected |
| Creative portfolio, creative quality, production lab, production queue, production evidence | Built 10 to 13 Oct, not proven | Shown in the guide's screenshots only |
| Skill-change proposals from feedback | Built, unused | 0 proposals |

Spend to date: about $205 on text models, about $114 on images, about $8 on video.

## 4. The brand brain format

The folder is `brands/<slug>/brand-brain/`. The app reads this canonical layout through `src/lib/brand-brain.ts` (Zod) and `src/lib/brain/docs.ts`.

**8 markdown docs (`BRAIN_DOCS`):**
- `brain.md`: diagnosis, what works, what to avoid, key decisions, open questions, ideas. It grows over time.
- `brand-guidelines.md`: story, voice and tone, look, USPs, guardrails, taglines.
- `products-and-positioning.md`: one entry per product (price, link, variants, stock, buyer, benefit, angle, plus the camera and writer fields below).
- `customer-avatars.md`: personas grounded in reviews, a ranked insight bank and a verbatim language bank.
- `competitors.md` plus `competitors/<name>.md`: a 16-field profile each, the landscape table and the gaps to own.
- `winning-ads.md`: active Meta Ad Library angles and the pattern across them.
- `recent-changes.md`: launches, promos and stock. Read first every session.
- `README.md`: the index.

**`brand.json`:**
- `brand`: name, market, currency, category, locale_accent, one_liner.
- `products[]`: id, name, format, ingredients.
- `offers[]`: id, name, price, per_day, notes.
- `guarantee`: id, text, window_days.
- `personas[]`: id, name, summary, problem, trigger, wants, language.
- `claims[]`: id, text, status, source.
- `forbidden_claims[]`, `proof_assets[]`.
- `voice`: do, dont, sound, examples.
- `market_sophistication_stage` (1–5).

**Companion files:**
- `personas.json`: about 28 fields, including who, identity, objections, doubts (doubt/proof/by), tried, believes, angle, awareness, product_ids, offer_id, sounds_like, performance, look and status.
- `angles.json`: id, name, line, persona_ids, basis.
- `offers.json`: offer designs with mechanic, audience, terms, discount, subscription, risk_reversal, urgency, tiers, addon, why, test and status.
- `offer-set.json`: how each live offer is said, and for whom.
- `creative-kit.json`:
  - `visual`: colours, typography, imagery_style, do, avoid, logo_notes.
  - `products[]`: asset_folder, hero_image, packaging, handling, handling_notes.
  - `presenters[]` per persona: gender, age, look, wardrobe, setting.
  - `voice_direction` and `style_line`.
- `brand-look.json`: fonts, palette, button, aesthetic, vertical, specimen, logo. The `look/` folder holds `logo.png`, `type-specimen.png` and `fonts/`.
- `brand-tokens.md`: CSS variables.
- `claim-sources.json`: the pages read, plus claims with exact quote, kind, `same_as`, `forbidden` and status, and figures still to settle.
- `economics.json`: costs, shipping, fees, ROAS, retention, mix, AOV, discount history, monthly figures. It carries a `simulated` flag.
- `lessons.json`: scope, rule, why, kind, times, status, feedback_ids.
- `learning.json`.
- `avatars.json`: saved fictional presenters with portrait, sheet and voice.
- `assets/<product>/` with `assets-cache.json`: photo tags.
- `site/*.md`: pages as read.
- `people/`: consented real uploads, not committed.

**Product fields read for camera and copy** (`brain/on-camera.ts`):
- 7 camera fields: Looks like, Pack, How it is used, Visible result, Moves and sounds, Never show, Reference photos by job.
- 7 writer fields: Kind, How it works, Replaces, Made of, Size and fit, In the box, Lasts and care.

`brain/readiness.ts` lists the brain fields each format needs, so a person can see what is missing before paying.

**Recommendation:** make this the catalogue's shared `brand_brain` type. It is already used by Creative, Landing and SEO, and it is portable: plain markdown and JSON.

## 5. How references and competitor ads are collected

1. **The shared reference library (`ad_references`, 1,153).**
   - 1,076 ads were synced read-only from Kevin's "Remix" library (`pnpm refs:import`).
   - 77 were uploaded through "Add reference" (`refs:add`).
   - Gemini Flash analyses each one: why it works, awareness, sophistication, categories. Video ads get a cut-by-cut breakdown the first time a structure mode is used.
2. **The course swipe libraries (`library_refs`, 9,122).** These are imported from the AI CMO skill folders:
   - Static Ad Factory: 3,883 statics in 15 layout archetypes.
   - PDP Image Factory: 318.
   - Photoshoot Factory: 4,921, across 25 verticals.

   Each row is tagged by layout type and vertical (Supplements 1,313, Beauty 919, Kitchen 688…). A chooser (`references/choose.ts`) and a for-brand score (0–100) pick a few diverse examples for each writer or planner. Use per brand is tracked.
3. **The competitor playbook (temporary).** Enter a name, site or Ad Library link. Static images are pulled through Apify's `facebook-ads-scraper` by default, or the Foreplay API, the Meta Ad Library API, or MCP-provided records. The scan is capped at 200 ads and $2. Videos are rejected. Sessions expire after 2 hours, then the provider data is cleaned up. The user picks up to 12 ads and a direction for each, then generates in Create.
4. **The brand brain's own research.** `competitors/` is filled by reading competitor websites (`competitor_profile` prompt). `winning-ads.md` is written by hand, or by the brand-brain skill, from the Meta Ad Library. The claim scan also reads the brand's own ads.
5. **Not built.** There is no Foreplay export importer yet. The plan asks for 5 real records first. Meta MCP is used in chat only; the app server has no working Meta token (the API call returned 400 and 401).

## 6. What could become catalogue items

**Systems (whole products):**
- `dtc-creative-engine`, the full app.
- `dtc-landing-and-cro-studio`.
- `dtc-search-growth-studio` (SEO/AEO/GEO).
- `ai-run-control-and-cost-ledger`, plumbing any catalogue agent could reuse: routing, caps, PII guard, call log, job queue.

**Agents (workflows run with judgement):**
- `static-ad-sprint-planner` (50/100 ads, with plan checks and approvals).
- `creative-chat-agent` (one call drives every engine).
- `creator-discovery-agent` (needs a live run).
- `campaign-batch-orchestrator` (unproven).

**Production-grade workflows to package first.** These have the strongest evidence:
1. `voc-mining-pipeline`, which turns customer files into verified-quote themes and guardrails.
2. `static-ad-generator`, which includes the QA checker and mend.
3. `video-ad-script-writer`, with fact check, patch loops and hooks.
4. `competitor-ad-cloner`.
5. `reference-to-ad-remixer`.
6. `brand-visual-identity-scan`, `website-claims-extractor` and `product-photo-tagger`, which together are "brand intake".
7. `creative-feedback-learner`, the lessons loop.
8. `meta-ad-compliance-checker`.
9. `cro-page-auditor` and `ad-to-landing-page-builder`.
10. `seo-aeo-geo-site-auditor` and `ai-search-visibility-tracker`.

**Standard-tier skills:**
- `offer-designer`, `persona-builder`, `ad-concept-generator`, `creative-brief-planner`.
- `hook-generator`, `script-transposer`, `native-ad-writer`.
- `ugc-creator-brief`, `creative-volume-and-budget-planner`.

**Knowledge worth publishing:**
- The best-output handbook (`docs/guide/20-best-output-workflow.md`).
- Kevin's creative house rules (HANDOFF-NEXT-STEPS §3).
- The creative judge rubric.
- The HANDOFF research model (10 insight types, intensity rubric).
- The ARCHITECTURE context-per-step matrix.
- The skill-pass list of which brain fields each skill reads.

## 7. Gaps

- **No real client brand.** Every output so far is for a study brand with simulated research and simulated economics. No ad has been run or measured.
- **Video is the weakest link.** The in-app clip, join and motion stages are unproven. Rendering by hand from prompt packs is the actual workflow.
- **There is no performance loop.** No ad account is connected, so Coverage, the brain auto-learner and the CRO ad results all use simulated data. Ad scorecards, sale planning and winning-ad refresh are explicitly on hold.
- **Retention, CX, ops and finance are out of scope** (RT, CX, OP, FN). There are no email or SMS flows, even though the playbooks cover them.
- **There is no Foreplay importer, no Meta server integration, and no store publishing.** CRO and SEO export packages; a person applies them.
- **The product photos are the bottleneck.** The biggest single cause of image redos is a missing photo of the opened pack. The brand-intake step should ask for "pack front, daily unit, out of pack, in hand, in use".
- **Distribution.** The DB, media and the 2.1 GB avatar library are git-ignored. A fresh checkout shows no avatars or references. The 1,346 downloaded photos of real people sit in a Codex worktree and are unresolved. There is no CI.
- **There is a lot of recent, unproven surface.** Portfolio, quality, lab, ops and evidence screens were added 10 to 13 Oct, after the "no more features" rule, and have no measured output.

## 8. Duplicates and overlaps

- The `meta-ads:*` plugin skills overlap partly:
  - `meta-dna` overlaps the look scan.
  - `meta-create` overlaps Brief V2.
  - `meta-generate` overlaps the image studio.
  - `meta-photoshoot` overlaps photoshoot.
  - `meta-copy-writer` overlaps the copy builder.
  - `meta-competitor` overlaps the competitor playbook, but only as research.
  - `meta-landing` overlaps the CRO audit.
  - `meta-math` overlaps the volume planner.

  The app versions are deeper: brand-brain grounded, with QA and a cost ledger.
- The brand-brain skill (CES) produces the brain docs that the app reads, so they are one item split across two sources.
- The course libraries (Static Ad Factory, PDP Image Factory, Photoshoot Factory, the AI Operator and AI CMO folders) are inventoried by CES and SKA. This app only imports and indexes them.

## 9. Rights and notes

- **Kevin's own work:** the app code, prompts and most docs.
- **Course material** (reference only, not for resale):
  - The Blue Sense Digital playbooks.
  - The Nu Reach Media E-Commerce Playbook (`docs/ecommerce-playbook`).
  - The Nuova Era and AI Video School course notes.
  - The bootcamp audit.
  - The Ecom Intelligence-derived Learning guides (403) and the SEO knowledge base.
  - The CRO card libraries.
- **Other brands' ads:** the reference and swipe libraries, the competitor sessions, and all Grüns site copy and images. Grüns is a third-party brand: do not ship its brain or images as catalogue content. Use it only as a format example.
- **Open source:** Creator OS Starter (MIT) is archived in `skills/_library`.
- **Instructions aimed at an AI** were found and ignored: `brands/gruns/brand-brain/.claude/CLAUDE.md`, plus the repo's `CLAUDE.md` and `AGENTS.md`.
- **Secrets:** `.env` and `cookies-cmo.json` exist and were not opened. No secret values appear in either report.
