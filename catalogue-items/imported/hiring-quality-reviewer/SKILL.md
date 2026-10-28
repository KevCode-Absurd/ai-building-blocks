---
name: hiring-quality
description: "This skill should be used when the user asks about quality of hire, hiring survey, candidate experience survey, HM satisfaction, retrospective, what did we learn, silver medalist, onboarding checklist, pre-boarding, post-hire, process improvement, hiring quality, search retro, hiring metrics, candidate NPS, how was the process, lessons learned, or needs to measure, analyze, or improve hiring quality at any stage."
---

# Hiring Quality for Recruiting

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Your notes** (yours): what to keep, change or drop.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, your notes. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose

Close the feedback loop on hiring: measure quality of hire, capture hiring manager and candidate experience, run search retrospectives, manage silver medalists, and coordinate onboarding handoff. This is the "learn and improve" engine of the recruiting function.

## How to run it

1. Ask what the person needs: surveys, a look back at the search, a silver medalist list, a pre-boarding checklist, or all four. If they say "all", do all four in the order below.
2. Ask for the facts of the finished search: role, how long it took, where the candidates came from (source of hire), interview scores if any, outcome (filled, cancelled), start date of the new hire, and any feedback from the hiring manager or new hire. If a fact is missing, write MISSING in that spot. Do not invent scores, dates, sources or names.
3. If the search is still open and no offer has been accepted, stop. Say that this skill is for a closed search, and offer a progress check instead.
4. Write the surveys (Quality of Hire, Hiring Manager, Candidate) from the question sets below and in `references/survey-templates.md`. Use the person's role and company name only where they gave them.
5. Run the look back. Use the retro agenda below on the facts given. Where the facts do not support a finding (for example, no scores to compare interviewers), say "not enough data" and name what to collect next time. Finish with 3 specific changes.
6. Build the silver medalist list only from candidates the person names. Use the capture fields below.
7. Build the pre-boarding checklist from the start date. Use `references/onboarding-checklists.md` for the role family.
8. End with "Before you send": who should read each item, and what to check.

## Output

```markdown
## Hiring quality review: <role>, <date>

### Surveys
- Quality of hire check-ins (30, 60, 90 days): <questions>
- Hiring manager survey: <5 questions>
- Candidate survey, by outcome: <questions per outcome>

### Search look back
- Timeline: <actual vs target, where time was lost>
- What worked / what did not: <points>
- Sources and interviewers: <what the data shows, or "not enough data">
- 3 changes for next time: <list>

### Silver medalists
| Candidate | Strengths | Good for | Re-contact on |
|-----------|-----------|----------|---------------|

### Pre-boarding checklist
<items by date, with owner>

### Before you send
- <who checks what>
```

Save the look back as `roles/<role-name>/reports/retrospective.md` if your AI can write files. If not, give it as text.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [30-60-90 day onboarding planner](https://useaiblocks.com/skills/30-60-90-day-onboarding-planner).
- The [Hiring search brief writer](https://useaiblocks.com/skills/hiring-search-brief-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Quality of Hire Framework

**What to measure:**

| Metric | Source | Timing | Target |
|--------|--------|--------|--------|
| Hiring Manager Satisfaction | HM survey | 30/60/90 days | Set your own target, such as an average score you would call good |
| New Hire Performance Rating | Performance review | 6/12 months | Meets/Exceeds expectations |
| Ramp Time to Productivity | HM assessment | 90 days | Within expected range per role |
| Retention | HRIS data | 6/12/24 months | Your own target |
| New Hire Engagement | Engagement survey | 90 days | Equal to or above team avg |

The targets are examples to adjust to your company. They are not proven industry norms. Do not present a number as a standard unless the person gives a source.

**Survey cadence:** 30-day check-in → 60-day deeper dive → 90-day full assessment

**Question design principles:**

- Mix quantitative (1-5 scale) with qualitative (open-ended)
- Ask about specific behaviors, not general impressions
- Include a "would you hire this person again?" question
- Correlate QoH scores back to upstream signals: source of hire, interviewer scores, time-in-process (only when the person has that data)

## HM Experience Survey

**5 default dimensions:**

1. **Communication** — "The recruiter kept me informed throughout the process" (1-5)
2. **Intake Quality** — "The recruiter understood the role requirements after our intake meeting" (1-5)
3. **Candidate Identification** — "The candidates presented matched what I was looking for" (1-5)
4. **Scheduling & Pace** — "The process moved at an appropriate pace" (1-5)
5. **Overall Satisfaction** — "I would work with this recruiter again on a future search" (1-5)

**When to send:** Within 1 week of offer acceptance or role closure

**Response collection:** Anonymous optional, but recommend named for actionable feedback

## Candidate Experience Survey

Before any survey goes out, add a short privacy note at the top: why you are asking, who will read the answers, how long you will keep them, and that replying is optional. Follow your local data rules.

**Stage-appropriate surveys — different questions by outcome:**

| Candidate Status | Survey Focus | Timing |
|-----------------|-------------|--------|
| Hired | End-to-end experience, decision factors | Day 1-3 |
| Rejected at screen | Speed, communication quality, respect | 3 days after rejection |
| Rejected after interview | Fairness, feedback quality, would they reapply | 3 days after rejection |
| Rejected at final round | Depth of experience, closure quality | 3 days after rejection |
| Withdrew | Why they withdrew, what could change their mind | 1 day after withdrawal |

**Candidate NPS:** "On a scale of 0-10, how likely are you to recommend applying at [Company] to a friend?"

- Promoters (9-10), Passives (7-8), Detractors (0-6)
- Segment by outcome (hired vs rejected)

**Anonymity:** Always anonymous for rejected candidates. Named is fine for hired candidates.

## Retrospective Framework

**When to run:** After every closed search (filled or cancelled).

**Who attends:** Recruiter, hiring manager, lead interviewer(s). 30-45 minutes.

**Retro agenda:**

1. **Timeline review** (5 min) — actual vs target, where time was lost
2. **What worked** (10 min) — effective sourcing channels, good interview stages, strong collaborators
3. **What didn't work** (10 min) — wasted effort, poor-quality channels, process friction, calibration misses
4. **Calibration accuracy** (5 min) — did the initial persona match the hired candidate? If not, what changed?
5. **Source effectiveness** (5 min) — which channels produced candidates that advanced? Which were noise?
6. **Process friction** (5 min) — scheduling delays, interviewer availability, tool issues
7. **Lessons & action items** (5 min) — 3 specific things to do differently next time

## Silver Medalist Management

**Definition:** Candidates who scored "Hire" or "Strong Hire" but didn't get the offer (e.g., another candidate was selected, role was cancelled, timing didn't work).

**What to capture (in candidate file):**

- Date identified as silver medalist
- Strengths summary
- Roles they'd be good for
- Preferred re-engagement timing
- Last contact date
- Nurture status

Ask the candidate's permission before keeping them on a list. Follow your local data rules on how long you may keep their details.

**Nurture cadence:**

| Timing | Action | Channel |
|--------|--------|---------|
| Immediately | Thank them, tell them they were strong, ask permission to stay in touch | Phone/Email |
| 1 month | Share relevant company news or content | Email |
| 3 months | Check in on career status, mention any new roles | Email/LinkedIn |
| 6 months | Deeper re-engagement if new role opens | Phone |
| Trigger: new matching role | Immediate priority outreach | Phone + Email |

## Onboarding Handoff

**Pre-boarding checklist (offer accepted → day 1):**

- Equipment ordered and configured
- System access provisioned (email, Slack, tools)
- Welcome email sent (from hiring manager)
- Buddy assigned and briefed
- First-week schedule created
- Team introduction prepared
- Hiring manager prep (expectations discussion, 30/60/90 alignment)

**Recruiter-to-HR handoff protocol:**

- Transfer: offer details, candidate preferences, start logistics, any special arrangements
- Warm introduction: connect new hire with HR/People partner
- Final recruiter touchpoint: "Welcome! Here's who handles what from here"

**Timeline:**

| Timing | Action | Owner |
|--------|--------|-------|
| Offer + 1 day | Welcome email from HM | Hiring Manager |
| Offer + 3 days | Equipment/access request | Recruiter → IT |
| Offer + 1 week | Buddy assignment | Hiring Manager |
| Day -5 | Pre-boarding email with logistics | HR/Recruiter |
| Day -2 | Confirm everything is ready | Recruiter |
| Day 1 | Welcome, orientation, team intro | HM + HR + Buddy |
| Day 7 | Recruiter check-in | Recruiter |
| Day 30 | QoH survey (round 1) | Recruiter |

## Cross-Role Analytics

Use this only when the person gives data for several searches.

| Metric | Formula |
|--------|---------|
| Time-to-Fill | Days from opening to offer acceptance |
| Source Effectiveness | % of hires per source channel |
| Conversion Rate (per stage) | Candidates advancing / candidates entering stage |
| Offer Acceptance Rate | Offers accepted / offers extended |
| Cost-per-Hire | Total recruiting costs / hires |
| Interview-to-Offer | Interviews conducted / offers extended |

**Spot systemic issues** from the person's own numbers. For example, if very few candidates pass screening, the targeting may be off. If most hiring managers reject the shortlist, the intake may need work. If many offers are declined, look at pay and the offer process. If one source produces the most hires but the worst retention, reconsider it. Do not apply fixed cut-off numbers unless the person gives them.

## Reference Files

Read these when they are available:

- **`references/survey-templates.md`** — Ready-to-use survey question sets for QoH, HM experience, and candidate experience.
- **`references/retrospective-guide.md`** — Step-by-step retro facilitation guide with examples.
- **`references/onboarding-checklists.md`** — Pre-boarding checklist templates by role family.
