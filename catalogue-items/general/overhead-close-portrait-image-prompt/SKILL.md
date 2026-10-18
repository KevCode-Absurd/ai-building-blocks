---
name: overhead-close-portrait-image-prompt
description: Use when you want a still portrait of an adult shot from directly overhead with an ultra-wide lens at very close range, so the face dominates and tapers to the chin while the shoulders fall away, for beauty, fashion or creator-style campaign images.
---

# Overhead Close Portrait Image Prompt

A render-ready prompt (and, if a renderer is available, the image) for an adult portrait in an exaggerated overhead perspective. It changes the camera, not the person's anatomy and not what the product does.

## Inputs
- **Brief** (required): subject, setting, mood, aspect ratio, whether words appear, whether a product is shown.
- **Camera reference image** (optional): an overhead close wide-angle portrait that fixes viewpoint and scale only. Without one, use the prompt description below.
- **Identity reference** (optional): an approved character or avatar; controls face, skin tone, marks, age, hair, build.
- **Product photo** (optional): controls shape, colour, proportions and label.
- **Approved copy** (optional): exact words if any appear on the image.

## Steps
1. Name each reference's role separately so none replaces another: camera reference = geometry and face-to-frame scale only; identity reference = who the person is; product photo = the real product. With no identity reference, create an original fictional adult fitting the brief. Do not call that person a customer and do not invent a personal result with the product.
2. Compose for the selected aspect ratio (a set's chosen ratio wins; a standalone request can start vertical). Aim for the whole head and chin visible, hairline near the top edge, the face roughly 75 to 85 percent of the frame width and 65 to 75 percent of the height in a vertical frame, body receding below. Do not stretch anatomy to fit another ratio.
3. Write the prompt covering, in this order:
   - What it is: a photoreal overhead portrait, camera directly above the head, adult looking up into the lens, the lens axis on the bridge of the nose between the brows.
   - Distance and lens: extremely close, about 20 to 30 cm as a visual target, rectilinear ultra-wide (about 14 mm full-frame equivalent).
   - Shape: broad upper forehead and eye line, nose toward the lens, cheeks narrowing to a small chin, shoulders and torso receding strongly.
   - Skin and light: fine irregular pores and soft facial hair at this scale, the person's own asymmetry and marks, gentle sheen with texture visible underneath; soft diffused window light unless the brief sets another. Sharp eyes with believable catch-lights.
   - Setting, wardrobe, expression from the brief, and "no added words" unless copy is approved.
   - Negatives, stated once: not an eye-level headshot, not circular fisheye, not a uniformly inflated face, not cartoon eyes, not waxy smoothing, no repeating pore pattern, no harsh sharpening halos.
4. If a product is shown, give it a credible grip and a readable label placement away from the mouth; match its real size, colour and printing, and describe a hold suited to that size.
5. If words appear, use only the approved headline and support, in the brand's typeface over a quiet area away from the eyes, mouth and label. Keep the face dominant; with little space, use fewer text roles instead of shrinking the face. Never invent a testimonial.
6. For a requested change to an approved image ("change only the hair colour"), alter only that element, and keep identity, geometry, expression, crop, light, wardrobe and room fixed, using the approved image as a continuity reference. Change one skin issue at a time; more texture is not automatically better.
7. If no renderer or reference input is available, deliver the prompt and say which reference step was not run. Do not claim the image was rendered or inspected.
8. Inspect the actual image: overhead angle, dominant upper face tapering to the chin, sharp eyes, coherent shoulder recession, identity, product label, hand contact, exact words.

## Output
One prompt paragraph (and, for an edit, a one-sentence change instruction) plus a list of the reference roles used. If rendered: the image and a pass or fail line per check.

## Checks
- Reject an ordinary eye-level headshot, a circular fisheye, a uniformly swollen face, broken anatomy, a cropped forehead or chin, or a small face in an overhead room shot.
- Skin at the same scale shows varied fine texture and restrained sheen, with no stamped pore grid and no sharpening halos.
- Identity matches the identity reference; the camera reference's person, outfit and room did not carry over.
- Product label, shape and colour are right; the text on the image is exactly the approved words.
- Subject is an adult. No claim of skin improvement or before and after is implied.

## If something is missing
Write `MISSING: <identity reference | product photo | approved copy>`. Without an identity reference, invent a fictional adult and say so.

## Avoid
- Treating "8K detail" as a guaranteed output size: it describes the aim only.
- Reproducing a reference's strong shine as a mandatory skin finish.
- Using this look for every portrait or every AI influencer; it is one camera treatment.
- Adding freckles or blemishes the chosen identity does not have.
