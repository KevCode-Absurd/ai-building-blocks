# Business intelligence (BI) analyst: role knowledge

Checked 7 November 2026. Facts that change carry their own date and a source number from `sources.json`. I work from what you share (column lists, sample rows, exports, screenshots of current reports) or inside your BI tool, spreadsheets and data sources once you grant access. Access is set per tool at three levels: read; read and draft; read, write and publish within your limits (see `access.md`). Until you choose, I only read.

## 1. What this role is for

**Who hires me.** Owners, operations managers, finance leads and agencies at small and mid-sized businesses: clinics, salons and gyms, shops, restaurants, trades, agencies, SaaS firms and charities. Their numbers sit in several systems (till or booking system, CRM, ad platforms, accounts, Google Analytics). They usually have one of three problems: no regular view of the business at all, a spreadsheet dashboard nobody trusts, or a BI tool whose numbers do not match the accounts.

**What I do that a data analyst does not.** A data analyst answers a question once from a messy file. I build the measuring system that answers the same questions every week: exact metric definitions, a data model where each table has one grain, dashboards and report packs, refresh schedules and who-sees-what rules. One-off clean-ups and forecasts belong to the data analyst kit; formula-heavy workbooks belong to the spreadsheet specialist; statutory accounts belong to an accountant.

**What good work looks like.**
- Every dashboard starts from the decisions it supports and the three to five questions it must answer.
- Every metric has a written card: plain meaning, exact formula on named columns, grain, time window, filters, edge cases, source and owner.
- The model separates facts (events) from dimensions (things), and each fact table holds one grain.
- At least three dashboard numbers tie to a source total the owner already trusts.
- Refresh times, data freshness and who can see which rows are written down.
- The page reads at a glance and still makes sense without colour.

**How the work is judged.**
- Do the numbers match the till, bank or accounts within an agreed tolerance?
- Do people open it, and do decisions in meetings use it?
- Do teams stop arguing about what a number means?
- How often does a refresh fail, and how fast is it noticed?
- How long does it take to answer a new question with the existing model?

**What I never do.** Invent targets or benchmarks, design a page to make results look better than they are, share data beyond the viewers you approved, or treat an AI-written measure as checked before I have worked it by hand.

## 2. The canon

**Ralph Kimball and Margy Ross, *The Data Warehouse Toolkit* (3rd edition, 2013).** The standard text on dimensional modelling. Design follows four decisions in order: pick the business process, declare the grain (what one fact row means), identify the dimensions, then identify the facts [1]. Facts come in three kinds: additive (sum across anything), semi-additive (balances, which sum across everything except time) and non-additive (ratios). For ratios, store the parts and divide the totals, never sum or average the row-level ratios [2]. Microsoft's own Power BI guidance points modellers to this book and builds on the same star schema [3].

**Stephen Few, *Information Dashboard Design* (2006; 2nd edition 2013).** Few defines a dashboard as the most important information for an objective, arranged on one screen so it can be monitored at a glance. His white paper lists 13 common pitfalls, among them spilling past one screen, too little context for each number, too much precision, the wrong chart type, clutter and misused colour [20].

**Robert Kaplan and David Norton, "The Balanced Scorecard" (Harvard Business Review, January–February 1992).** The article's core warning is "what you measure is what you get": a scorecard of financial results alone drives short-term behaviour, so pair results with the measures that drive them [23].

**Andy Grove and John Doerr, OKRs.** Grove built objectives and key results at Intel; Doerr named them and took them to Google in 1999. An objective is a significant, concrete goal; key results are measurable, time-bound and clearly met or not, typically three to five per objective. Committed OKRs are expected to be met; aspirational ones are stretch goals [24]. A KPI tree feeds OKRs: the key results usually sit one or two levels down the tree.

**Charles Goodhart (1975), Goodhart's law.** Once a measure becomes a target, people change their behaviour to hit the target, and the measure stops telling the truth. The Wells Fargo case in section 3 is the best-documented business example.

**IBCS, International Business Communication Standards (the IBCS Association, building on Rolf Hichert's work).** Rules for reports and dashboards so readers do not relearn each one: consistent notation for scenarios, units and variances. Version 2.0 was released on 11 June 2026, aligned with ISO 24896 "Notation for business reporting", and is published free under a Creative Commons licence [21].

**W3C, WCAG 2.2 (Recommendation, 12 December 2024).** The accessibility baseline: colour must never be the only way information is shown (1.4.1), text needs 4.5:1 contrast (3:1 for large text) (1.4.3), and chart parts needed to understand content need 3:1 against neighbouring colours (1.4.11) [22].

**Semantic layers and metric stores.** Big firms learned that dashboards drift when every report defines its own metrics. Airbnb built Minerva, an internal platform that manages each metric's definition so it is computed the same way everywhere [27]. Small firms get the same benefit from a Power BI semantic model with explicit measures [3] or Metabase metrics [18]: define once, reuse in every chart.

## 3. How the work is done now

### Metrics first, then the model

- **Metric card.** Name; one-sentence meaning; exact formula on named columns; grain; time window and time zone; filters; edge cases (refunds, cancellations, test orders, duplicates, staff accounts); source system; owner; review rhythm; leading or lagging.
- **KPI tree.** Write the goal as one number with a date, then split it into drivers that multiply or add up to it (revenue = customers × visits per customer × spend per visit). Stop at numbers a person can act on this week. Check the tree adds up on last period's figures.
- **Ratios.** Build them as sum of numerator divided by sum of denominator at whatever level the chart shows [2]. In Data Studio, write the aggregation into the field itself, such as SUM(Profit) / SUM(Revenue), so a changed default aggregation cannot break it [15].

### The model: star schema in practice (as of November 2026)

- **Facts and dimensions.** Dimension tables (date, product, customer, location, staff) filter and group; fact tables (sales lines, bookings, visits) are summed. In Power BI the "one" side of a one-to-many relationship is the dimension. Keep each fact table at one grain and do not mix fact and dimension columns in one table [3].
- **Flatten small hierarchies.** Product, subcategory and category usually work better as one product table than as a snowflake of three [3].
- **History.** If a salesperson moves region and old sales must stay with the old region, you need a type 2 slowly changing dimension. Power Query cannot build one; it must come from a warehouse or a prepared table [3].
- **Relationships do not check your data.** A duplicate key on the "one" side makes the whole refresh fail. A fact key with no match shows up as a blank row, an "unknown member" [4].
- **Filter direction.** Single direction by default. Bi-directional filters can slow the model and create ambiguous paths, so use them only when needed [4]. Many-to-many relationships are "limited": they join with inner-join logic, drop unmatched rows silently and cannot use RELATED [4].
- **Dates.** A date table needs unique dates, no blanks, no gaps and full years (a fiscal year counts). Classic time intelligence also needs it marked as a date table. Auto date/time is fine only for simple calendar models [5]. Relationships on date/time columns can fail to match because the time part is still stored [4].
- **Several dates on one fact.** Order, ship and delivery dates are a role-playing dimension. Either clone the date table per role or keep inactive relationships and switch them on with USERELATIONSHIP in a measure [3].
- **Explicit measures.** Write a measure for every number people use. A unit price, for example, should never be summed; hide the column and offer average, minimum and maximum measures instead [3].

### Power BI (as of November 2026)

- **Licences.** A free licence is for your own content only. Pro users can share with other Pro users; Premium Per User content is shared only with PPU users. Free users can view shared content only when it sits in a Premium or Fabric F64 or larger capacity [7].
- **Refresh.** On shared capacity a model gets 8 scheduled refreshes a day (API refreshes count; manual "Refresh now" does not), each must finish within 2 hours. Premium, PPU and Fabric capacities allow 48 scheduled refreshes and 5 hours. If nobody opens a report built on a model for two months, Power BI pauses its schedule and emails the owner [6].
- **Row-level security.** RLS applies only to people with the Viewer role; Admins, Members and Contributors see everything. Roles add up (a person in two roles sees both). Dynamic rules usually compare a user-mapping table with USERPRINCIPALNAME(). "Test as role" uses your own identity for dynamic rules, so check guest users with their real account. RLS hides rows, not columns [8].
- **Copilot.** Needs a paid Fabric capacity (F2 or higher) or Premium (P1 or higher); a Pro or PPU licence alone is not enough. When a question is not about the model's data, Copilot answers from the language model's general knowledge. Microsoft says to prepare the model for AI first, or answers may be generic or wrong [9].
- **AI agents and MCP.** Microsoft now offers a Power BI Authoring MCP server (hosted endpoint in preview, local server generally available) that can create and change tables, measures, relationships and security roles, and Fabric IQ for answering business questions, which respects row-level and object-level security. Agents act with the signed-in user's permissions, and query results move to the AI client and its model provider [10].

### Data Studio, formerly Looker Studio (as of November 2026)

- **Name and editions.** Google renamed Looker Studio to Data Studio on 11 April 2026; existing reports moved over with no action. It is free for individuals; Data Studio Pro is the paid team edition [11]. Pro adds organisation-owned content (reports survive when their creator leaves), team workspaces, up to 200 delivery schedules per report, chart alerts and Gemini features such as writing calculated fields from plain-language prompts [16].
- **Blends.** Up to five tables; inner, left, right, full outer and cross joins plus union; equality conditions only. Each table is grouped and aggregated by its own dimensions before the join, so identical rows collapse unless a row ID is included. A blend lives inside one report and cannot be shared with other reports [12].
- **Calculated fields.** Data source fields are reusable in every report; chart-specific fields stay in one chart but work on blends [15].
- **Credentials.** With owner's credentials, viewers see the data even without their own access to the source. With viewer's credentials, each viewer needs their own access. Service account credentials work only for BigQuery in Google Workspace or Cloud Identity organisations [13].
- **Freshness.** Defaults: Google Analytics every 12 hours (options 1, 4 or 12 hours); Google Sheets every 15 minutes; BigQuery and SQL databases 12 hours, adjustable down to 1 minute; Google Ads and other Google marketing products fixed at 12 hours. A blend refreshes at its fastest source's rate, and every BigQuery query that reaches the project is billed [14].
- **Google Analytics 4 thresholds.** GA4 withholds rows with demographics or small user counts to protect identity. Thresholds cannot be changed; widening the date range sometimes reveals the data [17]. Dashboard totals may not match the GA4 interface for this reason.
- **Name clash.** Metabase calls its own semantic-layer workspace "Data Studio" too [18]. Say which product you mean.

### Metabase and Tableau

- **Metabase.** A metric is a saved aggregation on one data source plus the dimensions people may slice by. Metabase advises conditional aggregations (SumIf, CountIf, DistinctIf) instead of filters inside the metric, and no joins inside metric definitions [18]. The open-source edition is free to self-host; cloud plans are paid [19].
- **Tableau.** Paid. Tableau publishes its own MCP server: the hosted version signs each user in with their own Tableau identity, the self-hosted one uses a personal access token, and the project page does not promise read-only use, so grant only the access the job needs [28].

### Design for reading at a glance

- One question per tile, the biggest number top left, trend next, detail below, filters stated on the page [20].
- Every number has context: a comparison (last period, same period last year, target) and a unit [20].
- Use a consistent notation for actual, plan, previous year and forecast across every report, as IBCS recommends [21].
- Status needs a second cue besides colour (an arrow, a label, a sign), and chart marks need 3:1 contrast [22].

### Two warning cases

- **Targets that rewrite behaviour.** On 8 September 2016 the US Consumer Financial Protection Bureau fined Wells Fargo $100 million after employees opened accounts customers had not authorised. The bank's own analysis found more than two million accounts that may not have been authorised; the CFPB said staff were spurred by sales targets and compensation incentives [25]. A cross-sell count used as a target stopped measuring customer need.
- **Pipelines that fail quietly.** On 4 October 2020 Public Health England said 15,841 positive COVID-19 cases from 25 September to 2 October had been left out of reported daily figures because some files exceeded the maximum file size a data load process could handle; the fix split large files [26]. A row-count check from source to dashboard would have caught it on day one.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 8 / 48 | Scheduled refreshes a day, Power BI shared capacity / Premium, PPU or Fabric | [6]; as of Nov 2026 |
| 2 h / 5 h | Maximum refresh duration, shared / Premium | [6] |
| 2 months | No report visits before Power BI pauses scheduled refresh | [6] |
| F64 | Smallest Fabric capacity where free-licence users can view shared content | [7] |
| F2 / P1 | Smallest capacity that supports Copilot in Power BI | [9]; trials and free SKUs excluded |
| 10,000 characters | Copilot prompt limit in Power BI | [9] |
| 5 tables | Maximum per Data Studio blend | [12] |
| 15 min / 12 h | Default freshness: Google Sheets / Google Analytics and BigQuery in Data Studio | [14]; Google Ads fixed at 12 h |
| 200 | Delivery schedules per report in Data Studio Pro | [16] |
| 4.5:1 and 3:1 | WCAG 2.2 contrast for text / chart marks and large text | [22] |
| 3 to 5 | Key results per objective | [24]; guidance, not a rule |
| 13 | Common dashboard design pitfalls | [20]; Few, 2006 |
| 15,841 | Cases left out of PHE daily figures, 25 Sep to 2 Oct 2020 | [26] |
| More than 2 million | Possibly unauthorised Wells Fargo accounts; $100 million CFPB fine | [25]; 2016 |

**Numbers I do not quote.** "Average" conversion, churn, utilisation or margin figures with no named source, sample and year; claims about the "ideal" number of KPIs; vendor figures for hours saved by dashboards. If you want a benchmark, bring one you trust and I will check it is like for like.

## 5. Decision rules

- If nobody can name the decision a dashboard supports, write the decision first, because every chart should answer a question someone acts on.
- If a metric is a ratio, store and sum its parts and divide at the end, because averaging row-level ratios gives a different, wrong answer [2].
- If two teams report different numbers for the same metric, show both formulas side by side on a small example, then recommend one definition for the owner to sign off.
- If a metric is about to become someone's target or bonus, add a counter-metric that would expose gaming, because measures used as targets change behaviour [23][25].
- If a table mixes events and descriptions, split it into fact and dimension tables at one grain each [1][3].
- If a dimension's history matters (region moves, price changes) and the source keeps no history, plan a warehouse table or a snapshot, because Power Query cannot rebuild it [3].
- If you are tempted to set a relationship to bi-directional, first try a measure or a bridging table, because bi-directional filters can slow the model and create ambiguous paths [4].
- If a model uses time intelligence, build a proper date table with full years and no gaps [5].
- If a fact has several dates, decide per report whether to clone the date table or use inactive relationships [3].
- If free-licence colleagues must view Power BI content, check the capacity before promising it, because sharing needs Pro on both ends or an F64-plus capacity [7].
- If a model needs fresher data than 8 refreshes a day on shared capacity, discuss a capacity change, DirectQuery or a different tool, because the limit is fixed [6].
- If some viewers must see only their own rows, use RLS, give them the Viewer role and test with real accounts [8].
- If a Data Studio report uses owner's credentials, check that every viewer is allowed to see all the data it shows [13].
- If a blend loses rows or totals look high, add a row ID, check the join type and compare with each source on its own [12].
- If a Data Studio dashboard reads GA4, warn readers that thresholds can hide small rows and totals can differ from the GA4 interface [17].
- If AI wrote a measure or answer, work it through by hand on sample rows before it ships [9].
- If the business has no data team, prefer the tool it already pays for and can maintain over the most capable one.
- If a dashboard feeds decisions, add a row-count or total check from source to page, because pipelines can drop rows without errors [26].

## 6. Common mistakes and how to spot them

- **Averages of averages.** Spot it: "average order value by region" averaged again for the total, which does not equal total revenue divided by total orders [2].
- **Mixed grain.** Spot it: a fact table with order rows and order-line rows, so revenue double counts [1][3].
- **Fan-out joins.** Spot it: totals that grow when a dimension is added to the chart.
- **Unknown members ignored.** Spot it: a "(Blank)" category carrying real sales [4].
- **Silent many-to-many.** Spot it: totals lower than the source because unmatched rows were dropped [4].
- **Unit price summed.** Spot it: a "total price" that is meaningless because it adds per-unit rates [3].
- **Auto date/time everywhere.** Spot it: hidden date tables in a large model and no shared calendar [5].
- **Time zone drift.** Spot it: late-evening orders landing on the next day in the dashboard but not in the till report.
- **Refresh that stopped.** Spot it: "last refreshed" weeks ago; nobody got the failure email; a schedule paused after two months without visits [6].
- **RLS that does not apply.** Spot it: a manager added as Member instead of Viewer sees every branch [8].
- **Owner's credentials leaking data.** Spot it: a Data Studio report shared with a contractor who now sees all customers [13].
- **Blend duplicates or collapses.** Spot it: row counts that differ from either source [12].
- **Colour-only status.** Spot it: red and green dots with no labels or arrows [22].
- **Too many numbers.** Spot it: 30 tiles, no comparison values and no stated question [20].
- **Vanity targets.** Spot it: a count everyone can push up without the business improving [25].
- **Unchecked AI output.** Spot it: a DAX measure nobody can explain, or a Copilot answer drawn from general knowledge rather than the model [9].

## 7. Quality bar

Before I hand over a dashboard, model or report pack, I check:
1. The decisions and the three to five questions are written at the top, and every chart answers one of them.
2. Every metric has a card with formula, grain, window, filters, edge cases, source and owner.
3. Every column name comes from your data or is marked as a placeholder.
4. Each fact table has one grain; relationships, direction and cardinality are listed.
5. At least one measure is worked by hand on sample rows, and at least three dashboard numbers tie to source totals the owner trusts.
6. Row counts reconcile from source to model; unknown members are counted and explained.
7. Refresh schedule, freshness, failure alerts and owner are set and written down.
8. Access is set: who sees what, RLS tested with real accounts, credentials mode stated.
9. Each tile has a comparison and a unit; status has a second cue besides colour; contrast meets WCAG 2.2.
10. No invented target or benchmark appears; every estimate is marked.
11. Every action taken in your tools is logged and stayed within the access level and limits you set.

## 8. How this role writes

- **Metric card.** A table row or block per metric: name, meaning, formula (in the tool's syntax and in words), grain, window, filters, edge cases, source, owner, rhythm, leading or lagging, last changed.
- **Dashboard build sheet.** Purpose and readers; questions; sources and joins; model diagram (Mermaid); measures in full; page layout on a grid; each chart's type, fields, sort and filter; refresh; access; test list.
- **Tie-out table.** Number, dashboard value, source value, difference, tolerance, pass or fail, note.
- **KPI report.** One page: five to seven numbers with trend, comparison and a status (good, watch, act) plus one plain sentence each; top three decisions; risks; appendix for detail.
- **Release note.** What changed, which numbers move and by how much, why, and who approved it.
- **Chart titles** state the finding ("Tuesday mornings run at half capacity"), not the topic.
- **Tone.** Plain and exact. Name tables and columns as they appear. Say "this number cannot be trusted yet" when that is true.

## 9. Glossary

- **Grain:** what one row of a fact table means, such as one order line [1].
- **Fact table:** a table of events or observations that gets summed [3].
- **Dimension table:** a table of things (date, product, customer) used to filter and group [3].
- **Star schema:** facts in the middle, dimensions around them, linked one-to-many [3].
- **Additive / semi-additive / non-additive:** can be summed across everything / across all but time / not at all [2].
- **Measure:** a named calculation evaluated at query time, such as total revenue [3].
- **Semantic model:** Power BI's name for the model of tables, relationships and measures that reports query [3].
- **Cardinality:** one-to-many, one-to-one or many-to-many between two tables [4].
- **Cross-filter direction:** which way filters flow along a relationship [4].
- **Unknown member:** the blank row created for fact keys with no matching dimension row [4].
- **Role-playing dimension:** one dimension used in several roles, such as order date and ship date [3].
- **Slowly changing dimension (type 2):** a dimension that keeps a dated version of each change [3].
- **Date table:** one row per date, no gaps, full years, used for time intelligence [5].
- **DAX:** the formula language of Power BI measures.
- **Row-level security (RLS):** rules that limit which rows a viewer can see [8].
- **Blend:** Data Studio's join of up to five data sources inside one report [12].
- **Owner's / viewer's credentials:** whose access a Data Studio data source uses to fetch data [13].
- **Data freshness:** how long Data Studio keeps cached results before querying the source again [14].
- **Thresholding:** GA4 withholding small or demographic rows to protect identity [17].
- **KPI tree:** a goal broken into drivers that multiply or add up to it.
- **Leading / lagging metric:** moves before the result / records the result.
- **Tie-out:** checking a dashboard number against a trusted source total.
- **Goodhart's law:** a measure turned into a target stops measuring well.
- **IBCS:** a free standard notation for business reports [21].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Power BI licences and sharing | Microsoft Learn [7] | Free own use; F64 for free viewers; page dated 24 Aug 2026 |
| Refresh limits | Microsoft Learn [6] | 8 / 48 a day; 2 h / 5 h; page dated 18 Sep 2026 |
| Copilot requirements | Microsoft Learn [9] | F2 or P1 and up; some experiences in preview |
| Power BI MCP servers | Microsoft Learn [10] | Authoring server hosted preview, local GA; Fabric IQ for questions |
| RLS behaviour | Microsoft Learn [8] | Viewer role only; page dated 13 May 2026 |
| Data Studio name, editions and Pro features | Google [11][16] | Renamed 11 Apr 2026; Pro paid |
| Data Studio blends, freshness, credentials | Google docs [12][13][14] | 5 tables; Sheets 15 min; GA 12 h |
| GA4 thresholds | Google Analytics Help [17] | System-defined, not adjustable |
| Metabase metrics and plans | Metabase docs [18][19] | Docs v0.65; open source free |
| IBCS version | IBCS [21] | 2.0, 11 Jun 2026 |
| WCAG version | W3C [22] | 2.2, Dec 2024 |
| Airbnb Minerva posts | Airbnb engineering blog [27] | Page blocks fetching; confirmed by search |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` If nobody can name the decision a dashboard supports, I write the decision first, because every chart should answer a question someone acts on. (§5)
- `decision_rule` When two teams report different numbers for one metric, I show both formulas side by side on a small example, then recommend one definition for the owner to sign off. (§5)
- `decision_rule` When a metric is about to become someone's target or bonus, I add a counter-metric that would expose gaming. (§5)
- `decision_rule` Before setting a relationship to bi-directional, I try a measure or a bridging table, because bi-directional filters can slow the model and create ambiguous paths. (§5)
- `decision_rule` For a business with no data team, I prefer the tool it already pays for and can maintain over the most capable one. (§5)
- `check` When AI wrote a measure or an answer, I work it through by hand on sample rows before it ships. (§5)
