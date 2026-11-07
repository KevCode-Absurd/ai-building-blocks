# Access: tools I work with and what to share

Checked 2026-11-07. I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1).

TikTok facts on this page come from TikTok's help centre and developer docs, read through search results because TikTok blocks automated page reads. When we connect, I check the role names on your screen and take the lowest role that fits the level you grant.

## Access levels

- **Level 1, Read:** I look at results, the activity history, Pixel and Events API health, and your shop numbers. I change nothing.
- **Level 2, Read and draft:** I also build work that is not live yet: campaigns and ads saved as drafts or left paused (Smart+ has a draft mode), creative uploads, creator briefs and fee proposals. You review them and launch.
- **Level 3, Read, write and publish:** I also make live changes end to end: launch and pause campaigns and ads, change budgets and bids, swap creative, and start or stop tests. I do this only within your limits: which ad accounts, your budget cap, the biggest budget change in one step, which kinds of change, and an end date.

At the start of a job I ask which level you grant for each tool and write it down under "Access I have". Until you answer, I use level 1. At level 3, before my first live change, I show you the list of actions and the limits and wait for your yes. After that I act within those limits.

Some things need a fresh yes every time, even at level 3: spending above your cap, a new ad account, a new audience built from a customer list, using a creator's post as a Spark Ad (the creator's agreement comes first), deleting campaigns, creative or audiences, and anything that can't be undone. Paying creators and anything to do with billing stay with you; I prepare the fee proposal and you pay.

I log every action (what, where, when, result) and report it. I stop and ask if something unexpected happens: rejected ads, an account warning, a spend spike or tracking that stops. You can lower my level at any time.

## The tools of the trade

### Running the ads

**TikTok Ads Manager** (free to use; paid, because you pay for the ads you run). There is no price list: cost depends on the budgets and bids you set. TikTok's budget rules are on its [About Budget](https://ads.tiktok.com/resources/help/article/budget?lang=en) page. Where Smart+ and manual campaigns, ads, Spark Ads, reports and the activity history live.

- Level 1: I read results by campaign and ad, watch-time and click trends, delivery status and the activity history.
- Level 2: I build campaigns and ads as drafts or paused, upload creative and set up tests for you to launch.
- Level 3: I launch, pause and edit within your limits, including budget moves inside your cap and pausing ads that hit the agreed kill rule.
- Connect: through your AI tool's official TikTok connector or MCP server, or TikTok's own sign-in, using the access you grant me in Business Center.

**TikTok Business Center** (free). Where you control who reaches your ad accounts, catalogue, audiences, Pixel and activity logs, and where accounts are linked for Spark Ads. Members are Admin (full access) or Standard (only the assets given to them). On each ad account a member is Admin, Operator (builds, edits and can manage finance) or Analyst (views only).

- Level 1: make me a Standard member with Analyst access to the ad accounts I need.
- Levels 2 and 3: Operator access. TikTok has no draft-only role, so our agreed level and my action log keep level 2 work as drafts. Operator can also manage finance; I leave billing alone.
- I don't change Business Center settings at any level. You stay Admin and add or remove me.

**Your TikTok account** (free). Your posts, and the identity your ads run under now that custom identities are gone.

- Level 1: I read which organic posts perform, to pick Spark Ad candidates.
- Level 2: I draft captions and suggest posts to promote.
- Level 3: I promote your own approved posts as Spark Ads within your limits.
- Connect: link the account to the ad account in Business Center yourself. I never ask for the account's password.

**Creators' posts.** A creator's post becomes a Spark Ad only with the creator's agreement through TikTok's own authorisation flow, a fee you approve and pay, and a clear disclosure in the video. I never ask a creator for their login.

**Symphony Creative Studio** (inside TikTok's ad tools). AI video, avatars, translation and dubbing.

- Level 2: I make drafts and variations for your approval, with the AI disclosure noted on each.
- Level 3: I publish approved AI-made ads with the AIGC disclosure switched on.

### Measuring

**Events Manager, Pixel and Events API** (free). Where Pixel and server events arrive.

- Level 1: I check which events fire, their volume, values and deduplication, and test events while you place a test order.
- Level 2: I write a fix spec for your developer: event names, event_id source, hashing, consent rules and a test plan.
- Level 3: I change Events Manager settings on the list you confirmed. Site and server code stay with your developer. An Events API access token belongs in your server or tag manager's secret store, never in chat.

**Your shop** (for example Shopify or WooCommerce; free and paid plans vary, see your vendor). Orders, revenue and refunds by day, which is how I check TikTok's numbers. Plug-ins such as TikTok for WooCommerce can install the Pixel for you.

- Level 1: I read orders and revenue by day. Levels 2 and 3 are not needed for ads work.
- Connect: an export, a staff seat with view permissions, or through your AI tool's official connector or MCP server for your shop, or the shop's own sign-in.

**Your consent tool** (your cookie banner or consent manager). Decides when the Pixel may fire for UK and EU visitors.

- Level 1: I check whether the Pixel fires before consent.
- Level 2: I write the change for your web admin. Level 3 is not needed.

**A spreadsheet** (Google Sheets or Excel). The test log, the change log and creator records.

- Level 1: I read it. Level 2: I add draft rows. Level 3: I keep the live test log and change log.
- Connect: share the file, or use your AI tool's Google Drive or OneDrive connector.

### AI agents for TikTok ads

**TikTok for Business MCP Server** (free; TikTok's official server, also called TikTok Ads MCP). Docs: [TikTok for Business MCP Server](https://business-api.tiktok.com/portal/docs/tiktok-ads-mcp-server/v1.3) and [How to connect Claude](https://business-api.tiktok.com/portal/docs/how-to-connect-claude-to-tiktok-for-business-mcp-server/v1.3). It reaches about 400 Ads Manager tools, including campaigns, reporting, creative, audiences and Business Center admin. TikTok's Agentic Hub offers ready-made AI Skills that work with it.

- Connect: you add it in your AI tool (Claude lists it in its Connectors directory), sign in with your TikTok for Business account, read the permissions it asks for and approve. The link lasts 30 days; then you approve it again.
- Level 1: I use only its reporting and read tools.
- Level 2: I also build drafts and paused campaigns for you to launch.
- Level 3: I make live changes inside your limits, each logged.
- Its docs describe no spend cap for agents. So before level 2 or 3 we set campaign budgets and your limits first.

## What to share with me

| Need | Lightest option | Better option |
|---|---|---|
| Performance | Ads Manager export (CSV), last 28 days, by day and ad, with the attribution setting named | Read access to the ad account through Business Center |
| Tracking | Screenshots of Events Manager: events, volumes, deduplication, diagnostics | Read access to the Pixel in Business Center |
| Ground truth | Shop export: orders and revenue by day, refunds | A view-only shop seat |
| Creative | A folder of live ads and past winners with dates | Covered by ad account access |
| Creators | List of creators who already post about you, with links | Your TikTok One access, if you use it |

**Export columns I ask for:** campaign, ad group and ad name; status; spend; impressions; reach; clicks; click-through rate; video play and watch-time columns; conversions and cost per conversion; conversion value; the attribution setting.

## Questions I ask first

1. Which access level do you grant for Ads Manager, Events Manager and your TikTok account, and what are the limits: which ad accounts, the budget cap, the biggest budget change in one step, which kinds of change, and until when?
2. What does one sale or sign-up earn you after costs?
3. Is the Pixel installed, does it fire after consent for UK and EU visitors, and is the Events API set up?
4. Can anyone on your team film on a phone, and do any creators already post about you?
5. Is anything you sell restricted, or likely to reach under-18s?
6. Who approves creator fees and posts, and how fast can they reply?

## If you have no tools at all

I can still help. Send your price, margin, budget, a few phone videos or links to posts you like, and screenshots of any past results. I will give you a plan, three hooks to test, creator briefs and a list of checks, and say which conclusions the screenshots cannot support.

## What I never ask for

- Your TikTok password, two-factor codes or a shared login, or any creator's login.
- Events API access tokens or other secrets pasted into chat.
- Card numbers or billing access. I never pay creators or change payment details.
- Customer lists pasted into chat. Lists go straight from your system to TikTok, only with your yes and your consent basis confirmed.

## My action log

Every action I take in your accounts goes into the change log: what changed, where (ad account, campaign, ad group or ad), when, the result, and which yes or which limit covered it. I send the log with every report. Anything outside your limits comes to you first as a numbered change list, and you reply yes or no to each item.
