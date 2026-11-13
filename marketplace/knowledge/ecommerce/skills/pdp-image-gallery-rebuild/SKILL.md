---
name: pdp-image-gallery-rebuild
description: "Audits a product page's image gallery against the doubts real buyers have, mined from the store's own reviews, support tickets, survey answers and return reasons, then plans and builds a new gallery: which slots are missing, which image answers each doubt, and in what order, with finished images at 4:5 and 1:1 that stay true to the real product, keep the Shopping feed image clean and load fast. Delivers a review deck with before and after, upload-ready files and a test plan sized to the product's orders. Read access by default; uploading needs draft access and the client's yes. Use it for best sellers, high-traffic products with low add-to-cart, or before sending paid traffic to a product page."
---

# Product page gallery audit and rebuild

**You get:** a doubts table from reviews, tickets and returns, a gallery plan that answers each doubt in order, finished images in 4:5 and 1:1 folders, an alt text file and a review deck.

On a phone, more shoppers swipe through the whole image gallery than scroll the whole page [LPG-0060]. So the gallery is the sales pitch. This skill finds what buyers doubt, gives each doubt an image that answers it, and builds the gallery in the right order and sizes, on the real product.

## When to use

- A best seller or paid-traffic product page has many views and a low add-to-cart rate.
- Reviews, tickets or returns keep raising the same doubt (size, contents, feel, does it work).
- The gallery is a row of studio shots of the same thing.
- Before sending paid traffic to a product page.
- After a product change (new pack, colour or formula).

## Not for

- Shooting the product photos: use `store-meta-product-photos`, then return here to place them.
- The rest of the product page (copy, price, buy box): use `store-meta-landing` or `storefront-conversion-audit`.
- Ad images: use `store-meta-ad-images`.
- The product's full claim and objection file for all channels: use `product-claims-profile`; this skill can start from it.

## What you need

Required:

1. **The live product page URL**, opened at phone width, and the exact variant to rebuild.
2. **Buyer words**: reviews export (rating, title, body, date), support tickets about the product (6 to 12 months), post-purchase survey answers, and return or refund reasons from Shopify or the returns app.
3. **Product facts**: dimensions, weight, materials or ingredients, what is in the box, variants, care, delivery and returns policy, and any gift or bonus in the offer.
4. **Real photos** of the exact variant that the store owns, plus the logo file, brand colours and fonts (`store-visual-identity-sheet` or `store-meta-brand-dna`).
5. **Gross profit per purchase** and monthly orders for the product, from `store-meta-math` and Shopify.

Optional: GA4 product page numbers (Sessions, Add to cart rate, Purchase rate), heatmaps or recordings.

Access: read (level 1) for audit and build. Uploading to an unpublished product or duplicate template needs draft access (level 2). Publishing needs the client's yes.

Missing input: ask once. Without reviews or tickets, add the survey question in step 2 and mark the doubt list "assumed, check with buyers".

## Before you start: the gates

1. **Truth gate.** A real, usable photo of the exact variant exists. Every image must show the product as it ships: colour, size, texture, label words, contents. No lookalike, render or other size, even as a stand-in. If an image cannot show something truthfully, change the image idea, not the product. AI-made people are never shown as customers. Fail: get the photo first.
2. **Claims gate.** Every number or claim on an image has a source on file; certifications and press only if actually held. Fail: drop the claim.
3. **Money gate.** Gross profit per purchase known, so the test is worth sizing. Fail: build, but do not size the gain.
4. **Stock gate.** The variants shown are in stock. Fail: wait or switch product.

## Steps

### 1. Capture the real gallery and check it

Take the gallery from the rendered page, then compare it with a phone screenshot. Product exports and page scrapes mislead: the product file can hold extra page images or variant shots, and a scrape picks up menus, cross-sells and badges. Reject a capture whose alt texts read like links ("View ..."), whose sizes vary wildly, that shows no product, or that has fewer images than the screenshot.

### 2. Mine the doubts

Read by hand and copy exact words; automatic summaries lose the buyer's phrasing [AVT-0007]. Sources, strongest first: return and refund reasons; 1 to 3 star reviews; recent 4 and 5 star reviews with "I was worried", "I almost didn't", "turned out"; pre-purchase tickets; and the survey question "what almost stopped you buying today?" [CRO-0018] [LPG-0042], added now if missing.

Cluster the doubts. For each: the doubt in the buyer's words, count, type, three exact quotes. Score = count x severity (3 if it stops purchases or causes returns, 2 if it causes questions, 1 if minor).

### 3. Audit the current images

One row per image: what question it answers, true to product (yes or no), verdict (keep, redundant, low value, fix). Keep what works; the job is to fill gaps, not redo everything.

### 4. Route doubts to image types

| Doubt type | Image that answers it |
|---|---|
| Size and quantity | In hand or on body next to a known object, with dimensions; what is in the box, units fanned out and counted |
| Value and price | Contents and bonus laid out; cost per use or a sourced "replaces these" comparison |
| Quality and materials | Close-up of texture or material, cross-section, ingredient or spec panel |
| Use and routine | Numbered how-to in 3 or 4 steps; a named moment of use; how often to use it |
| Comparison | Side-by-side against an unbranded stand-in, one argument only |
| Distrust | Real reviews with name and source, certifications held, a named expert who consents |
| Risk | Delivery time, returns and guarantee as an image |

### 5. Set the order and length

- Slot 1: the product, clean, recognisable at thumbnail size.
- Slot 2: the highest-scoring doubt, because it is the first image an interested shopper opens.
- Then by the buyer's path: what it is and how it works, then proof, then the close (offer, bonus, risk). Proof can appear twice in different forms (a review quote and a rating count). A free gift or bonus gets its own image.
- 6 to 9 images in total; long galleries stop getting swiped (practitioner default, test it).
- Across a product range, keep one consistent slot 1 style.
- On mobile, show thumbnails so shoppers see there is more [LPG-0034].

### 6. Build the images

- **Photo first, words on top.** Make or choose the photo with no text in it; add headline, ticks, tables, badges and the real logo file in an editor or as HTML over it. Image generators misspell and silently change words, and text in its own layer can be edited per market and per test.
- **Each ratio built separately.** 4:5 at 1600 x 2000 and 1:1 at 2048 x 2048, with the text placed for each shape, never one cropped from the other.
- **Text:** one argument per image, a few large words readable on a 390 px wide phone; product kept clear of the text.
- **Proof:** real reviews quoted exactly with name and source; bare logos and anonymous quotes now read as fake [LPG-0037]. Use the real review count; going from none to about 80 reviews mattered most in one practitioner's stores [LPG-0062].
- **Feed safety:** Google Shopping rejects promotional text on the main image [GAD-0019]. Keep slot 1 free of text, or set a separate clean feed image in the Merchant Center feed.
- **Weight:** compress to well under 500 KB, ideally 100 to 200 KB [SPD-0008]; never lazy-load the first image [SPD-0002] [SPD-0006].
- **Names and alt text:** `01-hero_4x5.webp` in upload order; one plain alt sentence per image.
- **Any tool or none:** any image editor or generator works, with a real photo of the product as the reference; a free path is phone photos plus a free editor. A freelancer brief is the slot plan plus the doubt each image answers.

### 7. Check every image

At full size: words match the plan with no typos; every number traces to its source; all images side by side show the same colour and proportions; the in-hand shot beside the studio shot reads as the same object; no two images answer the same question; both ratios hold their text; text reads at 390 px; no stray borders. Expect to throw away some generated images.

### 8. Make the review deck and revise

One shareable deck or page: before and after first (current gallery with verdicts beside the new set in upload order); then a short "needs your answer" list (claims, offer wording, licences); then one section per slot with the doubt, quotes and counts, both ratios, every text line with its source, and what changed. Revise in rounds; nothing is uploaded while a revision is open.

### 9. Test the new gallery

Gate by the product's monthly orders [CRO-0011]:

- **Under about 300 orders a month:** ship after approval and compare 4 weeks before and after on add-to-cart rate and revenue per session, against a similar product left unchanged. A whole gallery is a big swing, which suits smaller stores [CRO-0019]. Practitioner default, test it.
- **300 or more:** A/B test old against new with any testing tool the store uses, for at least two full weeks [CRO-0015], on revenue per visitor and add-to-cart rate, with the sample size set before launch [CRO-0005]; no stopping early.

## Checks before you hand it over

- The captured gallery matches the live page screenshot.
- Every top doubt has a slot, with counts and exact quotes.
- Every image shows the real shipped variant; no AI person is shown as a customer.
- Every number and claim has a source; rivals are never named.
- Both ratios exist, built separately, named in upload order, each under 500 KB.
- Slot 1, or the feed image, carries no promotional text.
- The test plan matches monthly orders. Nothing is uploaded or published without the client's yes.

## Output

**One-screen summary first:** top doubts with counts, gaps in the current gallery, the new order, the test plan, and what the client must answer.

**Table "Doubts":** Doubt, Type, Example quote, Source, Count, Severity, Score, Slot.

**Table "Gallery plan":** Slot, Buyer question, Current image and verdict, New image, Text on image, Source for each claim, File names, Size in KB.

**Files:** `gallery-4x5/`, `gallery-1x1/`, `alt-text.csv`, and the review deck.

## Common mistakes

- **Trusting a scraped gallery.** Step 1 checks it against the live page.
- **Guessing objections.** Step 2 counts real words, return reasons first.
- **Text baked into a generated image.** Step 6 keeps words in their own layer.
- **Cropping one ratio into the other.** Each is built separately.
- **Text on the feed image** [GAD-0019].
- **Calling a winner too early.** Step 9 sets the bar before launch.

## Sources

- AVT-0007: read reviews by hand and keep exact words.
- CRO-0005, CRO-0011, CRO-0015, CRO-0019: test sizing, gating by orders, duration, big swings.
- CRO-0018, LPG-0042: ask what almost stopped them buying.
- GAD-0019: Shopping main image drives clicks and must stay clean.
- LPG-0034: thumbnails on mobile.
- LPG-0037, LPG-0062: proof with names and sources; review count.
- LPG-0060: the gallery as a mini landing page.
- SPD-0002, SPD-0006, SPD-0008: image weight and loading.

What makes this skill ours: every slot answers a counted doubt from the store's own returns, reviews, tickets and survey; the captured gallery is checked against the live page; words stay in their own layer so they are never misspelled; the feed image is protected; and the test is gated by the product's monthly orders.
