// Agent pack format: the constants and the pack.json schema shared by the builder (build.ts) and the studio import.
// The full layout is documented in ARCHITECTURE.md ("Agent packs").
import { z } from "zod";

export const PACK_SCHEMA = "ai-blocks-agent-pack/1";
export type PackKind = "agent" | "train";

/** The first line of a training pack's soul.md and personality.md until the expert's training replaces them. */
export const TEMPLATE_MARKER = "<!-- template: replace this file during training -->";

/**
 * The pack licence (SPDX-style id for a custom licence): AI Blocks Agent Pack Licence 1.0, free to use and change,
 * not to sell. Its text is packs/shared/LICENSE.md, copied into every pack; it is never written here.
 */
export const PACK_LICENSE = "LicenseRef-AI-Blocks-Pack-1.0";

/**
 * Folders where agent tools look for skills by themselves: .agents/skills (Codex, Cursor) and .claude/skills (Claude
 * Code). The zip carries a byte-for-byte copy of skills/ in each; files.json, pack.json and the viewer never list them.
 */
export const SKILL_MIRRORS = [".agents/skills/", ".claude/skills/"] as const;
/** Where Claude Code finds sub-agents: the zip copies a mega agent's agents/*-specialist.md here (zip only). */
export const AGENT_MIRROR = ".claude/agents/";

export const ORIGIN = "https://agents.useaiblocks.com";
export const LIBRARY_ORIGIN = "https://useaiblocks.com";

export interface PackManifestFile { path: string; bytes: number; sha256: string }
export interface PackManifest {
  schema: typeof PACK_SCHEMA;
  kind: PackKind;
  agent_id: string;
  name: string;
  title: string;
  role: string | null;
  version: string;
  updated: string;
  source: string;
  license: typeof PACK_LICENSE;
  job_types: string[];
  /** review_every_days comes from the role kit's role.json (14, 30 or 60); null while knowledge is pending. */
  knowledge: { status: "ready" | "pending"; updated: string | null; sources: number; review_every_days: number | null };
  files: PackManifestFile[];
  /** Mega agents only: the mega kit and the kind of business, and the channel specialists in kit order. */
  mega?: { kit: string; variant: string };
  team?: { id: string; name: string; agent: string; description: string }[];
  /** Trained packs only (the training coach sets them in stage 8): who trained it, and the pack it started from. */
  trained_by?: string;
  based_on?: { agent_id: string; version: string; source: string };
}

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/**
 * pack.json as uploaded back to the studio. Loose on purpose where training edits things (file hashes go stale when
 * the coach rewrites files, so files is optional and not checked against the upload), strict on the fields we use.
 */
export const uploadedManifestSchema = z.object({
  schema: z.literal(PACK_SCHEMA),
  kind: z.enum(["agent", "train"]),
  agent_id: z.string().max(80).optional(),
  name: z.string().max(120).optional(),
  title: z.string().max(120).optional(),
  role: z.string().max(80).nullable().optional(),
  version: z.string().max(40).optional(),
  updated: z.string().max(40).optional(),
  source: z.string().max(300).optional(),
  license: z.string().max(40).optional(),
  job_types: z.array(z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case job type id")).min(1).max(30),
  knowledge: z.object({
    status: z.string().max(20),
    updated: date.nullable().optional(),
    sources: z.number().int().min(0).optional(),
    review_every_days: z.number().int().min(1).max(365).nullable().optional(),
  }).passthrough().optional(),
  trained_by: z.string().max(120).optional(),
  based_on: z.object({ agent_id: z.string().max(80), version: z.string().max(40), source: z.string().max(300) }).passthrough().optional(),
  // Listed hashes are never trusted: the studio import works out every file's sha256 itself.
  files: z.array(z.object({ path: z.string().max(300) }).passthrough()).max(1000).optional(),
}).passthrough();
export type UploadedManifest = z.infer<typeof uploadedManifestSchema>;
