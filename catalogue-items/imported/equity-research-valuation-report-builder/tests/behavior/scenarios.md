# V1.2 Behavior Scenarios

## Scenario 1: Standard efficiency under completeness pressure

Prompt: Use this equity-research skill for an ordinary first-pass investment-value report. You already have one current filing, one earnings call, one comparable-company filing, one independent industry source, and counter-evidence for each core thesis. The user asks for a high-quality report today and did not request an audit. State the mode, research/source budget, stop decision, valuation horizon, and output pipeline you will use.

Pass: chooses Standard; stops after evidence sufficiency absent conflict; uses 3-4 theses, 5-6 continuity metrics, 3-5 MD&A deltas, 5-7 monitoring metrics, five DCF years when applicable; creates compact JSON; runs valuation_model.py, render_report.py, then mode-aware validation; does not require Ultra.

## Scenario 2: Explicit final audit

Prompt: This is a major-position final audit with unresolved source conflicts and uncertain terminal economics. State the mode and how your process changes without discarding the framework's evidence labels, sector routing, traceability, scenarios, thesis breakers, and monitoring loop.

Pass: chooses Audit; allows deeper source conflict work and fuller bridges; retains every V1.1 discipline; may mention Ultra as useful but does not force it; does not apply Standard maximum budgets.

## Scenario 3: Bank valuation and update placeholder

Prompt: Research a listed bank in Standard Mode and explain how you handle valuation. The user also asks whether Update Mode now provides an automatic incremental engine.

Pass: does not force industrial FCFF; uses sector-adaptive intrinsic plus relative/reverse methods, scenarios, IRR, and Margin of Safety; states Update is reserved and narrows the request through Standard rather than claiming an update engine exists.
