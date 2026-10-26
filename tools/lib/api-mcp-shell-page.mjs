import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

/** Retain the current built shell and static navigation when adding the native docs route. */
export async function buildApiMcpShellPage(assets, contentFile) {
  const title = 'API & MCP documentation · AI Blocks';
  const description = 'Connect to AI Blocks with MCP or the REST API. Get server URLs, setup instructions, authentication scopes, API examples and troubleshooting.';
  const canonical = 'https://useaiblocks.com/api-and-mcp';
  const esc = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  let shell = await fs.readFile(path.join(assets, 'how-it-works.html'), 'utf8');
  const header = shell.match(/<header\b[^>]*data-prerendered-nav[\s\S]*?<\/header>/)?.[0];
  const footer = shell.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert(header && footer, 'Use an existing shared prerendered shell.');
  const content = await fs.readFile(contentFile, 'utf8');
  assert(!/<(?:script|style|header|footer)\b/i.test(content));
  const root = /<div id="root">[\s\S]*?<\/main><\/div>/;
  assert(root.test(shell), 'Expected the standard app root.');
  shell = shell.replace(root, () => `<div id="root"><main class="wrap api-mcp-docs" data-prerendered>${header}${content}${footer}</main></div>`);
  const graph = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': canonical + '#page', url: canonical, name: 'API & MCP documentation', description, isPartOf: { '@id': 'https://useaiblocks.com/#site' } };
  shell = shell.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  shell = shell.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g, (_, prefix) => prefix + esc(description))
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*/g, (_, prefix) => prefix + esc(title))
    .replace(/(<meta property="og:url" content=")[^"]*/, (_, prefix) => prefix + canonical)
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => prefix + canonical);
  const stylesheet = (await fs.readdir(path.join(assets, 'assets'))).filter(file => /^ApiMcpPage-.*\.css$/.test(file));
  assert.equal(stylesheet.length, 1);
  shell = shell.replace('</head>', () => `<link rel="stylesheet" href="/assets/${stylesheet[0]}" />\n<script type="application/ld+json">${JSON.stringify(graph)}</script>\n</head>`);
  await fs.writeFile(path.join(assets, 'api-and-mcp.html'), shell);
  await fs.mkdir(path.join(assets, 'metadata'), { recursive: true });
  await fs.writeFile(path.join(assets, 'metadata/api-and-mcp.json'), JSON.stringify({ title, description, canonical, robots: 'max-image-preview:large, max-snippet:-1', graph, markdown: null, image: 'https://useaiblocks.com/og/default.png' }));
}
