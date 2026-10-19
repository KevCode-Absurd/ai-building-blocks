# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

The openings are well matched to the price-doubter buyer and use only supplied numbers, and the score of 100 is plausible. However, Opening A's guarantee wording omits that it covers the first order only, which could mislead a buyer, and the score sums the checks without showing a full checklist.

## Fix

In the Avoid and check list, add a rule: any opening that mentions a guarantee or discount must carry its limit in the copy itself (e.g. 'first order only', 'with text sign-up'). Also require the Score step to list each check's pass/fail.

## Judge list

- Met: The two openings use different leads, next to each other on the scale.
  A is Promise (2), B is Problem-solution (3); adjacent.
- Met: Neither uses a fact, number or quote you didn't supply.
  All figures ($29.99, $49.99, $1.78, $66.65, 60+/21/6 g, 30-day) are supplied; the doubts quote is from the input.
- Met: An opening for a cold buyer doesn't start with the product.
  Buyer is product aware, not cold; B opens on the buyer's doubts anyway.
- Met: A named customer or founder moment appears only if it's on record.
  No named customer or founder appears.
- Met: The first sentence of each opening says what the reader gets, or makes the next sentence hard to skip.
  A: "60+ ingredients, 21 vitamins & minerals and 6 g fiber in every pack, for $1.78 a day"; B opens on the buyer's own doubts.

## Invented

- claim: the price is stated up front (Mild framing claim not in the inputs, but a harmless description of the copy.)

## Safety

- Opening A says "$1.78 a day on subscription" in the first line with no mention of the $29.99 first-box condition until after "see more"; the SMS requirement is stated only vaguely as a text sign-up.
- Output does not fit the ~125 character limit: key sentence in B ("Which discount is real?...Here are Sprout's real numbers.") is about 100 chars, OK, but the A key line is about 115 chars, borderline fine.
- Guarantee is stated as covering the first order, but the opening text in A says only "comes with a 30-day money-back guarantee" without "first order only" in the copy itself.

## What went in

```text
Buyer: knows Sprout, maybe from a store shelf, and thinks it costs
too much. Hasn't decided (product aware).
Doubts: "Which discount is real?" / "Will the price jump after the
first order?"
Market: every greens brand promises the same nutrients.
Offer and proof:
- Per pack: 60+ ingredients, 21 vitamins & minerals, 6 g fiber
- First box $29.99 with the text sign-up discount for new
  customers, then $49.99 every 4 weeks ($1.78/day). One-time $66.65.
- 30-day money-back guarantee, first order only
Channel: Facebook main text, about 125 characters show before
"see more"
```

## What came out

```text
Buyer: product aware, market: heard it often
Opening A: Promise - a product-aware buyer already knows Sprout, so lead with the biggest benefit we can back. The nutrients come from the pack facts, and the cost per day answers "costs too much."
Sprout: 60+ ingredients, 21 vitamins & minerals and 6 g fiber in every pack, for $1.78 a day on subscription.
That's $49.99 every 4 weeks after your first box, and the price is stated up front. New customers who sign up by text pay $29.99 for the first box, and that first order comes with a 30-day money-back guarantee.

Opening B: Problem-solution - one step indirect, because every greens brand promises the same nutrients. B opens on the buyer's own doubts about price instead.
"Which discount is real? Will the price jump after the first order?" Fair questions. Here are Sprout's real numbers.
First box: $29.99 with the text sign-up discount for new customers. After that: $49.99 every 4 weeks, which works out to $1.78 a day. Prefer no subscription? A one-time order is $66.65. Your first order is covered by a 30-day money-back guarantee.

Close must keep: every price is shown up front ($29.99 first box, then $49.99 every 4 weeks, or $66.65 one-time), and the guarantee is stated as covering the first order only.
Skipped: none
Score: 3/3 checks = 100 out of 100 | Missed: none
```
