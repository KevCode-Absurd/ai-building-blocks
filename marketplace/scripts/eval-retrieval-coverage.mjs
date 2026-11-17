// Development diagnostic: retrieval of ALL annotated passages, not answer correctness.
// No model, paid API or automatic labels. Exact references must exist in the source snapshot.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { kitFiles } from './eval-retrieval.mjs';
import { KnowledgeIndex } from '../src/modules/packs/retrieve.ts';

const norm = text => text.replace(/\s+/g, ' ').trim();
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
export function scoreCoverage(passages, references) {
  if (!Array.isArray(references) || !references.length) throw Error('Nonempty annotated references required; missing labels are not perfect recall');
  const keys = new Set();
  for (const ref of references) {
    if (typeof ref.file !== 'string' || !ref.file.trim() || typeof ref.quote !== 'string' || !norm(ref.quote)) throw Error('Each reference requires a file and nonempty quote');
    const key = JSON.stringify([ref.file, norm(ref.quote)]);
    if (keys.has(key)) throw Error('Duplicate reference annotation');
    keys.add(key);
  }
  const matches = references.map(ref => ({...ref, rank: passages.findIndex(p => p.path === ref.file && norm(p.text).includes(norm(ref.quote))) + 1}));
  const found = matches.filter(ref => ref.rank > 0).length;
  return {required:references.length, found, referenceRecall:found/references.length, allReferencesFound:found === references.length, matches};
}

export function evaluateCoverage(fixture, ks = [1, 3, 5, 10]) {
  if (!Array.isArray(fixture.questions) || !fixture.questions.length) throw Error('No annotated questions');
  if (!ks.length || ks.some(k => !Number.isInteger(k) || k < 1 || k > 10)) throw Error('k must be an integer from 1 to 10');
  const indexes = new Map(), sourceHashes = {}, rows = [];
  for (const q of fixture.questions) {
    if (typeof q.q !== 'string' || !q.q.trim() || !/^[a-z0-9-]+$/.test(q.role)) throw Error('Invalid question or role');
    if (!indexes.has(q.role)) {
      const files = kitFiles(q.role);
      indexes.set(q.role, {files, index:new KnowledgeIndex(files)});
      sourceHashes[q.role] = Object.fromEntries(files.map(f => [f.path, sha(f.text)]));
    }
    const {files, index} = indexes.get(q.role);
    scoreCoverage([], q.references); // Validate annotation schema before search.
    for (const ref of q.references) {
      const source = files.find(f => f.path === ref.file);
      if (!source || !norm(source.text).includes(norm(ref.quote))) throw Error(`Stale/missing annotation in ${q.role}/${ref.file}`);
    }
    for (const k of ks) {
      const answer = index.ask(q.q, {k});
      rows.push({id:q.id, role:q.role, query:q.q, k, enough:answer.enough,
        ...scoreCoverage(answer.passages, q.references),
        contextCharacters:answer.passages.reduce((n,p) => n+p.text.length, 0),
        retrieved:answer.passages.map(p => ({id:p.id, path:p.path, lines:p.lines, sha256:sha(p.text)}))});
    }
  }
  const byK = ks.map(k => {
    const rs = rows.filter(r => r.k === k), required = rs.reduce((n,r) => n+r.required,0), found = rs.reduce((n,r) => n+r.found,0);
    return {k, questions:rs.length, required, found, microReferenceRecall:found/required,
      allReferencesFound:rs.filter(r => r.allReferencesFound).length,
      meanContextCharacters:rs.reduce((n,r) => n+r.contextCharacters,0)/rs.length};
  });
  return {schema:'ai-blocks-retrieval-coverage/1', scope:fixture.scope, byK, rows, sourceHashes,
    limitations:['Role-kit files via kitFiles, not the full downloaded ecommerce pack or private merchant corpus.', 'Development labels, not held-out or human-calibrated.', 'Recall covers only the annotated references; annotations may be incomplete.', 'No precision, semantic entailment, answer quality, live business-data access or security certification is inferred.', 'Character counts are context-size diagnostics, not tokenizer counts.']};
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  try {
    const file = process.argv[2] || fileURLToPath(new URL('../test/fixtures/retrieval-multi-evidence.json', import.meta.url));
    const bytes = fs.readFileSync(file);
    const result = evaluateCoverage(JSON.parse(bytes.toString('utf8')));
    console.log(JSON.stringify({...result, fixture_sha256:sha(bytes)}, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
