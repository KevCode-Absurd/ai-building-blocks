#!/usr/bin/env node
// brand-file.mjs (AI Blocks, brand-dna-capture): renamed. The brand file is now the org context, and this tool is now
// org-context.mjs, beside this file. This old name still works: it prints one line to say so, then runs the same
// command there, so older packs, notes and habits keep working. For the commands: node org-context.mjs --help
// Its old exports keep their old names: PARTS (the store parts), kindOf (the kind of a fact) and day.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { forward } from './org-context.mjs';

export * from './org-context.mjs';
export { STORE_PARTS as PARTS, factKindOf as kindOf, dateOf as day } from './org-context.mjs';
/** The same commands as org-context.mjs, after the one "renamed" line. */
export const main = (argv = process.argv.slice(2), print = console.log) => forward('brand-file.mjs', argv, print);
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
