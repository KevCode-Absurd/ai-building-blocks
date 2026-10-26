# Site spending monitor

**Status: paused at the user's request on 23 October 2026.** The five-minute AI heartbeat must not resume without a new explicit request. The existing server-side $10/day AI cap, five attempts per account, CPU guard and firewall protections remain. Cloudflare Paid still has no all-in daily dollar cap.

The user authorized recurring alerts and automatic pauses on 23 October 2026. The active policy warns at an estimated **$10 per UTC day** and pauses production AI workflow generation and voice transcription at **$12**, ahead of the $15 daily target. It also attempts a precautionary pause when it cannot obtain a complete estimate. Pauses remain latched across days until the user explicitly asks to resume after review.

Run from this repository:

```text
node tools/monitor-site-spend.mjs
node tools/monitor-site-spend.mjs --enforce
```

The first command is read-only. The second records monitor state and may apply the authorized pause. Read its JSON output; `notify` identifies a new warning, pause, recovery or failure. Do not send routine healthy or unchanged-state messages. A nonzero exit is a monitoring failure and must be inspected, not treated as zero spending. `pauseConfirmed: false` means protection could not be verified and requires an urgent user alert.

## Estimate

The helper reads aggregate AI `composer_jobs.charge` totals for the production and staging COMPOSER databases, including pending and unknown-outcome reservations. It does not read prompts, workflow results or account identities. It combines those with account-wide Cloudflare Workers request and actual CPU totals, D1 row operations and storage peaks, R2 operations/retrieval and storage peaks, a daily share of the known $5 monthly Workers subscription, and a conservative diagnostic-logging allowance.

Included usage allowances are deliberately ignored. R2 operations use the highest published operation rate and reserve an extra billing unit when operations occur. Storage is rounded upward. The total includes the greater of a $1 buffer, 20% headroom, or 15 minutes of the most recently observed spending rate. A same-day high-water mark prevents released reservations or changing samples from resetting the estimate. These choices can pause service earlier than the final billed amount would suggest.

The window is 00:00â€“24:00 UTC, corresponding to 5:30 a.m.â€“5:30 a.m. India time. Estimates reset at the next UTC day; an existing pause does not. Metrics are sampled and delayed, and costs outside these known sources (such as direct developer API calls outside the ledgers, unrelated SaaS subscriptions, other Cloudflare product families or tax/adjustments beyond the buffer) are not a complete invoice. This is an estimated spending guard, not an account-level dollar cap.

## Pause and recovery

The only live mutation is setting the production Worker's `WORKFLOW_COMPOSER_ENABLED` plain-text binding to `false`. All other bindings are inherited, so secrets are not copied or printed. Settings are compared immediately before mutation; after mutation the helper verifies that every other setting was preserved and both `/api/compose` and `/api/transcribe` report `enabled:false`. Public browsing, downloads and browser assembly remain available. Requests already in flight may finish, and Cloudflare requests, storage, other apps and staging work can still accrue charges. The monitor does not delete work, suspend hosting subscriptions or automatically re-enable AI.

Private state and events are stored under `site/.wrangler/spend-monitor/`. The pause latch and warning-day fields suppress repeated alerts. The helper uses the existing Wrangler credential, refreshing it through the installed official Wrangler CLI when needed. It also supports an already-configured `CLOUDFLARE_API_TOKEN`; never put credentials in tracked files or prompts. Failed collection attempts trigger a precautionary pause where Cloudflare authorization remains available. If authorization/network access is unavailable, the helper reports the inability to confirm protection.

Only an explicit user request after review permits clearing the private `pauseLatched`/`pauseReason`/`pauseConfirmed` state and restoring the enable flag. Preserve the existing five-attempt account allowance, $10 AI daily cap, CPU guard, firewall rules, secrets and customer data. Do not disable the monitor or resume automatically at midnight.

## Schedule and availability

This is a five-minute local chat heartbeat, created with the desktop app's native automation tool. The computer must be powered on, online, and the app running. It is not an always-on Cloudflare server job; sleep, app shutdown, authentication failures or denied network approvals can prevent checks. Existing server-side AI caps remain active, but local monitoring cannot guarantee a $15 maximum bill.

Validation: seven policy tests, four isolated subprocess tests covering healthy/warning/pause/telemetry-failure behavior and alert deduplication, a real read-only combined metric query, and a real binding-preserving pause-payload probe against already-disabled staging. No production pause was triggered during setup because the current estimate was below the thresholds. The first enforcement check estimated $1.31, including buffers, with status healthy.

Sources checked 23 October 2026: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [Workers metrics reporting delay](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/), [desktop scheduled-task availability](https://learn.chatgpt.com/docs/automations?surface=app). Review pricing when Cloudflare's logging pricing changes on 1 December 2026 and whenever plans or billable product bindings change.
