# Give your agents access to Klaviyo

This page shows you how to let your email agents work in your Klaviyo account. You stay in charge. The agents can read and build drafts. Nothing goes out to customers until you say yes to the exact plan.

Three agents use Klaviyo:

- **Imogen** (imogen-retention) plans who gets what. She reads your lists, segments and reports, and drafts segments.
- **Lucia** (lucia-email-copy) writes the words. She reads your past campaigns, templates and brand voice.
- **Morag** (morag-email-sms) builds in Klaviyo. She makes draft campaigns, draft flows and templates, and sends tests to you.

## What the agents do with it

Your agents work at three access levels. Each level adds a little more.

### Level 1: read

The agents look but do not change anything.

- **All three agents** read your account, campaigns, flows, lists, segments, templates and reports.
- Example tools: `get_account_details`, `get_campaigns`, `get_campaign`, `get_campaign_report`, `get_flows`, `get_flow`, `get_flow_report`, `get_lists`, `get_segments`, `get_segment`, `list_email_templates`, `get_email_template`, `get_metrics`, `query_metric_aggregates`, `get_brand_voice`.
- Profile and event reads (`get_profiles`, `get_profile`, `get_events`) let the agents check consent and behaviour. Klaviyo marks these as tools that read user-generated content. More on that below.
- Scheduled runs (the ones that run on a timer while you are away) only read and draft. They never publish.

### Level 2: draft

The agents build things, but nothing reaches a customer.

- **Morag** creates campaigns as unsent drafts, creates flows that stay in Draft, and builds templates. Tools: `create_campaign`, `update_campaign`, `assign_template_to_campaign_message`, `update_campaign_message`, `create_campaign_clone`, `create_email_template`, `update_email_template`, `clone_email_template`, `create_flow`, `upload_image_from_url`.
- **Morag** sends a test to you, and only you, with `create_template_preview_send_job`. Klaviyo labels this tool Beta. If you do not see it in your tool list, send the test from Klaviyo yourself.
- **Imogen** drafts segments with `create_segment` and `update_segment`.
- **Morag** checks how many people a draft would reach with `refresh_campaign_recipient_estimation` and `get_campaign_recipient_estimation`.
- **Lucia** stays at level 1. Morag puts Lucia's copy into the draft.

Klaviyo keeps a new campaign in draft status until a send job runs. Klaviyo creates new flows in Draft status by default, unless the request sets a status. Morag never sets a status when she creates a flow.

### Level 3: publish

This is the only level that can reach customers. It never runs on a timer.

- **Morag** schedules an approved campaign with `send_campaign`, or switches on an approved flow with `update_flow`. She can stop a scheduled send with `cancel_campaign_send`.
- Before any level 3 step, Morag writes a plan. The plan lists the exact tool calls, the audience, the recipient count, the send time and the send strategy.
- You reply "yes" plus the code shown on the plan. Then, and only then, the plan runs. A changed plan needs a new yes.
- Klaviyo's send strategies are immediate (the default), static, throttled and smart send time. Morag never uses immediate. She sets a fixed time (static) or a throttled send, so there is time to stop it.

## What you need first

- **A Klaviyo user with the right role.** Klaviyo says only users with the Owner, Admin or Manager role can use its remote MCP server. Manager is the smallest of the three. If you can, connect with a Manager user, not the Owner.
- **For private API keys (Way 2):** Klaviyo says Owners, Admins and Managers can create, clone or delete private API keys.
- **For SMS:** SMS must be turned on in Klaviyo, with a sending number set up.
- **A Claude plan that allows custom connectors.** Claude's help page lists Free, Pro, Max, Ultra, Team and Enterprise. Free users get one custom connector. Klaviyo's own page lists Pro, Max, Team and Enterprise, so Free may be tighter in practice.
- **On Claude Team or Enterprise,** only an Owner or Primary Owner adds a custom connector for the organisation. Members then connect their own account.
- We did not find a Klaviyo plan limit for the MCP server. Klaviyo's docs only name the user role.

## Way 1, in Claude: the official connector, click by click

Klaviyo runs an official remote MCP server at `https://mcp.klaviyo.com/mcp`. It signs in with OAuth, so you never paste a key.

You will set up two connectors:

1. **Klaviyo (read)** for level 1. It has the read-only option in the URL.
2. **Klaviyo (build)** for levels 2 and 3. It has writes on, with every write tool set to Needs approval.

### Why a custom connector for read-only

Klaviyo's URL options do not work with the listed Klaviyo connector in Claude's directory, or with the listed ChatGPT app. To use an option like read-only, you must add Klaviyo as a custom connector with the option in the URL.

The options go after a `?` and are joined with `&`, like this:

```
https://mcp.klaviyo.com/mcp?read-only=true
```

Useful options from Klaviyo's page:

- `read-only=true` turns off every tool that writes to your account.
- `disable-tools-with-user-generated-content=true` turns off tools that read content your customers wrote, such as profiles, events and reviews. This lowers the risk of hidden instructions in customer data. It also stops the agents from reading profile consent, so leave it off if you want the consent check to run.
- `core-tools-only=true` keeps the server to about 30 core tools. Klaviyo does not list which ones, so check your tool list.
- `toolsets=` limits tools to scopes you name, such as `toolsets=profiles:read,campaigns:read`.
- `company=` picks one account if you have several, such as `?company=example-company`.

### Step 1: add the read connector

On Pro or Max:

1. In Claude, go to **Customize > Connectors**. (Klaviyo's page still says Settings > Connectors. Use whichever your Claude shows.)
2. Click **+ Add**, then **Add custom connector**.
3. Name it `Klaviyo (read)`.
4. Paste the URL: `https://mcp.klaviyo.com/mcp?read-only=true`
5. Click **Continue**. Review the sign-in settings and click **Continue** again.
6. Leave the OAuth client on **Use Claude's published identity (Recommended)**, unless Klaviyo's docs tell you otherwise.
7. Click **Add**, then **Connect**.
8. Sign in to Klaviyo with your Owner, Admin or Manager user.
9. Read the permissions Klaviyo shows. Approve Claude's access and click **Allow**.

On Team or Enterprise, an Owner or Primary Owner does this instead: **Organization settings > Connectors**, click **Add**, hover over **Custom**, pick **Web**, then follow steps 3 to 7. Each member then goes to **Customize > Connectors** and clicks **Connect** to sign in.

### Step 2: add the build connector

Repeat Step 1 with these changes:

- Name it `Klaviyo (build)`.
- Use the plain URL with no read-only option: `https://mcp.klaviyo.com/mcp`

You can use the listed Klaviyo connector from Claude's directory for this one instead, since it needs no URL options. On a Free plan you only get one custom connector, so use it for the read connector and the listed one for build.

Some draft tools, such as `create_campaign_message`, only appear with `beta=true` in the URL. Klaviyo marks these as possibly unstable. Morag does not need them for a normal draft.

### Step 3: set tool permissions

Go to **Customize > Connectors**, pick the connector, and open **Tool permissions**. Each tool, or each group of tools, can be set to **Always allow**, **Needs approval** or **Blocked**. On Team and Enterprise, Owners can set these for the whole organisation, and members cannot override them.

For **Klaviyo (read)**:

- Set read tools to **Always allow**. There are no write tools to worry about.

For **Klaviyo (build)**:

- Read tools: **Always allow**.
- All write tools: **Needs approval**. This includes `send_campaign`, `cancel_campaign_send`, `update_flow`, `update_flow_action`, `update_campaign`, `create_campaign`, `create_flow`, `create_segment` and `create_template_preview_send_job`.
- Set these to **Blocked**:
  - Every tool whose name starts with `delete_`, such as `delete_campaign`, `delete_flow`, `delete_segment`, `delete_list` and `delete_email_template`.
  - Tools that change consent or profiles: `subscribe_profile_to_marketing`, `unsubscribe_profile_from_marketing`, `bulk_suppress_profiles`, `bulk_unsuppress_profiles`, `merge_profiles`, `bulk_import_profiles`, `request_profile_deletion`.
  - Tools that change your sending set-up: `create_sending_domain`, `create_sending_domain_activation_job`, `create_text_messaging_sender`, `create_text_messaging_configuration`, `create_webhook`, `update_webhook`.

Tool names can change. Check the exact names in your tool list and match these rules to what you see.

### Step 4: use one connector per chat

In each new chat, click **+ > Connectors** and turn on only the connector you need. For planning and reports, turn on only Klaviyo (read).

Do not run Claude's Research mode with Klaviyo (build) turned on. Claude's help page says Research can call connector tools on its own, without asking you.

## Way 2, for hosted agents

Use this when the agents run on a server, not in your Claude app. They use a Klaviyo private API key instead of OAuth.

### Make a key

1. In Klaviyo, click your organisation name in the bottom left, then **Settings**.
2. Click **API keys**.
3. Click **Create Private API Key**.
4. Name the key so you know what it is for, such as `AI Blocks read`.
5. Under **Select Access Level**, pick one (see below).
6. Click **Create**.
7. Click **Copy Key**. The full key is only shown once. Do not pick Download (.txt), because that leaves the key in a file.
8. Paste it straight into your host's secret store. Never put it in a file, a chat, a doc or code.

You cannot edit a key later. To change its scopes, make a new key, move the agents to it, check they work, then delete the old one.

### Which access level per agent level

Klaviyo offers three access levels: **Read-Only Key** (read on every scope), **Full Access Key** (read and write on every scope) and **Custom Key** (pick No Access, Read Access or Read/Write Access per scope).

**Level 1 key (read):** pick **Read-Only Key**. Use this key for all scheduled runs.

**Level 2 key (draft):** pick **Custom Key** and set:

- Read/Write Access: `campaigns`, `flows`, `templates`, `segments`, `images`.
- Read Access: `accounts`, `lists`, `profiles`, `subscriptions`, `metrics`, `events`, `tags`, `catalogs`.
- No Access: `data-privacy`, `push-tokens`, `coupons`, `coupon-codes`, `tracking-settings`, `web-feeds`, `conversations`, and anything else the agents do not need.

Klaviyo writes scopes as a name plus `:read` or `:write`, such as `campaigns:read` and `campaigns:write`. Check the exact list on the key screen, because Klaviyo adds scopes over time.

**Level 3:** there is no separate Klaviyo scope for "send". Klaviyo's send endpoint only needs `campaigns:write`, the same scope that makes drafts. Flow status changes use `flows:write`, the same scope that builds flows. So a level 2 key can technically send.

That means the guard must sit on the host:

- The host only lets `send_campaign`, `cancel_campaign_send` and flow status changes run inside a plan you approved with "yes" plus its code.
- Scheduled runs only get the Read-Only Key, or a tool list with the send and status tools removed.
- Never give the agents a Full Access Key.

## Safety switches on Klaviyo's side

- **User role.** Connect with a Manager user, not the Owner. Klaviyo also lets you make custom user roles, but its MCP page only names Owner, Admin and Manager, so check before you rely on a custom role.
- **Read-only URL option.** `read-only=true` removes every write tool from the connector.
- **User-generated content option.** `disable-tools-with-user-generated-content=true` hides tools that read customer-written text. Klaviyo asks you to review each tool call so your client does not follow hidden instructions.
- **Key access level.** Read-Only and Custom keys limit what a hosted agent can touch.
- **Drafts by default.** Campaigns stay in draft until a send job runs. New flows are Draft unless a status is set.
- **Send strategy.** Klaviyo's default is immediate. Agents set static or throttled instead.
- **Smart Sending.** This is on by default for campaigns. It skips people who got a message from you recently. Skipped people do not get the campaign later. Agents leave it on.
- **SMS quiet hours.** For campaigns, Klaviyo checks each person against quiet hours at send time. You pick **Delay** (the default) or **Skip** under **Manage messages sent in quiet hours** when you schedule. For flows, each text message has an **Enable text message quiet hours** box, and the account-wide setting is under **Text message settings**.
- **Revert to draft.** A scheduled campaign can go back to draft only if its earliest send time is more than 15 minutes away.
- **Cancel.** You can cancel a scheduled or sending campaign from its 3-dot menu. This cannot be undone.
- **No approval step in Klaviyo.** We did not find a built-in approval step for campaigns in Klaviyo. That is why the "yes" plus code gate sits with your agents.

## Consent fields the agents check

Before any send plan, Morag checks consent. This is the consent gate.

- Klaviyo stores consent in each profile's `subscriptions` field. Email marketing and SMS marketing each have a consent value: `SUBSCRIBED`, `UNSUBSCRIBED` or `NEVER_SUBSCRIBED`.
- Klaviyo also returns `can_receive_email_marketing` and `can_receive_sms_marketing`.
- **The rule:** a profile is only in a send audience if its consent for that channel is `SUBSCRIBED` and the matching `can_receive_..._marketing` value is true.
- **`NEVER_SUBSCRIBED` is not consent.** Klaviyo says these profiles can still receive email, for example someone who gave an email at checkout. Klaviyo recommends only emailing profiles with express consent. Our agents leave them out.
- **SMS needs explicit consent.** Klaviyo says implied consent does not apply to SMS.
- Imogen builds send segments that only include profiles with `SUBSCRIBED` consent for the channel. Check the exact condition name in Klaviyo's segment builder.
- **SMS timing.** Klaviyo's help says the TCPA allows sending from 8 a.m. to 9 p.m. across most of the US, in the person's local time. Some states are stricter. Klaviyo names Florida as one that limits sending to 8 a.m. to 8 p.m. Klaviyo also says Pennsylvania has quiet hours all day on Sundays and public holidays. Agents keep quiet hours on for every SMS.

This is not legal advice. Rules differ by country and state. Ask a lawyer about your own sends.

## Check it works

Run this test with only **Klaviyo (read)** turned on. Ask the agent:

> Use get_account_details, then list my last 5 email campaigns with get_campaigns. Show the name, status and send date of each. Do not change anything.

A good answer:

- Shows your Klaviyo account, with details such as the organisation name and time zone that match your Klaviyo settings.
- Lists 5 campaigns whose names, status (such as Draft, Scheduled or Sent) and dates match your Campaigns tab.
- Uses read tools only.

Then ask it to create a draft campaign. On the read connector it should say it has no tool to do that. If it creates one, the read-only option is missing from the URL. Remove the connector and add it again with `?read-only=true`.

For Way 2, run the same two calls from the host with the Read-Only Key.

## Take access away

### For the Claude connector

1. In Claude, go to **Customize > Connectors**.
2. Click **Remove**, or the three dots next to the Klaviyo connector, and follow the prompts. Do this for both Klaviyo connectors.
3. On Team or Enterprise, an Owner or Primary Owner can also remove it under **Organization settings > Connectors**.
4. In Klaviyo, check the **Integrations** tab under **My apps**. If you see an entry for Claude, open its menu and choose **Remove integration**. Klaviyo says apps it did not build are removed from the vendor's side, so the Claude step above is the one that counts. We could not confirm that MCP connections show up in this tab.
5. If you made a separate Klaviyo user for the agents, remove that user or lower its role.

### For an API key

1. In Klaviyo, go to **Settings > API keys**.
2. Find the key under Private API Keys.
3. Open the 3-dot menu next to it and delete it.
4. Delete the key from your host's secret store too.

The key stops working once deleted. If you are swapping keys, Klaviyo says to move your tools to the new key and check they work before you delete the old one.

## What stays manual, and why

- **Sent email and SMS cannot be recalled.** Klaviyo says it cannot unsend messages that have already been sent. That is why every send needs your yes on the exact audience, count, send time and send strategy.
- **Cancel only works before the send.** A cancel stops messages still waiting. Messages already being processed may still go out. A fully sent campaign cannot be cancelled.
- **A cancelled campaign must be cloned to resend.** Cancelling cannot be undone.
- **Late changes.** Inside 15 minutes of the send time you cannot revert to draft. You must cancel and clone.
- **Consent changes.** Agents never subscribe, unsubscribe, suppress or merge profiles. You do that in Klaviyo.
- **Deletes.** Agents never delete campaigns, flows, segments, lists or templates. You do that yourself.
- **Sending set-up.** Sending domains, SMS sender numbers, webhooks and quiet hours settings stay with you.
- **API keys and roles.** Only you create keys, delete keys and change user roles.

## Sources

All checked on 15 November 2026.

- Klaviyo, Connect to the Klaviyo MCP server (URL, URL options, roles, Claude steps, listed connector ignores options): https://developers.klaviyo.com/en/docs/connect_to_the_klaviyo_mcp_server
- Klaviyo, Klaviyo MCP server overview: https://developers.klaviyo.com/en/docs/klaviyo_mcp_server
- Klaviyo, MCP server available tools (tool names, read or write, user-generated content flags, Beta tools): https://developers.klaviyo.com/en/docs/klaviyo_mcp_server_available_tools
- Klaviyo, Campaigns API overview (draft until send job, send strategies, recipient estimation, cancel and revert, clone to resend, Smart Sending): https://developers.klaviyo.com/en/reference/campaigns_api_overview
- Klaviyo, Send Campaign reference (needs `campaigns:write`): https://developers.klaviyo.com/en/reference/send_campaign
- Klaviyo, Create Flow reference (needs `flows:write`): https://developers.klaviyo.com/en/reference/create_flow
- Klaviyo, Flows API overview (flows created in Draft by default): https://developers.klaviyo.com/en/reference/flows_api_overview
- Klaviyo, Authenticate API requests (scope names, key access levels): https://developers.klaviyo.com/en/docs/authenticate_
- Klaviyo Help, How to create or clone a private API key (menu path, access levels, roles, storage, delete and replace): https://help.klaviyo.com/hc/en-us/articles/7423954176283
- Klaviyo, Collect email and SMS consent via API (consent values, NEVER_SUBSCRIBED, SMS needs explicit consent, not legal advice): https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api
- Klaviyo Help, Quiet hours in campaigns (Delay or Skip, per-person check): https://help.klaviyo.com/hc/en-us/articles/quiet-hours-in-campaigns
- Klaviyo Help, Guide to SMS and MMS quiet hours in flows (TCPA 8 a.m. to 9 p.m., Florida, Pennsylvania): https://help.klaviyo.com/hc/en-us/articles/4408737146651
- Klaviyo Help, How to cancel a scheduled or sending campaign (cannot unsend, cannot undo, clone to resend): https://help.klaviyo.com/hc/en-us/articles/115005085067
- Klaviyo Help, How to edit or reschedule a campaign (15 minute revert rule): https://help.klaviyo.com/hc/en-us/articles/4411545074203
- Klaviyo Help, User management and privileges reference for Static User Roles: https://help.klaviyo.com/hc/en-us/articles/115005231648
- Klaviyo Help, How to edit, disable, or remove a Klaviyo-built integration (Integrations tab, My apps): https://help.klaviyo.com/hc/en-us/articles/115005081127
- Claude Help, Get started with custom connectors using remote MCP (plans, click path, Team and Enterprise owners, remove, Research runs tools without approval): https://support.claude.com/en/articles/11175166
- Claude Help, connector tool permissions (Always allow, Needs approval, Blocked; org-wide for Owners): https://support.claude.com/en/articles/11176164
