---
name: write-product-page-copy
description: "Writes the full copy for one product page: headline and subhead, first-screen proof line, benefit blocks, proof picks, details and specs, FAQ, guarantee and the line under the buy button, built from counted buyer words and a claims sheet so every line is true. Places each block in the order a phone shopper needs it, names the review that answers each objection, and marks anything that needs a fact or a client sign-off. Use when a product page converts worse than its traffic deserves, when ads send people to a page that does not match them, or when a new product needs its first page."
---

# Product page copy that sells

**You get:** one product page written in full (headline, subhead, proof line, 3 to 5 benefit blocks, 3 to 5 chosen reviews, details table, fit block, 5 to 8 FAQs, guarantee and buy-box lines), in page order, with a source for every claim, a watch metric with a fallback variant, and no placeholders in the live copy, ready to paste into the Shopify product template after the client approves it.

## When to use

- Product page sessions are healthy but add-to-cart is low and the gallery and price are not the obvious cause.
- Ads promise one thing and the page opens on another.
- A new product goes live and has only the supplier's description.
- The page was machine-written and reads like every rival's page.

## Not for

- Finding why the page loses buyers in the first place: `storefront-conversion-audit` or `diagnose-low-add-to-cart-products`.
- The image gallery: `pdp-image-gallery-rebuild`.
- Descriptions for a whole catalogue at once: `write-product-descriptions-in-bulk`.
- A separate cold-traffic page for one ad angle: `reasons-to-buy-listicle-page` or `advertorial-story-page`.

## What you need

Required (read access, level 1):

1. **Live product URL** and the current copy.
2. **Reviews export** (CSV from the review app: rating, title, body, date, verified flag, product handle). At least 30 reviews for this product or its closest sibling; with fewer, add support tickets and survey answers.
3. **Claims sheet** from `product-claims-profile`: each claim sorted proven, supported, customer-reported or banned. If none exists, build the short version in step 2.
4. **Product facts**: materials or ingredients, sizes, what is in the box, care, warnings, country of origin, warranty, return window, dispatch time by region.
5. **Gross profit per order** for this product (from `build-sku-profit-sheet` or `store-meta-math`).

Optional: post-purchase survey answers ("what almost stopped you"), top 5 ads sending traffic here, Shopify product page conversion rate for 30 days.

Missing reviews: use tickets and chats; if those are thin, list the proof slots on the facts to confirm list and hand off to `build-review-collection-system`. Never fill them. Writing into the theme editor needs draft access (level 2) on a duplicate theme; publishing needs the client's yes.

## Before you start: the gates

1. **The product earns money.** Gross profit per order is known and positive after shipping, fees and returns [MEA-0037]. Fail: stop and send to `build-sku-profit-sheet`; a better page for a loss-making product loses more.
2. **The buyer can act.** Product is live, in stock in the main variants, and the price on the page matches checkout. Fail: fix that first and say so in your first line.
3. **Claims are cleared.** Every health, safety, environmental or "best" claim has evidence on the claims sheet. Fail: drop the claim or narrow it to what the proof says.
4. **Rules that apply.** US: the FTC review rule bans fake, insider-undisclosed or sentiment-bought reviews [MCR-6021]. India: show MRP inclusive of taxes, net quantity, country of origin and manufacturer or importer details on the listing, as Legal Metrology and E-Commerce Rules require [LPG-6600]; from 1 January 2027 a price cut must show the lowest price of the past 30 days [OFF-6603]; ask a professional where unsure.

## Steps

1. **Bank buyer words.** Read the reviews by hand and paste exact phrases into four columns: outcome wanted, what they tried before, what almost stopped them, how it felt once it worked. A tool summary strips the words you need [AVT-0007]. Count how often each theme appears. A theme needs 3 or more mentions to lead a block.
2. **Lock the claim list.** For each candidate claim write the exact wording allowed and its evidence. If the proof supports a narrower line ("most buyers in our reviews say", not "everyone"), use the narrower line.
3. **Pick one promise.** Choose the outcome with the most mentions that the product can prove. If ads test different buyer types or angles, each needs its own page or variant leading with that benefit [LPG-0064]. If a Meta headline has already won a test, use its words for the page headline and subhead [LPG-0067].
4. **Write the first screen for a phone.** In this order: product name, rating with count above or by the title, headline (the promise, under 10 words), subhead (who it is for and how it works, one line), price with any per-use cost, variant picker, buy button, and one line of risk reducers directly under the button [LPG-0034] [LPG-0038]. Show two different kinds of proof in the first screen, for example stars plus a short quote by the button [LPG-0036].
5. **Write 3 to 5 benefit blocks.** Each block: a heading stating the result in buyer words, two or three sentences on how the product does it, and one proof point (spec, claims-sheet test result or review line). A feature appears only as the reason a benefit is true.
6. **Choose proof by objection.** List the top 3 to 5 objections from step 1 (and from the "what almost stopped you" survey if it exists [CRO-0018]). For each, pick one real review from a different kind of buyer that answers it, and place it beside the buy box or the block it supports [LPG-0005] [LPG-0053]. Show reviewer first name, date and source, and the outlet's actual words under any press logo [LPG-0037]. Title the review section with the outcome, using only real counts [LPG-0049]. Under about 80 reviews, flag that collecting more may matter more than copy [LPG-0062].
7. **Write the details table and the fit block.** Name, variant, size or dimensions, materials or ingredients, what is in the box, care, warnings, origin, warranty. Limits that change who should buy go here and in the FAQ, never hidden. When returns or reviews show a wrong expectation (holds less, runs smaller): state the limit as a number ("fits up to a 15-inch laptop", not "roomy") in a bullet, the details table, the first FAQ and the under-button line; frame it as the reason for the promise; and add a "Not for you if" line that links the better-fit product in the same range, so the sale moves instead of coming back [LPG-0064].
8. **Write the FAQ.** 5 to 8 questions taken from tickets, chats and reviews, not invented. Answers of 1 to 3 sentences; shipping and returns answers quote the live policy. For a full FAQ project use `write-faq-from-tickets-and-reviews`.
9. **Write the guarantee.** State only the terms the store really honours: window, condition, who pays return shipping, refund time. A long guarantee on cheap consumables drew fewer claims in one practitioner's experience [OFF-0060], but offer only what the store will keep [OFF-0064]. When buyers object on price, move trust and risk lines above the price and directly under the button [LPG-0017].
10. **India and US notes.** India: add a pincode check line near the button ("Check delivery and COD for your pincode"), show COD availability or fee before checkout, mention UPI, and keep GST-inclusive prices. Offer a Hinglish or regional-language variant of the headline only if reviews are written that way. US: delivery lines must have a basis in real dispatch data [CXP-6160].
11. **Read it as a buyer.** Read the page on a phone and cut any sentence that answers no question the buyer has at that point. Run `machine-copy-scrubber` on the draft. Live copy never holds a placeholder ([X], TBC, "link here"): an unknown gets the safest true wording, and the facts to confirm list carries the finished swap-in line for when it is known.
12. **Hand over a watch metric and a fallback.** One metric to move, one guardrail not to hurt [CRO-0010]. For a returns rewrite: returns for that reason per 100 orders, by order date, as Shopify books returns on the refund date [MEA-0011]; guardrail conversion rate. Read after 60 days (practitioner default, test it). Write the fallback now: if conversion drops, which line moves (for example, the limit leaves the subhead but stays in details, FAQ and under-button line). Under 30 orders a month, read before and after, not as an A/B test [CRO-0011].

## Checks before you hand it over

- The headline promise appears in at least 3 reviews and on the claims sheet.
- Every number, rating, count and quote traces to a source file and date.
- Name, price, rating and buy button fit on a 390 px wide first screen.
- Each top objection has one named review answering it, placed near the decision.
- No fake urgency: stock or time limits appear only if they come from live inventory or a real end date.
- Guarantee and shipping lines match the live policy pages word for word in substance.
- No AI-made person, photo or quote is presented as a customer.
- India listings show MRP, net quantity, origin and maker details.
- A wrong-expectation limit appears as a number at each decision point, with a not-for-you link to the better-fit product.
- No placeholder or dead link in live copy; unknowns sit on the facts to confirm list.
- The hand-over names a watch metric, guardrail, read date and fallback variant.

## Output

**Summary (one screen):** the promise chosen and why (mention count), top objections and their answering reviews, claims dropped or narrowed, and the runner-up headline in one line.

**Page copy, in order:**

| Block | Copy | Source | Placement note |
|---|---|---|---|
| Rating line | | review app, date | above title |
| Headline | | review theme, count | first screen |
| Subhead | | claims sheet row | first screen |
| Price and per-use line | | Shopify price | by price |
| Under-button line | | returns policy | directly under button |
| Benefit block 1 to 5 (heading, body, proof) | | | |
| Proof picks (quote, name, date, objection answered) | | | beside buy box or block |
| Details table | | product facts | below benefits |
| Fit block (not for you, better-fit link) | | return reasons | beside details |
| FAQ 1 to 8 | | ticket or review ID | above reviews |
| Guarantee | | policy page | near button and footer of page |

**Watch and fallback:** metric, guardrail, baseline, read date, fallback lines.

**Facts to confirm:** each unknown, who confirms it, its swap-in line, and sign-offs needed before publishing.

## Common mistakes

- **Leading with the founder's favourite feature.** Step 3 picks the promise by counted buyer words.
- **Generic praise as proof.** Step 6 ties each review to one objection.
- **Claims wider than the proof.** Step 2 narrows wording to the evidence.
- **Hiding limits in an accordion.** Step 7 puts suitability limits in the details and FAQ.
- **One page for every angle.** Step 3 splits pages by angle when ads do.
- **Invented social proof** such as "500 bought today". The gates and checks allow live data only.
- **A vague limit with nowhere to go.** Step 7 adds the number and the better-fit link.
- **Brackets in live copy, or no plan if sales dip.** Steps 11 and 12.

## Sources

- MEA-0037: gross margin is the delivered cost to the door.
- MCR-6021: FTC rule on fake, insider and sentiment-bought reviews.
- AVT-0007: read reviews by hand, paste exact quotes.
- LPG-0064: one angle per page beats every benefit on one page.
- LPG-0067: reuse winning ad headlines on the page.
- LPG-0034: mobile first screen order.
- LPG-0038: risk reducers under the button, two proofs above the fold.
- LPG-0036: two different kinds of proof in the first screen.
- CRO-0018: "what almost stopped you" survey becomes copy.
- LPG-0005, LPG-0053: reviews chosen to answer named objections.
- LPG-0037: logos need the quote; reviewers need names.
- LPG-0049: outcome-led review headings.
- LPG-0062: review count matters most from 0 to about 80.
- OFF-0060, OFF-0064: guarantee length and only what the store keeps.
- LPG-0017: trust above price when price is the objection.
- CXP-6160: US ship-time claims need a reasonable basis.
- CRO-0010: one decision metric plus named guardrails.
- MEA-0011: Shopify books returns on the refund date; read by order date.
- CRO-0011: under 30 orders a month, no test is valid.
- [LPG-6600]: India E-Commerce Rules: price breakdown, origin, importer, grievance officer.
- [OFF-6603]: India from 2027: a price cut shows the lowest price of the past 30 days.

What makes this skill ours: the promise is picked by counted review mentions, not taste; every proof slot is tied to a named objection and a real reviewer; claims are narrowed to the evidence before writing starts; and the page is gated on positive gross profit per order and India's listing rules.
