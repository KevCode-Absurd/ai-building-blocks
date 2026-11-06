---
name: tiers-and-packaging
description: Designs a three-tier good-better-best package or plan ladder for software, memberships, services or product bundles - the value metric to charge by, what goes in each tier, prices, a margin check per tier and per customer size, the default tier, an annual option and how existing customers are treated. Use it when moving from one plan to three, choosing per-seat versus usage versus flat pricing, cleaning up too many plans, or turning a service into packages.
---

# Tiers and packaging

## When to use

- One plan or one price needs to become a ladder of three.
- Big customers push back on per-seat prices, or small ones find the entry price too high.
- There are too many plans and add-ons, and buyers stall.
- A service business wants fixed packages instead of hours.

This is general pricing practice, not legal or tax advice. Check this with local rules on how plan prices, minimum terms and renewals must be shown, and ask a qualified lawyer before changing terms for existing customers.

## What you need

1. Who buys, in two or three groups (for example solo, small team, larger firm), and what each is trying to get done.
2. Features or service parts, and which group uses which (usage data if possible).
3. Cost to serve per customer, per unit of the likely value metric (seat, project, order, message), plus payment fees.
4. Current plans, prices, how many customers sit on each, and churn.
5. Rival plans on the same basis, if public.
6. The billing tool (Stripe, Chargebee, Paddle, the store) and what it supports.

**Access:** level 1 to read plans, subscriptions and usage. Level 2 to create the new prices unused in billing and a pricing page draft. Level 3 to point the pricing page at approved prices for new buyers within the agreed limits. Moving existing customers to new plans or prices needs a fresh yes every time.

## Steps

### 1. Choose the value metric

List candidates: seats, active users, projects, orders, messages, locations. For each, ask: does it grow when the customer gets more value? Can the buyer predict their bill? Is it hard to game? Does cost to serve grow with it? Pick one. If buyers complain about paying for idle seats, consider charging only for active ones, as Slack does: it stops billing members inactive for more than 28 days.

### 2. Pick the model

Flat price per tier, per-seat, tiered (volume, where one unit price applies to all units by the total, or graduated, where each band has its own price) or usage-based (fixed fee and overage, pay as you go, credit burndown). These are the models Stripe's billing supports; check what the client's tool supports before promising one.

### 3. Write the one-line pitch for each tier first

Good: for the smallest buyer, the core job done. Better: for the main buyer, the default. Best: for buyers who need control, scale or support. If a tier cannot be explained in one sentence, redo it.

### 4. Fill the tiers

- Put what small buyers need in Good; do not cripple it.
- Put the features most buyers want in Better, so it is the obvious pick.
- Put control, scale, admin and priority support in Best.
- Each step up has one clear reason, not a list of minor extras.
- Keep add-ons to what genuinely varies by customer.

### 5. Price the tiers

Use the floor from cost to serve, rivals on the same basis and buyer evidence (the price-recommendation skill). Space prices so the step up feels worth it. Mark the middle tier as the default.

### 6. Check margin per tier and per customer size

For each tier, at the smallest and largest customer it allows: price − cost to serve − payment fees = contribution, and margin %. Flag any tier or size that loses money.

### 7. Set the annual option

State the discount for paying yearly and show its cost: revenue given up versus cash brought forward and churn avoided. The client decides the depth.

### 8. Decide what happens to existing customers

Options: keep them on their current plan and price (grandfathering), move them with notice, or offer a choice. Any move or rise needs the client's fresh yes, a read of the customer terms, notice, and a message that lists every option that stays, including cheaper ones. In 2025 the ACCC took Microsoft to court alleging its Microsoft 365 price rise messages left out a cheaper plan it kept.

### 9. Plan the test

New buyers only, the new pricing page against the old, a set period, profit per visitor as the measure, and a stop rule.

## Checks

- One value metric, chosen with a reason.
- Each tier has a one-line pitch and a named buyer.
- The middle tier is the default and is the best fit for most buyers.
- Every tier and customer size has positive contribution.
- The billing tool supports the model.
- Existing customers are not moved without the client's fresh yes.
- Plan prices are shown in each market's required form (UK minimum-term plans show the total or the monthly price with the number of months).
- The deliverable says to check this with local rules.

## Output format

1. **Value metric** and why.
2. **Tier table:** pitch, buyer, contents, price, annual price, default marked.
3. **Margin table:** tier, customer size, price, cost to serve, fees, contribution, margin %.
4. **Existing customers:** the options and what each needs.
5. **Test plan.**
6. **Billing notes** for the tool in use.

## Example of good output

*Slotwise (a made-up scheduling app). Today: one plan at $39 a month. Cost to serve: $2 per staff calendar a month. Payment fees: 3% (example figure from the client's processor).*

**Value metric:** staff calendars. It grows with the value (more staff booked), buyers can predict it, and cost grows with it.

| | Solo | **Team (default)** | Business |
|---|---|---|---|
| Pitch | Get booked without the back-and-forth | Run a small team's bookings in one place | Control many staff and locations |
| Calendars | 1 | Up to 5 | Up to 15 |
| Price | $19 | $49 | $99 |

| Tier at its largest size | Price | Cost to serve | Fees | Contribution | Margin |
|---|---|---|---|---|---|
| Solo, 1 calendar | $19 | $2 | $0.57 | $16.43 | 86% |
| Team, 5 calendars | $49 | $10 | $1.47 | $37.53 | 77% |
| Business, 15 calendars | $99 | $30 | $2.97 | $66.03 | 67% |

**Existing customers on $39:** keep them on $39 until you decide. Moving them needs your fresh yes, a check of your terms and a notice that names every plan they can choose, including Solo at $19.

**Test:** show the three-tier page to new visitors for six weeks against the current page; measure revenue and contribution per visitor; stop early if sign-ups fall and contribution per visitor is lower two weeks running.

Check this with local rules, and ask a qualified accountant how sales tax or VAT shows on each plan.
