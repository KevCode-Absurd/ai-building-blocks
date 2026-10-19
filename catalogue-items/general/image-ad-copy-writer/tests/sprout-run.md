# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Two usable ad versions with every number, offer term and condition traced to the input, the Sugar-Free caveat included, and no made-up quotes or claims. The owner could run these as-is; the only gap is that the Their-words appeal was skipped because the reviews weren't actually pasted, which the run correctly flagged as MISSING.

## Judge list

- Met: The image headline and the picture make the same point, in 7 words or fewer.
  "6 g prebiotic fiber. Zero scooping." (6 words) and "Why the fiber tub got benched" (6 words) both match the pushed-back tub and tear-and-pour moment.
- Met: The main text doesn't repeat the image words.
  Main text opens "Your fiber powder costs you a gritty glass and a sticky spoon"; the 6 g figure and 'benched' line stay on the image only.
- Met: Every number, offer term and condition matches your proof and terms.
  "$29.99 with the text sign-up discount, then $49.99 every 4 weeks, and your first order gets a 30-day money-back guarantee" matches the input exactly; 67%/3,000+ kept as given.
- Met: No customer story, quote or guarantee appears that you didn't supply.
  No quotes used; run wrote "MISSING: quote (the 20 reviews weren't included in the paste)" instead of inventing one.
- Met: The versions differ in appeal, not just in wording.
  V1 leads with a plain benefit ("6 g prebiotic fiber. Zero scooping."); V2 opens an honest gap ("Why the fiber tub got benched") closed by the main text.

## What went in

```text
Picture (chosen): a woman at a kitchen counter in the morning tears
a Sprout daily pack across the top and pours green gummies into her
palm. A tub of fiber powder sits pushed to the back.
Who it's for: people with gut troubles who've tried fiber powders
and probiotics. They know the problem, not Sprout.
Proof: 6 g prebiotic fiber per pack. Approved: "Supports
digestion and gut health." Survey of 3,000+ customers: "67% of
surveyed users experienced better, more regular digestion."
Reviews: all 20 (pasted below).
Qualifier: Sugar-Free uses sugar alcohols, which upset some
stomachs; point gut-sensitive buyers to Low Sugar.
Offer: first box $29.99 with the text sign-up discount, then $49.99
every 4 weeks. 30-day money-back guarantee, first order only.
Voice: playful, cheeky, never preachy.
Limits: main text 5 sentences, first under 125 characters;
description 30 characters.
Versions: 2
```

## What came out

```text
**Note:** Code `Old way, new way · lifestyle photo · gut-trouble buyers who've tried powders and probiotics`. No code was given, so I worked it out from the picture: the gummies are in hand and the tub is pushed back. The buyer is **Warm** (solution-aware): they've tried fiber powders and probiotics but don't know Sprout. Version 1 tests **Self-interest**. Version 2 tests **Curiosity**. **Their words** isn't tested: `MISSING: quote` (the 20 reviews weren't included in the paste).

---

### Version 1: Self-interest

**Headline on the image:** 6 g prebiotic fiber. Zero scooping. *(6 words)*

**Support line:** Per Sprout daily pack *(4 words)*

**Main text:** *(5 sentences; first line 83 characters)*
Your fiber powder costs you a gritty glass and a sticky spoon every single morning. Sprout swaps all that for green gummies that support digestion and gut health, in a pack you just tear and pour. In a survey of 3,000+ customers, 67% of surveyed users experienced better, more regular digestion. Your first box is $29.99 with the text sign-up discount, then $49.99 every 4 weeks, and your first order gets a 30-day money-back guarantee. Heads up: Sugar-Free uses sugar alcohols, which upset some stomachs.

**Headline under the image:** First box $29.99 with text sign-up *(34 characters)*

**Description:** Gut-sensitive? Pick Low Sugar. *(30 characters)*

**Button:** Shop Now

---

### Version 2: Curiosity

**Headline on the image:** Why the fiber tub got benched *(6 words)*

**Support line:** 6 g prebiotic fiber per pack *(6 words)*

**Main text:** *(5 sentences; first line 82 characters)*
Fiber powder asks a lot: measure, stir, chug the gritty last sip, repeat tomorrow. Sprout trades the chores for green gummies you pour straight into your palm, and they support digestion and gut health. In a survey of 3,000+ customers, 67% of surveyed users experienced better, more regular digestion. Your first box is $29.99 with the text sign-up discount, then $49.99 every 4 weeks, and your first order gets a 30-day money-back guarantee. Heads up: Sugar-Free uses sugar alcohols, which upset some stomachs.

**Headline under the image:** First box $29.99 with text sign-up *(34 characters)*

**Description:** Gut-sensitive? Pick Low Sugar. *(30 characters)*

**Button:** Shop Now
```
