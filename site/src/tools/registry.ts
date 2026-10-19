// The mini tools, read straight from their formula files in ../mini-tools, so the page and the downloads share one source.
// This module loads only with the Tools pages.
import { TOOLS as ALL, EXAMPLES as ALL_EXAMPLES, SITE as SITE_URL } from "../../../mini-tools/index.mjs";
import * as engine from "../../../mini-tools/engine.mjs";
import { saveSteps as steps } from "../../../mini-tools/skill.mjs";

export type When = { if?: string; text: string | Record<string, string> };
export type Input = {
  id: string; label: string; unit: string; example: number; min?: number; max?: number; step?: number; integer?: boolean;
  help: string; where: string; tools: string[]; boards?: string[]; section?: string;
};
export type Output = {
  id: string; label: string; unit: string; formula: string; about?: string; sum?: string | Record<string, string>; means?: string | When[];
  none?: string; boards?: string[]; group?: string; row?: string; col?: string; helper?: boolean;
};
export type Tool = {
  slug: string; name: string; short: string; headline: string; summary: string; question: string; shelf: string[]; version: string; updated: string;
  checked?: string; fixedCurrency?: string;
  presets: { id: string; label: string; values?: Record<string, number> }[];
  sections?: { id: string; label: string; closed?: boolean }[];
  inputs: Input[]; outputs: Output[]; answer: When[][];
  compare?: { input: string; label: string; values: number[]; outputs: string[] };
  next?: { if?: string; slug: string; why: string }[];
  sources: { what: string; how: string }[]; notes?: string[];
};
export type Example = { name: string; preset?: string; inputs: Record<string, number>; expect: Record<string, number | null>; says?: string };
export type Line = { id: string; label: string; group?: string; unit: string; value: number | null; shown: string; error: string | null; sum: string | null; means: string };
export type Env = Record<string, number | null | Error>;

export const TOOLS = ALL as unknown as Tool[];
export const EXAMPLES = ALL_EXAMPLES as unknown as Record<string, Example[]>;
export const SITE = SITE_URL as string;
export const saveSteps = steps as unknown as (t: Tool) => { ai: string; steps: string[] }[];

type E = {
  defaults: (t: Tool, preset?: string) => Record<string, number>;
  readInputs: (t: Tool, raw: Record<string, string>, preset?: string) => { values: Record<string, number>; errors: Record<string, string> };
  compute: (t: Tool, values: Record<string, number>) => Env;
  visibleInputs: (t: Tool, preset?: string) => Input[];
  answerLines: (t: Tool, env: Env, preset: string, sym: string) => string[];
  workingLines: (t: Tool, env: Env, preset: string, sym: string) => Line[];
  compareRows: (t: Tool, values: Record<string, number>, preset: string, sym: string) => { label: string; heads: string[]; rows: { id: string; label: string; cells: string[] }[] } | null;
  nextSteps: (t: Tool, env: Env) => { slug: string; why: string }[];
  worksBestWith: (t: Tool) => { name: string; for: string[] }[];
  format: (unit: string, v: number | null, sym?: string) => string;
};
export const E = engine as unknown as E;

/** Which boards a tool sits on, in words. */
export const shelfLabel = (t: Tool) => (t.shelf.includes("general") ? (t.shelf.includes("ecommerce") ? "Any business, with online store extras" : "Any business") : "Online stores");
/** Where the five ways' files are served from. */
export const filesOf = (slug: string) => `/mini-tools/${slug}`;
