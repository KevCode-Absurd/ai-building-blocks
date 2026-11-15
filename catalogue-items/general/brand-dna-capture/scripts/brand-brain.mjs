#!/usr/bin/env node
// brand-brain.mjs (AI Blocks, brand-dna-capture): renamed. The brand brain is now the org context, and this tool is
// now org-context.mjs, beside this file. This old name still works: it prints one line to say so, then runs the same
// command there, so older packs, notes and habits keep working. For the commands: node org-context.mjs --help
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { forward } from './org-context.mjs';

export * from './org-context.mjs';
/** The same commands as org-context.mjs, after the one "renamed" line. */
export const main = (argv = process.argv.slice(2), print = console.log) => forward('brand-brain.mjs', argv, print);
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
