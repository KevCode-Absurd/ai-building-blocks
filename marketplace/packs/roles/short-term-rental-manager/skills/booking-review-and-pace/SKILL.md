---
name: booking-review-and-pace
description: Turns a messy booking export into a clean monthly review of occupancy, average daily rate (ADR) and revenue per available night (RevPAR) by month and channel, net of platform fees and cleaning, with owner stays and cancellations separated - plus a booking pace check that compares nights already booked for the next 90 days with the same point last year and names the weeks falling behind and the price or rule change to test. Use it monthly, before a pricing review, or when a host asks "are we behind?". Works at level 1 from exports; with level 3 access the agreed rule changes can be applied inside the host's limits.
---

# Booking review and pace

## When to use

- Monthly, to see what moved and why.
- Before changing prices or stay rules, so changes rest on the host's own data.
- When the host worries that next season is booking slowly.
- When comparing channels (Airbnb, Booking.com, Vrbo, direct) on what they really pay after fees.

## Access needed

- **Level 1 (read):** booking exports, calendars and payout reports from each platform, the channel manager or the property management system.
- **Level 2 (read and draft):** the review sheet and a list of proposed changes.
- **Level 3 (read, write and publish):** apply the agreed price or stay-rule changes inside the host's floor, ceiling and ranges, using the `nightly-pricing-and-stay-rules` skill, and log them.

## What you need

1. Booking exports covering at least the last 12 months and, for pace, the same period last year with booking dates (when each booking was made), not only stay dates.
2. Payout reports showing fees by channel.
3. Cleaning and per-stay costs.
4. Nights blocked for owner use or maintenance.
5. Anything unusual: a renovation, a new listing, a platform suspension, a local event that did not happen.

## Steps

### 1. Clean the data
One row per stay: booking date, arrival, departure, nights, guests, channel, gross, fees, net, status (stayed, cancelled, owner, blocked). Convert currencies once. Remove duplicates where a channel manager and a platform both exported the same stay. Owner stays and maintenance blocks come out of "available" nights; cancellations stay in a separate list with their refund and any fee kept.

### 2. Work out the core measures by month and channel
- **Available nights** = nights in the month minus owner and maintenance blocks.
- **Occupancy** = nights sold / available nights.
- **ADR** = room revenue / nights sold (state gross or net, and use the same everywhere).
- **RevPAR** = room revenue / available nights (equal to occupancy x ADR).
- **Net revenue** = gross less platform fees, payment fees and cleaning costs.
Show every sum so the host can check it.

### 3. Compare channels on net, not gross
Platform fees differ and change: on Airbnb most hosts now pay a single host-only fee, about 15.5%, and the older split fee is being phased out. Booking.com charges commission after the stay. Use the fees actually shown in the host's payout reports rather than a published rate.

### 4. Explain what moved
For each month, compare with the same month last year: did occupancy, ADR or both change? Link changes to facts in the data (lead time shortened, more one-night stays, a channel dropped, more cancellations) or to events the host names. Label guesses as guesses.

### 5. Check pace for the next 90 days
- Nights booked so far for each future week, counted as of today.
- The same weeks last year, counted as of the same date last year (use booking dates; this is why they matter).
- The gap in nights and revenue, week by week.
- Mark weeks that are behind, level, or ahead.

### 6. Propose changes, one per problem
- Behind and far out: check that the price and minimum stay are in line with last year; consider a shorter minimum stay before a lower price.
- Behind and close in: a modest last-minute rule within the floor.
- Ahead and far out: test a higher rate on unsold nights.
- Gap nights: a shorter minimum for gaps only.
Each proposal names the nights, the change, the reason and how to tell in two weeks whether it worked.

### 7. Hand over or apply
At level 1 or 2, deliver the review and proposals. At level 3, apply only the changes the host agreed, inside the limits, and log them. Re-run the pace check two weeks later.

## Checks

- Owner stays, blocks and cancellations are out of occupancy and rate.
- ADR and RevPAR use the same revenue definition throughout.
- Channel comparisons use fees from the host's own payout reports.
- Pace compares like with like: the same booking date last year.
- Every proposed change names the nights, the setting and a test date.
- Nothing presented as a market average without a dated source.

## Output format

1. Monthly table: available nights, nights sold, occupancy, ADR, RevPAR, gross, fees, cleaning, net, by channel.
2. Year-on-year comparison with a one-line reason for each big move.
3. Pace table for the next 90 days by week: booked now, booked same date last year, gap, status.
4. Up to three proposed changes with nights, setting, reason and review date.
5. Change log (level 3).

## Example of good output (short)

*Made-up business for illustration: Larchwood Lodges, three cabins in the Lake District, England.*

| Month (2026) | Available | Sold | Occupancy | ADR (net of fees) | RevPAR |
|---|---|---|---|---|---|
| September | 84 | 63 | 75.0% | 131.40 | 98.55 |
| October | 87 | 51 | 58.6% | 118.20 | 69.29 |

**October versus last year:** occupancy down from 66.7% to 58.6%; ADR up 6%. Lead time shortened from 34 to 21 days, and one-night stays rose from 4 to 11 because the two-night minimum was lifted on 1 October. Room revenue fell about 7% (51 x 118.20 = 6,028 against 58 x 111.51 = 6,468).

| Week starting | Booked now | Same date 2025 | Gap | Status |
|---|---|---|---|---|
| 30 Nov | 9 | 14 | -5 | Behind |
| 7 Dec | 12 | 12 | 0 | Level |
| 21 Dec | 18 | 14 | +4 | Ahead |

**Proposals:** (1) 30 Nov week: restore the two-night minimum except for gap nights; review 20 Nov. (2) 21 Dec week: test +10% on the 3 unsold nights; review 1 Dec. (3) Keep October one-night stays for gaps only next year.
