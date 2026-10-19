// Builds every mini tool five ways from its one formula file, and checks each way against the worked examples.
// If any way disagrees, nothing is written and the build fails: one formula, five ways, they can't disagree.
//
//   node tools/build-mini-tool.mjs                 build all of them into site/public/mini-tools/
//   node tools/build-mini-tool.mjs discount-calculator
//   node tools/build-mini-tool.mjs --check         check only, write nothing
//   node tools/build-mini-tool.mjs --out <dir>
//
// Per tool it writes: <slug>.html (the download, works offline), embed.html (for an iframe), <slug>.xlsx (the spreadsheet),
// SKILL.md, prompt.txt, <slug>.py, save-it-in-your-ai.md and <slug>-skill.zip (the AI way). The site page is the fifth.
// It also writes tools.json: every tool and its worked examples as plain data.
// The zip library comes from the site's own dependencies (fflate), so this needs no install of its own.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { TOOLS, EXAMPLES, SITE } from "../mini-tools/index.mjs";
import { answerLines } from "../mini-tools/engine.mjs";
import { buildXlsx } from "../mini-tools/xlsx.mjs";
import { buildGuide, buildPrompt, buildPython, buildSkill } from "../mini-tools/skill.mjs";
import { buildHtml } from "../mini-tools/standalone/page.mjs";
import { catalogue, checkFormula, checkHtml, checkPython, checkStructure, checkXlsx, findPython } from "../mini-tools/check.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fflate = createRequire(path.join(REPO, "site", "package.json"))("fflate");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const outAt = args.indexOf("--out");
const OUT = outAt >= 0 ? path.resolve(args[outAt + 1]) : path.join(REPO, "site", "public", "mini-tools");
const only = args.filter((a, k) => !a.startsWith("--") && args[k - 1] !== "--out");

const engineSrc = fs.readFileSync(path.join(REPO, "mini-tools", "engine.mjs"), "utf8");
const uiSrc = fs.readFileSync(path.join(REPO, "mini-tools", "standalone", "ui.js"), "utf8");
const lib = catalogue(REPO);
const python = findPython();

/** The tool as the pages carry it: next steps get the listing's current name and address. */
const forPages = (tool) => ({ ...tool, next: (tool.next ?? []).map((n) => ({ ...n, title: lib[n.slug]?.name, path: lib[n.slug]?.path })) });

/** Builds one tool's files in memory and checks them all. */
export function buildTool(tool) {
  const examples = EXAMPLES[tool.slug];
  const problems = [...checkStructure(tool, examples, lib)];
  if (problems.length) return { problems };
  const page = forPages(tool);
  const files = {
    [`${tool.slug}.html`]: buildHtml(page, { engineSrc, uiSrc, site: SITE }),
    "embed.html": buildHtml(page, { engineSrc, uiSrc, site: SITE, embed: true }),
    [`${tool.slug}.xlsx`]: buildXlsx(tool, { site: SITE }, fflate),
    "SKILL.md": buildSkill(tool, SITE),
    "prompt.txt": buildPrompt(tool, SITE),
    [`${tool.slug}.py`]: buildPython(tool, SITE),
    "save-it-in-your-ai.md": buildGuide(tool),
  };
  const mtime = new Date("2026-01-01T00:00:00Z");
  files[`${tool.slug}-skill.zip`] = fflate.zipSync({ [`${tool.slug}/SKILL.md`]: [fflate.strToU8(files["SKILL.md"]), { mtime }] });
  return { files, examples, problems };
}

export async function checkTool(tool, built) {
  const { files, examples } = built;
  const p = [];
  p.push(...(await checkFormula(tool, examples, answerLines)));
  p.push(...checkHtml(tool, examples, files[`${tool.slug}.html`], "download"));
  p.push(...checkHtml(tool, examples, files["embed.html"], "embed"));
  if (!files["embed.html"].includes(`${SITE}/tools/${tool.slug}`)) p.push("embed: no credit link back to the site");
  p.push(...checkXlsx(tool, examples, files[`${tool.slug}.xlsx`], fflate));
  const py = checkPython(tool, examples, files[`${tool.slug}.py`], python);
  p.push(...py.problems);
  if (!files["SKILL.md"].startsWith(`---\nname: ${tool.slug}\ndescription: `)) p.push("skill: SKILL.md front matter is wrong");
  return { problems: p, pythonSkipped: py.skipped };
}

async function main() {
  const tools = only.length ? TOOLS.filter((t) => only.includes(t.slug)) : TOOLS;
  if (only.length && tools.length !== only.length) { console.error(`Unknown tool: ${only.filter((s) => !TOOLS.some((t) => t.slug === s)).join(", ")}`); process.exit(1); }
  let failed = false;
  const ready = [];
  for (const tool of tools) {
    const built = buildTool(tool);
    const res = built.problems.length ? { problems: built.problems } : await checkTool(tool, built);
    if (res.problems.length) {
      failed = true;
      console.error(`✗ ${tool.slug}\n${res.problems.map((x) => `  ${x}`).join("\n")}`);
    } else {
      console.log(`✓ ${tool.slug}: ${EXAMPLES[tool.slug].length} worked examples match on the formula, the download, the embed, the spreadsheet${res.pythonSkipped ? " (Python not found, so the AI code wasn't run)" : " and the AI code"}`);
      ready.push([tool, built.files]);
    }
  }
  if (failed) { console.error("Mini tools: a way disagrees with the worked examples, so nothing was written."); process.exit(1); }
  if (checkOnly) return;
  for (const [tool, files] of ready) {
    const dir = path.join(OUT, tool.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), body);
  }
  // Every tool and its worked examples as plain data, for anything that can't load the formula files (the end-to-end tests).
  if (!only.length) fs.writeFileSync(path.join(OUT, "tools.json"), JSON.stringify({ tools: TOOLS, examples: EXAMPLES }));
  console.log(`Mini tools: wrote ${ready.length} to ${path.relative(process.cwd(), OUT) || "."}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
