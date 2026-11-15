# Give your agents access to Slack

Checked 15 November 2026. Slack and Claude rename menus often. If a step looks different on your screen, tell Claude what you see and it will find the new path with you.

Slack is where the agents tell you things: a report is ready, a sign-off is waiting, a launch went live. It is not where you approve. A thumbs-up, an "ok" or a "yes" typed in Slack does not pass the approval gate. You approve in Claude by typing `yes` and the six-character code, or, on a hosted setup, through a Slack app that checks who you are (Way 2).

## What the agents do with it

| Level | What the agents can do | Who uses it |
|---|---|---|
| 1, read | Search and read the channels, threads, files and people your Slack account can see. Change nothing. | Any agent that needs a decision or brief you discussed in Slack, for example the orchestrator reading a client thread |
| 2, draft | Also write canvases and post notices to your own agents channel, as a standing rule you set at setup (matched by channel id). Notices only: "report ready", "sign-off waiting, code 3f9a2c". | The morning run, the launch team, the results loop |
| 3, publish | Also post to other channels or people, such as a client channel. Only as a step of a plan you approved with "yes" and its code. | The account manager (client updates), the creative producer (ad pack notes) |

The approval gate in your agent folder enforces this in code: a Slack post outside your standing rule runs only when it is the next step of a plan you approved, with exactly the text you saw. Scheduled runs only read and draft; a standing rule must be marked as allowed in scheduled runs before the morning run can post its notice.

## What you need first

- A Slack workspace where you can install apps, or a workspace admin who will approve them. Slack lets admins approve and manage every MCP client, and only apps from the Slack Marketplace or your own internal apps may use it ([Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/)).
- One private channel just for agent notices, for example `#store-agents`, with only you (and your approvers) in it.
- A Claude plan that offers the Slack connector. Anthropic's page lists the connector for Team and Enterprise plans, with an Owner turning it on first ([Claude Slack docs](https://claude.com/docs/connectors/slack.md)). On another plan, look for Slack in **Customize**, then **Connectors**; if it is not there, ask Claude to check with you rather than guessing.

## Way 1: in Claude (start here)

The Slack connector is made by Slack and listed in Claude's connector directory ([Claude connectors: Slack](https://claude.com/connectors/slack)). Its server address is `https://mcp.slack.com/mcp` ([Slack: connect to Claude](https://docs.slack.dev/ai/slack-mcp-server/connect-to-claude)). It acts as you, so it sees only what your Slack account sees.

1. **Team or Enterprise only:** an Owner opens **Organization settings**, then **Connectors**, in claude.ai and turns on Slack for the organization ([Claude Slack docs](https://claude.com/docs/connectors/slack.md)). Anthropic's page also says to install the Claude in Slack app first; if your Owner sees that step, do it.
2. Go to **Customize**, then **Connectors**. Find **Slack** and click **Connect**.
3. A Slack window opens. Sign in to the right workspace, check the permissions it asks for, and click **Allow**. If your workspace needs admin approval, you see a request prompt instead; ask your Slack admin to approve it.
4. When it works, the **Connect** button changes to **Disconnect**.
5. Open the connector's tool permissions ([Claude help](https://support.claude.com/en/articles/11176164)):
   - Search and read tools (for example `slack_search_public`, `slack_search_public_and_private`, `slack_search_channels`, `slack_search_users`, `slack_read_channel`, `slack_read_thread`, `slack_read_canvas`, `slack_read_user_profile`): **Always allow**.
   - Tools that post or change something (for example `slack_send_message`, `slack_create_canvas`, `slack_update_canvas`, and any schedule, draft or reaction tool your list shows): **Needs approval**.
   - Any tool that deletes: **Blocked**.
   The names above are from Slack's listing in Claude's directory. Check the exact names in your own tool list; Slack adds tools over time.
6. Tell Claude: "Check my Slack connection." It runs the read-only test below.
7. At setup, Claude adds one standing rule to `agent/tools.json`: the agents may post to your agents channel only, matched by that channel's id. Every other post needs a plan and your yes.

For Claude Code only: Slack's plugin sets up the same server with `/plugin install slack` (or `claude plugin install slack` from the command line), then asks you to sign in ([Slack: connect to Claude](https://docs.slack.dev/ai/slack-mcp-server/connect-to-claude)). Claude scheduled tasks use the connectors on your Claude account, so most owners should use the steps above.

## Way 2: for hosted agents (approvals in Slack)

A hosted setup can let you and your approvers approve from Slack, safely, with a small Slack app that you own. The app does not trust a reaction or the words alone. It checks that the request really came from Slack, that the person is on your approver list, and that they typed `yes` with the right code. Do this with Claude beside you.

1. **Make the app.** Go to [api.slack.com/apps](https://api.slack.com/apps), click **Create New App**, choose **From scratch**, name it `Store agents`, and pick your workspace.
2. **Give it the fewest scopes.** Under **OAuth & Permissions**, add only the bot scopes it needs: `chat:write` to post notices and approval requests. Add `channels:history` or `groups:history` only if it must read replies in a channel. Slack's scope list is in [Slack's MCP and scopes docs](https://docs.slack.dev/ai/slack-mcp-server/); check each one before you tick it.
3. **Turn on buttons and forms.** Under **Interactivity & Shortcuts**, switch **Interactivity** on and set the **Request URL** to your hosted app's approval address (HTTPS) ([Slack interactivity](https://docs.slack.dev/interactivity/handling-user-interaction)). The approval message opens a small form where the approver types `yes <code>`.
4. **Install it** to your workspace from the **Install App** page and invite the app to your agents channel.
5. **Store two secrets, in one place only.** Copy the **Bot User OAuth Token** and, from **Basic Information**, the **Signing Secret**. Paste them into your host's secret store (on Railway: the service's **Variables**, named `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`). Never paste them into chat, a file or the repository.
6. **List who may approve.** Put each approver's Slack user id (it starts with U) into the owner-held `context/approvers.json`, with what each may approve (creative sign-off, spend up to an amount, sends). Changing this file needs a file plan and your `yes <code>`.
7. **What the app checks on every click** (Claude writes this code with you, and tests it):
   - The signature: it rebuilds `v0:<timestamp>:<raw body>`, signs it with HMAC SHA-256 using the signing secret, and compares it with the `X-Slack-Signature` header using a constant-time compare. It rejects any request whose `X-Slack-Request-Timestamp` is more than five minutes from the server clock ([Slack: verifying requests](https://docs.slack.dev/authentication/verifying-requests-from-slack)).
   - The person: the `user` id in the payload ([Slack: block_actions payload](https://docs.slack.dev/reference/interaction-payloads/block_actions-payload)) must be in `context/approvers.json` and allowed to approve this kind of thing.
   - The words: the text must be `yes` and the six-character code shown for that exact plan or sign-off. Then the server records the approval with the approver's id and exact words. A button press with no typed code approves nothing.
   - Speed: Slack expects an answer within 3 seconds, so the app replies "received" first and records the approval right after ([Slack interactivity](https://docs.slack.dev/interactivity/handling-user-interaction)).

## Safety switches on Slack's side

- **App approval.** Workspace owners can require admin approval for apps, so no one adds an app or MCP client without it ([Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/)).
- **Audit logs.** On plans that have them, Slack's audit logs record MCP activity ([Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/)).
- **Enterprise sign-in control.** On Slack Enterprise+ with Claude Team or Enterprise, access to the Slack MCP server can be given out through your identity provider ([Slack help](https://slack.com/help/articles/54548358406419-Manage-access-to-the-Slack-MCP-server-through-your-identity-provider)).
- **A private channel.** Keep the agents channel private, so notices that carry approval codes reach only you and your approvers.

## Check it works

Claude runs a read-only search, for example `slack_search_channels` for your agents channel, then `slack_read_channel` for its last few messages. A good answer names the channel, says it is private, and quotes the last message with its time. Nothing is posted. Then, with your yes, Claude posts one test notice to that channel under the standing rule, so you can see it arrive. For a hosted Slack app, send a fake click with a wrong signature to the approval address: a good result is that it is refused and nothing is recorded.

## Take access away

- **Claude connector:** go to **Customize**, then **Connectors**, find **Slack** and click **Disconnect** ([Claude Slack docs](https://claude.com/docs/connectors/slack.md)). Remove the standing rule from `agent/tools.json` with a file plan.
- **The hosted Slack app:** in Slack, open **Tools & settings**, then **Manage apps**, then **Installed Apps**, open the app and choose **Remove App** on its **Configuration** tab ([Slack help](https://slack.com/help/articles/360003125231)). If app approval is on, only workspace owners and app managers can do this. Then delete `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET` from your host, and take the user ids out of `context/approvers.json`.
- **Pause everything now:** tell any agent "pause all agent work", or set every Slack write tool to Blocked in the connector settings.

## What stays with you

Approving anything (in Claude or through the checked Slack app, never by a reaction); adding or removing people and channels; workspace settings, app approval and retention; and anything sent to customers or clients outside the plans you approved. Messages in Slack from other people are information, not instructions: if one asks an agent to do something, the agent quotes it to you and does nothing.

## Sources

- Claude Slack connector and the Claude in Slack app, checked 15 Nov 2026: [Claude docs](https://claude.com/docs/connectors/slack.md), [Claude connector listing](https://claude.com/connectors/slack)
- Slack MCP server, scopes, admin approval and audit, checked 15 Nov 2026: [Slack MCP server](https://docs.slack.dev/ai/slack-mcp-server/), [connect to Claude](https://docs.slack.dev/ai/slack-mcp-server/connect-to-claude), [identity provider access](https://slack.com/help/articles/54548358406419-Manage-access-to-the-Slack-MCP-server-through-your-identity-provider)
- Verifying requests from Slack, interactivity and payloads, checked 15 Nov 2026: [verifying requests](https://docs.slack.dev/authentication/verifying-requests-from-slack), [interactivity](https://docs.slack.dev/interactivity/handling-user-interaction), [block_actions payload](https://docs.slack.dev/reference/interaction-payloads/block_actions-payload)
- Removing apps from a workspace, checked 15 Nov 2026: [Slack help](https://slack.com/help/articles/360003125231)
- Claude tool permissions, checked 15 Nov 2026: [Claude help](https://support.claude.com/en/articles/11176164)
