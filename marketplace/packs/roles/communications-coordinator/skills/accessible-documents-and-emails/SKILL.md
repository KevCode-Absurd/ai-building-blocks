---
name: accessible-documents-and-emails
description: Checks and fixes newsletters, emails, Word files, PDFs, posters and report pages so everyone can read them - real text not images, headings, alt text including long descriptions for charts, contrast to WCAG AA, link text that makes sense, plain language and readability, and the built-in accessibility checker - with a dated note of the legal duties that may apply in the US, UK and EU. Use before anything is sent or published, and when a reader says they could not read a message.
---

# Accessible documents and emails

An accessible message is one more people can read: on a phone, with a screen reader, zoomed in, printed in black and white, or by someone reading in a second language. This skill checks a message or document against published standards and fixes what fails.

## When to use

- Before a newsletter, email, notice, poster, form or report goes out.
- When a parent, member or colleague says they could not read something.
- When the organisation is a public body or school with accessibility duties.
- When an old PDF-only notice needs replacing.

## What you need

**Access:** level 1 to read the draft, template or published page. Level 2 to fix a copy, the email template or a draft page. Level 3 to update the live template or page within the client's limits; replacing a published document always needs a fresh yes.

- The draft or file, and where it will be published or sent.
- The images and charts with their purpose.
- The organisation's colours and fonts.
- Whether the organisation is a public body, school or service with accessibility duties.

## Steps

1. **Choose the format.** If people need to find it later, publish a web page and link to it; GOV.UK treats a new PDF as a last resort and publishes an HTML version alongside any PDF. Forms people must fill in should not be image scans.
2. **Structure.** Use real heading styles in order (one main title, then sub-headings, no skipped levels), real lists and simple tables with header rows. In email templates, check the language is set and layout tables are marked as presentation; the 2026 Email Markup Consortium report found these among the most common failures.
3. **Text, not pictures of text.** Any poster or flyer pasted as an image needs its words in the message as real text.
4. **Alt text.** For each image ask what it adds. Informative: a short description of that meaning. Decorative: empty alt. Linked: say where the link goes. Charts: a short alt that names the chart, plus the key figures in the text or a table nearby (W3C alt decision tree and complex images tutorial).
5. **Contrast and colour.** Text needs at least 4.5:1 against its background, or 3:1 for large text (18 point, or 14 point bold) under WCAG 2.2 AA. Never carry meaning by colour alone ("items in red are due").
6. **Links.** Each link says where it goes or what it does ("Download the term dates"), not "click here" or a bare web address. Several links with the same text and different targets fail.
7. **Fonts and layout.** Sans serif, at least 12 point in documents, left-aligned, sentence case, no long stretches of capitals or italics, single column where possible.
8. **Plain language.** Split sentences over 25 words, use familiar words, explain terms. Run Word's readability statistics as a check; Microsoft suggests about grade 7.0 to 8.0 for most documents. Read the result aloud: formulas cannot tell if it makes sense.
9. **Run the checker.** Use the tool's own accessibility checker (Word, Excel, PowerPoint and Outlook have Microsoft's Accessibility Checker; many email tools have one) and fix every error and warning, or record why not.
10. **Phone test.** Preview on a phone: does the main point show without scrolling, and do the buttons work with a thumb?
11. **Note the duties, with dates.** US: the ADA Title II rule sets WCAG 2.1 AA for state and local governments and public schools, with compliance from 26 April 2027 or 26 April 2028 depending on population (as extended in April 2026). UK: public sector websites and apps must meet WCAG 2.2 AA; schools and nurseries are partly exempt but must publish an accessibility statement. EU: the European Accessibility Act has applied since 28 June 2025 to listed services such as e-commerce and banking. The client's adviser confirms which apply.

## Checks

- Real headings, lists and table headers.
- Every image has suitable alt text; charts have the key figures in text.
- Contrast passes; no meaning by colour alone.
- Every link makes sense on its own.
- Sentences over 25 words split; terms explained.
- Accessibility checker run, with results recorded.
- Readable on a phone.

## Output format

1. Check table: item, standard, pass or fail, fix made or needed.
2. The fixed text, alt text and long descriptions.
3. Checker results and anything left open, with the reason.
4. A dated note of duties that may apply, for the client's adviser to confirm.

## Example of good output (short)

*Little Acorns Nursery is a made-up nursery used only to show the format.*

| Item | Standard | Result | Fix |
|---|---|---|---|
| Fees poster pasted as an image | Real text, not images of text | Fail | Fee dates and amounts added as text under the image |
| "Click here" (3 links) | Link purpose | Fail | Now "Pay fees online", "Read the illness policy", "Book a parents' meeting" |
| Light grey text on white | Contrast 4.5:1 | Fail (2.3:1) | Changed to dark grey (passes) |
| Photo of sports day | Alt text | Fixed | "Children running a sack race on the field" (consent checked) |
| Attendance chart | Complex image | Fixed | Alt: "Bar chart of attendance by month, autumn term." Text below gives each month's figure |
| Readability | About grade 7 to 8 | Grade 11 before, 7.6 after | Long sentences split, "remittance" changed to "payment" |
