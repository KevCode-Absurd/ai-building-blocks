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

## If something is missing

Write `MISSING: <what>`. Never invent version numbers, release changes or commands. If the target version is not known, ask. Tell the person to read the release notes for breaking changes between their versions, because this file does not list them.
