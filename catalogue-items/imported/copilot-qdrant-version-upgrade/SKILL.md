---
name: qdrant-version-upgrade
description: "Guidance on how to upgrade your Qdrant version without interrupting the availability of your application and ensuring data integrity."
---


# Qdrant Version Upgrade

Qdrant has the following guarantees about version compatibility:

- Major and minor versions of Qdrant and SDK are expected to match. For example, Qdrant 1.17.x is compatible with SDK 1.17.x.

- Qdrant is tested for backward compatibility between minor versions. For example, Qdrant 1.17.x should be compatible with SDK 1.16.x. Qdrant server 1.16.x is also expected to be compatible with SDK 1.17.x, but only for the subset of features that were available in 1.16.x.

- For migration to the next minor version, it is recommended to first upgrade the SDK to the next minor version and then upgrade the Qdrant server.

- Storage compatibility is only guaranteed for one minor version. For example, data stored with Qdrant 1.16.x is expected to be compatible with Qdrant 1.17.x. If you need to migrate more than one minor version, it is required do the upgrade step by step, one minor version at a time. For example, to migrate from 1.15.x to 1.17.x, you need to first upgrade to 1.16.x and then to 1.17.x. Note: Qdrant Cloud automates this process, so you can directly upgrade from 1.15.x to 1.17.x without intermediate steps.

- A Qdrant cluster with a replication factor of 2 or higher can be upgraded without downtime by performing a rolling upgrade. This means that you can upgrade one node at a time while the other nodes continue to serve requests. This allows you to maintain availability of your application during the upgrade process. More about replication factor: [Replication factor](https://search.qdrant.tech/md/documentation/operations/distributed_deployment/?s=replication-factor)

For managing Qdrant version upgrades in Qdrant Cloud, you can use the [qcloud](https://github.com/qdrant/qcloud-cli) CLI tool.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Qdrant release notes:** They list changes per version, and your AI can check them for breaking changes.
- **Qdrant Cloud command line tool:** It manages upgrades on Qdrant Cloud, and needs a Cloud account.
<!-- /needs -->

## What you need

Ask once for anything not given:

- The current Qdrant server version and the target version.
- The SDK (client library) version your app uses.
- How Qdrant runs: one machine, a cluster, Kubernetes or Qdrant Cloud.
- The replication factor (how many copies of each shard).
- A test setup to rehearse on, and how much downtime is acceptable (optional).

The `qcloud` tool needs a Qdrant Cloud account. Say so when you point to it.

## How to plan the upgrade

1. Work out the path. Self-hosted: one minor version at a time, so 1.15.x to 1.17.x goes through 1.16.x. Qdrant Cloud can go straight to the target.
2. Decide the order. Upgrade the SDK to the next minor version first, then the server.
3. Check downtime. Replication factor 2 or higher allows a rolling upgrade, one node at a time. Below 2, tell the person to expect downtime and to plan a window.
4. Back up before each stop. Take a backup or snapshot of the data and check that it can be restored. This step is general good practice. Point the person to the Qdrant docs for how on their setup, and do not invent commands.
5. Upgrade, then check. After each stop, check the health endpoints (`/healthz`, `/livez`, `/readyz`) and run a few searches the app depends on. Compare with the results from before.
6. Stop if a check fails. Do not go to the next stop. Say what to restore or roll back.

## What you hand back

Your setup (use `MISSING` for anything not given), the Path, the Downtime answer with the reason, a numbered Plan with a backup before and a check after each stop, the Way back, and Next: the first step to take.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Qdrant search relevance investigator](https://useaiblocks.com/skills/copilot-qdrant-search-quality). It takes the plan.
- The [Qdrant health monitoring planner](https://useaiblocks.com/skills/copilot-qdrant-monitoring). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

Write `MISSING: <what>`. Never invent version numbers, release changes or commands. If the target version is not known, ask. Tell the person to read the release notes for breaking changes between their versions, because this file does not list them.
