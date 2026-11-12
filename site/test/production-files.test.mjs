import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {auditProductionFiles} from '../../tools/qa/check-production-files.mjs';
function fixture(run){const root=fs.mkdtempSync(path.join(os.tmpdir(),'production-file-audit-'));const put=(app,file,text='fixture')=>{const target=path.join(root,app,'dist',file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);};try{return run(root,put);}finally{fs.rmSync(root,{recursive:true,force:true});}}
test('valid downloadable code, configuration examples and licences are retained',()=>fixture((root,put)=>{
  for(const file of ['index.html','skills/tool/scripts/run.py','skills/tool/LICENSE','skills/tool/.env.example','fonts/LICENSE-space-grotesk.txt'])put('site',file);
  const result=auditProductionFiles(root);assert.equal(result.files,5);assert.equal(result.bytes,35);
}));
test('a copied internal ledger or font receipt stops publication in the affected app',()=>{
  for(const [app,file] of [['marketplace','agents/manifest.json'],['site','fonts/ai-blocks-intro-sans.json'],['site','fonts/README-intro-font.md']])fixture((root,put)=>{put(app,'index.html');put(app,file);assert.throws(()=>auditProductionFiles(root,app),/Unnecessary production files/);});
});
test('nested credentials, dependency folders and build traces stop publication',()=>{
  for(const file of ['skills/tool/.env','skills/tool/.env.local','assets/node_modules/pkg/index.js','assets/main.js.map','assets/build.log'])fixture((root,put)=>{put('site','index.html');put('site',file);assert.throws(()=>auditProductionFiles(root),/Unnecessary production files/);});
});
