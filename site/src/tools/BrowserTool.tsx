import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { cleanText, contrastRatio, countText, csvToJson, formatJson, rankTasks, scoreOptions } from "./browser-tools.mjs";
import { NEXT_TOOLS, runNextTool } from "./next-100-tools.mjs";
import { LIBRARY_COVERAGE_TOOLS, runLibraryCoverageTool } from "./library-coverage-tools.mjs";
import NextToolInputs, { FIELD_HELP, HAS_FIELDS } from "./NextToolInputs";
import "./browser-tools.css";

const EXAMPLES: Record<string, string> = {
  "word-counter": "Paste your writing here to count its words and characters.",
  "text-cleaner": "  A little   more space than needed.  \n\n\n  A fresh paragraph.  ",
  "json-formatter": '{"project":"Example project","ready":true,"tasks":["Review","Share"]}',
  "csv-to-json": 'name,role\nAlex,Designer\nSam,"People, operations"',
  "task-priority-planner": "task,impact,urgency,hours\nFix broken checkout,5,5,2\nWrite team update,3,3,0.5\nRedesign slide template,3,1,4",
  "weighted-decision-matrix": "criterion,weight,Option A,Option B\nCost,3,8,5\nEase of use,4,6,9\nSupport,2,7,8",
};
export default function BrowserTool({ tool, toast }: { tool: { slug: string; short: string; summary: string }; toast: (s: string) => void }) {
  const coverageTool = LIBRARY_COVERAGE_TOOLS.find(t => t.slug === tool.slug);
  const nextTool = NEXT_TOOLS.find(t => t.slug === tool.slug) ?? coverageTool;
  const [input, setInput] = useState(nextTool?.example ?? EXAMPLES[tool.slug] ?? "");
  const [mode, setMode] = useState("spacing");
  const [front, setFront] = useState("#222222"), [back, setBack] = useState("#ffffff");
  const [speed, setSpeed] = useState("200");
  useEffect(() => { document.title = `${tool.short} · AI Blocks`; }, [tool.short]);
  let output = "", error = "", ratio: number | null = null;
  try {
    if (coverageTool) output = runLibraryCoverageTool(tool.slug, input);
    else if (nextTool) output = runNextTool(tool.slug, input);
    else if (tool.slug === "word-counter") {
      const wpm = Number(speed);
      if (!Number.isFinite(wpm) || wpm <= 0) throw Error("Reading speed must be greater than zero.");
      const c = countText(input, wpm);
      output = `${c.words} ${c.words === 1 ? "word" : "words"}\n${c.characters} ${c.characters === 1 ? "character" : "characters"} (including spaces)\n${c.withoutSpaces} ${c.withoutSpaces === 1 ? "character" : "characters"} (excluding spaces)\n${c.paragraphs} ${c.paragraphs === 1 ? "paragraph" : "paragraphs"}\n${c.minutes.toFixed(1)} minutes to read at ${wpm} words per minute`;
    } else if (tool.slug === "text-cleaner") output = cleanText(input, mode);
    else if (tool.slug === "contrast-checker") {
      ratio = contrastRatio(front, back);
      output = `${ratio.toFixed(2)}:1 contrast ratio\nAA normal text (4.5:1): ${ratio >= 4.5 ? "Pass" : "Fail"}\nAA large text (3:1): ${ratio >= 3 ? "Pass" : "Fail"}\nAAA normal text (7:1): ${ratio >= 7 ? "Pass" : "Fail"}\nAAA large text (4.5:1): ${ratio >= 4.5 ? "Pass" : "Fail"}`;
    } else if (tool.slug === "json-formatter") output = formatJson(input, mode === "compact");
    else if (tool.slug === "csv-to-json") output = JSON.stringify(csvToJson(input), null, 2);
    else if (tool.slug === "task-priority-planner") output = rankTasks(input).map((r, i) => `${i + 1}. ${r.task} — score ${r.score.toFixed(2)}, ${r.hours} hours`).join("\n");
    else output = scoreOptions(input).map((r, i) => `${i + 1}. ${r.option}: ${r.score.toFixed(2)} / 10`).join("\n");
  } catch (e) { error = e instanceof Error ? e.message : "Check your input."; }
  const copy = async () => { try { await navigator.clipboard.writeText(output); toast("Result copied"); } catch { toast("Select the result and copy it with your keyboard."); } };
  const download = () => {
    const extension = nextTool?.extension ?? (["json-formatter", "csv-to-json"].includes(tool.slug) ? "json" : "txt");
    const mime = extension === "json" ? "application/json" : extension === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8";
    const url = URL.createObjectURL(new Blob([output], { type: mime }));
    const a = document.createElement("a"); a.href = url; a.download = `${tool.slug}.${extension}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <main className="bp browser-tool" data-testid="browser-tool">
    <header className="wrap bp-hero"><Link to="/tools" className="back">← All tools</Link><p className="bp-kicker">Free browser tool · Your input stays on this device</p><h1 className="bp-h1">{tool.short}</h1><p className="bp-sub">{tool.summary}</p></header>
    <div className="wrap browser-tool-grid"><section>
      {nextTool && HAS_FIELDS.has(tool.slug) ? <NextToolInputs slug={tool.slug} example={nextTool.example} onChange={setInput} /> : tool.slug === "contrast-checker" ? <><label>Text colour<input data-testid="contrast-front" value={front} onChange={e => setFront(e.target.value)} spellCheck={false} /></label><label>Background colour<input data-testid="contrast-back" value={back} onChange={e => setBack(e.target.value)} spellCheck={false} /></label>{ratio !== null && <div className="contrast-preview" style={{ color: `#${front.trim().replace(/^#/, "")}`, background: `#${back.trim().replace(/^#/, "")}` }}><b>Preview your text</b><p>Check how the colours look together.</p></div>}</> : <><label htmlFor="browser-input">Your {tool.slug.includes("json") || nextTool ? "data" : "text"}</label><textarea id="browser-input" data-testid="browser-input" value={input} onChange={e => setInput(e.target.value)} spellCheck={false} /><p className="small">The starting text is an editable example.</p></>}
      {nextTool && <p className="small">{FIELD_HELP[tool.slug] ?? nextTool.help}</p>}
      {tool.slug === "text-cleaner" && <label>Change to make<select value={mode} onChange={e => setMode(e.target.value)}><option value="spacing">Clean up spaces and blank lines</option><option value="lines">Trim lines and remove empty lines</option><option value="upper">UPPER CASE</option><option value="lower">lower case</option></select></label>}
      {tool.slug === "json-formatter" && <label>Output style<select value={mode} onChange={e => setMode(e.target.value)}><option value="spacing">Formatted</option><option value="compact">Compact</option></select></label>}
      {tool.slug === "json-formatter" && <p className="small">Formatting preserves number text and duplicate keys. Other apps may interpret repeated keys differently.</p>}
      {tool.slug === "word-counter" && <label>Reading speed, words per minute<input type="number" min="1" value={speed} onChange={e => setSpeed(e.target.value)} /></label>}
      {tool.slug === "task-priority-planner" && <p className="small">CSV headings: task,impact,urgency,hours. Use 1–5 for impact and urgency. Score = impact × urgency ÷ hours. Consider deadlines, dependencies and people affected before acting.</p>}
      {tool.slug === "weighted-decision-matrix" && <p className="small">CSV headings: criterion,weight, followed by your option names. Rate each option 0–10, with higher always better. Weights need not add to 100. The weighted average reflects your judgement; test different weights before deciding.</p>}
      {tool.slug === "csv-to-json" && <p className="small">Use comma-separated columns with unique headings. Values stay as text, preserving dates, leading zeros and empty cells. Quote cells containing commas or line breaks.</p>}
    </section><section aria-live="polite"><h2 className="h3">Your result</h2>{error ? <p role="alert" className="browser-error">{error}</p> : <pre className="browser-output" data-testid="browser-output">{output || "Add your input to see the result."}</pre>}<div className="browser-actions"><button className="btn btn-primary btn-sm" disabled={!!error || !output} onClick={() => void copy()}>Copy result</button><button className="btn btn-dark btn-sm" disabled={!!error || !output} onClick={download}>Download result</button></div>
    {tool.slug === "contrast-checker" && <p className="small">Large text means at least 18 pt regular or 14 pt bold. Contrast alone does not establish accessibility. <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG contrast guidance</a>.</p>}
    {tool.slug === "word-counter" && <p className="small">Words are separated by whitespace. Reading time is an estimate based on the speed you enter. Character counts use Unicode code points, so a combined emoji may count as several.</p>}</section></div>
  </main>;
}
