import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const {installWorkspace,inspectWorkspace} = await import(new URL('../build-specs/kit/bootstrap.mjs', import.meta.url).href);

function fixture(t: any) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'agent-install-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const bundle=path.join(root,'bundle');
  for(const p of ['files/agent','files/.claude','processes','access']) fs.mkdirSync(path.join(bundle,p),{recursive:true});
  for(const p of ['bootstrap','guard','actions','board','process','trace'])fs.writeFileSync(path.join(bundle,'files/agent',p+'.mjs'),'// '+p+'\n');
  for(const p of ['PRODUCTION-PRINCIPLES.md','AUTOMATION-PRINCIPLES.md'])fs.writeFileSync(path.join(bundle,'files',p),'# Required principles\n');
  fs.writeFileSync(path.join(bundle,'files/.claude/settings.json'),'{"hooks":{}}');
  fs.writeFileSync(path.join(bundle,'processes/media.json'),'{"id":"media"}');
  fs.writeFileSync(path.join(bundle,'files/.claude/settings.local.json'),'{"hooks":{}}');
  fs.writeFileSync(path.join(bundle,'BUILD.md'),'# Configure from BUILD.md\nRead files/PRODUCTION-PRINCIPLES.md; copy files/.claude/settings.json only after configuration.\n');
  return {root,bundle,target:path.join(root,'client-one')};
}
test('install a distinct client workspace with inactive hooks and verify exact installed bytes',t=>{
  const f=fixture(t); const result=installWorkspace({...f,clientId:'client-one'});
  assert.equal(result.status,'INSTALLED_DRAFT');
  assert.ok(fs.existsSync(path.join(f.target,'setup/pending-claude-settings.json')));
  assert.ok(!fs.existsSync(path.join(f.target,'.claude/settings.json')));
  assert.ok(!fs.existsSync(path.join(f.target,'.claude/settings.local.json')));
  assert.ok(fs.existsSync(path.join(f.target,'setup/pending-claude-settings.local.json')));
  const instructions=fs.readFileSync(path.join(f.target,'SETUP.md'),'utf8');
  assert.doesNotMatch(instructions,/files\/|BUILD\.md/);
  assert.match(instructions,/setup\/pending-claude-settings.json/);
  assert.equal(inspectWorkspace(f.target).status,'LOCAL_FILES_VERIFIED');
  assert.equal(inspectWorkspace(f.target).deployment_ready,false);
  const second=path.join(f.root,'client-two');installWorkspace({...f,target:second,clientId:'client-two'});
  fs.writeFileSync(path.join(f.target,'agent/guard.mjs'),'changed');
  assert.equal(inspectWorkspace(f.target).status,'REPAIR_REQUIRED');
  assert.equal(inspectWorkspace(second).status,'LOCAL_FILES_VERIFIED');
  fs.appendFileSync(path.join(second,'SETUP.md'),'changed guidance');
  assert.ok(inspectWorkspace(second).errors.some((x:string)=>x.startsWith('SETUP.md: changed')));
  assert.throws(()=>installWorkspace({...f,clientId:'client-one'}),/already exists/);
  assert.equal(fs.readFileSync(path.join(f.target,'agent/guard.mjs'),'utf8'),'changed');
});
test('reject invalid clients, overlapping paths, incomplete bundles and secret files before creating a target',t=>{
  const f=fixture(t);
  for(const clientId of ['../other','CON','name/child','']) assert.throws(()=>installWorkspace({...f,clientId}));
  assert.throws(()=>installWorkspace({...f,target:path.join(f.bundle,'child'),clientId:'one'}),/separate/);
  fs.unlinkSync(path.join(f.bundle,'files/agent/guard.mjs'));
  assert.throws(()=>installWorkspace({...f,clientId:'one'}),/Incomplete/);
  assert.ok(!fs.existsSync(f.target));
  fs.writeFileSync(path.join(f.bundle,'files/agent/guard.mjs'),'restored');
  fs.writeFileSync(path.join(f.bundle,'files/.env'),'private');
  assert.throws(()=>installWorkspace({...f,clientId:'one'}),/secret/);
  assert.ok(!fs.existsSync(f.target));
});
test('doctor rejects traversal receipts and detects missing required installation records',t=>{
  const f=fixture(t);installWorkspace({...f,clientId:'one'});
  const p=path.join(f.target,'workspace-install.json'),r=JSON.parse(fs.readFileSync(p,'utf8'));
  r.files['../outside']={bytes:0,sha256:'0'.repeat(64)};delete r.files['agent/guard.mjs'];
  fs.writeFileSync(p,JSON.stringify(r));const report=inspectWorkspace(f.target);
  assert.ok(report.errors.includes('Invalid receipt path'));
  assert.ok(report.errors.some((x:string)=>x.includes('guard.mjs: no install receipt')));
});

test('fresh installs include the registered memory dependency and run the documented scoped export',t=>{
  const f=fixture(t);
  const builder=fs.readFileSync(new URL('../build-specs/make.mjs',import.meta.url),'utf8');
  const registration=builder.match(/\["([^"]+)", "tools\/org-context\.mjs",/);
  assert.ok(registration,'the store bundle must register the memory tool used by its evidence guide');
  const source=new URL(registration[1],new URL('../build-specs/',import.meta.url));
  fs.mkdirSync(path.join(f.bundle,'files/tools'));
  fs.copyFileSync(source,path.join(f.bundle,'files/tools/org-context.mjs'));
  installWorkspace({...f,clientId:'memory-client'});
  const command=(args:string[])=>spawnSync(process.execPath,['tools/org-context.mjs',...args,'--dir','context','--owner','owner-one','--workspace','workspace-one'],{cwd:f.target,encoding:'utf8'});
  const bind=command(['bind']);assert.equal(bind.status,0,bind.stdout+bind.stderr);
  const memory=command(['memory','--json']);assert.equal(memory.status,0,memory.stdout+memory.stderr);
  const exported=JSON.parse(memory.stdout);
  assert.deepEqual(exported.facts,[]);
  assert.ok(!exported.scope_error);
  const wrong=spawnSync(process.execPath,['tools/org-context.mjs','memory','--dir','context','--owner','other-owner','--workspace','workspace-one','--json'],{cwd:f.target,encoding:'utf8'});
  assert.equal(wrong.status,2,'an installed dependency must retain the owner boundary');
  assert.equal(inspectWorkspace(f.target).status,'LOCAL_FILES_VERIFIED');
});
