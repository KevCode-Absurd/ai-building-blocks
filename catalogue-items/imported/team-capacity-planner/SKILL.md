---
name: capacity-plan
description: Plan resource capacity — workload analysis and utilization forecasting. Use when heading into quarterly planning, the team feels overallocated and you need the numbers, deciding whether to hire or deprioritize, or stress-testing whether upcoming projects fit the people you have.
argument-hint: "<team or project scope>"
---

# /capacity-plan

Compare your team's available hours with the work they hold and the work coming, then show what to do about the gap. Based on the capacity-plan skill from Anthropic's knowledge-work-plugins (Apache-2.0).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It needs your numbers pasted in. A tracker or calendar connection saves typing.
<!-- /needs -->

## Usage

```
/capacity-plan $ARGUMENTS
```

## What I need from you

1. **Team and roles** (required): each person or role, and their hours per week. If hours are missing, ask once. If they still are not given, write `MISSING: hours` and do not assume 40.
2. **Current work** (required): what each person is on, and about how many hours per week it takes. Paste a list, a tracker export or a plain description.
3. **Time off and fixed load** (optional): holidays, leave, recurring meetings, support or on-call duty. If none is given, say the plan assumes none.
4. **Upcoming work** (required for the gap): projects or requests in the planning period, with start and end dates and the effort or people needed. This can be a document, such as a contract summary or scope list: size each item it marks out of scope or unclear as a request.
5. **Constraints** (optional): budget, hiring timeline, skills a project needs.

If your AI is connected to a project tracker or calendar, read workloads, leave and meeting load from there and show the user what you found before you use it.

## Steps

1. **Set the period and list the facts.** State the date range. Build the table of people, hours available and hours allocated. Subtract time off and fixed load from hours available before you work out utilization.
2. **Work out utilization.** Utilization is allocated hours divided by available hours. Compare it with the targets below. Flag anyone over 100% and anyone far above target.
3. **Add the demand.** For each upcoming project, put its hours or people needed against the free hours in its dates. Mark each one Covered or Gap, and name the weeks that crunch.
4. **Find the bottlenecks.** Name the role or time period that is oversubscribed. Only name a skill gap if the user gave skills or roles. Do not assume what a person can or can't do beyond their stated role and current work.
5. **Write options.** Give three to five: do nothing, delay, reprioritize, hire, use contractors, or cut a recurring load. For each, say what it frees up or costs in hours, using the user's numbers. Check any conversion between hours and full-time people (FTE) against the weekly hours the user gave. Don't claim a saving the numbers do not support. For example, cutting a meeting only frees the hours that meeting really uses.
6. **Recommend.** Pick one option, say why, and say what would change your mind. If the choice depends on facts you lack, say so.
7. **Check before you answer.** Every number comes from the user's input or from arithmetic on it. Totals add up. Any assumption is listed under "Assumptions". Show your arithmetic for any figure the user may question.

## Utilization targets

These are common rules of thumb, not laws. Say the user can change them.

| Role type | Target utilization | Notes |
|---|---|---|
| Individual contributor or specialist | 75 to 80% | Leaves room for reactive work and growth |
| Manager | 60 to 70% | Meetings, 1:1s and team overhead |
| On-call or support | 50 to 60% | Interrupt-driven work is hard to predict |

## Common mistakes

- Planning to 100% utilization, with no buffer for surprises.
- Ignoring meeting load and the cost of switching between tasks.
- Forgetting vacation, holidays and sick time.
- Treating all hours as equal. Deep creative work is not the same as admin.

## Output format

```markdown
## Capacity plan: <team or project>
**Period:** <date range> | **Team size:** <number>

### Current utilization
| Person or role | Hours available per week | Allocated | Free | Utilization |
|---|---|---|---|---|
| <name or role> | <hrs> | <hrs> | <hrs> | <percent> |

### Capacity summary
- **Total available:** <hours per week>
- **Allocated:** <hours per week> (<percent>)
- **Free:** <hours per week> (<percent>)
- **Over 100%:** <names or roles>

### Upcoming demand
| Project | Start | End | Hours or people needed | Covered or gap |
|---|---|---|---|---|

### Bottlenecks
- <role or period that is oversubscribed, and why>

### Options
| Option | What changes | Cost or trade-off |
|---|---|---|
| Do nothing | <what happens> | |
| <Hire, contract, delay, reprioritize> | <hours freed or added> | <cost or risk> |

### Recommendation
<one option, why, and what would change it>

### Assumptions and missing facts
- <each assumption, and each MISSING item>
```

End with one line for leadership that states the gap in hours and the chosen option.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Project risk portfolio planner](https://useaiblocks.com/skills/project-risk-portfolio). It takes the plan.
- The [Handover note writer](https://useaiblocks.com/prompts/handover-note-writer). It takes the plan.
- The [Stakeholder update writer](https://useaiblocks.com/skills/stakeholder-update-writer). It takes the plan.
- The [Team absence coverage reviewer](https://useaiblocks.com/skills/weekly-team-coverage-review-assistant).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Tips

1. Include all work: routine work, projects, support and meetings. People are never 100% free for project work.
2. Plan for buffer. About 80% utilization leaves room for surprises.
3. Capacity plans go stale. Review monthly, and again when a person joins, leaves or a big request lands.
