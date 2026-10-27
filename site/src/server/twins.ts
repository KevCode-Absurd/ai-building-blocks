// Every item page has two stable twins an AI can read (docs/AI-HUB-PRD.md §9): /skills/<slug>.md and /skills/<slug>.json
// (and the same under /workflows/, /prompts/, /agents/ and /minds/). Both are made here from files the site already
// deploys: the page's /data/pages/<slug>.json (whose `facts` scripts/build-index.mjs adds) and its /skills/<slug>/SKILL.md.
// Nothing is written per page and nothing is stored. No twin is a static asset, so Cloudflare hands these addresses to the
// Worker after the asset lookup misses (assets.not_found_handling is unset); the HTML item pages never run the Worker.
const SITE = 'https://useaiblocks.com';
const KINDS = ['skills', 'prompts', 'workflows', 'agents', 'minds'] as const;
const ITEM = /^\/(skills|prompts|workflows|agents|minds)\/([a-z0-9][a-z0-9-]{0,119})(\.md|\.json)$/;
const CACHE = 'public, max-age=300, stale-while-revalidate=86400';
const MAX_PAGE = 8_000_000, MAX_SKILL = 4_000_000;
// The security headers public/_headers gives every page; _headers does not apply to a response the Worker makes.
const PAGE_HEADERS: Record<string, string> = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=(self), geolocation=()' };

type Assets = { fetch(request: Request): Promise<Response> };
type Port = { type: string; required: boolean; label?: string; what?: string };
type Facts = {
  name: string; summary: string; kind: string; path: string; job: { id: string; name: string } | null; level: string | null; thinking: string | null;
  inputs: Port[]; outputs: Port[]; steps: { slug: string; name: string; path: string; summary: string }[]; hasFiles?: boolean;
};
type Page = Record<string, unknown> & { facts?: Facts };

/** A twin address: the item's kind, slug and which twin. Item pages themselves, SKILL.md and zips are not twins. */
export function itemRoute(path: string): { kind: typeof KINDS[number]; slug: string; twin: 'md' | 'json' } | null {
  const m = path.match(ITEM);
  return m ? { kind: m[1] as typeof KINDS[number], slug: m[2], twin: m[3] === '.md' ? 'md' : 'json' } : null;
}

const list = (value: unknown): string[] => (Array.isArray(value) ? value : value == null || value === '' ? [] : [value]).map(row =>
  typeof row === 'string' ? row : row && typeof row === 'object' ? Object.values(row as Record<string, unknown>).filter(v => typeof v === 'string' && v).join(': ') : String(row ?? '')).filter(Boolean);
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
const portLine = (p: Port) => `${p.label ?? p.type}${p.what ? `: ${p.what}` : ''}${p.required ? '' : ' (optional)'}`;
const yamlLine = (key: string, value: unknown) => (value === undefined || value === null || value === '' ? '' : `${key}: ${typeof value === 'string' ? JSON.stringify(value) : String(value)}\n`);
// SKILL.md without its frontmatter, its headings one level down (outside code blocks) so they sit under ours.
function skillBody(skill: string) {
  let fence = false;
  return skill.replace(/^﻿/, '').replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n?/, '').split('\n').map(line => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    return !fence && /^#{1,5} /.test(line) ? `#${line}` : line;
  }).join('\n').trim();
}
const links = (slug: string, f: Facts) => ({
  page: `${SITE}${f.path}`, markdown: `${SITE}${f.path}.md`, json: `${SITE}${f.path}.json`,
  instructions: `${SITE}/skills/${slug}/SKILL.md`, ...(f.hasFiles ? { download: `${SITE}/skills/${slug}.zip` } : {}),
  api_item: `${SITE}/api/v1/items/${slug}`, api_document: `${SITE}/api/v1/documents/${f.kind}/${slug}`, mcp: `${SITE}/mcp`,
});
const tested = (page: Page) => (page.tested as { result?: string } | undefined)?.result === 'pass';
const source = (page: Page) => (page.source && typeof page.source === 'object' ? page.source as Record<string, string> : null);
const credits = (page: Page) => (Array.isArray(page.credits) ? page.credits : []) as { title: string; by?: string; url?: string; used?: string }[];
const nextSteps = (page: Page) => ((page.plan as { next?: { name: string; url: string; label?: string }[] } | undefined)?.next ?? []).filter(x => x && x.name && x.url);

/** The JSON twin: the page's facts, in one stable shape. */
export function twinJson(page: Page, slug: string) {
  const f = page.facts!, src = source(page), sample = page.output_sample;
  return {
    schema: 'aiblocks-page/1', id: slug, type: f.kind, name: f.name, summary: f.summary,
    headline: text(page.headline) || null, subhead: text(page.subhead) || null,
    job: f.job, level: f.level, thinking: f.thinking, tested: tested(page),
    updated: typeof page.added === 'string' ? page.added : null, first_published: typeof page.published === 'string' ? page.published : null,
    inputs: f.inputs, outputs: f.outputs, you_give: list(page.you_give), you_get: list(page.you_get),
    use_when: list(page.when), skip_when: list(page.not_for),
    ...(sample && typeof sample === 'object' ? { output_sample: sample } : {}),
    ...(text(page.output_shape) ? { output_shape: text(page.output_shape) } : {}),
    how_to_use: list(page.how_to_use), checks: list(page.judge),
    ...(f.steps.length ? { steps: f.steps.map((s, i) => ({ position: i + 1, id: s.slug, name: s.name, summary: s.summary, url: `${SITE}${s.path}` })) } : {}),
    next: nextSteps(page).map(x => ({ name: x.name, url: x.url, why: x.label ?? '' })),
    ...(f.kind === 'mind' ? { ideas: Array.isArray(page.ideas) ? page.ideas : [], hire: page.hire ?? null } : {}),
    source: src ? { by: src.by || null, repo: src.repo || null, url: src.url || null, licence: src.licence || null, original_name: src.original || null, commit: src.commit || null } : null,
    credits: credits(page), files: Array.isArray(page.files) ? page.files : [],
    links: links(slug, f),
  };
}

/** The Markdown twin: what the page says, then the full instructions. */
export function twinMarkdown(page: Page, slug: string, skill: string | null): string {
  const f = page.facts!, src = source(page), l = links(slug, f), out: string[] = [];
  const section = (title: string, rows: string[], numbered = false) => { if (rows.length) out.push(`## ${title}`, '', ...rows.map((r, i) => `${numbered ? `${i + 1}.` : '-'} ${r}`), ''); };
  out.push('---', (yamlLine('title', f.name) + yamlLine('type', f.kind) + yamlLine('url', l.page) + yamlLine('updated', page.added) + yamlLine('first_published', page.published)
    + yamlLine('job', f.job?.name) + yamlLine('tested', tested(page)) + yamlLine('licence', src?.licence) + yamlLine('source', src?.url) + yamlLine('instructions', l.instructions)).trimEnd(), '---', '');
  out.push(`# ${f.name}`, '', `> ${f.summary}`, '');
  const lead = text(page.subhead) || (text(page.headline) !== f.name ? text(page.headline) : '');
  if (lead) out.push(lead, '');
  out.push([`Free ${f.kind}`, f.job ? `for the job "${f.job.name}"` : '', f.level ? `· Level: ${f.level}` : '', f.thinking ? `· Thinking: ${f.thinking}` : '', tested(page) ? '· Tested' : '', page.added ? `· Updated ${page.added}` : ''].filter(Boolean).join(' '), '');
  section('Links', [`Page: ${l.page}`, `Instructions (SKILL.md): ${l.instructions}`, ...(l.download ? [`All files (zip): ${l.download}`] : []), `JSON version: ${l.json}`, `In your AI: connect ${l.mcp} and ask "Use AI Blocks to get ${slug}"`]);
  if (text(page.explain)) out.push('## What it does', '', text(page.explain), '');
  if (f.kind === 'mind') {
    section('Big ideas', (Array.isArray(page.ideas) ? page.ideas as { title: string; text: string }[] : []).map(i => `**${i.title}**: ${i.text}`));
    section('Hire them for', ((page.hire as { jobs?: { title: string; text: string }[] } | null)?.jobs ?? []).map(j => `**${j.title}**: ${j.text}`));
  }
  section('What you give it', list(page.you_give).length ? list(page.you_give) : f.inputs.map(portLine));
  section('What you get', list(page.you_get).length ? list(page.you_get) : f.outputs.map(portLine));
  const sample = page.output_sample as { input?: unknown; output?: { name?: string; contains?: string }[]; prerequisites?: unknown } | undefined;
  if (sample && list(sample.input).length && Array.isArray(sample.output)) {
    out.push('## Example: what goes in and what comes out', '', '### What goes in', '', ...list(sample.input).map(x => `- ${x}`), '');
    if (list(sample.prerequisites).length) out.push('### Before you start', '', ...list(sample.prerequisites).map(x => `- ${x}`), '');
    out.push('### What comes out', '', ...sample.output.filter(o => o?.name).map(o => `- **${o.name}**: ${o.contains ?? ''}`), '');
  }
  if (text(page.output_shape)) out.push('## The layout of every result', '', '```text', text(page.output_shape), '```', '');
  section('Use it when', list(page.when));
  section('Skip it when', list(page.not_for));
  section('Steps', f.steps.map(s => `[${s.name}](${SITE}${s.path}): ${s.summary}`), true);
  section('How to use it', list(page.how_to_use), true);
  section('Check your result', list(page.judge));
  section('What to do next', nextSteps(page).map(x => `[${x.name}](${x.url})${x.label ? `: ${x.label}` : ''}`));
  const credit = [
    ...(src?.by ? [`From ${src.by}${src.url ? `: ${src.url}` : ''}${src.licence ? `, shared under the ${src.licence} licence` : ''}${src.original ? ` (original name: ${src.original})` : ''}.`] : []),
    ...credits(page).map(c => `${c.url ? `[${c.title}](${c.url})` : c.title}${c.by ? `, ${c.by}` : ''}${c.used ? `: ${c.used}` : ''}`),
  ];
  section('Sources and credits', credit);
  if (skill) out.push('## Instructions (SKILL.md)', '', skillBody(skill), '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

async function readAsset(assets: Assets, origin: string, path: string, max: number): Promise<string | null> {
  const response = await assets.fetch(new Request(new URL(path, origin)));
  if (!response.ok) return null;
  const length = Number(response.headers.get('content-length'));
  if (length > max) return null;
  const body = await response.text();
  return body.length > max ? null : body;
}
const etagOf = async (body: string) => `"${[...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body)))].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('')}"`;

/** Answers a twin URL. Returns null for everything else, which the caller serves from static assets as before. */
export async function itemTwin(request: Request, assets: Assets, path: string): Promise<Response | null> {
  if (!['GET', 'HEAD'].includes(request.method)) return null;
  const route = itemRoute(path);
  if (!route) return null;
  const origin = new URL(request.url).origin;
  const raw = await readAsset(assets, origin, `/data/pages/${route.slug}.json`, MAX_PAGE);
  let page: Page | null = null;
  try { page = raw ? JSON.parse(raw) as Page : null; } catch { page = null; }
  const facts = page?.facts;
  if (!page || !facts || typeof facts.path !== 'string' || !facts.name) return null;
  // The right twin under the wrong kind: send it to the item's own address, as the pages do.
  if (facts.path !== `/${route.kind}/${route.slug}`) {
    return Response.redirect(new URL(`${facts.path}.${route.twin}`, request.url).toString(), 301);
  }
  const markdown = route.twin === 'md';
  const body = markdown
    ? twinMarkdown(page, route.slug, await readAsset(assets, origin, `/skills/${route.slug}/SKILL.md`, MAX_SKILL))
    : JSON.stringify(twinJson(page, route.slug), null, 1) + '\n';
  const etag = await etagOf(body);
  const headers: Record<string, string> = {
    'content-type': markdown ? 'text/markdown; charset=utf-8' : 'application/json; charset=utf-8',
    'cache-control': CACHE, etag, link: `<${SITE}${facts.path}>; rel="canonical"`,
    ...PAGE_HEADERS, 'access-control-allow-origin': '*',
  };
  const match = (request.headers.get('if-none-match') ?? '').split(',').map(s => s.trim().replace(/^W\//, ''));
  if (match.includes(etag)) return new Response(null, { status: 304, headers });
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers });
}
