# Equity Research Skill

An AI-assisted skill for structured, evidence-backed public equity research and valuation.

**Version:** v1.2.0 · **License:** MIT · **Supported agent:** Codex · **Python:** 3.9+

Turn company filings, earnings materials, investor presentations, and other sources into an auditable research workflow. The agent evaluates evidence and assumptions; Python handles repeatable calculations and report rendering. The skill instructions, research references, and sample content are primarily in Chinese.

## Capabilities

- Business quality, industry demand, competitive position, management, MD&A changes, and management-promise tracking.
- Historical financial analysis, metric comparability, sector-specific KPIs, and earnings quality.
- FCFF/WACC or FCFE/Ke DCF, terminal value, 3×3 sensitivity, reverse valuation, valuation reconciliation, Bear/Base/Bull scenarios, holding-period return, IRR, and margin of safety.
- Sector-adaptive valuation instead of forcing industrial-company DCF onto banks or insurers. Sector-specific intrinsic values are supplied as assumptions; the scripts normalize values, calculate implied multiples and returns, and reconcile methods.
- Evidence/counter-evidence matrices, traceable scorecards, risks, catalysts, thesis breakers, and decision/monitoring loops.
- Self-contained HTML from a fixed template, with source links and print styles. Markdown is available when explicitly requested; it is not a renderer output.

## Modes and design goals

| | Standard (default) | Audit |
|---|---|---|
| Intended use | Routine initial research | Final review, material uncertainty, or major positions |
| Research budget | 3–4 theses, 5–6 comparability metrics, 3–5 MD&A changes, 5–7 monitoring indicators | Expand around material questions without Standard caps |
| Industry checks | 1–2 peer primary sources and one independent industry source | Expand to resolve uncertainty |
| DCF, when suitable | Five explicit years by default; justify extensions | Full bridges and assumption ledger; horizon follows the business |
| Presentation | Compact forecast and assumptions | Full forecast detail and operating sensitivity |

Both modes retain evidence labeling, counter-evidence, valuation discipline, and decision monitoring. The skill follows the session's model settings; it does not change models. **Update Mode is a placeholder, not an incremental-update engine.**

V1.2 aims to preserve research quality while reducing avoidable searching, repeated reasoning, arithmetic, and HTML/CSS generation. Reuse sources, stop when core evidence is sufficient and material conflicts are resolved, and keep detailed arguments in one authoritative section. No measured token-saving percentage or research-quality score is claimed.

## Install in Codex

Requires Codex with local skill support, Git for this installation method, and Python 3.9+ to run the scripts. The scripts and tests use only the Python standard library. Research still requires user-provided documents and/or the agent's available research tools; the project is not a market-data feed or an autonomous filing downloader.

For a user-level installation on macOS/Linux, after the `v1.2.0` release is published:

```sh
(
  set -eu
  skill_dir="$HOME/.agents/skills/equity-research-skill-v1-2"
  if [ -e "$skill_dir" ] || [ -L "$skill_dir" ]; then
    printf '%s\n' "Destination already exists; inspect it before installing."
    exit 1
  fi
  mkdir -p "$HOME/.agents/skills"
  git clone --branch v1.2.0 --depth 1 \
    https://github.com/evilhill/equity-research-skill.git "$skill_dir"
)
```

Before installing, check whether `equity-research-skill-v1-2` is already available through another skill directory, including an older `~/.codex/skills` installation. Do not install duplicate skills with the same name. The command refuses to overwrite its destination; it does not detect every alternative installation.

Codex discovers skills in user and project locations; see the [official skill documentation](https://learn.chatgpt.com/docs/build-skills). If the new skill is not visible, restart Codex. Invoke it as `$equity-research-skill-v1-2`, regardless of the repository name. Other agents have not been validated for this release.

## Usage

```text
Use $equity-research-skill-v1-2 in Standard Mode to research Microsoft
(MSFT, NASDAQ). Use the attached annual report and latest quarterly filing.
Set the research cutoff to the date I specify, use USD, and evaluate a
five-year holding period. Produce the default HTML report, preserve the
source and valuation JSON files, and identify unresolved evidence gaps.
```

Request **Audit Mode** for a deeper final review. Supply the company/ticker, exchange, research cutoff, currency, holding period, and available source materials. Focused questions can use only the relevant modules rather than the full-report pipeline.

The workflow defines scope, collects and labels evidence, checks metric continuity, evaluates the business and management, establishes valuation assumptions, constructs scenarios and theses, and renders and validates the report. Source truth and investment logic still require human review.

## Run the synthetic example

From the repository root or installed skill directory:

```sh
mkdir -p outputs
python3 -B scripts/valuation_model.py tests/fixtures/standard-valuation-input.json --output outputs/valuation-result.json
python3 -B scripts/render_report.py tests/fixtures/standard-report.json --valuation outputs/valuation-result.json --output outputs/report.html
python3 -B scripts/validate_report.py outputs/report.html --strict --as-of 2026-09-01 --source-json tests/fixtures/standard-report.json --valuation-json outputs/valuation-result.json
```

Open `outputs/report.html` locally. Everything in the fixtures is synthetic, including the company, dates, values, and example-domain source URLs. These are format/calculation examples, not verified research. See [examples](examples/README.md) for the Audit commands.

For real research, the agent prepares `report-content.json` and `valuation-input.json`; the model produces `valuation-result.json`, and the renderer produces the HTML report. Retain the input and result JSON files for reproducibility. See the [schema](references/report-schema.md) and [valuation framework](references/valuation-framework.md). Keep private inputs and generated reports outside the public repository or in ignored local folders; inspect every Git diff before committing.

## Repository structure

| Path | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | Skill entrypoint, mode routing, budgets, and delivery rules |
| [agents/openai.yaml](agents/openai.yaml) | Codex display and invocation metadata |
| [references/](references/) | Research methods, evidence policy, valuation, and content schema |
| [scripts/](scripts/) | Valuation engine, fixed-template renderer, report validator, and financial metrics |
| [assets/report-template.html](assets/report-template.html) | Self-contained HTML/CSS template; no external runtime assets |
| [examples/](examples/) | Generic prompts and reproducible synthetic walkthroughs |
| [tests/](tests/) | Unit/CLI tests, synthetic fixtures, behavior scenarios, and V1.1 compatibility fixture |

## Validation

```sh
python3 -B -m unittest discover -s tests -q
python3 -B scripts/validate_report.py tests/fixtures/v11-legacy-report-template.html --template --strict --legacy-v11
```

Strict validation fails on errors and blocking warnings. Source-independence and research-logic warnings require manual review and are deliberately non-blocking. With both JSON inputs, the validator checks hashes and deterministic re-rendering; this is **not** proof that sources, assumptions, or investment conclusions are correct.

The V1.1 HTML file is retained only as a regression fixture. The optional Skill Creator package checker is an external developer tool, not a runtime dependency. Behavior-test prompts are included; they are not a claim of completed independent-agent or real-company A/B evaluation.

## Limitations and license

AI-generated research may contain errors. Independently verify source documents; valuation depends on assumptions. This project does not provide personalized financial advice, and users remain responsible for investment decisions. The bundled IRR solver supports an initial purchase followed by non-negative distributions and exit value, not repeated capital calls.

Released under the [MIT License](LICENSE). See [CHANGELOG.md](CHANGELOG.md) for v1.2.0 changes. The license covers this project's code and documentation, not third-party source documents used in research.
