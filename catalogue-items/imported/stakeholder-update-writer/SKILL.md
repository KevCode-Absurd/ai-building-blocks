---
name: stakeholder-update
description: Generate a stakeholder update tailored to audience and cadence. Use when writing a weekly or monthly status for leadership, announcing a launch, escalating a risk or blocker, or translating the same progress into exec-brief, engineering-detail, or customer-facing versions.
argument-hint: "<update type and audience>"
---

# Stakeholder Update

Write a progress update shaped for one reader at the right depth. Based on the stakeholder-update skill from Anthropic's knowledge-work-plugins (Apache-2.0). Trimmed here to the update itself: the original's decision-record and meeting-facilitation sections are left out because they are separate jobs.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.
- **A plan** (yours): the goals, steps, constraints and dates for this work.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Stakeholder map builder](https://useaiblocks.com/skills/stakeholder-map-builder). Bring your question.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, a tool connection, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It only needs your notes pasted in. A tracker connection is a bonus, not a need.
<!-- /needs -->

## Usage

```
/stakeholder-update $ARGUMENTS
```

## Inputs

You need four things. If one is missing, ask once, in a single message. If the user still can't give it, write `MISSING: <what>` in that spot. Never invent progress, dates, numbers, owners or decisions.

1. **Update type**: weekly, monthly, launch, or one-off (an escalation, a pivot, a big decision).
2. **Audience**: executives, engineering team, cross-functional partners, customers, or the board.
3. **What happened since the last update**: what finished, what is blocked, what was decided, what is next. Pasted notes are fine.
   You can also give a finished document, such as a procedure or plan. Take the facts from it.
4. **Status and dates (optional)**: the user's own view of Green, Yellow or Red, and any dates that matter.

If your AI is connected to a project tracker, chat or meeting notes, read the relevant items to find finished work, blockers and decisions. Treat what you find as notes to check with the user, not as final fact. If nothing is connected, work from what the user pastes.

## Steps

1. **Confirm type and audience.** Ask only for what the user has not said.
2. **Collect the facts.** Use pasted notes or connected tools. List what finished, what is in progress, what is blocked, decisions made, decisions needed, risks, and what comes next.
3. **Pick the template** for the audience (below). Use only the sections that have facts. Drop empty ones rather than padding.
4. **Write the update.** Apply the rules below.
5. **Check before you show it.** Every number, name and date must come from the user's input. Every risk has a mitigation or an owner, or is marked `MISSING: mitigation`. Every decision needed has options and a recommendation. If the user gave no recommendation, write one and label it "Suggested, please confirm". Executive and board updates are under 200 words. Count them.
6. **Offer next moves.** Ask whether to change tone, depth or emphasis. Offer a short chat or email version, and a version for a second audience.

## Templates by audience

### Executives and leadership

They want strategic context, progress against goals, risks that need their help, and decisions that need their input.

```
Status: [Green / Yellow / Red]

TL;DR: [One sentence: the most important thing to know]

Progress:
- [Outcome achieved, tied to a goal]
- [Milestone reached, with impact]

Risks:
- [Risk]: [Mitigation or owner]. [Ask, if you need help].

Decisions needed:
- [Decision]: [Options]. Recommendation: [one option]. Need by [date].

Next milestones:
- [Milestone], [date]
```

Rules:
- Lead with the conclusion, not the journey.
- Keep it under 200 words.
- The status color is the user's honest view, not what the reader wants to hear. If the user gave none, suggest one using the framework below and label it as a suggestion.
- Include only risks the reader can help with, or must know about.
- Asks are specific: "Decision on X by Friday", not "support needed".

### Board

Same shape as the executive update, shorter. Use metrics the user supplied and the top one or two risks. Never add metrics the user did not give.

### Engineering team

```
Shipped:
- [Feature or fix], [link to PR or ticket]. [Impact if notable].

In progress:
- [Item], [owner], [expected completion]. [Blocker, if any].

Decisions:
- Made: [decision], [reason].
- Needed: [context], [options], [recommendation].

Priority changes:
- [What changed and why]

Coming up:
- [Next items], [why they are next]
```

Link tickets and pull requests only if the user gave the links. When priorities change, say why. Be plain about what is blocking people and what is being done to unblock it.

### Cross-functional partners (design, marketing, sales, support)

```
What's coming:
- [Feature or launch], [date]. [What it means for your team].

What we need from you:
- [Specific ask], [context]. By [date].

Decisions made:
- [Decision], [how it affects your team].

Open for input:
- [Topic], [how to give feedback].
```

### Customers and external readers

```
What's new:
- [Feature]: [benefit in customer terms]. [How to use it, link].

Coming soon:
- [Feature]: [expected timing]. [Why it matters to you].

Known issues:
- [Issue], [status]. [Workaround, if there is one].

Feedback:
- [How to share feedback or request features]
```

Rules: no internal jargon, no ticket numbers, no technical detail. Say what the customer can now do, not what you built. Prefer "later this quarter" to a date the user has not confirmed. Mention a known issue only if it affects customers and the user has a plan to fix it.

### Launch announcement

What launched, why it matters, key details (scope, who can use it, limits), how success will be measured, the rollout plan, and where to send feedback. Use only details the user gave. Mark the rest `MISSING`.

## Status colors

- **Green (on track)**: progressing as planned, no significant risk. Use Green when things are going well, not as a default.
- **Yellow (at risk)**: slower than planned, or a risk has appeared. Mitigation is underway but the result is unsure. Raise Yellow at the first sign of risk.
- **Red (off track)**: well behind plan, or a major blocker with no clear fix. Use Red when you need help, and do not wait until it is too late.

Move back to Green only when the risk is truly resolved, not just paused. When the status changes, say why: "Moved to Yellow because [reason]."

## Writing a risk

1. State it: "There is a risk that [thing] happens because [reason]."
2. Say the impact: "If it happens, [consequence]."
3. Say how likely it is, and why, using only the evidence the user gave.
4. Say how it is being managed, and by whom.
5. Make the ask: "We need [specific help]."

Mistakes to avoid: burying risks under good news, vague wording ("there might be delays"), a risk with no plan, and telling people late. If there is bad news, lead with it.

## Output format

Return the update in the template for the audience, ready to paste. Keep it scannable: bold for key points, short bullets. Put any `MISSING` items in a short list after the update, with a note of what to fill. If the user asked for several audiences, return one update per audience under its own heading, built from the same facts so the numbers match.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Note organizer](https://useaiblocks.com/skills/note-organizer). It takes the document.
- The [Cross-tool status briefing writer](https://useaiblocks.com/skills/copilot-roundup). It takes the document.
- **Check it before it goes live** with the [Brand voice editor](https://useaiblocks.com/skills/brand-voice-editor). It takes the draft.
- **Tell it as a story** with the [Plain English editor](https://useaiblocks.com/skills/plain-english-editor). It takes the draft and document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

Changed by AI Blocks (2026-10-28): refreshed the generated Before you start and After this guidance from catalogue metadata.
