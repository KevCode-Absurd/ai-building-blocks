# 11 · Your own skills: use them in workflows, then share them

**Date:** 2026-10-19
**Status:** parts 1 and 2 added to the plan (Kevin, 19 Oct: "add 1 & 2"). Part 3 is parked. Nothing is built yet. Where this and the final plan differ, the final plan wins.
**Question (Kevin):** let people add their own skills, mix them with ours in workflows, and submit them to the site, where we test them before they go live. Later, maybe paid skills and a premium section.
**Short answer:** three parts at three times. Part 1 needs no server and fits the site we have. Part 2 reuses the block tester we built on 19 Oct (`tools/test-blocks.mjs`) as the check before anything goes live. Part 3 changes a decided point, so it waits.

| Part | What people can do | When |
|---|---|---|
| **1 · Your own skills** | Add a skill of their own and use it in kits and workflows next to ours | Next, in site v0 (before 19 Jan 2027) |
| **2 · Submit a skill** | Send a skill to the library; we test it, a person approves it, it goes live for free with their name on it | After launch, with site v1 (Apr 2027) |
| **3 · Paid skills and a premium section** | Set a price; a members-only shelf | Parked (see §3) |

---

## 1. Your own skills (next)

**What the visitor sees**
- **"Add your own skill"** in My kits and in the builder's side panel.
- They drop in a `SKILL.md` (or a folder with one) or paste the text. We read the name and description from the top of the file, and they can change both.
- They pick what it needs and what it gives from the same list our blocks use (reviews, a brief, a script…). If they skip this, it takes and gives plain text.
- It shows with a **"Yours"** mark everywhere, so nobody mixes it up with a block we tested.
- It goes in kits and workflows like any block. Suggestions work around it, and type mismatches warn the same way.

**What the download does**
- The handoff pack carries it at `skills/<slug>/SKILL.md`, like ours.
- `HANDOFF.md` notes that this step is the person's own skill and wasn't tested by us.

**Rules**
- It stays in this browser, in the same storage module as kits and workflows. Nothing is sent anywhere.
- It's text only. The site shows it as plain text and never runs it.
- One skill file is capped at 200 KB. Reference files go in only if they're `.md` or `.txt`.
- When it's added, a code check flags lines that tell an AI to hide what it's doing, send data out, or ignore the user. The person sees the warning and decides. It's their own file, so we don't block it.

**Done means**
- Add, edit, remove and export your own skill. Use it in a kit, a workflow and a download.
- End-to-end tests cover the add, the "Yours" mark, a mixed workflow and its handoff pack.
- The PRD (§3) lists it.

## 2. Submit a skill (after launch)

**What the visitor sees**
- On a skill of theirs, **"Submit to the library"**. This needs the free account from v0. Accounts still hold no business data.
- A short form asks for:
  - the skill
  - one line on what it gets you
  - an example input with no private customer data
  - the name to credit
  - two ticks: "I made this or have the right to share it" and "You may list it for free and edit its name and wording to fit the site"
- A status page shows each stage. Then it says **Live**, or **Needs changes** with the reasons and what to fix.

**What happens behind it (the same pipeline as imports, `08_INTAKE_ENGINE.md`)**
1. **Safety scan.** Look for hidden instructions to the AI, data sent out, and tools it doesn't need (`05` §17, `scan-skill`).
2. **Rights check.** Look for wording copied from courses, books or other people's skills, using the same check as the 19 Oct rights audit.
3. **Test run.** `test-blocks` runs it on Sprout and on the submitter's example. A second model grades the result against the skill's own checks and our §21 checklist. Any made-up fact is a fail.
4. **A person approves.** We fix the name to our naming rules, write the page and publish.
5. **Live.** The page shows "By <name>" and the tested mark. It's free like everything else.

**Limits**
- Each submission costs us about $0.35 in model calls, so there's a cap per account per week (start at 3).
- A lawyer reads the submission terms once before this opens (`08` already requires this before creator uploads).
- The data has room for a price field later, but nothing shows it.

**Done means**
- Submit, status, needs-changes and live all work on staging.
- 10 test submissions go through: 5 good, and 5 traps (hidden instructions, copied course text, made-up facts). All 5 traps are caught.

## 3. Paid skills and a premium section (parked)

Parked on 19 Oct. Reasons:
- The final plan says nothing is sold at the start, and "selling individual skills doesn't make sense" is marked decided (§10).
- A skill is a text file. Once one buyer downloads it, it can be shared.
- Paying creators brings payments, payouts, tax, refunds and disputes.

The 70/30 creator marketplace stays where the final plan has it (stream 7, site v3). Part 2 is built so a price can be added later without a rebuild.
