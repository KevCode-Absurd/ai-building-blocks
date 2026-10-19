// The spreadsheet way: one .xlsx with every answer as a real formula you can read and change.
// Written by hand (the format is a zip of a few XML files), so it needs only a zip library, passed in:
// the build passes fflate from Node, and the site passes the same fflate, loaded only when someone downloads.
import { compiled, compute, defaults, presetOf, toExcel } from "./engine.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const col = (n) => { let s = ""; n += 1; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
const q = (sym) => `"${String(sym).replace(/"/g, "")}"`;

/** Spreadsheet number formats, one per unit. */
const numFmt = (unit, sym) => ({
  money: `${q(sym)}#,##0.00;-${q(sym)}#,##0.00`,
  smallmoney: `${q(sym)}#,##0.0000;-${q(sym)}#,##0.0000`,
  percent: '#,##0.00"%"',
  points: '0.00" points"',
  x: '0.00"x"',
  count: "#,##0",
  tokens: "#,##0",
  months: '0.0" months"',
  weeks: '0.0" weeks"',
  days: '#,##0" days"',
  hours: '#,##0.0" hours"',
  z: "0.0000",
})[unit] ?? "#,##0.00";
/** The unit as a word in the Unit column. */
export const unitWord = (unit, sym) => ({ money: sym, smallmoney: sym, percent: "%", points: "points", x: "times (x)", count: "number", tokens: "tokens", months: "months", weeks: "weeks", days: "days", hours: "hours", z: "z" })[unit] ?? "number";

/** The formula in words: each cell named by its label. */
export function formulaInWords(tool, node) {
  const label = (id) => `[${(tool.inputs.find((i) => i.id === id) ?? tool.outputs.find((o) => o.id === id))?.label ?? id}]`;
  return toExcel(node, label).replace(/\*/g, " × ").replace(/\//g, " ÷ ").replace(/""/g, "blank");
}

/**
 * Lays out the sheet: rows of cells, and where each input and answer sits.
 * Columns: A label, B value or formula, C unit, D where to find it / how it's worked out, E the name in tool.mjs.
 */
export function layout(tool, opts = {}) {
  const preset = presetOf(tool, opts.preset);
  const sym = tool.fixedCurrency ?? opts.sym ?? "$";
  const values = opts.values ?? defaults(tool, preset.id);
  const env = compute(tool, values);
  const f = compiled(tool);
  const rows = [];
  const at = {}; // id -> "B7"
  const add = (cells) => { rows.push(cells); return rows.length; };
  const text = (v, style) => ({ t: "s", v, style });

  add([text(tool.headline, "title")]);
  add([text(`A free mini tool from AI Building Blocks. Use it online at ${opts.site ?? "https://useaiblocks.com"}/tools/${tool.slug}`)]);
  add([text("Example numbers are filled in. They aren't from any real business. Type your own in the yellow cells, and every answer below works itself out.")]);
  add([text("Every answer is a formula you can read and change. To open this in Google Sheets: File > Import > Upload, then pick this file.")]);
  add([]);

  const sections = tool.sections ?? [{ id: "numbers", label: "Your numbers" }];
  const boardNote = (i) => (i.boards && !i.boards.includes(preset.id) ? `For ${tool.presets.filter((p) => i.boards.includes(p.id)).map((p) => p.label.toLowerCase()).join(", ")}s. Leave at 0 if it doesn't apply. ` : "");
  for (const s of sections) {
    const inputs = tool.inputs.filter((i) => (i.section ?? "numbers") === s.id);
    if (!inputs.length) continue;
    add([text(s.label, "head"), text("Value", "head"), text("Unit", "head"), text("Where to find it", "head"), text("Name", "head")]);
    for (const i of inputs) {
      const r = add([text(i.label), { t: "n", v: values[i.id], style: `in:${i.unit}` }, text(unitWord(i.unit, sym)), text(`${boardNote(i)}${i.where}${i.tools?.length ? ` Held in: ${i.tools.join(", ")}.` : ""}`), text(i.id, "dim")]);
      at[i.id] = `B${r}`;
    }
    add([]);
  }

  add([text("Answers", "head"), text("Value", "head"), text("Unit", "head"), text("How it's worked out", "head"), text("Name", "head")]);
  const answerRow = {};
  for (const o of tool.outputs) answerRow[o.id] = add([]); // reserve rows first, so any answer can point at any other
  for (const o of tool.outputs) {
    const r = answerRow[o.id];
    at[o.id] = `B${r}`;
  }
  for (const o of tool.outputs) {
    const r = answerRow[o.id];
    rows[r - 1] = [text(o.label), { t: "f", f: toExcel(f[o.id], (id) => at[id]), v: env[o.id], style: `out:${o.unit}` }, text(unitWord(o.unit, sym)), text(formulaInWords(tool, f[o.id])), text(o.id, "dim")];
  }

  // The same answers at a few other values of one input, side by side.
  if (tool.compare) {
    const c = tool.compare;
    add([]);
    const input = tool.inputs.find((i) => i.id === c.input);
    add([text(`${c.label}: change the yellow cells`, "head"), ...c.values.map((_, j) => text(`Column ${j + 1}`, "head")), text("Name", "head")]);
    const r0 = add([text(input.label), ...c.values.map((v) => ({ t: "n", v, style: `in:${input.unit}` })), text(input.id, "dim")]);
    const first = rows.length + 1;
    for (const o of tool.outputs) {
      const cells = [text(o.label)];
      c.values.forEach((v, j) => {
        const letter = col(1 + j);
        const ref = (id) => (id === c.input ? `${letter}${r0}` : tool.outputs.some((x) => x.id === id) ? `${letter}${first + tool.outputs.findIndex((x) => x.id === id)}` : at[id]);
        const cenv = compute(tool, { ...values, [c.input]: v });
        cells.push({ t: "f", f: toExcel(f[o.id], ref), v: cenv[o.id], style: `out:${o.unit}` });
      });
      cells.push(text(o.id, "dim"));
      add(cells);
    }
  }
  return { rows, at, env, sym };
}

/** Builds the .xlsx file. zip is { zipSync, strToU8 } from fflate. */
export function buildXlsx(tool, opts, zip) {
  const { rows, sym } = layout(tool, opts);
  const fmts = [];
  const xfs = [{ fmt: 0, font: 0, fill: 0 }];
  const xfKey = new Map([["0|0|0|0", 0]]);
  const styleOf = (style) => {
    if (!style) return 0;
    let fmt = 0, font = 0, fill = 0, wrap = 0;
    if (style === "title") font = 2;
    else if (style === "head") { font = 1; fill = 3; }
    else if (style === "dim") font = 3;
    else {
      const [kind, unit] = style.split(":");
      const code = numFmt(unit, sym);
      let id = fmts.findIndex((x) => x === code);
      if (id < 0) { fmts.push(code); id = fmts.length - 1; }
      fmt = 164 + id;
      if (kind === "in") fill = 2;
      else font = 1;
    }
    const key = `${fmt}|${font}|${fill}|${wrap}`;
    if (!xfKey.has(key)) { xfKey.set(key, xfs.length); xfs.push({ fmt, font, fill }); }
    return xfKey.get(key);
  };

  const sheetRows = rows.map((cells, r) => {
    const out = cells.map((c, k) => {
      if (!c) return "";
      const ref = `${col(k)}${r + 1}`;
      const s = styleOf(c.style);
      const sa = s ? ` s="${s}"` : "";
      if (c.t === "s") return c.v === "" ? `<c r="${ref}"${sa}/>` : `<c r="${ref}"${sa} t="inlineStr"><is><t xml:space="preserve">${esc(c.v)}</t></is></c>`;
      if (c.t === "n") return `<c r="${ref}"${sa}><v>${c.v}</v></c>`;
      const v = c.v;
      if (v === null) return `<c r="${ref}"${sa} t="str"><f>${esc(c.f)}</f><v></v></c>`;
      if (v instanceof Error) return `<c r="${ref}"${sa} t="e"><f>${esc(c.f)}</f><v>#VALUE!</v></c>`;
      return `<c r="${ref}"${sa}><f>${esc(c.f)}</f><v>${v}</v></c>`;
    }).join("");
    return `<row r="${r + 1}">${out}</row>`;
  }).join("");

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols><col min="1" max="1" width="52" customWidth="1"/><col min="2" max="4" width="18" customWidth="1"/><col min="5" max="5" width="22" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData></worksheet>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="${fmts.length}">${fmts.map((c, i) => `<numFmt numFmtId="${164 + i}" formatCode="${esc(c)}"/>`).join("")}</numFmts><fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="15"/><name val="Calibri"/></font><font><sz val="9"/><color rgb="FF808080"/><name val="Calibri"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEDEDED"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.map((x) => `<xf numFmtId="${x.fmt}" fontId="${x.font}" fillId="${x.fill}" borderId="0" xfId="0"${x.fmt ? ' applyNumberFormat="1"' : ""}${x.font ? ' applyFont="1"' : ""}${x.fill ? ' applyFill="1"' : ""}/>`).join("")}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Calculator" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`;
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": workbook,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/worksheets/sheet1.xml": sheet,
    "xl/styles.xml": styles,
  };
  // A fixed date on every entry, so the same tool always makes the same bytes.
  const mtime = new Date("2026-01-01T00:00:00Z");
  const tree = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, [zip.strToU8(v), { mtime }]]));
  return zip.zipSync(tree, { level: 6 });
}
