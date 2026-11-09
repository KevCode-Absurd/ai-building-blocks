---
name: unit-economics-and-cac-limit
description: Works out contribution margin, cost to win a customer (CAC) by channel, payback, customer value on gross profit and the most the business can afford to pay for a new customer, from the client's own order, billing and spend exports. Turns the result into pass and stop marks for channel tests and a budget ceiling. Use before any paid test, when ads "seem expensive", when setting a marketing budget, or when someone quotes an LTV to CAC ratio without workings.
---

# Unit economics and the CAC limit

Every growth decision rests on one number: the most this business can afford to pay to win a customer. Without it, nobody can say whether a channel test passed. This skill builds that number from the client's own data, shows the workings, and turns it into test marks.

Access levels for this skill: everything here needs only level 1 (read exports or a viewer seat). Saving the sheet into the client's own drive is level 2. Nothing in this skill changes a live account.

## When to use

- Before any paid channel test, to set the pass and stop marks.
- "Our ads are too expensive" or "Should we spend more?"
- Setting or splitting a marketing budget.
- Someone quotes "LTV is 3x CAC" and nobody can show the sums.

## What you need

- **Access I have:** the level per tool, written down. Until the client answers, level 1.
- **Orders or billing:** an export of orders, invoices or subscriptions for at least the last 6 to 12 months, with customer ID, date, revenue, discounts and refunds. Remove names and emails first.
- **Costs per unit:** product or materials cost, shipping and fulfilment, payment fees, and any staff time that rises with each order or job.
- **Acquisition costs by channel and month:** ad spend, tools, agency fees, and paid staff hours spent on marketing.
- **New customers by channel:** from tracked links, the CRM source field or a "how did you hear about us?" answer.
- **Cash position:** how much the owner can tie up in winning customers before they pay it back. Ask in plain words.

If an input is missing, use a clearly labelled assumption and show how the answer changes if it is wrong.

## Steps

1. **Pick the unit.** An order (shops), a subscription month (software), a booked job (services and local), a booked call and a client (coaches). Use the variant formulas in the Traction pack if the client has it.
2. **Contribution margin per unit.** Price − discounts − cost of goods or materials − shipping and fulfilment − payment fees − variable staff time. Show it in money and as a share of revenue.
3. **Break-even return on ad spend** = 1 ÷ contribution margin share. This is the floor any paid channel must beat on the first order.
4. **Repeat behaviour from cohorts.** Group customers by the month of their first purchase. For each cohort, add up gross profit per customer at 30, 90, 180 and 365 days, using only periods that have actually passed. Do not project beyond what the oldest cohorts show without labelling it.
5. **CAC by channel.** For each channel and month: (spend + tools + fees + paid staff time) ÷ new customers from that channel. Also show blended CAC (all costs ÷ all new customers), but never decide on it alone; it hides losing channels.
6. **Payback.** CAC ÷ gross profit per customer per month, or read it off the cohort table: the first window where cumulative gross profit per customer passes CAC.
7. **Set the allowable CAC.** Offer the owner three levels and let them choose:
   - *Floor:* first-order contribution margin. Paying this or less means each new customer pays for themselves on day one.
   - *Target:* gross profit per customer over a window the cohorts support and the cash can carry (for example 90 days).
   - *Ceiling:* the longest observed window, only if cash allows waiting that long.
   For subscription software, compare against Skok's guidelines (payback within about 12 months; value above about three times CAC), and say they are a venture investor's rules of thumb, not laws.
8. **Turn it into test marks.** Pass: cost per new customer at or under the target. Stop: the budget cap is spent and cost per customer is clearly above the ceiling. Unclear: too few customers to tell; say what count would settle it.
9. **Sensitivity.** Recalculate with the two least certain inputs 20% better and 20% worse, and show whether the decision changes.
10. **Write it up** in the output format below. Mark each input with its source and date range.

## Checks

- Margin is on gross profit, not revenue, everywhere.
- Refunds and discounts are taken off.
- Staff time is counted where it rises with volume or with the channel.
- Customer value uses observed cohort windows; any projection is labelled.
- Channel CAC uses the same date range for spend and customers.
- The owner, not the agent, chose the allowable CAC level.
- No figure comes from outside the client's data except cited guidelines, labelled as such.

## Output format

1. **Inputs table:** input, value, source, date range, confidence (high, medium, assumption).
2. **Per-unit margin:** the sum, line by line.
3. **Cohort table:** cumulative gross profit per customer at each window, by first-purchase month.
4. **CAC by channel:** spend, customers, CAC, payback, against floor, target and ceiling.
5. **Allowable CAC:** the three levels, the owner's choice and why.
6. **Test marks:** pass, stop and unclear rules for the next channel tests.
7. **Sensitivity:** what changes if the weakest inputs are wrong.
8. **Next step:** one sentence.

## Example of good output (short)

*Illustrative structure, not a real business: an online pottery supplies shop. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Per order (last 6 months, from the order export):** average order 60.00; discounts −3.00; goods −22.00; shipping and packing −8.00; payment fees −2.00. **Contribution margin 25.00 (41.7%).** Break-even return on ad spend = 1 ÷ 0.417 = **2.4**.

**Cohorts (first orders Jan to Apr):** cumulative gross profit per customer 25.00 at first order, 31.00 at 90 days, 36.00 at 180 days. No cohort is a year old yet, so no 12-month figure is shown.

| Channel (May to Jun) | Spend incl. fees | New customers | CAC | Against limits |
|---|---|---|---|---|
| Meta ads | 1,800 | 60 | 30.00 | Above floor, under target |
| Google Shopping | 900 | 45 | 20.00 | Under floor |
| Creator gifting (product + time) | 600 | 8 | 75.00 | Above ceiling |
| Blended | 3,300 | 140 (27 untracked) | 23.57 | Do not use alone |

**Allowable CAC:** floor 25.00, target 31.00 (90 days), ceiling 36.00. The owner chose the target because cash covers about three months of acquisition spend.

**Test marks:** pass at 31.00 or less per new customer; stop when the cap is spent and CAC is above 36.00; unclear below 15 customers (a line the owner set), because one big order would swing the result.

**Sensitivity:** if goods cost rises 20% (to 26.40), margin falls to 20.60 and the target to about 25.50; Meta at 30.00 would then fail. Watch supplier prices before scaling Meta.

**Next step:** keep Google Shopping, hold Meta at its current cap for four more weeks, and stop creator gifting unless the owner wants to continue it as a brand activity with no CAC target.
