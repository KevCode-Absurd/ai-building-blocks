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

Sort the approved brief into three piles before writing:

- **Keep:** the approved scene, the exact words, the product facts and lock lines, and any rule that changes what is visible.
- **Translate:** labels a camera cannot see ("premium", "fresh", "fun") into things it can (soft window light from the left, cold condensation on the glass, saturated primary colours).
- **Drop:** research notes, rejected versions, placeholder text from a layout sketch, repeated adjectives, and model or cost settings.

Any detail the approved ad does not give but the camera needs (surface material, time of day, light direction) is added as a choice and listed under "Added, not approved" so the owner can see it.

### 2b. Give every attached image one role

Number the images in the order you attach them and give each one job in one line:

- "Image 1 is the product as sold. Match its shape, colours and printing exactly."
- "Image 2 shows the product in a hand. Use it for size only."
- "Image 3 is the light I want. Take the light and camera height. Ignore its product, people and words."

Put the product and any approved person first, then light or style, then any layout sketch. Attach an image only if it has a job: an image with no job leaks its props and colours into the scene. Then write the product's 3 to 5 lock lines from `keep-product-accurate-in-ai-media` (the details a model gets wrong first) and repeat them word for word in every prompt of a set; when words and images disagree, models tend to follow the words.

### 3. Write the prompt in a fixed order

1. **Format:** "Photograph, 4:5 vertical, 1080 x 1350" (or the canvas from the layout).
2. **Product:** "Use the attached product photo. Keep the label, colour, shape and proportions exactly as shown." Name the variant. With no photo to attach (a text-only tool), the words are all the model has, so describe the product from the product facts as a camera would see it: the material and its surface (heavy cotton canvas with a dry, matte weave; brushed steel; glazed stoneware), the colour by name and hex, the cut or shape, every closure and piece of hardware, and the size against something familiar. Then name 2 or 3 things it does not have that a model is likely to add (no collar lining, no zip, no shine). Look at each output for these first: a model drifts to the most common version of the category.
3. **Scene and setting:** one or two plain sentences of what a camera would see.
4. **Composition:** where the product sits and which areas stay empty, from the layout ("top fifth plain and uncluttered for a headline").
5. **Lighting, angle, depth:** one phrase each.
6. **Palette:** hex codes with plain names ("#1F3A2E deep forest green").
7. **Mood and style:** two words for mood, one phrase for style.
8. **Text:** "No text, letters, logos or watermarks anywhere." If a few words must appear, put them in quotes, five words or fewer (practitioner default, test it), and plan a real-type fallback. When a form, a tool or a hand-over file has its own field for the words on the image, that field holds only the words, exactly as they should read. No role labels ("Headline:", "CTA:"), no separators and no layout notes: a model prints whatever is in that field. Layout, type and colour go in the composition and palette lines, and the words a designer sets afterwards go in a separate note.

**Settings beat words.** Where the tool has settings for shape, size or quality, set them there; writing "4K" or "8K" in a prompt sets nothing, and some tools ignore a ratio written in words. Keep the format line for tools with no settings, or as a plain statement of what the image is and where it runs ("A photoreal product ad for an online store's Instagram feed").

**Camera and physics.** Give the camera as a real position ("counter height, about 40 cm away, slightly above"), with framing, height, angle and distance as separate choices, not a mood. Make the scene physically possible: every object rests on, hangs from or is held by something, with a shadow that matches the light; the product opens, pours or is used only as the facts say, and is shown closed or at rest when no step is on file. Any hand gets its own line: how many, which hand, what it holds.

**Exact words, when the tool can spell.** Current text-capable models can render a headline and a short support line, but test the tool first. When you do put words in, list each line once, in reading order, in quotes, with its role (headline, support, button), its place, its colour as hex plus a plain name, and the type look (weight, width, case, spacing). Never describe a word twice. Check every letter in the output; any miss means real type is set afterwards.

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

**Edit requests.** When the owner picks a favourite that needs changes, split every change by intent and send one kind at a time. A text edit changes only the words (a headline, a spelling, a quote) and says "change nothing else". A style edit changes only the look (background, colour, light, mood, a prop added or removed) and keeps every word and the product exactly as they are. Mixing both in one request is the commonest way to lose a good image. Each edit makes a new version with its parent ID in the log, so any step can be undone.

### 8. Learn per brand

After about 20 logged generations for a brand (practitioner default, test it), read the log:

- Wording that appears in approved prompts at least twice and in no rejects moves into `brand-prompt-rules.md` as a default.
- Wording linked to the same reject reason twice is removed or rewritten.
- When the tool or model version changes, rerun one fixed test prompt and compare before reusing old rules.

Approval means the image is usable, not that it sells. Join the ad ID to results later (`prelaunch-ad-check` keeps that log), and compare creative types on gross profit per ad, including generation and review time [MCR-0023]. AI images cost little each, which is why a third of creative from AI is a common mix in volume accounts [MCR-0037]; the review step is the real cost.

Variants of one prompt that only change colour or pose are not new ads [MCR-0022]; send real variety back to `ad-batch-visual-direction`.

AI statics can carry cold, top-of-funnel spend at scale, not only retargeting [MCR-6866], but the concept behind them should come from a person: language models hand every store the same ideas, while people connect ideas from outside the category [MCR-6876]. Use this compiler for production, never as the source of the idea.

## Checks before you hand it over

1. The prompt follows the fixed order and names the canvas size from the layout.
2. The real product photo is attached as a reference, or the plan places the real photo on top.
3. Every attached image has a numbered role, and the lock lines are repeated word for word.
4. Shape, size and quality are set in the tool's settings where it has them.
5. Any detail added beyond the approved ad is listed under "Added, not approved".
6. No invented fact appears: no names, quotes, ratings, counts, results or prices.
7. Any text in the image is five words or fewer and quoted exactly, with a real-type fallback, or the tool was tested for spelling and every line is listed once with its role, place, colour and type look.
8. The avoid list matches the chosen tool: negative field if it has one, positive phrasing if not.
9. The prompt has a version ID and a log row.
10. Every output was reviewed at full size beside the real product, with a reason code.
11. Each edit request changes only words or only style.

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
- **Attaching a mood photo with no job.** Step 2b gives each image one role, or leaves it out.
- **Writing "4K, 4:5" in the prompt.** Step 3 sets those in the tool.
- **One edit that fixes a word and the background at once.** Step 7 splits text edits from style edits.

## Sources

- [ADC-0023]: tie ads to stock against reorder time.
- [LPG-0037]: reviews need names and sources; bare logos read as fake.
- [MCR-0020]: illustrations for sensitive health problems, within policy.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [MCR-0023]: compare creative types on gross profit per ad.
- [MCR-0037]: about a third AI, a third creator, a third in-house.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-6866]: AI image statics can carry cold, top-of-funnel spend.
- [MCR-6876]: keep a human at the concepting step.

Platform documentation: Meta and TikTok AI-generated content disclosure rules; each image tool's own guidance on reference images and negative prompts.

What makes this skill ours: a model choice made by what the image needs, with the real product photo always as the reference; a hard rule that no review, rating, customer or price is ever generated; a version ID and reason-coded log that turns approvals into brand prompt rules; a link from each approved image to its ad ID so prompts are judged on sales later.
