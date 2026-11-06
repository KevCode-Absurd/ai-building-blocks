# Use an agent pack in your AI

Every agent on AI Blocks has a free pack that you can download and load into the AI you already use. Once the pack is loaded, your AI follows the same method, quality checks and writing voice as that agent. This guide explains how to set it up in Claude, Claude Code, ChatGPT, OpenAI Codex, Gemini and Cursor, and what to send as your first message.

## What's in a pack

A pack is a folder of plain text files that any AI can read, and these are the most important ones:

- **AGENTS.md** is the file your AI reads first. It explains who the agent is, which file to open for each task, and the rules it must keep, such as never inventing facts.
- **soul.md** and **personality.md** describe how the agent thinks and how it writes.
- **playbook.md** is its method, from the questions it asks at the beginning to the checks it runs before it hands work back.
- **knowledge.md** holds what the agent knows about the role, with a source and a date for each fact, and **sources.md** lists those sources.
- **access.md** describes the tools the agent works with, what it does in each one at each access level, how to connect each tool, and what it will never ask for.
- **skills**, **prompts** and **workflows** are ready-made methods for particular tasks.
- **README.md** repeats the setup steps in this guide, and **LICENSE.md** explains how you may use the pack: free of charge for your own work and your clients' work, but never for sale.

## Before you start

Download the pack from the agent's page and unzip it. If you use a chat app, keep the folder somewhere easy to find, because you will upload files from it.

Some tools limit how many files you can add. If you reach a limit, add soul.md, personality.md, playbook.md, knowledge.md and access.md first, because together they hold the agent's character, method and expertise. After that, add the skills you expect to use most often.

## Claude (claude.ai or the Claude app)

1. Open Projects in Claude, choose "+ New Project", and give the project a name you will recognise, such as the agent's name.
2. Choose "Set project instructions", paste in the full text of AGENTS.md, and then choose "Save instructions" so that every chat in the project follows it.
3. In the project's knowledge panel, choose "+" and upload the remaining files. Several files share the name SKILL.md, which is fine, because each one states its own name at the top.

You can also install the skills, so that Claude can use them in any conversation. First turn on code execution in Settings, under Capabilities, where the option is called "Code execution and file creation" or "Create and edit files". Next, zip each folder inside the skills folder separately and keep its original folder name. Finally, go to Customize, then Skills, choose "+", then "+ Create skill" and "Upload a skill", and upload each zip file in turn.

## Claude Code

Claude Code is Anthropic's coding assistant, which runs in your terminal or inside a code editor. Open a terminal in the pack folder and run `claude`, and Claude Code will read CLAUDE.md, a one-line file that loads AGENTS.md automatically.

To install the skills, copy the pack's skills folder into a new folder named .claude, so that each skill ends up at .claude/skills/[skill name]/SKILL.md. Claude Code can make this copy for you if you ask. Afterwards, run /reload-skills or start a new session, then type / to see the list of available skills.

## ChatGPT

**As a project:** start a new project from the ChatGPT sidebar, name it after the agent, and then add the pack files to it. If ChatGPT warns that a file with the same name already exists, which will happen with the SKILL.md files, choose "Upload anyway". Finally, open the project's ••• menu, choose Project settings, and paste the full text of AGENTS.md into the instructions.

**As a custom GPT:** according to OpenAI's help pages, personal plans (Free, Go, Plus and Pro) can no longer create new GPTs, although some workplace plans still can, depending on their settings. If your plan allows it, create a GPT, paste AGENTS.md into its Instructions, and upload the remaining files as Knowledge.

## OpenAI Codex

Open the pack folder in Codex, whether you use the Codex app, the command line or the editor extension, and Codex will read AGENTS.md on its own.

To install the skills, copy the skills folder into a new folder named .agents, so that each skill ends up at .agents/skills/[skill name]/SKILL.md. Then start a new Codex session in the pack folder, and run /skills or type $ followed by a skill's name whenever you want to use one.

## Gemini

1. On a computer, go to gemini.google.com, open the sidebar and choose Gems. If you have never created a Gem before, you may find the option under "Settings and help" instead.
2. Choose "New Gem", name it after the agent, and paste the full text of AGENTS.md into the instructions box.
3. Under Knowledge, choose "Add files" and upload the remaining files from the pack.
4. Choose Save, then open the Gem whenever you want to work with the agent.

You create Gems on a computer, but once a Gem is saved, it also appears in the Gemini mobile app.

## Cursor

Open the pack folder in Cursor, which automatically reads AGENTS.md from the top level of the folder.

To install the skills, copy the skills folder to .agents/skills, exactly as you would for Codex, because Cursor looks there as well. Cursor also reads skills from .cursor/skills and .claude/skills. Reopen the folder so that Cursor discovers them, then type / in the Agent chat to choose one.

## Your first message

Use the same first message in every tool, replacing the parts in square brackets with the agent's name and a sentence or two about your job. In Claude Code, OpenAI Codex and Cursor, begin with an instruction to read AGENTS.md:

```text
Read AGENTS.md and follow it. You are [agent name]. Here is my job: [describe it in a sentence or two]. Ask me only what you still need, then show me your plan before you start.
```

In a Claude or ChatGPT project, a custom GPT or a Gem, the text of AGENTS.md is already in the instructions, so begin by asking the agent to follow them:

```text
You are [agent name]. Follow your instructions and read your files. Here is my job: [describe it in a sentence or two]. Ask me only what you still need, then show me your plan before you start.
```

The agent will ask a few short questions about anything your message left out, and then it will show you its plan. For a small task, it may skip the plan and complete the work straight away.

## Get better results

- **Give it real material:** your own product pages, reports, exports and past emails work far better than a description of them, and access.md explains what helps most for each tool.
- **Answer the intake questions:** if you skip one, the agent tells you what it assumed instead, so read its assumptions carefully.
- **Ask for its sources:** the agent cites where its facts come from, with dates, and it flags any fact that may be out of date. When your AI can search the web, it also checks for newer information.
- **Explain your changes:** when you change the agent's work, tell it why, because the reason helps it get the next draft right.
- **Keep the pack current:** platform rules change regularly, so download the newest version from the agent's page every so often, and read CHANGELOG.md to see what changed.

## Let the agent work in your tools

An agent can do more than give advice, because once you connect your tools, it can do real work inside them, such as building an ad campaign, writing a draft post or updating your records. You decide how far it can go, and you set this separately for each tool:

- **Level 1, read:** the agent looks at your accounts, exports and data, but it changes nothing. Every job starts at this level until you choose a higher one.
- **Level 2, read and draft:** the agent also builds work inside the tool that is not live yet, such as a paused campaign, a draft post, an unsent email or a pull request. You review that work and publish it yourself.
- **Level 3, read, write and publish:** the agent also makes live changes from start to finish, such as publishing a post, launching an ad or sending an email. It works only within the limits you set, which cover the accounts it may use, how much it may spend, the kinds of action it may take, and how long the access lasts.

At the start of a job, the agent asks which level you grant for each tool. Once you choose level 3, it shows you its list of actions and your limits, and it waits for your yes before its first live change. After that, it asks again before anything outside your limits, such as a new account, spending above your cap or deleting data. A few things always need a fresh yes, even at level 3, including job offers, binding quotes and replies to formal complaints. Payments and changes to bank details stay with you, so the agent prepares them for you to finish. The agent also keeps a log of every action it takes and stops to ask you if something unexpected happens, and you can lower the level at any time.

### How to connect a tool

Connect each tool through your AI app's official connector, an MCP server, or the tool's own sign-in page. In Claude, for example, connectors live under Settings, then Connectors, and in Claude Code you add an MCP server with the `claude mcp add` command. You always sign in yourself on the tool's own page, so your password never passes through the chat. The access.md file in each pack lists the tools the agent works with, what it does at each level, and how to connect each one. If you would rather not connect anything, you can still share exports and screenshots, and the agent will work at level 1.

## Stay safe

- Never paste passwords, API keys or card numbers into any AI chat. The agent never asks for them, so connect your tools through official connectors or sign-in pages, or share an export or a screenshot instead.
- Start at level 1, and raise the level only for the tools you are happy for the agent to change. At level 3, set clear limits and read the action log after each job.
- Your files go to the AI tool you use, under that tool's own privacy terms, so share client material only if you have the right to.

## Other ways to work with an agent

**Load it from your AI instead:** you can skip the download. Add https://agents.useaiblocks.com/mcp to your AI app as a connector (the steps for each app are at https://agents.useaiblocks.com/connect). Then ask your AI to load the agent, and it works in your chat with the same files, on your own AI plan.

**Train your own:** if you do this kind of work yourself, the "Train your own" pack helps your AI build an agent that works and sounds like you. To find out how it works, read [Train your own agent](/guides/train-your-own-agent).
