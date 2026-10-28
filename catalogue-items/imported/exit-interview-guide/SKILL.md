---
name: hr-employee-relations
description: "Help HR managers with employee relations matters. Use when asked to handle a grievance, conduct an exit interview, manage workplace investigations, create a remote work policy, write employee contracts, manage accommodations, conduct satisfaction surveys, or any employee relations task."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR employee relations

Comprehensive employee relations support — from managing workplace investigations, grievances, and accommodations to conducting surveys, developing policies, and building a positive workplace culture.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This is a writing and planning job. Claude, ChatGPT or Gemini all do it well.
<!-- /needs -->

## How to run this skill

Pick the job first: an exit or stay interview, or a grievance (an employee complaint).

### Exit or stay interview

1. **Ask once for what is missing.** The role and team (no names needed), why the person is leaving if known, and any past exit feedback. If you have none, write `MISSING: <what>`.
2. **Write the question list** by theme: the role, the manager, growth, pay and benefits, culture, why they are leaving, and what would have kept them. Keep it to 10 to 12 questions.
3. **Add how to run it:** who should lead it (not the person's manager), a private place, a calm and thank-you tone, and a note that it is voluntary.
4. **Add the trend method:** tag each answer by theme and add them up every quarter. Share themes only, never one person's words with their name.
5. **For a stay interview,** write 6 to 8 questions on what keeps a strong person here, what would make them leave, and what to change.

### Grievance (employee complaint)

Run these steps in order. Give each step a short output.

1. **Intake.** Write a neutral note: who, what, when, where and who saw it. Record the employee's words. No conclusions yet. Output: intake note.
2. **Acknowledge.** Draft a short message that thanks the person, says what happens next and when, and that retaliation is not allowed. Output: acknowledgement message.
3. **Plan the fact-finding.** List each allegation, the evidence needed (messages, records, witnesses) and the order of interviews. Output: case plan table.
4. **Decide.** Help the user weigh the evidence and write a clear outcome, based on facts and company policy, not assumptions. Output: outcome note with reasons.
5. **Communicate and offer an appeal.** Draft what each side is told, and how to appeal if your policy allows it. Output: outcome messages.
6. **Close and follow up.** A closing checklist and a follow-up date. Output: closure checklist.

### Rules

- Check company policy and local law. Ask the user for their policy. Do not state a legal rule for a place unless the user gives it. If you do mention one, say it is general and a lawyer should confirm it.
- Keep documents neutral. Write what was seen or said, not guesses about intent.
- Serious claims (harassment, discrimination, safety, or a legal dispute): stop. Tell the user to use the Workplace investigation guide and to talk to an employment lawyer.
- We help you write a clear record. Whether it will stand up legally is for your lawyer.

### Output format

```
## Exit interview questions (by theme)
## How to run the talk
## Trend method
## Stay interview questions
## Case plan (intake, acknowledge, fact-finding, decide, appeal, close)
## Case record template
## MISSING (anything you could not fill)
```

This is guidance for HR, not legal advice.

## Supported tasks

- Conducting exit interviews and stay interviews
- Managing employee grievances and relations cases
- Managing workplace investigations and performance improvement plans
- Writing employee contracts and flexible work policies
- Creating harassment prevention and remote work policies
- Conducting employee satisfaction surveys
- Developing diversity and inclusion training
- Developing conflict resolution and team-building strategies
- Creating internal communications strategies
- Developing employee assistance programs (EAPs)
- Labor union engagement and collective bargaining support

## Key prompts

### Exit and stay interviews

1. "Write a structured exit interview questionnaire that gathers actionable feedback from departing employees."
2. "How can I conduct exit interviews in a confidential and non-confrontational manner to get honest feedback?"
3. "How should I analyze exit interview data to identify turnover trends and take corrective action?"
4. "Write stay interview questions that identify what keeps our best employees engaged and what risks their departure."
5. "How can I use stay interview insights to develop targeted retention initiatives?"
6. "What strategies can reduce voluntary turnover among [specific employee group] based on exit interview themes?"

### Grievance and case management

1. "How should I handle an employee grievance about [issue] fairly and in accordance with our policies?"
2. "What steps should I follow when managing an employee relations case involving [situation]?"
3. "How can I document an employee relations case so the record is clear and complete? (A lawyer decides if it will hold up legally.)"
4. "What are best practices for managing a performance improvement plan in a way that supports the employee?"
5. "How should I respond to an employee complaint about [workplace issue]?"

### Workplace investigations

1. "What are the steps to conduct a fair and thorough workplace investigation into [complaint/allegation]?"
2. "How should I document findings from a workplace investigation so they are clear and complete? (A lawyer decides legal protection.)"
3. "What investigation techniques help gather evidence in a sensitive workplace matter?"
4. "How can I ensure confidentiality throughout a workplace investigation?"
5. "What should a final investigation report include for a case involving [type of allegation]?"

### Policies, contracts, and team communications

1. "Write a remote work policy that balances flexibility with accountability and business needs."
2. "What should be included in a flexible work policy that covers hybrid, remote, and alternative schedules?"
3. "Write an employee contract template for a [full-time/part-time/contract] [job title] role."
4. "Write a harassment prevention policy that is clear, comprehensive, and legally compliant."
5. "Develop team-building strategies for a [remote/hybrid/in-person] team experiencing low morale."
6. "Write an internal communications strategy that keeps employees informed and engaged during [change/transition]."
7. "Create an HR communication plan for announcing [policy change/restructuring/new program]."

### Employee surveys

1. "Write an employee satisfaction survey that measures engagement, culture, and management effectiveness."
2. "How should I design and administer a diversity and inclusion survey to get honest, actionable feedback?"
3. "What questions best reveal the root causes of employee dissatisfaction in [department/team]?"
4. "How can I analyze survey results to prioritize HR interventions for greatest impact?"

### Accommodations and support

1. "How should I manage a workplace accommodation request for an employee with [disability/medical condition]?"
2. "What are the legal requirements and best practices for providing reasonable accommodations?"
3. "How can HR develop an employee assistance program (EAP) that effectively supports employee well-being?"
4. "What mental health support programs are most effective in reducing stigma and improving help-seeking?"

## Tips

- Document all employee relations conversations and investigations promptly and thoroughly.
- Approach sensitive situations with empathy first — employees need to feel heard before solutions are presented.
- Establish consistent processes for grievances and investigations to ensure fair treatment for all.
- Use exit interview data systematically — aggregate themes quarterly to identify systemic issues.
- Proactively conduct stay interviews to address retention risks before employees decide to leave.
- The original author's tip for Vietnam: the Labor Code requires specific paperwork for discipline and termination. This applies only where Vietnamese law applies, and we have not checked it. Wherever you are, check your own local rules with a lawyer.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Workplace investigation planner](https://useaiblocks.com/skills/workplace-investigation-guide). It takes the document.
- The [Fair candidate comparer](https://useaiblocks.com/skills/fair-candidate-comparer). It takes the document.
- The [Interview scorecard builder](https://useaiblocks.com/skills/interview-scorecard-builder). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
