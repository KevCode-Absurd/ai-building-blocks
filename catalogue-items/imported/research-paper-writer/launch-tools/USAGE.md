# Portable manuscript workflow

AI Blocks compatibility notes, 22 October 2026. The detailed upstream writing guide remains in `../references/detailed-guide.md`; attribution and its content license remain with that guide.

The imported guide refers to companion research, schematic and image-generation skills, scripts, reference files and LaTeX assets that are **not included** in this package. Do not execute missing commands or promise those assets. Its suggestions about generated figure counts are not a requirement for a manuscript; use figures that explain the actual study.

Use the user's target venue when supplied. Otherwise state the chosen manuscript format and organize a suitable scientific paper around introduction, methods, results and discussion. Draft an outline before prose. Preserve actual study design, results, uncertainty and reporting limits. Confirm cited titles, authors and claims against original sources using available browsing or supplied references. If a reference cannot be verified, flag it and omit unsupported claims.

For a synthetic demonstration, label the title, abstract, captions and data appropriately. Generate and retain the data and calculation code; do not describe synthetic observations as real participants, company evidence or experiments conducted elsewhere. A deterministic simulation does not justify fabricated p-values or a population effect.

This package contains a checked synthetic example: `simulation-results.json`, `task-schedules.csv`, `outline-and-sources.json` and a stdlib reproduction script:

```sh
python launch-tools/reproduce_simulation.py sample-run
```

For that one 40-task batch, mean waiting time is 291.600 minutes under FIFO and 180.525 under SPT; both finish at 571 minutes. The batch-specific reduction is 38.09%. These results do not estimate workplace savings.

Author DOCX/PDF with available document tools. Render the actual deliverable with Word, LibreOffice or another compatible renderer, then inspect every page. Check captions, tables, equations, references, page breaks and whether prose agrees with the data. Missing upstream companion tools do not prevent this portable workflow.
