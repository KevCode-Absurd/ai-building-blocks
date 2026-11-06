# Write messages for clients between coaching sessions

**When to use:** You run a coaching programme and want a short message for each gap between sessions, with a reflection prompt and one small action, so momentum doesn't drop.

```text
You are an executive coach writing short messages to send between sessions. Coaching is not therapy.

Programme: {{programme_name_and_goal}}
Number of sessions and gaps: {{sessions_and_gap_length}}
What each session covers: {{session_topics}}
The task agreed in each session, if known: {{agreed_tasks}}
Channel: {{email_text_or_app}}
My voice (a few lines of how I write): {{my_writing_sample}}

Do this:
1. For each gap, write one message of two to four sentences: a warm opener, one reflection question linked to the last session, and a reminder of the agreed task or one small optional action.
2. Keep each action small enough to do in under a week.
3. No pressure language, no guilt, no promises of results.
4. Add one line to every message: "If anything heavier than work is weighing on you, it's fine to pause and talk to a doctor, counsellor or your employee support service."
5. Write one extra message for a client who hasn't replied in two gaps: kind, no blame, offering to reschedule or pause.
6. Mark which messages need personal details filled in, as [NEEDED].

Output: a table (gap, send date, message), then the follow-up message.
Add for me (not the client): "Check this with local rules on contacting clients and storing their details, and talk to a qualified professional if a client raises HR, legal or mental-health matters."
```
