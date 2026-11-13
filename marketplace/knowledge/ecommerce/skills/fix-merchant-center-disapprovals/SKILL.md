---
name: fix-merchant-center-disapprovals
description: "Lists every disapproved or limited product in a store's Google Merchant Center with its exact cause and fix, ranked by the gross profit it is losing each week, and separates product-level issues (price or availability mismatch, missing identifiers, images, shipping) from account-level problems (misrepresentation, policy suspensions) that need a different path. Gives the fix for each in Shopify or the feed, a prevention schedule for sales and price changes, and the re-review steps. Works from free Merchant Center exports, no paid feed tool. Use when Shopping or Performance Max sales drop, when the Diagnostics page shows red, before a sale, or after a suspension warning."
---

# Fix Merchant Center disapprovals

**You get:** a fix list for every disapproved or limited product, each row with its issue, cause, exact fix, owner and lost gross profit per week, in order of money lost, plus a separate account-level action plan if the account itself is warned or suspended.

## When to use

- Shopping or Performance Max sales or impressions dropped and products may have gone dark.
- Merchant Center shows disapproved, limited or "not showing" products.
- A sale or price change is coming and the feed must keep up.
- The account received a warning or suspension notice.

## Not for

- Rewriting titles to match searches: use `write-product-feed-titles-that-match-searches`.
- Deciding which products deserve spend: use `google-shopping-product-tiers`.
- Performance Max problems not caused by the feed: use `google-pmax-diagnostics`.
- Legal advice on a restricted product: point to Google's policy page and a professional.

## What you need

Required (read access):

1. **Merchant Center product issues export**: Products, then Needs attention (or Diagnostics, depending on the interface), downloaded with Item ID, Title, Issue, Attribute, Status, Countries, Last updated.
2. **Product performance, last 30 to 90 days**: Google Ads Shopping report by item (Item ID, Impressions, Clicks, Cost, Conversions, Conv. value) or Merchant Center performance reports.
3. **Gross profit per product** from `build-sku-profit-sheet`, or one store-wide gross margin if per-product figures do not exist.
4. **How the feed is built**: Shopify Google and YouTube channel app, a feed app, a scheduled file, or the API.
5. **Account messages**: any warning or suspension email and the account-level issues page.

Optional: Shopify product export (Handle, Variant SKU, Variant Barcode, Variant Price, Variant Compare At Price, Inventory), the store's shipping and returns pages.

Access: read only for the diagnosis. Fixes in Shopify or the feed need draft access, and the client approves them. Review requests to Google need the client's yes, because a failed review can lengthen the wait.

## Before you start: the gates

1. **Profit.** Gross profit per product or a store-wide margin is known, so the list can be ranked. Fail: rank by past conversion value and label it.
2. **Account or product?** If the account is suspended, nothing shows; go to step 5 first.
3. **Truth.** Never fix a disapproval by hiding a fact: no false GTINs, no removing a real restriction, no invented reviews or prices. If the product breaks a policy, the fix is to stop advertising it.
4. **Capacity.** Someone can edit products in Shopify or the feed this week; name them.

## Steps

### 1. Rank by lost gross profit

For each affected product:
- If it sold through Google before the issue: lost gross profit a week = past weekly Google conversions x gross profit per purchase.
- If it never ran: weekly clicks of similar products in the same product type x their conversion rate x this product's gross profit.
- Limited (approved but warned) products count at half their figure until the warning is gone (practitioner default, test it).

Sort high to low. Ten products often hold most of the loss; fix those first.

### 2. Name the cause, then the fix

| Issue in Merchant Center | Usual cause | Fix |
|---|---|---|
| Mismatched price | Feed price differs from the page HTML or structured data; sale started on the site before the feed updated; price added by script; currency differs [GAD-6122] | Make prices match exactly, in the page HTML; time feed updates to the minute prices change; then ask for a website check. Google re-crawls and reapproves over hours or days [GAD-6122] |
| Mismatched availability | Sold out on site, in stock in feed, or the reverse | Faster feed refresh; automatic item updates help with occasional mismatches but are not a replacement for regular updates, and products whose price changes more than once a day may be disapproved instead (Merchant Center Help) |
| Missing or invalid GTIN | Branded goods without barcode, or a made-up code | Add the real barcode for branded goods. For the store's own brand or handmade goods with no barcode, set identifier exists to no and give brand and MPN. Never invent a GTIN |
| Missing shipping or tax | No shipping rule for that country; US tax settings missing | Set shipping rules in Merchant Center for each target country |
| Image too small, overlay, watermark, promo text | Badge or "sale" text on the main image | Use a clean main image; images with overlays or text risk disapproval [GAD-0019] |
| Title or description issues | Promo text, caps, too long | Fix to Google's limits: titles 1 to 150 characters, no price or sale text, no caps for emphasis [GAD-6123] |
| Landing page not working or not crawlable | Broken URL, password page, bot blocking, geo redirect | Fix the URL; allow Google's crawler; stop forced country redirects |
| Restricted or prohibited product | Health, supplement, weapon or adult rules | Check Google's policy; if not allowed, exclude the product, do not reword it |
| Currency or country not supported | One feed for several markets | One feed per currency and country [GAD-0049] |

Price mismatches are among the most common causes; stores with frequent price changes should refresh the feed often, at least every six hours in one compilation [GAD-0005].

India notes: the feed price must match the price shown on the page, with GST as displayed there. Cash-on-delivery fees added only at checkout do not belong in the price, but say so honestly on the page. Regional sites or pin-code checkers that hide the price until a pin code is entered can cause mismatches; show the price by default.

### 3. Check for duplicate and copy listings

Several near-identical listings of one product at invented price points risk disapproval or suspension [GAD-0015]. Keep variants only where size, colour, pack or bundle is real and on the page.

### 4. Apply fixes in the right place

- If the feed comes from Shopify through the Google channel app, fix the product in Shopify; the app syncs.
- If a supplemental feed or feed rules exist, check they are not overwriting the fix.
- Use Merchant Center's automatic fix only for low-risk formatting items; price, policy and required attributes need a person [GAD-0005].
- Log each fix with the date, so the next check can confirm the product came back.

### 5. Account-level problems (misrepresentation and suspensions)

These stop every product. Common causes: missing or hard-to-find contact details, returns, refund and shipping policies; claims the store cannot back; prices or offers that differ from checkout; an unfinished or copied site; payment or checkout problems.

1. Read the exact reason in the notice.
2. Walk the site as a buyer on mobile: contact page with address, phone or email; returns and refund policy; shipping times and costs; secure checkout; honest product claims (use `product-claims-profile`); no fake countdown timers or invented reviews.
3. Fix everything found, then ask the client to approve one review request. The form limits how often you can ask; read the waiting time it shows and do not resubmit until every fix is live.

### 6. Prevent the next round

- Weekly: Diagnostics check, five minutes, as part of `google-ads-weekly-routine`.
- Before any sale: schedule the feed update for the minute site prices change, and check the price sits in the page HTML.
- Stock-outs: a hero product out of stock for a few days can reset Performance Max learning [GAD-0037]; flag low stock a week ahead.
- Return policy: a clear window and costs support Google's store quality signals; one agency links a 30-day-plus window to stronger Shopping results [GAD-0018].

## Checks before you hand it over

- Every affected product has one cause and one fix, not a guess list.
- The list is sorted by lost gross profit, with the method stated.
- No fix invents a GTIN, hides a restriction or changes a fact.
- Account-level issues, if any, have their own plan and go first.
- Each fix names where it is made (Shopify, feed rule, supplemental feed, Merchant Center).
- A prevention date is set for the next sale or price change.
- Review requests are listed for the client's yes, not sent.

## Output

1. **One-screen summary:** products affected, lost gross profit per week, the top 10 fixes, any account-level risk, and the date of the next check.
2. **Fix list:** Rank, Item ID, Title, Issue, Status (disapproved or limited), Countries, Cause, Fix, Where fixed, Owner, Lost gross profit a week, Fixed on, Back live on.
3. **Account plan** (only if warned or suspended): Reason, Site check item, Pass or fail, Fix, Evidence link, Ready for review (yes or no).
4. **Prevention calendar:** Date, Event (sale, price change, restock), Feed action, Owner.

## Common mistakes

- **Fixing in order of the Diagnostics list.** Step 1 ranks by money lost.
- **Inventing barcodes.** Step 2 uses identifier exists set to no for own-brand goods.
- **Rewording a restricted product to get it through.** Gate 3 and step 2 exclude it instead.
- **Sale prices on the site before the feed.** Step 6 times the update.
- **Resubmitting a suspension review too soon.** Step 5 fixes everything first.
- **Fixing in the feed while Shopify overwrites it.** Step 4 fixes at the source.

## Sources

- GAD-0005: common disapproval causes; update often when prices change.
- GAD-0015: duplicate listings at invented prices risk suspension.
- GAD-0018: returns window and store quality signals.
- GAD-0019: images with overlays or text risk disapproval.
- GAD-0037: feed disapprovals and stock-outs hurt Performance Max.
- GAD-0049: one feed per currency.
- GAD-6122: exact price match rule, disapproval and possible suspension.
- GAD-6123: title length and content rules.

What makes this skill ours: every issue is ranked by the gross profit it is losing, not by the order Google lists it; product problems and account problems get different paths; no fix hides a fact or invents an identifier; and India's GST display and pin-code price gates are checked as mismatch causes.
