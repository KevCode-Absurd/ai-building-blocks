// Offline preparation/export only. Does not connect accounts, call models or publish an agent.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { prepareExpertAgent } from './expert-agent-contract.mjs';

export async function prepareAgentDirectory(inputFile, outputDirectory, asOf, use = 'personal') {
  const data = JSON.parse(await readFile(inputFile, 'utf8'));
  const prepared = await prepareExpertAgent(data.agent, { profile: data.profile, as_of: asOf, use });
  const destination = resolve(outputDirectory);
  // No replacement of an existing folder or traversal through pre-existing output symlinks.
  await mkdir(destination);
  for (const [path, body] of Object.entries(prepared.files)) {
    const target = join(destination, path); await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body, { flag: 'wx', encoding: 'utf8' });
  }
  return { output: destination, agent_sha256: prepared.agent_sha256, files: Object.keys(prepared.files).length, state: prepared.state, complete_source_closure: prepared.complete_source_closure, stored_by_service: false, published: false };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command, input, output, asOf, use = 'personal', ...extra] = process.argv.slice(2);
  if (command !== 'prepare' || !input || !output || !asOf || extra.length) {
    console.error('Usage: node expert-agent-cli.mjs prepare input.json NEW_OUTPUT_DIRECTORY YYYY-MM-DD [personal|company]');
    process.exitCode = 2;
  } else {
    try { console.log(JSON.stringify(await prepareAgentDirectory(input, output, asOf, use), null, 2)); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
