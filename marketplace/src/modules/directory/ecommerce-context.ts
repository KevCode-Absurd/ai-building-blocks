// Deterministic role context shared by hosted house packages and downloadable D2C agents.
// Source knowledge remains public procedural reference; merchant facts and authority are supplied per job.
import type { Persona } from "../../core/types.ts";
import ecommercePersonas from "./data/personas-ecommerce.json" with { type: "json" };
import verticalData from "../../../knowledge/ecommerce/vertical.json" with { type: "json" };
import { personaModules, type VerticalBundle } from "../knowledge/bundle.ts";
import type { Vertical } from "../knowledge/cards.ts";

const vertical = verticalData as Vertical;
const canonical = new Map((ecommercePersonas as Persona[]).map(p => [p.id, p]));
const moduleNames = new Map(vertical.modules.map(m => [m.code, m.name]));
// personaModules consumes only vertical metadata. Reuse the pack's routing policy, including lead constraints.
const routing: VerticalBundle = { vertical, cards: [], sources: [], toolbox: null, principles: null, vendor: {}, names: { library: {}, vendor: {} }, files: {},
  index: { schema: "ai-blocks-vertical-index/1", vertical, counts: {}, sources: [], cards: [] } };

/** Inputs to request only when the selected job needs this discipline. No fabricated merchant defaults. */
const EVIDENCE: Record<string, string> = {
  PRD: "Demand evidence, competing products, sell-through or order cohorts, product requirements and feasibility constraints; distinguish a research hypothesis from verified demand.",
  AVT: "Attributed customer interviews, reviews, search language and order segments; preserve the customer's meaning and sample limits without inventing quotes or demographic certainty.",
  OFF: "Current price, discount eligibility, landed contribution, stock and policy exclusions; evaluate the actual offer and customer fit without inventing an active promotion.",
  BRD: "Approved voice examples, exact colors and typography, product identity, claim proof and asset rights; treat observed website styling separately from owner-approved standards.",
  SET: "Actual store platform, catalogue and variants, availability, shipping/payment settings and granted access; distinguish an implemented local test from a verified store integration.",
  MEA: "Raw ad and store records with period, currency, timezone, attribution and order/refund definitions; calculate reproducibly and keep conflicting populations visible.",
  LPG: "The actual page and product, customer objections, approved proof and funnel evidence; ship the requested page/copy artifact and test the surface it changes.",
  SPD: "The actual page, editable source, device/network protocol and measured bottleneck; preserve before/after evidence and do not claim performance from an unrelated fixture.",
  CRO: "For functional reviews, the actual journey, selected variant, observed states and reproducible failure/receipt evidence; continue diagnosis without margins and leave commercial impact unmeasured. For experiments, baseline population, denominator, hypothesis, primary outcome and guardrails; require reconciled economics for profit claims and distinguish a design from an executed experiment or causal result.",
  MCR: "Customer problem and awareness, product proof, approved brand/assets, placement and requested formats; judge distinct concepts, usable exports and product fidelity rather than cosmetic variants alone.",
  ADC: "The intended platform/account, approved campaign plan, actual creative and destination, tracking settings and capability readback; a build sheet, saved draft, active status and observed delivery are different outcomes.",
  GAD: "Search terms, brand/non-brand mix, conversion definitions, Merchant Center feed diagnostics, margin and stock; distinguish platform attribution from store contribution and repeat-buyer effects.",
  ORG: "Platform/audience observations, creator evidence, content rights, brand voice and actual production capacity; deliver channel-native work without claiming reach or partnership commitments not observed.",
  EML: "Consent by channel, lifecycle events, suppression rules, supported merge fields, approved offers and retention cohorts; a draft or outbox record is not an installed flow or delivered message.",
  SEO: "Actual URLs, crawl/indexation evidence, query and intent data, internal links and current primary documentation; connect the strategy to implementable page changes and measurable outcomes.",
  AEO: "Named answer surfaces, representative queries, dated observations/citations, website evidence and current reporting documentation; keep an unrun visibility plan separate from observed inclusion or lift.",
  CXP: "Order/ticket evidence, qualified returns and warranty rules, customer language and lifecycle context; solve the case while exposing recurring product or instruction problems to their owner.",
  COG: "Supplier quotes, specifications, samples, minimum quantities, lead times and landed cost assumptions; preserve evidence and acceptance conditions, and do not imply a purchase commitment.",
  WLD: "The specific hypothesis, supporting evidence, affordable loss and disconfirming result; speculative opportunities do not outrank a proven baseline simply because they are novel.",
  FIN: "Cash, revenue/cost records, obligations, period/currency and applicable jurisdiction; reconcile units and timing, disclose uncertain inputs and keep forecasts separate from actual results.",
  OPS: "Order backlog, sellable versus committed stock, fulfilment/support capacity, service rules and exception history; produce a workable operation with an owner and observable completion.",
  AMZ: "Exact marketplace, selling/fulfilment mode, listing identifiers, product proof, fees, inventory and account diagnostics; verify marketplace-specific requirements before promising acceptance or live changes.",
  SEC: "Actual host, tool capabilities, client/account boundaries, sensitive data paths and observed incidents; test the authorized boundary without treating a prompt or folder as enforced isolation.",
};

/** Conditional cross-domain questions, not mandatory retrieval or permission to operate another function. */
const DEPENDENCIES: Record<string, { code: string; when: string }[]> = {
  PRD: [{ code: "AVT", when: "the opportunity depends on customer demand or fit" }, { code: "COG", when: "manufacturing feasibility or landed cost affects the choice" }],
  AVT: [{ code: "CXP", when: "customer evidence comes from returns, support or repeat purchase" }],
  OFF: [{ code: "MEA", when: "the offer changes contribution or acquisition economics" }, { code: "OPS", when: "stock or fulfilment limits the offer" }],
  BRD: [{ code: "AVT", when: "positioning or voice needs customer evidence" }],
  SET: [{ code: "SPD", when: "page performance blocks the store task" }, { code: "CXP", when: "checkout or policy changes affect post-purchase expectations" }],
  MEA: [{ code: "FIN", when: "cash, cost recognition or reconciliation changes the conclusion" }],
  LPG: [{ code: "AVT", when: "customer objections or product fit determine the page" }, { code: "CRO", when: "the owner requested an experiment or conversion diagnosis" }],
  SPD: [{ code: "CRO", when: "performance work needs a business outcome or experiment guardrail" }],
  CRO: [{ code: "MEA", when: "measurement or unit economics affect the decision" }, { code: "SET", when: "an authorized executable buyer-flow or checkout integration review needs actual variant, stock, transaction or receipt behavior; not for a screenshot-only review or statistical readout" }],
  MCR: [{ code: "AVT", when: "the concept needs customer language or objection evidence" }, { code: "BRD", when: "the requested asset needs exact brand tokens or claim approval" }],
  ADC: [{ code: "MEA", when: "a spend, bidding or performance decision needs comparable economics" }, { code: "MCR", when: "creative production or diagnosis is part of the request" }],
  GAD: [{ code: "MEA", when: "attribution or contribution determines the decision" }, { code: "OPS", when: "feed availability or stock constrains spend" }],
  ORG: [{ code: "BRD", when: "voice, identity or usage rights need verification" }],
  EML: [{ code: "CXP", when: "lifecycle messages depend on order or support exceptions" }, { code: "OFF", when: "a requested campaign includes an offer" }],
  SEO: [{ code: "SET", when: "platform implementation affects the technical recommendation" }, { code: "AEO", when: "the brief includes answer-engine visibility" }],
  AEO: [{ code: "SEO", when: "crawlability, indexation or page structure affects the answer surface" }],
  CXP: [{ code: "OPS", when: "a recurring complaint points to fulfilment or support operations" }],
  COG: [{ code: "FIN", when: "terms, inventory commitments or cash timing affect procurement" }, { code: "OPS", when: "quality or inbound handling constrains delivery" }],
  WLD: [{ code: "MEA", when: "a test needs an observable success or failure measure" }, { code: "FIN", when: "the proposed test risks cash" }],
  FIN: [{ code: "MEA", when: "channel/order definitions must reconcile" }, { code: "OPS", when: "inventory or fulfilment commitments affect cash" }],
  OPS: [{ code: "CXP", when: "service decisions affect a customer promise or recurring complaint" }],
  AMZ: [{ code: "MEA", when: "fees, ads or returns affect contribution" }, { code: "OPS", when: "inventory or fulfilment status affects the listing" }],
  SEC: [{ code: "SET", when: "a store integration changes the tested access boundary" }],
};

export interface EcommerceRoleContext {
  schema: "ecommerce-role-context/1";
  agent_id: string;
  role_id: string;
  title: string;
  responsibility: string;
  outcomes: { id: string; title: string; deliverable: string; job_type_id: string | null }[];
  primary_modules: string[];
  constraint_modules: string[];
  primary_knowledge: { code: string; name: string; path: string; evidence: string }[];
  conditional_modules: { code: string; name: string; when: string; path: string }[];
  unknown_modules: string[];
}

export function ecommerceRoleContext(persona: Persona): EcommerceRoleContext | null {
  // Stored house rows currently omit these static metadata fields; recover them only for an exact known house ID.
  const saved = persona.kind === "house" ? canonical.get(persona.id) : undefined;
  if ((persona.vertical ?? saved?.vertical) !== "ecommerce") return null;
  const p = { ...persona, role: persona.role ?? saved?.role, vertical: "ecommerce", modules: persona.modules ?? saved?.modules ?? [] };
  const selected = personaModules(p, routing);
  const primary = selected.filter(code => moduleNames.has(code));
  const cross = new Map<string, { code: string; name: string; when: string; path: string }>();
  for (const code of primary) for (const item of DEPENDENCIES[code] ?? []) {
    if (primary.includes(item.code) || cross.has(item.code)) continue;
    cross.set(item.code, { ...item, name: moduleNames.get(item.code)!, path: `knowledge/ecommerce/${item.code}.md` });
  }
  return { schema: "ecommerce-role-context/1", agent_id: p.id, role_id: p.role ?? "unmapped", title: p.title, responsibility: p.tagline,
    outcomes: p.profile.outcomes.map(o => ({ id: o.id, title: o.title, deliverable: o.deliverable, job_type_id: o.job_type_id })),
    primary_modules: primary,
    constraint_modules: [...new Set(Object.entries(vertical.constraints ?? {}).filter(([key]) => key !== "rule").map(([, code]) => code))].filter(code => moduleNames.has(code)),
    primary_knowledge: primary.map(code => ({ code, name: moduleNames.get(code)!, path: `knowledge/ecommerce/${code}.md`, evidence: EVIDENCE[code] })),
    conditional_modules: [...cross.values()], unknown_modules: selected.filter(code => !moduleNames.has(code)) };
}

/** Exact static roster resolution for source prefiltering; unknown IDs never imply a broad-library fallback. */
export function resolveEcommerceRole(agentId: string): { agent_id: string; modules: string[] } | null {
  const persona = canonical.get(agentId);
  if (!persona || persona.kind !== "house" || persona.vertical !== "ecommerce") return null;
  const ctx = ecommerceRoleContext(persona)!;
  return ctx.unknown_modules.length || !ctx.primary_modules.length ? null : { agent_id: ctx.agent_id, modules: [...ctx.primary_modules] };
}

export function renderEcommerceRoleContext(persona: Persona): string {
  const ctx = ecommerceRoleContext(persona);
  if (!ctx) return "";
  return [
    "## D2C e-commerce operating context",
    `Role: ${ctx.title} (${ctx.agent_id}; role ${ctx.role_id}). ${ctx.responsibility}`,
    "Work on this merchant's actual product, customer journey and operating constraints. Keep the specialist method below; do not turn every task into a generic growth audit or require ad/cash analysis for an unrelated support, copy or implementation job.",
    "### What finished work means for this role",
    "Complete only the requested outcome(s), in the requested native format. These are the role's supported outcomes, not a requirement to do every one on every job:",
    ...ctx.outcomes.map(o => `- ${o.title}: ${o.deliverable} [outcome ${o.id}${o.job_type_id ? `; job ${o.job_type_id}` : "; individually scoped"}]`),
    "### Relevant ecomOS knowledge and evidence",
    "Start with the smallest relevant subset of these primary modules; read the procedural evidence alongside this merchant's current facts:",
    ...ctx.primary_knowledge.map(m => `- ${m.code} — ${m.name} (${m.path}): ${m.evidence}`),
    ...(ctx.conditional_modules.length ? ["Retrieve a cross-module only when its condition is part of the current decision; these are fallback candidates, not an instruction to load them all:", ...ctx.conditional_modules.map(m => `- ${m.code} — ${m.name}: ${m.when} (${m.path}).`)] : []),
    ...(ctx.unknown_modules.length ? [`Unmapped module metadata: ${ctx.unknown_modules.join(", ")}. Resolve the mapping; do not assume library coverage.`] : []),
    `Canonical constraint references: ${ctx.constraint_modules.join(", ")}. Consult measurement, cash or capacity only when those constraints affect this job; their presence is not an instruction to run a generic financial audit.`,
    "### Retrieval and execution contract",
    `When the connected ask_vertical_knowledge tool's exposed schema supports agent_id, pass ${JSON.stringify({ agent_id: ctx.agent_id })} to select this role's default source modules. Inspect the actual schema: a same-name tool may differ; do not invent unsupported arguments. Override modules only for a named evidence gap.`,
    "For each material decision, name the evidence needed, search the relevant modules, keep source IDs/locations and the conditions or counterexamples with the claim, and record what is still missing. Reuse a passage that answers several needs. Start with a small evidence set and widen only for a named missing need; a top-five result count is not proof of completeness.",
    "These module paths identify public procedural references. In a downloaded pack, verify the files are present and use its available lookup tools. In a connected host, inspect available lookup capabilities. In a text-only runner, a path or tool name is not loaded evidence: use supplied source excerpts or accessible verified references, and disclose missing lookup access. Never claim to have read a module, Drive folder or business account merely because it is listed here.",
    "Brand/account facts come from the task's current authorized evidence and reconciled memory, including policy exclusions, corrections, scope and source dates. Public methods are not current merchant facts. Do not embed private client context in this reusable instruction file or borrow another account's approval.",
    "Keep source-linked calculations separate from writing. Readiness means the requested artifact exists and required checks or provider readbacks actually ran. When execution is unsupported, finish the feasible reviewable artifact and state the exact remaining operation without claiming launch, delivery or a business result.",
  ].join("\n\n");
}
