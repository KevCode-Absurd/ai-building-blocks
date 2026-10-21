# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

The run reads the script well, finds one must (order), scores and ranks formats with sums shown, and names matching skills. It flags missing buyer and budget info and invents no Sprout facts.

## Judge list

- Met: Every must quotes a line from the script
  Only must: Order controlled, quotes "Then the shaker needs washing." and "A Sprout pack takes one tear."
- Met: Carrying part comes from script's lines, not product page
  Problem chosen from "Then the shaker needs washing." / "One tear. That's the routine."
- Met: Each ranked format has a reason tied to the script
  Carousel: "card 1 scoop + shaker + washing, card 2 one tear"; reasons reference script beats.
- Met: Length check says where extra length would come from
  "Add length only to the problem (more of the powder routine...) and to proof"
- Met: Doesn't treat AI presenter as real customer
  Face rated "no"; no presenter vouching suggested.

## Invented

- other: clumps and rinsing; taste, or keeping the habit going (Suggestions for added length, framed as options, not Sprout facts.)

## What went in

```text
Script (20 s, narrated):
1 "Greens powder takes a scoop, water and a shaker."
2 "Then the shaker needs washing."
3 "A Sprout pack takes one tear."
4 "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6 grams
   of fiber."
5 "One tear. That's the routine."
Offer on screen: $29.99 first order with text sign-up. Renews at
$49.99 every 4 weeks.
Product: daily greens gummies, bought again (subscription).
Limits: no presenter booked.
```

## What came out

```text
Part that carries it: problem (ending a daily hassle the buyer already knows: scoop, shake, wash)
  Why: "Then the shaker needs washing." / "One tear. That's the routine."

Properties
Face people believe: no because "Greens powder takes a scoop, water and a shaker." is narrated comparison; no line has anyone living or vouching for a result
Shows what a camera can't: no because "A Sprout pack takes one tear." shows only visible actions; "sixty-plus ingredients, 21 vitamins and minerals, 6 grams of fiber" are facts to read, not a hidden process
Order controlled: must because "Greens powder takes a scoop, water and a shaker." / "Then the shaker needs washing." has to come before "A Sprout pack takes one tear." or the contrast never pays off
Sound can be assumed: helps because "One tear. That's the routine." has spoken rhythm, but every line is short enough to run on screen muted
Holds attention long enough: helps because "Then the shaker needs washing." needs a moment for the hassle to land, but at 20 s it is two quick beats, not a long scene
Reads as a person: no because "Greens powder takes a scoop, water and a shaker." is a narrator's setup and doesn't need to pass as a person talking

Best formats
1 Animated, drawn or handmade: fit 100/100 (1 of 1), holds the before/after order and attention, carries the narration (sound helps), and needs no presenter
2 Carousel: fit 100/100 (1 of 1), card 1 scoop + shaker + washing, card 2 one tear, card 3 ingredients and offer; partial order is enough for a two-step contrast. It ties with #1 and ranks lower because it loses the narrated rhythm (sound helps)
3 One person on camera: fit 100/100 (1 of 1), holds order and voice. It ties with #1 and #2 and ranks last because of the limit "no presenter booked," and the script needs no face anyway
4 Designed image ad: fit 0/100 (0 of 1), one glance can't hold the scoop → wash → tear order
Blend: not needed; no part needs a second surface

Make it with: video: `paper-craft-ad-script`, then `paper-craft-video-prompts` (Order controlled: a playful paper world steps through scoop, shaker and washing, then the single tear). Still: `carousel-ad-writer` (Order controlled: one card per step of the contrast)

Length: fits. 20 s is the given length and holds a two-beat problem plus a one-tear payoff, which works as opening and proof at once. Add length only to the problem (more of the powder routine, such as clumps and rinsing) and to proof (taste, or keeping the habit going on a subscription). Keep the opening, line 4 and the offer frame ("$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks.") the same size. A longer cut is its own script, not this one stretched.

MISSING: buyer awareness and reason to buy; budget and tools. The ranking was judged from the script's lines alone.

Next: set up AI to run this with the [AI workflow handoff planner](https://useaiblocks.com/skills/ai-workflow-handoff-planner), or write the ad copy with the [Story image ad writer](https://useaiblocks.com/skills/story-image-ad-writer)? You can also name your own next step.
```
