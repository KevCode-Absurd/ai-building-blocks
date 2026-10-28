---
name: subscription-pricing
description: Use when structuring or reviewing prices for a subscription, membership, recurring plan, or member dues — plan tiers, upgrade paths, pay-per-use vs flat rate, extra-seat or overage pricing, membership perks — e.g. "how should I price Basic vs Pro", "flat monthly or per video", "what should extra seats cost", "how do we get more upgrades", "is a paid membership worth it".
---

# Subscription pricing

Structure recurring prices so people choose a plan, pay the flat rate, and step up a tier. This skill is the delta versus `pricing`, `discounts`, and `post-purchase`. One-off digital products → `digital-product-pricing`.

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

- Designing or reviewing plan tiers and their prices
- Choosing flat-rate vs pay-per-use, or pricing seats, storage, minutes
- Adding a paid membership perk, or rewards for members

## When not to use

- One-off digital products → the Digital product pricer
- Shared digit and component rules in isolation → the Pricing strategist
- Wording a plan discount → the Discount wording planner; measuring willingness to pay per month → the Willingness to pay survey

## Inputs

Collect, or state your assumption: tiers, prices, billing period; any per-unit component; whether members optimize for quality or lowest price; which tier you want people to move to; order/usage frequency.

If member counts, upgrade numbers or usage figures are missing, say so and write `MISSING: <what>`. Do not make them up. Price from the structure alone (digits, flat rate versus pay-per-use, add-on prices) and say the advice is untested on the user's own members.

## Procedure

Only the rules that change for recurring plans. The rules below stand on their own. The original skill pointed to other skills for more depth (pricing, post-purchase, promotions, discounts, price research); those are not in this folder, so do not mention them. The reason for each rule is given with it.

1. **Lead with a flat rate that covers what most members want**, priced *above* the pay-per-use equivalent. Keep pay-per-use only as a low-commitment entry. The source study is purchasing professionals buying usage-based services; applying it to consumer memberships is a transfer, so tell the user to test it with their own members. Reason: a flat rate priced above the pay-per-use total gives heavy users a cap, and light users still have a low-commitment way in.
2. **Put the upgrade path on the same left digit.** No just-below on the lower tier if you want Basic → Pro ($40 → $48, not $39.99 → $48). Reason: a .99 on the lower tier makes the step up look like a jump in the first digit.
3. **Simplify every component.** Rounded per-seat / per-GB prices, the same ending, no admin fee. Reason: messy add-on prices and fees are hard to read and put buyers off.
4. **Paid perk needs a minimum.** A membership that unlocks free shipping or member rates raises spend; without a minimum, members split into many small orders.
5. **Rewards: automatic, single tier, threshold.** Optionally variable; combining variable rewards with auto-enrollment is untested. Reason: rewards members do not have to sign up for reach more people, and one tier with a threshold is easy to understand.

Shared, unchanged: quality-led → rounded, price-led or post-trial → just-below (subject to step 2); "for $0" on free trials; abandoned-signup reminder at 24–72 h is an assumption transferred from carts.

## Worked example

Layout only. Every price below is a placeholder for the user's own numbers. Never reuse them.

Membership site, plan: Basic [BASIC PRICE, ends .99], Pro [PRO PRICE, ends .99], pay-per-video [PER-VIDEO PRICE], extra seats [SEAT PRICE] + [ADMIN FEE], opt-in 3-tier rewards, goal: more Basic→Pro upgrades.

- **Drop the .99 on both tiers.** That is the minimum fix. Then bring the two prices close enough to share the left digit (the pattern is $40 → $48, not $39.99 → $48). If the real gap is wide, a wide jump is right only when Pro gives members much more. Say which case applies.
- Pay-per-video stays as entry, priced so that [N] videos cost about the same as Pro. Work out N from the user's own usage, or mark it MISSING.
- Seats: **a rounded price, no admin fee**.
- Rewards: **auto-enroll, one tier**.

## Output

| Item | Value |
|---|---|
| Tiers | Basic [PRICE]/month · Pro [PRICE]/month |
| Upgrade path | No .99 on Basic; same left digit where tiers are close |
| Pay-per-use | Entry only; heavy users cheaper on Pro |
| Components | [ROUNDED PRICE] per extra seat, no admin fee |
| Perk / rewards | Minimum order on the perk; auto-enrolled single tier |
| Why | one line per choice |

**Next:** test one tier change with a small group of members. Track Basic to Pro upgrades for one full billing cycle before you change prices for everyone.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Three-package pricing planner](https://useaiblocks.com/prompts/three-tier-price-ladder-drafter).
- The [SaaS pricing strategist](https://useaiblocks.com/skills/pricing-strategist).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common mistakes

- Adding a mid-tier to "shrink the jump" — the jump is the .99 boundary; fix the digits first.
- Pricing the flat rate at the pay-per-use equivalent "to be fair" — people pay more for the cap.
- A perk with no minimum — members fragment usage to exploit it.
- Opt-in tiered rewards — automatic, single tier, threshold reward.

## Quick reference

| Situation | Do |
|---|---|
| Plan structure | Flat rate above pay-per-use; pay-per-use as entry |
| Want upgrades | Same left digit; no .99 on the lower tier |
| Seats / storage | Rounded, same endings, no fee |
| Membership perk | Minimum order/usage |
| Member rewards | Auto-enroll, single tier |

Evidence and effect sizes: see [reference.md](reference.md).
