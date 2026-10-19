# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is sound: a calm statement image, an honest step grounded in the real renewal and guarantee terms, and no invented facts. But it breaks the output shape and wrongly flags real on-page text as unverified.

## Fix

In the Flags step, require checking each flagged quote against the product page file before calling it inferred or not on file (the "Renews at $49.99... Cancel anytime" line is on the page). Also hold the output to the exact shape, with the LINE UNDER IMAGE format and the SCORE line with its count.

## Judge list

- Met: The fear is one your buyers state themselves, with a source you can point to.
  Quotes "Will the price jump after the first order?" and the subscription-trap doubt, sourced to brand.md "Who buys it" and review 17.
- Met: The story offers a step the reader can take, backed by a fact.
  Step: read the renewal line; backed by $49.99 renewal, $29.99 SMS footer, first-order-only guarantee.
- Met: The picture is calm. No accident, emergency, hospital or damaged body.
  A plain card statement among kitchen-table post; "Calm and quiet, nothing happening yet."
- Met: No real bank, company, clinic or person is named or shown.
  Prompt: "No logos, no bank or company names, no readable prices... no people, no product."
- Met: Nothing in the picture or the line says your product prevents the outcome.
  Line: "The second month's statement"; flag says price does rise and picture shows no fix.

## What went in

```text
Story ad (approved, built on review 17):
I hate subscriptions. I feel like they are a trap.
Every "first order" deal I'd signed up for, I waited for the full
price to land on my card.
So before I tried Sprout, I read the line under the button:
"Renews at $49.99 each 4 weeks. Cancel anytime." The $29.99 first
box needs the text sign-up discount. I knew both numbers before I
paid. 30-day money-back guarantee on the first order.

Buyer: the price doubter.
Feared next step, from the brand file: "Will the price jump after
the first order?"

[attached: sprout/brand.md]
```

## What came out

```text
No image tool is connected here, so this is the brief and prompt only, not the picture.

**1. Gate: Pass**
- **Their fear:** "Will the price jump after the first order?" and "I hate subscriptions because I feel like they are a trap." These are the price doubter's own doubts, taken from public reviews (sprout/brand.md, "Who buys it"). The story ad repeats the second one, from review 17.
- **A doable step:** Read the renewal line before paying. The first order is $29.99 and needs the text sign-up discount, according to the footer's small print. After that it renews at $49.99 every 4 weeks, per the brand file's price table. There is a 30-day money-back guarantee on the first order only, per the FAQ: "This policy applies only to your initial purchase." The step is to know the price. It does not claim the price won't rise.
- **Safe to show:** Yes. This is a money fear, not a body or health fear.

**2. Scene**
A plain card statement lying a little apart from the rest of the post on a kitchen table.

**3. The object**
A paper card statement, the first one after the intro deal. It stands for the full price landing on the card.

**4. Where it lands**
- **Place:** A kitchen table.
- **Clutter:** An opened envelope, a supermarket flyer, a takeaway menu, keys and a half-drunk mug.
- **Light:** Ordinary late-afternoon window light, and the statement is tilted slightly.
- **Hand:** None.

**5. Words on the image**
None beyond the statement's own soft print. Only the word "Statement" is legible.

**6. Line under the image**
The second month's statement

**7. Step for the copy**
The opening must name the subscription-trap fear, then give the step: check the line under the button before paying. That means $29.99 for the first box with the text sign-up discount, $49.99 every 4 weeks after that, and the 30-day money-back guarantee on the first order only.

**8. Flags**
- **The price does rise.** The copy must never suggest the renewal won't jump or that the guarantee covers later boxes. The picture shows only the worry, never a "no surprise" fix.
- **"Cancel anytime" is not on file** for the adult plan box. Cancelling is the loudest public complaint. Confirm the exact live wording before running, and promise nothing beyond it.
- **Inferred wording.** "Renews at $49.99 each 4 weeks" comes from the price table and the Kids page format ("Renews at $74.98 each 4 weeks"). It was not captured verbatim on the adult page, so verify it.
- **Conflicting offers.** The site shows 52%, 55%, 49% at $45.33, and the ads show 61%. The landing page must show the same $29.99 and $49.99 as the story. A mismatch would confirm the fear.
- **Don't reuse the birthday price claim.** "Not just for a week but indefinitely" must not be repeated as a price promise.
- **Inferred object.** I chose a paper statement as the first thing buyers see. Many buyers would see a banking app alert instead.
- **Unverified review.** Review 17 itself is not in the file. Only the matching doubt is.

**9. Image prompt**
Square 1:1 photo taken casually on a phone, unretouched. A kitchen table in ordinary late-afternoon window light. A loose pile of everyday post: an opened envelope, a supermarket flyer, a takeaway menu, a set of keys, a half-drunk mug of tea, a few crumbs. Slightly apart from the pile, at a gentle tilt, lies one unfolded card statement on plain white paper. Its printed lines and figures are soft and unreadable; only the single word "Statement" at the top is legible. Muted neutral colours. No logos, no bank or company names, no readable prices, no red text, no green or yellow packaging, no people, no product. Calm and quiet, nothing happening yet.

**10. Score: 100/100**
All six checks pass, so there are no misses.

**To finish it:**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image, Gemini uses Nano Banana. Free plans have tight daily limits, and Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** Save an `OPENAI_API_KEY` (from platform.openai.com/api-keys) or a `GEMINI_API_KEY` (from aistudio.google.com/apikey). The prompt can then be sent to that image API and the file saved. OpenAI or Google bills each picture.
```
