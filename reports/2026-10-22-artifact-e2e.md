# Four artifact workflows checked on 22 October 2026

All four requested sample workflows pass after fixes. Actual outputs were opened/exported, rasterized and visually inspected. Inputs are explicitly synthetic; the paper's two background references were checked against their original pages.

| Workflow | Deliverables | Reviewed output | Result |
|---|---|---|---|
| Presentation | Editable PPTX and PDF | All 8 slides; 2 native charts | Pass for retained corporate-bright fixture |
| Case competition | Editable PPTX and PDF | All 10 slides; 4 native charts, cash-flow bridge, roadmap, risks and Q&A | Pass for retained case |
| Research paper | DOCX and PDF | All 4 Word-rendered pages; 2 figures, 1 table, IMRAD prose and references | Pass for retained simulation |
| Equity research | English HTML, PDF, valuation JSON and 5 source exhibits | All 16 PDF pages plus desktop/mobile HTML | Pass for retained synthetic DCF case; two nonblocking review notices retained |

Output root: `C:/Users/kevin/.codex/visualizations/2026/10/22/01a161bf-0b97-7cf2-97f3-74eb6d30d1e4/e2e/`. Final files: `artifacts/`; retained data: `inputs/`; visual evidence: `qa/`. Current PDF page counts control the final contact sheets; older failed-iteration images are historical evidence.

## Failures fixed

- **Presentation:** repaired the missing `templates/storyboard.example.json` with a complete labelled sample. The original renderer omitted visible source notes and chart-unit titles despite their presence in the storyboard. The corporate-bright finalizer adds them and reserves space. PowerPoint and the secondary OOXML renderer both open the corrected deck.
- **Case deck:** the original script deliberately creates chart placeholders. The added builder retains its layouts and creates native editable charts. It rejects missing/mismatched chart data and unknown slide types, fixes numbering and signed axis IDs, removes overlapping redundant legends and moves negative-chart category labels clear of the bars. Four chart series match the cash-flow inputs.
- **Research paper:** the imported guide references unavailable companion skills, scripts, references and LaTeX assets. The portable entrypoint uses available research/chart/document tools and figures suited to the study. A reproduction script and retained schedules support the manuscript; there are no invented participants, affiliations, p-values or peer-review claims. LibreOffice is absent here; Word opened/exported the actual DOCX and all four rendered pages were inspected.
- **Equity:** the original renderer rejects English. The English adapter and matching strict validator preserve every upstream schema, reference, calculation and provenance check. The validator compares the entire HTML with an exact re-render from its inputs. Visual review also found scenario labels wrapping one letter per line and poor print fragmentation. Corrected scenario/print styles now retain a readable single-page scenario comparison and wide matrices. Final output: 16 pages.
- **Windows execution:** helpers read UTF-8 explicitly. Office/Chrome and the temporary-file/subprocess suite needed approved execution outside the sandbox. Locked Node dependencies were installed in isolated copies with install scripts disabled. No private data or account keys were used.

## Evidence

- `reports/content-e2e-checks.json`: **476 assertions passed**, zero failures. Includes artifact counts, chart editability/values, geometry, required content, independent arithmetic, extracted-package execution, missing-chart rejection, tampered-HTML rejection and upstream hashes. These are assertions, not 476 separate user scenarios.
- Original equity regression suite: **113 tests passed in 9.375 seconds** using bundled Python outside the sandbox. The first sandboxed attempt stalled. Original engine files are unchanged.
- All four root entrypoints pass the skill creator's `quick_validate.py`. Its PyYAML dependency was installed in the isolated test folder.
- Refreshed static catalogue scan: 4,360 folders, 25,840 files, zero structural findings and 339 pattern candidates. No candidates occur in the added `launch-tools` helpers. Two copy suggestions remain outside these four packages. Pinned-source/license verification also passes again: 10 packages, 112 original files, zero problems.
- `qa/equity-validation.json`: strict audit; zero errors or blocking warnings. The two original nonblocking warnings remain: declared source roles do not establish real independence, and structure does not establish investment reasoning. Every exhibit is labelled synthetic; no real company or investment conclusion is assessed.
- `qa/equity-browser.json`: 11 sections, English, no missing internal anchors/page errors or page overflow at 320/393/768/1440 pixels. All five synthetic exhibits return 200. Wide tables scroll on mobile. Sample source URLs use the documented loopback server; their JSON files are also retained locally.
- Independent DCF: $15m flat FCFF /10% = **$150m EV**; +$20m cash -$30m debt = **$140m equity**; /10m diluted shares = **$14/share**. A 20% cushion gives **$11.20** and 35% gives **$9.10**. All nine sensitivity cells and scenario IRRs/holding returns were recomputed independently.
- Operations: $90k gross saving -$30k run cost = **$60k net/year**. $75k /$60k = **15-month simple payback**. Three-year benefit = 3 x $60k -$75k = **$105k**, before tax/discounting and excluding pilot timing.
- Paper: the same 40 task durations produce mean waits **291.600** and **180.525** minutes under FIFO and SPT, with equal **571-minute** makespan. **38.09%** reduction applies only to this synthetic batch. CSV checks cover task conservation, waiting-time recurrence and independent aggregation. References: Matt Bishop's UC Davis scheduling handout and Azar/Leonardi/Touitou, arXiv:2103.05604; the cited definitions and duration-uncertainty discussion were checked against the original pages.

## Packaging and scope

Four own portable `SKILL.md` entrypoints route to `launch-tools/USAGE.md`; earlier imported entrypoints remain byte-for-byte in `SKILL.upstream.md`. Helpers, sample inputs and licenses travel in the ZIPs. Metadata records the additions and version 1.0.1. All **112 files in the prior ten-package upstream manifest remain byte-for-byte intact**, explicitly remapping the three replaced source entrypoints to their retained filenames. The research package's earlier entrypoint is retained too.

The extracted case, research and equity downloads execute independently of repository location. The extracted presentation installs its own locked dependencies, generates its sample and runs its packaged finalizer; its content, geometry and chart values match the reviewed deck. Extracted equity output is byte-identical to the reviewed HTML.

Final combined build reported by its owner: 4,356 catalogue entries, 4,476 prerendered pages and 18,603 files. Actual download checks pass for all four ZIPs: complete file sets of 52/12/10/32 files, matching helpers/retained entrypoints/exhibits, with every payload byte-identical except the build's documented root-SKILL newline normalization. `site/dist` ZIPs equal `site/public` ZIPs. Evidence: `reports/content-e2e-published-zips.json`. No source/public/dist files were changed during those checks.

These are four retained skill-to-artifact executions with this agent as operator. They do not certify every model, topic, design style, journal rule or real-data source. No universal Tested badge was added. Live staging/production, account bindings, secrets, D1, domain and deployment remain separate release gates; this report does not claim deployment.

Reproduction: `tools/content-e2e/README.md`. Earlier audience/import reports describe the preceding static/application baseline; this report adds actual artifact evidence.
