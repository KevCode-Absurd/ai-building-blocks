---
name: ai-task-map-and-pilot
description: Maps a team's real tasks by role, scores each for AI fit, time at stake, risk if AI gets it wrong and data sensitivity, picks the two or three best candidates with the right type of tool and a human check, then writes a time-boxed pilot plan with before measures, targets and a go, change or stop rule agreed in advance. Also reviews a finished pilot against those rules with the sums shown. Use it when a team asks "where should we start with AI?", has bought licences nobody uses, or has run a trial and needs a decision.
---

# AI task map and pilot

## When to use

- A team of 3 to 100 people wants to know where AI could help and where it should not be used.
- Licences were bought (Copilot, ChatGPT Business, Claude Team, Gemini) and usage is low or patchy.
- A trial has run and the owner needs a clear decision, not opinions.

Not for building AI features into a product, buying tools for the client, or any use where AI would decide about people, money or health without a person approving it.

## What you need

1. **Roles and headcount**, and three to five tasks each role does every week, with rough hours per week. Times come from the client or are labelled "estimate".
2. **Tools in use today**, including any AI tools staff already use (approved or not) and the plans they are on.
3. **Data the tasks touch:** public, internal, confidential (client or commercial), personal or sensitive (health, children, finances).
4. **Rules from outside:** client contracts, funders, regulators, professional bodies, the countries the team works in.
5. **What matters quietly in each task:** judgement, care, relationships, accuracy, tone. Ask: "What would go wrong if this were done fast but carelessly?"
6. **Access I have:** the level the client grants in each tool (1 read, 2 read and draft, 3 read, write and publish). This skill needs level 1 only: reading task lists, exports and admin usage reports. Until the client answers, work at level 1.

## Steps

1. **List the tasks by role.** One row per task: role, task, how often, hours per week, tools used, output (email, report, record, decision), who sees the output.
2. **Score each task on four things,** low, medium or high, with a one-line reason:
   - **AI fit:** repetitive, text-heavy, with a clear right answer or a draft that a person can quickly check. Tasks that need fresh facts, judgement about people, or physical work score low.
   - **Time at stake:** hours per week across the team.
   - **Risk if AI gets it wrong:** who is hurt and how badly. Anything that reaches clients, moves money, changes records or decides about a person is high.
   - **Data sensitivity:** the highest data class the task touches.
3. **Pick two or three candidates.** High fit and meaningful time, with low or medium risk. Leave high-risk tasks out of the first pilot, even if they are tempting. If a candidate would decide about people (hiring, staff assessment, credit, access to services), stop and send it for legal advice first.
4. **Match each candidate to a type of tool, not a brand first:** chat assistant inside the office suite, meeting transcription, writing help, document Q&A over company files, an automation tool with an AI step. Then name the tools the client already has that do it, and check the plan: business plans with admin controls for anything confidential or personal; personal accounts only for public data.
5. **Name the human check for each candidate:** who checks, what they look at, and what makes them reject the output.
6. **Write the data red lines** for the pilot: what never goes in (for example client names on a personal account, health details, passwords and keys).
7. **Design the pilot.**
   - **Tasks and people:** which tasks, which people, for how long (two to four weeks is typical for small teams).
   - **Before measure:** time the task on real work for a week before AI, or use existing records. Do not rely on people's guesses: self-reported time saved can point the wrong way.
   - **Quality measure:** error rate, rework, a reviewer's score against a short checklist, or complaints.
   - **Split the results** by experience where possible, because gains often differ between new and experienced staff.
   - **Target and rule:** "Go if median time falls and errors do not rise; change if time falls but errors rise; stop if neither." Agree the thresholds with the owner before starting, and write them down.
   - **Owner and decision date.**
8. **Plan support:** a short briefing, the prompts for each task (with an example and a check), and who staff ask when unsure.
9. **Review the pilot when it ends.** Show the before and after numbers, the sums, the errors caught by the human checks and what staff said. Apply the agreed rule. Recommend go, change (one change, then rerun) or stop. Never widen the rollout after a missed target.
10. **Act only at the right level.** Level 1: deliver the map, plan and review. Level 2: set up the pilot workspace as a draft: a shared prompt library page that is not yet shared, a project or custom assistant that is not yet published, a measurement sheet. Level 3: after the client confirms the action list and limits (which workspace, which users, which settings, until when), share the workspace with the pilot group and turn on the agreed features. Log each action. Ask again before adding users, connecting new data sources or changing data-retention settings.

## Checks

- Every time and volume comes from the client or is labelled "estimate".
- Every candidate has a named human check and a data red line.
- No pilot task decides about people, money or health without a person approving it.
- Tool data terms are dated and linked to the vendor's own page, or marked "check with vendor".
- The go, change or stop rule was agreed before the pilot started.
- The review shows the sums, not only percentages.
- No promises of time saved in any document.

## Output format

1. Task map table: role, task, hours per week (source), AI fit, time at stake, risk, data class, tool type, human check.
2. Top candidates with reasons, and tasks deliberately left out with reasons.
3. Pilot plan: tasks, people, dates, measures, target, rule, owner, support.
4. Data red lines for the pilot.
5. Pilot review (when run): results table, sums, errors caught, decision.
6. Open questions for IT, legal or the vendor.
7. Action log (if any level 2 or 3 work).

## Example of good output (short)

*Brightwater Lettings is a made-up letting agency used only to show the format: 12 staff, Microsoft 365 with Copilot Chat. Access I have: level 1 (task list and usage report export).*

| Task | Role | Hrs/wk (source) | Fit | Risk | Data | Tool type | Human check |
|---|---|---|---|---|---|---|---|
| Draft replies to routine tenant repair emails | Property manager | 6 (client) | High | Medium | Personal | Copilot Chat with the email open | Manager reads and edits before sending |
| Summarise viewing feedback for landlords | Negotiator | 3 (estimate) | High | Low | Internal | Chat assistant | Negotiator checks against notes |
| Decide which tenant applications to accept | Lettings lead | 4 (client) | Low | High | Personal, financial | Not in pilot | Stays a human decision; legal advice needed before any AI use |

**Pilot rule (agreed with the owner):** go if the median time per repair reply falls and the reviewer's error count does not rise over three weeks; change if time falls but errors rise; stop if time does not fall.
