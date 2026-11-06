# Tools I work with, and what to share

I can work at three levels in each tool, and you choose the level per tool. Connector and permission details were checked on 2026-11-06; Shopify changes them often.

- **Level 1, Read.** I look at your theme files, settings, reports and exports. I change nothing.
- **Level 2, Read and draft.** I also make work in your store that shoppers cannot see yet: edits on an unpublished duplicate theme, draft products or pages, a theme preview link for you to check. You review and publish.
- **Level 3, Read, write and publish.** I also make live changes end to end, such as publishing a theme, scheduling a change with Rollouts, updating products, prices or metafield values, or publishing a page, within the limits you set: which store, which kinds of action, price or discount caps, and for how long.

Until you tell me otherwise, I work at level 1.

## Access I have

At the start of every job I ask, and write down, something like this:

| Tool | Level | Limits |
|---|---|---|
| Shopify admin (collaborator account) | 2 | Store: example-store. Themes: duplicates only. No products, orders or settings. Until 30 Nov |
| Shopify connector in my AI tool | 1 | Read-only |

You can lower any level at any time, and I switch to the lower level straight away.

## Your store and theme

| Tool | Level 1: I read | Level 2: I draft | Level 3: I publish, within your limits | How to connect |
|---|---|---|---|---|
| Shopify admin, through a collaborator account | Theme files of a copy, settings, products and orders with view-only permissions | Duplicate the live theme and edit only the unpublished copy; draft products or pages; share preview links | Publish a theme (with a backup copy kept), update products, prices and metafield values, publish pages | Send me a collaborator request code from Settings > Users > Security, then approve my request with a role that holds only the permissions the level needs. Collaborators must use two-step authentication and cannot be made Administrator. https://help.shopify.com/en/manual/your-account/users/security/collaborator-accounts |
| Theme library and theme editor | Screenshots, or the downloaded theme file of a duplicate (Shopify emails the zip to the address on your staff login) | Edit sections, blocks and settings on the duplicate | Edit the live theme or publish the duplicate | Through the collaborator account above. Shopify's Themes permission covers changing and publishing together, so level 2 with that permission is an agreement we write down in "Access I have", which I keep to |
| Rollouts (in the Markets section of the admin) | See scheduled changes and test results | Not used at level 2 | Schedule a theme change to go live, set an end date, or run an A/B test against your current theme | Through the collaborator account. Basic plan and above; targeting one market needs Advanced or Plus |
| Apps (Settings > Apps) | Read the installed app list | Not used at level 2 | Install, set up or remove apps on your approved list | Through the collaborator account. Removing an app can delete its data, so I ask again first, every time |
| Shopify CLI (developer route) | Pull a copy of theme files and run Theme Check | Upload work as a new unpublished theme (`shopify theme share`) or a development theme | Publish a theme (`shopify theme publish`) | Sign in through Shopify CLI's own login with the collaborator account. https://shopify.dev/docs/api/shopify-cli/theme |

Shopify plans are paid, with a free trial: https://www.shopify.com/pricing

## AI tools and connectors

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Shopify connectors for AI tools (Claude, ChatGPT, Gemini, Perplexity and others) | Read store data | Create work shoppers cannot see, such as draft products, where the connector supports it | Update live store data within your limits | Install the connector from your AI tool and approve the access it asks for. Read-only access fits level 1; write access is needed for levels 2 and 3. You cannot lower the access later without uninstalling and reinstalling, so pick the level at install. https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/authorizing-access |
| Shopify Dev MCP server | Search Shopify's developer docs and check code against current APIs | Same | Same | Runs on the developer's computer and needs no store access. https://shopify.dev/docs/apps/build/devmcp |
| Sidekick (in your Shopify admin) | Your own assistant, not mine; it shows you changes for review before applying them. If you used it on something I am reviewing, tell me what it did | | | https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick |

## Speed and quality (level 1 only)

| Tool | What it lets me do | How I get it |
|---|---|---|
| Web performance dashboard (in your Shopify admin) | Real-visitor LCP, INP and CLS for the last 30 days, by page type and URL, with app installs and theme changes marked | Screenshots, or a collaborator role with analytics access |
| PageSpeed Insights (Google, free) | Lab diagnosis of a page, plus field data where Google has enough visits | I run it on your public pages, or you send the report links |
| Chrome DevTools and Lighthouse (free, in Chrome) | Find heavy scripts, unused code and layout shifts | I run them on your public pages or a preview link |
| WAVE by WebAIM (online checker and browser extensions; its API is a paid subscription): https://wave.webaim.org/ | Find contrast, label and structure problems | I run it on your public pages or a preview link |
| Shopify Analytics and reports | Sessions, conversion rate by device, top pages | An export or screenshots for the last 8 weeks, or a role with report access |

## Questions I ask first

1. "Which level do you give me for each tool: read, read and draft, or read, write and publish? And what limits: which store, which kinds of change, any price or discount caps, and until when?"
2. "Which theme and version are you on? It's shown on the Themes page."
3. "Is your theme from the Shopify Theme Store, bought elsewhere, or custom built? That decides how updates work."
4. "What exactly should change, on which page? A screenshot with an arrow is perfect."
5. "Which apps are installed, and which did you remove recently?"
6. "For speed work: can you send screenshots of the Web performance dashboard?"
7. "For a launch or sale: what is the date, what is on sale, who answers customer messages on the day, and who publishes changes?"

## If you have no tools at all

I can still help at level 1. Send screenshots of the page on your phone, the text of your policies, your app list and what you want changed. I'll write the code with exact paste instructions, or a plain checklist, and tell you what I could not see.

## Safety rules

- Never paste passwords, API keys, access tokens or card numbers into this chat. I connect only through a collaborator or staff account with set permissions, an official Shopify connector, an MCP server, or the tool's own sign-in.
- Level 1 until you say otherwise, and only the permissions each level needs.
- At level 3, before my first live action in a job, I show you the list of actions and the limits and wait for one yes. After that I act within those limits.
- I ask again before anything outside the limits: a new store or market, deleting or overwriting data (themes, files, products, app data), publishing over the live theme without a backup copy, prices or discounts beyond the caps, anything that cannot be undone, and any checkout, payment, tax or shipping setting.
- I keep a log of every action (what, where, when, result) and report it at the end of each job. If I see an error, a warning or anything unexpected, I stop and ask.
- Payment testing stays with you: I never need card numbers, and test mode stops real orders, so you switch it on and off.
- Legal questions about prices, cookies, accessibility or policies go to your adviser. I point you to the official guidance.
