# Colang compatibility and flow guide

Original supporting guide for `ai-app-guardrails-builder`, written 24 October 2026. Licensed under MIT with this package. This is an independently written explanation of the cited NVIDIA documentation, not a recovered upstream file. No examples in this guide were executed during preparation.

## Read this before the parent examples

The parent skill contains useful design sketches, but mixes older Colang statements, Python sketches and version claims. Its unnamed functions are not supplied implementations. A comment showing a blocked response is an expected result, not test evidence. Establish the installed library version and selected dialect before adapting a sketch.

NVIDIA's current guide distinguishes Colang 1.0 from the beta 2.0 runtime. The default remains 1.0; selecting `colang_version: "2.x"` is explicit. The guide also identifies limitations in built-in guardrail-library support under 2.0. Do not assume a built-in rail documented for one runtime works unchanged in the other. See the [Colang overview](https://docs.nvidia.com/nemo/guardrails/latest/configure-guardrails/colang) and [2.0 setup guide](https://docs.nvidia.com/nemo/guardrails/v0.24.1/configure-guardrails/colang/colang-2/getting-started).

## Establish a reproducible local configuration

Record the installed `nemoguardrails` version, Python version, execution engine, dialect, config directory, enabled flows, action implementations and model endpoints. Choose documentation matching that installed release. Obtain authorization before installing packages, downloading models or contacting services. This guide performs none of those actions.

Use synthetic text while developing. Confirm which components can access the network: a local Python process can still call remote models, embedding services, moderation APIs or telemetry collectors. Keep credentials in the deployment's secret mechanism. A file path, model name or config fragment does not establish access.

Keep separate files for configuration, `.co` flows and Python actions. Load a complete configuration directory rather than pasting YAML into an argument intended for Colang. Check the installed `RailsConfig` API before using the parent's `from_content` calls; see [Python API overview](https://docs.nvidia.com/nemo/guardrails/run-guardrailed-inference/using-python-apis/overview).

## Choose one dialect per configuration

| Concern | Colang 1.0 | Colang 2.0 |
| --- | --- | --- |
| Flow definition | Uses `define flow` | Uses `flow` |
| Calling actions | Uses `execute` | Uses asynchronous `await` or nonblocking `start` |
| User/bot intents | Has dedicated `define user` / `define bot` forms | Expresses these through flows and events |
| Activation | Older flow activation model | Starts at `main`; activate additional persistent behavior explicitly |
| Variables | Different default scope rules | Variables default to local scope; declare shared scope deliberately |

These are migration distinctions, not an automatic rewrite algorithm. Preserve branching, state ownership, cancellation and return values when migrating. Follow NVIDIA's [documented language changes](https://nvidia-nemo.github.io/Guardrails/develop/configure-rails/colang/colang-2/whats-changed.html), then use release-matched migration instructions. The parent's generic `parallel:` block is not a verified replacement for the documented rail concurrency settings in [performance.md](performance.md).

## Minimal Colang 2.0 flow exercise

In a new, reviewed fixture directory, explicitly select the dialect in `config.yml`:

```yaml
colang_version: "2.x"
```

Place this small deterministic flow in `main.co`:

```colang
import core

flow main
  user said "hello"
  bot say "Hello."
```

This follows the structure of NVIDIA's [2.0 Hello World exercise](https://docs.nvidia.com/nemo/guardrails/v0.24.1/configure-guardrails/colang/colang-2/getting-started/hello-world), with original example text. It is a syntax/interaction exercise, not a safety policy. The flow itself needs no generated reply. Confirm any additional initialization requirements and prevent unintended outbound requests before calling the runtime.

When the package is already installed and local execution is authorized, the documented CLI pattern is `nemoguardrails chat --config=./config`. Run each exercise in a fresh session: the matching input should produce the literal response; an unmatched input should not invent a fallback. Record actual results or `NOT_RUN`. Do not label this smoke test jailbreak resistance.

## Actions, state and interactive gates

For a 2.0 input-check flow, NVIDIA demonstrates parameters beginning with `$`, capturing an awaited flow result, branching on the result and aborting disallowed input. Its demonstration asks an LLM for a Boolean; that does not create a deterministic or comprehensive classifier. See [2.0 input rails](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/colang/colang-2/getting-started/input-rails).

Specify each custom action's accepted inputs, data access, outputs, exceptions and permissions. Preserve an explicit distinction between “allowed,” “blocked” and “check could not run.” Register real implementations using the installed API; see [integrations.md](integrations.md). Do not turn `extract_facts`, `toxicity_detector` or other parent-skill sketch names into assumed built-ins.

## Verification record

Before handoff, record the exact source/config revision and check:

- The chosen release parses every flow and finds each referenced action.
- Allowed, blocked, ambiguous and malformed fixtures follow the intended branches.
- A missing model, missing action, timeout and malformed classifier result follow the declared failure policy.
- Multi-turn state and pending human decisions survive the intended interaction path.
- Required input/output rails actually run; a literal bot reply alone does not prove coverage.

Return changed files, actual test evidence, unresolved compatibility questions and the next permitted step. Parsing success alone does not establish security or production readiness.
