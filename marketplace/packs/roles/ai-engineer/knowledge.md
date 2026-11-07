# AI engineer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. Model names, prices and limits in this file change every few weeks, so treat them as a snapshot and check the vendor page before you rely on one. I write the code, prompts, schemas, test sets and cost limits behind AI features. With your access I also open pull requests, run evaluations and ship through your own pipeline, at the level you grant (see `access.md`).

## 1. What this role is for

**Who hires me.** Small and mid-sized businesses that want one AI feature to work well inside their own app or back office: sorting enquiries, pulling fields out of emails and forms, drafting replies for a person to approve, answering staff questions from the company's own documents, or running a batch job over hundreds of records. The person asking is often a founder, a developer who has never shipped an AI feature, or a product owner whose chatbot keeps making things up.

**What good work looks like.**
- A plain check first: could a rule, a lookup or a regular expression do this without a model?
- A test set of real examples with expected results, written before the prompt.
- The prompt in its own file, the output checked against a schema, and a safe fallback when the check fails.
- Answers that come from the client's documents, cite where they came from, and say "I don't know" when the documents are silent.
- A spending cap, timeouts, retry limits and logs without personal data.
- Any action that sends, deletes, pays or changes records waits for a person, unless the client has set clear limits for it.

**How the work is judged.**
- Pass rate on the client's own test set, and how it holds up on fresh real inputs.
- Cost per task and per month against the budget the client set.
- How often the feature says "I don't know" or hands off when it should, and how often it guesses when it should not.
- Incidents: leaked data, wrong actions, runaway bills, a model retired without warning.
- Whether staff trust the output enough to use it.

## 2. The canon

**Anthropic, "Building effective agents" (19 December 2024).** Separates workflows (the model follows code paths you define) from agents (the model decides its own steps and tool use). Start with the simplest thing that works, often one well-prompted call with retrieval and examples, and add steps only when they measurably help. It names five workflow patterns: prompt chaining, routing, parallelisation, orchestrator-workers and evaluator-optimiser. It warns that frameworks can hide the prompts you need to debug, and that tool descriptions deserve as much care as a user interface [7].

**Hamel Husain, "Your AI Product Needs Evals" (29 March 2024).** Argues that AI products stall when teams cannot measure quality quickly. Three levels: cheap assertion tests run on every change, human and model review of logged traces, and A/B tests once real users arrive. Look at the data constantly. His case study is Rechat, a real estate software company, whose assistant plateaued until the team built hundreds of tests and a labelling tool [28].

**Simon Willison, "The lethal trifecta" (16 June 2025).** An AI system that has access to private data, reads untrusted content and can send data out can be tricked into leaking that data by instructions hidden in the content. Willison says the only reliable fix is to avoid combining all three, and treats guardrail products that catch "most" attacks with caution [29].

**OWASP Top 10 for LLM Applications 2025.** The shared list of risks: LLM01 prompt injection, LLM02 sensitive information disclosure, LLM03 supply chain, LLM04 data and model poisoning, LLM05 improper output handling, LLM06 excessive agency, LLM07 system prompt leakage, LLM08 vector and embedding weaknesses, LLM09 misinformation and LLM10 unbounded consumption [21]. OWASP states that it is unclear whether fool-proof prevention of prompt injection exists [22].

**The vendors' own guides.** Anthropic's hallucination guide: give the model permission to say it does not know, ground answers in direct quotes, make it cite a quote for each claim and retract claims it cannot support [3]. Anthropic's eval guide: make tests task-specific, automate grading, prefer many automatically graded cases over a few hand-graded ones, and use a different model to grade than the one being tested [6].

**Anthropic, "Contextual Retrieval" (19 September 2024).** Adds a short, model-written context line to each document chunk before indexing. On Anthropic's tests this cut failed retrievals by 49%, and by 67% with reranking. The same post says a knowledge base under about 200,000 tokens can go straight into the prompt, with caching, instead of building retrieval [8].

**The Model Context Protocol (MCP).** The open protocol that connects AI apps to tools and data. Its specification sets user consent, data privacy and tool safety as core principles [19], and its security best practices cover token passthrough, confused deputy attacks, server-side request forgery and scope minimisation [20].

**Reading list (credited, no claims drawn from them here).** Chip Huyen, *AI Engineering* (O'Reilly, 2025); NIST's Generative AI Profile, AI 600-1 [27].

## 3. How the work is done now

### Choosing and pinning a model (as of 6 November 2026)

- **Anthropic.** Current models are Claude Fable 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5, all with a 1M-token context window and 128K output tokens. Anthropic suggests starting with Opus 5.5 for most work and Haiku 5.5 for high-volume classification, extraction and routing. Every model ID is a pinned snapshot, including the dateless IDs used since the 4.6 generation. Retirement for current models is not sooner than September or October 2027 [1].
- **OpenAI.** The models page lists `gpt-6-astra` (frontier), `gpt-6.1-sol` (balanced), `gpt-6.1-terra` (fast) and `gpt-6-luna` (high volume), each with a 1.05M-token context window [9]. OpenAI gives at least 6 months' notice before retiring generally available models, at least 3 months for specialised variants, and much less for previews, such as 2 weeks [15].
- **Google.** The Gemini models page lists stable, preview, "latest" and experimental versions. Preview models can be retired with at least 2 weeks' notice, and a "latest" alias moves to a new model with 2 weeks' email notice. Gemini 2.5 Flash and 2.5 Pro are deprecated, and from 1 December 2026 their requests are routed automatically to newer models [16].
- **Practice.** Keep the model name in a setting, not in code. Pin a snapshot in production. Re-run the test set before any model change, including an automatic one.

### Structured output

- All three vendors can force output to match a JSON Schema: Anthropic through `output_config.format` and strict tool use [2], OpenAI through `json_schema` with `strict: true` [10], and Google through a JSON response format with a schema [18].
- The guarantee is about shape, not truth. Google says outright that the JSON is valid but the values may be wrong [18].
- Each vendor supports only part of JSON Schema. Anthropic rejects numeric ranges, string length limits and recursive schemas with an error [2]; Google drops some keywords such as `minLength` silently [18]. Check those rules in your own code.
- Two cases still break the shape: a refusal, which may not follow the schema, and output cut off at the token limit [2][10]. Handle both.

### Grounded answers and retrieval

- Tell the model it may say "I don't know", restrict it to the supplied documents, and ask for a quote or section reference for each claim [3].
- Small knowledge bases (under about 200,000 tokens) can go into the prompt with caching. Larger ones need retrieval: split documents into chunks, index them with embeddings and keyword search, retrieve the best matches, and pass only those to the model [8].
- Test retrieval separately from answering: did the right chunk come back at all?

### Tools, agents and MCP

- Prefer a fixed workflow to an open-ended agent when the steps are known. Agents need stopping conditions such as a cap on steps [7].
- Give the model narrow tools, not general ones, with the least permission, acting under the user's own identity where possible, and require a person to approve high-impact actions [23].
- The MCP specification's current version is dated 2026-07-28. It requires explicit user consent before a host invokes any tool, and says tool descriptions from servers you do not trust are themselves untrusted [19]. This version is stateless, so a server that needs state issues a handle and must check that handle belongs to the caller on every request [20].
- MCP servers must not accept tokens that were not issued to them ("token passthrough") and should ask for the smallest scopes first [20].

### Prompt injection and data leaks

- Treat every document, email, web page and tool result as untrusted input. Mark it clearly in the prompt, and tell the model to ignore instructions inside it, knowing this only lowers the risk [22].
- The real defence is design: least privilege, a person approving risky actions, and never letting one agent hold private data, untrusted input and a way to send data out at the same time [23][29].
- Check output before it reaches a browser, a database or a shell, as you would any user input (OWASP LLM05) [21].

### Cost, rate limits and spending caps

- Cost per call = input tokens × input price + output tokens × output price, with cached reads and batch work priced lower. Compute it from the vendor's pricing page on the day, not from memory.
- **Caching.** Put stable content first and changing content last. Anthropic cache reads cost 10% of the base input price (5% on Opus 5.5 and Sonnet 5.5), writes cost 1.25 times (5 minutes) or 2 times (1 hour), and the minimum cacheable prompt on current models is 512 tokens [4]. OpenAI caching is automatic; on GPT-5.6 and later the minimum is 1,024 tokens and reads cost 0.1 times the input rate [13].
- **Batch.** Anthropic and OpenAI price batch work at half the normal rate; OpenAI batches finish within 24 hours [1][11].
- **Caps.** Anthropic sets a monthly spend cap per usage tier and lets you set lower limits per workspace; hitting the tier cap returns a 429 error with no retry-after header until the next month [5]. OpenAI offers spend alerts and hard spend limits per organisation or project; a hard limit returns 429 [14].
- **Retries.** Use exponential backoff with jitter, respect `Retry-After`, cap attempts, and never retry quota or billing errors. Failed requests still count against OpenAI's rate limits [14].
- Unbounded use is an OWASP risk of its own ("denial of wallet"): limit input size, rate and quota per user, and set timeouts [24].

### Data handling (as of 6 November 2026)

- **OpenAI.** API data is not used for training by default (since 1 March 2023). Abuse-monitoring logs are kept up to 30 days. The Responses API stores responses for 30 days unless `store` is false. Zero Data Retention needs OpenAI's approval. Data residency is offered in regions including Europe and the UK [12].
- **Google.** On unpaid Gemini API use, Google may use prompts and responses to improve its products and human reviewers may read them; the terms say not to submit sensitive or personal information. Apps offered to users in the EEA, Switzerland or the UK may use only paid services [17].
- **Practice.** Log IDs, timings, token counts and pass or fail, not raw personal data. Send the model only the fields it needs.

### Evaluation

- Build the test set from real, anonymised examples, including hard and odd ones. Grade with code wherever the answer is checkable (exact label, valid schema, quote present) and with a model grader only for judgement calls, using a different model from the one under test [6].
- Read real traces every week at first, then sample [28].
- OpenAI is closing its hosted Evals platform, reusable prompts and Agent Builder on 30 November 2026, and suggests Promptfoo for evals and keeping prompts in application code [15]. Keep evals in the client's repository, not in one vendor's console.

### Rules by region (not legal advice)

- **EU.** The AI Act entered into force on 1 August 2024 and generally applies from 2 August 2026. Its transparency rules, including telling people they are talking to an AI and labelling AI-generated content, apply from August 2026. The AI Omnibus, in force since 27 July 2026, moved high-risk rules to 2 December 2027 (Annex III uses) and 2 August 2028 (Annex I products) [25]. Whether a feature is high-risk is a question for the client's legal adviser.
- **UK.** No single AI law as of the government's February 2024 response. Five principles (safety, transparency, fairness, accountability, contestability) are applied by existing regulators such as the Information Commission, CMA and FCA [26]. Google's paid-only rule for apps serving users there also applies [17]. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US.** No single federal AI law covers these features. NIST's AI Risk Management Framework and its Generative AI Profile (26 July 2024) are the common voluntary reference [27].

### A public case

Klarna said on 27 February 2024 that its OpenAI-powered assistant handled 2.3 million conversations, two-thirds of its customer service chats, in its first month, with resolution times under 2 minutes against 11 before and 25% fewer repeat enquiries [30]. These are the company's own launch figures; treat them as a claim, not a benchmark for your client.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 50% | Batch discount at Anthropic and OpenAI | [1][11]; as of 6 Nov 2026 |
| 0.1x / 0.05x | Anthropic cache read price vs base input (0.05x on Opus 5.5, Sonnet 5.5) | [4]; writes cost 1.25x or 2x |
| 512 / 1,024 tokens | Minimum cacheable prompt: current Claude models / OpenAI GPT-5.6 and later | [4][13] |
| 1M / 1.05M tokens | Context window: current Claude models / OpenAI flagship models | [1][9]; long prompts cost more and can bury facts |
| $500, $1,000, $200,000 | Anthropic monthly spend caps for Start, Build, Scale tiers | [5]; you can set lower limits |
| Up to 30 days | OpenAI abuse-monitoring log retention | [12] |
| 6 months / 3 months / about 2 weeks | OpenAI retirement notice: GA models / specialised variants / previews | [15] |
| 2 weeks | Gemini preview retirement notice and "latest" alias change notice | [16] |
| 49% / 67% | Fewer failed retrievals with contextual retrieval / plus reranking | [8]; Anthropic's own tests |
| About 200,000 tokens | Knowledge base size below which Anthropic suggests skipping retrieval | [8] |
| 20 / 24 / 16 | Anthropic strict schema limits per request: strict tools, optional parameters, union-type parameters | [2] |
| 2.3M conversations, two-thirds of chats | Klarna assistant, first month | [30]; company press release, 27 Feb 2024 |

**Prices on 6 November 2026 (per million tokens, input / output).** Claude Haiku 5.5 from $0.10 / $0.50, Sonnet 5.5 $2 / $10, Opus 5.5 $4 / $20 [1]. OpenAI `gpt-6-luna` $0.10 / $0.50, `gpt-6.1-sol` $2 / $10, `gpt-6-astra` $10 / $50 [9]. Re-check before every estimate.

**Numbers I do not quote.** "Hallucination rates" for a model in general, accuracy claims from leaderboards applied to a client's task, and "AI saves X hours" figures without a named study. The only accuracy number that matters is the pass rate on the client's own test set.

## 5. Decision rules

- If a rule, lookup or regular expression can do the job reliably, use it and skip the model, because it is cheaper, faster and testable.
- If there is no test set, build one before writing or changing a prompt, because otherwise you cannot tell whether a change helped [6][28].
- If the output feeds code, demand structured output and still validate values in code, because schemas guarantee shape, not truth [18].
- If the answer must come from the client's documents, restrict the model to them and require a quote or reference per claim, with an explicit "not in the documents" answer [3].
- If the knowledge base is small enough to fit comfortably in the prompt, try that with caching before building retrieval [8].
- If the steps are known in advance, build a fixed workflow, not an agent [7].
- If a tool can send, delete, pay or change records, require a person to approve each call unless the client has set written limits for it [23].
- If one feature would combine private data, untrusted content and a way to send data out, split it or remove one of the three [29].
- If the same long instructions or documents repeat across calls, cache them and put changing content at the end [4][13].
- If results are not needed within seconds, use a batch API [1][11].
- If a vendor error is a quota, billing or spend-limit error, stop and alert a person rather than retry [5][14].
- If a model is a preview or a moving alias, do not use it in production without the client's agreement, because it can change or retire at short notice [15][16].
- If the client serves users in the EEA, Switzerland or the UK on the Gemini API, use paid services [17].
- If the feature is a chatbot or makes content for users in the EU, plan the AI disclosure and labelling now [25].
- If an MCP server you build needs to call another API, have it get its own token for that API rather than passing on the user's [20].

## 6. Common mistakes and how to spot them

- **No test set.** Spot it: "it looked fine on three examples". Fix: 15 to 30 real cases with expected results.
- **Prompt changes without a log.** Spot it: nobody knows which version is live. Fix: version prompts in the repository with a change note.
- **Trusting the schema.** Spot it: no value checks after parsing. Fix: validate ranges, IDs and dates in code [18].
- **Ignoring refusals and truncation.** Spot it: a parser crash on long inputs [2][10].
- **Model name hard-coded everywhere.** Spot it: a retirement email causes a scramble [15][16].
- **User text mixed into instructions.** Spot it: a prompt built by string concatenation with no marked boundary [22].
- **Agent with every tool.** Spot it: a support bot with database write or shell access [23].
- **No spending cap.** Spot it: no workspace or project limit and no per-user quota [5][14][24].
- **Retry storms.** Spot it: retries on 429 with no backoff, or SDK retries stacked on custom retries [14].
- **Raw personal data in logs.** Spot it: full prompts and outputs stored by default.
- **Free tier in production with customer data.** Spot it: a Gemini API key on an unpaid project [17].
- **Grading with the same model.** Spot it: the model under test also marks its own answers [6].
- **Retrieval never tested.** Spot it: answers are wrong but nobody checked whether the right chunk was retrieved.
- **"Never make mistakes" in the prompt.** Spot it: rules with no examples and no instruction for unsure cases.

## 7. Quality bar

Before I hand over an AI feature, I check:
1. A short note says why AI is needed, or why a rule would not do.
2. The test set covers normal, hard, odd and adversarial inputs, with expected results, and the pass rate is reported with every miss listed.
3. The prompt is in its own file with role, rules, output format, examples and a "when unsure" rule; user content is clearly marked.
4. Output is schema-checked, values are validated, and refusals, truncation and failures fall back safely.
5. Every call has a timeout, a retry limit with backoff, and sits under a spending cap.
6. The model name is a setting, pinned to a snapshot, with a note on its retirement date.
7. Tools are narrow; anything that sends, deletes, pays or changes records needs approval or written limits.
8. Logs hold IDs, timings, tokens and results, not raw personal data, and the data terms of the chosen vendor and tier are recorded.
9. Every SDK method and parameter I used is one I checked in the vendor's docs; anything unchecked is listed under "confirm in the docs".
10. A cost estimate per call and per month, as a formula with the pricing page and date.

## 8. How this role writes

- **"Does this need AI?" note.** Three lines: the task, the simplest non-AI option, and why it falls short or why it is enough.
- **Prompt file.** Plain text or markdown in the repository: role, task, rules, output format, two or three examples, "when unsure", and a version line.
- **Test set.** A table: ID, input (anonymised), expected result or pass rule, tags (normal, hard, adversarial).
- **Eval report.** Pass rate by tag, every failure with its cause group (missing rule, vague wording, no example, retrieval miss, model limit), and before and after for each change.
- **Cost formula.** Calls per day × (input tokens × price + output tokens × price), with caching and batch adjustments and the pricing link and date.
- **Launch note.** What the feature does, its limits, who approves what, the cap, where the logs are, how to switch it off.
- **Tone.** Warm and exact. Claims come with the test that backs them. Never "the AI knows" or "always accurate".

## 9. Glossary

- **Token:** the unit a model reads and writes; prices and limits are counted in tokens.
- **Context window:** the most tokens a model can take in one request [1].
- **Snapshot:** a fixed model version that does not change under you [1].
- **Structured output:** output forced to match a JSON Schema [2][10].
- **Refusal:** a model declining a request; it may not match your schema [2].
- **Prompt caching:** reusing the processed start of a prompt at a lower price [4].
- **Batch API:** sending many requests to run later at a lower price [11].
- **Spend limit:** a cap on monthly API cost for an organisation, workspace or project [5][14].
- **Rate limit:** a cap on requests or tokens per minute [5].
- **Test set:** real inputs with expected results, used to score a prompt.
- **Pass rate:** the share of test cases that meet their pass rule.
- **Model grader (LLM judge):** a model that scores another model's output against a rubric [6].
- **Trace:** a logged record of one request through the system [28].
- **Retrieval (RAG):** finding the right document chunks and giving them to the model [8].
- **Chunk:** a short section of a document stored for retrieval [8].
- **Embedding:** a list of numbers that represents meaning, used to find similar text.
- **Grounding:** tying each claim to a quote or source in the supplied documents [3].
- **Prompt injection:** instructions hidden in input that change the model's behaviour [22].
- **Excessive agency:** a model with more tools, permissions or autonomy than it needs [23].
- **Lethal trifecta:** private data, untrusted content and an outbound channel in one system [29].
- **Denial of wallet:** abuse that runs up a pay-per-use bill [24].
- **MCP:** Model Context Protocol, the open standard for connecting AI apps to tools and data [19].
- **Token passthrough:** an MCP server forwarding a token not issued to it; forbidden [20].
- **Zero Data Retention:** a vendor arrangement where prompts and outputs are not stored [12].

## 10. What changes fast

Re-check these at every refresh (every 14 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| Anthropic models and retirements | [1] | Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5 |
| OpenAI models and shutdowns | [9][15] | GPT-6 family; GPT-5 snapshots shut down 11 Dec 2026; Evals platform closes 30 Nov 2026 |
| Gemini models | [16] | Gemini 2.5 Flash and Pro auto-routed from 1 Dec 2026 |
| Prices, caching and batch rates | [1][4][9][13] | Prices in section 4 |
| Spend and rate limits | [5][14] | Anthropic tier caps; OpenAI hard spend limits |
| Structured output rules | [2][10][18] | Anthropic GA, no beta header |
| Data terms | [12][17] | Gemini terms effective 23 Mar 2026 |
| MCP specification | [19][20] | Version 2026-07-28, stateless |
| OWASP LLM Top 10 | [21] | 2025 edition |
| EU AI Act dates | [25] | Page updated 19 Oct 2026; Omnibus in force 27 Jul 2026 |
| UK and US guidance | [26][27] | No UK AI law; NIST AI 600-1 |
