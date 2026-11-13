---
name: write-size-fit-and-how-to-use-guides
description: "Writes size and fit guides for apparel, footwear and fitted goods, or how-to-use guides for products that need setup, dosing or a routine, built from the store's return reasons, exchange data, support tickets and reviews. Covers measurements in two units, how to measure, fit notes per product, model size worn, 'between sizes' advice, and for how-to guides the steps, first-use expectations and common mistakes, each placed beside the size picker, on the product page and in the post-purchase email. Sets a baseline return and ticket rate so the effect can be read. Use when size, capacity or misuse drives returns, exchanges or tickets."
---

# Size, fit and how-to-use guides

**You get:** for each product type in scope, either a size and fit guide (size table in two units, how to measure, per-product fit notes, model size worn, between-sizes rule) or a how-to-use guide (steps, first-use expectations, mistakes to avoid, when to contact support), with the placement for each block and a before-and-after measure of returns and tickets, ready for the client's approval.

## When to use

- "Too small", "too big" or "did not fit" leads the return or exchange reasons.
- Tickets ask which size to pick, or how to set up, use, dose or care for the product.
- Reviews say "it didn't work" in ways that point to wrong use.
- Returns say the product holds, covers or fits less than the buyer expected (a wallet, bag, case or container).
- A new product type or size range is launching.

## Not for

- Returns policy, portal and the push to exchange: `set-up-returns-and-exchanges`.
- What returns and failed COD deliveries cost by product and pincode: `returns-and-rto-cost-analysis`.
- The full post-purchase email series: `write-post-purchase-emails` (this skill hands it the how-to content).
- Garment measurement specs for the factory: `write-product-spec-sheet-for-factory`.
- Gallery images showing fit and scale: `pdp-image-gallery-rebuild`.

## What you need

Required (read access, level 1):

1. **Returns and exchanges export, last 6 to 12 months**: order, product, variant (size), reason code, free-text reason, refund or exchange, and the exchanged-to size. From the returns app or Shopify returns.
2. **Real product measurements** per size: garment or item measurements taken flat by the store or factory, not a generic chart. For how-to guides: the product's instructions, safety warnings and the maker's specs.
3. **Tickets and chats** about size, fit, setup or use.
4. **Reviews export** with any fit or size answers (many review apps collect a "fit" rating).
5. **Sales by variant** for the same period.

Optional: post-purchase survey answers, model measurements and size worn for product photos, RTO reasons for COD orders in India.

If real measurements are missing, the guide cannot be written for that product; ask the client to measure 3 pieces per size and record the average. Placing guides on the theme needs draft access (level 2) on a duplicate theme; the client approves before publishing.

## Before you start: the gates

1. **Returns are worth fixing.** Compute the cost of size or misuse returns: return shipping, handling, write-offs, and lost gross profit, by product. Fail (small cost): fix only the top product and stop. Low-value items may be cheaper to refund without return [CXP-0018]; decide that in `set-up-returns-and-exchanges`.
2. **Measurements are real.** Every number in a size table comes from measured products. Fail: hold that product.
3. **Safety is cleared.** How-to steps for anything with heat, electricity, chemicals, dosing, children or skin use follow the maker's instructions and warnings word for word in substance. Fail: no guide until the maker's text is in hand; health questions go to a professional.

## Steps

1. **Find the problem products.** Rank products by size or misuse returns per 100 orders and by ticket count. Take the top 5 to 10. Read the free-text reasons by hand and paste exact phrases [AVT-0007]: "runs small in the shoulders", "didn't know to charge it first".
2. **Read the exchange pattern.** For fit returns, note which way buyers exchange (size up or down) per product. If most exchanges on a product go one size up, that product runs small; write that in its fit note.
3. **Write the size table.** Follow the large-sample sizing checklist: conventional sizes (S, M, L), numeric sizes where used, measurements in both centimetres and inches, international conversions where the store sells abroad, and a table per product type, ideally per product [CXP-6161]. In India add the common size labels buyers know (for example UK sizes for footwear) only if they map correctly.
4. **Write how to measure.** Three to five steps with a simple diagram brief: what to measure, with what, and how to read it. Add a "compare with a piece you own" method, which buyers find easier than body measuring (practitioner default, test it).
5. **Write per-product fit notes.** One to two lines: "Runs small: most buyers size up", "Relaxed fit: take your usual size", "Fabric has no stretch". Add model height, measurements and size worn next to on-model photos [CXP-6161]. Add a between-sizes rule and say which way to go and why. For "less than expected" returns, the fit note states the limit as a measured number ("fits a 14-inch laptop"), names who it is not for and links the better-fit product in the range; `write-product-page-copy` reuses it in the details and FAQ. An unmeasured limit is left off the page and named under Gaps, never as a bracket on the page.
6. **Write the how-to guide** (for products that need use instructions). Steps: what is in the box, first setup, first use, routine, care, storage. Then "what to expect": how long until results, what feels normal at first. Products without an instant effect do better with an early frame that sets the timeline [CXP-0003]. Then "mistakes to avoid" from the misuse returns and tickets, and "when to contact us".
7. **Place each block.** Size guide link right next to the size picker, opening over the page and closing back to it with the Back button, with a support or chat link inside the guide [CXP-6161]. Fit note under the product title or above the size picker. How-to summary on the product page; full guide on a help page; the steps also go in the delivery or post-purchase email, handed to `write-post-purchase-emails`. Dead clicks on size options and quick backs from product pages often mean missing size information [CRO-0023].
8. **Collect fit data going forward.** Ask the review app to collect a fit rating (runs small, true to size, runs large) and show the summary; a "what almost stopped you" survey catches the next doubts [LPG-0042]. Real buyer photos that show fit and claims carry weight once a product has its first reviews [LPG-0062].
9. **India and US notes.** India: size and misuse issues also drive COD refusals and RTO; add the fit note and size guide link to the WhatsApp or SMS order confirmation for COD orders where the buyer opted in, and offer a Hindi or regional version of how-to steps if tickets arrive in those languages. US: keep measurements in inches first and centimetres second.
10. **Set the measure.** Record, per product, size or misuse returns per 100 orders, exchanges per 100 orders and related tickets per 100 orders for the last 90 days. Read again after 60 to 90 days of orders. Poor return experiences hurt repeat purchase [CXP-0007], so also watch repeat rate among buyers who exchanged. Guardrail: add-to-cart rate. If it drops after a limit line goes up, move the line below the fold before cutting it (practitioner default, test it).

## Checks before you hand it over

- Every size number comes from measured products, with the measurement date.
- Each top return product has a fit note based on its exchange direction.
- Each "less than expected" product shows its limit as a number, with a better-fit link.
- Measurements show in both centimetres and inches.
- The size guide link sits next to the size picker and closes back to the product.
- How-to steps match the maker's instructions and warnings.
- Every guide has a placement on page and in post-purchase messages.
- A baseline of returns, exchanges and tickets per 100 orders is recorded with a read date.

## Output

**Summary (one screen):** top products by size or misuse returns, cost of those returns per month, the fit notes and guides written, placements, and the read date.

**Problem product table:**

| Product | Orders | Size or misuse returns per 100 | Exchange direction | Tickets per 100 | Main reason (exact words) | Monthly cost |
|---|---|---|---|---|---|---|

**Size table (per product type):** size label, chest or waist or length (cm and in), international size, notes.

**Fit notes:** product, note, evidence, model size worn.

**How-to guide (per product):** in the box, setup, first use, routine, care, what to expect, mistakes to avoid, contact.

**Placement map:** block, page or message, position, owner.

**Gaps:** products with no measurements yet and products with no maker safety text, one line each; their guides leave that part out.

## Common mistakes

- **Generic size charts copied from a supplier.** Gate 2 and step 3 use measured products.
- **One fit note for the whole store.** Step 5 writes per product from exchange data.
- **Size guide buried in a tab.** Step 7 puts it next to the picker.
- **How-to guides only on a help page.** Step 7 also sends steps after purchase.
- **No baseline.** Step 10 records rates before the change.
- **"Holds a few" instead of a number.** Step 5 measures the limit and points the wrong buyer to a better-fit product.
- **Unsafe paraphrase of instructions.** Gate 3 keeps the maker's warnings.

## Sources

- CXP-0018: refund without return for low-value items.
- AVT-0007: read return and review reasons by hand.
- CXP-6161: sizing information gaps and the ten sizing practices.
- CXP-0003: set a results timeline at first use for slow-acting products.
- CRO-0023: dead clicks and quick backs signal missing information.
- LPG-0042: near-miss surveys.
- LPG-0062: review count and claim-matching photo reviews.
- CXP-0007: poor returns hurt repeat purchase.

What makes this skill ours: fit notes come from the direction buyers actually exchange each product, not a generic chart; every size number is measured; how-to guides are written from misuse returns and placed both on the page and in the delivery messages; and returns, exchanges and tickets per 100 orders are baselined so the guide's effect is read in money.
