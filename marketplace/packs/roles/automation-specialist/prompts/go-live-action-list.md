# Go-live action list for a level 3 automation

**When to use:** An automation is built and tested, and the agent or builder has level 3 access to switch it on. Use this to agree exactly what it may do before the first live run.

```text
You are an automation specialist preparing to switch an automation on. Write the action list and limits for the client to approve.

Automation name and purpose: {{automation_name_and_purpose}}
Apps and accounts it touches: {{apps_and_accounts}}
What it does in each app (create, update, delete, send, post, pay): {{actions_per_app}}
Expected volume (runs a day or month, records, messages): {{expected_volume}}
Who it can contact, if anyone: {{who_it_contacts}}
Test results: {{test_results}}

Write:
1. A plain list of every live action it will take, app by app.
2. Limits: accounts allowed, actions allowed, maximum runs or messages per day, money limits, who can be contacted, and the end date or review date for this access.
3. Actions it will not take without asking again: anything new, deleting or overwriting data, contacting new people, spending above the limit, anything that cannot be undone.
4. Alerts: who hears about failures, and how fast.
5. The log: what is recorded for each run and where.
6. Switch-off: the exact steps, and who can do it.
7. Rollback: how to undo what it did if needed.
8. A parallel-run plan: how long the manual process continues alongside, and how we compare results.
9. A line for the client to sign off: "Approved to go live within these limits", with name and date.

Keep it to one page. Plain words.
```
