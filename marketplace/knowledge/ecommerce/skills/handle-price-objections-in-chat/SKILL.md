---
name: handle-price-objections-in-chat
description: "Ready chat answers to the three price objections (too expensive, cheaper elsewhere, is it worth it) that hold the store's price and still ask for the order: a one-question check that finds what the buyer really means, answers built from the store's own value facts, real reviews and risk reducers, a smaller-option path that keeps margin, a check-the-claim routine for cheaper-elsewhere, and a concession ladder the owner approves in advance with the profit cost of each step. Bans secret one-off discounts, fake 'was' prices and invented urgency. India notes for 'last price?' bargaining, COD and GST; US notes for price matching. Use when chats stall on price or agents give away discounts to close."
---

# Handle price objections in chat

**You get:** a price objection kit: the diagnosis question, 9 written answers (3 per objection, short and full), a value fact sheet, a cheaper-elsewhere check, an owner-approved concession ladder with the gross profit cost of each step, and a tracker of price chats, closes and margin given away.

## When to use

- Chats stall at "too expensive" or "last price?" and agents answer with discounts.
- Buyers send screenshots of a cheaper listing and agents do not know what to say.
- The store sells above the cheapest options and must explain why.
- Discount codes handed out in chat are leaking into coupon sites.

## Not for

- Setting or changing prices: use `set-prices-from-costs-and-competitors` or `run-a-price-test`.
- Ads that answer objections: use `objection-busting-ad-set`.
- Price pushback on consultation calls: use this kit with `high-ticket-consult-call-script`.
- Tracking rival prices each week: use `track-competitor-prices`.

## What you need

Required:

1. **Price chats**: the last 50 to 100 chats where price came up (search transcripts for price, expensive, cheaper, discount, last price, worth).
2. **Gross profit per order** by product on delivered costs [MEA-0037].
3. **Value facts** per product: materials, size, quantity, how long it lasts, what it replaces, warranty, returns, delivery, all with sources.
4. **Reviews export** filtered for mentions of price, value, worth, quality.
5. **The owner's concession limits**: what an agent may offer without asking.

Optional: competitor prices from `track-competitor-prices`, post-purchase survey answers, `competitor-product-teardown` output.

Access: read only (level 1) to build the kit. The concession ladder takes effect only after the owner signs it off; any code or price change in the store is level 2 with the owner's yes.

## Before you start: the gates

1. **Gross profit per order known.** Pass: each concession shows its cost. Fail: stop; no concession ladder without it. A 30% discount on a 40% margin order can leave almost nothing [OFF-0065].
2. **Value facts sourced.** Every number in an answer (lasts 2 years, 60 washes, 30-day returns) has a source. Fail: drop the line.
3. **Comparisons provable.** In India, comparisons must be factual, clear on what is compared and not unfairly run down a rival [MCR-6024], and claims need proof on demand [ADC-6146]. Fail: no comparison; talk only about the store's own product.
4. **One price for everyone.** Pass: no secret per-chat discounts. Different prices for the same item to different buyers damage trust when buyers compare notes [CRO-0009]. Fail: write the concession ladder as public, rule-based offers.

## Steps

### 1. Diagnose with one question

Price objections hide different worries. Ask one question before answering:

| Buyer says | Ask |
|---|---|
| "Too expensive" | "Is it over your budget, or not sure it's worth it?" |
| "Cheaper elsewhere" | "Could you share the link? I'll check it's the same thing." |
| "Is it worth it?" | "What would make it worth it for you?" |

Over budget goes to step 4 (smaller option). Unsure of worth goes to step 2. Comparison goes to step 3.

### 2. Answer "too expensive" and "is it worth it" with value, proof and risk

Three moves, short:

1. **Value in their terms:** cost per use, per day or per wash, or what it replaces. Price makes sense against what the buyer already spends on alternatives that failed [LPG-0027].
2. **Proof:** one real review that talks about price or worth, in the customer's words [LPG-0005].
3. **Risk reducer:** the real returns window, guarantee or COD. A price doubt is often a risk doubt, and trust signals near the price have lifted conversion in agency tests [LPG-0017].

Then ask: "Shall I send the link?"

> "Fair question. It works out to about Rs 12 a day over the 3 months the pack lasts. A buyer wrote '[short real quote on value]'. And if it doesn't suit you, returns are free within 7 days. Want the link?"

### 3. Answer "cheaper elsewhere" by checking the claim

Check, without running down the rival:

- Same product, size and quantity? Same seller or an authorised one?
- Total with shipping and tax, or item price only?
- Same warranty, returns and delivery time?

Then one of three answers:

- **Not the same:** "That one is [real difference: 200 ml / no warranty / ships in 3 weeks]. Ours is [fact]. Happy to help either way."
- **Same, but costs more in total there:** show the totals side by side.
- **Same and truly cheaper:** follow the owner's rule. If the store does not price match, say so plainly and give the reasons to buy here (delivery date, returns, support); never claim the other seller is fake without proof.

### 4. Offer a smaller option, not a lower price

For a buyer over budget, offer a smaller size, a starter pack or a single unit instead of a discount, so the margin per unit holds. Size it to their real use [OFF-0018]: "The 50 ml is Rs 499 and lasts about a month; a good way to try it."

### 5. Use the concession ladder only as written

The owner signs off a ladder that any buyer could get under the same rule, used only after steps 2 to 4:

| Step | Concession | When | Gross profit cost per order |
|---|---|---|---|
| 1 | Free shipping on this order | Order above the store's line | [from sheet] |
| 2 | Low-cost gift with real value | Order of 2 or more units | [gift landed cost] |
| 3 | Published bundle price | Buyer takes the bundle | [from sheet] |

A low-cost gift can lift order value at nearly the same margin [OFF-0078]. Small percentage codes rarely move units and mainly give away margin [OFF-0014], and buyers won with deep discounts often repeat less [CXP-0016]. No step is a private code. Any "was" price shown must be one the store genuinely charged [OFF-6145], and any deadline must be real.

### 6. Ask, then let go

After the answer, one question toward the order. If the buyer still says no: "No problem. If it helps later, this link stays the same." Label the chat "Lost: price" with the reason. One follow-up at most, only inside the open chat window.

### 7. Track and improve

Weekly: price chats, closes, close rate per objection type, concessions used and their gross profit cost, and gross profit per price chat. If one product draws most price objections, send it to `set-prices-from-costs-and-competitors` or page fixes; chat answers cannot fix a price buyers will not pay.

### India and US notes

- **India:** "Last price?" is often a habit, not a hard no. Answer warmly and firmly: "Our prices are fixed so everyone pays the same, but here's what's included: [free delivery / COD / 7-day returns]." State GST-inclusive prices. COD is a strong risk reducer for a first order; mention it where the pincode allows.
- **US:** state the store's price-match policy if it has one, with its terms; compare totals including shipping and sales tax; a "compare at" price must be a real former price.

## Checks before you hand it over

- Every answer ends with one question toward the order.
- Every number in an answer has a source.
- Every review quote is real, verified and unedited in meaning.
- No answer runs down a rival or makes an unprovable comparison.
- The concession ladder is signed by the owner, rule-based and costed in gross profit.
- No private codes, fake "was" prices or invented deadlines.
- The tracker shows margin given away, not just closes.

## Output

1. **One-screen summary:** price chats a week, current close rate, the most common objection, margin given away last month, and the ladder for owner sign-off.
2. **Answer sheet:** Objection, Diagnosis question, Short answer, Full answer, Proof line (review, date), Risk reducer, Closing question, Fact sources.
3. **Value fact sheet:** Product, Price, Cost per use or day, What it replaces, Warranty, Returns, Delivery, Source, Date.
4. **Cheaper-elsewhere check:** Rival link, Same item (yes or no), Total there, Total here, Differences, Answer used.
5. **Concession ladder** (step 5) with owner sign-off line.
6. **Tracker:** Week, Price chats, Too expensive, Cheaper elsewhere, Worth it, Closes, Concessions used, Gross profit given, Gross profit per price chat.

## Common mistakes

- **Answering before knowing the worry.** Step 1 asks one question first.
- **Discount as the first answer.** Steps 2 to 4 come before any concession.
- **Secret codes for persistent buyers.** Gate 4 and step 5 keep one rule for all.
- **Running down a rival.** Step 3 checks facts and states differences only.
- **Small codes that give margin away.** Step 5 prefers gifts and bundles with costed profit.
- **Chasing a no.** Step 6 lets go with one open door.

## Sources

- MEA-0037: delivered gross margin.
- OFF-0065: discount maths on margin.
- OFF-0014: small discounts rarely move units.
- OFF-0078: low-cost gift at nearly unchanged margin.
- CXP-0016: deep-discount buyers often repeat less.
- CRO-0009: different prices for the same item damage trust.
- OFF-6145: genuine former prices.
- LPG-0017: trust near the price answers price objections.
- LPG-0027: price against what buyers already spent.
- LPG-0005: reviews picked to answer the objection.
- OFF-0018: size the option to real use.
- MCR-6024, ADC-6146: India's ASCI rules on comparisons and claims.

What makes this skill ours: one question splits budget, worth and comparison before any answer; a smaller option protects margin before a concession is considered; the concession ladder is public, owner-signed and costed in gross profit per order; and cheaper-elsewhere claims are checked on total cost and like-for-like, never answered by running down a rival.
