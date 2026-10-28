---
name: "sentry"
description: "Use when the user asks to inspect Sentry issues or events, summarize recent production errors, or pull basic Sentry health data via the Sentry CLI; perform read-only queries using the `sentry` command."
---


# Sentry (Read-only Observability)

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Quick start

- If not already authenticated, ask the user to run `sentry auth login` or set `SENTRY_AUTH_TOKEN` as an env var.
- The CLI auto-detects org/project from DSNs in `.env` files, source code, config defaults, and directory names. Only specify `<org>/<project>` if auto-detection fails or picks the wrong target.
- Defaults: time range `24h`, environment `production`, limit 20.
- Always use `--json` when processing output programmatically. Use `--json --fields` to select specific fields and reduce output size.
- Use `sentry schema <resource>` to discover API endpoints quickly.

If the CLI is not installed, give the user these steps:
1. Install the Sentry CLI from Sentry's official install page, https://cli.sentry.dev. Do not run a download piped straight into a shell. Tell the user to read any install script first.
2. Authenticate: `sentry auth login`
3. Confirm authentication: `sentry auth status`
- Never ask the user to paste the full token in chat. Ask them to set it locally and confirm when ready.
- The token only needs read access to issues and events (for example the `event:read` and `project:read` scopes). Do not ask for a token with write access.

## Core tasks (use Sentry CLI)

Use the `sentry` CLI for all queries. It handles authentication, org/project detection, pagination, and retries automatically. Use `--json` for machine-readable output.

### 1) List issues (ordered by most recent)

```bash
sentry issue list \
  --query "is:unresolved environment:production" \
  --period 24h \
  --limit 20 \
  --json --fields shortId,title,priority,level,status
```

If auto-detection doesn't resolve org/project, pass them explicitly:
```bash
sentry issue list {your-org}/{your-project} \
  --query "is:unresolved environment:production" \
  --period 24h \
  --limit 20 \
  --json
```

### 2) Resolve an issue short ID to issue detail

```bash
sentry issue view {ABC-123} --json
```

Use the short ID format (e.g., `ABC-123`), not the numeric ID.

### 3) Issue detail

```bash
sentry issue view {ABC-123}
```

### 4) Issue events

```bash
sentry issue events {ABC-123} --limit 20 --json
```

### 5) Event detail

```bash
sentry event view {your-org}/{your-project}/{event_id} --json
```

### 6) AI-powered root cause analysis

This and the fix plan below may need a paid Sentry plan or AI add-on, and may start an AI run in Sentry. Check the user's Sentry plan first, and say so if the command is refused.

```bash
sentry issue explain {ABC-123}
```

### 7) AI-powered fix plan

```bash
sentry issue plan {ABC-123}
```

## Fallback: arbitrary API access

For endpoints not covered by dedicated CLI commands, use `sentry api`:
```bash
sentry api /api/0/organizations/{your-org}/ --method GET
```

Use `sentry schema` to discover available API endpoints:
```bash
sentry schema issues
```

## Inputs and defaults

- `org_slug`, `project_slug`: auto-detected by the CLI from DSNs, env vars, and directory names. Override with positional `{your-org}/{your-project}` if auto-detection fails.
- `time_range`: default `24h` (pass as `--period 24h`).
- `environment`: default `production` (pass as part of `--query`, e.g., `environment:production`). If the user's environment is named differently, such as `prod`, use their name.
- `limit`: default 20 (pass as `--limit`).
- `search_query`: optional `--query` parameter, uses Sentry search syntax (e.g., `is:unresolved`, `assigned:me`).
- `issue_short_id`: use directly with `sentry issue view`.

## Output formatting rules

- Issue list: show title, short_id, status, first_seen, last_seen, count, environments, top_tags; order by most recent.
- Event detail: include culprit, timestamp, environment, release, url.
- If no results, state explicitly.
- Redact PII in output (emails, IPs). Do not print raw stack traces.
- Never echo auth tokens.

## What a good answer looks like

A good answer is an ordered list of open production issues, newest first, each with its title, short ID, count and last seen time. If nothing was found, it says so plainly.
