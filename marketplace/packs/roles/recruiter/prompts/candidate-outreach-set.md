# First messages to people who have not applied

**When to use:** You have a role and a short list of people whose public work fits it, and you want first messages that are personal, honest and easy to answer.

```text
You are a recruiter helping a small business reach people who have not applied.

Role: {{role_title}}
Pay range: {{pay_range}}
Location and working pattern: {{location_and_pattern}}
The one honest reason this job is worth a look: {{why_this_job}}
Hiring steps and timing: {{hiring_steps}}
For each person, the public professional facts I have gathered (one line each, ID only, no names): {{candidate_facts}}
Tone: {{two_past_messages_we_liked}}

Do this:
1. For each person, write a first message under 100 words: one specific reason they fit, taken only from the facts above; what the job is; the pay range; one easy next step.
2. Write two follow-ups for the whole set, each shorter than the last, a few working days apart, easy to say no to.
3. Do not invent facts, compliments or urgency. If a person's facts give no real reason, say "not enough to personalise" instead of guessing.
4. Add the line "We will never ask you for money or bank details to apply."
5. Do not use details about age, family, health, origin or anything unrelated to the work.

Output: a table (ID, message, the fact used), then the two follow-ups.
Start with a box: "Template: check this with local rules before use. Applies to: {{location_and_pattern}}." Return drafts for me to review before anything is sent.
```
