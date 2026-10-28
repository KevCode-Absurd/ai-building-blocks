---
name: discounts
description: Use when deciding how to word, size, or display a price discount, sale price, coupon, or markdown for an online store — e.g. "should this be 25% off or $15 off", "how do I show the sale price", "is 60% off too much", "what kind of coupon code should we send", "how do I write the promo banner".
---

# Discounts

Turn a planned discount into the exact numbers and wording that make it look biggest and most credible. The same discount can be expressed several ways; people react to the size of the numeral they see, not the arithmetic, and very large discounts read as a quality warning.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your offer** (yours): what you sell and the real terms: price, trial, guarantee, delivery.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Clearance discount planner](https://useaiblocks.com/skills/clearance-discount-planner). Bring a spreadsheet.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your offer, a plan, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Choosing between percentage-off and amount-off
- Writing the sale badge, strikethrough price, banner, or email subject for a markdown
- Sizing a discount (how deep is too deep)
- Choosing the format of a coupon code (store-wide vs product-specific)
- Deciding whether to add a time limit

## When not to use

- Setting the full price itself (digits, endings) → Price digits and placement planner
- Promotions that aren't price cuts (gifts, bundles, pre-orders, special days) → Offer designer

## Inputs

Collect, or state your assumption:

- Full price `P` and either the sale price `S` or the discount `D` (`D = P − S`). `P` must be a price you actually charged for a reasonable period before the sale — if it wasn't, there is no discount to frame.
- Currency
- Scope: one product, one brand/category, or the whole store
- Where it appears: product page, banner, coupon code, email
- Reason for the sale (seasonal, clearance, launch, customer birthday) — if none, say so

If you already have a discount plan or a price audit, take the depth and scope from it.

## Procedure

1. **Check the reference price is genuine.** Showing a struck-through or "was" price that was never really charged is deceptive pricing (US FTC guides, UK CMA, and the EU rule that a "was" price must be the lowest price of the prior 30 days). Confirm `P` was the real selling price before continuing. Ask the user for the dates and the price from their own sales history. If they cannot give them, stop and say there is no discount to frame yet. These rules differ by country and change. This is planning help, not legal advice. Tell the user to check the current rule for where they sell, and if you're unsure of the local rule, say so.
2. **Compute the three numbers.** `D = P − S`; `off% = D / P`; `higher% = D / S`. Example: P = 90, S = 60 → D = 30, off% = 33%, higher% = 50%.
3. **Check the depth.** If `off% > 40%`, warn: discounts this deep signal low quality, and the studies named in reference.md are said to have found that very deep discounts (around 60% and up) can reduce sales. We have not checked that claim, so treat it as unverified. The effect varies, so test it on your own shoppers and do not quote a figure, especially for lesser-known brands or products whose quality is hard to judge before buying. Propose capping at 40% and adding a gift or bundle instead (see Offer designer). Exception: explicit clearance or shutdown, stated as the reason.
4. **Pick amount vs percentage by the numeral of the full price.** If `P ≥ 100` in the currency's units → show the **amount** off ("$120 off"). If `P < 100` → show the **percentage** off. The rule is about the size of the printed number, so it holds in any currency.
5. **If percentage: recalculate against the sale price.** State the discount as "was X% higher" where `X = higher%`, because `D / S > D / P`. Cap: if `higher% > 100%`, people ignore the "100" and read only the remainder, so fall back to plain "`off%` off" or the amount. Whenever you use "was X% higher", show the plain amount or percent off beside it, so the shopper can see the real size of the cut.
6. **Keep the price ending consistent.** The sale price should end the way the full price ends ($26.75 → $16.75, not $16.99). If `S` doesn't, adjust `S` to the nearest value with the same ending and recompute step 2. Always show the full price next to the sale price so the subtraction is easy.
7. **Coupons.** Store-wide or most-of-store coupon → **percentage** off ("everything 15% off"), which invites "the more I spend, the more I save". Product- or brand-specific coupon → **amount** off ("$2 off Gillette razors"), which makes the loss of not using it concrete. Send store-wide coupons to segments likely to buy new items, not to hoard. The evidence doesn't give a coupon size; apply the depth check from step 3 to the coupon, and if a coupon can stack on top of a marked-down item, apply it to the combined discount.
8. **Phrase the condition before the reward.** "Spend $100 and get $20 off", not "Get $20 off when you spend $100". The offer then reads as a reward, not a restriction. †
9. **Time limit, if any.** A time limit is fine and should be short (24–48 h), tied to a stated reason (seasonal, birthday), and carry a timezone. Online, time limits mostly raise awareness and visits rather than immediate sales, so don't rely on the deadline alone. Never limit by quantity ("only 500 left"): people who miss out get angry and switch brands; time limits don't cause this.
Price colour is not covered here. One study on red prices and male shoppers is in reference.md, but it is a single study. Do not target price colour by gender.

## Output

| Item | Value |
|---|---|
| Full price | [FULL PRICE] |
| Sale price | [SALE PRICE] |
| Display | ~~[FULL PRICE]~~ **[SALE PRICE]** — was [X]% higher |
| Badge / subject line | "[Sale name]: was [X]% higher — ends [day and time, timezone]" |
| Coupon (if any) | Store-wide → `[CODE]` = [N]% off everything |
| Warnings | none / depth > 40% / higher% > 100% |
| Why | one line per choice, citing the rule |
| Next step | Check the digits and placement with Price digits and placement planner, or add a gift or bundle with Offer designer |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Sale discount and price change review](https://useaiblocks.com/skills/discount-and-price-change-checker).
- The [Fake sale price cleaner](https://useaiblocks.com/skills/fake-sale-price-cleaner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common mistakes

- Choosing "$30 off" on a $90 item because "a dollar figure feels concrete" — under 100, the percentage is the bigger numeral. Use 33% off, or better, "was 50% higher".
- Rejecting a 60% discount only on margin grounds — the bigger problem is that it signals poor quality and can cut sales.
- Rounding the sale price to .99 when the full price ends in .00 or .75 — keep the endings the same.
- Treating a countdown as the main sales driver online — it drives clicks and opens, not purchases.
- Using "only N left" for urgency — quantity scarcity angers the people who miss out.
- Striking through a price that was never actually charged — that's deceptive pricing, not a discount.

## Quick reference

| Situation | Do |
|---|---|
| Full price ≥ 100 | Amount off |
| Full price < 100 | Percentage off, stated as "was X% higher" (X = D/S) |
| D/S > 100% | Plain "% off" or amount |
| Discount > 40% | Warn; cap or swap for a gift/bundle |
| Store-wide coupon | % off |
| Product/brand coupon | Amount off |
| Sale price ending | Same as full price |
| Wording | Condition first, then reward |
| Urgency | Short time limit with a reason and timezone; never a unit cap |

† No primary citation on file for this rule — a practitioner tip, not a measured finding.

Evidence and effect sizes: see [reference.md](reference.md).

After the sale, compare sales in the sale window with a similar period before it, so you can see what the discount really did.
