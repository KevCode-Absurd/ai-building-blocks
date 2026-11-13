# Wakefit memory foam mattress page: the first five tests

## Where the page loses buyers (last 30 days, test data)

| Step | Mobile | Desktop |
|---|---|---|
| Add to cart per session | 4.0% | 6.5% |
| Reached checkout per add to cart | 42.3% | 50.0% |
| Orders per checkout reached | 33.1% | 44.2% |
| Orders per session | 0.56% | 1.44% |

Mobile brings 84% of sessions but only 67% of orders. Fewer mobile shoppers add to cart, and fewer who reach checkout finish. At ₹14,500 per order and 42% margin, each order is worth about ₹6,090 in gross profit.

The ceiling, not a forecast: if mobile checkout finished at the desktop rate, mobile would gain about 790 orders a month, or ₹48 lakh gross profit. Part of any device gap is habit, not the page.

## How the tests are sized

- All five tests run on mobile only, which has about 14,000 sessions a day. Desktop (about 2,700 a day) is too small to read alone; roll winners out there afterwards.
- 50/50 split, randomised by visitor, 95% confidence (two-sided), 80% power. Run whole weeks only.
- Minimum detectable effect (MDE), as a relative change:

| Main metric | Mobile base | 2 weeks | 4 weeks |
|---|---|---|---|
| Add to cart per session | 4.0% | 6.2% | 4.4% |
| Orders per session | 0.56% | 16.9% | 11.9% |

Changes that act on the add-to-cart decision use add to cart and run 2 weeks. Changes whose effect lands at checkout use orders per session and run 4 weeks.

## The five tests, ranked

### 1. Two-step size picker
- **Problem:** 30+ size combinations sit in one long list. Shoppers scroll and decode dimensions before seeing a price.
- **Evidence:** mobile add to cart is 4.0% against 6.5% on desktop. It is the largest funnel gap, at exactly the step where size is chosen.
- **Change:** step one, pick bed type from large buttons (Single, Double, Queen, King). Step two, pick from the few standard sizes for that type, with "Custom size" last. The price updates as soon as a size is picked.
- **Hypothesis:** if shoppers pick size in two short steps, more will add to cart, because choosing is faster and they reach the price sooner.
- **Main metric:** add to cart per session. **Guardrails:** orders per session; size-related exchanges and returns (read later).
- **Split, length, MDE:** 50/50, 2 weeks, 6.2%. A win of that size that carries through to orders is about 146 orders, or ₹8.9 lakh gross profit a month.

### 2. Delivery date by pincode above Add to cart
- **Problem:** shoppers learn when the mattress will arrive only at checkout.
- **Evidence:** 67% of mobile shoppers who reach checkout leave without ordering (4,750 a month), against 56% on desktop. A timing surprise at that step is a likely cause.
- **Change:** a pincode box under the price that shows "Delivered by [date]". It carries the pincode into checkout and uses the same date source.
- **Hypothesis:** if shoppers see the delivery date before they add to cart, more will finish checkout, because their last open question is answered before they commit.
- **Main metric:** orders per session. **Guardrails:** add to cart per session (a long date may put some off); share of pincodes shown as not serviceable.
- **Split, length, MDE:** runs with Test 3 as one 2×2 (see below). 4 weeks, 11.9%. A win of that size is about 280 orders, or ₹17 lakh gross profit a month.

### 3. EMI and COD shown under the price
- **Problem:** ₹14,500 is a large one-time spend, yet EMI and cash on delivery appear only at checkout.
- **Evidence:** 58% of mobile add-to-carts never reach checkout, against 50% on desktop.
- **Change:** one line under the price: "EMI from ₹[lowest real monthly amount]/month" with a "See plans" link. Add a "Cash on delivery available" badge once the pincode is known and COD applies. Use only plans checkout actually offers.
- **Hypothesis:** if shoppers see the monthly cost and COD early, more will start and finish checkout, because the price feels smaller and paying feels safer.
- **Main metric:** orders per session. **Guardrails:** COD share of orders; cancelled and refused deliveries on COD orders (COD can lift orders but add return-to-origin cost); gross profit per session.
- **Split, length, MDE:** Tests 2 and 3 share one 2×2 split. Four groups of 25%: neither, date only, EMI/COD only, both. Each change is judged half against half, so each keeps the 11.9% MDE; the "both" group shows whether they clash.

### 4. 100-night trial next to Add to cart
- **Problem:** the strongest reason to risk buying a mattress unseen sits in the FAQ at the bottom of the page.
- **Evidence:** the trial is only in the FAQ, far below the buy button, and mobile add to cart is low at 4.0%. Assumption: most mobile visitors never scroll that far. Confirm with scroll-depth data.
- **Change:** one short line with an icon directly under Add to cart, such as "100-night trial. Not right? Return it." Link to the full terms. Match the wording to your real trial terms.
- **Hypothesis:** if shoppers see the trial at the moment of decision, more will add to cart, because a wrong choice feels less risky.
- **Main metric:** add to cart per session. **Guardrails:** orders per session; trial return requests in the first 30 days after delivery (full read after 100 nights).
- **Split, length, MDE:** 50/50, 2 weeks, 6.2%.

### 5. Product-first hero image
- **Problem:** the first image is a bedroom scene with the mattress small in frame. On a phone, shoppers cannot see what they are buying.
- **Evidence:** every mobile visitor sees this image first. The evidence is weaker than for tests 1 to 4, so it ranks last.
- **Change:** lead with a close-up of the mattress showing its layers and thickness. Move the bedroom scene to second place. Keep the image count the same.
- **Hypothesis:** if the first image shows the product clearly, more shoppers will add to cart, because they understand what they are buying sooner.
- **Main metric:** add to cart per session. **Guardrails:** hero load time (largest contentful paint); orders per session.
- **Split, length, MDE:** 50/50, 2 weeks, 6.2%. Runs alongside Test 1 with its own split, since it touches a different page area.

## Schedule (8 weeks)

| Weeks | Running on mobile |
|---|---|
| 1-2 | Test 1 (size picker) and Test 5 (hero), split independently |
| 3-6 | Tests 2 and 3 as one 2×2, on top of the winning picker |
| 7-8 | Test 4 (trial line) |

Test 5 ranks last but runs early because it costs no extra time. Avoid starting a test during a big sale; add a week if a sale swings traffic sharply.

## Decision rules
- Ship a change if its main metric wins at 95% confidence and orders per session is not lower than control.
- Do not peek and stop on a good day. Stop early only if a guardrail shows harm at 95% confidence.
- If a group's traffic share is more than 1% off plan, fix the split and restart.

## Ship without testing
Ship these before week 1. They fix plain gaps with no real downside.
1. **Star rating and review count beside the product name** ("4.5, 20,000+ reviews"), linked to the reviews section.
2. **Tracking:** size picker opens and picks, pincode entries, EMI link taps, scroll depth, and checkout step exits by device. Tests 2 to 4 need these to explain their results.
3. **Mobile image weight:** compress and size the hero and tiles for phones.
4. **Keep the trial, EMI and COD details in the FAQ** as well.

## Assumptions
- Funnel counts are sessions reaching each step. For sizing, one session is treated as one visitor. If many orders come from repeat visits, add one week to each test.
- Mobile traffic stays near 14,000 sessions a day.
- Gross profit is 42% of ₹14,500 and ignores delivery, return and payment costs.
- Trial, EMI and COD wording above is a placeholder. Use your actual terms.
