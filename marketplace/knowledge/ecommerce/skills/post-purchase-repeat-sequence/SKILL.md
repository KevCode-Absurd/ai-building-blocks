---
name: post-purchase-repeat-sequence
description: "Builds the email and SMS sequence that turns a first order into a second one, timed from the store's real reorder intervals and delivery times per product rather than fixed day counts. Works out each product's median days to reorder and usage cycle from the order export, then sets the confirmation, reassurance, how-to, review, referral, replenishment and win-back messages with a goal, timing, channel, subject, preview and body outline for each, and one ask per message. Any incentive is checked against gross profit per order first. Use when first-time buyers rarely come back, when launching a consumable, or when the current post-purchase flow is one thank-you email."
---

# Post-purchase repeat-buyer sequence

**You get:** a reorder table per product and a timed email and SMS sequence with subject, preview, body outline and exit rule for every message, plus build notes and a sequence file, ready to set up.

The messages between a first order and a second, each timed from what this store's buyers actually do. Klaviyo names are used as the example; any flow tool works.

## When to use

- Most customers buy once and the first-to-second order rate is low or unknown.
- The current post-purchase flow is a single thank-you email.
- A consumable or refillable product launches and needs a reorder path.
- Reviews or referrals are thin and the store wants a steady ask built into the sequence.

## Not for

- The full map of every flow the store needs: use `email-sms-flow-plan`.
- Account settings, deliverability and list health: use `email-account-health-audit`.
- Final subject lines and body copy polished against past results: use `email-copy-from-store-history` after this plan.
- Subscription cancel flows and dunning: use `email-sms-flow-plan`, step 6.

## What you need

Required (read access, level 1):

1. **Order export**, 12 months if possible: Name, Created at, Customer Id or Email, Lineitem sku, Lineitem name, Lineitem quantity, Subtotal, Discount Code, Fulfilled at.
2. **Delivery times**: days from order to delivery by region, from the courier or tracking app.
3. **Products and use**: how each top product is used, how long a unit lasts at normal use, how long before a buyer feels a result.
4. **Brand voice**: five real lines from the site, emails or packaging.
5. **Reviews export** (CSV from the reviews app) and the **referral programme details**, if one exists.
6. **Gross profit per order** from `store-meta-math`.

Optional: return reasons, support ticket tags, post-purchase survey answers.

If the export is short (a new store), use usage cycles alone and mark timings "to recheck at 90 days". Building the flow needs draft access (level 2); switching it on needs a client yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when known. Fail: plan the sequence with no money incentives until it exists.
2. **Delivery data.** Pass when the store can trigger on fulfilment or delivery events. Fail: time from order date plus the median delivery days, and say so.
3. **Repeat potential.** Check the store's 12-month repeat rate. If it is near zero and products are durable (furniture, appliances), narrow the job to reviews, referrals and accessories; a reorder push will not work.
4. **Capacity.** Ask who answers replies and handles returns. Fix effort before adding delight: high-effort service turns most buyers disloyal [CXP-0009].

## Steps

### 1. Measure reorder intervals per product

From the order export, for each top product (or category if volumes are small):

- Buyers who ordered it, and the share who ordered again within 12 months.
- Days from first order to second order: the 25th percentile, median and 75th percentile.
- Most common second product.

Most second orders come within 30 days of the first in many categories [EML-0062], but use this store's numbers. A reminder at a fixed day 120 misses a buyer who reorders every 45 days.

### 2. Work out usage cycles

Usage cycle = units in the pack divided by daily use. Replenishment goes at about 75% of the cycle, so it lands before they run out; reported conversion was 8 to 15% versus 1 to 3% for promotions [EML-0049]. Where the measured reorder median (step 1) and the usage cycle differ, use the earlier of the two for the first reminder and the later one for the second.

### 3. Set the delivery anchor

Messages about using the product key off delivery, not order date. If the store has a delivery event, trigger on it. If not, use order date plus median delivery days for the buyer's region.

### 4. Write the sequence

Each message has one goal and one ask. Times below are defaults to replace with the store's numbers.

| # | Timing | Channel | Goal | One ask |
|---|---|---|---|---|
| 1 | About 10 minutes after order [EML-0062] | Email | Confirm, thank, set delivery expectation | Add one matching item before it ships |
| 2 | 2 days after order [EML-0051] | Email | While it ships: what happens next, 3 to 5 tips to get the best result, who to contact | Reply with any question |
| 3 | Shipping and delivery updates | Email or SMS | Cut "where is my order" contacts [CXP-0014] | Track the parcel |
| 4 | Delivery day or day after | Email | How to use it well; first-week routine | Watch the 60-second how-to |
| 5 | Delivery + time to feel a result | Email | Ask how it is going; route problems to support | Reply or leave a review |
| 6 | About 10 days after delivery [EML-0049] | Email | Second-purchase nudge: the most common second product from step 1 | Try the second product |
| 7 | 75% of usage cycle (consumables) [EML-0049] | Email, then SMS | Reorder before running out | Reorder (or subscribe, with easy skip) |
| 8 | After a review of 4 or 5 stars | Email | Referral ask | Share the referral link |
| 9 | After a second order, or on reaching the loyalty tier | Email | Loyalty or VIP invite: access (early drops, service), not a discount | Join |
| 10 | Median reorder days + 50% with no second order | Email | Win-back; check for a problem first | Come back, or tell us what went wrong |

For products with no quick effect, frame the first weeks as a trial at message 4: a simple daily log or a before photo, so buyers stay with it [CXP-0003].

### 5. Fill each message's content

For each message write: subject (under about 45 characters), preview text, a body outline of three to five lines in the brand's voice, the one call to action, and the exit rule (second order placed, or reply to support). Rules:

- Reviews used in the sequence each answer one known objection (results timing, fit, taste, ease), not general praise [EML-0033]. Pull them from the reviews export with the reviewer's first name and the date.
- Match the brand voice by ear: put the five real brand lines beside five of yours and fix any that sound different.
- Split new buyers from repeat and loyal buyers; a five-time buyer should not get the first-order welcome [EML-0053].
- Set every delay from the trigger (order or delivery), not from the previous email, so one late send does not push the rest.
- Add skip rules: drop the cross-sell for anyone who already bought it, the loyalty invite for members, and split the tips email by product type when the catalogue has distinct lines.
- Review message: a one-click link to the review form, a prompt to add a photo, and three or four real customer photos as examples.
- Write only what is true of the reader: never tell a first-time buyer they are "one of our best customers".
- Every email invites a reply, and a person reads the replies.

### 6. Decide incentives with the money gate

A second-purchase incentive of 10 to 15% is common [EML-0049]. Before adding one, check: gross profit per second order after the discount must stay above zero, and the incentive should only go to buyers who have not reordered by the store's median. Buyers won on deep discounts had worse lifetime value at many brands [CXP-0016], so prefer non-money levers first: the matching product, a how-to, a gift that helps use the product. Unannounced surprise gifts rarely pay back [CXP-0006]; if used, target buyers at risk of leaving.

### 7. Returns and problems inside the sequence

Message 5 routes unhappy buyers to support before they post a bad review. A poor return makes most shoppers less likely to buy again [CXP-0007]; fast refunds were linked to much faster repurchase in vendor data [CXP-0015]. Pause messages 6 to 10 for anyone with an open return or ticket.

Win-back at 30 to 45 days after the last order converted about 2.3 times better than at 90 days or more; audit first if over 20% of lapsed buyers complained or returned [EML-0050].

### 8. Optional: a printed letter

For high-value first orders, a personal printed second-purchase letter doubled conversion against a control group at one pet retailer [CXP-0020]. Offer it only if the store can measure it with a holdout.

### 9. Measure it

Main metric: first-to-second order rate at 60 and 90 days, compared with buyers from before the sequence went live, or with a 10% holdout (practitioner default, test it). Secondary: replenishment reorder rate, review rate, referral orders, unsubscribe rate per message.

## Checks before you hand it over

- Every timing comes from step 1, 2 or 3, or is marked as a default to replace.
- Each message has one goal, one ask, subject, preview, body outline and exit rule.
- Reviews quoted are real, from the export, with name and date, and each answers one objection.
- Every incentive passes the gross profit check and goes only to buyers past the median.
- Returns and open tickets pause the selling messages.
- New and repeat buyers get different paths.
- Nothing is switched on without a client yes.

## Output

1. **One-screen summary:** current first-to-second order rate, the reorder median per top product, the sequence in one line per message, and the expected measure date.
2. **Reorder table:** Product, Buyers, Reorder share at 12 months, Days to reorder (25th, median, 75th), Usage cycle, Most common second product.
3. **Sequence table:** Number, Trigger and delay, Channel, Goal, Subject, Preview, Body outline, Call to action, Exit rule, Metric.
4. **Build notes:** triggers, filters and splits for the builder.
5. **File:** `post-purchase-sequence.csv` or a Google Doc with each message drafted.

## Common mistakes

- **Fixed day counts.** Step 1 sets timing from the store's reorder data.
- **Timing from order date when delivery takes a week.** Step 3 anchors to delivery.
- **Discounts to everyone.** Step 6 limits them to buyers past the median.
- **Asking for a review before the product works.** Message 5 waits for time to feel a result.
- **Selling to someone with an open return.** Step 7 pauses them.
- **Generic praise in emails.** Step 5 uses reviews that answer objections.

## Sources

- CXP-0003: trial framing for slow-effect products.
- CXP-0006: surprise gifts rarely pay.
- CXP-0007, CXP-0015: returns and refund speed affect repeat buying.
- CXP-0009: fix effort before delight.
- CXP-0014: proactive tracking updates.
- CXP-0016: discount-acquired buyers repeat less.
- CXP-0020: printed second-purchase letter.
- EML-0033: reviews that answer objections.
- EML-0049, EML-0051, EML-0062: replenishment and post-purchase timing.
- EML-0050: win-back timing and pre-check.
- EML-0053: split new, returning and loyal.

What makes this skill ours: every timing is measured from the store's own reorder percentiles, usage cycles and delivery times; incentives pass a gross profit check and only reach buyers past the median; and buyers with an open return or ticket are taken out of the selling messages until the problem is solved.
