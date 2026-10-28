---
name: slack-bot-builder
description: Build Slack apps using the Bolt framework across Python,
  JavaScript, and Java. Covers Block Kit for rich UIs, interactive components,
  slash commands, event handling, OAuth installation flows, and Workflow Builder
  integration.
risk: critical
source: vibeship-spawner-skills (Apache 2.0)
date_added: 2026-02-27
---

# Slack Bot Builder

Build Slack apps using the Bolt framework across Python, JavaScript, and Java.
Covers Block Kit for rich UIs, interactive components, slash commands,
event handling, OAuth installation flows, and Workflow Builder integration.
Focus on best practices for production-ready Slack apps.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or Codex:** They can write the files, install Bolt and run the bot on your computer.
- **Any good chat AI:** It writes the code and the settings list. You copy the files and run them yourself.
- **Slack:** It is where you test the bot. You need permission to create apps in that workspace.
<!-- /needs -->

## What you need

- What the bot should do, in one or two sentences (for example "a /standup command that posts a message with buttons").
- The language: Python, JavaScript (Node.js) or Java.
- Where it will be used: your own workspace only, or installable by other workspaces (this needs the sign-in flow).
- A Slack workspace where the user is allowed to create apps.
- Tokens from the Slack app settings page: the bot token (starts with `xoxb-`), the signing secret, and for Socket Mode an app-level token (starts with `xapp-`). The user keeps these private.

If the bot's job or the language is missing, ask once. If the user has not decided between their own workspace and other workspaces, build for their own workspace and say how to add the sign-in flow later. Never ask the user to paste a token into the chat, and never write a token into code. Use environment variables.

## Steps

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It holds the code patterns and the sharp edges. Treat its safety, prerequisites and validation notes as mandatory. For a small task, load only the sections you need.

1. **Plan the bot.** Write down each command, event and button it needs, and what each one does. Pick the lowest set of permission scopes that covers them. Do not request admin scopes or scopes the bot does not use.
2. **Create the Slack app.** Tell the user to create it at api.slack.com/apps, add the slash commands, turn on the events and interactivity it needs, and install it to their workspace. Say "in your app's settings" for each part. Do not guess menu names.
3. **Set up the project.** Install Bolt for the chosen language. Put `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET` (and `SLACK_APP_TOKEN` for Socket Mode) in environment variables. Add a `.env.example` with empty values and keep the real `.env` out of version control.
4. **Write the handlers.** Follow the Bolt foundation pattern in the guide. In every command, action and view handler, call `ack()` first, within 3 seconds, then do the slow work.
5. **Build the messages.** Use Block Kit for rich layouts. Check the Block Kit limits in the guide before you send a long message.
6. **Add the sign-in flow only if other workspaces will install it.** Use Bolt's OAuth support. Validate the `state` parameter, and encrypt stored tokens.
7. **Run it locally.** Use Socket Mode for development (no public URL needed). Production uses HTTP mode behind a web server.
8. **Test.** Give the user the checklist under "Output" and ask them to run it.

## Output

Return, in this order:

1. **Plan**: the list of commands, events and buttons, and the scopes each one needs.
2. **Files**: the app code, the dependency file, `.env.example` and a short README, each with its file name.
3. **Slack app settings**: the commands, events, interactivity and scopes to switch on, as a short list.
4. **Run command**: the one command that starts the bot locally.
5. **Test checklist**: for each command and button, what to type or click and what should happen.
6. **Not covered**: anything left out, such as hosting, a database for stored tokens, or admin approval at the workspace.

## Checks

- No token or secret appears in code, logs or the chat.
- Every handler calls `ack()` before slow work.
- The scopes listed are all used by something in the plan.
- If the sign-in flow is included, it validates `state` and stores tokens encrypted.
- Anything you could not test, such as the app running in the user's workspace, is named under "Not covered".

## When to Use
- User mentions or implies: slack bot
- User mentions or implies: slack app
- User mentions or implies: bolt framework
- User mentions or implies: block kit
- User mentions or implies: slash command
- User mentions or implies: slack webhook
- User mentions or implies: slack workflow
- User mentions or implies: slack interactive
- User mentions or implies: slack oauth

## When not to use

- A plain message into one channel from another system. A Slack incoming webhook does this with no app.
- A no-code flow that Slack's Workflow Builder can already do.
- A bot for Discord, Teams or another chat tool.
- Scoping which agent answers which Slack message. Use the Scoped Slack agent router builder.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Slack agent message router builder](https://useaiblocks.com/skills/how-messages-reach-your-agent-implementation-planner). It takes the code change.
- The [Developer tools engineer](https://useaiblocks.com/skills/agency-engineering-developer-tooling-engineer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Credit and licence

The skill text comes from the `sickn33/agentic-awesome-skills` collection (CC BY 4.0, see `LICENSE-CONTENT`). The front matter above names its own source, `vibeship-spawner-skills`, under Apache 2.0. Keep the credit to both when you reuse it.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
