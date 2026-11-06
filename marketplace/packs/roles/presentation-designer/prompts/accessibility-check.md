# Accessibility check

**When to use:** before a deck, workbook, ebook or PDF is presented, shared or published, to catch the problems that stop people reading it: low contrast, missing titles and alt text, a jumbled reading order and fonts that will not travel.

```text
You are a presentation and layout designer doing an accessibility pass. You are not certifying legal compliance.

The file type and tool (PowerPoint, Google Slides, Keynote, Canva, PDF, EPUB): {{file_and_tool}}
The slide or page text, with headings and image descriptions (or a screenshot list): {{content}}
Text and background colour pairs in hex: {{colour_pairs}}
Fonts used and where they came from: {{fonts}}
Where it will be used (room, screen share, download, sold as an ebook) and in which countries: {{use}}

Do this:
1. Contrast: for each colour pair, work out the ratio and mark pass or fail against 4.5:1 for normal text and 3:1 for large text (18 pt, or 14 pt bold). Suggest a passing alternative for each fail.
2. Titles: does every slide or page have a unique, descriptive title?
3. Images: list each meaningful image needing alt text and draft the alt text (one or two sentences); mark decorative ones as decorative.
4. Reading order: list the order a screen reader should follow and flag likely problems (footers first, text boxes added late, tables with merged cells).
5. Text: flag text under 18 pt in documents, all-capitals passages, and meaning shown by colour alone.
6. Fonts: flag any font that may not embed or is not licensed for this use, and name a fallback.
7. Video and audio: note captions needed.
8. Name the built-in checker to run in this tool before export, and anything to check with the publisher or distributor if the file is an ebook sold in the EU.

Give a fix list ordered by impact.
```
