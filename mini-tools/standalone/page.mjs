// Builds the download (one HTML file that works offline) and the embed page from a tool.
// Two scripts: the first sets up window.MiniTool (the engine and the tool, no screen code), so a test can run
// the maths on its own; the second draws the calculator. Everything is inline: no fonts, files or calls to fetch.

const CSS = `
:root{--bg:#fafafa;--panel:#fff;--line:#e2e2e2;--text:#0a0a0a;--muted:#575757;--faint:#8a8a8a;--in:#fff8e1;--bad:#b42318;--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#0a0a0a;--panel:#141414;--line:#2a2a2a;--text:#fff;--muted:#a3a3a3;--faint:#6e6e6e;--in:#1f1b10;--bad:#ff8a80}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
#app{max-width:1080px;margin:0 auto;padding:28px 16px 40px}h1{font-size:clamp(24px,3.4vw,34px);line-height:1.15;letter-spacing:-.02em;margin:0}
h2{font-size:16px;margin:26px 0 10px}.sub{color:var(--muted);margin:10px 0 0;max-width:44em}.small,.note,.help{font-size:13px;color:var(--muted)}
.cols{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:28px;margin-top:22px}@media (max-width:760px){.cols{grid-template-columns:minmax(0,1fr)}}
.sec{border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin:0 0 14px;background:var(--panel)}legend,summary{font:600 13px var(--mono)}details.sec summary{cursor:pointer}
.field{margin:10px 0 14px}.lbl{display:block;font-weight:600;font-size:14px;margin-bottom:4px}.box{display:flex;align-items:center;border:1px solid var(--line);border-radius:6px;background:var(--in)}
.box input{flex:1;min-width:0;border:0;background:none;padding:9px 10px;font:500 16px var(--mono);color:var(--text)}.unit.pre{padding:0 0 0 10px}
.cur{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-size:13px;color:var(--muted)}.cur input{border:1px solid var(--line);border-radius:6px;width:64px;padding:6px 8px;background:var(--panel);color:var(--text);font:500 15px var(--mono)}
.unit{padding:0 10px;color:var(--muted);font:13px var(--mono)}.help{margin:4px 0 0}.err{color:var(--bad);font-size:13px;margin:2px 0 0}.err:empty{display:none}
input[aria-invalid=true]{outline:2px solid var(--bad)}.lrow{display:flex;align-items:center;gap:4px;margin-bottom:4px}.lrow .lbl{margin:0;min-width:0}
.q{flex:none;display:inline-grid;place-items:center;width:32px;height:32px;margin:-4px 0;padding:0;border:0;border-radius:50%;background:none;color:var(--muted);cursor:pointer}.q span{display:grid;place-items:center;width:20px;height:20px;border:1px solid currentColor;border-radius:50%;font:600 12px/1 var(--mono)}
.q:hover,.q[aria-expanded=true]{color:var(--text)}.q[aria-expanded=true] span{background:var(--text);border-color:var(--text);color:var(--bg)}.q:focus-visible{outline:2px solid var(--text);outline-offset:1px}
.where{margin:0 0 6px;padding:6px 10px;border-left:2px solid var(--line);background:var(--panel)}.where[hidden]{display:none}.where p{font-size:13px;margin:0}.where p+p{margin-top:4px;color:var(--muted)}
.seg{display:inline-flex;gap:2px;padding:3px;border:1px solid var(--line);border-radius:999px;margin-bottom:10px}.seg button{border:0;background:none;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;color:var(--muted);cursor:pointer}
.seg button[aria-pressed=true]{background:var(--text);color:var(--bg)}
.answer{border:1.5px solid var(--text);border-radius:8px;padding:14px 16px;background:var(--panel);font-size:17px;font-weight:500}.answer p{margin:0 0 8px}.answer p:last-child{margin:0}
.cmp{width:100%;border-collapse:collapse;margin:16px 0 0;font-size:13.5px}.cmp th,.cmp td{text-align:right;padding:6px 8px;border-bottom:1px solid var(--line);font-family:var(--mono)}.cmp th:first-child,.cmp td:first-child{text-align:left;font-family:inherit}
.working{list-style:none;margin:0;padding:0}.working li{border-top:1px solid var(--line);padding:10px 0}.row{display:flex;justify-content:space-between;gap:12px}.row b{font-family:var(--mono);white-space:nowrap}
.working code{display:block;font:12.5px/1.5 var(--mono);color:var(--muted);margin-top:4px;overflow-wrap:anywhere}.working p{margin:4px 0 0;font-size:13.5px;color:var(--muted)}
.notes ul{padding-left:18px;color:var(--muted);font-size:14px}.credit{margin-top:28px;font:12.5px var(--mono);color:var(--faint)}.credit a,a{color:inherit}
.peek{display:none}@media (max-width:760px){.peek:not([hidden]){display:block;position:fixed;left:10px;right:10px;bottom:10px;padding:10px 12px;border:1.5px solid var(--text);border-radius:8px;background:var(--panel);font-size:14px;font-weight:500}}
body[data-embed="1"] #app{padding:14px 12px 16px}body[data-embed="1"] h1{font-size:20px}body[data-embed="1"] .credit{margin-top:14px}
`;

// The site's mark, inline, so the page asks no server for an icon.
const ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230a0a0a'/%3E%3Cg fill='%23fff'%3E%3Crect x='6' y='6' width='6' height='6'/%3E%3Crect x='20' y='6' width='6' height='6'/%3E%3Crect x='13' y='13' width='6' height='6'/%3E%3Crect x='6' y='20' width='6' height='6'/%3E%3Crect x='20' y='20' width='6' height='6'/%3E%3C/g%3E%3Cg fill='%23fff' opacity='.35'%3E%3Crect x='13' y='6' width='6' height='6'/%3E%3Crect x='6' y='13' width='6' height='6'/%3E%3Crect x='20' y='13' width='6' height='6'/%3E%3Crect x='13' y='20' width='6' height='6'/%3E%3C/g%3E%3C/svg%3E`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const asScript = (s) => s.replace(/<\/(script)/gi, "<\\/$1");

/** The maths script on its own: the engine (as written, minus "export") and the tool. Sets window.MiniTool. */
export function mathsScript(tool, engineSrc, site) {
  const engine = engineSrc.replace(/^export /gm, "");
  const json = JSON.stringify(tool).replace(/</g, "\\u003c");
  return `(function () {\n${engine}\nwindow.MiniTool = { site: ${JSON.stringify(site)}, tool: ${json}, engine: { parse, evaluate, compute, defaults, readInputs, visibleInputs, visibleOutputs, answerLines, workingLines, compareRows, nextSteps, format } };\n})();`;
}

/** One HTML file. embed: the small version for an iframe, with a credit link back to the site. */
export function buildHtml(tool, { engineSrc, uiSrc, site, embed = false }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(tool.name)} · AI Blocks</title>
<meta name="description" content="${esc(tool.summary)}">
<link rel="icon" href="${ICON}">
${embed ? `<meta name="robots" content="noindex">\n` : `<link rel="canonical" href="${esc(site)}/tools/${esc(tool.slug)}">\n`}<style>${CSS}</style>
</head>
<body data-embed="${embed ? 1 : 0}">
<main id="app"></main>
<noscript><p>This calculator needs JavaScript. You can also use the spreadsheet version at ${esc(site)}/tools/${esc(tool.slug)}</p></noscript>
<script id="mini-tool-maths">
${asScript(mathsScript(tool, engineSrc, site))}
</script>
<script id="mini-tool-ui">
${asScript(uiSrc)}
</script>
</body>
</html>
`;
}
