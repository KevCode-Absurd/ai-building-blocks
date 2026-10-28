---
name: event-pricing
description: Use when pricing or promoting tickets, classes, workshops, bookings, or any event with dates and limited seats — e.g. "how should I price the workshop", "early-bird discount or something else", "should I show sold-out dates", "only 12 seats left banner", "what goes on the ticket page", "how do I sell out this cohort".
---

# Event pricing

Events are experiences: buyers decide on feelings, sold-out dates signal quality, and the wrong kind of scarcity turns the people who miss out against you. This skill covers only what changes for dated, capacity-limited events. The general pricing, promotion, discount and product-page skills it was built beside are not in this library, so the five rules you need for events are written here. The topics it does not cover are named under the procedure. The payment form is set up in your booking or checkout tool. All figures below (30%, 3 weeks, 40%) are rules of thumb from the author's evidence notes in reference.md, not tested laws. Check them against your own sales.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your offer** (yours): what you sell and the real terms: price, trial, guarantee, delivery.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your offer. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Setting a ticket, class, or booking price
- Designing pre-sales, early-bird offers, and how dates or seats are shown

## When not to use

- Ordinary products with no dates or seat limits: use a normal pricing check for your product page.
- Finding the price level people will pay: ask a few past buyers or test two prices first.
- Checkout and payment fields for the ticket sale: set these up in your booking or checkout tool.

## Inputs

Collect, or state your assumption: the event, ticket price, and date(s); how far away the first date is; how many dates or slots and how many are sold out; any complementary item you can give; whether it is bought for enjoyment or for a functional outcome.

If you have no past sales data, do not invent figures. Say so, then test two prices or two offers with a small early group and compare the results before you commit to one.

Most events — workshops, concerts, retreats, cooking classes — are hedonic. Training bought for a functional result (exam prep, compliance) is the utilitarian exception.

## Procedure

Only the rules that change for dated, capacity-limited events.

1. **Rounded ticket price.** Experiences are bought on feelings, so $150 beats $149. Just-below only for a promotion price.
2. **Show sold-out dates — about 10% to 30% of them.** Mark them instead of hiding them. As a rule of thumb, keep the share of sold-out dates between about 10% and 30%. That is not a tested result, so check it against your own sales. This is the event form of the sold-out-variant rule.
3. **Deadline, not a seat-count, as the promotional lever.** "Early pricing ends 30 Sept, 23:59 CET" is fine. "Only 12 seats left!" as a marketing hook is not: people who miss a quantity-capped *offer* get angry and switch. Showing *accurate* remaining capacity as inventory (a seat picker, "2 dates left" in a list) is fine.
4. **Pre-sales: gift, not early-bird discount, when the event is 3+ weeks out.** A bonus session, materials, or the recording at no cost. Within about a week, either works. Hedonic events tolerate long windows; functional ones should keep them short.
5. **Human-labeled recommendations** for experiences, only when the label is true. Use "Others also booked" only if your booking records show buyers really booked those together. Use "Instructor's pick" only if the instructor chose them. With neither, use a neutral label such as "You might also like". Never put a social-proof label on a row the algorithm made without that evidence.

Not covered here: general discounts (the usual rule of thumb is to keep any discount at 40% or below), special-day offers and ticket-page layout. Ask your AI to handle those separately.

**If an input is missing:** ask the user for it. If they cannot say, state an assumption and label it (for example, "assuming 10 seats per date") before you apply rule 2 or rule 4, and tell them to replace it with the real figure.

**Rules of thumb, not tested laws.** The 30% sold-out limit, the 3-week gift rule and the 40% discount cap are rules of thumb with no strong source. Say so next to each one in your answer, and tell the user to check them against their own sales.

## Worked example

Illustration only, with made-up numbers. Pottery studio, 8-week wheel class, plan: $149, 25% early-bird, "Only 12 seats left", sold-out Saturday hidden, algorithm "recommended" row.

- **$150**, rounded.
- Early-bird 8 weeks out → **glazing-masterclass recording at no cost**, dated deadline, no seat-count banner.
- Show the sold-out Saturday, marked, if sold-out dates stay in the 10–30% band.
- **"You might also like"** instead of the algorithm label, because this example has no co-booking records. Switch to "Others also booked" only once booking data shows it.

## Output

| Item | Value |
|---|---|
| Ticket price | $150 (rounded; hedonic) |
| Dates shown | All 8; 2 marked sold out (25%) |
| Pre-sale (8 weeks out) | Recording at no cost by a dated deadline |
| Urgency copy | Deadline + reason + timezone; no seat-count promo |
| Recommendation label | "Others also booked" only with real co-booking data; else a neutral label |
| Rejected | 25% early-bird, "Only 12 seats left", hidden sold-out dates |
| Why | one line per choice |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Price ending picker](https://useaiblocks.com/prompts/price-ending-picker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common mistakes

- Keeping the early-bird discount because it "gives a real reason to book now" — 3+ weeks out, a gift tends to work better (a rule of thumb from reference.md, not a tested result for your event).
- Dropping "12 seats left" only because it might be inaccurate — accurate or not, unit caps as a promo anger the people who miss out. Use a deadline. Accurate inventory in a picker is a different thing.
- Hiding sold-out dates — a sold-out date can signal quality (see reference.md, the sold-out section, an untested rule of thumb for your own sales); show them, about 10% to 30%.
- Pricing at $149 to look cheaper — it signals a bargain, not an experience.

## Quick reference

| Situation | Do |
|---|---|
| Ticket price | Rounded |
| Sold-out dates | Show, marked; about 10–30% |
| Promo urgency | Deadline, never a seat-count hook |
| Pre-sale, 3+ weeks out | Gift, not early-bird |
| Recommendations | Human label |

Evidence and effect sizes: see [reference.md](reference.md).

## Steps and next step

1. Collect the event, price, dates, seats and which dates are full.
2. Apply rules 1 to 5 above, one by one.
3. Hand back the table of choices and reasons.
4. Set the deadline in your booking or checkout tool. After one sales week, recheck which dates are sold out.
