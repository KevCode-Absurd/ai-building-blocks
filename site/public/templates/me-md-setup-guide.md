# Set up your me.md in each AI

You have two versions of the same file:

- **The short core** (me-core.txt): about 1,200 characters. It goes in your AI's settings box, so your AI reads it before every chat.
- **The full me.md**: everything else. It goes in a project or a file your AI can open when a task needs it.

App menus change. If a menu isn't where this guide says, search the app's help for "custom instructions" or "personal preferences".

## ChatGPT
1. In Settings, open Personalization. Paste the short core into custom instructions.
2. For the full file, open a project and add me.md to its files. Do your work in that project.

## Claude
1. In Settings, paste the short core into your personal preferences.
2. For the full file, open a project and add me.md to its project knowledge.

## Claude Code
Claude Code reads `~/.claude/CLAUDE.md` in every project.
1. Save your me.md as `~/.claude/me.md`.
2. Add this line to `~/.claude/CLAUDE.md` (make the file if it isn't there):

   ```
   @~/.claude/me.md
   ```

3. For only the short core, paste it into `~/.claude/CLAUDE.md` instead.

## Gemini
1. Make a Gem. Paste the short core into the Gem's instructions.
2. Add me.md to the Gem as a file. Use that Gem for your work.

## Cursor
1. In Cursor's settings, open Rules. Paste the short core into your user rules.
2. Keep me.md in a project folder, and mention it when a task needs it.

## Any other AI
Paste the short core at the top of a new chat, or attach me.md.

## Keep it private and current
- Never put passwords, ID or bank numbers, health details or private facts about other people in either version.
- Projects carry an expiry date. Run the refresh prompt (me-md-prompts.md, prompt 4) once a month.
- After each refresh, paste the new file into Your me.md in AI Blocks, and update the short core in each AI.
