import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {createRequire} from 'node:module';
import {loadFactChecks,factSourceDigest,citedLiveSources} from '../scripts/lib/fact-checks.mjs';
const YAML=createRequire(new URL('../package.json',import.meta.url))('yaml');
const method='---\nname: fixture\ndescription: Synthetic API source fixture.\n---\n# Method\nCheck the supplied source notes.\n';
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'abb-fact-sources-')),folder=path.join(root,'imported/fixture');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,'SKILL.md'),method);t.after(()=>{const target=path.resolve(root);assert.equal(path.dirname(target),path.resolve(os.tmpdir()));assert.match(path.basename(target),/^abb-fact-sources-/);fs.rmSync(target,{recursive:true,force:true});});return{root,folder,save(rows){fs.writeFileSync(path.join(root,'_fact-checks.yaml'),YAML.stringify({schema:'abb-fact-checks/1',checks:{fixture:rows}}));}};}
const record=()=>({status:'docs_checked',scope:'Synthetic source-check fixture only.',checked_on:'2026-10-28',sources:['https://example.invalid/docs'],reviewed_files:{'imported/fixture/SKILL.md':factSourceDigest('SKILL.md',method)}});
test('explicit source reviews survive generated guidance but flag real source and header changes',t=>{
 const f=fixture(t);f.save([record()]);let notes=loadFactChecks(f.root);notes.validateKnown(new Set(['fixture']));assert.equal(notes.forItem('fixture',method)[0].source_matches,true);
 fs.writeFileSync(path.join(f.folder,'SKILL.md'),method+'\n<!-- needs: generated fixture -->\nChanged guidance.\n<!-- /needs -->\n');assert.equal(loadFactChecks(f.root).forItem('fixture','')[0].source_matches,true);
 fs.writeFileSync(path.join(f.folder,'SKILL.md'),method.replace('Synthetic API source fixture.','Changed command version.'));assert.equal(loadFactChecks(f.root).forItem('fixture','')[0].source_matches,false);
 fs.writeFileSync(path.join(f.folder,'SKILL.md'),method.replace('source notes','changed API input'));assert.equal(loadFactChecks(f.root).forItem('fixture','')[0].source_matches,false);
});
test('unreviewed live-document links get an honest unknown label with no invented check date',t=>{
 const f=fixture(t),text='Read https://shopify.dev/docs/api/admin-graphql/2026-10 and https://github.com/googleworkspace/cli.';
 const row=loadFactChecks(f.root).forItem('fixture',text)[0];assert.equal(row.status,'not_checked');assert.equal(row.checked_on,undefined);assert.equal(row.sources.length,2);
 assert.deepEqual(citedLiveSources('https://shopify.dev/docs?access_token=SYNTHETIC https://user:pass@shopify.dev/docs https://example.invalid/docs'),[]);
});
test('a registry cannot fake source matches, escape an item, read hidden config or alter evidence',t=>{
 const f=fixture(t);for(const source of ['../private.env','imported/other/SKILL.md','imported/fixture/.env','imported/fixture/tests/example.md']){f.save([{...record(),reviewed_files:{[source]:'a'.repeat(64)}}]);assert.throws(()=>loadFactChecks(f.root),/Invalid reviewed/);}
 f.save([{...record(),source_matches:true}]);assert.throws(()=>loadFactChecks(f.root),/Unexpected fact-check field/);assert.equal(fs.readFileSync(path.join(f.folder,'SKILL.md'),'utf8'),method);
});
test('a review for a missing catalogue item fails instead of silently disappearing',t=>{
 const f=fixture(t);f.save([record()]);assert.throws(()=>loadFactChecks(f.root).validateKnown(new Set(['another-item'])),/does not match/);
});
