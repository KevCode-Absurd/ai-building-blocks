---
name: copilot-usage-metrics
description: Retrieve and display GitHub Copilot usage metrics for organizations and enterprises using the GitHub CLI and REST API.
---

# Copilot Usage Metrics

You are a skill that retrieves and displays GitHub Copilot usage metrics using the GitHub CLI (`gh`).

## When to use this skill

Use this skill when the user asks about:
- Copilot usage metrics, adoption, or statistics
- How many people are using Copilot in their org or enterprise
- Copilot acceptance rates, suggestions, or chat usage
- Per-user Copilot usage breakdowns
- Copilot usage on a specific date

Do not use it for seat counts or billing. Point the user to GitHub's billing page for those.

## Before you start

This skill runs shell scripts. It needs:
- GitHub Enterprise Cloud (the API calls below do not work on other plans).
- The `gh` command line, installed and signed in (`gh auth status` should pass).
- An account with enterprise owner or billing manager rights, or a token with the `manage_billing:copilot` or `read:enterprise` scope.
- The "Copilot usage metrics" policy switched on in enterprise settings.

If you cannot run commands in this chat, do not guess any numbers. Give the user the exact `gh` command for the script they need (see below), ask them to run it and paste the JSON back, then continue from the Formatting step.

## How to use this skill

1. Determine whether the user wants **organization** or **enterprise** level metrics.
2. Ask for the org name or enterprise slug if not provided. Do not guess it.
3. Determine if they want **aggregated** metrics or **per-user** metrics.
4. Determine if they want metrics for a **specific day** (YYYY-MM-DD format) or general/recent metrics. If they give a date range, run one day at a time and compare the days.
5. Run the appropriate script from this skill's directory.
6. If the script fails, read the Errors section below, tell the user the fix, and stop. Never fill in numbers the script did not return.

## Available scripts

### Organization metrics

- `get-org-metrics.sh <org> [day]` — Get aggregated Copilot usage metrics for an organization. Optionally pass a specific day in YYYY-MM-DD format.
- `get-org-user-metrics.sh <org> [day]` — Get per-user Copilot usage metrics for an organization. Optionally pass a specific day.

### Enterprise metrics

- `get-enterprise-metrics.sh <enterprise> [day]` — Get aggregated Copilot usage metrics for an enterprise. Optionally pass a specific day.
- `get-enterprise-user-metrics.sh <enterprise> [day]` — Get per-user Copilot usage metrics for an enterprise. Optionally pass a specific day.

## Formatting the output

When presenting results to the user:
- Summarize key metrics: total active users, acceptance rate, total suggestions, total chat interactions
- Use tables for per-user breakdowns
- Highlight trends if comparing multiple days
- Note that metrics data is available starting from October 10, 2025, and historical data is accessible for up to 1 year

Use this layout. Leave out any block the user did not ask for. If the reply does not contain a measure, write NOT RETURNED. Never work one out from memory.

```
Copilot usage for <organization or enterprise>, <day or recent period>

| Measure | Value |
| Active users | <number> |
| Acceptance rate | <percent> |
| Suggestions | <number> |
| Chat interactions | <number> |

Per person (if asked): <one row per user>
Trend (if more than one day): <what rose or fell>
Notes: <missing data, access problems>
```

Close with one next step, such as: compare with last week, list the people with a seat and zero use, or share the table with whoever owns the budget.

## Errors

- **403**: check the token rights and that the "Copilot usage metrics" policy is on. Tell the user which one to change.
- **404**: check the spelling of the org name or enterprise slug, and that the plan is Enterprise Cloud. GitHub changes its API over time, so if it still fails, point the user to GitHub's Copilot metrics documentation.
- **Empty reply**: the day may be before October 10, 2025 or older than 1 year. Say so.

## Important notes

- These API endpoints require **GitHub Enterprise Cloud**.
- The user must have appropriate permissions (enterprise owner, billing manager, or a token with `manage_billing:copilot` / `read:enterprise` scope).
- The "Copilot usage metrics" policy must be enabled in enterprise settings.
- If the API returns 403, advise the user to check their token permissions and enterprise policy settings.
