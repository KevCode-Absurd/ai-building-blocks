# Measure guardrail latency without losing checks

Original MIT supporting guide for `ai-app-guardrails-builder`, written 24 October 2026. This is a measurement and optimization procedure, not benchmark evidence. No runtime, model, hardware or API performance tests were run while writing it.

## Establish the deployment being measured

The parent skill's hardware and latency figures are illustrative, unverified claims for this package. Do not use them as capacity commitments. Set an application-specific latency budget and acceptance criteria with the owner. Record library/config/action revisions, execution engine, model versions, endpoints, hardware, request sizes, concurrency and enabled rails.

Use a versioned, approved fixture set with allowed, blocked, transformed and operational-error cases. Keep real sensitive data out of load tests unless the environment and handling are explicitly approved. Quality and speed require separate evidence: a quick response can result from a skipped check. NVIDIA distinguishes rail evaluation from application-specific operational measurement; see [rail evaluation tools](https://docs.nvidia.com/nemo/guardrails/evaluation/evaluate-guardrails).

## Build a baseline

1. Define a fixed request mix and randomization seed where available. Keep policy labels separate from candidate outputs.
2. Measure initialization separately from warmed requests. Keep both: a warm-only result hides startup behavior.
3. Record wall-clock duration per request, response disposition, rail/action calls, model calls, tokens when available, queue delay, errors and timeouts. Report sample size and the measurement window.
4. Summarize p50/p95/p99 with their actual observations. Compare equivalent request lengths and concurrency. Include blocked/error cases in the accounting, with separate slices so fast failures do not conceal slow successful responses.
5. For streaming, measure first delivered content and full completion separately; record whether content was checked before disclosure.
6. In an isolated fixture environment, compare the same application workload with the intended rails and with an explicitly identified baseline. Never disable safeguards on real traffic to create a favorable measurement.

Reuse the initialized rails object where the application's lifecycle permits. Use asynchronous APIs inside an asynchronous application rather than repeatedly constructing runtimes or invoking synchronous wrappers in an active event loop. NVIDIA documents these lifecycle/API distinctions in its [Python API overview](https://docs.nvidia.com/nemo/guardrails/run-guardrailed-inference/using-python-apis/overview).

## Parallel rails

Current configuration exposes `rails.input.parallel` and `rails.output.parallel`. Enable concurrency only for independent checks. A masking step whose output feeds another check has an ordering dependency; verify the selected engine's behavior instead of flattening that pipeline. The parent's generic Colang `parallel:` sketch is not a validated configuration recipe. Use the [configuration reference](https://docs.nvidia.com/nemo/guardrails/latest/configure-guardrails/configuration-reference) and [rail-engine matrix](https://docs.nvidia.com/nemo/guardrails/reference/rail-engine-support).

Test one change at a time. Confirm each required check ran, no private content reached an unapproved destination, a block still prevents disallowed delivery and errors follow the declared policy. Reduced elapsed time does not imply reduced total model calls or service cost.

## Caching

NVIDIA documents a per-model in-memory cache for NemoGuard models, with normalized-prompt matching and LFU eviction. It is process-local and disappears on restart. A cache for one documented model family does not imply a general cache for all custom actions or facts. See [memory model cache](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/caching/model-memory-cache).

Benchmark cache-disabled, cold-cache and warm-cache cases separately. Include realistic repetition and a mostly unique-input slice. Record hit/miss counts, memory use and the exact model/policy/config revision. Clear or partition caches after relevant changes; test that stale decisions cannot cross tenant, user, permission or policy boundaries. Treat cache contents as potentially sensitive stored prompts/responses and define their retention and inspection rules.

NIM KV reuse is a separate inference-server optimization for repeated prefixes. It requires compatible serving configuration; it is not an application response cache. Keep it separate in experiments and record the serving setup. See [NemoGuard NIM KV reuse](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/caching/kv-cache-reuse).

## Batching and bounded load

Do not concatenate unrelated users into one moderation prompt to claim batching. That can change policy interpretation and leak data between requests. Use independent requests with explicit request IDs, bounded concurrency, deadlines and backpressure. Batch at the model-serving layer only where its own documented API supports the chosen model and preserves per-request results. This guide supplies no universal NeMo batch-generation API.

Increase load in controlled steps. Measure queue growth, service throttling, cancellations and resource saturation. Stop when the predeclared failure/latency limits are crossed. Preserve retries in the accounting, and avoid retrying a state-changing custom action until its actual outcome is reconciled. These are application test-design requirements, not claimed library defaults.

## Streaming and engine tradeoffs

The official runtime FAQ explains that buffered output checks trade response delay against the context available to a rail. When policy requires checking before disclosure, `stream_first: false` is the relevant control; a stream-first configuration can expose text before a later block. Changing engines or introducing speculative generation also changes the enforcement path. Validate compatibility and disclosure behavior rather than treating these as free speed switches. See [runtime security FAQ](https://docs.nvidia.com/nemo/guardrails/resources/runtime-security-faq).

## Verification and release artifact

Re-run the labeled safety/quality cases after every optimization. Include benign near-matches, adversarial variations, provider errors, missing resources and concurrent multi-turn sessions. Compare false positives and false negatives separately from timing. A cache hit or parser success is not a policy-quality pass.

Return a reproducible benchmark record: workload revision, exact configuration, environment, warmup, sample count, latency distributions, throughput, token/call counts, error slices, resource observations and quality changes. Mark unavailable metrics and unexecuted cases `NOT_RUN`. Promote only under the application's accepted gates; keep a tested rollback configuration. Nothing in this guide establishes a T4 requirement, a universal VRAM size, a throughput guarantee or production readiness.
