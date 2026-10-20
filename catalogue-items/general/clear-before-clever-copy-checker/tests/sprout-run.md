# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful line-by-line check that rewrites every line into plain, complete sentences without adding any fact, and it flags the one gap (what the pack is tipped into) instead of guessing. The owner gets an honest 0 to 83 score with the sums shown, though the run is quite strict on two lines the brand already publishes, so some may feel over-corrected.

## Judge list

- Met: Every line makes sense to someone who has never heard of your brand.
  "You get your nutrition from a pack you actually enjoy." / "Sign up for our texts, and your first box starts at $29.99."
- Met: No fix adds a fact that wasn't in the draft.
  Line 2 fix uses "tip it into MISSING: what it goes into" rather than guessing; all numbers ($29.99, 60+, 21, 6 g, 1 pack) come from the draft.
- Met: Corrected lines are whole sentences, not shorter slogans.
  "You have it like a treat, and it works like a supplement." All six fixes are full sentences with a subject and verb.
- Met: Brand style tricks only appear on lines that still read plainly.
  All corrected lines are plain; the 3-beat tricks ("Rip. Tip. Enjoy.") were removed rather than kept on lines that fail rule 1.
- Met: Each flagged line names the first rule it breaks.
  Every row gives "1, Natural: ..." with a short reason; line 5 names rule 1 first, then notes rule 2.

## What went in

```text
Check this. Instagram caption:
1 Tastes like a treat, works like a supplement.
2 Rip. Tip. Enjoy.
3 Your gut called. It wants Sprout.
4 Nutrition, reimagined.
5 60+ ingredients, 21 vitamins and minerals, and 6 g fiber in 1
  pack.
6 Start at $29.99 for your first box with our text sign-up discount.

Brand language: playful, cheeky, a funny friend who refuses to be
preachy. Short lines, 3-beat rhythms, numbers up front. Lines it
already uses: "Rip. Tip. Enjoy." / "Tastes like a treat, works like
a supplement."
```

## What came out

```text
**Lines that fail**

| # | As written | First rule broken | Corrected line |
|---|---|---|---|
| 1 | Tastes like a treat, works like a supplement. | 1, Natural: no subject, so a stranger can't tell what tastes like a treat. | You have it like a treat, and it works like a supplement. |
| 2 | Rip. Tip. Enjoy. | 1, Natural: three commands with nothing to rip or tip, so a stranger can't follow it. | You rip the pack open, tip it into MISSING: what it goes into, and enjoy it. |
| 3 | Your gut called. It wants Sprout. | 1, Natural: a gag line nobody says to a friend, and it never says what Sprout does. | Your gut will thank you when you start on Sprout. |
| 4 | Nutrition, reimagined. | 1, Natural: not a sentence, and "reimagined" doesn't say what changed. | You get your nutrition from a pack you actually enjoy. |
| 5 | 60+ ingredients, 21 vitamins and minerals, and 6 g fiber in 1 pack. | 1, Natural: a list, not a sentence. It also breaks rule 2, because the numbers never say what they change for the reader. | You get 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber from just 1 pack. |
| 6 | Start at $29.99 for your first box with our text sign-up discount. | 1, Natural: "start at" and "text sign-up discount" make the reader work out who does what and what it costs. | Sign up for our texts, and your first box starts at $29.99. |

**Lines left alone**

None.

**Score**

- As written: 0 lines pass every rule / 6 lines x 100 = **0**
- With the fixes: 5 lines pass every rule / 6 lines x 100 = 83.3, rounded = **83**
- Still failing: line 2. It has a gap, so it can't pass rule 1 until you say what the pack gets tipped into. Fill that in and the score is 6 / 6 x 100 = **100**.

**Gaps to fill later**

- MISSING: what the pack is tipped into (your mouth, water, a smoothie?), for line 2.
- MISSING: brand brain. Without it I couldn't check whether the gut-benefit line (3) is an approved claim. I also couldn't confirm whether "starts at $29.99" means one fixed price or the lowest of several.

Want to check it before it goes live with the [Anti-AI-slop copy editor](https://useaiblocks.com/skills/anti-ai-slop-copy-editor), or turn it into ad copy with the [Sales copy editor](https://useaiblocks.com/skills/sales-copy-editor)? Both take this draft. Or tell me what you'd like next.
```
