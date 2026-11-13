---
name: ad-image-prompt-compiler
description: "Compile the brand profile, layout, visual settings and copy for one ad image into a single model-ready prompt, with an avoid list written the way the chosen model can use it and a recommendation of which kind of image model to use for this job. The real product photo goes in as a reference, text is left off the image unless it is a few words the model can spell, and nothing invented (no fake reviews, ratings or customers) ever enters a prompt. Every prompt gets a version ID and is logged with its review verdict, so the store builds its own library of phrases that produce approved images. Use right before generating, when outputs drift off brand, or when switching image tools."
---

# Ad image prompt compiler

**You get:** one copyable, model-ready image prompt for one ad, a separate avoid list, the reference files to attach, a recommended image tool with a fallback, and an updated prompt log, ready to generate.

The last step before generation: one clean prompt that carries every locked decision, nothing the model does not need, and a version number so the store learns what works for its brand.

## When to use

- A layout, visual settings and copy are approved and an image is about to be generated.
- Generations keep drifting: wrong product, wrong colours, garbled text, random layout.
- The store is moving to a different image tool and wants its prompts to carry over.
- The team wants to know which prompt wording produced the images that were approved.

## Not for

- Deciding the layout: use `static-ad-layout-blueprint`.
- Deciding mood, style and spread across a batch: use `ad-batch-visual-direction`.
- Making the finished ad with real type: use `layered-static-production`.
- Deciding whether AI may show this product at all: use `store-meta-product-photos`.

## What you need

**Required**

- Brand profile: palette hex codes with plain colour names, fonts, logo file, words for the look, from `store-meta-brand-dna`.
- The layout blueprint for this image: canvas size, where the product sits, which areas stay clear for type.
- The visual settings for this variant, with lock or vary marks.
- The copy, but only if a few words must be in the image itself.
- A clean, real photo of the exact product variant (front, plain background, at least 1000 px on the short side; practitioner default).
- Which image tools the store can use today.

**Optional**

- `prompt-log.csv` and `brand-prompt-rules.md` from earlier runs.

**When something is missing.** No product photo: stop; never let a model invent the product. No layout: ask for it or use the product hero layout and say so. No brand profile: ask once for hex codes and three words for the look.

**Access.** Read only. Generating images may cost money per image on paid tools; the owner chooses the tool and approves the spend.

## Before you start: the gates

1. **Gross profit per purchase known and the product in stock.** Generation time goes only to products the store makes money on and can ship; a product with less cover than its reorder time should not be pushed [ADC-0023]. Fail: stop for that product.
2. **Cash and capacity.** Someone will review every output at full size before use. Fail: compile prompts only, do not generate.
3. **Tracking.** Not needed to write a prompt. Needed later to join approved images to sales; the log keeps the ad ID for that.
4. **Truth.** The prompt contains only facts from the brand profile and proof table. Fail: remove the line.

## Steps

### 1. Pick the kind of model for this image

Choose by what the image needs, not by brand name. Test the current version of any tool before trusting this table.

| The image needs | Use | Why |
|---|---|---|
| The real product exact, in a new scene | A model that takes a reference image and edits around it, or generate the scene only and place the real product photo on top | Text-only models redraw the product |
| Clean product, plain or simple background | Background removal and a real photo; no generation | Cheapest and exact |
| People in scene | A photoreal model, with the platform's AI disclosure rules followed | AI people must never be shown as customers |
| Several words of text on the image | Generate with no text and set real type afterwards | Models misspell longer text |
| An illustration or diagram | A model strong at illustration, or draw it | Data must match the proof table |

Write the recommendation as: model kind, the tool the store has that fits, and the fallback.

### 2. Strip what the model does not need

Leave out brand history, buyer demographics, marketing terms and competitor talk. They cost attention and add nothing a camera could see. Keep only what changes the picture.

### 3. Write the prompt in a fixed order

1. **Format:** "Photograph, 4:5 vertical, 1080 x 1350" (or the canvas from the layout).
2. **Product:** "Use the attached product photo. Keep the label, colour, shape and proportions exactly as shown." Name the variant.
3. **Scene and setting:** one or two plain sentences of what a camera would see.
4. **Composition:** where the product sits and which areas stay empty, from the layout ("top fifth plain and uncluttered for a headline").
5. **Lighting, angle, depth:** one phrase each.
6. **Palette:** hex codes with plain names ("#1F3A2E deep forest green").
7. **Mood and style:** two words for mood, one phrase for style.
8. **Text:** "No text, letters, logos or watermarks anywhere." If a few words must appear, put them in quotes, five words or fewer (practitioner default, test it), and plan a real-type fallback.

Aim for the shortest prompt that carries every locked setting, usually one short paragraph per section. Long prompts that repeat themselves tend to drift (practitioner default, test it).

### 4. Write the avoid list for the model you chose

- If the tool has a separate negative prompt field, put short avoid terms there.
- If it does not, phrase avoids as positives in the main prompt ("plain linen background" rather than "no clutter"). Many models handle "no X" poorly.
- Always avoid: extra products, changed labels, extra fingers or hands, any text not asked for, other brands' logos.

### 5. Keep the prompt honest

- Never write a customer name, quote, rating, review count, before-and-after result or price into a prompt. Those go on afterwards from the proof table, with a name and source [LPG-0037].
- Never ask for an AI person to be presented as a customer or creator.
- Health and body products: no images implying the viewer has a condition; an illustration can carry a sensitive problem better than a graphic photo [MCR-0020].
- If the image will carry a few words, check them against AI copy patterns such as "it's not X, it's Y" [MCR-0016].

### 6. Version and log it

Give every prompt an ID: `<brand>-<concept ID>-<variant>-v<number>`. Each edit is a new version with its parent ID. Log every generation:

| Field | Example |
|---|---|
| prompt ID, parent ID | store-C04-B-v3, store-C04-B-v2 |
| date, tool and model version | from the tool |
| reference files used | product-front.png |
| the full prompt and avoid list | text |
| output files | names |
| review verdict | approved or rejected |
| reject reason | product drift, text error, wrong mood, looks AI-made, layout ignored, off palette |
| ad ID once launched | from Ads Manager |

### 7. Review every output

Check each image at full size beside the real product photo: label, colour, shape, size, and any text letter by letter. Approve or reject with a reason code. An approved image still goes through `prelaunch-ad-check` before launch.

### 8. Learn per brand

After about 20 logged generations for a brand (practitioner default, test it), read the log:

- Wording that appears in approved prompts at least twice and in no rejects moves into `brand-prompt-rules.md` as a default.
- Wording linked to the same reject reason twice is removed or rewritten.
- When the tool or model version changes, rerun one fixed test prompt and compare before reusing old rules.

Approval means the image is usable, not that it sells. Join the ad ID to results later (`prelaunch-ad-check` keeps that log), and compare creative types on gross profit per ad, including generation and review time [MCR-0023]. AI images cost little each, which is why a third of creative from AI is a common mix in volume accounts [MCR-0037]; the review step is the real cost.

Variants of one prompt that only change colour or pose are not new ads [MCR-0022]; send real variety back to `ad-batch-visual-direction`.

## Checks before you hand it over

1. The prompt follows the fixed order and names the canvas size from the layout.
2. The real product photo is attached as a reference, or the plan places the real photo on top.
3. No invented fact appears: no names, quotes, ratings, counts, results or prices.
4. Any text in the image is five words or fewer and quoted exactly, with a real-type fallback.
5. The avoid list matches the chosen tool: negative field if it has one, positive phrasing if not.
6. The prompt has a version ID and a log row.
7. Every output was reviewed at full size beside the real product, with a reason code.

## Output

1. **One-screen summary:** the prompt ID, the model kind and tool recommended with a fallback, what the image will show, and the review status.
2. **The prompt** in one copyable block.
3. **The avoid list** in its own block, marked "negative field" or "already in prompt".
4. **Reference files** to attach.
5. **Updated `prompt-log.csv`** and, if changed, `brand-prompt-rules.md` with the date.

## Common mistakes

- **Letting the model redraw the product.** Step 1 and the checks require the real photo.
- **Baking a fake review into the image.** Step 5 keeps proof out of prompts.
- **Long text inside the image.** Step 3 caps it and plans real type.
- **"No X" lists the model ignores.** Step 4 matches avoids to the tool.
- **Keeping prompts in a chat history.** Step 6 versions and logs every one.
- **Calling approved images winners.** Step 8 joins them to results first.

## Sources

- [ADC-0023]: tie ads to stock against reorder time.
- [LPG-0037]: reviews need names and sources; bare logos read as fake.
- [MCR-0020]: illustrations for sensitive health problems, within policy.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [MCR-0023]: compare creative types on gross profit per ad.
- [MCR-0037]: about a third AI, a third creator, a third in-house.
- [MCR-0022]: a colour or pose change is not a new ad.

Platform documentation: Meta and TikTok AI-generated content disclosure rules; each image tool's own guidance on reference images and negative prompts.

What makes this skill ours: a model choice made by what the image needs, with the real product photo always as the reference; a hard rule that no review, rating, customer or price is ever generated; a version ID and reason-coded log that turns approvals into brand prompt rules; a link from each approved image to its ad ID so prompts are judged on sales later.
