// Fake model replies for the studio (MODEL_MODE=fake): deterministic, built from what the expert actually wrote,
// so the local demo and staging work end to end with believable output.
import { registerFake } from "../../core/models.ts";
import type { AgentPackage, AgentStep } from "../../core/types.ts";
import { readData, type CompileInput, type FollowUpInput, type PlaybookInput, type SuggestInput } from "./prompts.ts";

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 3).trimEnd()}...`);
const sentence = (s: string) => cap(s.trim()).replace(/[\s.!?]*$/, ".");

/** Lines or sentences of an answer, without list markers. */
function items(text: string): string[] {
  const lines = text.split(/\n+/).map(l => l.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, "").trim()).filter(Boolean);
  const parts = lines.length > 1 ? lines : text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  return parts.map(p => p.replace(/\s+/g, " "));
}

export function fakeFollowUp(input: FollowUpInput): { follow_up: string | null } {
  if (words(input.answer) >= 40) return { follow_up: null };
  return { follow_up: input.hint ?? "Can you give one concrete example of that?" };
}

export function fakePlaybook(input: PlaybookInput): { playbook: string } {
  const by = new Map(input.answers.map(a => [a.question_id, a]));
  const full = (id: string) => {
    const a = by.get(id);
    if (!a) return "";
    return [a.answer, a.follow_up_answer].filter(Boolean).join("\n\n");
  };
  const listOf = (id: string) => items(full(id)).map(s => `- ${s}`).join("\n") || "- (Add more here.)";
  const steps = items(by.get("method")?.answer ?? "").map((s, i) => `${i + 1}. ${s}`).join("\n") || "1. (Add more here.)";
  const extra = input.answers.filter(a => a.question_id.startsWith("rubric_") || a.question_id === "counterfactual");
  const playbook = [
    `# How I do ${input.job_type.title.toLowerCase()}`,
    `By ${input.expert_name}. The finished work: ${input.job_type.deliverable}`,
    "## Who this is for", full("case") || "(Add more here.)",
    "## My method", steps,
    "## My quality bar", listOf("quality_bar"),
    "## Great work and terrible work", full("great_terrible") || "(Add more here.)",
    "## Red lines", listOf("red_lines"),
    "## When information is missing", full("missing_info") || "(Add more here.)",
    "## Judgement calls", full("decisions") || "(Add more here.)",
    ...extra.map(a => `- ${a.question.replace(/\s+/g, " ")}\n  ${a.answer.replace(/\s+/g, " ")}`),
  ].join("\n\n");
  return { playbook };
}

/** The section of a markdown playbook under a "## Heading", as list items. */
function section(md: string, heading: string): string[] {
  const lines = md.split("\n");
  const start = lines.findIndex(l => new RegExp(`^##\\s+${heading}\\s*$`, "i").test(l.trim()));
  if (start < 0) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(l => /^#{1,2}\s/.test(l));
  return items((end < 0 ? rest : rest.slice(0, end)).join("\n")).filter(s => !/^\(Add more here\.\)$/.test(s));
}

export function fakePackage(input: CompileInput): AgentPackage {
  const jt = input.job_type;
  const slug = input.agent_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "expert-agent";
  const redLines = section(input.playbook, "Red lines");
  const quality = section(input.playbook, "My quality bar");
  const marks = input.marks.map(m => `- Never ship text like: "${clip(m.passage.replace(/\s+/g, " "), 200)}"\n  Why: ${m.reason}`).join("\n");
  const rulesList = (rules: string[]) => rules.map(r => `- ${r}`).join("\n");

  const style_rules = [
    "Use only facts from the brief. Never invent numbers, names, reviews or results.",
    "Write for the reader named in the brief, in plain, specific words.",
    ...input.marks.map(m => clip(sentence(`Avoid what plain AI did here: ${m.reason}`), 400)),
  ];
  const banned_patterns = input.marks.map(m => clip(m.passage.replace(/\s+/g, " ").trim(), 200)).filter(p => p.length >= 3);
  const checklist = [
    ...quality.slice(0, 10).map(q => clip(sentence(q), 400)),
    ...redLines.slice(0, 5).map(r => clip(sentence(`Red line kept: ${r}`), 400)),
    ...jt.rubric.filter(c => c.critical).map(c => clip(c.text, 400)),
  ];
  if (!checklist.length) checklist.push("The draft answers everything the brief asks for.");

  const steps: AgentStep[] = [
    {
      id: "plan", title: "Plan the work", tier: "standard", output: "markdown", max_tokens: 1500,
      prompt: "Follow the method in your instructions. Read the request and the spec, then write a short plan: who the reader is, the one goal, "
        + "the structure you will use, and the facts you may use. List any missing facts and say how you will handle each one, as your instructions describe.\n\n"
        + "Request:\n{{request}}\n\nSpec:\n{{spec}}\n\nThe buyer's checklist:\n{{rubric}}\n\nBrand notes:\n{{brand}}",
    },
    {
      id: "draft", title: "Write the draft", tier: "standard", output: "markdown", max_tokens: 6000,
      prompt: `Write the full ${jt.title.toLowerCase()} from this plan. The buyer gets: ${jt.deliverable}\n`
        + "Follow your style rules. Use only facts from the request and spec.\n\n"
        + "Plan:\n{{step:plan}}\n\nRequest:\n{{request}}\n\nSpec:\n{{spec}}\n\n"
        + "Earlier version, if the buyer asked for changes:\n{{previous}}\n\nChanges asked for:\n{{feedback}}",
    },
    {
      // The studio appends the style rules, banned patterns and checklist to the instructions (package.ts withRuleBlock).
      id: "finish", title: "Check and finish", tier: "standard", output: "markdown", max_tokens: 6000,
      prompt: "Check the draft against the rules at the end of your instructions and the buyer's checklist below. Fix each problem. "
        + "Return only the finished draft, with no notes about your checks.\n\n"
        + "The buyer's checklist:\n{{rubric}}\n\nDraft:\n{{step:draft}}",
    },
  ];

  const lessons = input.examples.map(e => `## ${e.title}\nWritten for: ${e.audience}\n${e.notes ? `Why it worked: ${e.notes}` : "Why it worked: (not given)"}`).join("\n\n");
  const files = [
    { path: "playbook.md", content: clip(input.playbook, 30000) },
    { path: "red-lines.md", content: clip(`# Red lines\n\n${rulesList(redLines) || "- (none given)"}\n\n# Plain AI habits to avoid\n\n${marks || "- (none marked)"}`, 30000) },
    { path: "what-good-looks-like.md", content: clip(`# What good looks like\n\nLessons from ${input.expert_name}'s past work. The work itself stays private.\n\n${lessons || "(No examples yet.)"}`, 30000) },
  ];

  // Approved rules reach the instructions through the rules block the studio appends after the build.
  const instructions = [
    `You are ${input.agent_name}. You work exactly the way ${input.expert_name} does, following the playbook below.`,
    input.playbook.trim(),
    "## Plain AI habits I never ship",
    marks || "- (none marked)",
  ].join("\n\n");

  return {
    schema: "ai-blocks-agent/1",
    job_type_id: jt.id,
    name: input.agent_name,
    skill: {
      name: slug,
      description: clip(`Writes ${jt.title.toLowerCase()} the way ${input.expert_name} does. ${jt.deliverable}`, 1000),
      instructions: clip(instructions, 40000),
    },
    files,
    steps,
    style_rules: style_rules.slice(0, 40),
    banned_patterns: banned_patterns.slice(0, 40),
    checklist: checklist.slice(0, 40),
  };
}

export function fakeSuggestions(input: SuggestInput): { suggestions: { target: "style_rules" | "checklist"; text: string; why: string }[] } {
  const reason = input.reason.replace(/\s+/g, " ").trim();
  const target: "style_rules" | "checklist" = /\b(add|added|adds|missing|forgot|include|includes|mention|always|need|needs|check)\b/i.test(reason) ? "checklist" : "style_rules";
  const out = [{ target, text: clip(sentence(reason), 300), why: clip(`From your reason: "${reason}"`, 300) }];
  const cut = input.removed.map(l => l.replace(/^(?:[-*>#]+|\d+[.)])\s*/, "").trim()).find(l => l.length >= 12);
  if (cut) out.push({ target: "style_rules", text: `${clip(`Do not write lines like "${clip(cut, 120)}"`, 299)}.`, why: "You cut this line from the draft." });
  const existing = new Set([...input.current_rules.style_rules, ...input.current_rules.checklist].map(r => r.toLowerCase().trim()));
  return { suggestions: out.filter(s => !existing.has(s.text.toLowerCase())) };
}

registerFake("studio.interview", req => {
  const data = readData<FollowUpInput | PlaybookInput>(req.prompt);
  return { data: data.task === "follow_up" ? fakeFollowUp(data) : fakePlaybook(data) };
});
registerFake("studio.compile", req => ({ data: fakePackage(readData<CompileInput>(req.prompt)) }));
registerFake("studio.suggest", req => ({ data: fakeSuggestions(readData<SuggestInput>(req.prompt)) }));
