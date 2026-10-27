---
name: paperjsx
description: Generate PPTX presentations, DOCX documents, XLSX spreadsheets, and PDF reports from structured JSON input using PaperJSX.
---

# PaperJSX Document Generation

Generate professional documents from JSON layout specs. PaperJSX is generation-only — it creates new files, it does not edit existing ones.

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
