# Raycast launch plan: 13 November to 22 December 2026

**Assumptions.** Launch goes live Tuesday 8 December at 16:00 UK (08:00 Pacific). The code freeze stops new features, not hotfixes. We can stage the in-app update for existing users. Drafts use ⌥ Space, the default hotkey. Names in [brackets] are placeholders to fill before posting.

## 1. Channels ranked by users who stay

| Rank | Channel | Installs | Active in week 4 | Users who stayed |
|---|---|---|---|---|
| 1 | YouTube creator walkthroughs | 11,000 | 41% | 4,510 (about 750 per video) |
| 2 | Extension authors sharing | 6,500 | 38% | 2,470 |
| 3 | Our X account | 17,000 | 22% | 3,740 |
| 4 | Hacker News | 21,000 | 14% | 2,940 |
| 5 | Product Hunt | 38,000 | 9% | 3,420 |

Product Hunt brought the most installs, but 91 in 100 were gone by week 4. Creators and authors bring people who stay, and both can grow. We had 6 videos last time; at that rate, all 9 past creators would keep about 6,750 users. No author got early access last time; all 1,500 get it now.

**So:** most prep time goes to creators and authors. X is our hub on launch day. Hacker News and Product Hunt get one good post each and no extra prep.

## 2. What must be true before we press the button

Last time, 58% of 2,400 tickets (about 1,390) were settings that did not carry over. Three people faced 240 tickets a day; first replies took 31 hours.

Go or no-go call: **Friday 4 December.** All eight must be true.

1. **Migration proven.** At least 1,000 beta users update from their real setups with zero lost hotkeys, settings or extensions. Any loss blocks launch.
2. **Undo exists.** The update saves a copy of the old settings and can restore it in one step.
3. **Top 200 extensions tested** on the new build. Authors of any that break are told by 24 November.
4. **Every claim is in the build.** If the AI command builder is not in the release build, we do not mention it. Any speed claim uses a number we measured, with the Mac named.
5. **Support ready.** Help article "Check your hotkeys came with you." Saved replies for the top 10 migration issues. Target first reply under 8 hours. Engineers, free during the freeze, join a 2-hour daily support shift in launch week.
6. **Staged update for existing users.** 10% on day 1, 30% on day 3, everyone by day 7, only if migration tickets stay under 50 a day. New downloads open to all on day 1.
7. **Creator videos and author posts delivered** and held until 16:00 UK on 8 December.
8. **Tracking links per channel**, so we can compare week-4 retention again.

## 3. Who we tell, in what order

| Date | Who | Channel | What happens |
|---|---|---|---|
| Fri 13 to Fri 20 Nov | Team | Internal | Lock the claims list. Test migration on 300 staff and friends' setups. Designer starts store visuals. |
| Mon 16 Nov | All 1,500 extension authors | Developer email, community Slack | Beta access, a test checklist, and a request to share their own screen recording on launch day. |
| Mon 23 Nov | 1,000 power users | Email invite to our heaviest hotkey users | Beta. "Help us prove your hotkeys survive." |
| Tue 24 Nov | 9 YouTube creators | Private build and a 20-minute call | Two angles: the upgrade for power users, and first-day setup for newcomers. Held until launch. |
| Tue 1 Dec | Video editor | Internal | Cut clips under 30 seconds, one feature and one shortcut each. |
| Tue 8 Dec, 16:00 UK | Everyone | X thread, creator videos, author posts, Show HN, email to 420,000 | Launch. Our engineering lead writes the Show HN on how we rebuilt it. |
| Wed 9 Dec | Product Hunt | Product Hunt | Its own day, so it does not split launch-day attention. |
| Thu 10 to Fri 11 Dec | Support, engineering | Internal | Review migration tickets daily. Hotfix any pattern. |
| Mon 14 Dec | New to launchers | X, welcome email to new installs | "Start with five": five store picks, each author named. |
| Tue 15 Dec | Existing users | In-app update | Full rollout if tickets stay under the limit. Creators post a "one week in" follow-up. |
| Tue 22 Dec | Team | Internal | Two-week review: installs by channel, week-1 and week-2 retention, tickets, reply times. Week-4 numbers land 5 January. |

**Email reach.** At our 46% open rate, about 193,000 people will open the launch email.

## 4. Messages by audience

- **Developer power user:** "Everything you set up comes with you." Proof: a recording of an update, hotkeys intact.
- **Product manager or designer, new to launchers:** "Start with five." Five store picks for daily work, authors credited.
- **Extension authors:** "You build Raycast with us. Ship on day one."

## 5. Launch-day post for X

**Post 1** [20-second recording: open Raycast, browse the store, build an AI command]

> The new Raycast is here.
>
> Rebuilt for speed. A redesigned extension store. An AI command builder you set up in plain words.
>
> Your hotkeys, settings and extensions come with you.
>
> Press ⌥ Space and see. raycast.com

**Post 2** [recording: Raycast opening side by side, old and new]

> Rebuilt from the ground up. [Opens in __ ms on a __ Mac, measured by us.]

Post 2 goes out only if the speed test is done.

**Post 3** [recording: scrolling the new store]

> The redesigned store makes the good stuff easy to find. This week's picks are by [@author1], [@author2] and [@author3]. Thank you for building with us.

**Post 4** [recording: typing a request, getting a command]

> The AI command builder. Say what you want, like "turn my clipboard into a clean bullet list," and Raycast builds the command.

**Post 5**

> Updating? Your setup comes with you. If anything looks off, reply here or email [support address] and we'll sort it.

## 6. Email to existing users

**Subject:** The new Raycast is here (your hotkeys came too)
**Preview text:** Rebuilt for speed, a new store, and an AI command builder.

Hi [first name],

The new Raycast is here, and the best part is what stays the same. Your hotkeys, settings and extensions move over on their own. Nothing to set up again.

**What's new**

- **Speed.** Rebuilt from the ground up. [Short clip]
- **A new store.** Easier to find what you need. This week's picks: [Extension] by [author], [Extension] by [author], [Extension] by [author]. 1,500 authors build the store with us.
- **AI command builder.** Say what you want in plain words. Raycast builds the command. [Short clip]

**How to get it**

The update reaches everyone over the next week. Want it now? Press ⌥ Space and type "Check for updates."

**If something didn't come over**

Reply to this email. A real person will read it and help you fix it.

Do more with your keyboard.

The Raycast team
