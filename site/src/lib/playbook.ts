// The specialization layer: when the brand file names a kind of business, every download carries that business's
// playbook (public/playbooks/FOR-<BOARD>.md) next to the skills, so a general skill bends toward that business.
// Fetched at click time. If it cannot load, the download goes ahead without it: the brand file still names the kind.
import { BOARD_NAMES, playbookFile, playbookHref } from "../trust-pages/board-names.mjs";
import type { Business } from "./business";

const isKind = (v: unknown): v is string => typeof v === "string" && Object.hasOwn(BOARD_NAMES, v);

/** The playbook for the brand file's kind of business, or null when none is set or it will not load. */
export async function loadPlaybook(b: Business): Promise<{ name: string; text: string } | null> {
  if (!isKind(b.kind)) return null;
  try {
    const r = await fetch(playbookHref(b.kind));
    if (!r.ok) return null;
    const text = await r.text();
    return text.startsWith("# Playbook") ? { name: playbookFile(b.kind), text } : null;
  } catch { return null; }
}

/** A finished zip with the playbook added at `dir` (for example "my-skill/"). Unchanged when there is none. */
export async function addPlaybook(bytes: Uint8Array, b: Business, dir = ""): Promise<Uint8Array> {
  const pb = await loadPlaybook(b);
  if (!pb) return bytes;
  const { strToU8, unzipSync, zipSync } = await import("fflate");
  const files = unzipSync(bytes);
  files[`${dir}${pb.name}`] = strToU8(pb.text);
  return zipSync(files, { level: 6 });
}
