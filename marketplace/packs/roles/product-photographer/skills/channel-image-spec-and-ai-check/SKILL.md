---
name: channel-image-spec-and-ai-check
description: Writes an image spec sheet for each sales channel (Amazon, Shopify, Google Merchant Center, Etsy and any others named) with sizes, ratios, background and fill rules, file names and alt text, each dated and sourced, then checks finished or AI-edited images against it before upload. Flags any edit that changes the product, AI images missing their IPTC or C2PA marks, and main images that are not real photographs. Use before uploading a new image set, after an image rejection, or before using AI tools on product photos.
---

# Channel image spec and AI check

Each channel has its own image rules, and they change. AI tools now make it easy to change a background, extend a canvas or generate a whole scene, and some channels have rules about that too. This skill writes the spec, then checks every image against it before anything goes live.

## When to use

- Before uploading a new image set to a store or marketplace.
- After a listing was rejected or suppressed for an image problem.
- Before using AI tools (background change, generated scenes, extending a canvas) on product photos.
- When a seller adds a new channel.

## What you need

- **Channels** the images are for, and links to any rule pages or templates the seller has.
- **The images** (or a sample), with the original photo for anything edited.
- **What was done to each image:** retouching, background change, AI edits, and which tool.
- **Product facts:** colours, sizes, what is included, variants.
- **Access** to the store or marketplace, if the images will be uploaded by the agent.

**Access:** level 1 to read listings and check images; level 2 to upload to draft products or unpublished listings and save edits as new files; level 3 to replace images on live listings within the client's limits. Publishing any AI-generated or AI-edited image is always listed for the client's yes, even at level 3.

## Steps

1. **Write the channel spec sheet.** For each channel: main-image background and fill, minimum and suggested size, maximum size and file size, formats, aspect ratio, what may not appear (text, logos, borders, props, other variants), number of image slots, and any AI rule. Open the platform's own page on the day and date every rule. As of Nov 2026:
   - *Amazon:* pure white main image, product filling 85% or more, at least 1,000 pixels on the longest side, the actual product with no illustrations, product identifier in the file name (from a staff forum post; re-check).
   - *Shopify:* up to 5000 x 5000 pixels or 25 megapixels, under 20 MB, 2048 x 2048 suggested for squares, one aspect ratio across a collection.
   - *Google Merchant Center:* at least 500 x 500 pixels from 31 January 2027, 1500 x 1500 recommended, product filling 75% to 90%, no promotional overlays, one variant per image, AI-made images keep their AI metadata.
   - *Etsy:* 2000 pixels each side recommended, first photo at least 635 pixels, at least one unedited photo of the actual item on a real background.
   - For social and ad sizes, use the graphic designer kit's spec.
2. **Set file names and alt text rules.** One naming pattern (for example SKU, shot type, number). Alt text describes what each image shows for someone who cannot see it, in a sentence, without "image of".
3. **Check each image against the spec.** Background, fill, size, ratio, format, colour space (sRGB), no text or badges where banned, no props on marketplace main images, one variant per image for Google.
4. **Check truth to product.** Compare each image with the original photo and the product facts: colour, shape, size, label, finish, included parts. Flag any edit that changes the product, hides a flaw, adds something the buyer will not get, or makes the product float or sit at the wrong scale. Hold the product next to the screen in daylight where possible.
5. **Check AI edits and marks.**
   - Name the edit type in IPTC terms: digital capture, algorithmically enhanced (sharpening, noise reduction), edited using generative AI (new background, extended canvas), created using generative AI (fully generated).
   - Check the metadata survived export; some export settings strip it. Google requires the AI marking to stay on generative AI images.
   - Main images on marketplaces: real photographs only. Amazon asks for the actual product, and Etsy needs at least one unedited photo of the real item.
   - Check output size: Shopify's AI editor outputs about 1 megapixel, below its own suggested size for squares.
   - EU audience: a realistic AI scene around a real product may need a label under Article 50 of the EU AI Act, which applies from 2 August 2026. Flag it for the client to check with an adviser; this is general guidance, not legal advice.
6. **Check rights.** Ownership or licence for each image, model releases for anyone shown, and permission for any private location.
7. **Give a verdict per image:** pass, fix (with the exact fix), or do not use (with the reason).
8. **Prepare upload.** Order the gallery: main image, then the shots that answer the biggest buyer questions (scale, detail, in use), then variants and lifestyle. For Google, a changed image gets a new URL.
9. **Upload, by access level.** Level 1: hand over the files, order and alt text. Level 2: upload to drafts and save edits as new files. Level 3: show the action list (each listing, image slot, file, and any AI image) and limits, get a yes, replace images within the limits, and log each change. Check the listing afterwards for image errors.

## Checks

- Every rule on the spec sheet has a date and a source link.
- No image changes the product's colour, shape, size, finish or included parts, and none hides a flaw.
- Every AI-edited or AI-generated image is named as such, keeps its metadata, and is not used as a marketplace main image.
- Sizes meet each channel's minimum, including after AI editing.
- Alt text and file names follow the agreed pattern.
- Rights and releases are recorded.

## Output format

1. **Channel spec sheet** with dates and sources.
2. **Image check table:** file, channel, slot, checks passed, issues, edit type, verdict, fix.
3. **Gallery order and alt text** per product.
4. **Rights log.**
5. **Upload plan** by access level, with the action log if anything was uploaded.

## Example of good output (short)

*Ember & Ash Sauce Co. is a made-up business used only to show the format: five hot sauces in 150 ml bottles, sold on Shopify, Amazon and Google Shopping. All details are invented.*

| File | Channel and slot | Issue | Edit type | Verdict | Fix |
|---|---|---|---|---|---|
| EA-HAB150_main_01.jpg | Amazon main | Background RGB 247,247,247, not pure white | Digital capture | Fix | Set background to 255,255,255 on a copy; keep the master |
| EA-HAB150_scene_04.jpg | Shopify gallery | AI-generated wooden table and chillies; bottle label slightly warped | Edited using generative AI | Fix | Regenerate keeping the original bottle pixels; check the label against the real bottle |
| EA-HAB150_scene_04.jpg | Google lifestyle | AI metadata removed by the export preset | Edited using generative AI | Fix | Re-export with metadata kept; new image URL |
| EA-CHI150_main_01.jpg | Google main | "Best seller" badge in the corner | Digital capture | Fix | Remove the badge on a copy; promotional overlays are not allowed |
| EA-CHI150_detail_03.jpg | All | Sauce colour pushed redder than the real sauce | Digital capture, saturation +35 | Do not use | Re-edit from the master with saturation at 0 |

**Alt text example:** "150 ml bottle of Habanero Ash hot sauce with a black label, standing on a white background."
