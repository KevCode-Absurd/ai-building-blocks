# Why small-business accounts go inactive in year one, and what to test next

**To:** Strategy & Research
**Re:** First-year inactivity in the Q1 small-business cohort
**Note:** All figures below are hypothetical exercise numbers, not Ramp data.

## Summary

Of 2,000 small-business accounts opened in Q1, 520 (26%) were inactive by month 12. About two-thirds of those (roughly 333 accounts, or 64%) were tagged with reasons we can plausibly influence: low card adoption or no accounting connection. The other third closed, were acquired, or moved spend to a competitor.

Our main hypothesis: accounts that never spread Ramp past the founder's own card, and never connect it to the books, never make Ramp part of how the business runs. That leaves them easy to drop. Next quarter we should run three experiments against that idea. Because a quarter is too short to read 12-month inactivity, we should judge them on early signals and then confirm on retention later. We should also fix how we define and tag inactivity, because the current data can't separate cause from symptom.

## What the data says

| Group | Accounts | Share of cohort |
|---|---|---|
| Opened in Q1 | 2,000 | 100% |
| Active at month 12 | 1,480 | 74% |
| Inactive at month 12 | 520 | 26% |
| – Low adoption (≤2 cards) | ~213 | 10.7% |
| – Never connected accounting | ~120 | 6.0% |
| – Closed or acquired | ~94 | 4.7% |
| – Moved spend elsewhere | ~94 | 4.7% |

*Reason counts are rounded from the percentages, so they add up to 521.*

Active accounts averaged 9 cards issued, and 92% had accounting connected. The contrast is sharp. Active accounts look like teams using Ramp. Many inactive accounts look like one person trying a card.

If we cut the two controllable groups in half, inactivity would drop from 26% to about 18%. That's the size of the prize. It's worth chasing, but it doesn't remove the problem.

## What the data does not tell us

**It shows correlation, not cause.** Nine cards and a live accounting sync may be signs of a larger, more organized business, not reasons it stays. A five-person firm with a bookkeeper will issue more cards and connect QuickBooks whether or not we nudge it. Pushing cards onto a two-person shop may change nothing.

**We see one reason per account.** Each inactive account has a single primary tag. An account that issued two cards, never connected accounting, and then moved to a competitor fits all three buckets. We don't know how much the buckets overlap. "Moved spend" may often be the end point of low adoption, not a separate cause.

**We lack the same measures for inactive accounts.** We know active accounts average 9 cards and 92% connected. We don't know the card count or connection rate across *all* inactive accounts, only for the ones tagged that way. Without that, we can't say how much these two traits predict going inactive.

**The tags are subjective.** Account managers chose the reasons after the fact, and from memory. Different people may tag the same story differently. "Low adoption" is the easiest tag to apply when nobody knows the real reason.

**There's no timing.** We don't know whether accounts dropped off in month 2 or month 11. An account that never got going needs a different fix from one that ran well for eight months and then left.

**There's no segment view.** Company size, industry, sales channel and whether a bookkeeper or accountant was involved could all matter. We have none of these split out.

**"Inactive" is not defined here.** Before we act, we need to agree on what it means (for example, no card spend or bill payments for 60 days).

## Three hypotheses, ranked

### 1. Accounts that stay with one or two cards never become the company's spend system

**Why it ranks first:** It's the biggest bucket (41% of inactive accounts). It's controllable, and the gap is wide (9 cards vs. two or fewer). It may also explain part of the "moved spend" group.

**Experiment:** Randomize new accounts into control or a "spread the card" program. The program has three parts: a setup step that asks the admin to add employees and set up vendor cards for recurring software bills; a day-14 prompt if fewer than three cards are active; and a short call with an account manager at day 30 for accounts still at two or fewer.

**Success metrics:**
- Primary (in quarter): share of accounts with 3+ active cards by day 60
- Secondary: share with card spend in each of weeks 6 through 12; number of distinct cardholders
- Confirmation (read later): inactivity rate at month 6 and month 12
- Guardrails: declined transactions, card-control issues, support tickets

### 2. Without an accounting connection, Ramp saves no time, so it's easy to drop

**Why it ranks second:** It's controllable, and the gap is large (92% connected among active accounts). But it's a smaller bucket (23%). It's also the step most likely to be blocked by someone outside the company, the bookkeeper.

**Experiment:** Randomize new accounts into control or "done-with-you" setup. In the test arm, the accounting connection is a required step during setup. It includes an option to invite the outside bookkeeper or accountant directly, plus a 20-minute setup session for accounts that haven't connected by day 21.

**Success metrics:**
- Primary (in quarter): accounting connection rate by day 30
- Secondary: share of transactions synced and coded each month; whether the bookkeeper logs in
- Confirmation: inactivity at months 6 and 12
- Guardrail: drop-off during setup (a required step could cost us accounts before their first transaction)

### 3. Accounts that move spend show early warning signs we're not acting on

**Why it ranks third:** "Moved spend" is 18% of inactive accounts. It's partly beyond our control (a competitor's offer or a bank relationship). We also know the least about it. This experiment is as much about learning as fixing.

**Experiment:** Build a simple early-warning flag: monthly card spend down 50% or more from the account's own three-month average. Randomize flagged accounts into a holdout or an outreach arm. The outreach arm gets a call that follows a fixed script, asks why spend is falling, and offers help such as limit reviews or setup fixes.

**Success metrics:**
- Primary: share of flagged accounts back to 75% or more of baseline spend within 60 days
- Secondary: a structured record of why accounts leave, coded into a fixed list
- Guardrail: account manager hours per account saved

### A note on sample size

A quarter brings roughly 2,000 new accounts. To detect a fall in 12-month inactivity from 26% to 21% with standard confidence, we'd need about 1,100 accounts per arm. That's more than half a quarter's cohort for one test. So we can't run Experiments 1 and 2 at full power on retention in the same quarter. We should split the cohort into three cells (control, Experiment 1, Experiment 2). Then we judge on the early metrics, which move faster and need fewer accounts, and treat retention as confirmation over the following two to three quarters. Experiment 3 runs on existing accounts, so it doesn't compete for the new cohort.

## What we should start measuring

1. **A written definition of inactive,** applied by a rule rather than by judgment, plus the month each account crossed it.
2. **Early adoption signals for every account,** not just inactive ones: days to first transaction, cards active by days 14, 30 and 60, distinct cardholders, and accounting connection date.
3. **Multiple reason tags from a fixed list,** with one marked primary. Have a second person review a sample to check that tagging is consistent.
4. **Firmographics at signup:** headcount, industry, sales channel, and whether an outside bookkeeper or accountant is involved.
5. **A monthly spend trend per account,** so we see decline as it happens instead of after the account goes quiet.
6. **Exit reasons in the customer's own words** for "moved spend" accounts, collected within two weeks of the drop.

With these in place, next year's version of this memo can answer the question this one can't: which early behaviors *predict* inactivity, and which are just signs of a smaller business.
