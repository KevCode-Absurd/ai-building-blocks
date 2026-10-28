import fs from 'node:fs';
import path from 'node:path';
/** Keep the imported filename; public downloads still use canonical SKILL.md. */
export function primarySkillName(names, readBytes) {
  const matches = names.filter(name => name.toLowerCase() === 'skill.md');
  if (matches.length > 1) {
    if (!readBytes) throw Error('Conflicting primary instruction filenames');
    const normalized = name => Buffer.from(readBytes(name)).filter((byte, i, bytes) => byte !== 13 || bytes[i + 1] !== 10);
    const first = normalized(matches[0]);
    if (matches.slice(1).some(name => !first.equals(normalized(name)))) throw Error('Conflicting primary instruction contents');
    return matches.includes('SKILL.md') ? 'SKILL.md' : [...matches].sort()[0];
  }
  return matches[0] ?? null;
}
export function primarySkillFile(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  const matches = entries.filter(entry => entry.name.toLowerCase() === 'skill.md');
  if (matches.some(entry => !entry.isFile())) throw Error('Primary instructions must be a regular file');
  const name = primarySkillName(entries.map(entry => entry.name), name => fs.readFileSync(path.join(folder, name)));
  if (!name) return null;
  if (!entries.find(entry => entry.name === name).isFile()) throw Error('Primary instructions must be a regular file');
  return path.join(folder, name);
}
