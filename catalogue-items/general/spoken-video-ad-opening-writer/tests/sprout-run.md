# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 6 met. Invented facts: 0.

The three opening lines are well built: distinct moves, inside budget, dials set correctly, no health claims, nothing invented, and promise/proof correctly dropped with reasons. But the owner only gets item 1 of 6; the avatar card confirmation, sheet, storyboard frames, clip prompts and edit list are absent, so nothing can be made from this run yet.

## Fix

In Stage 0 step 6 and the output shape, state that a single render writes all six hand-back items with each approval point marked inline, rather than halting after the line-up and waiting.

## Judge list

- Met: The three openings make three different moves, each within its word budget.
  Mirror 10/11, Gap 11/11, Flip 11/11: "Half a tub left? Sprout is one pack a day." etc.
- Met: None starts with a greeting, "so" or your brand name, and each flows into your ad's first line.
  "Sprout" is word 5, 6 and 7; read-aloud check against "You bought the big tub of greens powder. Again." given.
- Not met: The run stopped for your yes on the line-up, the presenter, the sheet and the storyboard.
  "Need your yes to lock these three lines." Only the line-up stop exists; stages 1-5 were never written.
- Met: The presenter never says "I tried it", "this worked for me" or a personal story.
  All three lines are in "you"; "Every line has no personal result, no 'I tried it'".
- Met: Every fact is your brand's, word for word.
  Only facts spoken: "one pack a day" / "one daily pack", both in the input; no numbers or claims added.
- Met: The product is in frame from the first frame.
  "Sprout pouch stands on the counter, label to the lens" from the first frame in all three.

## What went in

```text
Ad to go in front of: "Powder tub", video, about 25 seconds.
First line: "You bought the big tub of greens powder. Again."
Line 4: "Sprout is 60+ ingredients, 21 vitamins and minerals and
6 g of fiber in one daily pack."
First frame: our approved AI presenter (man, early 30s) at a
kitchen counter, morning, holding a half-used powder tub, at
arm's length, level voice. His card and sheet are attached.
Product: Sprout. Photos attached: pouch front, one daily pack in a
hand, gummies in a palm. One pack a day, torn straight across the
top. Visible result: none.
Buyer: the quitter who wants to stick, 28 to 45. Doubt: "A gummy
can't hold enough to replace my powder."
Review 1: "[Sprout] has been the one thing I've been able to stick
to." (already used as line 6 of the ad)
Never say: fix, energy or immunity results, weight loss.
Real deadline: none.
```

## What came out

```text
## Line-up: "Powder tub" openings (6 s, 11-word budget)

| # | Move | Line (word for word) | Words | Dials | Where the product sits | Touch | Paid off by |
|---|---|---|---|---|---|---|---|
| A | **Mirror** | "Half a tub left? Sprout is one pack a day." | 10 | Arm's length · level (**matches the ad's first frame**) | Sprout pouch stands on the counter, label to the lens. He holds the half-used tub in his other hand from the first frame. | Taps the top of the pouch on "Sprout" | Line 1: "You bought the big tub of greens powder. Again." |
| B | **Gap** | "How much fits in one Sprout pack? Stay for the number." | 11 | Arm's length · **calm** | Same as A: pouch on the counter, label to the lens, tub in hand. | Turns the pouch label square to the lens on "Sprout" | Line 4: "Sprout is 60+ ingredients, 21 vitamins and minerals and 6 g of fiber in one daily pack." |
| C | **Flip** | "You didn't quit. The powder did. Sprout is one daily pack." | 11 | **Propped mid shot** · **lively** | Same as A: pouch on the counter, label to the lens, tub in hand. | Nudges the pouch forward on "Sprout" | Line 6: the Review 1 quote, "[Sprout] has been the one thing I've been able to stick to." |

**Read-aloud check (each opening, then the ad's first line):**
- **A:** "…one pack a day." / "You bought the big tub of greens powder. Again." This reads as one thought.
- **B:** "…Stay for the number." / "You bought the big tub…" The number arrives at line 4.
- **C:** "…one daily pack." / "You bought the big tub…" The flip lands, then the ad shows the tub.

None of the three opens with a greeting, with "so" or with the brand name in the first three words. No word runs across the cut, and each line ends with one still second.

**Continuity across all three:** every opening ends with the tub in his hand at the same counter in the same morning light. This means each last frame sits next to the ad's first frame with nothing new in hand. The in-hand pack photo is available, but I'm not using it here, so the cut doesn't jump.

**Speaker:** this is the ad's approved presenter. He speaks in "you" only. Every line has no personal result, no "I tried it", and none of the never-say words (fix, energy, immunity results, weight loss). No prices or offers are spoken.

### Moves not used
- **Promise:** `MISSING: visible result`. The facts give no visible result to preview, so there is no promise opening.
- **Proof:** the only sourced numbers (60+ ingredients, 21 vitamins and minerals, 6 g fiber) are already said in line 4. The only quote (Review 1) is already said in line 6. With no other sourced number or quote, there is no proof opening.
- **Timing:** there is no real deadline, so there is no timing opening.

**Need your yes to lock these three lines.** After that I'll confirm the reused avatar card as Approval 1.
```
