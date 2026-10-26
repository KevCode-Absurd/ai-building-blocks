import {test} from 'node:test';
import assert from 'node:assert/strict';
import {referenceFixtureExclusions,verifyLocalReferences} from '../src/lib/workflow-execution.ts';
const key='skills/skill-portability-checker/examples/broken-links/SKILL.md';
const text="---\nname: wrong-name\ndescription: Checks links. Use when the user wants a link check run on a folder of documents.\n---\n\n# Broken links\n\nSee [the guide](references/guide.md) and `scripts/check.py` for the steps.\n";
const bytes=s=>new TextEncoder().encode(s);
test('only the complete known negative fixture is classified and remains represented',()=>{const f={[key]:bytes(text)};assert.equal(referenceFixtureExclusions(f).length,1);assert.deepEqual(verifyLocalReferences(f),[]);assert.equal(referenceFixtureExclusions({[key]:bytes(text.replaceAll('\n','\r\n'))}).length,1);});
test('changed fixture bytes or a different example path still fail on their missing dependencies',()=>{for(const f of [{[key]:bytes(text+'Extra method.\n')},{[key.replace('broken-links','another-example')]:bytes(text)},{'skills/other/examples/broken-links/SKILL.md':bytes(text)}]){assert.deepEqual(referenceFixtureExclusions(f),[]);assert.throws(()=>verifyLocalReferences(f),/Missing local reference/);}});
test('classification never exempts operative source or unrelated supporting links',()=>{assert.throws(()=>verifyLocalReferences({[key]:bytes(text),'skills/skill-portability-checker/SKILL.md':bytes('Read [required](references/runtime.md).')}),/Missing local reference/);});
