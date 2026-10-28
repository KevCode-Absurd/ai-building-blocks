---
name: weekly-prep-brief
description: "Generate a comprehensive weekly briefing for all external calls in the next 7 days. Triggers on 'weekly prep brief', 'prepare my week', 'what calls do I have this week', 'Monday prep', or any weekly planning request."
---

# Weekly Prep Brief

Generate a single comprehensive weekly briefing that covers every external customer or prospect call in the next 7 days, with per-meeting account and contact research from Common Room.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Briefing Process

### Step 1: Get the Week's External Meetings

**Option A — Calendar connected:**
Use your connected calendar tool (Google Calendar or Outlook, whichever the user has linked) to fetch all meetings scheduled in the next 7 days (or a user-specified range). Filter to keep only external meetings — those with attendees from outside your organization. Discard internal-only meetings, one-on-ones with colleagues, and recurring internal syncs.

Identify for each external meeting:
- Company name
- Meeting date and time
- External attendee names and email addresses

If no calendar tool is connected, go to Option B and tell the user why.

**Option B — No calendar connected:**
Ask the user: "To build your weekly prep brief, I'll need your upcoming external calls. Please list them: company name, date/time, and attendee names."

Accept freeform input and parse it into a structured list before proceeding.

### Step 2: Confirm the Meeting List

Present the identified meetings to the user for confirmation before beginning research:

> "Here are the external calls I found for this week. Let me know if anything's missing or should be excluded:
> - [Company] — [Day], [Time] — [Attendees]
> - ..."

This prevents wasted research on cancelled or incorrect meetings.

### Step 3: Research Each Meeting

For each confirmed external meeting, run in parallel where possible:
1. **Account research** — a full account snapshot. If you have an account-research skill, use it. If not, pull from Common Room: the account's size, open opportunities, recent activity and signals, and note anything missing.
2. **Contact research** — a profile for each external attendee. If you have a contact-research skill, use it. If not, pull from Common Room: role, recent activity and past conversations, and note anything missing.

Common Room data is the primary source. After CR research, run a quick **recency check** for each company — this is supplementary, not primary:
- Search `"[company name]" news` scoped to the last 7 days
- For executive attendees, search their name for recent public business posts or interviews about their work. Privacy rule: use only public business posts and news about the person in their professional role. Skip personal accounts, family, health, home address and anything not about their job.
- Only include findings that are genuinely noteworthy (funding, leadership changes, major press). Don't pad the brief with generic news.

Depth calibration:
- For high-priority accounts (large accounts, open opportunities, renewal risk), produce full depth research
- For lower-priority or short meetings, produce abbreviated snapshots (3–4 bullets each)

### Step 4: Synthesize the Weekly Brief

Compile all per-meeting research into a single structured document, sorted by meeting date/time.

Open with a brief week-level overview that flags:
- Any accounts with urgent signals (at-risk, trial expiring, expansion opportunity)
- Any meetings that need special preparation or executive involvement
- Total external call count and estimated time commitment

## Output Format

```
# Weekly Prep Brief — Week of [Date]

## Week Overview
[2–4 bullets: key themes, flagged priorities, call count]

---

## [Monday / Tuesday / etc.]

### [Company Name] — [Time]
**Attendees:** [Names and titles]
**Meeting type:** [Discovery / QBR / Renewal / Expansion / etc. — inferred if possible]

**Company Snapshot**
[4–5 bullets: account status, top signals, recent activity]

**Attendee Profiles**
- **[Name]** ([Title]): [2–3 bullets on their signals, persona, conversation angle]
- [Repeat per attendee]

**Top Signals This Week**
[2–3 most relevant signals for this specific call]

**This Week's News** [If notable news found]
[Only genuinely noteworthy findings — funding, leadership changes, major press]

**Recommended Objectives**
[1–2 sentences: what to accomplish in this meeting]

---

[Repeat per meeting, sorted by date/time]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Sell it** with the [Customer call prep writer](https://useaiblocks.com/skills/customer-call-prep-writer).
- The [Meeting transcript and notes writer](https://useaiblocks.com/skills/meeting-notes-maker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## When a Meeting Has Sparse Data

If Common Room returns limited data for a particular meeting's account or attendees, use a compressed format for that meeting instead of the full template:

```
### [Company Name] — [Time] ⚠️ Limited Data
**Attendees:** [Names and titles if known]
**Data available:** [What Common Room actually returned]

**Web Search Results**
[Findings from web search — company news, attendee LinkedIn profiles]

**Note:** Common Room has limited data on this account. The rep may want to check directly in CR or gather context from colleagues before this call.
```

Do not generate a full meeting prep section (company snapshot, signal highlights, talking points, recommended objectives) from sparse data. A short honest section is more useful than a fabricated full one.

## Quality Standards

- Keep each meeting section scannable — reps read these in the morning, often on mobile
- Always sort by date/time ascending
- Flag urgent situations prominently (risk, trial expiration, open opps) — don't bury them
- If a meeting has very thin Common Room data, use the sparse-data format above — never fill the full template with guesses
- Total brief should be readable in 10–15 minutes for a week with 4–6 meetings
- **Every fact must come from a tool call** — no invented deal context, activity, or signals

## Reference Files

- **`references/briefing-guide.md`** — guidelines for structuring briefings, prioritization logic, and how to handle edge cases (cancelled meetings, new accounts with no data, etc.)
