export type FactCheck = {
  status: 'docs_checked' | 'not_checked' | 'source_dated';
  scope: string;
  sources: string[];
  checked_on?: string;
  attempted_on?: string;
  source_date?: string;
  source_matches?: boolean;
};
export const FACT_RECHECK_DAYS = 60;
const DAY = 86_400_000;
export function validFactDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateFactCheck(value: unknown, asOf = new Date().toISOString().slice(0, 10)): FactCheck {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !validFactDate(asOf)) throw Error('Invalid fact-check record');
  const v = value as Record<string, unknown>;
  if (!['docs_checked', 'not_checked', 'source_dated'].includes(v.status as string) || typeof v.scope !== 'string' || !v.scope.trim() || v.scope.length > 600) throw Error('Invalid fact-check scope or status');
  if (!Array.isArray(v.sources) || !v.sources.length || v.sources.length > 8) throw Error('Fact checks need bounded source links');
  for (const source of v.sources) {
    if (typeof source !== 'string' || source.length > 1500) throw Error('Invalid fact-check source link');
    let url: URL; try { url = new URL(source); } catch { throw Error('Invalid fact-check source link'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw Error('Fact-check links must use public HTTPS sources');
  }
  for (const field of ['checked_on', 'attempted_on', 'source_date']) if (v[field] !== undefined && (!validFactDate(v[field]) || (v[field] as string) > asOf)) throw Error('Invalid or future fact-check date');
  if (v.status === 'docs_checked' && !v.checked_on) throw Error('A documentation check needs its actual date');
  if (v.status !== 'docs_checked' && v.checked_on !== undefined) throw Error('An unchecked record cannot claim an independent check date');
  if (v.status === 'source_dated' && !v.source_date) throw Error('A source-stated record needs its source date');
  if (v.status !== 'source_dated' && v.source_date !== undefined) throw Error('Source dates belong to source-stated records');
  if (v.source_matches !== undefined && typeof v.source_matches !== 'boolean') throw Error('Invalid fact-check source match');
  return { status: v.status as FactCheck['status'], scope: v.scope.trim(), sources: [...v.sources] as string[],
    ...(v.checked_on ? { checked_on: v.checked_on as string } : {}), ...(v.attempted_on ? { attempted_on: v.attempted_on as string } : {}),
    ...(v.source_date ? { source_date: v.source_date as string } : {}), ...(v.source_matches !== undefined ? { source_matches: v.source_matches as boolean } : {}) };
}
export function factCheckView(check: FactCheck, asOf = new Date().toISOString().slice(0, 10)) {
  const date = check.checked_on ?? check.source_date;
  const ageDays = date && validFactDate(date) && validFactDate(asOf) ? Math.floor((Date.parse(asOf + 'T00:00:00Z') - Date.parse(date + 'T00:00:00Z')) / DAY) : null;
  const old = ageDays !== null && ageDays > FACT_RECHECK_DAYS;
  const label = check.status === 'docs_checked' ? `Docs checked ${check.checked_on}` : check.status === 'source_dated' ? `Source-stated date ${check.source_date}` : 'Not independently checked';
  const notes = [
    ...(check.status === 'docs_checked' ? ['Documentation check only; the named scope was checked.'] : []),
    ...(check.status === 'source_dated' ? ['This is the source’s date. AI Blocks has not independently checked these live details.'] : []),
    ...(check.attempted_on ? [`Source check attempted ${check.attempted_on}.`] : []),
    ...(check.source_matches === false ? ['The source changed after this check was recorded.'] : []),
    ...(old ? ['More than 60 days old. Recheck the cited sources.'] : []),
  ];
  return { label, notes, old, ageDays, needsCheck: check.status !== 'docs_checked' || old || check.source_matches === false };
}
