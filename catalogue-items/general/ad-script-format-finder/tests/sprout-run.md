# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

The run correctly identifies the problem as the carrying part, ties its single must to quoted lines, and ranks formats with reasons from the script. It also gives a clear video route and says where extra length would come from, so the owner can act on it.

## Judge list

- Met: Every "must" quotes a line from your script.
  Only must: controlled order, quoting "a scoop, water and a shaker", "Then the shaker needs washing." and "One tear. That's the routine."
- Met: The carrying part comes from what the script spends its lines on, not the product page.
  "Lines 1, 2, 3 and 5 all work the routine"; line 4 noted as support only.
- Met: Each ranked format has a reason tied to the script, not "it's popular".
  Carousel: "scoop, water, shaker, wash, tear, inside"; designed image "loses the order the punchline depends on".
- Met: The length check says where extra length would come from, not just "make it longer".
  "More problem: clumps... Objections: taste, sugar... Proof: a week of tears vs. a week of washing."
- Met: It doesn't treat an AI-generated presenter as a real customer.
  Says no face is needed and no presenter is booked; no AI presenter is mentioned.

## Invented

- claim: More problem: clumps, the shaker left in the bag, skipping days. (Specific problem details not in the files, but offered as suggestions for a longer script, not as Sprout facts.)

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
Carrying part: The problem (ending a daily hassle the buyer knows well). Lines 1, 2, 3 and 5 all work the routine: "Greens powder takes a scoop, water and a shaker." / "Then the shaker needs washing." / "One tear. That's the routine." Line 4 supports it with facts but doesn't carry it.

Needs:
- A believed face: **no**. The script is narrated and nobody vouches. "A Sprout pack takes one tear." is a claim that can be shown, not testified to. No presenter is booked, and none is needed.
- Showing the unseen: **helps**. "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6 grams of fiber." is the inside of the pack, but it lands as numbers on screen. It doesn't need a cutaway.
- Controlled order: **must**. The before steps ("a scoop, water and a shaker" → "Then the shaker needs washing.") have to come before the payoff ("A Sprout pack takes one tear."). The callback "One tear. That's the routine." only works because it comes last.
- Sound: **helps**. "One tear. That's the routine." is written with spoken rhythm, but it survives muted if every line is also on screen.
- Time: **helps**. The hassle in "a scoop, water and a shaker" and "the shaker needs washing" needs a few seconds per step to feel tedious. That is seconds, not minutes.
- Sounds like a person: **no**. "Greens powder takes a scoop, water and a shaker." is plain narration. It doesn't need to pass as a person talking.

Surfaces:
1. **Animated or handmade video.** This is the best fit. It holds the before-then-after order and keeps attention without a face. It can also stage the shaker chores playfully, and line 4 fits as on-screen counts.
2. **Carousel.** This is workable. It gives partial order with one picture per card: scoop, water, shaker, wash, tear, inside. Sound is lost, so the lines go on the cards.
3. **Designed image ad.** This is weak. It can only show one split (shaker pile vs. one torn pack) and loses the order the punchline depends on.

Ruled out:
- **One person on camera:** no face is needed and no presenter is booked.
- **Long-text post-style image:** no "sounds like a person" need.

No blend is needed, because one part carries the script.

Make it with:
- **Video (order must, gentle or playful problem):** `paper-craft-video-ad-script-writer`, then `paper-craft-video-clip-prompt-writer`.
  - Paper props suit the scoop, shaker and sink steps, and the single tear can be a literal paper tear.
  - Feed this script in as the input.
- **Video, alternative (order must, told in panels):** `motion-comic-video-ad-script-writer`, then `motion-comic-video-clip-prompt-writer`.
- **Still in the same look:** `paper-craft-image-ad-maker`.
- **Carousel (partial order for the before steps):** `card-by-card-carousel-ad-writer`.

Length:
- **Fits.** The best length is 15–20 s, and this script is at 20 s.
  - The carrying part is a problem plus a visible demo (the tear). The demo serves as opening and proof at once, so it lands in this length. Nothing here needs explaining over time.
- **The offer:** "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks." stays the same at any length, and the renewal terms should stay legible on screen.
- **If a longer cut is wanted (30–45 s),** write it as its own script rather than stretching this one. The extra time would come from:
  - More problem: clumps, the shaker left in the bag, skipping days.
  - Objections: taste, sugar, and whether a gummy matches the powder (line 4 starts to answer this).
  - Proof: a week of tears vs. a week of washing.
  - Running the problem → promise → proof cycle twice.
```
