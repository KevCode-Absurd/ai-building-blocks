---
name: form-and-workbook-layout
description: Plans pages people fill in, read or print, such as business forms (job sheets, order, inspection, intake and feedback forms, on paper or in Google Forms, Jotform, Typeform or Microsoft Forms), workbooks, worksheets, checklists, lead magnets, ebooks and creator media kits. Produces a page plan, a field list with labels, types, checks, help text and show-if rules, writing spaces sized for real handwriting, print settings, fillable PDF field lists and an accessible reading order. Use when forms come back half-filled or a Google Doc needs to look designed. Leaves legal and consent wording to the client and never invents audience numbers or partners.
---

# Form and workbook layout

Forms and workbooks share a job: someone has to read the page and write on it, on paper or on screen. Caroline Jarrett's *Forms that Work* treats a form as a conversation; the GOV.UK Design System turns that into rules: know why you ask each question, ask it once, mark optional fields "(optional)" and keep hint text short. W3C's forms tutorial adds that every field needs a visible label close to it.

## When to use

- A paper job sheet, order form or inspection form that comes back incomplete.
- Moving a paper form online (Google Forms, Jotform, Typeform, Microsoft Forms).
- A workbook, worksheet or lead magnet for coaches, courses or creators.
- An ebook interior or a creator media kit.

## What you need

- What the page is for, who fills it in or reads it, and where: on paper, a tablet, a phone, a computer, printed at home.
- The content: every question, or the workbook text (final, from the client).
- Page size (A4 or US Letter) or the online tool, and brand colours (hex) and fonts.
- For forms: what happens to each answer afterwards, and any legal, consent or terms wording the client will supply.
- For media kits: the audience numbers, partners and rates the client gives, with dates.
- Access: level 1 to read; level 2 to build an unpublished form or a "DRAFT" document; level 3 to publish a form to the audience named, which needs a fresh yes if it collects personal data from a new audience.

## Steps

1. **Read the purpose.** Write one line: who fills this in, where, and what must be captured. If a current version exists, note where it goes wrong (blank fields, wrong formats, illegible writing).
2. **List every field or section.** For forms: label, type (text, number, date, choice, tick box, signature), options, required or optional, check rule, help text, and why it is asked. Cut any field nobody uses. Turn repeated free text into choices.
3. **Order by how people think.** Group fields in the order the person fills them in on the job (customer, then site, then work done, then parts, then sign-off). For workbooks: cover, how to use, sections, worksheets, closing page with the call to action, every page numbered.
4. **Online forms.** One thing per page where it helps; ask each thing once; mark optional fields "(optional)" instead of starring required ones; hint text of one short sentence; labels visible, not only placeholders; plain error messages. Use the tool's own features: Google Forms response validation (number, text, length, pattern) with your error text; Jotform conditions to show, hide, require or skip fields and route emails. Write the build table using only field types the named tool has.
5. **Paper forms and printables.** Size writing spaces for real handwriting and test by writing in them on a printed copy; use tick boxes over free text; clear section headings; a logo placeholder; light ink coverage for home printing. For a printable built as HTML, set the paper size and margins in a print stylesheet so it prints at the right size.
6. **Fillable PDFs.** List each field with its name, type, size and tab order, so whoever builds it in their PDF editor can add it.
7. **Legal and personal data.** Leave a labelled box "[your approved wording]" for consent, privacy or terms text. Ask only for personal data the form needs and say why. Never ask for card numbers or passwords.
8. **Media kits.** Place only the numbers, partners and rates the client gave, each with its date (for example "followers as of 1 Oct 2026"); mark gaps [add].
9. **Style system.** Margins, grid, type scale with font names, heading styles, colour roles in hex with contrast checked (WCAG 4.5:1 for normal text), callout and box styles.
10. **Accessibility.** For PDFs: reading order, headings, alt text for meaningful images, labels for every field. For online forms: every control labelled.
11. **Build or hand over.** At level 1, the plan and build notes. At level 2, build the form unpublished or the document as "DRAFT". At level 3, after the confirmed action list, publish the form to the named audience and log it.
12. **Test.** Ask two people who match the users to fill it in, on the real device or paper. Fix what they hesitate over.

## Checks

- Every item in the brief has a field or a place, or is listed as cut with a reason.
- Every field has a label, a reason, a type and a check rule.
- Optional fields are marked; no asterisk soup.
- Legal and consent wording is left for the client.
- No sensitive data without a stated reason; no card numbers or passwords.
- Writing spaces tested by hand on a printed page.
- Media kit numbers and partners all come from the brief, dated.
- Page count and page size match the brief.

## Output format

1. **Purpose line** and problems with the current version.
2. **Page plan** (workbooks) or **field table** (forms): field, label, type, options, required or optional, check rule, help text, show-if rule, why asked.
3. **Layout per page:** zones, content placed, writing space sizes, image notes.
4. **Style system.**
5. **Build notes** for the named tool, or print settings.
6. **Before and after notes** for redesigns.
7. **Test plan** and open questions.

## Example of good output (short)

*Illustrative structure, not a real business: a plumbing firm with an A4 job sheet for its engineers. Copy the shape, never the content: every fact comes from the client's own context.*

**Purpose:** engineers fill in an A4 job sheet on site, by hand, often on a van bonnet; the office types it up the next day. Problems now: job numbers missing, parts written as "misc", customer signature often blank.

**Field table (extract)**

| Field | Label | Type | Required? | Check rule | Help text | Why asked |
|---|---|---|---|---|---|---|
| 1 | Job number | 6 boxes, "[PREFIX]-" printed | Required | [PREFIX]- then 4 digits | From the job card | Links to the invoice |
| 2 | Arrival time | Time, 24-hour | Required | Before departure time | | Billing |
| 7 | Parts used | Table, 8 rows: part, qty, from van or ordered | Required if parts used | Qty is a number | Write the part name, not "misc" | Stock and billing |
| 12 | Customer signature | Signature box | Required | | Ask before you leave | Proof of completion |
| 13 | Terms | [your approved wording] | | | | Client supplies |

**Layout notes:** writing boxes at least 8 mm tall for addresses; parts table rows ruled; tick boxes for "photos taken: before / after"; signature box at the bottom right, with the date beside it.
