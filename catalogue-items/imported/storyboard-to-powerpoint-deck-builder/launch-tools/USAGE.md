# Source notes in finished PowerPoint output

AI Blocks compatibility addition, 22 October 2026. Original MIT instructions are retained in `../SKILL.upstream.md`.

`templates/storyboard.example.json` is a complete synthetic example added to repair the missing example path in the upstream guide. Review and install the locked Node dependencies, then run from this package:

```sh
npm ci --ignore-scripts
node scripts/validate-storyboard.mjs templates/storyboard.example.json
node scripts/generate.mjs --in templates/storyboard.example.json --out draft.pptx
python launch-tools/finalize_pptx.py templates/storyboard.example.json draft.pptx presentation.pptx
```

The finalizer requires `python-pptx` and is checked for the `corporate-bright` style. It checks slide count and adds visible chart-unit titles and source lines from `citations`; the upstream renderer retains these sources only in input/notes. The finalizer shortens chart height to reserve that source line.

For other styles, keep the user's design and place source notes deliberately; review their layout separately. Do not treat the upstream text-only QA script as proof of a rendered slide's quality. Export and inspect every slide. The checked synthetic example has eight slides and two native charts. Replace sample assumptions with the user's data and verify arithmetic against the retained source before use.
