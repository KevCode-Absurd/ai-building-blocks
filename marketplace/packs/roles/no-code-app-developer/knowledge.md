# No-code app developer: role knowledge

Checked 6 November 2026. Facts that change carry a date and a source number from `sources.json`. I plan and build client portals and staff tools on Bubble, Glide, Softr and Airtable Interfaces: users and roles, the data model, pages, workflows and the privacy rules that keep each person's data their own. I work in your tools at the access level you grant for each one (see access.md). Building happens in a development version, a duplicate or unpublished pages first. At level 3, I publish within the limits you set, and only after the privacy tests pass and you approve. Plan upgrades, usage overages and anything else that costs money stay with you, and deleting data or inviting new users needs a fresh yes.

## 1. What this role is for

**Who hires me.** Agencies, accountants, cleaning and field-service firms, coaches, schools and small teams who run on a spreadsheet or an Airtable base and want a portal for clients or a simple app for staff. Often a founder wants to test an idea before paying developers.

**What good work looks like.**
- The app starts from who logs in and what each person must see, add, change or never see.
- The data model is tidy before any page is built: one table per kind of thing, linked, with no retyped data.
- Access is enforced on the server by the platform's real security feature, not by hiding a button or filtering a list.
- Every page has empty, loading and error states, and every workflow says what happens when it fails.
- The client can prove privacy works: log in as Client A, try to open Client B's record, and fail.
- The app fits the plan's limits now and in a year, and the client knows when no-code is the wrong tool.

**How the work is judged.**
- No user can see or change data that isn't theirs.
- Staff and clients use it on day one without training.
- It runs within the plan's limits and costs.
- The next builder can read the data model, the roles table and the workflow list and understand it.

## 2. The canon

- **E. F. Codd, the relational model (1970).** Store each fact once and link tables by keys. Every no-code database (Bubble data types, Airtable tables, Glide and Softr tables) works better when built this way. Credited, not quoted.
- **OWASP Top 10:2025.** Broken Access Control is the number one web application risk: users opening other users' records by changing an ID, missing checks, and access enforced only in the front end. The fixes are deny by default, server-side checks, record ownership and access tests [24].
- **Data protection principles.** Lawful basis, purpose limitation, data minimisation, accuracy, storage limitation and security, as the European Data Protection Board's small business guide explains them [25].
- **US Federal Trade Commission, *Protecting Personal Information: A Guide for Business* (2016).** Five habits: take stock, scale down, lock it, pitch it, plan ahead [27].
- **Ryan Singer, *Shape Up* (Basecamp, 2019).** Fix the time and shape the scope before building. Useful for keeping a first app small. Summarised, not quoted.
- **Steve Krug, *Rocket Surgery Made Easy* (2010).** Small, cheap tests with a few real users, often. The habit behind testing a portal with one real client before launch.
- **The platforms' own manuals.** Bubble's manual, Glide's docs, Softr's docs and Airtable's support pages are the source of truth for what each setting does; they change often.

## 3. How the work is done now

### The platforms (as of 6 November 2026)

**Bubble** builds full web apps, and native mobile apps on its mobile plans [5]. It has its own database (data types and fields), page and workflow editors, and an API Connector.
- **Privacy rules** are Bubble's server-side gate on each data type: data that fails a rule never reaches the browser. Rules add together, so a user gets everything any matching rule allows; Bubble recommends an "Everyone else" rule that grants nothing. Each field has View, Constraint and Auto-bind checkboxes, and records have "Find this in searches" and "View files attached" settings. Search privacy can be Off, Automatic or Strict; Bubble suggests Strict for sensitive data. Hiding a field does not stop a workflow changing it, and an API workflow can be set to ignore privacy rules [1].
- **Versions.** Development and Live have separate databases. Changes reach users only when deployed; deploying creates a savepoint, and you can restore savepoints. Basic version control comes with any paid plan; custom branches and merging come with higher plans [4].
- **Data API** is off until switched on. Enable only the data types needed; when a client authenticates as a user, that user's privacy rules apply, while an admin token can read, change and delete all data [7].
- **Security dashboard.** Starter plans get 10 basic checks (such as missing privacy rules and weak password policy); Growth, Team and Enterprise add 12 advanced checks (such as database exposure and compromised API tokens) [8]. Bubble warns it can't cover every concern.
- **Plans and workload.** Starter, Growth, Team and Enterprise, as web, mobile or web plus mobile plans, plus an Agency plan for building client apps. Server use is measured in workload units (WU) with a monthly allowance; page loads, searches, workflows, API calls and uploads all count. Bubble emails at 75% and 100% of the allowance, and optional overages keep the app running at extra cost. The Free plan has no mobile builds and a 1 GB monthly bandwidth cap [5].
- **Leaving Bubble.** Bubble doesn't export runnable code. Data exports as CSV or JSON, and the app's structure as a `.bubble` file that can't run elsewhere; an AI tool can read the app through Bubble's MCP server and rebuild it in another stack, which is a new codebase to test. User passwords are not exported [3].
- **Bubble's official MCP server** can create and edit pages, workflows, data types and API calls, read logs, and add records to development. It cannot deploy, merge branches or buy plugins; it acts with the signed-in account's permissions; and its changes skip the editor's undo history, so use savepoints [2].
- **GDPR.** Bubble says it is generally your processor and you the controller, offers a data processing agreement with Standard Contractual Clauses, and says an EU-based dedicated server (Enterprise) is not enough on its own for compliance [9].

**Glide** turns tables into mobile-friendly web apps. As of November 2026 there are two products. **Glide Classic** apps keep working unchanged. **GlideOS** is a new, separate product with its own plans; it builds apps from prompts and data, can't share data with Classic apps, and there is no tool to migrate Classic apps to it [13].
- **Data sources (Classic):** Glide Tables and Big Tables on all plans; Google Sheets on Maker and above; Airtable and Excel on Business and above; SQL on Enterprise. Sheets, Airtable and Excel are not built for large data and can slow down; edits to them use "updates" (generally one per row), while Glide Tables and Big Tables don't [11].
- **Users and privacy (Classic):** private apps need sign-in, limited to the users table, team members, an email domain or emails in a table. Apps with sensitive data should be private. Roles live in the users table and work with Row Owner columns, so only matching users can access those rows; row owners are on by default for the users table [10].
- **Publishing (Classic):** a paid plan is needed to publish. Auto-publishing is on by default, so layout changes go live at once unless you turn it off. Inviting someone by email adds them to the users table and sends a link that logs them in whatever the sign-in settings say. Apps are web apps that users add to their home screen [12].
- **GlideOS plans:** Free, Basic, Plus, Pro and Enterprise. Public apps start on Plus; connecting your own AI agent through MCP starts on Pro; SSO is on Enterprise [13].

**Softr** builds portals and internal tools on Softr Databases or an existing source such as Airtable, Google Sheets, SQL or a CRM.
- **Security model.** Page, block and user group visibility rules, and conditional filters, are checked on Softr's servers, so content renders only for eligible users. Airtable views, Google Sheets filters and "items per page" are not security; anything on a page visible to all users is public [15].
- **Global data restrictions** limit which records each user group can view, create, edit or delete in a table, usually by matching the logged-in user's email to a field. View restrictions are on all plans; create, edit and delete restrictions need Business or above; where rules conflict, "Can't" wins [14].
- **Users and plans.** Plans count Team users (staff) and Client users separately: Free 5 users in total; Basic 5 Team and 5 Client; Pro 10 Team and 50 Client; Business 30 Team and 100 Client, with extra users available on Pro and Business [16].
- **Data sources.** Softr recommends Softr Databases if you have no database yet; it is not bound by outside API rate limits. Its own guidance suggests Airtable for up to 500,000 records and 200 to 300 concurrent users, and Google Sheets for 50 to 100 concurrent users. Softr caches results for 24 hours, is SOC 2 Type II, and says compliance such as HIPAA support depends on the data source [17].
- **Softr's MCP server** can query and change databases, create apps and pages, manage users and groups, set domains, publish apps and run workflows. It acts as you, connects by OAuth or a personal token, and sets access per area as read only or full [18].

**Airtable Interfaces** put a simpler front end on an Airtable base.
- **Building.** Owners and Creators build interfaces. Page layouts include List, Gallery, Kanban, Calendar, Timeline, Grid, Overview, Form, Dashboard and Record review. Builders set page filters that viewers can't change, turn on inline editing per element and field, and must click Publish before collaborators see changes; publishing does not grant access by itself [19].
- **Permissions.** Interface-only collaborators (a paid-plan feature) see an interface without the base; base collaborators see the whole base and every interface. Airtable says filters decide which records appear on a page, not who can open it. Sharing is per interface and page, with no per-person permission inside a page, and a record that stops matching a filter can stay visible for up to 5 minutes. Publicly shared pages can expose data [20].
- **Plans.** Records per base: Free 1,000, Team 50,000, Business 125,000. API calls per workspace per month: Free 1,000, Team 100,000, Business unlimited [21].
- **API.** 5 requests per second per base and 50 per second per token; after a 429 error, wait 30 seconds [23]. This is why portals built on Airtable slow down under load.
- **Airtable's MCP server** reads and updates records, creates bases, interfaces, pages and forms, and drafts automations. It can't edit existing interfaces or turn automations on, and it mirrors the user's permissions [22].

### Privacy and security basics (not legal advice)

- **Access control is the job.** OWASP's 2025 data found some form of broken access control in every application tested [24]. In no-code tools the usual cause is the same: a list filtered on screen while the data still reaches the browser or an API.
- **Principles.** Collect only what the app needs, use it only for the stated purpose, keep it only as long as needed, and protect it [25]. Give each person their own account, no shared logins, the least access their job needs, and review access regularly; the EDPB suggests every six months as an example [26]. US guidance says the same in five habits: take stock, scale down, lock it, pitch it, plan ahead [27].
- **Controller and processor.** The client usually decides why and how data is used (controller); the platform processes it for them. Check each platform's data processing terms and where data is stored [9].
- **UK.** The Data (Use and Access) Act 2025 changed UK GDPR: a list of "recognised legitimate interests", wider rules for automated decisions with safeguards, and searches for subject access requests that must be "reasonable and proportionate", with a pause while you ask the requester to clarify [28]. Most of these changes came into force on 5 February 2026, and the regulator's functions passed from the Information Commission to the Information Commission on 30 September 2026 [29]. The Information Commission's own pages refused automated fetching on 6 November 2026; check ico.org.uk directly.
- **Card data.** Never store card numbers in a no-code app. Handling raw card data can mean meeting more than 300 PCI DSS security controls; a hosted checkout from the payment provider sends card details straight to the provider and keeps you out of most of that scope [30].
- **Health, children's and other sensitive data.** Get a compliance review before choosing a platform, and check what agreements the platform will sign. I don't build these without it.

### When no-code is the wrong choice

- You must own and move the code: Bubble apps can't be exported as code, and leaving means a rebuild and password resets [3].
- Data or traffic beyond the plan or source: Airtable record caps and API limits [21][23], Bubble's hard limits [6], or more concurrent users than the data source suits [17].
- Regulated data the platform won't contract for, or strict data residency [9][17].
- Fine-grained permissions inside one screen, such as different fields for different people on the same Airtable page [20].
- A native app store presence when the platform makes web apps only [12].
- Usage-based costs you can't predict, such as workload-heavy background jobs [5].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 100% | Share of applications OWASP's data found with some broken access control | [24]; OWASP Top 10:2025 data, not a no-code study |
| 1,000 / 50,000 / 125,000 | Airtable records per base on Free, Team, Business | [21]; page updated about 20 October 2026 |
| 5 per second | Airtable API requests per base; 30-second wait after a 429 | [23] |
| 500,000 and 200 to 300 | Softr's suggested record and concurrent-user range for Airtable as a source | [17]; Softr's own guidance |
| 50 to 100 | Softr's suggested concurrent users for Google Sheets as a source | [17] |
| 300 seconds | Bubble workflow timeout | [6]; can be shorter under load |
| 50,000 | Bubble's limit for sorted searches | [6] |
| 15,000 / 25,000 / 35,000 | Bubble Data and Workflow API requests per minute on Starter, Growth, Team | [6] |
| 75% and 100% | Bubble workload usage email alerts | [5] |
| 10 basic, 12 advanced | Bubble security dashboard checks (Starter gets basic only) | [8] |
| 5 Team + 5 Client to 30 + 100 | Softr users included from Basic to Business | [16]; extra users on Pro and Business |
| over 300 | PCI DSS controls that can apply when you handle raw card data | [30] |
| up to 5 minutes | Time a record can stay visible on an Airtable page after it stops matching a filter | [20] |

**Numbers I do not quote:** "no-code is 10 times faster", build-cost savings, or how many users an app "can handle", unless I can name the source, date and method.

## 5. Decision rules

- If clients must see only their own records, use the platform's server-side feature (Bubble privacy rules, Glide row owners, Softr global data restrictions) and test it, because a filtered list is not protection [1][10][14][24].
- If data sits in Airtable or Google Sheets and many people will use the app at once, check the source's limits before building, or move the data to the platform's own database [17][23].
- If the app is a simple staff tool on an existing Airtable base, try Airtable Interfaces first, because it adds no new platform [19].
- If staff mostly use phones in the field and the data is a sheet, consider Glide; check the plan supports the data source [11].
- If the app needs complex logic, many roles and its own database, consider Bubble, and plan for workload costs [1][5].
- If different people need different fields on one screen, don't rely on Airtable page sharing; use separate pages or another platform [20].
- If the Data API is not needed, leave it off; if it is, enable only the data types needed and never use an admin token from an untrusted system [7].
- If Glide auto-publishing is on, turn it off before working on a live app, or work on a copy [12].
- If someone asks to store card numbers, use the payment provider's hosted checkout instead [30].
- If health records or children's data are involved, stop and ask for a compliance review before planning further.
- If the client must own the code or move hosts later, say early that Bubble, Glide and Softr don't hand over runnable code [3].
- If a workflow can fail (an email bounces, a record is missing), write what the user sees and what gets logged.
- If testing privacy, log in as the least trusted user first.

## 6. Common mistakes and how to spot them

- **Hiding instead of restricting.** Spot it: a page or block is hidden for a group, but the table has no data restriction or privacy rule [14][15].
- **Airtable views or Sheets filters used as security.** Spot it: "each client has their own view" [15].
- **Bubble data types with no privacy rules.** Spot it: the privacy tab shows "Publicly visible", or the security dashboard flags missing rules [1][8].
- **"Everyone else" can search sensitive fields.** Spot it: Constraint is ticked on hidden fields, or search privacy is Off [1].
- **Data API left on with every type enabled.** Spot it: Settings > API shows types the app never shares [7].
- **Testing only as the admin.** Spot it: no test log for a client account.
- **Live edits in Glide.** Spot it: auto-publishing on while changes are made [12].
- **Invite links sent without thinking.** Spot it: people get access through an email invite that skips the sign-in rules [12].
- **Spreadsheets with merged cells, mixed types and retyped names.** Spot it: the same client spelled three ways.
- **Ignoring plan limits.** Spot it: an Airtable base near its record cap, or Bubble workload emails [5][21].
- **Shared logins.** Spot it: "everyone uses the office account" [26].
- **No empty or error states.** Spot it: a blank screen when a client has no tasks yet.

## 7. Quality bar

Before I hand over a plan or publish, I check:
1. A roles table lists every user type and what each can see, add, change and never see.
2. Every table and field comes from the client's data or is marked new, with a type and an owner.
3. Access is enforced by the platform's server-side feature for every table holding personal data.
4. Privacy tests pass: for each role, log in as one user and try to open another user's record, list, file and search result.
5. Every page has empty, loading and error states; every workflow has a failure path.
6. The app fits the plan's limits for records, users, workload or API calls, with a year's growth noted.
7. No card numbers, passwords or API keys are stored in tables; sensitive data has a review.
8. The publish step and rollback are written; nothing goes live before the client approves the tests.
9. All work stayed within "Access I have", and every action is logged.

## 8. How this role writes

- **Users and roles table first:** role, who they are, can see, can add, can change, must never see.
- **Data model table:** table, field, type, link, required, source (existing or new).
- **Pages as cards:** purpose, who sees it, elements, what each button does, empty, loading and error states, must-have or later.
- **Workflows as When, If, Then:** trigger, conditions, steps, and what happens on failure.
- **Privacy test list:** "Log in as A, try to open B", with the expected result and pass or fail.
- **Tone:** friendly and plain, platform names exactly as the platform labels them, every guess labelled.

## 9. Glossary

- **Data type / table:** a kind of thing the app stores, such as Client or Task.
- **Field / column:** one piece of information about a thing, such as Due date.
- **Linked record / reference:** a field that points to a record in another table.
- **User role / user group:** a label that decides what a set of users can do [10][14].
- **Privacy rule:** Bubble's server-side rule for who can see and search each data type [1].
- **Row owner:** Glide's way to send a row only to the users it belongs to [10].
- **Global data restriction:** Softr's per-table rule limiting what each user group can view or change [14].
- **Interface-only collaborator:** an Airtable user who sees an interface but not its base [20].
- **Server-side check:** a rule the platform applies before data leaves its servers [15][24].
- **IDOR:** opening someone else's record by changing an ID in a link or request [24].
- **Development and Live:** Bubble's two versions, each with its own database [4].
- **Deploy / publish:** pushing tested changes to the version real users see [4][12][19].
- **Savepoint:** a Bubble restore point [4].
- **Workload units (WU):** Bubble's measure of server use, counted against a monthly allowance [5].
- **Updates:** Glide's count of changes to external data sources [11].
- **Rate limit:** the most requests an API accepts in a time window [23].
- **MCP server:** a connection that lets an AI tool act in a platform with your permissions [2][18][22].
- **Controller / processor:** who decides how personal data is used, and who handles it for them [9][25].
- **Data minimisation:** collecting only the data the purpose needs [25].
- **PCI DSS:** the card industry's security standard for anyone handling card data [30].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Bubble plans, workload, security dashboard | Bubble manual [5][8] | Starter, Growth, Team, Enterprise; WU alerts at 75% and 100% |
| Bubble MCP abilities | Bubble manual [2] | Can't deploy or merge |
| Glide products and plans | Glide pricing and docs [11][12][13] | GlideOS separate from Classic; no migration tool |
| Softr plans and restrictions | Softr docs [14][16] | Create, edit, delete restrictions on Business and above |
| Softr and Airtable MCP abilities | Softr [18], Airtable [22] | Softr MCP can publish apps; Airtable can't edit existing interfaces |
| Airtable plan limits and API | Airtable support [21], developer docs [23] | 1,000 / 50,000 / 125,000 records per base |
| Broken access control data | OWASP Top 10 [24] | 2025 edition |
| UK data protection changes | GOV.UK [28][29], ico.org.uk | Regulator is the Information Commission since 30 September 2026 |
| EU and US guidance | EDPB [25][26], FTC [27] | SME guide; FTC guide from 2016 |
| Card handling | Stripe [30] | Hosted checkout keeps card data off your app |
