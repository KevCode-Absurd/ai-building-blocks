# New cancel flow: one screen, one matched offer per reason

**The decision.** Retire the 50% off for everyone. Each reason gets one fair option, or none, on a single screen. "Cancel my subscription" stays on that screen the whole time. One tap on it cancels. There is no second offer and no "are you sure" step.

**What it keeps (projection, per month's 24,000 cancel starts):**

| | Today | New flow | Change |
|---|---|---|---|
| Still paying 90 days later | 842 | 2,210 | **+1,368** (range +1,230 to +1,680) |
| Monthly revenue from them | £7,580 | £18,650 | **+£11,070 a month** |
| Revenue in their first 12 months | £83,100 | £181,300 | **+£98,200** |

Twelve monthly groups add about **£1.18m** over each group's first year. It also ends £29,160 a month of half-price discounts, where 61% of takers cancelled anyway.

**The bad news.** The pause does 80% of the work (1,771 of 2,210). Without it, this flow keeps about 440 a month, fewer than today's 842. Do not launch without it.

**First move this week:** rebuild the 1-month pause in the new billing system. It is the sprint's critical path.

## Who sees what

| Reason | Share | Who sees it | What they see | Why |
|---|---|---|---|---|
| No time right now | 31% (7,440) | Everyone | 1-month pause | 2025 test: 34% took it; 70% of them still paying at 90 days |
| Too expensive | 22% (5,280) | Monthly plan (64%, 3,379) | Switch to 12-month plan | 45% less a month, at a price we already sell |
| Too expensive | | 12-month plan (1,901) | Plain exit, end date shown | Already on our lowest price |
| Reached my goal / trip over | 18% (4,320) | Everyone | Plain exit, progress kept | 40% came back within 6 months at full price, no offer. A discount gives money away |
| Not making progress | 16% (3,840) | Everyone | Set a lesson reminder | 72% never set one. Learners with one do 2.1 times as many lessons a week |
| Switching apps, Other | 13% (3,120) | Everyone | Plain exit, optional comment box | No real match to offer |

## The screens

**Way in:** Account > Subscription > "Cancel my subscription", in the app and on the web.

### Screen 1: reason and option (the only save screen)

**Title:** Before you go, what's changed?
**Subtitle:** Pick one. It helps us help you.
**Button, always visible, active once a reason is picked:** Cancel my subscription

Picking a reason opens its panel below the list, on the same screen.

**No time right now**
> Busy weeks happen. Take a break instead?
> Pause for 1 month. You won't be charged, and your progress stays saved. On {resume_date}, pick up where you left off. We'll email you 3 days before.
> [Pause for 1 month] [Cancel my subscription]

**Too expensive (monthly plan)**
> Pay 45% less each month.
> Switch to the 12-month plan for {annual_price}. You keep every course and all your progress.
> [Switch to 12 months] [Cancel my subscription]

**Too expensive (12-month plan)**
> Thanks for telling us.
> Your plan stays open until {end_date}, so keep learning until then. You won't be charged again.
> [Cancel my subscription]

**Reached my goal / trip over**
> You did it. Congratulations!
> Your progress stays saved. When the next trip comes up, pick up where you left off.
> [Cancel my subscription]

**Not making progress (no reminder set)**
> Let's make it easier to keep going.
> Learners with a daily reminder finish about twice as many lessons a week. Pick a time, and we'll nudge you for one short lesson.
> [Set my reminder] [Cancel my subscription]

*(Reminder already set: same panel, button reads "Change my reminder time".)*

**Switching to another app / Other**
> Thanks for learning with us.
> Anything you'd like us to know? (optional) [text box]
> [Cancel my subscription]

### Screen 2: done

**Cancelled:**
> Your subscription is cancelled.
> You can keep learning until {end_date}. You won't be charged again. Details are on their way to {email}. Your progress stays saved, so pick up where you left off any time.
> [Back to my lessons]

**Paused:**
> Your plan is paused until {resume_date}.
> No charge until then. We'll email you 3 days before. You can still cancel any time in Account.

**Switched:** "You're on the 12-month plan for {annual_price}. Your next lesson is waiting."

Each outcome also gets a confirmation email with the same facts.

## Build rules

- One required question, one panel, one tap to cancel. A "no" ends the flow.
- No timers, no "last chance", no guilt words, no extra screen.
- Variables in {braces} come from billing.
- Legal signs off Screen 1 before launch. It is the only save screen.

## Measure from day one

Per reason: shown, accepted, cancelled, still paying at 90 days. Plus time to cancel and complaints. After 4 weeks, check the two untested guesses below. If the 12-month switch is under 5%, test new wording, not a discount.

**Projection basis:**
1. Kept subscribers are worth £9 a month. Switchers count as £4.95 (45% less), which undercounts them if the monthly plan costs more than £9.
2. The 2025 pause results repeat. The two untested offers are taken at today's 9%, and reminder setters stay like today's discount takers (39%). Range: 5% to 15% take-up, 39% to 70% staying.
3. After 90 days, kept subscribers leave at the usual 6% a month.

## Bolder move: reminders before anyone cancels

The 72% gap starts long before the cancel screen. Ask every new subscriber to set a reminder after their first lesson. Each 10% drop in "not making progress" cancels keeps 384 subscribers a month, worth £3,456 a month. **First step:** show the prompt to half of new sign-ups for 8 weeks and compare cancels. **Risk:** reminder users may just be keener learners, so the reminder may not cause the 2.1 times gap. The test will tell.
