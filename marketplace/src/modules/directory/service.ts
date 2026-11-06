// The agent directory: named agents (personas) buyers browse and hire. Owner: directory module.
// House personas are content in data/personas.json, seeded into the personas table; expert personas come from the studio.
import type { Env } from "../../env.ts";
import type { Persona } from "../../core/types.ts";

/** Upsert every house persona from data/personas.json (idempotent; only rows whose content changed are written). */
export async function seedPersonas(env: Env, actor: string): Promise<{ created: number; updated: number }> {
  void env; void actor; throw new Error("directory.seedPersonas is not built yet");
}

export async function getPersona(env: Env, id: string): Promise<Persona | null> {
  void env; void id; throw new Error("directory.getPersona is not built yet");
}

export async function listPersonas(env: Env, filter?: { area?: string; q?: string }): Promise<Persona[]> {
  void env; void filter; throw new Error("directory.listPersonas is not built yet");
}
