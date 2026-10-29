import {test} from 'node:test';
import assert from 'node:assert/strict';
import {factCheckHtml} from '../scripts/lib/fact-check-html.mjs';
const esc=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
test('static source notes escape claims and links and preserve an author date as unverified',()=>{
 const html=factCheckHtml([{status:'source_dated',source_date:'2020-01-01',scope:'Synthetic <source> & claim',sources:['https://example.invalid/?q="quoted"']}],esc);
 assert.match(html,/Source-stated date 2020-01-01/);assert.match(html,/More than 60 days old/);assert.match(html,/AI Blocks has not independently checked/);
 assert.match(html,/Synthetic &lt;source&gt; &amp; claim/);assert.match(html,/q=&quot;quoted&quot;/);assert.doesNotMatch(html,/Docs checked/);
});
test('static source notes keep a failed documentation attempt distinct from a check',()=>{
 const html=factCheckHtml([{status:'not_checked',attempted_on:'2026-10-28',scope:'Synthetic source was unavailable.',sources:['https://example.invalid/docs']}],esc);
 assert.match(html,/Not independently checked/);assert.match(html,/Source check attempted 2026-10-28/);assert.doesNotMatch(html,/Docs checked/);
 assert.equal(factCheckHtml(undefined,esc),'');
});
