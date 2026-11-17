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

**Access:** level 1 to read the page and the research. Level 2 to write the copy into a draft or staging page. Level 3 to publish it on the pages you named, within your limits, after the compliance pass in step 13. Reuse current verified prices, offers, guarantees and deadlines within the existing authorization. Ask only when facts are missing, conflicting, changed, or the requested action exceeds that scope.

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

## Ad-to-page contract and implementation

Before choosing copy, capture the actual query/customer intent, incoming ad or email promise, destination hero/offer, SKU or variant availability, and CTA/post-click outcome. Build a short message-chain table with evidence IDs and mark each link matched, drift or broken. Verify prices, offer conditions and delivery promises against current shared brand facts. A persuasive hero cannot fix an unavailable advertised product.

Choose the experiment to fit the question: ad-only with page fixed, page-only with ad fixed, or a paired ad-and-page change to test the entire chain. A paired change cannot isolate which component caused an outcome. Use a factorial design only when tracking and sample planning support its interaction comparisons; otherwise test a coherent chain and state the limit. Predeclare the primary business outcome, guardrail, eligible traffic, allocation, baseline, maturity rule and stopping rule with the CRO specialist.

If the user asks to build a landing page, execute through the available site/repository tools: deliver the implemented page and editable source, not only a copy table. Use approved product assets and observed brand components, implement real variant/CTA states or explicitly labeled local test behavior, and inspect mobile and desktop renders. Check navigation, offer consistency, form validation, error states and destination actions. A local preview or simulated checkout is not a deployed page or a verified store transaction. Use existing publication authority when available; report the actual deployed URL and verified state, or the precise unfinished integration.

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
7. **Message-chain and experiment plan:** exact source promise, destination mapping, changed/fixed variables, hypothesis, primary outcome, guardrail and attribution limits.
8. **When building:** working page/preview URL, editable files, mobile/desktop inspection evidence, tested CTA states and any remaining integration gaps.

## Example of good output (short)

*Illustrative ecommerce brief, not Gehna or another real brand. Evidence IDs below are placeholders; do not publish these claims without the actual product and policy sources.*

**Brief:** A buyer shopping for an everyday silver pendant will choose a verified in-stock variant because the page shows scale, material and complete delivered price, once we answer the concern about size and returns.

**Message chain:** search intent "small silver pendant" → ad "See the pendant at actual wearing scale" → hero with approved on-model photo and dimension diagram → chosen pendant variant → add to cart. If no on-model photograph exists, mark that promise needs production and use verified dimensions instead; do not synthesize a product size as evidence.

| Section | Copy direction | Required evidence |
|---|---|---|
| Hero | "An everyday pendant, shown at real wearing scale" only if the actual scaled photo exists | Approved product asset and dimension source |
| Product selection | Exact verified material, chain inclusion, variant availability and price | Current product/variant record |
| Near CTA | Delivery estimate for the buyer's destination and concise return conditions | Current shipping and returns policy; no invented promise |
| Objection answer | Dimension diagram and real review addressing size, if permissioned | Product specification and review ID |
| CTA | "Add selected pendant to cart"; disabled with an explicit reason for unavailable variants | Verified cart behavior or clearly labeled local simulation |

**Test first:** hold ad and offer fixed while testing the size-proof placement. Primary outcome is purchase rate among eligible product-page visitors; cart additions are a diagnostic and return rate is a later guardrail. If the ad promise changes too, measure the paired chain and do not attribute the result to page copy alone.

## Method attribution

Adapted measurement, evidence and deliverable procedures from NotFair: [Message-chain testing](https://github.com/nowork-studio/notfair-plugin/blob/deed0436d0c68cbc20a78523fffc67edd12aa25c/google-ads/landing/references/message-chain-testing.md). Pinned source reviewed 2026-11-17. Platform claims must be checked against current official documentation and observed account settings; source heuristics are not universal thresholds.

<details>
<summary>NotFair MIT notice</summary>

MIT License

Copyright (c) 2026 Toprank Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

</details>
