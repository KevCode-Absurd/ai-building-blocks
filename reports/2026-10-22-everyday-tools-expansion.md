# Everyday tools expansion

32 original deterministic tools add 163 fixed worked examples to the existing 36 tools. The registry now has 68 tools.

Source scope: `mini-tools/index.mjs` and `tool.mjs` / `examples.mjs` in the following new folders. Each tool supplies input ranges and provenance hints, formulas, a plain answer, next steps, method notes and explicit assumptions. Figures are labelled illustrative.

- Design (5): `print-image-size`, `image-crop-planner`, `layout-grid-calculator`, `video-file-size`, `reading-time`.
- People and HR (5): `interview-capacity`, `leave-coverage`, `training-budget`, `employee-turnover-cost`, `hiring-funnel`.
- Finance (7): `emergency-fund`, `savings-goal`, `loan-payment`, `monthly-budget`, `split-bill`, `subscription-savings`, `invoice-payment-fees`.
- Personal (6): `focus-time`, `task-time-buffer`, `study-plan`, `trip-budget`, `commute-cost`, `electricity-running-cost`.
- Operations (7): `support-staffing`, `project-capacity`, `event-break-even`, `supplier-quote-comparer`, `file-transfer-time`, `workshop-materials`, `backlog-clearance`.
- Compliance planning (2): `document-review-capacity`, `data-retention-storage`.

Validation before the publisher's freeze:

- `node --test mini-tools/test/mini-tools.test.mjs`: 483 passed, 0 failed, 0 skipped. Python code executed.
- `node tools/build-mini-tool.mjs`: succeeded for all 68 tools. Each set of examples matched the formula engine, offline HTML, embed HTML, spreadsheet formulas and Python implementation.
- Additional min/max and deterministic-range smoke check: 3,200 input cases across the 32 new tools, no errors or non-finite results.
- Independent review from the mind-label agent: 28 manual expected results and 22 min/max cases across 11 tools passed.

Generated export manifest: `site/public/mini-tools/tools.json`. Each slug's export directory contains offline HTML, embed HTML, XLSX, SKILL.md, prompt, Python and skill ZIP, built by the existing pipeline.

Release follow-ups resolved in the approved source-only correction window:

1. `loan-payment`: a stable small-rate payment expansion and direct interest calculation preserve tiny positive rates. Three extra fixtures use the exact annuity formula with independent Python Decimal arithmetic at 80-digit precision, including the upper principal/month bounds. No rate is rounded down to zero.
2. `support-staffing`: wording now states staffing equivalents at the entered hours, including part-time schedules.
3. `data-retention-storage`: the cost-per-GB field uses step 0.001 for unit-price precision.
4. Removed the verified exact `mini-tools/create-everyday-expansion.mjs` temporary authoring file. The 64 individual production source files remain.

Final source-only validation: `node tools/build-mini-tool.mjs --check` succeeded for all 68 tools; the unit suite again passed 483/483 with no skips and real Python execution. No export files were generated during this correction window. The combined publisher must regenerate exports from these final sources.

Final owned source manifest: `mini-tools/index.mjs`, the `tool.mjs` and `examples.mjs` pair for each of the 32 slugs above, and this report (66 files). No commit or deployment performed by this subagent. All source files are frozen for the combined publisher.
