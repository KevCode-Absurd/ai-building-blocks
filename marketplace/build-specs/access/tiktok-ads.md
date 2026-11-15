# Give your agents access to TikTok Ads

Checked 15 November 2026. TikTok's help centre and developer pages block automated reading, so some facts below come from TikTok's pages as shown in search results; each one says so. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Read results, delivery, ad review status, Pixel and Events API health, and your catalog. Change nothing. | Zara (TikTok ads), the data pipeline, the readouts |
| 2, draft | Also upload videos and build campaigns, ad groups and ads switched off. Nothing spends. | Zara (build stage) |
| 3, publish | Also switch ads on, change budgets within your step limit, and pause. Only as steps of a plan you approved with "yes" and its code. | Zara (go-live and act stages) |

The approval gate in your agent folder enforces level 3 in code: a write runs only when it is the next step of a plan you approved, with exactly the input you saw. The steps below give the access; the gate decides when it is used.

## The official path for agents, as of November 2026

- **TikTok for Business MCP server**, TikTok's own. It is listed in Claude's connector directory, made by TikTok and marked Anthropic verified, with the line "Create, manage, and analyze advertising campaigns on TikTok" ([Claude directory listing](https://claude.com/connectors/tiktok-for-business)). The listing shows 39 tools; the names we could see were almost all read tools, plus `smart_plus_ad_create`. TikTok's help article also describes a larger mode with around 400 tools (seen in search results) ([TikTok help](https://ads.tiktok.com/resources/help/article/about-tiktok-for-business-mcp-server)).
- **TikTok Business API** (the Marketing API). In TikTok's official SDK, a new campaign's `operation_status` defaults to `ENABLE`, which means on ([TikTok SDK docs](https://raw.githubusercontent.com/tiktok/tiktok-business-api-sdk/main/python_sdk/docs/CampaignCreateBody.md)). So every build plan sets `DISABLE`, and the gate refuses a create step without it.
- We found no spend limit for agents in TikTok's MCP docs. Your campaign budgets, your limits file and the approval gate are the controls.

## What you need first

- **Admin** in your TikTok Business Center, or someone who has it sitting with you. Business Center members are Admin or Standard; on each ad account a member is Admin, Operator or Analyst. Operator can create and edit ads and also manage finance; Analyst can only view (TikTok help, seen in search results) ([roles](https://ads.tiktok.com/help/article/about-business-center-roles-and-permissions)).
- Your ad account already set up with a payment method. The agents never touch billing.
- A Claude plan that allows connectors. Search results quote TikTok's Claude guide as asking for a Pro or Max plan; we could not open that page to confirm.

## Way 1: in Claude (start here)

1. In Claude, open **Settings**, then **Connectors**, and find **TikTok for Business** in the directory (made by TikTok). If it is not listed for your plan, choose **Add custom connector** and use the address on the directory listing: `https://business-api.tiktok.com/open_mcp/tt-ads-mcp-layer-anthropic`.
2. Click **Connect**. A TikTok window opens. Sign in with your TikTok for Business account, read the permissions it asks for, choose only the ad accounts the agents may use, and approve.
3. Open the connector's tool permissions ([Claude help](https://support.claude.com/en/articles/11176164)):
   - Read tools (names ending in `_get`, `_list` or `search`, such as `report_integrated_get` and `advertiser_info_get`): **Always allow**.
   - Every tool that creates, updates, changes status or budget (for example `smart_plus_ad_create`): **Needs approval**.
   - Any delete tool: **Blocked**.
   Check the exact names in your tool list; the listing hides some names behind "Show all".
4. Search results quote TikTok's Claude guide as saying the authorisation lasts 30 days, then you approve it again. We could not open that page to confirm; if Claude reports a sign-in error after about a month, reconnect.
5. Tell Claude: "Check my TikTok connection." It runs the read-only test below.

## Way 2: for hosted agents

A hosted agent needs its own app and token. Do this with Claude beside you.

1. **Make a developer app.** Third-party guides describe this as the TikTok API for Business portal (business-api.tiktok.com), **My Apps**, **Create App**, with a name, a description and a redirect address; check the labels on your screen. TikTok reviews the app before it works.
2. **Pick the fewest permissions.** For a reader, tick only reporting and ad account read permissions. For a publisher, add ad management. Never tick finance or Business Center management permissions. Check the exact permission names on the app page.
3. **Authorise it for your ad accounts** with your Business Center Admin login, choosing only the ad accounts the agents may use.
4. **Store the token in one place only:** your host's secret store (on Railway: the service's **Variables**, for example `TIKTOK_READ_TOKEN` and `TIKTOK_PUBLISH_TOKEN`). Never paste a token into chat, a file or the repository. We could not confirm from TikTok's own page how long these tokens last; read the expiry on the app page and put a reminder in your calendar.
5. The hosted gate holds the publish token. Its write list is limited to the create and status calls in your build, go-live and act plans.

## Safety switches on TikTok's side

- **Ad review.** TikTok says review takes about 24 hours, and editing creative starts a new review (TikTok help, seen in search results) ([ad review FAQ](https://ads.tiktok.com/help/article/ad-review-faq)).
- **AI-generated content label.** A switch set when the ad is created adds a text label; advertisers must judge whether an ad needs it (TikTok help, seen in search results) ([disclaimers](https://ads.tiktok.com/help/article/add-disclaimers-to-ads)). Your creative review records the answer and the build plan sets it.
- **Spark Ads.** A creator's post runs as your ad only with a code the creator gives you, entered in Ads Manager ([Spark Ads for Smart+](https://ads.tiktok.com/resources/help/article/how-to-create-spark-ads-for-smart-campaigns-on-tiktok-ads-manager)). That needs your yes and the creator's agreement every time.
- **Lowest role.** Give an agent's own member Analyst for reading. Operator is the lowest role that can build, and it can also manage finance, so the gate's tool list never includes finance calls.

## Check it works

Claude runs `advertiser_info_get` for your ad account, then `report_integrated_get` for yesterday's spend by campaign. Both are read only. A good answer names your ad account with its currency and time zone, and gives yesterday's spend that matches Ads Manager for the same date.

## Take access away

- **Claude connector:** Claude **Settings**, **Connectors**, TikTok for Business, **Disconnect** or remove.
- **A member:** in Business Center, open the members or users list, choose the member, **Remove**, and confirm; TikTok may ask for a confirmation code (TikTok help, seen in search results) ([remove members](https://ads.tiktok.com/help/article/how-to-remove-members-from-your-ad-account-in-business-center)).
- **A developer app:** remove its authorisation for your ad accounts and delete the token from your host. We could not confirm the exact screen for this; ask Claude to find it with you.
- **Stop now:** switch campaigns off yourself in Ads Manager, then remove access as above.

## What stays manual, and why

- **Billing, finance and payment methods.** Money stays with you, even though Operator can reach finance.
- **Business Center membership and settings**, and linking your TikTok account to the ad account for Spark Ads.
- **Creator agreements, Spark Ads codes and creator payments.** These are contracts and payments.
- **Customer list uploads**, which need your consent basis checked first.
- **Appeals** for rejected ads or account warnings.

## Sources

- TikTok for Business connector in Claude's directory, checked 15 Nov 2026: [listing](https://claude.com/connectors/tiktok-for-business)
- TikTok for Business MCP server help article, seen through search results 15 Nov 2026: [help](https://ads.tiktok.com/resources/help/article/about-tiktok-for-business-mcp-server)
- TikTok Business API SDK, campaign create defaults, checked 15 Nov 2026: [SDK docs](https://raw.githubusercontent.com/tiktok/tiktok-business-api-sdk/main/python_sdk/docs/CampaignCreateBody.md)
- Business Center roles and removing members, seen through search results 15 Nov 2026: [roles](https://ads.tiktok.com/help/article/about-business-center-roles-and-permissions), [assets and permissions](https://ads.tiktok.com/help/article/about-assets-and-asset-level-permissions), [remove members](https://ads.tiktok.com/help/article/how-to-remove-members-from-your-ad-account-in-business-center)
- Ad review, AI labels and Spark Ads, seen through search results 15 Nov 2026: [ad review](https://ads.tiktok.com/help/article/ad-review-faq), [disclaimers](https://ads.tiktok.com/help/article/add-disclaimers-to-ads), [Spark Ads](https://ads.tiktok.com/resources/help/article/how-to-create-spark-ads-for-smart-campaigns-on-tiktok-ads-manager)
- Claude tool permissions, checked 15 Nov 2026: [permissions](https://support.claude.com/en/articles/11176164)
