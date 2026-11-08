// Validate host-reported launch readiness. This module does not run a browser,
// inspect private source files, or establish conversion performance.
import schema from './schemas/landing-page-delivery.json' with { type: 'json' };

export const LANDING_PAGE_DELIVERY_SCHEMA = schema;
export const LANDING_PAGE_CHECKS = Object.freeze([
  'build', 'primary_action', 'links_assets', 'responsive',
  'keyboard_accessibility', 'brand_content',
]);

const list = value => Array.isArray(value) ? value : [];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const present = value => typeof value === 'string' && value.trim().length > 0;
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const relativePath = value => present(value) && !/^[a-z]+:|^[/\\]|\\|[\u0000-\u001f]/i.test(value) && value.split('/').every(part => part && part !== '.' && part !== '..');
const sourceEntrypoint = value => relativePath(value) && /\.(?:html?|[cm]?[jt]sx?|vue|svelte|astro|liquid)$/i.test(value);
const webURL = value => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };

/** Require a current, per-page implementation and evidence for each user-facing
 * behaviour. Assertions remain host reports; callers should preserve their receipts.
 * Pass the expected production artifacts so an omitted page or stale report fails.
 */
export function validateLandingPageDelivery(delivery, {requireLaunchable = true, artifacts, existingSiteRequired = false} = {}) {
  const errors = [], missing = new Set();
  const add = (path, message, evidence) => { errors.push({path, message}); if (evidence) missing.add(evidence); };
  if (!object(delivery)) {
    add('landing_page_delivery', 'Provide a landing-page delivery record. A rendered image is a design reference, not a working page.', 'landing_page_delivery');
    return {ok: false, errors, missing_evidence: [...missing]};
  }
  if (delivery.schema !== schema.title) add('schema', `Use ${schema.title}.`);
  if (!['LAUNCHABLE_SITE', 'DESIGN_REFERENCE'].includes(delivery.mode)) add('mode', 'Declare LAUNCHABLE_SITE or DESIGN_REFERENCE.');
  if (requireLaunchable && delivery.mode !== 'LAUNCHABLE_SITE') add('mode', 'The request needs a working landing page; a design reference does not satisfy it.', 'editable_source');
  // Design references may be useful deliverables when that is the requested scope.
  if (!requireLaunchable && delivery.mode === 'DESIGN_REFERENCE') return {ok: errors.length === 0, errors, missing_evidence: [...missing]};

  const pages = list(delivery.artifacts), expected = Array.isArray(artifacts) ? artifacts : null;
  if (!pages.length) add('artifacts', 'Record every landing page, including its editable source and verification receipts.', 'editable_source');
  const expectedBySlot = new Map(list(expected).map(a => [a?.slot_id, a]));
  const seen = new Set();
  pages.forEach((page, index) => {
    const path = `artifacts[${index}]`, source = page?.source ?? {}, checks = list(page?.checks);
    if (!present(page?.slot_id)) add(`${path}.slot_id`, 'Name the production slot.');
    else if (seen.has(page.slot_id)) add(`${path}.slot_id`, 'A landing-page slot must occur exactly once.');
    seen.add(page?.slot_id);
    const artifact = expectedBySlot.get(page?.slot_id);
    if (expected && !artifact) add(`${path}.slot_id`, 'Does not name an expected landing-page artifact.');
    if (artifact && artifact.modality !== 'interactive') add(`${path}.slot_id`, 'A launchable page must be an interactive source artifact, not a raster mockup.', 'editable_source');
    if (!relativePath(source.path)) add(`${path}.source.path`, 'Give the relative source bundle or patch path.', 'editable_source');
    else if (/\.(?:png|jpe?g|webp|avif|gif|svg|bmp|tiff?|pdf)$/i.test(source.path)) add(`${path}.source.path`, 'The source artifact cannot be a raster, vector illustration, or PDF.', 'editable_source');
    if (!digest(source.sha256)) add(`${path}.source.sha256`, 'Provide the current source bundle SHA-256.', 'source_digest');
    if (artifact && source.sha256 !== artifact.sha256) add(`${path}.source.sha256`, 'Must match the current production artifact, not an earlier design or source version.', 'current_source');
    if (artifact && source.path !== artifact.path) add(`${path}.source.path`, 'Must identify the same source artifact as the production slot.');
    if (!sourceEntrypoint(source.entrypoint)) add(`${path}.source.entrypoint`, 'Identify an editable HTML, application, or theme source entrypoint. An image, PDF or screenshot is not source.', 'source_entrypoint');
    for (const field of ['build_command', 'preview_command']) if (!present(source[field])) add(`${path}.source.${field}`, 'Record the actual command used; for a static page describe its syntax check and local server.', field);

    const site = page?.existing_site ?? {};
    if (!['REUSED', 'ADAPTED', 'GREENFIELD'].includes(site.status)) add(`${path}.existing_site.status`, 'Explain whether existing website code is reused, adapted, or this is an explicit new build.', 'existing_site_discovery');
    if (existingSiteRequired && site.status === 'GREENFIELD') add(`${path}.existing_site.status`, 'The original request requires building on the existing site. A new standalone build does not satisfy that constraint.', 'existing_site_reuse');
    if (site.status !== 'GREENFIELD' && !webURL(site.url)) add(`${path}.existing_site.url`, 'Identify the existing website with an HTTP(S) URL.', 'existing_site_discovery');
    for (const field of ['evidence', 'rationale', 'integration_target']) if (!present(site[field])) add(`${path}.existing_site.${field}`, 'Record what was inspected, what will be retained, and where the files fit.', 'existing_site_discovery');
    if (!Array.isArray(site.reused_components) || (site.status !== 'GREENFIELD' && !site.reused_components.some(present))) add(`${path}.existing_site.reused_components`, 'Name the existing navigation, design tokens, commerce controls or components retained.', 'existing_site_reuse');

    const brand = page?.brand ?? {};
    for (const field of ['brain_ref', 'evidence']) if (!present(brand[field])) add(`${path}.brand.${field}`, 'Identify the brand source and the observed implementation comparison.', 'brand_comparison');
    for (const field of ['font_refs', 'asset_refs']) if (!list(brand[field]).some(present)) add(`${path}.brand.${field}`, 'Record the actual brand font and asset sources used, including the authentic logo.', 'brand_assets');

    for (const id of LANDING_PAGE_CHECKS) {
      const rows = checks.filter(check => check?.id === id);
      if (!rows.length) add(`${path}.checks`, `Missing ${id} verification.`, id);
      for (const check of rows) {
        const checkPath = `${path}.checks[${checks.indexOf(check)}]`;
        if (check.status !== 'PASS') add(`${checkPath}.status`, `${id} must pass before the page is described as launchable.`, id);
        if (check.source_sha256 !== source.sha256 || !digest(check.source_sha256)) add(`${checkPath}.source_sha256`, 'The check must refer to the current source bundle.', 'current_source');
        if (!present(check.receipt) || !present(check.observed)) add(checkPath, 'Provide the saved check receipt and what actually happened, rather than a PASS assertion alone.', id);
      }
    }
    const responsive = checks.filter(check => check?.id === 'responsive');
    const widths = responsive.map(check => check.viewport?.width).filter(Number.isFinite);
    if (!widths.some(width => width >= 320 && width <= 430) || !widths.some(width => width >= 1024)) add(`${path}.checks`, 'Responsive verification must include an observed phone viewport (320–430 px) and a desktop viewport (at least 1024 px).', 'responsive_viewports');
    if (!Array.isArray(page?.limitations)) add(`${path}.limitations`, 'List remaining limits explicitly; an empty list means none are known.');
    else if (page.limitations.some(present)) add(`${path}.limitations`, 'Resolve launch-blocking limitations or classify this as an implementation preview rather than launchable.', 'unresolved_limitations');
  });
  if (expected) for (const artifact of expected) if (!seen.has(artifact?.slot_id)) add('artifacts', `Missing launch-readiness evidence for ${artifact?.slot_id}.`, 'page_coverage');
  return {ok: errors.length === 0, errors, missing_evidence: [...missing]};
}
