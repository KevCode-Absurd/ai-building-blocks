---
name: write-post-purchase-emails
description: "The first 30 days of post-purchase emails written in full: a thank-you with one helpful add-on, a reassurance email, a how-to-use email timed to delivery, a check-in that routes problems to support before they become returns, and a review request sent only after the buyer has had time to use the product, with subject lines, preview, body, timing, branches for first and repeat buyers and exit rules. Keeps order and delivery messages free of promotions so they stay transactional, follows Google and FTC review-request rules, and adds India notes for COD and WhatsApp updates. Use when the store sends only order confirmations, or a review ask before the parcel arrives."
---

# Post-purchase emails, first 30 days

**You get:** five post-purchase emails written in full (thank-you, reassurance, how-to, check-in, review request) with two subject lines, preview, body, button and timing each, first-buyer and repeat-buyer branches, and the exit and pause rules, ready to load as drafts for the client to approve.

## When to use

- After the order confirmation the store goes quiet until the next sale email.
- Reviews are few, or the review request lands before delivery.
- Returns or "how do I use this" tickets are high for a product that needs a little learning.
- A new product needs its own how-to and check-in emails.

## Not for

- Timing the whole path to the second order (replenishment, win-back, referral) from reorder data: use `post-purchase-repeat-sequence`; this skill writes the first 30 days.
- The review collection system across email, site and packaging: use `build-review-collection-system`.
- The "how did you hear about us" survey: use `post-purchase-how-did-you-hear-survey`.
- Order confirmation and shipping notices themselves (store settings): edit them in the store's notification settings with the same voice rules; this skill does not replace them.

## What you need

Required (read access, level 1):

1. **Delivery times** by region from the courier or tracking app, and whether a Delivered event reaches the email platform.
2. **Product use facts** for the top products: how to use, common mistakes, how long before a result is felt, care steps. From the product team or approved claims (`product-claims-profile`).
3. **Support tickets and return reasons**, last 90 days, tagged by product.
4. **Reviews app settings**: the review link format, whether photos are allowed, and any incentive offered.
5. **Add-on candidates**: products often bought together, from the Shopify order export (Name, Lineitem name, Lineitem quantity).
6. **Brand voice**: five real lines; the name of a real person who can sign and read replies.

Optional: loyalty or referral programme terms, current post-purchase flow report.

If no Delivered event exists, time from Fulfilled at plus the median delivery days for the region, and say so. Drafts need draft access (level 2); switching on needs the client's yes.

## Before you start: the gates

1. **Service before selling.** Open tickets, refunds or failed deliveries pause every email after the thank-you. The flow must be able to read that state or the builder adds a tag.
2. **Order emails stay transactional.** In the US, a message counts as commercial if its subject reads commercial or the order content is not mainly at the start [EML-6341]. In India, WhatsApp order updates stay utility only with no offer [OPS-6286].
3. **Review request rules.** No incentive tied to a positive review, no asking only happy buyers, no steering unhappy buyers away from reviewing [CXP-6301]. If reviews feed Google, Google bars any incentive for reviews [CXP-6300].
4. **Claims.** Results timing and use claims come from the approved claims list.

## Steps

### 1. Set timing from the product, not a template

Most second purchases happen within 30 days of the first [EML-0062]. Build the 30 days around delivery and first use.

| Email | Send | Job |
|---|---|---|
| 1 Thank-you | About 10 minutes after order [EML-0062] | Thanks, what happens next, one add-on |
| 2 Reassurance | Day 2 [EML-0051] | Why this was a good choice; tracking; who to ask |
| 3 How-to | Day of delivery, or day 4 for fast delivery [EML-0051] | Use it right in three steps |
| 4 Check-in | Delivery plus 5 to 7 days | Is it working? Fix problems before returns |
| 5 Review request | When a result can be felt (see below) | Ask for an honest review |

Review timing by product (practitioner defaults, test them): quick-use items about 7 days after delivery; clothing and home items 10 to 14 days; skincare, supplements and anything with slow results only when the claims list says a change is usually felt. Never before delivery. If that point falls after day 30, the review email moves to `post-purchase-repeat-sequence`.

Exits: a refund or cancellation stops all; a second order moves the person to the repeat-buyer branch; a review already left skips email 5.

### 2. Pick the one add-on

Use the order export: the product most often bought with or after this one, by gross profit added, not by take rate alone. One product, in email 1 only, framed as help ("most people use it with"), never "before it sells out" unless stock data shows it. If the buyer already owns it, skip the block.

### 3. Write the emails

Rules for all: one job, one button, signed by a real person whose replies are read, grade 8 reading level.

- **Email 1, thank-you.** First line: thank you and the order number. Then when it ships and arrives (range from real delivery data), one sentence on what to do when it arrives, the add-on block. Keep the order details first if this replaces a store notification.
- **Email 2, reassurance.** Why buyers chose this product, using one real review or a fact from the spec. The tracking link. "Reply to this email if anything looks wrong" with the real support hours. No offer.
- **Email 3, how-to.** Three steps, one common mistake to avoid, one care or storage tip, from the product facts. A short video or GIF only if it exists. Educated buyers tend to get better results and return less [EML-0051].
- **Email 4, check-in.** Ask one question with two buttons: "Going well" and "Something's not right". The second goes to a help form or WhatsApp chat, not a returns page. Low-effort service protects loyalty far more than delight does [CXP-0009]; a poor return experience makes most shoppers less likely to buy again [CXP-0007].
- **Email 5, review request.** One sentence on why reviews help other buyers, a one-click link to the review form, a photo prompt if photos are allowed, and the same ask to every buyer. If the store offers anything for a review, say it is given for any honest review, positive or negative, and disclose it where the review shows [CXP-6301].

Two subjects per email. Plain subjects work here: "Your [product] ships [day]", "How to get the most from [product]", "Quick question about your [product]".

### 4. Branch first and repeat buyers

- **First buyers:** all five emails.
- **Repeat buyers:** emails 1 and 5 only, with email 1 shortened ("thanks for coming back") and the add-on chosen from what they have not bought.
- **Gift orders** (gift message or different shipping name): email 1 to the buyer with delivery facts; no how-to or review request to the buyer, since they may never use it.

### 5. Fix what generic templates get wrong

- No "you are one of our best customers" sent to everyone; claims about the reader must be true of the reader.
- No invented proof such as "customers who use both rate it higher" without data.
- No loyalty or VIP pitch in the first 30 days unless the programme exists and the buyer qualifies; hand off to `design-loyalty-program`.

### 6. Market notes

- **India:** for COD orders, email 1 says the amount to keep ready and the delivery window; order and delivery updates on WhatsApp go as utility templates with no offer [OPS-6286], written with `write-sms-and-whatsapp-messages`. Delivery days differ for non-metro pin codes; use the range.
- **US:** emails 2 to 5 carry the postal address and unsubscribe; the thank-you stays mostly order content so it remains transactional [EML-6341].

## Checks before you hand it over

- Timing follows delivery data, and no review request goes before delivery plus use time.
- Every email after the thank-you pauses on open tickets, refunds or failed delivery.
- The same review ask goes to every buyer; any incentive is disclosed and not tied to a positive review.
- Use and results lines match the approved claims list.
- One add-on, in email 1 only, skipped if already owned.
- Order and WhatsApp utility messages carry no offer.
- Nothing switched on without the client's yes.

## Output

1. **One-screen summary:** the five emails, timing by product type, branches, and what is paused when.
2. **Flow sheet:** Email, Trigger, Delay, Job, Branch, Exit and pause rules, Subject A, Subject B, Preview.
3. **Each email in full:**

```
Email [n]: [job]   Send: [delay from order or delivery]
Branch: [first / repeat / gift]   Pause: open ticket, refund, failed delivery
Subject A / B: [...] / [...]   Preview: [...]
Body: [first line]
[3 to 8 short lines]
Button(s): [...] -> [URL]
Signed: [real name, role]   Replies go to: [inbox]
Sources: [delivery data / claims list line / review id]
```

4. **Review timing table:** Product type, Days after delivery, Reason.
5. **Assumptions:** one line each, at most three, only where an unknown changes what to do. Claims are only those with proof on file; incentive wording follows the review platform's rules.

## Common mistakes

- **Review ask before the parcel arrives.** Step 1 times it from delivery and use.
- **Promotions in order emails.** Gate 2 keeps them out.
- **Asking only happy buyers.** Step 3 sends one ask to all.
- **Cross-selling to someone with a problem.** Gate 1 pauses selling while a ticket is open.
- **Generic praise of the reader.** Step 5 removes untrue lines.

## Sources

- CXP-0007: poor returns cut repeat buying.
- CXP-0009: low-effort service and loyalty.
- CXP-6300: Google bars incentives for reviews (proposed).
- CXP-6301: FTC review incentive and selective asking rules (proposed).
- EML-0051: reassurance and how-to timing.
- EML-0062: thank-you at about 10 minutes; second orders within 30 days.
- EML-6341: commercial versus transactional email (proposed).
- OPS-6286: WhatsApp utility versus marketing (proposed).

What makes this skill ours: timing comes from the store's delivery data and each product's time to a felt result; selling pauses whenever there is an open problem; the review ask follows Google and FTC rules, the same ask to every buyer; and order messages stay free of offers so they remain transactional in the US and utility on WhatsApp in India.
