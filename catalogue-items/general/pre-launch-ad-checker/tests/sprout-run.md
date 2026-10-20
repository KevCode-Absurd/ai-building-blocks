# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A thorough, accurate audit that catches every real problem (the 'Fix' claim, the 61% chip, the corner-torn pack, the vitamins count, the Sugar-Free pouch for a gut buyer, the AI model) and backs each with the brand file. Every number traces to the files or is correctly counted, nothing unseen is described as seen, and the fixes are small and launch-ready.

## Judge list

- Met: Every item quotes the line, gives the number or names the spot, with a fix.
  "'61% Off' chip... Smallest fix: Use the product page's own wording: 'Up to 55% Off 1st Order'"; all 12 items carry spot and fix.
- Met: Stop-ship holds only wrong facts, wrong product, wrong logo/font, hidden/misspelt words, wrong size, never taste.
  Four items: "Fix" claim, "61% Off", pack "torn open at the corner" (wrong product), "21 Vitamins". Font moved to for-a-person.
- Met: The five links are marked and the weakest one has a fix.
  "Risk is missing... The guarantee is unused: '30-day money-back, first order only'" plus the Low Sugar pouch swap fix above it.
- Met: Nothing unconfirmed is passed; nothing only a person on a phone could judge is marked checked.
  "4:5, 1440 x 1800 (stated, not seen)"; font, wordmark, spelling all "Not confirmed"; "Confirm the percentage at checkout... It is not confirmed."
- Met: No fix covers the art with a plain box, score sum matches lists, no click-rate guess.
  "100 − (4 × 25) − (8 × 5) = −40, which floors at 0"; 4 stop-ship and 8 worth-a-look items listed; box fix is "move the words into empty space".

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
**Ad:** "Hot girl tummy" still, 4:5, 1440 x 1800 (stated, not seen), Instagram feed. It is for the gut-fix seeker who is new to Sprout. As it stands, the message is: "Sprout fixes your bloated tummy, and it's 61% off." That is the problem. It is a still, so the "cut the last three seconds" test does not apply.

---

### Stop-ship

1. **"Fix the Hot Girl Tummy" (on-image line and headline field).**
   - Why it fails: the brand file lists this exact line as risky. "Fix" reads as treating bloating, and the brand's own rule is "supports". No proof on file backs a fix.
   - Smallest fix: change one word in both spots, keeping the slang. Use **"Support the Hot Girl Tummy"** or "Hot Girl Tummy, Supported."

2. **"61% Off" chip.**
   - Why it fails: 61% appears only in Meta ads, and there it is "up to 61%". The site shows 52%, 55%, 49% and 58% at the same time. The chip drops "up to", drops "first order", and shows no renewal price. Also:
     - The first-order price ($29.99) needs the SMS sign-up discount.
     - The subscription renews at $49.99 every 4 weeks (Low Sugar) or $54.99 (Sugar-Free).
     - No first-order price is shown for Sugar-Free, which is the pouch in the picture.
   - Smallest fix:
     - Use the product page's own wording: "Up to 55% Off 1st Order".
     - Link to a page whose first screen shows "renews at $49.99 every 4 weeks".
     - Confirm the percentage at checkout on the day of launch. It is not confirmed.

3. **Daily pack "torn open at the corner" (her hand).**
   - Why it fails: this is the wrong product. Brand rule: "The daily pack is torn straight across its top edge. Never the side, bottom or a corner."
   - Smallest fix: re-render only the pack in her hand, torn straight across the top, with a few deep-green bears showing or tipping into her palm. Keep the pose and the sofa.

4. **"21 Vitamins" chip.**
   - Why it fails: the label says 21 vitamins *and minerals*, so "21 Vitamins" overstates it.
   - Smallest fix: "21 Vitamins & Minerals". If the chip is too tight, use "21 Nutrients", but check that wording against the label first.

---

### Worth a look

1. **AI-made woman, hand on stomach, smiling.**
   - Why it matters: paired with "fix", the pose reads as a gut-relief result from a real customer. A generated person proves nothing about real customers. Never add a name, quote or "real customer" tag to her: that would turn it into a fake testimonial, which is stop-ship.
   - Fix: keep her as a plain lifestyle model, or swap in a real customer photo with permission.

2. **Sugar-Free pouch for the gut buyer.**
   - Why it matters: one of this buyer's doubts is word for word "Will the sugar-free one cause problems?". The brand file says Sugar-Free upsets some stomachs and to "point gut-sensitive buyers to Low Sugar". The offer price also applies to Low Sugar.
   - Fix: swap to the Low Sugar pouch (deep green, no white burst).

3. **Plain white box over the bottom third.**
   - Why it matters: a box pasted over the art hides the scene.
   - Fix: move the words into empty space (sofa back, wall or table). If there is none, use a soft outline behind the letters.

4. **11 words on the image.**
   - Why it matters: the line is 5 words and the chips add 6, against the rule of thumb of 8 or fewer.
   - Fix: keep the line plus two chips, for example "6g Fiber" and the offer.

5. **Main text runs about 160 characters.**
   - Why it matters: the "more" cut at about 125 lands mid-phrase ("…to help keep your gut b"). The first part still works on its own, but the end is lost.
   - Fix: "Feeling off in your gut lately? Sprout supports digestion and gut health with 6g of prebiotic fiber per pack. No powders, no prep." That is about 125 characters.

6. **"help keep your gut balanced" (main text).**
   - Why it matters: this is not an approved line, so it is not confirmed. "6g of fiber, prebiotics" also reads as two ingredients when it is one 6 g prebiotic fiber blend.
   - Fix: the approved "supports digestion and gut health" plus "6g of prebiotic fiber", as in the rewrite above.

7. **Headline field repeats the image line word for word.**
   - Why it matters: it wastes the second spot that could answer a doubt.
   - Fix: "Low Sugar. 6g Fiber. No Shaker." (31 characters).

8. **Proof is thin.**
   - Why it matters: only the "6g Fiber" chip carries it. The best proof on file for this buyer is unused: "67% of surveyed users experienced better, more regular digestion" (a brand-reported survey of 3,000+ customers).
   - Fix: put the survey line in the main text's second sentence, always with "of surveyed users".

**Five links, weakest first:**
- **Risk is missing.** Nothing answers "Will this upset my stomach more?", and the picture shows Sugar-Free. The guarantee is unused: "30-day money-back, first order only".
- **Proof is thin.** Only the fiber chip carries it. Add the 67% survey line.
- **Gain is thin.** "Fix" can't stay, and no customer words show the change. Use "better, more regular digestion".
- **Step is thin.** "Shop now" is fine, but the destination page is MISSING and the offer doesn't match the site.
- **Who is strong.** The slang headline and the hand-on-stomach pose carry it.

---

### For a person

**Look at on a phone:**
- Check that the file is truly 1440 x 1800 at 4:5. View it in the feed preview and confirm the chips and line read at arm's length.
- **Font:** the line is described as "rounded handwritten". The brand uses Work Sans bold and an unnamed chunky display font for statement lines. If this is a lookalike or off-brand font, it becomes stop-ship. Not confirmed.
- **Wordmark top left:** MISSING the logo file, so I can't check it is the real mark. Not confirmed.
- **Spelling:** check every on-image word at 100%, letter by letter. Not confirmed.

**Check against the real product:**
- **Pouch:** glossy deep-green stand-up pouch with a big yellow wordmark, a yellow bear face top right, "28 Daily Packs" at the bottom, and opened only at the resealable top.
- **Gummies:** small, matte, deep-green bears, about thumbnail height.
- **Pack size:** looks right against her hand.

**Confirm before launch:**
- The discount at checkout, not only on the product page, on launch day.
- The landing page's first screen makes the same promise as the ad, with "supports", not "fix".
- Run the Meta ads compliance checker separately. That is the policy check, and this audit does not cover it.

**Gaps:**
- MISSING: the image itself.
- MISSING: the logo file.
- MISSING: the destination URL.
- MISSING: real product photos.

---

### Readiness score

- **Now: 0.** 100 − (4 × 25) − (8 × 5) = −40, which floors at 0.
- **With every fix made: 100.** 100 − 0 − 0 = 100. This assumes the person checks above pass.

The score measures how much needs fixing before launch. It says nothing about how the ad will perform.

### Verdict

**Fix.** The angle and buyer fit are sound. Make these changes:
1. "Fix" → "Support" (both spots).
2. "61% Off" → a live, first-order offer with the renewal price one tap away.
3. Re-render the pack torn straight across the top.
4. "21 Vitamins" → "21 Vitamins & Minerals".
5. Low Sugar pouch.
6. Drop the white box.
7. Rewrite the main text and headline field.

### Next action

Do one re-render and copy pass:
- **Picture:** Low Sugar pouch, pack torn straight across its top, words in open space.
- **On-image line:** "Support the Hot Girl Tummy".
- **Chips:** "6g Fiber" and "Up to 55% Off 1st Order", with the percentage confirmed at checkout that day.

---

Want to plan what to test next with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer), using this audit? Or type your own next step.
```
