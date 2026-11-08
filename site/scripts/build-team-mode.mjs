import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildNativeDeliveryToolkit } from './build-native-delivery-toolkit.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src/jobs/pack/TEAM-MODE.md');
const output = path.join(root, 'public/packs/team-mode.md');
const content = `${fs.readFileSync(source, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trimEnd()}\n`;
const bytes = Buffer.byteLength(content);
if (bytes >= 60_000) throw new Error(`TEAM-MODE.md must stay under 60 KB; got ${bytes} bytes.`);
for (const required of ['general coordinator', 'task-specific lead', 'working groups', 'CONSENSUS_UNTESTED', 'SAME_CONTEXT_REVIEW', 'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED', 'DECISIONS.md', 'EVIDENCE.md', 'REVIEW.md', 'run.json']) {
  if (!content.includes(required)) throw new Error(`TEAM-MODE.md is missing ${required}.`);
}
fs.mkdirSync(path.dirname(output), { recursive: true });
if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== content) fs.writeFileSync(output, content);
console.log(JSON.stringify({ status: 'PASS', model_calls: 0, bytes, output: 'public/packs/team-mode.md', fresh_chat_validation: 'NOT_RUN' }));
console.log(JSON.stringify(buildNativeDeliveryToolkit()));
