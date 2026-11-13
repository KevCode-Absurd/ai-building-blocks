# Babbel cancel flow: one screen, the right offer for each reason

## The flow

1. **Cancel screen.** One required question: why are you leaving? Picking a reason opens one matching offer on the same screen. "Cancel my subscription" stays at the bottom the whole time: full width, always live, never greyed out. If someone taps it before picking a reason, a line appears: "Pick one reason to finish."
2. **Done screen.** Confirms what they chose.

That is one save screen, and no extra page between the learner and cancelling.

## What each reason sees

| Reason | Share | Offer | Why |
|---|---|---|---|
| No time | 31% | Free 1-month pause | 34% took it in 2025; 70% still paying 90 days later |
| Too expensive, monthly plan | 14% | Switch to 12-month plan, 45% less a month | Lower price, no deadline |
| Too expensive, 12-month plan | 8% | None | Already on our lowest price |
| Goal reached or trip over | 18% | None; optional "remind me later" | 40% return at full price within 6 months anyway |
| Not making progress, no reminder | 12% | Set a lesson reminder | Reminders mean 2.1 times as many lessons |
| Not making progress, has reminder | 4% | Smaller daily goal | Lighter target |
| Switching apps | 8% | 50% off for 3 months | Only group where a price match fits |
| Other | 5% | None; optional comment | We learn why |

## Exact words

**Cancel screen**

> **Cancel your subscription**
> One quick question, then you're done. Why are you leaving?
> I don't have time right now / It's too expensive / I reached my goal or my trip is over / I'm not making progress / I'm switching to another app / Other
> **[Cancel my subscription]**

**Panel for each reason**

*No time:*
> **Life gets busy. Take a break instead?**
> Pause for 1 month. We won't charge you, and your progress stays saved. Your plan starts again on [date]. We'll email you 3 days before.
> **[Pause for 1 month]**

*Too expensive, monthly:*
> **Pay 45% less each month**
> You pay [£9.00] a month now. On the 12-month plan it's [£4.95] a month, paid once as [£59.40]. Same lessons. Same progress.
> **[Switch to the 12-month plan]**

*Too expensive, 12-month:*
> You're already on our lowest price. Your lessons stay open until [date].

*Goal reached or trip over:*
> **Well done! You did it.**
> Your progress is saved. Planning another trip?
> ☐ Email me in [3 / 6] months so I can pick up where I left off.

*Not making progress, no reminder:*
> **Small steps add up**
> Learners with a daily reminder finish about twice as many lessons a week. Pick a time and we'll nudge you.
> [Time picker] **[Set my reminder and keep learning]**

*Not making progress, has reminder:*
> **Try a smaller goal**
> One lesson a day still moves you forward.
> **[Set a smaller goal and keep learning]**

*Switching apps:*
> **Stay for half price**
> Keep your progress and pay 50% less for 3 months. After that it's [£9.00] a month. You can cancel any time.
> **[Get 50% off for 3 months]**

*Other:*
> Anything you'd like us to know? (Optional) [Text box]

**Done screens**

- Cancelled: "Your subscription is cancelled. You can keep learning until [date]. We won't charge you again. Your progress stays saved, so you can pick up where you left off any time." **[Back to my lessons]**
- Paused: "You're paused until [date]. Enjoy the break."
- Switched: "You're on the 12-month plan from [date]."
- Reminder or goal set: "Done. See you at [time] tomorrow."
- Discount: "50% off is on until [date]."

Each result is confirmed by email.

## How many more subscribers we keep

**Assumptions**
- A subscriber is worth £9 a month. A 12-month switcher pays 55% of that, £4.95.
- The annual switch and the reminder are untested. For the switch I use the current offer's 9% take rate; the plan itself keeps them 12 months. For the reminder I use the current offer's net result: 9% accept × 39% stay = 3.5%.
- Groups with no offer or no data count as zero. Anything they bring is extra.

**Today:** 24,000 × 9% × 39% = **842 kept a month**, worth **£7,580 a month**.

**New flow, per month:**

| Group | Cancelling | Kept | Monthly value |
|---|---|---|---|
| No time, pause | 7,440 | × 34% × 70% = 1,771 | £15,940 |
| Too expensive, annual switch | 3,379 | × 9% = 304 | £1,505 |
| Not progressing, reminder | 2,765 | × 3.5% = 97 | £873 |
| Switching, 50% off | 1,920 | × 3.5% = 67 | £607 after discount |
| **Total** | | **2,239** | **£18,925** |

**Result:** about **1,400 more subscribers kept each month** (2,239 vs 842), worth about **£11,340 more a month** from each month's cancellers. If they keep paying for a year, that is about **£136,000** per monthly group, and the groups stack.

We also stop giving half price to people who leave anyway: 2,160 people a month today, about 173 in the new flow.

## Build notes for next sprint

- **Turn the pause back on** in the new billing system. It brings 79% of the subscribers we keep.
- Read plan type and reminder status when the screen loads, to show the right panel. Show real local prices.
- Schedule the "remind me" email for the date picked.
- Log reason, panel shown, offer taken, and paid status at 30, 90 and 180 days.
- Keep 10% of cancellers on today's flow for 8 weeks to test the assumed rates.
- Legal reviews the screens before launch.
