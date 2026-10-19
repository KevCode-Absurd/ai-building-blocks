# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A solid, usable review: every risky line in the stitched script is caught, the fixes stick to the allowed claim, the survey figure, the real price terms and review 8, and both scores are shown with their sums. Minor weaknesses are that full lines aren't reproduced in each block (only fragments), the current word count (50) is a few words high, and the cancel-terms doubt is left MISSING rather than answered.

## Judge list

- Met: Every problem quotes a real line from your script.
  Quoted fragments ("Fix", "The first smart gummy", "Fills the gaps", "1M+", "4 FREE gifts", "Shop now!") all appear in the script; full lines not reproduced.
- Met: Every check code it cites is in the reference, and the reason matches it.
  "Truth 3 | 'Fix' is a cure-type claim", "Offer 1 | Sprout is named in line 2, well before the offer" – codes exist, reasons match.
- Met: Truth problems come first.
  First row is "Truth 3"; every line block leads with its Truth problem before Fit/Opening/Offer checks.
- Met: Every fix uses only your facts. Nothing from the reference's examples appears as a fact.
  "$29.99 your first order with text sign-up, then $49.99 every four weeks"; "67% of surveyed users..."; no reference examples used.
- Met: Missing beats are named, as well as weak lines.
  "Problem: absent", "Doubt: absent", Guarantee discussed under Guarantee 3.

## What went in

```text
Script to judge (30 seconds, voice-over; a draft stitched from
lines on our site and in our ads):
1 "Fix the Hot Girl Tummy."
2 "Sprout is the first smart gummy that fills the gaps."
3 "60+ potent ingredients to revive whole body vitality."
4 "Clinically backed formula for energy, immunity, and daily
   wellness."
5 "Trusted by 1M+."
6 "Get up to 61% OFF + 4 FREE gifts. Shop now!"

Facts: 1 pack = 60+ ingredients, 21 vitamins and minerals, 6 g
prebiotic fiber. Study: 12 weeks, blood vitamin C and folate only.
Allowed: "Supports digestion and gut health." Survey: "67% ...
experienced better, more regular digestion", always "of surveyed
users". Offer: site says 52% or 55%, ads say 61%. $29.99 first
order with SMS sign-up, renews at $49.99 every 4 weeks.
Buyer: the gut-fix seeker; has tried fiber powders and
probiotics. Doubt: "Will this upset my stomach more?"
Customer words: "The prebiotics do their job, but not
aggressively" (review 8).
Voice: playful, cheeky. Bought: reordered (subscription).
```

## What came out

```text
**1 (Opening)** | Truth 3 | "Fix" is a cure-type claim. The only allowed claim is "Supports digestion and gut health." | Cut "fix" (see the fix below).
**1 (Opening)** | Opening 1, Opening 2, Fit 1 | "Hot Girl Tummy" doesn't pick out the gut-fix seeker who has already tried other fixes. It gives no reason to stay in her own words. | "Fiber powders, probiotics, and your tummy's still not chill?"

**2 (Promise)** | Truth 1 | "The first smart gummy" doesn't trace to any fact given. | Drop "first" and "smart."
**2 (Promise)** | Promise 1, Promise 2, Fit 1 | "Fills the gaps" is a vague nutrient-gap pitch, not one promise in the buyer's words. It speaks to a multivitamin buyer, not a gut-fix seeker. | "This gummy supports digestion and gut health."
**2 (Promise)** | Offer 1 | Sprout is named in line 2, well before the offer. | Move the name to the offer line.

**3 (How it works)** | Truth 3 | "Revive whole body vitality" goes beyond the allowed claim. | Cut it.
**3 (How it works)** | How it works 1, Fit 2 | The line gives a feature with no meaning and no reason it works. It leads with the count of 60+, not the fiber this buyer cares about. A market that is tired of gut claims needs the mechanism. | "Six grams of prebiotic fiber, plus 21 vitamins and minerals." Then add MISSING: approved line on why the prebiotic fiber supports digestion.

**4 (Proof)** | Truth 1, Truth 3 | The study covered only blood vitamin C and folate over 12 weeks. It doesn't back energy, immunity or "daily wellness." | Cut the line and use the survey instead: "67% of surveyed users experienced better, more regular digestion."
**4 (Proof)** | Fit 1 | Energy and immunity are off-target for a gut-fix seeker. | Covered by the fix above.

**5 (Proof)** | Truth 1 | "1M+" doesn't trace to any fact given. | Cut it, or MISSING: source for the 1M+ figure.
**5 (Proof)** | Proof 3 | A bare count is the weakest kind of proof. | The survey result in line 4 replaces it.

**6 (Offer / CTA)** | Truth 2 | The discount is stated three ways: 52% and 55% on the site, 61% in ads. It can't be used until one figure is agreed. | Frame the price by the real figure instead: "Sprout: $29.99 your first order with text sign-up, then $49.99 every four weeks."
**6 (Offer / CTA)** | Truth 1 | "4 FREE gifts" isn't in the facts. | Cut it, or MISSING: what the gifts are and confirmation that they're offered.
**6 (Offer / CTA)** | Offer 2, Offer 3 | "Up to" % framing is used instead of real numbers. The SMS sign-up condition and the $49.99 renewal aren't said aloud. | Covered by the price line above.
**6 (Offer / CTA)** | CTA 1, CTA 2, CTA 3 | "Shop now!" doesn't say what happens next. It gives no true reason for now and doesn't make starting feel easy. | "Tap Shop Now to start." Then add MISSING: a true reason for now, or leave urgency out.

**Missing beats**
- **Problem:** absent. Fix: "Still scooping, still searching." This rests on her having tried fiber powders and probiotics.
- **Doubt:** absent. The loudest doubt is "Will this upset my stomach more?" Fix: "Upset stomach? One reviewer: 'The prebiotics do their job, but not aggressively.'" Cite review 8 on screen.
  - Doubt 3 (reordered) also needs "can I stop" answered: MISSING: cancel terms.
- **Guarantee:** absent. It is not counted as missing because Guarantee 3 allows leaving it out at 30 seconds. No terms were given anyway.

**Words against budget**
- Budget: (30 − 2) × 3.0 = 84 words.
- Current script: 50 words, under budget.
- Fixed script: 71 words, leaving 13 for the two MISSING lines (why it works, cancel terms).
- Reordered vs kept is given (reordered), so single versions of Fit 3, Doubt 3 and CTA 2 are applied.

**MISSING**
- Approved line on why the prebiotic fiber supports digestion
- Cancel terms ("can I stop")
- A true reason for now
- Source for "1M+", if it is kept
- What the "4 free gifts" are, if they are kept
- One agreed discount figure (52%, 55% or 61%), if % framing is kept
- Shot list and overlay plan; Delivery 3 and Delivery 4 can't be judged without them. Show the product before the name (How it works 4).

**Score now: 0**
- Truth problems: 7 × 15 = 105 (lines 1, 2, 3, 4, 5, and 6 × 2)
- Non-Truth-only weak lines: 0. Every weak line also carries a Truth problem and is charged once at the Truth rate.
- Missing beats: 2 × 5 = 10 (Problem, Doubt)
- Over budget: 0
- 100 − 105 − 10 = −15, so the score stops at 0.

**Score after fixes: 85**
- Truth problems: 0
- Weak lines still open because of MISSING: 2 × 5 = 10 (line 3: why it works; line 6: reason for now)
- Missing beats: 1 × 5 = 5 (Doubt is not complete without cancel terms)
- Over budget: 0
- 100 − 10 − 5 = 85
```
