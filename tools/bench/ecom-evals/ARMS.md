# Arms: who answers each task

Every arm gets the same owner question, the same input files and the same deliverable rules (`arms/RULES-DELIVERABLE.md`). Only the help differs. No arm uses the web. Each arm runs each task **3 times**, each run in its own fresh folder and fresh context, so runs cannot see each other.

`scripts/make-sheets.mjs prompts` builds every run folder and writes the commands. Text runs go on Kevin's Claude plan (Claude Code subagents or `claude -p` with no `ANTHROPIC_API_KEY` set). Never use an API key for text.

## Arm `plain`: plain Claude, context-matched

- Gets: the owner question, the deliverable, the rules, and `inputs/` (the brand's Org context and every fixture file for the task). This is the same context the agent arms get, so a win for an agent is a win for the method and knowledge, not for extra data.
- Told: "You are a senior <the agent's job title>." Nothing else.
- Tools under `claude -p`: Read, Glob, Grep inside the run folder. No Bash, no web.

## Arm `chat`: the AI Blocks agent in a chat app

- Gets: everything `plain` gets, plus the agent's one-file pack `marketplace/dist/packs/<agent>.txt`.
- No tools: a chat app cannot run node.
- Two modes, recorded per run in `meta.json` and reported separately:
  - `inline` (a true chat paste): the one-file pack and all inputs go into the prompt. Used when the whole prompt fits under `--chat-max-chars` (default 600,000 characters, about 150k tokens).
  - `project` (a chat app's project knowledge): when the one-file pack is too big to paste, it sits in the run folder and the model may only Read and Grep it, the way a chat project searches attached knowledge. The inputs are still pasted inline.
- On 15 Nov 2026 every e-commerce one-file pack is about 2.7 MB, so the chat arm runs in `project` mode until the lean chat core lands (engineering plan W1).

## Arm `code`: the AI Blocks agent in a coding app

- Gets: everything `plain` gets, plus the agent's full pack folder, unzipped fresh from `marketplace/dist/packs/<agent>.zip` into `pack/` for each run.
- Told to start with `pack/CLAUDE.md` and use the pack as its operating instructions, including its node tools.
- Tools under `claude -p`: Read, Glob, Grep, Write, Edit, and Bash limited to `node`. No web.

## Image tasks (E16, E17, E18)

- Each arm writes the brief and exactly 5 image prompts in its answer (format in the rules).
- `scripts/render-images.mjs` renders **run 1's 5 prompts per arm per task** with OpenAI gpt-image at medium quality: 3 tasks x 3 arms x 5 = 45 images per round. OpenAI is used for images only. All arms get the same model, size and quality, so the test stays fair.
- All 3 runs of an image task are still judged as text, so pass^3 and worst-of-3 cover the brief and prompts.

## What is held equal, and what is logged

- Same model and model setting for every arm in a round (`--model` in make-sheets, written to each `meta.json`).
- Same inputs, same rules, same question.
- Logged per run when available: model, mode, pack hash (sha256 of the zip or txt), start and end time, output words, tool calls, and tokens and cost from `claude -p --output-format stream-json`.
- Every `claude -p` run is audited by `scripts/finish-run.mjs`: a run that read files outside its own folder, or used the web, is marked contaminated and left out of judging.
- MCP servers are off for every arm (`--strict-mcp-config`), and skills and subagents are blocked, so the plain arm cannot reach our library through a connector or an installed plugin.
- Judges never see the arm, the mode, word counts or file names.

## Optional fourth arm

`plain-best3` (compute-matched): run `plain` 3 times and let a fresh Claude pick the best of the 3 blind with `judge/SINGLE.md`. Use it when a round shows the agents winning, to check the win is not just extra compute. It is not built into the scripts yet: run `plain` with `--runs 3`, have a fresh Claude pick the best of the 3 with `judge/SINGLE.md`, and copy that answer into a `plain-best3` arm folder before `make-sheets.mjs sheets --pairs code:plain-best3`.
