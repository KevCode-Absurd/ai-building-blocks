#!/usr/bin/env node
// Portable declarations and host-reported receipts, NOT an agent runtime or Standard Agent export.
// node tools/agent-contract.mjs template [name]
// node tools/agent-contract.mjs check contract.json [host.json]
// node tools/agent-contract.mjs check-files contract.json
// node tools/agent-contract.mjs receipt contract.json receipt.json trusted-scope.json
// Read-only, no network, dependencies or provider calls. Exit 0 valid, 1 invalid, 2 usage/IO error.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const CONTRACT_SCHEMA = 'ai-blocks-agent-contract/1';
export const RECEIPT_SCHEMA = 'ai-blocks-agent-run-receipt/1';
export const SPEC_REFERENCE = 'https://standardagentspec.org/0.2.0/specification/agents';
const obj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const arr = v => Array.isArray(v) ? v : [];
const text = v => typeof v === 'string' && v.trim().length > 0;
const id = v => typeof v === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,127}$/.test(v);
const positive = v => Number.isSafeInteger(v) && v > 0;
const safePath = v => text(v) && !v.includes('\\') && !/[:\x00-\x1f]/.test(v) && v.split('/').every(p => p && p !== '.' && p !== '..');
const canonical = v => Array.isArray(v) ? `[${v.map(canonical).join(',')}]` : obj(v) ? `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}` : JSON.stringify(v);
export const contractDigest = contract => createHash('sha256').update(canonical(contract)).digest('hex');
const report = () => {
  const issues = [];
  return { issues, add: (code, path, message, severity = 'error') => issues.push({ code, severity, path, message }), finish: () => ({ ok: !issues.some(i => i.severity === 'error'), assurance: 'declarations-only-not-runtime-attested', issues }) };
};
const MODEL_CAPS = ['supportsToolCalls', 'supportsImages', 'supportsJsonMode'];
const HOST_CAPS = ['fileRead', 'localExecution', 'isolatedChildren'];
const RESERVED = ['subagents', 'subagent_create', 'subagent_message'];

/** An unbound portable contract. The host supplies its real identity and capabilities separately. */
export function createAgentContract(name = 'downloaded-agent') {
  return {
    schema: CONTRACT_SCHEMA,
    reference: { specification: SPEC_REFERENCE, version: '0.2.0', conformance: 'not-claimed' },
    execution: { mode: 'portable-host', enforcement: 'host-responsibility', deployedRuntime: 'NOT_IMPLEMENTED' },
    inventory: { filesIndex: 'pack.json', coverage: 'minimum-portable-profile', operationalTools: 'pack-files-not-lifecycle-tools', perRoleCapabilitiesTested: false },
    entry: name,
    agents: [{ name, sideA: { prompt: 'work', stopOnResponse: true, maxSteps: 40, sessionStop: { name: 'finish', messageProperty: 'result' }, sessionFail: { name: 'fail', messageProperty: 'error' } }, sideB: { human: true }, maxSessionTurns: 20 }],
    prompts: [{ name: 'work', files: ['AGENTS.md', 'METHOD.md'], model: 'host', tools: ['finish', 'fail'] }],
    handlers: [],
    tools: [{ name: 'finish', kind: 'receipt-only' }, { name: 'fail', kind: 'receipt-only' }],
    models: [{ name: 'host', selection: 'host-bound', requires: { supportsToolCalls: true }, fallbacks: [] }],
    requires: { fileRead: true, localExecution: true },
    scope: { tenant: 'same-owner-and-workspace', context: 'task-allowlist', memory: 'explicit-read-allowlist', contentAuthority: 'data-only', liveActions: 'host-authorization-required' },
    limits: { maxSteps: 40, maxSessionTurns: 20 },
  };
}

/** Validate this deliberately bounded profile, not arbitrary Standard Agent definitions. */
export function validateAgentContract(c, host, { packFiles } = {}) {
  const r = report(), add = r.add;
  if (!obj(c)) { add('invalid_contract', '$', 'Expected an object.'); return r.finish(); }
  const fields = (value, allowed, path) => { for (const key of Object.keys(value ?? {})) if (!allowed.includes(key)) add('unsupported_field', `${path}.${key}`, 'Unsupported field in this bounded portable profile.'); };
  fields(c, ['schema', 'reference', 'execution', 'inventory', 'entry', 'agents', 'prompts', 'handlers', 'tools', 'models', 'requires', 'scope', 'limits'], '$');
  if (c.schema !== CONTRACT_SCHEMA) add('schema', 'schema', 'Unknown contract schema.');
  if (c.reference?.conformance !== 'not-claimed') add('conformance_claim', 'reference.conformance', 'This profile does not establish Standard Agent conformance.');
  if (c.execution?.mode !== 'portable-host' || c.execution?.enforcement !== 'host-responsibility' || c.execution?.deployedRuntime !== 'NOT_IMPLEMENTED') add('runtime_not_implemented', 'execution', 'Only portable host declarations are supported; deployed execution is NOT_IMPLEMENTED.');
  for (const [key, value] of Object.entries(createAgentContract().inventory)) if (c.inventory?.[key] !== value) add('inventory_coverage', `inventory.${key}`, `Must be ${value}; this is a minimum portable profile, not a tested per-role capability inventory.`);
  const expectedScope = createAgentContract().scope;
  for (const [key, value] of Object.entries(expectedScope)) if (c.scope?.[key] !== value) add('scope_policy', `scope.${key}`, `Must be ${value}.`);
  for (const key of ['maxSteps', 'maxSessionTurns']) if (!positive(c.limits?.[key])) add('limit', `limits.${key}`, 'A positive bounded safety limit is required by this profile.');
  const registries = {};
  for (const kind of ['agents', 'prompts', 'handlers', 'tools', 'models']) {
    const map = new Map(); registries[kind] = map;
    if (!Array.isArray(c[kind])) add('registry', kind, 'Expected an array.');
    arr(c[kind]).forEach((item, i) => {
      if (!id(item?.name)) add('name', `${kind}[${i}].name`, 'Expected a non-empty simple identifier.');
      if (map.has(item?.name)) add('duplicate', `${kind}[${i}].name`, 'Names must be unique in this registry.');
      map.set(item?.name, item);
    });
  }
  if (!registries.agents.has(c.entry)) add('missing_entry', 'entry', 'Entry must name a defined agent.');
  const strings = (v, path) => {
    if (!Array.isArray(v) || v.some(x => !id(x)) || new Set(v).size !== v.length) add('identifier_list', path, 'Expected a unique list of identifiers.');
    return arr(v);
  };
  const capabilityRequirements = (requirements, known, path) => {
    if (!obj(requirements)) { add('requirements', path, 'Explicit capability requirements are required.'); return; }
    for (const [cap, needed] of Object.entries(requirements)) if (!known.includes(cap) || typeof needed !== 'boolean') add('capability', `${path}.${cap}`, 'Unknown capability or non-boolean requirement.');
  };
  capabilityRequirements(c.requires, HOST_CAPS, 'requires');
  arr(c.handlers).forEach((h, i) => {
    fields(h, ['name', 'file'], `handlers[${i}]`);
    if (!safePath(h?.file)) add('handler_file', `handlers[${i}].file`, 'Declare the deterministic handler implementation path; the host must verify it exists.');
  });
  arr(c.tools).forEach((t, i) => {
    fields(t, ['name', 'kind', 'file'], `tools[${i}]`);
    if (!['receipt-only', 'local-script'].includes(t?.kind) || (t?.kind === 'local-script' && !safePath(t?.file))) add('tool_definition', `tools[${i}]`, 'Declare a receipt-only lifecycle tool or a local-script with a safe implementation path.');
    if (RESERVED.includes(t?.name)) add('reserved_tool', `tools[${i}].name`, 'Reserved child lifecycle names cannot be supplied as local tools.');
  });
  arr(c.models).forEach((m, i) => {
    const p = `models[${i}]`;
    fields(m, ['name', 'selection', 'requires', 'fallbacks'], p);
    if (m?.selection !== 'host-bound') add('model_selection', p, 'This portable profile binds actual provider/model identities at preflight.');
    capabilityRequirements(m?.requires, MODEL_CAPS, `${p}.requires`);
    for (const fallback of strings(m?.fallbacks, `${p}.fallbacks`)) if (!registries.models.has(fallback)) add('missing_model', `${p}.fallbacks`, `Undefined fallback ${fallback}.`);
  });
  // Fallback loops cannot be made safe by a retry budget. Reject before attempting any provider call.
  const visiting = new Set(), visited = new Set();
  const visit = name => {
    if (visiting.has(name)) { add('fallback_cycle', 'models', 'Fallback graph contains a cycle.'); return; }
    if (visited.has(name)) return;
    visiting.add(name);
    for (const next of arr(registries.models.get(name)?.fallbacks)) if (registries.models.has(next)) visit(next);
    visiting.delete(name); visited.add(name);
  };
  for (const name of registries.models.keys()) visit(name);
  arr(c.prompts).forEach((p, i) => {
    fields(p, ['name', 'files', 'model', 'tools'], `prompts[${i}]`);
    if (!registries.models.has(p?.model)) add('missing_model', `prompts[${i}].model`, 'Undefined model requirement.');
    if (!arr(p?.files).length || arr(p.files).some(f => !safePath(f))) add('prompt_files', `prompts[${i}].files`, 'Prompt files must be safe pack-relative paths.');
    for (const tool of strings(p?.tools, `prompts[${i}].tools`)) if (!registries.tools.has(tool)) add('missing_tool', `prompts[${i}].tools`, `Undefined tool ${tool}.`);
  });
  arr(c.agents).forEach((a, i) => {
    const p = `agents[${i}]`, aliases = new Set();
    fields(a, ['name', 'sideA', 'sideB', 'maxSessionTurns', 'hooks', 'parentHooks'], p);
    if (!positive(a?.maxSessionTurns) || a.maxSessionTurns > c.limits?.maxSessionTurns) add('limit', `${p}.maxSessionTurns`, 'Session cap must fit the contract limit.');
    if (a?.sideA?.human && a?.sideB?.human) add('human_human_reserved', p, 'Two human-backed sides are reserved in v0.2.0.');
    // Hooks require actual installation and execution support; silently ignoring them would be unsafe.
    for (const key of ['hooks', 'parentHooks']) if (a?.[key] !== undefined) add('unsupported_hooks', `${p}.${key}`, 'This profile cannot install or enforce hooks.');
    for (const sideName of ['sideA', 'sideB']) {
      const side = a?.[sideName], sp = `${p}.${sideName}`;
      if (!obj(side)) { add('side', sp, 'Both sides must be explicit.'); continue; }
      const backing = ['human', 'prompt', 'handler'].filter(key => Object.hasOwn(side, key));
      if (backing.length !== 1) add('side_backing', sp, 'Exactly one human, prompt or handler backing is required.');
      const kind = backing[0];
      const allowed = kind === 'human' ? ['human', 'label'] : kind === 'handler' ? ['handler', 'label', 'subagents'] : ['prompt', 'label', 'subagents', 'stopOnResponse', 'maxSteps', 'sessionStop', 'sessionFail'];
      for (const key of Object.keys(side)) if (!allowed.includes(key)) add('unsupported_side_field', `${sp}.${key}`, 'Field is not supported on this side in this profile.');
      if (kind === 'human' && side.human !== true) add('human', sp, 'human must be true.');
      if (kind === 'handler' && !registries.handlers.has(side.handler)) add('missing_handler', sp, 'Undefined handler.');
      if (kind === 'prompt') {
        const prompt = registries.prompts.get(side.prompt);
        if (!prompt) add('missing_prompt', sp, 'Undefined prompt.');
        if (!positive(side.maxSteps) || side.maxSteps > c.limits?.maxSteps) add('limit', `${sp}.maxSteps`, 'Step cap must fit the contract limit.');
        if (typeof side.stopOnResponse !== 'boolean') add('stop_response', sp, 'Declare response-stop behavior explicitly; it stops a side turn, not the session.');
        for (const binding of ['sessionStop', 'sessionFail']) {
          const b = side[binding];
          if (!obj(b) || !id(b.name) || !text(b.messageProperty)) add('session_binding', `${sp}.${binding}`, 'Use an object with name and messageProperty.');
          else if (!arr(prompt?.tools).includes(b.name)) add('missing_binding_tool', `${sp}.${binding}`, 'Binding must name a tool exposed by this prompt.');
        }
        if (side.sessionStop?.name === side.sessionFail?.name) add('ambiguous_terminal', sp, 'Success and failure bindings must be distinct.');
      }
      if (side.subagents !== undefined && !Array.isArray(side.subagents)) add('relationships', sp, 'subagents must be an array.');
      arr(side.subagents).forEach((rel, j) => {
        const rp = `${sp}.subagents[${j}]`, alias = rel?.as ?? rel?.agent;
        if (!registries.agents.has(rel?.agent)) add('missing_agent', rp, 'Undefined child agent.');
        if (!id(alias) || aliases.has(alias) || registries.tools.has(alias) || RESERVED.includes(alias)) add('relationship_collision', rp, 'Relationship names must be unique across sides and cannot collide with tools or lifecycle names.');
        aliases.add(alias);
        if (!positive(rel?.maxInstances)) add('instance_cap', rp, 'This profile requires a positive instance cap.');
        if (rel?.parentCommunication !== 'implicit' && rel?.parentCommunication !== 'explicit') add('parent_communication', rp, 'Declare implicit or explicit completion delivery.');
        // Deliberately require explicit context references instead of ambient environment or history transfer.
        for (const key of Object.keys(rel ?? {})) if (!['agent', 'as', 'maxInstances', 'parentCommunication', 'contextIds', 'memoryIds'].includes(key)) add('unsupported_relationship_field', `${rp}.${key}`, 'This profile supports explicit reference transfer only.');
        strings(rel?.contextIds, `${rp}.contextIds`); strings(rel?.memoryIds, `${rp}.memoryIds`);
        if (c.requires?.isolatedChildren !== true) add('child_isolation_required', 'requires.isolatedChildren', 'Composition requires isolated child contexts.');
      });
    }
  });
  if (packFiles !== undefined) {
    if (!Array.isArray(packFiles) || packFiles.some(f => !safePath(f))) add('pack_files', 'packFiles', 'Supply observed pack-relative file paths.');
    const available = new Set(arr(packFiles));
    const required = [c.inventory?.filesIndex, ...arr(c.prompts).flatMap(p => arr(p?.files)), ...arr(c.handlers).map(h => h?.file), ...arr(c.tools).filter(t => t?.kind === 'local-script').map(t => t?.file)];
    for (const file of required) if (!available.has(file)) add('dependency_file_missing', 'packFiles', `Declared dependency is missing: ${file}.`);
  }
  if (host !== undefined) {
    if (!obj(host)) add('host', 'host', 'Expected a host capability declaration.');
    else {
      if (host.mode !== 'portable-host') add('runtime_not_implemented', 'host.mode', 'Deployed execution is NOT_IMPLEMENTED.');
      const checkCaps = (needed, actual, path) => {
        for (const [cap, required] of Object.entries(needed ?? {})) if (required && actual?.[cap] !== true) add(actual?.[cap] === false ? 'capability_unavailable' : 'capability_unknown', `${path}.${cap}`, actual?.[cap] === false ? 'Required capability is unavailable; do not claim the dependent operation ran.' : 'Capability is unverified; useful local drafts may continue, but dependent execution is unverified.', actual?.[cap] === false ? 'error' : 'warning');
      };
      checkCaps(c.requires, host.capabilities, 'host.capabilities');
      for (const m of arr(c.models)) {
        const actual = host.models?.[m?.name];
        if (actual?.identity === 'exact' && (!text(actual.provider) || !text(actual.model))) add('model_identity', `host.models.${m?.name}`, 'Exact identity needs both provider and model.');
        else if (actual?.identity !== 'exact') add('model_unknown', `host.models.${m?.name}`, 'Host model identity is unknown; never infer it from a product name or claim model-specific results.', 'warning');
        checkCaps(m?.requires, actual?.capabilities, `host.models.${m?.name}.capabilities`);
      }
    }
  }
  return r.finish();
}

/** Scope MUST come from the calling host's trusted task boundary, never from the receipt itself. */
export function validateRunReceipt(contract, receipt, { scope } = {}) {
  const r = report(), add = r.add;
  r.issues.push(...validateAgentContract(contract).issues);
  if (r.issues.some(issue => issue.severity === 'error')) return r.finish();
  if (!obj(receipt)) { add('receipt', '$', 'Expected a run receipt.'); return r.finish(); }
  if (!obj(receipt.host)) add('host_required', 'host', 'Record the host model identity (exact or unknown) and capabilities.');
  else for (const issue of validateAgentContract(contract, receipt.host).issues) {
    if (!issue.path.startsWith('host')) continue;
    const capabilityFailure = issue.code === 'capability_unavailable' && receipt.state === 'failed' && arr(receipt.events).at(-1)?.reason === 'capability_unavailable';
    r.issues.push(capabilityFailure ? { ...issue, severity: 'warning' } : issue);
  }
  if (receipt.schema !== RECEIPT_SCHEMA) add('schema', 'schema', 'Unknown receipt schema.');
  if (receipt.assurance !== 'host-reported') add('assurance', 'assurance', 'Receipts are host-reported, not runtime attestation.');
  if (receipt.contract_sha256 !== contractDigest(contract)) add('contract_digest', 'contract_sha256', 'Receipt must pin this exact contract.');
  if (!id(receipt.run_id)) add('run_id', 'run_id', 'A run/session identifier is required.');
  for (const key of ['owner_id', 'workspace_id', 'task_id']) {
    if (!id(scope?.[key])) add('trusted_scope_required', `scope.${key}`, 'Caller must supply the trusted owner, workspace and task identifiers.');
    if (!id(receipt.scope?.[key]) || receipt.scope[key] !== scope?.[key]) add('scope_mismatch', `receipt.scope.${key}`, 'Receipt must match the caller scope.');
  }
  for (const key of ['context_ids', 'memory_ids']) if (!Array.isArray(scope?.[key]) || arr(scope[key]).some(v => !id(v))) add('trusted_scope_required', `scope.${key}`, 'Caller must explicitly allow context and memory references (empty is allowed).');
  if (!Array.isArray(receipt.sources)) add('sources', 'sources', 'Record the context/memory references read, or an empty array.');
  arr(receipt.sources).forEach((source, i) => {
    const p = `sources[${i}]`, memory = source?.kind === 'memory';
    if (!['context', 'memory'].includes(source?.kind) || !id(source?.id)) add('source', p, 'Expected a named context or memory reference.');
    if (source?.owner_id !== scope?.owner_id || source?.workspace_id !== scope?.workspace_id || (!memory && source?.task_id !== scope?.task_id)) add('source_scope', p, 'Context belongs to this task; memory must belong to this owner and workspace.');
    if (!arr(scope?.[memory ? 'memory_ids' : 'context_ids']).includes(source?.id)) add('source_not_allowed', p, 'Reference was not explicitly allowed by the calling host.');
    if (source?.access !== 'read') add('memory_write_forbidden', p, 'This contract grants no context or memory write authority.');
  });
  if (!Array.isArray(receipt.children)) add('children', 'children', 'Record child calls, or an empty array.');
  arr(receipt.children).forEach((child, i) => {
    const p = `children[${i}]`, parent = arr(contract?.agents).find(a => a?.name === child?.parent_agent);
    const rel = arr(parent?.[child?.side]?.subagents).find(x => (x?.as ?? x?.agent) === child?.relationship);
    if (!['sideA', 'sideB'].includes(child?.side) || !rel) { add('undeclared_relationship', p, 'Child must use a relationship declared on the owning parent side.'); return; }
    for (const key of ['contextIds', 'memoryIds']) {
      if (!Array.isArray(child[key])) add('child_references', `${p}.${key}`, 'Explicit reference lists are required.');
      const allowed = arr(scope?.[key === 'contextIds' ? 'context_ids' : 'memory_ids']);
      for (const ref of arr(child[key])) if (!arr(rel[key]).includes(ref) || !allowed.includes(ref)) add('child_scope', `${p}.${key}`, 'Child references must fit both the relationship and trusted task allowlists.');
    }
  });
  const terminal = new Set(['succeeded', 'failed', 'cancelled', 'exhausted']);
  const transitions = { created: ['running', 'cancelled'], running: ['running', 'awaiting_human', ...terminal], awaiting_human: ['running', 'cancelled'] };
  let state = 'created', steps = 0, turns = 0;
  if (!arr(receipt.events).length) add('events', 'events', 'At least one ordered run event is required.');
  arr(receipt.events).forEach((event, i) => {
    const p = `events[${i}]`;
    if (event?.sequence !== i + 1) add('event_sequence', p, 'Events must have contiguous one-based sequence numbers.');
    if (!transitions[state]?.includes(event?.state)) add('state_transition', p, 'Invalid transition; a terminal session cannot resume. Use a new run/session receipt, preserving thread history in the host.');
    if (!Number.isSafeInteger(event?.steps) || event.steps < steps || !Number.isSafeInteger(event?.turns) || event.turns < turns) add('usage', p, 'Step and turn counts must be nonnegative monotonic integers.');
    steps = event?.steps; turns = event?.turns;
    if (steps > contract?.limits?.maxSteps || turns > contract?.limits?.maxSessionTurns) add('limit_exceeded', p, 'Recorded use exceeded the declared safety cap.');
    if (!terminal.has(event?.state) && (steps >= contract?.limits?.maxSteps || turns >= contract?.limits?.maxSessionTurns)) add('limit_not_terminal', p, 'A reached safety cap must stop the session, unless an explicit terminal result already wins.');
    if (event?.state === 'succeeded') {
      if (event.reason !== 'session_stop' || !text(event.result?.summary) || !Array.isArray(event.result?.artifacts) || event.error !== undefined) add('terminal_result', p, 'Success requires explicit session_stop and a result, with no error. A response ending a turn is not session success.');
      if (arr(event.result?.artifacts).some(a => !safePath(a?.path) || !/^[a-f0-9]{64}$/.test(a?.sha256 ?? ''))) add('artifact', `${p}.result.artifacts`, 'Artifacts need safe relative paths and SHA-256 hashes.');
    } else if (terminal.has(event?.state)) {
      if (!text(event.error?.code) || !text(event.error?.message) || event.result !== undefined) add('terminal_error', p, 'Failure, cancellation or exhaustion needs a structured error and no success result.');
      if (event.state === 'exhausted' && !((event.reason === 'max_steps' && steps === contract?.limits?.maxSteps) || (event.reason === 'max_turns' && turns === contract?.limits?.maxSessionTurns))) add('exhaustion', p, 'Exhaustion must identify the reached safety cap.');
      if (event.state === 'failed' && !['session_fail', 'error', 'capability_unavailable'].includes(event.reason)) add('failure_reason', p, 'Declare the explicit failure reason.');
      if (event.state === 'cancelled' && event.reason !== 'cancelled') add('cancellation_reason', p, 'Cancellation must be explicit.');
    } else if (event?.result !== undefined || event?.error !== undefined) add('nonterminal_payload', p, 'Result/error payloads belong to terminal events.');
    state = event?.state;
  });
  if (receipt.state !== state) add('receipt_state', 'state', 'Receipt state must match its last event.');
  return r.finish();
}

function main(args) {
  const [command, file, second, third] = args, read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  if (command === 'template') return createAgentContract(file);
  if (command === 'check' && file) return validateAgentContract(read(file), second ? read(second) : undefined);
  if (command === 'check-files' && file) {
    const contract = read(file), checked = validateAgentContract(contract);
    if (!checked.ok) return checked;
    const root = path.dirname(path.resolve(file)), index = path.join(root, contract.inventory.filesIndex);
    const listed = fs.existsSync(index) ? arr(read(index).files).map(f => f?.path) : [];
    const required = [contract.inventory.filesIndex, ...listed];
    const packFiles = required.filter(p => safePath(p) && fs.existsSync(path.join(root, p)) && fs.statSync(path.join(root, p)).isFile());
    return validateAgentContract(contract, undefined, { packFiles });
  }
  if (command === 'receipt' && file && second && third) return validateRunReceipt(read(file), read(second), { scope: read(third) });
  throw Error('Usage: agent-contract.mjs template [name] | check contract.json [host.json] | check-files contract.json | receipt contract.json receipt.json trusted-scope.json');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { const result = main(process.argv.slice(2)); process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); process.exitCode = result.ok === false ? 1 : 0; }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 2; }
}
