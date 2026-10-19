# Content rights audit · 19 Oct 2026

**Question (Kevin):** resolve the open questions before the site goes public, starting with content rights. Do our blocks copy course or purchased material, in wording or in structure?
**Short answer:** no block copies wording at a level that matters. The highest overlap with any course original is 2.8%. But **71 blocks keep a course's distinctive structure** (its named list, its count and order, its thresholds), and one more also shares a run of words. Those 71 + 1 need reworking, or holding back, before launch. They are mostly the video-style, image-ad and copy-method blocks. Nothing was edited. Creative Engine and every source stayed read-only.

This isn't legal advice. The plan already says a lawyer reads the rules once before anything paid or before creator uploads (`docs/planning/08_INTAKE_ENGINE.md`). This audit is what that lawyer should see.

## Update, 19 Oct (after rebuilds)

**Short answer now:** the rebuild is done on paper. All 72 C and D blocks are now `origin: rebuilt` with credits to public sources, and no block credits Ecommerce OS or a paid course. Two things stay open: the four nine-beat script blocks still keep Blue Sense Digital's beat order (credited, not reshaped), and the 10 new image blocks were checked against Creative Engine only, not against the course originals. Everything below was counted by script from the item.yaml files and `git log --stat -5` (commits `49c5081`, `6e8c782`, `b75b43d`, `0f35013`). The tables further down are the morning audit, kept as history.

### Where the library stands

| | Morning audit | Now |
|---|---:|---:|
| Blocks (general / ecommerce) | 166 | 176 (162 / 14) |
| Workflow pages | 7 | 7 |
| `origin: rebuilt` | 103 | 126 |
| `origin: own` | 63 | 50 |
| C and D blocks still not rebuilt | 72 | 0 |
| Blocks with a `credits:` list | 0 | 174 |

- **The 72 C and D blocks.** All 72 are `rebuilt` (50 at version 2.0.0, 22 at 2.1.0) and each has at least one credit. Commit `49c5081` rebuilt them in 10 families from public sources and reports every one under 1% shared 8-word runs, with no shared run of 12 words or more.
- **16 blocks moved from `own` to `rebuilt`** in the second pass (`6e8c782`). Among them are the four nine-beat blocks (`find-script-lines-that-lose-sale`, `get-different-video-ads-from-same-research`, `get-video-ad-script-in-customers-words`, `get-video-ad-script-that-sells`), which settles the label half of decision 2. The other 12 were graded A this morning but still followed a course list or threshold. The commit message says "about 30"; the labels show 16.
- **Labels match the sources.** No block marked `own` points to a Creative Engine skill whose rights are `course` or `purchased`. By source rights: 96 rebuilt from course, 10 from purchased, 2 from course and own, 18 rebuilt from our own skills, and 50 own from own.
- **`old_name`.** 136 blocks carry one, and none names Foreplay, Zack D Films, WhatsApp, Starpop or AI CMO any more. That smaller fix is done.

### Credits

- **722 credit entries on 174 blocks** (median 4 per block, 4.5 for rebuilt blocks), pointing at 288 different links. Every entry has a title, author, link and what it was used for. The two blocks with no credits are both our own work: `get-your-best-ad-in-a-new-format` and `know-which-ad-format-your-script-needs`.
- **Who gets credited.** Most links go to Wikipedia (116), journal DOIs (56), Meta's help and ads guide pages (53), Nielsen Norman Group (43), the FTC (33), Open Library (20) and W3C (19).
- **Banned credits: none.** A script searched every title, author, link and use for Ecommerce OS, AI CMO, Starpop, Copy Machine, AI Operator, Nuova Era, Nu Reach, @davidaistar, "playbook" and "course", and found 0. The same names also appear nowhere in `catalogue-items/`, the workflow pages or `site/src`.
- **Blue Sense Digital, 12 credits on 12 blocks.** It is the only course-style source credited, because both talks are free on YouTube.
  - *How To Write Meta Ads That Scale: Copywriting Masterclass* (one video) on 6 blocks: the four nine-beat script blocks, plus `make-an-image-ad-people-get-at-a-glance` and `make-each-carousel-card-earn-the-next-swipe`, which follow its order of argument.
  - *eCommerce CRO masterclass* on the 6 page blocks built from it (`b75b43d`): `answer-doubts-that-stop-customers-buying`, `find-what-stops-visitors-buying-30-quick-checks`, `finish-the-sale-your-ad-started`, `give-shoppers-reasons-to-switch-to-you`, `know-if-you-have-enough-visitors-to-test`, `win-over-strangers-with-article-style-page`. Each says what was used, and three say the idea was rebuilt in our own words.
- **Books.** *Great Leads* (Masterson and Forde) is now credited on `open-sales-copy-the-way-buyers-need`, so that part of decision 4 is done. `know-if-your-copy-is-ready` was rebuilt and no longer credits Forde.

### Image blocks split from video blocks (`0f35013`)

Video script blocks no longer make stills. 10 new image blocks make the still as a real ad, so image blocks now number 47 and video blocks 57. The same commit changed 44 existing item.yaml files and, by its message, rebuilt 21 video blocks on the shared avatar, sheet, storyboard and video stages.

| New image block | Origin | Source | Source rights | Credits | vs CE (share / longest run) |
|---|---|---|---|---:|---|
| `make-an-awkward-subject-gentle-in-a-knitted-image-ad` | rebuilt | CES-127 | course | 7 | 0.0% / 0 |
| `prove-one-point-with-a-paper-cutout-image-ad` | rebuilt | CES-111 | course | 5 | 0.0% / 0 |
| `say-what-buyers-wont-in-a-talking-object-image-ad` | own | CES-123 | own | 5 | 0.1% / 8 |
| `sell-one-claim-with-a-comic-strip-ad` | rebuilt | CES-112 | own | 6 | 0.2% / 9 |
| `show-how-your-product-works-in-a-3d-cutaway` | rebuilt | CES-113 | own | 5 | 0.0% / 0 |
| `show-what-your-product-changes-in-a-clay-scene` | own | CES-110 | own | 5 | 0.2% / 10 |
| `show-whats-inside-in-one-watercolor-image-ad` | rebuilt | CES-126 | course | 7 | 0.0% / 0 |
| `turn-a-daily-problem-into-a-paper-craft-image-ad` | rebuilt | CES-117 | course | 7 | 0.0% / 0 |
| `turn-an-everyday-hassle-into-a-clay-town-image-ad` | rebuilt | CES-109 | course | 6 | 0.0% / 0 |
| `turn-your-best-ad-into-a-still-or-carousel` | own | CES-003 | own | 4 | 0.0% / 0 |

All 10 are version 1.0.0. The overlap was run the same way as the morning audit (8-word runs of the whole block folder against its Creative Engine skill folder, read-only). The five built from Starpop looks (CES-109, 111, 117, 126, 127) share nothing with the Creative Engine wording, but nobody has yet checked their structure against the Starpop originals.

### Still open

1. **The nine-beat blocks.** They are labelled and credited correctly, but they still keep Blue Sense's nine beats in its order. That is fine if Kevin accepts a credited public talk as the base. If not, decision 2's rebuild around our own script shape is still to do.
2. **The CRO credit link.** All 6 CRO credits link to the Blue Sense YouTube channel, not to the video. Point each one at the exact talk, so a reader can check what was used.
3. **Structure check on the 10 new image blocks.** Run the morning's structure read (count, order, coined terms, thresholds) for the five built from course-rights sources before launch.
4. **NOTICE.md** lists only the open-licence adaptations. That is right, since credits now show on each page, but the notice could say so in one line.

## How it was checked

1. **Wording.** Every block (SKILL.md, the online-store add-on and references) was compared with its Creative Engine source and with the course original behind it, as runs of 8 words. Two numbers are reported: the share of the block's 8-word runs found in the original, and the longest shared run.
2. **Structure.** Four helpers read each of the 103 blocks marked `rebuilt`, plus the `own` blocks under question, side by side with the course original. They asked one thing: does the block keep something that makes the course's method recognisable, such as a named list with the same count and order, its coined terms, its thresholds or its template?

## Grades

| Grade | Meaning | Blocks |
|---|---|---:|
| A | Kevin's own work, no course source | 66 |
| B | Rebuilt from a course idea, with nothing distinctive kept. Generic methods and public classics (Schwartz's awareness stages, Caples' headline types, Bencivenga's persuasion equation) are fine. | 35 |
| C | Keeps a course's distinctive structure, reworded | 71 |
| D | Also shares a run of words with a course original | 1 |
| E | Copied text | 0 |

## Blocks to rework (C and D), and what each keeps

- `turn-knitted-wool-script-into-ready-video-shots` (D): a 19-word run (2.8%) shared with the Starpop wool original, and nearly the whole skill reworded line by line
- `borrow-a-photos-look-for-your-product` (C): the photo reading, the 11 camera looks in order, the 5 placements and the 30/25/20/15/10 weights (AI CMO asset generator)
- `borrow-an-ad-layout-that-already-works` (C): the 15 static-ad format types in order, the 10-phase build and its rules (AI CMO Static Ad Factory)
- `build-trust-with-ten-weeks-of-founder-videos` (C): the 10 founder video ideas, the timed structures, the six-post list and the 4-week series (ecommerce playbook)
- `catch-product-page-image-mistakes-before-shoppers-do` (C): the PDP Image Factory's 8 QA checks and its failure rates (AI CMO)
- `edit-a-draft-so-it-sells` (C): the passage-repair table and the three-question revision test (Copy Machine)
- `find-ad-ideas-competitors-all-miss` (C): the ad archetype clusters, tie-breaks, run-time tiers and sampling numbers (AI CMO Foreplay strategy)
- `find-image-ad-types-worth-testing-next` (C): the 7 format families, the gap table and the five-line brief (ecommerce playbook format library)
- `find-script-lines-that-lose-sale` (C): the Blue Sense 9 beats; labelled own
- `find-why-customers-buy-in-their-words` (C): the 12 review jobs merged into 10 in order, and the page's thresholds (ecommerce playbook review mining)
- `fix-page-in-order-buyers-read-it` (C): the five core questions, the three-second test and the page-by-page order (AI CMO CRO brain)
- `fix-whats-wrong-in-finished-ads-before-launch` (C): the TEEP four beats, renamed (AI Operator; low risk)
- `get-a-clay-town-ad-script-with-a-crowd` (C): the 4-look menu and the clay transition list (Starpop)
- `get-a-full-product-photoshoot-from-phone-photos` (C): the Photoshoot Factory pipeline, its 5 study questions and its QA method (AI CMO)
- `get-a-product-page-gallery-that-answers-doubts` (C): the objection-mining routine, the 6 doubt kinds and their routing (AI CMO PDP Image Factory)
- `get-a-storyboard-where-your-character-never-changes` (C): the TEEP four-part check, renamed (AI Operator; low risk)
- `get-a-warm-animated-film-ad-script` (C): the look recipe and the three transition moves with the same examples (Starpop)
- `get-ad-ideas-that-each-test-something-new` (C): the 7 idea sources in order, the TEEP four beats and the persona x stage x theme grid (AI Operator)
- `get-an-offer-that-answers-your-buyers-doubt` (C): the seven offer failures in order, the five mechanics and the offer parts (offer talk transcript)
- `get-catchy-song-ad-script-that-sells` (C): the audience-to-genre table, the length tiers and the lyric rules (Starpop)
- `get-cutout-explainer-ad-script-that-sells` (C): the main-point kinds, the graphic-system recipe, proof list and moves (Starpop; weaker)
- `get-different-video-ads-from-same-research` (C): the Blue Sense 9 beats and research-find names; labelled own
- `get-every-word-your-image-ad-needs` (C): the 5 headline angles in order (AI Operator)
- `get-five-ad-ideas-you-havent-tried-yet` (C): the 10-section gap audit, the 10 desires and the 9 hook archetypes (AI CMO strategic audit)
- `get-honest-videos-from-small-creators` (C): the 3-step creator flywheel, follower range and brief ideas (ecommerce playbook micro-influencer)
- `get-image-ads-strangers-stop-scrolling-for` (C): the six beliefs, the four visual modes, the batch ratios and gates (AI CMO TOF statics)
- `get-knitted-wool-ad-script-that-sells` (C): the wool rules, the prompt blocks and the 4 yarn transitions (Starpop)
- `get-new-ads-in-your-winners-style` (C): the six-dimension visual DNA read and its thresholds (AI CMO recreate winning ads)
- `get-openings-that-each-try-something-different` (C): the 5 founder hook types with timed beats, and the avatar hook templates (ecommerce playbook hooks)
- `get-overhead-portraits-that-still-look-human` (C): the Wide Face look spec with its percentages and failure list (Nuova Era)
- `get-paper-world-ad-script-that-sells` (C): the 5 paper sub-styles, 7 transitions, 5 fundamentals and banned words (Starpop)
- `get-phone-video-script-that-sounds-unscripted` (C): the 5-beat UGC structure and its signature rules (AI CMO, credited to a named creator)
- `get-product-photos-that-look-like-one-shoot` (C): the 4 colour worlds, the 15 shot types and the art-direction axes (AI CMO Instant Photoshoot)
- `get-product-snapshots-that-dont-look-like-ads` (C): the Brand Flash DNA recipe and its prompt opening (AI CMO flash photoshoot)
- `get-skeleton-ad-script-that-keeps-people-watching` (C): the 4-row angle table, the marker types and the 4 skeleton looks (Starpop)
- `get-talking-openings-that-keep-viewers-watching` (C): the three-pace system, the wildcard rule and renamed hook levers (AI CMO UGC hooks)
- `get-three-ad-ideas-and-nine-versions` (C): the T-E-E-P stage names, six belief kinds, 8 evidence tiers and mode mixes (AI CMO brief generator)
- `get-usable-creator-videos-from-one-clear-brief` (C): the creator brief's section order and 3-folder naming (AI CMO UGC template; weaker)
- `get-video-ad-script-in-customers-words` (C): the Blue Sense 9 beats and research-find names; labelled own
- `get-video-ad-script-that-sells` (C): the Blue Sense 9 beats and the coined research-find names; labelled own, should be rebuilt
- `get-watercolor-ad-script-that-sells` (C): the 5 watercolor looks, the 7 paint movements and the style lock (Starpop)
- `get-your-ad-read-like-a-shared-article` (C): the headline shapes of the 'Hook Headline over Photo' type (ecommerce playbook indirect ads)
- `give-shoppers-reasons-to-switch-to-you` (C): the 4 headline formulas and the two page blueprints (AI CMO five reasons)
- `know-if-your-copy-is-ready` (C): the 15-question last sweep, about 10 of 15 matching (Copy Machine, possibly Forde's published list)
- `know-what-each-product-page-photo-should-show` (C): the 12-frame product page order from the Product Images Template (AI CMO)
- `know-who-youre-writing-for` (C): the Avatar Evidence Stack fields and the three-step change scale (Copy Machine)
- `learn-from-competitor-ads-sorted-by-type` (C): the 11 board categories in order and the selection rules (AI CMO Foreplay boards)
- `learn-what-sells-from-50-different-image-ads` (C): the 40/30/20/10 format mix, the five-hook set and the two gates (AI CMO Generate 50)
- `make-buyers-see-themselves-in-an-empty-room` (C): the 'Emotional Scene' type and a word-for-word headline shape (ecommerce playbook indirect ads)
- `make-people-look-with-one-red-circle` (C): two headline shapes of the 'Annotated Photo' type (ecommerce playbook indirect ads)
- `open-sales-copy-the-way-buyers-need` (C): the Copy Machine's four test pairs and mismatch rule (the six leads are Great Leads, a book: credit it)
- `pick-the-right-layout-for-your-image-ad` (C): the 12 static ad archetypes in order and the photography style matrix (AI Operator)
- `reach-the-right-people-with-a-visible-symptom` (C): the near-verbatim headline template of the 'Symptom Close-up' type (ecommerce playbook indirect ads)
- `sell-one-offer-three-ways-with-image-ads` (C): the three named arguments, the 24/40 ad maths and a reused sentence (ecommerce playbook BFCM offer)
- `stop-strangers-scrolling-with-a-story-ad` (C): the indirect-ad method end to end; with 8 sister blocks it covers 9 of the page's 11 image types
- `stop-the-right-people-scrolling` (C): the stuck model's four questions, the hook triad and the stacked-hook timing (Copy Machine)
- `stop-the-scroll-with-your-buyers-problem` (C): the whole 8-step build order, 5 angles, 5 levers, 14 picture types and 8 headline formulas (AI CMO scroll-stopping statics)
- `stop-your-copy-sounding-like-ai` (C): about 13 of 18 patterns from the purchased catch list, mostly in order (Copy Machine)
- `turn-comic-page-script-into-ready-video-shots` (C): the comic-page-on-a-desk format and its defining parts (AI CMO comic book ad)
- `turn-cutout-explainer-script-into-ready-video-shots` (C): the 8-step workflow in order plus its lists (Starpop)
- `turn-one-customer-quote-into-image-ads` (C): the 7 static review-ad formats and the feed-copy recipe (ecommerce playbook review mining)
- `turn-paper-world-script-into-ready-video-shots` (C): the 5 paper rules, 5 sub-styles, banned words, move table and 7 transitions (Starpop)
- `turn-skeleton-script-into-shots-ai-can-make` (C): the four skeleton looks, the theme examples and the shot-map columns (Starpop)
- `turn-song-script-into-shots-ai-can-make` (C): the song-as-backbone stages and their numbers (Starpop)
- `turn-watercolor-script-into-shots-ai-can-make` (C): the 7 paint actions, the 5 looks and the style lock (Starpop)
- `turn-website-into-brand-file-for-ai` (C): the 9-file brand folder with 8 identical file names, the gates and the follow-up order (AI CMO brand brain)
- `turn-your-animated-film-script-into-consistent-clips` (C): the three fixed prompt blocks in order and the three transition kinds (Starpop)
- `turn-your-anime-script-into-consistent-clips` (C): the Starpop visual systems and the Nuova Era five-field beat schema
- `turn-your-clay-town-script-into-handmade-looking-clips` (C): the four clay sub-styles, six fundamentals, shot list and transitions (Starpop)
- `turn-your-products-hidden-process-into-3d-clips` (C): the 7-beat Zack D Films spine with the same time shares (AI CMO)
- `turn-your-short-film-script-into-consistent-clips` (C): the Nuova Era three-layer method and its change-line template
- `win-over-strangers-with-article-style-page` (C): the 13-section advertorial order (AI CMO advertorial)

## Decisions for Kevin

1. **What happens to the C and D blocks before launch (19 Jan 2027).** My recommendation: rebuild each from its job, not from the source. That means a different count and grouping, our own names, our own thresholds, and no course template. Then re-test it on Sprout. Until a block is rebuilt, mark it hidden, so it never shows on the public site. There's time: about 72 blocks at roughly 6 per working day is under three weeks. Hiding them all now would cut the video-style and image-ad sections roughly in half.
2. **The 9-beat playbook (open call 4).** It came from the Blue Sense Digital masterclass: the same 9 beats in the same order, plus a 49-word run shared with the Creative Engine video-ad-scripts. The four blocks built on it are labelled `own`, and that label is wrong. My recommendation: relabel them `rebuilt` and rebuild them around our own script shape. `get-video-ad-script-in-customers-words` is the better base.
3. **The five script formats.** They came from the Starpop look skills by @davidaistar. Our wording is new (0% shared), but several looks keep Starpop's lists. The C list above names each one.
4. **Credit for published books.** The six lead types in `open-sales-copy-the-way-buyers-need` are from *Great Leads* (Masterson and Forde). `know-if-your-copy-is-ready` may be Forde's published list. My recommendation: name the book on the page, the same way the four open-licence adaptations are credited in NOTICE.md.
5. **AI CMO branding on the playbook pages.** The review-mining and indirect-ads playbook pages carry "Join AI CMO" banners, so treat them as AI CMO course material, not only Nu Reach.

## Smaller fixes (no decision needed)

- `old_name` in some `item.yaml` files still names a tool (Foreplay), a creator (Zack D Films) and an app (WhatsApp). These names never show on the site, but they ship in the repo. I'll clear them.
- NOTICE.md lists the four open-licence adaptations under their old slugs. The new slugs are:
  - `landing-page-design-direction` → `choose-three-on-brand-designs-for-page`
  - `storefront-evidence-inspection` → `find-what-stops-shoppers-backed-by-screenshots`
  - `video-ad-edit-plan-from-footage` → `turn-footage-into-ad-people-follow`
  - `organic-video-edit-plan-from-footage` → `turn-raw-footage-into-a-clear-social-post`
- Where things came from:
  - The 12-frame product page order came from Kevin's "Product Images Template - Ecommerce" in `AI CMO/product images`, added on 2 Oct (CE `DECISIONS.md`). That makes it course material.
  - The seven offer failures came from the offer talk transcript named in CE `skills/offer-building/SKILL.md`.
- Near-verbatim headline templates appear across the indirect-ad picture blocks, for example "The reason you [behaviour they're embarrassed by]". They are covered by decision 1.

## Every block

Columns: slug, board, origin label, source ids, source rights, shared 8-word runs with the Creative Engine source (share / longest run in words), the same against the course original, what it matched, and the grade after the structure check.

| Block | Board | Origin | Source | Rights | vs CE | vs course | Matched | Grade |
|---|---|---|---|---|---|---|---|---|
| `answer-doubts-that-stop-customers-buying` | gen | own | CES-050 | own | 0.4% / 11 | 0.0% / 0 | - | A |
| `borrow-an-ad-layout-that-already-works` | gen | rebuilt | CES-139 | course | 1.6% / 16 | 0.8% / 11 | CE | C |
| `borrow-landing-page-layout-you-admire` | gen | rebuilt | CES-020 | course | 0.4% / 13 | 0.0% / 0 | - | B |
| `borrow-structure-of-ad-you-admire` | gen | own | CES-130 | own | 4.5% / 26 | 0.0% / 0 | CE | A |
| `build-trust-with-ten-weeks-of-founder-videos` | gen | rebuilt | CES-092 | course | 1.1% / 17 | 0.0% / 0 | CE | C |
| `catch-mistakes-in-your-ad-before-you-pay` | gen | rebuilt | CES-026 | course | 2.3% / 25 | 0.1% / 9 | CE | B |
| `choose-three-on-brand-designs-for-page` | gen | own | CES-031 | own | 0.0% / 8 | 0.0% / 0 | - | A |
| `edit-a-draft-so-it-sells` | gen | rebuilt | CES-022 | purchased | 2.3% / 20 | 0.0% / 8 | CE | C |
| `fill-an-ad-template-with-provable-facts` | gen | rebuilt | CES-088 | course | 0.5% / 11 | 0.0% / 0 | - | B |
| `fill-brand-file-gaps-in-one-founder-call` | gen | own | CES-040 | own | 4.4% / 20 | 0.0% / 0 | CE | A |
| `find-ad-ideas-competitors-all-miss` | gen | rebuilt | CES-038 | course | 0.1% / 8 | 0.0% / 0 | - | C |
| `find-fixes-worth-making-in-your-google-ads` | gen | rebuilt | CES-090 | course | 0.3% / 12 | 0.0% / 0 | - | B |
| `find-image-ad-types-worth-testing-next` | gen | rebuilt | CES-039 | course | 7.0% / 24 | 1.0% / 14 | CE | C |
| `find-offers-hiding-in-what-you-already-sell` | gen | own | CES-079 | own | 4.8% / 27 | 0.0% / 0 | CE | A |
| `find-out-why-your-ads-stopped-selling` | gen | rebuilt | CES-090 | course | 0.1% / 9 | 0.0% / 0 | - | B |
| `find-script-lines-that-lose-sale` | gen | own | CES-004 | own | 3.1% / 25 | 0.1% / 10 | CE | C |
| `find-the-story-ad-worth-writing-first` | gen | own | CES-076 | own | 5.9% / 43 | 0.0% / 0 | CE | A |
| `find-what-stops-visitors-buying-30-quick-checks` | gen | own | CES-050 | own | 0.2% / 11 | 0.0% / 0 | - | A |
| `find-where-page-loses-buyers-test-fixes` | gen | rebuilt | CES-027 | course | 1.9% / 23 | 0.1% / 8 | CE | B |
| `find-why-customers-buy-in-their-words` | gen | rebuilt | CES-103 | course | 0.5% / 11 | 0.2% / 11 | - | C |
| `finish-the-sale-your-ad-started` | gen | own | CES-050 | own | 3.9% / 31 | 0.0% / 0 | CE | A |
| `finish-your-sales-page-with-proof` | gen | rebuilt | CES-022 | purchased | 1.4% / 17 | 0.0% / 0 | CE | B |
| `fix-page-in-order-buyers-read-it` | gen | rebuilt | CES-028 | course | 3.1% / 28 | 0.2% / 13 | CE | C |
| `fix-whats-wrong-in-finished-ads-before-launch` | gen | rebuilt | CES-085 | course | 0.2% / 9 | 0.0% / 8 | - | C |
| `get-a-3d-how-it-works-ad-script` | gen | own | CES-113 | own | 3.4% / 22 | 0.0% / 0 | CE | A |
| `get-a-clay-town-ad-script-with-a-crowd` | gen | rebuilt | CES-109 | course | 4.0% / 21 | 0.0% / 0 | CE | C |
| `get-a-second-look-with-a-test-result-photo` | gen | rebuilt | CES-066 | course | 0.6% / 15 | 0.0% / 0 | CE | B |
| `get-a-sharper-bigger-image-with-nothing-changed` | gen | rebuilt | CES-047 | course | 0.2% / 9 | 0.0% / 0 | - | B |
| `get-a-short-film-ad-script-with-a-twist` | gen | own | CES-107 | own | 0.4% / 14 | 0.0% / 0 | - | A |
| `get-a-storyboard-where-your-character-never-changes` | gen | rebuilt | CES-081 | course | 0.1% / 8 | 0.0% / 0 | - | C |
| `get-a-warm-animated-film-ad-script` | gen | rebuilt | CES-108 | course | 1.0% / 13 | 0.0% / 8 | - | C |
| `get-ad-captions-in-your-own-brand-font` | gen | rebuilt | CES-089 | course | 0.2% / 12 | 0.0% / 0 | - | B |
| `get-ad-ideas-that-each-test-something-new` | gen | rebuilt | CES-083 | course | 0.0% / 8 | 0.0% / 0 | - | C |
| `get-ai-ads-that-show-your-real-product` | gen | rebuilt | CES-099 | course | 2.2% / 20 | 0.0% / 0 | CE | B |
| `get-an-ad-where-every-line-sells` | gen | own | CES-024 | own | 1.7% / 15 | 0.0% / 8 | CE | A |
| `get-an-offer-that-answers-your-buyers-doubt` | gen | rebuilt | CES-078 | course | 3.5% / 26 | 0.0% / 0 | CE | C |
| `get-an-original-anime-ad-script` | gen | rebuilt | CES-105 | course | 0.3% / 11 | 0.0% / 0 | - | B |
| `get-believed-with-a-text-someone-else-sent` | gen | own | CES-073 | own | 3.8% / 17 | 0.0% / 0 | CE | A |
| `get-brand-guide-any-designer-can-follow` | gen | rebuilt | CES-011 | course | 1.5% / 15 | 0.1% / 11 | CE | B |
| `get-catchy-song-ad-script-that-sells` | gen | rebuilt | CES-121 | course | 3.1% / 26 | 0.4% / 14 | CE | C |
| `get-claymation-ad-script-that-sells` | gen | own | CES-110 | own | 1.6% / 18 | 0.1% / 9 | CE | A |
| `get-comic-page-ad-script-that-sells` | gen | own | CES-112 | own | 2.5% / 19 | 0.1% / 9 | CE | A |
| `get-cutout-explainer-ad-script-that-sells` | gen | rebuilt | CES-111 | course | 2.0% / 15 | 0.1% / 9 | CE | C |
| `get-different-video-ads-from-same-research` | gen | own | CES-133 | own | 8.3% / 24 | 0.0% / 0 | CE | C |
| `get-doubters-reading-with-a-dont-buy-warning` | gen | own | CES-061 | own | 2.0% / 17 | 0.0% / 0 | CE | A |
| `get-every-word-your-image-ad-needs` | gen | rebuilt | CES-086 | course | 1.0% / 13 | 0.0% / 0 | - | C |
| `get-five-ad-ideas-you-havent-tried-yet` | gen | rebuilt | CES-140, CES-090 | course | 3.0% / 19 | 0.0% / 0 | CE | C |
| `get-founder-ad-script-people-believe` | gen | own | CES-114 | own | 2.4% / 16 | 0.0% / 0 | CE | A |
| `get-fresh-script-from-why-ad-worked` | gen | own | CES-129 | own | 2.8% / 19 | 0.0% / 0 | CE | A |
| `get-headlines-strangers-understand-at-a-glance` | gen | rebuilt | CES-022 | purchased | 1.6% / 15 | 0.0% / 0 | CE | B |
| `get-honest-videos-from-small-creators` | gen | rebuilt | CES-092 | course | 2.1% / 19 | 0.0% / 8 | CE | C |
| `get-image-ads-strangers-stop-scrolling-for` | gen | rebuilt | CES-143 | course | 3.1% / 37 | 0.3% / 11 | CE | C |
| `get-images-that-match-your-plan-word-for-word` | gen | own | CES-046 | own | 6.3% / 28 | 0.3% / 13 | CE | A |
| `get-knitted-wool-ad-script-that-sells` | gen | rebuilt | CES-127 | course | 5.5% / 26 | 0.3% / 11 | CE | C |
| `get-long-narrated-ad-script-that-sells` | gen | own | CES-125 | own | 4.9% / 23 | 0.3% / 12 | CE | A |
| `get-motion-graphics-ad-script-that-sells` | gen | rebuilt | CES-116 | course | 3.6% / 17 | 0.1% / 9 | CE | B |
| `get-new-ads-from-your-best-script` | gen | own | CES-132 | own | 3.1% / 20 | 0.0% / 0 | CE | A |
| `get-new-ads-in-your-winners-style` | gen | rebuilt | CES-101 | course | 3.8% / 36 | 0.0% / 0 | CE | C |
| `get-noticed-with-a-sticky-note-ad` | gen | own | CES-071 | own | 3.0% / 26 | 0.0% / 0 | CE | A |
| `get-offer-reel-that-shows-your-real-product` | gen | own | CES-052 | own | 3.5% / 23 | 0.1% / 9 | CE | A |
| `get-one-image-ad-ready-to-make` | gen | own | CES-044, CES-045 | own | 3.5% / 32 | 0.0% / 0 | CE | A |
| `get-one-true-fact-read-in-a-caption-bar` | gen | own | CES-058 | own | 2.4% / 18 | 0.0% / 0 | CE | A |
| `get-openings-that-each-try-something-different` | gen | rebuilt | CES-043 | course | 0.7% / 12 | 0.2% / 12 | - | C |
| `get-overhead-portraits-that-still-look-human` | gen | rebuilt | CES-149 | course | 0.2% / 11 | 0.0% / 0 | - | C |
| `get-paper-world-ad-script-that-sells` | gen | rebuilt | CES-117 | course | 2.2% / 17 | 0.0% / 0 | CE | C |
| `get-phone-video-script-that-sounds-unscripted` | gen | rebuilt | CES-144 | course | 2.4% / 22 | 0.0% / 0 | CE | C |
| `get-podcast-clip-ad-script-that-sells` | gen | own | CES-118 | own | 5.9% / 32 | 0.1% / 9 | CE | A |
| `get-read-with-a-family-group-chat-ad` | gen | own | CES-074 | own | 4.1% / 29 | 0.0% / 0 | CE | A |
| `get-recognised-with-the-old-things-that-failed` | gen | own | CES-075 | own | 4.5% / 22 | 0.0% / 0 | CE | A |
| `get-script-presenter-can-say-without-stumbling` | gen | own | CES-134 | own | 4.5% / 21 | 0.0% / 0 | CE | A |
| `get-selfie-style-ad-script-that-sounds-human` | gen | own | CES-124 | own | 9.1% / 26 | 0.0% / 0 | CE | A |
| `get-shot-list-that-keeps-ad-moving` | gen | own | CES-147 | own | 2.2% / 18 | 0.0% / 0 | CE | A |
| `get-skeleton-ad-script-that-keeps-people-watching` | gen | rebuilt | CES-120 | course | 3.4% / 24 | 0.0% / 0 | CE | C |
| `get-story-ads-read-with-the-right-picture` | gen | own | CES-054 | own | 5.4% / 38 | 0.0% / 0 | CE | A |
| `get-talking-object-ad-script-that-sells` | gen | own | CES-123 | own | 8.6% / 29 | 0.0% / 0 | CE | A |
| `get-talking-openings-that-keep-viewers-watching` | gen | rebuilt | CES-007 | course | 2.7% / 16 | 0.0% / 8 | CE | C |
| `get-three-ad-ideas-and-nine-versions` | gen | rebuilt | CES-013 | course | 4.7% / 35 | 0.0% / 0 | CE | C |
| `get-usable-creator-videos-from-one-clear-brief` | gen | rebuilt | CES-144 | course | 1.5% / 17 | 0.0% / 0 | CE | C |
| `get-video-ad-script-in-customers-words` | gen | own | CES-128 | own | 3.6% / 26 | 0.0% / 0 | CE | C |
| `get-video-ad-script-that-sells` | gen | own | CES-145, CES-146 | own | 2.5% / 22 | 0.1% / 11 | CE | C |
| `get-watercolor-ad-script-that-sells` | gen | rebuilt | CES-126 | course | 4.6% / 30 | 0.0% / 0 | CE | C |
| `get-your-ad-read-like-a-shared-article` | gen | rebuilt | CES-064 | course | 1.5% / 23 | 0.0% / 0 | CE | C |
| `get-your-best-ad-in-a-new-format` | gen | own | CES-003 | own | 7.6% / 32 | 0.0% / 0 | CE | A |
| `give-ai-tools-brand-facts-they-can-trust` | gen | rebuilt | CES-082 | course | 0.2% / 12 | 0.0% / 0 | - | B |
| `give-shoppers-reasons-to-switch-to-you` | gen | rebuilt | CES-034, CES-035, CES-050 | course, own | 2.3% / 21 | 0.0% / 8 | CE | C |
| `keep-clever-lines-from-beating-clear-ones` | gen | own | CES-023 | own | 10.2% / 86 | 0.0% / 0 | CE | A |
| `keep-facebook-from-blocking-your-ads` | gen | own | CES-001 | own | 2.2% / 20 | 0.0% / 0 | CE | A |
| `keep-people-reading-with-a-hand-drawn-story` | gen | rebuilt | CES-065 | course | 1.6% / 15 | 0.0% / 0 | CE | B |
| `know-how-your-ad-should-open` | gen | rebuilt | CES-015 | course | 2.0% / 22 | 0.0% / 8 | CE | B |
| `know-if-you-have-enough-visitors-to-test` | gen | own | CES-050 | own | 0.7% / 15 | 0.0% / 0 | CE | A |
| `know-if-your-copy-is-ready` | gen | rebuilt | CES-022 | purchased | 8.6% / 49 | 0.5% / 13 | CE | C |
| `know-if-your-new-prompt-writes-better-ads` | gen | rebuilt | CES-091, CES-090 | course | 0.1% / 10 | 0.0% / 0 | - | B |
| `know-which-ad-format-your-script-needs` | gen | own | CES-131 | own | 3.2% / 17 | 0.0% / 0 | CE | A |
| `know-who-youre-writing-for` | gen | rebuilt | CES-022 | purchased | 0.6% / 11 | 0.0% / 0 | - | C |
| `learn-from-competitor-ads-sorted-by-type` | gen | rebuilt | CES-037 | course | 0.1% / 9 | 0.0% / 0 | - | C |
| `learn-what-sells-from-50-different-image-ads` | gen | rebuilt | CES-041 | course | 4.9% / 24 | 0.0% / 8 | CE | C |
| `make-ai-build-the-ad-you-pictured` | gen | own | CES-142 | own | 7.9% / 42 | 0.1% / 9 | CE | A |
| `make-an-image-ad-people-get-at-a-glance` | gen | own | CES-122 | own | 2.5% / 19 | 0.0% / 0 | CE | A |
| `make-buyers-see-themselves-in-an-empty-room` | gen | rebuilt | CES-062 | course | 2.1% / 18 | 0.0% / 0 | CE | C |
| `make-each-carousel-card-earn-the-next-swipe` | gen | own | CES-106 | own | 1.7% / 19 | 0.0% / 0 | CE | A |
| `make-every-ad-sound-like-your-brand` | gen | own | CES-012 | own | 0.5% / 9 | 0.0% / 0 | - | A |
| `make-people-look-twice-at-the-leftover-mess` | gen | rebuilt | CES-060 | course | 1.4% / 15 | 0.0% / 0 | CE | B |
| `make-people-look-with-one-red-circle` | gen | rebuilt | CES-057 | course | 0.6% / 16 | 0.0% / 0 | CE | C |
| `make-people-read-a-private-phone-note` | gen | own | CES-068 | own | 5.5% / 30 | 0.0% / 0 | CE | A |
| `make-video-ad-clear-with-sound-off` | gen | own | CES-030 | own | 4.0% / 25 | 0.1% / 9 | CE | A |
| `open-sales-copy-the-way-buyers-need` | gen | rebuilt | CES-022 | purchased | 0.3% / 10 | 0.0% / 0 | - | C |
| `pass-work-between-ai-steps-without-losing-facts` | gen | rebuilt | CES-091 | course | 0.3% / 10 | 0.0% / 0 | - | B |
| `pick-the-right-layout-for-your-image-ad` | gen | rebuilt | CES-087 | course | 0.3% / 11 | 0.0% / 0 | - | C |
| `puzzle-people-into-reading-with-one-odd-photo` | gen | own | CES-056 | own | 1.4% / 22 | 0.0% / 0 | CE | A |
| `reach-the-right-people-with-a-visible-symptom` | gen | rebuilt | CES-072 | course | 2.4% / 22 | 0.0% / 0 | CE | C |
| `stop-image-tools-redrawing-your-product-and-words` | gen | rebuilt | CES-084 | course | 0.4% / 10 | 0.0% / 0 | - | B |
| `stop-paying-for-the-same-ai-mistake-twice` | gen | own | CES-025 | own | 5.0% / 33 | 0.3% / 17 | CE + course | A |
| `stop-strangers-scrolling-with-a-story-ad` | gen | rebuilt | CES-048 | course | 0.2% / 11 | 0.1% / 9 | - | C |
| `stop-the-right-people-scrolling` | gen | rebuilt | CES-022 | purchased | 2.2% / 17 | 0.2% / 9 | CE | C |
| `stop-the-scroll-with-a-handwritten-note` | gen | own | CES-063 | own | 2.3% / 18 | 0.0% / 0 | CE | A |
| `stop-the-scroll-with-your-buyers-problem` | gen | rebuilt | CES-135 | course | 5.0% / 25 | 0.0% / 0 | CE | C |
| `stop-tired-buyers-with-ignored-reminders` | gen | own | CES-070 | own | 3.1% / 27 | 0.0% / 0 | CE | A |
| `stop-worried-buyers-with-what-they-dread` | gen | rebuilt | CES-067 | course | 1.5% / 15 | 0.0% / 0 | CE | B |
| `stop-your-buyer-mid-scroll-with-a-snapshot` | gen | own | CES-059 | own | 3.3% / 28 | 0.0% / 0 | CE | A |
| `stop-your-copy-sounding-like-ai` | gen | rebuilt | CES-022 | purchased | 1.7% / 17 | 0.2% / 10 | CE | C |
| `tell-the-problem-so-buyers-see-themselves` | gen | rebuilt | CES-022 | purchased | 2.7% / 18 | 0.0% / 0 | CE | B |
| `turn-a-real-complaint-into-praise-people-read` | gen | own | CES-069 | own | 1.8% / 18 | 0.0% / 0 | CE | A |
| `turn-claymation-script-into-ready-video-shots` | gen | rebuilt | CES-018 | course | 1.4% / 13 | 0.0% / 0 | - | B |
| `turn-comic-page-script-into-ready-video-shots` | gen | rebuilt | CES-021 | course | 4.2% / 18 | 0.0% / 0 | CE | C |
| `turn-cutout-explainer-script-into-ready-video-shots` | gen | rebuilt | CES-033 | course | 2.9% / 19 | 0.0% / 0 | CE | C |
| `turn-features-into-reasons-to-buy` | gen | rebuilt | CES-022 | purchased | 0.4% / 10 | 0.0% / 0 | - | B |
| `turn-footage-into-ad-people-follow` | gen | own | CES-032 | own | 1.0% / 13 | 0.0% / 0 | - | A |
| `turn-knitted-wool-script-into-ready-video-shots` | gen | rebuilt | CES-151 | course | 3.5% / 22 | 2.8% / 19 | CE + course | D |
| `turn-motion-graphics-script-into-ready-video-shots` | gen | rebuilt | CES-051 | course | 2.4% / 21 | 0.0% / 0 | CE | B |
| `turn-one-customer-quote-into-image-ads` | gen | rebuilt | CES-102 | course | 1.9% / 16 | 0.0% / 0 | CE | C |
| `turn-paper-world-script-into-ready-video-shots` | gen | rebuilt | CES-094 | course | 2.2% / 16 | 0.8% / 13 | CE | C |
| `turn-podcast-clip-script-into-ready-video-shots` | gen | rebuilt | CES-097 | course | 5.7% / 25 | 0.0% / 0 | CE | B |
| `turn-raw-footage-into-a-clear-social-post` | gen | own | CES-093 | own | 2.2% / 19 | 0.0% / 0 | CE | A |
| `turn-skeleton-script-into-shots-ai-can-make` | gen | rebuilt | CES-137 | course | 1.8% / 17 | 0.1% / 9 | CE | C |
| `turn-song-script-into-shots-ai-can-make` | gen | rebuilt | CES-138 | course | 1.9% / 19 | 0.1% / 8 | CE | C |
| `turn-talking-object-script-into-shots-ai-can-make` | gen | rebuilt | CES-141 | course | 3.8% / 28 | 0.0% / 0 | CE | B |
| `turn-watercolor-script-into-shots-ai-can-make` | gen | rebuilt | CES-148 | course | 3.5% / 22 | 0.1% / 10 | CE | C |
| `turn-website-into-brand-file-for-ai` | gen | rebuilt | CES-010 | course | 0.7% / 21 | 0.0% / 0 | CE | C |
| `turn-your-ad-numbers-into-three-next-steps` | gen | rebuilt | CES-090 | course | 0.0% / 0 | 0.0% / 0 | - | B |
| `turn-your-animated-film-script-into-consistent-clips` | gen | rebuilt | CES-016 | course | 0.5% / 11 | 0.0% / 8 | - | C |
| `turn-your-anime-script-into-consistent-clips` | gen | rebuilt | CES-008 | course | 0.1% / 10 | 0.0% / 0 | - | C |
| `turn-your-clay-town-script-into-handmade-looking-clips` | gen | rebuilt | CES-019 | course | 1.1% / 18 | 0.1% / 9 | CE | C |
| `turn-your-idea-into-an-article-style-ad` | gen | own | CES-104 | own | 1.5% / 14 | 0.0% / 0 | - | A |
| `turn-your-products-hidden-process-into-3d-clips` | gen | rebuilt | CES-152 | course | 6.0% / 31 | 0.1% / 9 | CE | C |
| `turn-your-selfie-style-script-into-consistent-clips` | gen | rebuilt | CES-100 | course | 2.6% / 20 | 0.0% / 8 | CE | B |
| `turn-your-short-film-script-into-consistent-clips` | gen | rebuilt | CES-017 | course | 0.2% / 11 | 0.0% / 0 | - | C |
| `win-over-strangers-with-article-style-page` | gen | rebuilt | CES-005, CES-050 | course, own | 2.0% / 19 | 0.1% / 9 | CE | C |
| `write-a-carousel-ad-people-swipe-through` | gen | own | CES-044, CES-045 | own | 1.1% / 14 | 0.0% / 0 | - | A |
| `write-a-story-ad-buyers-see-themselves-in` | gen | own | CES-053 | own | 3.1% / 20 | 0.1% / 10 | CE | A |
| `write-ads-people-believe` | gen | own | CES-014 | own | 0.0% / 0 | 0.0% / 0 | - | A |
| `write-ads-that-sound-like-a-friend` | gen | own | CES-002 | own | 6.1% / 28 | 0.0% / 0 | CE | A |
| `write-story-ads-that-read-like-real-posts` | gen | own | CES-115 | own | 3.1% / 20 | 0.0% / 0 | CE | A |
| `borrow-a-photos-look-for-your-product` | eco | rebuilt | CES-009 | course | 2.1% / 23 | 0.0% / 0 | CE | C |
| `catch-product-page-image-mistakes-before-shoppers-do` | eco | rebuilt | CES-095 | course | 0.2% / 11 | 0.0% / 0 | - | C |
| `find-what-stops-shoppers-backed-by-screenshots` | eco | own | CES-029 | own | 0.2% / 10 | 0.0% / 0 | - | A |
| `get-a-full-product-photoshoot-from-phone-photos` | eco | rebuilt | CES-096 | course | 1.5% / 14 | 0.1% / 11 | - | C |
| `get-a-product-page-gallery-that-answers-doubts` | eco | rebuilt | CES-095, CES-098 | course | 0.4% / 10 | 0.0% / 8 | - | C |
| `get-landing-page-live-in-shopify-store` | eco | rebuilt | CES-136, CES-035 | course | 1.9% / 19 | 0.1% / 8 | CE | B |
| `get-product-photos-that-look-like-one-shoot` | eco | rebuilt | CES-049 | course | 3.5% / 19 | 0.0% / 0 | CE | C |
| `get-product-snapshots-that-dont-look-like-ads` | eco | rebuilt | CES-036 | course | 3.0% / 22 | 0.1% / 10 | CE | C |
| `get-satisfying-motion-ad-script-that-sells` | eco | own | CES-119 | own | 5.6% / 21 | 0.1% / 9 | CE | A |
| `get-shopify-theme-code-that-installs-cleanly` | eco | rebuilt | CES-136 | course | 0.3% / 10 | 0.1% / 9 | - | B |
| `get-wordless-openings-people-watch-to-end` | eco | rebuilt | CES-006 | course | 1.9% / 21 | 0.0% / 0 | CE | B |
| `know-what-each-product-page-photo-should-show` | eco | rebuilt | CES-098, CES-095 | course | 1.4% / 13 | 0.0% / 0 | - | C |
| `sell-one-offer-three-ways-with-image-ads` | eco | rebuilt | CES-077 | course | 2.2% / 19 | 0.3% / 14 | CE | C |
| `stop-ai-pictures-getting-your-product-wrong` | eco | rebuilt | CES-096, CES-049, CES-036, CES-009 | course | 0.2% / 11 | 0.1% / 9 | - | B |
| `get-a-checked-landing-page-for-your-best-ad` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
| `get-an-ad-strangers-read-built-from-reviews` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
| `know-which-ads-to-make-next` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
| `turn-competitor-ads-into-your-own-script` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
| `turn-real-photos-into-a-product-page-gallery` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
| `turn-reviews-into-a-video-ad-ready-to-film` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
| `turn-your-reviews-into-image-ads-buyers-believe` | orch | own | none | n/a | n/a / n/a | 0.0% / 0 | - | A |
