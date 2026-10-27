// A link that opens a workflow in the site's builder: the builder's own shared-link format (lib/plan.ts packFlow,
// opened by Builder.tsx from /?flow=<code>#build and checked there by unpackFlow, all or nothing, against the
// catalogue). Written here without the browser modules so the Worker can make one. Steps are catalogue slugs only.
import { deflateSync, strToU8 } from "fflate";

const SITE = "https://useaiblocks.com";
const MAX_STEPS = 40;

const b64url = (u: Uint8Array) => {
  let text = "";
  for (let i = 0; i < u.length; i += 8192) text += String.fromCharCode(...u.subarray(i, i + 8192));
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * The builder link for an ordered workflow. `edges` are [from, to] step positions (each from an earlier step); a step
 * with no edge in is joined to the one before it, so the builder shows the same order. Returns null when it cannot be a
 * builder link (no steps, too many, or a step that is not a catalogue slug).
 */
export function builderLink({ name, goal, slugs, edges = [], governing = [] }: { name: string; goal?: string; slugs: string[]; edges?: [number, number][]; governing?: string[] }, site = SITE): string | null {
  if (!slugs.length || slugs.length > MAX_STEPS || slugs.some(s => !/^[a-z0-9][a-z0-9-]{0,119}$/.test(s))) return null;
  const pairs = new Set<string>();
  for (const [a, b] of edges) if (Number.isInteger(a) && Number.isInteger(b) && a >= 0 && a < b && b < slugs.length) pairs.add(`${a},${b}`);
  for (let i = 1; i < slugs.length; i++) if (![...pairs].some(p => p.endsWith(`,${i}`))) pairs.add(`${i - 1},${i}`);
  const data: Record<string, unknown> = {
    v: 1, n: name.slice(0, 80), s: slugs, p: slugs.map((_, i) => [i * 30, 11]),
    e: [...pairs].map(p => p.split(",").map(Number)).sort((x, y) => x[1] - y[1] || x[0] - y[0]), m: [],
  };
  if (governing.length) data.gs = governing.slice(0, 20);
  if (goal) data.g = goal.slice(0, 10000);
  return `${site}/?flow=${b64url(deflateSync(strToU8(JSON.stringify(data)), { level: 9 }))}#build`;
}
