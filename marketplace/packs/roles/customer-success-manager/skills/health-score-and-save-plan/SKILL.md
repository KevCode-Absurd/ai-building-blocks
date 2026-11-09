---
name: health-score-and-save-plan
description: "Builds a simple customer health score from signals the business can actually see, sorts accounts into green, amber and red with the reason for each, and writes a save plan for at-risk accounts: the likely cause (marked fact or guess), who to talk to, one fitting action and a draft message. Use it for a weekly health report, before renewals, when a key account goes quiet, or when churn keeps surprising the team."
---

# Health score and save plan

## When to use

- Churn surprises the team: customers marked happy cancel, or nobody knows who is at risk.
- A weekly or monthly health report is needed for 10 to a few hundred accounts.
- A key account has gone quiet, raised a complaint or changed its main contact.
- Renewals are coming up and the owner wants to know where to spend time.

## What you need

1. An account list: plan, monthly or annual value, start date, renewal date and owner.
2. Usage signals you have: last login, active users, use of the core feature, or orders for a product business.
3. Support history: open tickets, repeat issues, complaints.
4. Billing: failed or late payments, downgrades, credits.
5. Relationship notes: main contact, champion, recent changes, a rival mentioned.
6. What actions you can afford: a call, training, a fix, a pause, a downgrade, a discount within a cap.

## Steps

### 1. Pick the signals

Choose a few signals that the business can see for every account and that plausibly link to leaving. Typical ones: core feature use against what the plan expects, active users against seats bought, open or repeated issues, payment problems, contact with the champion, days to renewal. Drop any signal you cannot measure for most accounts.

### 2. Set the rules in words first

For each signal write what green, amber and red mean ("Red: no login by any user for 30 days" only if the business agrees that threshold fits its product). Do not copy weightings from vendor blogs. Start with simple rules: any red signal makes the account amber at least; two reds make it red. Then check the rules against history: did last year's churned accounts score red before they left? Adjust until the score would have caught most of them, and write down what you changed.

### 3. Score and explain

Score every account. For each one, show the signals behind the score in plain words ("Reports not opened since 2 September; 3 tickets on exports in October"). A score with no reason is not used.

### 4. Separate payment problems

Accounts whose main signal is a failed payment go to a billing fix list: retry settings, a card update link and a plain reminder. In Recurly's July 2026 data about a third of churn was involuntary. Do not send a save offer to someone whose card simply expired.

### 5. Find the likely cause for amber and red

Read tickets, notes and usage for each. Write the likely cause and label it **fact** (stated by the customer or shown in data) or **guess** (your reading). Common causes: never reached the first win, champion left, a problem not fixed, price pressure, a rival, the need has gone.

### 6. Choose one action per account

Match the action to the cause: training or a set-up session for low use, a fix and an apology for a problem, an introduction to the new decision maker when the champion left, a downgrade or pause for price pressure, a plain thank-you and a question for quiet but healthy accounts. Discounts only within the cap the owner approved. Give each action an owner and a date.

### 7. Write the save messages

One specific reason to talk drawn from the account, one question, an easy reply. No guilt, no invented results. If the customer may leave, the message still makes the cancel route clear.

### 8. Report

One table, sorted red, amber, green, then by value and days to renewal. Add what changed since last time and three patterns across accounts worth fixing at the root.

### Access needed

- Level 1: read accounts, usage, tickets and billing.
- Level 2: write scores and notes as drafts or tasks; save messages as drafts.
- Level 3: update health fields, create tasks for owners, send the save messages and apply offers inside the agreed caps and segments.

## Checks

- Every score shows its reasons; every cause is labelled fact or guess.
- The rules were tested against accounts that churned before.
- Failed-payment accounts are handled as billing, not as saves.
- Each at-risk account has one action, an owner and a date.
- Offers stay inside the approved cap; anything above it is flagged for the owner.
- Messages use only facts from the data and keep the cancel route honest.

## Output format

1. Health rules (signal, green, amber, red, data source)
2. Back-test note: how the rules scored past churned accounts
3. Health table (account, value, renewal date, score, reasons, likely cause with fact or guess, action, owner, date)
4. Billing fix list
5. Draft save messages for red accounts
6. Changes since last report and three root-cause patterns
7. Data I did not have

## Example of good output (short)

> **Illustrative structure, not a real business: a scheduling software company serving care homes. Copy the shape, never the content: every fact comes from the client's own context.**
>
> | Account | Score | Reasons | Likely cause | Action | Owner, date |
> |---|---|---|---|---|---|
> | Home 14 | Red | 2 of 12 managers logged in since 1 Oct; 3 tickets on shift swaps | **Fact:** swap bug reported 4 Oct, fixed 28 Oct. **Guess:** staff went back to paper | 30-minute retraining call, offer to re-import rotas | Priya, 12 Nov |
> | Home 3 | Amber | Champion Dana left in Sept (email bounce) | **Fact:** new manager not yet met | Intro email to new manager with a 15-minute set-up offer | Priya, 8 Nov |
>
> **Draft to Home 14:** "Hi Joe, the shift swap bug your team hit in October is fixed as of 28 October. I can see most managers haven't been back since. Could I take 30 minutes with your team next week to re-import this month's rotas and show the swap screen? If [Product] isn't the right fit any more, tell me that too and I'll make leaving simple."
