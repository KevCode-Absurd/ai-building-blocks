#!/usr/bin/env node
// Deterministic local installation. No model calls, package installs or connector writes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = (root, file) => path.relative(root, file).replaceAll('\\', '/');
const inside = (root, file) => { const r = path.relative(root, file); return r !== '..' && !r.startsWith('..' + path.sep) && !path.isAbsolute(r); };
const REQUIRED = ['agent/bootstrap.mjs', 'agent/guard.mjs', 'agent/actions.mjs', 'agent/board.mjs', 'agent/process.mjs', 'agent/trace.mjs', 'PRODUCTION-PRINCIPLES.md', 'AUTOMATION-PRINCIPLES.md'];
function clientName(value) {
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(value ?? '') || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(value)) throw Error('Use a client ID of 1-63 lowercase letters, numbers or hyphens; no device names.');
  return value;
}
function plainDirectory(folder) {
  const stat = fs.lstatSync(folder);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Expected a real directory, not a link.');
  return fs.realpathSync(folder);
}
function bundleFiles(bundle) {
  const rows = []; let total = 0;
  function walk(dir, prefix) {
    for (const e of fs.readdirSync(dir, {withFileTypes: true}).sort((a,b) => a.name.localeCompare(b.name))) {
      const source = path.join(dir, e.name), rel = prefix + e.name;
      if (e.isSymbolicLink() || !inside(bundle, fs.realpathSync(source))) throw Error('Bundle contains a linked or external file.');
      if (e.isDirectory()) { walk(source, rel + '/'); continue; }
      if (!e.isFile() || /(^|\/)\.env(?:\.|$)/i.test(rel)) throw Error('Bundle contains an unsupported or secret configuration file.');
      const size = fs.statSync(source).size;
      if (rows.length >= 10000 || total + size > 100_000_000) throw Error('Bundle exceeds the local installer budget.');
      const bytes = fs.readFileSync(source); total += bytes.length;
      rows.push({path: rel, bytes});
    }
  }
  for (const dir of ['files', 'processes', 'access']) {
    const folder = path.join(bundle, dir); plainDirectory(folder);
    walk(folder, dir === 'files' ? '' : dir + '/');
  }
  for (const required of REQUIRED) if (!rows.some(r => r.path === required)) throw Error('Incomplete build bundle: ' + required);
  return rows;
}

export function installWorkspace({bundle, target, clientId}) {
  clientName(clientId); bundle = plainDirectory(path.resolve(bundle)); target = path.resolve(target);
  // Existing targets are never merged or overwritten, including an empty directory or dangling link.
  try { fs.lstatSync(target); throw Error('Target already exists; choose a new client workspace.'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const parent = plainDirectory(path.dirname(target));
  if (path.resolve(parent, path.basename(target)) !== target) throw Error('Target parent resolves through a link; use its real path.');
  if (inside(bundle, target) || inside(target, bundle)) throw Error('Source bundle and target must be separate.');
  const rows = bundleFiles(bundle);
  for (const row of rows) if (['workspace-install.json','.gitignore','agents.md','setup.md'].includes(row.path.toLowerCase())) throw Error('Bundle collides with installer-owned files.');
  const setup = path.join(bundle,'BUILD.md');
  if (!fs.existsSync(setup) || !fs.lstatSync(setup).isFile() || fs.lstatSync(setup).isSymbolicLink()) throw Error('Missing or linked BUILD.md.');
  if (fs.statSync(setup).size > 2_000_000) throw Error('Setup instructions exceed the installer budget.');
  // Hooks stay inactive until configuration and a host-specific capability test have succeeded.
  for (const row of rows) {
    if (row.path.toLowerCase() === '.claude/settings.json') row.path = 'setup/pending-claude-settings.json';
    if (row.path.toLowerCase() === '.claude/settings.local.json') row.path = 'setup/pending-claude-settings.local.json';
  }
  if (new Set(rows.map(r => r.path.toLowerCase())).size !== rows.length) throw Error('Bundle destinations collide.');
  const files = Object.fromEntries(rows.map(r => [r.path, {sha256:digest(r.bytes), bytes:r.bytes.length}]));
  fs.mkdirSync(target);
  for (const row of rows) { const file = path.join(target, row.path); fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, row.bytes, {flag:'wx'}); }
  for (const dir of ['context/org-context', 'context/media-buying', 'jobs', 'board', 'reports', 'agent-state', 'agents']) fs.mkdirSync(path.join(target,dir), {recursive:true});
  const state = {schema:'agent-workspace-install/1', client_id:clientId, installed_utc:new Date().toISOString(), mode:'local-draft', files,
    capabilities:{framework_installed:true, specialist_packs_verified:false, brand_context_verified:false, connector_readback_verified:false, host_hooks_active:false, hosted_authentication_verified:false, live_execution_authorized:false}};
  fs.writeFileSync(path.join(target,'.gitignore'), '.env\n.env.*\n!.env.example\nnode_modules/\ncontext/\nwarehouse/*.duckdb*\nwarehouse/data/\nagent-state/\nboard/\njobs/\ncreatives/\nreports/\n', {flag:'wx'});
  fs.writeFileSync(path.join(target,'AGENTS.md'), `# ${clientId} agent workspace\n\nRead SETUP.md and workspace-install.json first. This is a local draft workspace, not a deployed service. Read PRODUCTION-PRINCIPLES.md and AUTOMATION-PRINCIPLES.md. Use only this client's context and account scope. Specialist packs, brand sources, connector readback, authority and host enforcement must be verified before execution. Installation grants no send, spend or publish authority. Keep private context and job artifacts out of public Git.\n`, {flag:'wx'});
  const instructions = fs.readFileSync(setup,'utf8').replaceAll('files/.claude/settings.local.json','setup/pending-claude-settings.local.json').replaceAll('files/.claude/settings.json','setup/pending-claude-settings.json').replaceAll('files/','').replaceAll('BUILD.md','SETUP.md');
  fs.writeFileSync(path.join(target,'SETUP.md'), '# Installed framework\n\nThe bootstrap installation is complete. Do not run the install command below again. Use the setup steps to configure this client. Hook settings are held in setup/ and are inactive.\n\n'+instructions,{flag:'wx'});
  for (const rel of ['AGENTS.md','SETUP.md','.gitignore']) {
    const bytes=fs.readFileSync(path.join(target,rel)); state.files[rel]={sha256:digest(bytes),bytes:bytes.length};
  }
  fs.writeFileSync(path.join(target,'workspace-install.json'), JSON.stringify(state,null,2)+'\n', {flag:'wx'});
  return {status:'INSTALLED_DRAFT', target, client_id:clientId, files:rows.length, next:'Run node agent/bootstrap.mjs doctor here, then complete SETUP.md. No connectors or model providers have been activated.'};
}

export function inspectWorkspace(folder) {
  const root = plainDirectory(path.resolve(folder));
  const receipt = JSON.parse(fs.readFileSync(path.join(root,'workspace-install.json'),'utf8'));
  if (receipt.schema !== 'agent-workspace-install/1') throw Error('Unsupported install receipt.');
  clientName(receipt.client_id);
  const errors = [];
  for (const [rel, expected] of Object.entries(receipt.files ?? {})) {
    const file = path.resolve(root,rel);
    if (!inside(root,file) || rel.includes('\\') || path.isAbsolute(rel)) { errors.push('Invalid receipt path'); continue; }
    try {
      const st=fs.lstatSync(file);
      if (!st.isFile() || st.isSymbolicLink() || !inside(root,fs.realpathSync(file))) throw Error('outside or linked');
      const bytes=fs.readFileSync(file);
      if (bytes.length!==expected.bytes || digest(bytes)!==expected.sha256) errors.push(rel+': changed since install');
    } catch { errors.push(rel+': missing or inaccessible'); }
  }
  for (const required of [...REQUIRED,'AGENTS.md','SETUP.md','.gitignore']) if (!receipt.files?.[required]) errors.push(required+': no install receipt');
  return {status:errors.length?'REPAIR_REQUIRED':'LOCAL_FILES_VERIFIED', client_id:receipt.client_id, checked_files:Object.keys(receipt.files ?? {}).length, errors,
    deployment_ready:false, explanation:'Local file hashes only. No authenticated tenancy, model access, scheduler, specialist-pack completeness, source freshness, connector access or live execution has been certified.'};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2), command=args.shift();
    if (command==='doctor') { const result=inspectWorkspace(args[0] ?? process.cwd()); console.log(JSON.stringify(result,null,2)); if(result.errors.length)process.exitCode=1; }
    else if(command==='install') {
      const opts={}; for(let i=0;i<args.length;i+=2){ if(!['--to','--client','--bundle'].includes(args[i]) || !args[i+1])throw Error('Usage: install --to <new-folder> --client <client-id> [--bundle <build-folder>]');opts[args[i]]=args[i+1]; }
      if(!opts['--to']||!opts['--client'])throw Error('install requires --to and --client');
      console.log(JSON.stringify(installWorkspace({bundle:opts['--bundle'] ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),target:opts['--to'],clientId:opts['--client']}),null,2));
    } else throw Error('Usage: bootstrap.mjs install --to <new-folder> --client <client-id>, or bootstrap.mjs doctor [workspace]');
  } catch(e) { console.error(e.message); process.exitCode=2; }
}
