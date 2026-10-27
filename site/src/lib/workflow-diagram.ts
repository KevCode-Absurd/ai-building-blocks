// A workflow as a picture an AI can show its user: a Mermaid flowchart (steps in order, each hand-off labelled with what
// is passed on, the user's own inputs as start nodes, broken hand-offs red and dashed, suggested steps green and
// dashed) and the same thing as a plain text outline for hosts that cannot draw Mermaid. Plain code, no AI: the same
// workflow always gives the same diagram. Used by the public MCP and API (server/public-catalogue.ts).
import type { Chain } from "./step-graph.ts";
import { portLabel } from "./port-label.ts";

export type DiagramStep = { id: string; title: string };
/** A step the check suggests adding: drawn dashed in front of the step it feeds. */
export type DiagramAddition = { before: number; title: string; makes: string[] };
export type Diagram = { format: "mermaid"; mermaid: string; legend: string; outline?: string };

const TITLE_MAX = 48, LABEL_MAX = 40, MANY = 12;
const LEGEND = "Solid arrow: required hand-off. Dotted: optional. Red dashed: missing or out of order. Green dashed: a suggested step.";

// Mermaid entity codes (#34; is a double quote) for every character that could end a label or a statement.
const ESCAPES: Record<string, string> = { "#": "#35;", '"': "#34;", ";": "#59;", "<": "#60;", ">": "#62;", "[": "#91;", "]": "#93;", "{": "#123;", "}": "#125;", "|": "#124;", "`": "'" };
/** Text safe inside a quoted Mermaid label: one line, short, with quotes, brackets, pipes and semicolons as entity codes. */
export function mermaidText(text: string, max = TITLE_MAX): string {
  let s = String(text ?? "").replace(/\s+/g, " ").trim();
  if (s.length > max) s = s.slice(0, max - 1).trimEnd() + "…";
  return s.replace(/[#";<>[\]{}|`]/g, ch => ESCAPES[ch]);
}

const join = (types: string[], label: (t: string) => string) => types.map(label).join(" + ");

/**
 * Draws an ordered workflow from its hand-off check (step-graph.ts chain). `inputs` names what the user gives each
 * step (types the check marked "user"); `additions` are suggested steps to draw dashed. `detailed` adds the outline.
 */
export function workflowDiagram(title: string, steps: DiagramStep[], check: Chain, { additions = [], detailed = false, label = portLabel }: { additions?: DiagramAddition[]; detailed?: boolean; label?: (t: string) => string } = {}): Diagram {
  const many = steps.length > MANY;
  const lines: string[] = [`flowchart ${many ? "TD" : "LR"}`, `  %% ${mermaidText(title, 80)}`, `  %% Legend: ${LEGEND}`];
  const links: string[] = [], styles: { index: number; kind: "bad" | "add" }[] = [];
  const link = (from: string, arrow: "-->" | "-.->" | "~~~", to: string, text = "", kind?: "bad" | "add") => {
    if (kind) styles.push({ index: links.length, kind });
    links.push(`  ${from} ${arrow}${text ? `|"${mermaidText(text, LABEL_MAX)}"|` : ""} ${to}`);
  };
  // The user's own inputs: one start node per type, linked to every step that takes it.
  const given = new Map<string, number[]>();
  check.steps.forEach((s, i) => { for (const p of s.inputs) if (p.status === "user") given.set(p.type, [...(given.get(p.type) ?? []), i]); });
  [...given.keys()].forEach((type, k) => lines.push(`  u${k + 1}(["You give: ${mermaidText(label(type), LABEL_MAX)}"]):::user`));
  steps.forEach((s, i) => lines.push(`  s${i + 1}["${i + 1}. ${mermaidText(s.title)}"]`));
  [...given.entries()].forEach(([, to], k) => to.forEach(i => link(`u${k + 1}`, "-->", `s${i + 1}`)));
  // Hand-offs between steps: one arrow per pair of steps, labelled with every type passed; dotted when all are optional.
  const pairs = new Map<string, { from: number; to: number; types: string[]; required: boolean }>();
  check.steps.forEach((s, i) => {
    for (const p of s.inputs) {
      if (p.status !== "from_step" || p.from === undefined) continue;
      if (many && !p.required) continue; // Long workflows keep the picture small: required hand-offs only.
      const key = `${p.from}>${i}`, pair = pairs.get(key) ?? { from: p.from, to: i, types: [], required: false };
      pair.types.push(p.type); pair.required ||= p.required; pairs.set(key, pair);
    }
  });
  const incoming = new Set([...pairs.values()].map(p => p.to));
  for (const p of [...pairs.values()].sort((a, b) => a.to - b.to || a.from - b.from)) link(`s${p.from + 1}`, p.required ? "-->" : "-.->", `s${p.to + 1}`, join(p.types, label));
  // Keep the steps in their order where nothing is handed over between neighbours (an invisible link).
  for (let i = 1; i < steps.length; i++) if (!pairs.has(`${i - 1}>${i}`) && !incoming.has(i)) link(`s${i}`, "~~~", `s${i + 1}`);
  // Broken hand-offs: a missing input gets a red "Missing" node; an input only a later step makes gets a red arrow back.
  let missing = 0;
  check.steps.forEach((s, i) => {
    for (const p of s.inputs) {
      if (p.status === "missing") { missing++; lines.push(`  m${missing}{{"Missing: ${mermaidText(label(p.type), LABEL_MAX)}"}}:::bad`); link(`m${missing}`, "-.->", `s${i + 1}`, label(p.type), "bad"); }
      if (p.status === "out_of_order" && p.made_later_by !== undefined) link(`s${p.made_later_by + 1}`, "-.->", `s${i + 1}`, `${label(p.type)}, too late`, "bad");
    }
  });
  additions.forEach((a, k) => {
    lines.push(`  a${k + 1}["+ Add: ${mermaidText(a.title)}"]:::add`);
    link(`a${k + 1}`, "-.->", `s${a.before + 1}`, join(a.makes, label), "add");
  });
  const problems = missing + styles.length > 0 || additions.length > 0;
  if (problems) lines.push(`  legend["${mermaidText(LEGEND, 160)}"]:::note`);
  lines.push(...links);
  lines.push("  classDef user fill:#eef4ff,stroke:#5b7bd5,color:#1d2b4f", "  classDef bad fill:#fff0f0,stroke:#d33,stroke-dasharray:5 4,color:#8a1010",
    "  classDef add fill:#effbf2,stroke:#2a9d4b,stroke-dasharray:5 4,color:#14532d", "  classDef note fill:none,stroke:none,color:#666");
  for (const kind of ["bad", "add"] as const) {
    const at = styles.filter(s => s.kind === kind).map(s => s.index);
    if (at.length) lines.push(`  linkStyle ${at.join(",")} stroke:${kind === "bad" ? "#d33" : "#2a9d4b"},stroke-width:2px,stroke-dasharray:5 4`);
  }
  return { format: "mermaid", mermaid: lines.join("\n"), legend: LEGEND, ...(detailed ? { outline: workflowOutline(title, steps, check, additions, label) } : {}) };
}

/** The same workflow as plain text: numbered steps, what each takes and from where, what it hands on, and problems. */
export function workflowOutline(title: string, steps: DiagramStep[], check: Chain, additions: DiagramAddition[] = [], label = portLabel): string {
  const out = [`${title}: ${steps.length} step${steps.length === 1 ? "" : "s"}`];
  const handsTo = steps.map(() => new Map<string, number[]>());
  check.steps.forEach((s, i) => { for (const p of s.inputs) if (p.status === "from_step" && p.from !== undefined) handsTo[p.from].set(p.type, [...(handsTo[p.from].get(p.type) ?? []), i + 1]); });
  steps.forEach((step, i) => {
    out.push(`${i + 1}. ${step.title}`);
    const takes = (check.steps[i]?.inputs ?? []).map(p => p.status === "from_step" ? `${label(p.type)} from step ${p.from! + 1}${p.required ? "" : " (optional)"}`
      : p.status === "user" ? `${label(p.type)} from you` : p.status === "missing" ? `${label(p.type)}: MISSING, no earlier step makes it`
      : `${label(p.type)}: OUT OF ORDER, only step ${p.made_later_by! + 1} makes it`);
    out.push(`   takes: ${takes.length ? takes.join("; ") : "nothing from earlier steps"}`);
    if (handsTo[i].size) out.push(`   hands on: ${[...handsTo[i]].map(([t, to]) => `${label(t)} to step ${to.join(", ")}`).join("; ")}`);
  });
  for (const a of additions) out.push(`+ Suggested: add ${a.title} before step ${a.before + 1} (makes ${a.makes.map(label).join(", ")})`);
  out.push(check.problems.length ? `Problems: ${check.problems.length}` : "Problems: none");
  return out.join("\n");
}
