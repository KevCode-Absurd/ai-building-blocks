# Train your own {{role_name}} agent

This folder is a base pack for a {{role_name}}. It holds the role's researched knowledge, its skills, prompts and workflows, and a starting method that you can change. It has no soul and no personality yet, because those will come from you.

The file instructions.md turns the AI you already use into a training coach. The coach helps you build your own version of this agent from your experience, your writing voice and the way you really work. It is a little like copying a project on GitHub and making it your own: you start from the base and change whatever you do differently.

## What the coach does

1. It asks for your permission before it reads anything, and agrees with you exactly what it may read.
2. It interviews you about how you do the work, one question at a time, and keeps asking follow-up questions until your answers are specific.
3. It learns how you write from samples you choose, and, if you agree, from your own Claude or ChatGPT history.
4. It asks about your values, how you push back on clients, and a story that shaped the way you work.
5. It records two or three of your real workflows step by step, including what you do yourself inside real tools, such as building a draft or making a live change. That way your agent can do those steps at the access level a client grants it, and the coach turns the workflow you repeat most into a skill.
6. It adds two or three of your past jobs as examples, with every name and identifying detail taken out.
7. It runs test rounds in which it plays a difficult client, your agent answers, and you compare that answer with what plain AI writes for the same brief. Anything you would never ship becomes a rule in your playbook, and the rounds continue until your agent wins at least four of five tests, judged by you.
8. It rechecks the facts in the knowledge file, then helps you package your agent and, if you would like, list it on AI Blocks.

Every stage ends with a checkpoint, where you read what the coach has written and either approve it or ask for changes.

## What you need

- **An AI tool.** Claude Code, OpenAI Codex and Cursor work best, because the coach can create and edit the files for you directly. Claude, ChatGPT and Gemini also work, although there the coach gives you each finished file to save yourself.
- **Samples of your own writing**, such as emails, social posts, reports or proposals that clients have seen.
- **Two or three past jobs** that you made yourself, or that a client has agreed you may use.
- **Time.** Plan on 7 to 12 hours altogether, spread over a week or two. That figure is our estimate and depends on how much you share, and you can stop at any stage and continue later.

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

You finish with your own agent pack, organised the same way as the house packs on AI Blocks. It contains your soul, personality, know-how and playbook, along with the rules your agent learned during testing. It also holds your workflows, at least one new skill, your examples and your test results. Your agent then runs in Claude, ChatGPT, Codex, Gemini and Cursor, exactly as the house packs do. If you choose to, you can upload it in the AI Blocks expert studio, where it is tested and reviewed before it is listed.

## Your data

- The coach reads only what you share, and it asks for your permission before it reads anything new.
- This pack does not send anything anywhere, but whatever you share goes to the AI tool you use, under that tool's own privacy terms.
- Leave out any client work you do not have the right to use, and expect the coach to remove names and personal details from everything it keeps.
- Never paste passwords, API keys or card numbers into the chat. Training never needs them, and once your agent is trained it connects to a client's tools only through official connectors, MCP servers or each tool's own sign-in, at the access level the client chooses.

## Learn more

You can read how training and listing work at {{guide_url}}.

This base pack comes from {{name}}, {{title}}, on AI Blocks ({{profile_url}}). The AI Blocks Agent Pack Licence in LICENSE.md lets you use and change it free of charge, including for client work, provided you keep the credit line. A trained agent can be sold only through the AI Blocks marketplace.
