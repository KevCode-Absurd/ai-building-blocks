---
name: image-and-video-prompt-set
description: Writes sets of AI image and short video prompts that keep a real product and a brand looking right across every output - product scenes, website and social images, mascots and short clips. Uses a shared style block, reference images, per-image subject and camera details, positive descriptions instead of long avoid lists, fix prompts for common faults, and a check of every output against the real product. Facts are taken from OpenAI and Google's own image and video docs, dated. Use it for product lifestyle images, brand image sets, consistent characters, or AI video shots.
---

# Image and video prompt set

## When to use

- A shop needs lifestyle scenes for products without a photo shoot.
- A brand wants website headers, social images or blog images in one consistent style.
- A mascot or character must look the same in every image.
- A short AI video clip is planned and needs shot-by-shot prompts.

## What you need

1. What the images are for (product page, ad, website hero, social post) and the sizes or aspect ratios needed.
2. The tool that will run the prompts. Check its current docs on the day; tools and models change often.
3. The real product: clear photos from several angles, exact colours (with hex codes if known), materials, shape, label text, size.
4. Brand guide: colours, mood, words to describe the style, examples the client likes.
5. Where text must appear, the exact wording.

**Access:** level 1 to read past prompts and outputs; level 2 to generate drafts within the credit cap you set, saved to a private folder; level 3 to deliver approved images to the agreed folder, store or listing. Some agents in this role only write prompts and leave generating to you.

## Steps

### 1. Write the product truth sheet

List every detail that must never change: shape, colour, material, label layout and text, size relative to a hand or a mug, lid or cap type. Every prompt in the set repeats the parts that matter for that shot. This is the line between a real product image and a misleading one.

### 2. Write the shared style block

One paragraph reused in every prompt: medium (photograph, flat illustration, 3D render), light (soft window light from the left, golden hour), colour palette in words and hex, lens or angle feel, mood. Reusing it word for word keeps the set consistent.

### 3. Write each prompt in a fixed order

Subject first, then setting, composition and camera angle, lighting, the style block, then size or aspect ratio in the tool's own setting. Describe a full scene in sentences rather than a list of keywords. State the purpose ("a product page hero for a premium candle brand"), because Google's image guide says context and intent improve results.

### 4. Describe what you want, not what you don't

Google advises describing the scene positively rather than listing exclusions: "an empty, clean marble counter" rather than "no clutter". Keep a short avoid line only where the tool supports one, and check its syntax in the tool's current docs.

### 5. Use reference images for products and characters

As of 6 November 2026: Google's Nano Banana 2.1 and 3.1 Flash take up to 14 reference images (10 object, 4 character), and OpenAI's image edit endpoint takes input images. Supply the real product photos and say "keep the product exactly as in the reference". OpenAI warns that recurring characters and brand elements can still drift, so check every output.

### 6. Handle text in images

If text must appear: as of 6 November 2026, Google suggests generating the text first, then asking for the image containing it, and OpenAI notes text placement can be imprecise. Otherwise leave clear space for the text and add it afterwards in a design tool, so the wording is exact.

### 7. Write fix prompts

At least three edit prompts for the usual faults, each saying what to change and what must stay: "Change only the label: make it rectangular with rounded corners as in the reference. Keep everything else exactly the same." Others: wrong colour, extra fingers or hands, warped text, product too large or small.

### 8. For video, write a shot table

One row per shot: duration, subject, action, setting, camera movement, lighting, sound or dialogue, and the style block. As of 6 November 2026, OpenAI's Sora 2 API has been shut down, Google's Veo 3.1 preview models were scheduled to shut down on 22 October 2026, and Google's current Gemini Omni Flash makes 3 to 15 second clips with native audio and up to 6 reference images for character consistency. Check the tool the client will use before fixing durations.

### 9. Check every output

Compare each image or clip with the truth sheet. Reject any that changes the product. Note which prompts and settings produced keepers.

## Checks

- Every prompt repeats the product details that matter for that shot, and they match the truth sheet.
- The style block is identical across the set.
- Sizes match where the images will be used.
- No living artist, real person, celebrity or other brand's logo is named or imitated.
- Text is either verified in the image or added afterwards.
- The client is told to check every image against the real product before using it in a listing or ad; in the EU, AI Act Article 50 transparency rules apply from 2 August 2026, and in the UK and US ads must not mislead.
- Model and tool facts carry the date they were checked.

## Output format

1. Product truth sheet
2. Shared style block
3. Prompt table: ID, purpose, size, full prompt, references to attach
4. Fix prompts
5. For video: shot table
6. Consistency notes (references, settings, any seed or style reference the tool offers)
7. Output check list

## Example of good output (short)

*Made-up business: Emberwick soy candles, 8 oz amber glass jar, cork lid, plain kraft label with black serif text "EMBERWICK / Fig & Cedar".*

> **Style block:** Natural-light lifestyle photograph, soft window light from the left, warm neutral palette (cream #F3EDE2, walnut #5B3A29, sage #9CAF88), shallow depth of field, calm and unhurried mood.
>
> **P3 (4:5, product page):** An 8 oz amber glass candle jar with a cork lid resting beside it, plain kraft paper label with black serif text, lit and glowing, on the corner of a wooden bedside table next to an open paperback and a ceramic mug, in a cosy reading nook in the evening. Camera at table height, slightly angled, candle sharp in the left third, clear empty wall space at the top for text. [Style block.] Keep the jar, lid and label exactly as in the reference photos.
>
> **Fix F1:** Change only the label so it is a plain kraft rectangle as in reference photo 2. Keep everything else exactly the same.
