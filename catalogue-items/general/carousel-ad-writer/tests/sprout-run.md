# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A tight five-card argument that uses only the facts given, keeps the brand out of card 1, shows the pack torn across the top as the brand requires, and states the real $49.99 renewal and first-order-only guarantee honestly. The owner can hand the picture notes straight to an image tool; the only gaps are the product photos and flavour it correctly marked MISSING.

## Judge list

- Met: Card 1 makes sense with no other card.
  "Choking on greens powder again?" / "No wonder you keep skipping it." Stands alone, picks the powder quitter, no brand name.
- Met: Every card 12 words or fewer, last 20 or fewer.
  Cards count 11, 10, 10, 11 words; card 5 "Sprout: 28 daily packs... Try Sprout today." is 16 words.
- Met: Only the last card asks for an action.
  Only card 5 has "Try Sprout today."; cards 1 to 4 end on questions or statements.
- Met: Swapping cards 2 and 3 breaks the sense.
  Card 3's "Just a handful. Enough?" is answered by card 4; placing "What if you wanted your greens?" between them breaks the chain.
- Met: Every number, quote and price is in the brand facts.
  28 packs, $49.99 every 4 weeks, 60+, 21, 6g, 80% daily of 3,000+ surveyed, 30-day first-order guarantee all appear in the run input.

## What went in

```text
Idea: the powder quitter. Greens powder is a chore, so people
quit. Sprout is greens you eat, so they stick with it.
Cards: 5. Buyer: knows the problem, has tried powders.

Brand facts:
- 28 daily packs per pouch. Tear one across the top, pour the
  small handful of gummy bears into your palm. No water, no
  mixing, no shaker.
- 60+ ingredients, 21 vitamins & minerals, 6g fiber per pack
- Survey: 95% of surveyed users take it at least 4-6x per week,
  80% daily (brand survey, 3,000+ customers)
- Subscription $49.99 every 4 weeks, "Pause Or Cancel Any Time".
  30-day money-back guarantee, first order only.
- Doubt: "A gummy can't hold enough to replace my powder."
- Customer words: "I've been choking on [a big-name greens
  powder] for the last few years" / "It's wild I WANT to take
  [Sprout] and don't forget."
```

## What came out

```text
No image tool is connected here, so I'll write the picture prompts and you'll generate the images elsewhere (steps at the end).

**Look on every card:** 1:1. The same white kitchen counter in soft morning light and the same sage-green wall behind it. The same person's hand, with no face, and the same bold sans-serif type, top-left, in white on a dark-green band.

---

**Card 1 | Opening and problem | "Choking on greens powder again?" / "No wonder you keep skipping it." | Picture: on the counter, a shaker bottle half-full of clumpy green sludge, with a scoop and a powder tub pushed to the side. No product and no brand. | Headline: Why powders get quit | Gap: there's a reason you skip it, so what would you actually stick with?**

**Card 2 | Promise | "What if you wanted your greens?" / "And never forgot them?" | Picture: the same counter. The shaker is pushed aside and unopened. The same hand rests open, palm up and empty, next to a morning coffee. | Headline: Greens you eat | Gap: wanting to take it sounds great, but how?**

**Card 3 | How it works | "No water. No mixing. No shaker." / "Just a handful. Enough?" | Picture: the same hand tears a Sprout daily pack across the top and pours a small handful of gummy bears into the palm. The shaker sits blurred in the background for contrast. | Headline: Tear. Pour. Done. | Gap: can a small handful of gummies really replace a scoop of powder?**

**Card 4 | Doubt answered | "Per pack: 60+ ingredients, 21 vitamins & minerals." / "Plus 6g fiber." | Picture: a close-up of the same palm holding the gummy bears, with the torn pack beside it on the counter. | Headline: Per pack, every day | Gap: it holds enough, so what does it take to switch?**

**Card 5 | Offer and action | "Sprout: 28 daily packs, $49.99 every 4 weeks. Pause Or Cancel Any Time. Try Sprout today." | Picture: the Sprout pouch upright on the counter with a few daily packs fanned in front of it and the same hand reaching for one. | Headline: 30-day refund, 1st order | Gap: none (final card).**

---

**Text above the ad:**
Choking on your greens powder is why you keep skipping it. Sprout is greens you eat: tear a daily pack and pour the gummy bears into your palm. No water, no mixing, no shaker. 80% of surveyed users take it daily (brand survey, 3,000+ customers). 30-day money-back guarantee on your first order.

*(First sentence: 58 characters.)*

**Ads Manager:** switch off "show best-performing cards first" so the order stays fixed.

---

**Sources**
- "choking on" (Card 1, text above the ad): customer words, "I've been choking on [a big-name greens powder]…"
- "wanted your greens" / "never forgot them" (Card 2): customer words, "It's wild I WANT to take [Sprout] and don't forget."
- "No water. No mixing. No shaker." / tear, pour, gummy bears, small handful (Card 3, text above the ad): brand facts, product use.
- 60+ ingredients, 21 vitamins & minerals, 6g fiber per pack (Card 4): brand facts.
- "A gummy can't hold enough" (doubt behind Cards 3 and 4): brand facts, doubt.
- 28 daily packs, $49.99 every 4 weeks, "Pause Or Cancel Any Time" (Card 5): brand facts, subscription.
- 30-day money-back guarantee, first order only (Card 5 headline, text above the ad): brand facts.
- 80% daily, 3,000+ customers (text above the ad): brand survey.

**MISSING:**
- Product photos by role: pouch front, open pack in use, close-up of the bears. These are needed to check the pack, label and bear colours on Cards 3 to 5.
- Flavour or variant. Use one across all cards.
- Shipping terms.
- Returns terms beyond the first-order guarantee.

---

**Score: 100/100 (7 of 7 checks)**

---

**To make the pictures:**
- **ChatGPT or Gemini:** paste each picture note plus the "Look on every card" line into a chat and ask for the image. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make them too.
- **Higgsfield:** paste the prompts into its image tool, or connect Higgsfield to Claude so Claude makes them there.
- **Claude Code:** if you have `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompts to that API and save the files. You can get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. Each picture is billed by OpenAI or Google.
```
