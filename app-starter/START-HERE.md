# Start here

Open this folder in your AI coding assistant, or upload its files to a chat that supports attachments. Paste everything below the line. The assistant needs file-editing and command tools to build and test directly; in a chat, ask for files to save and commands you can run.

---

You're helping me turn my skills and workflows into a small, working app. Read `BUILD-RULES.md` in this folder first and follow it the whole time.

Work in this order, and don't skip ahead:

1. **Look, don't build.** List the `SKILL.md` files and workflow files you can see (in this folder and the folders I point you to). For each, write one line: what it takes in and what it gives back.
2. **Ask before you build.** Ask me the questions in `QUESTIONS.md`, all in one message. Suggest an answer for each one from what you found, so I can reply "yes" or change it. Don't ask anything the files already answer.
3. **Write the brief.** Fill in `templates/APP-BRIEF.md` from my answers. Keep it to one page. Pick the stages I need from `stages/`, and say which ones we're skipping and why.
4. **Wait for my OK.** Don't write any app code until I say the brief is right.
5. **Build one stage at a time.** For each stage, read its file in `stages/`, build only that, and finish with:
   - what you built, in three lines or fewer;
   - how I try it, as steps I can follow;
   - the tests you added and that they pass;
   - what the next stage would add.
   Then stop and wait for me.
6. **Keep the skills as files.** The app reads my `SKILL.md` files at run time. Don't copy their text into code. If a skill needs to change, change the file.

If something is unclear, ask one short question rather than guess. If a step would cost money, send anything outside my computer, or need an account somewhere, ask me first.
