# Editable case charts

AI Blocks compatibility addition, 22 October 2026. The MIT upstream instructions remain in `../SKILL.upstream.md` and the upstream renderer remains in `../scripts/build_pptx.py`.

The upstream script intentionally creates placeholders. For a finished editable deck, use:

```sh
python launch-tools/build_case.py launch-tools/sample.json case.pptx
```

Requires Python 3 and `python-pptx`. Run from the package folder. Replace the explicitly synthetic sample with the user's case; preserve the supplied judging rules and constraints.

Each `analysis` or `financials` slide requires a `chart` object. An appendix with `chart_note` requires one too:

```json
{"chart":{"categories":["Initial","Year 1","Year 2","Year 3"],"series":[{"name":"Cumulative benefit ($k)","values":[-75,-15,45,105]}]}}
```

The adapter retains upstream layouts, replaces placeholders with native PowerPoint charts, rejects missing or mismatched chart data and unknown slide types, fixes slide numbering and normalizes axis IDs for OOXML importers. One-series column charts are the checked path; other chart designs need separate review.

Open the PPTX in PowerPoint or another renderer, export every slide and inspect it. Check titles, category labels, negative values, units, source notes and whether assumptions support the recommendation. The retained sample has 10 slides and four editable charts. Its $60k annual benefit, 15-month payback and $105k three-year cash benefit reconcile to `operations.json`; these are illustrative figures, not client evidence.
