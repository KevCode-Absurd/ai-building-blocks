---
name: equity-research-valuation-report-builder
description: Build a dated equity research report from company filings, financial data and explicit valuation assumptions, with DCF scenarios, source traceability and English HTML output.
---

# Equity research and valuation

Establish the company, exchange, currency, as-of date and horizon from the request and supplied documents. Use [the English rendering and validation path](launch-tools/USAGE.md) when English is requested. It retains the upstream schema, valuation and provenance checks; the original renderer accepts only Chinese input.

Use the [upstream research framework](SKILL.upstream.md) and its references for evidence labels, thesis and counter-evidence, period comparisons, DCF assumptions, scenarios, risks and monitoring. Verify source dates, facts and calculations. The included sample uses only synthetic company, peer, industry and price exhibits. Live work requires actual verified sources and dated market data; the package includes no market-data feed.

Run the valuation engine, the appropriate renderer and its matching strict validator. Export HTML to PDF if requested and inspect every page. A structural pass does not establish source independence or the investment conclusion.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Run order

1. Gather the company's filings (annual and interim reports from the company's investor page or the exchange or regulator filing site) and a share price with its date. No paid data source or API key is needed; the package has no market-data feed.
2. Write the valuation inputs and run `scripts/valuation_model.py`.
3. Write the report content and run the renderer: `launch-tools/render_equity.py` for English, or `scripts/render_report.py` for Chinese.
4. Run the matching validator: `launch-tools/validate_equity.py` for English, or `scripts/validate_report.py` for Chinese.
5. For a PDF, open the HTML in a browser and print to PDF (no extra tool needed), then inspect every page.

## Report sections

Thesis; counter-evidence; period comparison; DCF assumptions and scenarios (bear, base, bull); risks; monitoring points; sources with dates.

Tell the user the report is a research draft, not investment advice, and that a validator pass checks structure only.

Upstream engine/framework: evilhill, MIT. AI Blocks added English compatibility, readable scenario/print layouts and this entrypoint after a 22 October 2026 synthetic fixture check.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Share valuation assumption reviewer](https://useaiblocks.com/skills/equity-assumption-review-assistant). It takes the document.
- The [Indian financial data pack builder](https://useaiblocks.com/skills/financial-data-pack-builder). It takes the document.
- The [Early-stage startup valuation scenario builder](https://useaiblocks.com/skills/early-stage-valuation-estimator). It takes the document.
- The [Unsupported claim spotter](https://useaiblocks.com/skills/unsupported-claim-spotter). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
