# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, rule-by-rule check with full-sentence rewrites that add no facts and keep the $29.99 price tied to the text sign-up. It is strict to a fault: it rewrote both of Sprout's signature lines and a fairly natural price line, so the owner gets a clearer but flatter caption and may choose to keep line 1 as-is.

## Judge list

- Met: Every line makes sense to someone who has never heard of your brand.
  "Just rip the pack open, tip it out, and enjoy it." and "Sign up for our texts and your first box is $29.99." read plainly to a stranger.
- Met: No fix adds a fact that wasn't in the draft.
  Corrections reuse the draft's own figures (60+, 21, 6 g, 1 pack, $29.99); "the pack" comes from line 5.
- Met: Corrected lines are whole sentences, not shorter slogans.
  All six corrections are full sentences, e.g. "It tastes like a treat, but it works like a supplement."
- Met: Brand style tricks only appear on lines that still read plainly.
  No style tricks survive; every corrected line is plain prose. "Lines left alone: none."
- Met: Each flagged line names the first rule it breaks.
  Each entry states "Breaks first: Rule 1 (Natural)" with a reason, consistent with the skill's literal 'complete sentence' test.

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
**1.** "Tastes like a treat, works like a supplement."
- **Breaks first:** Rule 1 (Natural). It's a fragment with no subject. The brand already uses it, but that can't save a line that isn't a full sentence.
- **Corrected:** "It tastes like a treat, but it works like a supplement."

**2.** "Rip. Tip. Enjoy."
- **Breaks first:** Rule 1 (Natural). These are three one-word commands that nobody says out loud, and a stranger can't tell what's being ripped or tipped.
- **Corrected:** "Just rip the pack open, tip it out, and enjoy it."

**3.** "Your gut called. It wants Sprout."
- **Breaks first:** Rule 1 (Natural). It's a joke built on a gut making a phone call, not something you'd say to a friend.
- **Corrected:** "Your gut will thank you for trying Sprout."

**4.** "Nutrition, reimagined."
- **Breaks first:** Rule 1 (Natural). It's a two-word slogan with no sentence and no clear meaning.
- **Corrected:** "Sprout is a different way to get your nutrition."

**5.** "60+ ingredients, 21 vitamins and minerals, and 6 g fiber in 1 pack."
- **Breaks first:** Rule 1 (Natural). It's a list with no verb, so it isn't a complete sentence.
- **Corrected:** "That's 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber, all in 1 pack."

**6.** "Start at $29.99 for your first box with our text sign-up discount."
- **Breaks first:** Rule 1 (Natural). "Text sign-up discount" is a stacked phrase people don't say. "Start at" also blurs whether $29.99 is the price of the first box or a starting price.
- **Corrected:** "Sign up for our texts and your first box is $29.99."

**Lines left alone:** none.
```
