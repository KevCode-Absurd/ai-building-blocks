// Catalogue id checks from local files, for tests and evals that run without the live catalogue.
// Mirrors catalogueResolver: roles come from the same generated inventory aiblocks://roles serves (some long ids are
// shortened there), items from the catalogue and mini tool folders that get_item finds.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const dirs = folder => fs.readdirSync(folder, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

export function localResolver(root = REPO) {
  const roleIds = new Set(fs.readdirSync(path.join(root, 'site/public/data/roles')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
  const catalogue = path.join(root, 'catalogue-items');
  const itemIds = new Set([...dirs(catalogue).flatMap(group => dirs(path.join(catalogue, group))), ...dirs(path.join(root, 'mini-tools'))]);
  return async ({ roles, items }) => ({ missing_roles: roles.filter(r => !roleIds.has(r)), missing_items: items.filter(i => !itemIds.has(i)) });
}
