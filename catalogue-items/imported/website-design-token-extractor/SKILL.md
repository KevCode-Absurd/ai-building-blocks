---
name: extract-design
description: "Extract the full design language from any website URL. Produces 8 output files including AI-optimized markdown, visual HTML preview, Tailwind config, React theme, shadcn/ui theme, Figma variables, W3C design tokens, and CSS variables. Also runs WCAG accessibility scoring. Use when user says 'extract design', 'get design system', 'design language', 'design tokens', 'what colors/fonts does this site use', 'turn this URL into design tokens', 'make a Tailwind theme from this site', or '/extract-design'. Do not use for building a new UI from scratch unless the user first wants to extract an existing website's design language."
allowed-tools: Bash, Read, Write, Glob
---

# Extract Design Language

Extract the complete design language from any website URL. Generates 8 output files covering colors, typography, spacing, shadows, components, breakpoints, animations, and accessibility.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your website** (yours): the link to your site or the page.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your website. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **An AI that can run commands, with Node.js:** The skill runs `npx designlang`, which downloads and runs the maker's open-source tool on your computer.
<!-- /needs -->

## Prerequisites

Ensure `designlang` is available. Install if needed:

```bash
npm install -g designlang
```

Or use npx (no install required):

```bash
npx designlang <url>
```

## Process

1. **Run the extraction** on the provided URL:

```bash
npx designlang <url> --screenshots
```

For multi-page crawling: `npx designlang <url> --depth 3 --screenshots`
For dark mode: `npx designlang <url> --dark --screenshots`

2. **Read the generated markdown file** to understand the design:

```bash
cat design-extract-output/*-design-language.md
```

3. **Present key findings** to the user:
   - Primary color palette with hex codes
   - Font families in use
   - Spacing system (base unit if detected)
   - WCAG accessibility score
   - Component patterns found
   - Notable design decisions (shadows, radii, etc.)

4. **Offer next steps:**
   - Copy `*-tailwind.config.js` into their project
   - Import `*-variables.css` into their stylesheet
   - Paste `*-shadcn-theme.css` into globals.css for shadcn/ui users
   - Import `*-theme.js` for React/CSS-in-JS projects
   - Import `*-figma-variables.json` into Figma for designer handoff
   - Open `*-preview.html` in a browser for a visual overview
   - Use the markdown file as context for AI-assisted development

## Output Files (8)

| File | Purpose |
|------|---------|
| `*-design-language.md` | AI-optimized markdown — the full design system for LLMs |
| `*-preview.html` | Visual HTML report with swatches, type scale, shadows, a11y |
| `*-design-tokens.json` | W3C Design Tokens format |
| `*-tailwind.config.js` | Ready-to-use Tailwind CSS theme |
| `*-variables.css` | CSS custom properties |
| `*-figma-variables.json` | Figma Variables import format |
| `*-theme.js` | React/CSS-in-JS theme object |
| `*-shadcn-theme.css` | shadcn/ui theme CSS variables |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker). It takes the design tokens.
- The [Page design standards checker](https://useaiblocks.com/skills/page-design-standards-checker). It takes the design tokens.
- The [Design handoff specification writer](https://useaiblocks.com/skills/developer-handoff-spec-writer). It takes the design tokens.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Additional Commands

- **Compare two sites:** `npx designlang diff <urlA> <urlB>`
- **View history:** `npx designlang history <url>`

## Options

| Flag | Description |
|------|-------------|
| `--out <dir>` | Output directory (default: `./design-extract-output`) |
| `--dark` | Also extract dark mode color scheme |
| `--depth <n>` | Crawl N internal pages for site-wide extraction |
| `--screenshots` | Capture component screenshots (buttons, cards, nav) |
| `--wait <ms>` | Wait time after page load for SPAs |
| `--framework <type>` | Generate only specific theme (`react` or `shadcn`) |
