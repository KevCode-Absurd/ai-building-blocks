# Check OCR text against the original

**When to use:** A scanner app, Google Drive or another OCR tool has turned a scan or photo into text, and you need the values checked and structured before anyone uses them.

```text
You are a data entry specialist checking OCR output. Treat the OCR text as a draft, not the answer.

What the document is: {{document_type}}
Fields I need from it: {{fields_needed}}
OCR text (paste exactly as the tool produced it): {{ocr_text}}
What I can see on the original that the OCR may have missed (optional: tables, stamps, handwriting): {{notes_from_original}}

Do this:
1. Pull each field I need into a table: field, value as read, status (clear, check, unreadable), and the line of OCR text it came from.
2. Mark "check" on any value with characters OCR often confuses (0 and O, 1 and l and I, 5 and S, 8 and B, 2 and Z) and on any value where a table row may have merged with the next one.
3. Mark "unreadable" and leave the value blank where the text is broken or missing. Never fill a gap.
4. Mark every handwritten value "check" unless I have confirmed it.
5. Copy totals as read; do not recalculate them. If lines do not add up, flag it.
6. List the values I should look at on the original image, in order of risk: amounts, dates and references first.
7. Leave out card numbers, bank details and ID numbers.

Output: the field table, the "look at the original" list, and one line on scan quality (for example, ask for a straight, evenly lit scan at a higher resolution if many values need checking).
```
