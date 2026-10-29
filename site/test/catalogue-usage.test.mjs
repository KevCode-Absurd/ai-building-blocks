import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalogueUsageHowTo} from '../scripts/lib/catalogue-usage.mjs';
const fixture={name:'Synthetic source checker',pageUrl:'https://useaiblocks.com/skills/synthetic-source-checker',steps:['Attach the supplied source notes.','Ask your AI to check the claims against those notes.','Review the result before using it.']};
test('usage schema repeats the visible catalogue steps without inventing costs, duration or source authorship',()=>{
 const steps=[...fixture.steps],schema=catalogueUsageHowTo(fixture);
 assert.equal(schema['@type'],'HowTo');assert.deepEqual(schema.step.map(step=>step.text),steps);assert.deepEqual(schema.step.map(step=>step.position),[1,2,3]);assert.ok(schema.step.every(step=>step.url===fixture.pageUrl+'#use'));assert.equal(schema.publisher['@id'],'https://useaiblocks.com/#org');
 for(const field of ['author','creator','totalTime','estimatedCost','supply','tool','yield'])assert.equal(field in schema,false);assert.deepEqual(fixture.steps,steps);
});
test('missing, malformed or excessive visible steps never produce an invented or partial how-to',()=>{
 for(const steps of [undefined,[],[''],[{step:'Read the notes.'}],Array.from({length:11},()=> 'Read the source.'),['x'.repeat(601)]])assert.equal(catalogueUsageHowTo({...fixture,steps}),null);
});
test('usage schema needs a real catalogue skill, prompt or agent anchor',()=>{
 for(const pageUrl of ['https://example.invalid/skills/synthetic','http://useaiblocks.com/skills/synthetic','https://useaiblocks.com/workflows/synthetic','https://useaiblocks.com/skills/../private'])assert.equal(catalogueUsageHowTo({...fixture,pageUrl}),null);
 assert.equal(catalogueUsageHowTo({...fixture,pageUrl:'https://useaiblocks.com/prompts/synthetic'})['@type'],'HowTo');
});
