# Automate a manual deploy

**Trigger:** A team deploys by hand (SSH, copy files, run commands) or has a fragile pipeline, and wants releases that run the same way every time. Usually one to three weeks of elapsed time.

## Steps

1. **Agree access and limits (level 1 until answered).** Ask which level the client grants for each tool: code host and CI, cloud or hosting account, registry, monitoring. Agree the environments, the monthly budget cap and who approves production. Connect only through official connectors, MCP servers or each tool's own sign-in. Record the "Access I have" list.
2. **Write down today's deploy (level 1).** Number every manual step and ask what went wrong last time. Mark risky steps: data changes, config, downtime.
3. **Containerise (level 2).** Use the `docker-and-ci-pipeline` skill for the Dockerfile, `.dockerignore` and Compose file. Check locally or have the client run the local checks.
4. **Write the pipeline (level 2).** Same skill: tests on pull requests, build and deploy from main, actions pinned to commit SHAs, least permissions, OIDC for cloud access, secrets by name. If the build fails, use the `ci-build-failure-diagnosis` prompt.
5. **Infrastructure, if needed (level 2).** Write Terraform or OpenTofu for the small set of resources, run `plan` against non-production, and review it with the `terraform-plan-review` prompt. *Approval: the client reviews the plan; any destroy or replace needs a fresh yes.*
6. **Open the pull request (level 2).** Configs, secrets table, local checks, smoke tests and the rollback job. *Approval: a named reviewer on the client's team approves.*
7. **Stage it (level 2 or 3).** Run the pipeline to staging, run smoke tests, and run the rollback job once on staging.
8. **Write the release checklist.** Use the `release-checklist-and-rollback` skill for the first production deploy: readiness check, before-during-after steps with stop lines, rollback. Take a backup before any migration and confirm a recent restore.
9. **Confirm the production action list.** What deploys, where, migrations and their type, smoke tests, rollback, who watches and for how long. *Approval: the client says yes before the first production deploy in the job.*
10. **First production deploy (level 3).** Only through the client's own pipeline and production environment, with the named approver. Destructive steps, deleting resources and anything that takes spend past the cap each wait for a fresh yes.
11. **Watch and hand over.** Smoke tests, error logs and costs for the agreed window. Hand over the runbook (how to deploy, how to roll back, where secrets live, who approves) and the action log.

## Outputs

- "Access I have" list and the agreed budget cap
- Written manual steps with risks marked
- Dockerfile, Compose file and pipeline file, commented
- Terraform or OpenTofu code and a reviewed plan, if used
- Secrets table, smoke tests and rollback job
- Release checklist and confirmed production action list
- Runbook and action log

## Needs the client's approval

The access level and limits for each tool, including the budget cap; every pull request (a named reviewer); every infrastructure plan, with a fresh yes for any destroy or replace; the production action list before the first production deploy; a fresh yes for destructive changes, deleting resources and spend above the cap, even at level 3; and anything outside the agreed limits, such as new accounts, regions, providers, permissions or secrets. A backup is taken before every migration. The client can lower the access level at any time.
