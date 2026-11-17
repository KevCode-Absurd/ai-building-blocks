# Build your store's agent team

Unzip this build folder. To install the framework into a new client folder without API calls, run `node files/agent/bootstrap.mjs install --to ../my-store-agents --client my-store`. Then open the installed folder in your coding assistant and say: **"Build my store's agent team from SETUP.md."** The installer copies the framework and process files; it does not connect accounts, download all specialist packs or start a hosted service. It keeps enforcement hooks inactive until setup is checked. The source bundle contains this file, the kit in `files/`, the processes in `processes/` and the access guides in `access/`. Complete the remaining steps in the installed `SETUP.md`.

## For you, the owner (read this part)

**What you get.** A team of specialist agents that hand work to each other the way a good human team does. One agent gathers the facts, another writes the script, another makes the storyboard, another edits, a reviewer checks, the launch agent puts it live, and the results agent reads the numbers and writes down what was learned so the next brief is better. You see where every job stands and what is waiting for you.

**Where you step in.** You sign off creative at the stages that matter (script, storyboard, final cut). You approve every action that spends, sends or publishes, by typing `yes` and a six-character code that belongs to that exact list of actions. A plain "yes", "go ahead" or a thumbs-up changes nothing. If anything in the list changes after you saw it, the code stops working.

**Three ways to run it.** Start with the first. Move up when you want to.

| Way | What it is | Good for |
|---|---|---|
| 1. In your AI session | Use a specialist pack in your AI host. A coding host can use the installed local framework; file execution, tools and persistence depend on that host. The supplied hook adapter is for Claude Code only. | A first workflow or one-person store |
| 2. On a schedule | Use a scheduler supported and tested in your chosen host, with durable storage and read/draft access. Verify whether it runs while your computer is off and how it is billed. No scheduler is installed by this kit. | Repeated reports and drafts |
| 3. Shared team service | Deploy a separately implemented authenticated runtime with a durable queue, isolated client storage, provider adapters and verified connector access. This kit supplies workflow contracts and local code, not that finished service. | Teams and agencies after integration tests |

**What never happens without you.** Spending, sending, publishing, changing budgets above your step limit, changing your money limits or goals, deleting anything, payments, deposits, contracts, purchase orders and billing. Scheduled runs only read and draft.

**What you need.** A Claude plan with Claude Code, and admin access to your store, ad accounts and email tool. Setup time depends on how many tools you connect; most of it is you signing in while Claude checks each step.

**To stop everything,** type `pause all agent work`. Every agent write stops at once (reading still works) until you type `resume agent work`. Ads that are already live keep running until you pause them, so the agent will offer a pause plan or you can pause them in Ads Manager.

**What has been tested so far.** The approval gate, the job board and the spend limits have automated tests, and the gate was tried live in Claude Code: a write was blocked before the yes, ran once after it, and a retry was blocked. Not tested yet: a full job with real agents, the Meta data sync against a real account, the warehouse views in DuckDB, and the hosted way (way 3). Claude will tell you when a step is one of these, and test it with you first.

---

## For Claude: how to build this

### 0. How to work with the owner

- Read `files/PRODUCTION-PRINCIPLES.md` and `files/AUTOMATION-PRINCIPLES.md` before designing the workflow. Copy them into the store folder and reference them from the persistent agent instructions you create. Define the outcome, accountable owner, source scope and acceptance checks; test functional, operational and business outcomes separately. Preserve valid existing authorization and avoid repeating answered intake questions.
- Go one step at a time. Before each step, say in one or two plain sentences what you are about to do and why. After it, show the result.
- The owner signs in to every tool themselves. Never ask for a password, key or token in chat. When a step needs a token, the owner pastes it into the host's secret store or a local `.env` file you create for them, and you never print it.
- Write at a grade 8 reading level. No jargon without a one-line explanation.
- Build only what the owner chooses. Every agent and process below is optional except the foundation.
- When the owner's screen does not match a step (menus change), ask what they see and work it out together. Never guess a menu path, a scope or a tool name: look in your own tool list or the official docs.
- Test every part before you call it done. If something fails, say so plainly with the output.

### 1. Reuse known context, then ask for missing inputs

Read the existing org context, task brief and valid prior authorization first. Do not ask again for information already supplied. Bundle only material missing inputs from this list; continue independent draft work while waiting:

1. Store name and website. Do you already have an Org context folder (from the AI Blocks Org context builder)?
2. What do you sell, to whom, in which countries and currency?
3. Which jobs do you want the team to do first? Offer the processes in step 7 as a short menu.
4. Your main number for judging results (for example return on ad spend over 7 days, or profit per order), any second numbers you care about (for example video hook rate), and the guardrails (for example cost per purchase must stay under a set amount).
5. Money limits: the most new ad spend a day, the biggest budget change allowed in one step, based on the account economics, a monthly cap, and the generation budget per creative job you are happy with.
6. Which way to run (1, 2 or 3). Recommend 1, then 2 once it works.
7. Do you work alone, with a team, or for clients?
8. Where should notices go: only in Claude, or also a Slack channel or email?

### 2. Make the store folder

Create a private folder (and, for ways 2 and 3, a private GitHub repository the owner owns) laid out like this:

```
store-agents/
  CLAUDE.md                  how this store's team works (short; points to the files below)
  context/
    org-context/             Org context: customers, voice, design, claims, do's and don'ts
    goals.json               the owner's numbers (owner-held)
    limits.json              money limits (owner-held)
    learnings.md             dated lessons from results; every intake reads it
    experiments.md           tests, each with its decision rule written before launch
  agent/                     the gate and board kit (owner-held code), tools.json
  agents/<agent-id>/         each agent's pack (knowledge, skills, workflows, access notes)
  .claude/agents/            one Claude Code subagent file per agent, plus reviewers
  .claude/settings.json      the hooks that enforce the gate (owner-held)
  processes/                 the processes this store runs, as JSON, plus a readable page each
  board/                     job cards: where every job stands
  creatives/<job-id>/        every file a creative job makes, in order
  jobs/<job-id>/             folders for other jobs
  warehouse/                 the data pipeline, the views and the daily data files
  reports/                   daily and weekly reports, and dashboard.html
  agent-state/               plans, approvals, run records, schedule (written by the kit)
```

Add a `.gitignore` with `.env`, `warehouse/store.duckdb` and `node_modules/`.

### 3. Install the kit and test it

If the bootstrap installer was used, run `node agent/bootstrap.mjs doctor` to verify installed file hashes; inspect every reported change. Otherwise copy `files/` using Appendix A, holding `.claude/settings.json` until step 9. A local file check does not verify connectors or hosted tenancy. Then run `node --test agent/kit.test.mjs agent/gate.test.mjs agent/trace.test.mjs warehouse/warehouse.test.mjs`. All tests must pass before you go on. Show the owner the one-line result.

What the kit does, in plain words:

- `guard.mjs` decides, for every tool call, whether it may run: reads always may; a write only when it is the next step of a plan the owner approved, with exactly the input approved, once, inside the owner's limits.
- `actions.mjs` turns a draft plan into a dry run with a code, records results, and keeps the schedule.
- `board.mjs` is the job board: stages, checks, sign-offs and hand-offs.
- `spend.mjs` tracks generation spend against the estimate the owner signed off.
- `process.mjs` checks process files and renders them as pages.
- `hooks.mjs` connects all of this to Claude Code, so the rules are enforced in code, not just written down.
- `trace.mjs` writes one line to `agent-state/trace.jsonl` for every stage, check, sign-off, change request, plan, approval, tool call, read back and stop, in order. `trace-checks.mjs` checks a trace against the rules (only approved writes, no retries, read back before saying done), and `transitions.mjs` makes the failure table the monthly review starts from.

### 4. Org context

Read `files/BRAND-CONTEXT-CONTRACT.md` and `files/MEMORY-ARCHITECTURE.md`. Reuse one canonical brand brain with task-specific slices: guide/design, voice, customer evidence, approved copy/claims, product/media rights, offers/policies and metric definitions. Use the existing org-context ledger for facts and corrections; keep episodes and working state separate. Compile scoped evidence packets for multi-source tasks; source matches do not certify an answer.

If the owner has an Org context folder, copy it into `context/org-context/`. If not, build it now with the AI Blocks Org context builder skill (https://useaiblocks.com/skills/website-brand-brain-builder) from the website, reviews and any brand guide the owner has, and show the owner the summary page to correct. Every intake stage reads this folder. Nothing goes out that contradicts it.

### 5. Goals and limits

Write `context/goals.json` and `context/limits.json` from the owner's answers, show both on screen in plain words, and get the owner to confirm. These two files become owner-held in step 9: after that, a change is proposed with `node agent/actions.mjs propose-file` and needs the owner's `yes <code>`.

`goals.json` holds the main number, second numbers, guardrails, the minimum spend and days before judging, and how sure a result must be before scaling. `limits.json` holds the ad accounts, currency, most new spend a day, biggest step rise, monthly cap, generation budget per job, AI disclosure choice and end date.

### 6. Agents

For each agent the owner's chosen processes use:

1. Download the agent's pack from its page on https://agents.useaiblocks.com and unzip it into `agents/<agent-id>/`. If a pack is not there yet, write the agent's file from its stages in the processes and say so to the owner.
2. Write `.claude/agents/<agent-id>.md` with: a description saying which process stages it does; a `tools:` line listing only the tools that agent needs (a scriptwriter never gets the Meta connector; a launch agent never gets email); a pinned model identifier actually supported by the selected host (choose from observed capabilities and measured quality, cost and latency; do not invent version names); and a body that points to its pack, `context/org-context/`, `context/learnings.md` and its stages in `processes/`.
3. Reviewers are separate subagents with read-only tools, so the maker never marks its own work.

Use the exact tool names from your own tool list when you fill in `tools:` lines. If a connector is not connected yet, leave a note and come back after step 8.

### 7. Processes

Copy the JSON files for the owner's chosen processes from this build folder's `processes/` into the store's `processes/`, run `node agent/process.mjs check --partial processes/*.json` (a hand-off to a process the owner did not choose is listed as a note and skipped), then render each one to a page with `node agent/process.mjs render processes/<id>.json > processes/<id>.md`. Walk the owner through one page so they see where they step in.

Each process has stages; each stage names the agent, what it needs, what it makes, the checks, whether the owner signs off, and when it counts as done. A process can hand its folder to the next process (`then`): for example the video ad process hands to Meta launch, which hands to the results loop.

The processes in this build folder are listed in **Appendix B**, with the agents each one uses.

### 8. Connect the tools

For each tool the chosen processes need, open its access guide in this build folder's `access/` (listed in **Appendix C**) and do it with the owner, step by step: the official connector first, the token steps only if a pipeline or hosted agent needs them, then the safety switches on the platform's side, then the read-only check. Write what was connected, at which level, into `context/access.md`. Until a tool is connected, its stages produce files and click-by-click steps for the owner instead.

In Claude's connector settings, set every write tool to **Needs approval** and every delete tool to **Blocked**. This is a second lock; the gate in step 9 is the first.

### 9. Turn on the gate

1. Write `agent/tools.json` from `files/agent/tools.meta.json` and the other connectors' tools: every connector tool the team may read, every write it may plan (with `budget_fields` and `account_field` where a tool sets a budget or names an account), the tools it may never use, `volatile_fields` (fields the connector fills in per call), image and video generation tools marked `"budgeted": true`, and any standing rules (for example: post reports to the owner's own Slack channel, matched by channel id). Every connector tool not in this file is blocked. Show it to the owner in plain words.
2. Copy `files/.claude/settings.json` to `.claude/settings.json`. From this moment the hooks run.
3. Prove it to the owner with a harmless test: draft a one-step plan (for example renaming a paused test campaign, or a file plan that changes nothing important), show the dry run, try to run it before the yes (it must be blocked), let the owner type `yes <code>`, run it, check it, then show `node agent/actions.mjs status`.

### 10. Data pipeline and warehouse

The agents read numbers from the warehouse, not from the platforms every time. That is cheaper, the same every day, and keeps history.

- **Meta:** `warehouse/meta-sync.mjs` pulls ad-level daily numbers for the last 7 days (Meta's numbers keep moving for a few days) with a read-only token. Follow the Meta access guide, Way 2, steps 1 to 5. Set `META_READ_TOKEN` and `META_API_VERSION` (the newest version in Meta's Marketing API changelog) in a local `.env` file or the host's secret store, run `node warehouse/meta-sync.mjs --check`, then a first pull with `--days 90`.
- **Shop:** write `warehouse/shop-sync.mjs` with the owner's shop platform (orders, revenue, refunds, new customers by day) using a read-only token from the shop's access guide, in the same file format (`warehouse/data/shop_orders_daily/<date>.jsonl`). Test it against the shop's own report for one day.
- **Creative register:** `warehouse/register.mjs` reads every creative job's `tags.json`, so results join back to the script, angle and design. Every ad name ends with its job tag, for example `[job-0007]`.
- **Views:** `warehouse/views.sql` gives `ads_daily`, `shop_orders_daily`, `creative_performance` and `daily_blended`. On a computer, use DuckDB (one file, no server). Hosted, load the same files into Postgres tables with the same names.
- **Many sources?** If the owner wants Google, TikTok, email and analytics in one place, offer a managed pipeline tool such as Airbyte (it has Facebook Marketing and Shopify sources) writing into Postgres, instead of writing more sync scripts.

Check the warehouse: yesterday's spend in `ads_daily` matches Ads Manager, and yesterday's orders match the shop.

### 11. Schedules (way 2)

Only if recurring work was requested, inspect the selected host's current scheduler and capabilities, then configure supported tasks with only the connectors each needs. Do not assume a particular slash command, cloud runtime or subscription entitlement. Candidate recurring jobs:

| Task | When | What it does |
|---|---|---|
| Morning run | daily, 7:00 in the owner's time zone | sync the warehouse, rebuild the register, run due board stages and readouts, write `reports/<date>.md` and `reports/dashboard.html`, list what is waiting for the owner |
| Weekly review | Mondays | the results loop's lessons, the growth plan's weekly check, creative refresh briefs |
| Monthly numbers | first working day | the monthly numbers process |

When the selected host actually runs the supplied gate, set `AGENT_RUN_MODE=scheduled` and use scoped read-only credentials through its secret store. Verify a blocked-write trial; setting an environment variable alone does not enforce a rule in another host. Remove unused connectors. Keep reports and source extracts in authorized private storage; do not automatically commit merchant or customer data.

### 12. Dashboard

Build `reports/dashboard.html` from the warehouse each morning: spend, revenue and MER by day; main number against target; a creative leaderboard marked scale, watch or cut with the deciding number; the job board (what stage each job is at); and "Waiting for you" (sign-offs and plans with their codes). One self-contained file, readable on a phone.

### 13. How the owner works day to day

Show the owner these, and put them in `CLAUDE.md`:

- "What's waiting for me?" lists sign-offs and plans with their codes.
- "Make a new video ad for the spring range" starts a job with `node agent/board.mjs new video-ad "Spring range"`.
- "Where is job-0007?" shows its stage and history.
- Typing `yes 3f9a2c` signs off or approves exactly what that code belongs to. A code works for 24 hours.
- "Pause all agent work" stops every agent write until "resume agent work". Also pause the scheduled tasks if the owner wants nothing to run.
- A publish stage lists its plan ids in `<folder>/<process>.<stage>.plans`, and each plan names its job.
- Reviewer checks are recorded with `node agent/board.mjs check <job> <check> PASS|FIX "<note>" --by <reviewer>`, and script checks with `node agent/board.mjs run-check <job> <check>`. A maker can never pass its own work.
- When a stage cannot go on (tracking is broken, the brief breaks the limits, an input is missing, the owner has not replied, or the job belongs to another process), the agent stops it with `node agent/board.mjs block <job> <reason> "<what is wrong>"`. The reasons are `missing_input`, `out_of_limits`, `tracking_broken`, `needs_owner` and `misrouted`. The orchestrator then asks the owner or starts the right process, and `node agent/board.mjs unblock <job> "<what changed>"` carries on.
- After each step of a plan, read the object back with the connector, then run `node agent/actions.mjs verify <plan> <step> "<what you saw>"`. It compares the read with the plan in code (status, budget and ids) and refuses if they differ. Never tell the owner a change is done or live before this passes.
- Image and video generation runs only inside a signed-off budget: `node agent/spend.mjs use <job folder>` first, and `node agent/spend.mjs add` after each generation.

### 14. Shared hosted execution (way 3)

This is an implementation contract, not a claim that the hosted service is included. Do not equate a chat subscription with an unattended model API entitlement. Use only a provider and billing mode the owner has chosen; integration tests can use local fixtures without model charges.

- Authenticate the person and resolve organization, client and project on the server. Every source read, memory read/write, job, artifact, secret and approval uses that scope. A folder name or a prompt is not tenant authorization. For an agency pilot, isolate each client's storage and credentials before sharing any workers.
- Persist a run record with the workflow version, agent pack hashes, source snapshot, budget, deadline and step dependencies. One specialist owns each step. Parallelize independent channel analyses; serialize writes that share an account or product. A coordinator sets the goal and merges evidence, not every intermediary conversation.
- Use a durable queue with leases, cancellation and recovery. Persist stage outputs and their hashes before advancing. Retry read-only/transient work within bounds. For an uncertain external write, inspect provider state by recorded IDs and idempotency key before deciding whether to retry; never blindly repeat a publish, send or payment.
- Bind delegated context to a task evidence packet: required questions, relevant source passages and conditions, current reconciled brand memory, missing inputs and exact acceptance checks. Each child returns an artifact, evidence, decisions and unresolved gaps. The parent validates those checks before joining branches.
- A model proposes actions; a server-side executor checks actual account scope, approved operation and budget before a connector call. Valid standing authority may be reused within its scope. Keep secrets out of model context. Save provider receipts and fresh readback; active configuration is not delivery or business impact.
- Keep approval and status interfaces small: what will change, why, money/time limits, expected effect and evidence. The server authenticates approvers and binds approval to the exact operation/version. A copied approval string is not authenticated authority.
- Production acceptance requires two-client isolation tests, restart/resume and duplicate-delivery tests, revoked-source and stale-memory tests, provider sandbox checks and a complete workflow with independently reviewed artifacts. A week of read-only operation alone is not enough to enable writes.

The marketplace already has durable job-run infrastructure in `src/modules/runner/workflow.ts`. Reuse suitable existing infrastructure rather than adding a second untracked job system. Its current model-run behavior is not proof that arbitrary external ecommerce tools or shared client isolation are implemented.

### 15. Teams, clients and sharing

- **Team:** list approvers in `context/approvers.json` with what each may approve (creative sign-off, spend up to an amount, sends). Every approval records who said it.
- **Clients (agencies):** each client gets their own store folder and repository. The client or an explicitly delegated approver authorizes creative and spend. A hosted service must authenticate that delegation; relayed text alone is not proof of identity or scope.
- **Sharing the setup:** share the original clean build bundle and install a new workspace for each client. If a custom template is needed, explicitly allowlist reviewed framework code, process definitions and empty example configuration. Do not copy a populated client workspace: `context/`, `jobs/`, `reports/`, `agent-state/`, `board/`, `creatives/`, warehouse databases/data, credentials and approvals are private. A `.gitignore` does not sanitize a copied folder or remove files already committed.

### 16. Getting better over time

- Every creative job ends in the results loop, which writes a dated lesson to `context/learnings.md` with its evidence and confidence. Every intake reads it.
- Each agent's pack carries test briefs. Before changing an agent's model or instructions, run its tests and compare. Keep a model until it is retired if it does the job well.
- Run the process-improvement process monthly (add it to the monthly scheduled task). It reads the board history, the trace and the warehouse, makes the failure table with `node agent/transitions.mjs` (for each process, the last step that went well against the first thing that went wrong), reports the hit rate (the share of creatives that beat the main target), generation spend per winner and time from brief to launch, and proposes at most three process changes. Process files are owner-held, so each change is a file plan the owner approves with its code; jobs already running keep the version they started with.

### 17. Done checklist

Before you tell the owner the build is finished, show each of these:

- [ ] All kit tests pass.
- [ ] `node agent/process.mjs check processes/*.json` passes.
- [ ] A write was blocked before the yes and ran after it, and `status` shows it checked.
- [ ] A direct edit to `context/limits.json` was blocked, and a file plan changed it after the yes.
- [ ] Warehouse extracts reconcile to their own source definitions. Ads attribution, store orders and refunds retain their different scopes; totals are not forced to match.
- [ ] One job moved through at least two stages on the board, with one owner sign-off.
- [ ] If requested, scheduled tasks have passed a real execution and access test on the selected host; unsupported schedules are reported, not invented.
- [ ] The owner knows how to ask "what's waiting for me?", approve with a code, and pause everything.

---

## Appendix A: what is in files/ and where it goes

<!-- kit:files -->

## Appendix B: processes in this folder

<!-- kit:processes -->

## Appendix C: access guides in this folder

<!-- kit:access -->
