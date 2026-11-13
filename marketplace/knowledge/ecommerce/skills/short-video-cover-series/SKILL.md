---
name: short-video-cover-series
description: "Designs a repeatable cover template for a store's Reels, Shorts and TikToks at 1080 x 1920, built from the store's own brand tokens (fonts, colours, logo) rather than one creator's personal style, then makes each cover from a product shot or a consented headshot plus a short title. Places the title inside the area every platform shows (profile grid crops, feed crops and app buttons), checks contrast and legibility at thumbnail size, keeps the product image real, and works in any free editor, an HTML template or a paid tool. Use when the store's profile grid looks random, when a new video series starts, or when each cover takes too long to make."
---

# Cover images for a short-video series

**You get:** a locked 1080 x 1920 cover template in the store's brand, finished cover PNGs, a spec sheet, a cover log and a mock grid of the first nine covers.

One template, many covers: every Reel, Short and TikTok cover in a series looks related, reads at thumbnail size, and takes minutes to make.

## When to use

- The store's profile grid looks random and does not say what the account is about.
- A new numbered or named video series starts.
- Each cover is designed from scratch and takes too long.
- Titles get cropped off in the profile grid or covered by app buttons.

## Not for

- The colour, font and component guide itself: use `store-visual-identity-sheet`, then build the template here.
- Editing the video: use `short-video-edit-pipeline`.
- Ad images in feed and story sizes: use `store-meta-ad-images`.
- Product shots that must keep the real product exact: use `store-meta-product-photos`, then place the result here.

## What you need

Required:

1. **Brand tokens**: heading and body fonts, two to four colours as hex codes, logo files (SVG or PNG with a clear background). From `store-visual-identity-sheet` or the brand guide.
2. **Per cover**: the video's title (or its hook line) and one image: a product photo or a headshot of a staff member or founder who has agreed to appear.
3. **Series name** and, for numbered series, the episode number.
4. **Platforms**: which of Instagram, YouTube Shorts and TikTok.

Optional: the current profile grid screenshot, past posts' profile-visit numbers, the store's product photo set.

Access: this is design work in a shared folder (level 1 on store accounts). Setting a cover on a live post needs publish access or the client does it.

## Before you start: the gates

1. **Gross profit per purchase.** Only needed when choosing which product goes on a cover meant to sell. Pass when the store's money lines exist (`store-meta-math`). Fail: feature products by topic only and say so.
2. **Capacity.** Name who makes covers and the time allowed. The template should bring each cover under about 10 minutes (practitioner default, test it). If nobody can open a design tool, use the HTML template path in step 6.
3. **Rights.** Pass when every face has consent, every product image is the store's own, and every font is licensed for commercial use. Fail: replace the item.
4. **Tracking.** Profile insights are the only measure for covers. Note whether the account has them.

## Steps

### 1. Map the safe area

The cover file is 1080 x 1920 (9:16), but platforms show different parts of it:

- Instagram's profile grid shows a centre crop near 3:4 (about 1080 x 1440); the feed can show a 4:5 crop (1080 x 1350).
- App buttons and captions cover the bottom and right edge when the video plays.

So put the title, face and product inside the centre 1080 x 1350 area, and keep text out of the bottom 35% and the right 10% of the full frame (practitioner default, test it on the live grid; platforms change crops). Draw these lines as a guide layer in the template.

### 2. Choose one layout for the series

Pick one of three layouts and keep it for the whole series:

- **Product hero:** product photo centred, title above it.
- **Face and title:** headshot on one side, title on the other.
- **Title card:** title large on a brand-colour background, small product or face inset.

A repeated, named series earns its own look and can later grow into its own account [ORG-0011]. A numbered series shows the episode number in the same place on every cover [ORG-0018].

### 3. Build the template from brand tokens

Fixed parts (locked layer): background treatment, series name position, episode number style, logo (small, in a top corner inside the centre crop, never down among the app buttons), guide lines. Where the title sits over a photo, use a solid brand-colour panel or soft scrim for contrast rather than text outlines or heavy shadows.

Variable parts (two slots only): the image and the title. Fewer variables mean faster covers and a calmer grid.

Type: brand heading font for the title, set large; headline type at about 3 to 4 times body size works on pages [LPG-0010], and covers need the large end because they are seen small. Colours: title and background from the brand palette with a contrast ratio of at least 4.5 to 1 (check with any free contrast checker). Rotate background colour by series, not by post.

### 4. Write the title

- 3 to 6 words; hook text past 8 words loses viewers on screen [ORG-0016], and covers are smaller still.
- Grade 5 reading level, everyday words [ORG-0024].
- Fully clear or deliberately curious; a half-clear line loses both groups [MCR-0019].
- The title must match what the video delivers. A cover that promises something the video does not show trains people to skip the account.
- Break it into 3 or 4 short lines at most; no end punctuation, no emoji.
- One emphasis word in the brand's accent colour: the number or the payoff word. Never two.
- One letter case for the whole series (all capitals or sentence case).

### 5. Prepare the image

- **Product:** use the store's real product photo. Background removal with any free tool is fine; changing the product's shape, colour, label or size is not. AI tools may make backgrounds only, never the product itself.
- **Face:** a real person who agreed to appear, looking at the camera or the product, cropped at the shoulders. Never use an AI-made face as a staff member or customer.
- Light and sharp at small size; zoom the preview to 25% to check.

### 6. Make the cover (any tool)

- **Free editors:** Canva (free plan), Figma (free plan), Photopea or Google Slides with a custom 1080 x 1920 page. Save the template as a locked master and duplicate it for each cover.
- **HTML template:** a single HTML page with the brand fonts and colours as CSS variables, the title and image as inputs, rendered to a 1080 x 1920 PNG with any headless browser screenshot tool. Good for batches.
- **Paid tools:** any design suite works the same way; the template rules above do not change.

Export PNG or high-quality JPG under about 1 MB.

### 7. Check legibility and the grid

- Scale the cover to about 270 px wide (one grid tile on a phone). Can you read the title in one glance? If not, cut words or enlarge.
- Place the new cover next to the last eight in a mock grid. Does the series read as one? Does anything clash?
- Batch check: same background treatment, same photo session or product shot style, same font and weight, same accent colour, same logo spot, one emphasis word per cover.
- Check the title against the safe-area guides one last time.

### 8. Set the cover on each platform

- **Instagram:** upload the cover image when posting, then check the grid crop and adjust it.
- **YouTube Shorts:** pick a frame or upload a thumbnail where the app allows; if it does not, place the cover as the first half-second of the video (practitioner default, test it).
- **TikTok:** upload a cover image or choose a frame with text added in the app; if neither shows the design well, use the first-frame method.

The person posting (client or agent with publish access) sets the cover after the post is approved in `short-video-edit-pipeline`.

### 9. Learn from the grid

Monthly: compare profile visits and plays from the profile for posts in the series against posts without the template. Keep the layout if it holds or improves; change one thing at a time (layout, title length or colour), never all three.

## Checks before you hand it over

- File is 1080 x 1920; title, face and product sit inside the centre 1080 x 1350.
- No text in the bottom 35% or right 10% of the frame.
- Title is 6 words or fewer and readable at 270 px wide.
- Contrast ratio of title on background is 4.5 to 1 or higher.
- Product image is the real product, unaltered except for background; any face has consent.
- Fonts and colours match the brand tokens exactly.
- The cover sits well in a mock grid with the last eight.

## Output

1. **One-screen summary:** the chosen layout and why, the series name, and a mock grid of the first nine covers.
2. **Template file:** locked master in the chosen tool (or the HTML template), with guide layers.
3. **Covers:** PNG files named `series-episode-title.png`, 1080 x 1920.
4. **Spec sheet:** Element, Font, Size, Colour (hex), Position, Rule.
5. **Cover log:** Video, Title, Image source, Consent noted, Platform, Set by, Date.

## Common mistakes

- **Designing for the full frame.** The grid shows a crop. Step 1 keeps everything in the centre.
- **A new look every post.** Step 2 locks one layout per series.
- **Long titles.** Step 4 caps them at 6 words.
- **AI-altered products or faces.** Step 5 keeps the product real and faces consented.
- **Testing on a big screen.** Step 7 checks at grid size.
- **Copying a creator's style.** Step 3 builds from the store's own tokens.

## Sources

- LPG-0010: headline about 3 to 4 times body size.
- MCR-0019: a headline is fully clear or deliberately curious.
- ORG-0011: a repeated format becomes a named series.
- ORG-0016: 5 to 8 words of on-screen hook text.
- ORG-0018: numbered series that show the product.
- ORG-0024: grade 5 to 8 reading level.

What makes this skill ours: the template is built from the store's own brand tokens with only two variable slots; every title and face sits inside the crop all platforms show; product images stay real and faces carry consent; and the cover works in free tools or a simple HTML template, with no paid design tool needed.
