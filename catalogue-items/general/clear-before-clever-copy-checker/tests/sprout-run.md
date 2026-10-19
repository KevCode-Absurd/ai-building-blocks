# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The check does what the block asks: it flags each slogan-style line, names rule 1 first, gives whole-sentence rewrites that add no facts, and shows correct score sums (17 and 83). The only soft spot is leaving the price line alone even though it tells no story, but the $29.99 line stays accurate because it keeps the text sign-up condition.

## Judge list

- Met: Every line makes sense to someone who has never heard of your brand.
  "You rip open a pack, tip it out, and enjoy it." and the other corrected lines read plainly with no brand context needed.
- Met: No fix adds a fact that wasn't in the draft.
  Line 4 fix "You get your nutrition from a pack that tastes like a treat" uses only lines 1 and 5; no new numbers or claims.
- Met: Corrected lines are whole sentences, not shorter slogans.
  "It tastes like a treat and works like a supplement." All five corrections are full sentences with subject and verb.
- Met: Brand style tricks only appear on lines that still read plainly.
  Line 2 keeps the 3-beat rhythm inside a plain sentence; output notes "the 3-beat trick can't protect a line nobody would say."
- Met: Each flagged line names the first rule it breaks.
  Each of lines 1-5 states "First rule broken: 1, Natural"; line 3 also notes it still fails rule 2.

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
**Failing lines**

**1.** "Tastes like a treat, works like a supplement."
- **First rule broken:** 1, Natural. It has no subject, so it isn't a complete sentence someone would say.
- **Corrected:** "It tastes like a treat and works like a supplement."

**2.** "Rip. Tip. Enjoy."
- **First rule broken:** 1, Natural. These are three one-word commands, and a stranger can't tell what's being ripped or tipped. The brand already uses this line, but the 3-beat trick can't protect a line nobody would say.
- **Corrected:** "You rip open a pack, tip it out, and enjoy it." (This keeps the 3-beat rhythm because the line takes it without bending.)

**3.** "Your gut called. It wants Sprout."
- **First rule broken:** 1, Natural. A gut making phone calls isn't something you'd say to a friend.
- **Corrected:** "If your gut could talk, it would ask for Sprout."
- **Still fails rule 2, It sells.** The line shows no change for the reader. The draft gives no gut-related outcome to draw on, and adding one would be a new claim.

**4.** "Nutrition, reimagined."
- **First rule broken:** 1, Natural. It's a two-word slogan, not a sentence.
- **Corrected:** "You get your nutrition from a pack that tastes like a treat." (This uses only facts from lines 1 and 5.)

**5.** "60+ ingredients, 21 vitamins and minerals, and 6 g fiber in 1 pack."
- **First rule broken:** 1, Natural. It has no verb, so it's a spec list rather than a sentence.
- **Corrected:** "You get 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber, all from 1 pack." ("All from 1 pack" says what the numbers change for the reader, without adding a claim.)

**Lines left alone**

**6.** "Start at $29.99 for your first box with our text sign-up discount."

**Score**

- **As written:** 1 passing line / 6 lines × 100 = **17**
- **With fixes:** 5 passing lines / 6 lines × 100 = **83**. Line 3 still fails rule 2.
```
