// The AI agent starter pack: the template files in public/templates/agent/, zipped as one download for
// /train-your-own-ai-agent. Same files in, same bytes out. test/agent-starter-pack.test.mjs fails when the zip is stale.
// Run from site/: node scripts/build-agent-starter-pack.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

export const AGENT_FILES = ["AGENT.md", "RULES.md", "EXAMPLES.md", "PERMISSIONS.md", "CHECKS.md", "SCORECARD.md", "PROMPTS.md", "SETUP.md"];
const DIR = new URL("../public/templates/agent/", import.meta.url);
export const AGENT_ZIP = new URL("../ai-agent-starter-pack.zip", DIR);
const README = `AI agent starter pack, from AI Blocks (useaiblocks.com/train-your-own-ai-agent)

Your agent is this folder. Your AI reads it before every job.

AGENT.md        The job: what it is, who it's for, how you like it done.
RULES.md        What your agent learns from your edits, one rule at a time.
EXAMPLES.md     Good and bad examples of the job.
PERMISSIONS.md  What it may do on its own, and what needs your OK.
CHECKS.md       Yes or no checks, serious mistakes and three test jobs.
SCORECARD.md    One line per job you check, and the four levels.
PROMPTS.md      Five prompts: build, do a job, learn from an edit, grade, tidy up.
SETUP.md        Where to put the files in ChatGPT, Claude, Gemini and coding agents.

Start with prompt 1 in PROMPTS.md. The full guide is on the page above.
Never put passwords, keys, ID or bank numbers, health details or private
facts about other people in these files.
`;

export function agentPackBytes() {
  const mtime = new Date(2026, 10, 3, 5, 30, 0);
  const files = { "ai-agent-starter-pack/README.txt": [strToU8(README), { mtime }] };
  for (const name of AGENT_FILES) files[`ai-agent-starter-pack/${name}`] = [new Uint8Array(fs.readFileSync(new URL(name, DIR))), { mtime }];
  return zipSync(files, { level: 9 });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  fs.writeFileSync(AGENT_ZIP, agentPackBytes());
  console.log(`AI agent starter pack: ${fileURLToPath(AGENT_ZIP)}`);
}
