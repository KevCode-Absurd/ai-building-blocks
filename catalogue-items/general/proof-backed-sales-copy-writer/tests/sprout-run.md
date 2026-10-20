# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A tight, honest product-page section that answers both buyer doubts with the exact proof supplied, states first price, renewal price and one-time price plainly, and limits the guarantee correctly. Cancel steps and refund conditions are left as clear MISSING placeholders rather than guessed, so the owner only needs to fill two brackets; it did not offer a next-step suggestion, but that is outside the judged shape.

## Judge list

- Met: Every claim a doubtful buyer would question has proof within one sentence.
  "So can a gummy hold enough? Sprout carries 60+ ingredients, including 21 vitamins and minerals and 6 g of prebiotic fiber." Study, survey, test figures each sit beside their claim.
- Met: There's one action, not several.
  "Get your first 28 packs, and see if it becomes the step you never skip." The one-time price is stated as a term, not a second ask.
- Met: No figure, review, expert, study, date or count you didn't supply.
  All numbers trace to the input; "$66.65" is on the attached product page; "a four-week supply" is 28 packs × 1 a day.
- Met: The guarantee is stated with its real conditions, or not at all.
  "Your first order has a 30-day money-back guarantee. It covers the first order only." plus bracketed MISSING for refund conditions.
- Met: The ending comes back to what the opening promised.
  Opens "One step I never skip." and closes "see if it becomes the step you never skip."

## What went in

```text
Opening (already written): One step I never skip.
Buyer: people who quit greens powders. They know the problem, not
Sprout. Doubts: "A gummy can't hold enough to replace my powder." /
"I hate subscriptions because I feel like they are a trap."
Facts and proof:
- 1 pack a day, torn across the top. No water, no mixing, no shaker.
- 60+ ingredients, 21 vitamins & minerals, 6 g prebiotic fiber
- 2025 study, 12 weeks, 120 adults: blood vitamin C +40.1% (2.7x
  placebo), folate +20.5% (2.9x placebo)
- Survey of 3,000+ customers: 95% of surveyed users take it at
  least 4 to 6 times a week, 80% daily
- Third-party tested for 70 pesticides and 4 heavy metals
Offer: 28 packs. First box $29.99 with the text sign-up discount
for new customers, then $49.99 every 4 weeks. "Pause Or Cancel Any
Time." Ships within 24 hours, arrives in 3 to 5 days on average.
Guarantee: 30-day money-back, first order only.
Length: 200 to 280 words, for a product page section.

[attached: sprout/product-page.md]
```

## What came out

```text
One step I never skip.

It isn't a scoop or a shaker. It's one pack a day, torn across the top. No water, no mixing, nothing to rinse. If your greens powder lasted only as long as your patience with the shaker, this is the part that changes.

So can a gummy hold enough? Sprout carries 60+ ingredients, including 21 vitamins and minerals and 6 g of prebiotic fiber. Does your body take them in? In a 2025 study of 120 adults over 12 weeks, blood vitamin C rose 40.1% (2.7x placebo) and folate rose 20.5% (2.9x placebo). To be straight, that study measured those two vitamins, not all 21.

A habit has to stick. In a survey of 3,000+ customers, 95% take Sprout at least 4 to 6 times a week, and 80% take it daily. It's third-party tested for 70 pesticides and 4 heavy metals.

Here's the whole deal. One box holds 28 packs, a four-week supply. It ships within 24 hours and arrives in 3 to 5 days on average. New customers who sign up for texts pay $29.99 for the first box. Then it renews at $49.99 every 4 weeks until you pause or cancel, which you can do any time: [cancel steps]. Rather skip the subscription? One box is $66.65.

Your first order has a 30-day money-back guarantee. It covers the first order only. [refund conditions and who pays return shipping]

Worried a subscription is a trap? You've just read the renewal price, how often it comes and how to stop it, all before you pay.

Get your first 28 packs, and see if it becomes the step you never skip.

---

**Proof placed:**
- "Can a gummy hold enough?" → 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber (same paragraph).
- "Does your body take them in?" → 2025 study, 120 adults, 12 weeks: vitamin C +40.1% (2.7x placebo), folate +20.5% (2.9x placebo). The claim is limited to the two vitamins measured.
- "A habit has to stick" → survey of 3,000+ customers: 95% take it at least 4 to 6 times a week, 80% daily.
- Safety or purity doubt → third-party tested for 70 pesticides and 4 heavy metals.
- "Subscriptions are a trap" → first price, renewal price, interval, pause or cancel any time, and the one-time price, all stated before the ask.
- "What if it doesn't work for me?" → 30-day money-back guarantee, first order only.

**Assumed:**
- "If your greens powder lasted only as long as your patience with the shaker" is written as the buyer's own experience. It is based on the brief ("people who quit greens powders") and is not a sourced claim about powders.
- The one-time price of $66.65 comes from the attached product page, not from your facts list.
- "A four-week supply" assumes one pack a day × 28 packs.
- No urgency was added. The page's birthday price cut is described as "indefinitely", so it gives no real deadline.

**Placeholders:**
- [cancel steps]: MISSING: the real steps to pause or cancel (for example, where in the account and whether it can be done online).
- [refund conditions and who pays return shipping]: MISSING: what the guarantee requires (for example, opened or unopened, and how to claim) and who pays to return it.
- MISSING: confirm whether the 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber are per daily pack or per serving. The copy avoids saying "per pack".

**CHECKS MISSED:**
- The close names the guarantee terms, but the refund conditions and return-shipping terms were not supplied, so they are bracketed.
```
