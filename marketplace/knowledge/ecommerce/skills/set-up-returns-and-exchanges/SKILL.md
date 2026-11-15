---
name: set-up-returns-and-exchanges
description: "A complete returns and exchanges process for the store: the policy terms (window, condition, who pays shipping, refund method and timing, final sale), the self-serve portal flow that offers an exchange or store credit before a refund without hiding the refund, the inspection and restock checks, the reason codes that feed product fixes, and the Shopify settings, all costed per return. Works for stores in any country: covers prepaid labels, drop-off points and courier pickup, legal minimums such as the UK and EU 14-day right to cancel, refunds for buyers who paid on delivery or by bank transfer, and cross-border returns. Use when returns are handled by email chaos, refunds are slow, return costs are rising, or the store is writing its first policy."
---

# Returns and exchanges process

**You get:** the policy terms in a table, the portal flow screen by screen with its wording, the warehouse inspection and restock checklist, a reason-code list, the Shopify or app settings to apply, the cost per return for refund, exchange and store credit, and a one-screen summary for the owner to approve.

## When to use

- Returns arrive by email and chat with no set steps, and refunds take weeks.
- Return or exchange costs are rising and the owner wants more exchanges and fewer refunds.
- The store sells apparel, footwear or sized products where size swaps are common.
- The store is launching and needs its first returns process.
- A new returns app or Shopify's self-serve returns is being switched on.

## Not for

- Writing the public returns policy page in full: use `write-store-policy-pages` (this skill gives it the terms).
- The cost of returns and failed deliveries by product and delivery area: use `returns-and-rto-cost-analysis`.
- Size and fit guides that prevent returns: use `write-size-fit-and-how-to-use-guides`.
- Parcels refused at the door or never delivered: use `cut-rto-on-cod-orders`.

## What you need

Required (read access, level 1):

1. **Shopify order and refund export**, last 6 to 12 months: Name, Created at, Lineitem sku, Lineitem quantity, Refunded Amount, Payment Method, Shipping Zip, Tags, and the refund dates.
2. **Return records**: return reason, condition on arrival, resold or written off, exchange or refund, from the inbox, app or warehouse.
3. **Costs**: return shipping or reverse pickup per parcel, inspection and repack labour, packaging, payment fees not returned on refunds, and the share written off.
4. **Current policy page** and any marketplace policies the store also follows.

Optional: tickets tagged returns, reviews mentioning size or quality, the courier's reverse pickup rate card.

Settings and wording are prepared at draft access (level 2). Turning on the portal, changing the live policy and issuing refunds need the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Pass when it includes a return allowance. Fail: compute the allowance in step 1; every policy choice is a cost.
2. **Legal minimum checked.** Pass when the terms meet your market's consumer rules: in the UK and EU, buyers have a 14-day right to cancel from delivery for most goods, with a refund within 14 days, and must be told who pays return shipping; in Australia, the consumer guarantees mean faulty items must be fixed, replaced or refunded whatever the policy says; in the US, some states require a clearly posted policy; most markets expect clear return, refund and exchange terms shown before purchase. Fail: have the client's adviser confirm before publishing.
3. **Capacity.** Pass when someone can inspect and process returns within 2 working days of arrival. Fail: name the person or the 3PL before launch.

## Steps

### 1. Cost each outcome

Per returned order:

- **Refund:** product value refunded + return shipping (if the store pays) + payment fee kept by the provider + inspection and repack labour + write-off share x landed cost. Repack labour and materials for resale sit in cost of goods; return shipping is an overhead [FIN-0009].
- **Exchange:** return shipping + outbound shipping for the new item + labour + write-off share. Keeps the revenue.
- **Store credit:** labour + write-off share + the cost of any bonus credit; keeps most revenue if spent.

A return can cost 20 to 65% of the item's cost to process [CXP-0018]. Write the three numbers for the top 10 products.

### 2. Set the policy terms

| Term | Default (practitioner, adjust) | Why |
|---|---|---|
| Window | 14 to 30 days from delivery, never below the legal minimum (14 days in the UK and EU) | Shopify can count from delivery and set shorter windows per product [CXP-6284] |
| Condition | Unused, tags on, original pack; hygiene items final sale | Keeps resale possible |
| Exchange shipping | Free for size or colour swaps | Pushes exchange over refund |
| Refund return shipping | Flat fee or buyer-paid, shown before purchase | Covers cost without surprise |
| Refund method | Original payment method; store credit only if the buyer chooses it | Trust and law |
| Refund timing | Within 2 working days of inspection | Slow refunds cost repeat buyers [CXP-0015] |
| Final sale | Clearance and personalised items, labelled on the product page | Shopify lets products or collections be final sale, not bundles [CXP-6284] |
| Damaged or wrong item | Store pays everything; photo on request; no return for low-value items | Effort kills loyalty [CXP-0009] |

For low-value items, usually under 20 in the store's own currency, refund or replace without asking for the item back when shipping it back costs more than it is worth; about 9% of returns are fraudulent, so cap it per buyer [CXP-0018]. On low-ticket consumables, a long satisfaction guarantee has drawn fewer claims than a short one [OFF-0060].

Return method notes: in the US, UK, Canada and Australia buyers expect prepaid labels or drop-off (post office, parcel lockers, pickup points); a flat label fee is common and must be shown before purchase. Across Europe, drop-off at parcel shops and lockers is common, and label-free returns with a QR code help. Where couriers offer courier pickup from the door, offer exchange by pickup for apparel. Cross-border returns: give a local return address or a consolidator in the main markets, or refund without return under a value line, since international return shipping can cost more than the item.

Refund method notes: buyers who paid on delivery, by bank transfer or by invoice have no card to refund to; offer store credit (instant) or a bank refund collected through a secure form or payment link, never by asking for bank details in open chat. Buy now, pay later refunds go back through the provider.

### 3. Design the portal flow

Use Shopify's self-serve returns or a returns app. Screens:

1. **Find order:** order number and email or phone.
2. **Pick items and reason** from the reason-code list (step 5). Required.
3. **Choose outcome**, in this order, all visible on one screen:
   - "Exchange for another size or colour, free shipping both ways";
   - "Store credit, plus a bonus of X" (a 5 to 10% bonus is a practitioner default; test it);
   - "Refund to your original payment method" with the fee or timing shown.
   Never hide the refund or make it harder to find; buyers who struggle do not come back [CXP-0007].
4. **Instructions:** pickup date or label, packing note, the date the refund or exchange will happen.
5. **Confirmation message** with the same details.

For trusted buyers (a past order kept, no past returns), ship the exchange before the return arrives. For others, ship on first courier scan of the return.

### 4. Set the warehouse checks

On arrival, within 2 working days:

- Match the parcel to the return record; photo the contents.
- Grade: A resell as new, B repack or refurbish then resell, C write off or donate.
- Restock A and B in Shopify; record C with reason.
- Approve the refund, credit or exchange in the system the same day.
- Flag mismatches (wrong item, empty box, worn item) to the owner with photos before refusing anything.

Shopify does not take restocking fees off refunds automatically; staff must deduct them by hand if the store charges one [CXP-6284].

### 5. Capture reasons that lead to fixes

Reason codes, short and fixed: too small, too big, not as pictured, quality problem, arrived damaged, wrong item sent, changed mind, arrived late, other (free text). Each month, rank products by return rate and reason, and send:

- size reasons to `write-size-fit-and-how-to-use-guides`;
- "not as pictured" to the product page owner;
- damage and wrong item to `pick-pack-ship-sop`;
- quality to `supplier-scorecard`.

### 6. Fix the numbers

Shopify books returns on the refund date, so a strong month is followed by a false dip when its returns land [MEA-0011]. Accrue returns daily at the expected rate and reconcile monthly [MEA-0028]. Report refund, exchange and store-credit shares separately.

### 7. Launch and review

Update the policy page through `write-store-policy-pages`, link the portal from the footer, order confirmation and shipping emails, train support with a one-page rule card, and run 10 test returns (refund, exchange, credit, damaged, final sale) before going live. Review monthly: return rate, exchange share, refund time, cost per return, top reasons.

### 8. Measure refund speed from the buyer's request

The buyer's clock starts when they ask for the return, not when the warehouse scans the parcel. From the returns export, for every completed return: refund days = refund or credit date minus return request date. Report the median and the slowest 10%, and list:

- completed returns that took longer than the store's promise (for example 7 days from request, a practitioner default to tune);
- open returns already past the promise, oldest first, with the step they are stuck at (label not used, in transit, received but not inspected, inspected but not refunded).

Fix the stage where most of the delay sits. For trusted buyers (past orders kept, no past returns) or orders under a value cap the owner sets, consider refunding or crediting on the first carrier scan of the return instead of after inspection; it speeds the refund but carries fraud and cash risk, so start with a small group, cap it, and watch repeat abusers.

### 9. Set the keep-it line and a recovery budget, then track the loyalty effect

- **Keep-it line per product group:** refund without return when the refund amount is at or below the full cost of the return (step 1), or when the item is perishable, hygiene-sensitive or hard to resell. Offer it case by case, not as a banner, cap it per buyer, and for bulky goods ask the buyer to donate the item.
- **Recovery budget:** support may fix a problem order (refund part, replace, add a gift or upgrade shipping) up to a set amount per incident without asking. Start it at about a quarter to a half of one order's gross margin (order value minus product cost and shipping); this is a starting suggestion, raise it only if the review shows returners coming back.
- **Three baseline numbers, then every 90 days:** median days from request to refund, share of returns kept as exchange or store credit, and the repurchase rate within 60 days for buyers who returned something against buyers who did not. If returners buy again less than non-returners, look first at refund speed and effort.

## Checks before you hand it over

- Each outcome (refund, exchange, credit) has a cost per return for the top 10 products.
- Every term is in the table with its reason and matches the platform setting.
- The refund option is visible on the same screen as exchange and credit.
- Refunds for buyers with no card on file (pay on delivery, bank transfer) have a safe method that never collects bank details in open chat.
- The window meets the legal minimum in every market the store sells to.
- The inspection checklist has a 2-working-day limit and an owner.
- Reason codes are fixed and mapped to who fixes each one.
- Returns are accrued, not just booked on refund date.
- Refund speed is measured from the buyer's request, with late and stuck returns listed.
- The keep-it line comes from each product group's own return cost, with a cap per buyer.
- The recovery budget is a set amount per incident worked out from order margin.
- Nothing goes live and no refund is issued without the client's yes.

## Output

1. **One-screen summary:** the policy in five lines, expected exchange share, cost per return before and after, and the launch date.
2. **Policy terms table** (as in step 2) for `write-store-policy-pages`.
3. **Portal flow:** five screens with exact wording.
4. **Settings list:** Shopify return rules (window, overrides, fees, final sale, cancellation window) or app settings, numbered.
5. **Warehouse checklist and grading card.**
6. **Reason-code list** with owner per reason.
7. **Monthly returns report template:** Month, Orders, Returns, Return rate, Exchange %, Credit %, Refund %, Median refund days, Cost per return, Top 3 reasons, Top 3 products.
8. **Refund speed list:** Return, Order, Requested, Refunded, Days, Over promise (yes or no), Stuck at.
9. **Keep-it and recovery card:** Product group, Refund amount, Cost of return, Keep-it (yes or no), Cap per buyer, Recovery budget per incident.
10. **90-day loyalty check:** Repurchase within 60 days for returners and non-returners, median refund days, exchange and credit share.

## Common mistakes

- **Refund hidden to force exchanges.** Step 3 shows all three choices on one screen.
- **Slow refunds after inspection.** Step 2 sets 2 working days.
- **Restocking fee assumed to come off automatically.** Step 4 deducts it by hand.
- **Asking buyers for bank details in chat.** Step 2 uses credit or a secure form.
- **A window shorter than the law allows.** Gate 2 checks each market's minimum.
- **Free-text reasons nobody reads.** Step 5 fixes codes and owners.
- **A false revenue dip after a big month.** Step 6 accrues returns.
- **Timing refunds from the warehouse scan.** Step 8 measures from the buyer's request.
- **Keep-it offered to everyone as a banner.** Step 9 sets it case by case with a cap.

## Sources

- CXP-6284: Shopify return windows, overrides, fees, final sale.
- CXP-0007: a poor return makes buyers less likely to buy again.
- CXP-0015: fast refunds and repurchase.
- CXP-0018: refund without return for low-value items; return cost and fraud share.
- CXP-0009: low-effort service and loyalty.
- OFF-0060: long guarantees on consumables.
- FIN-0009: where return costs sit in the accounts.
- MEA-0011, MEA-0028: Shopify refund dating and return accruals.
- Library items: Returns policy designer (AI Blocks skill), used for the three baseline numbers, refund on carrier scan, the keep-it line and the recovery budget; Refund speed checker (adapted from shopify-admin-return-processing-sla by 40rty AI, MIT, https://github.com/40rty-ai/shopify-admin-skills/tree/main/skills/returns/shopify-admin-return-processing-sla), used for the refund speed list in step 8.

What makes this skill ours: each outcome is costed per return before the policy is set; exchange and credit are offered first but the refund is never hidden; buyers without a card on file get a safe refund path; and every reason code is wired to the person who fixes it, so returns drop instead of just being processed.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. The Consumer Protection (E-Commerce) Rules, 2020 expect clear return, refund and exchange terms shown before purchase. For apparel, offer exchange by reverse pickup with a quality check at the doorstep where the courier supports it. COD buyers have no card to refund to; offer instant store credit or a UPI refund collected through a secure form or payment link, never by asking for bank details in open chat. Track returns and RTO by pincode.
