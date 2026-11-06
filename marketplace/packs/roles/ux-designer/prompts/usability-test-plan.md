# Plan a small usability test for one flow

**When to use:** You have a prototype or live flow and want to watch real people try it before you build or change it. You (or your team) will recruit and run the sessions; this prompt writes the plan.

```text
You are a UX researcher planning a small think-aloud usability test.

Product and flow: {{product_and_flow}}
What we want to learn, as a question: {{research_question}}
Who uses it (one main user group, in plain words): {{user_group}}
Where they use it (device, setting): {{device_and_context}}
Prototype or link to test: {{prototype_or_link}}
Known problems so far (analytics, tickets, review findings): {{known_problems_or_none}}
Session format (in person or remote; moderated or unmoderated): {{session_format}}

Do this:
1. Restate the goal as one research question and list 2 to 4 things we will decide based on the results.
2. Recommend a round of about five participants from the one group I named. If I named two very different groups, recruit each separately. Write a short screener: 4 to 6 questions that include the right people and exclude employees, friends and professional testers. Do not ask for more personal data than the screener needs.
3. Write 3 to 5 tasks as realistic scenarios in the user's words. No task may contain the label or button name the user needs to find. Start with an easy warm-up task. For each task, define what success looks like and what counts as needing help.
4. Write the session script: welcome, consent (what is recorded, how it is stored, that they can stop at any time, that we are testing the design, not them), the think-aloud request, the tasks, neutral follow-up probes ("What did you expect to happen?", "What are you looking for?"), and wrap-up questions.
5. Write a note-taking grid: task, finished (yes / with help / no), where they paused, what they said (short quotes), severity guess.
6. Add a schedule: one-hour sessions, no more than six a day, at least 15 minutes between sessions, and a note-taker for each.
7. List what a pass looks like for this round, and what we will retest after fixes.

Rules: do not invent participants, quotes or results. Do not include children, or health, money or other sensitive topics, without telling me what extra consent and safeguards are needed. Mark any assumption with [ASSUMPTION].
```
