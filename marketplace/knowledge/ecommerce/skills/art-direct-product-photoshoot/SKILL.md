---
name: art-direct-product-photoshoot
description: "Plans a one-day product photoshoot a photographer can run without a call: a shot list of 30 to 50 frames, each tied to where it will be used (product page gallery, Shopping feed, Meta 4:5 and 9:16, email, homepage), with props, set, lighting setup, model and casting brief, a timed run-of-day, file and naming specs, and a sign-off sheet. Prioritises shots by the products that earn the most gross profit and the buyer doubts the images must answer. Use before booking a photographer or studio, before a launch, or when the store's images are mismatched or missing key shots."
---

# Product photoshoot shot list and art direction

**You get:** a shoot pack for one day: a numbered shot list of 30 to 50 frames mapped to their channel and slot, a props and set list, a lighting plan, a model and casting brief, a timed run-of-day, file delivery specs, and model and usage release checklists, ready to send to a photographer.

## When to use

- The store is booking a photographer or studio day and wants every hour to produce usable images.
- A new product or range launches and needs page, feed, ad and email images in one go.
- Images across the site are mismatched, or key shots (scale, in use, what is in the box) are missing.
- A creative director needs to brief an outside photographer clearly.

## Not for

- A phone or home shoot on a small budget: use `lifestyle-photos-without-a-studio`.
- Generated or composited campaign images: use `campaign-photo-set`.
- Deciding the visual look first: use `brand-moodboard-for-shoots`.
- Rebuilding one product page gallery from buyer doubts: use `pdp-image-gallery-rebuild`.
- Editing and exporting the photos after the shoot: use `product-photo-retouch-and-consistency`.

## What you need

Required:

1. **Product list for the shoot** with variants, quantities on hand for the day and any fragile or perishable items.
2. **Gross profit per product and units sold last 90 days** (Shopify sales by product report plus `build-sku-profit-sheet`), to rank which products get the most frames.
3. **Buyer doubts:** top questions from reviews, support tickets and returns (size, texture, what is in the box, how it is used).
4. **Current image audit:** what each product already has, from `product-image-library-by-channel` or a quick gallery review.
5. **The moodboard and do-and-don't sheet** (`brand-moodboard-for-shoots`) and brand colours (`store-visual-identity-sheet`).
6. **Budget and date**, with photographer, studio, model and prop costs.

Optional: best-performing ads and their images, competitor galleries for gaps.

This is a planning job (read access). Booking people or spending money is the client's decision; the pack goes to the client to approve.

## Before you start: the gates

1. **Cash and value.** The shoot cost divided by the products shot gives a cost per product. Pass when the products in the top rank carry enough gross profit per order and volume to justify it. Fail: cut the list to the top products or switch to `lifestyle-photos-without-a-studio`.
2. **Samples are ready.** Every product on the list is on hand in its final packaging, clean and in the exact variants sold. Fail: drop the product; shooting a pre-production sample creates images that do not match what arrives.
3. **Rights are clear.** Model release, location release if not a studio, and a usage licence from the photographer that covers ads, site, marketplaces and email, for an agreed term, in writing. Fail: no shoot.
4. **Channel rules are known.** Google's main product image must be clean, with no overlays, watermarks, borders or added logos, at least 500 x 500 from 31 January 2027 and about 1500 x 1500 recommended, with the product filling 75 to 90% [GAD-6043].

## Steps

### 1. Rank the products

Sort products by gross profit per order times expected orders. The top third get the full set; the middle get core shots only; the bottom get the plain feed shot or are left for later.

### 2. Map shots to uses

For each product, fill slots by the job they do, not by habit:

| Slot | Job | Spec |
|---|---|---|
| Feed main image | identify the exact variant | plain light background, product fills 75 to 90%, no props [GAD-6043] |
| Gallery: scale | how big is it | in hand or next to a known object |
| Gallery: detail | texture, material, finish | macro, raking light |
| Gallery: what is in the box | contents | flat lay of everything included |
| Gallery: in use | how it works | hands or model using it |
| Gallery: doubt answer | the top buyer doubt | e.g. fits in a carry-on, side view of thickness |
| Lifestyle | who it is for | product in the buyer's real setting |
| Ad 4:5 and 9:16 | stop the scroll | vertical framing, space above the product for words |
| Email and homepage | wide banners | landscape with empty space on one side for text |

More shoppers swipe through the gallery than scroll the whole page, so the gallery works as a mini landing page [LPG-0060]. On mobile, thumbnails show [LPG-0034], so each gallery image must read at thumbnail size.

### 3. Write the shot list

Each line: shot number, product and variant, slot, framing (ratio and angle), set and props, light setup, model or hands, notes, priority (must, should, nice). Aim for 30 to 50 finished frames in a day: practitioner default, about 6 to 10 setups, each producing several frames. Group by setup, not by product, so the light changes as few times as possible.

Shoot vertical frames with room: for 9:16 use, keep the product and key detail out of the top 14%, bottom 35% and side 6% bands where Meta places its buttons [MCR-6040]. Shoot wide enough that 4:5, 1:1 and 9:16 crops each work, or shoot each ratio separately.

### 4. Set, props and lighting

- **Feed and detail:** seamless white or light grey, one large soft key light, a fill card, consistent camera height and lens for every product so the set matches.
- **Lifestyle:** one or two real settings that match the buyer, not the photographer's taste. Props are things the buyer owns; no prop draws the eye more than the product.
- **Colour accuracy:** a grey card or colour checker in the first frame of each setup, and the real product beside the screen when checking colour.
- Write each light setup as a simple diagram: key position, modifier, fill, background light.

### 5. Model and casting brief

Cast people who look like the store's real buyers, from customer data and reviews, not only the photographer's agency picks. A niche buyer only works when photos speak to that buyer too [AVT-0015]. Keep the product and brand in the same frame as any model, so attention lands on what is sold, not only on the person. Brief wardrobe in plain colours that do not fight the product; list sizes needed for apparel.

### 6. Run-of-day

Write a timed plan: setup, product order, model hours, lunch, reshoot buffer (practitioner default, keep about 1 hour), and a 15-minute check every two hours where the art director reviews frames on a laptop at full size against the shot list.

### 7. Delivery specs

- RAW plus full-size JPG, sRGB, at least 3000 px on the long side.
- Feed images square or as the platform asks, product filling 75 to 90% [GAD-6043].
- Web exports later compressed to about 2,000 px and under 500 KB, ideally 100 to 200 KB [SPD-0008].
- File name: `<sku>_<slot>_<ratio>_<shot#>.jpg`.
- Selects within 3 days, retouched finals per `product-photo-retouch-and-consistency`.

### Market notes

- **Marketplaces:** if the store sells on Amazon, Walmart, Etsy, eBay, Zalando or another marketplace, check each one's main image rules (most want a white background; Amazon main images need a pure white background); plan and shoot those frames per product on the day.
- **Seasonal frames:** lifestyle frames for the store's peak seasons (Christmas, Black Friday gifting, Lunar New Year, weddings, local festivals) need props and wardrobe that are right for the market and region shown.

## Checks before you hand it over

- Every product in the top third has a feed image, scale, detail, contents, in use and doubt-answer shot.
- Each shot names its channel, slot and ratio.
- The feed main image has no props, text, borders or logos.
- Vertical frames leave the safe bands clear.
- Casting matches the real buyer data.
- Model, location and usage releases are on the checklist with the term and channels written.
- The run-of-day fits the hours booked with a reshoot buffer.
- Cost per product is shown and the client has approved the budget.

## Output

**One-screen summary:** date, products and how many frames each, total frames, budget and cost per product, the three shots that matter most, open questions.

**Shot list:**

| # | Product and variant | Slot | Channel | Ratio | Angle and framing | Set and props | Light setup | Model or hands | Priority | Done |
|---|---|---|---|---|---|---|---|---|---|---|

**Props and set list:** item, source (own, buy, borrow), shot numbers, owner.

**Lighting plan:** setup letter, diagram, shots that use it.

**Casting brief:** buyer group, age range, look, sizes, wardrobe, number of models, hours.

**Run-of-day:** time, setup, shots, people needed.

**Release checklist:** model release, location release, photographer usage licence (channels, term, territory), signed by.

## Common mistakes

- **Equal frames for every product.** Step 1 spends the day on the products that earn the most.
- **Beautiful but useless frames.** Step 2 ties every shot to a slot and a job.
- **Props on the feed image.** Gate 4 and step 2 keep it clean [GAD-6043].
- **Horizontal-only shoot.** Step 3 plans vertical frames with safe bands.
- **Casting from the agency book.** Step 5 casts from the store's own buyers.
- **No usage licence.** Gate 3 makes it a hard stop.

## Sources

- GAD-6043: clean Google main image; sizes; product fills 75 to 90%.
- LPG-0060: the gallery works as a mini landing page.
- LPG-0034: mobile shows thumbnails; key info in the first screen.
- MCR-6040: Meta 9:16 safe bands.
- AVT-0015: a niche buyer needs photos that speak to them.
- SPD-0008: export about 2,000 px and compress.

What makes this skill ours: frames are spent by gross profit rank, not evenly; every shot is tied to a named channel slot and the buyer doubt it answers; vertical frames are composed for Meta's current safe bands on the day; and casting comes from the store's own buyers, with the usage licence a hard stop.

## Selling in India

- If the store sells on Amazon.in, Flipkart or Myntra, check each marketplace's main image rules and shoot those frames on the day.
- Festive frames (Diwali, weddings) need props and wardrobe right for the region shown.
