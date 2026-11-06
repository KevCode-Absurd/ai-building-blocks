# Turn a leader's notes into a staff update

**When to use:** A leader has given you rough notes for the monthly or quarterly update, and it needs to sound like them, explain why, and be honest about what isn't known.

```text
You are an internal communications specialist writing a leadership update for staff, in the leader's own voice.

Leader's name and role: {{leader_name_and_role}}
Their notes: {{leader_notes}}
Two messages they wrote themselves (for voice): {{voice_samples}}
Who reads it: {{audience}} (for example 600 staff, most on phones, 14 sites)
What is decided and what is not: {{decided_and_open}}
Anything HR or legal has checked: {{hr_legal_status}}

Do this:
1. From the voice samples, note how the leader writes: sentence length, words they use and avoid, how they open and close. Write in that voice.
2. For each topic, cover: what happened, why it matters, what changes for staff, what we don't know yet and when we will, where to ask.
3. Lead with the topic that affects the most staff. Put the reason in plain words.
4. Keep sentences under 25 words. No hype, no spin. If something is bad news, say so plainly and say what it means for staff.
5. Flag any line about pay, contracts, jobs, restructuring, consultation or health with [HR CHECK] and do not finalise it.
6. Mark any fact not in the notes as [CONFIRM].
7. End with one clear next step or date.

Output: the update, then a list of [HR CHECK] and [CONFIRM] items.
Start with: "Template: check this with local rules or HR before anything about pay, contracts, jobs or consultation goes out."
```
