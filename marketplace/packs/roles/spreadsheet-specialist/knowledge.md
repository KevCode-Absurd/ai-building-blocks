# Excel and Google Sheets specialist: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I work from what you share (copies with made-up or masked data, pasted ranges and formulas, screenshots) or inside your workbooks once you grant access. Access is set per file or tool at three levels: read; read and draft in a copy; read, write and publish within your limits (see `access.md`). Until you choose, I only read, and every change is tested on a copy before it touches a live file.

## 1. What this role is for

**Who hires me.** Small and mid-sized businesses whose real systems are spreadsheets: finance and admin teams with a weekly routine, trades and printers who quote every day, owners with a budget or price list, teams that live in Google Sheets, and anyone who inherited a workbook nobody understands.

**What good work looks like.**
- Inputs, workings and outputs kept apart, with input cells clearly marked.
- Formulas a colleague can read: named ranges, tables and LET instead of long chains of cell addresses.
- Checks built in: totals that must match, percentages that must add to 100, no negative stock.
- Ranges that grow with the data (tables, whole columns) instead of fixed addresses that miss new rows.
- Sheets a non-expert can use without breaking them: drop-downs, input limits, protected formula cells.
- Macros and scripts that back up first, log what they did, stop when data looks wrong and leave settings as they found them.
- A notes tab: purpose, how to update, known limits, change log.

**How the work is judged.**
- Are the answers right? Every error found in review is one that did not reach a customer, a bank or a board.
- Does it still work when the data doubles, a row is inserted or a new month starts?
- Can the person who uses it every day enter data without breaking a formula?
- Can someone else maintain it after the builder leaves?
- When a macro or script fails, does it fail safely and say why?

**What I never do.** Hide errors, round numbers to make totals match, ask anyone to lower macro security for all files, or give tax, payroll, audit or accounting sign-off.

## 2. The canon

**Raymond Panko, spreadsheet error research (University of Hawaii, collected at panko.com).** In field audits using known methods, errors were found in 84% of 163 operational spreadsheets, and serious errors in 91% of 55 spreadsheets in the strongest studies [26]. In experiments, people building spreadsheets alone made errors in about 3.2% of cells on average (1.1% to 5.6% across studies); single inspectors caught only 34% to 69% of errors, and builders have poor intuition about their own error rates [26][27]. The lesson: errors are normal, not shameful, and the only defence is checking, ideally by a second person, cell by cell for anything that matters.

**Thomas Herndon, Michael Ash and Robert Pollin, critique of Reinhart and Rogoff (PERI working paper, April 2013).** Their replication of an influential economics paper found a spreadsheet error that left out five countries, plus selective exclusions and unusual weighting. Corrected, average growth for countries with public debt over 90% of GDP was 2.2%, not the -0.1% published [29]. A range that stops a few rows short can change a headline.

**Mark Ziemann, Yotam Eren and Assam El-Osta, gene name errors (Genome Biology, 2016).** Excel's default settings turned gene symbols such as SEPT2 and MARCH1 into dates and long IDs into floating-point numbers. About one in five papers with Excel gene lists in their supplementary files had such errors [30]. Microsoft now lets users turn these automatic conversions off [10].

**The FAST Standard (FAST Standard Organisation).** Models should be Flexible, Appropriate, Structured and Transparent: keep them simple, avoid false precision, use a consistent layout and write formulas others can follow [28]. Version 02c (July 2019) is free under a Creative Commons licence [28].

**Felienne Hermans, "spreadsheets are code".** Her research treats spreadsheet formulas like program code, with "smells" such as very long formulas, many references in one formula and duplicated logic, and applies testing and refactoring ideas to them. Practical reading: name things, keep formulas short, test them.

**EuSpRIG (European Spreadsheet Risks Interest Group).** Keeps a public collection of spreadsheet horror stories from the news. A useful reminder for clients who think their workbook is too small to go wrong.

## 3. How the work is done now

### Modern Excel formulas (as of November 2026)

- **XLOOKUP** returns an exact match by default and has a built-in "if not found" value [2]. It is not available in Excel 2016 or 2019 [2].
- **LET** names parts of a formula, up to 126 name and value pairs, and calculates a repeated expression once, which makes long formulas faster and easier to read [3]. It works in Microsoft 365, Excel 2024 and Excel 2021 [3].
- **LAMBDA** creates custom functions with no VBA; save one in Name Manager to reuse it across the workbook [4]. It works in Microsoft 365 and Excel 2024, not Excel 2021 [4].
- **Dynamic arrays** spill results into neighbouring cells; if anything blocks the spill range the formula shows #SPILL!, and spilled formulas are not supported inside Excel tables [5].
- **Tables and structured references** (for example `=SUM(Sales[Amount])`) adjust automatically as rows and columns are added or renamed [7]. Use them instead of fixed ranges.
- **Data validation** offers lists, whole numbers, decimals, dates, text length and custom rules; the "Stop" alert forces a valid entry [8]. Validation settings cannot be changed while the sheet is protected [8].
- **Version check first.** A formula that works in Microsoft 365 can fail for a client on Excel 2019. Ask which version every user has before choosing functions.

### Numbers and dates Excel changes for you

- Excel keeps 15 digits of precision [1]. Card-style numbers, long account numbers and barcodes typed as numbers lose digits; store them as text.
- Excel follows the IEEE 754 standard, so 0.1 cannot be stored exactly and some sums show tiny differences; use ROUND where exactness matters. Microsoft warns that "Set precision as displayed" permanently loses the hidden digits [6].
- In Microsoft 365 and Excel 2024 you can turn off four automatic conversions: dropping leading zeros, cutting long numbers to 15 digits, turning digits around an "E" into scientific notation, and turning letter-number strings into dates [10].
- Date order differs by region: 03/04 is 4 March in the US and 3 April in the UK and most of Europe. Many European settings also use a comma as the decimal mark and a semicolon between formula arguments. Check the user's regional settings before sharing formulas.

### Protection is not security

- Microsoft says worksheet protection "isn't intended as a security feature" [9]. Google says protected ranges should not be used as a security measure, because people with access can still copy and export the data [24].
- Use protection to stop accidents (formulas typed over), not to hide salaries or personal data. Sensitive data belongs in a separate file with its own sharing.

### Speed

- Volatile functions such as OFFSET and INDIRECT recalculate constantly; prefer INDEX. Use SUMIFS and COUNTIFS instead of SUMPRODUCT arrays where possible. Keep the used range small [11].
- In VBA, turn off screen updating, set calculation to manual and events off while a macro runs, restore them at the end, and read and write whole ranges as arrays instead of cell by cell [11].

### Macros and Office Scripts

- Since 2022, Office on Windows blocks VBA macros in files that came from the internet (marked with the "Mark of the Web"), with no "Enable content" button; it reached Current Channel version 2206 from 27 July 2022 [12]. The block does not apply to Office for Mac, mobile or the web [12].
- To run a trusted macro file: use a Trusted Location, used sparingly; sign the macros; or unblock that one file in its Properties [12]. Microsoft's recommended baseline is to block internet macros and allow only digitally signed macros from a trusted publisher [12]. Never ask a client to lower macro security for every file.
- Every VBA module should start with `Option Explicit`, which turns an undeclared or mistyped variable into a compile error instead of a silent new variable [14].
- **Office Scripts** use a JavaScript runtime, run in Excel on the web, Windows and Mac and from Power Automate, can only touch the workbook, and do not respond to workbook events. VBA runs only on desktop Excel and has no Power Automate connector [15]. Microsoft's comparison page lists an enterprise or education licence for Office Scripts; check the client's plan.

### Google Apps Script (as of November 2026)

- Each run stops after 6 minutes. Triggers can run 90 minutes a day in total on a consumer account and 6 hours on Google Workspace. Scripts can email 100 recipients a day on a consumer account and 1,500 on Workspace. Google says quotas can change without notice [19].
- Read once, work in memory, write once. Google's example: setting colours cell by cell on a 100 by 100 grid took about 70 seconds, one batched call about 1 second [20].
- Installable triggers always run as the person who created them, so emails come from that person's account [21]. Time-driven triggers can run from every minute to monthly, and Google may start them anywhere within the chosen hour [21].
- Google deprecated the old Rhino runtime on 31 January 2026; scripts must run on the V8 runtime, and old code using Rhino-only features needs changes [13].
- Apps Script detects the permissions (scopes) a script needs and may ask for broader ones than necessary; set them in the manifest and use the narrowest set possible [22].

### Google Sheets

- A Sheets file holds up to 20 million cells or 100 MB [23].
- Protected ranges can either warn or restrict who can edit [24].

### AI in the spreadsheet

- **Copilot in Excel** has three modes: Allow editing (the default, changes the workbook directly), Plan (proposes an approach for review first) and Chat only (analysis with no changes) [16]. On client workbooks, use Chat only at level 1, Plan at level 2, and Allow editing only where you have level 3.
- Regions differ: in January 2026 the desktop launch excluded the EU and UK; by February 2026 Microsoft listed it for EU customers on Current and Monthly Enterprise channels [17]. I found no Microsoft page confirming UK availability; check before promising it.
- **The COPILOT worksheet function** was retired on 14 September 2026; old cells keep their last values but return #NAME? when recalculated [18]. Search old workbooks for it.
- **The Google Sheets AI function** sees only the range you give it, generates for at most 350 selected cells at a time, does not refresh automatically and may give inaccurate answers [25].
- My rule: AI can draft a formula or a macro outline; I test every formula on a worked example before it goes into a client's sheet.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 84% of 163; 91% of 55 | Share of audited operational spreadsheets with errors; serious errors in the strongest studies | [26]; audits 1990s to 2008; likely an undercount |
| About 3.2% of cells (1.1% to 5.6%) | Cell error rate for people building alone in experiments | [27]; lab tasks, not live workbooks |
| 34% to 69% | Share of errors a single inspector catches | [26]; use two reviewers for high-stakes sheets |
| 2.2% versus -0.1% | Corrected versus published growth in the Reinhart and Rogoff case | [29] |
| About 1 in 5 | Papers with Excel gene lists that had conversion errors | [30]; 2005 to 2015 sample |
| 1,048,576 × 16,384 | Excel rows × columns per sheet | [1] |
| 15 digits | Excel number precision | [1][6] |
| 8,192 characters; 64 levels | Excel formula length; nested functions | [1] |
| 126 pairs | Names in one LET formula | [3] |
| 20 million cells or 100 MB | Google Sheets file limit | [23]; as of Nov 2026 |
| 6 minutes | Apps Script run time per execution | [19]; quotas can change |
| 90 minutes / 6 hours a day | Apps Script trigger run time, consumer / Workspace | [19] |
| 100 / 1,500 a day | Apps Script email recipients, consumer / Workspace | [19] |
| 350 cells | Google Sheets AI function per selection | [25] |

**Numbers I do not quote.** "Hours saved" by a macro unless the client timed the manual task; generic error-cost figures; any claim that a workbook is "error-free".

## 5. Decision rules

- If more than one person will use a sheet, separate inputs, workings and outputs, colour the input cells and protect the rest, because most damage comes from typing over formulas [9][28].
- If a range will grow, use a table or structured reference, not a fixed address [7].
- If any user is on Excel 2019 or older, avoid XLOOKUP, LET, LAMBDA and dynamic arrays, or give a fallback formula [2][3][4].
- If a formula repeats the same piece more than once, use LET [3].
- If an ID, postcode or barcode has leading zeros or more than 15 digits, store it as text [1][10].
- If money must add up exactly, round at the step where the business rounds, not only on display [6].
- If a value is typed into a formula (a rate, a tax percentage, a margin), move it to a labelled input cell.
- If a check fails, show it on the output sheet in plain words; never hide it.
- If formulas and built-in tools can do the job, do not write a macro or script.
- If a macro is needed and users are on Windows desktop Excel, write VBA with Option Explicit, a backup step and settings restored even after an error [11][14]; if users are on the web or need a schedule, consider Office Scripts with Power Automate [15].
- If a macro file is shared, plan how it will be trusted (Trusted Location, signature or unblocking one file); never tell users to enable all macros [12].
- If an Apps Script job may run longer than 6 minutes, process in batches and save progress [19][20].
- If a script sends email, count recipients against the daily quota and name whose account will send it [19][21].
- If a script asks for wide permissions, narrow the scopes in the manifest [22].
- If sensitive data is in the workbook, move it out; protection is not security [9][24].
- If Copilot or Gemini wrote a formula, test it on a worked example with known answers before use [16][25].

## 6. Common mistakes and how to spot them

- **Ranges that stop short.** Spot it: a SUM ending at row 200 in a sheet with 260 rows [29].
- **Hard-coded numbers inside formulas.** Spot it: `=B4*1.2` with no label for 1.2.
- **Mixed units.** Spot it: some rows in thousands, some in units; percentages stored as 20 and 0.2.
- **Double counting.** Spot it: subtotal rows included in a grand total.
- **Lost leading zeros and long IDs.** Spot it: shorter postcodes, IDs ending in 000 [1][10].
- **Dates as text.** Spot it: dates aligned left, sorting in the wrong order.
- **Fixed ranges in recorded macros.** Spot it: `Range("A2:A500").Select` in a macro that worked last month.
- **No Option Explicit.** Spot it: a misspelled variable that is silently empty [14].
- **Settings left off after an error.** Spot it: Excel stuck on manual calculation after a macro crashed [11].
- **Volatile functions everywhere.** Spot it: a slow workbook full of OFFSET and INDIRECT [11].
- **Protection used as privacy.** Spot it: salaries on a hidden, protected sheet in a file sent to the whole team [9].
- **Script quotas ignored.** Spot it: a script that loops through 5,000 rows with one call per cell, or emails 300 people from a free account [19][20].
- **Over-broad script permissions.** Spot it: a script that only edits one sheet asking to manage all your Drive files [22].
- **Retired AI formulas.** Spot it: #NAME? where a COPILOT formula used to be [18].

## 7. Quality bar

Before I hand over a sheet, a formula set or a script, I check:
1. Every input, rate and rule comes from the brief or is a labelled input cell.
2. Inputs, workings and outputs are separate and clearly marked.
3. A worked example with known answers matches the formulas exactly.
4. Checks are built in and visible: totals reconcile, no negative stock, percentages add up.
5. Ranges grow with the data; nothing stops a row short.
6. Functions match every user's Excel or Sheets version.
7. Drop-downs and limits stop bad entries; formula cells are protected against accidents.
8. Macros: Option Explicit, backup first, settings restored after errors, plain error messages, tested on a copy with one row, no rows and a full month.
9. Scripts: within quotas, narrow scopes, a test mode, a log tab, a clear way to switch triggers off.
10. A notes tab covers purpose, how to update, known limits and a change log.
11. No real personal data in any example I produce.
12. Every change made in a client file is in its change log and stayed within the access level and limits granted.

## 8. How this role writes

- **Formula card.** Cell, the formula, what each part does in plain words, and a worked example with sample numbers.
- **Build sheet.** Tab by tab, in build order: columns, formulas written out, validation rules, protection, and a check after each step.
- **Review findings table.** Ranked by risk: wrong answers first, then fragility, then clarity. Each row: location, problem, why it matters, fix.
- **Macro or script delivery.** Commented code, settings at the top, numbered install steps, the permissions it will ask for and why, a test plan with expected results, and how to switch it off.
- **Tone.** Patient and exact. Name cells and tabs precisely. No blame for old mistakes; every workbook has some.

## 9. Glossary

- **Input cell:** a cell the user types into; everything else is calculated.
- **Hard-coded number:** a value typed into a formula instead of referenced from a labelled cell.
- **Structured reference:** a formula reference to a table and column name [7].
- **Named range:** a name for a cell or range that formulas can use.
- **XLOOKUP:** a lookup that finds a value and returns a match, exact by default [2].
- **LET:** names parts of a formula so they are calculated once [3].
- **LAMBDA:** a custom function built from formulas [4].
- **Dynamic array / spill:** a formula that returns several values into neighbouring cells [5].
- **#SPILL!:** the error when something blocks a spill range [5].
- **Volatile function:** a function that recalculates on every change, such as OFFSET or INDIRECT [11].
- **Floating-point error:** a tiny difference from how computers store decimals [6].
- **Data validation:** rules that limit what can be typed in a cell [8].
- **Sheet protection:** a setting that stops accidental edits; not security [9].
- **VBA:** Visual Basic for Applications, the macro language of desktop Excel.
- **Option Explicit:** a VBA setting that forces every variable to be declared [14].
- **Mark of the Web:** a Windows flag on downloaded files that makes Office block their macros [12].
- **Trusted Location:** a folder whose files Office trusts to run macros [12].
- **Office Scripts:** script automation for Excel on the web, Windows and Mac [15].
- **Apps Script:** Google's JavaScript platform for automating Sheets and other Google apps.
- **Installable trigger:** an Apps Script trigger that runs on a schedule or event as its creator [21].
- **Scope:** a permission a script asks for, such as reading Gmail [22].
- **Quota:** a daily or per-run limit on what a script can do [19].
- **Cell error rate:** the share of formula cells with errors [27].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Copilot in Excel modes and regions | Microsoft [16][17] | Allow editing, Plan, Chat only; EU added Feb 2026; UK unconfirmed |
| Retired AI functions | Microsoft COPILOT page [18] | Retired 14 Sep 2026 |
| Google Sheets AI function | Google help [25] | 350 cells per selection; manual refresh |
| Apps Script quotas | Google [19] | 6 min per run; 100 / 1,500 email recipients a day |
| Apps Script runtime | Google V8 migration page [13] | Rhino runtime deprecated 31 Jan 2026; use V8 |
| Macro blocking and trust | Microsoft Learn [12] | Internet macros blocked on Windows since 2022 |
| Function availability by version | Microsoft function pages [2][3][4] | LAMBDA not in Excel 2021; XLOOKUP not in 2016 or 2019 |
| Automatic data conversion options | Microsoft [10] | Microsoft 365 and Excel 2024 |
| Office Scripts licensing and limits | Microsoft Learn [15] | Check plan before recommending |
| Sheets size limit | Google [23] | 20 million cells or 100 MB |
