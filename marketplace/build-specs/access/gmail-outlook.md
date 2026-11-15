# Give your agents access to Gmail and Outlook

This guide shows you how to let your AI Blocks agents read mail and write drafts in Gmail or Outlook. You stay in charge of what gets sent. Start with the lowest level that does the job.

## What the agents do with it

There are three access levels. Each level adds to the one before it.

**Level 1: read.** The agent can search your mail and read threads. It cannot change anything.

- Customer care: darlene-support-lead, marivic-fulfilment, gurdeep-shipping-returns and latoya-post-purchase read customer threads about orders, delivery, returns and follow-ups.
- Creator and PR outreach: ritika-influencer-outreach, margot-pr and pilar-creators read replies from creators, journalists and agencies.
- Sourcing: wenhao-procurement and the other sourcing agents read supplier quotes, lead times and order updates.

**Level 2: draft.** The agent can also write drafts in your own mailbox and add labels. A draft sits in your Drafts folder until you open it and press send yourself.

- Customer care agents draft replies to customers.
- Outreach agents draft first messages and follow-ups to creators and press.
- Sourcing agents draft supplier mail, such as quote requests and order checks.

**Level 3: send.** The agent sends mail, but only through a plan you approve. One yes covers one send. Replies are never sent on their own, unless you set a standing rule for one narrow template (for example, "order received" for one store). Most owners never need this level.

Scheduled runs, the ones that start on a timer while you are away, only read and draft. They never send.

## What you need first

- **A mail account.** Either Gmail (a personal Google account or a Google Workspace account) or Outlook (a Microsoft 365 work or school account, or a personal Microsoft account).
- **A Claude plan, if you use Way 1.** Google's own setup page for its Gmail server lists Claude Pro, Max, Team and Enterprise. Claude's Microsoft 365 connector works on all plans with a work or school account. With a personal Microsoft account it works on Free, Pro, Max and Ultra only.
- **The right role on Team or Enterprise.** An Owner or Primary Owner must turn on the Google Workspace or Microsoft 365 connector for the whole organization before members can connect. On Team, only Owners and Primary Owners can add a custom connector. On Enterprise, people with a custom role that includes "Manage access to Libraries" can add one too.
- **For Microsoft 365 work accounts:** a Microsoft Entra Global Administrator must give a one-time consent for your tenant before anyone can connect. Personal Microsoft accounts need no admin step.
- **For Google's Gmail server:** a Google Cloud project, and a place in the Google Workspace Developer Preview Program. Google marks this server as Developer Preview.
- **For hosted agents (Way 2):** a Google Cloud project or a Microsoft Entra app registration, and a secret store on your host.

## Way 1, in Claude: the official connector, click by click

### First choice: Google's Gmail MCP server as a custom connector

This is the safest choice for customer and supplier mail. Google's server has 10 tools and none of them sends mail:

- Read: `search_threads`, `get_thread`, `get_message`, `list_labels`, `list_drafts`
- Draft: `create_draft`
- Labels: `label_message`, `unlabel_message`, `label_thread`, `unlabel_thread`

Server address: `https://gmailmcp.googleapis.com/mcp/v1`

**Part A: set up Google Cloud (about 15 minutes)**

1. Join the Google Workspace Developer Preview Program at https://developers.google.com/workspace/preview.
2. Create a Google Cloud project, or pick one you already have.
3. Turn on two APIs in that project: the Gmail API (`gmail.googleapis.com`) and the Gmail MCP API (`gmailmcp.googleapis.com`). You can use the "Enable the MCP services" link on Google's setup page, or the gcloud command line.
4. Go to **Google Auth Platform > Branding**. Set the App name to `Gmail MCP Server` and pick a support email.
5. Under **Audience**, pick **Internal** if you have Google Workspace. If you only see **External**, pick it and add your own email as a test user.
6. Add a contact email, accept the Google API Services User Data Policy, and click **Create**.
7. Go to **Data Access > Add or Remove Scopes**. Under "Manually add scopes", paste these two lines, then click **Add to Table**, **Update** and **Save**:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.compose`
8. Go to **Google Auth Platform > Clients > Create Client**. Pick **Web application**, give it a name, and add this redirect URI: `https://claude.ai/api/mcp/auth_callback`.
9. Tick **Use this client for an AI-powered agent**. Click **Create**. Copy the Client ID and Client Secret into your password manager. Do not paste them into a chat.

A note on labels: Google's tool reference lists `gmail.modify` as the scope the label tools need, and the setup page only adds `gmail.readonly` and `gmail.compose`. So the label tools may not work with this setup. That is fine. Drafting works without labels. If you add `gmail.modify` later, know that Google describes it as "Read, compose, and send emails". The server still has no send tool.

A note on External apps: if your app is External and in "Testing", Google says its refresh token expires in 7 days. You will need to sign in again each week.

**Part B: add it to Claude**

1. On Pro or Max, go to **Settings > Connectors** (newer screens show **Customize > Connectors**). On Team or Enterprise, an Owner goes to **Organization settings > Connectors**.
2. Click **Add custom connector** (or **Add**, then **Custom**, then **Web**).
3. Name: `Gmail`. Remote MCP server URL: `https://gmailmcp.googleapis.com/mcp/v1`.
4. Open **Advanced settings** and paste your OAuth Client ID and Client Secret.
5. Click **Add**, then sign in with the Google account the agents should use.

**Part C: set each tool**

On Team and Enterprise, an Owner sets these under the connector's **Tool permissions**. On other plans, Claude asks before a tool runs. Only click "Allow always" for the read tools.

| Tool | Setting |
|---|---|
| `search_threads`, `get_thread`, `get_message`, `list_labels`, `list_drafts` | Always allow |
| `create_draft` | Needs approval at first. Move to Always allow once you trust the drafts. |
| Label tools | Needs approval |

### Second choice: Claude's Google Workspace connector or Microsoft 365 connector

These are easier to set up, but they can send mail. Use them only if every send is confirmed.

**Gmail through Claude's Google Workspace connector**

1. On Team or Enterprise, an Owner or Primary Owner turns on the Google Workspace connectors in **Organization settings > Connectors**.
2. Each person goes to **Customize > Connectors**, finds Gmail and connects it. Claude sends you to Google to sign in. Check the exact button name on your screen.
3. Google's sign-in screen will mention sending mail. That is expected for this connector.
4. In a chat, click **+**, hover over **Connectors** and switch Gmail on only when the job needs it.

What it does: search and read mail, draft, send, reply, forward, manage labels and threads, and list drafts. By default, Claude asks for your approval before each send, reply or forward. On Team and Enterprise, Owners can let members skip that prompt. Do not turn it off. Set the send, reply and forward tools to **Needs approval**, or to **Blocked** if you want drafts only. Check the exact tool names in your tool list. Claude can see attachment details, such as file names, but not what is inside attachments.

**Outlook through Claude's Microsoft 365 connector**

1. On Team or Enterprise, an Owner goes to **Organization settings > Connectors**, clicks **+ Add**, then **All available**, finds **Microsoft 365** and clicks **Add to your team**.
2. A Microsoft Entra Global Administrator gives consent. The simple way: they go to **Customize > Connectors**, click **Connect** next to Microsoft 365, pick **Work or school account**, sign in, and tick the box to grant access for the whole organization.
3. Each person goes to **Customize > Connectors**, clicks **Connect** (or **Add**) next to Microsoft 365, picks **Work or school account** or **Personal account**, and signs in.
4. Write tools for work accounts stay off until an admin approves them. An Owner then sets each tool in **Organization settings > Connectors**.

Set the tools like this. These names come from Claude's Microsoft 365 security guide.

| Tool | Setting |
|---|---|
| `outlook_email_search` | Always allow |
| `outlook_create_draft`, `outlook_create_reply_draft`, `outlook_create_reply_all_draft`, `outlook_update_draft` | Needs approval at first |
| `outlook_send_mail`, `outlook_forward_mail`, `outlook_send_draft` | Needs approval, or Blocked for drafts only |
| `outlook_delete_draft`, `outlook_trash_thread`, `outlook_batch_delete_messages` | Blocked |
| `outlook_create_filter`, `outlook_set_vacation` | Blocked (these make inbox rules and auto replies) |

Good to know: Claude asks you to confirm each time it sends or forwards an Outlook email. Mail that Claude sends carries a header that marks it as sent by an agent. Claude cannot send, forward or draft Outlook mail with attachments. With a personal Microsoft account, write tools are on by default, so turn off the ones you do not need under **Tool permissions**.

Do not switch on two mail connectors in the same chat. If Google's Gmail server and Claude's Gmail connector are both on, the chat has a send tool again.

## Way 2, for hosted agents

Use this when the agents run on your own server or a hosting service instead of inside Claude. You give the host a token with the fewest permissions it needs.

### Gmail API

1. In Google Cloud, turn on the Gmail API, set up the consent screen (Internal if you have Workspace) and create an OAuth client, as in Way 1 Part A. Use your host's redirect URI.
2. Sign in once with the mailbox the agents should use and ask for offline access, so the host gets a refresh token.
3. Tick only the scopes for your level:

| Level | Scope | What Google says it allows |
|---|---|---|
| 1 read | `gmail.readonly` | "View your email messages and settings." |
| 2 draft | add `gmail.compose` | "Manage drafts and send emails." |
| 3 send | `gmail.send`, in a separate send service only | "Send email on your behalf." |

Read the level 2 line closely. Google's `gmail.compose` scope can also send a draft. So the code on your host must not have any send function at all. Keep the reading job (with `gmail.readonly`) and the drafting job (with `gmail.compose`) as separate processes with separate tokens if you can. Never add `gmail.modify` or `https://mail.google.com/` for these agents, since both allow sending.

4. Store the client secret and refresh token in your host's secret store. Never put them in a file in your code, a shared document or a chat.

Google stops a refresh token from working if you remove the app's access, if you change your password (for tokens with Gmail scopes), or if it goes unused for six months.

### Microsoft Graph (Outlook)

1. Sign in to the Microsoft Entra admin center at https://entra.microsoft.com as at least an Application Developer.
2. Go to **Entra ID > App registrations** and click **New registration**.
3. Give it a clear name, pick **Single tenant only**, add your host's redirect URI and click **Register**. Write down the Application (client) ID.
4. Add a client secret. Check the exact menu name in your portal (it is usually under Certificates and secrets).
5. Add delegated Microsoft Graph permissions for your level. Use delegated permissions, which act only for the mailbox that signs in. Do not use application permissions, which act without a signed-in user and can give far wider access.

| Level | Permission | What Microsoft says it allows |
|---|---|---|
| 1 read | `Mail.Read` | "Allows the app to read the signed-in user's mailbox." |
| 2 draft | add `Mail.ReadWrite` | "Create, read, update, and delete email in user mailboxes. Does not include permission to send mail." |
| 3 send | `Mail.Send`, in a separate send app only | "Allows the app to send mail as users in the organization." |

Also add `offline_access` so the host gets a refresh token. Do not add `Mail.Send` to the app that reads mail.

6. Store the client secret and refresh token in your host's secret store. Never in a file, a document or a chat.

### Level 3 on a host

If you ever turn on sending, put it in its own small service with its own token. That service only reads approved plans, never mail. It sends one message per approval and logs it.

## Safety switches on the platform's side

**Gmail and Google Workspace**

- **Filters and labels.** Make a label such as "Agents" and a filter that puts known customer, creator or supplier mail into it. In Gmail, click **Show search options** in the search box, enter the sender or words, click **Create filter**, choose to apply the label, then click **Create filter**. Ask the agents to search only that label.
- **Admin API controls (Workspace).** In the Google Admin console, go to **Security > Access and data control > API controls > Manage App Access**. You can set an app to **Trusted**, **Limited**, **Specific Google data** or **Blocked**. "Specific Google data" lets the app ask only for the scopes you list, so list only `gmail.readonly` and `gmail.compose`. You need the Service Settings administrator privilege.
- **Restrict Gmail for unknown apps.** In the same area, under Manage Google Services, you can set Gmail to Restricted. Apps that are not Trusted or set to Specific Google data then lose Gmail access.

**Microsoft 365**

- **Admin consent.** Work accounts cannot connect until a Global Administrator approves. Write tools need a second approval.
- **Revoke one permission.** In Entra, open **Enterprise Applications**, remove the app type filter, open **M365 MCP Server for Claude**, go to **Permissions**, then the **Admin consent** tab. Pick a permission (for example `Mail.Send`), click **...**, then **Revoke permission** and **Yes, revoke**. Calls that need it then fail.
- **Limit who can use it.** For both Claude apps (**M365 MCP Client for Claude** and **M365 MCP Server for Claude**), go to **Properties**, set **Assignment required?** to Yes, then add only the allowed people under **Users and groups**.

**Claude**

- On Team and Enterprise, Owners set each connector tool to Always allow, Needs approval or Blocked for the whole organization. Members cannot override this.

## Safety rules for reading mail

Mail comes from strangers. Anyone can put hidden instructions in an email to trick an AI. OWASP lists this as the top risk for AI apps (LLM01:2025, prompt injection). These rules apply to every agent that reads mail.

1. **Keep reading and sending apart.** One session never both reads untrusted mail and holds a send tool or a payment tool. A reading session hands over a short summary. A separate step, with your approval, does any sending.
2. **Mail is information, not orders.** If an email says "ignore your rules", "send this to", "forward all invoices" or "click here", the agent does not do it. It tells you about it.
3. **Never follow links or open attachments from mail.** The agent quotes the link to you and stops.
4. **Strip hidden HTML.** Before the agent reads a message, remove hidden text, white-on-white text, comments and tiny fonts. Read the plain text.
5. **Flag bank detail changes.** If a supplier, creator or anyone else asks to change bank details or the account to pay, the agent flags it in red and drafts nothing that agrees to it. You check the change by phone, on a number you already have on file. Never use a number from the email itself.
6. **Flag odd senders.** A known name with a new address, or an address one letter off, gets flagged.
7. **Least access.** Give each agent only the level it needs, and turn connectors on only for the chats that need them.

## Check it works

Run one read-only test. Ask the agent:

> Search my mail for the last 3 threads with the label "Suppliers" (or from orders@yourstore.example). For each one, give me the sender, subject, date and one line on what it is about. Do not draft or send anything.

A good answer:

- Lists exactly 3 threads, newest first, each with sender, subject, date and a one-line summary.
- Uses only search and read tools. In Claude, you can see which tools ran.
- Creates no draft and sends nothing. Check your Drafts and Sent folders to be sure.
- Does not open links or attachments, and flags anything odd, such as a bank detail change.

If it says it found nothing, check the label name or sender address, and that you signed in with the right mailbox.

## Take access away

**In Claude**

1. Go to **Customize > Connectors**.
2. Click the Gmail, Google or Microsoft 365 connector.
3. Click **Disconnect**, then confirm.
4. On Team or Enterprise, an Owner can remove or turn off a connector for everyone in **Organization settings > Connectors**.

**Google**

1. Go to your Google Account linked apps page at https://myaccount.google.com/linkedapps.
2. Pick **Access to your Google Account**, then the app (Claude, or the name you gave your own app, such as "Gmail MCP Server").
3. Click **See details**, then **Remove access**, then **Confirm**.
4. Claude's help also points to https://myaccount.google.com/connections, where you find Claude and choose **Delete all connections**.
5. For hosted agents, also delete the refresh token from your host's secret store, and delete the OAuth client in Google Cloud if you no longer need it.

Google notes that an app may keep data it already copied, so ask its maker to delete it if needed.

**Microsoft**

1. Personal account: go to https://account.microsoft.com/privacy/app-access and remove the app.
2. Work account, Claude connector: in Entra, revoke the permission under **Enterprise Applications > M365 MCP Server for Claude > Permissions > Admin consent**, as above, or remove people under **Users and groups**.
3. Work account, your own hosted app: in **Enterprise Applications**, open your app and revoke its permissions. Then delete its client secret under **App registrations**, and delete the token from your host's secret store.

## What stays manual, and why

You do these yourself. The agents can prepare a draft or a note, but a person does the final step.

- **Mail to a new recipient.** A first message to someone new can't be taken back, and it speaks for your brand. You check the address and send it.
- **Anything with attachments.** Google's `create_draft` tool does not support attachments yet. Claude's Gmail connector sees attachment details only. Claude's Microsoft 365 connector cannot send, forward or draft mail with attachments. You attach files yourself.
- **Payments.** No agent pays, or promises to pay, anyone.
- **Bank detail changes.** These are the most common way businesses get tricked. You confirm by phone on a number already on file.
- **Contracts and purchase orders.** These bind your business. You read and sign them.
- **Anything you did not approve.** If a step is not in a plan you said yes to, it does not happen.

## Sources

All checked on 15 November 2026.

- Google, Configure the Gmail MCP server: https://developers.google.com/workspace/gmail/api/guides/configure-mcp-server
- Google, Gmail MCP reference (tool list, Developer Preview): https://developers.google.com/workspace/gmail/api/reference/mcp
- Google, `create_draft` tool (scopes, no attachments yet): https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/create_draft
- Google, `search_threads` tool: https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/search_threads
- Google, `label_thread` tool (needs `gmail.modify`): https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/label_thread
- Google, Gmail API scopes: https://developers.google.com/workspace/gmail/api/auth/scopes
- Google, `drafts.send` (works with `gmail.compose`): https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.drafts/send
- Google, OAuth 2.0 refresh token expiry: https://developers.google.com/identity/protocols/oauth2
- Google, Manage links between your Google Account and apps: https://support.google.com/accounts/answer/13533235
- Google, Third-party apps with account access: https://support.google.com/accounts/answer/3466521
- Google, Create rules to filter your emails: https://support.google.com/mail/answer/6579
- Google Workspace Admin, Control which apps access Google Workspace data: https://knowledge.workspace.google.com/admin/apps/control-which-apps-access-google-workspace-data
- Claude, Use Google Workspace connectors: https://support.claude.com/en/articles/10166901
- Claude, Connect to Microsoft 365: https://support.claude.com/en/articles/15183774-connect-to-microsoft-365
- Claude, Enable and use the Microsoft 365 connector: https://support.claude.com/en/articles/12542951-enable-and-use-the-microsoft-365-connector
- Claude, Microsoft 365 connector security guide: https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide
- Claude, Use connectors to extend Claude's capabilities: https://support.claude.com/en/articles/11176164
- Claude, Custom connectors using remote MCP: https://support.claude.com/en/articles/11175166
- Microsoft, Graph permissions reference: https://learn.microsoft.com/en-us/graph/permissions-reference
- Microsoft, Register an app in Microsoft Entra ID: https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app
- Microsoft, Review permissions granted to enterprise applications: https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions
- OWASP, LLM01:2025 Prompt Injection: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
