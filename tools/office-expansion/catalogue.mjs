// Original non-financial Office methods. Financial modelling belongs to the
// separate finance batch; these entries work with operational and teaching files.
const skill = (slug, name, app, role, summary, need, output, method, checks, cases, ports = {}) => ({ slug, name, app, role, summary, need, output, method, checks, cases, ...ports });
export const skills = [
  skill('excel-input-form-builder', 'Excel input form builder', 'Excel', 'build',
    'Share your fields and allowed values. Get an Excel input form with dropdowns, clear entry cells and validation checks.',
    'Field names, data types, allowed values, required fields, record key and intended Excel version.',
    'input-form.xlsx and field-rules.md, with an empty production table and a separate illustrative test copy.', [
      'Reuse confirmed field definitions. Distinguish text identifiers, dates, quantities, blanks and valid zero values. Ask only for unresolved rules that change validation.',
      'Create one record per row in a native Excel table. Store IDs as text, keep dates typed and reserve separate columns for inputs and calculated results.',
      'Add bounded dropdowns or named-list validation and understandable error messages. Check required fields and duplicate keys with visible diagnostics; pasted data can bypass validation.',
      'Use a restrained input fill, freeze the table header and preserve existing formulas. Lock calculation cells only if requested, explaining that worksheet protection is not encryption.',
      'Test valid, missing, duplicate and pasted-invalid records in a disposable copy. Reopen the saved workbook and deliver the empty form with its rules and unresolved limitations.'
    ], ['No invented production records.', 'Blank and zero obey the supplied rules.', 'Validation survives save/reopen or its unverified status is stated.'],
    [{input:'Record ID 0012, quantity 0 allowed, status Open or Closed',expected:'Keep 0012 as text and 0 as a valid number; restrict the status list.'},{input:'Two pasted records share the same required ID',expected:'Flag both as duplicate candidates; do not silently delete either.'}]),
  skill('excel-table-join-reconciler', 'Excel table join reconciler', 'Excel', 'check',
    'Share two Excel tables and their matching keys. Get a reconciled join with unmatched rows and duplicate keys explained.',
    'Both source tables, key definitions, expected one-to-one or one-to-many relationship, reporting period and required outputs.',
    'joined-tables.xlsx, unmatched-rows.csv and join-checks.md.', [
      'Preserve both sources. Define the grain of each table, composite keys and the intended join. Keep leading zeros and meaningful case or whitespace unless normalization is approved.',
      'Count null keys and key multiplicity on both sides before joining. Stop a requested one-to-one join when duplicate keys make the match ambiguous.',
      'Build the approved join using supported Excel formulas, Power Query or a local data tool. Keep source row IDs and expose one-to-many expansion instead of choosing the first match.',
      'Produce left-only, right-only, matched and ambiguous records. Reconcile record counts and additive totals at the correct grain; never sum a duplicated parent measure after an expanded join.',
      'Recalculate and test a new key, an unmatched key and a duplicated key. Deliver the new workbook plus the exact join rule and exceptions; do not refresh external systems.'
    ], ['Expected cardinality is checked before the join.', 'Unmatched records are retained.', 'Control totals use the original grain.'],
    [{input:'Orders have one row per order; lines have three rows for one order',expected:'Allow an explicit one-to-many join; do not triple-count the order total.'},{input:'A required customer key maps to two distinct customers',expected:'Stop the ambiguous match and return both source locations.'}]),
  skill('excel-monthly-rollup-builder', 'Excel monthly rollup builder', 'Excel', 'build',
    'Share dated operational records. Get an Excel monthly summary with traceable counts, totals and rates.',
    'Dated source records, record grain, inclusion rules, timezone, month boundaries and definitions of requested measures.',
    'monthly-summary.xlsx and metric-definitions.md.', [
      'Confirm whether each row is an event, entity or snapshot. Use the supplied timezone and explicit inclusive-start/exclusive-end reporting boundaries.',
      'Keep original rows in one source table and preserve source IDs. Convert genuine numeric and date fields without changing text identifiers or interpreting missing values as zero.',
      'Build a compact monthly output using COUNTIFS, SUMIFS or a supported equivalent. Calculate a rate from matching aggregate numerator and denominator, with a stated zero-denominator rule.',
      'Include months with no eligible activity when the brief requires them. Reconcile each monthly result to source rows and check that totals do not count subtotal or duplicate rows twice.',
      'Change a value and add a boundary-date record in a disposable test copy. Recalculate, verify the intended range extension and render the output before delivering the workbook.'
    ], ['Month boundaries are unambiguous.', 'Rates use matching populations.', 'Input changes update formulas rather than static copied totals.'],
    [{input:'January records total 12 completed of 20 eligible; February 3 of 10',expected:'Show 60% and 30%; the combined completion rate is 15/30, not 45%.'},{input:'A record falls exactly at 1 February 00:00 in the chosen timezone',expected:'Count it in February only.'}]),
  skill('excel-workbook-change-reviewer', 'Excel workbook change reviewer', 'Excel', 'check',
    'Share the old and revised workbook. Get a review of changed values, formulas, names and workbook features.',
    'Baseline and revised workbook, intended changes, sheet/key mapping and materiality or tolerance rules.',
    'workbook-change-review.xlsx and change-register.md.', [
      'Hash and preserve both files. Inventory sheets, hidden states, tables, defined names, formulas, links, validations, charts, pivots and macro presence without executing macros or refreshing connections.',
      'Match records by confirmed stable keys, not by row position alone. Align changed sheet names and separate added, removed and reordered records.',
      'Compare input values and formula text separately. Distinguish a formula edit, a formula replaced with a constant, a changed reference and a result changed by upstream inputs.',
      'Review changed names, validation ranges, hidden sheets, print settings, external links and data connections. State features the inspection tool cannot preserve or compare.',
      'Recalculate supported copies and investigate material differences using the agreed tolerance. Report file, sheet and cell or object locations with before/after evidence; make no repairs unless requested.'
    ], ['Reordering is not reported as every record changing.', 'Formulas and cached values are distinguished.', 'Uninspected native features stay explicit.'],
    [{input:'A row moved but its ID, value and relative formula meaning are unchanged',expected:'Record a reorder, not a fabricated business change.'},{input:'A formula cell is replaced with its current numeric result',expected:'Flag a formula-to-constant change even if the displayed number is unchanged.'}]),
  skill('excel-print-layout-fixer', 'Excel print layout fixer', 'Excel', 'build',
    'Share a workbook and paper size. Get printable sheets with readable columns, repeated headers and checked page breaks.',
    'Workbook, sheets to print, paper size, orientation, required columns and any existing print requirements.',
    'print-ready.xlsx, a PDF review copy when a renderer is available, and print-checks.md.', [
      'Inspect existing print areas, titles, page setup, hidden rows and columns, manual breaks, headers and footers. Keep original data and formulas unchanged.',
      'Choose bounded print areas containing all requested records and columns. Disjoint print areas can create separate pages; document intentional exclusions.',
      'Set paper size, orientation, margins and repeated table-header rows. Prefer fitting width while allowing multiple pages in height instead of shrinking everything onto one unreadable page.',
      'Check wrapped labels, numeric formats, subtotals, footnotes and page breaks. Avoid cutting a record or chart at an unintended boundary.',
      'Render or inspect print preview in the intended application and check first, middle and final pages. If no print renderer is available, deliver the workbook settings with the preview check marked not run.'
    ], ['All requested records are inside the print area.', 'Headers repeat where needed.', 'A PDF or preview is never claimed when not generated.'],
    [{input:'A wide 400-row table is requested on A4 landscape',expected:'Fit the width and retain multiple pages vertically; verify header repetition.'},{input:'Two nonadjacent print areas were set accidentally',expected:'Flag separate-page output and confirm the intended continuous area.'}]),
  skill('excel-handover-guide-writer', 'Excel workbook handover writer', 'Excel', 'write',
    'Share a working workbook and its update process. Get a guide explaining inputs, formulas, refresh steps and known limits.',
    'The actual workbook, source-file locations supplied with permission, update process, target Excel version and intended next owner.',
    'workbook-handover.md, a dependency inventory and an unchanged source workbook.', [
      'Read existing documentation and confirmed context before asking for information. Inspect actual sheets, formulas, names and connections to distinguish observed behavior from the owner’s description.',
      'Map each input to its source, unit, period and expected grain. Record access requirements without copying passwords, tokens or private connection strings.',
      'Trace important outputs to their owning formulas and inputs. Explain deliberate overrides and the difference between blank, zero and missing data.',
      'Write the real update sequence, validation controls, stop conditions and recovery from a failed refresh. Mark unexecuted steps as instructions rather than completed tests.',
      'Have the guide point to exact sheets, ranges and safe example files. Preserve the original workbook and leave unresolved dependencies or ownership decisions clearly listed.'
    ], ['Instructions match inspected features.', 'Credentials are excluded.', 'Refresh and recalculation claims have actual evidence.'],
    [{input:'The owner says Refresh All updates a query, but no refresh engine is available',expected:'Describe the observed connection and required refresh sequence; mark execution not run.'},{input:'An output depends on a missing external workbook',expected:'List the exact unresolved dependency and affected outputs.'}], { outputPorts:['document'] }),
  skill('excel-pivot-refresh-planner', 'Excel PivotTable refresh planner', 'Excel', 'plan',
    'Share a workbook with PivotTables. Get a refresh sequence, source checks and a list of stale or unsupported outputs.',
    'The workbook, approved source data, PivotTable definitions, filters, grouping rules and access to the intended Excel engine if refresh is requested.',
    'pivot-refresh-plan.md and source-checks.csv; a refreshed copy only when an actual supported engine executes it.', [
      'Inventory PivotTables, caches, source ranges, queries, data model connections, filters, slicers and calculated fields. Preserve unsupported objects instead of rebuilding the file through a lossy library.',
      'Verify source headers, record grain, date types, new rows, duplicate keys and the expected coverage period. Distinguish a fixed source range from a table that expands.',
      'Order source updates before dependent cache and PivotTable refreshes. Identify protected, missing or external sources and stop before any unapproved external access.',
      'If a real Excel-compatible refresh engine is available and authorized, refresh a copy and record its status. Otherwise deliver a concrete native-application procedure and mark all refresh execution not run.',
      'After an actual refresh, reconcile source totals and filter state, inspect cached period labels and verify a new source record reaches the appropriate output. A saved cache alone does not prove a successful refresh.'
    ], ['No claim that a JSON summary or exported cache is a native refresh.', 'Filters and slicers are recorded.', 'New source rows are checked explicitly.'],
    [{input:'The source table gained a new month but the pivot cache still ends last month',expected:'Flag stale coverage and specify a real refresh check.'},{input:'Only a Python library with unreliable pivot preservation is available',expected:'Keep the original file intact and return the native refresh plan.'}], { outputPorts:['document','audit_report'] }),
  skill('excel-powerpoint-number-checker', 'Excel to PowerPoint number checker', 'Excel and PowerPoint', 'check',
    'Share a workbook and its slides. Get a source map showing which slide numbers, charts and labels agree with Excel.',
    'The actual workbook, PPTX deck, approved cell-to-slide mapping or enough source context to establish it, period and rounding rules.',
    'slide-number-checks.csv and number-review.md; revised files only if repair is requested.', [
      'Preserve both source files and identify the workbook version used by the deck. Inspect formulas, saved values and actual chart data without silently refreshing external links.',
      'Map each displayed metric to a workbook sheet/range and eligible population. Distinguish counts, rates, currency, units, actuals and forecasts.',
      'Compare slide text, table values and native chart categories/series to matching workbook results. Respect stated scaling and rounding; a matching total does not prove matching categories.',
      'Flag changed periods, swapped labels, stale embedded chart data and inconsistent units. Classify screenshot-only charts as visually inspectable but not editable or data-verified without source data.',
      'Return exact slide/object and workbook/cell evidence, tolerance and mismatch reasons. If repairing, update editable objects, render affected slides and check the saved PPTX again.'
    ], ['Every checked metric has a source mapping.', 'Rounding is separated from a real discrepancy.', 'Screenshot charts are not treated as verified native data.'],
    [{input:'Workbook completion is 15/30; slide shows 45%',expected:'Report a mismatch: expected 50% for the same population.'},{input:'Workbook values are in thousands but the slide label says units',expected:'Flag a unit mismatch even when digits are identical.'}], { inputPorts:['brief','spreadsheet','slide_deck'], outputPorts:['audit_report'] }),
  skill('powerpoint-template-populator', 'PowerPoint template populator', 'PowerPoint', 'build',
    'Share your PowerPoint template and approved content. Get an editable deck that follows its layouts and placeholder rules.',
    'Actual PPTX template, approved text and data, slide outline, required layouts, dimensions and licensed assets.',
    'populated-template.pptx, a source map and rendered slide previews.', [
      'Inspect the real template’s masters, layouts, placeholders, theme fonts, slide dimensions, footers and any existing content that must remain.',
      'Map each outline section to a suitable existing layout and placeholder. Reuse the template’s typography, hierarchy and alignment instead of overlaying a different design.',
      'Populate native editable text, tables and charts from approved sources. Keep source numbers, units and categories intact; do not flatten required evidence into slide images.',
      'Handle overflow by shortening approved wording or using an appropriate additional layout within the requested slide count. Never crop text or shrink it until unreadable.',
      'Save a separate PPTX, inspect all rendered slides and compare representative outputs to the template. Check that placeholders, fonts and editable objects survive reopening.'
    ], ['A real template is inspected before reuse.', 'No unresolved placeholders remain.', 'Required evidence stays editable.'],
    [{input:'A template has title/content and section layouts with a fixed 16:9 size',expected:'Map the outline to those layouts and retain dimensions.'},{input:'Approved text overflows a placeholder',expected:'Revise within scope or ask about the slide limit; do not silently cut text.'}], { inputPorts:['brief','slide_deck','source_text'], outputPorts:['slide_deck'] }),
  skill('powerpoint-speaker-note-builder', 'PowerPoint speaker notes builder', 'PowerPoint', 'write',
    'Share your deck and talk length. Get slide notes with source references, transitions and a realistic rehearsal plan.',
    'Actual deck, audience, talk duration, source evidence and the speaker’s preferred style.',
    'deck-with-notes.pptx and a rehearsal timing sheet.', [
      'Read each slide and its existing notes. Reuse confirmed audience, purpose and speaker context, preserving approved messages and existing citations.',
      'Write a brief spoken explanation for each slide rather than reading every bullet verbatim. Explain the evidence, relevant caveat and transition to the next slide.',
      'Link claims and figures to supplied sources in the notes. Keep uncertain material labeled, and do not invent anecdotes, user stories or audience reactions.',
      'Allocate a draft timing budget across slides, questions and transitions. Label it as a rehearsal estimate until a real timed run is available.',
      'Save native speaker notes without changing visible slide content unnecessarily. Reopen the PPTX, verify note-to-slide alignment and remove private presenter-only material from any requested audience copy.'
    ], ['Notes remain attached to the correct slide.', 'Timing estimates are not described as a completed rehearsal.', 'Audience copies follow the requested notes policy.'],
    [{input:'Eight-minute talk with six content slides and two minutes for questions',expected:'Budget six minutes for the content and label the draft timing estimate.'},{input:'A slide number changed during reordering',expected:'Attach the note to the actual slide identity, not the old ordinal alone.'}], { inputPorts:['brief','slide_deck'], outputPorts:['slide_deck','document'] }),
  skill('powerpoint-appendix-navigator', 'PowerPoint appendix navigator', 'PowerPoint', 'build',
    'Share a deck with backup slides. Get an appendix index and tested links back to the relevant main slides.',
    'Actual deck, main-story and appendix boundaries, desired navigation labels and presentation environment.',
    'navigable-deck.pptx and a link-test register.', [
      'Inventory slides by stable presentation IDs as well as visible titles. Identify main slides, section starts and genuine backup evidence.',
      'Create a concise appendix index using actual slide titles and useful topic groupings. Keep existing slide order unless a reorder is explicitly requested.',
      'Add native internal hyperlinks to backup slides and return links to the related main slide or index. Avoid file-system paths and private external URLs.',
      'Resolve hyperlink targets against actual saved slide relationships. Check renamed or reordered slides by identity instead of assuming the displayed number remains stable.',
      'Test navigation in the intended presentation engine when available and record each tested path. Render the index and backup slides; keep links useful in a PDF only when the export preserves them.'
    ], ['All internal targets exist.', 'Return links go to the intended context.', 'PPTX and PDF navigation are verified separately.'],
    [{input:'A new slide was inserted ahead of appendix slide 12',expected:'Preserve the link to the same backup slide identity.'},{input:'A target backup slide was removed',expected:'Flag or repair the broken target instead of linking to the next ordinal.'}], { inputPorts:['brief','slide_deck'], outputPorts:['slide_deck','audit_report'] }),
  skill('powerpoint-slide-size-converter', 'PowerPoint slide size converter', 'PowerPoint', 'build',
    'Share a deck and target slide size. Get a reflowed PowerPoint copy with checked text, charts and image crops.',
    'Actual PPTX, target dimensions, fixed branding requirements, images and the original layout or template.',
    'resized-deck.pptx, before/after previews and a layout-change register.', [
      'Record original slide dimensions, masters, safe margins, object bounds, image crops and editable chart/table requirements.',
      'Set the intended new canvas in a copy and choose a layout rule for each slide. Reflow text and related objects rather than uniformly stretching the whole slide.',
      'Preserve image aspect ratios and inspect crops. Reposition native charts and tables while preserving values, labels, legends and font sizes appropriate to the new canvas.',
      'Review every slide for overlaps, out-of-bounds elements, clipped text, orphaned labels and inconsistent headers or footers. Use the template rules where they exist.',
      'Render every changed slide and compare it with the original. Verify saved dimensions and editable objects after reopening; report layouts that need a human decision.'
    ], ['Dimensions match the requested canvas.', 'Images are not stretched.', 'Each slide is inspected after reflow.'],
    [{input:'A 4:3 deck must become 16:9',expected:'Reflow content and preserve proportions, not a horizontal stretch.'},{input:'A chart legend falls beyond the new slide boundary',expected:'Reposition or relayout it and render again.'}], { inputPorts:['brief','slide_deck'], outputPorts:['slide_deck'] }),
  skill('powerpoint-chart-data-rebuilder', 'PowerPoint editable chart rebuilder', 'PowerPoint', 'build',
    'Share chart source data and your deck. Get native editable PowerPoint charts with matched labels and numbers.',
    'Actual deck, complete approved chart data, categories, series, units, chart type and source citations.',
    'editable-charts.pptx, embedded chart workbooks where required, and a chart-data comparison.', [
      'Inspect the original chart or image and obtain its actual source data. Pixels alone are insufficient for exact values; stop or request data instead of inventing a series.',
      'Define categories, series order, missing values, axis units and intended comparison. Preserve zeros and gaps according to the source meaning.',
      'Create a native chart and its editable data using supported PPTX tooling. Use a literal data snapshot only when that is the approved requirement; do not imply a live Excel connection.',
      'Compare every category and series value with the source, including sign, scale, rounding and totals. Check any embedded workbook and formulas required by the task.',
      'Render the slide to inspect axes, legends and data labels. Reopen the deck and verify the chart is editable; retain the source map and state any unsupported native feature.'
    ], ['No invented values from a screenshot.', 'Chart data agrees at category and series level.', 'Snapshots and live links are distinguished.'],
    [{input:'Only a PNG of a bar chart is provided',expected:'Request the data or offer a clearly labeled approximate transcription for approval; never claim exact reconstruction.'},{input:'Two categories are swapped while the total remains the same',expected:'Fail the data comparison.'}], { inputPorts:['brief','slide_deck','spreadsheet'], outputPorts:['slide_deck','audit_report'] }),
  skill('powerpoint-deck-change-reviewer', 'PowerPoint deck change reviewer', 'PowerPoint', 'check',
    'Share old and revised decks. Get a review of changed messages, charts, notes, links and slide order.',
    'Baseline and revised PPTX files, intended changes and source evidence for revised facts.',
    'deck-change-register.md, comparison previews and unresolved issues.', [
      'Preserve and inventory both decks, including slide IDs, titles, dimensions, notes, comments, hidden slides, links and embedded data.',
      'Match slides by stable identity and content evidence, with explicit confidence for rebuilt decks. Distinguish slide moves from additions, deletions and meaningful revisions.',
      'Compare visible text, native chart/table data and source labels. Review whether a changed title alters the claim or an apparent style edit hides a changed number.',
      'Inspect speaker notes, comments, hidden slides and external links for unintended changes or sensitive content. Do not delete these objects without permission.',
      'Render changed slides and examine visual differences. Return before/after evidence and exact locations, separating automated findings from manual or unrun native checks.'
    ], ['Reordered slides are matched correctly.', 'Notes and hidden content are included in the review scope.', 'Visual and data changes are distinguished.'],
    [{input:'The same slide moved from position 3 to 8',expected:'Record a move without inventing changed content.'},{input:'Visible slides match but a hidden slide contains an outdated private forecast',expected:'Flag the hidden-content difference for review.'}], { inputPorts:['brief','slide_deck'], outputPorts:['audit_report'] }),
  skill('powerpoint-accessibility-reviewer', 'PowerPoint accessibility reviewer', 'PowerPoint', 'check',
    'Share your deck. Get specific fixes for slide titles, reading order, alternative text and readable visual content.',
    'Actual PPTX, audience needs, intended presentation app and available source images or chart data.',
    'accessibility-review.md and a remediated PPTX copy when editing is requested and supported.', [
      'Inspect actual slide titles, native object order, text sizes, color use, images, tables and charts. Record the target PowerPoint version and which checks the tool can perform.',
      'Give slides useful titles and verify logical reading order in PowerPoint’s Reading Order pane when available. Mark purely decorative objects appropriately instead of treating visual position as proof of reading order.',
      'Write concise alternative text from the image or chart’s actual purpose and evidence. Preserve meaningful labels and table headers, and avoid unsupported interpretations of a visual.',
      'Check contrast, text legibility, information conveyed only by color, link labels and animation-dependent meaning. Inspect rendered slides as well as document structure.',
      'Run the intended application’s accessibility checker and a relevant keyboard or screen-reader spot check when available. State unrun checks and unresolved findings; never equate an XML scan with full accessibility compliance.'
    ], ['Structural and visual checks are recorded separately.', 'Reading order is not inferred from coordinates alone.', 'No unsupported compliance certification.'],
    [{input:'The first object in reading order is a decorative background',expected:'Inspect the actual accessibility order and mark the decoration appropriately.'},{input:'The chart only distinguishes series by red and green',expected:'Require an additional readable distinction such as labels or patterns.'}], { inputPorts:['brief','slide_deck'], outputPorts:['audit_report','slide_deck'] }),
  skill('powerpoint-audience-handout-builder', 'PowerPoint audience handout builder', 'PowerPoint', 'build',
    'Share a deck and sharing rules. Get a readable audience handout with the right notes and private material excluded.',
    'Actual PPTX, handout format and page size, audience, notes policy and explicit treatment of hidden slides, comments and personal information.',
    'audience-handout.pdf or another requested supported format, plus an unchanged presenter source and a sharing checklist.', [
      'Inspect the deck, speaker notes, comments, hidden slides, linked files and supplied sharing instructions. Resolve missing disclosure rules before removing or including sensitive material.',
      'Choose readable slides-per-page or notes-page layouts suited to the requested format. Retain chart labels, source notes and essential caveats without shrinking the deck into illegible thumbnails.',
      'Make an audience copy under the approved notes and hidden-slide policy. Preserve the original presenter deck and report any content deliberately excluded.',
      'Export through a real supported renderer. Inspect first, middle and last pages, tables, crops, page numbers and any links the audience needs.',
      'Check that the saved audience file contains the intended pages and no excluded notes or hidden content. Deliver files locally; do not email, upload or publish them without separate authorization.'
    ], ['Presenter and audience versions are separate.', 'Excluded content is checked in the actual export.', 'A PDF is delivered only after a real export and review.'],
    [{input:'Presenter notes contain private negotiation limits, and the audience copy excludes notes',expected:'Keep them in the presenter source and verify they are absent from the audience PDF.'},{input:'A six-slides-per-page export makes chart labels unreadable',expected:'Use fewer slides per page or an approved alternative layout.'}], { inputPorts:['brief','slide_deck'], outputPorts:['document'] })
];
export const workflows = [
  {slug:'prepare-an-excel-input-workbook-for-handover',name:'Prepare an Excel input workbook for handover',summary:'Share your field rules. Get a checked input workbook and a guide for the next person who will maintain it.',inputPorts:['brief'],outputPorts:['spreadsheet','document'],steps:[['excel-input-form-builder','Build and validate the empty native input table from confirmed field rules; keep valid, missing and duplicate test records in a separate illustrative copy.'],['excel-handover-guide-writer','Document the actual delivered form, allowed entries, calculated fields, validation limits and update steps.']]},
  {slug:'build-a-monthly-excel-and-powerpoint-update',name:'Build a monthly Excel and PowerPoint update',summary:'Share dated records and a slide template. Get a monthly workbook, editable update deck and source-number checks.',steps:[['excel-monthly-rollup-builder','Create monthly summaries from the actual reporting population and preserve record IDs, month boundaries and rate definitions.'],['powerpoint-template-populator','Populate the actual supplied template with the checked monthly outputs, keeping charts and tables editable.'],['excel-powerpoint-number-checker','Match every displayed monthly metric to the delivered workbook and fail stale periods, swapped categories or inconsistent units.'],['powerpoint-speaker-note-builder','Add source-linked speaking notes and an estimated timing budget without altering verified figures.']]},
  {slug:'prepare-a-powerpoint-deck-for-presenting-and-sharing',name:'Prepare a PowerPoint deck for presenting and sharing',summary:'Share your deck and sharing rules. Get appendix navigation, speaker notes, accessibility findings and an audience handout.',steps:[['powerpoint-appendix-navigator','Index actual backup evidence and test internal and return links in the intended presentation environment.'],['powerpoint-speaker-note-builder','Add concise source-linked presenter notes with an estimated timing budget.'],['powerpoint-accessibility-reviewer','Inspect logical reading order, titles, labels, contrast and alternative text; state native checks that could not run.'],['powerpoint-audience-handout-builder','Export the authorized audience copy under the explicit notes, hidden-content and confidentiality rules; preserve the presenter source.']]},
  {slug:'review-revised-excel-and-powerpoint-files',name:'Review revised Excel and PowerPoint files',summary:'Share old and new workbooks and decks. Get a version-change register and checks that the new slides match the new workbook.',steps:[['excel-workbook-change-reviewer','Compare baseline and revised workbook using stable record keys and the intended change list; retain formula and feature differences.'],['powerpoint-deck-change-reviewer','Compare baseline and revised deck by slide identity, including visible content, notes, hidden slides and embedded data.'],['excel-powerpoint-number-checker','Check the revised deck against the revised workbook, preserving the prior-version review as a separate source of evidence.']]}
];
