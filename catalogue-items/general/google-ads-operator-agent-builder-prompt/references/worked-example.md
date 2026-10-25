# Fictional worked example

This is an offline practice case, not a live service result.

## Input

A new repository needs a recommendation-only Google Ads agent. MCC, scheduler and Slack connectors do not exist yet.

## Result

Specify authenticated client context, fetch adapters, deterministic diagnostics, persisted findings and a review/report surface. Make customer scoping mandatory at every data boundary and omit bid/pause mutation components. Treat connector and queue implementations as prerequisites. Plan fake-client, missing-data, permission and duplicate-job cases. No account query, schedule or report delivery ran.

## Check

- {"name":"Architecture is self-contained","passed":true}
- {"name":"missing connectors are explicit","passed":true}
- {"name":"recommendations cannot mutate campaigns","passed":true}
- {"name":"no live runtime is claimed","passed":true}
