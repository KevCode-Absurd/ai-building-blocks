---
name: base-product-photos-from-reference
description: Use when a brand has only a few pack shots and needs more product photographs, wordless and ready to build ads, pages or emails on, by copying a reference photo's camera and light onto the real product.
---

# Base Product Photos From a Reference

Photographs of the real product in a believable scene, with no words, no logo and no finished ad, each with one named job and a quiet area where words can be added later.

## Inputs
- **Product and variant** (required), with its real photos.
- **Reference photograph** (required unless using a treatment or placement): from a reference library, one of the brand's own ads that worked, or a photo you supply.
- **Job and use** (required): hero, in use, texture, a place; and where it will be used.
- **Brand look** (optional): palette, world, never-show list.
- **Sizes** (optional).

## Steps
1. Run `product-truth-sheet-from-photos`. Note the kind of product (worn, applied, eaten or drunk, used by hand, placed in a room, pet).
2. Read the reference in six parts and fill every line; a blank is a line the model will invent.
   - Camera: lens feel (wide, normal, short tele, long, macro), depth of focus, angle, distance, shape.
   - Light: kind (window, soft studio, overhead diffused, hard directional, flash, low sun), direction, soft or hard, warm or cool, shadows.
   - Depth: what is sharp, what is in front and behind and whether blurred, how many layers.
   - Place: setting, surface, background, each prop, whether the place fills the frame.
   - Colour: main colours, contrast, saturation, mood.
   - Composition: where the subject sits, how much of the frame it fills, where the empty space is, still or moving.
   Take these six things only. Never the reference's product, brand, words, logo or people. Do not fetch another brand's ad from an outside service to copy it.
3. Carry it over by answering in writing: the job and place of use; which variant stands where the reference's product stood, from an angle a photo of it shows; whether it needs a person or thing to be seen properly (worn on a body as it really hangs; applied, the real amount; eaten, one serving; used, in a hand mid-task; placed, at true size against furniture; pet products on an ordinary adult animal); its size against a hand, body or furniture; which reference props to swap for ones from this product's real use; whether the reference's angle suits this product (flat things want a higher camera); where the quiet area sits; and the brand's palette wins over the reference's.
4. Write the prompt, short and direct, with the product rule first and last (the last instruction is followed hardest):
   - THE PRODUCT: Image 1 is the real product front on; copy shape, colours and printing exactly; [Image 2 in use or out of pack]; what it is exactly, "not <lookalike>"; do not redraw the label or invent a variant.
   - THE REFERENCE: Image n is for camera, light and composition only; list the camera, light and depth lines; never its product, brand, words, logo or people.
   - SCENE: place, surface, props, translated for this product.
   - THE PRODUCT IN THE SCENE: where it sits, size against a hand or table, lit by the scene's light, throwing a shadow on the scene's surface; any person and what each hand does. It must not look pasted on with the light of its old photo.
   - COLOUR AND MOOD from the brand palette.
   - RULES: no words, logos or marks except printed on the product; product whole, not cut by the edge; quiet area location; shape and size.
   - THE PRODUCT (again): exactly the one in Image 1.
5. Make one, look at it at full size beside the real photo. If the product is right and the recipe landed, make the rest. Never repeat a failed prompt in the same words. A generated picture is never filed as a reference photo.
6. Ways to use it: one picture from one reference; or five pictures that differ on purpose (warm and lived-in, dramatic with one directional light on a dark ground, bright and clean with clear space, very close for texture, one camera treatment); for textiles and room objects, three placements and two treatments.
7. Camera treatments change how the camera sees, not what is in frame. None is a product page hero. Keep the product large enough to read and note which were used so they rotate:

| Treatment | Look | Limit |
|---|---|---|
| Fish-eye with flash | Very wide lens, direct flash, saturated, grainy | Keep the product in the middle third |
| Warm flash film | Harsh small-camera flash, amber cast, grain | A white pack stays warm white, not orange |
| Cross-processed | Wrong-chemistry film: greens go cyan, skin goes orange | Changes product colour; avoid where colour is the point |
| Ring flash | Flat frontal light, thin shadow all round, round catch-light | Keep the glare off printed words |
| Tilt-shift | One sharp band; a real scene looks like a model | The product sits inside the sharp band |
| Hard noon sun | Hard overhead sun, deep black shadows, washed colour | No shadow across the label |
| Coloured lights | Two coloured lights, front and back | Light the product white, the scene in colour |
| Prism | Glass at the lens, rainbow leaks at the edges | Product in the clear middle |
| Through water | Wide lens, ripples, bubbles | Only a product the facts say goes in water, or a drink; otherwise shoot through a wet pane |
| Infrared | Foliage white or pink, deep navy sky | Changes every colour; product small in frame |
| Fish-eye from the ground | Camera on the ground looking up, subject towering | Keep the product in the middle third |

   A treatment prompt replaces the reference block with Lens, Light or flash, Film and colour, and one line of feeling with no brand, film stock or photographer named. No date stamp, border or caption.
8. Placements for textiles and room objects (the product is the subject, never the background; one glass is context, a full table setting buries it): draped off a bare surface in directional sun (hero for a pattern); at an outside table in dappled low sun (lifestyle); folded on a shelf in soft side light (product page, gift guide); lifted out of a box from tissue by one adult hand (what you get, gifting); flat from straight above with even light (catalogue, a new pattern). A pattern is copied from its photo at its true repeat size, never redrawn.
9. Rank only pictures where the product is right: job done 30%, looks photographed not generated 25%, light that could exist 20%, on brand 15%, something can be built on it 10%. Best first, one line each on what it is for. A wrong-product picture goes with the rejects.

## Output
The six-part reading, the carry-over answers, the final prompt, then the ranked pictures (or just the prompt if no renderer is available) and a reject list.

## Checks
- All six reference parts are filled, and none of the reference's product, brand, words, logo or people is carried over.
- The product matches its photo in shape, colours, printing and finish, stands in the scene's light and throws a shadow.
- A quiet area exists and the picture holds in the sizes needed.
- No words, date stamps or borders. A shiny product reflects only this scene.
- No child, no finger over the label, fictional adults only.

## If something is missing
Write `MISSING: <real photo | reference | job>`. Without a true photo of the exact variant, make no picture.

## Avoid
- A reference prop that makes no sense for this product.
- Putting a product somewhere it cannot survive (under water, on a flame) unless the facts say it can.
- Using a camera treatment as a product page hero.
- Filing generated pictures with real reference photos.
