---
name: design-sale-banners-and-hero
description: "Designs one promotion's full banner set: homepage hero (desktop and mobile), announcement bar, collection banner, email header and ad statics, all built from one locked offer sheet so every banner says the same discount, terms, exclusions and end date word for word. Includes the banner build specs, a fast-loading hero (file size and loading rules), the swap-out plan for when the sale ends, and a pass or fail truth check against the live discount settings. Use before any sale, launch offer or seasonal promotion, or when site, email and ads showed different terms for the same offer."
---

# Sale banners and homepage hero

**You get:** a locked offer sheet plus 8 to 10 finished banner specs for one promotion (desktop hero, mobile hero, announcement bar, collection banner, email header, Meta 4:5 and 9:16 statics, and the post-sale replacement hero), with exact words, sizes, file limits and a swap-out schedule.

## When to use

- A sale, launch offer, festival or seasonal promotion is planned and needs site, email and ad banners.
- Last time the site said one thing, the email another and the ads a third.
- The homepage hero is slow or looks wrong on phones.
- A sale ended and banners or badges stayed up.

## Not for

- Deciding the discount depth or offer: use `how-deep-can-we-discount` or `offer-bundle-threshold-design` first.
- Writing the promotion emails: use `write-promo-campaign-email` or `write-sale-countdown-emails`.
- Writing sale ad copy beyond the banner words: use `write-sale-and-discount-ad-copy`.
- Choosing which products the homepage features: use `merchandise-homepage-and-collections`.

## What you need

Required:

1. **The approved offer:** discount type and depth, eligible products or collections, exclusions, minimum order, start and end date with time and time zone, code or automatic, and whether it stacks.
2. **Shopify discount settings** for the offer (Discounts page screenshot or export), so banners can be checked against what checkout will really do.
3. **Gross profit per order at the sale price** and the break-even return, from `store-meta-math` [OFF-0069].
4. **Brand files:** logo, fonts, colours (`store-visual-identity-sheet`), product photos.
5. **The theme's hero sizes:** the image dimensions the Shopify theme uses for desktop and mobile slides (in the theme editor or theme documentation).

Optional: last sale's banners and results, the email platform's header width.

Read access is enough to design. Uploading banners to the theme or email platform needs draft access (level 2): build in a duplicate theme or draft campaign, and the client publishes.

## Before you start: the gates

1. **The offer makes money.** Gross profit per order at the sale price and the break-even return are written down. A 25% sitewide cut on a 60% margin product can need about 50% higher return to hold profit [OFF-0005]. Fail: send it back to the offer owner.
2. **Stock and team can carry it.** Days of stock cover for the featured products last through the sale, and the warehouse can ship the expected volume. Fail: narrow the offer or the featured products.
3. **The discount is built and tested.** A test order in Shopify shows the discount applying exactly as the banners will say. Fail: no banner goes live.
4. **The "was" price is real.** Any compare-at price is a price the store genuinely charged. US and Indian consumer rules both treat invented reference prices as misleading; check with the client's adviser if unsure.

## Steps

### 1. Lock the offer sheet

Write one sheet every banner copies from. Nothing on any banner may say more or less than this sheet:

- **Offer line** (6 words or fewer): "25% off all serums".
- **Terms line:** "Ends 30 Nov, 11:59 pm IST. Excludes gift sets."
- **How to get it:** automatic, or code `NAME25`.
- **Who:** all customers, or new customers only.
- **End rule:** what happens at the end time (banners swap, discount expires).

Show the bigger of money saved or percent off, whichever looks larger for the typical order [OFF-0017]. Pick one and use it everywhere.

### 2. Build the banner set

| Banner | Size (build at) | Words on it | Rules |
|---|---|---|---|
| Desktop hero | theme size, often 1920 x 800 to 2400 x 1000 | offer line, terms line, one button | under 200 KB [SPD-0002] |
| Mobile hero | theme mobile size, often 750 x 900 to 1080 x 1350 | offer line, button | its own crop, not the desktop one shrunk; under 200 KB |
| Announcement bar | text, not an image | offer line plus end date | live text so it is readable and fast |
| Collection banner | theme size | offer line only | sits above the products, short |
| Email header | 600 wide (1200 for sharp screens) | offer line, end date | live text for the terms below the image, so it reads with images off |
| Meta feed | 1440 x 1800, 4:5 | offer line, product, terms | hand-off to `resize-ads-for-every-placement` for the other sizes |
| Meta Stories and Reels | 1440 x 2560, 9:16 | offer line, product | words outside 14% top, 35% bottom, 6% sides [MCR-6040] |
| Post-sale hero | same as desktop and mobile | evergreen message | ready before the sale starts |

Sizes marked "often" vary by theme; take the real numbers from the store's theme.

### 3. Make the hero do one job

- One offer, one button. The button names what happens: "Shop the serums".
- Headline at 3 to 4 times body text size, so with 16 px body copy, about 48 to 57 px on desktop [LPG-0010]. On mobile, make sure the offer line is readable without zooming at 375 px wide.
- Put words in live text over the image where the theme allows, not baked into the image; it loads faster, can be edited at the end time, and screen readers can read it.
- Test the headline first and the image second if the store tests heroes; above-the-fold changes carry the largest effects [LPG-0016].

### 4. Keep it fast

- Export WebP or JPG, hero under 200 KB, product images under 100 KB [SPD-0002].
- Upload about 2,000 px on the long side, 3,000 only for a full-width banner on big screens, and compress before upload [SPD-0008].
- Never lazy-load the first hero image; it should load eagerly with high priority [SPD-0006]. Check this in the theme or ask the developer.
- Hand any wider speed work to `image-and-video-speed-pass`.

### 5. No fake urgency

- A countdown timer shows the real end time and stops there. It never resets for a new visitor.
- "Last chance" only in the final 24 hours. "Selling fast" only with a stock number the store can show.
- If the sale is extended, all banners, emails and ads change the same hour and say "extended to".

### 6. Keep sale marks off product feed images

Do not put "SALE" stickers on product images that feed Google or Meta catalogs. Google disapproves promotional overlays on the main product image [GAD-6043]. Use the theme's sale badge on the site and catalog overlays for ads (`design-catalog-ad-overlays`).

### 7. Plan the swap-out

Write the hour-by-hour schedule: who swaps the hero, the announcement bar, the collection banner and email blocks at the end time, and who checks the discount has expired. Theme schedulers or a duplicate theme set to publish at a time are the free path; scheduling apps are optional. The post-sale hero is designed now, not on the morning after.

### 8. Truth check

Put every banner beside the offer sheet and the Shopify discount settings, and mark each line pass or fail: offer, terms, eligible products, code, end date and time zone.

### India and US notes

- **India:** show prices inclusive of GST; for packaged goods the selling price cannot exceed the MRP on the pack. Festive sales (Diwali, Navratri, Independence Day) run on IST; write the time zone. If COD has a fee or is off during the sale, the terms line says so. Regional-language banners need a native reader.
- **US:** write the time zone (ET or PT). Black Friday to Cyber Monday offers that change daily need one offer sheet per day.

## Checks before you hand it over

- Every banner's words match the offer sheet exactly; terms and end date appear on the hero, email and ads.
- A test checkout applied the discount as the banners describe.
- Hero files are under 200 KB and the first hero is not lazy-loaded.
- The mobile hero was built at its own size and read at 375 px wide.
- 9:16 statics keep words outside Meta's safe bands.
- No timer resets and no urgency line without proof.
- The post-sale hero and swap-out schedule exist, with names against each step.
- Nothing was published without the client's yes.

## Output

**One-screen summary:** the offer line, terms, dates, break-even return, banners delivered, swap-out time and owner, open questions.

**Offer sheet:** Offer line; Terms line; How to get it; Who; Eligible products; Exclusions; Start (date, time, zone); End (date, time, zone); Stacking; Gross profit per order at sale price; Break-even return.

**Banner spec table:**

| Banner | File name | Pixels | KB | Headline | Terms line | Button | Link | Live text or image | Pass |
|---|---|---|---|---|---|---|---|---|---|

**Swap-out schedule:**

| Time (zone) | Action | Where | Owner | Checked by |
|---|---|---|---|---|

## Common mistakes

- **Different words in different places.** Step 1 locks one offer sheet and step 8 checks each banner against it.
- **A beautiful 3 MB hero.** It slows the page buyers land on. Step 4 caps it at 200 KB [SPD-0002].
- **Desktop hero squeezed onto phones.** Step 2 builds the mobile hero at its own size.
- **Countdown that restarts.** Step 5 bans it.
- **Sale sticker on feed images.** Step 6 keeps them off [GAD-6043].
- **Banners left up after the sale.** Step 7 schedules the swap and the replacement before launch.

## Sources

- OFF-0005: sitewide discount raises the return needed to hold profit.
- OFF-0069: recompute break-even for every discount depth.
- OFF-0017: show the larger of money saved or percent off.
- LPG-0010: headline 3 to 4 times body size.
- LPG-0016: test the headline first, hero image second.
- SPD-0002: hero under 200 KB, product images under 100 KB.
- SPD-0006: never lazy-load the first hero image.
- SPD-0008: upload about 2,000 px and compress first.
- MCR-6040: Meta 9:16 safe area.
- GAD-6043: no promotional overlays on Google product images.

What makes this skill ours: one locked offer sheet feeds every banner and is checked against a real test checkout; the hero has a weight budget and loads first; the post-sale hero and swap-out times are made before the sale starts; and sale marks stay off the product images that feed Google and Meta.
