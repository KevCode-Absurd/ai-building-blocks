# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

A strong, well-ranked plan: 50 real gaps from the files, the 99-vs-35 testing mismatch spotted, site facts kept to yes/no checks, rights asked with all four fields, and nothing invented. It fails only on a small gap-tagging lapse in the written form (a few rows lack a gap ID or register entry), and Q7 leads the founder on who shouldn't buy.

## Fix

In step 3, add: 'Every written-form row carries its gap ID and target file; if an item has no gap in the register, add the gap first or drop the row.'

## Judge list

- Met: Nothing your brand file already confirms is asked as a fresh question.
  Site facts sit under 'Yes-or-no checks... Confirm them; don't discuss them'; call questions target disputed, pending or unknown items only.
- Not met: Every question says which gap it fills and which file the answer goes to.
  Form rows 'Deepest discount ever run, and when', 'Offers you will never run', 'VIP program terms; cashback app name', 'What "4 free gifts" currently includes' carry no gap ID.
- Met: Every filed answer carries founder, date and question number, in the file the skill's table names.
  No answers yet; run states 'Does not apply yet: no answers filed' and the gap register pre-maps each target file.
- Met: Beliefs are filed as story, not as claims.
  Nothing filed yet; interviewer rule: 'note whether the answer is a document, a belief or a story'.
- Met: Rights are recorded with who, where, how long and paid or unpaid. No limits on file means no use.
  Form D: 'Fill one row per person or asset: who / where / how long / paid or unpaid'; Q4 'For every yes, record who, where, how long, and paid or unpaid'.

## What went in

```text
Brand file: the Sprout folder built from the website, reviews and
ads (00-start-here.md to log.md).

Gaps it already shows:
- Star rating stated four ways [disputed]
- "21" and "over 20" vitamins and minerals [disputed]
- One ad says "probiotics"; the ingredient list has none
- Grams of sugar per pack [unknown: founder]

The call is next Tuesday. Make the call plan. No answers yet.

[attached: sprout/brand.md, sprout/reviews.md]
```

## What came out

```text
# Sprout founder call plan

Call: next Tuesday. Answers: none yet.

Built from `sprout/brand.md` and `sprout/reviews.md`. In those files, the gaps appear as "not captured", "not clear", "risky or unsupported" and "hypotheses". There are no formal tags. Each gap below is mapped to the eight-file folder by the filing table.

## Gap register (50 gaps collected)

| ID | Gap | Type | Target file | Route |
|---|---|---|---|---|
| G1 | Star rating given four ways: 4.8/100k, 4.75/109,639, 4.74/118,002, and 4.0/2,411 on a review site | disputed | `proof-and-claims.md`: claims | Form |
| G2 | "21" vs "20+" / "over 20" vitamins and minerals | disputed | `proof-and-claims.md`: claims | Form |
| G3 | An ad says "probiotics", but the ingredient list has none | disputed | `proof-and-claims.md`: claims | Call Q2 + form |
| G4 | Testing says "35 substances tested", but 70+4+16+9 = 99 | disputed (spotted) | `proof-and-claims.md`: claims | Form |
| G5 | "Each gummy delivers 100%", but the dose is per pack | disputed | `proof-and-claims.md`: claims | Form |
| G6 | 2025 study: report on file? Which formula? Who ran and funded it? | pending | `proof-and-claims.md`: claims | Call Q1 + docs |
| G7 | Survey of 3,000+: date, method, questions | pending | `proof-and-claims.md`: claims | Form + docs |
| G8 | "Clinically backed… energy, immunity", "[Sprout] works" | pending | `proof-and-claims.md`: claims | Call Q1 |
| G9 | "Backed by 35,000+ studies" | pending | `proof-and-claims.md`: claims | Call Q1 |
| G10 | "Breaking down almost immediately… bioavailability" | pending | `proof-and-claims.md`: claims | Call Q1 |
| G11 | "Fix the Hot Girl Tummy" | pending | `proof-and-claims.md`: claims | Call Q2 |
| G12 | Weight loss support, "support muscle" | pending | `proof-and-claims.md`: claims | Call Q2 |
| G13 | "Nutrition for Healthy Hair" | pending | `proof-and-claims.md`: claims | Call Q2 |
| G14 | "Revive whole body vitality" | pending | `proof-and-claims.md`: claims | Call Q1 |
| G15 | 30/60/90-day timeline (skin, metabolism, hormones) | pending | `proof-and-claims.md`: claims | Call Q1 |
| G16 | "Fill the gaps… on a GLP-1" | pending | `proof-and-claims.md`: claims | Call Q2 |
| G17 | Kids: "bright minds", "supports brain health" | pending | `proof-and-claims.md`: claims | Call Q3 |
| G18 | "Most fiber-focused supplements contain only 5g" | pending | `proof-and-claims.md`: claims | Call Q10 |
| G19 | "Less than 1% use our Money-Back Guarantee" | pending | `proof-and-claims.md`: claims | Call Q6 + form |
| G20 | "$1.26" vs "$3.60" per serving | pending | `proof-and-claims.md`: claims | Call Q10 + form |
| G21 | FDA line is in the site footer but not in ads; required warnings | unknown | `proof-and-claims.md`: claims | Form |
| G22 | Banned lines, rejected ads, legal or platform notes | unknown | `proof-and-claims.md`: claims | Call Q2 |
| G23 | Founder on camera, voice, AI version | unknown | `proof-and-claims.md`: rights | Call Q4 |
| G24 | Other people, creators, AI presenters, labelling | unknown | `proof-and-claims.md`: rights | Call Q4 |
| G25 | Reviews word for word: with or without names, which sources | unknown | `proof-and-claims.md`: rights | Call Q4 |
| G26 | Photos, video, fonts (the display font especially), music cleared for paid ads | unknown | `proof-and-claims.md`: rights | Form |
| G27 | Tie-in and partner terms: may the flavour be named? Time limits? | unknown | `proof-and-claims.md`: rights | Call Q4 + docs |
| G28 | Grams of sugar per pack | unknown: founder | `offers.md`: each product | Form |
| G29 | Live offer: which of 49/52/55/58/61%, $20 off, "up to $80" is real; deepest ever | disputed | `offers.md`: price summary | Call Q5 |
| G30 | Kids renews at $74.98, above the $53.32 one-time price | disputed | `offers.md`: price summary | Call Q5 |
| G31 | 84-pack subscription prices, Sugar-Free first-order price, Kids limited renewal | unknown | `offers.md`: price summary | Form |
| G32 | "$29.99 indefinitely" vs "SMS discount, new customers only" | disputed | `offers.md`: policies | Call Q5 |
| G33 | Guarantee in full: who pays, how claimed, how often | unknown | `offers.md`: policies | Call Q6 + form |
| G34 | Cancel and pause steps (loudest public complaint) | unknown | `offers.md`: policies | Call Q6 + form |
| G35 | Product in hand: adult gummy count, look, use steps, what pictures get wrong, 5 photos | unknown | `offers.md`: each product | Call Q7 + docs |
| G36 | Which "adaptogens", and how much | unknown | `offers.md`: Original | Form |
| G37 | Who it's wrong for (Sugar-Free and stomachs, taste takes days) | inferred | `offers.md`: each product | Call Q7 |
| G38 | Electrolyte variety pack facts | unknown | `offers.md`: electrolytes | Form |
| G39 | Cost per unit and per order shipped | unknown | `offers.md` | Form |
| G40 | Retailer logos, NSF/GMP marks, trademark spellings | unknown | `offers.md` + `proof-and-claims.md` | Form + docs |
| G41 | First product a new buyer should get | inferred | `offers.md`: price summary | Call Q5 |
| G42 | Buyer segments and shares (from review mix only) | inferred | `customers.md`: founder's view | Call Q8 |
| G43 | Words loved and banned, how far humour goes ("f*&$%#g work", poop) | unknown | `voice-and-look.md` | Call Q9 |
| G44 | Founder-written samples; video pace, phone or polished | unknown | `voice-and-look.md` | Call Q9 + docs |
| G45 | What a sale is lost to; may we name rivals or compare prices | unknown | `market.md` | Call Q10 |
| G46 | "What works" is guessed from copy counts; no numbers | inferred | `log.md`: Results | Call Q11 + docs |
| G47 | Next 90 days: flavour dates, stock, shipping limits | unknown | `log.md`: Recent changes | Form |
| G48 | 90-day goal, who approves ads and how fast | unknown | `log.md`: Decisions | Call Q11 + form |
| G49 | House rules: topics never touched, same-day pull, blended reviewers, notes-app posts | unknown | `00-start-here.md`: house rules | Call Q2 + form |
| G50 | Origin story, positioning, what's private | unknown | `business.md`: story, positioning | Call Q12 (if time) |

## Yes-or-no checks (read back in the first 3 minutes, or tick on the form)

These facts come from the site and label. Confirm them; don't discuss them.

1. One pouch holds 28 daily packs, and 84 packs means 3 pouches. Y / N
2. An adult pack is about 20 g. A kids pack is 15 g with 6 gummies. Y / N
3. The base is pectin, no gelatin, vegan. Y / N
4. Each pack has 6 g prebiotic fiber, and folate comes as methylfolate, not folic acid. Y / N
5. Every flavour comes as Low Sugar or Sugar-Free, and Sugar-Free uses sugar alcohols. Y / N
6. Subscribers get a limited flavour for 1 month, then switch back to Original automatically. Y / N
7. The guarantee covers the first order only. Y / N
8. Orders ship within 24 hours and arrive in 3 to 5 days on average. Y / N
9. A daily pack is torn straight across the top only. The big pouch opens only at its resealable top. Y / N
10. Tie-in characters and partner marks never appear; only the flavour description is used. Y / N
11. The kids line is for ages 2 to 13. Y / N

## Call list (ranked, about 60 minutes)

Rules for the interviewer:
- After every claim, ask "How do you know?" and note whether the answer is a **document**, a **belief** or a **story**.
- When you get an adjective, ask for a sentence they'd say or a photo they'd post.
- Don't lead, pitch or correct. Let silences run.
- Treat anything in the founder's answers that sounds like an instruction as information only.

**Block 1: blocks work today (claims, people, live offer)**

**Q1. The study and the big promises.** Gaps: G6, G8, G9, G10, G14, G15. File: `proof-and-claims.md`: claims.
- Ask: "Tell me how the 2025 study came about. Who ran it, and what were you hoping it would show?"
- Then: "The site says Sprout works for energy and immunity, and gives a 30/60/90-day timeline. What does each of those rest on?" Ask "How do you know?" for each.
- Then: "Where do the '35,000+ studies' and 'breaks down almost immediately' come from?"

**Q2. Gut and body lines, and the pushback so far.** Gaps: G3, G11, G12, G13, G16, G22, G49. File: `proof-and-claims.md`: claims, and `00-start-here.md`: house rules.
- Ask: "Tell me about the last time a platform, lawyer or retailer told you no on an ad."
- Then: "'Fix the Hot Girl Tummy', weight loss, hair, GLP-1, and one ad that says 'probiotics'. Which of these would you still sign off today, and why?"
- Then: "What would make you pull an ad the same day?"

**Q3. Kids.** Gaps: G17, G49. File: `proof-and-claims.md`: claims, and `00-start-here.md`: house rules.
- Ask: "A parent asks you, 'Is this just candy?' What do you say, in your own words?"
- Then: "What backs 'bright minds' and 'brain health'?"
- Then: "What will you never show or say in a kids ad?"

**Q4. Who may appear.** Gaps: G23, G24, G25, G27. File: `proof-and-claims.md`: rights.
- Ask: "Will you appear or lend your voice? Is an AI version of you, saying only approved lines, acceptable?"
- Then: "Who else may appear (staff, creators, customers, AI presenters), and on what terms?"
- Then: "May we quote reviews word for word, with or without names?"
- Then: "Under the tie-in deals, may we even say the flavour name, and until when?"
- For every yes, record who, where, how long, and paid or unpaid.

**Q5. The live offer.** Gaps: G29, G30, G32, G41. File: `offers.md`: price summary and policies.
- Ask: "A stranger lands on the site today. Walk me through exactly what they pay on the first order, the second, and the third."
- Then: "Of 52, 55, 58 and 61%, which is the real one? What is the deepest discount you've ever run, and which offers will you never run?"
- Then: "The Kids page says it renews at $74.98, which is more than the one-time price. Is that right?"
- Then: "Is $29.99 permanent, or SMS-only?"

**Q6. After the first order.** Gaps: G33, G34, G19. File: `offers.md`: policies, and `proof-and-claims.md`: claims.
- Ask: "Tell me about the last customer who tried to cancel. What happened, step by step?"
- Then: "Give me the guarantee in full: who pays return shipping, how it's claimed, and where the '<1%' comes from."

**Q7. Product in hand (online-store add-on).** Gaps: G35, G37. File: `offers.md`: each product, and `00-start-here.md` for any step that must never be shown wrong.
- Ask the founder to hold an adult pack up to the camera, tear it, and pour it into a palm, talking through each step. Cover:
  - where it tears and what each hand does
  - how many gummies come out
  - shape, colour, shine or matt, soft or firm, size against a fingertip
  - the sound of the tear and the pour
- Then do the same with a Kids pack and the 28-pack pouch: the biggest words on the front, read top to bottom.
- Then: "How do drawings or AI images usually get this wrong?"
- Then: "Who shouldn't buy it? Sugar-Free and sensitive stomachs, and the taste that takes a few days."
- Then: "When does a buyer notice a change, and could a camera ever see it?"
- Record this as a reference only, not ad footage, unless they say it may be used. Keep looks in the founder's exact words.

**Block 2: shapes every ad (buyer, voice, market)**

**Q8. The buyer.** Gap: G42. File: `customers.md`, founder's view.
- Ask: "Tell me about one real best customer, no name."
- Then: "Tell me about a buyer who surprised you."
- Then: "Who do you want more of, and fewer of?"
- Then: "What do people say on support calls but never write in reviews?"
- If the founder's picture differs from the reviews (quitter 40%, gut 25%, parent 25%, price doubter), note both.

**Q9. Voice and humour.** Gaps: G43, G44. File: `voice-and-look.md`.
- Ask: "Read me a line you wrote yourself that sounds most like Sprout."
- Then: "Which words do you love, and which are banned?"
- Then: "How far can humour go? Is the 'f*&$%#g work' line in or out? Poop jokes in kids ads?"
- Then: "Name three ads you wish were yours, and three you never want to resemble."
- Then: "For video: fast or slow, phone or polished, close on the product or on the person?"

**Q10. Market.** Gaps: G45, G18, G20. File: `market.md` and `proof-and-claims.md`.
- Ask: "When you lose a sale, what is it lost to, doing nothing included?"
- Then: "May we name a rival or compare prices? The $1.26 vs $3.60 and 'only 5g fiber' lines: what are they based on, and how old are they?"
- Then: "Describe the powder-and-shaker habit the way you'd say it when annoyed."

**Block 3: history and close**

**Q11. Best ads and the 90-day number.** Gaps: G46, G48. File: `log.md`: Results (graded "reported" unless a number comes with it) and Decisions.
- Ask: "What are your three best ads, why do you think they worked, and what number do you judge them by?" Include the "too expensive → 61% off" ad and the "One Step I Never Skip" ad.
- Then: "What must be true in 90 days for this to be worth it, as one number?"
- Then: "Who approves ads, and how fast?"
- Then: "What haven't we asked?"

**Q12. Only if time remains: the story.** Gap: G50. File: `business.md`: story and positioning.
- Ask: "The week you decided to start: what was going on?"
- Then: "What did you believe about supplements that others got wrong?"
- Then: "Which parts of the story are private?"
- If Q12 isn't reached, mark it `[unknown: founder]` and list it in the readback.

## Written form (send the Sunday before the call; due back before the call)

**A. Label and formula** → `offers.md`, `proof-and-claims.md`

| Item | Answer |
|---|---|
| Grams of sugar per pack: Adult Low Sugar / Adult Sugar-Free / Kids / each current limited flavour (G28) | |
| Sugar alcohols used in Sugar-Free, and grams per pack | |
| Correct vitamin and mineral count, so every page says the same thing: 21 or another number (G2) | |
| Does any product contain probiotics? Y / N. If not, which ad used the word, and is it still live? (G3) | |
| Which "adaptogens", and how much per pack (G36) | |
| Gummies per adult pack (G35) | |
| Daily value is per pack, not per gummy. Confirm, and say how many gummies make up a pack (G5) | |
| Testing: "35 substances" vs 70 pesticides + 4 metals + 16 contaminants + 9 microbial = 99. Which is right, and what does the lab certificate say? (G4) | |
| Electrolyte variety pack: contents, serving, price per serving, sugar (G38) | |

**B. Prices and offers** → `offers.md`: price summary and policies

| Item | Answer |
|---|---|
| Subscription price, 84 packs: Low Sugar / Sugar-Free / Kids (G31) | |
| First-order price: Adult Sugar-Free 28 packs (G31) | |
| Kids 28 packs: correct renewal price (the page shows $74.98) (G30) | |
| Kids limited flavour renewal price (G31) | |
| Every offer live today: wording, start date, end date, conditions (G29) | |
| Deepest discount ever run, and when | |
| Offers you will never run | |
| VIP program terms; cashback app name and terms; HSA/FSA service name | |
| What "4 free gifts" currently includes | |
| Guarantee: length, who pays return shipping, how it's claimed, number of claims last 12 months and total orders (G33, G19) | |
| Cancel and pause: exact steps, channels, time to process (G34) | |
| Cost to make one 28-pack, and cost to ship one order (optional) (G39) | |

**C. Proof and numbers** → `proof-and-claims.md`: claims

| Item | Answer |
|---|---|
| Star rating to use in ads: number, review count, platform, date captured (G1) | |
| Survey: date, number of people asked and answered, how chosen, exact questions (G7) | |
| Source and date for "$1.26 vs $3.60" and "most fiber supplements contain only 5g" (G18, G20) | |
| Required warnings and disclaimers, by country and platform; why ads carry no FDA line (G21) | |
| Exact spelling of every trademark, and which certification marks may appear (NSF, GMP, FDA-registered) (G40) | |

**D. Rights** → `proof-and-claims.md`: rights. Fill one row per person or asset: who / where / how long / paid or unpaid.

| Item | Who | Where | How long | Paid? |
|---|---|---|---|---|
| Founder face and voice; AI version (G23) | | | | |
| Creators, staff, customers in current ads (G24) | | | | |
| Named reviewer quotes (G25) | | | | |
| Product and lifestyle photos, video (G26) | | | | |
| Fonts: Work Sans, DM Mono, the display font (G26) | | | | |
| Music used in ads (G26) | | | | |
| Tie-in flavour names (cartoon-movie, ice-pop, soda) (G27) | | | | |

**E. Next 90 days** → `log.md`: Recent changes

| Item | Answer |
|---|---|
| Next limited flavours: names as they may be written, launch and end dates (G47) | |
| Stock limits, last-order dates, shipping cut-offs (G47) | |
| Retailer launches or promotions coming up (G47) | |

**F. House rules and approvals** → `00-start-here.md`, `log.md`: Decisions

| Item | Answer |
|---|---|
| Topics the brand never touches (G49) | |
| Story told by a blend of real reviewers: allowed? Labelled? (G49) | |
| Post styled as a text or notes app: allowed? (G49) | |
| Who approves ads, and the usual turnaround (G48) | |

## Documents and items to bring (list sent with the form)

1. **The products on the desk, in their shipping box:** Adult Original Low Sugar, Adult Sugar-Free, Kids, the current limited flavour, and an 84-pack.
2. **Five plain photos per product you'll advertise:** pack front as sold, product out of the pack, gummies in a hand for size, a pack being torn and poured, and a close view of the gummy surface.
   - **Missing now: all photos for all products.** Until these and Q7 are on file, any product image or clip is labelled "product not confirmed".
3. **Supplement Facts panel and full ingredient list** for each product and variant.
4. **The full 2025 study report:** protocol, which formula was used, who ran it, who funded it.
5. **Lab certificates** from the Sept 2026 testing.
6. **Survey questionnaire and raw results.**
7. **Review platform exports or screenshots** with counts and dates.
8. **Any platform rejections, legal notes or regulator letters** about claims.
9. **Tie-in and partner agreements** (the usage clauses only).
10. **Model, creator and photo releases;** licences for the display font and for music.
11. **NSF and GMP certificates.**
12. **Three things the founder wrote:** an email, a post, a voice note.
13. **Ad results export** for the top and bottom ads, with the metric the founder uses.

## Score

**Checks score: 1 / 1 × 100 = 100**

| Check | Status now |
|---|---|
| No `[confirmed]` fact was asked as a fresh question | Passed. The source files carry no `[confirmed]` tags; site and label facts appear only as yes-or-no checks. |
| Every filed answer carries the founder tag, date and question number | Does not apply yet: no answers filed. |
| No belief became a claim | Does not apply yet: nothing filed. |
| Every right on file names who, where, how long and paid or unpaid | Does not apply yet: no rights filed. The form's section D asks for all four. |
| Where founder and reviews disagree about the buyer, both are kept | Does not apply yet: comes after Q8. |
| Answers about looks are kept in the founder's words | Does not apply yet: comes after Q7. |

**Gaps closed score: not scored until after the call** (0 filed / 50 collected so far).
```
