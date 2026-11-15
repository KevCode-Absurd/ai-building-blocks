---
name: turn-support-tickets-into-insights
description: "A monthly voice-of-customer report built from support tickets, chats, WhatsApp, returns reasons and reviews: the top themes counted per 100 orders, split by product, channel and buyer type, each with real buyer quotes, the money it costs, the team that owns it (product, ads, site, fulfilment, policy) and the one fix it needs, plus a tracker that checks whether last month's fixes worked. Separates service problems from pre-sale doubts and buyer wording that ads and pages can use. Use monthly, after a launch or bad batch, or when ads, product and support teams each blame the others."
---

# Turn support tickets into insights

**You get:** a monthly report with the top ten ticket themes ranked by cost, each with counts per 100 orders, two to three verbatim quotes, an owner and a dated fix, a pre-sale doubts list for ads and pages, and a fix tracker that shows whether last month's changes cut tickets.

## When to use

- Every month, as part of the store's operating review.
- After a launch, a new supplier batch or a carrier change.
- Return rate or ticket volume rose and nobody knows why.
- Ads, site and product teams want to know what buyers actually say.

## Not for

- Writing reply templates: use `build-support-macros-from-top-tickets`.
- Writing the FAQ page from the same data: use `write-faq-from-tickets-and-reviews`.
- Turning reviews into ad angles in depth: use `mine-ad-angles-from-reviews`.
- Return and failed delivery cost by product and area: use `returns-and-rto-cost-analysis`; this report links to it.

## What you need

Required (read access, level 1):

1. **Ticket export for the month and the two months before**: id, created date, channel, reason tag, product or SKU if tagged, order number, first message, resolution, cost of any refund or reship.
2. **Shopify order export** for the same months: Name, Created at, Lineitem sku, Lineitem quantity, Total, Payment Method, Customer type (first or returning).
3. **Returns reasons** from the returns app or a returns sheet.
4. **Reviews** from the review app (one to three star at least) and pre-sale chat logs.

Optional: post-purchase survey answers, CSAT by reason, on-site search terms.

Read access is enough for the report. Sharing it with other teams is the client's call. Strip names, phone numbers and addresses from every quote before it leaves support.

## Before you start: the gates

1. **Tags are usable.** At least 80% of tickets carry a reason tag. Fail: tag a random sample of 200 by hand with the fixed list from `set-up-helpdesk-and-response-times`, and say the report rests on a sample.
2. **Rates, not counts.** Tickets must be read per 100 orders (or per 100 orders of that SKU), or a busy month looks like a bad month.
3. **Money known.** Gross profit per order from `store-meta-math`, plus refund and reship costs, so each theme gets a cost. Fail: rank by count and say so.
4. **Privacy.** Quotes are anonymised; no health or payment details travel in the report.

## Steps

### 1. Build the base table

For each reason tag: tickets this month, per 100 orders, change from last month, average handling minutes, refunds and reships cost. For product-linked reasons, also per 100 units of each SKU.

Watch order status first: under 3% of orders is healthy, above 8% structural [CXP-0012]. If it is above 8%, it is a theme every month until fixed.

### 2. Read the words, not just the tags

Tags show what; text shows why. For the top ten reasons, read at least 20 tickets each (or all, if fewer), by hand. Paste exact phrases; automated summaries strip the wording that copy and product teams need [AVT-0007]. Split each reason into causes. "Damaged" may be three causes: lid cracks, box crushed, leak in heat.

Give extra weight to the most loyal and the most unhappy buyers; one card weights the top 3% and bottom 3% over the middle [AVT-0021]. A repeat buyer's complaint about a change is an early warning.

### 3. Separate three kinds of signal

| Kind | Example | Goes to |
|---|---|---|
| Service failure | Late, broken, wrong item, slow refund | Fulfilment, product, support |
| Pre-sale doubt | "Will it fit?", "Is it safe for kids?", "Does it work with X?" | Site and ads |
| Expectation gap | "Smaller than the photo", "took longer to work" | Ads and site claims, product page |

Never treat a pile of service complaints as proof the market wants something different, and never present the share of tickets as the share of all buyers.

### 4. Cost and rank the themes

Theme cost a month = refunds and reships for that theme + agent hours x hourly cost + lost repeat orders where measurable. Rank themes by cost; break ties by the trend (rising beats steady).

### 5. Write the fix for each

One fix per theme, one owner, one date. Good fixes are specific:

- **Product:** "Change lid supplier spec to thicker wall; next batch from 15 March."
- **Site:** "Add a size chart with body measurements beside the size picker." Take the top near-miss reason from tickets and turn it into page copy [CRO-0018]; place a few reviews that answer that exact doubt beside the add-to-cart button [LPG-0005].
- **Ads:** "Remove 'instant results' line from the two top ads; tickets say results take two weeks."
- **Fulfilment:** "Add a bubble sleeve for glass items."
- **Policy:** "Extend the size exchange window from 7 to 14 days" (only with a costing).

Recurring segments in the words (job titles, life stages, "as a new mum") can point to buyer groups worth their own message [AVT-0016]; list them for the ads team.

### 6. Track last month's fixes

For each fix shipped last month: the theme's rate before, the rate now, and a verdict (worked, no change, worse, too early). A fix "worked" only if the rate fell on similar order volume. Two months with no change means the cause was wrong; go back to step 2 for that theme.

### 7. Send it to the owners

One page per owner (product, site, ads, fulfilment, support), each listing only their themes, quotes and fixes. The support lead presents it in the store's monthly or weekly review. Nothing changes in ads, site or product until that owner and the client agree.

### 8. Language and market notes

- **Languages:** read tickets in every language your buyers use in the original, and translate quotes faithfully; keep the original beside the translation. Track payment and delivery themes on their own: fake orders, refused at the door, failed payments, pay later or pay on delivery questions, refund to card or bank. Postcode, state or country splits often explain delivery themes.
- **Regions and safety:** split themes by state, region or country only for delivery, customs and duty issues. Keep product safety complaints out of the general report and send them to the owner at once; some may need a report to the market's product safety body.

## Checks before you hand it over

- Every theme shows count, rate per 100 orders, change and cost.
- Each top theme has at least two exact, anonymised buyer quotes.
- Service failures, pre-sale doubts and expectation gaps are separated.
- Each theme has one fix, one owner and one date.
- Last month's fixes have a measured verdict.
- No quote carries a name, phone, address, health or payment detail.
- Ticket share is never presented as share of all buyers.

## Output

**One-screen summary:** the three costliest themes and their fixes, the biggest riser, and how many of last month's fixes worked.

**Theme table:** Rank, Theme, Cause, Kind (service, pre-sale, expectation), Tickets, Per 100 orders, Change vs last month, Cost a month, Top SKU, Quote 1, Quote 2, Owner, Fix, Fix date.

**Pre-sale doubts list** for site and ads: Doubt, Times asked, Where it should be answered, Suggested wording from buyer quotes.

**Fix tracker:** Theme, Fix, Shipped on, Rate before, Rate now, Verdict.

**Owner pages:** one per team.

## Common mistakes

- **Counts instead of rates.** Gate 2 and step 1 use per 100 orders.
- **Tag-only reading.** Step 2 reads the words for causes.
- **Mixing service failures with demand.** Step 3 separates them.
- **Vague fixes with no owner.** Step 5 names owner and date.
- **Never checking if fixes worked.** Step 6 measures them.
- **Leaking customer data in quotes.** Gate 4 anonymises.

## Sources

- AVT-0007: read manually and keep verbatim wording.
- AVT-0016: self-identifying phrases mark buyer segments.
- AVT-0021: weight the most loyal and most unhappy buyers.
- CRO-0018: turn the top near-miss reason into page copy.
- CXP-0012: order-status contact rate bands.
- LPG-0005: place reviews that answer the exact objection.

What makes this skill ours: themes are ranked by cost per 100 orders, not raw counts; service failures, pre-sale doubts and expectation gaps go to different owners; every fix is measured the next month; and tickets in every buyer language are read in the original.

## Selling in India

- Read regional-language and Hinglish tickets in the original.
- Track COD themes on their own: fake orders, refused at door, cash or UPI at delivery, refund to bank.
- Pincode or state splits often explain delivery and RTO themes.
