# Connect real moderation and validation components

Original MIT supporting guide for `ai-app-guardrails-builder`, written 24 October 2026 from the linked primary documentation. It adds missing integration instructions while preserving the parent source. No provider calls, installs, model downloads or runtime tests were performed.

## Integration gate

First read [colang-guide.md](colang-guide.md). Record the installed library release, dialect, engine, main model and every guardrail model. Approve data destinations and credential handling before configuring a remote service. Start with fictional inputs. For local-only work, require approved local endpoints and local dependencies; never silently substitute a hosted endpoint when a model is unavailable.

Create an integration register: component/version, purpose, input fields, output contract, endpoint, credentials by environment-variable name, timeout, failure behavior and owner. Select one integration at a time, then test its composition with the others. Native support varies by engine and rail surface; check NVIDIA's [per-rail support matrix](https://docs.nvidia.com/nemo/guardrails/reference/rail-engine-support).

## Llama Guard

NVIDIA documents configuring a model with type `llama_guard`, activating the `llama guard check input` and `llama guard check output` flows, and supplying their task-specific prompts. The prompts must match the chosen model's policy categories and response format. Do not assume the parent's Python `LlamaGuard(model_path=...)` import exists in the installed release. Follow the [official integration procedure](https://docs.nvidia.com/nemo/guardrails/v0.24.1/configure-guardrails/guardrail-catalog/third-party/llama-guard).

For a permitted locally served OpenAI-compatible model, current NVIDIA documentation uses `engine: openai` as a protocol adapter with `parameters.base_url`. This engine name does not require choosing a hosted provider. Put actual credentials in a named environment variable, not source text. See [model configuration](https://docs.nvidia.com/nemo/guardrails/latest/configure-guardrails/yaml-schema/model-configuration).

This is a configuration fragment to merge into a complete, release-matched setup. Replace the model identifier and confirm the local service and token before use:

```yaml
models:
  - type: llama_guard
    engine: openai
    model: REPLACE_WITH_APPROVED_LLAMA_GUARD_MODEL
    api_key_env_var: LOCAL_GUARD_TOKEN
    parameters:
      base_url: http://127.0.0.1:8000/v1
rails:
  input:
    flows:
      - llama guard check input
  output:
    flows:
      - llama guard check output
```

The fragment does not supply a main model, prompt templates, model weights or a running endpoint. Resolve those prerequisites before reporting it runnable. Test both directions with allowed and policy-violating synthetic fixtures. Also test unsupported output categories, malformed responses and an unavailable endpoint; record actual decisions and errors.

## Presidio

Decide whether each surface should block sensitive text or transform it before downstream use. NVIDIA's integration requires the Presidio analyzer/anonymizer and the matching spaCy language model; approved local provisioning must happen before execution. The selected recognizers and language determine coverage. See [Presidio setup and behavior](https://docs.nvidia.com/nemo/guardrails/latest/configure-guardrails/guardrail-catalog/third-party/presidio).

For example, merge an input masking rail into the complete configuration:

```yaml
rails:
  config:
    sensitive_data_detection:
      input:
        entities:
          - EMAIL_ADDRESS
  input:
    flows:
      - mask sensitive data on input
```

Use fictional addresses to verify masking before model invocation. Add separate output/retrieval configuration only when required. Test an entity that should match, benign similar text, an unsupported language and an entity outside the selected list. Confirm what downstream rails actually receive. Detection is not proof of anonymization or legal compliance. Never increase a threshold merely to make a failing fixture pass; assess false positives and false negatives on labeled cases.

## ActiveFence

This is a managed-service integration, so text leaves the local application. Obtain approval for that transfer, its service terms and failure handling first. NVIDIA documents `ACTIVEFENCE_API_KEY` and the built-in flows `activefence moderation on input` and `activefence moderation on output`. Detailed category controls are available through the documented custom-flow route. Follow [ActiveFence integration](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/guardrail-catalog/third-party/active-fence); do not invent a universal moderation threshold.

Test with an approved sandbox or deterministic test substitute, including missing credentials, rate limits, timeouts and malformed service responses. A service outage is an operational error, not evidence that content was safe. Keep raw content out of diagnostic logs unless explicitly permitted.

## Custom checks and factual verification

Implement actual Python functions in `actions.py` or an actions package. NVIDIA supports decorator-based actions and explicit registration through `LLMRails.register_action`; see [custom actions](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/actions) and [registration methods](https://docs.nvidia.com/nemo/guardrails/latest/configure-guardrails/actions/registering-actions). Match callable names and context fields to the selected release. Test action logic independently before wiring its flow.

For factual checks, define what counts as an accepted source, how claims link to retrieved evidence and how conflicts or missing evidence block an assertion. The parent's `verify_facts` and retrieval phrases do not provide those implementations. LLM self-check prompts require application evaluation and customization; see [LLM self-check guidance](https://docs.nvidia.com/nemo/guardrails/configure-guardrails/guardrail-catalog/self-check).

Release changes matter: NVIDIA's [0.24 release notes](https://docs.nvidia.com/nemo/guardrails/about-nemo-guardrails-library/release-notes) describe removal of `output_mapping` and explicit `RailOutcome` decisions. Use the matching action/flow contract instead of carrying old Boolean assumptions into a newer runtime.

## Integration acceptance record

Return the configuration, real action implementations, endpoint/data-flow register and labeled fixture results. Demonstrate which rail changed or blocked which message. Where supported by the installed version, `check_async()` validates input/output messages without generating a main-model reply, but guardrail actions can still make remote calls. Assert nonempty content in the requested direction and preserve `PASSED`, `MODIFIED`, `BLOCKED` and operational failures distinctly. Tool-call/result rails need their own execution path; these checks do not cover them. See [message-check API](https://docs.nvidia.com/nemo/guardrails/latest/run-guardrailed-inference/using-python-apis/check-messages).

Missing dependencies, unavailable credentials, unimplemented actions or unapproved data transfers remain `BLOCKED` or `NOT_RUN`; do not replace them with a claim that the integration works.
