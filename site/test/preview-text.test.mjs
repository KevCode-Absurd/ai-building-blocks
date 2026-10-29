import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {previewChunks} from '../src/lib/preview-text.mjs';
import {buildTaskPrompt,buildTaskWorkflow} from '../src/lib/copyable-task.mjs';

test('a real large imported method keeps its complete prompt and workflow text',()=>{
  const page=JSON.parse(fs.readFileSync(new URL('../public/data/items/claude-app-builder.json',import.meta.url))).page;
  const skill=fs.readFileSync(new URL('../public/skills/claude-app-builder/SKILL.md',import.meta.url),'utf8').replace(/\r\n?/g,'\n');
  for(const content of [buildTaskPrompt(page.copyable,skill),buildTaskWorkflow(page.copyable,skill)]){
    const chunks=previewChunks(content);assert(chunks.length>1);assert.equal(chunks.join(''),content);assert(chunks.every(text=>text.length>0));
  }
});
test('Unicode, empty lines, CRLF and final newlines survive preview layout boundaries',()=>{
  for(const ending of ['', '\n', '\r\n']){
    const content=('Résumé 👩🏽‍💻 中文 العربية\r\n\r\nKeep every quoted value: "a: b".\n').repeat(600)+ending;
    assert.equal(previewChunks(content).join(''),content);
  }
});
test('short previews and a long unbroken line keep their original layout',()=>{
  for(const content of ['', 'A short preview.\n', '🧪'.repeat(20000)])assert.deepEqual(previewChunks(content),[content]);
});
