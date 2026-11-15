---
name: image-and-video-speed-pass
description: "Cuts the page weight of a store's images and videos without making products look worse. Finds the heaviest images and videos on the key templates, checks how the theme requests them (sizes, srcset, lazy loading, the first image's priority, set dimensions), and hands over a one-page file rules sheet for uploads, a ranked offender list with the fix for each, theme settings or code changes for a theme copy, and a side-by-side quality check on a phone. Free tools only, with Shopify's own limits and automatic WebP and AVIF taken into account. Use when images dominate page weight, before a catalog or photo refresh, or when hero videos slow the home page."
---

# Image and video speed pass

**You get:** a one-page media rules sheet (upload size, file weight targets, formats, video rules) the team and photographers follow from now on, an offender list of the heaviest images and videos on the 5 key templates with the fix for each, the theme changes for an unpublished copy, a re-export plan for existing files, and before and after page weight with a quality check on a phone.

## When to use

- Speed tests show images or video as most of the page weight.
- The hero is a slideshow or autoplay video and the home page loads slowly on phones.
- A photo shoot or catalog refresh is coming and file rules are needed before upload.
- Product pages carry 15 or more large images, GIFs or several embedded videos.

## Not for

- Retouching, crops and visual consistency of product photos: use `product-photo-retouch-and-consistency`.
- Which images a product gallery needs: use `pdp-image-gallery-rebuild`.
- Alt text for images: use `write-image-alt-text-at-scale`.
- A full speed audit including apps and scripts: use `shopify-speed-audit-and-fix-list`.

## What you need

Required:

1. **Live store URL** and the 5 key templates (home, top collection, top product, top landing page, a blog or story page if it gets traffic).
2. **Theme access** to read code and duplicate the theme (draft access, level 2).
3. **The original image files** or access to where they are kept, so re-exports start from masters, not from already-compressed web copies.
4. **List of videos:** hero videos, product videos (Shopify-hosted or YouTube or Vimeo), GIFs.

Optional: the photographer's export settings, the product image count per product (from a product export), field Core Web Vitals per template.

Measuring needs read access (level 1). Replacing files and editing the theme copy needs draft access. Publishing the theme or replacing live product media needs the client's yes.

## Before you start: the gates

1. **Masters exist.** Re-exports must come from the original files. If only web copies exist, keep their size and change only how the theme requests them; do not recompress already-compressed files again and again [SPD-0002].
2. **Looks must not drop.** Every change passes a side-by-side check on a phone at 2x zoom (Step 7). A lighter image that makes the product look worse fails.
3. **Theme copy only.** Code changes are made and measured on a duplicate theme.
4. **Know what Shopify already does.** Shopify serves WebP or AVIF automatically to browsers that support them and resizes on request, but does not compress on upload; uploads are capped at 20 MB and 20 megapixels [SPD-6184]. The gains come from sensible upload sizes and how the theme asks for each image.

## Steps

### 1. Find the heaviest media

For each template, on mobile settings:

- Chrome DevTools Network panel, filter to images and media, sort by size. List every file over 150 KB as served.
- PageSpeed Insights lab audits for properly sized images, efficient encoding, offscreen images and the LCP element.
- Note the LCP element per template; on most stores it is the hero or the first product image.

### 2. Check how the theme requests images

For each image slot (hero, collection card, product main image, thumbnails, content images):

- **Right size requested:** the theme should ask Shopify for a width close to twice the displayed size on a phone (for crisp screens), using srcset so phones get smaller files. Images sized at about twice their rendered size are the usual target [SPD-0013].
- **Lazy loading:** below-the-fold images lazy-load; the hero and first product image never do, and they load early with high fetch priority, since a lazy or faded-in hero is the most common slow-LCP cause on Shopify [SPD-0006].
- **Set width and height** (or aspect ratio) on every image so the layout does not jump.
- **Slideshows:** only the first slide loads eagerly; a static hero usually beats a slider for speed.

### 2b. Fix the first-screen image (when it is the LCP element)

Run this when lab diagnostics name an image as the LCP element and LCP is over 2.5 seconds. If the LCP element is text, or the server response is over about 0.8 seconds, image work will not fix it alone: say so and hand the rest to `shopify-speed-audit-and-fix-list`.

1. **One eager image per template.** The hero, the first slide, the logo and the first product image are never lazy. Set `loading="eager"` and `fetchpriority="high"` on the single LCP image; lazy-load everything below the fold. Making extra images eager slows the real one and wastes mobile data.
2. **Loops pick the first item in Liquid.** In a slider or product grid, wrap the loading and fetch priority attributes in a test on `forloop.first` (or `forloop.index == 1`), so only the first item is eager and the rest are lazy, whatever the owner adds later.
3. **Remove entrance effects on that image.** Fade-in, slide-in and placeholder loaders make the browser wait for an effects script before it shows the picture.
4. **Preload it.** Add one preload link in the theme head per template, written in Liquid so it picks the right file: the product's featured image on product templates, the section's image setting on the home page. One preload per template, never a list.
5. **Gallery scripts.** If a gallery plugin needs JavaScript before the first image appears, the LCP is late even when the file arrived early. Render the first image as plain HTML and let the gallery start after.
6. **Serve fitted sizes.** Use the theme's image filters with widths or a srcset, never the master file.
7. **Test it slow.** Throttle to slow 4G with the cache off, then run PageSpeed three times and take the median. Check that below-the-fold images still lazy-load and that the gallery, add to cart and checkout still work.

### 3. Write the media rules sheet

| Item | Rule |
|---|---|
| Product images, upload | Square or 4:5, about 2048 px on the long side (Shopify's guidance for square images [SPD-6185]); compress before upload to under about 500 KB, ideally 100 to 200 KB [SPD-0008] |
| Served size, product image on mobile | Under about 100 KB [SPD-0002] |
| Hero banner | Upload about 2400 px wide for full-width desktop, a separate cropped mobile version; served under about 200 KB [SPD-0002] |
| Format | JPEG or WebP for photos; PNG only for graphics with transparency; SVG for logos and icons; no camera originals, no TIFF or BMP |
| Text in images | Avoid where possible; text belongs in the page |
| GIFs | Replace with short muted video or a still; Shopify converts GIFs to animated WebP, which can still be heavy [SPD-6184] |
| Product video | Shopify-hosted, short (under about 30 seconds, practitioner default), muted, with a poster image; Shopify accepts up to 10 minutes, 1 GB and 4K, but that is a ceiling, not a target [SPD-6185] |
| Embedded YouTube or Vimeo | Click-to-load thumbnail instead of a full player; saves close to a megabyte per player [SPD-0010] |
| Hero video | Poster image first; no autoplay on mobile, or a short silent loop compressed hard, with a still fallback |
| File names | Descriptive, lowercase, hyphens (helps search and the team) |
| Images per product | Only images that answer a buyer question; usually 6 to 10 |

Free tools for re-export: Squoosh in the browser for single files; ImageMagick or ffmpeg for batches.

### 4. Rank the offenders

For each file over the targets: bytes saved (current served size minus target) x sessions loading that template a month. Fix the LCP image on each template first, then the biggest savings on the most visited templates.

### 5. Fix existing files

- Re-export oversized product images from masters at the upload rule and replace them (on the product, keeping order and alt text).
- Replace the hero with a correctly sized desktop and mobile pair.
- Convert GIFs and replace autoplay embeds.
- Remove duplicate or unused images in theme sections.

Batch the work by collection, starting with the products that get the most sessions.

### 6. Apply theme changes on the copy

Set image width requests and srcset per slot, eager loading and high priority for the first image, lazy loading below the fold, width and height on images, click-to-load video embeds, and poster images. Measure the copy with 3 lab runs per template (median).

### 7. Check quality side by side

On a real phone, compare old and new for 10 products and the hero: colour, sharpness at 2x pinch-zoom, texture detail (fabric, finish), and any banding in gradients. If a product type (jewellery, textiles, art) loses detail, raise its quality setting or size for that type only and note the exception in the rules sheet.

### 8. Market notes

- **Mobile-first markets (much of Asia, Africa and Latin America):** many buyers browse on slow mobile data and smaller screens; serve mobile-specific hero crops and keep product pages under about 2 MB total (practitioner default). Avoid autoplay video entirely on mobile.
- **US:** larger screens and fast connections hide the problem on desktop; judge on mobile field data, since the target is LCP 2.5 seconds or less at the 75th percentile on mobile and desktop separately [SPD-6183].

## Checks before you hand it over

- The 5 templates have a list of every media file over 150 KB served, with the LCP element marked.
- The rules sheet covers upload size, served targets, formats, GIFs, product video, embeds and hero video.
- The hero and first product image load eagerly; below-the-fold images lazy-load.
- Every image has set dimensions or aspect ratio.
- Re-exports come from masters, not recompressed web copies.
- Before and after page weight and lab LCP are shown per template.
- The side-by-side phone quality check passed, with exceptions noted.
- Each template has exactly one eager, high-priority image and one preload line, and slider loops make only the first item eager.
- No fade-in or loader effect remains on any LCP image.
- No live media or theme change without the client's yes.

## Output

**One-screen summary:** page weight and lab LCP before and after for each template, number of files fixed, and the rules sheet to share with the team.

**Media rules sheet** (as in Step 3, one page, for photographers and staff).

**Offender list:**

| Template | File | Slot | Served size (KB) | Dimensions served / displayed | Target | Fix | Sessions a month | Bytes saved x sessions | Status |
|---|---|---|---|---|---|---|---|---|---|

**Theme change list:** File, Change, Slot, Tested on copy, Approved.

**Before and after:** Template, Page weight, Image bytes, Lab LCP median, Field LCP re-read date.

## Common mistakes

- **Lazy-loading the hero.** Step 2 loads it eagerly with high priority.
- **Uploading camera originals.** The rules sheet sets an upload size and weight.
- **Recompressing web copies.** Gate 1 starts from masters.
- **Converting everything to WebP by hand on Shopify.** Gate 4 notes Shopify already serves modern formats; the theme's size requests matter more.
- **Shrinking files until the product looks cheap.** Step 7 checks quality on a phone.
- **Full video players everywhere.** The rules sheet uses posters and click-to-load embeds.

## Sources

- SPD-0002: images first; under 100 KB product, 200 KB hero; no repeated compression.
- SPD-0006: lazy-loaded hero is the most common slow LCP cause.
- SPD-0008: upload about 2,000 px wide, ideally 100 to 200 KB.
- SPD-0010: click-to-load video saves close to a megabyte.
- SPD-0013: size images at twice their rendered size.
- SPD-6183: Core Web Vitals thresholds at the 75th percentile.
- SPD-6184: Shopify upload limits; automatic WebP and AVIF.
- SPD-6185: Shopify product media: 2048 px square, video limits.

What makes this skill ours: upload rules and served-size targets are kept apart, because Shopify already resizes and serves modern formats; the first image on each template is set to load early while the rest wait; every re-export starts from masters; and no file ships until it passes a side-by-side check on a real phone, with exceptions written into the rules for detail-heavy products.
