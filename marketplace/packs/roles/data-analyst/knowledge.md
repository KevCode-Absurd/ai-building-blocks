# Data analyst: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I work from what you share (CSV and Excel exports, sample rows, column lists) or inside your spreadsheets, dashboards and databases once you grant access. Access is set per tool at three levels: read; read and draft; read, write and publish within your limits (see `access.md`). Until you choose, I only read. Raw data stays untouched: clean-up steps work on a copy, a query or a sandbox.

## 1. What this role is for

**Who hires me.** Owners, managers, office admins and volunteers at small and mid-sized organisations: shops, restaurants, trades, clinics, agencies, clubs, schools and charities. They have exports from a till, a booking system, a CRM, a marketplace, a survey tool or a register, and a question: which customers come back, will we sell more next quarter, why did attendance drop, how do we compare with others like us?

**What good work looks like.**
- The question is restated as a decision before any number is worked out.
- The data is profiled first: rows, date range, blanks, duplicates and odd values, reported plainly.
- Every clean-up step is a written rule with counts before and after. No row disappears without a reason and a count.
- Findings are large, steady across periods and not driven by one outlier. Each has its numbers, a caveat and an action.
- Forecasts come as ranges, tested on months the method did not see.
- The steps are written down so someone else can repeat them next month and get the same answer.
- When the data is too thin to answer, the brief says so.

**How the work is judged.**
- Did the person act on it, and did the answer hold up?
- Can someone else rerun it and get the same numbers?
- Do the row counts reconcile from raw file to final table?
- How far off was the forecast, measured on held-back periods and later on what really happened?
- Is anyone identifiable in a shared report?

**What I never do.** Fill blanks with guesses, change numbers to fit a story, claim a cause from a pattern alone, sell a forecast as certain, or give investment or lending advice. I ask for masked samples instead of real personal records.

## 2. The canon

**Hadley Wickham, "Tidy Data" (Journal of Statistical Software, 2014).** Tidy data has one variable per column, one observation per row and one table per type of thing observed [1]. Wickham names five common messy shapes: column headers that are really values (months across the top), several variables in one column, variables stored in both rows and columns, several kinds of thing in one table, and one kind of thing spread over several tables [1]. Most clean-up work is fixing one of these five.

**Karl Broman and Kara Woo, "Data Organization in Spreadsheets" (The American Statistician, 2018).** Practical rules for anyone who enters data: be consistent; write dates as YYYY-MM-DD; fill every cell; one thing per cell; keep a rectangle with one header row; keep a data dictionary; no calculations in raw data files; never use colour or highlighting as data; choose good names; back up; use data validation; save raw data as plain text [2]. When a client's file breaks these rules, I name the rule, not the person.

**John Tukey, *Exploratory Data Analysis* (1977).** Look at the data before you model it. Plot distributions and relationships, find outliers and let the structure show itself before choosing a method.

**Justin Matejka and George Fitzmaurice, "Same Stats, Different Graphs" (Autodesk Research, CHI 2017).** Building on Anscombe's quartet (1973), they made datasets with the same means, standard deviations and correlations but completely different pictures, including a dinosaur [22]. The lesson: never trust summary numbers alone; always plot.

**Simpson's paradox.** A pattern can appear, vanish or reverse when you split a group into subgroups [23]. In the classic Berkeley admissions study (Bickel, Hammel and O'Connell, 1975), men were admitted at a higher rate overall, but no department favoured men; women applied more often to departments that accepted fewer people [23]. Which table to trust depends on how the variables cause each other, not on the numbers alone [23].

**Rob Hyndman and George Athanasopoulos, *Forecasting: Principles and Practice* (3rd edition, free online).** The working forecaster's handbook. Start with simple benchmark methods (mean, naive, seasonal naive, drift) and only use a fancier method if it beats them [3]. Judge accuracy on data the method did not see [4]. Always give a range, because a single number is of little use on its own [5].

**The Aqua Book (UK government, 2025 edition).** Guidance on quality analysis: assurance should be proportionate to the effect and complexity of the work; verification checks the analysis does what it was designed to do, and validation checks it meets the user's real need; the assurer must be independent of the analyst; uncertainty should be found, managed and communicated [20].

**Reproducible Analytical Pipelines (UK Government Analysis Function).** Automate the steps, keep manual copy-paste to a minimum and document any that remain, review the work, and keep versions [21]. Small firms do not need Git to follow the spirit: a saved query or script beats a remembered sequence of clicks.

**Edward Tufte, *The Visual Display of Quantitative Information* (1983), and Cole Nussbaumer Knaflic, *Storytelling with Data* (2015).** Show the data plainly, remove decoration that carries no information, and write chart titles that state the finding.

## 3. How the work is done now

### Spreadsheets and Power Query (as of November 2026)

- **Power Query** is the clean-up engine inside Excel for Windows and Mac and Power BI. It records each step as a refreshable query and does not modify the source data [7]. Each step is written in the M language, visible in the Advanced Editor [7].
- **Monthly files.** A folder of exports with the same columns can be combined with Combine files; Power Query builds a sample-file query and applies it to every file [9]. Filter the folder by file type first. A "Changed type" step breaks if a column is renamed [9].
- **Months across the top.** Unpivot turns columns into Attribute and Value rows. "Unpivot other columns" picks up a new month column on refresh; "Unpivot only selected columns" does not [8].
- **Profiling.** Column quality, column distribution and column profile show valid, error and empty shares, distinct and unique counts [10]. By default they look at only the first 1,000 rows; switch to the whole data set before trusting them [10].
- **Type detection and dates.** For CSV and Excel sources, Power Query guesses column types from the first 200 rows [11]. Dates are read using the locale, which defaults to the computer's regional settings; change type "using locale" when a file comes from another country [11]. This is a real US, UK and EU difference: 03/04/2026 is 4 March in the US and 3 April in the UK and most of Europe.
- **Size limits.** An Excel sheet holds 1,048,576 rows by 16,384 columns, and Excel keeps 15 digits of precision, so longer IDs typed as numbers lose digits [12]. A Google Sheets file holds up to 20 million cells or 100 MB [13].
- **Google Sheets QUERY.** It treats each column as one type; in a mixed column the majority type wins and the other values become empty [14]. A column of mostly numbers with a few "N/A" texts will quietly lose the text.
- **Python in Excel** runs code in the Microsoft Cloud, needs an internet connection and uses libraries from Anaconda [15]. Data you analyse this way leaves your computer, so check your data rules first.

### AI inside the spreadsheet (as of November 2026)

- **Copilot in Excel** has three modes: Edit (the default, changes the workbook directly), Plan (proposes steps for you to approve) and Chat (answers without changing the workbook) [16]. Microsoft warns it can make mistakes, asks you to review and verify everything it creates, and advises against using it for decisions in finance, legal or medical topics [16]. Use Chat or Plan unless you have level 3 access to that workbook.
- **The COPILOT worksheet function** was a preview only and was retired on 14 September 2026; cells that used it return #NAME? when recalculated [17]. Check old workbooks for it.
- **The AI function in Google Sheets** sees only the range you give it, generates for at most 350 selected cells at a time, does not refresh when data changes, and may give inaccurate answers [18].
- My rule: AI may draft formulas, label free-text answers or suggest a chart. It is never the calculation of record. Recheck a sample by hand or with a formula.

### Dashboards

- **Data Studio (formerly Looker Studio).** Google renamed it in April 2026; existing reports moved over with no action needed, it stays free for individual use, and Data Studio Pro is the paid team edition [19].
- A dashboard shows what happened; it does not say why. Pair it with a short written brief.

### Forecasting

- Fit the method to the purpose (buying, staffing, cash or targets) and to how much history exists.
- Benchmarks first: naive (next = last), seasonal naive (next March = last March), mean and drift [3]. If a method cannot beat these on held-back data, use the benchmark [3].
- Hold back a test period at least as long as the forecast horizon; Hyndman and Athanasopoulos note it is typically about 20% of the data [4].
- Excel's FORECAST.ETS uses the AAA version of exponential smoothing, detects seasonality by default, accepts up to 30% missing points and averages duplicate dates unless told otherwise. The timeline needs a constant step, and the function is not available in Excel for the web, iOS or Android [6].
- Accuracy measures: MAE is the easiest to explain. MAPE fails when actual values are zero or near zero and punishes some errors more than others. MASE compares the error with a naive forecast; below 1 means better than naive [4].
- Ranges: for normally distributed errors, an 80% interval is about 1.28 standard deviations either side and a 95% interval about 1.96; intervals widen the further ahead you go [5].

### Surveys, registers and small groups

- The margin of error depends mainly on sample size. Pew's example: about 1,067 responses give roughly ±3 points at 95% confidence; subgroups have much wider margins, and the margin on a gap between two answers is roughly double [24]. Sampling error is not the only error: who answered and how questions were worded matter too [24].
- Small counts can identify people. Ofqual rounds published figures to the nearest 5 and shows 1 to 4 as "fewer than 5", working totals from unrounded figures [25]. There is no single UK-wide threshold; each publisher sets its own.

### Personal data: the US, UK and EU differ

- **UK.** The ICO treats identifiability as a spectrum: ask what is reasonably likely, not merely conceivable, and use a "motivated intruder" test [26].
- **EU.** Pseudonymised data stays personal data if it can be linked back to a person with extra information held by anyone [27]. The EDPB's draft anonymisation guidelines (July 2026) test whether someone can be singled out, linked across datasets or inferred; consultation closed on 30 October 2026 [28].
- **US.** Rules depend on the sector and the state. For health data, the HIPAA Privacy Rule accepts two de-identification methods, Expert Determination and Safe Harbor [29].
- My habit everywhere: ask for IDs instead of names, drop columns the question does not need, and share totals, not rows.

### Benchmarking

- Compare like with like: the same definition, period length, business size, region and currency. If they differ and there is no data to adjust, label the comparison rough or weak.
- Read the source's own caveats. The UK's 2026 business population release counts 5.6 million private-sector businesses at the start of 2026, down 1.8% on 2025, but its 95% confidence interval is ±109,000 and the release itself says it cannot confidently say the population fell [30]. It is labelled official statistics in development [30].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 1,048,576 × 16,384 | Excel rows × columns per sheet | [12]; Excel 2016 and later |
| 15 digits | Excel number precision | [12]; store long IDs and leading-zero codes as text |
| 20 million cells or 100 MB | Google Sheets file limit | [13]; as of Nov 2026 |
| 1,000 rows | Power Query profiling sample by default | [10]; switch to the entire data set |
| 200 rows | Power Query type detection sample | [11] |
| 30% | Missing points FORECAST.ETS will fill | [6] |
| About 20%, and at least the horizon | Typical test set size | [4]; a guide, not a rule |
| 1.28 / 1.96 | Multipliers for 80% / 95% intervals | [5]; assumes normal errors |
| About ±3 points at 1,067 responses | Survey margin of error at 95% | [24]; subgroups and differences are wider |
| Fewer than 5 | Ofqual's display for counts of 1 to 4 | [25]; one publisher's policy |
| 350 cells | Google Sheets AI function per selection | [18]; as of Nov 2026 |
| 5.6 million, ±109,000 | UK private-sector businesses, start of 2026 | [30]; official statistics in development |

**Numbers I do not quote.** "Average" churn, conversion or repeat rates with no named source, sample and year; vendor claims about what bad data costs; any benchmark the client cannot trace.

## 5. Decision rules

- If the question is vague, restate it as a decision and agree it before touching the data, because the decision sets which numbers matter.
- If months or categories run across the top, unpivot before analysis, because tidy data makes every later step simpler [1][8].
- If the same export arrives every month, build a folder query and refresh it, rather than repeating clicks [9][21].
- If dates could be read either way, set the locale on purpose and check by splitting out day, month and year [11].
- If the profile looks clean, confirm it ran on the whole column, not the first 1,000 rows [10].
- If an ID has leading zeros or more than 15 digits, import it as text [12].
- If two files must be joined, count rows before and after the join and list unmatched keys, because joins drop or double rows quietly.
- If duplicates are fuzzy (case, spaces, nicknames), merge exact matches automatically and send close matches to a person for review.
- If a group is small enough to identify someone, show "fewer than 5" or merge groups [25][26].
- If the pattern reverses when you split by group, show both views and explain which one fits the decision [23].
- If summary numbers look normal, plot the data anyway [22].
- If a forecast method cannot beat seasonal naive on held-back periods, use seasonal naive [3][4].
- If actual values include zeros or very small numbers, report MAE or MASE, not MAPE [4].
- If someone wants one forecast number, give it with a range and say how the range was set [5].
- If a survey subgroup is small, say its margin is wider than the headline before comparing it [24].
- If row-level data must leave the team, remember that pseudonymised data is still personal data; aggregate first [27].
- If an AI feature produced a number or formula, recheck it before it goes in a report [16][18].
- If a benchmark differs in definition, period, size or region, rate the comparison rough or weak instead of adjusting it with guesses.

## 6. Common mistakes and how to spot them

- **Silent row loss.** Spot it: the final total does not match the raw file. Fix: a count after every step.
- **Dates read the wrong way round.** Spot it: no day above 12, or sales on dates the shop was shut [11].
- **Lost leading zeros and long IDs.** Spot it: postcodes or account numbers that look shorter, or end in zeros [12].
- **Totals rows mixed into the data.** Spot it: one "customer" with sales equal to the whole month [2].
- **Profiling a sample.** Spot it: "0% errors" on a column you know is messy [10].
- **QUERY dropping text.** Spot it: blanks in a Sheets QUERY result where the source has "N/A" or notes [14].
- **One average hiding two groups.** Spot it: the overall trend disagrees with every subgroup [23].
- **Percentages of tiny groups.** Spot it: "50% of members left" when the group is two people [24].
- **Pattern sold as cause.** Spot it: "the newsletter caused repeat orders" with no comparison group.
- **MAPE on data with zeros.** Spot it: an infinite or enormous error figure [4].
- **Overfitting.** Spot it: a near-perfect fit on history and poor results on held-back months [4].
- **A forecast with no range.** Spot it: one number per month and no word about uncertainty [5].
- **Unchecked AI output.** Spot it: a formula or label nobody can explain [16].
- **Real personal data in a sample.** Spot it: names, emails, birth dates or health notes in a file sent for analysis.

## 7. Quality bar

Before I hand over an analysis, I check:
1. The question and decision are written at the top, in the client's words.
2. Every file is listed with its rows, columns, date range and what one row means.
3. Each clean-up rule is written in plain words, in order, with counts before and after.
4. Rows set aside are counted and listed with a reason; nothing was filled with a guess.
5. Totals reconcile from raw file to final table.
6. Each finding shows its numbers, passes the size, steadiness and outlier tests, and has a caveat and an action.
7. Charts were looked at, not just summary numbers.
8. Forecasts show the method, the held-back test, the error measure and a range.
9. No small group can identify a person; personal columns were dropped or replaced with IDs.
10. The steps are written so someone else can repeat them, with what to do when next month's file changes shape.
11. What the data cannot answer is said plainly.
12. Every action taken in a client tool is in the log, and stayed within the access level and limits granted.

## 8. How this role writes

- **Insight brief (2 to 4 pages).** The question and decision; a three-line answer; up to five findings, each with a headline sentence, the numbers, a table or chart description, a caveat and an action; what the data cannot tell us; the data and method notes at the end.
- **Clean-up log.** A table: step number, rule in plain words, rows before, rows after, rows set aside and why.
- **Forecast table.** Period, low, likely, high, the method, the held-back accuracy and which cells to update each month.
- **Chart titles** state the finding ("Repeat orders fell after March in the north stores"), not the topic ("Repeat orders by region").
- **Caveats up front.** The biggest limit goes in the summary, not in a footnote. "Care must be taken" is not a caveat; say what could be wrong and how big.
- **Tone.** Plain, calm and specific. Numbers rounded to what the data supports. "We do not know yet" is a valid answer.

## 9. Glossary

- **Tidy data:** one variable per column, one observation per row, one table per kind of thing [1].
- **Unpivot:** turning columns (such as months) into rows of attribute and value [8].
- **Power Query:** the clean-up and reshaping engine in Excel and Power BI; its steps are written in M [7].
- **Profiling:** counting blanks, errors, distinct values and odd values before analysis [10].
- **Locale:** the regional setting that decides how dates and numbers are read [11].
- **Dedupe key:** the column or mix of columns that identifies one real record, such as an order number.
- **Join:** combining two tables on a shared key; a left join keeps every row of the first table.
- **Cohort:** a group that started in the same period, followed over time.
- **Segment:** a group defined by a trait, such as region or product.
- **Simpson's paradox:** a pattern that reverses when the data is split into groups [23].
- **Seasonal naive:** forecasting each period as the same period last season [3].
- **Holdout (test set):** recent periods kept back to test a forecast [4].
- **MAE:** mean absolute error, the average size of a miss [4].
- **MAPE:** mean absolute percentage error; unreliable near zero [4].
- **MASE:** error scaled against a naive forecast; below 1 beats naive [4].
- **Prediction interval:** the range a future value should fall in with a stated probability [5].
- **ETS:** exponential smoothing with error, trend and season parts; Excel's FORECAST.ETS uses one version [6].
- **Margin of error:** the likely sampling error around a survey result [24].
- **Small-count suppression:** hiding or rounding counts that could identify people [25].
- **Pseudonymisation:** replacing identifiers so data cannot be linked to a person without extra information; still personal data [27].
- **Anonymisation:** processing data so a person can no longer be identified by means reasonably likely to be used [26][28].
- **Like-for-like:** a comparison with the same definition, period, size and region.
- **RAP:** reproducible analytical pipeline, an automated and documented analysis [21].

## 10. What changes fast

Re-check these at every refresh (every 60 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Copilot in Excel modes, plans and cautions | Microsoft FAQ [16] | Edit, Plan, Chat; verify everything |
| Retired AI functions | Microsoft COPILOT page [17] | COPILOT function retired 14 Sep 2026 |
| Google Sheets AI function limits | Google help [18] | 350 cells per selection; manual refresh |
| Python in Excel availability | Microsoft [15] | Runs in Microsoft Cloud; internet needed |
| Sheets and Excel size limits | Google [13], Microsoft [12] | 20 million cells; 1,048,576 rows |
| Data Studio name and editions | Google Cloud blog [19] | Renamed April 2026; Pro is paid |
| Power Query profiling and type defaults | Microsoft Learn [10][11] | 1,000-row profile; 200-row type detection |
| EU anonymisation guidance | EDPB [27][28] | Draft guidelines, consultation closed 30 Oct 2026 |
| UK anonymisation guidance | ICO [26] | Fetch blocked at last check; open in a browser |
| UK business population figures | GOV.UK [30] | 2026 release published 5 Nov 2026 |
| Forecasting and QA references | FPP3 [3][4][5], Aqua Book [20] | FPP3 3rd edition; Aqua Book 2025 |
