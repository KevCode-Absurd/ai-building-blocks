#!/usr/bin/env node
// Offline local-preview-v1 only. Never contacts or verifies a sending provider.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
const namePattern = /^[a-z][a-z0-9_]{0,63}$/;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const own = (value, key) => Object.hasOwn(value, key);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const text = v => typeof v === 'string' && v.length <= 100000;
export const OUTPUT_LIMITS = Object.freeze({ textBytes: 65536, tokensPerText: 2048, previewBytes: 262144, previewBudgetBytes: 6291456, reportBytes: 2097152, totalBytes: 8388608 });
const requireThat = (ok, message) => { if (!ok) throw new Error(message); };
const escapeHtml = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
function keys(value, allowed, label) {
  requireThat(object(value), `${label} must be an object`);
  for (const key of Object.keys(value)) requireThat(!forbidden.has(key) && allowed.includes(key), `${label}: unsupported key ${key}`);
}
function safeData(value, depth = 0) {
  requireThat(depth <= 12, 'Input nesting is too deep');
  if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) {
    requireThat(!forbidden.has(key), `Unsafe key: ${key}`); safeData(item, depth + 1);
  }
}
export function validateManifest(m) {
  safeData(m);
  keys(m, ['schema', 'notice', 'fields', 'profiles', 'messages', 'sender', 'activation_dependencies'], 'manifest');
  requireThat(m.schema === 'local-preview-v1', 'schema must be local-preview-v1; vendor syntax is not supported');
  requireThat(text(m.notice) && m.notice.trim(), 'notice must identify the fixture or authorized data scope');
  requireThat(object(m.fields) && Object.keys(m.fields).length <= 100, 'fields must be a bounded object');
  for (const [name, field] of Object.entries(m.fields)) {
    requireThat(namePattern.test(name) && !forbidden.has(name), `Invalid field name: ${name}`);
    keys(field, ['type', 'required', 'fallback'], `field ${name}`);
    requireThat(['string', 'number', 'boolean'].includes(field.type) && typeof field.required === 'boolean', `Invalid field contract: ${name}`);
    if (own(field, 'fallback')) {
      requireThat(typeof field.fallback === field.type && (field.type !== 'number' || Number.isFinite(field.fallback)), `Invalid fallback type: ${name}`);
      requireThat(typeof field.fallback !== 'string' || field.fallback.length <= 10000, `Fallback too long: ${name}`);
    }
  }
  requireThat(Array.isArray(m.profiles) && m.profiles.length > 0 && m.profiles.length <= 50, 'Provide 1-50 synthetic preview profiles');
  requireThat(Array.isArray(m.messages) && m.messages.length > 0 && m.messages.length <= 50, 'Provide 1-50 messages');
  const ids = new Set();
  for (const profile of m.profiles) {
    keys(profile, ['id', 'synthetic', 'values'], 'profile');
    requireThat(text(profile.id) && namePattern.test(profile.id) && !ids.has(profile.id), 'Profile IDs must be distinct safe names'); ids.add(profile.id);
    requireThat(profile.synthetic === true && object(profile.values), 'Only explicitly synthetic preview profiles are accepted');
    for (const [name, value] of Object.entries(profile.values)) {
      requireThat(own(m.fields, name), `Unknown profile field: ${name}`);
      requireThat(typeof value === m.fields[name].type && (typeof value !== 'number' || Number.isFinite(value)), `Wrong profile type: ${name}`);
      requireThat(typeof value !== 'string' || value.length <= 10000, `Profile value too long: ${name}`);
    }
  }
  ids.clear();
  for (const message of m.messages) {
    keys(message, ['id', 'subject', 'preheader', 'body', 'cta', 'source_refs'], 'message');
    requireThat(text(message.id) && namePattern.test(message.id) && !ids.has(message.id), 'Message IDs must be distinct safe names'); ids.add(message.id);
    for (const field of ['subject', 'preheader', 'body']) requireThat(text(message[field]) && message[field].trim(), `${message.id}: ${field} is required`);
    keys(message.cta, ['label', 'url'], `${message.id}.cta`);
    requireThat(text(message.cta.label) && message.cta.label.trim() && text(message.cta.url), 'CTA label and URL required');
    requireThat(Array.isArray(message.source_refs) && message.source_refs.length > 0 && message.source_refs.every(v => text(v) && v.trim()), 'Source locators required; they are declarations, not verified facts');
  }
  keys(m.sender, ['provider', 'state', 'source_ref'], 'sender');
  requireThat(text(m.sender.provider) && m.sender.provider.trim() && m.sender.provider.length <= 256 && text(m.sender.source_ref) && m.sender.source_ref.trim() && m.sender.source_ref.length <= 4096, 'Sender identity/status needs a bounded source locator');
  requireThat(['disconnected', 'unknown', 'reported_connected'].includes(m.sender.state), 'Sender state must be disconnected, unknown or reported_connected');
  requireThat(Array.isArray(m.activation_dependencies) && m.activation_dependencies.length <= 50 && m.activation_dependencies.every(v => text(v) && v.trim() && v.length <= 4096), 'activation_dependencies must contain at most 50 bounded unresolved requirements');
  return m;
}

function renderText(template, fields, values) {
  const tokens = [];
  for (const token of template.matchAll(/\{\{([^{}]*)\}\}/g)) {
    requireThat(tokens.length < OUTPUT_LIMITS.tokensPerText, 'Template token budget exceeded');
    tokens.push(token);
  }
  const remainder = template.replace(/\{\{([^{}]*)\}\}/g, '');
  requireThat(!/[{}]/.test(remainder), 'Malformed local template token; only {{field_name}} is supported');
  const resolved = new Map();
  let expandedBytes = Buffer.byteLength(remainder);
  for (const token of tokens) {
    const name = token[1];
    requireThat(namePattern.test(name) && own(fields, name), `Unknown or unsupported token: ${token[0].slice(0, 80)}`);
    if (!resolved.has(name)) {
      const field = fields[name];
      let value = own(values, name) ? values[name] : undefined;
      if (value === undefined || value === '') value = own(field, 'fallback') ? field.fallback : undefined;
      requireThat(value !== undefined || !field.required, `Missing required field: ${name}`);
      if (value === undefined) throw new Error(`Optional field ${name} needs an explicit fallback when referenced`);
      resolved.set(name, { value: String(value), bytes: Buffer.byteLength(String(value)) });
    }
    expandedBytes += resolved.get(name).bytes;
    requireThat(expandedBytes <= OUTPUT_LIMITS.textBytes, 'Expanded text byte budget exceeded before rendering');
  }
  requireThat(expandedBytes <= OUTPUT_LIMITS.textBytes, 'Text byte budget exceeded before rendering');
  return template.replace(/\{\{([^{}]*)\}\}/g, (_, name) => resolved.get(name).value);
}
function escapedBytes(value) {
  let size = Buffer.byteLength(value);
  for (const c of value) size += c === '&' || c === "'" ? 4 : c === '<' || c === '>' ? 3 : c === '"' ? 5 : 0;
  return size;
}
function checkedUrl(raw) {
  requireThat(raw.length <= 2048, 'CTA URL exceeds the local preview length limit');
  requireThat(!/[\s\\{}\u0000-\u001f\u007f]/.test(raw), 'CTA URL cannot contain whitespace, backslashes, controls or merge tokens');
  let url; try { url = new URL(raw); } catch { throw new Error('CTA needs an explicit absolute HTTPS URL'); }
  requireThat(url.protocol === 'https:' && url.hostname && !url.username && !url.password, 'CTA needs HTTPS without embedded credentials');
  return url.href;
}
export function preflight(input) {
  const m = validateManifest(input);
  const checks = [], previews = [];
  let reservedPreviewBytes = 0;
  for (const message of m.messages) for (const profile of m.profiles) {
    const check = { message_id: message.id, profile_id: profile.id, status: 'PASS', errors: [] };
    try {
      const subject = renderText(message.subject, m.fields, profile.values);
      const preheader = renderText(message.preheader, m.fields, profile.values);
      const body = renderText(message.body, m.fields, profile.values);
      const label = renderText(message.cta.label, m.fields, profile.values);
      const url = checkedUrl(message.cta.url);
      requireThat(!/[\r\n\u0000]/.test(subject + preheader + label), 'Subject, preheader and CTA label must not contain header/control breaks');
      // Conservative upper bound before concatenation or HTML escaping. Subject appears
      // three times across text + HTML; every other value appears fewer times. Reserve
      // 4 KiB for static markup and labels. Keep 2 MiB separate for the final JSON report.
      const previewBound = 4096 + 3 * [subject, preheader, body, label, url, profile.id].reduce((n, value) => n + escapedBytes(value), 0);
      requireThat(previewBound <= OUTPUT_LIMITS.previewBytes, 'Per-preview output byte budget exceeded before rendering');
      requireThat(reservedPreviewBytes + previewBound <= OUTPUT_LIMITS.previewBudgetBytes, 'Aggregate preview byte budget exceeded before rendering');
      reservedPreviewBytes += previewBound;
      const plain = `LOCAL PREVIEW — NOT ESP VERIFIED\nSubject: ${subject}\nPreview: ${preheader}\n\n${body}\n\n${label}: ${url}\n`;
      const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escapeHtml(subject)}</title><style>body{font:17px/1.6 system-ui,sans-serif;margin:0;background:#f4f4f4;color:#181818}main{max-width:620px;margin:32px auto;padding:24px;background:white}aside{font-size:13px;color:#444}pre{white-space:pre-wrap;font:inherit;overflow-wrap:anywhere}a{overflow-wrap:anywhere}</style><main><aside>LOCAL PREVIEW — NOT ESP VERIFIED. Synthetic profile: ${escapeHtml(profile.id)}.</aside><h1>${escapeHtml(subject)}</h1><p>${escapeHtml(preheader)}</p><pre>${escapeHtml(body)}</pre><a rel="noreferrer noopener" href="${escapeHtml(url)}">${escapeHtml(label)}</a></main></html>\n`;
      previews.push({ message_id: message.id, profile_id: profile.id, plain, html });
    } catch (error) { check.status = 'FAIL'; check.errors.push(error.message); }
    checks.push(check);
  }
  return {
    report: {
      schema: 'email-draft-preflight-report/1', template_contract: 'local-preview-v1',
      local_draft_checks: checks.every(c => c.status === 'PASS') ? 'PASS' : 'FAIL',
      provider_checks: m.sender.state === 'disconnected' ? 'BLOCKED' : 'UNVERIFIED',
      activation_readiness: 'BLOCKED', provider_evidence: { ...m.sender, independently_verified: false },
      output_budget: { ...OUTPUT_LIMITS, reserved_preview_bytes: reservedPreviewBytes, reservation_is_conservative: true },
      checks, supplied_activation_dependencies: [...m.activation_dependencies],
      mandatory_remaining_checks: ['Identify the actual authorized sender and its field mapping.', 'Verify provider-native rendering, fallback behavior, links and footer.', 'Verify current offer/redemption, stock, audience permission and sequence eligibility.', 'Obtain applicable activation/send authorization; this tool grants none.'],
      limits: ['No network or provider operation performed.', 'Local-preview-v1 is not vendor template syntax.', 'Source locators and sender status are supplied declarations, not authenticated evidence.', 'No audience eligibility, offer accuracy, inbox compatibility, delivery or business outcome is certified.'],
    }, previews,
  };
}

// Deliberately relative, contained paths only. Reject links/junctions and device/ADS names.
export function containedPath(root, relative, mustExist = false) {
  requireThat(typeof relative === 'string' && relative.length > 0 && !path.isAbsolute(relative), 'Use a relative path inside the current working directory');
  const parts = relative.replace(/\\/g, '/').split('/');
  requireThat(parts.every(p => p && p !== '.' && p !== '..' && !/[<>:"|?*\u0000-\u001f]/.test(p) && !/[. ]$/.test(p) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)), 'Unsafe path component');
  const base = fs.realpathSync(root);
  let current = base;
  for (const part of parts) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    requireThat(!stat?.isSymbolicLink(), 'Symlinks and junctions are not allowed in input/output paths');
  }
  requireThat(!mustExist || fs.existsSync(current), 'Input does not exist');
  return current;
}
export function runCli(args, root = process.cwd()) {
  if (args.length === 1 && args[0] === '--help') return { exitCode: 0, message: 'Usage: node tools/email-draft-preflight.mjs --input context/email-draft.json --out output/email-preview\nBoth paths must be relative to the working directory. Output must be new. Read tools/EMAIL-DRAFT-PREFLIGHT.md. Local preview only; no provider or activation verification.' };
  requireThat(args.length === 4 && args[0] === '--input' && args[2] === '--out', 'Expected --input <relative.json> --out <new-relative-directory>');
  const inputPath = containedPath(root, args[1], true), outputPath = containedPath(root, args[3]);
  requireThat(fs.statSync(inputPath).isFile() && fs.statSync(inputPath).size <= 2_000_000, 'Input must be a JSON file no larger than 2 MB');
  requireThat(!fs.existsSync(outputPath), 'Output must be a new directory; never overwrite evidence');
  requireThat(!inputPath.startsWith(outputPath + path.sep), 'Output must not contain the input');
  const bytes = fs.readFileSync(inputPath);
  const { report, previews } = preflight(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')));
  report.input_sha256 = hash(bytes);
  report.artifacts = [];
  const outputs = [];
  for (const [i, preview] of previews.entries()) for (const [kind, ext] of [['plain', 'txt'], ['html', 'html']]) {
    const filename = `preview-${String(i + 1).padStart(3, '0')}.${ext}`;
    outputs.push({ filename, content: preview[kind] });
    report.artifacts.push({ path: filename, message_id: preview.message_id, profile_id: preview.profile_id, sha256: hash(preview[kind]) });
  }
  const reportText = JSON.stringify(report, null, 2) + '\n';
  requireThat(Buffer.byteLength(reportText) <= OUTPUT_LIMITS.reportBytes, 'Report output byte budget exceeded; no files written');
  requireThat(Buffer.byteLength(reportText) + outputs.reduce((n, item) => n + Buffer.byteLength(item.content), 0) <= OUTPUT_LIMITS.totalBytes, 'Aggregate output byte budget exceeded; no files written');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  containedPath(root, args[3]);
  fs.mkdirSync(outputPath);
  for (const item of outputs) fs.writeFileSync(path.join(outputPath, item.filename), item.content, { flag: 'wx' });
  fs.writeFileSync(path.join(outputPath, 'report.json'), reportText, { flag: 'wx' });
  return { exitCode: report.local_draft_checks === 'PASS' ? 0 : 1, message: `Local draft checks: ${report.local_draft_checks}; provider: ${report.provider_checks}; activation: BLOCKED. Report: ${args[3]}/report.json` };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const result = runCli(process.argv.slice(2)); console.log(result.message); process.exitCode = result.exitCode; }
  catch (error) { console.error(`Preflight input error: ${error.message}`); process.exitCode = 2; }
}
