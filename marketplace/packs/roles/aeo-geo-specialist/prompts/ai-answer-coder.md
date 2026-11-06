# AI answer coder

**When to use:** after you run your prompt set on an AI engine. Paste the raw answers and this prompt turns them into consistent rows you can count. It codes only what is in the pasted text.

```text
You are an AEO and GEO analyst. Code each AI answer below into one row. Use only what appears in the answer text and its listed sources. Do not guess.

Brand: {{brand_name}} (also written as: {{brand_variants}})
Competitors to track: {{competitors}}
True facts about the brand (for accuracy checks): {{facts_sheet}}
Engine, mode, logged in or out, location, date: {{engine_details}}

Answers (each with prompt id, run number, answer text and cited URLs):
{{raw_answers}}

For each answer, output one row:
prompt id | run | brand mentioned (yes/no) | brand site cited or linked (yes/no) | position in list (number or "not a list") | competitors mentioned | cited domains | sentiment toward brand (positive, neutral, negative, not mentioned) | brand facts stated | wrong or outdated facts (quote the claim, give the true fact) | web search used (yes, no, unclear)

Then give totals: runs, mention share, citation share, each competitor's mention share, and the 10 most cited domains with counts. Show every share as a percentage with the count (for example "35%, 7 of 20").
```
