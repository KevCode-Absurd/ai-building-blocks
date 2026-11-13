---
name: product-photo-pack-and-montage
description: "Turn one clean product photo into a pack of 10 to 15 on-brand, text-free images, a contact sheet and a quick-cut montage video, delivered with and without music. Every image keeps the real product exact (the real photo is the reference every time, never an AI copy of it), and each image has a job: ad, organic post or product page gallery. The montage is cut at a pace that is safe for viewers sensitive to flashing, exported at the right size for Reels, TikTok, Stories, Shorts, feed and YouTube, and uses only music whose licence allows business use on that platform, with a sources file. Works with any image tool, a phone shoot or a mix. Use when a store has one good product photo and needs a week of visual content fast."
---

# Photo pack and montage from one product

**You get:** a pack of 10 to 15 on-brand, text-free product images, a contact sheet, and a quick-cut montage video in each size with and without music, plus a shot table and music sources.

One real product photo becomes a cohesive set of stills and a short montage, each file sized for where it will run, with the product exact and the music cleared.

## When to use

- A new or relaunched product has one clean photo and needs a set of images this week.
- Organic channels need a steady supply of on-brand stills.
- A quick montage video is wanted for Reels, TikTok, Stories or Shorts, with music the store is allowed to use.
- The product page gallery needs more angles and settings.

## Not for

- Deciding whether AI may show this product, and planning shots by buyer question: use `store-meta-product-photos`.
- Ad images with headlines and offers: use `product-photo-ad-variations`.
- Scripted video ads with a hook and body: use `store-meta-concepts` for the script.
- Reviewing live creative: use `store-meta-creative-review`.

## What you need

**Required**

- One clean, real photo of the exact product variant: plain background, sharp, at least 1500 px on the short side (practitioner default).
- Brand files from `store-meta-brand-dna`: palette hex codes, look words, imagery do and do not, five brand images the owner likes.
- The product facts: what it is, who uses it, where and when, what it comes with.
- The platforms the store posts or advertises on.

**Optional**

- Music the store has licensed (with licence files).
- More real photos (in use, packaging, scale) to mix in.

**When something is missing.** Photo too small or blurred: ask for a better one, or plan a phone reshoot first. No brand files: ask once for hex codes and three look words. No platforms: assume Instagram and TikTok.

**Access.** Read only for files. Paid image tools may charge per image; the owner picks the tool and approves spend. Posting or advertising any file needs the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase known and stock live.** Content time goes to products the store profits on and can ship. Fail: stop for that product.
2. **AI allowed for this product.** If buyers judge colour, texture or fit, AI may make backgrounds and props only; the product stays the real photo. `store-meta-product-photos` decides. Fail: phone shoot or composite path only.
3. **Cash and capacity.** Generation spend, if any, is approved, and someone checks every image at full size. Fail: make 10, not 15.
4. **Tracking.** Not needed to make the pack. Needed only if files later run as ads; name files so each can be traced.

## Steps

### 1. Set one art direction for the whole pack

Write a short profile: colour world (most packs look directed when one or two brand colours dominate; practitioner default, test it), 3 to 6 props that truly belong to the product, 3 to 6 settings where it is really used, who appears (no one, hands only, a real person), and one lighting mood. Cohesion makes the pack look like one shoot.

### 2. Plan 10 to 15 shots, each with a job

| Shot | Job |
|---|---|
| Clean hero on brand colour | Ads, gallery |
| Scale (in hand or beside a known object) | Gallery, ads |
| Detail or texture close-up | Gallery, organic |
| In use, the main moment | Organic, ads |
| In its setting | Organic |
| Flat lay with real props | Organic |
| What is in the box | Gallery |
| Real colour or size variants side by side | Gallery |

More shoppers swipe the whole product image gallery than scroll the whole page, so gallery shots should answer buyer questions, not just look nice [LPG-0060]. Two shots that differ only in background colour count as one; the platforms treat near-copies the same way in ads [MCR-0022].

### 3. Make the images

Pick a path per shot:

- **Phone shoot (free):** window light, a plain sheet, a tripod or a stack of books; shoot every planned angle.
- **Composite:** real product cutout on a generated or stock background, with a matching shadow.
- **AI scene:** only where gate 2 allows; the real photo is attached as the reference for every single image. Never use an AI-made image as the reference for the next one; errors compound.

Every still: no text, logos, watermarks or price; type is added later if a file becomes an ad. No AI-made person is shown as a customer.

### 4. Check every still and make the contact sheet

Compare each image's product with the real photo at 3 times magnification: label, colour, shape, proportions, parts. Remove any image with extra products, warped labels or invented variants. Build a contact sheet (a grid of all stills, free with ImageMagick `montage` or any editor) and check the pack reads as one shoot.

### 5. Cut the montage

- **Order:** open on the product in use or the hero, since the first frame must show the topic [ORG-0017]; end on the clean hero.
- **Pace:** hold each still about 0.4 to 0.6 seconds (practitioner default, test it). Do not go faster than about three changes a second where frames differ sharply in brightness; that is the WCAG flash threshold, and fast high-contrast cuts can harm viewers with photosensitive epilepsy. Check the final file with a free flash analysis tool such as PEAT.
- **Length:** about 6 to 15 seconds.
- **Build:** ffmpeg (free) from the ordered stills, H.264, 30 fps, AAC audio at 128 kbps or more.
- **Ad versions only:** an optional last frame with product name and price set in real type, matching the live page.

### 6. Export per platform

| Use | Size (px) |
|---|---|
| Reels, TikTok, Stories, Shorts | 1080 x 1920 |
| Instagram and Facebook feed | 1080 x 1350 |
| Square placements | 1080 x 1080 |
| YouTube landscape | 1920 x 1080 |

Re-frame each size from the stills; do not stretch. On 9:16, keep the product clear of the bottom caption band and side buttons. Export each size twice: silent and with music.

### 7. Clear the music

Use the first source that fits, and record it:

1. **The platform's own library for that platform:** Meta Sound Collection for Facebook and Instagram, TikTok's Commercial Music Library for business accounts and ads, YouTube Audio Library for YouTube. A track cleared on one platform is not cleared on another.
2. **Tracks the store has licensed** with rights for ads and social, licence file kept.
3. **Free music sites** only where the licence allows commercial use in ads: no NonCommercial, no NoDerivatives, attribution added where required.

Never use popular songs from a personal account's sound list in business posts or ads. Write `SOURCES.txt`: file, track, artist, source URL, licence name and link, platforms allowed, attribution line, date checked.

### 8. Hand over for posting

- Post natively in each app rather than through a scheduler where reach matters; one programme found schedulers cut reach [ORG-0013], though large teams may still choose them for time.
- If an organic post gets about 5 times the account's usual views, it is a candidate for ads, run as-is or with its opening reused; check usage rights first [ORG-0035].
- Label AI-made scenes as each platform's rules require.

## Checks before you hand it over

1. Every image's product matches the real photo at 3 times magnification.
2. The real photo, not an AI image, was the reference for every generated image.
3. No still contains text, logos, watermarks or prices.
4. Each image has a job (ad, organic, gallery), and no two are colour swaps of each other.
5. The montage holds frames long enough to stay under three sharp changes a second and passed a flash check.
6. Every platform size exists in silent and music versions, framed, not stretched.
7. Every track's licence allows business use on the platform it is used on, recorded in `SOURCES.txt`.
8. Nothing was posted or advertised without the owner's yes.

## Output

1. **One-screen summary:** images delivered, the three strongest and their jobs, montage length, music chosen and where it is cleared.
2. **Art direction profile** (one paragraph).
3. **Shot table:** file, shot type, job, path (phone, composite, AI scene), fidelity pass, AI used (yes or no).
4. **Contact sheet** PNG.
5. **Montage files:** per size, silent and with music, named `<sku>_montage_<width>x<height>_<music|silent>.mp4`.
6. **`SOURCES.txt`** for music.
7. **To confirm:** any image the owner must approve before public use.

## Common mistakes

- **Chaining AI images.** Step 3 uses the real photo as the reference every time.
- **Fifteen backgrounds, one shot.** Step 2 gives each image a job.
- **Cuts so fast they flash.** Step 5 sets a safe pace and a flash check.
- **One 9:16 file for every platform.** Step 6 exports each size.
- **A trending song in a business ad.** Step 7 uses licensed sources per platform.
- **AI people passed off as customers.** Step 3 forbids it.

## Sources

- [LPG-0060]: shoppers swipe the whole product gallery more than they scroll the page.
- [MCR-0022]: a colour or pose change is not a new ad.
- [ORG-0017]: the first frame must show the topic.
- [ORG-0013]: post natively; schedulers cut reach in one programme.
- [ORG-0035]: an organic post at about 5 times usual views belongs in ads, with usage rights.

Platform documentation: Meta Sound Collection, TikTok Commercial Music Library and YouTube Audio Library terms; platform video specs and AI labels; WCAG 2.3.1 three flashes threshold.

What makes this skill ours: the real product photo is the reference for every image, so errors never compound; each image is planned for a job, including the product page gallery; the montage pace respects the flash threshold and is checked; music is cleared per platform with a sources file.
