// Charts for research pages, drawn at build time as plain HTML and inline SVG: no script, no inline style, no chart
// library. Every bar's number is printed as text beside it, so the chart reads the same with images off, in a screen
// reader and in a search engine. Colours come from the site's tokens in src/hub.css (.rs-*), so dark mode just works.

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (x) => Number(x).toLocaleString("en-US");
const pct = (x, digits = 1) => `${Number(x).toFixed(digits).replace(/\.0+$/, "")}%`;
const round = (x) => Math.round(x * 100) / 100;

/** The figure frame: a caption, the chart, and where the numbers come from (with the CSV to download). */
function figure({ id, caption, note, csv }, inner) {
  const source = [note ? esc(note) : "", csv ? `<a href="${esc(csv)}" download>Download the data (CSV)</a>` : ""].filter(Boolean).join(" ");
  return `<figure class="rs-fig"${id ? ` id="${esc(id)}"` : ""}><figcaption class="rs-cap">${esc(caption)}</figcaption>${inner}${source ? `<p class="rs-src">${source}</p>` : ""}</figure>`;
}

/**
 * Horizontal bars. rows: [{ label, value, display?, strong? }]. value is the bar length on a 0..max scale
 * (max defaults to the largest value, or 100 when unit is "%"); display is the text printed beside it.
 */
export function bars(rows, { id, caption, note, csv, unit = "", max } = {}) {
  if (!rows.length) throw Error(`research chart ${id ?? caption}: no rows`);
  const top = max ?? (unit === "%" ? 100 : Math.max(...rows.map((r) => r.value)));
  const items = rows.map((r) => {
    const w = top ? Math.max(0, Math.min(100, (r.value / top) * 100)) : 0;
    const text = r.display ?? (unit === "%" ? pct(r.value) : fmt(r.value));
    return `<li${r.strong ? ` class="rs-strong"` : ""}><span class="rs-label">${esc(r.label)}</span><svg class="rs-bar" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect class="rs-track" width="100" height="10"/><rect class="rs-fill" width="${round(w)}" height="10"/></svg><span class="rs-value">${esc(text)}</span></li>`;
  }).join("");
  return figure({ id, caption, note, csv }, `<ol class="rs-bars">${items}</ol>`);
}

/**
 * One bar split into parts that add up to a whole, with a key. parts: [{ label, value, display? }].
 * Up to four parts; they are drawn in four steps of the text colour (solid, 60%, 30%, outline).
 */
export function split(parts, { id, caption, note, csv } = {}) {
  if (!parts.length || parts.length > 4) throw Error(`research chart ${id ?? caption}: split needs 1 to 4 parts`);
  const total = parts.reduce((s, p) => s + p.value, 0);
  let x = 0;
  const rects = parts.map((p, i) => { const w = total ? (p.value / total) * 100 : 0; const r = `<rect class="rs-part rs-p${i}" x="${round(x)}" width="${round(w)}" height="10"/>`; x += w; return r; }).join("");
  const key = parts.map((p, i) => `<li><svg class="rs-swatch" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><rect class="rs-part rs-p${i}" width="10" height="10"/></svg><span>${esc(p.label)}</span> <b>${esc(p.display ?? `${fmt(p.value)} (${pct((p.value / total) * 100)})`)}</b></li>`).join("");
  return figure({ id, caption, note, csv }, `<svg class="rs-split" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false">${rects}</svg><ul class="rs-key">${key}</ul>`);
}

/**
 * Columns over time. points: [{ label, value }] in order. Only every nth label is printed under the axis so it fits
 * on a phone; the full table is in a "See the numbers" box below.
 */
export function columns(points, { id, caption, note, csv, every = 1, valueName = "Count" } = {}) {
  if (!points.length) throw Error(`research chart ${id ?? caption}: no points`);
  const top = Math.max(...points.map((p) => p.value)) || 1;
  const w = 100 / points.length;
  const cols = points.map((p, i) => { const h = (p.value / top) * 60; return `<rect class="rs-fill" x="${round(i * w + w * 0.12)}" y="${round(60 - h)}" width="${round(w * 0.76)}" height="${round(h)}"/>`; }).join("");
  const axis = points.map((p, i) => `<span>${i % every === 0 ? esc(p.label) : ""}</span>`).join("");
  const peak = points.reduce((a, b) => (b.value > a.value ? b : a));
  const table = `<details class="rs-table"><summary>See the numbers</summary><table><thead><tr><th scope="col">Period</th><th scope="col">${esc(valueName)}</th></tr></thead><tbody>${points.map((p) => `<tr><td>${esc(p.label)}</td><td>${fmt(p.value)}</td></tr>`).join("")}</tbody></table></details>`;
  return figure({ id, caption, note, csv }, `<p class="rs-peak">Peak: ${fmt(peak.value)} in ${esc(peak.label)}</p><svg class="rs-cols" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><line class="rs-axis" x1="0" y1="60" x2="100" y2="60"/>${cols}</svg><div class="rs-ticks rs-n${points.length}">${axis}</div>${table}`);
}

/** Headline numbers as large tiles. stats: [{ value, line }]. */
export function stats(items) {
  return `<ul class="rs-stats">${items.map((s) => `<li><b>${esc(s.value)}</b><span>${esc(s.line)}</span></li>`).join("")}</ul>`;
}

/** A plain data table. head: [string], rows: [[cell]] (cells are text; numbers are formatted). */
export function table(head, rows, { caption } = {}) {
  const cell = (c) => (typeof c === "number" ? fmt(c) : esc(c));
  return `<div class="rs-scroll"><table class="rs-grid">${caption ? `<caption>${esc(caption)}</caption>` : ""}<thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${cell(c)}</td>` : `<th scope="row">${cell(c)}</th>`)).join("")}</tr>`).join("")}</tbody></table></div>`;
}

export { pct, fmt };
