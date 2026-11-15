# Give your agents access to Amazon

Checked 15 November 2026. This covers Seller Central (your listings), the Selling Partner API, and Amazon Ads. Seller Central help pages need a login, so some screen labels below come from Amazon's seller forums and are marked as not confirmed. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

## What the agents do with it

| Level | Seller Central (Garrett, Tanvi) | Amazon Ads (Junaid) |
|---|---|---|
| 1, read | Read listings, their issues, Business Reports, inventory, fees and account health. Change nothing. | Read campaigns, search terms, bids, budgets and reports. Change nothing. |
| 2, draft | Also run Amazon's dry run of a listing change (it checks without saving) and save A+ content as a draft. | Also build campaigns, ad groups, keywords and negatives left paused, or prepare a bulk file for you. Nothing spends. |
| 3, publish | Also send listing edits and submit A+ for Amazon's review. Only as steps of a plan you approved with "yes" and its code. | Also switch campaigns on, add keywords and negatives, and change bids within your step limit. Only as steps of an approved plan. |

The approval gate in your agent folder enforces level 3 in code: a write runs only when it is the next step of a plan you approved, with exactly the input you saw.

## The official paths for agents, as of November 2026

- **Amazon Selling Partner plugin** for Claude and Amazon Quick, announced 23 September 2026. It reads listings, performance, inventory and sales, and can act on your account with your approval. It is in beta with Claude for sellers in Amazon's US stores, with other countries to follow ([Amazon news](https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude), [developer page](https://developer.amazonservices.com/amazon-selling-partner-plugin)). Trade press reports a waitlist that opens in waves.
- **Selling Partner API (SP-API)** for listings. A change is sent with the Listings Items API: `patchListingsItem` to edit (safer, because `putListingsItem` replaces the whole listing and drops fields you leave out). Adding `mode=VALIDATION_PREVIEW` checks the change without saving it. A real call that returns `ACCEPTED` only means Amazon took it for processing; problems found later show up in `getListingsItem` ([Listings Items API](https://developer-docs.amazon/sp-api/docs/listings-items-api)). Images are sent as links to files you host ([submit media](https://developer-docs.amazon/sp-api/docs/submit-media)). A+ content goes through the A+ Content API and Amazon's moderation, where it shows as SUBMITTED, then APPROVED or REJECTED ([A+ Content API](https://developer-docs.amazon/sp-api/docs/a-plus-content-api-use-case-guide)).
- **Amazon Ads MCP server**, Amazon's own, in open beta since 2 February 2026 "to Amazon Ads partners with active API credentials". It can create, update and delete campaigns, run reports, manage account settings, and see billing and financial data ([Amazon Ads news](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta)). Its North America address `https://advertising-ai.amazon.com/mcp` answers and asks for a Login with Amazon sign-in with the `advertising::campaign_management` scope (we checked its public sign-in details). Amazon's release notes, seen through search results, say it supports Claude Desktop and Claude Code with a browser sign-in.
- **Amazon Ads API** (Sponsored Products version 3) for hosted agents. Campaigns and other objects take a state such as `ENABLED` or `PAUSED`; every build plan sets `PAUSED`.

## What you need first

- You are the **primary account holder** in Seller Central, or sit with them. Amazon's forum staff say only Professional selling plan accounts can set user permissions.
- **Brand Registry** for A+ content and Sponsored Brands.
- **Admin** on your Amazon Ads account. Amazon Ads has standard roles admin, editor and viewer, or custom permissions such as reporting only ([advertiser account guide](https://advertising.amazon.com/library/guides/advertiser-account)).
- Billing and payment methods already set up. The agents never touch them.

## Way 1: in Claude

**Seller Central, US stores (the plugin).**

1. Join or open the Amazon Selling Partner plugin from [Amazon's developer page](https://developer.amazonservices.com/amazon-selling-partner-plugin) and connect it in Claude with Amazon's own sign-in.
2. On Amazon's permission screen, grant only the data and actions the job needs. For Garrett's listing work: listings read and listing edits. Leave pricing, inventory moves, orders and anything about payments off.
3. In Claude's tool permissions ([Claude help](https://support.claude.com/en/articles/11176164)), set read tools to **Always allow**, any tool that changes listings, prices or stock to **Needs approval**, and delete tools to **Blocked**. Check the exact names in your tool list.

**Amazon Ads (the MCP server).**

1. You need Amazon Ads API access first (the beta is for accounts with active API credentials). Ask Claude to walk you through Amazon's MCP get-started page with you, because the docs need a browser to read: [MCP overview](https://advertising.amazon.com/API/docs/en-us/mcp/mcp-overview).
2. In Claude, **Settings**, **Connectors**, **Add custom connector**, with the address from that page for your region (North America: `https://advertising-ai.amazon.com/mcp`). Sign in with Amazon and choose only the ad accounts and stores the agents may use.
3. Set read and report tools to **Always allow**, every create or update tool to **Needs approval**, and every delete tool and anything about billing to **Blocked**. Check the exact names in your tool list.

Tell Claude: "Check my Amazon connection." It runs the read-only tests below.

## Way 2: for hosted agents

**Selling Partner API (your own private app).**

1. **Register as a private developer.** In Seller Central, **Apps and Services**, **Develop Apps** (or, if your account moved, the Solution Provider Portal, **Settings**, **Developer Profile**). Choose the private developer option for your own company ([register](https://developer-docs.amazon/sp-api/docs/register-as-a-private-developer)). If Amazon asks for more information, reply within 5 days or the case closes.
2. **Pick the fewest roles.** For listings and A+: **Product Listing**. Add **Brand Analytics** only if the agents read search terms from it. Leave out Pricing, Finance and Accounting, and every restricted role ([roles](https://developer-docs.amazon/sp-api/docs/roles-in-the-selling-partner-api)).
3. **Authorise the app for your account.** As the primary user, choose **Authorize app** to get a refresh token ([self-authorisation](https://developer-docs.amazon/sp-api/docs/self-authorization)). Each new token leaves older ones working, so delete any you no longer use.
4. **Store the secrets in one place only:** your host's secret store (on Railway: the service's **Variables**, for example `SPAPI_CLIENT_ID`, `SPAPI_CLIENT_SECRET`, `SPAPI_REFRESH_TOKEN`). Amazon makes you rotate the client secret every 180 days and warns you 90 days ahead (seen through search results) ([rotate secret](https://developer-docs.amazon.com/sp-api/docs/rotate-your-application-client-secret)). Never paste a secret into chat, a file or the repository.

**Amazon Ads API.** Make a Login with Amazon app and connect it to Amazon Ads API access, then sign in once with the `advertising::campaign_management` scope to get a refresh token, and store it the same way (`AMAZON_ADS_REFRESH_TOKEN`). Each call names the advertiser profile it works on, so the agent touches only the profiles you list in your limits file. The Ads API onboarding pages need a browser to read, so do this with Claude beside you and check each label on screen.

## Safety switches on Amazon's side

- **The dry run.** `mode=VALIDATION_PREVIEW` checks a listing change without saving it. Every publish plan runs it first and stops on any error.
- **Edits, not replacements.** The gate's write list has `patchListingsItem` for edits; `putListingsItem` is allowed only in a plan for a brand new listing.
- **A+ moderation.** Amazon reviews A+ before it goes live; Amazon's best practices guide says this can take up to 7 business days.
- **Roles.** Seller Central permissions are set per area (forum staff describe None, View, and View and Edit). Amazon Ads has admin, editor and viewer. Give agents the lowest that does the job, never admin.
- **Delete and billing tools Blocked** on the Amazon Ads MCP connector, since its announcement says it can delete campaigns and see billing.
- **Budget rules off.** Amazon Ads budget rules raise spend by themselves, so the agents never switch them on.

## Check it works

- **Listings:** Claude reads one of your SKUs with `getListingsItem`, including its issues. A good answer shows the live title and status as Seller Central shows them, and any issues with their severity.
- **Amazon Ads:** Claude lists your advertiser profiles, then reads yesterday's Sponsored Products spend for one of them. A good answer names your store and currency, and gives spend that matches the Amazon Ads console for the same date.

## Take access away

- **An SP-API app:** Seller Central, **Apps and Services**, **Manage Your Apps**, **Disable authorization**, then OK ([revoke](https://developer-docs.amazon/sp-api/docs/revoke-authorizations)). For your own private app, also remove the self-authorisation under **Develop Apps**. Then delete the secrets from your host.
- **A Seller Central user:** **Settings**, **User Permissions**, and remove the user or set every area to None. The exact button was not confirmed.
- **An Amazon Ads user:** remove them in the Amazon Ads account's user management. The exact path was not confirmed; ask Claude to find it with you.
- **Claude:** **Settings**, **Connectors**, remove the plugin or the Amazon Ads connector.
- **Stop now:** pause campaigns yourself in the Amazon Ads console.

## What stays manual, and why

- **Identity, tax, bank and payout details**, Brand Registry, and signing Amazon's agreements: always you.
- **Billing and payment methods** for Amazon Ads.
- **Paid programmes** (Vine, deals, coupons and their fees), **removal or disposal orders** and **Account Health appeals**: each needs your own decision.
- **Listing changes outside US stores from Claude**, until the plugin covers your country: you paste the signed-off fields into Seller Central, or a hosted agent uses Way 2.
- **Hosting product images** at a public link for the API.

## Indian marketplaces other than Amazon.in

Amazon.in uses the same Seller Central and Selling Partner API steps above. For other Indian marketplaces:

- **Flipkart** has a public seller API covering listings, orders and reports. You create access for your own account in the Seller Dashboard under **Manage Profile**, **Developer Access**, **Create New Access**; your seller login alone does not give API access ([Flipkart seller APIs](https://seller.flipkart.com/api-docs/FMSAPI.html)). Store its credentials in your host's secret store like the others.
- **Myntra, Nykaa, Ajio and Meesho:** we found no public self-serve seller API on 15 November 2026. Ishita prepares the signed-off sheet and you upload it in the seller panel.

## Sources

- Amazon Selling Partner plugin, checked 15 Nov 2026: [Amazon news](https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude), [developer page](https://developer.amazonservices.com/amazon-selling-partner-plugin)
- SP-API registration, roles, self-authorisation and revoking, checked 15 Nov 2026: [register](https://developer-docs.amazon/sp-api/docs/register-as-a-private-developer), [roles](https://developer-docs.amazon/sp-api/docs/roles-in-the-selling-partner-api), [self-authorisation](https://developer-docs.amazon/sp-api/docs/self-authorization), [revoke](https://developer-docs.amazon/sp-api/docs/revoke-authorizations)
- Listings Items API, media and A+ Content API, checked 15 Nov 2026: [Listings Items API](https://developer-docs.amazon/sp-api/docs/listings-items-api), [submit media](https://developer-docs.amazon/sp-api/docs/submit-media), [A+ Content](https://developer-docs.amazon/sp-api/docs/a-plus-content-api-use-case-guide), [API model files](https://github.com/amzn/selling-partner-api-models)
- Client secret rotation, seen through search results 15 Nov 2026: [rotate](https://developer-docs.amazon.com/sp-api/docs/rotate-your-application-client-secret)
- A+ moderation time, seen through search results 15 Nov 2026: [A+ best practices PDF](https://m.media-amazon.com/images/S/aplus-media-library-service-product-documents-media/SU+Best+Practices/Aplus_Content_Best_Practices-US.pdf)
- Seller Central user permissions, seen through Amazon seller forum results 15 Nov 2026: [forum](https://sellercentral.amazon.com/seller-forums/discussions/t/3da7cd18040ef33bf26f3b5915c6c865)
- Amazon Ads MCP server, checked 15 Nov 2026: [announcement](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta), [overview](https://advertising.amazon.com/API/docs/en-us/mcp/mcp-overview), [sign-in details](https://advertising-ai.amazon.com/.well-known/oauth-protected-resource)
- Amazon Ads roles, checked 15 Nov 2026: [advertiser account guide](https://advertising.amazon.com/library/guides/advertiser-account)
- Flipkart seller APIs, checked 15 Nov 2026: [overview](https://seller.flipkart.com/api-docs/FMSAPI.html)
- Claude tool permissions, checked 15 Nov 2026: [permissions](https://support.claude.com/en/articles/11176164)
