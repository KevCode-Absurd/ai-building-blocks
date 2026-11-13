---
name: store-meta-ad-images
description: "Make Meta ad images for an online store that show the real product, the real logo and the real price. Works with any image tool or none: a manual design brief path for Canva, Figma or a designer, an AI path where AI makes only the scene and the real product photo is placed in, or Meta's own creative tools with each enhancement reviewed. Every image passes a product fidelity check (label, colour, shape and size match the real product), a claims check against what the store can prove, and a size check for feed 4:5 and Stories and Reels 9:16 with Meta's safe zones. Use it after concepts are written, when ads need new statics, or before a sale."
---

# Meta ad images that show the real product

**You get:** Meta ad image files that show the real product, logo and price, in a folder per concept, with an asset manifest, designer briefs where needed and a short list for the owner to confirm.

A store's ad image makes a promise about a physical thing the buyer will hold. If the label, colour or size in the ad differs from what arrives, the store pays twice: in returns that eat gross profit, and in trust. This skill makes images that sell the product as it really is, on any tool or none.

## When to use

- Concepts and visual briefs from `store-meta-concepts` are ready and need images.
- The account needs fresh statics for new concepts.
- A sale or launch needs offer images with the correct price and dates.
- An AI-made ad image is about to go live and nobody has checked it against the real product.

## Not for

- Deciding what the ads should say: use `store-meta-concepts`.
- New product photos (studio, in use, lifestyle) for ads and the product page: use `store-meta-product-photos`.
- Reviewing live creative for fatigue and format mix: use `store-meta-creative-review`.
- Checking the page the ad sends people to: use `store-meta-landing`.

## What you need

**Required**

- `campaign-brief.md` from `store-meta-concepts`: concept IDs, copy, visual briefs, landing pages.
- From `brand-profile.json`: the product truth set (real photos of every product and variant, with notes on label, colours, shape, size and box contents), logo file, brand colours and fonts, claims allowed and banned, proof table.
- The live product page for each product, opened today: price, compare-at price, offer terms, stock.

**Optional**

- Original logo (SVG or high-resolution PNG) and brand guide.
- Cut-out product photos (transparent PNG), or high-resolution originals to cut out.
- The image tool the store already uses, and the owner's limit on paid generation.

**When something is missing.** No real photo of a product or variant: do not make an ad of it; ask once for photos or run `store-meta-product-photos`. No logo file: use the logo from the site header at its native size, never a redrawn one. No concepts: make a single smoke-test set (step 3) and label it as such.

**Access.** Level 1, read, to build images locally. Level 2, draft, only if the owner wants images uploaded to Ads Manager inside paused ads. Never publish. Never spend on a paid image tool without the owner's yes, with the number of images and their own plan's cost stated.

## Before you start: the gates

1. **The product earns money.** Each product shown is in Advertise status in the profile, with gross profit per purchase known. Fail: skip it and say why.
2. **The truth set covers it.** At least one sharp, true-colour photo of every variant shown. Fail: no image for that variant.
3. **Price and offer are verified today.** Price, currency, discount, dates and terms match the live page, with the capture date recorded. Fail: make the image without price or offer, or wait.
4. **Claims list exists.** Every word you might put on an image can be checked against claims allowed. Fail: images carry product and logo only.

## Steps

### 1. Pick the path for each image

| Path | Use when | The rule |
|---|---|---|
| A. Manual design | No AI tool, or the owner prefers it. Default. | Build in Canva, Figma, Photoshop or a phone editor from the brief in step 6, or hand the brief to a designer |
| B. AI scene plus real product | The concept needs a setting the store has no photo of | AI makes the background and light only; the real product photo is placed on top |
| C. Meta's creative tools | The owner wants Advantage+ creative enhancements or Meta's generated backgrounds | Review each enhancement on each ad before it runs; switch off any that change the product or add text the store did not write |

Whatever the path: product pixels come from a real photo, and the logo, price and words are set as real files and live text in the layout tool. Image generators misspell text and redraw labels, so never ask one for a logo, a price or a product.

### 2. Lay out for each placement

- **Feed, 4:5, 1080 x 1350.** Meta recommends 4:5 for mobile feed. Keep important items about 5% in from every edge.
- **Stories and Reels, 9:16, 1080 x 1920.** Meta's Reels safe-zone guidance keeps text, logo and product out of roughly the top 14% (about 270 px) and bottom 35% (about 670 px), and about 6% in from each side, where the profile name, caption and button sit. Check the current template in Ads Manager. Build 9:16 as its own layout; never stretch or pad the 4:5.
- **Carousel or catalogue, 1:1, 1080 x 1080**, only when the concept calls for it.

Practitioner defaults, test them: the product fills about a third of the frame or more and is recognisable at phone size; on-image text is one short line plus price or offer; one message per image. Meta dropped its old 20% text rule, but its guidance still favours less text.

### 3. Build each image from its brief

- **Show the product the buyer will receive:** the linked variant, at an honest scale, with only what is in the box.
- **Make the message clear or deliberately curious, never vague** [MCR-0019]. A curious static must go to a page that explains.
- **Proof as real elements:** star rating with review count and capture date; a review quote with the reviewer's name only if permission is confirmed; press logos only with the outlet's actual quote [LPG-0037].
- **Price and offer exactly as on the live page**, with currency. Show the saving as whichever is larger, money or percent, and only against a genuine prior price [OFF-0017].
- **Variations that teach something.** A new background colour or pose is not a new concept [MCR-0022]. Spread effort across real format changes (static, carousel, customer-photo frame), which Meta is more likely to treat as different ads [MCR-0078].
- **Cheap angle test.** When the concept is new, a plain product-on-white image with one bold line per angle is a quick first read [MCR-0075]. Rough native statics can beat polished work [MCR-0060], except for products that need motion to be understood.
- **Sensitive problems.** For a visible health or body concern, an illustration can show the problem without a graphic photo [MCR-0020]. Meta's health and personal attributes rules still apply.

### 4. Prompting on path B

Describe only the scene: surface, setting, light direction, colour temperature and camera angle matching the real product photo, with empty space where the product and text will go. Add "no text, no logos, no products, no people". Then place the cut-out product, match its shadow and colour temperature to the scene, and keep its size honest against nearby objects. If the tool can only regenerate the whole image, the result must pass step 5 or it is dropped.

### 5. Check product fidelity

Put each finished image beside the truth set photo on the same screen, zoomed to 100%. Pass or fail on each:

1. **Label:** every word spelled and placed as on the real pack.
2. **Colour:** product and pack colours look the same; sample a flat area and compare hex values with the real photo.
3. **Shape:** silhouette, proportions, caps, handles and parts match.
4. **Size:** scale against hands or objects is honest.
5. **Variant:** the shade, flavour or size shown is the one the ad links to.
6. **Contents:** nothing shown that is not in the box, and no added features.

One fail means redo or drop. An image that misleads about the product breaks consumer-protection rules in most markets and turns into returns, which come straight off gross profit per purchase [MEA-0023].

### 6. Check claims and policy

- Every word, number and badge on the image is in claims allowed, with its source.
- No fake buttons, play icons or notifications; Meta's Advertising Standards reject ads that show functions that do not exist.
- No before-and-after images for health or weight concepts, and no copy implying the viewer has a condition.
- Never present an AI-made person as a customer, a reviewer or user content.
- If Meta labels an ad as made with AI ("AI info"), leave the label alone and follow Meta's current disclosure settings.

### 7. Export and name

Export at exact pixel sizes, sRGB, JPG or PNG, under Meta's 30 MB image limit. Name files `{concept-id}_{placement}_{width}x{height}_v{n}.jpg`. Confirm sizes in any image viewer's properties or with a short script.

For path A with no designer on hand, write a one-page design brief per concept: concept ID, size, product photo file, logo file, colours, fonts, headline (with character count), price and offer (with capture date), proof element, safe zones, and the fidelity checklist from step 5.

## Checks before you hand it over

1. Every product image passes all six fidelity checks against the truth set.
2. The logo is the real file, not redrawn or generated.
3. Price, offer and dates match the live page, with the capture date in the manifest.
4. Every word on every image is in claims allowed.
5. On 9:16 images, nothing important sits in the top 14%, bottom 35% or side 6%.
6. Each concept has a 4:5 and a 9:16 version, at exact pixel sizes.
7. No AI-made person is shown as a customer, and no text was made by an image generator.
8. No paid generation ran without the owner's yes, and nothing was published.
9. Viewed at phone width (about 360 pixels), every word and the logo read at a glance, with at least 4.5:1 contrast against what sits right behind them, and no dark band, vignette or overlay the brief did not ask for. Fail: redo the background or set the text in a design tool.

## Output

1. **One-screen summary:** images made per concept, which passed, which were dropped and why, anything waiting on the owner.
2. **Asset manifest table:** file, concept ID, placement, width x height, path (A, B or C), product photo used, fidelity pass, claims pass, safe-zone pass, price capture date.
3. **The image files** in `ad-assets/{concept-id}/`.
4. **Design briefs** for any image left to a designer.
5. **To confirm:** reviewer permissions, compare-at prices, any Meta enhancement the owner must approve.

## Common mistakes

- **The AI redraws the product.** The label comes out misspelled or the colour drifts. Step 1 keeps product pixels real and step 5 catches drift.
- **A price from an old screenshot.** Gate 3 rechecks the live page on the day.
- **Text under the Reels caption.** Step 2 keeps the bottom 35% clear.
- **A star rating with no count or date.** Step 3 shows both, or no rating.
- **Ten colour versions counted as ten tests.** Step 3 varies format and proof instead.
- **A 9:16 made by stretching the 4:5.** Step 2 builds each size as its own layout.
- **Spending on generation without a yes.** The access rules require the owner's approval with the count and cost.

## Sources

- [MCR-0019]: statics must be clear or deliberately curious.
- [LPG-0037]: press logos need the outlet's quote; reviews need name and source.
- [OFF-0017]: show the larger of money or percent saved; genuine prior price only.
- [MCR-0022]: a new colour or pose is not a new ad.
- [MCR-0078]: near-duplicate ads share one entity; format can count as new.
- [MCR-0075]: product-on-white smoke test per angle.
- [MCR-0060]: rough native statics can beat polished video.
- [MCR-0020]: illustration for sensitive problems, policies still apply.
- [MEA-0023]: returns and fees cut true gross margin.

Meta documentation: Ads Guide image sizes and ratios, Reels safe-zone guidance, Advertising Standards (nonexistent functionality, personal attributes, health before-and-after), AI disclosure labels, 30 MB image limit.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: works with any image tool or none, including a manual design brief path, instead of requiring one paid generator; keeps the real product, logo and price in every image and checks fidelity against the store's own photos; checks every word on the image against what the store can prove; uses Meta's own safe zones and never spends or publishes without the owner's yes.
