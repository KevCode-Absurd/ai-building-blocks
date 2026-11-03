# Prompts

Five prompts to build, run and train your agent. Copy one, paste it into your AI, and add what it asks for.

## 1. Build my agent

Use this once, at the start. Attach the empty AGENT.md, PERMISSIONS.md and CHECKS.md from the starter pack.

```
Help me set up an AI agent for one job I do often. I've attached three files to fill in: AGENT.md, PERMISSIONS.md and CHECKS.md.

Interview me. Ask one short question at a time, at most 15 in all. I can skip any question or say "enough" to stop.
Start with the job: what starts it, what I do, who it's for and what a good result looks like. Then ask how I like it done, the tone, where true facts come from, and what must never happen.

Then fill in the three files:
- AGENT.md: every part, in my words where you can.
- PERMISSIONS.md: keep the green and red lists. Leave yellow empty. Add any red actions this job could need.
- CHECKS.md: 5 to 10 yes or no checks for this job, and 3 test jobs with what a good answer has. Make test job 3 a case where the agent should stop and ask.

Rules for you:
- Don't guess. If I haven't told you something, leave that part empty and list it at the end as a question.
- Leave out passwords, keys, account numbers, health details and private facts about other people.

Show me each file in its own Markdown block, with its file name above it. Then ask me what to fix.
```

## 2. Do a job

Use this when your AI isn't set up with the agent's files. If they are in a project, Gem or folder already, just give the job.

```
You are my agent for the job in AGENT.md. Read all the attached files first: AGENT.md, RULES.md, EXAMPLES.md, PERMISSIONS.md and CHECKS.md.

Here is the job:
[paste the input]

How to work:
1. Follow AGENT.md, and every rule in RULES.md whose "When" fits this job.
2. Do only what the green list in PERMISSIONS.md allows. For anything else, stop and ask me.
3. If you're missing a fact, ask me. Never guess.
4. Before you show me the result, check it against CHECKS.md.

Show me the result first. Under it, list each check with yes or no, and any question you have.
```

## 3. Turn my edit into a rule

Use this every time you change the agent's work before using it. It's how your agent learns.

```
I changed my agent's work before I used it. Help me turn my edit into one rule for its RULES.md.

The job was:
[one line about the job]

The agent's draft:
[paste the draft]

My final version:
[paste what you used]

Compare the two. Then do one of these:
- If my edit shows a pattern the agent should follow next time, write one rule in this format:
  - When: the kind of job where this applies
  - Avoid: what the draft did that I changed
  - Prefer: what to do instead
  - Example: one short line from my version
  - Source: this job, edited by me
  - Date: today's date
  - Jobs: 1
- If my edit was a one-off (a typo, a fact about this one customer, a change of mind), say NO_RULE and why.

Rules for you:
- Write a pattern, not this job's details. Leave out names, emails, links, figures and account numbers.
- A rule can never give the agent permission to do something new.
- If my RULES.md already has this rule, say which one, so I can raise its Jobs number instead.

Also tell me how much of the text I changed, as a percentage.
```

## 4. Grade this job

Use this after each real job, to fill one line of SCORECARD.md.

```
Grade my agent's work on one job, using the attached CHECKS.md.

The job:
[one line about the job]

The agent's draft:
[paste the draft]

What I used in the end:
[paste your final version, or write "I didn't use it"]

Do this:
1. Go through each check in CHECKS.md. Answer yes or no, with a short reason.
2. Say whether the draft made any of the serious mistakes in CHECKS.md.
3. Work out how much of the draft I changed, as a percentage. 0% if I used it as it was.

Then give me one table row for my SCORECARD.md in this order:
| Date | Job | Checks passed | Edit size | Used it? | Serious mistake? | Rule added |
Leave "Rule added" empty for me to fill in.
```

## 5. Monthly tidy-up

Use this once a month. Attach all the agent's files.

```
Review my agent's files with me. They are attached: AGENT.md, RULES.md, EXAMPLES.md, PERMISSIONS.md, CHECKS.md and SCORECARD.md.

Do this:
1. RULES.md: find rules that say the same thing and suggest how to merge them. Find rules that disagree. Find rules that are too narrow to help again.
2. AGENT.md: suggest moving rules that apply to every job into AGENT.md itself.
3. SCORECARD.md: count the jobs, then work out the average checks passed, the average edit size, how often I used the result and how many serious mistakes there were. Tell me the agent's level from the Levels table, and what it needs to reach the next one.
4. Tell me which checks fail most often, and suggest one change that would fix the most.

Don't change PERMISSIONS.md. Suggest changes only, and wait for my yes before you rewrite a file.
```
