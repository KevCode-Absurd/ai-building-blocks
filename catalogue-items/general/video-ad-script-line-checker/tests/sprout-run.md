# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A sharp, trustworthy review: it catches every risky line in the draft ("Fix", the misrepresented study, the unsupported 1M+, the conflicting discount) and rewrites each using only the facts given, with MISSING flagged for cancellation terms, urgency and gifts. The score math is shown and checkable; the only slip is that per-line beat labels are implied through check codes rather than stated, and the post-fix word count runs a little high as an estimate.

## Judge list

- Met: Every problem quotes a real line from your script.
  All six lines quoted verbatim, e.g. "Clinically backed formula for energy, immunity, and daily wellness." matches the script.
- Met: Every check code it cites is in the reference, and the reason matches it.
  "Truth 2: The discount appears as 52%, 55% and 61% in different places" matches the two-ways-stated rule; Opening 3, Proof 3, Offer 3, Doubt 3, Guarantee 3 all exist and fit.
- Met: Truth problems come first.
  Every row leads with a Truth code ("Truth 3 (also Opening 3)", "Truth 1 (also Offer 1...)"), so Truth issues head the list.
- Met: Every fix uses only your facts. Nothing from the reference's examples appears as a fact.
  Fixes use only input facts: "60-plus ingredients, including 6 grams of prebiotic fiber", "67% of surveyed users", "$29.99 with a text sign-up, then $49.99 every 4 weeks".
- Met: Missing beats are named, as well as weak lines.
  "Missing beats: Problem (now line 2 fix), Doubt (now line 4 fix), Guarantee: not counted... (Guarantee 3)".

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
| Line | Check | What's wrong | Fix |
|---|---|---|---|
| 1 "Fix the Hot Girl Tummy." | Truth 3 (also Opening 3) | "Fix" is a watched word. Your allowed claim is "supports digestion and gut health." Line 2 then jumps to "fills the gaps," so the opening doesn't run on. | "Hot Girl Tummy acting up?" (This keeps your cheeky phrase and says nothing about what the viewer has.) |
| 2 "Sprout is the first smart gummy that fills the gaps." | Truth 1 (also Offer 1, Promise 1, Promise 2) | No fact supports "first." The product is named in line 2. "Fills the gaps" is vague and not about digestion. There's no Problem beat. | "You've tried the fiber powders and the probiotics. Try a gummy that supports digestion and gut health." (This adds the Problem and the Promise and moves the name to the offer.) |
| 3 "60+ potent ingredients to revive whole body vitality." | Truth 3 (also How it works 1) | "Revive whole body vitality" is outside your allowed claims. Nothing supports "potent." It lists a feature but doesn't say what it does. | "Each pack: 60-plus ingredients, including 6 grams of prebiotic fiber." |
| 4 "Clinically backed formula for energy, immunity, and daily wellness." | Truth 1 / Truth 3 | The 12-week study measured only blood vitamin C and folate. "Clinically backed for energy and immunity" misleads, and immunity isn't an allowed claim. | Cut it. Put the Doubt beat here: "Worried it'll upset your stomach more? One reviewer: 'The prebiotics do their job, but not aggressively.'" (review 8) |
| 5 "Trusted by 1M+." | Truth 1 (also Proof 3) | "1M+" isn't in your facts. A bare count is weak proof. | "67% of surveyed users experienced better, more regular digestion." |
| 6 "Get up to 61% OFF + 4 FREE gifts. Shop now!" | Truth 2 | The discount appears as 52%, 55% and 61% in different places, so no single figure can be used yet. | Drop the percentage and use the real price: "Your first Sprout order is $29.99 with a text sign-up, then $49.99 every 4 weeks. Tap to start." |
| 6 (same line) | Truth 1 (also Offer 2, Offer 3, CTA 1, Doubt 3) | "4 FREE gifts" isn't in your facts. The SMS condition and the $49.99 renewal aren't said aloud. "Shop now" doesn't say what happens next. For a reordered product, "can I stop?" goes unanswered. | Use the same fix as above, without the gifts. To answer "can I stop?", add `MISSING: cancellation terms`. If you have a true reason to act now, add it (`MISSING: reason for now`); otherwise leave urgency out (CTA 3). |

**Missing beats**
- Problem (now line 2 fix)
- Doubt (now line 4 fix)
- Guarantee: not counted. At 30 seconds it can be left out (Guarantee 3), and no guarantee terms were given.

**Bought: reordered.** The checks applied were Doubt 3 ("will I keep it up / can I stop"), CTA 2 (the work is starting) and Offer 2 (first-order price against the renewal price).

**Word count** (30 s, voice-over, pace 3.0)
- Budget: (30 − 2) × 3.0 = 84 words.
- Draft: about 50 spoken words, under budget.
- After fixes: about 83 spoken words with prices read out. That fits, but only just. If you add a cancellation line, cut the "One reviewer:" lead-in or shorten line 2.

**MISSING facts**
- MISSING: cancellation terms (Doubt 3, line 6)
- MISSING: a true reason to act now (CTA 1)
- MISSING: one agreed discount figure (52%, 55% or 61%), only needed if a percentage comes back
- MISSING: source for "1M+"
- MISSING: what the "4 free gifts" are and their terms
- MISSING: support for "first smart gummy"
- MISSING: the study result, who ran it and the sample size, before any study claim returns
- MISSING: survey size and who ran it, for an on-screen footnote on the 67% line
- MISSING: guarantee terms, if any
- MISSING: evidence that buyers say "Hot Girl Tummy" (Fit 4). Until you have it, the opening phrase is a guess. It's kept because your voice allows it.
- MISSING: overlay text, end card and shot list. Picture (Delivery 3) and Silent (Delivery 4) couldn't be checked.

**Score**
- Now: 100 − (7 Truth problems × 15 = 105) − (2 missing beats × 5 = 10) = −15, so **0**.
  - The seven Truth problems are L1, L2, L3, L4, L5, L6 discount and L6 gifts.
  - Lines with a Truth problem aren't charged the extra 5.
- After fixes: 100 − (line 6 still carries MISSING cancellation terms and reason for now: 1 weak line × 5) = **95**.
  - 0 Truth problems, 0 missing beats, 83 of 84 words used.

Want to plan what to test next with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? It takes this audit report. Or type your own next step.
```
