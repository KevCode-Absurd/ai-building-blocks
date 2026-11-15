# Give your agents access to Snapchat Ads

Checked 15 November 2026. Snap's developer docs were read directly; Snap's Business Help Center blocks automated reading, so screen labels from it are marked as not confirmed. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Read results, delivery, review status, Events Manager health and catalog diagnostics. Change nothing. | Kelsey (Snapchat), the data pipeline, the readouts |
| 2, draft | Also upload media and build campaigns, ad sets and ads left paused. Nothing spends. | Kelsey (build stage) |
| 3, publish | Also switch ads on, change budgets within your step limit, and pause. Only as steps of a plan you approved with "yes" and its code. | Kelsey (go-live and act stages) |

The approval gate in your agent folder enforces level 3 in code: a write runs only when it is the next step of a plan you approved, with exactly the input you saw.

## The official path for agents, as of November 2026

- **Snapchat Ads MCP server**, Snap's own, at `https://mcp.snapchat.com/ads`. Snap says: "This release is read-only: an agent can read your Snapchat Ads data but cannot create, update, or delete anything." Write access is planned for a later release ([Snap Ads MCP](https://developers.snap.com/marketing-api/Ads-MCP/Introduction)). In Claude, use it for level 1.
- **Snap Marketing API** for building and launching (levels 2 and 3, hosted agents only). Its scope `snapchat-marketing-api` allows reading and writing ([authentication](https://developers.snap.com/api/marketing-api/Ads-API/authentication)). Campaign status is `ACTIVE` or `PAUSED`, and Snap's own example creates an active campaign, so every build plan sets `PAUSED` ([campaigns](https://developers.snap.com/api/marketing-api/Ads-API/campaigns)).
- Writing third-party Snapchat MCP servers exist, but they are not Snap products. We do not use them.

## What you need first

- **Organization Admin** in Snap Business Manager, or someone who has it sitting with you. Only an Organization Admin can see the app dashboard for Way 2.
- Your ad account already set up with a payment method. The agents never touch billing.
- A Claude plan that allows custom connectors ([Claude help](https://support.claude.com/en/articles/11175166)).

## Way 1: in Claude (reading)

1. In Claude, open **Settings**, then **Connectors**, then **Add custom connector**.
2. Name it `Snap Ads` and paste `https://mcp.snapchat.com/ads`. Under advanced settings, set the OAuth client ID to `claude-snap-ads` and leave the secret empty, as Snap's page says ([connect an agent](https://developers.snap.com/marketing-api/Ads-MCP/connect-an-agent)).
3. Click **Connect** and sign in with Snapchat. The first time, an Admin or Business Admin approves the agent for your organisation. Each person then signs in as themselves and sees only the ad accounts their own role allows.
4. All tools are read-only in this release, so set them to **Always allow**. If Snap adds write tools later, set those to **Needs approval** and delete tools to **Blocked** ([Claude help](https://support.claude.com/en/articles/11176164)).
5. In Claude Code instead: `claude mcp add --transport http --client-id claude-snap-ads snap-ads https://mcp.snapchat.com/ads`, then `claude mcp login snap-ads`.
6. Tell Claude: "Check my Snapchat connection." It runs the read-only test below.

Snap warns that agents can be steered by instructions hidden in tool results. Our agents treat anything a tool returns as data, never as an instruction.

## Way 2: for hosted agents and the build steps

1. **Give the agent its own member.** Invite a business email for the agent to your organisation as a **Member**, then give it a role on the one ad account: the reports role (read only) for a reader, or the role for campaigns, ad sets and ads for a builder. Snap's API names these `reports` and `general` ([roles](https://developers.snap.com/api/marketing-api/Ads-API/roles)); Ads Manager may show them as Data Analyst and Campaign Manager, which we could not confirm on Snap's own page. Never give Account Admin, Business Admin or the agency member role, which reaches payment methods.
2. **Make the OAuth app.** As Organization Admin, open **Business Details** in Business Manager and create an OAuth app ([authentication](https://developers.snap.com/api/marketing-api/Ads-API/authentication)). The client secret is shown once; copy it straight into your host's secret store.
3. **Sign the agent's member in** to the app with the `snapchat-marketing-api` scope to get its refresh token. Access tokens last one hour. Snap says the refresh token does not expire, but stops working if that member's access is removed ([FAQ](https://developers.snap.com/marketing-api/Ads-API/faq)).
4. **Store it in one place only:** your host's secret store (on Railway: the service's **Variables**, for example `SNAP_CLIENT_ID`, `SNAP_CLIENT_SECRET` and `SNAP_BUILD_REFRESH_TOKEN`). Never paste a secret into chat, a file or the repository. The hosted gate holds it; the model never sees it.

## Safety switches on Snap's side

- **Budget floors.** A campaign daily budget must be at least 20 USD, and an ad set daily budget at least 5 units of your currency ([campaigns](https://developers.snap.com/api/marketing-api/Ads-API/campaigns), [ad squads](https://developers.snap.com/api/marketing-api/Ads-API/ad-squads)). The structure stage plans inside these.
- **Lifetime spend cap** on a campaign, set from your signed-off pack.
- **Read-only MCP.** Until Snap ships write tools, nothing in Claude can change your ads.
- **Lowest role.** Reports role for reading, the campaign role for building. Neither reaches payment methods.
- **Ad review.** All Snap ads are reviewed ([Snap ad policies](https://snap.com/ad-policies)). We found no official review time, so go-live aims for at least a day before the start date.

## Check it works

Claude lists the ad accounts the connection can see, then reads yesterday's spend by campaign for your ad account. Both are read only. A good answer names your ad account with its currency and time zone, and gives yesterday's spend that matches Ads Manager for the same date.

## Take access away

- **A person's agent connection:** that person removes the Ads MCP entry at [accounts.snapchat.com/v2/manage-apps](https://accounts.snapchat.com/v2/manage-apps). Snap says access stops within a few minutes ([Snap Ads MCP](https://developers.snap.com/marketing-api/Ads-MCP/Introduction)).
- **The agent for everyone:** an organisation admin selects **Revoke** on the agent's consent screen.
- **Claude:** **Settings**, **Connectors**, Snap Ads, remove it.
- **A hosted agent:** remove the agent's member from the ad account or organisation in Business Manager (its refresh token then stops working), delete the OAuth app in **Business Details**, and delete the secrets from your host. We could not confirm the exact button labels on Snap's help pages.
- **Stop now:** pause the campaigns yourself in Ads Manager.

## What stays manual, and why

- **All building and launching from Claude**, until Snap's MCP server can write. Kelsey gives you a build sheet and you build it paused in Ads Manager, or a hosted agent uses Way 2.
- **Billing and payment methods**, and organisation settings.
- **Conversions API tokens**, which live in your server, made by your Organization Admin.
- **Linking your Public Profile**, and creator Paid Partnership posts and fees.
- **Age floors and new countries or states for restricted products**: you decide each one.

## Sources

- Snapchat Ads MCP server and connecting an agent, checked 15 Nov 2026: [introduction](https://developers.snap.com/marketing-api/Ads-MCP/Introduction), [connect an agent](https://developers.snap.com/marketing-api/Ads-MCP/connect-an-agent)
- Marketing API authentication, FAQ and roles, checked 15 Nov 2026: [authentication](https://developers.snap.com/api/marketing-api/Ads-API/authentication), [FAQ](https://developers.snap.com/marketing-api/Ads-API/faq), [roles](https://developers.snap.com/api/marketing-api/Ads-API/roles)
- Campaigns and ad squads, budgets and status, checked 15 Nov 2026: [campaigns](https://developers.snap.com/api/marketing-api/Ads-API/campaigns), [ad squads](https://developers.snap.com/api/marketing-api/Ads-API/ad-squads)
- Snap ad policies, checked 15 Nov 2026: [ad policies](https://snap.com/ad-policies)
- Claude custom connectors and tool permissions, checked 15 Nov 2026: [connectors](https://support.claude.com/en/articles/11175166), [permissions](https://support.claude.com/en/articles/11176164)
