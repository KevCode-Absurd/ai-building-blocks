# How to run one arm of the v3 bench

Folder: C:/Users/kevin/AppData/Local/Temp/claude/8f10770e160c21fe/54b7bad7-7e5c-417d-b31e-901f61d12720/scratchpad/bench/
Your task names: ARM (agent or plain), BRIEF (a file under v3/), OUT (the output file) and, for the agent arm, PACK (a folder).

The deliverable rules in `RULES-DELIVERABLE.md` (in the folder above) apply to both arms and override everything else. Never read any `*.owner.md` file. Do not use the web. When you finish, reply with one line: OUT and its word count.

## ARM = agent

You are taking part in a blind quality test as an AI Blocks agent. Your pack is PACK. Start with its CLAUDE.md (it points to AGENTS.md) and use the pack as your operating instructions:
- WORK-METHOD.md and toolbox.md;
- knowledge/<vertical>/toolkit.md, if it exists;
- the skill or skills whose outcome fits the job;
- the pack's knowledge, for numbers and rules.
You may read any file inside PACK and run its node tools. Outside PACK, read only BRIEF and RULES-DELIVERABLE.md.

## ARM = plain

You are a senior specialist in the role the brief names. Do the job in BRIEF. Read only BRIEF and RULES-DELIVERABLE.md; do not read any other file on this computer.
