---
name: meetings
description: Use when someone wants to decide whether a meeting is worth calling, price a meeting in dollars, build a timeboxed agenda with desired outcomes, or turn messy meeting notes into owned action items — or says "should this be a meeting", "/cs:meeting-prep", or "/cs:meeting-actions". Runs a cost gate (ASYNC / NOT-READY / MEET), builds a decision-first agenda, and extracts an owner + due-date checklist that flags every orphan.
argument-hint: "[the meeting to gate, or the notes to extract actions from]"
license: MIT
metadata:
  version: 1.0.0
  build_pattern: "Path-B discipline skill — Rogelberg/HBR meeting-science canon + deterministic gate/agenda/extraction scripts"
  distinct_from: "project-management (team ceremonies + Jira delivery flow; this is personal meeting hygiene); business-operations/internal-comms (org-level communication design; this never auto-sends); productivity/capture (private brain-dump triage; this parses shared meeting notes)"
---

# Meetings — Cost Gate → Timeboxed Agenda → Owned Actions

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Meeting notes** (yours): an agenda, notes or decisions from a meeting.
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Meeting notes** with the [Executive meeting brief writer](https://useaiblocks.com/skills/executive-meeting-brief). Bring meeting notes.
2. **Meeting notes** with the [Meeting pre-read writer](https://useaiblocks.com/skills/meeting-pre-read-writer). Bring your question, meeting notes (optional), a plan (optional), a document (optional).
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, meeting notes, a brief. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or an AI that can run Python:** It runs the three scripts, so the sums and the verdict are exact.
- **Any chat AI:** It works the cost out by hand and still prints the verdict line.
<!-- /needs -->

## How to run this skill in a chat

Added by AI Blocks. The method below is the original. This part covers chats that cannot run code.

**Use it when:** you are asked to call or join a meeting and want to know if it is worth the cost, then get an agenda that ends in a decision.
**Skip it when:** it is an urgent incident that needs people on a call now, or the meeting is a social one.

**You need:** how many people, how long, the average hourly pay rate, the decision the meeting must reach, and the topics (each with the outcome you want and an owner). Ask once for anything missing. Never invent a rate or a headcount.

**No Python? Work it by hand.**
- Direct cost = people x (minutes / 60) x hourly rate.
- Refocus cost (optional) = people x (23 / 60) x hourly rate.
- Total = direct + refocus. Cost per minute = total / minutes.
- Decision, agenda and owner all present: MEET. No decision: ASYNC (write a short memo, stop). Decision but no agenda or owner: NOT-READY (say which is missing).
- Always end the gate with `VERDICT: <ASYNC | NOT-READY | MEET> (exit N) — total $X`.

**What you get back:**
1. The verdict line, the cost in dollars and the cost per minute.
2. Only for MEET: a timed agenda, decision topics first, a pre-read line and a 5-minute closing slot to read out actions.
3. After the meeting, if you paste notes: a checklist grouped by owner, with ORPHAN (no owner) and NO-DUE flags and counts.

Nothing is sent or booked. You send the memo, the invite and the actions.


> **Portability:** Reasoning-led skill with 3 stdlib Python scripts. No external APIs, no LLM calls
> in scripts, nothing auto-sent. The scripts fix the discipline; the user runs the meeting.

## What this does

Most meetings should be an email. This skill makes that testable: it prices a meeting in real
dollars, refuses to let it exist without a decision + agenda + owner, builds a timeboxed
decision-first agenda for the survivors, and afterwards turns raw notes into an owner + due-date
checklist that flags every orphan. An ASYNC verdict is a win, not a failure.

## Workflow — gate → agenda → run → extract

**1. Gate.** Before starting, ask one clarifying question if the decision to be made is unstated —
the gate cannot run honestly without it. Then price it and apply the three checks. No decision → ASYNC (exit 2): draft a memo
instead, stop here. Decision but missing agenda/owner → NOT-READY (exit 3), naming the gap.
All present → MEET (exit 0) with total cost and a cost-per-minute line.
Always print the verdict line as `VERDICT: <ASYNC | NOT-READY | MEET> (exit N) — total $X`, even when you work it by hand. Name the exit code that matches: ASYNC 2, NOT-READY 3, MEET 0.

**2. Agenda.** Only for MEET. Every topic needs a desired outcome — empty outcomes are refused by
name (exit 2). Decision topics (decide/choose/approve) sort before discuss/inform. Timeboxes plus
the mandatory 5-minute closing "actions recap" slot must fit `--length`, or the overflow is refused
with the exact overage (exit 3). Iterate — trim or split the named topic and re-run until it fits;
the stop condition is exit 0 (or the meeting goes async). Output includes a pre-read line.

**3. Run.** The user runs the meeting from the printed agenda. Hold the timeboxes; use the closing
slot to read every action aloud with its owner and date.

**4. Extract.** Feed the raw notes to the extractor: checkboxes, `ACTION:`/`TODO:` lines,
"@name will …" and "Name will … by date" patterns become a checklist grouped by owner, with
ORPHAN (no owner) and NO-DUE flags plus summary counts. Assign every orphan before posting — the
meeting is done when every action has an owner and a date; that completion check closes the loop.

```bash
# 1. Gate: should this meeting exist?
python scripts/meeting_cost_calculator.py --attendees 6 --minutes 60 \
  --avg-rate 90 --include-refocus --has-decision --has-agenda --has-owner

# 2. Agenda: timeboxed, decision-first, outcomes mandatory
python scripts/agenda_builder.py --length 45 \
  --topic "Q3 pricing:Decide usage-based vs seat-based:15:maria" \
  --topic "Launch risks:Discuss open launch blockers:15:sam"

# 4. Extract: raw notes -> owner + due-date checklist with ORPHAN/NO-DUE flags
python scripts/action_item_extractor.py --input notes.md
```

## Scripts

| Script | Role |
|---|---|
| `scripts/meeting_cost_calculator.py` | Dollars (attendees × minutes × rate, optional 23-min refocus overhead per attendee) + decision/agenda/owner gate → ASYNC / NOT-READY / MEET. |
| `scripts/agenda_builder.py` | Timeboxed decision-first agenda; refuses empty outcomes and overflow; enforces pre-read line + 5-min closing actions-recap slot. |
| `scripts/action_item_extractor.py` | Raw notes → owner-grouped markdown checklist with due dates, ORPHAN/NO-DUE flags, and summary counts. |

## References

- [`references/meeting_cost_canon.md`](references/meeting_cost_canon.md) — the real cost of meetings and the should-this-exist gate (7 sources)
- [`references/agenda_discipline.md`](references/agenda_discipline.md) — agendas as questions, timeboxing, decision-first ordering, pre-reads (7 sources)
- [`references/action_item_discipline.md`](references/action_item_discipline.md) — why meetings without owned actions are theater (6 sources)

## Assets

- [`assets/example_agenda.md`](assets/example_agenda.md) — a full worked timeboxed agenda (gate verdict → ordered topics → closing recap)
- [`assets/meeting_gate_worksheet.md`](assets/meeting_gate_worksheet.md) — fillable should-this-be-a-meeting worksheet

## Rules

- **Gate before agenda.** Never build an agenda for a meeting that hasn't passed the gate.
- **No decision, no meeting.** Status updates go async, every time.
- **No desired outcome, no agenda slot.** The builder refuses; go get the outcome.
- **Every action item has an owner and a date — or it is not an action item.** Flag, never drop.
- **Never auto-send.** No invites, no emails, no messages. Output is text the user sends.

## Distinct From (don't reach for the wrong skill)

- **`project-management/`** — team ceremonies, sprint cadence, Jira delivery flow. This gates one
  meeting at a time for the person calling it.
- **`business-operations/internal-comms`** — org-level communication design. This never designs a
  comms program and never sends anything.
- **`productivity/capture`** — triages a private brain-dump. This parses a shared meeting's notes.

---

**Version:** 1.0.0
**Build pattern:** Path-B discipline skill — meeting-science canon preserved + deterministic gate/agenda/extraction scripts added.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Action item tracker](https://useaiblocks.com/skills/executive-action-register). It takes the meeting notes and plan.
- The [Meeting pre-read writer](https://useaiblocks.com/skills/meeting-pre-read-writer). It takes the meeting notes and plan.
- The [Meeting minutes and action tracker](https://useaiblocks.com/skills/weekly-meeting-actions-keeper). It takes the meeting notes.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
