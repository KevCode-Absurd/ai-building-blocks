# Babbel cancel flow: one screen, one matched offer

**The decision.** Replace "50% off for 3 months for everyone" with one screen. The learner picks a reason, and the one offer that fits it appears on the same screen, beside a "Cancel my subscription" button that never moves. Busy learners get the 1-month pause back. Monthly payers who say "too expensive" get the 12-month plan. Learners not making progress get a lesson reminder. Everyone else gets a clean, quick exit.

**What it is worth (projection).** About **2,170 subscribers kept each month**, against about 840 today. That is **about 1,330 more a month, worth about £10,700 a month** in revenue. The range is +930 to +2,740 subscribers (+£8,400 to +£20,000). Over 12 months at October's volume, that adds up to about 16,000 more.

**Bad news.**
- The pause carries most of the gain, and the new billing system cannot do it yet.
- People on the 12-month plan who say "too expensive" get no offer. They already have the lower price.
- We stop giving 50% off to 2,160 people a month. Today, 1,318 of them leave when it ends anyway.

**First move this week:** rebuild the 1-month pause in billing, then the screen.

## What each reason sees

| Reason | Leavers a month | Offer on the screen |
|---|---|---|
| No time right now | 7,440 | Pause for 1 month |
| Too expensive, monthly plan | 3,379 | Switch to the 12-month plan |
| Too expensive, 12-month plan | 1,901 | None. Clean exit |
| Reached my goal or trip is over | 4,320 | None. Clean exit, then an optional trip reminder |
| Not making progress, no reminder set | 2,765 | Set a lesson reminder |
| Not making progress, reminder already set | 1,075 | None. Clean exit |
| Switching to another app | 1,920 | None. Optional "Which app?" box |
| Other | 1,200 | None. Optional "Tell us more" box |

Why no offer for trip leavers: 40% of them came back within 6 months at full price with no offer. A discount would only give money away.

## The screens, word for word

Values in {curly brackets} come from the account.

### Screen 1: the only screen before cancelling

**Heading:** Cancel your subscription

**Line:** Pick the reason that fits best.

**Reasons (one required choice):** the six reasons, worded as today.

**Button, always visible at the bottom:** Cancel my subscription

**The card that appears under the chosen reason:**

**No time right now**
> **Busy month? Take a break instead.**
> Pause for 1 month. You won't be charged. Your plan starts again on {restart_date}, and we'll email you 3 days before. Pick up where you left off.
> [Pause for 1 month]

**Too expensive (monthly plan)**
> **Pay 45% less each month.**
> The 12-month plan costs 45% less a month than your monthly plan. It's {annual_price} for the year. Same lessons, same progress.
> [Switch to the 12-month plan]

**Too expensive (12-month plan)**
> You're already on the 12-month plan, our lower monthly price. If you cancel, you can keep learning until {end_date}.

**Reached my goal or my trip is over**
> Well done! We hope you had some great conversations. You can keep learning until {end_date}.

**Not making progress (no reminder set)**
> **A small nudge helps.**
> Learners who set a lesson reminder finish about twice as many lessons a week. Pick a time that suits you.
> [Set my reminder and stay]

**Not making progress (reminder already set)**
> Thanks for telling us. You can keep learning until {end_date}.

**Switching to another app**
> Thanks for learning with us. Which app are you moving to? (optional) [text box]

**Other**
> Tell us more if you like. (optional) [text box]

### Screen 2: done

**Heading:** Your subscription is cancelled

**Line:** You won't be charged again. You can keep learning until {end_date}. We've sent this to your email too. Come back any time and pick up where you left off.

**Button:** Back to my lessons

**Only for "goal or trip" leavers, below the button:**
> Planning another trip? We can send you one reminder in the month you choose.
> [Choose a month] [No thanks]

This sits after the cancel is done. It is an opt-in, not a save screen.

### Pause reminder email, 3 days before restart

**Subject:** "Your Babbel plan starts again on {restart_date}"

**Body:** "Ready to pick up where you left off? Your next lesson is waiting. Not ready yet? You can cancel here in one tap: [Cancel my subscription]."

## How many more we keep each month

| Offer | Kept | Basis |
|---|---|---|
| No time: pause | 1,771 | 34% pause (2025 test) x 70% still paying at 90 days |
| Too expensive: 12-month switch | 304 | Assumed 9% switch, kept for the year |
| Not progressing: reminder | 97 | Assumed 9% accept x 39% stay |
| **New flow** | **2,172** | **£18,300 a month** |
| Today's 50% offer | 842 | 9% accept x 39% stay after 3 months: **£7,600 a month** |
| **Difference** | **+1,330** | **+£10,700 a month** |

Value: £9 a month per kept subscriber, £4.95 for 12-month switchers. Both "kept" counts are read at about 90 days.

**Range.** The pause alone gives +930 (+£8,400). If the switch and the reminder do as well as the pause (34% accept), the gain is +2,740 (+£20,000).

## Build rules for the sprint

- One screen before cancelling, one offer per person. A "no" is one tap. No second offer, no countdown, no "Are you sure?" step.
- The pause is 1 month, as tested, and restarts on its own.
- Remove the 50% offer from every path.
- Send a cancel confirmation email with the end date.
- What to watch: kept subscribers at 90 days, by reason.
- Legal sign-off: Legal confirms the single screen meets the "as easy as signing up" rule in each market before launch.

**Assumptions**
1. The 12-month switch and the reminder have no test data yet. They are assumed to do as well as today's offer: 9% accept, and 39% of reminder-setters stay.
2. The 12-month plan is paid for the year, so switchers stay 12 months.
3. A kept subscriber is worth the £9 monthly average.
