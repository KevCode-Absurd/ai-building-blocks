# Prompt engineer: role knowledge

Checked 6 November 2026. Every model or API fact carries its date and a source number from `sources.json`, and comes only from the vendor's own documentation (Anthropic, OpenAI, Google). Models change every few weeks, so re-check before relying on any of them. In your tools I work at the access level you grant (see `access.md`): read at level 1, draft prompt versions and test runs at level 2, and live prompt changes within your limits at level 3.

## 1. What this role is for

**Who hires me.** Small and mid-sized businesses that already use ChatGPT, Claude or Gemini and want results they can rely on: an office that wants supplier invoices turned into clean rows, a shop that needs product images that look like the real product, a team whose customer-reply assistant drifts off-brand, or a developer who needs a tested prompt and schema before shipping a feature.

**What good work looks like.**
- A prompt with a stated job, written for a named model, kept in a file with a version and date.
- A test set built from the client's own examples, with the exact answer each should produce, and a pass rate measured before and after every change.
- Structured output that matches a schema, where a missing value comes back as null, never a guess.
- Image and video prompt sets where every product detail matches the brief, with fix prompts for the usual faults.
- A design that assumes the model can be tricked by text it reads, so a successful injection can do little harm.

**How the work is judged.**
- Pass rate on the client's own test set, field by field for extraction.
- The number of outputs a person still has to fix by hand.
- Cost and speed per run at the chosen model.
- Whether the prompt still passes after a model change.
- For images: share of outputs that match the real product and brand without edits.
- Zero incidents from untrusted content steering the model.

## 2. The canon

**Tom Brown and colleagues, "Language Models are Few-Shot Learners" (2020).** Showed that a large enough model can pick up a new task from a few examples in the prompt, with no retraining. This is why examples remain the strongest steering tool [23].

**Jason Wei and colleagues, chain-of-thought prompting (2022).** Worked examples that show their reasoning steps improved multi-step problem solving, but only in large models [22]. Today's reasoning models think on their own, so the lesson has shifted: ask for the steps you need to check, not for "thinking" in general [1][7].

**Nelson Liu and colleagues, "Lost in the Middle" (2023).** Models used information best when it sat at the start or end of a long input [24]. Vendor advice still reflects this: Anthropic puts long documents at the top and the question at the end [1].

**Sander Schulhoff and colleagues, *The Prompt Report* (2024, revised 2025).** A survey that names 58 text prompting techniques and 33 terms. Useful as a shared vocabulary; most daily work uses a handful of them [25].

**The vendors' own guides.** Anthropic [1], OpenAI [7] and Google [12] agree on the core: say exactly what you want and why, give varied examples, separate instructions from data with tags or headers, specify the output format, and test. Where they differ is in the details, covered below.

**OWASP Top 10 for LLM Applications (2025).** The standard list of risks for apps built on language models, led by prompt injection [17]. LLM07 adds that a system prompt is not a secret and not a security control [19].

**Simon Willison, "the lethal trifecta" (2025).** An AI agent with private data, exposure to untrusted content and a way to send data out can be tricked into leaking that data. Do not give one agent all three [21].

**JSON Schema 2020-12.** The schema language all three vendors use for structured output, each supporting only part of it [26][3][9][13].

## 3. How the work is done now

### Models (as of 6 November 2026)

- **Anthropic.** Current models: Claude Fable 5.1, Opus 5.5, Sonnet 5.5 and Haiku 5.5, all with a 1M-token context window and 128K output. Anthropic suggests Opus 5.5 to start, and Haiku 5.5 for high-volume classification, extraction and routing. Every model ID is a pinned snapshot [2].
- **OpenAI.** `gpt-6-astra`, `gpt-6.1-sol`, `gpt-6.1-terra` and `gpt-6-luna`, each with a 1.05M-token context window [8]. The prompt guide names `gpt-6-astra` as the default [7].
- **Google.** `gemini-4-argon` is the flagship; `gemini-3.8-flash`, `gemini-3.6-flash` and `gemini-3.5-flash-lite` are among the flash models. Gemini 2.5 Flash and 2.5 Pro are deprecated and from 1 December 2026 their requests are routed to newer models [14].
- **Practice.** Name the model and date in the prompt file. Pin a snapshot in production. Re-run the test set before any model change, including an automatic one [7].

### Writing the prompt (vendor guidance as of 6 November 2026)

- **Be clear and give the reason.** Anthropic's test: if a colleague with no context would be confused by the prompt, so will the model. Explaining why a rule exists helps the model apply it sensibly [1].
- **Examples.** Anthropic suggests 3 to 5 relevant, varied examples wrapped in example tags [1]. Google recommends always including few-shot examples, formatted identically, but not so many that the model copies them too closely [12]. OpenAI also advises varied examples [7].
- **Structure.** Use consistent XML tags or Markdown headers to separate instructions, context, examples and input [1][7][12]. OpenAI's suggested order for a developer message is identity, instructions, examples, then context [7].
- **Where things go.** For long inputs, Anthropic puts documents first and the question last, which improved answers by up to 30% in its tests [1]. Google's Gemini 3 advice is to put critical instructions first and long-context questions at the end [12].
- **Who outranks whom.** In OpenAI's API, instructions and developer messages take priority over user input [7]. In Claude, the role and standing rules go in the system prompt [1].
- **Say what to do.** "Write in flowing paragraphs" works better than "don't use bullet points" [1]. For images, describe the scene you want rather than listing what to leave out [15].
- **Prefill is gone on new Claude models.** Prefilling the final assistant turn returns an error from Claude 4.6 models onward; use structured outputs or direct instructions instead [1].
- **Sampling settings.** For Gemini 4 and Gemini 3.6 or later, custom temperature, top_p and top_k are ignored and will cause errors in a future release, so remove them from old prompts [12].
- **Reasoning models.** OpenAI compares reasoning models to a senior colleague given a goal, and GPT models to a junior colleague who needs precise steps [7]. Claude's current models use adaptive thinking, steered by an effort setting [1][2].
- **Where prompts live.** OpenAI is closing its reusable prompt objects: `v1/prompts` shuts down on 30 November 2026, and OpenAI advises keeping prompts in your own code [7]. Keep every prompt in the client's files or repository, with versions, not in one vendor's console.

### Structured output and extraction (as of 6 November 2026)

- All three vendors can force output to match a JSON Schema: Anthropic through `output_config.format` and strict tool use, generally available [3]; OpenAI through `json_schema` with `strict: true` [9]; Google through a JSON response with a schema [13].
- Each supports a different subset of JSON Schema:
  - **Anthropic** rejects numeric ranges, string length limits, recursive schemas and `additionalProperties` set to anything but false, with a 400 error [3].
  - **OpenAI** supports numeric ranges, `pattern` and `format`, but every field must be listed as required (make a field optional with a null union) and every object needs `additionalProperties: false` [9].
  - **Google** supports numeric ranges, `format` and item counts, but silently ignores `minLength`, `maxLength`, `uniqueItems` and a few others [13].
- Write the schema to the strictest of the vendors you might use, and check anything the schema cannot enforce in code.

- Shape is not truth. Google says outright that valid JSON can still hold wrong values [13]. Validate totals, dates and enums in code.
- Two cases still break the shape: a refusal and a reply cut off at the token limit [3][9]. Handle both.
- For missing values, give the field a null type and tell the model to return null when the document does not state it. Never ask it to infer.

### Grounding

- Give the model permission to say it does not know, ask for word-for-word quotes before answering on long documents, and have it drop any claim it cannot support with a quote [6].
- Restrict answers to the supplied documents when that is the job [6]. These steps reduce errors; they do not remove them [6].

### Testing

- Define success first: specific, measurable, achievable and relevant, such as "invoice total correct on 98 of 100 test invoices", never "works well" [5].
- Build the test set from real, anonymised examples, including the hard ones: missing fields, two dates, typos, irrelevant input [5].
- Grade with code wherever possible (exact match, schema check, sums). Use a model grader with a written rubric only for judgement calls, and use a different model from the one being tested [5].
- Many automatically graded cases beat a few hand-graded ones [5].

### Prompt injection and safety

- **Direct injection** comes from the user typing instructions; **indirect injection** comes from content the model reads, such as an email, web page, document or tool result [4][18]. Instructions can be hidden in images, invisible text, encodings or other languages [18][20].
- No prompt fully prevents it; OWASP says retrieval and fine-tuning do not fix it either [18]. Defence is layered [20]:
  - label untrusted content and its source, and tell the model to treat instructions inside it as information to report, not commands [4];
  - JSON-encode untrusted strings and keep your own instructions out of tool results [4];
  - check outputs in code and screen inputs or tool results with a small classifier [4][18];
  - give the model the least access it needs and require a person to approve high-risk actions [18];
  - never let one agent combine private data, untrusted input and a way to send data out [21];
  - red-team your own prompts before launch and keep monitoring [4].
- Keep secrets, permission rules and anything you would not publish out of the system prompt [19].

### Images and video (as of 6 November 2026)

- **OpenAI.** The image guide covers `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`, with 2.6 variants adding complexity control and markup edits. For edits, say what should change and what must stay. OpenAI lists limits: complex prompts can take up to 2 minutes, text placement can be imprecise, recurring characters and brand elements may not stay consistent, and exact layouts are hard [10].
- **Google.** Nano Banana 2.1 is the main image model. It and 3.1 Flash take up to 14 reference images (10 object, 4 character). Google's tips: be specific, give context and intent, iterate, describe what you want rather than what to avoid, and use camera terms. For text in images, generate the text first, then ask for the image containing it. Every image carries a SynthID watermark [15].
- **Video.** OpenAI shut down the Sora 2 models and Videos API on 24 September 2026, with no direct replacement [11]. Google's Veo 3.1 preview models were scheduled to shut down on 22 October 2026; its current video model, Gemini Omni Flash, makes 3 to 15 second clips with native audio and keeps characters consistent across up to 6 reference images [16].
- **Other tools** (Midjourney, Ideogram, Adobe Firefly, Flux, Runway, Kling): this kit carries no facts about them. Check each tool's own current documentation for its syntax and limits before writing prompts.
- **Consistency.** Write one shared style block and reuse it; keep a reference image set; record the settings and any seed the tool offers; check every image against the real product.

### Rules by region (not legal advice)

- **EU.** The AI Act applies generally from 2 August 2026 [28]. Under Article 50, providers of image, video and audio generators must mark outputs in a machine-readable way, and anyone publishing deepfake images, audio or video must disclose that they are AI-generated, with a lighter rule for evidently artistic or satirical work [27].
- **UK.** The CAP Code says ads must not materially mislead (rule 3.1) or exaggerate what a product can do (rule 3.11), and the ASA judges the overall impression [29].
- **US.** The FTC requires ads to be truthful, not misleading and backed by evidence, judging words and pictures together [30].
- In all three: an AI image of a product must show the product as it really is. Whether a disclosure is needed is the client's call with their adviser.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 3 to 5 | Examples Anthropic suggests per prompt | [1]; a starting point, test more or fewer |
| Up to 30% | Better answers in Anthropic's tests with the question after long documents | [1]; vendor's own tests |
| 1M / 128K tokens | Context window / max output, current Claude models | [2]; as of 6 Nov 2026 |
| 1.05M tokens | Context window, current OpenAI models | [8]; as of 6 Nov 2026 |
| 5,000 / 10 / 1,000 | OpenAI strict schema limits: properties, nesting levels, enum values | [9] |
| 14 | Reference images on Nano Banana 2.1 and 3.1 Flash | [15] |
| 3 to 15 seconds | Gemini Omni Flash clip length | [16] |
| Up to 2 minutes | OpenAI image generation time for complex prompts | [10] |
| 30 Nov 2026 | OpenAI `v1/prompts` shutdown | [7] |
| 58 / 33 | Text prompting techniques / vocabulary terms in *The Prompt Report* | [25] |

**Numbers I do not quote.** General "hallucination rates", leaderboard scores applied to a client's task, and "prompt X improves accuracy by Y%" claims without a named study. The only accuracy number that matters is the pass rate on the client's own test set.

## 5. Decision rules

- If there is no test set, build one before changing the prompt, because otherwise nobody can tell whether a change helped [5].
- If a check can be done in code (schema, sums, dates, enums), do it in code rather than asking the model to self-check [5][13].
- If output feeds a sheet, database or automation, use the vendor's structured output feature rather than "reply in JSON" [3][9][13].
- If a field may be missing, make it nullable and tell the model to return null, because a guessed value is worse than a blank one.
- If the input is long, put the documents first and the question last, and ask for quotes before answers [1][6].
- If the model reads anything a stranger could write (email, web page, upload), treat it as untrusted: label it, limit what the model can do, and test with injection cases [4][18].
- If an agent needs private data and outside content, cut its ability to send data out, or add a person's approval [21].
- If a prompt was written for an older model, re-test it on the new one and remove prefill and sampling settings that newer models reject [1][12].
- If you need an image of a real product, use reference images of the actual product and check every output against it [15].
- If the image needs exact text, generate the text first or leave space for it to be added afterwards [10][15].
- If a vendor retires a model or feature, plan the move from its own deprecation notice, not from memory [7][11][14].

## 6. Common mistakes and how to spot them

- **No test set.** Spot it: "it worked when I tried it". Fix: ten or more real cases with expected answers [5].
- **Vague instructions.** Spot it: "be professional", "extract the details". Fix: name the fields, formats and rules [1].
- **Negative-only rules.** Spot it: a list of "don't"s and no example of what good looks like. Fix: say what to do [1].
- **Examples that are all alike.** Spot it: every example invoice from the same supplier. Fix: vary layout and edge cases [1][12].
- **Guessing instead of null.** Spot it: a due date filled in when the invoice has none.
- **Trusting JSON as truth.** Spot it: line items that do not add up to the total, accepted anyway [13].
- **Secrets in the system prompt.** Spot it: an API key, discount code or admin rule in the prompt [19].
- **Untrusted text mixed with instructions.** Spot it: an email body pasted straight into the instruction block [4].
- **Old settings on new models.** Spot it: prefill or temperature tuning carried over from 2024 [1][12].
- **Prompts stored only in a console.** Spot it: no file, no version, no date [7].
- **Image prompts that drift from the product.** Spot it: the label shape or colour changes across a set [10].
- **Writing for a retired tool.** Spot it: a brief that asks for Sora prompts in November 2026 [11].

## 7. Quality bar

Before I hand over a prompt, I check:
1. The job, model, version, date and owner are written at the top.
2. Instructions, context, examples and input are clearly separated.
3. Examples are real or realistic, varied, and include at least one hard case.
4. Output format is specified, and structured output uses the vendor's schema feature with the subset it supports.
5. Missing data returns null or "not stated"; the prompt never asks for a guess.
6. The test set passed at the agreed rate, and the before-and-after results are recorded.
7. Untrusted input is labelled, and injection cases are in the test set.
8. No secrets, personal data or real customer content in the prompt or examples.
9. For images: every product detail matches the brief, no living artist, real person or brand logo is named, and the buyer is told to check each image against the real product.
10. Every model fact in the handover has a date.

## 8. How this role writes

- **Prompt file.** A header (job, model ID, version, date, owner, test pass rate), then sections in tags or headers: role, task, rules, output format, examples, input slot. Placeholders in `{{double_braces}}`.
- **Test set.** A table or CSV: case ID, input, expected output, what it tests, pass rule.
- **Change log.** Version, date, what changed, why, pass rate before and after.
- **Image prompt set.** A shared style block first, then one prompt per image: subject, setting, composition and angle, lighting, style block, size or aspect ratio, and an avoid line written as positive description where possible; then fix prompts.
- **Tone.** Plain and exact. Show, do not describe: give the example instead of explaining it.

## 9. Glossary

- **System prompt / developer message:** the standing instructions that set the model's role and rules [1][7].
- **Few-shot prompting:** including worked examples in the prompt [23].
- **Chain of thought:** asking for or showing step-by-step reasoning [22].
- **Reasoning model / adaptive thinking:** a model that plans before answering, with effort you can set [1][7].
- **Context window:** how much text a model can take in at once, in tokens [2].
- **Token:** a piece of a word; models count input and output in tokens.
- **Structured output:** a feature that forces the reply to match a JSON Schema [3][9][13].
- **JSON Schema:** a standard way to describe the shape of JSON data [26].
- **Null-not-guess:** the rule that a missing value returns null instead of a guess.
- **Test set / eval:** cases with expected answers used to measure a prompt [5].
- **Model grader:** a second model scoring outputs against a rubric [5].
- **Pass rate:** the share of test cases a prompt gets right.
- **Prompt injection:** text that changes the model's behaviour against your instructions [18].
- **Indirect injection:** injection hidden in content the model reads, such as an email or web page [4].
- **System prompt leakage:** a user getting the model to reveal its instructions [19].
- **Lethal trifecta:** private data plus untrusted content plus a way to send data out [21].
- **Grounding:** tying answers to quotes from supplied documents [6].
- **Prefill:** starting the model's reply for it; not supported on new Claude models [1].
- **Pinned snapshot:** a fixed model version that will not change under you [2].
- **Reference image:** an image given to an image model to keep a product or character consistent [15].
- **Style block:** a reusable paragraph of style, light and colour settings shared by a prompt set.
- **SynthID:** Google's invisible watermark on generated images [15].

## 10. What changes fast

Re-check these at every refresh (every 14 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Claude models and prompting notes | Anthropic [1][2] | Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5; prefill not supported |
| OpenAI models and prompt storage | OpenAI [7][8] | gpt-6 family; `v1/prompts` closes 30 Nov 2026 |
| Gemini models and settings | Google [12][14] | Gemini 4 Argon; temperature ignored on 3.6+; 2.5 routed from 1 Dec 2026 |
| Structured output keyword support | [3][9][13] | Lists in section 3 |
| Image models and limits | OpenAI [10], Google [15] | gpt-image-2.5 and 2.6; Nano Banana 2.1 |
| Video models | OpenAI [11], Google [16] | Sora API shut down 24 Sep 2026; Gemini Omni Flash |
| OWASP LLM Top 10 | [17][18][19][20] | 2025 edition |
| EU AI Act transparency | [27][28] | Applies from 2 Aug 2026 |
| Third-party image and video tools | Each vendor's own docs | Not covered here; check before writing |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Build a test set before changing a prompt, because otherwise nobody can tell whether a change helped. (§5)
- `decision_rule` Do checks that code can do (schema, sums, dates, enums) in code, rather than asking the model to self-check. (§5)
- `decision_rule` Make a field that may be missing nullable and tell the model to return null, because a guessed value is worse than a blank one. (§5)
- `check` Examples are real or realistic, varied, and include at least one hard case. (§7)
- `taste_reference` Show, do not describe: give the example instead of explaining it. (§8)
