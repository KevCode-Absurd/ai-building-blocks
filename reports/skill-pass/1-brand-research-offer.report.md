# Family 1: brand, research, offer. Report

20 blocks written under `catalogue-items\general\` (all 17 source folders processed). 14 have a `boards\ecommerce.md` add-on and `boards: [ecommerce]`. None went to `ecommerce\` (every method works for any business; store detail lives in the add-ons). No `example:` set (no example picture clearly matched).

| old folder | new slug(s) | category | origin | cut % (rough, words) | note |
|---|---|---|---|---|---|
| brand-brain (CES-010) | brand-knowledge-folder-from-website | general + ecommerce board | rebuilt | ~85 | Dropped scrape scripts, tool-detection steps, long file templates (kept as a field table). Board holds photo jobs, product camera record, policies, store data |
| brand-guide (CES-011) | printable-brand-guide-from-brand-brain | general + ecommerce board | rebuilt | ~65 | Product-on-camera and world/motion pages moved to the board |
| brand-voice-check (CES-012) | ad-copy-brand-voice-check | general | own | ~40 | Merged CARD into SKILL |
| founder-interview (CES-040) | founder-interview-to-fill-brand-gaps | general + ecommerce board | own | ~50 | Question ids dropped; questionnaire folded into the SKILL; product, photo and used-up/bought-once questions in the board |
| review-mining (CES-103) | customer-language-to-angle-library | general + ecommerce board | rebuilt | ~45 | Own taxonomy (ten story roles replace the 12 jobs), own thresholds and rule wording |
| buyer-stage (CES-015) | buyer-readiness-stage-ad-briefs | general + ecommerce board | rebuilt | ~0 | Source was already tiny (11 files). Stages and argument styles renamed and reworded; one file instead of eleven |
| buyer-led-selling (CES-014) | buyer-led-selling-fact-to-appeal | general | own | ~30 | Four references merged into steps; transcript/source history removed. type prompt |
| offer-building (CES-078) | offer-design-from-buyer-doubts | general + ecommerce board | rebuilt | ~55 | Skipped industries.json and research/gaming.json (third-party data). Margin sums use new illustrative figures labelled as such |
| offer-set (CES-079) | starter-offer-list-from-brand-facts | general + ecommerce board | own | ~0 (already tight) | type prompt; uses offer-design block |
| strategic-audit (CES-140) | creative-coverage-gap-audit | general + ecommerce board | rebuilt | ~80 | Also absorbs operator-performance `creative-diversity` (same job). Own motive and opening-type lists. Category playbooks and cross-brand "winners" not carried over |
| creative-lessons (CES-025) | creative-mistakes-register | general + ecommerce board | own | ~10 | Ten general lessons kept (three reworded to hold for non-physical subjects); product-use examples in the board |
| taste (CES-142) | creative-direction-lever-snippets | general | own | ~30 | 35 snippet files merged into one prompt block; app lever table removed |
| production-principles (CES-099) | ai-visual-production-checklist | general + ecommerce board | rebuilt | ~60 | Built from SKILL.md only; models.md and the 20 sub-references (skin detail, camera shots, hands, etc.) not carried over |
| cro-brain (CES-028) | page-conversion-review-in-buyer-order | general + ecommerce board | rebuilt | ~65 | Original only copies a 56 KB file; rebuilt as a runnable review skill. Dropped the 380-brand swipe library and brand-named examples |
| ad-principles (CES-002) | ad-writing-principles-plain-spoken | general | own | ~35 | Five format notes folded in |
| operator-systems (CES-091) | stage-context-packet-design | general | rebuilt | ~25 | |
| operator-systems + operator-performance (paired evaluation) | paired-creative-quality-evaluation | general | rebuilt | n/a (merge) | Two source files did the same job; one block |
| operator-performance (CES-090): performance-triage + measurement | ad-performance-drop-diagnosis | general + ecommerce board | rebuilt | n/a (merge) | Measurement stage merged in as step 2 |
| operator-performance: google-diagnostics | google-ads-export-review-by-module | general + ecommerce board | rebuilt | n/a | Shopping/feed module moved to the ecommerce board |
| operator-performance: reporting | ad-performance-report-decision-brief | general + ecommerce board | rebuilt | n/a | |

Note: the three operator-performance and operator-systems rebuilds total more words than the sources because the required sections (Checks, If something is missing, Avoid) are added to dense source paragraphs.

## New port types
- `web_page`: a public web page or site address to read.
- `brand_guide`: a printable brand guide (HTML) plus a copy-paste tokens file.
- `angle_library`: ranked customer-phrase angles, each with a verbatim quote, source ID, role and distinct-source count.
- `feedback_notes`: a person's words about what is wrong with a finished piece.
- `lessons_register`: general or brand-level creative lessons, each a one-line rule with its reason and what it applies to.

## Doubts
- **cro-brain** became a general page review with a large ecommerce add-on. If another family also writes a store CRO audit, the two overlap; Kevin may want one of them to be an ecommerce block.
- **Rebuilt blocks still follow course structure** (five readiness stages plus five argument styles; seven offer failures; the audit's ten sections). Names and sentences are new, and the review-mining taxonomy was reworked, but a stricter reader may want these further from the originals.
- **Not carried over:** the 380-brand swipe library, offer industries.json and research, production-principles sub-references and models.md. Any of them could become its own block (camera-shot coverage and AI-person realism are the most separable).
- **Roles for rule-only blocks:** production checklist, ad-writing principles and lever snippets are `make`; Kevin may prefer `check` for the checklist.
- **Brand-brain file names** (brand-guidelines.md, products-and-positioning.md, customer-avatars.md and so on) are kept identical across blocks so they connect; if the platform renames the brand brain format, all 20 blocks need the same rename.
