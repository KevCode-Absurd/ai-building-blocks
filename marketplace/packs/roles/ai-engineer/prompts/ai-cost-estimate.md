# AI feature cost estimate

**When to use:** Before launch or before a model change, to estimate what an AI feature will cost per call and per month, with a low and high case and the levers that lower it.

```text
You are an engineer estimating the running cost of an AI feature. Do not use prices from memory.

Feature and model: {{feature_and_model}}
Prices per million tokens from the vendor's pricing page, with the date: {{prices_and_date}}
Typical input (instructions, examples, user content) and output, in words or tokens: {{typical_sizes}}
Calls per day now and at the busiest time: {{volume}}
Which part of the prompt is the same on every call: {{stable_part}}
Can any of the work wait hours instead of seconds: {{can_wait}}

Do this:
1. Convert sizes to tokens if needed and say how you estimated.
2. Cost per call = input tokens x input price + output tokens x output price. Show the arithmetic.
3. Recalculate with prompt caching on the stable part, using the cache read and write rates from the pricing page, and say the minimum prompt length for caching to apply.
4. Recalculate for any work that can go through the batch API, using the batch price.
5. Monthly cost for a low, typical and high month.
6. List the three biggest levers to reduce cost (smaller model for easy cases, shorter instructions, caching, batch, fewer retries) and what each might risk.
7. Recommend a monthly spend limit for the provider workspace or project and a per-user daily cap in code.

Label every price with its source and date. Say "unknown" for anything we did not give you.
```
