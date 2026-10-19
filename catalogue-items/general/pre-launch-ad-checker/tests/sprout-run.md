# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A thorough, accurate check that catches every real problem in the ad (the risky 'Fix' claim, the unsupported 61%, the mislabelled vitamin count, the wrong tear, the Sugar-Free pouch for a gut buyer) and grounds each in the brand file with correct arithmetic. The only quibble is that the font was put in stop-ship from a description rather than moved to 'for a person' as the skill suggests, though the run hedged it and the description was explicit.

## Judge list

- Met: Every item quotes the line, gives the number or names the spot, with a fix.
  "'21 Vitamins' chip... Fix: Change it to '21 Vitamins & Minerals'"; "Main text is about 162 characters... Fix: ...about 101 characters."
- Met: Stop-ship holds only wrong facts, wrong product, wrong logo/font, hidden or misspelt words, wrong size, never taste.
  Five items: unapproved 'Fix' claim, '61% Off', '21 Vitamins', pack 'torn open at the corner', 'rounded handwritten font'. Sugar-Free pouch and box go to worth a look.
- Met: The five links are marked and the weakest one has a fix.
  "Risk: missing... no guarantee" paired with "No answer to risk... Fix: Name Low Sugar, and add the guarantee... first order only."
- Met: Nothing unconfirmed is passed; nothing only a person on a phone could judge is marked as checked.
  "Not confirmed: 'help keep your gut balanced'... The 61% figure at checkout today." Size, spelling, wordmark moved to for a person; font hedged 'confirm it on the image'.
- Met: No fix covers the art with a plain box, score sum matches lists, no click-rate guess.
  "100 − (5 × 25) − (8 × 5) = 100 − 125 − 40, which stops at 0" matches 5 and 8 items; box fix is "set the words in the empty space".

## What went in

```text
Ad: "Hot girl tummy" still. Instagram feed, 4:5, 1440 x 1800.
Picture (image not attached, described): a woman on a sofa, hand
  on her stomach, smiling. She was made with an AI image tool.
  She holds a daily pack torn open at the corner. The green pouch
  with a white Sugar-Free burst sits on the table. Wordmark top
  left.
On-image words, in a white box over the bottom third, in a
  rounded handwritten font: "Fix the Hot Girl Tummy" / chips:
  "6g Fiber", "21 Vitamins", "61% Off"
Main text (a live Sprout ad's words): Feeling off in your gut
  lately? Sprout supports digestion with 6g of fiber, prebiotics,
  and daily vitamins to help keep your gut balanced without
  powders or prep.
Headline field: Fix the Hot Girl Tummy
Button: Shop now
For: the gut-fix seeker, new to Sprout.
Facts and marks: the Sprout brand file (offers, approved and risky
  claims, look, "show it right" rules). Work Sans bold on file.
  No logo file.

[attached: sprout/brand.md]
```

## What came out

```text
**Ad:** "Hot girl tummy" still · 4:5, 1440 x 1800 · Instagram feed · for the gut-fix seeker, new to Sprout (described image, not attached).
Message: "If your gut feels off, Sprout's 6g of fiber supports digestion, and it's 61% off." This is a still, so the cut-the-last-three-seconds test does not apply.

`MISSING: the image file` (size, spelling, logo and font are moved to "for a person") · `MISSING: logo file` · `MISSING: landing page URL`

**Stop-ship**

1. **"Fix the Hot Girl Tummy"** (on the image and in the headline field).
   - Why it fails: The brand file lists this exact line as risky. "'Fix' sounds like treating bloating. The brand's own rule is 'supports'." The approved line is "Supports digestion and gut health."
   - Fix: Change one word in both places: "Support the Hot Girl Tummy." Or use "Hot Girl Tummy? Meet 6g of Fiber."

2. **"61% Off" chip.**
   - Why it fails: No live page shows 61%.
     - The site shows 52%, 55%, 49% and 58% at the same time.
     - The only source is an ad that reads "up to 61% OFF + 4 FREE gifts". The chip drops the "up to".
     - The real first-order price is $29.99 against $66.65 one-time, which is 55% off. It only applies with the new-customer text-message (SMS) discount.
     - The subscription renews at $49.99 every 4 weeks, and the ad doesn't show that.
     - The pouch shown is Sugar-Free, which has no first-order price on file.
   - Fix: Check the number at checkout today. Then either:
     - set the chip to the confirmed figure and keep "up to" and "first order", or
     - use "First order $29.99" and add "renews at $49.99 every 4 weeks" to the main text, as long as the landing page shows the same.

3. **"21 Vitamins" chip.**
   - Why it fails: The label says 21 vitamins *and minerals*. Minerals make up part of the 21.
   - Fix: Change it to "21 Vitamins & Minerals", or drop the chip (see the word count under "worth a look").

4. **Daily pack "torn open at the corner".**
   - Why it fails: This is a wrong product display. The brand's rule is: "torn straight across its top edge. Never the side, bottom or a corner."
   - Fix: Regenerate the hand and pack only. Show the pack torn straight across the top, with green bears pouring into her palm.

5. **"Rounded handwritten font"** on the image words.
   - Why it fails: It isn't on file. Headings are Work Sans bold, and big statement lines use the brand's chunky display font. A stand-in font counts as a lookalike. This is going by the description, so confirm it on the image.
   - Fix: Reset the words in Work Sans bold.

**Worth a look**

1. **Sugar-Free pouch (white burst) for a gut buyer.**
   - Why: The brand file says "Sugar-Free upsets some stomachs. Point gut-sensitive buyers to Low Sugar." This buyer's own doubt is "Will the sugar-free one cause problems?"
   - Fix: Swap in the Low Sugar pouch (no white burst) and keep the layout.

2. **White box over the bottom third.**
   - Why: It is a plain box pasted over the art.
   - Fix: Drop the box and set the words in the empty space, or add a soft outline behind the letters.

3. **Eleven words on the image.**
   - Why: The headline has 5 words and the chips have 6. The two-second read is about 8.
   - Fix: Drop the "21 Vitamins" chip. That brings it to 9 words and keeps the gut message.

4. **Proof is thin.**
   - Why: The only proof is ingredient numbers. The file has a gut-specific line that fits this buyer: "67% of surveyed users experienced better, more regular digestion" (a brand-reported survey of 3,000+ customers).
   - Fix: Add it to the main text with "of surveyed users" kept intact.

5. **No answer to risk.**
   - Why: This buyer's top doubt is "Will this upset my stomach more?" Nothing in the ad answers it.
   - Fix: Name Low Sugar, and add the guarantee in the store's own terms: "30-day money-back guarantee on your first order only."

6. **Main text is about 162 characters.**
   - Why: The "more" cut at about 125 falls mid-sentence, so "without powders or prep", the reason to switch, gets hidden. It also lists "6g of fiber, prebiotics" as if they were two things, but the 6g *is* the prebiotic fiber.
   - Fix: "Feeling off in your gut lately? Sprout's 6g of prebiotic fiber supports digestion. No powders, no prep." That is about 101 characters.

7. **AI-made woman, hand on stomach, smiling, next to "Fix".**
   - Why: Together they read as a result from a person who doesn't exist. She isn't presented as a reviewer, so this isn't stop-ship, but she proves nothing.
   - Fix: Keep her as a lifestyle shot and let the survey line carry the proof. For a result claim, use a real customer with permission.

8. **Headline field repeats the image line word for word.**
   - Why: A second slot goes to the same words.
   - Fix: Use it for the switch or the risk instead, for example "6g Fiber. No Powders. No Prep." (29 characters).

**Five links, weakest first:**
- Risk: missing. A Sugar-Free pouch is on show and there is no guarantee.
- Proof: thin. Only ingredient counts carry it.
- Step: not confirmed. The ad says "Shop now", but no landing page was given.
- Gain: thin. Only the smile carries it, with no customer words like "feel normal".
- Who: strong. The headline, the hand on her stomach and "Feeling off in your gut lately?" all carry it.

**For a person**

- **The file, at 100% on a phone:**
  - It is really 1440 x 1800 and built for 4:5, not cropped.
  - Every word on the image is spelt right, letter by letter.
- **Wordmark top left** is the real yellow Sprout wordmark (there is no logo file to compare).
- **The pouch:**
  - It is the current design: glossy deep green, yellow bear face top right, "28 Daily Packs".
  - The daily pack looks the right size in her hand: a small flat sachet holding a small handful.
- **Where the eye lands first:** on her face, or on her hand and the pouch? Does the hand on her stomach read as relief or as pain?
- **Landing page:** its first screen makes the same gut promise and shows the renewal price.
- **Not confirmed:**
  - "help keep your gut balanced". It is not an approved line; use "supports digestion and gut health".
  - The 61% figure at checkout today.
- **Meta policy:** run the Meta ads compliance checker separately. Look at the health claim and at "Feeling off in your gut lately?", which may count as naming a personal health condition.

**Readiness score**
- Now: 100 − (5 × 25) − (8 × 5) = 100 − 125 − 40, which stops at **0**.
- With fixes made: 100 − 0 − 0 = **100**.

**Verdict:** Fix. Change "Fix" to "Support". Replace "61% Off" with a checkout-confirmed offer and its renewal price. Change "21 Vitamins" to "21 Vitamins & Minerals". Redo the pack so it is torn across the top. Reset the words in Work Sans bold. While you are in the art, swap in the Low Sugar pouch and drop the white box.

**Next action:** Check Sprout's checkout today for the real first-order discount and renewal price on Low Sugar. The offer chip, the main text and the landing page all depend on that number.
```
