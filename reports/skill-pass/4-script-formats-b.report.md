# Report: 4-script-formats-b

11 source folders, 11 blocks written. Each source folder (SKILL.md plus image.md and video.md) became ONE block with a "video rules" and a "still rules" section, matching the first-half agent's `<format>-ad-script-format-rules` shape. All with `type: skill, role: make, job: video` (static: `job: image`), outputs `script` and/or `image_prompt`.

| old folder | new slug | category | origin | cut % (rough) | note |
|---|---|---|---|---|---|
| script-format-paper | paper-world-ad-script-format-rules | general (+ecommerce board) | rebuilt | 27 | Looks renamed (layered-stack, flat-cutout, torn-and-glued, collage, folded); prompt wording and transitions reworded |
| script-format-podcast | podcast-clip-ad-script-format-rules | general (+ecommerce board) | own | 27 | Speech rules and Host/Guest cast kept; skin-craft link and "pile B" dropped |
| script-format-satisfying | satisfying-motion-ad-script-format-rules | ecommerce | own | 27 | Physical product motion only; no board needed |
| script-format-skeleton | skeleton-ladder-ad-script-format-rules | general (+ecommerce board) | rebuilt | 15 | Question templates, angle examples, skeleton look names and wording all new |
| script-format-song | song-ad-script-format-rules | general (+ecommerce board) | rebuilt | -17 | Video only. Genre table regrouped (added B2B row); new example (invoicing app). Longer because the source was thin on steps; I made them explicit |
| script-format-static | single-static-image-ad-script-format-rules | general (+ecommerce board) | own | -12 | Source was already tight; added Output/Checks sections so it is runnable |
| script-format-talking-object | talking-object-ad-script-format-rules | general (+ecommerce board) | own | 18 | Object table, 5 tests, 5 tones kept |
| script-format-ugc | ugc-selfie-ad-script-format-rules | general (+ecommerce board) | own | 13 | Added "disclose AI use where the platform requires" for the generated presenter |
| script-format-vsl | long-narrated-video-ad-script-format-rules | general (+ecommerce board) | own | -1 | Beat-by-length table and loops kept whole; level set to advanced |
| script-format-watercolor | watercolor-painted-ad-script-format-rules | general (+ecommerce board) | rebuilt | 14 | Looks renamed (cosy-scene, specimen, mood-wash, line-and-wash, pack-portrait); new move examples; style lock reworded |
| script-format-wool | knitted-wool-ad-script-format-rules | general (+ecommerce board) | rebuilt | 17 | New examples and prompt wording; "name every noun as knitted" rule kept |

The cut % is low or negative because two source files (video + image) were merged and each block gained Output, Checks and If-missing sections the source lacked. Duplicated rules were removed, but little was cut beyond that.

Paths: `catalogue-items\general\<slug>\` (SKILL.md, item.yaml, boards\ecommerce.md) and `catalogue-items\ecommerce\satisfying-motion-ad-script-format-rules\` (SKILL.md, item.yaml). `example:` set for all except the long narrated video (no matching picture id).

## New port types
None. Used `brief`, `brand_brain`, `voc_reviews`, `script`, `image_prompt`, `ad_copy`, `product_data`, `persona` from `_types.yaml`.

## Doubts
- Rights: five blocks are `rebuilt` (paper, skeleton, song, watercolor, wool). I renamed looks and examples and reworded prompt locks, but the method (steps, rule order) follows the source. Kevin may want a second pass on paper transitions and the watercolor/wool prompt wording to be sure they are far enough from the course text.
- Satisfying is `ecommerce` because it needs a product with a visible physical motion. If a digital version (UI motion) is wanted, it would need a separate general block.
- One block per format merges video and still. If the site needs separate image-only and video-only cards, each SKILL.md splits cleanly at "Video rules" / "Still rules".
- I set `brand_brain: required: true` to match the first-half agent's items, but the SKILL.md lists the facts as separate inputs, so it also runs from pasted facts alone.
- Song: the genre-by-audience table is generic knowledge but still derived from the source; the added B2B row is mine. Music rights for generated tracks are flagged only in the ecommerce board.
