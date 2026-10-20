// Load-test helper: copies the real catalogue-items to a temp folder (outside the repo) and adds fake skills, so the site can be
// built at 2x to 3x its size:  CATALOGUE_ROOT=<folder> node scripts/build-index.mjs   (run from site/).
// Usage: node tools/make-fake-catalogue.mjs [outDir] [howMany]   (default: %TEMP%/abb-fake-catalogue, 2300). Prints the folder.
// About 70% of the fakes are "imported" skills with scripts, references, a LICENSE and a PNG; the rest are ordinary "general" ones.
// Names, tasks, ports and text are made up from a fixed seed, so every run gives the same library. Delete the folder when done.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "../site/node_modules/yaml/dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REAL = path.resolve(here, "../catalogue-items");
const OUT = path.resolve(process.argv[2] || path.join(os.tmpdir(), "abb-fake-catalogue"));
const COUNT = Number(process.argv[3] || 2300);
if (OUT.startsWith(path.resolve(here, ".."))) throw new Error("Put the fake catalogue outside the repo.");

let seed = 20261020;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const some = (a, n) => [...a].sort(() => rnd() - 0.5).slice(0, n);

// Task ids come from the site's own list, so the fakes spread over every job.
const dataTs = fs.readFileSync(path.resolve(here, "../site/src/lib/data.ts"), "utf8");
const TASKS = [...dataTs.slice(dataTs.indexOf("export const TASKS"), dataTs.indexOf("export const taskOf")).matchAll(/id: "([a-z0-9-]+)"/g)].map((m) => m[1]);
const types = YAML.parse(fs.readFileSync(path.join(REAL, "_types.yaml"), "utf8"));
const TYPES = Object.values(types).flatMap((g) => Object.keys(g));
const OLD_JOBS = ["copy", "email", "ads", "image", "video", "page", "analysis", "research", "brand", "offer", "organic", "ops"];

const VERBS = ["Write", "Check", "Plan", "Audit", "Build", "Summarise", "Review", "Draft", "Convert", "Extract", "Rewrite", "Score", "Compare", "Map", "Clean", "Test", "Design", "Outline", "Fix", "Find"];
const NOUNS = ["PDF form", "spreadsheet", "slide deck", "landing page", "API client", "test suite", "release note", "brand voice", "meeting note", "pull request", "data pipeline", "email sequence", "onboarding flow", "pricing page", "audio clip", "database schema", "support reply", "job post", "contract", "report", "chart", "dashboard", "MCP server", "web app", "style guide", "changelog", "invoice", "proposal", "podcast script", "security scan"];
const MAKERS = ["maker", "checker", "planner", "writer", "builder", "reviewer", "finder", "fixer"];
const WORDS = "the a to of and for your with from into then each it its that this are is can will be use used using when what first next skill steps file files page text notes result results check checks draft final clear short plain list item items name names task tasks input output source sources claim claims quality review ready needs asks gives makes keeps reads writes runs".split(" ");
const sentence = (n) => { const s = Array.from({ length: n }, () => pick(WORDS)).join(" "); return s.charAt(0).toUpperCase() + s.slice(1) + "."; };
const para = (n) => Array.from({ length: n }, () => sentence(8 + Math.floor(rnd() * 10))).join(" ");

// 1x1 PNG, so the zip has a real binary to carry.
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(REAL, OUT, { recursive: true, filter: (src) => !["tests", "boards"].includes(path.basename(src)) });
fs.mkdirSync(path.join(OUT, "imported"), { recursive: true });

const used = new Set(fs.readdirSync(path.join(OUT, "general")));
const write = (p, text) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
const REPOS = [["Anthropic", "anthropics/skills"], ["OpenAI", "openai/skills"]];

for (let i = 0; i < COUNT; i++) {
  const name = `${pick(VERBS)} ${pick(NOUNS)} ${pick(MAKERS)}`;
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (used.has(slug)) slug += `-${i}`;
  used.add(slug);
  const imported = rnd() < 0.7;
  const dir = path.join(OUT, imported ? "imported" : "general", slug);
  const task = pick(TASKS);
  const ports = (n) => some(TYPES, n).map((t, k) => (k && rnd() < 0.3 ? { type: t, required: false } : { type: t, required: true }));
  const summary = `${sentence(6 + Math.floor(rnd() * 8))} ${rnd() < 0.5 ? sentence(8) : ""}`.trim();
  const item = {
    slug, name, summary, category: "general", type: "skill", role: pick(["make", "check", "compress", "render", "source"]),
    job: pick(OLD_JOBS), level: pick(["beginner", "intermediate", "intermediate", "advanced", "expert"]),
    inputs: ports(1 + Math.floor(rnd() * 3)), outputs: ports(1 + Math.floor(rnd() * 2)), uses: [], origin: imported ? "imported" : "rebuilt", version: "1.0.0",
  };
  if (imported) { const [by, repo] = pick(REPOS); item.source = { by, repo, url: `https://github.com/${repo}/tree/main/skills/${slug}`, licence: pick(["Apache-2.0", "MIT"]) }; }
  write(path.join(dir, "item.yaml"), YAML.stringify(item));
  write(path.join(dir, "SKILL.md"), `---\nname: ${slug}\ndescription: ${summary}\n---\n\n# ${name}\n\n${para(4)}\n\n## Steps\n\n${Array.from({ length: 6 }, (_, k) => `${k + 1}. ${sentence(12)}`).join("\n")}\n\n## Checks\n\n${Array.from({ length: 4 }, () => `- ${sentence(10)}`).join("\n")}\n\n${para(6)}\n`);
  if (imported) {
    write(path.join(dir, "LICENSE.txt"), "Apache License 2.0 (fake, for a load test)\n");
    if (rnd() < 0.6) write(path.join(dir, "scripts", "run.py"), `# fake script\nprint("${slug}")\n`);
    if (rnd() < 0.5) write(path.join(dir, "references", "guide.md"), `# Guide\n\n${para(5)}\n`);
    if (rnd() < 0.3) { fs.mkdirSync(path.join(dir, "assets"), { recursive: true }); fs.writeFileSync(path.join(dir, "assets", "logo.png"), PNG); }
  }
  // About 60% have a page; the rest show the plain skill, as freshly imported ones would.
  if (rnd() < 0.6) {
    const page = {
      name, summary, job: task, headline: rnd() < 0.5 ? name : `${sentence(7)}`.replace(/\.$/, ""), subhead: para(2), explain: para(3),
      when: [sentence(9), sentence(9)], you_give: [sentence(5), sentence(5)], you_get: [sentence(6), sentence(6)], how_to_use: [sentence(7), sentence(7), sentence(7)],
      how_it_works: [1, 2, 3].map((k) => ({ title: `Step ${k}`, text: sentence(10) })), output_shape: `RESULT  <${sentence(4)}>`,
      tweaks: [], judge: [sentence(8)], improve: [sentence(8)], terms: [],
      thinking: pick(["low", "medium", "high"]),
    };
    write(path.join(dir, "page.yaml"), YAML.stringify(page));
  }
}
console.log(OUT);
