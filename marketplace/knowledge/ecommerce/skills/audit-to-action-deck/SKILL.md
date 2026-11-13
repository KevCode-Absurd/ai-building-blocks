---
name: audit-to-action-deck
description: "Turns findings from an ad or store audit into a short, roughly ten-slide deck that shows the owner, a partner or an investor what each problem costs and what fixing it is worth, so the right fixes get funded. Every money figure is built from the store's own gross profit per order and its own volumes, shown as a low, likely and high range with the method on the slide, never from borrowed benchmarks. Fixes are ranked by expected gross profit per unit of cost, the cost of the work is framed as a payback, and each claim carries its source. Use after store-meta-audit, google-ads-account-audit or any store review, when a decision about money or effort is needed."
---

# From audit findings to a deck that gets fixes funded

**You get:** a deck of about ten slides (Google Slides, PowerPoint or PDF) showing what each audit finding costs and what fixing it is worth, with a findings and money source sheet and a one-screen summary.

An audit lists problems. A decision-maker needs to know which three matter, what they cost each month, what fixing them is worth, and what it costs to fix. This skill builds that deck from the store's own numbers, with ranges and methods a sceptical reader can check.

## When to use

- An audit is done and the owner must choose which fixes to pay for.
- A partner or co-owner needs the case for spending on fixes.
- An investor or lender asks what is wrong and what fixing it is worth.
- An agency or freelancer must justify a proposed scope of work with money, not adjectives.

## Not for

- Running the audit itself: use `store-meta-audit`, `google-ads-account-audit` or `store-meta-landing`.
- The regular monthly picture: use `monthly-store-performance-report`.
- Building gross profit per order: use `store-meta-math` first.

## What you need

Required:

1. **The audit findings**, each with its evidence (export rows, screenshots, dates).
2. **Store numbers for the last 90 days** from Shopify: orders, net sales, new and returning customers, sessions, conversion rate, average order value; and total ad spend by channel.
3. **Gross profit per order** from `store-meta-math`, built from delivered costs.
4. **The cost of the proposed work**: hours or fees per fix, any tool costs, and the time to deliver.
5. **The audience**: owner, partner, investor or lender, and the decision they must make.

Optional: brand assets for the deck, prior results from similar fixes at this store, `recommendation-scorekeeping` hit rates.

If gross profit per order is missing, stop and build it. If the cost of the work is missing, the deck shows value only and says "cost to be quoted"; no payback slide.

Access: level 1. The deck is shared by the client with whom they choose.

## Before you start: the gates

1. **Gross profit per order known.** Fail: stop. A money figure from revenue or product margin overstates the stakes badly: a 70% product margin was 24% once every delivered cost was counted [MEA-0023]. Gross margin must be the delivered cost to the customer's door [MEA-0037].
2. **Cash and capacity stated.** Pass when the client has said what they can spend on fixes and who can do the work. Fail: rank fixes, state the budget and owner assumed in one line each, and date the plan on that basis.
3. **Findings trusted.** Each finding needs evidence. A finding with no number or source is dropped from the deck, not softened.

## Steps

### 1. Pick the findings that carry money

From the audit, keep findings where money is at stake: lost orders, wasted spend, lost margin, or cash tied up. Merge findings that share one cause. Aim for 3 headline findings and up to 7 more in a table. Process or hygiene findings with no money effect go to an appendix.

Sort them into two kinds and never add the two into one headline figure:
- **Leaks:** money the store is losing now, seen in its own data (spend on campaigns that lose money, refunds from a broken page). Observed.
- **Openings:** money the store could make with a change (a better offer, a new channel). Modelled.

Also name one real strength from the audit. It shows the reader the review was fair, and it tells them what not to touch.

### 2. Put a money range on each finding

Method, written on the slide for every finding:

Monthly money at stake = affected base x size of the gap x gross profit per unit.

- **Affected base:** the store's own volume the problem touches (orders, sessions, spend) per month.
- **Gap:** how far the current number is from a fixed state, using the store's own history or test results first. Where none exist, use a cautious practitioner default and label it. Mature pages realistically gain 1 to 5% from a winning change, and claimed lifts above 50% should be re-tested [CRO-0012]; keep assumed lifts inside that.
- **Gross profit per unit:** gross profit per order, or per extra order at the margin.

Give three values: low (half the likely gap), likely, high (one and a half times the likely gap), practitioner defaults. Wasted spend findings (spend on campaigns losing money on the store basis) use the observed loss as "likely".

State the time window and whether each figure is observed or modelled, as any careful reader will ask [MEA-0038]. Lead with the monthly likely figure. An "annual impact" that adds leaks and openings at their high case anchors the reader on a number the method cannot support; if a yearly figure is needed, show likely monthly x 12 and say so.

### 3. Rank fixes by expected profit per cost

Expected monthly gross profit of a fix = chance it works x likely money at stake [CRO-0013]. Chance it works: 0.8 for fixing a clear breakage (tracking, broken page, disapproved feed), 0.5 for a proven-elsewhere change, 0.2 to 0.3 for a new idea, practitioner defaults. If `recommendation-scorekeeping` shows this store's hit rate for the type, use it instead.

Rank = expected monthly gross profit / cost of the fix. Breakages usually rank first because they are cheap and near-certain.

For scale-related findings, value the extra sales at their marginal cost, not the average [ADC-0049].

### 4. Frame the investment as a payback

Payback months = cost of the work / likely expected monthly gross profit. Also show the break-even condition in plain words: "The work pays back in 3 months if fix 1 recovers at least 40 orders a month." Judge fixes that work through repeat buying or order value on 60 to 180-day cash, not 30 days [FIN-0029]. Use the first-order and 90-day profit bands for acquisition fixes: gross profit per customer under CAC loses money; 2 to 3 times is the zone to scale [MEA-0024].

**When an agency or freelancer presents the deck:** their fee is the cost of the work, shown against the likely gain on the store's own margin, with the same payback test. Proof of past results only if it is real, from the same kind of store, and shared with that client's permission; otherwise leave the proof slide out. No "industry benchmark" audit score, and no hiding the method to keep the work: the reader is paying to decide, so they get the method.

### 5. Build the deck, about ten slides

1. **The answer.** One sentence: the problem, the likely monthly money at stake, the fix and the decision asked.
2. **Where the store stands.** Last 90 days, store numbers, each with a source tag.
3. **How the store makes money.** Gross profit per order as a short waterfall from price to profit.
4. **Scorecard.** Each audit area rated good, needs work or broken, with one line of evidence.
5. **Finding 1** with its money range, method and evidence.
6. **Finding 2.**
7. **Finding 3.**
8. **Other findings.** Table with money ranges, ranked.
9. **Action plan and investment.** Fixes in rank order, owner, dates, cost, expected profit, payback.
10. **How we will know.** For each fix, the number that proves it worked, the review date, and what happens if it does not. Then the decision asked.

Fixes the store can finish in week one go first in the plan. No "today versus in 12 months" revenue table; show targets as ranges with the review date instead. For a shorter deck, cut slide 4, then slide 2; never cut the findings, the plan or the decision.

Before sending, say the deck in three sentences: what is broken and what it costs; what to do and what it is worth; what decision is asked. If that is hard, the deck is not ready.

Audience changes emphasis, not numbers: an owner sees the week-one actions; a partner sees risk and who does the work; an investor or lender sees payback, cash and what is observed versus modelled.

### 6. Write it plainly

One point per slide, stated in the title. Numbers rounded to what the method supports. No adjectives in place of numbers. No benchmark from another business stands in for the store's own figures; if one is used as context, it is labelled as such and never multiplied into money.

### 7. Run a sceptic's pass

Give the deck to a reviewer who has not seen the audit. They mark any slide where a number has no source, a method is missing, or the high case drives the conclusion. Fix each one. The deck stands on the likely case.

## Checks before you hand it over

- Every money figure uses the store's own gross profit per order and own volumes.
- Every finding shows low, likely and high with its method on the slide.
- Each figure states its window and whether it is observed or modelled; leaks and openings are never added into one headline.
- Fixes are ranked by expected profit per cost, and the ranking adds up.
- Payback uses the likely case, and its break-even condition is stated in words.
- No benchmark from another business is multiplied into a money figure.
- The deck is about ten slides; extra detail sits in an appendix.
- Nothing in the deck commits the client to spend; the decision slide asks.

## Output

**The deck** (Google Slides, PowerPoint or PDF), about ten slides as in step 5, with an appendix of methods and evidence.

**Table "Findings and money" (appendix and source sheet):** Rank, Finding, Evidence, Affected base per month, Gap (and source), Gross profit per unit, Low, Likely, High, Observed or modelled, Chance it works, Expected monthly gross profit, Fix cost, Payback months.

**One-screen summary for the sender:** the three headline findings with likely money, total likely monthly gross profit at stake, total fix cost, payback, and the decision asked.

## Common mistakes

- **Money from revenue or product margin.** Gate 1 uses delivered gross profit [MEA-0023].
- **Borrowed benchmarks as the gap.** Step 2 uses the store's own history first and caps assumed lifts [CRO-0012].
- **Single-number promises.** Step 2 gives a range with its method.
- **Ranking by size, not by return on the fix.** Step 3 divides by cost.
- **Valuing extra sales at average cost.** Step 3 uses marginal cost [ADC-0049].
- **Mixing observed and modelled figures.** Step 2 labels each [MEA-0038].

## Sources

- ADC-0049: value extra sales at marginal cost.
- CRO-0012: realistic lifts; big claims need re-testing.
- CRO-0013: rank ideas by expected gross profit.
- FIN-0029: judge some fixes on 60 to 180-day cash.
- MEA-0023, MEA-0037: gross margin is delivered cost to the door.
- MEA-0024: gross profit to CAC bands.
- MEA-0038: ask the window and observed or modelled.

What makes this skill ours: every money figure built from the store's own delivered gross profit and volumes; a low, likely and high range with its method on the slide; fixes ranked by expected profit per unit of cost, with the store's own hit rates where they exist; and a payback slide that states, in words, what must happen for the work to pay.
