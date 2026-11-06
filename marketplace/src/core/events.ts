// The append-only event log. Write one event for every state change; dashboards and gate numbers read from here.
import { nowIso } from "./db.ts";

export type ActorKind = "user" | "ops" | "system" | "expert" | "reviewer" | "mcp";
export interface EventInput {
  actor: string;          // user id, or "system"
  actorKind: ActorKind;
  entity: string;         // "job" | "agent" | "expert" | "draft" | "blind_test" | "user" | ...
  entityId: string;
  type: string;           // dotted name, e.g. "job.quoted", "draft.released", "expert.approved"
  data?: Record<string, unknown>;
}

/** A prepared statement for use inside db.batch([...]) so the event commits with the change it records. */
export function eventStatement(db: D1Database, e: EventInput, at = nowIso()): D1PreparedStatement {
  return db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(at, e.actor, e.actorKind, e.entity, e.entityId, e.type, JSON.stringify(e.data ?? {}));
}

export async function recordEvent(db: D1Database, e: EventInput): Promise<void> {
  await eventStatement(db, e).run();
}

export interface EventRow { seq: number; at: string; actor: string; actor_kind: ActorKind; entity: string; entity_id: string; type: string; data: string }

export async function eventsFor(db: D1Database, entity: string, entityId: string): Promise<EventRow[]> {
  const res = await db.prepare("SELECT * FROM events WHERE entity = ? AND entity_id = ? ORDER BY seq").bind(entity, entityId).all<EventRow>();
  return res.results ?? [];
}
