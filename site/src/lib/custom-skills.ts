import type { Catalogue } from "./data";
import type { Part, Library } from "./composer-core";
import { retrieve, terms } from "./composer-core.ts";
export {type CustomSkill, CUSTOM_LIMIT, validateCustomSkills, withCustomSkills} from "./custom-skill-data";
import {withCustomSkills} from "./custom-skill-data";
import type { Flow } from "./store";

export function replacementImpact(c: Library, old: Part, next: Part, before: string[], after: string[]) {
  const supplied = new Set(before.flatMap(s => c.bySlug[s]?.outputs.map(p => p.type) ?? []));
  const missing = next.inputs.filter(p => p.required && !supplied.has(p.type)).map(p => p.type);
  const removed = old.outputs.filter(p => !next.outputs.some(n => n.type === p.type) && after.some(s => c.bySlug[s]?.inputs.some(n => n.type === p.type))).map(p => p.type);
  return { missing, removed };
}
/** Task relevance and artifact contracts both count; compatibility alone never implies relevance. */
export function replacementOptions(c: Library, old: Part, goal: string, query = ""): Part[] {
  const generalStep = /^request-(acceptance|deliverable)-/.test(old.slug);
  const goalTerms = terms(goal).filter(t => !terms("build create write draft prepare make plan design request skill workflow with using supplied need would like want").includes(t));
  const ranked = retrieve(c, query || (generalStep ? goal : `${old.name} ${old.summary} ${goal}`), query ? 60 : 120).filter(b => {
    if (query || !generalStep) return true;
    const title = new Set(terms(`${b.name} ${b.slug}`));
    return goalTerms.filter(t => title.has(t)).length / Math.max(1, goalTerms.length) >= 0.6;
  });
  const topical = new Set(terms(`${old.name} ${goal}`));
  return ranked.filter(b => b.slug !== old.slug && b.type !== "mind").map((b, i) => ({ b, score: (query && [b.name, b.slug].some(s => s.toLowerCase() === query.trim().toLowerCase()) ? 100 : 0) + (ranked.length - i) / ranked.length * 6 + (b.role === old.role ? 2 : 0) + b.outputs.filter(p => old.outputs.some(o => o.type === p.type)).length * 3 + terms(b.name).filter(t => topical.has(t)).length })).sort((a, b) => b.score - a.score || a.b.slug.localeCompare(b.b.slug)).slice(0, 12).map(x => x.b);
}
/** Keep graph topology and user instructions. Drop conversion claims that depended on the old artifact. */
export function replaceFlowSkill(c: Catalogue, flow: Flow, id: string, slug: string, customSkills = flow.customSkills): Flow {
  const library = withCustomSkills(c, customSkills);
  if (!flow.nodes.some(n => n.id === id) || !library.bySlug[slug] || library.bySlug[slug].type === "mind") throw Error("Choose a skill in this workflow's library.");
  return { ...flow, customSkills, updated: Date.now(), nodes: flow.nodes.map(n => ({ ...n, ...(n.id === id ? { slug, bindings: undefined } : { bindings: n.bindings?.filter(b => b.from !== id) }) })) };
}
