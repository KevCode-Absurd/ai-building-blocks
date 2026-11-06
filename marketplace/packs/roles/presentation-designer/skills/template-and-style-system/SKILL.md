---
name: template-and-style-system
description: Specifies a reusable template and style system so a whole team builds slides or documents the same way, with page or slide size, grid and margins, a type scale with font names and fallbacks, colour roles in hex with contrast checked, 8 to 12 named master layouts with when to use each, chart and image rules, accessibility settings, and build notes for PowerPoint, Google Slides, Keynote, Canva, Figma or a document tool. Use when everyone's decks look different, when a brand needs a slide or workbook template, or before a big batch of slides or pages. Never invents brand colours, logos or fonts the client does not own.
---

# Template and style system

A template is a set of decisions made once so nobody has to make them again. Built-in layouts on a slide master also give screen readers a consistent reading order (Microsoft). This skill writes those decisions down precisely enough that someone else can build them in the client's tool.

## When to use

- A team of any size where every deck looks different.
- A company slide template for sales, training or board decks.
- A style system for a series of workbooks, ebooks or lead magnets.
- Before rebuilding many slides or pages, so the rebuild is consistent.

## What you need

- Brand colours as hex values, fonts (with where the licence came from), and the logo as a vector file plus a PNG.
- The kinds of slides or pages the team makes most, with two or three real examples.
- The tool the team uses, and whether they share files in Microsoft 365, Google Drive, Canva or Figma.
- Output: slide size, or page size (A4 or US Letter) and whether it prints at home, goes to a printer or is read on screen.
- Access: level 1 to read examples; level 2 to build the template as a "DRAFT" file; level 3 to replace the shared team template, which also needs a fresh yes because others use it.

## Steps

1. **Audit the examples.** List the layouts people actually use, the type sizes and colours they pick, and where things break (text overflowing, off-brand colours, charts restyled by hand).
2. **Set the canvas.** Slide size (PowerPoint's default is widescreen 16:9 at 13.333 x 7.5 in; decide before building, because resizing later can break layouts), or page size, margins and bleed if printed.
3. **Set the grid.** Columns, gutters and outer margins; where titles, body, footers and page numbers sit. Every layout snaps to this grid.
4. **Set the type scale.** Title, headline, subhead, body, caption and label, each with font, size, weight and line spacing. For slides shown in a room, body text far above Microsoft's 18 pt floor; for printed workbooks, a comfortable reading size checked on a printed page. Name a fallback for every font, and check whether each font can be embedded (font makers set non-embeddable, preview and print, editable or installable).
5. **Set colour roles.** Name colours by job: text, background, primary accent, secondary accent, chart series (in order), positive, negative, muted. Check text and background pairs against WCAG 2.2 (4.5:1 for normal text, 3:1 for large text, meaning 18 pt or 14 pt bold). Record each ratio. Colour is never the only way meaning is shown.
6. **Define the layouts.** Usually 8 to 12 for slides: title, section, statement, two-column, chart, image with caption, full-bleed image, quote, process or timeline, table, team, closing. For workbooks: cover, how to use, section opener, reading page, worksheet, tracker, checklist, closing with call to action. For each: name, when to use it, zones, and what never goes on it.
7. **Set chart rules.** Series colours in order, direct labels instead of legends, axes from zero for bars and columns, no 3D, a takeaway title, the source line position.
8. **Set image and icon rules.** Photo style, crops, alt text required, one icon set, sizes.
9. **Set accessibility defaults.** Every layout has a title placeholder; reading order set on each layout; placeholders for alt text; the Accessibility Checker run before every export.
10. **Write build notes.** For the named tool: where the master or theme lives, how to add layouts, fonts and fallbacks, how to lock or protect the template, how to share it so people start from a copy.
11. **Write a one-page usage guide.** "Pick the layout by your point", with a small example of each.
12. **Build or hand over.** At level 1, the spec. At level 2, a template file marked "DRAFT". At level 3, after a fresh yes, replace the shared team template and log it.

## Checks

- Every colour pair used for text passes WCAG contrast, with the ratio recorded.
- Every font is licensed for the use, has a fallback, and its embedding permission is known.
- Every layout has a title placeholder and a set reading order.
- Every layout has a stated purpose; none duplicate each other.
- Brand colours, logos and fonts are the client's own; nothing borrowed or invented.
- Build notes are specific to the named tool.

## Output format

1. **Canvas and grid.**
2. **Type scale table:** role, font, fallback, size, weight, line spacing, embedding permission.
3. **Colour roles table:** role, hex, used on, contrast ratio against its background.
4. **Layout list:** name, when to use, zones, never put here.
5. **Chart, image and icon rules.**
6. **Accessibility defaults.**
7. **Build notes** for the named tool.
8. **One-page usage guide.**

## Example of good output (short)

*Northgate Surveyors is a made-up firm used only to show the format. Its colours #1A3A5F and #E8A33D and the font Lato are taken from its invented brief.*

**Canvas:** 16:9, 13.333 x 7.5 in (PowerPoint default). Margins 0.5 in; 12-column grid.

**Type scale**

| Role | Font | Fallback | Size | Weight |
|---|---|---|---|---|
| Headline | Lato | Arial | 36 pt | Bold |
| Body | Lato | Arial | 24 pt | Regular |
| Label | Lato | Arial | 20 pt | Regular |

Lato's licence allows embedding: [client to confirm the source of the font files].

**Colour roles**

| Role | Hex | Used on | Contrast |
|---|---|---|---|
| Text | #1A3A5F | White background | 11.57:1, passes |
| Accent | #E8A33D | Shapes and chart highlight on white; text only on the navy | 2.16:1 on white, fails even for large text; 5.37:1 on #1A3A5F, passes |
| Background | #FFFFFF | All slides | |

**Layouts (extract):** Title (logo, title, date); Statement (one sentence, nothing else); Chart (headline as takeaway, chart, source line); Two-column (comparison only, never two unrelated points); Quote (real quote from the brief, name and role, permission noted).
