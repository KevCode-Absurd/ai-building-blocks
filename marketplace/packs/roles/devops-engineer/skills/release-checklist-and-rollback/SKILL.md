---
name: release-checklist-and-rollback
description: Plans one software release or go-live so it is calm - a readiness check (tests, migrations, config, docs, support briefed), a before-during-after deploy checklist with an owner, a check and a stop line on every step, a rollback plan for code and data written before the release plan, smoke tests, release notes in users' words, and for mobile apps a phased release or staged rollout plan with a halt rule. Covers web apps, APIs, site moves (DNS, SSL, data) and app store releases. The deploy runs only through the client's own pipeline at access level 3 after the action list is confirmed; migrations need a backup first, and destructive steps need a fresh yes. Use it before any release that touches data, config or many users.
---

# Release checklist and rollback

## When to use

- A release changes the database, settings, permissions or anything users rely on.
- A first launch or a move: new host, new domain, DNS and SSL changes, a data move.
- A weekly or monthly release that keeps going wrong in the same places.
- A mobile app update that needs store notes and a rollout plan.

## What you need

1. The change list: merged pull requests, tickets or a written summary.
2. Test results and anything not tested.
3. Migrations, with what each does to data.
4. Settings or secrets that change, and where they live (names only).
5. How you deploy today, who approves, and what went wrong last time.
6. Who is affected if it breaks, and the busiest and quietest times.
7. Access: level 1 to read. Level 2 to stage and draft notes. Level 3, within the client's limits, to deploy to production through their pipeline.

## Steps

### 1. Ask what went wrong last time

Before tools or dates. Past failures point at the steps that need a stop line.

### 2. Write the rollback first

- **Code:** redeploy the last good version, by name or tag, through the same pipeline.
- **Data:** each migration is either reversible (with a tested down step) or safe to keep with the old code. If neither, split it: ship a schema both versions can use first, and remove old columns in a later release.
- **Settings and DNS:** the old values written down, and how long caches take to clear.
- **Mobile:** installed versions cannot be pulled back. The way back is pausing or halting the rollout and shipping a fixed build, or switching a feature off on the server.
- **Who decides** to roll back, and the stop rules that trigger it.

### 3. Run the readiness check

Tick or flag each: tests passed; migrations reviewed and timed on a copy; backup taken and a recent restore confirmed; config and secrets set in the target environment; monitoring and alerts ready; docs and help pages updated; support briefed on what changes and what to tell customers; rollback written. If something can't be checked, say so.

### 4. Write the checklist in three parts

Every step has an owner, a check and a "stop here if" line.

- **Before:** freeze window agreed, backup confirmed, staging deploy passed, action list approved.
- **During:** deploy through the pipeline; migrations in order; destructive steps listed separately, each waiting for its own yes.
- **After:** smoke tests (home page or health check, sign-in, one key action, error logs), watch window, all-clear message.

### 5. Plan a staged release where you can

Canary, percentage rollout or a feature toggle for the risky part. Content and config files deserve the same staging as code; outages at CrowdStrike in July 2024 and Cloudflare in November 2025 both came from files pushed everywhere at once.

### 6. For mobile apps

- iOS: phased release over 7 days to automatic updaters; can be paused for up to 30 days in total.
- Android: staged rollout percentages you raise yourself; halting stops new installs only.
- Store notes ("What's New"), review notes, screenshots if the UI changed, and the halt rule with who watches crash rates.

### 7. Write the release notes

One line per change in users' words, grouped as Added, Changed, Fixed, Removed and Security, with any action users must take. Drop internal-only changes. Never list a feature that is not in the change list.

### 8. Run it (level 3)

Show the client the action list: what deploys, where, migrations and their type, smoke tests, rollback, who watches and for how long. After their yes, run it through their pipeline. Backup before any migration. A fresh yes for any destructive step, any deletion, or anything that raises spend past their cap. If a stop line triggers, roll back and tell the client.

### 9. Close out

Log what ran, when and the result. Note what to change in the checklist next time.

## Checks

- The rollback exists for code, data and settings, and was tried on staging.
- Every step has an owner, a check and a stop line.
- Migrations are classed as safe, locking or destructive, and destructive ones are separate.
- Support was briefed before release day.
- Release notes match the change list exactly.
- Nothing in the plan needs a secret value written down.

## Output format

1. Readiness check with ticks, flags and "could not check".
2. Rollback plan: triggers, decider, steps for code, data, settings.
3. Before, during and after checklist with owners, checks and stop lines.
4. Rollout plan (staged, mobile halt rule if relevant).
5. Release notes and, for apps, store notes.
6. Production action list for the client's yes.

## Example of good output (short)

*Illustrative structure, not a real business: a physio clinic moving its booking site to a new host. Copy the shape, never the content: every fact comes from the client's own context.*

> | When | Step | Owner | Check | Stop here if |
> |---|---|---|---|---|
> | T-2 days | Lower DNS TTL | Sam | `dig` shows new TTL | TTL unchanged |
> | T-0 08:00 | Backup and restore test of bookings DB | Agent | Row counts match | Counts differ |
> | T-0 08:30 | Deploy to new host via pipeline | Agent | Health check 200 | Any 5xx |
> | T-0 08:45 | Switch DNS | Sam | New IP from two resolvers | Bookings fail on test account |
> | T-0 09:00 | Smoke test: book and cancel a test slot | Priya | Email received | No email in 5 min |
>
> **Rollback:** point DNS back to the old host (kept running for 7 days), restore bookings made since 08:00 from the new database export. Decider: Priya.
