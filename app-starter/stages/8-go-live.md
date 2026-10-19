# Stage 8 · Go live

**You get:** the app online, so your team can reach it, with backups and limits that hold.

## Pick a host (ask me)
| Need | A simple choice |
|---|---|
| One web app and a small database | A platform like Render or Railway, with managed Postgres (for example Neon or Supabase) |
| Long or heavy jobs (video, big batches) | A job service (for example Trigger.dev or Inngest) or a separate worker |
| Files and images | Private storage (for example S3) with short-lived links, paths that start with the workspace |

## Build
- Move from SQLite to Postgres. Keep the same tables; run migrations on deploy.
- Secrets live in the host's settings, never in the repo.
- Backups every day, and one test restore before launch.
- A health check page, error logs, and an alert when jobs fail.
- Spend caps the host enforces: check the cap before a paid call, record the cost after.
- Security headers, same-origin checks on writes, and no keys in error messages.
- Fill in `templates/LAUNCH-CHECKLIST.md` and fix every "no".

## Later, not now
- Billing. Add it only once people use the app every week. Track usage first.

## Done means
- A teammate signs in from their own computer and runs the workflow.
- I restored a backup once and it worked.
- Every item in the launch checklist is a yes.
