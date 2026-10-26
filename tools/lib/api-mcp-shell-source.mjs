import assert from 'node:assert/strict';

const once = (text, before, after) => {
  assert.equal(text.split(before).length - 1, 1, 'Expected one source anchor: ' + before.slice(0, 100));
  return text.replace(before, after);
};
export function applyApiMcpShellChanges(file, input) {
  let text = input.replace(/\r\n/g, '\n');
  if (file === 'site/src/App.tsx') {
    text = once(text, 'const PAGES = {', 'const PAGES = {\n  docs: () => import("./ApiMcpPage"),');
    text = once(text, '  const path = to.split(/[?#]/)[0];', '  const path = to.split(/[?#]/)[0];\n  if (["/api-and-mcp", "/api-and-mcp.html"].includes(path)) return "docs";');
    text = once(text, 'const HowItWorks = startupPage(PAGES.guide);', 'const HowItWorks = startupPage(PAGES.guide);\nconst ApiMcpPage = startupPage(PAGES.docs);');
    text = once(text, '["/ai-tools", "/tools", "/apps", "/how-it-works", "/traction"]', '["/ai-tools", "/tools", "/apps", "/how-it-works", "/traction", "/api-and-mcp", "/api-and-mcp.html"]');
    text = once(text, ') : path === "/how-it-works" ? (', ') : ["/api-and-mcp", "/api-and-mcp.html"].includes(path) ? (\n            <ApiMcpPage />\n          ) : path === "/how-it-works" ? (');
  } else if (file === 'site/src/SiteHeader.tsx') {
    text = once(text, '<a href="/api-and-mcp" data-testid="nav-api-mcp">API &amp; MCP</a>', '<Link to="/api-and-mcp" aria-current={current("/api-and-mcp")} data-testid="nav-api-mcp">API &amp; MCP</Link>');
    text = once(text, '<a href="/api-and-mcp#api" data-testid="nav-documentation">Documentation</a>', '<Link to="/api-and-mcp#api" data-testid="nav-documentation">Documentation</Link>');
  } else if (file === 'site/src/SiteFooter.tsx') {
    text = once(text, '<a href="/api-and-mcp" data-testid="footer-api-mcp">API &amp; MCP</a>', '<Link to="/api-and-mcp" data-testid="footer-api-mcp">API &amp; MCP</Link>');
    text = once(text, '<a href="/api-and-mcp#api" data-testid="footer-documentation">Documentation</a>', '<Link to="/api-and-mcp#api" data-testid="footer-documentation">Documentation</Link>');
  } else if (file === 'site/src/PublicOpening.tsx') {
    text = once(text, '["/how-it-works", "/about", "/support", "/privacy", "/terms", "/cookies", "/ai-disclaimer"]', '["/how-it-works", "/about", "/support", "/privacy", "/terms", "/cookies", "/ai-disclaimer", "/api-and-mcp", "/api-and-mcp.html"]');
  } else if (file === 'site/scripts/prerender.mjs') {
    text = once(text, 'function pageFor(url) {', 'function pageFor(url) {\n  if (url === "/api-and-mcp") return {\n    title: "API & MCP documentation", h1: "Connect with API & MCP.",\n    desc: "Connect to AI Blocks with MCP or the REST API. Get server URLs, setup instructions, authentication scopes, API examples and troubleshooting.",\n    content: fs.readFileSync("src/content/api-mcp.html", "utf8"),\n    stylesheet: fs.readdirSync(path.join(DIST, "assets")).find(file => /^ApiMcpPage-.*\\.css$/.test(file)),\n  };');
    const body = '  const body = `<main class="wrap bp-hero" data-prerendered>${header}<p class="small">${crumbs.slice(0, -1).map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join(" › ")}</p><h1 class="bp-h1">${esc(p.h1)}</h1>${p.body}${footer}</main>`;';
    text = once(text, body, '  const body = p.content\n    ? `<main class="wrap api-mcp-docs" data-prerendered>${header}${p.content}${footer}</main>`\n    : ' + body.trim().slice('const body = '.length));
    text = once(text, '  const head = [', '  const head = [\n    p.stylesheet ? `<link rel="stylesheet" href="/assets/${p.stylesheet}" />` : "",');
    text = once(text, 'let wrote = 0;', 'if (!urls.includes("/api-and-mcp")) urls.push("/api-and-mcp");\nlet wrote = 0;');
  } else throw Error('Unsupported source overlay: ' + file);
  return text;
}

export const API_MCP_SHELL_EDITED = ['site/src/App.tsx', 'site/src/SiteHeader.tsx', 'site/src/SiteFooter.tsx', 'site/src/PublicOpening.tsx', 'site/scripts/prerender.mjs'];
export const API_MCP_SHELL_ADDED = ['site/src/ApiMcpPage.tsx', 'site/src/api-mcp.css', 'site/src/raw-html.d.ts', 'site/src/content/api-mcp.html'];
