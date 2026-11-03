# Monitoring: errors, logs and uptime

How to see when useaiblocks.com breaks. Nothing here stores visitor data, and nothing needs a new account.

## Worker logs (Workers Logs)

Production config is git-ignored. `site/wrangler.production.jsonc` needs the same top-level block as `site/wrangler.example.jsonc`:

```jsonc
"observability": {
  "enabled": true,
  "head_sampling_rate": 0.25,
  "redact_query_string": true,
  "logs": { "enabled": true, "invocation_logs": false }
}
```

- `head_sampling_rate: 0.25` keeps one request in four. Raise it to 1 while chasing a problem, then lower it again.
- `invocation_logs: false` turns off Cloudflare's own per-request lines, which record the raw address. The Worker writes its own cleaned lines instead.
- Request counts and status totals for every request stay in the Workers dashboard (Metrics), whatever the sampling.

What the Worker logs (`site/src/server/request-log.ts`), as one JSON line each:

| Line | When | Fields |
| --- | --- | --- |
| `"event":"request"` | a 4xx, a 5xx, or a request slower than 2 seconds | method, route, status, ms, and an `id` for a 5xx |
| `"event":"worker_error"` | the router threw | method, route, status 500, ms, `id`, error type only |
| `"event":"client_error"` | a browser report arrived (below) | kind, route, and the cleaned error or policy fields |

Routes are cleaned before logging: no query string, and ids, share-link tokens and emails become `:id`. A thrown error never logs its message, because messages can carry stored text or SQL. A 5xx sends its id back in the `x-error-id` header, and a crash page shows it, so a visitor's report can be matched to the log line.

Find them in the Cloudflare dashboard: Workers & Pages, ai-building-blocks, Logs. Filter on `event` = `worker_error` or `client_error`.

## Browser error reports (`POST /api/client-error`)

`site/src/server/client-error.ts` takes two kinds of report and logs one line per report:

- From the app (`site/src/lib/chunk-recovery.ts`): `chunk` when a code file failed to load (usually a page opened before a deploy; the page reloads once by itself), and `boundary` when a page hit the "This page couldn't open" screen (`PageRecovery.tsx`).
- Content-Security-Policy-Report-Only violations (`site/public/_headers` sends them here with `report-uri`). Only the rule, the blocked origin (or `inline`) and the cleaned page route are kept.

It accepts reports from our own pages only, at most 8 KB each, and at most 10 a minute per visitor in each Worker instance. It never touches the shared API limit that saving work uses. For a firmer limit across instances, add a rate-limit binding named `CLIENT_ERROR_LIMITER` to the production config (for example 20 a minute, on a new `namespace_id`); the handler uses it when it is there.

## Uptime check

`node site/scripts/uptime-check.mjs` reads four addresses and exits 1 if any fails:

| Check | Address | Healthy when |
| --- | --- | --- |
| home | `/` | 200, HTML, says AI Blocks |
| item page | `/skills/website-brand-brain-builder` | 200, has a heading |
| api status | `/api/v1/status` | 200 and `model_calls` is `false` |
| mcp | `POST /mcp` `tools/list` | 200 and a tool list |

Options: `--site https://...` to check another host, `--item /prompts/some-slug` to check another item page. It prints one JSON line with each check's status and time.

Run it every 5 minutes from something that is already set up. No new sign-up is needed for any of these:

- **Windows Task Scheduler** on the owner's machine: a task every 5 minutes running `node C:\path\to\repo\site\scripts\uptime-check.mjs`, with "send an email" or a notification on a nonzero exit.
- **cron** on any always-on machine: `*/5 * * * * cd /path/to/repo && node site/scripts/uptime-check.mjs || <your alert command>`.
- **GitHub Actions** (already used for this repo): a scheduled workflow. GitHub emails the repo owner when a scheduled run fails. GitHub may delay or skip schedules, so treat it as a backstop, not a pager.

```yaml
name: Uptime
on:
  schedule: [{ cron: "*/10 * * * *" }]
  workflow_dispatch:
permissions:
  contents: read
jobs:
  uptime:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with: { persist-credentials: false, sparse-checkout: site/scripts }
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with: { node-version: "24" }
      - run: node site/scripts/uptime-check.mjs
```

This workflow is not added to the repo yet: adding it is the owner's call, because it sends a few requests to production every 10 minutes.

## Releases

`node tools/release.mjs --deploy` checks the live site after every deploy (content, sitemaps, API, MCP and the security headers). It tries the check three times, 15 seconds apart. If it still fails, it runs `wrangler rollback` to the version that was live before the deploy and stops. If the rollback itself fails, it prints the exact command to run by hand.
