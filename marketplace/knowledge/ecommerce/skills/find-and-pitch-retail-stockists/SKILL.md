---
name: find-and-pitch-retail-stockists
description: "A scored list of 30 to 60 shops and boutiques that fit the brand, a pitch email and two follow-ups written for the top tier, and the exact pack to send when a buyer says yes (line sheet, terms, sample rule). Builds the list from the store's own customer clusters and the shops that already stock similar brands, scores each on fit and payment risk, and only pitches once wholesale gross profit, stock for reorders and the follow-up rules are in place. Use when a store wants its first stockists, wants more shops in a city, or has a stalled list of retailers it never contacted properly."
---

# Find and pitch retail stockists

**You get:** a stockist target sheet of 30 to 60 shops scored A, B or C, one pitch email and two follow-ups personalised for the 10 to 15 A-tier shops, and a ready "what we send" pack (line sheet layout, terms summary, sample rule), all as drafts for the client to approve and send.

## When to use

- The store sells well online and wants its first physical stockists.
- The brand has a few stockists and wants more in the cities where its buyers live.
- A list of boutiques exists but nobody has worked out who fits or who the buyer is.
- Retail buyers have started asking for a line sheet and the store has nothing to send.

## Not for

- Setting wholesale prices, minimums and payment terms: use `build-wholesale-price-list-and-terms` first.
- The full follow-up cadence after the first three emails: use `b2b-sales-follow-up-sequence`.
- Large distributors or regional resellers who take title to stock: use `distributor-agreement-checklist`.
- Pitching press or gift guides for coverage: use `pitch-store-to-press-and-gift-guides`.

## What you need

Required:

1. **Shopify order export**, last 12 months: Created at, Shipping City, Shipping Zip (pincode in India), Shipping Province, Lineitem name, Lineitem quantity, Subtotal. This shows where buyers cluster.
2. **Wholesale price list and terms** from `build-wholesale-price-list-and-terms`: wholesale price, suggested retail price, case pack and opening minimum per SKU.
3. **Product facts**: photos, sizes, shelf life if any, retail packaging, barcode or GTIN if the product has one.
4. **Stock on hand and reorder lead time** per SKU.
5. **Proof the store can show truthfully**: review count and average rating, repeat rate, press, any current stockists who agree to be named.

Optional: brands the owner sees as neighbours on a shelf, past trade enquiries in the inbox, a list of shops the owner already knows.

If the wholesale price list is missing, stop and build it first; a pitch without margins wastes the buyer's first read. If proof is thin, pitch on product and fit only and say nothing you cannot show. Research needs read access only. Writing emails in the client's mailbox needs draft access (level 2); sending needs the client's yes for the list and the copy.

## Before you start: the gates

1. **Wholesale gross profit.** Pass when each SKU on the line sheet shows gross profit per unit at the wholesale price, with landed cost, wholesale packaging and freight to the shop included [MEA-0037]. Fail: hand to `build-wholesale-price-list-and-terms`.
2. **Stock for reorders.** A shop that sells through and cannot reorder is worse than no shop: an empty shelf ends the relationship [OPS-0022]. Pass when the store can fill the opening orders of all A-tier shops plus one reorder each without dropping its own site below reorder point. Fail: pitch fewer shops.
3. **Cash.** If terms will be 30 days or more, the store waits for its money while paying the supplier. Pass when `build-13-week-cash-forecast` shows the gap is covered. Fail: start with prepaid opening orders only.
4. **Outreach rules.** US: sales emails to businesses fall under CAN-SPAM, with no business exception, so each email needs the store's postal address and a working opt-out honoured within 10 business days [EML-6385]. India: email is fine with the same courtesy; WhatsApp only after the buyer opts in [EML-6320]. India: B2B sales across states need GST registration and a GST tax invoice the buyer can claim credit on [FIN-6205] [FIN-6380].

## Steps

### 1. Find where demand already is

Group orders by city and pincode or zip. Mark the top 10 clusters by orders and by repeat buyers. Shops in these places sell to people who already know the brand, and a physical presence near buyers can lift online sales in that area too [MCR-0067]. Retail sales and online sales will mix, so tell the client to read results across channels, not the site alone [MEA-0029].

### 2. Build the long list

Free sources first, in this order:

- Stockist pages of 5 to 10 neighbour brands (similar price, same buyer, not direct rivals). Shops that stock them already sell to your buyer.
- Map searches for the category plus each cluster city ("gift shop", "concept store", "organic store", "baby boutique").
- Instagram location tags and shop accounts in those cities.
- India: concept stores, gifting stores, pharmacy and wellness chains, café retail shelves, regional modern-trade chains. US: independent boutiques, gift shops, museum and hotel shops, regional chains.
- Optional paid path: a wholesale marketplace that lists retailers and charges commission. Note its fee and treat it as a channel test, not the plan.

Start with independents and small regional chains in a few cities. Big national chains need proof of sell-through first and can strain stock and cash.

### 3. Score each shop

Score 0, 1 or 2 on each, then tier A (9 to 12), B (6 to 8), C (under 6):

| Factor | 2 | 1 | 0 |
|---|---|---|---|
| Neighbour brands | Stocks 2+ neighbours | 1 | None |
| Price match | Shelf prices within 30% of yours | Wider | Discount store |
| Buyer cluster | In a top-10 cluster | Same city | Elsewhere |
| Shop health | Active posts, recent reviews, open | Some signs | Stale or closed |
| Display fit | Your packaging suits their shelf | Needs a display | Wrong format |
| Payment risk | Established, known to pay | Unknown | Signs of trouble |

Drop C. Pitch A first, 10 to 15 at a time, so stock and follow-up stay manageable.

### 4. Name the buyer

Find the owner or category buyer by name from the shop's site, its social bio, a business listing or by calling and asking who decides on new brands. Never buy a scraped contact list. Note the best channel per shop.

### 5. Build the "what we send" pack

- **Line sheet**, one page per collection: photo, product name, SKU, case pack, wholesale price, suggested retail price, the shop's margin in money and percent, opening minimum, lead time.
- **Terms summary**: payment, delivery, damage claims, reorder minimum, from the price list skill.
- **Proof page**: only real numbers with dates (review count, rating, repeat buyers), named stockists only with permission.
- **Sample rule**: offer samples, do not send them unasked. Samples pay when the buyer requests one and gives an address or books a call [OFF-0057]. Cap samples at the number of A-tier shops.

### 6. Write the pitch email

One email per A-tier shop, under 120 words:

- Subject with the shop's name and the product ("A refill line for [shop name]'s wellness shelf").
- Line 1: why this shop, specific (the neighbour brand they stock, the cluster of your buyers near them).
- Line 2: what it is, the suggested retail price and what the shop earns per unit.
- Line 3: one true proof point.
- Line 4: a small opening order (one case per SKU, three SKUs) so the yes is easy.
- One ask: "Shall I send the line sheet and a sample?"
- Footer: name, store, postal address, "Reply stop and I will not email again."

### 7. Write two follow-ups

Each adds one new thing; never "just checking in".

- Day 4 or 5: a photo of the product on a shelf or display, and the same one ask.
- Day 10 to 12: one new proof or an answer to the likely objection (shelf space, slow sellers), then a polite close: "If now is not the time, I will leave it here."

After that, hand the shop to `b2b-sales-follow-up-sequence`. Stop at once on any reply, opt-out or "no".

### 8. Get approval and log

Show the client the A-tier list, the pack and the three emails. Send nothing until they say yes. Log each shop's status in the sheet.

## Checks before you hand it over

- Every SKU on the line sheet shows wholesale price, suggested retail, shop margin and the store's gross profit per unit.
- Every A-tier shop has a named buyer and a specific reason it fits.
- Stock covers all A-tier opening orders plus one reorder each.
- No proof point appears without a source and date.
- Every email has the postal address and opt-out line.
- No WhatsApp message is planned to anyone who has not opted in.
- Samples are offered, not sent unasked, and capped.
- Nothing was sent without the client's yes.

## Output

1. **One-screen summary:** clusters chosen, shop count by tier, the 10 to 15 shops to pitch first, and the stock and cash check result.
2. **Stockist target sheet** with columns: Shop, City, Pincode or zip, Buyer name, Role, Channel, Neighbour brands stocked, Score per factor, Total, Tier, Reason it fits, Status, Next step, Date.
3. **Line sheet layout:** Photo, Product, SKU, Case pack, Wholesale price, Suggested retail, Shop margin (money and %), Opening minimum, Lead time.
4. **Email set** for each A-tier shop: Subject, Pitch, Follow-up 1, Follow-up 2, each with send day.
5. **Sample log:** Shop, Requested on, Sent on, Items, Cost, Feedback, Outcome.

## Common mistakes

- **Pitching everyone in a city.** Step 3 scores fit and payment risk; only A-tier gets the first wave.
- **No margin story.** Buyers decide on what they earn per unit; step 6 puts it in line 2.
- **Free samples to every shop.** Step 5 sends only on request [OFF-0057].
- **Winning shelf space you cannot refill.** The stock gate checks one reorder per shop [OPS-0022].
- **Chasing with "any update?"** Step 7 makes each touch add something, then hands off.
- **Judging stockists by site sales.** Retail and online mix; read them together [MEA-0029].

## Sources

- MEA-0037: gross margin includes every cost to deliver, including freight to the shop.
- OPS-0022: an unfilled retailer order leaves an empty shelf and can end the account.
- MCR-0067: physical presence lifted nearby online sales in one case.
- MEA-0029: media value spills into other channels; read across them.
- OFF-0057: samples pay only when requested with some effort.
- EML-6385: CAN-SPAM covers business email; address, opt-out, 10 business days.
- EML-6320: WhatsApp needs opt-in; honour opt-outs.
- FIN-6205: India GST registration and Shopify invoice gaps.
- FIN-6380: India GST tax invoice fields and timing.

What makes this skill ours: the list starts from the store's own buyer clusters and the stockists of neighbour brands, not a generic directory; every shop is scored on payment risk as well as fit; the pitch leads with what the shop earns per unit; and nobody is pitched until the store can refill a reorder.
