# Family 3-script-formats-a: report

13 source folders, 13 blocks written, all in `catalogue-items\general\` (each with `boards\ecommerce.md`). No folder name clashed. Slug pattern `<format>-ad-script-format-rules`, matching family 4's pattern.

Shape used on every card: frontmatter, one-line "what you get", Inputs (Script or concept, Brand facts, Run settings), Steps (step 1 is always "Check the fit"; video and still variants are marked "skip for a still / skip for a video"), Output, Checks, If something is missing, Avoid. Video and still parts (the old `video.md` and `image.md`) are merged into one card per format.

| old folder | new slug | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| script-format-advertorial | advertorial-static-ad-script-format-rules | general (+ecommerce) | own | ~5% | Already tight; mainly reshaped into the standard sections. Job `copy`. |
| script-format-anime | anime-story-ad-script-format-rules | general (+ecommerce) | rebuilt | ~35% | Own style list (5 looks), device table with new examples, still and video merged. |
| script-format-carousel | swipe-carousel-ad-script-format-rules | general (+ecommerce) | own | ~25% | Dropped the MIT credit sentence about the Creator OS starter. |
| script-format-cinematic | cinematic-film-ad-script-format-rules | general (+ecommerce) | own | ~0% (grew ~25%) | Source was already dense. Added a fit step and numbered steps, no new rules. |
| script-format-cinematic-3d | animated-film-ad-script-format-rules | general (+ecommerce) | rebuilt | ~38% | New name. Style and character prompt wording rewritten; the three transition types renamed in plain words. |
| script-format-clay-world | clay-town-ad-script-format-rules | general (+ecommerce) | rebuilt | ~36% | New name. Own 4 looks (crafted, lumpy, soft, felt puppet). Points to claymation card for the one-set version. |
| script-format-claymation | claymation-story-ad-script-format-rules | general (+ecommerce) | own | ~38% | Video and still merged. |
| script-format-collage | cutout-argument-ad-script-format-rules | general (+ecommerce) | rebuilt | ~34% | New name, deliberately not "paper-world" (family 4 has a `paper-world` card). |
| script-format-comic | comic-page-ad-script-format-rules | general (+ecommerce) | own | ~35% | Dropped the duplicate "type, the look's own / brand's" alternatives; kept one lettering rule. |
| script-format-explainer | cgi-explainer-ad-script-format-rules | general (+ecommerce) | own | ~35% | Kept the four tests and the seven-beat table. Removed the script-check app reference. |
| script-format-founder | founder-decision-ad-script-format-rules | general (+ecommerce) | own | ~42% | Renamed because it covers a still as well as a to-camera brief. Removed the internal hook-bank reference. |
| script-format-long-copy-static | long-copy-ad-script-format-rules | general (+ecommerce) | own | ~5% | Already tight. Slug shortened to stay near six words. Job `copy`. |
| script-format-motion-graphics | product-graphic-ad-script-format-rules | general (+ecommerce) | rebuilt | ~33% | New name. Own wording for the design-system step, chart honesty rules and still prompt. |

No format was made ecommerce-only: every one works for software, services or creators if "product" means the thing sold. Each ecommerce add-on is short (extra inputs, store examples, offer/proof wording).

## New port types
None. Used `brief`, `brand_brain`, `landing_page` (advertorial only) for inputs and `script`, `ad_copy`, `image_prompt` for outputs.

## Doubts
- Rebuilt cards (anime, animated-film, clay-town, cutout-argument, product-graphic) keep the source method closely, because the method is the useful part. The source text read like Creative Engine's own prose, so please confirm these five really are course-derived. If they are, reread them once against the course.
- Hard numbers (8-word headline, 20 words in all, 12 words per carousel card, 5-word comic captions) are kept as output rules. Some may come from the course. If so, loosen them or accept them as our own defaults.
- Founder card and cinematic card carry the "never generate a real person's likeness" rule. This matches RULES.md 9; no change needed, but it limits stills to a real photo or a note.
- Carousel source credited MIT-licensed Creator OS Starter for its QA techniques. I removed the sentence and rewrote the idea in plain steps. Restore a credit line if you want one.
- The cinematic live-action card barely shrank; the rules are all output-changing. Cut further only if you want a shorter card at the cost of some detail.
