---
name: push-and-in-app-messages
description: Plans and writes an app's push notifications and in-app messages - the moments that matter, a message map (trigger, audience, timing, frequency cap, goal, deep link, stop rule), copy in two versions where a test will teach something, the notification permission screen with an honest reason and a 'Not now' path, and the numbers to watch. Follows iOS and Android permission guidance and Apple's opt-in rule for promotional push. Saves campaigns as drafts at access level 2; sends approved campaigns to agreed audiences only at level 3 within the client's limits; a new audience needs a fresh yes. Use it when users go quiet in week one, turn notifications off, or the app has no messaging plan.
---

# Push and in-app messages

## When to use

- People install, open once or twice, then go quiet.
- Many users have turned notifications off, or opt-in is low.
- A new feature needs to reach the people who would use it.
- The app sends messages but nobody knows which ones work.

## What you need

1. The app's main screens and the moment people first get value ("first success").
2. The events the app sends to analytics or the messaging tool, with names, and the user properties available (plan, country, time zone, last open).
3. Current messages with their sends, opens, actions and opt-outs, if any.
4. Whether the app has in-app marketing consent and an in-app opt-out (Apple requires both for promotional push).
5. The Android target SDK version (from the developer), because apps targeting Android 12L or lower can't choose when the permission dialog appears.
6. The client's tone of voice and any words to avoid.
7. Access: level 1 to read results. Level 2 to save campaigns as drafts. Level 3, within the client's limits, to send approved campaigns to agreed audiences.

## Steps

### 1. Find the moments that matter

- First open: what must happen in the first session?
- First success: the action that predicts people stay (booking made, first workout logged, first bill added).
- Stalled step: where people stop (onboarding step 3, empty cart, half-set goal).
- New value: a feature, content or event they'd want.
- Signs of leaving: no open for a period the client's data shows is a warning sign.

### 2. Plan the permission moment

- **Android 13 and later:** notifications are off by default for new installs and need the POST_NOTIFICATIONS permission. Ask after people see the value, or from an action: tapping a bell, following something, placing an order.
- **iOS:** ask in context, not at first launch; only the first request shows the system prompt, so a wasted "no" is hard to win back. Consider provisional authorization, which sends quiet trial notifications to Notification Center where people choose Keep or Turn Off.
- Write the pre-prompt screen: the value in one line, what kind of messages and roughly how often, a "Turn on" button that shows the system prompt and a "Not now" that does not.

### 3. Build the message map

For each message, one row:
- **Trigger:** the event (or its absence) that starts it.
- **Audience:** who qualifies and who is excluded (already did it, opted out of marketing, in a quiet period).
- **Timing:** delay after the trigger, in the person's time zone, outside quiet hours.
- **Frequency cap:** the most messages per person per day and week, across all campaigns.
- **Goal:** the one action you want.
- **Deep link:** the screen it opens. Never the home screen if a better one exists.
- **Stop rule:** stop when the person acts, or after they ignore several in a row.
- **Type:** transactional (order updates, reminders they asked for) or promotional (needs marketing opt-in on iOS).

### 4. Write the copy

- Lead with what the person gets, not your feature: "Your 3 bills due this week" not "Check out our new bills screen".
- Be specific and true. No false urgency, no fake scarcity, no guilt.
- Keep the key words at the start, because long titles and bodies get cut on lock screens. Check the client's tool preview on a small phone.
- Two versions only where a test would teach something (benefit versus curiosity, for example), not for every message.
- In-app messages: headline, body, button text, when it shows, when it stops. Banners for light nudges; modals only for things that matter now.

### 5. Plan a re-engagement series

Three to five messages over about two weeks, each with a new reason to come back (their own data, a new feature, an event), and a stop rule. After the series, stop. Don't send to people who opted out of marketing.

### 6. Check the rules

- Promotional push on iOS only with consent wording in the app and an in-app opt-out.
- No ads made to look like notifications (Google Play).
- No messages that offer rewards for ratings (Google Play lists this as a violation).
- People can see how many notifications an app sends each day and switch them off, so every message must earn its place.

### 7. Act at the right level

- Level 2: build campaigns and multi-step flows in the messaging tool as drafts; send tests to a test device or internal segment.
- Level 3, after the client's yes on the action list: send approved campaigns to the agreed audiences, within the caps.
- Fresh yes every time: a new audience, a new country, anything promotional to a segment without confirmed consent.
- Log every send with time, audience size and result. Stop and ask if opt-outs or uninstalls jump.

### 8. Measure

Watch for each message: delivered, opened, did the goal action, and opted out or disabled. Compare return rates for people who got a message against a small group who didn't, if the tool supports a holdout (the `growth-marketer` kit has the method).

## Checks

- Every message has trigger, audience, timing, cap, goal, deep link and stop rule.
- The total cap across campaigns is set, not just per campaign.
- Quiet hours and time zones are respected.
- Every claim is true; no false urgency.
- Promotional messages go only to people with marketing consent.
- The permission screen has an honest reason and a "Not now" path.
- Test sends went to a test device before any live send.

## Output format

1. Moments list.
2. Permission plan: platform, moment, pre-prompt screen copy.
3. Message map table.
4. Copy per message: title, body (with character counts), button, versions A and B where useful.
5. In-app message specs.
6. Re-engagement series with stop rule.
7. Numbers to watch and how they're read.
8. Level 3 action list and fresh-yes items.

## Example of good output (short)

*Illustrative structure, not a real business: a running habit app. Copy the shape, never the content: every fact comes from the client's own context.*

> **Permission screen (after the first logged run)**
> Title: "Want a nudge on run days?"
> Body: "We'll remind you on the days you picked, and tell you when a friend beats your time. No more than one a day."
> Buttons: "Turn on reminders" / "Not now"
>
> | Message | Trigger | Audience | Timing | Cap | Goal | Link | Stop rule |
> |---|---|---|---|---|---|---|---|
> | Run day | Planned run day, no run by 17:00 | Reminders on | 17:30 local, not in quiet hours | 1 a day across all | Log a run | Start run | Run logged |
> | Streak at risk | 2 planned days missed | Promotional opt-in | Next morning 08:00 | 1 a day | Log a run | Start run | Run logged or 3 ignored |
>
> **Run day, A:** "Tuesday run? 20 minutes is enough." **B:** "Your Tuesday run is waiting."
