---
name: fair-cancel-flow-and-win-back
description: Designs an honest cancel and save process. Sorts cancel reasons into countable codes, matches one fair option to each reason (pause, downgrade, a fix, a clean exit), lays out a cancel flow that keeps the cancel button in reach, writes save scripts for phone, chat and email that accept a no, an exit survey, and a short win-back series timed by reason. Use it for gyms, studios, subscription boxes, software and service plans when cancellations rise or the cancel process draws complaints.
---

# Fair cancel flow and win-back

## When to use

- Cancellations are rising and nobody knows why.
- The cancel process draws complaints, card disputes or regulator risk (hidden buttons, forced calls, repeated offers).
- The business wants pause and downgrade options but has never set them up.
- Former customers are never invited back, or are invited back with the wrong message.

## What you need

1. Cancellations by month, plan and reason (a billing export such as Stripe cancel reasons, or the team's notes).
2. The current cancel steps on every channel: online, app, phone, email, in person.
3. How customers sign up (online, phone, in person), because the exit should be at least as easy.
4. The options you can afford: pause length, cheaper plan, a fix, a senior call, a discount cap.
5. Any exit answers, call notes or reviews that mention leaving.
6. Where customers are (country and US state) and whether they are consumers.

## Steps

### 1. Code the reasons

Sort every reason into a short list of codes you can count, such as: too expensive, not using it enough, missing a feature, found an alternative, problem with service, moving or no longer needed, payment failed, other. Stripe's portal offers a similar fixed list, which makes counting easy. Count each code by plan and by how long the customer stayed.

### 2. Match one fair option to each reason

| Reason | Fair option |
|---|---|
| Too expensive | Downgrade to a cheaper plan, or a discount within the cap |
| Not using it enough / no time | Pause for a set period, or a lighter plan |
| Missing feature | Honest answer: on the roadmap with a date, a workaround, or not planned |
| Problem with service | Fix it, apologise and offer a call with someone senior |
| Found an alternative | Ask what it does better; no offer unless you have a real match |
| Moving / no longer needed | Clean, quick exit and a thank-you |
| Payment failed | Not a cancel: card update link and retries |

### 3. Design the flow

- The cancel entry point is easy to find, in the same place and channel the customer used to join.
- One question on the reason, then the option for that reason, shown next to a clear cancel button.
- One offer. If they decline, cancel. No second offer, no forced call, no countdown, no guilt.
- Confirm the cancel on screen and in writing, with the end date and what happens to their data.
- In California, consumers who joined online must be able to cancel online, and any save offer sits alongside the cancel option. In the EU, online sales also need a withdrawal function during the 14-day withdrawal period. In the UK, new subscription rules are expected from January 2027. Check this with local rules before launch; I do not give legal advice on cancellation rights.

### 4. Write save scripts

For phone, chat and email, per reason:
1. Listen and thank them for telling you.
2. Confirm the reason in their words.
3. Offer the one option for that reason, in one or two sentences, with the price or terms.
4. If they say no, accept it warmly and process the cancel straight away.
5. Confirm in writing.

Include the words for a firm no ("Understood. I've cancelled it now; you'll get an email in a few minutes confirming the end date.").

### 5. Write the exit survey

The reason codes as a single choice, plus one optional free-text question ("What could we have done better?"). Keep it optional and after the cancel, never as a gate before it.

### 6. Plan win-back

Time messages by reason: before the season for "no time" leavers, when the missing feature ships for "missing feature" leavers, never for those who left over a serious complaint unless it was fixed. Stop after two or three messages. Win-back emails are marketing: they need consent where the law requires it and an opt-out, and they never go to people who opted out.

### 7. Measure

Track saves by reason and offer, cancellations completed, complaints and disputes about cancelling, and how many saved customers leave within the next few months anyway. A save that leaves soon after was a delay, not a save.

### Access needed

- Level 1: read cancellations, reasons and billing.
- Level 2: draft portal settings, coupons, scripts and win-back emails for you to switch on.
- Level 3: apply the agreed pause, downgrade or coupon when the customer chooses it, process cancellations on request, and send win-back emails to the agreed, consented list.

## Checks

- Cancelling takes no more steps than joining, on every channel.
- One offer per cancel, matched to the reason; a no ends the flow.
- No guilt wording, fake deadlines or forced calls.
- Written confirmation of every cancel with the end date.
- Failed payments are routed to billing, not to the save flow.
- Win-back respects opt-outs and stops after a few messages.
- The plan carries the line: *Check this with local rules before launch.*

## Output format

1. Reason codes with counts by plan and tenure
2. Reason-to-option table with costs
3. Cancel flow (screen by screen or step by step, per channel)
4. Save scripts by reason and channel
5. Exit survey
6. Win-back plan (reason, timing, message, stop rule)
7. Measures and the facts and rules to confirm

## Example of good output (short)

> **Illustrative structure, not a real business: a bouldering gym with monthly memberships. Copy the shape, never the content: every fact comes from the client's own context.**
>
> **Cancel screen, reason "I don't have time right now":**
> "You can pause your membership for one, two or three months for £5 a month and keep your locker and member price. [Pause instead] [Cancel my membership]"
>
> **Phone script, firm no:** "No problem at all. I've cancelled your membership; it ends on 30 November and you won't be charged again. You'll get an email in a few minutes. Thanks for climbing with us, and the door's open if you come back."
>
> **Win-back for "no time":** one email in early January, one in early September. Then stop.
