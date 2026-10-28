---
name: calc
description: "Spreadsheet creation, format conversion (ODS/XLSX/CSV), formulas, data automation with LibreOffice Calc."
category: spreadsheet-processing
risk: safe
source: personal
date_added: "2026-02-27"
---

# LibreOffice Calc

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

LibreOffice Calc skill for creating, editing, converting, and automating spreadsheet workflows using the native ODS (OpenDocument Spreadsheet) format.

## When to Use This Skill

Use this skill when:
- Creating new spreadsheets in ODS format
- Converting between ODS, XLSX, CSV, PDF formats
- Automating data processing and analysis
- Creating formulas, charts, and pivot tables
- Batch processing spreadsheet operations

## Core Capabilities

AI Blocks note: this list is the original author's. This copy has tested steps only for creating a sheet, writing formulas and converting formats. For charts, pivot tables, forms and dashboards, say plainly that there are no tested steps, try and check the result, or tell the person to do it by hand in Calc.

### 1. Spreadsheet Creation
- Create new ODS spreadsheets from scratch
- Generate spreadsheets from templates
- Create data entry forms
- Build dashboards and reports

### 2. Format Conversion
- ODS to other formats: XLSX, CSV, PDF, HTML
- Other formats to ODS: XLSX, XLS, CSV, DBF
- Batch conversion of multiple files

### 3. Data Automation
- Formula automation and calculations
- Data import from CSV, database, APIs
- Data export to various formats
- Batch data processing

### 4. Data Analysis
- Pivot tables and data summarization
- Statistical functions and analysis
- Data validation and filtering
- Conditional formatting

### 5. Integration
- Command-line automation via soffice
- Python scripting with UNO
- Database connectivity

## Workflows

### Creating a New Spreadsheet

#### Method 1: Command-Line
```bash
soffice --calc template.ods
```

#### Method 2: Python with UNO

Setup first: start LibreOffice with its socket listener, or the code below cannot connect.

```bash
soffice --headless --accept="socket,host=localhost,port=8100;urp;"
```

AI Blocks note: this file shows no steps for building a chart. If the person asks for one, build it through UNO and check the result, or say you could not and tell them to add the chart in LibreOffice by hand.

```python
import uno
from com.sun.star.beans import PropertyValue

def prop(name, value):
    p = PropertyValue()
    p.Name, p.Value = name, value
    return p

def open_new_calc():
    """Connect to the running listener and open a new, hidden spreadsheet."""
    local_ctx = uno.getComponentContext()
    resolver = local_ctx.ServiceManager.createInstanceWithContext(
        "com.sun.star.bridge.UnoUrlResolver", local_ctx
    )
    ctx = resolver.resolve(
        "uno:socket,host=localhost,port=8100;urp;StarOffice.ComponentContext"
    )
    desktop = ctx.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)
    return desktop.loadComponentFromURL("private:factory/scalc", "_blank", 0, (prop("Hidden", True),))

def create_spreadsheet():
    doc = open_new_calc()
    sheet = doc.getSheets().getByIndex(0)
    sheet.getCellByPosition(0, 0).setString("Hello from LibreOffice Calc!")
    # calc8 is the filter name for the native ODS format
    doc.storeToURL("file:///path/to/spreadsheet.ods", (prop("FilterName", "calc8"),))
    doc.close(True)
```

This pattern is the document-creation step only. Open the saved file and check it before you call it done.

#### Method 3: Using ezodf
```python
import ezodf

doc = ezodf.newdoc('ods', 'spreadsheet.ods')
sheet = doc.sheets[0]
sheet['A1'].set_value('Hello')
sheet['B1'].set_value('World')
doc.save()
```

### Converting Spreadsheets

```bash
# ODS to XLSX
soffice --headless --convert-to xlsx spreadsheet.ods

# ODS to CSV
soffice --headless --convert-to csv spreadsheet.ods

# ODS to PDF
soffice --headless --convert-to pdf spreadsheet.ods

# XLSX to ODS
soffice --headless --convert-to ods spreadsheet.xlsx

# Batch convert
for file in *.ods; do
    soffice --headless --convert-to xlsx "$file"
done
```

### Formula Automation
This uses `open_new_calc()` and `prop()` from the block above. The numbers are placeholders for your own data.

```python
def create_formula_spreadsheet():
    doc = open_new_calc()
    sheet = doc.getSheets().getByIndex(0)

    sheet.getCellByPosition(0, 0).setDoubleValue(100)  # replace with your own value
    sheet.getCellByPosition(0, 1).setDoubleValue(200)  # replace with your own value

    cell = sheet.getCellByPosition(0, 2)
    cell.setFormula("=SUM(A1:A2)")

    doc.storeToURL("file:///path/to/formulas.ods", (prop("FilterName", "calc8"),))
    doc.close(True)
```

## Format Conversion Reference

### Supported Input Formats
- ODS (native), XLSX, XLS, CSV, DBF, HTML

### Supported Output Formats
- ODS, XLSX, XLS, CSV, PDF, HTML

## Command-Line Reference

```bash
soffice --headless
soffice --headless --convert-to <format> <file>
soffice --calc  # Calc
```

## Python Libraries

```bash
pip install ezodf     # ODS handling
pip install odfpy     # ODF manipulation
pip install pandas    # Data analysis
```

## Best Practices

1. Use named ranges for clarity
2. Document complex formulas
3. Use data validation for input control
4. Create templates for recurring reports
5. Store ODS source files in version control
6. Test conversions thoroughly
7. Use CSV for data exchange
8. Handle conversion failures gracefully

## Troubleshooting

### Cannot open socket
Warning: `killall soffice.bin` closes every LibreOffice window, and any unsaved work in them is lost. Save and close your documents first.
```bash
killall soffice.bin
soffice --headless --accept="socket,host=localhost,port=8100;urp;"
```

## Resources

- [LibreOffice Calc Guide](https://documentation.libreoffice.org/)
- [UNO API Reference](https://api.libreoffice.org/)
- [ezodf Documentation](http://ezodf.rst2.org/)

## Related Skills

- writer
- impress
- draw
- base
- xlsx-official
- workflow-automation

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Spreadsheet checker](https://useaiblocks.com/skills/spreadsheet-checker). It takes the spreadsheet.
- The [Excel workbook change reviewer](https://useaiblocks.com/skills/excel-workbook-change-reviewer). It takes the spreadsheet.
- The [Spreadsheet formula auditor](https://useaiblocks.com/skills/spreadsheet-formula-auditor). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
