# Queue failures and recovery

- Queued forever: compare the durable job table with Redis. Recover missing queue entries using stable IDs and side-effect guards.
- Worker out of memory: inspect buffers and concurrency. Size memory and concurrency from measured workloads.
- Redis disconnects: inspect TLS, retry options and provider timeouts; persist progress before retrying expensive work.
- Duplicate Slack replies: acknowledge transport events promptly and deduplicate event IDs before dispatch.
- Long job reruns: check lock renewal and stalled-job configuration against actual workload; progress logging alone is not always a queue lease renewal.
- Dead-letter overflow: group root causes, fix the cause, then authorize and bound replay. Never blindly replay a job that may already have spent money.
- Budget denied on startup: check explicit caps and policy state. Keep a missing cap deny-by-default; increasing the cap requires owner approval.
- Work completed but no reply: distinguish missing respond call, blocked output, and an invalid bot token. Do not bypass output filtering to force delivery.
- Heartbeat backlog: stagger schedules and prioritize user work before increasing concurrency.
- Redis full: set bounded completion/failure retention and keep durable history in the database. Choose retention from operational requirements.

Check queue counts, failed jobs, durable statuses, worker logs and activity events in that order. Every recovery must preserve scope and idempotency.
