# Give your agents access to Shopify

Your store agents use Shopify for landing pages, speed fixes, A/B tests and search changes. This guide shows the two official ways in: the Shopify connector for Claude, and the Shopify CLI with Shopify's AI Toolkit for Claude Code. Facts were checked on 15 November 2026. Shopify changes these often, so check again before you rely on one.

## What the agents do with it at each level

| Level | What the agents do | Example |
|---|---|---|
| 1, read | Read products, collections, pages, theme files of a copy, the app list and reports (ShopifyQL). They change nothing. | Arjun reads your theme and app list for a speed fix. Stuart reads every collection's SEO title. |
| 2, draft | Also make work shoppers cannot see: edits on an unpublished theme copy, a hidden page, a preview link for you. | Yaroslav builds a new landing page template on a theme copy and creates the page as hidden. |
| 3, publish | Also make live changes, one approved plan at a time: make a page visible, update SEO fields, add a redirect, push only new files to the live theme. | After your yes, Yaroslav makes the landing page visible. Stuart applies the change table one row at a time. |

At every level, a live change runs only as a step of a plan you approved with "yes" and its code. A scheduled run reads and drafts only.

## What you need first

- A Shopify store on a paid plan. Shopify's own A/B tests (Experiments in Rollouts) need the Grow plan or higher. Rollouts without experiments work on Basic and above.
- A desktop browser for the connector install.
- For Way 1: a Claude plan that allows connectors. On Team and Enterprise, only an Owner can set tool permissions for the whole organisation.
- For Way 2: Claude Code, Node.js 18 or higher, and the Shopify CLI.
- The connector acts with the permissions of the staff account that installs it. If you can, install it while signed in as a staff account that holds only what the agents need:
  - Online store > Themes (view, change and publish themes in the draft themes section; this one permission also covers publishing, so the "draft only" rule is kept by the plan gate, not by Shopify)
  - Online store > Edit code, only if agents will change theme code
  - Online store > Blog posts and pages
  - Content > Menus, only if agents will update menu links
  - Products > View, and Create and edit for SEO and copy changes (prices need separate permissions: do not grant them)
  - Analytics > Reports
  - Markets > Rollouts, only if agents will read your A/B tests
- Never give the agents your password, and never paste a token into a chat.

## Way 1, in Claude: the Shopify connector

1. In Claude on a desktop browser, open the Shopify connector page in the directory: claude.ai/directory/connectors/shopify. You can also go to Customize > Connectors, click the + next to Connectors, and pick Shopify.
2. Click Connect or Install. Claude sends you to your Shopify admin.
3. Sign in to the store you want to connect. Use the limited staff account if you made one.
4. Shopify shows the access the connector asks for. Choose carefully, because you cannot lower it later without uninstalling and installing again:
   - Read-only access fits level 1.
   - Write access is needed for levels 2 and 3.
5. Approve. You are sent back to Claude.
6. In Claude, go to Customize > Connectors and open Shopify to see Tool permissions. Set:
   - read tools: Always allow
   - every tool that writes or deletes (products, collections, pages, menus, theme files, discounts): Needs approval
   - any tool you never want used, such as discount or inventory tools for a speed job: Blocked
   Tool names change, so check the exact names in your tool list. If your plan does not show Tool permissions, every write still stops at the plan gate, and the connector itself asks before page or menu changes.
7. The connector connects one store at a time. To switch store, ask it to connect the other store, then start a new conversation.

What the connector can and cannot do (Shopify help, checked 15 November 2026):

- It can manage products, collections, inventory, discounts, pages and menus, read orders, customers and analytics, and edit an unpublished theme.
- It cannot edit your live theme or delete a theme. Shopify's help is not consistent on publishing a theme: one page says it cannot, another lists a publish action that asks first. Plan as if it cannot, and publish themes yourself or through the CLI.
- It cannot change your plan, payments, taxes or domains, issue refunds, cancel or capture orders, mark orders paid, process returns, or touch gift cards.
- It changes items one at a time, so a large batch can stop partway. Finish it in your admin, or let the agent read back what changed first.

## Way 2, in Claude Code or for hosted agents

### 2a. Shopify CLI and AI Toolkit (Claude Code on your computer)

1. Install the AI Toolkit plugin in Claude Code:
   `claude plugin install shopify-ai-toolkit@claude-plugins-official`
   It includes Shopify's Dev MCP server, which searches Shopify's docs and checks code. It needs no store access.
2. Sign the CLI in to your store for data reads and writes. You choose the scopes:
   `shopify store auth --store <your-store>.myshopify.com --scopes <comma-separated scopes>`
   Ask only for what the job needs. Common scopes for these processes:
   - `read_products`, `write_products` (product and collection SEO fields and copy)
   - `read_content`, `write_content` (pages, including making a hidden page visible)
   - `read_themes`, `write_themes` (theme files)
   - `read_online_store_navigation`, `write_online_store_navigation` (URL redirects)
   - `read_reports` (ShopifyQL; Shopify also requires Level 2 protected customer data access for it)
   - `read_rollouts` (read your A/B tests; there is no write scope for experiments)
   Leave out every write scope for a read-only job.
3. Reads run with `shopify store execute`. Mutations are off unless the command carries `--allow-mutations`, so a plan step that changes data shows that flag plainly.
4. Theme work uses `shopify theme push`. `--unpublished` creates a new unpublished theme. `--only` uploads just the named files and `--nodelete` keeps remote files that are not local. A push to the live theme needs `--allow-live`.
5. In your project's `.claude/settings.json`, put the commands that change your store on the ask list, so Claude Code asks you every time, for example `Bash(shopify theme push:*)`, `Bash(shopify theme publish:*)` and any `shopify store execute` call with `--allow-mutations`. The plan gate checks the exact command as well.

### 2b. Hosted agents (a token for a server)

Since 1 January 2026 you cannot create new legacy custom apps in the Shopify admin. Use the Dev Dashboard:

1. In your Shopify admin, go to Settings > Apps, then Develop apps, then Build apps in Dev Dashboard. Click Create app.
2. In the app's version, tick only the scopes from the list above that the job needs. Release the version and install the app on your store. The app and the store must be in the same Shopify organisation.
3. In the Dev Dashboard, open the app, go to Settings, and copy the Client ID and Client secret.
4. Put the client secret in your host's secret store (for example the cloud task's environment secrets). Never put it in a file in the project, a chat or an email.
5. The agent asks for a token with the client credentials grant: a POST to `https://<your-store>.myshopify.com/admin/oauth/access_token` with `grant_type=client_credentials`, the client id and the secret. Tokens last 24 hours, so the agent asks again when one expires.

## Safety switches on Shopify's side

- The connector's access level is fixed at install. Read-only at install means no writes at all.
- The connector cannot edit the live theme, and the CLI will not push to it without `--allow-live`.
- `shopify store execute` blocks mutations unless `--allow-mutations` is given.
- Staff permissions cap what the connector can do, whatever it asks for.
- Theme copies are your undo: keep a duplicate of the live theme before any publish. The theme library holds 20 themes (100 on Plus).
- Shopify's write calls used here (page, theme file, redirect and product updates) have no built-in protection against running twice, so the agents never retry a failed write on their own.

## Check it works

Ask the agent to run one read-only test: "List my five most recent products with their SEO titles, and the name of my live theme."

A good answer gives five real product names from your store, each with its SEO title (or says the title is empty), and the live theme's name and id. It changes nothing and asks for no approval. If it asks to approve a change, stop and check your tool permissions.

## Take access away

- Connector: in your Shopify admin, go to Settings > Apps, find the Claude connector (check Sales channels if it is not under Apps), open its menu and choose Uninstall. Then in Claude, go to Customize > Connectors and disconnect Shopify. Start a new conversation afterwards, because an old one can keep the earlier connection.
- CLI: run `shopify auth logout` on the computer that signed in, and uninstall the CLI app from Settings > Apps if it appears there. Check the exact logout command with `shopify help` if it differs in your version.
- Dev Dashboard app: uninstall it from Settings > Apps, and delete the client secret from your host's secret store.
- Staff account: in Settings > Users, remove the account or lower its permissions.

## What stays manual, and why

- Publishing a theme or adding a template to the live theme when you use only the connector: it cannot write to the live theme. The agent gives you the exact clicks.
- Creating and starting an A/B test in Rollouts (Markets > Rollouts > Create rollout): Shopify's Rollouts API is read-only, so you launch it, and end it, in the admin.
- Payments, taxes, shipping, domains, plan and billing, refunds, order changes and gift cards: the connector cannot touch them, and they stay with you at every level.
- Removing an app: it can delete the app's data, so you do it yourself, one app at a time, after the agent tells you what is lost.
- Shopify's Web performance dashboard has no API. Send screenshots when the speed agent asks.

## Sources

- Shopify connector for Claude, Shopify Help Center, https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-claude (checked 15 November 2026)
- Considerations for AI tools, Shopify Help Center, https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/considerations (checked 15 November 2026)
- Authorizing AI tool access to your store, Shopify Help Center, https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/authorizing-access (checked 15 November 2026)
- Shopify CLI connector, Shopify Help Center, https://help.shopify.com/en/manual/ai-powered-tools/shopify-cli-connector (checked 15 November 2026)
- Store permissions, Shopify Help Center, https://help.shopify.com/en/manual/your-account/users/roles/permissions/store-permissions (checked 15 November 2026)
- Uninstalling apps, Shopify Help Center, https://help.shopify.com/en/manual/apps/uninstalling-apps (checked 15 November 2026)
- Rollouts requirements and considerations, Shopify Help Center, https://help.shopify.com/en/manual/markets/rollouts/requirements-and-considerations (checked 15 November 2026)
- Create a rollout, Shopify Help Center, https://help.shopify.com/en/manual/markets/rollouts/create-a-rollout (checked 15 November 2026)
- Shopify AI Toolkit, Shopify developer docs, https://shopify.dev/docs/apps/build/ai-toolkit (checked 15 November 2026)
- shopify store execute, https://shopify.dev/docs/api/shopify-cli/store/store-execute (checked 15 November 2026)
- shopify store auth, https://shopify.dev/docs/api/shopify-cli/store/store-auth (checked 15 November 2026)
- shopify theme push, https://shopify.dev/docs/api/shopify-cli/theme/theme-push (checked 15 November 2026)
- Access scopes, https://shopify.dev/docs/api/usage/access-scopes (checked 15 November 2026)
- read_rollouts changelog, https://shopify.dev/changelog/read_rollouts (checked 15 November 2026)
- Get API access tokens for Dev Dashboard apps, https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens (checked 15 November 2026)
- Claude connectors and tool permissions, Claude Help Center, https://support.claude.com/en/articles/11176164 (checked 15 November 2026)
- End of new legacy custom apps from 1 January 2026, Shopify Developer Community, https://community.shopify.dev/t/starting-january-1-2026-you-will-not-be-able-to-create-new-legacy-custom-apps-this-will-not-impact-any-existing-apps/26798 (secondary, checked 15 November 2026)
