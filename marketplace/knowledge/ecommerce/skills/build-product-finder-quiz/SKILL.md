---
name: build-product-finder-quiz
description: "Designs a short product finder quiz that matches each shopper to the right product: the questions and answer options in buyer words, the scoring logic that maps answers to products, a results page for each outcome with copy and proof, the email or WhatsApp capture with consent wording, and the tags that feed email flows and avatar research. Built from what buyers ask before choosing, with completion and drop-off targets per question. Use when a store has several similar products and shoppers ask which one is right, when choice paralysis shows in support chats, or when the store wants a list-building entry point for cold traffic."
---

# Product finder quiz

**You get:** a quiz spec ready to build in a quiz app or theme section: 4 to 8 questions with answer options, a scoring table that maps every answer path to one product or bundle, one results page per outcome (headline, why this fits, proof, offer, button), the capture step with consent text, the tags for email flows, and the targets to judge it by.

## When to use

- The store sells 4 or more products that solve the same need in different ways (skin types, strengths, sizes, roasts, recipients).
- Chats and tickets keep asking "which one should I get?".
- Shoppers browse the collection but leave without picking.
- The store wants an entry point for cold ad traffic that also collects first-party data.

## Not for

- A long persuasion quiz for one product sold to cold traffic (advertorial-style funnel): `advertorial-story-page` sets that page logic.
- The welcome flow that follows the quiz: `email-sms-flow-plan`.
- Pop-up and sign-up offers in general: `grow-email-and-sms-list-with-popups`.
- Testing the quiz against the collection page: `design-store-ab-test`.

## What you need

Required (read access, level 1):

1. **Product list with the facts that decide fit**: for each product, who it is for, who it is not for, key attributes, price, gross profit per order and stock.
2. **Buyer questions**: support tickets and chats that ask which product to choose, and reviews that mention choosing wrong (returns and exchanges by reason if the store tracks them).
3. **Return or exchange export** by product and reason, if available.
4. **Email or SMS platform** in use (Klaviyo, Shopify Email, Omnisend or other) and the current welcome offer.

Optional: post-purchase survey answers, Shopify search terms, a past quiz's answer export.

If return reasons are missing, use reviews that say "wrong one", "too strong", "too small". Building the quiz in an app or theme needs draft access (level 2); connecting it to the email platform and publishing need the client's yes. Any discount on the results page needs the client's approval of its cost.

## Before you start: the gates

1. **A real choice exists.** At least 3 products differ on a fact the buyer can answer about themselves. Fail: no quiz; improve the collection page with `build-collection-page-that-converts`.
2. **Every result earns money.** Each product or bundle a quiz path can recommend has positive gross profit per order and stock. Fail: remove it from the results or route that path to another product that fits.
3. **The matching is honest.** Every result follows from the answers. A quiz that recommends the highest-margin product to everyone is misleading. Fail: rebuild the scoring.
4. **Consent rules.** Email and SMS capture follow the platform's opt-in rules; US SMS needs express written consent under the store's SMS provider terms; India: WhatsApp messages need opt-in under WhatsApp Business policy, and personal data handling should follow the DPDP Act 2023 (ask a professional for the store's notice text).

## Steps

1. **Find the deciding facts.** From tickets, reviews and returns, list what makes a product right or wrong for someone (skin type, hair length, room size, age of child, taste). Keep the 3 to 5 facts that change the recommendation.
2. **Write the questions.** One question per deciding fact, in buyer words, with 2 to 5 answers each. Easiest and most personal first; the first three questions act as the hook and are the first thing to test [LPG-0032]. Every question must change the result, earn a small commitment or pre-answer a doubt [LPG-0056]. Add at most one or two research questions that do not change the result (past products tried, main goal) to learn about buyers [AVT-0022]. Product finders work best short: 4 to 8 questions (practitioner default, test it); long 15 to 25 question funnels belong to single-product persuasion quizzes [LPG-0031].
3. **Vary the input and add one helpful screen.** Mix tap buttons, image choices and a slider. If the quiz runs past 5 questions, add a short screen that explains why the answer matters, every 3 to 5 questions, to prevent fatigue [LPG-0019].
4. **Build the scoring table.** List every answer path and the product or bundle it leads to. Use simple points per product, with a tie rule (pick the bestseller among ties). Check that each product is reachable and that no product wins more than about 60% of paths unless it truly fits most buyers.
5. **Write each results page.** Headline using the shopper's own answers ("For oily skin that breaks out in summer: the Gel Cleanser"). Three lines on why it fits, tied to their answers. One review from a buyer like them. Price, any bundle, and one button to add to cart. A "not quite right?" link to the second-best match. A results summary that plays back the shopper's answers before the buy box helps them feel the match is theirs [LPG-0018]; do not invent progress timelines the product cannot promise.
6. **Place the capture.** Ask for email (and phone or WhatsApp where used) on a screen just before results, with a clear benefit ("Send me my match and a how-to guide"). Let shoppers skip and still see results (practitioner default, test it). Consent text under the field states what they will receive and how to stop. Store answers as profile properties, not just tags.
7. **Tag for flows.** Each answer becomes a property the welcome flow can use: product matched, main concern, past products tried. Hand the flow to `email-sms-flow-plan`.
8. **Set targets and read the data.** Target about 30% of starters reaching the results page; 25% is acceptable. Find any question where drop-off jumps well above the 1 to 2% typical per step and soften or cut it [CRO-0004]. Export answers about every 100 completions and read the share naming each concern and past product as angle fuel [AVT-0023]. Compare buyer cohorts by answer; one brand found a segment that converted far better [AVT-0020].
9. **Place the entry points.** Homepage hero or shop-by tile, collection top intro, product pages ("Not sure? Take the 60-second quiz"), and menu. Do not fire the quiz as a pop-up in the first seconds of a visit [LPG-0022].
10. **India and US notes.** India: offer Hindi or a regional language version if tickets show demand, show COD and pincode delivery on the results page, and send the result on WhatsApp only to shoppers who opted in. US: SMS capture needs the provider's compliant consent wording.

## Checks before you hand it over

- Each question changes the result or has a stated research purpose.
- Every product in the scoring table is reachable and passes the profit and stock gate.
- No answer path leads to a dead end or an out-of-stock product.
- Results headlines reuse the shopper's answers.
- Capture is skippable, with consent text naming the channel and how to stop.
- Targets set: starters to results about 30%, per-question drop-off watched.
- Quiz loads fast on a phone and works without the pop-up.

## Output

**Summary (one screen):** the deciding facts, the number of questions, the results set, expected completion target, capture method, and the first test to run (the first three questions).

**Question sheet:**

| # | Question | Input type | Answers | Changes result (yes or no) | Purpose |
|---|---|---|---|---|---|

**Scoring table:**

| Answer path or rule | Points to product A | B | C | Tie rule | Final result |
|---|---|---|---|---|---|

**Results pages (one per outcome):** headline, three fit lines, review (name, date, source), price and offer, button label, second-best link.

**Capture screen:** heading, benefit line, fields, consent text, skip label.

**Properties for flows:** property name, values, flow that uses it.

**Targets:** starters, results reached, add-to-cart from results, drop-off per question.

**Assumptions:** offer cost where not given, as the figure used in one line. **Left out:** each product excluded, with its reason in one line. The consent line under the email field carries one line beside it: "legal check before publishing".

## Common mistakes

- **Questions that change nothing.** Step 2 keeps only deciding facts plus one or two research questions.
- **A quiz that always picks the same product.** Gate 3 and step 4 check the spread.
- **Blocking results behind the email field.** Step 6 makes capture skippable.
- **Results pages that read like the product page.** Step 5 ties each line to the shopper's answers.
- **Never reading the answers.** Step 8 exports them every 100 completions.
- **Pop-up quizzes that interrupt.** Step 9 places entry points in the page.

## Sources

- LPG-0032: test the first three quiz questions first.
- LPG-0056: each question wins a commitment, seeds a belief or handles an objection.
- AVT-0022: non-scoring questions for first-party research.
- LPG-0031: long quiz funnels for single-product persuasion.
- LPG-0019: informational screens every 3 to 5 questions.
- LPG-0018: play the shopper's own answers back before the buy box.
- CRO-0004: about 30% of starters should reach results; find spiking drop-offs.
- AVT-0023: export answers every 100 completions for angles.
- AVT-0020: compare conversion by quiz answer cohort.
- LPG-0022: no pop-ups in the first seconds.

What makes this skill ours: questions come from the facts that cause wrong purchases and returns; every result path is gated on profit, stock and honest matching; capture never blocks the answer; and quiz answers flow into email properties and avatar research instead of sitting unused.
