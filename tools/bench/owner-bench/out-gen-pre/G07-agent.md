# Raycast launch plan: Friday 13 November to Tuesday 22 December 2026

## The plan in short

**Goal:** new users still active in week 4, without last year's support flood.
**Launch:** Tuesday 8 December. Code freeze from Tuesday 1 December.
**Order:** extension authors first, YouTube creators second, existing users third, public channels on launch day.
**The risk that matters:** carry-over. Last time, 1,392 of 2,400 tickets (58%) were hotkeys or extension settings that didn't carry over, and the median first reply took 31 hours. This version promises everything carries over, so the beta and the go/no-go gate are built around proving it.

## Channels ranked by users who stay

Last major release, first 14 days:

| Rank | Channel | Installs | Active week 4 | Users who stayed | Role this time |
|---|---|---|---|---|---|
| 1 | YouTube creators | 11,000 | 41% | 4,510 | Invite all 9 creators (6 last time) |
| 2 | Extension authors | 6,500 | 38% | 2,470 | Early access for all 1,500 authors |
| 3 | Our X account | 17,000 | 22% | 3,740 | Launch post, then one recording a day |
| 4 | Hacker News | 21,000 | 14% | 2,940 | One post; engineers answer questions |
| 5 | Product Hunt | 38,000 | 9% | 3,420 | Post on launch day, no extra push |

Ranked by the share who stay. Product Hunt brought the most installs, but 91% were gone by week 4. Overall, 17,080 of 93,500 installs (18.3%) stayed.

The two best channels were under-used. Each video brought about 750 users who stayed; nine videos at that rate is about 6,800. Authors got no early access last time.

## Who hears what, in which order

Every message carries one shortcut only: ⌥ Space.

| Audience | When | Message |
|---|---|---|
| Extension authors (1,500) | Mon 16 Nov | "Get it three weeks early. Test your extension. We credit you by name on launch day." |
| Developer power users (beta) | Mon 16 Nov | "Help us prove your hotkeys survive the update." |
| YouTube creators (9) | Wed 18 Nov | "Early build. Three things to show: speed, the new store, the AI command builder." |
| Existing users (420,000) | Tue 1 Dec, then 8 Dec | "Your hotkeys, settings and extensions come with you." |
| New users: PMs and designers | 8 Dec onward | "Start with five extensions, picked from the new store." |
| Developers on X, HN, Product Hunt | 8 Dec | "Rebuilt for speed. Your setup comes with you." |

## Dated plan

Team: launch manager (LM), designer (D), video editor (VE), support (S), engineering (E).

| Date | Step | Owner | Done when |
|---|---|---|---|
| Fri 13 Nov | Plan agreed. Tracked link for each channel, to read week-4 retention by channel. | LM | Links tested |
| Mon 16 Nov | Early access to all 1,500 authors. Beta form to the email list; take the first 1,000 developers with 20 or more hotkeys. | LM | Invites sent |
| Wed 18 Nov | Creator brief and build sent to all 9 creators. Embargo: Tue 8 Dec, 16:00 UK. | LM | 9 replies |
| Mon 23 Nov | Three screen recordings under 30 seconds: speed, store, AI command builder. Each credits the authors shown. | D, VE | Approved |
| Fri 27 Nov | Author and beta reports in. Every carry-over or extension bug logged. | LM, E | Bug list closed for triage |
| Mon 30 Nov | Last fixes in the release build. Migration gate checked (below). | E | Gate passed |
| Tue 1 Dec | Heads-up email to 420,000 users: what's coming on the 8th, and nothing to redo. | LM | Sent |
| Wed 2 Dec | Support ready: help article "If something didn't carry over", five reply macros, a carry-over ticket tag. Creator videos checked for anything not shipping. | S, LM | 10 test tickets run |
| Thu 3 Dec | Five-extension starter set live in the store. Author kit sent: recording, draft post, launch time. | D, LM | Authors have kit |
| Fri 4 Dec | Go/no-go meeting. | LM, E | Every gate passes |
| Tue 8 Dec | Release. Creator videos, X post, email, author posts, Hacker News, Product Hunt. | All | Live |
| Wed 9 to Fri 11 Dec | Daily 10:00 ticket review. Plan B check on Fri 11 Dec (day 4). | LM, S | Logged |
| Mon 14 Dec | X: author spotlight. Email to new installs: the five-extension starter set. | LM, D | Sent |
| Tue 15 Dec | Day 7 review. | LM | Written up |
| Tue 22 Dec | Day 14 review: keep, change, stop. | LM | Written up |

## What has to be true before we press the button

Each is pass or fail at the Fri 4 Dec meeting:

1. **Carry-over works.** Every beta tester's hotkeys and extension settings came over, or each failure was fixed before 1 December.
2. **Extensions work.** Every author report is answered. Any extension still broken shows a note in the store.
3. **There is a way back.** The update keeps a backup of the old setup, and the user can restore it.
4. **The rollout is staged.** Auto-update reaches 10% of users on 8 Dec, 50% on 10 Dec and everyone on 14 Dec, and can be paused. Anyone can update by hand from day one.
5. **Support is ready.** Help article, macros and tag live. Two engineers on call for 10 days.
6. **Words are true.** No "fastest" and no speed number unless engineering measured it. No feature named that isn't in the build.

## Measures and plan B

| Measure | Last time | Target |
|---|---|---|
| Carry-over share of tickets, first 10 days | 58% | Under 20% |
| Median first reply, first 10 days | 31 hours | Under 8 hours |
| Users still active in week 4 (read Tue 5 Jan) | 18.3% | Over 25%, with more of the mix from rows 1 and 2 |
| Users who stayed from creators and authors | 6,980 | 9,200 (about 6,800 from creators plus last time's 2,470 from authors) |

**Plan B, Fri 11 Dec:** if carry-over tickets are over 40% of all tickets, pause auto-update, ship the fix and email affected users before resuming. If the median first reply is over 24 hours, the launch manager and designer join the reply rota.

## Launch-day post for X

> The new Raycast is here.
>
> Rebuilt for speed. A redesigned extension store. A new AI command builder.
>
> Your hotkeys, settings and extensions come with you.
>
> Press ⌥ Space, type "Store", and see what 1,500 community authors built.

Attach the store recording. Reply in thread crediting every author shown, by handle.

## Email to existing users

**Subject:** Raycast, rebuilt. Your setup comes with you.
**Preview:** The new version is out today. Nothing to redo.

Hi,

The new Raycast is out today.

We rebuilt it for speed. The redesigned store makes it easier to find what our 1,500 community authors have built. And a new AI command builder lets you make your own commands.

Your hotkeys, settings and extensions come with you. When you update, we keep a backup of your old setup.

Button: **Update Raycast**

Then press ⌥ Space and type "Store".

If something didn't carry over, the help page shows what to do, or reply to this email and a person will help.

Do more with your keyboard.
The Raycast team

*You get this because you use Raycast. Unsubscribe from product emails.*

## Assumptions

- No paid budget; every channel is owned or earned.
- ⌥ Space stays the default shortcut.
- Engineering can build the backup, staged auto-update and pause before 1 December, and ship critical fixes during the freeze.

## To confirm

- Embargo time: 16:00 UK, 8 December.
- The email's backup sentence ships only if gate 3 passes.
