# Heartbeat schedule worksheet

For each role record its purpose, base cadence, active hours and timezone, accepted wakeup types, scheduled responsibilities, maximum run time, daily run limit and cost cap.

Monitoring, creative review, writing, reporting, strategy, onboarding and manual debug roles need different schedules. Use wakeups for event urgency rather than polling every role as often as possible. Reduce off-hours work when the task permits. Stagger starts and keep interactive work ahead of background polling.

Estimate total runs as scheduled runs plus expected wakeups and retry overhead. Estimate cost from current measured token/provider and storage usage, not the historical fixed per-heartbeat prices in examples. Confirm caps and hard-stop behavior before enabling a schedule. Recheck the estimate against observed usage after a bounded pilot.
