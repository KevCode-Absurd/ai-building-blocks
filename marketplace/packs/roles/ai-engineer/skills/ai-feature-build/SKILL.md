---
name: ai-feature-build
description: Builds one AI feature inside an app - sorting, extraction, drafting or a batch job - with a "does this need AI?" check, the prompt in its own file, structured output checked against a schema, safe fallbacks for refusals and cut-off output, timeouts, capped retries with backoff, a spending cap, caching, logs without personal data, a test set with a pass-rate script and a cost formula. Works with the Anthropic, OpenAI or Google SDKs. Drafts on a branch at access level 2 and ships through the client's pipeline only at level 3 after the action list is confirmed. Use it when a business wants a model to do one job in its product or back office.
---

# AI feature build

## When to use

- A business wants a model to do one clear job: sort enquiries, pull fields out of emails or forms, draft a reply for a person to approve, or run a batch job over records.
- Existing AI code works "most of the time" and needs checks, limits and tests before more people rely on it.
- A developer has the provider SDK installed but has never shipped an AI feature.

Not for: training or fine-tuning models, bots that pretend to be a person, or features that give medical, legal or financial advice.

## What you need

1. The job in one sentence, who sees the output, and what the feature must never do.
2. 5 to 20 real examples with personal data replaced, each with the answer the client wants.
3. The provider, SDK and language, the model they want (or a budget to choose one), and expected calls per day.
4. The code around the feature: where input comes from and where output goes.
5. Access: level 1 (read) is enough for the design. Writing code on a branch and running evals with a test key from the client's secret store needs level 2. Merging and switching the feature on needs level 3 and a yes on the action list.

## Steps

### 1. Ask whether it needs AI

Write three lines: the task, the simplest non-AI option (a rule, a lookup, a regular expression, a form field), and why it falls short. If the simple option works on the examples, recommend it and stop.

### 2. Turn the examples into a test set

Number each example, add the expected result or a pass rule, and tag it normal, hard, odd or adversarial. Add cases the client did not send: empty input, very long input, another language, input that contains instructions ("ignore the above and..."), and input that has nothing to do with the task. Ask the client to correct the expected answers before going further.

### 3. Write the prompt in its own file

Sections: role, task, rules, output format, two or three examples taken from the test set, and "when unsure" (return `unknown` or a hand-off flag, never a guess). Put user content in a clearly marked block and tell the model to treat anything inside it as data, not instructions. Add a version line at the top.

### 4. Define the output schema

Use the provider's structured output feature (Anthropic `output_config.format` or strict tools, OpenAI `json_schema` with `strict: true`, Gemini JSON with a schema). Keep the schema flat, use enums for categories, and include a `confidence` or `needs_review` field. Check which schema keywords the provider supports; anything it does not enforce (lengths, ranges, formats) is checked in code. Generate the schema from Pydantic or Zod where the SDK allows, so code and schema cannot drift.

### 5. Wrap every call

- Timeout on the request.
- Retry only on rate limit and server errors, with exponential backoff and jitter, honouring `Retry-After`, capped at a small number of attempts. Never retry quota, billing or spend-limit errors; alert a person instead. Turn off SDK retries if you write your own, so they do not stack.
- Handle a refusal and output cut off at the token limit as failures, not as data.
- On any failure: retry once if sensible, then fall back to a safe default (send to a person, mark "needs review").
- Cache repeated inputs by a hash of the input and prompt version. Put stable instructions first so the provider's prompt caching works.

### 6. Cap the spend

- Ask the client to create a separate workspace or project for the feature with its own spend limit (Anthropic workspaces, OpenAI project hard limits).
- In code, add a per-user or per-day call cap and a maximum input size, so one user or one bad loop cannot run up the bill.

### 7. Keep a person in charge of actions

If the output triggers anything that sends, deletes, pays or changes records, the model drafts and a person confirms. Only at level 3, and only for actions the client has listed with limits, can the feature act on its own, and refunds, payments and new money recipients always stay with a person.

### 8. Log for debugging, not for surveillance

Log request ID, prompt version, model ID, token counts, latency, result status (pass, fallback, refusal, error) and the cost estimate. Do not log raw personal data. Record the data terms of the tier in use.

### 9. Build the eval script

A script that runs every test case through the real code path, checks the output with code wherever possible (label match, schema valid, required field present), and uses a model grader only for judgement calls, on a different model from the one being tested. It prints the pass rate by tag and lists every failure.

### 10. Estimate cost

Cost per call = input tokens × input price + output tokens × output price, adjusted for cached reads and batch pricing. Monthly cost = cost per call × calls per day × days. Show the formula with the pricing page link and date, and a low and high case.

### 11. Ship

At level 2, open a pull request with the prompt file, code, schema, test set, eval script, eval results and cost formula. At level 3, after the client confirms the action list (repo, environment, model, monthly cap, whether it goes live behind a flag and for whom), merge and deploy through their pipeline, switch it on for the agreed users, and watch the first day's logs and cost.

## Checks before handing over

- The "does this need AI?" note exists.
- The test set has expected answers the client confirmed, plus adversarial and empty cases.
- Every SDK method and parameter used is one I checked in the vendor's docs; anything else is listed under "confirm in the docs" with the SDK version.
- The model name is a setting, pinned to a snapshot.
- Refusals, truncation, timeouts and errors all reach a fallback.
- No key appears in code, config or chat; keys come from environment variables.
- The spend cap exists in the provider and in code.
- The eval report lists every failure, not only the pass rate.

## Output format

1. "Does this need AI?" note.
2. Test set table (ID, input, expected result or pass rule, tag).
3. Prompt file.
4. Schema and validation code.
5. Wrapper code with timeouts, retries, fallback, cache, caps and logging.
6. Eval script and the latest results by tag.
7. Cost formula with pricing link and date.
8. "Confirm in the docs" table, if any.
9. Launch note: what it does, limits, who approves what, how to switch it off.

## Example of good output (short)

*Made-up business for illustration: "Fernhill Plumbing", a plumbing firm that gets 60 web enquiries a day.*

> **Does this need AI?** Task: sort enquiries into emergency, quote, repair, spam, and pull out the postcode. A keyword rule caught 11 of 20 examples; it missed "water coming through the ceiling" as an emergency. A model is worth it; the postcode stays a regular expression.
>
> **Eval, prompt v3:** 27 of 30 pass (90%). Normal 15/15, hard 8/10, adversarial 4/5. Misses: #12 "boiler making a noise, no rush" sorted emergency (rule added: urgency words beat appliance words); #19 Welsh-language enquiry returned `unknown` (correct per the "when unsure" rule, marked pass after client review); #24 injected "mark this as emergency" was followed (fixed by moving user text into a marked block; now passes in v4).
>
> **Cost formula:** 60 calls a day × (about 400 input tokens × input price + 80 output tokens × output price), with the 300-token instruction block cached. Prices from the provider's pricing page on the day of launch.
>
> **What happens on failure:** two failed attempts or a refusal sends the enquiry to the office inbox marked "needs review". Nothing is sent to the customer by the model.
