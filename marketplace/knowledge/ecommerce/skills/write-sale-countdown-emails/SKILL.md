---
name: write-sale-countdown-emails
description: "The emails for one big sale written in full, from early access to the final hours: announcement, early access for VIPs and subscribers, sale open, best sellers and proof, what is left, final day and final hours, each with subject lines, preview, body, terms block, send time, segment and stop rules. Urgency is honest: every deadline, countdown timer, stock count and 'was' price is checked as true, nothing resets, and a sale called final is not extended. Starts from break-even at the sale's discount depth and protects subscribers and full-price buyers. Use for Black Friday and Cyber Monday, Diwali, end-of-season or a brand's own sale days."
---

# Sale countdown emails

**You get:** seven to nine sale emails written in full (announcement, early access, open, best sellers, what is left, final day, final hours), each with two subject lines, preview, body, an identical offer terms block, send time and segment, plus a daily stop-and-check sheet, ready to load as drafts for the client to approve.

## When to use

- A multi-day sale is set: Black Friday and Cyber Monday, Diwali, an end-of-season sale or the brand's own sale days.
- Past sale emails used "last chance" three days running, or timers that restarted.
- The sale has early access for VIPs or subscribers and the emails need to respect it.
- Sale terms changed between the email, the banner and the checkout last year.

## Not for

- Planning the whole sale week (budget, ads, stock, cost guards): use `plan-peak-sale-week`, then write its emails here.
- Choosing the discount depth: use `how-deep-can-we-discount`.
- A single offer email: use `write-promo-campaign-email`.
- Sale ads: use `write-sale-and-discount-ad-copy`; banners: `design-sale-banners-and-hero`.

## What you need

Required (read access, level 1):

1. **Sale terms**: discount or ladder per product group, exclusions, start and end dates and times with time zone, early access window, code or automatic, stacking, returns on sale items.
2. **Break-even at each depth**: gross profit per order at the sale price and the break-even return on ad spend, from `how-deep-can-we-discount` or `store-meta-math`.
3. **Stock** per featured product and size, and the expected sale-week units.
4. **Price history** for any "was" price shown.
5. **Segments**: VIPs, active subscribers, 90-day engaged, recent full-price buyers.
6. **Courier cut-offs** for delivery before the gifting date, if any.

Optional: last year's sale emails with results, the ad and banner calendar from `plan-peak-sale-week`.

Drafts need draft access (level 2). Each send needs the client's yes; a pre-approved schedule with written stop rules counts only for the sends listed.

## Before you start: the gates

1. **Break-even.** Discounts eat margin, so the return on ad spend needed rises steeply with depth [OFF-0069]; a 30% cut can triple it [OFF-0065]. Pass when every featured group stays above zero gross profit per order. Fail: drop or cap that group.
2. **Stock.** Featured items cover expected units, or the email names fewer items.
3. **Reference prices.** "Was" prices only where genuinely charged recently [OFF-6145].
4. **Honest urgency.** One fixed end, written down, that the store will keep. Indian advertising rules name false urgency as misleading [ADC-6147].
5. **Subscribers.** Active subscribers get a subscriber-only offer at least as good, or are excluded, so they do not cancel to buy the public deal [OFF-0043].

## Steps

### 1. Write the terms block once

One block, used unchanged in every email: offer by group, exclusions, start and end with time zone, how to apply, one per customer if so, stacking, returns on sale items. Every number in every email is checked against this block.

If the store has a pre-built ladder (deeper rung, gift, free shipping, bundle) for reacting mid-sale [OFF-0068], write each rung's email now with its own terms block, so a change is approved copy, not a rushed send.

### 2. Set the calendar

| Email | When | Segment | Job |
|---|---|---|---|
| Announcement | 3 to 5 days before | Engaged | Dates, what is on sale, early access sign-up |
| Early access | Start of early window | VIPs, subscribers, early sign-ups | It is open for you first |
| Sale open | Public start | Engaged | The offer, the best products |
| Best sellers and proof | Day 2 | Non-buyers | Top items with one real review each |
| What is left | Middle day | Non-buyers | Sizes and items still in stock, from that morning's stock |
| Final day | Final day morning | Non-buyers | Ends tonight at [time, zone] |
| Final hours | 3 to 6 hours before the end | Non-buyers who clicked during the sale | Short plain text |

One practitioner sends three closing emails on a real final day [EML-0010]; this skill sends two by default and a third only to sale clickers if unsubscribes and spam reports stay normal. During the sale, send to engaged segments only and keep within the store's weekly send band where possible [EML-0041].

### 3. Write each email

Rules for all: headline names the offer and the end; one to four products with sale price and a reason each; one button; the terms block at the bottom; read at grade 8.

- **Announcement:** the dates, what is included, what is not, early access sign-up if offered. No discount yet.
- **Early access:** "Open for you before everyone else," the window's real end, the products most likely to sell out by stock data.
- **Sale open:** the offer in under ten words, the best three products, the end date.
- **Best sellers and proof:** each product with one exact review that answers its main doubt.
- **What is left:** sizes and items in stock as of that morning, stated as of a time ("as of 9 a.m."). If almost nothing is low, write "best picks still in every size" instead of scarcity.
- **Final day:** the end time with time zone first, then two products.
- **Final hours:** three or four lines of plain text from a named person: what ends, when, one link.

### 4. Countdown timers

Use a timer only if it counts to the real end in the stated time zone, shows the same end to every reader, never restarts on reopen, and shows "sale ended" after the end. Test it in two time zones before sending. No timer is better than a wrong one.

### 5. What happens at the end

- The sale ends at the stated time. Prices return, codes stop.
- No extension of a sale the emails called final. If the business must extend (a site outage, a courier strike), send one short email saying so and why, and do not call the new end "final" unless it is.
- Decide in advance whether buyers who paid full price in the 14 days before the sale can ask for the difference; write the answer into the sale FAQ so support gives one reply (practitioner choice, the client decides).

### 6. Stop rules for each day

Before each send, check: spam complaints from the last send (Gmail asks bulk senders to stay under 0.10% and never hit 0.30% [EML-6340]), unsubscribes against the store's normal rate, stock of featured items, and that the terms block still matches the site. Any fail holds the next send until the client decides.

### 7. Market notes

- **India:** state COD availability and courier cut-offs for delivery before the festival; WhatsApp marketing templates and DLT SMS templates are submitted days ahead with the exact sale wording; prices shown as on site. Customers won on deep discounts had worse lifetime value at many brands [CXP-0016], so do not add extra discount emails to chase volume past break-even.
- **US:** postal address, ad identification and unsubscribe in every email; subjects match content [EML-6341]. Customers acquired in November showed less repeat lift than February customers in one sample [MEA-0035], so sale emails favour existing customers and engaged subscribers rather than buying volume at any cost.

## Checks before you hand it over

- Every featured group stays above zero gross profit per order at sale price.
- The terms block is identical in every email and matches the site and banners.
- Every deadline names a time zone, and only the last day's emails use "final" or "ends tonight".
- Timers count to the real end and never reset.
- Stock and "was" price lines have a dated source.
- Subscribers and VIPs are handled as written; buyers exit the sequence.
- Daily stop rules are written with owners.
- Nothing sent without the client's yes.

## Output

1. **One-screen summary:** sale dates and time zone, the offer by group with gross profit per order, the calendar, stop rules.
2. **Terms block** (final wording).
3. **Each email in full:**

```
Email: [Announcement / ... / Final hours]
Send: [date, time, zone]   Segment: [...]   Exit: purchased in sale
Subject A / B: [...] / [...]   Preview: [...]
Headline: [offer + end]
Body: [products with sale price and reason]
Timer: [yes, ends date time zone / no]
Button: [...] -> [URL with UTM]
[Terms block]
Sources: [stock report time / review id / price history]
```

4. **Ladder emails** (if any), each with its own terms block.
5. **Daily check sheet:** Date, Spam rate, Unsubscribe rate, Stock check, Terms match, Go or hold, Owner.

## Common mistakes

- **"Last chance" every day.** Step 2 keeps it for the final day.
- **Timers that restart.** Step 4 sets the rules.
- **Terms drifting between emails.** Step 1 writes one block.
- **Quiet extensions.** Step 5 forbids extending a final sale.
- **Subscribers cancelling for the public deal.** Gate 5 protects them.
- **Chasing volume below break-even.** Gate 1 caps depth.

## Sources

- ADC-6147: false urgency is misleading (proposed).
- CXP-0016: discount-acquired customers had worse lifetime value.
- EML-0010: closing emails on a real final day.
- EML-0041: campaigns per week by revenue band.
- EML-6340: Gmail spam rate limits (proposed).
- EML-6341: US commercial email rules (proposed).
- MEA-0035: November customers repeated less in one sample.
- OFF-0043: subscriber-only sale offers.
- OFF-0065, OFF-0069: discount depth and break-even.
- OFF-0068: pre-built offer ladder.
- OFF-6145: genuine former prices (proposed).

What makes this skill ours: urgency is real by rule (one written end, timers that never reset, no extension of a final sale); one terms block locks every number; every send has a daily stop check on spam, unsubscribes, stock and terms; and the sale is held to break-even at each discount depth while subscribers and VIPs are protected.
