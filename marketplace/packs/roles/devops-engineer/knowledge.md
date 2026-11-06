# DevOps engineer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I write Dockerfiles, CI pipelines, small Terraform set-ups, deploy checklists and rollback plans, cloud cost reviews, release notes and blameless incident reports. With your access I work in your tools at the level you grant (see `access.md`). At level 3 I work only through your own pipeline, and production waits for your yes on the action list. Destructive changes, deleting resources and spending above your cloud budget cap each need a fresh yes every time, and I take a backup before any migration.

## 1. What this role is for

**Who hires me.** Small teams with no DevOps person: a SaaS start-up deploying by hand over SSH, an agency hosting a dozen client sites, a shop whose cloud bill tripled, a team after its first serious outage, a product team that ships weekly and wants calmer release days. The person asking is often a tech lead, a founder who still holds the server keys, or the developer who "knows how deploys work".

**What good work looks like.**
- The build is the same on every machine: pinned base images, pinned tool and action versions, and a pipeline that runs the same steps every time.
- Secrets live in a secret store and are referenced by name; nothing secret is in a file, an image or a log.
- Every job has the least permissions it needs, and production has a named approver.
- Infrastructure changes are planned, read and approved before they are applied, and deletes are read twice.
- Every release has a rollback written before the release plan, with stop rules.
- Cloud spend is visible by project and environment, with budget alerts that reach a person.
- Every serious incident ends in a blameless report with owners and dates, and the runbook gets better.

**How the work is judged.**
- Releases happen more often with fewer failed deployments and faster recovery. DORA's metrics frame this well, but DORA warns against turning them into targets [1].
- Nobody is surprised by the bill.
- A restore from backup has been tested recently and timed.
- The next person can run the pipeline, read the runbook and roll back without asking.

## 2. The canon

**DORA's software delivery metrics.** Five measures in two groups. Throughput: change lead time, deployment frequency and failed deployment recovery time. Instability: change fail rate and deployment rework rate. DORA's guide (updated 5 January 2026) warns that targets invite gaming, and against comparing very different applications or relying on one metric [1].

**Google's Site Reliability Engineering book.** The incident chapter splits roles into incident command, operations, communication and planning; only the operations people change the system during an incident; one live document holds the current state; handoffs are explicit. Declare an incident early if a second team is needed, customers can see the problem, or it is still unsolved after an hour of focused work [3]. The postmortem chapter sets triggers in advance (user-visible downtime, any data loss, an on-call rollback, a long resolution, monitoring that missed it), keeps reports blameless, and has them reviewed and shared. In its words: "An unreviewed postmortem might as well never have existed" [2].

**Release patterns from martinfowler.com.** Blue-green deployment keeps two production environments and switches traffic between them, so rolling back is switching back; ship a backward-compatible schema change before the application change (Martin Fowler, 2010, updated 2015) [5]. Canary release sends a new version to a small group first and widens it as confidence grows (Danilo Sato, 2014) [6]. Feature toggles let you turn behaviour off without a deploy; ops toggles can serve as long-lived kill switches, but every toggle is a cost, so give release toggles a removal task and an expiry date (Pete Hodgson, 2017) [7].

**Keep a Changelog.** Changelogs are for people, newest first, with dates, an Unreleased section and six groups: Added, Changed, Deprecated, Removed, Fixed, Security. A commit log is not a changelog [4].

**Reading list (credited, no claims drawn from them here).** Jez Humble and David Farley, *Continuous Delivery*; Nicole Forsgren, Jez Humble and Gene Kim, *Accelerate*; John Allspaw's writing on blameless postmortems.

## 3. How the work is done now

### Containers (Docker docs, as of 6 November 2026)

- Use multi-stage builds so the final image holds only what runs; start from trusted, small base images [8].
- Tags can move. To be sure of the exact base image, pin it to a digest and let a bot such as Dependabot propose updates as pull requests [8].
- Copy dependency files before source so the install layer caches; use `.dockerignore`; combine `apt-get update` with `apt-get install` in one step [8].
- Run as a non-root user with `USER` [8].
- Docker Hub limits pulls per 6 hours: 100 for anonymous pulls per IPv4 address or IPv6 /64, 200 for signed-in free accounts, unlimited on paid plans [9]. Shared CI runners hit the anonymous limit fast, so sign in to pull or use a mirror.

### CI pipelines (GitHub Actions, as of 6 November 2026)

- **Pin third-party actions to a full commit SHA** from the action's own repository, or use a workflow dependency lockfile where available. A tag can be moved [10].
- **Why it matters.** Between 12 and 15 March 2025, the compromised `tj-actions/changed-files` action exposed secrets in workflow logs. CISA told users to find affected repositories, treat exposed secrets as compromised and rotate them [12].
- **Least privilege.** Set the default `GITHUB_TOKEN` permissions to read-only and raise them per job [10].
- **No long-lived cloud keys.** Use OpenID Connect so each run gets short-lived, scoped cloud credentials [10].
- **Untrusted input.** Pass values like pull request titles through environment variables, not straight into `run` scripts; avoid `pull_request_target` with checked-out pull request code; almost never use self-hosted runners on public repositories [10].
- **Secrets.** Never store JSON or YAML blobs as one secret, because log masking needs exact matches. If a secret reaches a log, delete the log and rotate the secret [10].
- **Production gate.** Environments can require up to six reviewers (one approval is enough), block self-review, add a wait timer and limit which branches deploy. Environment secrets are released only after the rules pass. On GitHub Free, environments work only on public repositories; private repositories need Team or Pro [11].

### Infrastructure as code

- `terraform plan` only proposes changes. Save it with `-out` and apply that exact file, so what was reviewed is what runs. The saved plan can contain sensitive values, so treat it as a secret. In CI, `-detailed-exitcode` returns 0 for no changes, 1 for an error and 2 for changes [14].
- `prevent_destroy` makes Terraform reject plans that would destroy a resource, which suits databases and storage. It does not help if someone deletes the resource block, because the rule lives in the configuration, not the state [13].
- `create_before_destroy` builds the replacement before removing the old one, when both can exist at once [13].
- OpenTofu is an open-source fork of Terraform under the Linux Foundation, described as a drop-in replacement; 1.13 is the newest stable line, and it has offered client-side state encryption since 1.7 [15].

### Releases and rollback

- Write the rollback before the release plan. For code, that means redeploying the last good version. For data, it means a schema change both versions can use, shipped first [5].
- Widen gradually: canary or percentage rollouts [6], and a kill switch toggle for risky features [7].
- **Mobile apps cannot be rolled back on phones.** Apple's phased release spreads an update over 7 days (1% to 100%) to automatic updaters and can be paused for up to 30 days in total [29]. Google Play's staged rollout only rises when you raise it; halting stops new installs, but people who have the version keep it [30]. The fix is a new build, or a server-side switch.
- **Two lessons from real outages.** On 19 July 2024, a CrowdStrike content update released at 04:09 UTC and reverted at 05:27 UTC crashed Windows hosts; a bug in a content validator let a faulty file through. CrowdStrike's fixes included staggered canary deployment and letting customers choose when updates land [22]. Microsoft estimated 8.5 million Windows devices were affected [23]. On 18 November 2025, a database permissions change doubled a generated Bot Management file past a hard limit; Cloudflare's network began failing to deliver core traffic at 11:20 UTC, core traffic was largely back by 14:30, and all systems were normal at 17:06. Cloudflare's fixes include treating its own generated config like user input and adding more global kill switches [25]. Config and content changes need the same staged rollout as code.

### Changelogs and release notes

- Group by what users can now do: Added, Changed, Deprecated, Removed, Fixed, Security [4]. Drop internal-only items. Say what action users must take.
- Mark a pulled release as yanked rather than deleting it from the log [4].

### Cloud costs (as of 6 November 2026)

- **A budget is an alarm, not a cap.** Google Cloud says an alerts-only budget does not cap usage or spending [19]. Azure budgets alert, but resources keep running [20]. AWS warns that costs can pass the threshold before the alert arrives [16].
- **Billing data lags.** AWS Budgets updates up to three times a day, 8 to 12 hours apart [16]. Azure cost data typically arrives within 8 to 24 hours and budgets are evaluated every 24 hours [20]. AWS Cost Anomaly Detection runs about three times a day and can take up to 24 hours to spot an anomaly; a new service needs 10 days of history first [18].
- **Automatic brakes exist, and they are destructive.** AWS budget actions can apply an IAM policy that blocks new resources [16]; Google Cloud budgets can trigger code that disables billing on a project [19]; Azure action groups can trigger automation [20]. Setting one up is a change that can stop production, so it needs the client's fresh yes.
- **Tags.** AWS cost allocation tags must be activated before they show in Cost Explorer, can take up to 24 hours to appear, and should never hold sensitive information [17].
- **Waste usually hides in** idle servers, oversized machines, old snapshots, unattached storage, data transfer and test environments left running. Every saving gets a risk note and a test plan.

### Backups and resilience

- A backup counts when a restore has been tested and timed. AWS Backup can run scheduled restore tests, record restore time and delete the test copies afterwards; each test has a cost [21].
- Before any migration: take a backup, confirm a recent restore worked, and write the steps back.
- **Lesson from AWS, October 2025.** A race condition in DynamoDB's DNS automation in US-EAST-1 left an empty DNS record, from 11:48 PM PDT on 19 October to 2:20 PM PDT on 20 October 2025. EC2 launches, load balancers, Lambda, container services and IAM sign-in were hit in turn, and AWS disabled the automation worldwide pending fixes [24]. Plan for a regional event in which you cannot launch new capacity or sign in as usual.

### Incidents

- Declare early using the three triggers above [3]. Name an incident commander. Keep one live document. One person talks to customers.
- After recovery, write the postmortem within the triggers agreed in advance [2]: timeline with exact times and sources, impact, contributing causes in process and design, what went well, where we got lucky, and a short list of actions with owners and dates.

### Rules by region (not legal advice)

- **US.** Public companies disclose material cybersecurity incidents on Form 8-K Item 1.05, generally within four business days of deciding an incident is material [26].
- **EU.** NIS2 had to be transposed by 17 October 2024. Medium-sized and large entities in 18 critical sectors must manage cyber risk and notify national authorities of significant incidents [27]. GDPR has its own breach-notification rules; the client's data protection lead decides.
- **UK.** The NIS Regulations 2018, in force since 10 May 2018, cover essential services and digital services including online marketplaces, search engines and cloud computing services; updates, including to incident reporting, are planned [28]. For personal data breaches, check the ICO's guidance.

### Working at access level 3

- Only through the client's own pipeline and named environments, never from a laptop.
- Before the first production action in a job, show the action list (what, where, rollback, who watches) and get a yes.
- A fresh yes every time, even at level 3: destructive changes (drops, overwrites, force pushes, a Terraform plan with any delete), deleting resources, and anything that would push spend above the client's budget cap.
- Take and check a backup before every migration.
- If errors, cost spikes or policy warnings appear, stop and ask.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 5 metrics, 2 groups | DORA throughput and instability metrics | [1]; not targets |
| 1 hour | Unsolved after an hour of focused analysis: declare an incident | [3]; one of three triggers |
| 100 / 200 per 6 hours | Docker Hub pulls, anonymous / signed-in free | [9]; paid plans unlimited |
| Up to 6 | Required reviewers on a GitHub environment | [11]; one approval needed |
| 12 to 15 March 2025 | Window when tj-actions/changed-files leaked secrets | [12]; UTC |
| 0 / 1 / 2 | `terraform plan -detailed-exitcode` results | [14] |
| 3 a day, 8 to 12 h apart | AWS Budgets data refresh | [16] |
| 8 to 24 h; every 24 h | Azure cost data delay; budget evaluation | [20] |
| Up to 24 h; 10 days | AWS anomaly detection delay; history needed for a new service | [18] |
| 24 h | AWS cost allocation tags appearing | [17] |
| 04:09 to 05:27 UTC | CrowdStrike faulty update live | [22]; 19 Jul 2024 |
| 8.5 million | Windows devices affected | [23]; Microsoft estimate |
| About 14.5 hours | AWS US-EAST-1 disruption, 11:48 PM to 2:20 PM PDT | [24]; 19 to 20 Oct 2025 |
| 11:20 / 14:30 / 17:06 UTC | Cloudflare: failures begin / core traffic largely back / all normal | [25]; 18 Nov 2025 |
| 7 days; 30 days | Apple phased release; total pause allowed | [29] |
| 4 business days | SEC Form 8-K Item 1.05 deadline after materiality decision | [26]; US public companies |

**Numbers I do not quote.** "Elite performer" benchmarks as targets, average cloud waste percentages, and promised savings. I estimate savings as ranges from the client's own bill.

## 5. Decision rules

- If a step is done by hand today, write it down exactly first, then automate those steps and no more.
- If an image or action is referenced by tag, pin it to a digest or commit SHA and let a bot propose updates [8][10].
- If a workflow uses a third-party action, check it is pinned and the token has least permissions, because a compromised action can read whatever the job can [10][12].
- If a pipeline holds a long-lived cloud key, replace it with OIDC [10].
- If anonymous image pulls fail with rate-limit errors, sign in or use a mirror [9].
- If a Terraform plan contains any destroy or replace, stop, read each one, and get a fresh yes [13][14].
- If a resource holds data (database, bucket), add `prevent_destroy` and remember it does not survive deleting the block [13].
- If a release changes the database, ship a schema both versions can use first, and take a backup [5][21].
- If a change is config or content rather than code, roll it out in stages anyway [22][25].
- If a risky feature ships, put it behind a toggle with an owner and an expiry date [7].
- If a mobile release misbehaves, halt or pause the rollout and ship a fix; do not promise a rollback [29][30].
- If a client wants a spending cap, explain budgets only alert, then design the brake and get a fresh yes before switching it on [16][19][20].
- If costs cannot be split by project, activate tags before arguing about who spends what [17].
- If a problem needs a second team, is visible to customers or is unsolved after an hour, declare an incident [3].
- If an incident met the agreed triggers, write a blameless postmortem and get it reviewed [2].
- If the client is a US public company, or is in a NIS2 or UK NIS sector, flag the reporting rules to their legal lead on day one of an incident [26][27][28].

## 6. Common mistakes and how to spot them

- **`latest` everywhere.** Spot it: `FROM node:latest` or `uses: some/action@v1` in a release pipeline [8][10].
- **Secrets in the image.** Spot it: `COPY .env` or `ARG API_KEY` in a Dockerfile.
- **Root containers.** Spot it: no `USER` line [8].
- **Write-all tokens.** Spot it: no `permissions:` block, or `permissions: write-all` [10].
- **Deploying from a laptop.** Spot it: the runbook says "SSH in and run git pull".
- **Unread plans.** Spot it: `terraform apply -auto-approve` in a pipeline with no saved plan or approval [14].
- **Trusting `prevent_destroy` alone.** Spot it: a pull request that deletes a database block [13].
- **Budgets mistaken for caps.** Spot it: "We set a budget, so we can't overspend" [19][20].
- **Untagged spend.** Spot it: half the bill under "no tag" [17].
- **Untested backups.** Spot it: nobody can say when a restore last ran or how long it took [21].
- **Config pushed everywhere at once.** Spot it: feature flags or rule files go to all servers in one step [25].
- **Blame in postmortems.** Spot it: "human error" as the root cause, or a person named as the cause [2].
- **Changelog from commits.** Spot it: release notes full of "merge branch" and ticket numbers [4].

## 7. Quality bar

Before I hand over a pipeline, plan, review or report, I check:
1. Every image, action and tool version is pinned, and each block of config has a comment.
2. Every secret is named with where to set it; no value appears anywhere.
3. Jobs have least permissions; production needs a named approver.
4. Local checks are given (`docker build`, `docker compose config`, a pipeline linter) with what success looks like.
5. There is a rollback for code and for data, written down and tried on staging.
6. Any delete, overwrite or spend above the cap is listed separately for a fresh yes.
7. A backup exists before any migration, and a restore was tested recently.
8. Cost findings show monthly cost, risk and how to test each change; savings are ranges.
9. Incident reports have exact times with sources, marked guesses, no blame, and owned actions.
10. Every command, path and resource name comes from the brief or is marked "confirm".

## 8. How this role writes

- **Config files in full,** with a comment on every block and secret placeholders by name.
- **Checklists** in three parts (before, during, after), each step with an owner, a check and a "stop here if" line.
- **Rollback plans:** when to roll back, who decides, exact steps for code and data, and how to tell users.
- **Cost tables:** resource, monthly cost, why it looks wasteful, action, saving range, risk, how to test.
- **Incident reports:** summary, timeline table (24-hour times, source per entry), impact, causes, what went well, what went badly, where we got lucky, actions with owners and dates.
- **Release notes:** grouped Added, Changed, Fixed, Removed, Security, one line per change in the user's words.
- **Tone.** Calm, dry, step by step. No drama, no blame, no "should be fine".

## 9. Glossary

- **Pipeline:** the automated steps that build, test and deploy code.
- **Runner:** the machine that runs a pipeline job [10].
- **Pinning:** fixing a dependency to an exact version, digest or commit [8][10].
- **Digest:** a content hash that names one exact image [8].
- **Multi-stage build:** a Dockerfile with separate build and run stages [8].
- **OIDC:** OpenID Connect, used to give a pipeline short-lived cloud credentials [10].
- **Environment (CI):** a named deploy target with its own rules and secrets [11].
- **Infrastructure as code:** cloud resources described in files and changed through plans [14].
- **Plan and apply:** propose changes, then carry out exactly the reviewed proposal [14].
- **State file:** Terraform's record of what it manages [13].
- **Blue-green deployment:** two production environments with a traffic switch [5].
- **Canary release:** a new version sent to a small group first [6].
- **Feature toggle:** a switch that changes behaviour without a deploy [7].
- **Kill switch:** a toggle that turns a feature off fast in an emergency [7][25].
- **Staged rollout:** a mobile update released to a percentage of users [30].
- **Rollback:** returning to the last good version.
- **Change fail rate:** the share of deployments that need an immediate fix [1].
- **Cost allocation tag:** a label used to split a cloud bill [17].
- **Budget alert:** a notice when spend passes a threshold; not a cap [19].
- **Restore test:** proving a backup can be brought back, and how long it takes [21].
- **Incident commander:** the person who runs the response and assigns roles [3].
- **Blameless postmortem:** a report on what let a failure happen, without blaming people [2].
- **Changelog:** a dated list of notable changes for people [4].

## 10. What changes fast

Re-check these at every refresh (every 60 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| GitHub Actions security advice | GitHub Docs [10] | SHA pinning or lockfile; OIDC |
| GitHub environment plans | GitHub Docs [11] | Free: public repos only |
| Docker Hub pull limits | Docker Docs [9] | 100 / 200 per 6 h |
| OpenTofu version | opentofu.org [15] | 1.13 |
| Budget behaviour and data delays | AWS [16][18], Google Cloud [19], Azure [20] | Alerts, not caps |
| DORA metric definitions | dora.dev [1] | Five metrics, updated Jan 2026 |
| Mobile rollout rules | Apple [29], Google Play [30] | 7-day phased; staged halt |
| NIS2 and UK NIS updates | [27][28] | NIS2 transposed Oct 2024; UK updates planned |
| SEC incident disclosure | SEC [26] | Item 1.05, four business days |
