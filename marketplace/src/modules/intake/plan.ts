// The plan for a job: how long it takes, and whether faster delivery is offered. Pure functions, easy to test.
// Hiring is free, so a plan never carries a price. The catalogue's price band stays internal: its rush_multiplier
// only says whether faster delivery is offered, and the runner reads the band to size drafts.
import type { JobType } from "../../core/types.ts";
import { fasterAvailable } from "../catalogue/index.ts";

export { fasterAvailable };

export interface Plan {
  turnaround_hours: number;
  /** Faster delivery is on: about half the usual time. */
  faster: boolean;
  faster_available: boolean;
}

/** Faster delivery takes half the time (rounded up, at least one hour). */
export const fasterHours = (hours: number) => Math.max(1, Math.ceil(hours / 2));

/** The plan for a job type, with or without faster delivery. Faster is ignored when the job type does not offer it. */
export function planFor(jt: JobType, fasterWanted: boolean): Plan {
  const available = fasterAvailable(jt);
  const faster = fasterWanted && available;
  return { turnaround_hours: faster ? fasterHours(jt.turnaround_hours) : jt.turnaround_hours, faster, faster_available: available };
}
