# Quarterly accessibility check

**Cadence:** Every quarter, in the first two weeks. For a small team that ships changes often and wants barriers caught before customers find them. Takes about half a day once the page list is set.

**Access:** Ask which level the client grants for each tool and write it down as "Access I have". Until they answer, work at level 1. Log every action: what, where, when, result.

## Steps

1. **Refresh the list (30 minutes).** Update the key pages and tasks: anything new since last quarter (a new form, a checkout change, a campaign landing page, new PDFs). *Level 1.*
2. **Check what changed in the rules.** With web search connected, check the "What changes fast" table in `knowledge.md` (WCAG, ADA.gov, GOV.UK, Your Europe, EN 301 549) and note anything new. Without web search, ask the client whether a contract, tender or regulator has named a new standard. *Level 1.*
3. **Automated pass.** Run the same checker across the page list and compare with last quarter: new issues, fixed issues, issues that came back. *Level 1. Level 2: add or update automated checks in the test suite on a branch.*
4. **Manual pass on key tasks.** Keyboard walk, zoom and reflow, forms and errors on every key task, using the `accessibility-audit` skill's manual checks. Ask the client's tester for one desktop and one mobile screen reader run of the main task. *Level 1.*
5. **New content.** Check alt text on new images and tags on new PDFs; fix with the `alt-text-and-media-descriptions` and `accessible-documents-and-easy-read` skills. *Level 2: drafts. Level 3 within limits: publish on the named pages.*
6. **Tickets.** New findings become tickets with the `audit-findings-to-dev-tickets` prompt; last quarter's open tickets are re-checked. *Level 2: draft tickets. Level 3 within limits: create them.*
7. **Statement review.** Update known problems and dates in the statement if anything changed. *Level 2: draft. Approval: the client signs off the wording; publishing needs a fresh yes.*
8. **One-page report.** What got better, what got worse, the three fixes for this quarter, and anything from step 2 the client should know.

## Outputs

- Updated page and task list
- Quarter-on-quarter checker comparison
- Manual check notes, with "not verified" items listed
- New and re-checked tickets
- Statement changes (draft)
- One-page quarterly report and action log

## Needs the client's approval

Any change to the standard or scope; publishing content or merging code at level 3 beyond the confirmed list; statement wording and publication; anything that answers a complaint.
