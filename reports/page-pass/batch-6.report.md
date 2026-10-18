# Page pass, batch 6

19 blocks. Each got a new `page.yaml` (with `output_shape` just before `example`) and a plain-language `SKILL.md`. 16 also had `boards/ecommerce.md` rewritten. All examples use Sprout only (`knowledge/example-businesses/sprout/`). Every page.yaml parses with `site/node_modules/yaml`. Example inputs are 9 to 24 lines and outputs 40 to 67 lines.

| Old slug | new_slug | job |
|---|---|---|
| ad-performance-drop-diagnosis | find-why-your-ad-results-dropped | read-ad-results |
| ad-performance-report-decision-brief | turn-ad-results-into-three-next-steps | read-ad-results |
| conversion-metrics-and-test-sizing | read-page-numbers-before-you-test | audit-landing-page |
| creative-coverage-gap-audit | find-what-your-ads-have-not-tried | plan-ad-tests |
| paired-creative-quality-evaluation | check-if-new-prompt-makes-better-ads | set-up-ai |
| storefront-evidence-inspection (ecommerce) | check-a-store-page-from-screenshots | audit-landing-page |
| ai-ugc-video-ad-director | turn-selfie-style-script-into-video-shots | make-video-ads |
| animated-film-ad-script-format-rules | write-3d-animated-film-ad-script | make-video-ads |
| anime-story-ad-script-format-rules | write-anime-video-ad-script | make-video-ads |
| anime-video-ad-director | turn-anime-script-into-video-shots | make-video-ads |
| brand-safe-video-caption-finishing | add-on-brand-captions-to-ad-videos | make-video-ads |
| cgi-explainer-ad-script-format-rules | write-3d-how-it-works-ad-script | make-video-ads |
| cgi-mechanism-explainer-video-ad-director | turn-how-it-works-idea-into-3d-shots | make-video-ads |
| character-consistent-ad-storyboard | storyboard-ad-with-one-consistent-character | make-video-ads |
| cinematic-3d-video-ad-director | turn-3d-animated-script-into-video-shots | make-video-ads |
| cinematic-film-ad-script-format-rules | write-short-film-style-ad-script | make-video-ads |
| cinematic-photoreal-video-ad-director | turn-film-style-script-into-video-shots | make-video-ads |
| clay-town-ad-script-format-rules | write-clay-town-video-ad-script | make-video-ads |
| clay-world-video-ad-director | turn-clay-town-script-into-video-shots | make-video-ads |

## Pairs and examples that chain

The script and shots pairs share one example. Each "turn ... into video shots" example takes the matching script example as its input.
- 3D animated film: write-3d-animated-film-ad-script > turn-3d-animated-script-into-video-shots
- Anime: write-anime-video-ad-script > turn-anime-script-into-video-shots
- Film-style: write-short-film-style-ad-script > turn-film-style-script-into-video-shots
- Clay town: write-clay-town-video-ad-script > turn-clay-town-script-into-video-shots
- The selfie-style shots example feeds the captions example.

## Possible merges or near-duplicates

- **write-3d-how-it-works-ad-script and turn-how-it-works-idea-into-3d-shots** overlap heavily. Both have the same four tests, the same seven-beat table and the same honesty rules. The shots skill adds the chain hunt, the story options, the look, the voice and the prompts. You could merge them, or cut the shots skill back to "take the chosen script and make prompts" like the other pairs.
- **find-why-your-ad-results-dropped and turn-ad-results-into-three-next-steps** share the maths and the rule about keeping first-party and platform revenue apart. They do different jobs (diagnosis against a brief), so keep both, but they could share one formula reference.
- **storyboard-ad-with-one-consistent-character** overlaps with the "fix the character" steps inside each video shots skill. It's still useful as a skill that doesn't depend on any one style.
- The clay town pair needs a clear line on the site against the claymation pair in batch 7 (one tabletop and one character, against a whole world with a crowd). Both SKILL.md files point to each other.

## Unsure about

- **Job for check-if-new-prompt-makes-better-ads.** I filed it under `set-up-ai` because it tests your AI setup, not an ad going live. `check-ads` is the other option.
- **Job for read-page-numbers-before-you-test.** I filed it under `audit-landing-page`. It could also sit under `plan-ad-tests`, since it sizes A/B tests, but those are page tests rather than ad tests.
- **Ad link clicks as visits.** Sprout has no store visit counts, so the conversion example uses ad link clicks as visits and says so. With no dates in the CSV, the days needed for a test are marked MISSING. The test size is given as "3.2 times all the ad clicks in this file" instead.
- **Inputs a real user would supply.** The captions example uses planned clip lengths and says plainly that they're not measured. The selfie-style example uses an approved script I wrote from Sprout facts, with one bad line left in on purpose so the skill sends it back. The paired-evaluation "after" texts are rewrites I made from the brand file. Its "before" texts are the two real main texts in ads.md.
- **Daily pack label words** aren't in the Sprout files. Every video example says MISSING and keeps the pack side-on.
- **Cut for length.** Several video examples end with "(cut for length: ...)" under the PAGE-FORMAT rule. The parts that were cut follow the same pattern as the parts shown.
- SKILL.md for storefront-evidence-inspection keeps its MIT attribution section, and its LICENSE file is untouched.

## Sweep

Outcome copy pass (name, summary, headline, subhead), `test` added after `judge`, `improve` rewritten as "Improve it for your business". SKILL.md frontmatter `name` and H1, and each `boards/ecommerce.md` title, now use the new name. Cross-links between pairs inside this batch use the new names. Links to blocks outside the batch are described by what they do. All 19 examples were already on Sprout with an `output_shape`, so none were re-run. `node tools/lint-pages.mjs` shows no issues for these pages.

| Old slug | Final new_slug | New name |
|---|---|---|
| ad-performance-drop-diagnosis | find-out-why-your-ads-stopped-selling | Find out why your ads stopped selling |
| ad-performance-report-decision-brief | turn-your-ad-numbers-into-three-next-steps | Turn your ad numbers into three next steps |
| conversion-metrics-and-test-sizing | know-if-you-have-enough-visitors-to-test | Know if you have enough visitors to test |
| creative-coverage-gap-audit | get-five-ad-ideas-you-havent-tried-yet | Get five ad ideas you haven't tried yet |
| paired-creative-quality-evaluation | know-if-your-new-prompt-writes-better-ads | Know if your new prompt writes better ads |
| storefront-evidence-inspection | find-what-stops-shoppers-backed-by-screenshots | Find what stops shoppers, backed by screenshots |
| ai-ugc-video-ad-director | turn-your-selfie-style-script-into-consistent-clips | Turn your selfie-style script into consistent clips |
| animated-film-ad-script-format-rules | get-a-warm-animated-film-ad-script | Get a warm animated film ad script |
| anime-story-ad-script-format-rules | get-an-original-anime-ad-script | Get an original anime ad script |
| anime-video-ad-director | turn-your-anime-script-into-consistent-clips | Turn your anime script into consistent clips |
| brand-safe-video-caption-finishing | get-ad-captions-in-your-own-brand-font | Get ad captions in your own brand font |
| cgi-explainer-ad-script-format-rules | get-a-3d-how-it-works-ad-script | Get a 3D how-it-works ad script |
| cgi-mechanism-explainer-video-ad-director | turn-your-products-hidden-process-into-3d-clips | Turn your product's hidden process into 3D clips |
| character-consistent-ad-storyboard | get-a-storyboard-where-your-character-never-changes | Get a storyboard where your character never changes |
| cinematic-3d-video-ad-director | turn-your-animated-film-script-into-consistent-clips | Turn your animated film script into consistent clips |
| cinematic-film-ad-script-format-rules | get-a-short-film-ad-script-with-a-twist | Get a short film ad script with a twist |
| cinematic-photoreal-video-ad-director | turn-your-short-film-script-into-consistent-clips | Turn your short film script into consistent clips |
| clay-town-ad-script-format-rules | get-a-clay-town-ad-script-with-a-crowd | Get a clay town ad script with a crowd |
| clay-world-video-ad-director | turn-your-clay-town-script-into-handmade-looking-clips | Turn your clay town script into handmade-looking clips |

Pairs (script, then shots): animated film, anime, short film and clay town each read "Get a ... ad script" against "Turn your ... script into ... clips". The clay town pair says "with a crowd" and "handmade-looking" to stay apart from the single-character claymation pair in batch 7. The selfie-style shots skill is named apart from the selfie-style script skill in another batch.
