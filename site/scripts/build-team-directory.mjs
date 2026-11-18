// Publish the reviewed directory snapshot. Regeneration is an explicit maintainer
// operation: a site build must not rewrite specialist profiles or role kits.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(site, '../marketplace/src/modules/directory/data/team-org-chart.json');
const output = path.join(site, 'public/data/team-org-chart.json');
const bytes = fs.readFileSync(source);
const directory = JSON.parse(bytes.toString('utf8'));
if (directory.schema !== 'ai-blocks-org-chart/1' || !Array.isArray(directory.personas) || !Array.isArray(directory.departments)) {
  throw new Error('Invalid curated team directory; review the source snapshot before building.');
}
fs.mkdirSync(path.dirname(output), { recursive: true });
if (!fs.existsSync(output) || !fs.readFileSync(output).equals(bytes)) fs.writeFileSync(output, bytes);
console.log(JSON.stringify({ status: 'PASS', personas: directory.personas.length, bytes: bytes.length, output: 'public/data/team-org-chart.json', source_regenerated: false }));
