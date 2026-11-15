# Running a store for an agency client

A new client goes from signed deal to a running month: access at the lowest level each job needs, a scope and approval sheet both sides agreed, a monthly production plan the client approved, jobs open on the board, every creative and spend sign-off carrying the client's recorded yes, and a monthly client report read against real store orders and profit.

**Starts from:** A signed client handed over by new business, with the proposal, the free audit and the agreed scope. Each client has its own store folder, so its Org context, goals, limits and approvers stay apart from every other client.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Hand-over from new business | Clayton (clayton-new-business) | intake.md | intake-complete | no | read |
| 2 | Access and kickoff | Fiona (fiona-account-manager) | access-requests.md, kickoff.md | onboarding-review | no | draft |
| 3 | Scope and who approves what | Fiona (fiona-account-manager) | scope.md, approvals.md | scope-review, scope-readability | yes | draft |
| 4 | This month's production plan | Lerato (lerato-creative-producer) | month-plan.md, briefs.md | month-plan-review | yes | draft |
| 5 | Open the month's jobs | Margaret (margaret-job-orchestrator) | jobs.md | jobs-match-plan | no | draft |
| 6 | The client's month in numbers | Callum (callum-reporting) | month-numbers.md, month-numbers.json | month-numbers-check, numbers-review | no | read |
| 7 | Monthly client report | Fiona (fiona-account-manager) | client-report.md, account-health.md | report-readability, report-review, approvals-recorded | yes | draft |
| 8 | Send the report to the client | Fiona (fiona-account-manager) | send-record.md | none | yes, the plan | publish |

## Stage by stage

### 1. Hand-over from new business

Hands the signed client to the account team with everything learned while winning them: the proposal, the free audit and its three ranked fixes, the agreed scope, the decision makers and their roles, what the client said they care about in their own words, and any claim the client gave written permission to use. Reads the client's Org context if they have one, or marks it missing so setup builds it.

- **Needs:** context/org-context/ in the client's store folder (if it exists); the proposal and the free audit; the signed scope (signed by you and the client, outside the agents); notes from the sales calls
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, and the scope summary matches the signed scope)
- **Done when:** intake.md names the client, store, markets, decision makers, the goal in the client's words, the audit fixes, the scope summary and whether an Org context exists.

### 2. Access and kickoff

Writes the access request list at the lowest level each job needs, through each platform's own invite: a Shopify collaborator request, Meta Business partner access, a Google Ads manager link, and GA4 and Klaviyo user roles. Never passwords. The client accepts each invite themselves. Drafts the kickoff agenda and a 30-day plan. If the client has no Org context, it asks the orchestrator to open a store setup job in the client's folder.

- **Needs:** intake.md; the access guides for each platform
- **Makes:** access-requests.md, kickoff.md
- **Checks:** onboarding-review (every request asks for the lowest level the job needs through the platform's own invite, and no password or shared login appears anywhere)
- **Done when:** access-requests.md lists each tool with the level asked for, the invite type and its status, and kickoff.md has the agenda and the 30-day plan.

### 3. Scope and who approves what

Writes the scope and approval sheet: what the retainer covers each month, what it does not, and the rule that any new ask gets a change order draft before work starts. Then the approval matrix: who on the client side signs off creative, who approves spend and up to what amount, who approves sends, and how each yes reaches the gate. Either the client is a named approver on the approval page (hosted), or you relay the client's exact words and type the yes with the code yourself.

- **Needs:** intake.md; the signed scope; context/approvers.json (owner-held, if hosted)
- **Makes:** scope.md, approvals.md
- **Checks:** scope-review (the scope matches what was sold in the proposal, the change order rule is clear, and every approver has a ceiling and a way their yes is recorded); scope-readability (the readability checker exits 0)
- **Done when:** scope.md lists what is in and out of scope and the change order rule, and approvals.md names each approver, what they may approve, the money ceiling and how their yes is recorded.
- **You sign off:** You read the scope and the approval matrix and check they match what the client signed. Reply yes with the code. If the client becomes a named approver, adding them to context/approvers.json is a separate file plan with its own code.

### 4. This month's production plan

Turns the creative strategy and the client's budget into the month's batch: one brief per ad (buyer, angle, hook, proof, format, sizes, owner and due date) and a dated calendar from brief to launch, sized to the team's real hours. Two feedback rounds by default, with all notes in one place and one person deciding. States the month's spend ceiling for launches, inside the client's limits.

- **Needs:** scope.md and approvals.md (signed off); context/org-context/ for the client; context/learnings.md and warehouse view creative_performance; the client's context/limits.json
- **Makes:** month-plan.md, briefs.md
- **Checks:** month-plan-review (the briefs come from the creative strategy, each has proof from the client's Org context, and the batch fits the team's hours and the spend ceiling)
- **Done when:** month-plan.md has every ad on a dated row with its owner and approver, briefs.md has one complete brief per ad, and the spend ceiling sits inside the client's limits.
- **You sign off:** The client approves the batch, the calendar and the spend ceiling, and you relay their exact words, or they approve on the approval page. Reply yes with the code. This approves the plan only: each ad's creative and each launch still need the client's yes at their own stage. If the ceiling differs from the client's limits.json, a file plan to change it follows with its own code.

### 5. Open the month's jobs

Opens one job on the client's board for each brief (image-ad, video-ad or another process), with a spec sheet and acceptance tests, and marks on each job who approves its sign-off stages from approvals.md. Each creative job then runs its own process and hands to the Meta launch, where the ad pack is the pack the client approves.

- **Needs:** month-plan.md and briefs.md (signed off); approvals.md
- **Makes:** jobs.md
- **Checks:** jobs-match-plan (every brief has exactly one job, and each job names the approver from approvals.md)
- **Done when:** jobs.md lists one job per brief with its id, process, owner agent, approver and due date, and none is missing.

### 6. The client's month in numbers

At the month's end, reads the client's warehouse: sales, orders, MER, new against returning revenue, contribution margin by channel, and each launched creative with its scale, hold or cut call from the results loop. Revenue and orders come from the client's shop, never from ad platforms. Uses the same metric definitions for every client.

- **Needs:** warehouse views daily_blended, shop_orders_daily and creative_performance (client's folder); results files of this month's jobs; metric-definitions.md
- **Makes:** month-numbers.md, month-numbers.json
- **Checks:** month-numbers-check (every rate and total recomputes from its inputs); numbers-review (revenue and orders come from the client's shop, margins use the client's own costs, and each creative call matches its readout)
- **Done when:** month-numbers.md gives each number with its dates and source, and each creative with its call and deciding number.

### 7. Monthly client report

Writes the client report in plain words: what happened, why, what we did and what is next, read against store orders and gross profit. Adds wins and misses, next month's plan, any scope changes with their change orders, and what the agency needs from the client. Also scores the client on results, reply speed, approvals and contact changes, and drafts a save plan if they look at risk; that score stays inside the agency.

- **Needs:** month-numbers.md; month-plan.md and jobs.md; the scope and change request log
- **Makes:** client-report.md, account-health.md
- **Checks:** report-readability (the readability checker exits 0); report-review (the report reads results against store orders and profit, says plainly what missed, and asks the client for only what is needed); approvals-recorded (every sign-off and spend plan in this month's jobs records the approver's words, who said them and when, and matches approvals.md)
- **Done when:** client-report.md fits two pages, every number matches month-numbers.md, and account-health.md has the client's score and any save plan.
- **You sign off:** You read the report before the client does. Reply yes with the code to approve it for sending. account-health.md is for you only and is never sent.

### 8. Send the report to the client

Shows you a plan with one step: save the signed-off report as an email draft to the named client contacts in your mailbox, with the report as a shared link. You press send yourself. With a connector that has a send tool, the plan can instead hold one send step for that exact draft, and the connector asks you again before it sends.

- **Needs:** client-report.md (signed off); your email connector (see its access guide); approvals.md (client contacts)
- **Makes:** send-record.md
- **Goes live:** Through your email connector: one create-draft step addressed only to the client contacts in approvals.md (Google's Gmail server has no send tool, so you send). Where the connector can send, one send step for that draft, which Claude's connector confirms before sending. Sent email cannot be recalled.
- **Done when:** send-record.md records the plan code, the draft or message id read back, the recipients and the time it was sent.

## Where you step in

- **Scope and who approves what:** You read the scope and the approval matrix and check they match what the client signed. Reply yes with the code. If the client becomes a named approver, adding them to context/approvers.json is a separate file plan with its own code.
- **This month's production plan:** The client approves the batch, the calendar and the spend ceiling, and you relay their exact words, or they approve on the approval page. Reply yes with the code. This approves the plan only: each ad's creative and each launch still need the client's yes at their own stage. If the ceiling differs from the client's limits.json, a file plan to change it follows with its own code.
- **Monthly client report:** You read the report before the client does. Reply yes with the code to approve it for sending. account-health.md is for you only and is never sent.
- **Send the report to the client:** approve the exact plan of live changes

## How we judge it

- The client's main number from their context/goals.json, read against their store orders and gross profit, never platform numbers alone.
- Approvals: every creative sign-off and every spend plan this month has the client's recorded yes, with who said it and when.
- Delivery: the share of planned ads launched by their planned date, and change requests logged before work started.
