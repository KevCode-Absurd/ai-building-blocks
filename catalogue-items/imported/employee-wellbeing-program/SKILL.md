---
name: hr-wellbeing
description: "Help HR business partners, wellbeing program managers, and people leaders understand, design, and run employee wellbeing, mental health, and work-life balance initiatives. Use when asked to design a wellbeing program, run a burnout risk assessment, build a mental health support plan, design a flexible work policy, respond to a wellbeing crisis, measure employee wellbeing, design a return-to-work plan after burnout leave, or any employee wellbeing, mental health, and work-life balance task."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR employee wellbeing

Comprehensive employee wellbeing knowledge for HR business partners, wellbeing program managers, and people leaders — from understanding modern wellbeing program design and mental health support principles to running burnout risk assessments, building flexible work policies, and leading post-crisis stabilization.

This is HR planning support. It is not medical advice, and it cannot diagnose anyone.

## Safety first

- If someone may be in danger or may harm themselves, stop. Tell the user to contact local emergency services, or the person's clinician or crisis line, right now. Do not draft a plan for that moment.
- Never name or diagnose individual employees from data. Work with team-level numbers only.
- Before the user shares survey, workload or leave data, remind them to remove names and health details and to check their data protection rules. Employees should know what is measured and why. Do not design hidden monitoring of individuals.

## How to run this skill

1. **Ask once for what is missing.** You need: team size and type of work, known pressures or risks (such as a restructure or long hours), and the budget range if there is one. Optional: existing benefits and policies, survey or workload data (team level). If the user gives none, write `MISSING: <what>`. Never invent numbers about their team.
2. **Check the risk.** From what the user gave, name the most likely sources of burnout (workload, change, unclear roles, manager support). Mark each as a signal to check, not a finding. Offer a short early-warning checklist for managers: signs to watch and a question to ask.
3. **Write the plan.** Cover the program's goals, the actions by owner, support steps (employee assistance, flexible work, leave), manager training, and how you will measure whether it helped (behaviour and retention, not just attendance at events). If the user wants options, compare two or three and say the trade-offs.
4. **Write the manager guide.** What to say and do when someone shows signs of burnout or discloses a problem, who to call at HR, and what stays private. Leave a place for the local emergency number and the employee assistance contact: `[ADD]`.
5. **Write the return-to-work plan** if someone is coming back from burnout or mental health leave. Include the first week and check-ins at 30, 60 and 90 days. Say that workload should be agreed with the person, and that medical details are theirs to share.
6. **Draft staff messages** and, if asked, a short proposal for leaders. Do not claim results you do not have, and do not cite industry statistics unless the user gives a source.

### Output format

```
## Wellbeing plan
Goals / Risks to check / Actions (owner, date) / Measures
## Manager early-warning checklist
## Manager guide
## Crisis steps (with [ADD] contact slots)
## Return-to-work plan
Week 1 / 30-day check-in / 60-day check-in / 90-day check-in
## Staff messages
## Proposal for leaders (if asked)
## MISSING (anything you could not fill)
```

## Supported tasks

- Explaining employee wellbeing concepts and terminology for HR teams and business leaders
- Designing wellbeing programs aligned to workforce needs and organizational risk
- Running burnout risk assessments and early warning diagnostics
- Building mental health support plans and crisis response protocols
- Designing flexible work, leave, and work-life balance policies
- Measuring employee wellbeing through behavioral and survey-based signals
- Designing return-to-work plans following burnout or mental health leave
- Using AI tools to analyze wellbeing data and draft support communications
- Writing wellbeing program proposals, manager guidance, and employee communications

## What good wellbeing work includes

Wellbeing is more than a yearly wellness week, an employee assistance program nobody knows how to use, or help that starts after someone has gone on leave. Good practice usually includes:

- checking workload and survey signals through the year, not only once
- training managers to spot early burnout signs
- flexible work policies built around outcomes where the work allows it
- mental health support that people can reach without stigma
- crisis steps that are written down before they are needed
- a return-to-work plan, not ad hoc reintegration after leave
- measures that look at behaviour and retention, not only participation

## Tools people use (examples only, not endorsements; check current features and prices)

- Wellbeing and benefits platforms such as Lyra Health, Spring Health, Headspace for Work, Modern Health and Wellhub
- Employee assistance programs (EAPs), telehealth and crisis hotlines
- Survey and workload tools such as Culture Amp, Glint, Qualtrics Employee Experience and Microsoft Viva Insights
- Leave management tools such as Workday Absence Management
- A chat AI such as ChatGPT or Claude, for drafting messages and looking at team-level patterns

## Key prompts

### Wellbeing program design

1. "Help me design a [wellbeing program] for [a 200-person company with high reported burnout in engineering] while staying within [a defined annual budget]."
2. "What is the right [mix of EAP, flexible work, and manager training] for [a company experiencing rising disengagement after a period of rapid growth]?"
3. "Design a [psychological safety framework] clarifying how [managers and HR] should respond when [an employee discloses a mental health concern]."
4. "How do I evaluate whether [an outcome-based flexible work policy] or [a structured hybrid schedule] better fits [our current team collaboration needs]?"
5. "Help me model [three wellbeing program options] for [addressing burnout risk in a high-pressure sales team] and compare the trade-offs of each."

### Burnout risk and early detection

1. "Build a [burnout risk assessment] for [a 150-person company] using [workload, overtime, and engagement signals]."
2. "Design a [manager early warning checklist] identifying which [behavioral signals] indicate [a team member may be approaching burnout]."
3. "What are the most common [sources of burnout] during [sustained organizational change], and how do I address them before they escalate?"
4. "Help me design a [workload rebalancing plan] for [a team showing early burnout signals after a reorganization]."
5. "How do I measure whether [a wellbeing intervention] has actually reduced [burnout risk], beyond [tracking program participation]?"

### Mental health support and crisis response

1. "Design a [mental health crisis response protocol] for [a 150-person company] that goes beyond [a general EAP referral] to include [clear escalation steps]."
2. "An employee disclosed [a mental health crisis] to their manager. What should the manager do, and what should HR's role be?"
3. "How do I measure [psychological safety] using a framework like [structured pulse surveys] for [a mid-size company]?"
4. "Help me prepare a [manager guide] for [supporting a team member returning from mental health leave]."
5. "What does a [psychologically safe team] look like in [practical, observable terms] rather than [an abstract values statement]?"

### Flexible work, leave, and AI-assisted wellbeing

1. "Design a [return-to-work plan] for [an employee returning after 6 weeks of burnout-related leave]."
2. "How do I reconcile [an outcome-based flexible work policy] with [team collaboration needs] without creating [inequity between remote and in-office employees]?"
3. "Use AI to analyze [our latest team-level engagement and workload data] and identify [the top 3 teams to look at first] before [next quarter]."
4. "Help me draft a [manager talking points document] for [checking in with a team showing early disengagement signals]."
5. "What should I include in a [90-day post-intervention review] to make sure [a wellbeing program actually reduced risk] rather than [participation alone looking like success]?"

## Common HR misunderstandings

### Wellbeing is more than perks and events

Wellness events and perks are one visible part of a wellbeing strategy. Full wellbeing work also includes burnout risk monitoring, manager training, crisis response, and return-to-work planning.

### Wellbeing is not just an annual survey score

A single engagement or wellbeing survey number does not capture organizational health. Strong wellbeing practice triangulates survey data with workload indicators (overtime patterns, after-hours activity, team turnover) and qualitative signals from manager check-ins, using team-level data.

### Returning to work does not end at the return date

The period immediately following a return from burnout or mental health leave is when relapse risk is highest if workload and support are not deliberately managed. Effective wellbeing practice treats the first 90 days after return as critical as the leave period itself.

## Tips

- Test several options before you commit. Model at least two or three approaches and compare trade-offs explicitly.
- Manager training should begin alongside program design, not after rollout. Managers are most often the first to see early burnout signals.
- Pair wellbeing measures with workload data. A burnout signal often traces back to workload and structure, not personal resilience alone.
- The first 90 days after any return-to-work transition deserve a dedicated check-in cadence. Without one, workload often quietly creeps back to pre-leave levels.
