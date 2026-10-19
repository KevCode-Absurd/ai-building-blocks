// The mini tools' one formula engine. Every answer on the site, in the download, in the spreadsheet and in the
// AI version comes from the same formula strings in each tool's tool.mjs, so the five ways can't disagree.
//
// A formula is a small spreadsheet-style expression: + - * / ^, comparisons (= <> < <= > >=), and
// IF, AND, OR, NOT, MIN, MAX, ABS, SQRT, LN, EXP, ROUND, ROUNDUP, ROUNDDOWN, NORMSINV, NA() and HAS(x).
// NA() means "no answer" (a blank cell in the spreadsheet, None in Python). HAS(x) is true when x has an answer.
// Evaluation is strict, like a spreadsheet: dividing by zero or doing sums with "no answer" is an error,
// so every formula has to guard its own edge cases. The worked examples catch any that don't.
//
// Plain JavaScript with no imports: the download pages inline this file as it is (minus the word "export").

const TOKEN = /\s*(?:(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|("")|(<=|>=|<>|[-+*/^(),<>=]))/y;

/** Formula text to a tree. Throws on anything it can't read. */
export function parse(src) {
  const toks = [];
  TOKEN.lastIndex = 0;
  let at = 0;
  const text = String(src);
  while (at < text.length) {
    if (/^\s*$/.test(text.slice(at))) break;
    TOKEN.lastIndex = at;
    const m = TOKEN.exec(text);
    if (!m) throw new Error(`Can't read the formula at "${text.slice(at, at + 12)}"`);
    at = TOKEN.lastIndex;
    if (m[1] !== undefined) toks.push({ k: "num", v: Number(m[1]) });
    else if (m[2] !== undefined) toks.push({ k: "id", v: m[2] });
    else if (m[3] !== undefined) toks.push({ k: "na" });
    else toks.push({ k: "op", v: m[4] });
  }
  let i = 0;
  const peek = () => toks[i];
  const isOp = (v) => peek() && peek().k === "op" && peek().v === v;
  const expect = (v) => { if (!isOp(v)) throw new Error(`Expected "${v}" in ${text}`); i++; };
  const CMP = ["=", "<>", "<", "<=", ">", ">="];
  function comparison() {
    let a = additive();
    while (peek() && peek().k === "op" && CMP.includes(peek().v)) { const op = toks[i++].v; a = { t: "bin", op, a, b: additive() }; }
    return a;
  }
  function additive() {
    let a = multiplicative();
    while (isOp("+") || isOp("-")) { const op = toks[i++].v; a = { t: "bin", op, a, b: multiplicative() }; }
    return a;
  }
  function multiplicative() {
    let a = power();
    while (isOp("*") || isOp("/")) { const op = toks[i++].v; a = { t: "bin", op, a, b: power() }; }
    return a;
  }
  function power() {
    let a = unary();
    while (isOp("^")) { i++; a = { t: "bin", op: "^", a, b: unary() }; }
    return a;
  }
  function unary() {
    if (isOp("-")) { i++; return { t: "neg", a: unary() }; }
    if (isOp("+")) { i++; return unary(); }
    return primary();
  }
  function primary() {
    const tk = toks[i++];
    if (!tk) throw new Error(`The formula ends too soon: ${text}`);
    if (tk.k === "num") return { t: "num", v: tk.v };
    if (tk.k === "na") return { t: "call", fn: "NA", args: [] };
    if (tk.k === "id") {
      if (isOp("(")) {
        i++;
        const args = [];
        if (!isOp(")")) { args.push(comparison()); while (isOp(",")) { i++; args.push(comparison()); } }
        expect(")");
        const fn = tk.v.toUpperCase();
        return { t: "call", fn: fn === "ISNUMBER" ? "HAS" : fn, args };
      }
      return { t: "id", name: tk.v };
    }
    if (tk.k === "op" && tk.v === "(") { const e = comparison(); expect(")"); return e; }
    throw new Error(`Unexpected "${tk.v}" in ${text}`);
  }
  const tree = comparison();
  if (i < toks.length) throw new Error(`Unexpected "${toks[i].v}" in ${text}`);
  return tree;
}

/** Every name a formula reads. */
export function namesIn(node, out = new Set()) {
  if (node.t === "id") out.add(node.name);
  if (node.a) namesIn(node.a, out);
  if (node.b) namesIn(node.b, out);
  if (node.args) node.args.forEach((x) => namesIn(x, out));
  return out;
}

// Spreadsheets round to 15 significant digits before ROUNDUP and friends; doing the same keeps 3.0000000000000004 at 3.
const tidy = (x) => Number(x.toPrecision(15));
const roundTo = (x, n, mode) => {
  const f = 10 ** n;
  const y = tidy(Math.abs(x) * f);
  const r = mode === "up" ? Math.ceil(y) : mode === "down" ? Math.floor(y) : Math.floor(y + 0.5);
  return (Math.sign(x) * r) / f;
};

/** The inverse of the standard normal distribution (Wichura's AS241, the algorithm Python's statistics module uses). */
export function normsinv(p) {
  if (!(p > 0 && p < 1)) throw new Error("NORMSINV needs a number between 0 and 1");
  const q = p - 0.5;
  let num, den, r;
  if (Math.abs(q) <= 0.425) {
    r = 0.180625 - q * q;
    num = (((((((2509.0809287301226727 * r + 33430.575583588128105) * r + 67265.770927008700853) * r + 45921.953931549871457) * r + 13731.693765509461125) * r + 1971.5909503065514427) * r + 133.14166789178437745) * r + 3.387132872796366608) * q;
    den = ((((((5226.495278852545561 * r + 28729.085735721942674) * r + 39307.89580009271061) * r + 21213.794301586595867) * r + 5394.1960214247511077) * r + 687.1870074920579083) * r + 42.313330701600911252) * r + 1;
    return num / den;
  }
  r = q <= 0 ? p : 1 - p;
  r = Math.sqrt(-Math.log(r));
  if (r <= 5) {
    r -= 1.6;
    num = ((((((0.00077454501427834140764 * r + 0.0227238449892691845833) * r + 0.24178072517745061177) * r + 1.27045825245236838258) * r + 3.64784832476320460504) * r + 5.7694972214606914055) * r + 4.6303378461565452959) * r + 1.42343711074968357734;
    den = ((((((1.05075007164441684324e-9 * r + 0.0005475938084995344946) * r + 0.0151986665636164571966) * r + 0.14810397642748007459) * r + 0.68976733498510000455) * r + 1.6763848301838038494) * r + 2.05319162663775882187) * r + 1;
  } else {
    r -= 5;
    num = ((((((2.01033439929228813265e-7 * r + 2.71155556874348757815e-5) * r + 0.0012426609473880784386) * r + 0.026532189526576123093) * r + 0.29656057182850489123) * r + 1.7848265399172913358) * r + 5.4637849111641143699) * r + 6.6579046435011037772;
    den = ((((((2.04426310338993978564e-15 * r + 1.4215117583164458887e-7) * r + 1.8463183175100546818e-5) * r + 0.0007868691311456132591) * r + 0.0148753612908506148525) * r + 0.13692988092273580531) * r + 0.59983220655588793769) * r + 1;
  }
  const x = num / den;
  return q < 0 ? -x : x;
}

const num = (v, what) => {
  if (v === null) throw new Error(`${what} has no answer to work with`);
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`${what} isn't a number`);
  return v;
};
const show = (node) => (node.t === "id" ? node.name : "a part of the sum");

/** Works a formula tree out with the named values in env. Throws, like a spreadsheet error, on anything undefined. */
export function evaluate(node, env) {
  switch (node.t) {
    case "num": return node.v;
    case "id": {
      if (!(node.name in env)) throw new Error(`Unknown name "${node.name}"`);
      const v = env[node.name];
      if (v instanceof Error) throw v;
      return v;
    }
    case "neg": return -num(evaluate(node.a, env), show(node.a));
    case "bin": {
      const a = num(evaluate(node.a, env), show(node.a));
      const b = num(evaluate(node.b, env), show(node.b));
      switch (node.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": if (b === 0) throw new Error("Can't divide by zero"); return a / b;
        case "^": { const r = a ** b; if (!Number.isFinite(r)) throw new Error("A power is out of range"); return r; }
        case "=": return a === b;
        case "<>": return a !== b;
        case "<": return a < b;
        case "<=": return a <= b;
        case ">": return a > b;
        case ">=": return a >= b;
      }
      throw new Error(`Unknown sign ${node.op}`);
    }
    case "call": {
      const ev = (k) => evaluate(node.args[k], env);
      const all = () => node.args.map((x) => num(evaluate(x, env), show(x)));
      const truth = (v) => { if (typeof v === "boolean") return v; return num(v, "A test") !== 0; };
      switch (node.fn) {
        case "IF": return truth(ev(0)) ? ev(1) : node.args.length > 2 ? ev(2) : false;
        case "AND": return node.args.every((_, k) => truth(ev(k)));
        case "OR": return node.args.some((_, k) => truth(ev(k)));
        case "NOT": return !truth(ev(0));
        case "NA": return null;
        case "HAS": return ev(0) !== null;
        case "MIN": return Math.min(...all());
        case "MAX": return Math.max(...all());
        case "ABS": return Math.abs(all()[0]);
        case "SQRT": { const [x] = all(); if (x < 0) throw new Error("Can't take the square root of a negative number"); return Math.sqrt(x); }
        case "LN": { const [x] = all(); if (x <= 0) throw new Error("LN needs a number above zero"); return Math.log(x); }
        case "EXP": return Math.exp(all()[0]);
        case "ROUND": { const [x, n = 0] = all(); return roundTo(x, n, "half"); }
        case "ROUNDUP": { const [x, n = 0] = all(); return roundTo(x, n, "up"); }
        case "ROUNDDOWN": { const [x, n = 0] = all(); return roundTo(x, n, "down"); }
        case "NORMSINV": return normsinv(all()[0]);
      }
      throw new Error(`Unknown function ${node.fn}`);
    }
  }
  throw new Error("Unknown part of a formula");
}

const PREC = { cmp: 1, "+": 2, "-": 2, "*": 3, "/": 3, "^": 4 };
const precOf = (n) => (n.t === "bin" ? (PREC[n.op] ?? PREC.cmp) : n.t === "neg" ? 5 : 9);
const fmtNum = (v) => (Number.isInteger(v) ? String(v) : String(v));

/** The formula as a spreadsheet formula (no leading "="), with each name swapped for its cell. */
export function toExcel(node, refOf) {
  const go = (n, parent = 0, right = false) => {
    let s;
    switch (n.t) {
      case "num": s = fmtNum(n.v); break;
      case "id": s = refOf(n.name); break;
      case "neg": s = `-${go(n.a, 5)}`; break;
      case "bin": {
        const p = precOf(n);
        s = `${go(n.a, p)}${n.op}${go(n.b, p, true)}`;
        const need = p < parent || (right && p === parent); // a+(b+c) stays bracketed, so the spreadsheet adds in the same order
        return need ? `(${s})` : s;
      }
      case "call":
        if (n.fn === "NA") return '""';
        s = `${n.fn === "HAS" ? "ISNUMBER" : n.fn}(${n.args.map((x) => go(x)).join(",")})`;
        break;
    }
    return s;
  };
  return go(node);
}

/** The formula as a Python expression. Fully bracketed, so Python works it out in exactly the same order. */
export function toPython(node) {
  const go = (n) => {
    switch (n.t) {
      case "num": return fmtNum(n.v);
      case "id": return n.name;
      case "neg": return `(-${go(n.a)})`;
      case "bin": return `(${go(n.a)} ${({ "^": "**", "=": "==", "<>": "!=" })[n.op] ?? n.op} ${go(n.b)})`;
      case "call": {
        const a = n.args.map(go);
        switch (n.fn) {
          case "IF": return `(${a[1]} if ${a[0]} else ${a[2] ?? "False"})`;
          case "AND": return `(${a.join(" and ")})`;
          case "OR": return `(${a.join(" or ")})`;
          case "NOT": return `(not ${a[0]})`;
          case "NA": return "None";
          case "HAS": return `(${a[0]} is not None)`;
          case "MIN": return `min(${a.join(", ")})`;
          case "MAX": return `max(${a.join(", ")})`;
          case "ABS": return `abs(${a[0]})`;
          default: return `${n.fn}(${a.join(", ")})`;
        }
      }
    }
    throw new Error("Unknown part of a formula");
  };
  return go(node);
}

// ---- Tools: inputs, presets, answers --------------------------------------------------------

const cache = new WeakMap();
/** The parsed formulas of a tool, worked out once. */
export function compiled(tool) {
  if (!cache.has(tool)) cache.set(tool, Object.fromEntries(tool.outputs.map((o) => [o.id, parse(o.formula)])));
  return cache.get(tool);
}
export const presetOf = (tool, id) => tool.presets.find((p) => p.id === id) ?? tool.presets[0];
const shownIn = (item, presetId) => !item.boards || item.boards.includes(presetId);
/** The inputs a person sees on this board. The others count as zero (or the preset's own value). */
export const visibleInputs = (tool, presetId) => tool.inputs.filter((i) => shownIn(i, presetOf(tool, presetId).id));
export const visibleOutputs = (tool, presetId) => tool.outputs.filter((o) => !o.helper && shownIn(o, presetOf(tool, presetId).id));

/** The example numbers for a board: every input, with the ones the board hides at zero. */
export function defaults(tool, presetId) {
  const p = presetOf(tool, presetId);
  return Object.fromEntries(tool.inputs.map((i) => [i.id, i.id in (p.values ?? {}) ? p.values[i.id] : shownIn(i, p.id) ? i.example : 0]));
}

/** Text from the fields to numbers. Anything empty, not a number or out of range is named in errors. */
export function readInputs(tool, raw, presetId) {
  const p = presetOf(tool, presetId);
  const base = defaults(tool, p.id);
  const values = {};
  const errors = {};
  for (const i of tool.inputs) {
    if (!shownIn(i, p.id)) { values[i.id] = base[i.id]; continue; }
    const s = raw[i.id];
    const n = typeof s === "number" ? s : String(s ?? "").trim().replace(/,/g, "") === "" ? NaN : Number(String(s).trim().replace(/,/g, ""));
    if (!Number.isFinite(n)) { errors[i.id] = "Type a number"; continue; }
    if (i.min !== undefined && n < i.min) { errors[i.id] = `Use ${i.min} or more`; continue; }
    if (i.max !== undefined && n > i.max) { errors[i.id] = `Use ${i.max} or less`; continue; }
    if (i.integer && !Number.isInteger(n)) { errors[i.id] = "Use a whole number"; continue; }
    values[i.id] = n;
  }
  return { values, errors };
}

/** Works out every answer, in order. An answer that can't be worked out holds the Error that says why. */
export function compute(tool, values) {
  const f = compiled(tool);
  const env = { ...values };
  for (const o of tool.outputs) {
    try {
      const v = evaluate(f[o.id], env);
      if (typeof v === "boolean") throw new Error(`${o.id} is a test, not a number`);
      env[o.id] = v;
    } catch (e) {
      env[o.id] = e instanceof Error ? e : new Error(String(e));
    }
  }
  return env;
}

// ---- Words: numbers, sums and answers -------------------------------------------------------

const group = (n, digits) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const trim = (n, max) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: max });
const minus = (n) => (n < 0 && Math.abs(n) >= 5e-13 ? "-" : "");
const plural = (n, one, many) => (Math.abs(n) === 1 ? one : many);

/** A number as a person reads it, in its unit. */
export function format(unit, v, sym = "$") {
  if (v === null || v === undefined) return "none";
  if (v instanceof Error) return "can't work out";
  if (typeof v !== "number" || !Number.isFinite(v)) return String(v);
  const r = (d) => Math.round(v * 10 ** d) / 10 ** d;
  switch (unit) {
    case "money": return `${minus(r(2))}${sym}${group(r(2), 2)}`;
    case "smallmoney": return Math.abs(v) >= 1 || v === 0 ? `${minus(r(2))}${sym}${group(r(2), 2)}` : `${minus(r(4))}${sym}${group(r(4), 4)}`;
    case "percent": return `${minus(r(2))}${trim(r(2), 2)}%`;
    case "points": return `${minus(r(2))}${trim(r(2), 2)} ${plural(r(2), "point", "points")}`;
    case "x": return `${minus(r(2))}${group(r(2), 2)}x`;
    case "count": return `${minus(Math.round(v))}${group(Math.round(v), 0)}`;
    case "tokens": return `${minus(Math.round(v))}${group(Math.round(v), 0)} tokens`;
    case "months": return `${minus(r(1))}${group(r(1), 1)} ${plural(r(1), "month", "months")}`;
    case "weeks": return `${minus(r(1))}${trim(r(1), 1)} ${plural(r(1), "week", "weeks")}`;
    case "days": return `${minus(r(0))}${group(r(0), 0)} ${plural(r(0), "day", "days")}`;
    case "hours": return `${minus(r(1))}${trim(r(1), 1)} ${plural(r(1), "hour", "hours")}`;
    case "z": return `${minus(r(4))}${group(r(4), 4)}`;
    default: return `${minus(r(2))}${trim(r(2), 2)}`;
  }
}

/** The unit of any name: an input or an answer. */
export const unitOf = (tool, id) => (tool.inputs.find((i) => i.id === id) ?? tool.outputs.find((o) => o.id === id))?.unit ?? "number";

/** Fills "{price} × {discount}" with the numbers. {name:abs} drops the minus sign; {=} is the answer itself. */
export function fill(tool, text, env, sym, self) {
  return String(text).replace(/\{(=|[A-Za-z_][A-Za-z0-9_]*)(?::(abs))?\}/g, (_, id, mod) => {
    const key = id === "=" ? self : id;
    let v = env[key];
    if (mod === "abs" && typeof v === "number") v = Math.abs(v);
    return format(unitOf(tool, key), v, sym);
  });
}

/** True when a condition holds. A condition that can't be worked out counts as false. */
const conds = new Map();
export function holds(cond, env) {
  if (!cond) return true;
  try {
    if (!conds.has(cond)) conds.set(cond, parse(cond));
    return !!evaluate(conds.get(cond), env);
  } catch { return false; }
}
/** The first item whose condition holds. */
export const pick = (list, env) => (Array.isArray(list) ? list.find((x) => holds(x.if, env)) : typeof list === "string" ? { text: list } : list);
const textFor = (x, presetId) => (x && typeof x === "object" && !Array.isArray(x) && !("text" in x) ? x[presetId] ?? x.default : x);

/** The answer, as one to three plain sentences. */
export function answerLines(tool, env, presetId, sym) {
  const p = presetOf(tool, presetId).id;
  return tool.answer.map((list) => pick(list, env)).filter((x) => x && x.text).map((x) => fill(tool, textFor(x.text, p), env, sym));
}

/** Each line of the working: the sum in words with the numbers filled in, the answer, and what it means. */
export function workingLines(tool, env, presetId, sym) {
  const p = presetOf(tool, presetId).id;
  return visibleOutputs(tool, p).map((o) => {
    const v = env[o.id];
    const means = pick(o.means, env);
    const sum = textFor(o.sum, p);
    return {
      id: o.id,
      label: o.label,
      group: o.group,
      unit: o.unit,
      value: v instanceof Error ? null : v,
      shown: v === null && o.none ? o.none : format(o.unit, v, sym),
      error: v instanceof Error ? v.message : null,
      sum: v === null || v instanceof Error ? null : sum ? fill(tool, sum, env, sym, o.id) : null,
      means: means && means.text ? fill(tool, textFor(means.text, p), env, sym, o.id) : "",
    };
  });
}

/** The same answers at a few other values of one input, like 10%, 20% and 30% off. */
export function compareRows(tool, values, presetId, sym) {
  const c = tool.compare;
  if (!c) return null;
  const p = presetOf(tool, presetId).id;
  const cols = c.values.map((x) => compute(tool, { ...values, [c.input]: x }));
  return {
    label: c.label,
    heads: c.values.map((x) => format(unitOf(tool, c.input), x, sym)),
    rows: c.outputs.filter((id) => visibleOutputs(tool, p).some((o) => o.id === id)).map((id) => {
      const o = tool.outputs.find((x) => x.id === id);
      return { id, label: o.label, cells: cols.map((env) => (env[id] === null && o.none ? o.none : format(o.unit, env[id], sym))) };
    }),
  };
}

/** The next listings to use, for these answers. */
export const nextSteps = (tool, env) => (tool.next ?? []).filter((n) => holds(n.if, env)).slice(0, 2);

/** Every tool the inputs name as holding the real number, each once. */
export function worksBestWith(tool) {
  const seen = new Map();
  for (const i of tool.inputs) for (const t of i.tools ?? []) if (!seen.has(t)) seen.set(t, []);
  for (const i of tool.inputs) for (const t of i.tools ?? []) seen.get(t).push(i.label);
  return [...seen].map(([name, for_]) => ({ name, for: for_ }));
}
