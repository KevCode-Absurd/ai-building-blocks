---
name: landing-page-copy
description: Writes or rewrites a landing, sales, service or product page for one action. Builds a message hierarchy from customer research, picks the page structure for the reader's awareness stage and the market's sophistication, writes headline and lead options with the reason each fits, the offer and risk reversal, objection answers with proof beside each claim, and the calls to action. Use when a client needs a new page, or a page gets traffic but too few sign-ups, bookings or sales.
---

# Landing page copy

A landing page has one job: get one kind of reader to take one action. This skill writes the page in the order the reader meets it, and labels every section with its job and its evidence, so the client can see why each line is there.

## When to use

- A new landing page for an ad campaign, launch, offer or service.
- A rewrite of a page that gets visits but not enough action.
- A product page or pricing page that needs to sell, not just describe.

Not for: pages whose main job is to rank in search (use a content brief), or brand manifestos with no action.

## What you need

**Access:** level 1 to read the page and the research. Level 2 to write the copy into a draft or staging page. Level 3 to publish it on the pages you named, within your limits, after the compliance pass in step 13. Prices, offers, guarantees and deadlines always need your confirmation first.

- **The live page and site** (the address), so the copy starts from the client's own words and facts.
- **The one action** (book, buy, start trial, request quote) and what happens after the click.
- **The reader:** who they are and what they were doing just before they land.
- **The traffic source** and what it promised (paste the ad or email).
- **Research:** a VoC bank from the voice-of-customer-mining skill, or at least 20 reviews or five customer conversations.
- **Product facts:** price, terms, guarantee, delivery, what is included, proof you are allowed to use (named reviews with permission, numbers you can show).
- **Constraints:** brand voice, legal or industry rules, design limits (for example, a fixed template).

If research is missing, say so and either run the voice-of-customer-mining skill first or label the draft "hypothesis copy" and list what would confirm it.

## Steps

1. **Capture the live page and site first.** Run `node tools/capture-brand-dna.mjs <site> <page>` (or `tools/brand-dna-snippet.js` in a browser, or ask for screenshots). Copy 5 to 10 lines of the client's own voice, every live fact (price, offer, guarantee, delivery, review count) with its date, and the section order of the current page. A rewrite is a patch to that page by default: keep what works and change what the research says to change.
2. **Pin the brief.** One sentence: "[Reader] who [situation] will [action] because [core promise], once we answer [top doubt]."
3. **Read the awareness stage and sophistication.** Use the research. Decide where the page must start (see the table below) and whether claims are worn out in this market.
4. **Build the message hierarchy** before any copy: core promise; three supporting reasons in the order the reader cares about them; top three to five objections, each with its answer and the proof needed; the offer and risk reversal; the action.
5. **Choose the structure.** Start from the current page's order (or the client's closest page), then adjust for where the reader arrives from and the stage below:

   | Reader's stage | Page opens with | Then |
   |---|---|---|
   | Most aware | Offer, price, action | Terms, guarantee, what happens next |
   | Product aware | Main difference, with proof | Comparison, reviews, objections, offer |
   | Solution aware | The result and why this way works | Mechanism, how it works, proof, objections, offer |
   | Problem aware | The problem in their words | What it costs them, the type of fix, your fix, proof, offer |
   | Unaware | Story, news or identity | Usually content, not a sales page; flag this to the client |

6. **Write headline options.** Write at least eight, from different formulas, then pick three to put forward:
   - *Direct promise:* the outcome in plain words. Fits most and product-aware readers.
   - *Problem in their words:* a VoC line naming the pain. Fits problem-aware readers.
   - *How to:* "How to [outcome] without [main doubt]." Fits solution-aware readers.
   - *Specific result:* a real, provable number or detail. Fits sceptical, sophisticated markets.
   - *Mechanism:* names what is different about how it works. Fits markets tired of claims.
   - *Who it is for:* calls out the reader's identity. Fits crowded markets and the last sophistication stage.
   - *Offer:* the deal itself. Fits returning or ready-to-buy traffic.
   - *Question:* only if the reader would answer "yes" instantly; otherwise it stalls.
   Reject any headline a competitor could use unchanged.
7. **Write the first screen:** headline, a subhead that adds the how or the who, one piece of proof (rating, named result, client logo with permission), the primary button, and microcopy under it that answers the last doubt ("No payment until your first visit", "Takes 2 minutes").
8. **Write the body section by section.** Each section gets a heading that makes sense when skimmed alone. Put proof right beside the claim it supports. Use the customer's words. Keep paragraphs to one to three sentences.
9. **Write the offer and risk reversal.** What they get, what it costs, what happens if it does not work for them. State the guarantee terms in one plain sentence. Never promise what the client will not honour.
10. **Answer the objections.** Put the biggest doubt next to the main button. Answer the rest in an FAQ written as the customer would ask it.
11. **Close.** Restate the promise in one line, repeat the button, and say exactly what happens after the click.
12. **Edit.** Do the five-second test (could a stranger say what this is and what to do?). Cut lines with no job. Swap jargon for customer words. Aim for short sentences; simpler pages tended to convert better in Unbounce's 2024 data, though that is a correlation, not a rule. Read it on a phone-sized screen.
13. **Compliance pass.** Every claim provable. Reviews real, permissioned, typical or qualified, with connections disclosed. Any deadline or stock claim true and honoured. Prices complete, with no fees added later.

## Checks

- One primary action, one button label, repeated.
- First screen passes the five-second test on mobile.
- The headline matches the traffic source's promise.
- Every claim has proof beside it or is cut.
- Top doubt is answered next to the button.
- No fake urgency, no invented reviews, no hidden costs.
- Every section has a stated job; nothing is there "because pages have one".

## Output format

1. **Brief** (one sentence) and **assumptions**.
2. **Awareness and sophistication read**, one line each, with evidence.
3. **Message hierarchy** (bullets).
4. **Headline shortlist:** three options, each with its formula and why it fits.
5. **Page copy** as a table or ordered sections: section, job, copy, evidence IDs.
6. **Notes for design:** what must be visible on the first screen on mobile.
7. **What to test first**, with the hypothesis.

## Example of good output (short)

*Illustrative structure, not a real business: a two-person bookkeeping service for self-employed plumbers and electricians; the research IDs stand for the client's own VoC bank. Copy the shape, never the content: every fact comes from the client's own context.*

**Brief:** Tradespeople who do their books late at night will book a free 20-minute call because we take receipts by photo and send a monthly summary, once we answer "I'll lose control of my numbers."

**Read:** problem aware (they hate the paperwork, few know a trade-only service exists). Rivals all say "stress-free bookkeeping", so lead with who it is for and how it works, not a bigger claim.

**First screen**

- Headline (who it is for): **Bookkeeping for plumbers and electricians who'd rather be on the tools**
- Subhead (how it works): Snap your receipts on your phone. We do the rest and send you one clear summary each month.
- Proof: one real, permissioned review with name and trade. For example, a review in the client's VoC bank (R9) that reads like "I got my Sunday evenings back."
- Button: **Book my free 20-minute call**
- Microcopy: No contract. If it is not for you, you have lost 20 minutes, not money.

**Section: answers "I'll lose control of my numbers" (VoC: S4, R9, C2)**

Heading: **You see every number. You just don't type them.**
Each month you get a one-page summary: money in, money out, what to set aside for tax. Every receipt we log links back to your photo, so you can check any line in seconds.

**Headline shortlist**

1. Who it is for (above): fits a crowded market where "stress-free" is worn out.
2. Problem in their words: "Still doing your books at 10pm after a full day on site?" Fits problem-aware readers from search ads.
3. How to: "How to keep your books up to date without giving up your evenings." Fits readers comparing apps and bookkeepers.

**Test first:** headline 1 against headline 2 on paid search traffic, because the ad copy can be matched to each and search gives the most volume.
