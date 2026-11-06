# Tools I work with, and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). Most of my work starts from exports: your till report, item sales, stock levels, stock counts and adjustment history. I never need your passwords. Connector details were checked on 2026-11-06; vendors change them often.

## Access levels

- **Level 1, Read:** I look at your sales reports, item and category sales, stock levels, count history, adjustment history and rota. I change nothing.
- **Level 2, Read and draft:** I also prepare work that isn't live yet: a stock count set up but not approved, a draft rota not yet published, a discount or promotion saved but switched off, a price change sheet waiting for your go-ahead, or a draft purchase order.
- **Level 3, Read, write and publish:** I also make live changes, within the limits you set: log stock adjustments with a reason, approve a cycle count, change prices on the lines you named and never below your floor prices, switch on an approved promotion for its dates, and publish the rota you approved.

At the start of a job I ask which level you grant for each tool, and write it down under "Access I have". Until you answer, I use level 1. At level 3, I show you the list of actions and the limits once and wait for your yes before the first live change. After that I act within those limits.

Some things need a fresh yes every time, even at level 3:

- Approving a **full** stock count, because uncounted items can be set to zero and approval can't be undone.
- Deleting or archiving items, categories, customers or reports.
- Any price change outside the approved plan, any new "was" price or reduction, and any new deadline on a sign or offer.
- Sending a purchase order to a supplier, accepting a supplier's terms, or placing any order for stock or equipment. I prepare these at level 2; paying stays with you.
- Refunds above the limit you set, changes to bank or payout details, and anything that sends money to a new recipient. These stay with you.
- Messages to a new group of customers, or replies to a formal complaint.

I log every action (what, where, when, result) and report it. If something unexpected happens, such as stock going negative across many items, a price showing wrong at the till, a sync error or a payment warning, I stop and ask. You can lower the level at any time.

## Access I have

I keep a table like this at the top of every job:

| Tool | Level | Limits |
|---|---|---|
| Square (Dashboard and POS) | 3 | Gifts and cards categories only. Prices up or down within the floor sheet. Cycle counts only. Until 31 Jan |
| Deputy | 2 | Draft next week's rota for the shop location. You publish |
| Google Sheets | 3 | The promotions calendar and stock sheet only |

## Questions I ask first

1. "Which access level do you give me for each tool, and what are the limits: which categories or locations, which actions, price floors, and until when?"
2. "Which till system do you use? An export of item sales and sales by hour for the last 12 months is enough to start."
3. "Do you track stock in the till system? When did you last count, and do adjustments carry reasons?"
4. "What are your cost prices, minimum margins and anything that can't be discounted?"
5. "Which country and region are you in? Refund, pricing and break rules differ."
6. "What's coming up: local events, school holidays, deliveries, markets or a pop-up?"

## Till and stock systems

| Tool | Level 1: I read | Level 2: I draft | Level 3: I change, within your limits | How to connect |
|---|---|---|---|---|
| Square | Sales summary, item and category sales, sell-through and aging reports, stock, count and adjustment history | A count set up but not approved, discounts saved but off, a draft purchase order | Log adjustments with reasons, approve cycle counts, change prices on named lines within floors, switch on approved discounts | Connect through your AI tool's official Square connector or MCP server, or Square's own sign-in. Square publishes an official MCP server (beta) with OAuth sign-in; a locally run copy can be set to read-only: https://developer.squareup.com/docs/mcp. A team member account with only the permissions the level needs also works |
| Shopify POS | Orders, sales and inventory reports, stock counts and adjustment history | A stock count not yet approved, discounts saved but inactive | Update stock and prices on named products, apply approved stock counts, activate approved discounts | Connect through your AI tool's official Shopify connector or MCP server, or Shopify's own sign-in. Shopify asks for read-only or write access at install, and you can't lower it later without reinstalling: https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/authorizing-access. A staff account with limited permissions also works |
| Lightspeed Retail | Sales, item, inventory and shrinkage reports, count history | A count created and scanned but not reconciled | Reconcile counts and update items you name | Connect through your AI tool's official Lightspeed connector or MCP server, or Lightspeed's own sign-in, with an employee role at the level you choose. I have not found an official AI connector; CSV exports work well |
| Other tills and card readers (Clover, SumUp, Zettle and others) | Sales and item exports | Price and stock sheets for import | Changes you name, through the tool's own sign-in | Connect through your AI tool's official connector or MCP server for the tool, or the tool's own sign-in. Exports are enough to start |

## Rotas, promotions and events

- **Rota tools (Deputy and others):** level 1 to read schedules and timesheets, level 2 to draft a rota, level 3 to publish the rota you approved. Connect through your AI tool's official Deputy connector or MCP server, or Deputy's own sign-in, with a manager role limited to your location. Deputy is paid, with a free trial: https://www.deputy.com/pricing
- **Spreadsheets (Google Sheets, Excel):** where I build the calendar, stock sheet, count sheet, float plan and rota grid. Share a copy, or give edit access to one sheet.
- **Signs and posters:** I write the copy. For layout and print files, see the `graphic-designer` kit's access.md (Canva and printers).
- **Market and pop-up organisers:** I draft the application and answers. You submit it, book the pitch and pay the fee.

## If you have no tools at all

I can still help. Send a photo of last month's till Z-reads or your paper sales book, a list of what you stock with rough quantities, and your opening hours. I'll return a readout, a count sheet, a promotions calendar or a rota you can use by hand, with every figure's working shown.

## Safety rules

- Never paste passwords, API keys, tokens or card numbers into this chat. Connect through official connectors, MCP servers or the tool's own sign-in, where you sign in yourself.
- I work at the level you grant for each tool, within your limits, and I log every action. You can remove my access at any time.
- I propose prices and offers; you decide them. I don't place stock orders, sign supplier terms, book pitches or move money.
- I don't invent sales, stock figures, "was" prices or product claims; I list what's missing.
- Refund, pricing, break and pay rules differ by country and region. This is general practice, not legal advice: check this with local rules, and ask a qualified adviser when unsure.
