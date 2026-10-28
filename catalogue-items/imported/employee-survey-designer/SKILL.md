---
name: hr-employee-listening
description: "Help HR teams design and manage employee listening strategies including engagement surveys, pulse checks, focus groups, and feedback programs. Use when asked to run an employee survey, design an engagement program, analyze survey results, build a listening strategy, conduct focus groups, or similar employee feedback tasks."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR employee listening

Build a comprehensive employee listening strategy — from designing engagement surveys and pulse checks to running focus groups, analyzing results, and translating feedback into action plans that improve the employee experience.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This is a writing and reading job. Claude, ChatGPT or Gemini all do it well.
- **Google Forms or your survey tool:** You send the survey from there. The AI writes the questions only.
<!-- /needs -->

## How to run this skill

1. **Ask once for what is missing.** You need: what the user wants to learn, how many people and teams will answer, and the channel. Optional: past results. If the goal is vague ("see how people feel"), suggest one of three: a full survey, a short pulse, or a focus group. Let the user pick.
2. **Write the survey.** Group questions by theme. Give each an answer scale (for example agree to disagree) and keep each question to one idea. Add a short intro that says why you ask, who sees the answers and what happens next. These are clear, plain questions. Do not call them "validated" unless the user names a published source.
3. **Write the listening guide** if asked: a focus group, stay interview or skip-level guide, with open questions and a note on how to keep notes without names.
4. **Read results only from numbers and comments the user pastes.** Find the top themes. Split by team, role or tenure only where the group is big enough that no one can be identified. Ask the user to choose a minimum group size. If you have no results, say so and stop at the survey.
5. **Never invent benchmarks.** If the user wants to compare with other companies, ask for their own past results or a named source. If they have neither, say you cannot give a comparison.
6. **Write the action plan** (theme, action, owner, date), a guide for managers to talk through team results, and a launch and follow-up plan. Use `[BRACKETS]` for owners and dates the user must set.
7. **Stop and say so** if the input is really one person's complaint or a misconduct claim. That needs a proper process, not a survey.

### Output format

```
## What we want to learn
## Survey questions
## Focus group or stay interview guide
## Reading the results
## Action plan
| Theme | Action | Owner | Date |
## Manager guide for team results
## Launch and follow-up plan
## MISSING (anything you could not fill)
```

## Supported tasks

- Designing comprehensive employee listening strategies across multiple channels
- Creating employee engagement survey instruments with clear, plain question sets (not statistically validated unless you name a published source)
- Building pulse survey programs for real-time sentiment tracking
- Developing focus group and interview guides for qualitative listening
- Analyzing and interpreting survey data to surface actionable insights
- Creating action planning frameworks for responding to survey findings
- Designing manager enablement materials for using team-level results
- Building communication plans for survey launch, results sharing, and follow-up
- Measuring listening program effectiveness and response rates
- Benchmarking engagement scores against your own past results or a named source the user supplies. Never invent benchmark figures.

## Key prompts

### Survey design

1. "Create an employee engagement survey with [20/40/60] questions covering [key dimensions]."
2. "Design a quarterly pulse survey focused on [wellbeing/manager effectiveness/culture]."
3. "Write onboarding survey questions for [30/60/90]-day new hire check-ins."
4. "Develop a manager effectiveness survey for upward feedback."
5. "Create a post-restructuring sentiment survey to assess employee confidence."

### Focus groups and qualitative listening

1. "Write a focus group discussion guide exploring [low engagement/high attrition/culture] themes."
2. "Create a stay interview guide for managers conducting retention conversations."
3. "Develop a skip-level meeting guide to improve leadership visibility."
4. "Design a listening tour framework for new HR leaders joining an organization."
5. "Write a virtual focus group facilitation guide for distributed teams."

### Analysis and insights

1. "Analyze these survey results and identify the top 3 priority areas for action."
2. "Create a data analysis framework for segmenting engagement by [tenure/function/level]."
3. "Develop an insight narrative template for presenting survey findings to leadership."
4. "Write an executive summary of survey results with recommendations."
5. "Build a driver analysis framework connecting engagement dimensions to retention outcomes."

### Action planning and follow-through

1. "Create a team-level action planning template for managers responding to survey results."
2. "Develop a 90-day listening action plan for [low-scoring area]."
3. "Write a communication template announcing survey results and planned actions."
4. "Design a follow-up pulse to measure progress on engagement action plans."
5. "Create a manager guide for facilitating team conversations about survey results."

## Tips

- Follow up every survey with visible action—employees disengage from listening programs when feedback appears to disappear.
- Communicate results within 4-6 weeks of survey close to maintain trust and momentum.
- Segment results by manager, function, and tenure to identify where action is most needed rather than reporting only company averages.
- Balance quantitative surveys with qualitative listening through focus groups and stay interviews.
- Protect anonymity rigorously—employees need to trust that individual responses cannot be identified.
- Track listening program participation rates as a leading indicator of overall organizational trust.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [People risk register builder](https://useaiblocks.com/skills/people-risk-register-builder). It takes the document.
- The [Employee data privacy checker](https://useaiblocks.com/skills/employee-data-privacy-checker). It takes the document.
- The [Employee termination risk reviewer](https://useaiblocks.com/skills/termination-risk-checker). It takes the plan.
- **Lead the team** with the [Change rollout planner](https://useaiblocks.com/skills/change-rollout-planner). It takes the plan.
- The [New hire onboarding reviewer](https://useaiblocks.com/skills/new-hire-onboarding-keeper).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
