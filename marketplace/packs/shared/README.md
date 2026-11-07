# {{name}}, {{title}}

{{tagline}}

{{bio}}

This folder is {{name}}'s agent pack, a set of plain text files that your AI reads before it starts working for you. Once the pack is loaded, your AI follows the same method, quality checks and writing voice that {{name}} uses on AI Blocks. You may use and change it free of charge, including for client work, and you may share free copies that keep the credit line. LICENSE.md explains the terms, including the main limit, which is that you may not sell the pack.

This is version {{version}} of the pack, last updated on {{updated}}, and {{name}}'s profile page is at {{profile_url}}.

## What {{name}} can do for you

{{outcomes_list}}

## What's inside

{{files_table}}

Your AI reads AGENTS.md first, because it explains who the agent is, which file to open for each task, and which rules it must always keep. CLAUDE.md contains a single line that tells Claude Code to load AGENTS.md automatically.

## Use it in your AI

The quickest start in ChatGPT, Claude or Gemini is the one-file version at {{one_file_url}}. It holds everything {{name}} needs in a single text file. Attach it to a new chat, then send: "You are {{name}}. The file I attached holds your instructions, method and knowledge. Read it and follow it, starting with its AGENTS.md part." Step-by-step help for each app is on {{name}}'s profile page, under "Start {{name}} in your AI".

To use the whole folder instead, unzip the pack first, then choose your tool from the sections below. Each section ends with a first message that you can copy and paste, after replacing the part in square brackets with a sentence or two about your own job.

If your tool limits how many files you can add, start with soul.md, personality.md, playbook.md, knowledge.md and access.md, because together they hold the agent's character, method and expertise. After that, add the skills you expect to use most often.

### Claude (claude.ai or the Claude app)

1. Open Projects in Claude, choose "+ New Project", and give the project a name you will recognise, such as {{name}}.
2. Choose "Set project instructions", paste in the full text of AGENTS.md, and then choose "Save instructions" so that every chat in the project follows it.
3. In the project's knowledge panel, choose "+" and upload the remaining files. Several files share the name SKILL.md, which is fine, because each one states its own name at the top.
4. If you would like Claude to use the skills in any conversation, install them as well. First turn on code execution in Settings, under Capabilities, where the option is called "Code execution and file creation" or "Create and edit files". Next, zip each folder inside skills/ separately and keep its original folder name. Finally, go to Customize, then Skills, choose "+", then "+ Create skill" and "Upload a skill", and upload each zip file in turn.

First message:

```text
You are {{name}}. Follow your project instructions and read your project files. Here is my job: [describe it]. Ask me only what you still need, then show me your plan before you start.
```

### Claude Code

1. Open a terminal in the pack folder and run `claude`, and Claude Code will read CLAUDE.md, which loads AGENTS.md automatically.
2. To install the skills, copy the skills folder into a new folder named .claude, so that each skill ends up at .claude/skills/[skill name]/SKILL.md. Claude Code can make this copy for you if you ask. Afterwards, run /reload-skills or start a new session, then type / to see the list of available skills.

First message:

```text
Read AGENTS.md and follow it. You are {{name}}. Here is my job: [describe it]. Ask me only what you still need, then show me your plan before you start.
```

### ChatGPT

**As a project.** Start a new project from the ChatGPT sidebar, name it after {{name}}, and then add the pack files to it. If ChatGPT warns that a file with the same name already exists, which will happen with the SKILL.md files, choose "Upload anyway". Finally, open the project's ••• menu, choose Project settings, and paste the full text of AGENTS.md into the instructions.

**As a custom GPT.** According to OpenAI's help pages, personal plans (Free, Go, Plus and Pro) can no longer create new GPTs, although some workplace plans still can, depending on their settings. If your plan allows it, create a GPT, paste AGENTS.md into its Instructions, and upload the remaining files as Knowledge.

First message:

```text
You are {{name}}. Follow your instructions and read your files. Here is my job: [describe it]. Ask me only what you still need, then show me your plan before you start.
```

### OpenAI Codex

1. Open the pack folder in Codex, whether you use the Codex app, the command line or the editor extension, and Codex will read AGENTS.md on its own.
2. To install the skills, copy the skills folder into a new folder named .agents, so that each skill ends up at .agents/skills/[skill name]/SKILL.md. Then start a new Codex session in the pack folder, and run /skills or type $ followed by a skill's name whenever you want to use one.

First message:

```text
Read AGENTS.md and follow it. You are {{name}}. Here is my job: [describe it]. Ask me only what you still need, then show me your plan before you start.
```

### Gemini

1. On a computer, go to gemini.google.com, open the sidebar and choose Gems. If you have never created a Gem before, you may find the option under "Settings and help" instead.
2. Choose "New Gem", name it after {{name}}, and paste the full text of AGENTS.md into the instructions box.
3. Under Knowledge, choose "Add files" and upload the remaining files from the pack.
4. Choose Save, then open the Gem whenever you want to work with {{name}}.

First message:

```text
You are {{name}}. Follow your instructions and read your files. Here is my job: [describe it]. Ask me only what you still need, then show me your plan before you start.
```

### Cursor

1. Open the pack folder in Cursor, which automatically reads AGENTS.md from the top level of the folder.
2. To install the skills, copy the skills folder to .agents/skills, exactly as you would for Codex, because Cursor looks there as well. Cursor also reads skills from .cursor/skills and .claude/skills. Reopen the folder so that Cursor discovers them, then type / in the Agent chat to choose one.

First message, in the Agent chat:

```text
Read AGENTS.md and follow it. You are {{name}}. Here is my job: [describe it]. Ask me only what you still need, then show me your plan before you start.
```

## Load {{name}} without a download

You can also load {{name}} straight into your own AI by adding this address as a connector, which some applications call an MCP server: {{mcp_url}}. Your AI then loads the newest version of {{name}} each time, and {{name}} still works on your own AI plan.

- **Claude:** open Settings, then Connectors, choose "Add custom connector", and paste in the address above.
- **Claude Code:** run `claude mcp add --transport http ai-blocks-agents {{mcp_url}}`, then run /mcp inside Claude Code and follow the steps to sign in.
- **ChatGPT, Cursor and other applications:** follow the step-by-step instructions at https://agents.useaiblocks.com/connect

Once you are connected, ask your AI something like "Load {{name}} from AI Blocks and work as {{name}}", then describe your job.

## Find more in the library

library.md lists related skills, prompts and workflows from the free AI Blocks library at https://useaiblocks.com, with a link to each one and a short note on why it is relevant.

## Train your own

If you do this kind of work yourself, download "Train your own" from {{train_pack_url}}. It contains this same pack without {{name}}'s soul and personality, plus a coach that runs inside your own AI and helps you build a version that works the way you do. The coach interviews you about your methods, learns your voice from writing you choose to share, and records your real workflows step by step. It then tests your agent against plain AI on difficult briefs until your version wins, and afterwards you can list it on AI Blocks if you want to. You can read how the whole process works at {{guide_url}}.

## Keep it current

Platform rules change often, so knowledge.md and sources.md record the date on which each fact was last checked, and your AI will warn you when something may be out of date. Download the newest version from {{pack_url}} every so often, and read CHANGELOG.md to see exactly what changed.

## Let {{name}} work in your tools

{{name}} can do real work in your accounts once you connect them, at the level you choose for each tool:

- **Level 1, read:** {{name}} looks at your accounts, exports and data and changes nothing. Every job starts here until you choose a higher level.
- **Level 2, read and draft:** {{name}} also builds work inside the tool that is not live yet, such as paused campaigns, draft posts or pull requests, which you then review and publish.
- **Level 3, read, write and publish:** {{name}} also makes live changes from start to finish, but only within the limits you set for the accounts, the budget cap, the kinds of action and how long the access lasts.

At level 3, {{name}} shows you the list of actions and limits and waits for your yes before the first live change. It asks again before anything outside your limits, and it always asks afresh before job offers, binding quotes or contracts, dispute evidence, legal or supplier claims, formal complaint replies, deleting data, or paying anyone new. Moving money and changing bank or payout details stay with you, so {{name}} prepares them for you to complete. It logs every action and reports it to you, and you can lower the level at any time. access.md lists what {{name}} does in each tool at each level and how to connect it.

## Stay safe

- Connect your tools only through official connectors, MCP servers or each tool's own sign-in, as access.md describes, and never paste passwords, API keys or card numbers into any AI chat.
- Start at level 1, raise the level only for the tools and limits you are comfortable with, and read the action log after each job.
