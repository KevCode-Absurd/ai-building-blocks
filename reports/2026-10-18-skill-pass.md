# Skill pass, 18 Oct 2026

Every Creative Engine skill folder (139, read-only; the 14 loose .docx notes and the third-party "Winning Ad Examples" folder were left out) was renamed, tightened and split into building blocks by eight sub-agents, one per family, following `docs/PRD.md` §4.

## Result

| | Count |
|---|---:|
| Blocks | **166** (152 general, 14 ecommerce) |
| General blocks with an ecommerce add-on (`boards/ecommerce.md`) | 119 |
| Ready-made workflows (orchestrators) | 7 |
| Written as our own, tightened | 63 |
| Rebuilt from course material in our own words, new names and examples (`origin: rebuilt`) | 103 |
| New port types added to `_types.yaml` | 25 |

**By role:** make 65 · render 51 · check 20 · digest 8 · orchestrate 5 (+7 workflows) · source 5.

**Merged:** five-reasons-lp + five-reasons-lp-pro; image-ad-copy + image-ad-copywriter; video-ad-copywriter + video-ad-scripts; each script format's video and still parts; advertorial-v1 with the landing-pages advertorial rules. **Split:** native-ad-types into 21 blocks, operator-creative into its stage cards, copy-craft into 10, landing-pages into 5, operator-performance into 4. **Not carried over:** gpt-image-ads (retired in the source), the 380-brand swipe library, offer-industry data, the CGI explainer's media files and the motion-reel render engine.

Credits for the four blocks adapted from openly licensed skills are in `NOTICE.md`, with the licence beside each block.

## Decisions for Kevin

Rights (most important):
1. **Course structure.** The 103 rebuilt blocks use new wording, names and examples, but several keep a recognisable course *structure*: the 12 gallery frames, 15 static ad families, five readiness stages, seven offer failures, the paper-world and clay-world move tables. Do you want a second pass to change the structures too, or is new wording on a known method enough?
2. **Five script-format cards** (anime story, animated film, clay town, cutout argument, product graphic) were marked course-derived in the inventory, but the agent thought they read like our own writing. And the 9-beat script playbook is marked `own`; if it came from a course it should be `rebuilt`. Please confirm where these came from.

Shape of the library:
3. Fold the three small copy checks (edit pass, machine-sounding tells, final sweep) into one block?
4. Keep both `video-ad-script-nine-beat-playbook` and `video-ad-script-from-customer-research`, which overlap?
5. Merge `problem-first-static-ad-concept` into `cold-audience-concept-static-ads` (the source says the second replaces the first)?
6. `sale-offer-static-ad-set` and `satisfying-motion-ad-script-format-rules` are ecommerce-only. Make general versions (SaaS promos, UI motion)?
7. `reasons-why-landing-page-copy` takes any count (default 5). Keep that name, or `five-reasons-landing-page-copy`?

Safety and accuracy:
8. Four native image types (news bulletin, test-result photo, one-star review card, group chat) need a human review before running. The rule is in each block's Output; should `item.yaml` get a `needs_review: true` field the site shows as a badge?
9. The three AI-presenter video blocks now say to label AI-generated content as the platform requires, and drop "a stranger takes it for a real phone video" as a pass test. Confirm.
10. The native setup sheet's ecommerce add-on keeps test figures (cost per thousand views, click rates) labelled illustrative. Under "real numbers or none", drop them?
11. The Meta policy check is dated October 2026 and will go stale. Add a quarterly refresh routine?

## Old name to new block

The full table (166 rows) follows.

| Old name | New block | Category | Role | Origin |
|---|---|---|---|---|
| abstract-curiosity | native-ad-image-abstract-curiosity | general + ecommerce add-on | render | own |
| ad-compliance | meta-ad-policy-check | general + ecommerce add-on | check | own |
| ad-principles | ad-writing-principles-plain-spoken | general | make | own |
| ad-reference-exact | same-ad-new-format-remake | general + ecommerce add-on | render | own |
| ad-script-principles | video-ad-script-principles-reference | general | make | own |
| advertorial-v1 | advertorial-landing-page-copy | general + ecommerce add-on | make | rebuilt |
| ai-satisfying-hooks | wordless-satisfying-hook-video-ad-director | ecommerce | render | rebuilt |
| ai-ugc-hooks | talking-presenter-hook-video-ad-director | general + ecommerce add-on | render | rebuilt |
| anime-comic-animation | anime-video-ad-director | general + ecommerce add-on | render | rebuilt |
| annotated-photo | native-ad-image-marked-up-photo | general + ecommerce add-on | render | rebuilt |
| asset-generator-cmo | base-product-photos-from-reference | ecommerce | render | rebuilt |
| brand-brain | brand-knowledge-folder-from-website | general + ecommerce add-on | source | rebuilt |
| brand-guide | printable-brand-guide-from-brand-brain | general + ecommerce add-on | make | rebuilt |
| brand-voice-check | ad-copy-brand-voice-check | general | check | own |
| breaking-news | native-ad-image-news-bulletin | general + ecommerce add-on | render | own |
| brief-v2 | creative-brief-three-concepts-nine-variants | general + ecommerce add-on | make | rebuilt |
| buyer-led-selling | buyer-led-selling-fact-to-appeal | general | make | own |
| buyer-stage | buyer-readiness-stage-ad-briefs | general + ecommerce add-on | make | rebuilt |
| candid-moment | native-ad-image-candid-moment | general + ecommerce add-on | render | own |
| cinematic-3d-animation | cinematic-3d-video-ad-director | general + ecommerce add-on | render | rebuilt |
| cinematic-ad-directing | cinematic-photoreal-video-ad-director | general + ecommerce add-on | render | rebuilt |
| claymation-ads | claymation-mechanism-video-ad-director | general + ecommerce add-on | render | rebuilt |
| claymation-animation | clay-world-video-ad-director | general + ecommerce add-on | render | rebuilt |
| clone-from-screenshot | landing-page-layout-from-reference | general + ecommerce add-on | make | rebuilt |
| comic-book-ad | comic-page-desk-video-ad-director | general + ecommerce add-on | render | rebuilt |
| copy-craft | buyer-read-before-writing-copy | general | compress | rebuilt |
| copy-craft | copy-draft-edit-and-repair-pass | general | check | rebuilt |
| copy-craft | copy-final-sweep-fifteen-questions | general | check | rebuilt |
| copy-craft | headline-and-image-words-writer | general | make | rebuilt |
| copy-craft | long-story-copy-for-cold-buyers | general | make | rebuilt |
| copy-craft | machine-sounding-copy-tells-check | general | check | rebuilt |
| copy-craft | persuasive-body-copy-with-proof-and-close | general + ecommerce add-on | make | rebuilt |
| copy-craft | sales-opening-picker-six-leads | general | make | rebuilt |
| copy-craft | scroll-stopping-hook-writer-and-grader | general | make | rebuilt |
| copy-craft | selling-points-list-writer | general + ecommerce add-on | make | rebuilt |
| copy-floor | plain-copy-priority-order | general | make | own |
| copy-principles | ad-copy-sell-pass | general + ecommerce add-on | check | own |
| creative-lessons | creative-mistakes-register | general + ecommerce add-on | check | own |
| creative-qa | pre-launch-ad-creative-checklist | general + ecommerce add-on | check | rebuilt |
| cro-audit | landing-page-cro-audit | general + ecommerce add-on | check | rebuilt |
| cro-brain | page-conversion-review-in-buyer-order | general + ecommerce add-on | check | rebuilt |
| curiosity-object | native-ad-image-problem-leftover | general + ecommerce add-on | render | rebuilt |
| dont-buy-this | native-ad-image-dont-buy-this | general + ecommerce add-on | render | own |
| ecommerce-funnel-inspection | storefront-evidence-inspection | ecommerce | source | own |
| ecommerce-motion-finishing | video-ad-text-overlay-planner | general + ecommerce add-on | make | own |
| ecommerce-page-design | landing-page-design-direction | general + ecommerce add-on | make | own |
| ecommerce-video-editing | video-ad-edit-plan-from-footage | general + ecommerce add-on | make | own |
| editorial-collage-animation | collage-explainer-video-ad-director | general + ecommerce add-on | render | rebuilt |
| emotional-scene | native-ad-image-room-that-changed | general + ecommerce add-on | render | rebuilt |
| five-reasons-lp + five-reasons-lp-pro | reasons-why-landing-page-copy | general + ecommerce add-on | make | rebuilt |
| flash-photography | candid-flash-lifestyle-photo-set | ecommerce | render | rebuilt |
| foreplay-ad-board | competitor-ad-swipe-board | general + ecommerce add-on | compress | rebuilt |
| foreplay-creative-strategy | competitor-ad-teardown-brief | general + ecommerce add-on | compress | rebuilt |
| format-library | static-ad-format-families | general | make | rebuilt |
| founder-interview | founder-interview-to-fill-brand-gaps | general + ecommerce add-on | source | own |
| generate-50 | fifty-static-ad-test-sprint | general + ecommerce add-on | orchestrate | rebuilt |
| handwritten-note | native-ad-image-handwritten-note | general + ecommerce add-on | render | own |
| hook-bank | ad-hook-opener-shape-bank | general | source | rebuilt |
| hook-headline-photo | native-ad-image-article-headline-photo | general + ecommerce add-on | render | rebuilt |
| illustration-chronicle | native-ad-image-drawn-panels | general + ecommerce add-on | render | rebuilt |
| image-ad-copy; image-ad-copywriter | carousel-ad-copy-card-by-card | general + ecommerce add-on | make | own |
| image-ad-copy; image-ad-copywriter | static-ad-copy-and-layout-planner | general + ecommerce add-on | make | own |
| image-prompt-craft | image-prompt-from-approved-plan | general + ecommerce add-on | render | own |
| image-upscaling | upscale-approved-image-with-checks | general | render | rebuilt |
| indirect-ads | cold-traffic-native-story-ad-writer | general + ecommerce add-on | make | rebuilt |
| instant-photoshoot | one-colour-world-product-photo-set | ecommerce | render | rebuilt |
| landing-pages | conversion-metrics-and-test-sizing | general + ecommerce add-on | check | own |
| landing-pages | landing-page-copy-from-ad-and-facts | general + ecommerce add-on | make | own |
| landing-pages | landing-page-quick-checklist-review | general + ecommerce add-on | check | own |
| landing-pages | page-objection-answer-map | general + ecommerce add-on | compress | own |
| medical-imaging | native-ad-image-test-result-photo | general + ecommerce add-on | render | rebuilt |
| motion-graphics-animation | motion-graphics-video-ad-director | general + ecommerce add-on | render | rebuilt |
| motion-reel | code-rendered-product-offer-reel | general + ecommerce add-on | render | own |
| native-ad-copy | native-story-ad-copy-long-form | general + ecommerce add-on | make | own |
| native-ad-creative | native-ad-image-brief-writer | general + ecommerce add-on | orchestrate | own |
| native-ads | native-story-ad-setup-sheet | general + ecommerce add-on | compress | own |
| nightmare-scenario | native-ad-image-feared-next-step | general + ecommerce add-on | render | rebuilt |
| notes-app | native-ad-image-phone-notes-screenshot | general + ecommerce add-on | render | own |
| offer-ad-bank | sale-offer-static-ad-set | ecommerce | make | rebuilt |
| offer-building | offer-design-from-buyer-doubts | general + ecommerce add-on | make | rebuilt |
| offer-set | starter-offer-list-from-brand-facts | general + ecommerce add-on | make | own |
| one-star-review | native-ad-image-one-star-review-card | general + ecommerce add-on | render | own |
| operator-creative/avatar-storyboard | character-consistent-ad-storyboard | general | render | rebuilt |
| operator-creative/brand | brand-evidence-records-for-creative | general | compress | rebuilt |
| operator-creative/concept | ad-concept-grid-planner | general | compress | rebuilt |
| operator-creative/image-prompt | static-ad-image-prompt-compiler | general + ecommerce add-on | render | rebuilt |
| operator-creative/review | static-ad-and-storyboard-review | general + ecommerce add-on | check | rebuilt |
| operator-creative/static-copy | static-ad-copy-from-visual-and-awareness | general | make | rebuilt |
| operator-creative/static-plan | static-ad-archetype-and-layout-planner | general | make | rebuilt |
| operator-creative/static-template-process | static-template-slot-contract | general | make | rebuilt |
| operator-creative/video-editing | brand-safe-video-caption-finishing | general | render | rebuilt |
| operator-performance (google-diagnostics) | google-ads-export-review-by-module | general + ecommerce add-on | check | rebuilt |
| operator-performance (performance-triage, measurement) | ad-performance-drop-diagnosis | general + ecommerce add-on | check | rebuilt |
| operator-performance (reporting) | ad-performance-report-decision-brief | general + ecommerce add-on | compress | rebuilt |
| operator-systems | stage-context-packet-design | general | orchestrate | rebuilt |
| operator-systems / operator-performance (paired evaluation) | paired-creative-quality-evaluation | general | check | rebuilt |
| organic-content | creator-product-seeding-plan | general + ecommerce add-on | make | rebuilt |
| organic-content | founder-video-series-plan | general + ecommerce add-on | make | rebuilt |
| organic-video-editing | organic-video-edit-plan-from-footage | general | make | own |
| paper-animation | paper-world-video-ad-director | general + ecommerce add-on | render | rebuilt |
| PDP Image Factory | pdp-gallery-image-set-workflow | ecommerce | orchestrate | rebuilt |
| pdp-image-factory/07-qa | pdp-gallery-image-check | ecommerce | check | rebuilt |
| phone-reminder | native-ad-image-phone-reminders-screenshot | general + ecommerce add-on | render | own |
| Photoshoot Factory | product-photoshoot-set-workflow | ecommerce | orchestrate | rebuilt |
| photoshoot-factory/01-product-assets | product-truth-sheet-from-photos | ecommerce | source | rebuilt |
| podcast-ad | podcast-clip-video-ad-director | general + ecommerce add-on | render | rebuilt |
| product-image-templates | pdp-gallery-12-frame-plan | ecommerce | make | rebuilt |
| production-principles | ai-visual-production-checklist | general + ecommerce add-on | make | rebuilt |
| realistic-ai-ugc | ai-ugc-video-ad-director | general + ecommerce add-on | render | rebuilt |
| recreate-winning-ads | winning-ad-style-to-new-ad-concepts | general + ecommerce add-on | make | rebuilt |
| review-ads | buyer-quote-static-ads | general + ecommerce add-on | make | rebuilt |
| review-mining | customer-language-to-angle-library | general + ecommerce add-on | compress | rebuilt |
| script-format-advertorial | advertorial-static-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-anime | anime-story-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-carousel | swipe-carousel-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-cinematic | cinematic-film-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-cinematic-3d | animated-film-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-clay-world | clay-town-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-claymation | claymation-story-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-collage | cutout-argument-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-comic | comic-page-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-explainer | cgi-explainer-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-founder | founder-decision-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-long-copy-static | long-copy-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-motion-graphics | product-graphic-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-paper | paper-world-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-podcast | podcast-clip-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-satisfying | satisfying-motion-ad-script-format-rules | ecommerce | make | own |
| script-format-skeleton | skeleton-ladder-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-song | song-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-static | single-static-image-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-talking-object | talking-object-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-ugc | ugc-selfie-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-vsl | long-narrated-video-ad-script-format-rules | general + ecommerce add-on | make | own |
| script-format-watercolor | watercolor-painted-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-format-wool | knitted-wool-ad-script-format-rules | general + ecommerce add-on | make | rebuilt |
| script-from-research | video-ad-script-from-customer-research | general + ecommerce add-on | make | own |
| script-reference-principles | script-from-reference-idea | general | make | own |
| script-reference-structure | reference-ad-structure-script-rewrite | general | make | own |
| script-surfaces | script-format-fit-advisor | general | check | own |
| script-transpose | script-voice-variant-converter | general | make | own |
| script-types | video-script-type-library | general + ecommerce add-on | make | own |
| script-voice-pass | read-aloud-script-polish | general | check | own |
| scroll-stopper-static-ads | problem-first-static-ad-concept | general + ecommerce add-on | make | rebuilt |
| shopify-liquid-themes | shopify-landing-page-theme-export | ecommerce | make | rebuilt |
| shopify-liquid-themes | shopify-liquid-theme-reference | ecommerce | make | rebuilt |
| skeleton-ads | skeleton-what-happens-if-video-ad-director | general + ecommerce add-on | render | rebuilt |
| song-style-ad | song-music-video-ad-director | general + ecommerce add-on | render | rebuilt |
| Static Ad Factory | static-ad-layout-adaptation-workflow | general + ecommerce add-on | orchestrate | rebuilt |
| sticky-note | native-ad-image-sticky-note-photo | general + ecommerce add-on | render | own |
| strategic-audit | creative-coverage-gap-audit | general + ecommerce add-on | check | rebuilt |
| symptom-closeup | native-ad-image-symptom-in-routine | general + ecommerce add-on | render | rebuilt |
| talking-object-ad | talking-object-video-ad-director | general + ecommerce add-on | render | rebuilt |
| taste | creative-direction-lever-snippets | general | make | own |
| text-bubbles | native-ad-image-two-person-text-thread | general + ecommerce add-on | render | own |
| tof-statics | cold-audience-concept-static-ads | general + ecommerce add-on | orchestrate | rebuilt |
| ugc-script | ugc-creator-filming-brief | general | make | rebuilt |
| ugc-script | ugc-video-script-writer | general + ecommerce add-on | make | rebuilt |
| video-ad-copywriter; video-ad-scripts | video-ad-script-nine-beat-playbook | general + ecommerce add-on | make | own |
| video-director | video-ad-shot-list-director | general + ecommerce add-on | render | own |
| watercolor-animation | watercolor-video-ad-director | general + ecommerce add-on | render | rebuilt |
| whatsapp-chat | native-ad-image-group-chat-screenshot | general + ecommerce add-on | render | own |
| wide-face-portrait | overhead-close-portrait-image-prompt | general + ecommerce add-on | render | rebuilt |
| wool-crochet-animation | knitted-wool-video-ad-director | general + ecommerce add-on | render | rebuilt |
| worn-object | native-ad-image-worn-object-photo | general + ecommerce add-on | render | own |
| zack-d-films-ads | cgi-mechanism-explainer-video-ad-director | general + ecommerce add-on | render | rebuilt |