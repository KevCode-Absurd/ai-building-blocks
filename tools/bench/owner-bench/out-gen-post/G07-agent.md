# Raycast launch plan: 13 November to 22 December 2026

## The decision

Launch community first. Extension authors and YouTube creators get the new build three weeks early. Product Hunt and Hacker News come last on launch day, with little team time. We do not press the button on 8 December unless hotkeys, settings and extensions carry over on real setups.

Why, from the 2025 numbers:

- **The loudest channels kept the fewest users.** Product Hunt brought 38,000 installs; 9% were active in week 4. Creator walkthroughs brought 11,000; 41% stayed.
- **Last launch hurt our best users.** 1,392 of 2,400 tickets (58%) were about hotkeys or extension settings that did not carry over. Median first reply: 31 hours.
- **The freeze sets the clock.** Authors must find bugs before the 1 December code freeze, so their build goes out Tuesday 17 November.

**This week:** brief support Monday 16 November; send the author build Tuesday.

Assumptions: the goal is more new users active in week 4 than 2025's 17,080, with no paid budget. After 1 December, engineering ships launch-blocking fixes only. The default open shortcut is ⌥ Space.

## Channels ranked by users who stay

| Rank | Channel | 2025 installs | Active week 4 | Users kept | Role this time |
|---|---|---|---|---|---|
| 1 | YouTube creators | 11,000 | 41% | 4,510 | All 9 invited, early build |
| 2 | Extension authors | 6,500 | 38% | 2,470 | Early access for all 1,500 |
| 3 | Our X account | 17,000 | 22% | 3,740 | Launch post, daily author spotlights |
| 4 | Hacker News | 21,000 | 14% | 2,940 | One post on the rebuild |
| 5 | Product Hunt | 38,000 | 9% | 3,420 | Listed; no vote chasing |
| | **Total** | **93,500** | **18%** | **17,080** | |

The email list (420,000 users, 46% open, about 193,200 readers) is not ranked. It protects the users we have.

Projection: 6 videos brought about 1,833 installs each. If all 9 creators publish, that is about 16,500. With authors held at 6,500, the top two channels bring 17,500 to 23,000 installs and keep 6,980 to 9,240 users (6,980 last time).

## Who hears what

| Audience | Message | Shortcut |
|---|---|---|
| Developer power users | Rebuilt for speed. Your hotkeys and extensions come with you. | ⌥ Space |
| Extension authors | Test your extension by 27 Nov. We credit you on launch day. | None |
| YouTube creators | Embargo 8 Dec. Show it moving. Credit the extension authors. | One per video |
| PMs and designers new to launchers | Start with five extensions. Do more with your keyboard. | ⌥ Space |

## Calendar

Owners: LM launch manager, DS designer, VE video editor, SUP support, ENG engineering.

| Date | What happens | Channel | Owner |
|---|---|---|---|
| Fri 13 Nov | Lock plan. One tracked link per channel and creator | All | LM |
| Mon 16 Nov | Brief support. List every setting that must carry over | Internal | LM, SUP, ENG |
| Tue 17 Nov | Private build to 1,500 authors: test extension and hotkeys, report by 27 Nov | Author email | LM, ENG |
| Wed 18 Nov | Invite 9 creators: build, feature notes, author credits, embargo | Direct email | LM |
| 18 to 27 Nov | Three recordings under 30 seconds: speed, store, AI command builder | Assets | DS, VE |
| Fri 27 Nov | Author reports triaged; blockers fixed before freeze | Internal | ENG |
| Mon 30 Nov | Creator cuts checked: shipped features only | Direct email | LM |
| Tue 1 Dec | Freeze. Second carry-over test on the release candidate | Internal | ENG |
| Thu 3 Dec | Support dry run: help page "Your setup after updating", macros, rota | Internal | SUP |
| Fri 4 Dec | Go or no-go | Internal | LM, ENG |
| Tue 8 Dec | Launch, in order: update live, X post, creator videos, email, then HN and PH | All | LM |
| 9 to 11 Dec | One author spotlight a day, with a clip | X | LM, VE |
| Tue 15 Dec | Thread: five extensions to start with, for launcher newcomers | X | LM, VE |
| Tue 22 Dec | Two-week review: keep, change, stop | Internal | LM |

## What must be true before we press the button

Go on Friday 4 December needs all six:

1. Hotkeys, settings and extensions carry over on the release candidate across author and staff Macs, with no lost hotkey.
2. Every author-reported blocker is fixed, or listed on the help page with a workaround.
3. Help page, reply macros and support rota are live.
4. The previous version stays downloadable for 14 days.
5. Creator cuts show only shipped features.
6. Tracked links work for every channel and creator.

## Measures and plan B

| Measure | 2025 | Target | Read on |
|---|---|---|---|
| Carry-over tickets, first 10 days | 1,392 | Under 140 | 18 Dec |
| Median first reply, first 10 days | 31 hours | Under 12 hours | 18 Dec |
| Creator and author installs, 14 days | 17,500 | 23,000 | 22 Dec |
| New users active in week 4 | 17,080 | Above 17,080 | January |

The 12-hour target is a projection: without carry-over tickets, 2025's load falls from 240 to about 100 tickets a day.

**Plan B:**

- Over 50 carry-over tickets in any day: pause the update prompt, pin the help page on X, and the launch manager joins support.
- Under 5,750 creator and author installs by Friday 11 December (a quarter of target): email openers asking them to show a teammate the 30-second video.

**Bolder move:** update existing users in two waves. 42,000 (10%) on 8 December, the rest on Thursday 10 December if carry-over tickets stay under 20 a day. New users install fresh, so they carry no risk. A hidden bug then hits support at a tenth of the load. First step: ENG confirms by 20 November that the update channel can do a 10% wave. Risk: if it cannot ship before the freeze, drop it.

## Launch-day X post

> Do more with your keyboard.
>
> Raycast is rebuilt for speed, with a redesigned extension store and a new AI command builder. Your hotkeys, settings and extensions come with you.
>
> Update, then press ⌥ Space.
>
> The store is built by 1,500 extension authors. Thank you.

Attach the 30-second store recording. Reply with each extension shown, credited to its author.

## Email to existing users

**Subject:** Raycast is rebuilt. Your hotkeys came too.
**Preview:** A new extension store and AI command builder, on the setup you already have.

Hi,

Today we're shipping a new Raycast, rebuilt for speed.

*(15-second loop of the new store)*

**What's new**

- Rebuilt for speed.
- A redesigned extension store.
- A new AI command builder, for making your own commands.

**What stays the same**

Your hotkeys, settings and extensions carry over when you update. Nothing to set up again. Extension authors tested this version with us before today.

**[Update Raycast]**

Then press ⌥ Space and type "store".

If something looks off, the help page "Your setup after updating" walks you through it. Or just reply to this email.

The store exists because 1,500 extension authors build it with us. Thank you, all of you.

The Raycast team

*You get this email because you use Raycast. Unsubscribe.*
