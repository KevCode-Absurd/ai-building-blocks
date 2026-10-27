// The me.md starter pack (docs/ME-FILE-PRD.md §7): the four template files in public/templates/, zipped as one
// download for /me-md. Same files in, same bytes out. test/me-starter-pack.test.mjs fails when the zip is stale.
// Run from site/: node scripts/build-me-starter-pack.mjs
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

export const STARTER_FILES = ["me.md", "me-core.txt", "me-md-prompts.md", "me-md-setup-guide.md"];
const DIR = new URL("../public/templates/", import.meta.url);
export const ZIP = new URL("me-md-starter-pack.zip", DIR);
const README = `me.md starter pack, from AI Blocks (useaiblocks.com/me-md)

me.md                 The template. Fill in what helps and delete the rest.
me-core.txt           The short core for your AI's settings box.
me-md-prompts.md      Prompts to make your me.md with your AI, and to refresh it.
me-md-setup-guide.md  Where to put it in ChatGPT, Claude, Claude Code, Gemini and Cursor.

Keep your me.md private. Never add passwords, ID or bank numbers, health details
or private facts about other people.
`;

export function starterPackBytes() {
  const mtime = new Date("2026-10-27T00:00:00Z");
  const files = { "me-md-starter-pack/README.txt": [strToU8(README), { mtime }] };
  for (const name of STARTER_FILES) files[`me-md-starter-pack/${name}`] = [new Uint8Array(fs.readFileSync(new URL(name, DIR))), { mtime }];
  return zipSync(files, { level: 9 });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  fs.writeFileSync(ZIP, starterPackBytes());
  console.log(`me.md starter pack: ${fileURLToPath(ZIP)}`);
}
