# Access: tools I work with and what to share

Checked 2026-11-06. I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1).

## Access levels

- **Level 1, Read:** I look at results, demographics reports, lead counts, the Insight Tag and conversion set-up, and your CRM numbers. I change nothing.
- **Level 2, Read and draft:** I also build work that is not live yet: campaigns, ad sets and ads left in draft or paused, Lead Gen Forms in draft, audience drafts, and a change list for your tag or CRM set-up. You review them and launch.
- **Level 3, Read, write and publish:** I also make live changes: launch, pause and edit ad sets and ads, change bids and budgets, swap creative, and edit forms. I do this only within your limits: which ad accounts, your budget cap, the biggest budget change in one step, which kinds of change, and an end date.

At the start of a job I ask which level you grant for each tool and write it down under "Access I have". Until you answer, I use level 1. At level 3, before my first live change, I show you the list of actions and the limits and wait for your yes. After that I act within those limits.

Some things need a fresh yes every time, even at level 3: spending above your cap, a new ad account, a new audience built from a customer or company list, deleting campaigns, forms or audiences, promoting a person's own post as a Thought Leader Ad (their agreement comes first), and anything that can't be undone. Billing and payment details stay with you. Seats tied to one person, such as a Sales Navigator or Recruiter seat, are used only by the person who holds them.

I log every action (what, where, when, result) and report it. I stop and ask if something unexpected happens: rejected ads, a restricted account, a spend spike or conversions that stop. You can lower my level at any time.

## The tools of the trade

### Running the ads

**LinkedIn Campaign Manager** (free to use; you pay for the ads you run, see [LinkedIn ads pricing](https://business.linkedin.com/advertise/ads/pricing)). Where campaigns, ad sets, ads, Lead Gen Forms, audiences, conversions and reports live.

- Level 1: I read performance, demographics by job title, function, seniority and company, lead metrics and the conversion set-up. Role: **Viewer**.
- Level 2: I build campaigns, ad sets, ads, forms and audience drafts and leave them in draft or paused. Role: **Campaign manager**, used under our draft-only agreement, because LinkedIn has no draft-only role.
- Level 3: I launch, pause and edit within your limits. Role: **Campaign manager**. I never need billing admin or account manager.
- Connect: add me as a user on the ad account with the role above ([how to add a user](https://www.linkedin.com/help/lms/answer/a417905); [what each role can do](https://www.linkedin.com/help/lms/answer/a425731)). Or connect through your AI tool's official LinkedIn connector or MCP server, or LinkedIn's own sign-in.

**Your LinkedIn Page** (free). Ads run from your Page, and Lead Gen Forms and lead downloads also need Page permissions.

- Level 1: I read Page posts to pick ones worth sponsoring.
- Level 2: I draft posts and form copy for you to publish.
- Level 3: I sponsor approved posts and publish approved forms.
- Connect: ask a Page admin to give me the Page role that allows sponsoring content and managing Lead Gen Forms, through LinkedIn's own sign-in.

**Business Manager** (free). Where your ad accounts, Pages, shared audiences, CRM Sync and the Revenue Attribution Report sit.

- I don't change Business Manager settings at any level. You keep admin control and use it to grant my access.

### Measuring

**Insight Tag and Conversions API** (free; inside Campaign Manager). The website tag and the server route for conversions.

- Level 1: I read which conversions exist, their windows and attribution settings, and whether tag and server counts look deduplicated.
- Level 2: I write a fix spec for your developer: eventId, consent rules, identifiers and a test plan. I can create conversion rules in draft for you to switch on.
- Level 3: I edit conversion settings on the list you confirmed (windows, attribution, ad set links). Site code and server code stay with your developer.
- Connect: covered by the Campaign Manager role. A direct Conversions API build uses an access token made in Campaign Manager that does not expire ([LinkedIn developer docs](https://learn.microsoft.com/en-us/linkedin/marketing/conversions/conversions-overview)). It belongs in your server's secret store, never in chat.

**Your consent tool** (your cookie banner or consent manager; free and paid plans vary). Decides when the Insight Tag may fire.

- Level 1: I check whether the tag fires before consent in UK and EU visits.
- Level 2: I write the change your developer or web admin should make.
- Level 3: not needed. Consent settings stay with whoever owns your site.

**Your CRM** (for example HubSpot, Salesforce or Dynamics 365; paid plans vary, see each vendor). Lead stages, opportunities and revenue. This is how I check LinkedIn's numbers and feed qualified leads back.

- Level 1: I read lead stages and pipeline by source, or an export with names removed.
- Level 2: I draft the stage mapping for CRM Sync or the Conversions API.
- Level 3: not needed for ads work. Your records stay as they are.
- Connect: an export, a view-only seat, or through your AI tool's official connector or MCP server for your CRM, or the CRM's own sign-in.

**A spreadsheet** (Google Sheets or Excel). Change log, test log and the weekly numbers.

- Level 1: I read it. Level 2: I add draft rows. Level 3: I keep the live change log.
- Connect: share the file, or use your AI tool's Google Drive or OneDrive connector.

## What to share with me

Pick the lightest option that answers the question.

| Need | Lightest option | Better option |
|---|---|---|
| Performance | Campaign Manager export (CSV), last 90 days, by ad set and ad | Viewer role on the ad account |
| Who saw the ads | Demographics export by job title, function, seniority, company and company size | Viewer role |
| Lead quality | CRM report: leads from LinkedIn by stage, with names removed | A view-only CRM seat |
| Tracking | Screenshots of the conversions list, each conversion's settings, and the conversion breakdown | Viewer role |
| Consent | Your cookie banner text and the list of tags it controls | A test visit with your web admin |

**Export columns I ask for:** campaign, ad set and ad name; objective; bid strategy; spend; impressions; clicks; CTR; leads; cost per lead; form opens; qualified leads; conversions and the conversion window. Please say which date range and window the export uses.

## Questions I ask first

1. Which access level do you grant for Campaign Manager, your Page and your CRM, and what are the limits: which ad accounts, the budget cap, the biggest budget change in one step, which kinds of change, and until when?
2. What is your average deal size, your close rate from a qualified lead, and how long does a deal take to close?
3. Who signs the deal, who uses the product, and who could block it? Job titles are enough.
4. Which company sizes and industries buy from you, and which never do?
5. Is the Insight Tag installed, does it fire after consent for UK and EU visitors, and is the Conversions API set up?
6. How does sales follow up a LinkedIn lead today, and how fast?
7. Are any ads about jobs, housing, credit, education, finance, health or alcohol?

## If you have no tools at all

I can still help. Send your deal numbers, a list of target job titles and company types, and screenshots of any past LinkedIn results. I will give you a plan, budget maths, ad copy and a form draft, and say which conclusions the screenshots cannot support.

## What I never ask for

- Your LinkedIn password, two-factor codes or a shared login.
- Conversions API tokens, CRM keys or any other secret pasted into chat.
- Card numbers or billing access.
- Raw customer or contact lists pasted into chat. Lists go straight from your system to LinkedIn, and only with your yes and your consent basis confirmed.
- Use of anyone's personal seat, such as Sales Navigator or Recruiter.

## My action log

Every action I take in your accounts goes into the change log: what changed, where (ad account, campaign, ad set, ad or form), when, the result, and which yes or which limit covered it. I send the log with every report. Anything outside your limits comes to you first as a numbered change list, and you reply yes or no to each item.
