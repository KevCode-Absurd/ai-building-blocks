# Give your agents access to Pinterest Ads

Checked 15 November 2026. Pinterest changes menus often. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Read campaigns, ad groups, ads, keywords, conversions, spend and catalog health. Change nothing. | Marnie (Pinterest), the data pipeline, the readouts |
| 2, draft | Also create Pins and build campaigns, ad groups and ads left paused. Nothing spends. | Marnie (build stage) |
| 3, publish | Also switch a campaign on, change budgets within your step limit, and pause. Only as steps of a plan you approved with "yes" and its code. | Marnie (go-live stage) |

The approval gate in your agent folder enforces level 3 in code: a write runs only when it is the next step of a plan you approved, with exactly the input you saw.

## The official path for agents, as of November 2026

- **Pinterest MCP server: announced, not open yet.** Pinterest's developer page shows the address `https://api.pinterest.com/mcp` with sign-in and "granular permissions", and invites you to be told when it launches ([Pinterest developers](https://developers.pinterest.com/about-pinterest-mcp/)). Pinterest says it started with a small group of alpha partners on 1 June 2026 ([Pinterest business blog](https://business.pinterest.com/blog/pinterest-ai-for-marketers/)). So there is no official Pinterest connector you can add to Claude today.
- **Pinterest API v5** is the official path for an agent that builds and launches. Write permissions are named by scope, for example `ads:write` to create, update or delete campaigns, ad groups and ads ([scopes](https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/)). A campaign's `status` can be set to `PAUSED` ("not accruing costs") or `ACTIVE` ("accruing costs"), so every build plan sets `PAUSED` ([campaigns](https://developers.pinterest.com/docs/work-with-ads/create-campaigns-and-ad-groups)).

## What you need first

- A Pinterest business account and access to **Business Manager** as the Account Owner or a Manager.
- Your ad account already set up with a payment method. The agents never touch billing.
- Your website claimed and the Pinterest tag installed. The agents check these but do not change your site.

## Way 1: in Claude

There is no official Pinterest connector yet. Until Pinterest opens its MCP server:

1. **Reading:** export from Ads Manager (campaign report by day, with spend, impressions, outbound clicks, saves, checkouts and the attribution window) and give the file to Claude, or let the data pipeline read it with Way 2.
2. **Building:** Marnie gives you a build sheet from the signed-off pack, and you build the campaign in Ads Manager with status paused. Marnie then checks your build against the pack from a fresh export.
3. When Pinterest opens its MCP server, add it under **Settings**, **Connectors**, set read tools to **Always allow**, write tools to **Needs approval** and delete tools to **Blocked** ([Claude help](https://support.claude.com/en/articles/11176164)), and ask Claude to update this guide.

Do not use unofficial Pinterest servers or browser bots. Pinterest allows automation only through its API and approved partners.

## Way 2: for the data pipeline and hosted agents

1. **Give the agent its own person.** Make a Pinterest account for the agent with a business email on your domain. In **Business Manager**, go to **Employees**, **Add employee**, choose the **Employee** role, enter that email and choose its asset permissions on your ad account: **Analyst** for a reader, **Campaign** for a builder (Campaign can create and edit campaigns, ad groups and ads, and view reporting). Never give **Admin**, **Finance (edit)** or **Finance (read)**. Send the invite and accept it from the agent's account ([Business Manager](https://help.pinterest.com/en/business/article/business-manager-overview)).
2. **Make an app.** Signed in as yourself, go to [developers.pinterest.com/apps](https://developers.pinterest.com/apps/) and create an app for your business.
3. **Sign the agent's account in to the app** with the fewest scopes: for a reader, `ads:read`, `catalogs:read` and `user_accounts:read`; for a builder, add `ads:write`, `pins:write` and `boards:read`. Never `billing:write` or `biz_access:write`.
4. **Know the token lifetimes.** An access token lasts 30 days. Apps made on or after 25 September 2025 get a continuous refresh token that lasts 60 days and renews each time it is used ([authentication](https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/)).
5. **Store them in one place only:** your host's secret store (on Railway: the service's **Variables**, for example `PINTEREST_READ_REFRESH_TOKEN` and `PINTEREST_BUILD_REFRESH_TOKEN`, plus the app ID and secret). Never paste a token into chat, a file or the repository. The hosted gate holds the builder's token.
6. **Conversions token is separate.** The token for the API for Conversions is made in Ads Manager under **Conversions** and only sends events ([Conversions API](https://help.pinterest.com/en/business/article/getting-started-with-the-conversions-api)). It belongs in your server or partner app settings, not with the agents.

## Safety switches on Pinterest's side

- **Spend caps on the campaign.** A campaign can have a daily spend cap or a lifetime spend cap, but not both. The build plan sets the one in your pack.
- **Paused by default in our plans.** The gate refuses a create step without `status: PAUSED`.
- **Ad review.** Pinterest says review can take up to 24 hours, and editing targeting or the description sends the ad back to review ([ad review](https://help.pinterest.com/en/business/article/ad-review)).
- **Lowest role.** Analyst for reading, Campaign for building. Neither can touch billing.

## Check it works

Claude (or the pipeline) lists the ad accounts the agent's account can see, then reads yesterday's spend for your ad account. Both are read only. A good answer names your ad account with its currency, and gives yesterday's spend that matches Ads Manager for the same date.

## Take access away

- **One permission:** in **Business Manager**, open the person's record, the asset tab, and use the minus icon next to the ad account.
- **The whole person:** open their record, **Edit details**, **Remove employee** ([Business Manager](https://help.pinterest.com/en/business/article/business-manager-overview)). Their tokens stop working for your assets.
- **The app:** delete the tokens from your host, and remove or turn off the app at [developers.pinterest.com/apps](https://developers.pinterest.com/apps/). Check the exact button on screen.
- **Stop now:** pause the campaign yourself in Ads Manager.

## What stays manual, and why

- **Building from Claude**, until Pinterest opens its MCP server. You build from the signed-off sheet.
- **Billing and payment methods**, at every level.
- **Website claim, tag code and catalog source.** These touch your website, so you or your developer change them.
- **Customer list uploads**, which need your consent basis checked first.
- **Appeals** for rejected ads.

## Sources

- Pinterest MCP server page and launch post, checked 15 Nov 2026: [developers](https://developers.pinterest.com/about-pinterest-mcp/), [business blog](https://business.pinterest.com/blog/pinterest-ai-for-marketers/)
- Pinterest API scopes and tokens, checked 15 Nov 2026: [authentication](https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/)
- Campaign status and spend caps, checked 15 Nov 2026: [campaigns and ad groups](https://developers.pinterest.com/docs/work-with-ads/create-campaigns-and-ad-groups)
- Business Manager roles and permissions, checked 15 Nov 2026: [overview](https://help.pinterest.com/en/business/article/business-manager-overview)
- Ad review, checked 15 Nov 2026: [ad review](https://help.pinterest.com/en/business/article/ad-review)
- Conversions API token, seen through search results 15 Nov 2026: [Conversions API](https://help.pinterest.com/en/business/article/getting-started-with-the-conversions-api)
- Claude tool permissions, checked 15 Nov 2026: [permissions](https://support.claude.com/en/articles/11176164)
