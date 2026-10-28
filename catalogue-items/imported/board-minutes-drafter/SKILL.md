---
name: board-minutes
description: >
  Drafts board or committee meeting minutes in your house format. Auto-detects
  upcoming board and committee meetings from your calendar, asks for the agenda
  and any slides or pre-read materials, and produces a complete draft in the
  format learned from your seed minutes. Also handles written consents in lieu
  of meetings. Trigger: "board minutes", "draft minutes", "upcoming board
  meeting", "committee minutes", "written consent", or calendar detection of
  an upcoming board or committee event.
---

# Board Minutes

> **AI Blocks note: using this in a plain chat.** The `~/.claude/plugins/config/...CLAUDE.md` file, matter workspaces, the calendar connector and the `/corporate-legal:...` slash commands belong to the original legal plugin. If you do not have them, do this instead:
>
> - Skip the Matter context section.
> - In place of the settings file, ask the user to paste two or three sets of past minutes (or a house format). Use them as the template. If they have none, say so, use a plain standard format, and mark the draft "format not confirmed".
> - In place of the calendar, ask for the meeting, date and type (full board or which committee) and the attendee list.
> - Treat the user as a non-lawyer unless they say otherwise, and keep the lawyer-review step.
> - Do not research state law yourself. Where the skill says to check state law or ask counsel, write the question as a placeholder for the lawyer.
> - For a written consent instead of a meeting, the slash command is not available. Tell the user to ask their lawyer to draft it.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Meeting notes** (yours): an agenda, notes or decisions from a meeting.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for meeting notes. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Matter context

**Matter context.** Check `## Matter workspaces` in the practice-level CLAUDE.md. If `Enabled` is `✗` (the default for in-house users), skip the rest of this paragraph — skills use practice-level context and the matter machinery is invisible. If enabled and there is no active matter, ask: "Which matter is this for? Run `/corporate-legal:matter-workspace switch <slug>` or say `practice-level`." Load the active matter's `matter.md` for matter-specific context and overrides. Write outputs to the matter folder at `~/.claude/plugins/config/claude-for-legal/corporate-legal/matters/<matter-slug>/`. Never read another matter's files unless `Cross-matter context` is `on`.

---

## Purpose

Board minutes are a legal record. They need to be accurate, complete, and in a format that will hold up under scrutiny — whether that's a financing due diligence review, a regulatory inquiry, or an M&A data room. This skill drafts them in your house format so you spend your time reviewing and correcting, not formatting and re-typing.

## Load context

- `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md` → `## Board & Secretary` section:
  - Minutes format (long-form narrative / action minutes / hybrid)
  - Minutes template extracted from seed documents (structure, resolution language, header format)
  - Board composition and committees
  - Written consents — what they're used for and any limits
- If `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md` has no minutes format: run cold-start first. Do not proceed with a generic format.
- In a plain chat with no plugin config file: use the minutes format, board members and committees the user pastes in. Ask for two or three past minutes if none are given. Where this skill says to read a setting from the config file, ask the user for it instead. If the user cannot say whether they are a lawyer, treat them as a non-lawyer.

---

## Step 1: Identify the meeting

### Calendar detection

If the calendar connector is authorized, search for upcoming events matching board and committee keywords:

**Search terms:** "Board of Directors", "Board Meeting", "Audit Committee", "Compensation Committee", "Comp Committee", "Nominating", "Nom/Gov", "Governance Committee", "Special Committee", "Board of Directors — [Company]"

**Time window:** Look 30 days forward. If no upcoming meeting is found, look 14 days back (minutes are often drafted after the fact).

Present what you find:

> I found the following board or committee meetings on your calendar:
>
> 1. **[Meeting name]** — [Date], [Time], [Location/Virtual]
> 2. **[Meeting name]** — [Date], [Time], [Location/Virtual]
>
> Which one are these minutes for? Or is it a different meeting not on here?

If the calendar connector is not authorized or returns nothing: ask directly — what meeting, what date, what type (full board / which committee)?

### Meeting metadata to confirm

Once the meeting is identified, confirm or fill in:

- **Meeting type:** Full Board of Directors / [Committee name]
- **Date and time**
- **Location or platform** (in-person address / Zoom / Teams / telephonic)
- **Called by / Notice:** Was proper notice given? (Yes / waived — waiver of notice is a common exhibit)

---

## Step 2: Attendance

Ask for the attendee list, or offer to pull from the calendar invite if the connector is authorized.

**Directors present:**
- Pull from board composition in `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md` as the starting point
- Ask who was actually present, who was absent, and whether any absent directors had advance notice

**Management present:**
- Who from management attended? (CFO, CAO, CTO, etc.)
- Note: management attendees are typically listed separately from directors

**Guests:**
- Outside counsel present? (Name and firm)
- Investment bankers, auditors, or other advisors?
- Any guests who attended for specific agenda items only (note their attendance as limited to that item)

**Chair:**
- Who chaired the meeting?
- Who acted as secretary?

**Quorum:**

- Check the charter and bylaws for the quorum requirement. If the charter is silent, research the applicable state corporate law for the default rule for this entity type. Record what you confirmed (source and pinpoint) in the drafting notes.
- Confirm quorum was present. If not: stop and flag before drafting. Do not produce minutes that imply a valid meeting occurred. Surface the question to outside counsel — the remediation path (ratification, re-meeting, written consent, other) depends on the state of incorporation and the nature of the action.

---

## Step 3: Materials

Ask for the meeting materials. These are the source for the agenda items and any resolutions.

> Can you share the agenda and any pre-read materials for this meeting? Even a rough agenda is enough to structure the minutes. If there were board slides or a management presentation, upload those too — I'll use them to fill in the agenda item summaries.
>
> If materials weren't distributed in advance, tell me the agenda items and I'll draft placeholders for each.

**From the agenda and slides, extract:**
- Agenda items in order
- Any resolutions proposed (look for board approval language: "approve," "authorize," "ratify," "adopt," "elect")
- Any exhibits referenced (management presentations, financial reports, legal memos, valuations)
- Any votes expected

**If no materials:** Ask for the agenda items verbally and proceed with placeholders for discussion content.

---

## Step 4: Draft the minutes

Use the house format from `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md`. Do not default to a generic format. The seed minutes are the template — replicate the structure, the header, the resolution language, the level of discussion detail.

### Standard structure (adapt to house format)

**Header block:**
```
MINUTES OF [MEETING TYPE] OF THE BOARD OF DIRECTORS
[OR: MINUTES OF THE [COMMITTEE NAME] OF THE BOARD OF DIRECTORS]
OF [COMPANY NAME]

[Date]
[Location / Telephonic / Video Conference]
```

**Opening:**
- Meeting called to order by [Chair name] at [time]
- Notice: [proper notice given / notice waived — attach waiver as exhibit if applicable]
- Quorum confirmed: [N of M directors present]
- Secretary: [name]

**Attendees:**
- Directors present: [list]
- Directors absent: [list, if any]
- Also present: [management, outside counsel, guests — with roles]

**Previous minutes:**
Standard language: approval of minutes from prior meeting. Pull date of prior meeting from `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md` board calendar if available, otherwise leave as [DATE OF PRIOR MEETING].

**Agenda items — one section per item:**

```
[AGENDA ITEM TITLE]

[Chair/presenter name] [presented / reported on / led a discussion of] [topic].

[Discussion summary — see drafting notes below]

[If resolution follows:]
Upon motion duly made and seconded, the following resolution was adopted [by unanimous vote / by a vote of N for, N against, N abstaining]:

RESOLVED, that [resolution text in house language from `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md`].
```

**Adjournment:**
Standard language: meeting adjourned at [time], there being no further business.

**Signature block:**
Secretary signature line. Some formats include a chair countersignature.

---

### Drafting notes

**Discussion summaries:** The hardest part of minutes is deciding how much discussion to capture. Follow the house format from seed documents exactly:

- *Long-form narrative:* Summarise the substance of the discussion — what questions were raised, what information was presented, what factors the board considered. Do not quote individuals unless the specific attribution matters legally.
- *Action minutes:* Note only what was presented and what action was taken. No discussion content beyond "the board discussed the matter."
- *Hybrid:* Full narrative for major items (acquisitions, financials, significant approvals), action-only for routine items.

When materials were provided: pull summary content from the slides and management presentation. The board "received and reviewed" a presentation — summarize what the presentation covered.

When no materials: insert `[PLACEHOLDER — summarize discussion here]` and flag it clearly. Do not fabricate discussion content.

**Resolutions:** Use the exact resolution language from the seed minutes — "RESOLVED, THAT" vs. "BE IT RESOLVED" vs. "RESOLVED" alone. The language is house style, not interchangeable.

**Exhibit references:** Number exhibits in the order they appear (Exhibit A, B, C). Common exhibits: management presentation, financial statements, valuation reports, legal opinions, waivers of notice, consents.

---

## Step 4.5: Consequential-action gate (adopt minutes)

**Before adopting minutes as final:** Read `## Who's using this` in `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md`. If the Role is **Non-lawyer**:

> Adopting minutes makes them the official record of what the board decided — they're the primary evidence of authorization for the actions taken at the meeting. Have you reviewed this with an attorney? If yes, proceed. If no, here's a brief to bring to them:
>
> - What was decided (resolutions, votes, who was present)
> - What the draft captures and what is still a placeholder
> - Open questions (any flagged attendance, quorum, or conflict notes)
> - What could go wrong (misstated resolutions, missing disclosures, quorum defects, privilege leakage in discussion summaries)
> - What to ask the attorney (is the discussion depth right for this board's practice; are exec-session notes properly segregated; do any items need more documentation)
>
> If you need to find an attorney, solicitor, barrister, or other authorised legal professional: contact your professional regulator (state bar in the US, SRA/Bar Standards Board in England & Wales, Law Society in Scotland/NI/Ireland/Canada/Australia, or your jurisdiction's equivalent) for a referral service.

Do not produce the final adoption-ready version past this gate without an explicit yes. A marked-DRAFT for attorney review is fine.

---

## Step 5: Output and review prompts

Produce the full draft. The minutes themselves are a corporate record, not privileged; do not apply the work-product header to the minutes as circulated. The drafting notes, placeholder flags, and review checklist below are work product — prepend the work-product header from `~/.claude/plugins/config/claude-for-legal/corporate-legal/CLAUDE.md` `## Outputs` (it differs by user role — see `## Who's using this`):

```
[WORK-PRODUCT HEADER — per plugin config ## Outputs — differs by role; see `## Who's using this`. With no plugin config, use: DRAFT FOR ATTORNEY REVIEW. Privileged and confidential where applicable.]
```

After the draft, add a review checklist:

```
[WORK-PRODUCT HEADER — as above]

REVIEW CHECKLIST — please verify before circulating:

□ All directors confirmed present/absent (check against actual attendance)
□ Quorum confirmed correct
□ Resolution language matches what was actually approved (check wording carefully)
□ Votes recorded correctly — any abstentions or dissents to note?
□ Exhibits numbered and referenced correctly
□ Any executive sessions held? (Add separate executive session note if so)
□ Any conflicts of interest disclosed? (Director recusal to note if applicable)
□ Time of adjournment to fill in
□ Outside counsel reviewed? (If required by your process)
```

Flag any sections where content is a placeholder and needs the attorney's input before the minutes are accurate.

Add as a final pre-adoption note on the draft, stripped before adoption:

> This is a draft for attorney review, not adopted minutes. Adopted minutes are the official record of board action and carry legal consequences — a licensed attorney reviews, edits, and takes professional responsibility before adoption. Do not adopt this draft unreviewed.

---

## Written consents

For drafting written consents in lieu of a meeting, use `/corporate-legal:written-consent`. That skill handles precedent search, state-law confirmation, and the scope warning for major one-off actions.

---

## What this skill does not do

- It does not attend the meeting or capture real-time discussion — it drafts from materials and attorney input.
- It does not determine whether a resolution is legally valid or sufficient — it drafts in house format; legal judgment on adequacy is the attorney's call.
- It does not finalize minutes — the draft requires attorney review before circulation.
- It does not distribute minutes — output is for the attorney to review, edit, and circulate via their own process.

Changed by AI Blocks (2026-10-28): added a plain-chat note at the top that replaces the plugin settings file, calendar, matter workspace and slash commands, and keeps state-law questions for the lawyer.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI knowledge file pack builder](https://useaiblocks.com/skills/ai-knowledge-file-pack-builder). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
