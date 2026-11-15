# Give your agents access to Google Ads

Checked 15 November 2026. Google changes menus and tool names often. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Read campaigns, search terms, conversions, change history and recommendations, and the Merchant Center feed and its problems. Change nothing. | Raymond (Google Ads), the data pipeline, the readouts at day 3, 7 and 14 |
| 2, draft | Also build budgets, campaigns, ad groups, keywords, ads and assets left paused, or prepare a Google Ads Editor file for you to post. Nothing spends. | Raymond (build stage) |
| 3, publish | Also switch campaigns on, add negatives, change budgets within your step limit, and pause. Only as steps of a plan you approved with "yes" and its code. | Raymond (go-live and act stages) |

The approval gate in your agent folder enforces level 3 in code: a write runs only when it is the next step of a plan you approved, with exactly the input you saw. The steps below give the access; the gate decides when it is used.

## The official path for agents, as of November 2026

- **Google Ads API MCP server** (Google's own, open source). It reads your account with Google Ads Query Language. It can also create assets, upload videos and manage labels, but it **cannot** create or change campaigns, ad groups, ads, budgets or bids, and it cannot link assets to campaigns ([Google's docs](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server), [code](https://github.com/googleads/google-ads-mcp)). Its writes use a check-then-confirm step. You run it yourself: on your computer, or in your own Google Cloud project on Cloud Run. Google does not host it for you, and we found no Google Ads connector in Claude's connector directory.
- **Google Ads API** (what the build and go-live stages use for writes). New campaigns are created paused when the plan sets status PAUSED; if the status is left out, Google turns the campaign on ([create campaigns](https://developers.google.com/google-ads/api/docs/campaigns/create-campaigns)). Performance Max can be built through the API too, with its asset group in the same request ([Performance Max](https://developers.google.com/google-ads/api/performance-max/create-campaign)).
- **Developer tokens are gone.** Google sunset them on 9 September 2026. API access now belongs to the Google Cloud project you sign in with, and you apply for it on the Google Ads API Overview page in Google Cloud Console ([developer token page](https://developers.google.com/google-ads/api/docs/first-call/dev-token)). Access levels are Test (test accounts only), Explorer (2,880 operations a day on real accounts), Basic (15,000 a day) and Standard (no daily limit) ([access levels](https://developers.google.com/google-ads/api/docs/api-policy/access-levels)).
- **Merchant API MCP server** for your product feed: Google's own hosted server at `https://merchantapi.googleapis.com/mcp`, marked Alpha. Its tools are read-only plus a few low-risk writes about data sources ([Merchant MCP](https://developers.google.com/merchant/api/guides/agentic-tools/merchant-data-mcp)). The old Content API for Shopping reached its sunset on 18 August 2026 ([sunset notice](https://developers.google.com/shopping-content/guides/deprecation-and-sunset)).

## What you need first

- **Admin** access to your Google Ads account, or someone who has it sitting with you. Google's access levels are Email-only, Billing, Read-only, Standard and Admin ([Google Ads access levels](https://support.google.com/google-ads/answer/9978556)).
- Your payment method already set up. The agents never touch billing.
- A Google Cloud project with billing turned on (Google says projects on the free trial or with suspended billing can be refused API access), and the Google Ads API enabled in it.
- For Way 1 on Claude web or desktop: a Claude plan that allows custom connectors (Free allows one; on Team and Enterprise only an Owner can add one) ([Claude help](https://support.claude.com/en/articles/11175166)).

## Way 1: in Claude

Start with reading. Writes to campaigns need Way 2, because the official MCP server cannot make them.

**Read your account (Google Ads MCP server).**

1. With Claude beside you, install the server from [Google's page](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server). It runs with pipx and needs Python 3.10 or later and the gcloud command line tool. Follow the install line on that page exactly; it pins a version number.
2. Sign in with Google when it asks. Use a Google account that has **Read-only** access to your Google Ads account (see Way 2, step 2), not your Admin login. The server asks for the `adwords` scope.
3. Turn the write tools off. In the server's `tools_config.yaml`, set `assets: false` and `labels: false`. Google calls this its read-only mode. If you leave them on, set them to **Needs approval** in Claude.
4. In Claude's tool permissions ([Claude help](https://support.claude.com/en/articles/11176164)): the read tools (in the current version `customers_list_accessible_customers`, `search_search` and `metadata_get_resource_metadata`) to **Always allow**; `assets_create_asset`, `assets_upload_video_asset`, `labels_manage_labels` and `labels_manage_label_associations` to **Blocked** or **Needs approval**. Check the exact names in your tool list; Google added name prefixes in version 0.0.6.
5. If you want it on Claude web or in scheduled tasks, your developer can deploy the same server to Cloud Run in your own Google Cloud project and you add its address (ending in `/mcp`) under **Settings**, **Connectors**, **Add custom connector**. Google's page says the remote setup only works with an OAuth client ID and secret.

**Read your feed (Merchant API MCP server).**

1. In Claude Code: `claude mcp add --transport http merchant-api https://merchantapi.googleapis.com/mcp`, as listed on Google's page, then sign in with an account that has **Read-only** access in Merchant Center. Google suggests trying it on a test account first.
2. Set `list_products`, `get_product_by_name`, `list_account_issues`, `list_aggregate_product_statuses`, `report_search` and the other list and get tools to **Always allow**. Set `create_data_source` and `fetch_data_source` to **Blocked**. Feed fixes go to you or your shop app as a list.

Tell Claude: "Check my Google Ads connection." It runs the read-only test below.

## Way 2: for hosted agents and the build steps

A hosted agent (one running on a server, not in your Claude) needs its own sign-in. Use two separate Google accounts, so Google itself limits what each can do.

1. **Get API access for your Cloud project.** In Google Cloud Console, enable the Google Ads API, then open the Google Ads API Overview page and apply for **Explorer** access (enough for one store), or Basic if you need more operations ([onboarding post, 10 September 2026](https://developers.google.com/ads/blog/posts/2026/09/new-onboarding-experience-for-google-ads-api)).
2. **Make a reader and a builder.** Create two Google accounts for the agents, for example `ads-reader@` and `ads-builder@` on your own domain. In Google Ads, click the **Admin** icon, then **Access and security**, then the plus button. Invite the reader with **Read-only** and the builder with **Standard** ([add users](https://support.google.com/google-ads/answer/6372672)). Never give an agent account Admin. Note that Standard can also edit billing information, so the gate's tool list never includes billing calls.
3. **Make an OAuth client** in the same Cloud project (Google Cloud Console, **APIs and Services**, **Credentials**), and sign each agent account in once with the `https://www.googleapis.com/auth/adwords` scope to get its refresh token.
4. **Store the secrets in one place only.** Put the client ID, client secret and each refresh token in your host's secret store (on Railway: the service's **Variables**, for example `GOOGLE_ADS_READ_REFRESH_TOKEN` and `GOOGLE_ADS_BUILD_REFRESH_TOKEN`). If you sign in through a manager account, also store its 10-digit customer ID as `GOOGLE_ADS_LOGIN_CUSTOMER_ID`. Never paste a secret into chat, a file, a spreadsheet or the repository.
5. **Give the gate the builder.** Only the hosted gate holds the builder's token. Its write list is limited to the mutate calls in your build, go-live and act plans; the model never sees the token.

## Safety switches on Google's side

- **Auto-apply recommendations off.** In Google Ads, **Campaigns**, **Recommendations**, **Auto-apply settings**, untick everything and save ([auto-apply](https://support.google.com/google-ads/answer/10276359)). Otherwise Google can change your campaigns without anyone's yes.
- **Change history.** **Campaigns**, then **Change history** shows two years of changes, including those made through the API and Ads Editor, and you can undo most changes from the last 30 days ([change history](https://support.google.com/google-ads/answer/2454137)).
- **Account budget.** A hard cap on spend for the whole account, but only for accounts that pay by monthly invoicing ([account budgets](https://support.google.com/google-ads/answer/7054229)). If you pay automatically, your cap is the campaign budgets in the plans you approve.
- **Daily budgets are averages.** Google may spend up to twice a campaign's daily budget on one day, but no more than 30.4 times it in a month ([budgets](https://support.google.com/google-ads/answer/2375423)).
- **Google Ads Editor drafts.** Campaigns marked as draft in Editor are not posted ([Editor drafts](https://support.google.com/google-ads/editor/answer/43955)). Once posted as active or paused, they cannot go back to draft.
- **Google's own agents.** Ads Advisor inside Google Ads says it asks for approval before taking action in your account ([Google, 21 April 2026](https://blog.google/products/ads-commerce/ads-advisor-google-ads/)). Treat any change it makes as outside our plans and read it in change history.

## Check it works

Claude runs `customers_list_accessible_customers`, then one `search_search` query for yesterday's cost and clicks by campaign. Both are read only. A good answer lists your account by its 10-digit ID and name, and gives yesterday's cost that matches the Google Ads screen for the same date and time zone. For the feed, Claude runs `list_account_issues`; a good answer lists the same problems Merchant Center shows, or none.

## Take access away

- **A person or agent account in Google Ads:** **Admin**, **Access and security**, find the user, **Remove access** in the Actions column. For an invite not yet accepted, choose **Revoke** ([add and remove users](https://support.google.com/google-ads/answer/6372672)).
- **The app's sign-in:** while signed in as the agent account, open [myaccount.google.com/linkedapps](https://myaccount.google.com/linkedapps), pick the app, **See details**, **Remove access**, **Confirm** ([Google Account help](https://support.google.com/accounts/answer/13533235)). Then delete the secrets from your host.
- **Merchant Center:** **Settings**, **Access and services**, **People and access**, then remove the person ([Merchant Center access](https://support.google.com/merchants/answer/12160472)).
- **Claude:** **Settings**, **Connectors**, the connector, remove it; in Claude Code, `claude mcp remove <name>`.
- **Stop now:** pause the campaigns yourself in Google Ads, then remove access as above.

## What stays manual, and why

- **Billing, payment methods and account budgets.** Money stays with you at every level.
- **User access, linked accounts and conversion goals.** These change who sees your data and what Google optimises for, so you make them, with Claude telling you where to click.
- **Building campaigns from Claude without Way 2.** The official MCP server cannot create campaigns, so Raymond gives you a Google Ads Editor file and you import and post it as paused yourself.
- **Merchant Center feed fixes.** The Merchant MCP tools are read-only for products, so product fixes go through your shop or feed app.
- **Appeals for disapproved ads and policy issues**, and **bidding on competitor names**: you decide each one.

## Sources

- Google Ads API MCP server docs and code, checked 15 Nov 2026: [docs](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server), [GitHub](https://github.com/googleads/google-ads-mcp)
- Developer token sunset and access levels, checked 15 Nov 2026: [developer token](https://developers.google.com/google-ads/api/docs/first-call/dev-token), [access levels](https://developers.google.com/google-ads/api/docs/api-policy/access-levels), [onboarding post](https://developers.google.com/ads/blog/posts/2026/09/new-onboarding-experience-for-google-ads-api)
- Creating campaigns paused and Performance Max, checked 15 Nov 2026: [create campaigns](https://developers.google.com/google-ads/api/docs/campaigns/create-campaigns), [asset groups](https://developers.google.com/google-ads/api/performance-max/asset-groups)
- Merchant API MCP server and Content API sunset, checked 15 Nov 2026: [Merchant MCP](https://developers.google.com/merchant/api/guides/agentic-tools/merchant-data-mcp), [sunset](https://developers.google.com/shopping-content/guides/deprecation-and-sunset)
- Google Ads access levels and adding users, checked 15 Nov 2026: [levels](https://support.google.com/google-ads/answer/9978556), [add users](https://support.google.com/google-ads/answer/6372672)
- Merchant Center access levels, checked 15 Nov 2026: [access](https://support.google.com/merchants/answer/12160472)
- Safety settings, checked 15 Nov 2026: [auto-apply](https://support.google.com/google-ads/answer/10276359), [change history](https://support.google.com/google-ads/answer/2454137), [account budgets](https://support.google.com/google-ads/answer/7054229), [daily budgets](https://support.google.com/google-ads/answer/2375423), [Editor drafts](https://support.google.com/google-ads/editor/answer/43955)
- Ads Advisor, checked 15 Nov 2026: [Google blog](https://blog.google/products/ads-commerce/ads-advisor-google-ads/)
- Removing app access, checked 15 Nov 2026: [Google Account help](https://support.google.com/accounts/answer/13533235)
- Claude custom connectors and tool permissions, checked 15 Nov 2026: [connectors](https://support.claude.com/en/articles/11175166), [permissions](https://support.claude.com/en/articles/11176164)
