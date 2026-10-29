// Planning uses the original me.md, not a previously rendered context snapshot.
import { LIMITS } from "./composer-request.ts";
import { meContext, pickSections, voiceRule, type SectionId } from "./me-file.ts";

export function planningMeContext(file: string, goal: string, today?: string): string {
  const tasks = [{ name: goal }];
  const selected = pickSections(tasks);
  const sections = new Set<SectionId>(selected === "all" ? [] : selected);
  for (const id of ["core", "work", "projects", "preferences", "never", "look", "sources"] as const) sections.add(id);
  // Personal history and private life only help when the request calls for them.
  if (/\b(bio|cv|resume|résumé|cover letter|career|experience|background)\b/i.test(goal)) sections.add("background");
  if (/\b(personal|family|travel|holiday|vacation|hobby|hobbies|life)\b/i.test(goal)) sections.add("life");
  if (voiceRule(tasks) === "brand") sections.delete("voice");
  return meContext(file, tasks, today, [...sections]);
}

export function workflowPlanningContext(notes: string, file: string, goal: string, includeSaved: boolean, today?: string): string {
  const context = [notes, includeSaved ? planningMeContext(file, goal, today) : ""].filter(Boolean).join("\n\n");
  if (context.length > LIMITS.context) throw Error(`Keep added notes and saved context within ${LIMITS.context.toLocaleString("en-US")} characters. Shorten your notes or turn off saved context.`);
  return context;
}

export type CompositionContext = { contextVersion: 2; context: string; planningContext: string; useContext: boolean };
export function captureCompositionContext(context: string, planningContext: string, useContext: boolean): CompositionContext {
  return { contextVersion: 2, context, planningContext, useContext };
}

/** Old exports stored the combined prompt as notes. Keep it intact and don't append the profile again. */
export function restoreCompositionContext(saved: { contextVersion?: unknown; context?: unknown; planningContext?: unknown; useContext?: unknown }): CompositionContext {
  if (saved.context !== undefined && typeof saved.context !== "string") throw Error("The saved workflow has invalid notes.");
  const context = saved.context ?? "";
  if (context.length > LIMITS.context) throw Error("The saved workflow notes are too long. Your saved copy is kept.");
  if (saved.contextVersion === undefined) return captureCompositionContext(context, context, false);
  if (saved.contextVersion !== 2 || typeof saved.planningContext !== "string" || saved.planningContext.length > LIMITS.context || typeof saved.useContext !== "boolean") throw Error("The saved workflow has invalid planning context. Your saved copy is kept.");
  return captureCompositionContext(context, saved.planningContext, saved.useContext);
}
