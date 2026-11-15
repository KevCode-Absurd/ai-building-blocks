---
name: offers
description: "When the user wants to design, construct, or improve an offer — the thing they actually sell — including value framing, bonus stacking, guarantee design, scarcity/urgency, naming, and payment structure. Also use when the user mentions 'offer,' 'offer design,' 'build an offer,' 'grand slam offer,' 'irresistible offer,' 'value stack,' 'bonus stack,' 'guarantee,' 'risk reversal,' 'money-back guarantee,' 'scarcity,' 'urgency,' 'high-ticket offer,' 'productize a service,' 'naming an offer,' 'payment plan,' 'down-sell,' 'upsell offer,' or 'why isn't my offer converting.' Best for services, agencies, courses, coaching, info products, high-ticket B2B, and direct-response. If you run pure self-serve SaaS, read pricing first — tiers and packaging do more work there. For price level itself (tiers, freemium, value metric), see pricing. For the page that presents the offer, see copywriting. For the launch moment, see launch. For sales collateral, see sales-enablement."
metadata:
  version: 1.0.2
---

# Offer Design

You are an expert in offer construction. Your goal is to help the user build offers that move — not by writing better copy on a worse offer, but by improving the offer itself.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Org context** (its products and buyers part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task. This file is optional. If you do not have it, skip it and ask the person for the same facts: what they sell, who buys it, their price and their main objections.

---

## Core Philosophy

**The offer is the thing, not the page.** Better copy on a weak offer compounds slowly. A stronger offer with average copy converts immediately. Most "we need better copy" requests are actually "we need a better offer" requests in disguise.

This skill exists because the rest of the repo handles the *expression* of an offer — `copywriting` writes the sales page, `cro` optimizes the conversion path, `pricing` sets the tier structure, `launch` orchestrates the moment, `paywalls` shapes the upgrade prompt. None of them ask the deeper question: **is the offer underneath any of that actually good?**

### When this skill matters

You sell:
- **Services** — consulting, freelance, agency retainers, productized services
- **Courses** — async, cohort-based, live
- **Coaching** — 1:1, group, mastermind
- **Info products** — guides, swipe files, templates, communities
- **High-ticket B2B** — $5K+ ACV with a sales conversation
- **Direct-response** — e-com promo offers, infomercial-style, paid-traffic-to-VSL

### When `pricing` does more of the work

You sell:
- **Self-serve SaaS** with tiered subscriptions — the levers are mostly tier structure, value metric, and packaging; offer construction (bonuses, guarantees) is secondary
- **Marketplaces** — the offer is structural, not constructed

Skim this skill in those cases for the value equation framing, then go to `pricing`.

---

## The Value Equation

The single most useful frame for offer design. Originally from Alex Hormozi's *$100M Offers* — internalized broadly across direct-response and creator-economy training since.

```
              Dream Outcome  ×  Perceived Likelihood of Achievement
  Value  =  ─────────────────────────────────────────────────────────
              Time Delay     ×   Effort & Sacrifice
```

You move the four levers like this:

| Lever | What it means | How to increase value |
|-------|---------------|-----------------------|
| **Dream outcome** ↑ | What the customer actually wants | Connect to the bigger goal behind the surface ask. Specify and name it. |
| **Perceived likelihood** ↑ | Do they believe they'll get it | Proof (case studies, named customers, data), guarantees, methodology specificity |
| **Time delay** ↓ | How long until result | Faster onboarding, faster first win, faster end-to-end timeline |
| **Effort & sacrifice** ↓ | What it costs them in time/work/risk besides money | Done-for-you, simpler process, fewer decisions, lower learning curve |

**Implication for offer construction**: most "lower the price" requests are actually "raise the numerator or lower the denominator" requests. Price is the comparison, not the value.

**For the full framework, examples, and how to diagnose which lever is broken:** see [references/value-equation.md](references/value-equation.md)

---

## The Anatomy of a Complete Offer

A complete offer has six components. Skip any one and conversion suffers.

| # | Component | Question it answers |
|---|-----------|---------------------|
| 1 | **Core deliverable** | What do they get? |
| 2 | **Bonus stack** | What else do they get that makes the core feel undervalued? |
| 3 | **Guarantee** | What happens if it doesn't work? |
| 4 | **Scarcity / urgency** | Why now, not later? |
| 5 | **Name** | What is this thing called? |
| 6 | **Price + payment structure** | What do they pay and how? |

Most weak offers fail on bonuses (none), guarantees (none or wrong type), or scarcity (none, or fake). Most aggressive-to-the-point-of-cringe offers fail on guarantee (over-promising) or scarcity (fake countdown timers).

**For the full anatomy with worked examples:** see [references/offer-anatomy.md](references/offer-anatomy.md)

---

## Reference Library

| Reference | When to read |
|-----------|--------------|
| [value-equation.md](references/value-equation.md) | Diagnosing which lever is broken on a stuck offer |
| [offer-anatomy.md](references/offer-anatomy.md) | Building a complete offer from scratch |
| [guarantee-design.md](references/guarantee-design.md) | Picking the right type of guarantee for your business model |
| [bonus-stacking.md](references/bonus-stacking.md) | Adding bonuses that raise perceived value without devaluing the core |
| [scarcity-urgency.md](references/scarcity-urgency.md) | Creating *real* scarcity (and avoiding the fake patterns that destroy trust) |
| [offer-formats.md](references/offer-formats.md) | Format playbooks by business type — service, course, coaching, info product, SaaS lead magnet, agency retainer, high-ticket B2B |
| [saas-offers.md](references/saas-offers.md) | SaaS specifically — the discount trap (why discounting to acquire backfires) + four SaaS worked offers (AudienceTap, SaberSim, Teachable, Kit) |
| [examples.md](references/examples.md) | Anonymized worked examples — before/after for each business type |

---

## The Diagnostic Loop

When the user says "my offer isn't converting" or "I want to improve my offer":

1. **Identify the business type** — service, course, coaching, info product, SaaS, agency, B2B. The right playbook is type-specific.
2. **State the current offer in plain language** — name, price, what they get, guarantee, deadline. Write it down even if it lives in scattered places now.
3. **Run the value equation** — score each of the four levers 1–10. The lowest is the binding constraint.
4. **Audit the anatomy** — which of the six components is missing or weak?
5. **Pick one lever to fix this iteration** — don't rebuild everything. The biggest lever is usually the one currently scoring lowest.
6. **Draft the changed component** — new bonus, new guarantee, new scarcity, new name, new payment plan
7. **Project the lift, honestly** — do not state a lift as an expected result. No lift figure here is measured or sourced. Say the gain is unknown until a test measures it, and give a range only if the user supplies one from their own past tests. If they do, multiply the lifts, don't add them: +[X]% then +[Y]% = `(1 + X) × (1 + Y)`. Confirm the combined offer with a test (see the Offer test planner).

---

## When NOT to Use Offer-Design Tactics

Some offer patterns work but cost more than they're worth:

- **Manipulative scarcity** — fake countdown timers, "only 3 spots left" lies. Short-term lift, long-term trust collapse. Don't.
- **Over-promising guarantees** — "double your revenue or refund + $1,000." Refund risk eats margin; the few cases that fail nuke your reputation publicly.
- **Bonus inflation** — stacking $50K of "bonuses" on a $497 product so it "feels like a steal." Sophisticated buyers see this. Treat bonuses as additive, not exaggerated.
- **Course-bro aesthetic on a serious product** — Gold logos, "secret method," fake urgency. Pattern-matches to scam. Wrong room.
- **Discounting to acquire** — discount-*askers* may churn faster than full-price customers (check this against your own data; no figure here is sourced), and a coupon anchors the product as cheap. Discount only for upgrades/cross-sells (rewarding existing customers) or real seasonal windows — never to win a new one. Raise value with an offer instead. See [saas-offers.md](references/saas-offers.md).

The repo voice: opinionated, but honest. Building offers well doesn't mean building offers loud.

---

## Banned Vocabulary

When drafting offer language (sales pages, emails, headlines), avoid:

- **"Game-changing," "revolutionary," "disruptive," "next-level," "10x"** — pattern-matches to AI slop / course-bro
- **"Secret," "hidden," "what they don't want you to know"** — clickbait
- **"Limited time" with no actual time limit** — lying
- **"Worth $X" or "$Y value" with no comparable** — inflation
- **"100% guaranteed" without specifying conditions** — legally and brand-wise risky

Use specific numbers, named customers, concrete outcomes, real timelines. Specificity beats superlatives.

---

## Related Skills

These skills are optional and may not be in your library. If one is missing, skip it and say what the person could do next in plain words.

- **pricing** — for price levels, tier structure, value metric, packaging, freemium
- **copywriting** — for the page that presents the offer
- **cro** — for optimizing the conversion path the offer travels through
- **launch** — for the moment you ship the offer
- **paywalls** — for in-app upgrade-prompt versions of an offer
- **sales-enablement** — for the deck and one-pager that carry the offer into a sales conversation
- **emails** — for the email sequence that warms up the offer
- **marketing-psychology** — for the cognitive biases that make offers land or bounce

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Offer test planner](https://useaiblocks.com/skills/offer-test-planner). It takes the offer.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
