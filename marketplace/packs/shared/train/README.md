# Train your own {{role_name}} agent

This folder is a base pack for a {{role_name}}. It holds the role's researched knowledge, its skills, prompts and workflows, and a starting method that you can change. It has no soul and no personality yet, because those will come from you.

The file instructions.md turns the AI you already use into a training coach. The coach helps you build your own version of this agent from your experience, your writing voice and the way you really work. It is a little like copying a project on GitHub and making it your own: you start from the base and change whatever you do differently.

## What the coach does

1. It asks for your permission before it reads anything, and agrees with you exactly what it may read.
2. It maps the jobs your agent will do, the steps where your judgment matters, and the moments when it should stop and ask you.
3. It walks you through five to ten real cases from your work, one decision at a time. It asks what you noticed, what you expected, which options you passed on, and what would have changed your call.
4. It watches you do one real task while you think out loud, so your agent learns what you look at first.
5. It learns your taste by asking you to compare real work, such as 20 or more pairs of ads or pages, and to say what separates them.
6. It learns how you write, what you value and how you push back, from samples you choose.
7. It plays your agent on a case it hasn't seen yet, and you mark every place it goes wrong.
8. It builds a test set from your own jobs and tests your agent blind against plain AI, with a reviewer tuned to grade the way you do. You see the win rate, the mistakes on each side, and how often your agent gets the same case right every time.
9. It rechecks the facts in the knowledge file, then helps you package your agent.

Every stage ends with a checkpoint, where you read what the coach has written and either approve it or ask for changes. After training, a weekly routine of two to three hours turns real mistakes into tested fixes, and a monthly check keeps the test fair.

## What you need

- **An AI tool.** Claude Code, OpenAI Codex and Cursor work best, because the coach can create and edit the files for you directly. Claude, ChatGPT and Gemini also work, although there the coach gives you each finished file to save yourself.
- **Real cases from your work.** Jobs where your judgment mattered, including one that went badly. You can take the names out.
- **Examples to compare.** Your past work, or public work by real businesses, such as their live ads or pages.
- **Samples of your own writing**, such as emails, reports or proposals that clients have seen.
- **Time.** Plan on about 12 to 18 hours over two or three weeks. That figure is our estimate. You have a first working agent after about 4 hours, and you can stop at any stage and continue later.

## Set it up

Unzip the pack first, then send this same first message in whichever tool you use:

```text
Read instructions.md and help me train my own {{role_name}} agent
```

**Claude Code.** Open a terminal in the pack folder and run `claude`, and Claude Code will read CLAUDE.md, which loads AGENTS.md, before you send the first message.

**OpenAI Codex.** Open the pack folder in Codex, whether you use the Codex app, the command line or the editor extension, and Codex will read AGENTS.md on its own before you send the first message.

**Cursor.** Open the pack folder in Cursor, which automatically reads AGENTS.md from the top level of the folder, and send the first message in the Agent chat.

**Claude (claude.ai or the Claude app).** Create a project with "+ New Project", choose "Set project instructions", and paste in the full text of AGENTS.md. Upload the other files to the project's knowledge with "+", including instructions.md and everything in the training folder, then start a chat inside the project.

**ChatGPT.** Start a new project from the sidebar and add the pack files, choosing "Upload anyway" if ChatGPT warns about a file with the same name. Open the project's ••• menu, choose Project settings, paste the full text of AGENTS.md into the instructions, and then start a chat inside the project.

**Gemini.** On a computer, go to gemini.google.com and open Gems from the sidebar. Choose "New Gem", paste the full text of AGENTS.md into the instructions, add the other files under Knowledge with "Add files", and save it before you start chatting.

If your tool limits how many files you can add, start with instructions.md, the files in the training folder, playbook.md and knowledge.md.

In Claude, ChatGPT and Gemini, the coach cannot change the files you uploaded, so it gives you each finished file in full instead. Save that file into your pack folder in place of the old one, and replace the copy in your project as well, so that the coach always reads the newest version.

## What you end up with

You finish with your own agent pack, organised the same way as the house packs on AI Blocks. Next to your soul, personality and playbook, it holds a scope card, your decision rules with their exceptions, your cases, your taste files, a never-do list and a rubric in your words. It also holds a test set and the results of your blind tests, so you can see where your agent beats plain AI and where it doesn't yet. Your agent runs in Claude, ChatGPT, Codex, Gemini and Cursor, exactly as the house packs do.

## Your data

- The coach reads only what you share, and it asks for your permission before it reads anything new.
- This pack does not send anything anywhere, but whatever you share goes to the AI tool you use, under that tool's own privacy terms.
- Leave out any client work you do not have the right to use, and expect the coach to remove names and personal details from everything it keeps.
- Never paste passwords, API keys or card numbers into the chat. Training never needs them, and once your agent is trained it connects to a client's tools only through official connectors, MCP servers or each tool's own sign-in, at the access level the client chooses.

## Learn more

You can read how training and listing work at {{guide_url}}.

This base pack comes from {{name}}, {{title}}, on AI Blocks ({{profile_url}}). The AI Blocks Agent Pack Licence in LICENSE.md lets you use and change it free of charge, including for client work, provided you keep the credit line. A trained agent can be sold only through the AI Blocks marketplace.
