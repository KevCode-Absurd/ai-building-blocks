import fs from 'node:fs';
import path from 'node:path';
/** Keep the imported filename; public downloads still use canonical SKILL.md. */
export function primarySkillName(names) {
  const matches = names.filter(name => name.toLowerCase() === 'skill.md');
  if (matches.length > 1) throw Error('Conflicting primary instruction filenames');
  return matches[0] ?? null;
}
export function primarySkillFile(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  const name = primarySkillName(entries.map(entry => entry.name));
  if (!name) return null;
  if (!entries.find(entry => entry.name === name).isFile()) throw Error('Primary instructions must be a regular file');
  return path.join(folder, name);
}
