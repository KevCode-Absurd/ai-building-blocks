# Family 7-video report

24 source folders in, 24 blocks out (23 general with a `boards/ecommerce.md` add-on except one noted, 1 ecommerce). All under `catalogue-items\general\` or `catalogue-items\ecommerce\`. Style directors share one shape and the slug pattern `<style>-video-ad-director`.

| old folder | new slug | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| video-director | video-ad-shot-list-director | general (+ecommerce) | own | 70 | history, sources, app file paths removed; all numbered rules and the pace table kept |
| anime-comic-animation | anime-video-ad-director | general (+ecommerce) | rebuilt | 40 | looks renamed; continuity and scene-prompt refs folded in |
| cinematic-3d-animation | cinematic-3d-video-ad-director | general (+ecommerce) | rebuilt | 45 | three fixed blocks rewritten in own words |
| cinematic-ad-directing | cinematic-photoreal-video-ad-director | general (+ecommerce) | rebuilt | 45 | scene-prompts reference folded in |
| claymation-ads | claymation-mechanism-video-ad-director | general (+ecommerce) | rebuilt | 40 | one character, one tabletop, one changing object; new examples |
| claymation-animation | clay-world-video-ad-director | general (+ecommerce) | rebuilt | 45 | four looks renamed (refined, playful, minimal, puppet) |
| comic-book-ad | comic-page-desk-video-ad-director | general (+ecommerce) | rebuilt | 50 | worked-example reference dropped; new example in add-on |
| editorial-collage-animation | collage-explainer-video-ad-director | general (+ecommerce) | rebuilt | 40 | publication-style references removed |
| motion-graphics-animation | motion-graphics-video-ad-director | general (+ecommerce) | rebuilt | 45 | |
| paper-animation | paper-world-video-ad-director | general (+ecommerce) | rebuilt | 40 | five looks kept, wording new |
| podcast-ad | podcast-clip-video-ad-director | general (+ecommerce) | rebuilt | 55 | merged SKILL + naturalization + editing recipe; skin/makeup/piercing prose cut to two lines |
| realistic-ai-ugc | ai-ugc-video-ad-director | general (+ecommerce) | rebuilt | 70 | 28 KB source; skin/hands/accessory sub-guides cut to the rules that change output; "label as AI" added |
| skeleton-ads | skeleton-what-happens-if-video-ad-director | general (+ecommerce) | rebuilt | 40 | |
| song-style-ad | song-music-video-ad-director | general (+ecommerce) | rebuilt | 35 | level expert (music tool) |
| talking-object-ad | talking-object-video-ad-director | general (+ecommerce) | rebuilt | 40 | evals.json not ported |
| watercolor-animation | watercolor-video-ad-director | general (+ecommerce) | rebuilt | 35 | |
| wool-crochet-animation | knitted-wool-video-ad-director | general (+ecommerce) | rebuilt | 40 | |
| zack-d-films-ads | cgi-mechanism-explainer-video-ad-director | general (+ecommerce) | rebuilt | 50 | creator name removed everywhere; beats renamed; scripts, font, wav, mp4 and contact sheets NOT copied; voice rule kept (own/hired/licensed voice only) |
| ai-satisfying-hooks | wordless-satisfying-hook-video-ad-director | ecommerce | rebuilt | 55 | all five reference files folded in; ecommerce because every mechanic is a physical product motion |
| ai-ugc-hooks | talking-presenter-hook-video-ad-director | general (+ecommerce) | rebuilt | 50 | levers renamed and lines rewritten |
| ecommerce-motion-finishing | video-ad-text-overlay-planner | general (+ecommerce) | own | 45 | app renderer notes (kit-adaptation) and field names dropped |
| ecommerce-video-editing | video-ad-edit-plan-from-footage | general (+ecommerce) | own | 40 | "In Creative Engine" paragraph removed |
| organic-video-editing | organic-video-edit-plan-from-footage | general (no add-on needed) | own | 40 | sister of the ad editor, kept separate (different job) |
| motion-reel | code-rendered-product-offer-reel | general (+ecommerce) | own | 65 | type workflow; method only, 12 engine scripts and templates not copied |

Merges: none of the 24 were merged. claymation-ads and claymation-animation stay as two blocks (single character plus changing object, vs a cast in a clay world).

## New port types
- `shot_list`: timed shots with size, camera position, move, action and voice line, ready for a video model.
- `video_prompt`: render-ready clip prompts (with references and timed beats) for a video model; sits beside the existing `image_prompt`.
- `footage`: source video clips supplied by the user, with durations and any speech.
- `edit_plan`: a timed list of cuts, overlays, captions and audio choices to apply in an editor.

## Doubts
- Rebuilt style directors keep the course methods (look choices, motion-lock idea, transition families, hook levers, seven explainer beats). Names, sentences and examples are new, but the paper-world move table and transition list and the clay-world four looks follow the source structure closely. Kevin may want a rights check on those two.
- ai-ugc-video-ad-director and the podcast/talking-presenter blocks use fictional AI presenters. I added "label AI-generated content as the platform requires" and removed "stranger takes it for a real phone video" as a pass test, to respect RULES §9 (no hiding AI use). Confirm that wording.
- Script-format `uses:` links point to other agents' current slugs (for example `anime-story-ad-script-format-rules`); they may be renamed. video-ad-shot-list-director and the style directors do not yet `uses:`-link each other beyond a few cases.
- Dropped assets: Zack's reference ad mp4, voice samples, font and Python helpers; motion-reel's engine, scripts and templates; talking-object evals. If Kevin wants the reel engine shipped, it needs a separate `tools/` decision. ecommerce-video-editing and organic-video-editing credit an MIT-licensed upstream; I did not carry the licence file or credit line.
- video-ad-shot-list-director pace numbers (3.6 down to 2.8 words a second, shot counts) are the owner's starting values, labelled as such, not measured.
