---
name: pricing
description: Use when setting or reviewing the full price of a product, plan, or add-on for an online store — e.g. "should this be $199, $200, or $197.50", "what should the add-on cost", "should we do a flat rate or pay per use", "where should the price go on the page", "how should I price this for a Japanese audience".
---

# Pricing

Choose the digits, structure, and placement of a full price so it sends the signal you want. The last digits of a price tell people whether to think about quality or about cost, complex prices get read as expensive, and where the price sits on the page changes how big it feels.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Brand brain** (its products part), made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for your brand brain. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Deciding whether a price should be rounded ($200), just-below ($199), or precise ($203)
- Pricing add-ons, upgrades, and per-unit components
- Choosing flat-rate vs pay-per-use
- Placing and coloring prices on a product page
- Setting an opening price for a negotiation or auction

## When not to use

- Working out *how much* people will pay → the `price-research` skill
- Wording a sale or coupon → the `discounts` skill

## Inputs

Collect, or state your assumption:

- Product, candidate price, currency
- What the buyer is optimizing for (quality/risk vs price); brand positioning (premium vs value)
- Whether this is a promotion price or the everyday price
- Whether the price will be negotiated, and whether the counterparty is an expert
- Market (Japan/China change the lucky ending)
- Audience gender mix, if known

> **Classify the product first.** *Hedonic* = bought for enjoyment, pleasure, or the experience (chocolate, fashion, decor, travel, spa, perfume). *Utilitarian* = bought to do a job, judged on function and value (detergent, appliances, insect repellent, tools, accounting software). If it's mixed, decide by what the buyer is optimizing for at the moment of purchase.

## Procedure

1. **Default to rounded** ($80, $200, $35) when the decision runs on feeling or quality: premium or luxury goods, hedonic products, most services, a premium brand image, or when you want an effortless choice. Note the boundary: the roundedness study found *non-rounded* prices did better when buyers evaluate analytically (typical utilitarian purchases) — for those, rounded earns its place only as a low-price-image avoidance (a 99-ending signals bargain) or for simplicity, not from that study. The risky-purchase examples (medical, safety) are a practitioner extension. † Also when the price may be bid *up* (a hot auction, tight housing market). When in doubt, round.
2. **Use just-below** ($199, $4.99) only when the left digit actually drops relative to the price you'd otherwise charge ($2.99 instead of $3.00 works; $3.49 instead of $3.50 doesn't) and one of these holds: it's a promotion price; buyers are price-focused; you want a low-price image; the item is cheap and low-risk. Lower left digits (1, 4) feel like bigger savings than high ones (7).
   - **Four figures or more** (common in ¥, ₹, ₺): repeat a low digit in the last three places instead — ¥2,111 beats ¥1,999. †
   - **Japan and China:** an 8 ending is the convention (prevalence evidence, not a measured lift), not 9.
   - **Upgrades:** if you want people to step up to a dearer option, keep both prices on the same left digit ($40.50 → $48.50, not $39.99 → $48.50).
3. **Use precise** ($2,865; $53,832/month) when you need to signal expertise and calculation in a big decision (B2B quotes, renovations) or when the buyer will negotiate *down*: precise anchors pull counteroffers into smaller steps, so you get fewer but higher offers. With expert buyers, stay moderately precise ($23,750, not $23,721.85) or justify the number with a cost breakdown. Evidence for precise as a "slightly above rounded" everyday price is weaker than for just-below.
4. **Prefer a flat rate** that covers what most customers want ($50/month, all-in; unlimited revisions), priced *above* the pay-per-use equivalent — a $6,000 fixed fee beat $50/h × 100 h. Keep pay-per-use only as a low-commitment entry tier.
5. **Keep components simple** when you must price separately: rounded amounts ($0.10/min, not $0.07), the same ending across components, no service charge tacked on, options easy to compare side by side. Add-ons follow the same rule ($15, not $12.35).
6. **Place the price below the product** image, not above; the same price reads lower.
7. **Color:** mostly male audience and a routine, low-scrutiny purchase → every price in red; the effect disappears for expensive or important purchases. Mixed red and black backfires. Audience unknown or mixed → black. This colour effect rests on weak evidence: test it on your own page first, and never use it to show different prices or colours to people based on their gender.
8. **Hand off:** sale prices → `discounts`; validating the level → `price-research`.

## Output

| Item | Value |
|---|---|
| Recommended price | $200 |
| Digit style | Rounded — premium hedonic product, quality is the decision driver |
| Add-ons / components | Monogramming $15 (rounded, same ending as core price) |
| Structure | Flat rate / pay-per-use / n.a. |
| Placement & color | Price below the product image; black (mixed audience) |
| Alternatives rejected | $199 (just-below reads as price-led; save for promotions), $197.50 (precision signals nothing here) |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Price ending picker](https://useaiblocks.com/prompts/price-ending-picker). It takes the plan.
- The [Discount wording and price display planner](https://useaiblocks.com/skills/discount-wording-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common mistakes

- Picking $195 or $225 "for confidence" with no rule — the choice is rounded *because* quality is the driver; state the reason.
- Using $9.99 everywhere by habit — just-below cues price-focus and undermines a premium image; use it for promotions and price-led categories.
- $1,999 in a four-figure currency — the just-below effect is overridden; use ¥2,111-style low repeating digits.
- Setting the upgrade tier across a left-digit boundary ($39.99 vs $48.50) when you want people to upgrade.
- Underpricing the flat rate to match pay-per-use — people will pay a premium for the cap on spend.
- Fiddly component prices ($4.61/GB plus a $6 fee) — people assume you're the expensive option without calculating.

## Quick reference

| Situation | Digits |
|---|---|
| Premium, hedonic, risky, service, unsure | Rounded |
| Promotion, price-led, cheap and low-risk | Just-below (left digit must drop) |
| Four-figure prices | Low repeating last digits (2,111) |
| Japan / China | 8 ending |
| Want upgrades | Same left digit on both tiers |
| B2B quote, negotiated down | Precise; moderate with experts |
| Bid up (auction) | Rounded |
| Usage-based service | Flat rate, priced above pay-per-use |
| Components / add-ons | Rounded, same endings, no service fee |
| Page layout | Price below the product |
| Mostly male audience, routine purchase | All prices red |

† No primary citation on file for this rule — a practitioner tip, not a measured finding.

Evidence and effect sizes: see [reference.md](reference.md).
