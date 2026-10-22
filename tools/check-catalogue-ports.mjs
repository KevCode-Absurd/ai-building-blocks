// Check both source port formats against the shared connection vocabulary.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import YAML from '../site/node_modules/yaml/dist/index.js';
const types = new Set(Object.values(YAML.parse(fs.readFileSync('catalogue-items/_types.yaml', 'utf8'))).flatMap(Object.keys));
let items = 0, ports = 0; const problems = [];
for (const category of ['general', 'ecommerce', 'imported', 'orchestrators', 'agents']) {
  for (const entry of fs.readdirSync('catalogue-items/' + category, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join('catalogue-items', category, entry.name, 'item.yaml');
    if (!fs.existsSync(file)) continue;
    const item = YAML.parse(fs.readFileSync(file, 'utf8')); items++;
    for (const direction of ['inputs', 'outputs']) for (const p of item[direction] ?? []) {
      ports++; const type = typeof p === 'string' ? p : p?.type;
      if (typeof type !== 'string' || !types.has(type)) problems.push({ slug: item.slug, direction, type: type ?? null });
    }
  }
}
const report = { checkedOn: new Date().toISOString(), status: problems.length ? 'fail' : 'pass', items, ports, registeredTypes: types.size, problems };
fs.writeFileSync('reports/catalogue-port-contract.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report)); assert.equal(problems.length, 0);
