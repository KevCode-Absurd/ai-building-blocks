# Put your agent in your AI

Your agent is a folder of files. Put it somewhere your AI reads it before every job, so you don't paste it each time.

App menus change. If a menu isn't where this guide says, search the app's help for "projects", "instructions" or "knowledge".

## ChatGPT
1. Make a project for the agent and give it the job's name.
2. Paste the whole of AGENT.md into the project's instructions.
3. Add RULES.md, EXAMPLES.md, PERMISSIONS.md and CHECKS.md to the project's files.
4. Do every job for this agent in a new chat inside that project.

You can make a custom GPT the same way: AGENT.md goes in its instructions, and the other files go in its knowledge.

## Claude
1. Make a project for the agent.
2. Paste the whole of AGENT.md into the project instructions.
3. Add RULES.md, EXAMPLES.md, PERMISSIONS.md and CHECKS.md to the project knowledge.
4. Do every job for this agent in a new chat inside that project.

## Gemini
1. Make a Gem for the agent.
2. Paste the whole of AGENT.md into the Gem's instructions.
3. Add the other files to the Gem as files.
4. Use that Gem for every job.

## Claude Code, Codex and other coding agents
1. Make a folder for the agent and put all the files in it.
2. Rename AGENT.md to CLAUDE.md for Claude Code, or to AGENTS.md for Codex. Each tool reads that file when you open the folder.
3. Add this line to it: "Before every job, read RULES.md, EXAMPLES.md, PERMISSIONS.md and CHECKS.md in this folder."
4. Open the folder and give it the job.

## Any other AI
Start a new chat, attach all the files and paste prompt 2 from PROMPTS.md.

## After each change
When you add a rule or change a file, upload the new version to your project, Gem or folder. Remove the old one, so your AI never reads two versions.

Keep your SCORECARD.md for yourself. Your agent doesn't need to read it.
