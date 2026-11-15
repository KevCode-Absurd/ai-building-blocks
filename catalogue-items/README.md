# Catalogue items

One folder per part, grouped by **function** (business brain, research and strategy, creative and content, paid media, website and conversion, lifecycle and retention, analytics and profit, AI operations). Each part's `item.yaml` also lists the **jobs** it does, the **industry packs** it supports and the **hosts** it runs in (see `docs/FINAL_PLAN.md`, Part 2). Industry packs add brain fields, examples and thresholds; they never fork a part. The ecommerce module codes (M01–M28, from `docs/planning/01_ECOMMERCE_BUSINESS_MAP.md`) stay as tags inside the ecommerce pack.

This folder stays empty until Section 1 (the org context) starts.

Each item folder follows `docs/planning/04_SITE_ARCHITECTURE.md` §4:

```
<function>/<level>/<slug>/
  item.yaml          manifest (identity, contract, dependencies, models, efficiency, tiers, provenance)
  SKILL.md           the item, model-neutral, in cache order
  references/        loaded only on demand
  lean/              short version for lean mode
  exports/           built automatically (Claude Code, ChatGPT, GPT block, Codex, prompt.txt)
  packs/<industry>/  brain fields, thresholds and wording for one industry pack
  examples/<brand>/  without-brain / with-brain / with-brain+refs
  tests/             checklist.yaml, golden/, model-runs.csv
```

An item may be marked `tested` only when it passes the checklist for its level (`docs/planning/05_PRODUCTION_PRINCIPLES.md` §21).
