# Give your agents access to Meta ads

Checked 15 November 2026. Meta renames menus often. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Read results, delivery, ad review status, the activity log, Events Manager health and the Ad Library. Change nothing. | Every Meta agent, the daily data pipeline, the results loop |
| 2, draft | Also upload images and videos and build creatives, campaigns, ad sets and ads as drafts or paused. Nothing spends. | The launch team (build stage) |
| 3, publish | Also switch ads on, change budgets within your step limit, and pause. Only as steps of a plan you approved with "yes" and its code. | The launch team (go-live), the results loop (act stage) |

The approval gate in your agent folder enforces level 3 in code: a write runs only when it is the next step of a plan you approved, with exactly the input you saw. The steps below give the access; the gate decides when it is used.

## What you need first

- Admin access to your business portfolio in Meta Business Suite (full control), or someone who has it sitting with you.
- Your ad account already set up with a payment method and an account spending limit. The agents never touch billing or the spending limit. Set the spending limit yourself in Billing as a last safety net.
- A Claude plan that allows custom connectors (Free allows one; Pro, Max, Team and Enterprise allow more; on Team and Enterprise only an Owner can add one) ([Claude help](https://support.claude.com/en/articles/11175166)).

## Way 1: in Claude (start here)

This one connection serves Claude chat, Claude Code on your computer and Claude scheduled tasks, because they all use the connectors on your Claude account.

1. In Claude, open **Settings**, then **Connectors**, then **Add custom connector**.
2. Name it `Meta Ads` and paste this address: `https://mcp.facebook.com/ads` (Meta's own server, see [Meta's developer docs](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-overview)). Save.
3. Click **Connect**. A Facebook window opens. Sign in as yourself, pick your business portfolio and the ad accounts the agents may use (only those), and accept.
4. Back in Claude, open the connector's tool permissions ([Claude help](https://support.claude.com/en/articles/11176164)):
   - Read tools: **Always allow**.
   - Write tools (anything that creates, uploads, updates, activates or starts a test): **Needs approval**.
   - Delete tools: **Blocked**.
5. Tell Claude: "Check my Meta connection." It runs the read-only test below.

For Claude Code only: if you prefer a connector that lives just on your computer, Meta's command needs a Meta app id: `claude mcp add --transport http --client-id <META_APP_ID> meta-ads https://mcp.facebook.com/ads` ([Meta get started](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-get-started)). Claude scheduled tasks cannot see connectors added this way, so most owners should use step 1 instead.

## Way 2: for the data pipeline and hosted agents

The daily data pipeline reads your numbers with plain code, without a model, so it is cheap and the same every day. It needs a read-only token. A hosted agent (one running on a server, not in your Claude) also needs a separate publish token. Do this with Claude beside you; it will tell you what it sees at each step.

1. **Make an app in your business.** Go to [Meta for Developers](https://developers.facebook.com/), then **My Apps**, then **Create app**. Choose the business type and connect it to your business portfolio. Add the Marketing API. For your own ad accounts, the standard access level (now called the Marketing API Access Tier) is enough; the advanced level and App Review are only for managing other people's accounts ([Meta authorization](https://developers.facebook.com/docs/marketing-api/get-started/authorization)).
2. **Make a reader.** In Meta Business Suite, open **Settings**, then **Users**, then **System users**. Add one called `store-agents-reader` with the **Employee** role.
3. **Give the reader your ad account, read only.** On that system user, choose **Assign assets**, pick the ad account, and give only the task that lets it view performance.
4. **Make the reader's token.** On the system user, choose **Generate new token**, pick your app, and tick only `ads_read`. Copy it once.
5. **Store it in one place only.** Paste it into your host's secret store (on Railway: the service's **Variables**, named `META_READ_TOKEN`). Never paste a token into chat, a file, a spreadsheet or the repository. If it ever lands somewhere else, revoke it and make a new one.
6. **Only for a hosted agent that publishes:** repeat steps 2 to 5 with a second system user, `store-agents-publisher`, also with the **Employee** role (Meta's ads server does not accept admin system users). Give it the task that lets it manage campaigns on the same ad account, and tick `ads_management`, `ads_read` and `ads_mcp_management`. Store it as `META_PUBLISH_TOKEN`. The hosted gate holds this token; the model never sees it.

System user tokens do not expire, so treat them like a key to your bank card and revoke them when you stop using them.

## Safety switches on Meta's side

- **Ads MCP server rules.** If your business has them (Meta lists them as limited availability; businesses not enrolled get error code 10), open **Business Settings**, then the **Ads MCP server** section, and set rules per ad account: block creating campaigns at level 1, block budget rises above a percentage or amount, or block all agent actions ([Meta rules](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-rules-best-practices.md)). A rule shown as paused is not enforced.
- **Account spending limit** in Billing: a hard ceiling on total spend that no agent can change.
- **Draft mode.** With draft mode on for the connection, new objects go to the Ads Manager draft first, and nothing goes live until an activate call.

## Check it works

Claude runs `ads_get_ad_accounts` and then `ads_get_ad_entities` for yesterday, read only. A good answer lists your ad account by name with its currency and time zone, shows that the ads server is enabled for it, and gives yesterday's spend that matches Ads Manager within a few cents. For the pipeline token, Claude runs `node warehouse/meta-sync.mjs --check` with `META_READ_TOKEN` and `META_API_VERSION` set (the newest version in Meta's Marketing API changelog), which lists the ad accounts the reader can see and changes nothing.

## Take access away

- **Claude connector:** Claude **Settings**, **Connectors**, the Meta Ads connector, **Disconnect** or remove. Then, in Meta Business Suite, check **Settings** for business integrations and remove the connection if it is still listed.
- **Tokens:** in **System users**, revoke the token, or remove the ad account from the system user's assets, or delete the system user. Then delete the variable from your host.
- **Pause everything now:** tell any agent "pause all agent work", or on your computer set every write tool to Blocked in the connector settings. In Ads Manager you can always pause campaigns yourself.

## What stays with you

Billing, payment methods and the account spending limit; adding people or partners to your business portfolio; Special Ad Category choices; customer list uploads; deleting anything; and appeals for rejected ads or account restrictions. The agents prepare these for you and tell you exactly where to click.

## Sources

- Meta ads MCP server overview and get started, checked 15 Nov 2026: [overview](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-overview), [get started](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-get-started)
- Meta ads MCP server rules, checked 15 Nov 2026: [rules](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-rules-best-practices.md)
- Marketing API authorization and access levels, checked 15 Nov 2026: [authorization](https://developers.facebook.com/docs/marketing-api/get-started/authorization), [access tier rename](https://developers.meta.com/blog/updates-to-ads-management-standard-access-feature/)
- Claude custom connectors and tool permissions, checked 15 Nov 2026: [connectors](https://support.claude.com/en/articles/11175166), [permissions](https://support.claude.com/en/articles/11176164)
