import fs from 'node:fs';
import path from 'node:path';

/** Existing workflow sources, including generated drafts, may contain reviewed edits. */
export function writeNewWorkflowFiles(entries) {
  const existing = entries.filter(entry => fs.existsSync(entry.file)).map(entry => entry.file);
  if (existing.length) throw new Error(`Workflow regeneration blocked; edit existing files in place: ${existing.join(', ')}`);
  for (const { file, text } of entries) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text, { flag: 'wx' });
  }
}
