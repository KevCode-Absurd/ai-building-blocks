---
name: qdrant-monitoring
description: "Guides Qdrant monitoring and observability setup. Use when someone asks 'how to monitor Qdrant', 'what metrics to track', 'is Qdrant healthy', 'optimizer stuck', 'why is memory growing', 'requests are slow', or needs to set up Prometheus, Grafana, or health checks. Also use when debugging production issues that require metric analysis."
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Qdrant Monitoring

Qdrant monitoring allows tracking performance and health of your deployment, and identifying issues before they become outages. First determine whether you need to set up monitoring or diagnose an active issue.

- Understand available metrics [Monitoring docs](https://search.qdrant.tech/md/documentation/operations/monitoring/)

## What you need

Ask once for anything not given:

- Where Qdrant runs: self-hosted, Kubernetes, Qdrant Cloud or Hybrid Cloud.
- The Qdrant version. Some checks need v1.17 or later.
- The mode: set up monitoring, or diagnose a problem happening now.
- For a problem: the symptom, when it started, and any metric values you have (optional).
- What is already in place, such as Prometheus, Grafana or log tools (optional).

If you cannot open the linked docs, say so and work from this file only.

## What you hand back

For setup, in this order: Metrics to collect, Health checks, Alerts (each with why it matters), Log plan.
For a problem: Likely cause, Number to check (the metric or endpoint that proves it), Fix to try, What not to touch.
Always end with Next steps: the first three actions, in order.

## If something is missing

Write `MISSING: <what>` and ask once. Never invent metric values, versions or thresholds. If the person gives no numbers, say which number to read first and stop there.


## Monitoring Setup

Prometheus scraping, health probes, Hybrid Cloud specifics, alerting, and log centralization. [Monitoring Setup](setup/SKILL.md)


## Debugging with Metrics

Optimizer stuck, memory growth, slow requests. Using metrics to diagnose active production issues. [Debugging with Metrics](debugging/SKILL.md)
