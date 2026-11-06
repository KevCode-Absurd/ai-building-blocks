---
name: service-levels-and-staffing
description: Sets response and resolution targets by channel and priority from the team's own volume, works out staff needed by hour, builds a weekly rota with breaks, cover and handovers, and writes the client-facing service level schedule (priorities with real examples, hours of cover, in and out of scope, what happens on a miss) plus a monthly service report. Use it when targets are missed, when a rota leaves the busy hours short, when chat opening hours change, or when a business must promise response times to its own clients. Never sets a target the staffing cannot meet; service credits and binding promises go to the client and their lawyer.
---

# Service levels and staffing

## When to use

- The team misses its reply targets at the same hours every week.
- The owner wants a faster target ("reply within an hour") and needs to know what it costs.
- Live chat or phone hours are changing.
- A B2B business (IT support, agency, facilities, software) needs a service level schedule for its clients.
- A launch, sale or seasonal peak is coming.

## Access needed

- **Level 1 (read):** volume by hour, handling time, SLA reports and current schedules.
- **Level 2 (read and draft):** draft SLA policies in the help desk switched off; build the forecast and rota in a copy or draft schedule.
- **Level 3 (read, write and publish):** switch on the agreed SLA policies and publish the agreed rota within the client's rules (who may be moved, minimum cover, notice). Client-facing promises and service credits sent as binding need a fresh yes. Rota choices that touch contracts, pay or working-time law stay with the client: check this with local rules.

## What you need

1. Contacts by hour and day, by channel, for at least four weeks; a full year if there is a seasonal peak.
2. Average handling time by channel, including wrap-up.
3. Opening hours by channel and current targets, if any.
4. Team: headcount, contracted hours, part-timers, skills, planned leave.
5. The client's own shrinkage figures (breaks, training, meetings, leave, sickness). If they have none, ask for an estimate and mark it as theirs.
6. For a client-facing schedule: what the business does, current promises, past disputes, and the most common requests.

## Steps

### 1. Clean the volume data

Remove outliers (an outage, a one-off email blast) and note them. Zendesk's forecasting guidance does the same and adds a manual adjustment for known events [see `knowledge.md`, section 3]. Show average and busiest week by hour.

### 2. Define priorities with examples

Four levels by customer impact: urgent (safety, money, cannot use the service at all), high (major part broken, no workaround), normal (problem with a workaround), low (question or request). Give two real examples from the tickets under each, so nobody argues about what "urgent" means.

### 3. Draft targets by channel and priority

For each: first reply, update interval for open issues, and resolution or workaround. Start from what the team achieves now at its median, then improve one step. Say for each target whether it runs in business or calendar hours and what counts as a reply (a public reply, not an internal note).

### 4. Work out staff needed by hour

- **Live channels (phone, chat):** use an Erlang C calculator per hour with contacts per hour, handling time, the target share and the maximum wait. Zendesk's own example of 30 calls an hour at 300 seconds needed six agents; treat the formula as a guide, since it ignores breaks and shifts.
- **Email and messaging that can wait:** workload hours = tickets × handling time. Spread the day's workload so the queue clears within the target.
- **Add shrinkage** using the client's own figure to turn "agents on the queue" into "agents scheduled".
- Show the maths under the table so the client can check it.

### 5. Test the target against the staffing

If the target needs more people than the rota has at that hour, say so and give two honest options: change the target for that hour, or move people (stagger lunches, shift a start time). Never write down a target the team will miss in week one.

### 6. Build the rota

Shifts that cover the hours by need, breaks staggered away from peaks, a handover note at each change (open urgent tickets, anything promised, system issues), cover for planned leave, and a named lead per shift. Mark launch days and Monday mornings.

### 7. Write the SLA policies

Translate the target table into help desk policies: most restrictive first, priority always set by triage. Build at level 2; switch on at level 3 after the client agrees.

### 8. Write the client-facing schedule (B2B)

- Priority table with examples, targets and hours of cover.
- In scope and out of scope, plus how extra work is asked for and charged.
- What happens on a miss: who is told, how it is put right, and any service credit the client already offers. Never invent a credit or penalty.
- A line saying it is not a legal contract on its own; legal points are marked for the client's lawyer.

### 9. Set up the monthly report

Each target, the result, a status and a short note on misses and fixes. Define each measure in one line, including which date it is filtered on.

### 10. Research (both modes)

With web search connected, check the help desk's current SLA and WFM features before relying on them. Without it, ask for screenshots of the SLA settings and plan page.

## Checks

- Every target comes from the client's data, not an industry figure.
- Every target is checked against staffing by hour; gaps are shown with options.
- Business or calendar hours stated for every target.
- Internal notes do not count as replies.
- The rota covers peaks, staggers breaks and has a handover at each change.
- No service credit or penalty appears that the client did not supply.
- Nothing rules on employment law; the rota notes "check this with local rules".

## Output format

1. Summary in five lines.
2. Volume by hour heat table (average and busiest week).
3. Priority definitions with two examples each.
4. Target table: channel × priority, with hours and how measured.
5. Staff needed by hour, with the maths.
6. Rota with breaks, cover and handovers.
7. SLA policy drafts.
8. Client-facing schedule (if asked).
9. Monthly report template.
10. Gaps and decisions for the client.

## Example of good output (short)

*Made-up business for illustration: Ashdown IT, a seven-person IT support firm with 40 small business clients.*

> **Priority 1, urgent:** a client cannot work at all. Examples: "nobody in the office can log in", "the shared drive is down".
> First response 30 minutes, updates every hour, workaround target 4 hours, during cover hours 8am to 6pm weekdays.
>
> **Staffing check, Monday 9 to 10am:** 6 tickets on average (busiest week 9), 20 minutes handling each. Workload: 2.0 hours on average, 3.0 hours in the busiest week. Three people on, after the team's own 25% shrinkage figure, gives 3 × 0.75 = 2.25 hours of queue time. Gap: in busy weeks a P1 waits behind 0.75 hours of work, so the 30-minute target fails. Options: start one engineer at 8am (adds 0.75 hours), or set the Monday 9 to 10am P1 target at 1 hour. I'd move the start time.
>
> **On a miss:** the account manager calls the client the same day. No service credit is listed, because Ashdown's contracts do not include one; ask your lawyer before adding any.
