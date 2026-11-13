// Build one blind packet per judge: each job shows the brief and two outputs in a per-judge random order.
// Scrubs anything that could reveal the arm. Writes packets to judge/, the key to key/key.json.
const fs = require("fs"), path = require("path");
const B = __dirname, JOBS = Array.from({ length: 12 }, (_, i) => `J${String(i + 1).padStart(2, "0")}`);
const JUDGES = 10;
let seed = 20261113;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const scrub = t => t
  .replace(/\s*\[(?:[A-Z]{3}-\d{4}(?:\s*,\s*)?)+\]/g, "")
  .replace(/\s*\((?:[A-Z]{3}-\d{4}(?:,\s*)?)+\)/g, "")
  .replace(/\bAI Blocks\b/gi, "")
  .replace(/[`']?[\w./-]*(SKILL|toolkit|baseline|WORK-METHOD|toolbox)\.md[`']?/gi, "")
  .replace(/—|–/g, ", ");
const words = t => (t.match(/\S+/g) || []).length;
const outs = {}, report = [];
for (const j of JOBS) {
  outs[j] = {};
  for (const arm of ["agent", "plain"]) {
    const p = path.join(B, "out", `${j}-${arm}.md`);
    if (!fs.existsSync(p)) { console.log("MISSING", p); process.exitCode = 1; continue; }
    const raw = fs.readFileSync(p, "utf8"), clean = scrub(raw);
    outs[j][arm] = clean;
    report.push(`${j} ${arm} words=${words(clean)} scrubbed=${raw.length - clean.length} leaks=${(clean.match(/[A-Z]{3}-\d{4}|skill|toolkit|card id|pack\b/gi) || []).join(",")}`);
  }
}
console.log(report.join("\n"));
if (process.exitCode) process.exit();
const lenses = [
  "a founder who runs a profitable DTC store doing $5M a year and spends their own money",
  "the head of performance marketing at a fast-growing DTC brand",
  "a retention and lifecycle marketing lead",
  "a creative director who has shipped thousands of paid social ads",
  "a CFO-minded operator who checks every number and cares about contribution margin",
  "an India D2C operator who knows COD, RTO, WhatsApp and Indian consumers well",
  "a US DTC consultant who audits agencies for brand owners",
  "a conversion rate specialist who runs A/B tests for stores",
  "a senior direct response copywriter",
  "a generalist e-commerce agency strategist who must hand this work to a client tomorrow",
];
fs.mkdirSync(path.join(B, "key"), { recursive: true });
const key = {};
for (let k = 1; k <= JUDGES; k++) {
  const id = `JD${String(k).padStart(2, "0")}`; key[id] = {};
  let md = `# Judge packet ${id}\n\nYou judge as ${lenses[k - 1]}.\n\n`;
  for (const j of JOBS) {
    const flip = rnd() < 0.5;
    const [o1, o2] = flip ? ["plain", "agent"] : ["agent", "plain"];
    key[id][j] = { "1": o1, "2": o2 };
    md += `\n\n---\n\n# ${j}\n\n## The brief\n\n${fs.readFileSync(path.join(B, "briefs", `${j}.md`), "utf8").trim()}\n\n## Output 1\n\n${outs[j][o1].trim()}\n\n## Output 2\n\n${outs[j][o2].trim()}\n`;
  }
  fs.writeFileSync(path.join(B, "judge", `${id}.md`), md);
}
fs.writeFileSync(path.join(B, "key", "key.json"), JSON.stringify(key, null, 1));
console.log("packets written");
