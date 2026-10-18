# Skill pass report: family 6-statics-and-photo

26 blocks written (9 ecommerce, 17 general; 9 of the general ones have a `boards/ecommerce.md` add-on, listed below). All 17 source folders processed. Every block passes a script check: SKILL.md has all required sections, name matches slug, summary <= 140 chars, every `uses` slug exists, no em dashes, no "Gehna". Creative Engine was only read.

General blocks with `boards/ecommerce.md`: static-ad-layout-adaptation-workflow, overhead-close-portrait-image-prompt, problem-first-static-ad-concept, cold-audience-concept-static-ads, buyer-quote-static-ads, fifty-static-ad-test-sprint, creative-brief-three-concepts-nine-variants, static-ad-image-prompt-compiler, static-ad-and-storyboard-review.

| old folder | new slug(s) | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| product-image-templates | pdp-gallery-12-frame-plan | ecommerce | rebuilt | 60 | The 12 frames renamed and re-worded; reference lists, BUCKETS/REFERENCES json and code paths dropped. Frame table + category bends + card format kept. |
| PDP Image Factory | pdp-gallery-image-set-workflow (workflow) + pdp-gallery-image-check (check, from references/07-qa) | ecommerce | rebuilt | 75 | Read SKILL, CARD, references 01-08, 10; the 32-type library was only skimmed by heading. Workflow also absorbs audit, objection mining, assets, build, deck. Check block is an extra I split out. |
| Photoshoot Factory | product-photoshoot-set-workflow (workflow) + product-truth-sheet-from-photos (source, from references/01-product-assets) | ecommerce | rebuilt | 75 | Read SKILL, CARD, references 01, 03, 04 (head), 06 (head), 07. LIBRARY.json/BREAKDOWN.json (14 MB) only peeked at for field names (vertical, shot_archetype, lighting, composition, rebuild_prompt, works_for). Truth sheet is shared by 5 other blocks. |
| Static Ad Factory | static-ad-layout-adaptation-workflow (+ boards/ecommerce.md) | general | rebuilt | 65 | Read SKILL, CARD, references 03 and 06, README, folder names/counts of the 15 families. TEARDOWNS/STATIC-AD-TEARDOWNS (12-14 MB) only read the first entry for schema. Install/ingest/update/packaging tooling dropped. |
| instant-photoshoot | one-colour-world-product-photo-set | ecommerce | rebuilt | 40 | Colour strategies and 15 frame kinds renamed; montage and music rule kept. scene-taxonomy.md not read (CARD lists the 15 kinds). |
| flash-photography | candid-flash-lifestyle-photo-set | ecommerce | rebuilt | 40 | Look, action mechanics, frame set, prompt skeleton, checks kept; examples replaced. |
| wide-face-portrait | overhead-close-portrait-image-prompt (+ boards/ecommerce.md) | general | rebuilt | 30 | Source credits a named course package; renamed, nothing from it quoted. Camera reference PNG not copied. |
| asset-generator-cmo | base-product-photos-from-reference | ecommerce | rebuilt | 35 | 6-part reference read, 11 camera treatments, 5 placements, ranking weights kept. |
| scroll-stopper-static-ads | problem-first-static-ad-concept (+ boards/ecommerce.md) | general | rebuilt | 45 | Levers, 14 metaphors and 8 headline formulas renamed with new examples. 23-ad teardown JSON not read. Overlaps with tof-statics (see note below). |
| review-ads | buyer-quote-static-ads (+ boards/ecommerce.md) | general | rebuilt | 25 | The 7 formats renamed; app checks and code paths cut. Depends on the existing `customer-language-to-angle-library`. |
| offer-ad-bank | sale-offer-static-ad-set | ecommerce | rebuilt | 15 | Put in ecommerce as the brief directed ("offer ad banks"); see Doubts. Playbook links and app screens cut. |
| tof-statics | cold-audience-concept-static-ads (+ boards/ecommerce.md) | general | rebuilt | 30 | Read SKILL, CARD, research-and-angles, worlds-and-devices (head). 23 named worlds compressed into 4 families; corpus citations (brands, idx numbers) dropped. Supersedes scroll-stopper for sets; I kept both because one is the batch pipeline and the other the single-ad craft (the workflow `uses` the craft block). |
| generate-50 | fifty-static-ad-test-sprint (+ boards/ecommerce.md) | general | rebuilt | 5 | Already tight. Format shares and hook set are now labelled "starting assumption, replace with your results" (they came from a third-party benchmark report; none of its numbers are quoted). Archive original-skill.md and motion-benchmarks.md not used. |
| operator-creative (workflow card set) | not a block itself; split into 9 below | n/a | n/a | n/a | No top-level SKILL.md; the folder is a set of stage cards. |
| operator-creative/avatar-storyboard | character-consistent-ad-storyboard | general | rebuilt | 10 | Cards were already compact; sections added, "TEEP" renamed "four-beat check". |
| operator-creative/brand | brand-evidence-records-for-creative | general | rebuilt | 10 | Four records + handoff slices. May overlap with brand-brain builders from other families. |
| operator-creative/concept | ad-concept-grid-planner | general | rebuilt | 10 | Kept separate from brief-v2: this one picks cells in a persona x awareness x theme grid; brief-v2 writes the full brief. |
| operator-creative/image-prompt | static-ad-image-prompt-compiler (+ boards/ecommerce.md) | general | rebuilt | 10 | type prompt, role render. |
| operator-creative/review | static-ad-and-storyboard-review (+ boards/ecommerce.md) | general | rebuilt | 10 | role check. |
| operator-creative/static-copy | static-ad-copy-from-visual-and-awareness | general | rebuilt | 10 | Merged in references/long-primary-text.md as the "long feed story" step. |
| operator-creative/static-plan | static-ad-archetype-and-layout-planner | general | rebuilt | 10 | |
| operator-creative/static-template-process | static-template-slot-contract | general | rebuilt | 10 | Overlaps with the layout-adaptation workflow (that one is the whole pipeline; this is the feasibility check and slot contract it calls). |
| operator-creative/video-editing | brand-safe-video-caption-finishing | general | rebuilt | 30 | App renderer and Remotion references removed; SOURCE.json not used. |
| brief-v2 | creative-brief-three-concepts-nine-variants (+ boards/ecommerce.md) | general | rebuilt | 30 | Read SKILL, CARD, concept-block, copy-frameworks (head), research-frameworks (head). Course names/frameworks and the course quotes were dropped; hook-library, layout-specs, awareness-levels, creative-scaling not read. |
| format-library | static-ad-format-families | general | rebuilt | 20 | Seven families renamed; "42 formats" playbook detail dropped. |

Extra blocks I created that were not 1:1 with a source folder: pdp-gallery-image-check, product-truth-sheet-from-photos (both carved out of Factory reference files because other blocks reuse them).

## New port types
- `product_photos`: the brand's real photos of one product variant, tagged by job (front, in hand, in use, close view, and so on).
- `truth_sheet`: written record of what the exact product variant looks like and which photo jobs are missing.
- `photo_set`: a set of generated product photographs with jobs, sizes and check notes.
- `gallery_plan`: frame-by-frame plan for a product page gallery (question, answer, picture, words with sources, gaps).
- `pdp_images`: rendered product page gallery images in upload order.
- `avatar_sheet`: the identity images of a selected character or avatar, in view order.
- Reused from another agent (not mine): `angle_library`.

## Doubts
- Offer ad bank placed in ecommerce (per the brief's example), but the "deal / proof / product" three-argument method also fits SaaS promos and course launches. Kevin may want it moved to general with an ecommerce board.
- scroll-stopper vs tof-statics: the source itself says tof-statics succeeds scroll-stopper. I kept two blocks (single-ad craft, batch workflow). Merging is easy if you prefer one.
- Course-derived taxonomies that I renamed but whose structure is still recognisable: the six belief kinds in the brief block (outcome, identity, problem, solution, product, credibility), the 12 PDP frames, the 15 static ad families, the 7 format families. The wording and examples are new, but the structure came from them; worth one rights glance.
- Operator-creative cards were already dense, so those nine blocks are only about 10% shorter. They also overlap in spirit with other families (brand brain builders, copy rules, review mining); the library may want to merge them on the site.
- Neither Factory's library data (thousands of images, JSON teardowns) was ported. Blocks describe the method only; the swipe and photoshoot reference libraries stay in the private source and need their own rights decision before any of it is published.
