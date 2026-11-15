// Journey maps: what a senior expert carries in their head for one kind of job, as data the guide follows.
// One JSON file per job family in knowledge/<vertical>/journeys/<id>.json (schema "ai-blocks-journey/1", see SCHEMA.md there).
// This module validates them and renders each to the Markdown page an agent reads in its pack (journeys/<id>.md).

export interface JOption { label: string; pro?: string; con?: string; when?: string }
export interface JQuestion { id: string; ask: string; why?: string; options?: JOption[]; default?: string; skip_if?: string[]; settle_with_data?: string }
export interface JDecision { id: string; ask: string; options: JOption[]; recommend?: string }
export interface Journey {
  schema: "ai-blocks-journey/1"; id: string; name: string; vertical: string; asked_as?: string[]; lead_agents?: string[];
  outcome: string; first_principles?: string[];
  goal?: { questions?: JQuestion[] };
  gather?: {
    brand_brain?: "required" | "helpful" | "not_needed";
    sources?: { what: string; why?: string; where?: string; ask_if_missing?: string; fallback?: string }[];
    setup?: { need: string; why?: string; check?: string; options?: JOption[]; default?: string }[];
    data_map?: { question: string; data: string; where?: string; tool?: string; if_missing?: string }[];
  };
  diagnose?: { tools?: string[]; look_for?: string[]; hypothesis_patterns?: { pattern: string; evidence?: string; bet?: string }[] };
  choose?: { decisions?: JDecision[] };
  make?: { pieces?: { piece: string; skill?: string; when?: string; variety?: string }[]; formats?: string | string[]; rules?: string[] };
  check?: { preflight?: string[]; checks?: string[]; senior_review?: string[] };
  knowledge?: Record<string, { modules?: string[]; ask?: string[] } | string[] | undefined> & { never?: string[] };
  handover?: { files?: string[]; next_moves?: string[] };
}

export interface JourneyContext { skills: Set<string>; modules: Set<string>; agents: Set<string>; formats?: Set<string> }

/** Problems that make a journey unsafe to ship. An empty list means it is valid. */
export function validateJourney(j: Journey, ctx: JourneyContext): string[] {
  const p: string[] = [];
  const at = `journey ${j.id ?? "?"}`;
  if (j.schema !== "ai-blocks-journey/1") p.push(`${at}: schema must be ai-blocks-journey/1`);
  for (const k of ["id", "name", "vertical", "outcome"] as const) if (!j[k]) p.push(`${at}: missing ${k}`);
  const qs = j.goal?.questions ?? [];
  if (qs.length > 4) p.push(`${at}: ${qs.length} goal questions (at most 4)`);
  for (const q of qs) {
    if (!q.id || !q.ask) p.push(`${at}: a goal question lacks id or ask`);
    if (!q.default) p.push(`${at}: question ${q.id} has no default`);
  }
  const ds = j.choose?.decisions ?? [];
  if (ds.length > 2) p.push(`${at}: ${ds.length} decisions (at most 2)`);
  for (const d of ds) if (!d.options || d.options.length < 2) p.push(`${at}: decision ${d.id} needs 2+ options`);
  for (const x of j.make?.pieces ?? []) if (x.skill && !ctx.skills.has(x.skill)) p.push(`${at}: unknown skill ${x.skill}`);
  for (const a of j.lead_agents ?? []) if (!ctx.agents.has(a)) p.push(`${at}: unknown agent ${a}`);
  for (const [stage, v] of Object.entries(j.knowledge ?? {})) {
    if (!v || Array.isArray(v)) continue;
    for (const m of v.modules ?? []) if (!ctx.modules.has(m)) p.push(`${at}: knowledge.${stage} unknown module ${m}`);
  }
  if (ctx.formats && Array.isArray(j.make?.formats)) for (const f of j.make!.formats as string[]) if (!ctx.formats.has(f)) p.push(`${at}: unknown format ${f}`);
  return p;
}

const opts = (o?: JOption[]) => (o ?? []).map((x, i) => `${String.fromCharCode(97 + i)}) ${x.label}${x.pro ? `: + ${x.pro}` : ""}${x.con ? `; − ${x.con}` : ""}${x.when ? ` (when: ${x.when})` : ""}`).join("  \n   ");
const list = (xs?: string[]) => (xs ?? []).map(x => `- ${x}`);

/** The page an agent reads: the stages in order, each with what to do, ask, use and check. */
export function journeyMarkdown(j: Journey): string {
  const k = j.knowledge ?? {};
  const kline = (stage: string) => { const v = k[stage]; if (!v || Array.isArray(v)) return []; return [`- Library at this stage: ${v.modules?.length ? `modules ${v.modules.join(", ")}; ` : ""}${(v.ask ?? []).map(a => `"${a}"`).join("; ")}`]; };
  return [
    `# Journey: ${j.name}`, "",
    `**Done looks like:** ${j.outcome}`, "",
    ...(j.asked_as?.length ? [`Asked as: ${j.asked_as.map(a => `"${a}"`).join(", ")}.`, ""] : []),
    ...(j.lead_agents?.length ? [`Lead agents: ${j.lead_agents.join(", ")}.`, ""] : []),
    ...(j.first_principles?.length ? ["## How an expert thinks about this job", "", ...list(j.first_principles), ""] : []),
    "## 1. Goal", "",
    ...(j.goal?.questions ?? []).flatMap(q => [
      `- **${q.ask}**${q.why ? ` Why: ${q.why}` : ""}`,
      ...(q.options?.length ? [`   ${opts(q.options)}`] : []),
      `   Default: ${q.default ?? "you decide"}.${q.settle_with_data ? ` Settle with data first: ${q.settle_with_data}` : ""}${q.skip_if?.length ? ` Skip if: ${q.skip_if.join("; ")}.` : ""}`,
    ]), "",
    "## 2. Gather", "",
    `Org context for ${j.name.toLowerCase()}: ${j.gather?.brand_brain ?? "helpful"}.`, "",
    ...((j.gather?.setup ?? []).length ? ["**Setup check:**", ...(j.gather!.setup!).flatMap(s => [`- ${s.need}${s.why ? `: ${s.why}` : ""}${s.check ? ` Check: ${s.check}` : ""}`, ...(s.options?.length ? [`   ${opts(s.options)}`] : []), ...(s.default ? [`   Default: ${s.default}.`] : [])]), ""] : []),
    ...((j.gather?.sources ?? []).length ? ["**Sources:**", ...(j.gather!.sources!).map(s => `- ${s.what}${s.why ? ` (${s.why})` : ""}${s.where ? `. Where: ${s.where}` : ""}${s.ask_if_missing ? `. Ask: "${s.ask_if_missing}"` : ""}${s.fallback ? `. Fallback: ${s.fallback}` : ""}.`), ""] : []),
    ...((j.gather?.data_map ?? []).length ? ["**Data map (question → data → where):**", "", "| Question | Data | Where | Tool | If missing |", "|---|---|---|---|---|",
      ...(j.gather!.data_map!).map(d => `| ${d.question} | ${d.data} | ${d.where ?? ""} | ${d.tool ? `\`${d.tool}\`` : ""} | ${d.if_missing ?? ""} |`), ""] : []),
    "## 3. Diagnose", "",
    ...((j.diagnose?.tools ?? []).length ? ["Run:", ...(j.diagnose!.tools!).map(t => `- \`${t}\``), ""] : []),
    ...((j.diagnose?.look_for ?? []).length ? ["Look for:", ...list(j.diagnose!.look_for), ""] : []),
    ...((j.diagnose?.hypothesis_patterns ?? []).length ? ["Hypothesis patterns (write 2 to 4 for this store: gap, evidence, bet; save them in `context/hypotheses.json`):", ...(j.diagnose!.hypothesis_patterns!).map(h => `- **${h.pattern}.** Evidence: ${h.evidence ?? "-"}. Bet: ${h.bet ?? "-"}.`), ""] : []),
    ...kline("diagnose"), "",
    "## 4. Choose", "",
    ...(j.choose?.decisions ?? []).flatMap(d => [`- **${d.ask}**`, `   ${opts(d.options)}`, ...(d.recommend ? [`   Recommend: ${d.recommend}`] : [])]), "",
    "## 5. Make and check", "",
    ...(j.make?.pieces ?? []).map(x => `- ${x.piece}${x.skill ? `: skill \`${x.skill}\`` : ""}${x.when ? ` (${x.when})` : ""}${x.variety ? `. Variety: ${x.variety}` : ""}.`),
    ...(j.make?.formats ? [`- Formats: ${Array.isArray(j.make.formats) ? j.make.formats.join(", ") : j.make.formats} (see \`knowledge/ecommerce/formats.md\`).`] : []),
    ...((j.make?.rules ?? []).length ? ["", "Rules:", ...list(j.make!.rules)] : []), "",
    ...kline("make"),
    ...((j.check?.preflight ?? []).length ? ["Preflight:", ...(j.check!.preflight!).map(t => `- \`${t}\``), ""] : []),
    ...((j.check?.checks ?? []).length ? ["Checks:", ...(j.check!.checks!).map(t => `- ${/^node /.test(t) ? `\`${t}\`` : t}`), ""] : []),
    ...((j.check?.senior_review ?? []).length ? ["Senior review before hand-over:", ...list(j.check!.senior_review), ""] : []),
    ...kline("check"), "",
    "## 6. Hand over and next", "",
    ...list(j.handover?.files),
    ...((j.handover?.next_moves ?? []).length ? ["", "Offer 2 or 3 of these next:", ...list(j.handover!.next_moves)] : []), "",
    ...((k.never as string[] | undefined)?.length ? ["Never from the library: " + (k.never as string[]).join(" "), ""] : []),
  ].join("\n").replace(/\n{3,}/g, "\n\n");
}

/** journeys/README.md: which map to open for which request. */
export function journeyIndexMarkdown(js: Journey[]): string {
  return [
    "# Journey maps", "",
    "Open the one map that fits the owner's ask, then follow it with `tools/quality/GUIDE.md`: six stages, calm progress, the question rubric; skip anything the brief, files, org context or data already answer. Where a map says the org context is required, build or load it before making anything (`tools/quality/FOUNDATION.md`). If the ask spans two (ads plus the page they point to), lead with the one closest to the result they want and borrow the other's checks.", "",
    "| Map | Use for | Asked as |", "|---|---|---|",
    ...js.map(j => `| [${j.id}](${j.id}.md) | ${j.name} | ${(j.asked_as ?? []).slice(0, 3).map(a => `"${a}"`).join(", ")} |`), "",
  ].join("\n");
}
