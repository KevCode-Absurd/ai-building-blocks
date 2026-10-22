// Shared exact-text CSV parser used by browser utilities.
export function parseCsv(text) {
  const input = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!input.trim()) return [];
  const rows = []; let row = [], field = "", quoted = false, closed = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else field += c;
    } else if (c === "," || c === "\n") {
      row.push(field); field = ""; closed = false;
      if (c === "\n") { rows.push(row); row = []; }
    } else if (c === '"' && field === "" && !closed) quoted = true;
    else if (closed || c === '"') throw Error("Check the quotation marks. Quote the entire cell and double any quote inside it.");
    else field += c;
  }
  if (quoted) throw Error("A quoted cell has no closing quotation mark.");
  if (field !== "" || row.length || closed) rows.push([...row, field]);
  return rows;
}
export function csvToJson(text) {
  const [headers, ...rows] = parseCsv(text);
  if (!headers) return [];
  const keys = headers.map(s => s.trim());
  if (keys.some(s => !s) || new Set(keys).size !== keys.length) throw Error("Give every column a different, nonempty heading.");
  return rows.map((row, i) => {
    if (row.length !== keys.length) throw Error(`Row ${i + 2} has ${row.length} cells; expected ${keys.length}.`);
    return Object.fromEntries(keys.map((key, col) => [key, row[col]]));
  });
}
