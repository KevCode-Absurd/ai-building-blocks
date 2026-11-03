# Homepage intro font

`ai-blocks-intro-mono.woff2` is a subset of the existing `jetbrains-mono.woff2`, at weight 400, for the characters in the homepage introduction. Its glyph shapes, spacing and line metrics match the original at that weight. The full original font stays available for the rest of the site and as a fallback.

Copyright 2020 The JetBrains Mono Project Authors. The subset uses the SIL Open Font License 1.1 in [LICENSE-jetbrains-mono.txt](LICENSE-jetbrains-mono.txt). It retains the original copyright and embeds the full licence in its name table. Its internal family and PostScript names are changed to AI Blocks Intro Mono.

The font may cover more characters than the current introduction (the receipt keeps the text it was built from). The build only requires every character of the introduction to be in the font. Rebuild after the introduction in `tools/lib/home-initial-shell.mjs` gains a character the font lacks:

```sh
python -m pip install fonttools==4.68.0 brotli==1.2.1
python site/scripts/build-home-intro-font.py
```

The script verifies every included glyph outline and advance, plus line metrics, against the original font at weight 400. The JSON receipt records source/output hashes and character coverage. The normal site build checks those hashes and rejects uncovered introduction text. CI uses the checked-in asset and does not require Python packages.

The homepage inlines this small font and starts decoding it before body parsing. It keeps `font-display: swap`; it does not wait for a font or hide the introduction. Other fonts and their licences stay unchanged.
