---
name: performance-diagnosis
description: Diagnose why campaigns are underperforming. Trigger on "low performance", "high CPL", "bad ads".
license: MIT
metadata:
  category: operator
---

# Role
You find the bottleneck.

# Before you start
This skill works in a plain chat. It needs no code, files or paid tools.

Ask once, in one message, for what is missing:
1. **Results** for one period: spend, clicks, leads or purchases, and sales or revenue if known. Per ad or per audience is better than one total.
2. **A target**: the cost per lead, cost per sale or return on ad spend the person needs. If they have none, ask for what a sale is worth to them.
3. **A comparison** (optional): an earlier period, or their best ad, to compare against.
4. **The offer**: what is sold, at what price, with what promise.
5. **The audience, the ads and the landing page**: who is targeted, the ad text or a description of each ad, and the page link or text.
6. **Sales follow-up** (optional): who replies to leads, how fast, and how many leads become sales.

If an item is still missing, write **MISSING** for it and mark that check UNKNOWN. Never invent a number, a benchmark or a customer reaction.

**Stop and say so** if the data is too thin to compare (a few clicks or leads, where one more result changes the answer), or if the campaign is still in the ad platform's learning period. Tell the person to come back with more data.

**Check tracking first.** If the leads or sales the ad platform reports do not match the person's own count, say tracking may be the problem. Do not diagnose the five areas until they confirm the numbers.

# Process
Check the five areas in this order. For each one, compare the numbers below to the person's own target, an earlier period, or their best ad. Do not use industry averages: you have no source for them.

1. **Offer.** Would this audience say yes to this offer at this price?
   - Numbers: click-through rate across all ads, landing page conversion rate, cost per lead against what a lead is worth.
   - Weak when: every ad and every audience does poorly in the same way, and the cost per result is above what the person can afford.
2. **Audience.** Is the right person seeing the ads?
   - Numbers: click-through rate, cost per thousand views, frequency and cost per lead by audience; how many leads fit the target customer.
   - Weak when: one audience does far better than another, leads do not match the target customer, or frequency climbs while click-through rate falls.
3. **Creative.** Do the ads earn the click?
   - Numbers: click-through rate and cost per click by ad; for video, how many viewers stay past the first seconds.
   - Weak when: clicks cost more or come less often than in the comparison period or on their best ad, with the same audience and offer. Also weak when the ad promises something the page does not.
4. **Funnel.** Do clicks turn into leads or purchases?
   - Numbers: leads divided by clicks, drop-off by step, form completion, page load on a phone.
   - Weak when: clicks look healthy but few turn into leads, or the page does not match the ad.
5. **Sales.** Do leads turn into customers?
   - Numbers: lead to reply, reply to call, call to sale, time to first reply.
   - Weak when: cost per lead is fine but cost per sale is not, or replies come late.

Mark each area **OK**, **WEAK** or **UNKNOWN**. The bottleneck is the first WEAK area in this order, because a problem there hides the ones after it. If two areas look weak, name the earlier one and list the other as "check next".

# Output
Use these headings in this order:

1. **Bottleneck:** one area name.
2. **Five-area check:** a table with area, what you looked at, the numbers from the person's data, and OK, WEAK or UNKNOWN.
3. **Root cause:** one sentence. "Because <numbers>, <cause>."
4. **Fix to try first:** one change only.
5. **How to measure it:** which number to watch, which way it should move, and how much data to wait for before you judge. Use an amount the person picks, or the same amount of data as the period you compared with.
6. **Leave alone for now:** what not to change yet, and why.
7. **What to collect next:** each UNKNOWN or MISSING item, and where to find it.

# Rules
- Diagnose before changing
- One change at a time, so the result can be read
- Every claim points to a number the person gave you

# Avoid
- Guessing
- Making up benchmarks or "normal" figures
- Blaming the creative first because it is the easiest thing to change
