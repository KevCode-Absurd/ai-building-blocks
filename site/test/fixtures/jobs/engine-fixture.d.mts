/** Mutable synthetic fixture records, never real execution evidence. */
type FixtureRecord = Record<string, any>;
export function engineFixture(options?: {tier?: 'quick'|'standard'|'deep'}): {
  provenance:string; input:FixtureRecord; context:FixtureRecord; card:FixtureRecord;
  team:FixtureRecord; routes:FixtureRecord; spread:FixtureRecord; council:FixtureRecord;
  production:FixtureRecord; review:FixtureRecord; delivery:FixtureRecord;
  events:Array<{event:string;document:FixtureRecord}>;
};
