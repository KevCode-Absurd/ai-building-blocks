---
name: nightly-pricing-and-stay-rules
description: Builds a 12-month nightly price calendar for a holiday let, short-stay home or small hotel - a base rate, then season, weekday and event layers the host approves - plus minimum stay, gap-night, last-minute and long-stay rules, a cost per booked night and a break-even rate, with the maths shown under every rule. Use it when prices were set once and forgotten, short gaps sit empty, busy months sell out too early, or discounts stack below cost. With level 3 access it applies prices and stay settings inside the host's floor and ceiling in Airbnb Smart Pricing, a pricing tool or the channel manager; changes outside the limits, special offers and cancellation policy changes need a fresh yes. Check local rules on caps and taxes.
---

# Nightly pricing and stay rules

## When to use

- The same price runs all year, or prices change by gut feel.
- One- and two-night gaps between bookings never sell.
- Peak weeks book out months ahead at last year's rate.
- Weekly, monthly and last-minute discounts stack and nobody knows the lowest price a guest can pay.
- The host is switching on Smart Pricing or a pricing tool and needs a floor and ceiling.

Do not use it to look up rival prices or local events and present them as fact. With web search connected, I can check a named event's official dates and say when I checked; otherwise the host lists them.

## Access needed

- **Level 1 (read):** booking history, calendar, current prices and settings in the platform, channel manager or pricing tool.
- **Level 2 (read and draft):** the price calendar and rules in a sheet, and draft settings for the host to apply.
- **Level 3 (read, write and publish):** apply nightly prices, minimum stays, gap-night settings and discounts inside the floor, ceiling and ranges the host approved. Prices outside those limits, special offers or custom quotes to a guest, and cancellation policy changes need a fresh yes.

## What you need

1. A booking export for the last 12 to 24 months: dates booked, nights, guests, channel, amount paid, fees, cancellations, owner stays.
2. Costs per booked night and per month: cleaning and laundry, supplies, utilities, platform fees, management, mortgage or rent, insurance, local taxes the host pays.
3. The host's income goal, and any price the host will never go below or above.
4. Seasons as the host sees them, and local events with dates (the host's list, or official event pages checked live).
5. Local rules that cap nights or set a minimum stay for the address, or [CHECK LOCAL RULES].

## Steps

### 1. Clean the export first
One row per stay: arrival, nights, channel, gross amount, fees, net amount, status. Remove owner stays and friends' stays into their own list. Mark cancellations separately. Without this, every rate decision rests on wrong numbers.

### 2. Work out cost per booked night and break-even
- Variable cost per stay (cleaning, laundry, supplies) and per night (utilities, consumables).
- Fixed cost per month.
- Platform fee: check the host's actual fee. On Airbnb most hosts now pay a single host-only fee of about 15.5%, mandatory for hosts using property management software.
- Break-even nightly rate at the host's expected occupancy, and break-even occupancy at the current average rate. Show each formula.

### 3. Set the base rate
Start from the host's own history: the average net rate in shoulder months (neither peak nor quiet) with good occupancy. Show the sum. The base rate must sit comfortably above the break-even rate.

### 4. Layer the adjustments, one at a time
- **Season:** a percentage up or down by month or week, from the host's own occupancy and rate history.
- **Weekday:** Friday and Saturday up, or Sunday to Thursday down, depending on the guest mix in the data.
- **Events:** named dates only, each with its source.
- **Lead time:** what happens to unsold nights close to arrival (a modest drop, never below the floor).
Write each rule with its reason and the maths, so the host can change any one layer.

### 5. Write the stay rules
- Minimum stay by season (longer in peak, shorter in quiet months), within any local rule.
- Gap nights: allow a shorter minimum for gaps between existing bookings, rather than discounting the whole month.
- Long-stay discounts (weekly, monthly) and last-minute discounts with a stated floor.
- Check how the platform combines them. On Airbnb, discounts can take the guest price below the Smart Pricing minimum, weekly and monthly discounts override Smart Pricing, and Smart Pricing overrides rule-sets. Work out the lowest price a guest could pay and confirm it stays above break-even.

### 6. Show the total price where the law asks
For US listings, adverts and quotes must show the total price including mandatory fees such as cleaning (FTC fees rule, in force since 12 May 2025). Check the cleaning fee and the nightly rate together, because guests compare the total.

### 7. Apply, test and log
At level 2, hand over the calendar and a settings sheet. At level 3, apply within the agreed floor and ceiling, check that the calendar shows the intended prices on a sample of nights, and log every change. Remember that price changes do not affect existing bookings on Airbnb. Review after two to four weeks with the `booking-review-and-pace` skill.

## Checks

- Owner stays and cancellations are out of the rate history.
- Every rule shows its maths and its reason.
- The lowest possible guest price, after every discount, stays above break-even.
- Every event date has a source, or came from the host.
- US listings show a total price including mandatory fees.
- Local caps or minimum stays are respected, or marked [CHECK LOCAL RULES].
- Every live change was inside the agreed limits and is logged.

## Output format

1. Cost per booked night and break-even table, with formulas.
2. Rules table: rule, nights it applies to, setting, reason, maths.
3. Twelve-month price calendar by night (sheet), with minimum stays.
4. Settings sheet for each platform or tool (floor, ceiling, discounts, minimum stays).
5. Change log (level 3).

## Example of good output (short)

*Illustrative structure, not a real business: one two-bed holiday let in Norfolk, England. Copy the shape, never the content: every fact comes from the client's own context.*

| Rule | Applies to | Setting | Reason and maths |
|---|---|---|---|
| Base rate | All nights | 140 | Average net rate Apr, May, Sep, Oct 2025 at 78% occupancy = 138; rounded |
| Summer | 18 Jul - 31 Aug | +30% (182) | Booked out by March in 2025 at 150; room to rise |
| Winter weekdays | Sun-Thu, Nov-Feb | -20% (112) | 31% occupancy last winter; stays above the host's floor of 96 |
| Minimum stay | Summer | 4 nights | 2025 summer stays averaged 5.2 nights |
| Gap nights | Any 1-2 night gap | Minimum 1 night | 14 unsold gap nights in 2025 |
| Weekly discount | 7+ nights | 10% | Lowest guest price with a 5% last-minute discount: 112 x 0.9 x 0.95 = 95.76, **below the floor of 96**, so the winter last-minute discount is capped at 4% (112 x 0.9 x 0.96 = 96.77) |

**Cost per booked night:** cleaning and laundry 65 per stay / 3.1 nights average = 21.0; utilities and supplies 14; so variable cost 35.0 a night. Fixed costs 1,150 a month / 16 booked nights = 71.9. Platform fee 15.5% of the rate.
- Full break-even rate = (35.0 + 71.9) / (1 - 0.155) = **126.5** at last year's 16 booked nights a month. The base rate of 140 clears it.
- Variable-only break-even = 35.0 / 0.845 = **41.4**. The host chose a floor of 96 for quiet nights, which covers variable costs and part of the fixed costs.
