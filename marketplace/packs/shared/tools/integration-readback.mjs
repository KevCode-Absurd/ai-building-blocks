#!/usr/bin/env node
// Compare an intended integration change with captured provider readback. No network or writes.
// This checks submitted evidence, not authenticity, authorization, or live provider state.
import { readFileSync, lstatSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
const text = v => typeof v === 'string' && v.trim().length > 0 && v.length <= 2048;
const timestamp = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
const scalar = v => v === null || typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.length <= 10000);
const providers = ['meta', 'shopify', 'messaging'];
const canonical = v => Array.isArray(v) ? `[${v.map(canonical).join(',')}]` : plain(v) ? `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}` : JSON.stringify(v);
export const integrationDigest = plan => createHash('sha256').update(canonical(plan)).digest('hex');
export const LIVE_CHECKS = Object.freeze({
  meta: ['destination', 'audience', 'spend_controls', 'schedule', 'tracking', 'creative_preview'],
  shopify: ['catalogue_inventory', 'checkout_test', 'payments', 'shipping', 'taxes', 'policies'],
  messaging: ['sender_identity', 'consent_suppression', 'recipient_count', 'links_footer', 'inbox_test', 'trigger_exit_test'],
});

export function integrationTemplate(provider = 'meta') {
  if (!providers.includes(provider)) throw new Error('provider must be meta, shopify or messaging');
  return {
    schema: 'integration-plan/1', provider, accountId: 'REPLACE_WITH_VERIFIED_ACCOUNT', environment: 'sandbox', stage: 'draft',
    objects: [{ key: 'primary', fields: { status: provider === 'meta' ? 'PAUSED' : 'DRAFT' } }],
  };
}

/** Readback fields use the same normalized names/units as the plan. Keep the raw tool result separately. */
export function checkIntegrationReadback(plan, readback, { now = Date.now(), maxAgeMinutes = 15 } = {}) {
  const findings = [];
  const add = (code, path, message) => findings.push({ code, path, message });
  const result = status => ({ schema: 'integration-readback-check/1', status, findings,
    remaining: findings.map(f => ({ check: f.path, reason: f.message })),
    planDigest: plain(plan) ? integrationDigest(plan) : null,
    assurance: 'submitted-readback-only-not-authenticated', authorityGranted: false, externalActionsExecuted: 0,
    resume: 'Keep completed artifacts. Resolve only remaining checks; rediscover current tool capabilities and read back current provider state before resuming. Reuse authority only while its exact scope and limits still apply.' });
  const allowed = (obj, keys, path) => {
    if (!plain(obj)) { add('INVALID', path, 'Expected an object.'); return false; }
    for (const k of Object.keys(obj)) if (!keys.includes(k)) add('INVALID', `${path}.${k}`, 'Unknown field.');
    return true;
  };
  if (!Number.isFinite(now) || !Number.isFinite(maxAgeMinutes) || maxAgeMinutes <= 0 || maxAgeMinutes > 1440) {
    add('INVALID', 'clock', 'Use a finite clock and freshness window from 0 to 1440 minutes.'); return result('INVALID');
  }
  if (!allowed(plan, ['schema', 'provider', 'accountId', 'environment', 'stage', 'objects'], 'plan')) return result('INVALID');
  if (plan.schema !== 'integration-plan/1' || !providers.includes(plan.provider) || !text(plan.accountId) || plan.accountId.startsWith('REPLACE_') || !['sandbox', 'production'].includes(plan.environment) || !['draft', 'live'].includes(plan.stage)) add('INVALID', 'plan', 'Supply schema, supported provider, verified accountId, sandbox/production environment and draft/live stage.');
  if (!Array.isArray(plan.objects) || !plan.objects.length || plan.objects.length > 200) add('INVALID', 'plan.objects', 'Supply 1 to 200 intended objects.');
  const keys = new Set();
  for (const [i, obj] of (Array.isArray(plan.objects) ? plan.objects : []).entries()) {
    if (!allowed(obj, ['key', 'fields'], `plan.objects[${i}]`)) continue;
    if (!text(obj.key) || keys.has(obj.key)) add('INVALID', `plan.objects[${i}].key`, 'Each object needs a unique nonempty key.');
    keys.add(obj.key);
    if (!plain(obj.fields) || !Object.keys(obj.fields).length || Object.keys(obj.fields).length > 100 || Object.entries(obj.fields).some(([k, v]) => !text(k) || !scalar(v))) add('INVALID', `plan.objects[${i}].fields`, 'Use 1 to 100 exact normalized scalar fields, including status.');
    if (!text(obj.fields?.status)) add('INVALID', `plan.objects[${i}].fields.status`, 'Record the exact expected provider status.');
    if (plan.stage === 'draft' && !['DRAFT', 'PAUSED', 'UNPUBLISHED', 'HIDDEN', 'MANUAL'].includes(typeof obj.fields?.status === 'string' ? obj.fields.status.toUpperCase() : '')) add('INVALID', `plan.objects[${i}].fields.status`, 'A draft must remain non-live. Use the provider status, not a local readiness label.');
  }
  if (findings.length) return result('INVALID');
  if (readback == null) {
    add('MISSING_READBACK', 'connection', `Connect the intended ${plan.provider} ${plan.environment} account ${plan.accountId} and capture current readback; a local artifact cannot verify it.`);
    return result('DEPENDENCY_REQUIRED');
  }
  if (!allowed(readback, ['schema', 'planDigest', 'provider', 'accountId', 'environment', 'observedAt', 'sourceRef', 'objects', 'checks'], 'readback')) return result('INVALID');
  if (readback.schema !== 'integration-readback/1' || !text(readback.sourceRef) || !timestamp(readback.observedAt)) add('INVALID', 'readback', 'Supply schema, an ISO-8601 timestamp with timezone, and a raw provider-result reference.');
  if (!Array.isArray(readback.objects) || readback.objects.length > 200 || !Array.isArray(readback.checks) || readback.checks.length > 100) add('INVALID', 'readback', 'Provide bounded objects and checks arrays.');
  const observed = new Map(), providerIds = new Set();
  for (const [i, obj] of (Array.isArray(readback.objects) ? readback.objects : []).entries()) {
    if (!allowed(obj, ['key', 'providerId', 'fields'], `readback.objects[${i}]`)) continue;
    if (!text(obj.key) || observed.has(obj.key) || !text(obj.providerId) || providerIds.has(obj.providerId) || !keys.has(obj.key)) add('INVALID', `readback.objects[${i}]`, 'Use unique expected keys and real unique provider object IDs; do not silently include unrelated objects.');
    if (!plain(obj.fields) || Object.keys(obj.fields).length > 100 || Object.values(obj.fields).some(v => !scalar(v))) add('INVALID', `readback.objects[${i}].fields`, 'Readback fields must be normalized scalar values.');
    observed.set(obj.key, obj); providerIds.add(obj.providerId);
  }
  const checks = new Map();
  for (const [i, check] of (Array.isArray(readback.checks) ? readback.checks : []).entries()) {
    if (!allowed(check, ['name', 'status', 'sourceRef', 'observedAt', 'detail'], `readback.checks[${i}]`)) continue;
    if (!text(check.name) || checks.has(check.name) || !LIVE_CHECKS[plan.provider].includes(check.name) || !['PASS', 'FAIL', 'NOT_RUN'].includes(check.status) || !text(check.detail) || (check.status !== 'NOT_RUN' && (!text(check.sourceRef) || !timestamp(check.observedAt)))) add('INVALID', `readback.checks[${i}]`, 'Use one known check with PASS/FAIL/NOT_RUN, detail, and ISO-8601 timestamp with timezone/source for performed checks.');
    checks.set(check.name, check);
  }
  if (findings.length) return result('INVALID');
  for (const field of ['provider', 'accountId', 'environment']) if (readback[field] !== plan[field]) add('SCOPE_MISMATCH', `readback.${field}`, 'Readback does not belong to this intended provider/account/environment.');
  if (readback.planDigest !== integrationDigest(plan)) add('PLAN_CHANGED', 'readback.planDigest', 'Readback is not bound to the current exact plan. Reconcile current provider state after a changed plan.');
  const fresh = (value, path) => { const age = now - Date.parse(value); if (age < -60000 || age > maxAgeMinutes * 60000) add('STALE', path, 'Readback is stale or future-dated; capture current state.'); };
  fresh(readback.observedAt, 'readback.observedAt');
  for (const obj of plan.objects) {
    const actual = observed.get(obj.key);
    if (!actual) { add('MISSING_OBJECT', `objects.${obj.key}`, 'No provider object readback. Preserve the draft and resume this object after access is available.'); continue; }
    for (const [field, expected] of Object.entries(obj.fields)) if (!Object.hasOwn(actual.fields, field) || actual.fields[field] !== expected) add('FIELD_MISMATCH', `objects.${obj.key}.${field}`, 'Provider field does not exactly match the intended value and type. Inspect the raw result; do not silently normalize different units or overwrite.');
  }
  // Failed live checks remain visible even in a successful draft build; drafts never imply live readiness.
  for (const [name, check] of checks) {
    if (check.status !== 'NOT_RUN') fresh(check.observedAt, `checks.${name}.observedAt`);
    if (check.status === 'FAIL') add('CHECK_FAILED', `checks.${name}`, check.detail);
  }
  if (plan.stage === 'live') for (const name of LIVE_CHECKS[plan.provider]) if (!checks.has(name) || checks.get(name).status === 'NOT_RUN') add('CHECK_REQUIRED', `checks.${name}`, `Run ${name} in this account/environment and retain its raw receipt; local simulation is not provider verification.`);
  if (findings.length) return result('REVIEW_REQUIRED');
  return result(plan.stage === 'draft' ? 'DRAFT_READBACK_MATCHED' : 'LIVE_READBACK_MATCHED');
}

function readJson(file) {
  const stat = lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 4 * 1024 * 1024) throw new Error('Input must be a regular non-symlink JSON file up to 4 MB.');
  return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [command, planPath, readbackPath] = process.argv.slice(2);
    if (command === 'template') console.log(JSON.stringify(integrationTemplate(planPath), null, 2));
    else if (command === 'digest' && planPath) console.log(integrationDigest(readJson(planPath)));
    else if (command === 'check' && planPath) {
      const receipt = checkIntegrationReadback(readJson(planPath), readbackPath ? readJson(readbackPath) : null);
      console.log(JSON.stringify(receipt, null, 2));
      process.exitCode = receipt.status === 'INVALID' ? 2 : /_MATCHED$/.test(receipt.status) ? 0 : 1;
    } else throw new Error('Usage: integration-readback.mjs template [meta|shopify|messaging] | digest plan.json | check plan.json [readback.json]');
  } catch (error) { console.error(JSON.stringify({ status: 'INVALID', message: error.message, externalActionsExecuted: 0, authorityGranted: false })); process.exitCode = 2; }
}
