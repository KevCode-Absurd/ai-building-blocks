# Build rules for this app

These rules keep the app small enough to understand and cheap to run. Follow them in every stage.

## Size
- Build the smallest thing that does the job in the brief. No features the brief doesn't list.
- One stage at a time. Stop at the end of each stage and wait.
- Add a package only when it saves real work. Say why in one line when you add it.
- Prefer one simple file over a framework of folders. Split a file only when it passes about 300 lines.
- No "nice to have" settings, themes, dashboards or admin screens unless the brief asks for them.

## Skills
- Skills stay as plain `SKILL.md` files. The app loads them at run time and sends the skill as the AI's instructions.
- One skill = one AI call with a fixed answer format (JSON with a schema). Check the answer against the schema before you save it.
- A workflow is an ordered list of skills in a small file (for example `workflow.json`). The code runs the list; it doesn't decide the order.

## Money and safety
- Start in **mock mode**: AI calls return a saved example answer until I turn live mode on.
- Every paid call checks a spend cap first. Caps start at 0. Record the cost of every call.
- Never put keys or passwords in the code or the repo. Read them from environment variables, and keep `.env` out of git. Write a `.env.example` with names only.
- Ask me before anything that sends, publishes, posts, pays, or changes a live account.
- Don't send email addresses, phone numbers or other contact details to an AI.

## Data
- Every saved row records who made it and when.
- From stage 5 on, every row belongs to a workspace, and every read and write checks it. Deny by default.
- Keep my data on my computer until stage 8.

## Quality
- Each stage adds tests for what it built, and all tests pass before you stop.
- Use plain words on screen. Buttons say what they do ("Write 5 scripts", not "Submit").
- An empty screen says what to do first. An error says what went wrong and how to fix it.
- When you're unsure, ask one short question.

## Agents
- Don't add an agent unless the brief says the job needs the AI to choose its own next steps. Most apps don't. See `stages/7-agents-optional.md`.
