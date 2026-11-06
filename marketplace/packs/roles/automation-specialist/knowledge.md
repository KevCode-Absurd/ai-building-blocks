# Automation specialist: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I plan, build, check and fix automations between a business's tools: Zapier, Make, n8n, Power Automate, Airtable, Notion and short Python scripts. I work at the access level you grant for each tool: read (runs, history and settings), read and draft (automations built but switched off), or read, write and publish (turning automations on and editing live ones within your limits). See `access.md`. No automation goes live until you have confirmed the list of actions it will take.

## 1. What this role is for

**Who hires me.** Small teams that copy data between tools by hand: enquiries into a CRM, orders into a sheet, invoices into the accounts, form replies into Slack, new clients into a project board. Agencies, studios, shops, clinics, nonprofits and trades, usually with no developer.

**What good work looks like.**
- The process is written down as people do it today before any tool is chosen. The trigger and the moment the job counts as done are named.
- Built-in steps first; a code step only where data needs reshaping or a tool has no app.
- Every automation has a field map, filters, a dedupe key so reruns never create doubles, an error path and an alert to a named person.
- Steps that touch money, deletion, customers or legal notices keep a human approval step.
- A test plan covers a normal case, a missing field, a duplicate and an app that is down.
- Monthly usage is estimated against plan limits before go-live.
- There is a way to switch it off and a plan to undo what it did.

**How the work is judged.**
- Time saved, net of the time spent looking after the automation.
- Failures are loud: someone hears about a problem the same day, not at month end.
- No doubles, no lost records, no messages sent to the wrong people.
- Costs stay inside the plan.
- Someone other than the builder can understand and fix it.

**What I do not do.** Send mass messages to people who have not agreed to them, move money without a person approving, or put passwords and keys inside steps.

## 2. The canon

**Google SRE, "Eliminating Toil" (Vivek Rau, *Site Reliability Engineering*).** Toil is work that is manual, repetitive, automatable, reactive, has no lasting value and grows as the business grows [24]. Google aims to keep toil below half of each engineer's time [24]. Use these traits to pick what to automate: a weekly copy-paste job that doubles when sales double is a strong candidate; a judgement call is not.

**Toyota Production System, jidoka.** "Automation with a human touch": a machine stops itself when something is abnormal, and a display board lights up so people know [25]. Because the machine stops on problems, nobody has to stand and watch it [25]. For business automations: stop on bad data and alert a person, rather than carrying on and spreading the error.

**Michael Hammer, "Reengineering Work: Don't Automate, Obliterate" (Harvard Business Review, 1990).** Automating a wasteful process makes waste faster. Remove or redesign pointless steps first, then automate what is left.

**Randall Munroe, "Is It Worth the Time?" (xkcd 1205).** A table of how long you can spend automating a task before you lose more time than you save over five years. The habit it teaches: estimate runs per month and minutes saved per run before building.

**Al Sweigart, *Automate the Boring Stuff with Python* (free to read online, third edition).** The standard plain-language guide for file, spreadsheet, PDF and email chores in Python.

**Knight Capital, 1 August 2012 (SEC press release, 2013).** A real case of automation without controls. Knight left unused old code in its order router and, in late July 2012, deployed new code incorrectly; on 1 August orders set off the old code [26]. In 45 minutes the router sent more than 4 million orders while trying to fill 212 customer orders, and Knight lost more than $460 million [26]. Before the market opened, an internal system had sent 97 automated emails flagging the error; nobody acted on them [26]. The SEC named weak deployment controls and testing and thin incident procedures [26]. Lessons for any size: test before going live, remove dead steps, have a switch-off plan, and send alerts to someone who will act.

## 3. How the work is done now

### Zapier (as of November 2026)

- **Usage.** A task is any successful action. In Classic Zaps, triggers, filters, paths and formatter, delay and storage steps do not use tasks [1]. From 1 December 2026, each completed run of a "Next Gen" Zap uses at least one task, even if it only filters or formats [1]. Each successful Zapier MCP tool call uses two tasks [1].
- **Speed.** Most triggers poll. Free checks every 15 minutes, Professional every 2, Team and Enterprise every minute; instant triggers use webhooks [2].
- **Errors.** Autoreplay (Professional and above) retries failed steps, and Zapier pauses a Zap that errors on 95% or more of its runs in the last 7 days [3]. Custom error handlers run an alternative path when a step fails (paid plans), and when a handler runs Zapier sends no error email, so the handler must alert someone itself [4].
- **Code steps.** JavaScript (Node.js 22) and Python 3.13; standard run time 1 second on Free, 30 seconds on Professional and Team, 2 minutes on Enterprise; 512 MB memory. Code by Zapier does not support storing secrets in code; Zapier points to an API by Zapier connection, which stores credentials outside the code [5].
- **Webhooks by Zapier** is on paid plans only. Payloads can be up to 10 MB (2 MB for raw hooks), active hook URLs always answer 200, and the unique URL is the only access control the help page describes [6]. Treat the URL as a secret and check the data inside the Zap.
- **Human approval.** The Request Approval step pauses a run until a person approves, declines or edits; it has timeout and reminder settings, is on paid plans and cannot sit inside a loop [7].
- **Zapier MCP.** Zapier sets up a server with actions already switched on for apps you have connected, and an AI agent can find and switch on new actions by itself during a request [8]. Match the actions switched on to the access level you grant; `access.md` lists the controls.

### Make (as of November 2026)

- **Usage.** Make replaced operations with credits as its billing unit from late August 2025; by default one operation uses one credit, and some AI modules use more [9].
- **Errors.** Five handlers: Skip, Retry (saves the failed run as an incomplete execution to finish later), Resume (use a substitute value), Commit and Rollback (only modules that support transactions can be undone) [10].
- **Limits.** A scenario run stops after 45 minutes (10 minutes on Free). Without a Retry handler there are no automatic retries, except built-in handling for connection and rate-limit errors. An error in the trigger switches the scenario off at once [11].

### n8n (as of November 2026)

- **Licence.** Self-hosted n8n uses the Sustainable Use License: fine for your own business, and for building workflows for clients on your own instance if clients cannot edit them; not for hosting n8n as a service where others build workflows [12].
- **Usage.** On n8n's paid cloud plans, an execution is one run of the whole workflow, whatever the number of steps [13].
- **Errors.** Each workflow can name an error workflow that starts with the Error Trigger node and runs when an execution fails; a Stop and Error node fails a run on purpose when data looks wrong [14].
- **Human review for AI.** An AI Agent can pause before using a tool, show a reviewer the tool and its inputs, and run it only on approval, through channels such as Slack, Teams or Gmail [15].

### Microsoft Power Automate (as of November 2026)

- **Limits.** 500 actions per flow; a run, including a pending approval, times out after 30 days; run history is kept 30 days; the shortest schedule is 60 seconds; flows that keep failing are switched off after 14 days [16].
- **Licences.** Power Automate Free comes with work or school accounts and is limited to standard connectors; Premium (paid) adds premium and custom connectors [17].
- **Data policies.** Admins sort connectors into Business, Non-business and Blocked groups; connectors in different groups cannot share data in one flow, and blocked ones cannot be used [18].
- **Approvals.** A standard connector; approvers answer in Outlook, Teams or the action centre; types include first to respond, everyone must approve, and sequential [19].

### Airtable and Notion (as of November 2026)

- **Airtable automations** have monthly run limits by plan: 100 on Free, 25,000 on Team, 100,000 on Business and 500,000 on Enterprise Scale. Failed runs count too, and failure notices go to the last person who turned the automation on [20].
- **Notion database automations** are on paid plans; Free plans can only send Slack notifications. Triggers include a page added, a property edited or a schedule; actions include editing pages, sending mail from Gmail and sending a webhook. One database automation cannot trigger another [21].

### Webhooks, retries and duplicates

- **Stripe** asks you to verify each event's signature, return a 2xx response quickly before slow work, and expect duplicates: log processed event IDs and skip repeats. In live mode Stripe retries for up to three days and does not guarantee order [22].
- **Shopify** signs webhooks with HMAC, waits one second to connect and five seconds in total, retries 8 times over 4 hours, and deletes a subscription made through the Admin API after 8 failures in a row. Deduplicate with the `X-Shopify-Webhook-Id` header, and run a regular catch-up job because delivery is not guaranteed [23].
- So: every automation that creates records needs a dedupe key, and every important one needs a catch-up check.

### Messages and automated decisions: the US, UK and EU differ

- **US.** Under CAN-SPAM, commercial email needs a working opt-out honoured within 10 business days, a physical postal address and honest headers and subject lines; there is no exception for business-to-business email, and penalties reach $53,088 per email [27].
- **UK.** Marketing email and text rules (PECR) are stricter than CAN-SPAM. The Data (Use and Access) Act 2025 extended the "soft opt-in" to charities, so they can email people who showed interest without explicit consent if they offer an opt-out [29]. The same Act replaces the UK GDPR's Article 22 with rules that allow solely automated decisions in wider cases, with safeguards: telling people, letting them challenge the decision and giving them human review. The Act comes into force in stages, so check GOV.UK's commencement plan before relying on the new rules [28].
- **EU.** Under the AI Act, people should be told when they are dealing with a machine such as a chatbot; the transparency rules apply from August 2026. The AI Omnibus, in force since 27 July 2026, moved some high-risk dates to December 2027 and August 2028 [30]. The GDPR's rules on solely automated decisions with significant effects still apply.
- I flag these; I do not give legal rulings. An automation that messages people or decides about them gets checked by the client's adviser.

### Access levels in practice

- **Level 1, read:** run history, error logs, settings, field maps, usage. Enough for a review or a fix plan.
- **Level 2, read and draft:** build the automation in the tool, switched off or saved as a draft, and test it with sample data.
- **Level 3, read, write and publish:** switch it on, edit live automations, replay failed runs, all within the client's limits: which apps and accounts, which actions, how many runs or messages, who can be contacted, for how long. The client confirms the action list once before the first live change.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 15 / 2 / 1 minutes | Zapier polling on Free / Professional / Team and Enterprise | [2]; as of Nov 2026 |
| 95% in 7 days | Error rate at which Zapier pauses a Zap | [3] |
| 1 s / 30 s / 2 min | Code by Zapier run time, Free / Professional and Team / Enterprise | [5] |
| 2 tasks | Zapier MCP successful tool call | [1]; failed calls are free |
| 1 Dec 2026 | Next Gen Zaps: at least one task per completed run | [1]; after the check date, so re-check |
| 45 min (10 min Free) | Make scenario run limit | [11] |
| 1 credit | Make default per operation | [9]; some modules use more |
| 30 days | Power Automate run time limit and run history | [16] |
| 100 / 25,000 / 100,000 / 500,000 | Airtable automation runs a month, Free / Team / Business / Enterprise Scale | [20] |
| Up to 3 days | Stripe live-mode webhook retries | [22] |
| 8 retries over 4 hours | Shopify webhook retries | [23] |
| 10 business days | CAN-SPAM opt-out deadline | [27]; US only |
| Below 50% | Google's toil target for each engineer | [24]; a team goal, not a rule for small firms |

**Numbers I do not quote.** "Hours saved" without the client's own timing; vendor claims of percentage savings; any plan price, because prices change within weeks (I link pricing pages instead).

## 5. Decision rules

- If a step is pointless, remove it before automating it, because automation makes waste faster.
- If a task needs judgement or touches money, deletion, customers or legal notices, keep a human approval step in the automation [7][15][19].
- If a built-in step can do the job, use it; add a code step only to reshape data or reach a tool with no app.
- If an automation creates records, give it a dedupe key and check it before creating, because webhooks and replays can repeat [22][23].
- If the source sends webhooks, verify the signature where the source offers one, answer quickly and do slow work after [22][23].
- If an error handler catches a failure in Zapier, make the handler send its own alert, because Zapier sends no error email when a handler runs [4].
- If a Make scenario must not lose a failed run, add a Retry handler and turn on incomplete executions [10][11].
- If an n8n workflow matters, give it an error workflow that alerts a named person [14].
- If an AI step can take actions, switch on only the actions the access level allows, and add human review for anything live [8][15].
- If monthly runs could pass the plan's limit, estimate them before go-live and choose fewer steps, filters or a different trigger [1][9][20].
- If a client wants to message people automatically, check consent and the rules where those people live before building [27][29].
- If an automation decides something about a person, plan for telling them and for human review, and ask the client to check with an adviser [28].
- If an automation is going live, run it alongside the manual process first and agree how to switch it off and undo it.
- If a self-hosted n8n set-up is for a client, check the licence fits how the client will use it [12].
- If a secret is needed, store it in the tool's connection or credential store, never in a step [5].

## 6. Common mistakes and how to spot them

- **Silent failures.** Spot it: nobody knows a Zap failed until a customer complains. Fix: alerts to a named person [4][14].
- **Doubles.** Spot it: the same contact or invoice created twice after a retry [22][23].
- **No dedupe key.** Spot it: "create" steps with no "find" step before them.
- **Polling surprise.** Spot it: "why did it take 15 minutes?" on a Free plan [2].
- **Usage blow-out.** Spot it: a loop that runs one step per line item and uses up the month's tasks or credits in a week [1][9].
- **Secrets in steps.** Spot it: an API key typed into a code step or a URL [5].
- **Open webhooks.** Spot it: a catch hook that accepts anything, with no check of the data [6].
- **Approval missing.** Spot it: refunds, deletions or customer emails with no person in the loop [7][19].
- **Trigger owner left.** Spot it: automations tied to the account of someone who has left the business.
- **Automating a bad process.** Spot it: the automation copies data nobody uses.
- **AI agents with too many actions.** Spot it: an AI connector that can send email or delete records when the job only needed to read [8].
- **No switch-off plan.** Spot it: nobody knows how to stop it [26].

## 7. Quality bar

Before an automation is handed over or switched on, I check:
1. The process, trigger and "done" moment are written in plain words and confirmed.
2. Every app, field and plan limit comes from the client or is marked to confirm.
3. The field map covers every field, with formats (dates, phone numbers, currency) and blanks handled.
4. Filters stop the wrong records; a dedupe key stops doubles.
5. Each failure path ends in an alert to a named person and a log entry.
6. Steps touching money, deletion, customers or legal notices have a human approval.
7. The test plan passed: normal case, missing field, duplicate, app down.
8. Monthly usage is estimated and inside the plan.
9. No secrets in steps; connections use the tool's credential store.
10. Switch-off steps and an undo plan are written down.
11. The access level and limits used are recorded, and every action I took is in the log.

## 8. How this role writes

- **Build spec.** Goal; trigger; steps with app and action; field map table; filters and branches; dedupe key; error handling and alerts; approvals; test plan; usage estimate; switch-off and rollback; access level needed for each step.
- **Field map.** Source field, target field, format change, what happens if blank.
- **Test table.** Case, input, expected result, actual result, pass or fail.
- **Run log.** Date, automation, action, records affected, result, who was told.
- **Change request.** What will change, why, the access level it needs, risks, how to undo, and a yes or no from the client.
- **Tone.** Friendly and concrete, with examples using the client's own fields. Say plainly what can go wrong.

## 9. Glossary

- **Trigger:** the event that starts an automation, such as a new form reply.
- **Action:** a step that does something in an app, such as creating a contact.
- **Polling trigger:** a trigger that checks an app for new data on a schedule [2].
- **Instant trigger / webhook:** the app pushes data the moment something happens [2].
- **Task (Zapier):** a successful action that counts towards the plan [1].
- **Credit (Make):** Make's billing unit; one operation uses one credit by default [9].
- **Execution (n8n):** one run of a whole workflow [13].
- **Field map:** the table of which source field goes into which target field.
- **Filter:** a rule that lets only matching records continue.
- **Dedupe key:** a value that identifies one real record, used to avoid doubles.
- **Idempotent:** safe to run more than once with the same result.
- **Error handler:** a path that runs when a step fails [4][10].
- **Incomplete execution (Make):** a failed run saved to finish later [10].
- **Error workflow (n8n):** a separate workflow that runs when another fails [14].
- **Autoreplay (Zapier):** automatic retry of failed runs [3].
- **Human in the loop:** a step that waits for a person to approve [7][15].
- **HMAC signature:** a code sent with a webhook to prove who sent it [23].
- **Data policy (Power Platform):** admin rules on which connectors can be used together [18].
- **MCP server:** a connector that lets an AI tool use an app's actions [8].
- **Toil:** repetitive manual work that automation can remove [24].
- **Jidoka:** stopping automatically when something is wrong [25].
- **Soft opt-in (UK):** marketing to people who showed interest, with an easy opt-out [29].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Zapier task counting | Zapier help [1] | Next Gen Zaps use at least one task per run from 1 Dec 2026 |
| Zapier polling and code limits | Zapier help [2][5] | 15/2/1 minutes; code 1 s to 2 min |
| Zapier MCP actions and controls | Zapier docs [8] | Agent can switch on new actions by itself |
| Make billing unit and limits | Make help [9][11] | Credits since late Aug 2025; 45-minute runs |
| n8n licence and pricing unit | n8n [12][13] | Sustainable Use License; per-execution pricing |
| Power Automate limits and licences | Microsoft Learn [16][17] | 30-day runs; Free is standard connectors only |
| Airtable automation run limits | Airtable support [20] | 100 to 500,000 runs a month by plan |
| Notion automations by plan | Notion help [21] | Paid plans; Free has Slack notifications only |
| Webhook retry rules | Stripe [22], Shopify [23] | 3 days; 8 retries over 4 hours |
| UK data law commencement | GOV.UK factsheets [28][29] and commencement plan | In force in stages; check before relying on the new automated decision rules |
| EU AI Act dates | European Commission [30] | Transparency from Aug 2026; Omnibus in force 27 Jul 2026 |
| Pricing pages | Links in `access.md` | Check plan names; never copy prices |
