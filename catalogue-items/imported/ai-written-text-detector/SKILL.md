---
name: detect-ai-text
description: Estimate whether a document's prose was written by AI, with the linguistic tells and honest abstention on non-prose. Use when the user asks whether an essay, report, CV, submission, or article was AI-generated — for triage, not proof.
category: document-verification
risk: critical
source: community
source_repo: Sketchjar/stipple-agent-skills
source_type: community
date_added: "2026-08-31"
author: Sketchjar
tags: [document-verification, fact-checking, stipple, authenticity]
tools: [claude, cursor, gemini, codex]
license: "Apache-2.0"
license_source: "https://github.com/Sketchjar/stipple-agent-skills/blob/main/LICENSE"
---

> **AI Blocks note (licence):** this copy is shared under CC BY 4.0, as the LICENSE-CONTENT file in this folder says. The `license:` line in the front matter above is the original author's own label (Apache-2.0). The LICENSE-CONTENT file governs here, and the author's Apache-2.0 notice stays visible. Keep the credit to the author.
>
> **AI Blocks note (data and testing):** the whole document is sent to Stipple, an outside service. We do not know its cost, allowance or how long it keeps documents. Tell the user to read Stipple's terms and privacy rules before the first upload. We have not tested the endpoint or the response fields below.

# AI-Text Detection

Inspect a provider’s uncalibrated AI-style signal for a document’s prose, with the specific linguistic tells and an honest abstention when the document isn't prose. Uses an external Stipple API; verify current access, cost and privacy terms.

## When to use

- Educators screening student submissions
- Publishers and platforms triaging inbound content
- HR reviewing AI-drafted CVs (flag, don't reject)
- Researchers checking source provenance

## Instructions

1. **Get the document.** URL, local file path (PDF, DOCX, TXT, MD), or raw text via `--text`.

2. **Run detection.**

   ```bash
   curl --fail --show-error --silent --max-time 30 -X POST https://www.stipple.sh/v1/detect-ai-text \
     -F "file=@essay.pdf" \
     -H "Authorization: Bearer $STIPPLE_API_KEY"
   ```

   For raw text: POST JSON `{"text": "..."}` to the same endpoint.

3. **Interpret the response.**

   - `applicable: false` — the document is not prose (forms, tables, scans, spreadsheets). Detection is **deliberately refused** rather than guessed. Report this and stop.
   - `probability` — model confidence (0–1), NOT a calibrated truth
   - `lean` — "ai" | "human" | "unsure"
   - `tells[]` — the specific phrases/patterns flagged (e.g. "It is important to note that", uniform sentence length, low burstiness)
   - `reasoning` — why the model reached its verdict
   - `limitations` — always present; the API states its own noise profile

4. **Report honestly.** This measures *style, not authenticity*:

   | Question | Tool |
   |---|---|
   | Was this *written* by AI? (style) | this skill |
   | Is this document *genuine/tampered*? (forensics) | a document forensics check (not part of this skill) |

   A human can write generically; an AI can write plainly. One triage signal, never a verdict.

## Output format

The numbers below are an invented layout example, not a real result. Fill every value from the service's actual reply.

```
Provider AI-style score: [0 TO 1] (uncalibrated; lean: [ai / human / unsure]; not authorship proof)
prose ratio: [0 TO 1]

linguistic tells:
  - "It is important to note that, in today's fast-paced world" (stock phrase)
  - uniform sentence length across paragraphs
  - low burstiness; no authorial asides

reasoning: The text relies entirely on formulaic transition clichés...
limitations: The probability is the model's CONFIDENCE, not a calibrated truth.
```

## Limitations and Safety

- AI-text detection is probabilistic and can disproportionately flag templated,
  coached, translated, accessibility-assisted, or non-native-English writing. Do
  not use it as proof of misconduct or as the sole basis for employment, academic,
  publishing, or disciplinary action.
- Uploading a document sends its contents to a hosted third party. Obtain explicit
  approval first, remove unnecessary personal or confidential material, and verify
  the provider's current retention and deletion terms.
- Preserve the original work and give the affected person a meaningful human review
  and appeal path before any consequential decision.

## Notes

- Non-prose documents (forms, tables, payslips) get `applicable: false` — the engine refuses rather than guessing
- Can false-flag templated/coached or non-native-English writing — always present as one signal alongside human review
- Verify current authentication/allowance on https://www.stipple.sh; do not guarantee a free anonymous tier or publish the submitted document.
