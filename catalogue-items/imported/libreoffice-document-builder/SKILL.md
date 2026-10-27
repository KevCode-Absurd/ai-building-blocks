---
name: writer
description: "Document creation, format conversion (ODT/DOCX/PDF), mail merge, and automation with LibreOffice Writer."
category: document-processing
risk: safe
source: personal
date_added: "2026-02-27"
---

# LibreOffice Writer

## Overview

LibreOffice Writer skill for creating, editing, converting, and automating document workflows using the native ODT (OpenDocument Text) format.

## When to Use This Skill

Use this skill when:
- Creating new documents in ODT format
- Converting documents between formats (ODT <-> DOCX, PDF, HTML, RTF, TXT)
- Automating document generation workflows
- Performing batch document operations
- Creating templates and standardized document formats

## What you need first

- LibreOffice installed. Check with `soffice --version`. On Windows, `soffice` may not be on the PATH: use the full path, such as `"C:\Program Files\LibreOffice\program\soffice.exe"`.
- An AI that can run commands and save files. Without that, give the user the commands to run themselves and say what each one does.
- Python 3 for the template and odfpy methods (optional).

## If something is missing

- No content or description of the document: ask for it. Do not invent facts, names, prices or dates.
- Mail merge with no list of names or values: ask for the file. Do not make up rows.
- No output format named: ask which one (ODT, DOCX, PDF, HTML, RTF, TXT or EPUB). Default to ODT only if the user says "any".
- LibreOffice not found: stop and say so. Do not pretend a file was made.

## Core Capabilities

### 1. Document Creation
- Create new ODT documents from scratch
- Generate documents from templates
- Create mail merge documents
- Build forms with fillable fields

### 2. Format Conversion
- ODT to other formats: DOCX, PDF, HTML, RTF, TXT, EPUB
- Other formats to ODT: DOCX, DOC, RTF, HTML, TXT
- Batch conversion of multiple documents

### 3. Document Automation
- Template-based document generation
- Mail merge with data sources (CSV, spreadsheet, database)
- Batch document processing
- Automated report generation

### 4. Content Manipulation
- Text extraction and insertion
- Style management and application
- Table creation and manipulation
- Header/footer management

### 5. Integration
- Command-line automation via soffice
- Python scripting with UNO
- Integration with workflow automation tools

## Workflows

### Creating a New Document

#### Method 1: Command-Line
`soffice --writer template.odt` only opens a LibreOffice window for you to edit by hand. It does not build a file from a description. To build files without a window, use Method 2 (UNO), Method 3 (odfpy), the template method below, or the headless conversion commands.

#### Method 2: Python with UNO

Start LibreOffice in listening mode first, in a separate terminal, and leave it running:
```bash
soffice --headless --accept="socket,host=localhost,port=8100;urp;"
```
Then run the script with the Python that ships with LibreOffice (or one with `python3-uno` installed). If the connection is refused, the listener is not running: start it and retry.
```python
import uno
from com.sun.star.beans import PropertyValue

def make_prop(name, value):
    prop = PropertyValue()
    prop.Name = name
    prop.Value = value
    return prop

def create_document():
    local_ctx = uno.getComponentContext()
    resolver = local_ctx.ServiceManager.createInstanceWithContext(
        "com.sun.star.bridge.UnoUrlResolver", local_ctx
    )
    ctx = resolver.resolve(
        "uno:socket,host=localhost,port=8100;urp;StarOffice.ComponentContext"
    )
    smgr = ctx.ServiceManager
    # Open a new, empty Writer document through the Desktop service
    desktop = smgr.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)
    doc = desktop.loadComponentFromURL("private:factory/swriter", "_blank", 0, (make_prop("Hidden", True),))
    text = doc.Text
    cursor = text.createTextCursor()
    text.insertString(cursor, "[YOUR TEXT HERE]", 0)
    # Save as ODT. Change the path to where you want the file.
    doc.storeToURL("file:///path/to/document.odt", (make_prop("FilterName", "writer8"),))
    doc.close(True)
```

#### Method 3: Using odfpy
```python
from odf.opendocument import OpenDocumentText
from odf.text import P, H

doc = OpenDocumentText()
h1 = H(outlinelevel='1', text='Document Title')
doc.text.appendChild(h1)
doc.save("document.odt")
```

### Converting Documents

```bash
# ODT to DOCX
soffice --headless --convert-to docx document.odt

# ODT to PDF
soffice --headless --convert-to pdf document.odt

# DOCX to ODT
soffice --headless --convert-to odt document.docx

# Batch convert
for file in *.odt; do
    soffice --headless --convert-to pdf "$file"
done
```

### Template-Based Generation

Put placeholders such as `${name}` in the template text. Check them first: Writer can split a placeholder across XML pieces (for example if it was typed with mixed formatting), so a replacement may miss. After building, open the result or convert it to text and confirm no `${...}` is left.

An ODT file is a zip. The `mimetype` file must be the first entry and stored uncompressed, or the file will not open. The function below does that.
```python
import zipfile

def generate_from_template(template_path, variables, output_path):
    with zipfile.ZipFile(template_path) as zin, zipfile.ZipFile(output_path, "w") as zout:
        # mimetype first and uncompressed, as the ODF format requires
        zout.writestr("mimetype", zin.read("mimetype"), compress_type=zipfile.ZIP_STORED)
        for item in zin.infolist():
            if item.filename == "mimetype":
                continue
            data = zin.read(item.filename)
            if item.filename == "content.xml":
                text = data.decode("utf-8")
                for key, value in variables.items():
                    # escape &, < and > so the XML stays valid
                    safe = str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    text = text.replace("${" + key + "}", safe)
                data = text.encode("utf-8")
            zout.writestr(item.filename, data, compress_type=zipfile.ZIP_DEFLATED)
    return output_path
```

### Mail Merge from a CSV

Read the CSV with Python's `csv.DictReader`. For each row, call `generate_from_template` with that row as `variables` and save as `letter-<row number>.odt`. Convert the finished files to PDF or DOCX with the batch command above. Check one or two outputs by eye before telling the user the run is done.

```python
import csv, subprocess
from pathlib import Path

# Uses generate_from_template from the section above.
template = "template.odt"      # your template with ${name}-style markers
rows_file = "list.csv"         # one header row, one row per letter
out_dir = Path("merged")
out_dir.mkdir(exist_ok=True)

with open(rows_file, newline="", encoding="utf-8") as f:
    for number, row in enumerate(csv.DictReader(f), start=1):
        generate_from_template(template, row, str(out_dir / f"letter-{number}.odt"))

# Convert every merged file to PDF. Close LibreOffice windows first.
for odt in sorted(out_dir.glob("letter-*.odt")):
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out_dir), str(odt)], check=True)
```

Before the run, check that every column name in the CSV matches a marker in the template.

## Format Conversion Reference

### Supported Input Formats
- ODT (native), DOCX, DOC, RTF, HTML, TXT, EPUB

### Supported Output Formats
- ODT, DOCX, PDF, PDF/A, HTML, RTF, TXT, EPUB

## Command-Line Reference

```bash
soffice --headless
soffice --headless --convert-to <format> <file>
soffice --writer    # Writer
soffice --calc      # Calc
soffice --impress   # Impress
soffice --draw      # Draw
```

## Python Libraries

```bash
pip install odfpy     # ODF manipulation
pip install ezodf     # Easier ODF handling
```

## Best Practices

1. Use styles for consistency
2. Create templates for recurring documents
3. Ensure accessibility (heading hierarchy, alt text)
4. Fill document metadata
5. Store ODT source files in version control
6. Test conversions thoroughly
7. Embed fonts for PDF distribution
8. Handle conversion failures gracefully
9. Log automation operations
10. Clean temporary files

## Troubleshooting

### Conversion does nothing or hangs
A leftover LibreOffice process is the usual cause. Close LibreOffice, then check for a stuck process (`ps aux | grep soffice` on Mac and Linux, Task Manager on Windows) and stop it. Run the command again.

### Cannot open socket
Warning: the next command stops every LibreOffice process, so unsaved work in any open LibreOffice document is lost. Save and close your documents first, and use it only as a last resort.
```bash
killall soffice.bin
soffice --headless --accept="socket,host=localhost,port=8100;urp;"
```

### Conversion Quality Issues
```bash
soffice --headless --convert-to pdf:writer_pdf_Export document.odt
```

## Resources

- [LibreOffice Writer Guide](https://documentation.libreoffice.org/)
- [LibreOffice SDK](https://wiki.documentfoundation.org/Documentation/DevGuide)
- [UNO API Reference](https://api.libreoffice.org/)
- [odfpy](https://pypi.org/project/odfpy/)

## Related Skills

- calc
- impress
- draw
- base
- docx-official
- pdf-official
- workflow-automation

## What you hand back

- The finished file or files, with full paths (ODT, plus any DOCX, PDF, HTML, RTF, TXT or EPUB copies asked for).
- For a batch or merge: the count of files made and a list of any that failed. A mail merge writes one `letter-<row number>.odt` per row into a `merged` folder, and the PDF copies go in the same folder.
- The exact commands you ran, so the user can repeat them.
- A list of checks you did not run (for example, "did not open the DOCX in Word").

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
