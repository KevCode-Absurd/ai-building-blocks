# When to use this review

**What it does:** Reviews the evidence you give about Meta event matching. It marks which customer fields each event sends, finds hashing mistakes, checks that browser and server events share an event ID, and ranks the fixes. It does not calculate a revenue figure.

## Run this when

1. Events Manager shows a low or middling match quality score for Purchase.
2. You have just added server events and want a second check.
3. Meta and your store disagree on sales and you suspect double counting.

## Before you run

- The match quality score for each event, copied from Events Manager, with its date range.
- A redacted list of the customer fields each event sends (yes or no for each). No real customer data.
- How events are sent, and whether browser and server share an event ID.

## What you get back

- A review of each event: supplied score, fields sent and not sent, hashing issues, priority.
- Where each missing field would come from.
- Duplicate-event findings, using only the evidence you gave.
- Fixes in order, and what to read again in Events Manager after new data.

## Chains well with

- The Meta Ads 30-check account auditor, for the whole account.
- The Meta server tracking checker, if you still need to choose a server route.
