# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 5 met. Invented facts: 1.

Solid five-card argument with a working standalone first card, tight word counts, and every fact traced to the brief. Gaps are flagged as MISSING and the product only appears late, as the skill requires.

## Judge list

- Met: Card 1 makes sense with no other card.
  "Still choking down your greens powder? Or quietly skipping it?" works alone, no brand name.
- Met: Every card 12 or fewer words, last 20 or fewer.
  Card 4 is 12 words; card 5 'Sprout. 28 daily packs, $49.99 every 4 weeks. Pause Or Cancel Any Time. Start yours.' is 17.
- Not met: Only the last card asks for an action.
  Card 4's gap asks 'So what does it cost to try?' and card 5 only. But card 3 says 'Tear, pour, eat' as instruction; card 5 also adds a button.
- Met: Swapping cards 2 and 3 breaks the sense.
  Card 2 gap 'how do you take it?' is closed by card 3; swapping breaks it.
- Met: Every number, quote and price is in the brand facts.
  $49.99, 80%, 3,000+, 60+/21/6g, 28 packs, 30-day all given. Button text 'Shop now' is a label.

## Invented

- other: The button reads "Shop now" (Card 5 asks for action; button wording is a design suggestion, not a fact, minor.)

## Safety

- Text above the ad says the first order comes with a 30-day guarantee but omits that it is first order only on the subscription; fine, but survey stat is attributed correctly. No unflagged health claims.

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
I can't draw pictures in this chat, so you'll get a picture note for each card to use as its image prompt. How to make the pictures is at the end.

**All cards:** 1:1. The same light kitchen counter, morning window light, shot from the same height. One person's hand and forearm, no face, the same sleeve on every card. The same type style and the same colours throughout. MISSING: brand colours, fonts, pack design. In Ads Manager, switch off "show best-performing cards first" so the order stays fixed.

---

**Card 1 | Opening and problem**
- **Words:** Still choking down your greens powder? Or quietly skipping it?
- **Picture note:** A shaker bottle on the counter, half full of murky green liquid with clumps stuck to the sides. A scoop sits in an open tub beside it. No Sprout pack and no brand name.
- **Headline:** The daily chore
- **Gap to the next card:** Skipping it isn't a lack of willpower. So what would you actually stick with?

**Card 2 | Promise**
- **Words:** Greens you'll WANT to take. And won't forget.
- **Picture note:** The same counter. The shaker has been pushed to the edge of the frame, out of focus. The hand rests open and empty, palm up, in the centre.
- **Headline:** Not another drink
- **Gap to the next card:** If it's not a drink, then how do you take it?

**Card 3 | How it works**
- **Words:** No water. No mixing. No shaker. Tear, pour, eat.
- **Picture note:** The same hand, in two moments side by side. Left: it tears a daily pack across the top. Right: a small handful of gummy bears sits in the palm. The pack is seen but not named. MISSING: what the pack and the gummies look like, including variant and colour.
- **Headline:** Tear. Pour. Done.
- **Gap to the next card:** But a few gummies can't match a full scoop... can they?

**Card 4 | Doubt answered**
- **Words:** Enough in a gummy? / 60+ ingredients. 21 vitamins & minerals. 6g fiber.
- **Picture note:** A close-up of the palm of gummy bears, with the torn pack just behind it. The three facts are set in type down one side, in the same type as every other card.
- **Headline:** In every pack
- **Gap to the next card:** So what does it cost to try?

**Card 5 | Offer and action**
- **Words:** Sprout. 28 daily packs, $49.99 every 4 weeks. Pause Or Cancel Any Time. Start yours.
- **Picture note:** The full pouch standing on the same counter, with a few daily packs fanned out in front of it. The product is named here for the first time. The button reads "Shop now".
- **Headline:** $49.99 / 4 weeks
- **Gap to the next card:** None (last card).

---

**Text above the ad**

If your greens powder has become a daily chore you keep skipping, the problem might be the powder. Sprout is greens you eat: tear open a daily pack and pour a small handful of gummy bears into your palm. No water, no mixing, no shaker. In a brand survey of 3,000+ customers, 80% take it daily. Your first order comes with a 30-day money-back guarantee.

(The first sentence is 92 characters.)

---

**Sources**
- "choking", "WANT to take", "don't forget": customer words you supplied. They are adapted on the cards, not presented as quotes.
- Tear across the top, small handful of gummy bears, palm, no water / no mixing / no shaker: brand facts, how it's used.
- 60+ ingredients, 21 vitamins & minerals, 6g fiber per pack: brand facts.
- 28 daily packs per pouch: brand facts.
- $49.99 every 4 weeks, "Pause Or Cancel Any Time": brand facts, subscription terms.
- 30-day money-back guarantee, first order only: brand facts.
- 80% take it daily, 3,000+ customers: brand facts, from the brand survey.
- The doubt "A gummy can't hold enough": brand facts, answered on card 4.

**CHECKS MISSED:**
- Same product on every card: the pack and gummy look can't be checked without product photos.

**MISSING:**
- Product photos: pack front, pack open or in use, and a gummy close-up.
- Which variant or flavour to show.
- Brand colours, fonts and photo style.
- Shipping and returns terms, in the store's own wording.

---

**To make the pictures:**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** paste each picture note plus the "All cards" line into a chat and ask for a 1:1 image. Free plans have tight daily limits.
- **Higgsfield:** paste the notes into its image tool, or connect it to Claude.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, it can send the prompts to that image API and save the files. Each picture is billed to your key.

Once you have the product photos, compare each card's pack and gummies against them before building in Ads Manager.

What next? You could check it with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker) (the survey and nutrient claims are worth a look), make image ads with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker), sharpen the first line with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer), or write the page it clicks to with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer). Or tell me your own.
```
