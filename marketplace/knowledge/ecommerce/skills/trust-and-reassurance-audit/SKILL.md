---
name: trust-and-reassurance-audit
description: "Maps every point where a buyer may doubt the store (is it real, will it work for me, is the price fair, is payment safe, when will it arrive, what if it is wrong, will anyone answer) from first visit to delivery, checks what the store shows at each point, and writes the exact reassurance to add, where it goes and the true fact or proof behind it. Uses the store's own surveys, tickets and reviews to find which doubts cost sales, rejects fake badges, counters and borrowed press logos, and checks India e-commerce disclosure rules and US review and shipping rules. Use when new visitors convert poorly, after a run of 'is this legit?' messages, or before sending cold traffic."
---

# Trust and reassurance audit

**You get:** a doubt map covering 8 buyer doubts across every page type, each with what the store shows now, the evidence buyers feel that doubt, and the exact reassurance line or element to add, where it goes and the fact or proof that makes it true; plus a top-10 action list in order of sales at stake and a short list of trust elements to remove because they are false or unprovable.

## When to use

- New visitors convert much worse than returning buyers.
- Support, DMs or comments ask "is this legit?", "is COD available?", "how do returns work?".
- Before sending cold paid traffic to a young brand with few reviews.
- After a policy change (returns, shipping) that pages may not reflect.

## Not for

- Designing the guarantee itself and what it costs: use `guarantee-and-risk-reversal`.
- Writing full policy pages: use `write-store-policy-pages`.
- Getting more reviews: use `build-review-collection-system`.
- Checking product claims for proof: use `product-claims-profile`.

## What you need

Required (read access, level 1):

1. **Live store URL** and the top 5 landing pages by sessions.
2. **New versus returning conversion**, last 30 to 90 days (Shopify Analytics customer type, or GA4 new versus returning users with purchase only).
3. **Buyer doubt evidence:** post-purchase survey answers, pre-purchase support tickets and chats, social comments, review text, return reasons. At least one source; two or more is better.
4. **The real policies and facts:** return window and who pays return shipping, refund time, delivery times by region (actual, from courier data), payment methods, business legal name, address and contact, any guarantee terms.
5. **Gross profit per order.**

Optional: Google Merchant Center store rating, press coverage with links, number of customers served (from Shopify, with date).

If doubt evidence is missing, add the question "What almost stopped you buying today?" to the order confirmation or thank-you page and run the rest of the audit meanwhile, marked "evidence pending". Editing pages needs draft access (level 2) on a theme copy; publishing needs the client's yes.

## Before you start: the gates

1. **Every reassurance is true.** A line goes in only if the store can keep it: a delivery date the courier data supports, a return window the team honours, a review count from the review app. Fail: change the line to what is true, or drop it.
2. **Proof is real and permitted.** Reviews must be from real buyers, not edited to change meaning; press logos only with the outlet's actual quote and link [LPG-0037]; no AI-made people shown as customers. US: the FTC's rule on consumer reviews bans fake reviews and hiding negative ones. India: ASCI's code and the 2023 dark-pattern guidelines cover false urgency and misleading claims.
3. **Policies exist and match operations.** If the written returns policy and what support does differ, fix the policy first (`write-store-policy-pages`).
4. **Gross profit per order known** [MEA-0037], so actions can be ranked.

## Steps

### 1. Measure the trust gap

Compare new-visitor and returning-visitor conversion. Trust problems hit new visitors hardest. Gross profit at stake a month = new-visitor sessions x (a realistic share of the gap, working figure 20%, marked) x conversion gap x gross profit per order. This caps what the action list can claim.

### 2. List the doubts buyers actually have

Code each piece of evidence into one of 8 doubts and count how often each appears:

1. **Is this store real?** (who runs it, where, how to reach them)
2. **Will it work for me?** (results, fit, size, compatibility)
3. **Is the price fair?** (value, versus rivals, versus discounts elsewhere)
4. **Is payment safe?** (card trust, UPI, COD)
5. **When will it arrive?**
6. **What if it is wrong or I do not like it?** (returns, refunds, exchanges)
7. **Will anyone help me?** (support speed and channel)
8. **What happens to my data?** (phone number, WhatsApp, emails)

Cross-check with outside research: among checkout leavers, card distrust (19%) and an unsatisfying returns policy (13%) are common stated reasons [CRO-6180]. Use the store's own counts to rank.

### 3. Walk the journey and record what the store shows

On a phone, for each page type (landing page, home, collection, product, cart, checkout, thank-you, order status, emails), note what answers each doubt, how far it is from the buy button, and whether it is true. Checklist:

- **Header and footer:** business name, contact (email, phone or WhatsApp), address where required.
- **Product page:** rating near the title and two kinds of proof on the first screen [LPG-0036]; reviewer name and source shown [LPG-0037]; a headline that says how many customers got which outcome, with a real number [LPG-0049]; risk reducers (returns, guarantee, delivery) in the line under the button [LPG-0038]. When buyers object to price against rivals, trust elements placed above the price and risk badges under add to cart lifted conversion in agency tests [LPG-0017].
- **Reviews:** count and recency; most of the lift comes in the first 80 or so, then photo reviews that match the claim matter more [LPG-0062].
- **Cart:** a trust bar (easy returns, support, guarantee) in place of an idle discount box [LPG-0058].
- **Checkout and payment:** payment icons only for methods really offered; COD and UPI shown where buyers expect them.
- **Delivery:** a specific padded date beats a vague range [CXP-0010].
- **After purchase:** order status page and tracking; what happens if a delivery fails.

### 4. Write the reassurance for each gap

For every doubt that has evidence and a weak or missing answer, write:

- **The line or element**, in the store's voice, in plain words (for example "Free returns within 30 days. We send the pickup.").
- **Where it goes:** page, position (under the button, in the gallery, in the cart).
- **The fact behind it:** policy page, courier data, review app count, with date.

Rules: concrete beats vague ("Refund in 5 working days after pickup" beats "Hassle-free returns"); a guarantee must be one the store can afford, since long, generous terms can backfire on some products [OFF-0064], while on low-ticket consumables a longer window can mean fewer claims [OFF-0060]; returns matter beyond the first sale, as most consumers say a poor return makes them less likely to buy again [CXP-0007].

### 5. Remove false or weak trust signals

List for removal: generic "secure checkout" padlock images that add nothing, badges for awards or certifications the store cannot prove, press logos without a quote, "X people are viewing this" counters that are not real, countdown timers that reset, reviews with no name or source. These hurt more than they help once noticed.

### 6. Rank the actions

Priority = how often the doubt appears in evidence x share of sessions that see the page x ease. Put legal disclosure gaps first, then false signals to remove, then the top doubts by evidence count. Keep the list to 10 actions.

### 7. India and US notes

- **India:** the Consumer Protection (E-Commerce) Rules, 2020 expect sellers to show their legal name, address, customer care contact, a grievance officer, return, refund, exchange, warranty and delivery terms, payment methods and the total price with all charges; check the current text. Show COD availability and any COD fee early, UPI options, and a WhatsApp support line if the store answers there. Delivery estimates by pincode reduce "when will it arrive" doubts.
- **US:** the FTC's mail order rule expects a reasonable basis for any shipping time stated; reviews and testimonials fall under its consumer review rule. Show tax and shipping notes in the cart; a 30-day or longer return window also feeds Google's store quality signals [GAD-0018].

## Checks before you hand it over

- Each of the 8 doubts is marked with its evidence count, even if zero.
- Every reassurance line has a dated fact or proof behind it.
- No fake counters, resetting timers, unproven badges or quote-less press logos remain in the plan.
- Legal disclosure gaps for the store's market are listed first.
- Placements are given by page and position, checked on a phone.
- The action list shows gross profit at stake and does not exceed the measured trust gap.
- Nothing is published without the client's yes.

## Output

**One-screen summary:** new versus returning conversion, gross profit at stake, the three doubts that cost the most, and the first three actions.

**Doubt map:**

| Doubt | Evidence count and sources | Page and position | What the store shows now | Gap | Reassurance to add (exact words) | Fact or proof behind it (source, date) | Legal note |
|---|---|---|---|---|---|---|---|

**Remove list:** Element, Page, Why it goes.

**Action list (top 10):** #, Action, Page, Doubt, Evidence count, Sessions exposed, GP at stake a month, Owner, Effort, Approval.

## Common mistakes

- **Adding badges instead of answers.** Step 4 writes specific lines backed by facts.
- **Promising what operations cannot keep.** Gate 1 checks every line against real data.
- **Guessing the doubts.** Step 2 counts them from the store's own buyers.
- **Burying reassurance on a policy page.** Step 3 measures distance from the buy button.
- **Borrowed or fake proof.** Gate 2 and Step 5 remove it.
- **Missing the legal basics.** Step 7 puts disclosure gaps first.

## Sources

- CRO-6180: card distrust and returns among stated abandonment reasons.
- CXP-0007: poor returns reduce repeat buying.
- CXP-0010: specific delivery dates lift conversion.
- GAD-0018: Google store quality rests on shipping and returns.
- LPG-0017: trust above price, risk badges under add to cart.
- LPG-0036: two kinds of proof on the first screen.
- LPG-0037: press logos need quotes; reviews need names and sources.
- LPG-0038: risk reducers under the call to action.
- LPG-0049: review headings with real customer numbers.
- LPG-0058: trust bar instead of an idle code box.
- LPG-0062: review count matters most up to about 80.
- MEA-0037: gross margin is delivered cost.
- OFF-0060: longer guarantees on consumables can mean fewer claims.
- OFF-0064: generous guarantees only where the product lasts.

What makes this skill ours: doubts are counted from the store's own surveys, tickets and reviews and sorted into eight buyer questions; every reassurance line must point to a dated fact the store can keep; fake counters, resetting timers and quote-less press logos go on a remove list; and India's e-commerce disclosure rules and COD and UPI signals are checked beside US review and shipping rules.
