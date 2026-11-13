# Lounge Underwear: 60-day post-purchase plan

**The plan:** fill the silent days after an order first, then make a size swap one step, then put the fit finder in front of every bra buyer.

**What to expect per 90 days once everything is live (projections from your numbers):**

| Measure | Today | Expected |
|---|---|---|
| "Where is my order" tickets | 9,800 (£31,360) | 5,550 to 6,760 (£17,750 to £21,640) |
| Bra return rate | 31% (9,300) | 27.4% to 29.3% |
| All returns | 18,640 (22.2%) | 17,560 to 18,130 (20.9% to 21.6%) |
| Refunds as share of returns | 82% | 70% to 75% |
| Costs saved | | £13,600 to £21,700 |
| Sales kept through swaps | | £75,700 to £129,700 |

**Bad news first:** tickets run at 11.7% of orders (9,800 of 84,000). That is structural, not a busy patch. Returns cost £139,800 per 90 days in postage and handling (18,640 × £7.50). A swap is still a return: it keeps the sale but not the £7.50.

**First move this week:** send the dispatch email when the parcel leaves our warehouse, not at the first courier scan.

## Why these moves

- **Tickets:** 62% (6,076) arrive on day 3 to 5. The parcel leaves us, then waits 2.1 days for a courier scan. The customer hears nothing, so she asks.
- **Bra sizes:** 77% of bra returns are size (7,161). Fit finder users return 14%, everyone else 33%. Only 11% find it.
- **Refunds:** refund comes first and pre-selected, and a swap means a new order. As Amira says: "Swapping a size shouldn't mean a whole new order."

## Order of work

| When | What | Owner |
|---|---|---|
| Week 1 | Dispatch email moves to warehouse exit (message 3). New order confirmation with a delivery window (message 1). Old courier-scan email switched off. | Warehouse + email |
| Week 1 to 2 | Fit finder becomes a "Find your fit" button beside the size picker on every bra page. | Web |
| Week 2 | "Running late" message (message 4). Support works the late list each morning. | Email + support |
| Week 3 to 5 | Returns portal rebuild (below). | Web + warehouse |
| Week 4 | Fit check (message 2) and "How's the fit?" (message 5) go live. | Email |
| Week 6 to 8 | Read results. Keep 10% of orders on the old flow for 4 weeks after each launch, for a fair read. | Customer experience lead |

## Returns portal changes

1. Ask the reason first.
2. Show both options on one screen, nothing pre-selected: "Swap my size" first, then "Refund to my card". Refund stays in plain sight.
3. A swap is one step, with no new order. "Too small" shows the next size up first. "Too big" shows the next size down.
4. The swap ships free once the courier scans the return. Repeat buyers with no past returns get theirs straight away.
5. The confirmation repeats what happens and when.

## The messages

Window dates count working days from the order date.

**1. Order confirmation** (order placed)
- Subject: Got it! Your order is in
- Preview: Arriving between {{ window_start }} and {{ window_end }}

Hi {{ first_name | default: "there" }},

**It arrives between {{ window_start }} and {{ window_end }}.** That's 3 to 5 working days.

**You'll hear from us when it leaves.** Tracking wakes up at the courier's first scan, about 2 days after that. Quiet tracking at first is normal.

Button: **View my order**

**2. Fit check** (bra orders that skipped the fit finder, 1 hour after order)
- Subject: New brand, new size? Let's check
- Preview: Find your fit before it arrives

Hi {{ first_name | default: "there" }},

You picked the {{ product_name }} in {{ size }}. Sizes change from brand to brand, so let's be sure.

Our fit finder asks a few quick questions and gives you your size with us. People who use it send back less than half as many bras.

Different size? Change it on the result page before we pack.

Button: **Find your fit**

**3. On its way** (parcel leaves our warehouse)
- Subject: It's on its way, {{ first_name | default: "lovely" }}
- Preview: Still arriving by {{ window_end }}

Your parcel has left us. It should be with you between {{ window_start }} and {{ window_end }}.

Tracking may show nothing for about 2 days, until the courier's first scan. Nothing is wrong.

Button: **Track my parcel**

**4. Running late** (not delivered by end of working day 5)
- Subject: Your parcel is running late
- Preview: We're on it. No need to chase.

Hi {{ first_name | default: "there" }},

Your order should have reached you by {{ window_end }}. It hasn't yet, and we're sorry.

We're checking with the courier and will email you an update by the end of the next working day.

Button: **Track my parcel**

**5. How's the fit?** (bra and loungewear set orders, 1 day after delivery)
- Subject: How's the fit?
- Preview: Wrong size? Swap it in one step

Hi {{ first_name | default: "there" }},

Tried it on, or handed it over?

Love it? Brilliant. Wrong size? Don't refund and start again. Swap it in one step. We send the new size as soon as the courier scans your return.

Button: **Swap my size**

## How the numbers work

- **Tickets:** the new messages answer half to two-thirds of the 6,076 day 3 to 5 tickets: 3,040 to 4,250 fewer, saving £9,700 to £13,600 at £3.20 each.
- **Bra returns:** fit finder use rises from 11% to 20% to 30%. Each extra user returns 19 points less (33% minus 14%): 510 to 1,080 fewer returns, saving £3,800 to £8,100 at £7.50 each. Keen buyers use quizzes more, so expect the lower end.
- **Swaps:** refunds fall from 82% to 70% to 75% of returns: 1,300 to 2,240 orders kept at the £58 average order, before product and postage costs.

Clearer dates should also cut the 558 late-arrival bra returns, not counted above.

**Assumption:** orders can be changed until packed. If not, drop message 2; message 5 does its job.

**What to watch:** tickets per 100 orders, and bra return rate by fit finder use.
