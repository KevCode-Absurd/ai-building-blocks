---
name: staffing-levels-from-demand
description: Turns the client's own demand data (sales, covers, footfall, bookings, deliveries, tickets or calls) into staff needed by role for each hour, day or week - cleaning closed, sold-out and short-staffed periods, forecasting with a method that fits the pattern, converting demand to people with the client's service rule or an Erlang C queue calculation, adding cover for breaks and absence from the client's history, and setting safety minimums - with low, likely and high cases and the sums shown. Use it before building a rota, for a seasonal peak, or when the owner feels staffing is guesswork.
---

# Staffing levels from demand

The right number of people depends on the work in front of them, hour by hour. This skill builds that number from the client's own data and a rule the client agrees, and shows every step so the manager can challenge it.

Check this with local rules, or ask a qualified employment adviser or accountant. This skill sets staffing levels; it does not decide what the law requires for breaks, hours or ratios.

## When to use

- Before building a weekly rota or changing opening hours.
- Before a seasonal peak, to size seasonal hiring by week.
- When queues, long waits or idle staff point to the wrong staffing pattern.
- When a call centre, help desk or till line needs sizing against a target wait.

## What you need

1. **Demand data:** 8 to 12 weeks of hourly or half-hourly data for a rota; at least one full year by week for a seasonal plan. Sales, transactions, covers, footfall, bookings, tickets or calls.
2. **Notes on odd periods:** closures, sold-out days, short-staffed shifts, events, promotions, weather.
3. **The service rule** per role, from the client: covers per server per hour, orders picked per hour, patients per carer, or a target wait time and average handling time for queues.
4. **Fixed needs:** opening and closing tasks, deliveries, minimum people on site for safety, any staffing ratio the client must meet.
5. **Time away from the client's history:** breaks, holiday, sickness and training as hours lost.
6. **Location**, so the right official rules are pointed to later.
7. **Access:** level 1 to the till, booking or help desk data and the rota tool, or an export.

## Steps

### 1. Pick the driver
Choose the measure that best predicts work for each role. Kitchen and floor may differ (covers versus orders). If the client has two candidates, check which tracks hours worked better over the past weeks and say why.

### 2. Clean the history
Flag closed periods, sold-out or short-staffed periods, and one-offs. Treat sales in short-staffed or sold-out periods as a floor, not the real demand. Remove one-offs from the base and add them back as known events.

### 3. Forecast
- **Weekly rota:** for each weekday and hour, the average of the recent clean weeks, adjusted for any trend and known events.
- **Seasonal plan:** last year's same weeks, scaled by the client's view of growth, with this year's calendar (holidays shift).
- **Several cycles at once** (hourly data with daily and weekly patterns): a seasonal decomposition with more than one seasonal period, as set out in Hyndman and Athanasopoulos.
Give low, likely and high values. Say how far past forecasts were off if the history allows.

### 4. Convert demand to staff
- **Service rule:** staff needed = forecast ÷ the rule's rate, rounded up, by role.
- **Queues (calls, chats, tills):** workload in erlangs = arrivals per hour × average handling time in hours. Use Erlang C to find the staff needed so the chance of waiting, or the average wait, meets the target. Note that Erlang C assumes nobody gives up waiting, so it tends to overstate staff; say so and compare with how the queue behaved in practice.
Show the rule or formula and one worked line.

### 5. Add fixed needs and minimums
Add opening, closing and delivery tasks as hours. Apply safety minimums and any ratio the client must meet, whichever is higher than the demand figure.

### 6. Add cover for time away
Convert planned staff hours to rostered hours using the client's own loss rates for breaks, holiday, sickness and training. If the client has no history, use a labelled placeholder and ask; do not borrow a figure.

### 7. Summarise
By role: staff needed per hour (rota) or per week (season), total hours, and the cost at the client's rates. Mark the peak hours and the quiet hours where one fewer person would do.

## Checks

- Every number traces to the client's data or a stated rule.
- Short-staffed and sold-out periods were not read as low demand.
- Low, likely and high cases are shown.
- Minimums and ratios were applied after the demand calculation.
- Time-away allowances come from the client's history or are labelled placeholders.
- The output carries: *Check this with local rules, or ask a qualified employment adviser or accountant.*
- No personal data beyond what is needed.

## Output format

1. Summary: driver, rule, method, peak hours, total hours and cost per week.
2. Staffing table: period, forecast (low, likely, high), staff needed by role.
3. Worked example line for the rule or queue calculation.
4. Assumptions and placeholders.
5. What I could not check.

## Example of good output (short)

*Illustrative structure, not a real business: a café, one site in Bristol, open 7am to 4pm. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Driver:** covers per hour (12 clean weeks; two short-staffed Saturdays treated as floors). **Rule:** one server per 18 covers an hour, one barista per 30 drinks an hour, at least two staff on site at all times.
>
> | Saturday | Covers (low / likely / high) | Servers | Baristas | On site |
> |---|---|---|---|---|
> | 08:00 | 22 / 28 / 34 | 2 | 1 | 3 |
> | 10:00 | 41 / 50 / 58 | 3 | 2 | 5 |
> | 12:00 | 55 / 64 / 72 | 4 | 2 | 6 |
> | 15:00 | 14 / 18 / 23 | 1 | 1 | 2 (minimum) |
>
> **Worked line:** 12:00, 64 covers ÷ 18 = 3.6, rounded up to 4 servers.
> **Time away:** 9% of rostered hours lost to breaks and absence over the last 12 weeks (from the café's timesheets), added to weekly hours.
>
> *Check this with local rules, or ask a qualified employment adviser or accountant.*
