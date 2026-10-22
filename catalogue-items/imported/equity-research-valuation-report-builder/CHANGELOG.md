# Changelog

## v1.2.0

Initial public-release package of the existing V1.2 skill. The changes below are based on the available V1.1 and V1.2 source snapshots, not an invented public release history.

### V1.2 changes from V1.1

- Standard/Audit routing, explicit research budgets, source reuse, evidence stop conditions, and one authoritative location for detailed thesis arguments.
- A standard-library valuation engine for FCFF/FCFE forecasts, terminal value, 3×3 sensitivity, reverse valuation, scenario returns/IRR, margin of safety, and reconciliation. Standard DCF defaults to five explicit years with justified extensions.
- Structured report content and valuation results rendered through a fixed, self-contained HTML template instead of repeatedly authoring HTML/CSS.
- Mode-aware validation, provenance checks against source JSON and deterministic rendering, and explicit manual-review warnings.
- Expanded calculation, rendering, input-validation, and legacy-report regression tests with synthetic fixtures.

### Preserved

- Evidence labels and source traceability, metric continuity, thesis/counter-evidence matrices, MD&A changes and promise tracking, independent industry validation, sector-adaptive methods, scorecard evidence links, thesis breakers, and monitoring loops.
- Audit-level assumption ledgers and forecast bridges; V1.1 report validation remains available through `--legacy-v11`.
- The original `financial_metrics.py` helper remains unchanged.

### Public-release packaging

- Retain the installed V1.2 entrypoint refinements: respect the selected research version, keep focused questions scoped to relevant modules, and follow the session's model configuration.
- Add English installation/use documentation, an MIT license, ignored local research/output folders, and synthetic example instructions.
- Remove personal machine paths from public documentation and replace fixture-only local source paths with example-domain URLs. No research formulas, script interfaces, schema versions, or runtime dependencies are changed by packaging.

### Known limits

- Update Mode remains a design placeholder. Sector-specific intrinsic values still require supported assumptions/calculation outside the generic normalization interface.
- Structural validation cannot establish source truth, assumption quality, or investment validity. Independent-agent behavior scenarios and real-company A/B efficiency measurements are not represented as completed benchmarks.
