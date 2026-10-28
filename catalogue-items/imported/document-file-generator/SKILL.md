---
name: paperjsx
description: Generate PPTX presentations, DOCX documents, XLSX spreadsheets, and PDF reports from structured JSON input using PaperJSX.
---

# PaperJSX Document Generation

Generate professional documents from JSON layout specs. PaperJSX is generation-only — it creates new files, it does not edit existing ones.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A draft** (yours): the ad, page, email or script you want checked or improved.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a draft, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Triggers

Use this skill when the user asks to:
- Create a presentation or generate slides
- Make a PPTX or PowerPoint file
- Create a Word document or DOCX
- Generate an Excel spreadsheet with charts
- Create a JSON to PPTX, JSON to DOCX, or JSON to XLSX file
- Generate a PDF invoice, report, or chart document

## Install

Install the format-appropriate package:

```bash
# Presentations
npm install @paperjsx/json-to-pptx

# Word documents
npm install @paperjsx/json-to-docx

# Spreadsheets
npm install @paperjsx/json-to-xlsx

# PDF documents
npm install @paperjsx/json-to-pdf
```

## How it works

1. Build a JSON layout spec matching the schema in `references/json-schema.md`
2. Write a Node.js script that passes the JSON to the PaperJSX engine
3. Run the script to generate the output file
4. Validate the output file exists and is non-zero bytes

If you have a plan or an audit report to put in the file, use it as the content.

Do not hand-draw documents with low-level PaperJSX calls. Build a JSON spec and pass it to the package's render function, as the examples below do. The execution model is always: JSON spec in, document file out.

## Example: PPTX generation

The bracketed values in these examples are placeholders. Replace them with the user's own text and real figures. Never invent numbers.

```javascript
import { PaperEngine } from "@paperjsx/json-to-pptx";
import fs from "node:fs";

const spec = {
  type: "Document",
  meta: { title: "[DECK TITLE]" },
  slides: [
    {
      type: "Slide",
      children: [
        { type: "Text", content: "[SLIDE HEADING]", style: { fontSize: 36, bold: true } }
      ]
    }
  ]
};

const buffer = await PaperEngine.render(spec);
fs.writeFileSync("presentation.pptx", buffer);
console.log("Generated presentation.pptx");
```

## Example: DOCX generation

```javascript
import { renderToDocx } from "@paperjsx/json-to-docx";
import fs from "node:fs";

const result = await renderToDocx({
  type: "DocxDocument",
  pageSize: "a4",
  orientation: "portrait",
  pages: [
    {
      elements: [
        { type: "heading", level: 1, text: "[REPORT TITLE]" },
        { type: "paragraph", text: "[SECTION TEXT]" }
      ]
    }
  ]
});

fs.writeFileSync("report.docx", result.buffer);
console.log("Generated report.docx");
```

## Example: XLSX generation

```javascript
import { SpreadsheetEngine } from "@paperjsx/json-to-xlsx";
import fs from "node:fs";

const spec = {
  meta: { title: "[SHEET TITLE]", creator: "PaperJSX" },
  sheets: [{
    name: "[SHEET NAME]",
    rows: [
      { cells: [{ value: "[COLUMN 1 HEADING]" }, { value: "[COLUMN 2 HEADING]" }] },
      { cells: [{ value: "[ROW 1 LABEL]" }, { value: "[ROW 1 NUMBER]" }] },
      { cells: [{ value: "[ROW 2 LABEL]" }, { value: "[ROW 2 NUMBER]" }] }
    ]
  }]
};

const buffer = await SpreadsheetEngine.render(spec);
fs.writeFileSync("sheet.xlsx", buffer);
console.log("Generated sheet.xlsx");
```

## Example: PDF generation

No PDF code sample is included in this skill. The PDF fields (invoice, report and chart document) are listed in `references/json-schema.md`. Check the `@paperjsx/json-to-pdf` package's own documentation for its render call, and say so to the user instead of guessing the call.

## Validation

After generating any file, always verify:

```javascript
import fs from "node:fs";

const stats = fs.statSync("output.pptx");
if (stats.size === 0) {
  throw new Error("Generated file is empty");
}
console.log(`Output file: ${stats.size} bytes`);
```

If the engine throws an error, surface the full error message to the user.

## Schema reference

See `references/json-schema.md` for the complete JSON layout spec schema for all supported formats.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Excel to PowerPoint number checker](https://useaiblocks.com/skills/excel-powerpoint-number-checker). It takes the slide deck and spreadsheet.
- The [LibreOffice document builder](https://useaiblocks.com/skills/libreoffice-document-builder). It takes the document.
- The [PowerPoint audience handout builder](https://useaiblocks.com/skills/powerpoint-audience-handout-builder). It takes the slide deck.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
