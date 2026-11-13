# Raycast launch plan: 13 November to 22 December 2026

## The decision

- **New users launch Tuesday 8 December** through YouTube creators, extension authors and our X account. These channels kept users best last time.
- **Existing users get the update in three waves:** 10% on 8 Dec, 40% more on 10 Dec, the rest on 14 Dec. A wave goes out only if hotkey and extension-setting tickets stay under 10% of all tickets. Last time they were 58%.
- **Product Hunt and Hacker News move to Tuesday 15 December.** They brought 63% of installs but kept the lowest share. By then the rollout is done.
- **Bad news to fix first:** last time 1,392 tickets (58% of 2,400) were about hotkeys or settings that didn't carry over. Three people answered them, with a 31-hour median first response. Migration fixes must land before the 1 December code freeze.
- **First move, Monday 16 November:** early build to all 1,500 extension authors and 300 developer power users.

**Assumptions:**
1. Engineering can share an early build by 16 November and release the update in stages.
2. No paid budget. Creators get early access, not fees.
3. Engineering measures the speed gain by 27 November. Without a number, copy shows a recording and makes no comparison.

## Channels ranked by users who stay

Ranked by share of installs still active in week 4. The rank sets launch order and team time.

| Rank | Channel | Installs (2025) | Active wk 4 | Users kept |
|---|---|---|---|---|
| 1 | YouTube creators (6 videos) | 11,000 | 41% | 4,510 |
| 2 | Extension authors | 6,500 | 38% | 2,470 |
| 3 | Our X account | 17,000 | 22% | 3,740 |
| 4 | Hacker News | 21,000 | 14% | 2,940 |
| 5 | Product Hunt | 38,000 | 9% | 3,420 |
| | **Total** | **93,500** | **18%** | **17,080** |

YouTube and authors brought 19% of installs but 41% of the users who stayed. Authors had no early access.

**Projection:** if all 9 creators match last time's average video (about 1,830 installs, 41% kept), YouTube brings about 16,500 installs and 6,800 users still active in week 4, up from 4,510. If only 6 publish, it stays near 4,500.

## Who we tell, in order

| Date | Who | Channel | Message | Owner |
|---|---|---|---|---|
| Mon 16 Nov | 1,500 extension authors | Email, early build | "Test your extension in the new version and store by 27 Nov. We'll credit you by name on launch day." | Launch manager |
| Mon 16 Nov | 300 developer power users with 20+ hotkeys, volunteers from the list | Email, early build | "Update, then tell us if one hotkey, extension or setting moved." Three-question form. | Launch manager |
| Fri 20 Nov | 9 YouTube creators | Personal email, early build | "Embargo 8 Dec. Make it for someone new to launchers: where to start." Creators disclose early access. | Launch manager, video editor |
| Mon 30 Nov | Extension authors | Email | Share kit: a 10-second clip of their extension in the new store and an editable post | Video editor, designer |
| Wed 2 Dec | 3 support staff | Briefing | Help article "What carries over and how to check", known-issue replies, a "migration" tag, shift rota | Launch manager |
| Thu 3 Dec | Team, engineering lead | Go or no-go | Checklist below | Launch manager |
| Tue 8 Dec | Wave 1: 42,000 users | In-app update, email | Email below | Launch manager |
| Tue 8 Dec | New users | X, creator videos, author posts | X post below | Launch manager, video editor |
| 9 to 11 Dec | X followers | X | One recording a day, one shortcut each, crediting one author | Video editor |
| Thu 10 Dec | Wave 2: 168,000 users | In-app update, email | Same email | Launch manager |
| Mon 14 Dec | Wave 3: 210,000 users | In-app update, email | Same email | Launch manager |
| Tue 15 Dec | Product Hunt, Hacker News | Maker post; engineering post | "Rebuilt for speed," measured numbers only | Launch manager, engineering |
| Tue 22 Dec | Owner | Review | Results against the measures | Launch manager |

**Support cover:** all 3 staff on staggered shifts, 12 hours a day, 8 to 18 December. One person covers 4 hours on 12 and 13 December. On wave days the launch manager answers known-issue tickets.

## Before we press the button (Thursday 3 December)

1. **Migration:** at least 95% of the 300 testers report every hotkey, extension and setting carried over. Each reported loss is fixed before 1 Dec or has a fix in the help article.
2. **Undo:** a tested way back to the previous version.
3. **Staged release:** we can release to 10%, 50% and 100%, and pause.
4. **Freeze exception** agreed for migration hotfixes only.
5. **Creators:** at least 6 of 9 confirm a video for 8 Dec.
6. **Authors:** share kits sent; top extensions display correctly in the new store.
7. **Support:** help article live, replies loaded, rota set.
8. **Tracking:** one link per channel, so we can re-rank by week-4 activity.

**No-go rule:** if 1, 2 or 3 fails, existing users don't get the update on 8 Dec. New installs can still go: new users have no settings to lose.

## Measures and plan B

| Measure | Target | Why |
|---|---|---|
| Hotkey and extension-setting tickets | Under 10% of tickets | 58% last time |
| Median first response, first 10 days | Under 12 hours | 31 hours last time. Projection, if other tickets match last time: volume falls from 2,400 to about 1,000 |
| Installs from YouTube and authors, 14 days | 23,000 | 16,500 projected from YouTube plus authors' 6,500 last time |

**Day 4 check, Friday 11 December:**
- Migration tickets over 10%: hold the next wave and ship the hotfix.
- Median response over 24 hours: hold wave 3 until it is under 12 hours.
- YouTube and author installs under 5,000: re-send authors their clip and pin creator videos on X.

Week-4 activity for launch-day installs is readable on 5 January.

## Launch-day X post

> The new Raycast is here. Rebuilt for speed, with a redesigned extension store and a new AI command builder.
>
> Your hotkeys, extensions and settings come with you.
>
> Press ⌥ Space and watch.

Attach: a 15-second screen recording, no cuts, hotkey to result.

**Reply in thread:**

> Built with the people who make our extensions. Thank you. Meet a few of them in the new store.
>
> Already using Raycast? The update reaches everyone over the next week. New here? raycast.com

Attach: a store recording with each author's handle on screen.

## Email to existing users

**Subject:** Rebuilt for speed. Your hotkeys didn't move.
**Preview:** Same setup, new store, and a builder for your own AI commands.

Hi,

The new Raycast is ready on your Mac.

We rebuilt it for speed. Your hotkeys, extensions and settings carried over on their own. Nothing to set up again.

What's new:

- **A redesigned extension store.** Every extension in it was built by someone in our community.
- **An AI command builder.** Turn a task you repeat into your own AI command.

Press ⌥ Space. Everything is where you left it.

**[Watch it move (15 seconds)]**, linking to the launch page on raycast.com

Something look off? The two-minute help article "What carries over and how to check" covers it. If not, reply and a person on our team will help.

Do more with your keyboard.
The Raycast team

You get this email because you use Raycast. Unsubscribe.
