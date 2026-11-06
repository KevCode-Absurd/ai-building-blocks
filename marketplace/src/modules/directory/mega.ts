// Mega agents: one person who leads a team of channel specialists from a mega kit (packs/mega/<kit>/), tailored to one
// kind of business. Today there is one kit, "traction" (19 channels, Bullseye). The team list the site shows comes from
// data/mega-traction.json, which scripts/mega-team.mjs writes from packs/mega/traction/kit.json and each channel's
// agents/<id>.md frontmatter description (run by `npm run build`). Until the kit exists, the file holds the 19
// channels from the spec and every job is the channel's name.
import { MEGA_VARIANTS, type MegaVariant, type Persona } from "../../core/types.ts";
import traction from "./data/mega-traction.json" with { type: "json" };

export interface MegaChannel { id: string; name: string; book_chapter?: string | null; job?: string | null }
export interface MegaKitData { kit: string; channels: MegaChannel[] }

/** One specialist on a mega agent's team: the channel id, its name, and one line on the job it does. */
export interface TeamMember { id: string; name: string; job: string }

let KITS: Record<string, MegaKitData> = { traction: traction as MegaKitData };

/** Tests only. */
export function setMegaKitForTests(kit: MegaKitData): void { KITS = { ...KITS, [kit.kit]: kit }; }

/** The persona's mega settings when they are valid (a known kit and variant), else null. */
export function megaOf(p: Persona): { kit: string; variant: MegaVariant } | null {
  const m = p.mega;
  if (!m || typeof m !== "object" || !KITS[m.kit] || !(MEGA_VARIANTS as readonly string[]).includes(m.variant)) return null;
  return { kit: m.kit, variant: m.variant };
}

/** The team a mega agent leads, in the kit's order. Empty for everyone else. */
export function megaTeam(p: Persona): TeamMember[] {
  const m = megaOf(p);
  if (!m) return [];
  return KITS[m.kit].channels.map(c => ({ id: c.id, name: c.name, job: (typeof c.job === "string" && c.job.trim()) || c.name }));
}

/** What cards say about a mega agent: its variant and how many specialists it leads. null for everyone else. */
export function megaCard(p: Persona): { variant: MegaVariant; team_size: number } | null {
  const m = megaOf(p);
  return m ? { variant: m.variant, team_size: KITS[m.kit].channels.length } : null;
}
