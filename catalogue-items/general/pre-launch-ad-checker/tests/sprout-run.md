# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 1.

A strong, usable review: it catches the corner tear, the risky "Fix" claim, the vitamins-vs-minerals slip, the unconfirmed 61%, the off-brand font and the Sugar-Free pouch shown to a gut-sensitive buyer, all with small fixes that keep the art. It slips on two small points: it misstates how the brand file writes the 61% offer, and it passes the file size from a description instead of sending it to the phone check.

## Fix

In step 6 add: "Before saying how a file states a number, quote every place it appears; never say 'only' unless you have checked all of them." In "If something is missing" restate that with only a description the stated size goes under "for a person", not marked correct."


## Judge list

- Met: Every item quotes the line, gives the number or names the spot, with a fix.
  "**Daily pack torn at the corner** (her hand)... Fix: Re-render only the pack, torn straight across the top"; every stop-ship and worth-a-look item has spot, reason and fix.
- Met: Stop-ship holds only wrong facts, wrong product, wrong logo or font, hidden or misspelt words and wrong size, never taste.
  Five items: corner tear (product), "Fix" claim, "21 Vitamins", "61% Off" (facts), handwritten font (font). White box and generated model sit in worth a look.
- Met: The five links are marked and the weakest one has a fix.
  "Risk: missing... Proof: thin... Gain: thin... Step: thin... Who: strong" then "Risk: the Sugar-Free pouch... Fix: Swap the pouch for the plain green Low Sugar one."
- Not met: Nothing it couldn't confirm is passed, and nothing only a person on a phone could judge is marked as checked.
  "4:5, 1440 x 1800 (correct for the Instagram feed)" passes size from a description; skill says move size to "for a person" when no image is given.
- Met: No fix covers the art with a plain box, and there's no score or click-rate guess.
  "Move the line into the empty wall or sofa space, or drop the box and add a soft outline"; no score or results numbers anywhere.

## Invented

- claim: The only 61% on file is in ads, written as "up to 61% OFF." (brand.md also carries "'Sprout is too expensive': here's 61% off to prove otherwise" with no "up to", so the brand's own headline drops the limit too.)

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
**Ad:** "Hot girl tummy" still · 4:5, 1440 x 1800 (correct for the Instagram feed) · Instagram feed · for the gut-fix seeker who is new to Sprout. Message in one sentence: *Sprout gummies settle an upset gut with 6g fiber and 21 vitamins, now 61% off.* The 61% off is a second job riding on the gut message. This is a still, so there is no "cut the last three seconds" test. `MISSING: the image itself` (judged from the description only) · `MISSING: logo file` · `MISSING: landing page URL`

---

**Stop-ship**

1. **Daily pack torn at the corner** (her hand).
   - **Why it fails:** It breaks the brand's product rule: "torn straight across its top edge. Never the side, bottom or a corner." This counts as a wrong product.
   - **Fix:** Re-render only the pack, torn straight across the top, with gummies showing at the opening or tipping into her palm. Keep the woman, sofa and pouch as they are.

2. **"Fix the Hot Girl Tummy"** (on-image line and headline field).
   - **Why it fails:** The brand file lists this as a risky claim: "'Fix' sounds like treating bloating. The brand's own rule is 'supports'." The picture of a hand on her stomach plus a smile makes it read as a treatment promise.
   - **Fix:** Keep the slang and change one word, in both places:
     - "Support the Hot Girl Tummy", or
     - "Hot Girl Tummy, Supported."

     Both stay under 40 characters.

3. **"21 Vitamins"** (chip).
   - **Why it fails:** The approved line is "21 vitamins & minerals." Some of the 21 are minerals (iron, zinc), so the chip states a wrong fact.
   - **Fix:** "21 Vitamins & Minerals", or "21 Nutrients" if space is tight.

4. **"61% Off"** (chip).
   - **Why it fails:**
     - The only 61% on file is in ads, written as "up to 61% OFF." The chip drops the "up to" limit.
     - The live site at the same time shows 49%, 52%, 55% and 58%. 61% is not confirmed at checkout.
     - The pouch shown is Sugar-Free. No first-order price is shown on file for Sugar-Free.
     - Nothing shows the renewal price ($49.99 Low Sugar / $54.99 Sugar-Free every 4 weeks).
   - **Fix:**
     - Use the figure checkout actually gives today, with its limit, for example "Up to 55% Off First Order."
     - Make sure the landing page states the renewal price on its first screen.
     - If you can't confirm a figure today, swap the chip for "6g Prebiotic Fiber" or "Vegan."

5. **Rounded handwritten font** (all on-image words).
   - **Why it fails:** The type on file is Work Sans bold for headings, plus a chunky friendly display font for statement lines. A handwritten face is not on file, so it reads as off-brand lettering.
   - **Fix:** Reset the line in Work Sans bold, or in the brand's display font, and the chips in Work Sans or DM Mono uppercase. Keep the same size and placement.

---

**Worth a look**

- **Five links, weakest first:**
  - **Risk:** missing. Nothing answers "Will this upset my stomach more?" or the subscription-trap fear.
  - **Proof:** thin. Only the 6g and 21 chips carry it.
  - **Gain:** thin. "Fix" is not their word. Their word is "feel normal."
  - **Step:** thin. "Shop now" goes to an unknown page.
  - **Who:** strong. The slang headline and the hand on her stomach carry it.

- **Risk: the Sugar-Free pouch is shown to the gut-sensitive buyer.**
  - The brand's own note: "Sugar-Free upsets some stomachs. Point gut-sensitive buyers to Low Sugar." This buyer's doubt is literally "Will the sugar-free one cause problems?"
  - **Fix:** Swap the pouch for the plain green Low Sugar one, which has no white burst.

- **Proof: there is no reason to believe beyond the ingredient counts.**
  - **Fix:** Add the approved survey line to the main text, with its limit intact: "67% of surveyed users experienced better, more regular digestion."

- **Generated woman.**
  - She proves nothing about real customers.
  - With a hand on her stomach and a smile, she reads as an after-result.
  - Keep her as a model only. Never caption her as a customer or pair her with a quote.

- **White box over the bottom third.**
  - A plain box pasted over the art.
  - **Fix:** Move the line into the empty wall or sofa space, or drop the box and add a soft outline behind the letters.

- **Main text: "to help keep your gut balanced."**
  - "Balanced" is not an approved line. The approved line is "Supports digestion and gut health." This is `not confirmed`.
  - **Fix:** "...6g of prebiotic fiber and 21 vitamins & minerals to support digestion and gut health. No powders, no prep."
  - The text runs about 162 characters, so it gets cut near "keep your g…" before "more." The first part does work alone.

- **Main text: "6g of fiber, prebiotics."**
  - This reads as two ingredients. The 6g *is* the prebiotic fiber.
  - **Fix:** "6g prebiotic fiber."

- **One message vs two.**
  - The gut message plus the 61% chip asks the eye to do two jobs.
  - **Fix:** If you keep an offer chip, make it the last thing read, after the gut line.

- **Ad vs page.**
  - The first screen of the landing page should say "supports digestion." It should not say "revive whole body vitality" or "better metabolism," which are both unsupported claims on the brand's own pages.

---

**For a person (on a real phone)**

- At 100%, letter by letter: the spelling of every on-image word.
- The wordmark top left is the real Sprout wordmark and not a lookalike. `not confirmed`, no logo file.
- The pouch details:
  - glossy deep green foil
  - big yellow wordmark
  - yellow bear face top right
  - "28 Daily Packs" at the bottom
  - resealable top, shown closed and not torn

  All `not confirmed`.
- The gummies are small opaque deep-green bears, about thumbnail height against her hand. `not confirmed`.
- On a feed-sized screen: where the eye lands first, and whether it is the line or her face.
- The discount and renewal price a new customer sees at checkout today, and whether 61% needs the SMS sign-up. `not confirmed`.
- The landing page. `MISSING`.
- The policy check: run "Keep Facebook from blocking your ads." It matters for a body-focused health claim and the hand on the stomach. The ads also carry no FDA line.

---

**Verdict:** Fix.
- The corner tear
- "Fix" in the image and headline
- "21 Vitamins"
- "61% Off" and the renewal price
- The handwritten font

Then strongly consider the Low Sugar pouch swap.

**Next action:** Send the image back for one re-edit: tear the pack straight across the top, swap in the Low Sugar pouch, and reset the words in Work Sans with "Support," "21 Vitamins & Minerals" and a checkout-confirmed offer.
```
