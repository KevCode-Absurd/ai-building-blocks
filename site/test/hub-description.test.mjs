import {test} from 'node:test';import assert from 'node:assert/strict';
import {hubDescription} from '../scripts/lib/hub-description.mjs';
test('short first-ranked names do not leave an undersized job description',()=>{
 const items=[{name:'Synthetic video script',summary:'Draft a script from supplied product facts.'},{name:'Synthetic shot list'},{name:'Synthetic storyboard'}];
 const text=hubDescription('Make video ads',50,items,0,1);assert.ok(text.length>=120&&text.length<=155);assert.match(text,/50 free AI skills/);assert.ok(items.some(item=>text.includes(item.name)));
});
test('paginated hubs keep their actual page and item context when only one name fits',()=>{
 const items=[{name:'Synthetic classroom question planner',summary:'Plan questions from the supplied lesson notes.'},{name:'Synthetic learning evidence review assistant'},{name:'Synthetic teaching activity outline builder'}];
 const text=hubDescription('Teach and train',200,items,1,2);assert.ok(text.length>=120&&text.length<=155);assert.match(text,/Page 2 of 2/);assert.match(text,/Synthetic classroom question planner/);assert.doesNotMatch(text,/guaranteed|minutes|customers/);
});
test('one-item hubs use the real summary and empty hubs fail instead of inventing entries',()=>{
 const text=hubDescription('Check notes',1,[{name:'Synthetic notes checker',summary:'Find gaps in the supplied notes.'}],0,1);assert.ok(text.length>=120&&text.length<=155);assert.match(text,/Synthetic notes checker/);assert.throws(()=>hubDescription('Empty fixture',0,[],0,1),/actual published items/);
});
