// Creative-set check (14 Nov 2026): the Gehna run 2 creatives repeated one template on 8 of 20 though the rule said
// at least 4 layouts, so the check reads layouts from the pixels, not from what the maker says. It also catches the
// slips the judges found: "₹10.000", an empty button, a review quote on the wrong product.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TOOL_FILES, BRAND_TOOLS } from "../src/modules/packs/build.ts";

const load = (rel: string): Promise<any> => import(rel);
const tool = "../../catalogue-items/general/brand-dna-capture/scripts/check-creative-set.mjs";

/** A tiny PNG writer: RGB, 8-bit, filter 0. */
function png(w: number, h: number, px: (x: number, y: number) => [number, number, number]): Buffer {
  const raw = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const [r, g, b] = px(x, y), i = y * (w * 3 + 1) + 1 + x * 3; raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b: Buffer) => { let c = 0xffffffff; for (const v of b) c = crcTable[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t: string, d: Buffer) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t, "ascii"), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const S = 120;
test("an empty or SVG-only folder never passes raster verification", async () => {
  const m = await load(tool);
  const dir = mkdtempSync(path.join(tmpdir(), "cset-empty-"));
  writeFileSync(path.join(dir, "concept.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  const r = m.checkSet(dir);
  assert.equal(r.ok, false);
  assert.equal(r.status, "NOT_RUN");
  assert.deepEqual(r.coverage, { found: 0, pixels_read: 0 });
  assert.match(m.reportText(r), /NOT_RUN/);
});
test("unreadable pixels cannot establish a visual pass", async () => {
  const m = await load(tool);
  const dir = mkdtempSync(path.join(tmpdir(), "cset-corrupt-"));
  writeFileSync(path.join(dir, "broken.png"), 'not image data');
  const r = m.checkSet(dir, { buttons: false, type: false });
  assert.equal(r.ok, false);
  assert.equal(r.coverage.pixels_read, 0);
  assert.ok(r.per[0].fails.some((x: string) => /pixels not read/.test(x)));
});
// Four templates. The "photo" inside each is a soft gradient whose colour changes per creative.
const tint = (k: number): [number, number, number] => [60 + ((k * 53) % 150), 70 + ((k * 31) % 140), 80 + ((k * 71) % 120)];
const T: Record<string, (k: number) => (x: number, y: number) => [number, number, number]> = {
  arch: (k) => (x, y) => { const inArch = x > 66 && x < 110 && y > 20 && (y > 50 || Math.hypot(x - 88, y - 50) < 22); if (inArch) { const [r, g, b] = tint(k); return [r + (y >> 2), g, b]; } return x < 60 ? [113, 46, 66] : [246, 238, 230]; },
  band: (k) => (x, y) => (y < 40 ? [40, 40, 60] : y > 100 ? [201, 138, 30] : (() => { const [r, g, b] = tint(k); return [r, g + (x >> 2), b]; })()),
  circle: (k) => (x, y) => (Math.hypot(x - 60, y - 60) < 35 ? tint(k) : [250, 250, 250]),
  grid: (k) => (x, y) => ((x % 60) < 52 && (y % 60) < 52 ? tint(k + (x > 60 ? 1 : 0) + (y > 60 ? 2 : 0)) : [255, 255, 255]),
};
function makeSet(spec: string[]): string {
  const dir = mkdtempSync(path.join(tmpdir(), "cset-"));
  spec.forEach((t, i) => writeFileSync(path.join(dir, `${String(i + 1).padStart(2, "0")}-${t}.png`), png(S, S, T[t](i))));
  return dir;
}

// Ratio exports preserve the synthetic concept's picture; they are deliberately near-copies.
function variantSet(spec = ["arch", "band", "circle"]) {
  const dir = mkdtempSync(path.join(tmpdir(), "cset-variants-"));
  const sizes = ["120x120", "120x150"];
  const entries = spec.flatMap((layout, i) => sizes.map((size) => {
    const [w, h] = size.split("x").map(Number), file = `${i}-${size}.png`;
    writeFileSync(path.join(dir, file), png(w, h, (x, y) => T[layout](i)(x, Math.floor(y * S / h))));
    return { file, concept_id: `concept-${i}`, layout, product: `Piece ${i}`, angle: `buyer question ${i}`, format: "product", segment: "Gift buyers", funnel: "prospecting", product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now" };
  }));
  const plan = { brief: "approved-brief.md#deliverables", concepts: spec.map((_, i) => ({ id: `concept-${i}`, sizes })) };
  const save = () => writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(entries));
  save();
  return { dir, entries, plan, save };
}

test("explicit concept mode accepts requested square/portrait adaptations and counts buyer concepts", async () => {
  const m = await load(tool), f = variantSet();
  const r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false, type: false });
  assert.equal(r.ok, true, m.reportText(r));
  assert.equal(r.files, 6);
  assert.equal(r.concepts, 3);
  assert.deepEqual(r.coverage, { found: 6, pixels_read: 6 });
  assert.ok(r.notes.some((s: string) => /do not prove distinct buyer concepts/.test(s)));
  assert.ok(!r.fails.some((s: string) => /one segment|prospecting|share both angle|near-copies/.test(s)));
  // Three concepts do not acquire ten-concept variety requirements by adding sizes.
  const more = ["120x160", "150x120"];
  for (const c of f.plan.concepts) c.sizes = [...c.sizes, ...more];
  for (let i = 0; i < 3; i++) for (const size of more) {
    const [w, h] = size.split("x").map(Number), file = `${i}-${size}.png`;
    writeFileSync(path.join(f.dir, file), png(w, h, (x, y) => T[["arch", "band", "circle"][i]](i)(Math.floor(x * S / w), Math.floor(y * S / h))));
    f.entries.push({ ...f.entries[i * 2], file });
  }
  f.save();
  const expanded = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false, type: false });
  assert.equal(expanded.ok, true, m.reportText(expanded));
  assert.equal(expanded.files, 12);
  assert.equal(expanded.concepts, 3);
});

test("multiple allowed sizes alone do not enable concept exemptions, and legacy defaults remain square", async () => {
  const m = await load(tool), f = variantSet();
  let r = m.checkSet(f.dir, { allowedSizes: ["120x120", "120x150"], buttons: false, type: false });
  assert.ok(r.fails.some((s: string) => /near-copies/.test(s)));
  assert.ok(r.fails.some((s: string) => /share both angle/.test(s)));
  assert.ok(r.fails.some((s: string) => /all 6 creatives are prospecting/.test(s)));
  assert.ok(r.per.every((p: any) => !p.fails.some((s: string) => /is \d+x\d+, not/.test(s))));
  assert.equal(r.concepts, undefined);
  r = m.checkSet(f.dir, { buttons: false, type: false });
  assert.ok(r.per.every((p: any) => p.fails.some((s: string) => /not 1080x1080/.test(s))));
});

test("concept labels cannot hide cross-concept near-copies or repeated angle/format", async () => {
  const m = await load(tool), f = variantSet();
  for (const size of f.plan.concepts[1].sizes) {
    const [w, h] = size.split("x").map(Number);
    writeFileSync(path.join(f.dir, `1-${size}.png`), png(w, h, (x, y) => T.arch(0)(x, Math.floor(y * S / h))));
  }
  let r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false, type: false });
  assert.ok(r.fails.some((s: string) => /0-120x120.png and 1-120x120.png are near-copies/.test(s)), m.reportText(r));
  f.entries.filter(e => e.concept_id === "concept-1").forEach(e => { e.angle = "buyer question 0"; });
  f.save();
  r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false, type: false });
  assert.ok(r.fails.some((s: string) => /share both angle/.test(s)), m.reportText(r));
});

test("missing requested variants, duplicate aspects, and inconsistent groups fail closed", async () => {
  const m = await load(tool), opts = { buttons: false, type: false };
  const missing = variantSet();
  missing.plan.concepts[0].sizes = ["120x120", "120x150", "120x160"];
  let r = m.checkSet(missing.dir, { ...opts, conceptPlan: missing.plan });
  assert.ok(r.fails.some((s: string) => /concept concept-0 is missing requested size 120x160/.test(s)));
  assert.equal(r.concepts, null, "invalid groups never earn duplicate exemptions");
  assert.ok(r.fails.some((s: string) => /near-copies/.test(s)));
  const duplicate = variantSet();
  writeFileSync(path.join(duplicate.dir, "duplicate.png"), png(120, 120, T.arch(0)));
  duplicate.entries.push({ ...duplicate.entries[0], file: "duplicate.png" }); duplicate.save();
  r = m.checkSet(duplicate.dir, { ...opts, conceptPlan: duplicate.plan });
  assert.ok(r.fails.some((s: string) => /duplicate aspect in concept concept-0/.test(s)));
  assert.ok(r.fails.some((s: string) => /near-copies/.test(s)));
  const invalid = variantSet();
  invalid.entries[1].angle = "a different buyer question";
  invalid.entries[3].concept_id = "unrequested";
  invalid.entries.push({ ...invalid.entries[0] }); invalid.save();
  r = m.checkSet(invalid.dir, { ...opts, conceptPlan: invalid.plan });
  assert.ok(r.fails.some((s: string) => /inconsistent angle/.test(s)));
  assert.ok(r.fails.some((s: string) => /unrequested concept_id/.test(s)));
  assert.ok(r.fails.some((s: string) => /duplicate manifest entry/.test(s)));
  assert.throws(() => m.checkSet(invalid.dir, { conceptPlan: { ...invalid.plan, brief: "" } }), /brief reference/);
  assert.throws(() => m.checkSet(invalid.dir, { conceptPlan: { brief: "brief.md", concepts: [{ id: "one", sizes: ["120x120", "240x240"] }] } }), /duplicate aspect ratios/);
  assert.throws(() => m.checkSet(invalid.dir, { conceptPlan: invalid.plan, allowedSizes: ["120x120"] }), /outside allowed sizes/);
});

test("concept mode keeps concept mix/funnel/variety gates and checks every export", async () => {
  const m = await load(tool), f = variantSet();
  f.entries.filter(e => e.concept_id !== "concept-2").forEach(e => { e.format = "notes list"; }); f.save();
  let r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false, type: false });
  assert.ok(r.fails.some((s: string) => /2 of 3 creatives are text cards/.test(s)));
  const five = variantSet(["arch", "band", "circle", "grid", "band"]);
  r = m.checkSet(five.dir, { conceptPlan: five.plan, buttons: false, type: false });
  assert.ok(r.fails.some((s: string) => /all 5 creatives are prospecting/.test(s)));
  assert.ok(r.fails.some((s: string) => /all 5 creatives speak to one segment/.test(s)));
  assert.ok(!r.fails.some((s: string) => /make at least 4|native formats/.test(s)));
  const ten = variantSet(Array(10).fill("arch"));
  r = m.checkSet(ten.dir, { conceptPlan: ten.plan, buttons: false, type: false });
  assert.ok(r.fails.some((s: string) => /10 of 10 creatives share one layout/.test(s)), m.reportText(r));
  assert.ok(r.fails.some((s: string) => /only 0 native formats/.test(s)));
  f.entries[1].product_box = [0.1, 0.1, 0.1, 0.1]; f.save();
  r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false });
  assert.ok(r.per.find((p: any) => p.file === f.entries[1].file).fails.some((s: string) => /product fills 1%/.test(s)));
  assert.ok(r.fails.some((s: string) => /type was checked on 0 of 6 creatives/.test(s)));
  // A square's type probe must not silently cover a portrait sharing its numeric concept prefix.
  writeFileSync(path.join(f.dir, "type-report.json"), JSON.stringify(Object.fromEntries(f.entries.filter(e => e.file.endsWith("120x120.png")).map(e => [e.file, { canvas: 120, texts: [], fonts: [], kern: [], images: [] }]))));
  r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false });
  assert.ok(r.fails.some((s: string) => /type was checked on 3 of 6 creatives/.test(s)), m.reportText(r));
});

test("concept mode requires exact per-export type reports, not shared HTML or inline declarations", async () => {
  const m = await load(tool), f = variantSet(["arch"]);
  const probe = { canvas: 120, texts: [], fonts: [], kern: [], images: [] };
  writeFileSync(path.join(f.dir, "manifest.json"), JSON.stringify(f.entries.map(e => ({ ...e, html: "01-concept.html", type: probe }))));
  writeFileSync(path.join(f.dir, "type-report.json"), JSON.stringify({ "01-concept.html": probe, "0-120x120.html": probe, "0-120x150.html": probe }));
  let r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false });
  assert.equal(r.ok, false);
  assert.ok(r.fails.some((s: string) => /type was checked on 0 of 2 creatives/.test(s)), m.reportText(r));
  writeFileSync(path.join(f.dir, "type-report.json"), JSON.stringify({ [f.entries[0].file]: probe }));
  r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false });
  assert.ok(r.fails.some((s: string) => /type was checked on 1 of 2 creatives/.test(s)), m.reportText(r));
  writeFileSync(path.join(f.dir, "type-report.json"), JSON.stringify(Object.fromEntries(f.entries.map(e => [e.file, probe]))));
  r = m.checkSet(f.dir, { conceptPlan: f.plan, buttons: false });
  assert.equal(r.ok, true, m.reportText(r));
});

test("CLI requires an explicit concept plan; manifest metadata cannot opt itself in", () => {
  const f = variantSet(), planFile = path.join(f.dir, "brief-plan.json");
  writeFileSync(planFile, JSON.stringify(f.plan));
  writeFileSync(path.join(f.dir, "manifest.json"), JSON.stringify({ creatives: f.entries, conceptPlan: f.plan }));
  const cli = (...args: string[]) => spawnSync(process.execPath, [fileURLToPath(new URL(tool, import.meta.url)), f.dir, "--no-buttons", "--no-type", "--json", ...args], { encoding: "utf8" });
  const legacy = cli("--sizes", "120x120,120x150");
  assert.equal(legacy.status, 1, legacy.stdout + legacy.stderr);
  assert.ok(JSON.parse(legacy.stdout).fails.some((s: string) => /near-copies/.test(s)));
  const opted = cli("--concept-plan", planFile);
  assert.equal(opted.status, 0, opted.stdout + opted.stderr);
  assert.equal(JSON.parse(opted.stdout).concepts, 3);
  const malformed = cli("--concept-plan");
  assert.equal(malformed.status, 2);
  assert.match(malformed.stdout, /needs a brief-derived plan file/);
});

test("the pixels catch a set that repeats one template, whatever photo sits inside it", async () => {
  const m = await load(tool);
  const dir = makeSet(["arch", "arch", "arch", "arch", "arch", "arch", "arch", "band", "circle", "grid"]);
  const r = m.checkSet(dir, { size: "120x120" });
  assert.equal(r.ok, false);
  assert.equal(r.layouts[0].length, 7, "the seven arch creatives group together");
  assert.ok(r.fails.some((f: string) => /7 of 10 creatives share one layout/.test(f)));
  assert.ok(r.fails.some((f: string) => /no manifest/.test(f)));
});

test("a varied set passes on layout, and a mirrored arch counts as the same layout", async () => {
  const m = await load(tool);
  const dir = makeSet(["arch", "arch", "arch", "band", "band", "band", "circle", "circle", "grid", "grid"]);
  const files = ["01-arch.png", "02-arch.png", "03-arch.png", "04-band.png", "05-band.png", "06-band.png", "07-circle.png", "08-circle.png", "09-grid.png", "10-grid.png"];
  const formats = ["product", "notes list", "chat", "comparison table", "product", "offer", "product", "review card", "product", "product"];
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((file, i) => ({ file, layout: file.slice(3, -4), format: formats[i], product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now", price: "₹21,130", price_checked: "2026-11-14", segment: i % 2 ? "Women 35-44" : "Women 45-54" }))));
  const r = m.checkSet(dir, { size: "120x120", buttons: false, type: false, today: new Date("2026-11-15") });
  assert.equal(r.ok, true, m.reportText(r));
  assert.equal(r.layouts.length, 4);
  const img = m.decodePng(png(S, S, T.arch(1))), mirror = m.decodePng(png(S, S, (x, y) => T.arch(1)(S - 1 - x, y)));
  assert.ok(m.shapeDistance(m.shapeOf(img), m.shapeOf(mirror)) < 0.05, "an arch on the left matches one on the right");
});

test("the manifest checks catch the slips the Gehna judges found", async () => {
  const m = await load(tool);
  assert.deepEqual(m.textIssues({ headline: "Real 18K gold. Under ₹10.000.", cta: "Shop now" }), ['headline writes money the wrong way ("₹10.000"): use ₹10,000 or ₹1,00,000, $1,234.50, £1,234 or €1,234']);
  assert.deepEqual(m.textIssues({ headline: "Gift edit", cta: "" }), ["no CTA button text"]);
  assert.match(m.textIssues({ headline: "Order by [Date]", cta: "Shop" })[0], /placeholder \("\[Date\]"\)/);
  assert.match(m.textIssues({ headline: "Hi {{ cart.item_name }}", cta: "Shop" })[0], /placeholder/);
  assert.match(m.textIssues({ headline: "Sized right", cta: "Shop", product: "Enigmatic Emerald Ring", review: { quote: "They sent a ring sizer", about: "Yellow Sapphire Ring" } })[0], /review quote is about "Yellow Sapphire Ring" but sits on "Enigmatic Emerald Ring"/);
  assert.deepEqual(m.textIssues({ headline: "Under ₹1,00,000", cta: "Shop", price: "₹9,290" }), [], "Indian grouping passes");
  const dir = makeSet(["circle", "band"]);
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify([{ file: "01-circle.png", layout: "circle", product: "Ring", product_box: [0.4, 0.4, 0.3, 0.3], headline: "A ring", cta: "Shop" }]));
  const r = m.checkSet(dir, { size: "1080x1080" });
  assert.ok(r.per[0].fails.some((f: string) => /is 120x120, not 1080x1080/.test(f)));
  assert.ok(r.per[0].fails.some((f: string) => /the product fills 9% of the frame/.test(f)));
  assert.ok(r.per[1].notes.includes("not in the manifest"));
});

// Rounds 3 and 4 (14 Nov): with 20 layouts the AI Blocks set still lost on "converts" and "insight". Judges said most
// of its creatives had no button on the image, it used few native formats, and "Every stone we set is natural"
// overreached for a store that also sells lab-grown diamonds.
test("the button is read from the pixels, and a set of 10 needs buttons and 3 native formats", async () => {
  const m = await load(tool);
  const BTN: [number, number, number] = [30, 120, 200], box = [70 / S, 100 / S, 40 / S, 12 / S];
  const spec = ["arch", "band", "circle", "grid", "arch", "band", "circle", "grid", "arch", "band"];
  const dir = mkdtempSync(path.join(tmpdir(), "cset-btn-"));
  spec.forEach((t, i) => writeFileSync(path.join(dir, `${String(i + 1).padStart(2, "0")}-${t}.png`),
    // 1 to 6 draw a button; 7 to 10 have busy photo detail where the manifest claims one.
    png(S, S, (x, y) => (x >= 70 && x < 110 && y >= 100 && y < 112 ? (i < 6 ? BTN : [(x * 37) % 256, (y * 53) % 256, ((x + y) * 29) % 256]) : T[t](i)(x, y)))));
  const files = spec.map((t, i) => `${String(i + 1).padStart(2, "0")}-${t}.png`);
  const entry = (file: string, i: number, extra = {}) => ({ file, layout: spec[i], format: "product", product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now", cta_box: box, segment: i % 2 ? "Women 35-44" : "Women 45-54", ...extra });
  // Six real buttons, and four creatives that only claim one: those four fail, and 6 of 10 is under 70%.
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((f, i) => entry(f, i))));
  let r = m.checkSet(dir, { size: "120x120" });
  assert.equal(r.per.filter((p: any) => p.fails.some((f: string) => /does not look like a button/.test(f))).length, 4);
  assert.ok(r.fails.some((f: string) => /only 6 of 10 creatives show a button/.test(f)));
  assert.ok(r.fails.some((f: string) => /only 0 native formats/.test(f)));
  assert.ok(r.notes.some((n: string) => /local or seasonal moment/.test(n)));
  // Real buttons on 7 of 10 would pass; here, give the set 3 native formats and a moment, and drop the buttons rule.
  const fmts = ["notes list", "chat", "18K vs 22K table", "product", "explainer", "product", "product", "product", "product", "product"];
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((f, i) => entry(f, i, { format: fmts[i], moment: i === 0 ? "Margazhi season" : undefined, cta_box: i < 6 ? box : undefined, funnel: i === 1 ? "retargeting" : "prospecting" }))));
  r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.equal(r.ok, true, m.reportText(r));
  assert.equal(m.nativeFormat("WhatsApp chat"), "chat");
  assert.equal(m.nativeFormat("split photo panel"), null);
});

test("absolute claims need a source; everyday words do not", async () => {
  const m = await load(tool);
  assert.match(m.claimIssues({ headline: "Every stone we set is natural." }).fails[0], /absolute claim \("Every stone"\)/);
  assert.match(m.claimIssues({ body: "Every Gehna piece has all three." }).fails[0], /"Every Gehna piece"/);
  assert.ok(m.claimIssues({ headline: "Every stone we set is natural.", claim_source: "FAQ: all gemstones natural; lab-grown line is diamonds only" }).fails.length, "arbitrary manifest prose cannot approve a claim");
  assert.deepEqual(m.claimIssues({ headline: "Light gold for every day.", body: "All three checks, before you pay." }).fails, []);
  assert.match(m.claimIssues({ headline: "A snowflake that never melts." }).notes[0], /"never"/);
});

// Round 5 (14 Nov): with buttons, formats and moments fixed, AI Blocks lost its finish score to type. The headline cut
// of Bodoni Moda kerns "To" but not "Wo"/"We" ("W orn now"), its comma is 4% tail so "₹15,710" read as "₹15.710",
// and some product photos were drawn 1.4x to 1.7x their own pixels. The probe measures these in the browser; these
// numbers are what it measured on the round 5 pages.
const probeOf = (over: Record<string, unknown> = {}) => ({
  canvas: 1080,
  texts: [
    { text: "Worn now. Passed on later.", font: "Bodoni Moda", weight: "500", loaded: true, px: 82 },
    { text: "₹15,710", font: "Bodoni Moda", weight: "500", loaded: true, px: 66 },
    { text: "TOP 3 IN PENDANTS", font: "Lato", weight: "900", loaded: true, px: 18 },
    { text: "Royal Verde: natural emeralds, diamonds and a pearl in 18K gold.", font: "Lato", weight: "400", loaded: true, px: 30 },
  ],
  fonts: [{ font: "Bodoni Moda", weight: "500", kerns: true, commaTail: 0.04 }, { font: "Lato", weight: "900", kerns: true, commaTail: 0.33 }, { font: "Lato", weight: "400", kerns: true, commaTail: 0.34 }],
  kern: [{ pair: "Wo", font: "Bodoni Moda", weight: "500", kern: 0, px: 82, sample: "Worn now. Pas" }, { pair: "To", font: "Bodoni Moda", weight: "500", kern: -0.061, px: 82, sample: "To" }],
  images: [{ src: "earrings_1.jpg", natural: [1000, 1000], drawn: [1674, 1080], scale: 1.67 }],
  ...over,
});

test("the type report catches an unkerned W, a comma that reads as a decimal, and a soft photo", async () => {
  const m = await load(tool);
  const r = m.typeIssues(probeOf());
  assert.ok(r.fails.some((f: string) => /"Wo" in Bodoni Moda .* prints no tighter/.test(f)), r.fails.join("\n"));
  assert.ok(r.fails.some((f: string) => /comma is nearly all dot \(4% tail\), so ₹15,710 reads like a decimal/.test(f)));
  assert.ok(r.fails.some((f: string) => /earrings_1\.jpg is drawn at 1\.67x/.test(f)));
  assert.ok(r.notes.some((n: string) => /small text .*18px "TOP 3 IN PENDANTS"/.test(n)), "18px is a note; under 18px fails");
  assert.ok(!r.fails.some((f: string) => /"To"/.test(f)), "a kerned pair passes");
  // The brand's own fonts kern "Wo" and have a real comma tail; a fallback font and an off-brand font fail.
  const good = m.typeIssues(probeOf({
    texts: [{ text: "Worn now. ₹15,710", font: "Nanum Myeongjo", weight: "400", loaded: true, px: 82 }, { text: "Shop now", font: "Lato", weight: "900", loaded: true, px: 26 }],
    fonts: [{ font: "Nanum Myeongjo", weight: "400", kerns: true, commaTail: 0.44 }, { font: "Lato", weight: "900", kerns: true, commaTail: 0.33 }],
    kern: [{ pair: "Wo", font: "Nanum Myeongjo", weight: "400", kern: -0.086, px: 82, sample: "Worn now" }], images: [{ src: "a.jpg", natural: [2000, 2000], drawn: [1080, 1080], scale: 0.54 }],
  }), { fonts: ["Nanum Myeongjo", "Lato"] });
  assert.deepEqual(good.fails, []);
  const off = m.typeIssues(probeOf(), { fonts: ["Nanum Myeongjo", "Lato"] });
  assert.ok(off.fails.some((f: string) => /set in Bodoni Moda, which is not one of the brand's fonts/.test(f)));
  const fb = m.typeIssues(probeOf({ texts: [{ text: "Gold", font: "Gehna Serif", weight: "400", loaded: false, px: 80 }] }));
  assert.match(fb.fails[0], /fallback font: "Gehna Serif" did not load/);
  // Small text does not show a missing kern, so only text 40px and up is held to it.
  const small = m.typeIssues(probeOf({ kern: [{ pair: "Wo", font: "Bodoni Moda", weight: "500", kern: 0, px: 30, sample: "Wo" }] }));
  assert.ok(!small.fails.some((f: string) => /kern/.test(f)));
});

test("a set of 10 needs a type report, found by file name or number, and the probe is self-contained", async () => {
  const m = await load(tool);
  const dir = makeSet(["arch", "band", "circle", "grid", "arch", "band", "circle", "grid", "arch", "band"]);
  let r = m.checkSet(dir, { size: "120x120", buttons: false });
  assert.ok(r.fails.some((f: string) => /the type was checked on 0 of 10 creatives/.test(f)));
  const report: Record<string, unknown> = {};
  for (let i = 1; i <= 10; i++) report[`${String(i).padStart(2, "0")}.html`] = probeOf({ images: [] });
  writeFileSync(path.join(dir, "type-report.json"), JSON.stringify(report));
  r = m.checkSet(dir, { size: "120x120", buttons: false });
  assert.ok(!r.fails.some((f: string) => /the type was checked/.test(f)));
  assert.equal(r.per.filter((p: any) => p.fails.some((f: string) => /"Wo" in Bodoni Moda .* prints no tighter/.test(f))).length, 10, "01.html matches 01-arch.png");
  // page.evaluate sends only the function's source to the browser, so it must not lean on anything in the module.
  const src = m.typeProbe.toString();
  for (const name of ["RULES", "short(", "path.", "fs.", "typeIssues", "norm("]) assert.ok(!src.includes(name), `typeProbe uses ${name}`);
});

// Round 6 (15 Nov, 5 creatives each): a tie. 9 of 10 judges called the AI Blocks set text-heavy (4 of 5 were text
// cards), 4 disliked the hairline Didone, and "Wedding in February? Book it at today's price." ships in May.
test("the type report reads a hand-kerned W as kerned, and fails a hairline face, faint text and a wall of words", async () => {
  const m = await load(tool);
  const hand = m.typeIssues(probeOf({ kern: [{ pair: "We", font: "Bodoni Moda", weight: "500", kern: -0.045, px: 72, sample: "Wedding in F" }], images: [] }));
  assert.ok(!hand.fails.some((f: string) => /prints no tighter/.test(f)), "a span with -0.045em letter-spacing closes the gap");
  const r = m.typeIssues(probeOf({
    texts: [
      { text: "Wedding in February?", font: "Bodoni Moda", weight: "500", loaded: true, px: 72, contrast: 9, words: 3 },
      { text: "GRACEFUL NAVARATNA STUDS", font: "Lato", weight: "900", loaded: true, px: 26, contrast: 4, words: 3 },
      { text: "★★★★★", font: "Lato", weight: "400", loaded: true, px: 30, contrast: 1.7, words: 0 },
      { text: "Pay now, then monthly for six months, delivered four working days after your last payment, keep this price by paying on time each month and never miss a payment or the price resets to the live rate on the day you pay late again", font: "Lato", weight: "400", loaded: true, px: 26, contrast: 12, words: 48 },
    ],
    fonts: [{ font: "Bodoni Moda", weight: "500", kerns: true, commaTail: 0.04, stroke: 0.13 }, { font: "Lato", weight: "900", kerns: true, commaTail: 0.33, stroke: 0.7 }, { font: "Lato", weight: "400", kerns: true, commaTail: 0.34, stroke: 0.7 }],
    kern: [], images: [],
  }));
  assert.ok(r.fails.some((f: string) => /Bodoni Moda, a hairline face \(thin stroke 13%/.test(f)), r.fails.join("\n"));
  assert.ok(r.fails.some((f: string) => /too faint .*"GRACEFUL NAVARATNA STUDS" 4:1/.test(f)));
  assert.ok(!r.fails.some((f: string) => /★/.test(f)), "stars are decoration, not text to read");
  assert.ok(r.fails.some((f: string) => /54 words on the image/.test(f)));
  const sturdy = m.typeIssues(probeOf({ texts: [{ text: "Wedding season", font: "Nanum Myeongjo", weight: "700", loaded: true, px: 72, contrast: 9, words: 2 }], fonts: [{ font: "Nanum Myeongjo", weight: "700", kerns: true, commaTail: 0.44, stroke: 0.35 }], kern: [], images: [] }));
  assert.deepEqual(sturdy.fails, []);
});

test("store promises carry their terms: dates, pay-later, rankings, specs, policies, discounts, reviews, prices", async () => {
  const m = await load(tool);
  const today = new Date("2026-11-15");
  const base = { file: "05.png", product: "Graceful Navaratna Studs", headline: "Wedding in February? Book it at today's price.", body: "Pay now ₹14,538, then 6 x ₹9,692", cta: "See the studs", price: "₹72,690" };
  let r = m.offerIssues(base, { today });
  assert.ok(r.fails.some((f: string) => /promises a date \("Wedding in February"\) with no timing_check/.test(f)), r.fails.join("\n"));
  assert.ok(r.fails.some((f: string) => /a pay-later line .* with no offer_terms/.test(f)));
  assert.ok(r.fails.some((f: string) => /no price_checked date/.test(f)));
  r = m.offerIssues({ ...base, headline: "Book it at today's price.", offer_terms: "Store FAQ: delivered within 4 working days after your last instalment", price_checked: "2026-11-15" }, { today });
  assert.ok(r.fails.some((f: string) => /never says when it ships/.test(f)), "a pay-first plan must say when it ships");
  r = m.offerIssues({ ...base, headline: "Book it at today's price.", body: "Pay monthly. Ships after your last payment.", offer_terms: "Store FAQ: delivered after your last instalment", price_checked: "2026-11-15" }, { today });
  assert.deepEqual(r.fails, []);
  assert.match(m.offerIssues({ file: "x", headline: "Our #1 most added earring", cta: "Shop", claim_source: "FAQ: natural stones" }).fails[0], /ranking claim \("#1"\)/);
  assert.deepEqual(m.offerIssues({ file: "x", headline: "Top 3 in pendants", cta: "Shop", claim_source: "Product page badge \"Top 3 in pendants\", checked 15 Nov" }).fails, []);
  assert.match(m.offerIssues({ file: "x", headline: "Just 5.24 g of gold", cta: "Shop" }).fails[0], /measured spec \("5.24 g"\)/);
  assert.match(m.offerIssues({ file: "x", headline: "Full refund within 7 days", cta: "Shop" }).fails[0], /policy promise/);
  assert.match(m.offerIssues({ file: "x", headline: "20% off this week", cta: "Shop", price: "₹8,000", compare_at: "₹9,000", price_checked: "2026-11-15" }, { today }).fails[0], /says 20% off, but ₹8,000 against ₹9,000 is 11% off/);
  assert.match(m.offerIssues({ file: "x", headline: "So was Jai.", cta: "Shop", review: { quote: "Exactly as advertised, beautiful", source_text: "Exactly as advertised. Beautifully made!" } }).fails[0], /not word for word/);
  assert.deepEqual(m.offerIssues({ file: "x", headline: "So was Jai.", cta: "Shop", review: { quote: "Exactly as advertised…", source_text: "Exactly as advertised. Beautifully made!" } }).fails, []);
  assert.match(m.offerIssues({ file: "x", headline: "Gift edit", cta: "Shop", price: "₹9,000", price_checked: "2026-10-01" }, { today }).fails[0], /more than 7 days ago/);
  const ai = m.offerIssues({ file: "x", headline: "Gift edit", cta: "Shop", ai_scene: "gpt-image restaged a woman wearing the earrings" }).fails;
  assert.ok(ai.some((f: string) => /no source_photo/.test(f)) && ai.some((f: string) => /drew people with the product/.test(f)));
  assert.deepEqual(m.offerIssues({ file: "x", headline: "Gift edit", cta: "Shop", ai_scene: "marigolds and silk behind the real photo, no people", source_photo: "site/royal-verde_0.jpg" }).fails, []);
  // Money the way each market writes it.
  assert.match(m.textIssues({ headline: "Now $29.9", cta: "Shop" })[0], /writes money the wrong way \("\$29.9"\)/);
  assert.deepEqual(m.textIssues({ headline: "Now $1,299.50 or £1,299", cta: "Shop" }), []);
});

test("ready to upload: the store's URL with UTMs, Meta's limits, a short headline, and the landing page matches", async () => {
  const m = await load(tool);
  const ad = (over = {}) => ({ file: "01.png", product: "Ivory Pearl Hooks", price: "₹15,710", headline: "Kutcheri season? Wear pearls.", cta: "Shop", ad: { primary_text: "Margazhi mornings call for pearls.", headline: "Ivory Pearl Hooks | 18K", description: "₹15,710", url: "https://www.gehnaindia.com/ivory-pearl-hooks?utm_source=meta&utm_medium=paid_social&utm_campaign=margazhi&utm_content=01" }, ...over });
  assert.deepEqual(m.adIssues(ad(), { domain: "gehnaindia.com" }), { fails: [], notes: [] });
  const r = m.adIssues(ad({ headline: "One pair for every silk saree you will wear to every wedding this whole long season ahead", ad: { primary_text: "x".repeat(140), headline: "Ivory Pearl Hook Earrings in 18K Gold, Most Added This Season", url: "https://shop.example.com/p" } }), { domain: "gehnaindia.com" });
  assert.ok(r.fails.some((f: string) => /headline has 17 words/.test(f)), r.fails.join("\n"));
  assert.ok(r.fails.some((f: string) => /goes to shop\.example\.com, not the store/.test(f)));
  assert.ok(r.fails.some((f: string) => /ad\.headline is 61 characters/.test(f)));
  assert.ok(r.notes.some((n: string) => /no utm_source, utm_medium, utm_campaign, utm_content/.test(n)) && r.notes.some((n: string) => /first line of the primary text is 140/.test(n)));
  const pages: Record<string, string> = { "https://a.test/ok": "<h1>Ivory Pearl Hooks</h1><span>&#8377;15,710</span>", "https://a.test/sold": "<h1>Ivory Pearl Hooks</h1><p>Sold out</p>" };
  const fetcher = async (u: string) => ({ status: pages[u] ? 200 : 404, text: async () => pages[u] || "" });
  const out = await m.matchPages([ad({ file: "a.png", ad: { url: "https://a.test/ok" } }), ad({ file: "b.png", ad: { url: "https://a.test/sold" } }), ad({ file: "c.png", ad: { url: "https://a.test/gone" } })], { fetcher });
  assert.equal(out["a.png"].ok, true);
  assert.deepEqual(out["b.png"].issues, ["the page does not show the price ₹15,710"]);
  assert.deepEqual(out["c.png"].issues, ["the page answers 404"]);
  // Round 7: Gehna's pages draw the product with script, so a plain fetch sees neither name nor price. Render them.
  const shell = async () => ({ status: 200, text: async () => "<div id=app></div>" });
  const rendered = await m.matchPages([ad({ file: "d.png", ad: { url: "https://a.test/spa" } })], { fetcher: shell, render: async () => "Ivory Pearl Hooks ₹15,710 Add to cart" });
  assert.deepEqual([rendered["d.png"].ok, rendered["d.png"].method], [true, "rendered"]);
  const noRender = await m.matchPages([ad({ file: "d.png", ad: { url: "https://a.test/spa" } })], { fetcher: shell });
  assert.equal(noRender["d.png"].ok, false);
});

test("the mix: half image-led, two segments, and no repeated angle and format", async () => {
  const m = await load(tool);
  const dir = makeSet(["arch", "band", "circle", "grid", "arch"]);
  const files = ["01-arch.png", "02-band.png", "03-circle.png", "04-grid.png", "05-arch.png"];
  const fmts = ["product", "notes list", "review card", "18K vs 22K table", "receipt"];
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((file, i) => ({ file, layout: file.slice(3, -4), format: fmts[i], angle: i === 3 ? "proof" : `angle ${i}`, segment: "Women 35-44", product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now" }))));
  let r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.ok(r.fails.some((f: string) => /4 of 5 creatives are text cards/.test(f)), m.reportText(r));
  assert.ok(r.fails.some((f: string) => /all 5 creatives speak to one segment/.test(f)));
  const mixed = ["product", "lifestyle", "product", "notes list", "review card"], segs = ["Women 35-44", "Women 45-54", "Men gifting", "Women 35-44", "Women 45-54"];
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((file, i) => ({ file, layout: file.slice(3, -4), format: mixed[i], angle: i < 2 ? "gift" : `angle ${i}`, segment: segs[i], product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now" }))));
  r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.ok(!r.fails.some((f: string) => /text cards|one segment/.test(f)), m.reportText(r));
  assert.ok(!r.fails.some((f: string) => /share both angle/.test(f)), "same angle, different format is fine");
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((file, i) => ({ file, layout: file.slice(3, -4), format: i < 2 ? "product" : mixed[i], angle: i < 2 ? "gift" : `angle ${i}`, segment: segs[i], product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now" }))));
  r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.ok(r.fails.some((f: string) => /01-arch\.png and 02-band\.png share both angle \("gift"\) and format/.test(f)));
});

// Round 7 (15 Nov): 9 of 10 for AI Blocks, but judges still marked down two 44-word text cards, a face cropped tight in
// the notes card, and a set that was all cold prospecting with no retargeting or payment-plan ad.
test("round 7 follow-ups: text cards over 40 words, faces cut by a crop, and a set with no retargeting or offer", async () => {
  const m = await load(tool);
  // Faces: listed, inside the frame and the photo, and not under the button.
  assert.match(m.faceIssues({ format: "model photo (everyday)" }).fails[0], /shows a person \("model"\) but the manifest has no faces/);
  assert.deepEqual(m.faceIssues({ format: "product still life", ai_scene: "Silk behind the real photo. No people drawn." }).fails, []);
  assert.match(m.faceIssues({ format: "notes list", faces: [[0.6, 0, 0.3, 0.25]] }).fails[0], /the face is cut by the edge of the frame/);
  assert.match(m.faceIssues({ format: "notes list", faces: [[0.55, 0.1, 0.2, 0.2]], photo_box: [0.6, 0, 0.4, 0.6] }).fails[0], /cut by the edge of its photo/);
  assert.match(m.faceIssues({ format: "model photo", faces: [[0.3, 0.6, 0.2, 0.2]], cta_box: [0.25, 0.65, 0.4, 0.1] }).fails[0], /the button covers the face/);
  assert.deepEqual(m.faceIssues({ format: "model photo", faces: [[0.3, 0.1, 0.2, 0.2]], photo_box: [0.2, 0, 0.6, 0.7], cta_box: [0.3, 0.8, 0.4, 0.08] }).fails, []);
  // The funnel: a set of 5 needs one piece for warm buyers, or one with a real offer.
  assert.equal(m.isRetargetOrOffer({ angle: "Desire: an heirloom" }), false);
  assert.equal(m.isRetargetOrOffer({ funnel: "retargeting", angle: "Still thinking about it?" }), true);
  assert.equal(m.isRetargetOrOffer({ angle: "Payment plan", offer_terms: "FAQ: 6 monthly payments, ships after the last" }), true);
  const dir = makeSet(["arch", "band", "circle", "grid", "arch"]);
  const files = ["01-arch.png", "02-band.png", "03-circle.png", "04-grid.png", "05-arch.png"];
  const base = (i: number, extra = {}) => ({ file: files[i], layout: files[i].slice(3, -4), format: ["product", "lifestyle", "product", "notes list", "review card"][i], angle: `angle ${i}`, segment: i % 2 ? "Women 35-44" : "Women 45-54", product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now", faces: [], ...extra });
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((_, i) => base(i))));
  let r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.ok(r.fails.some((f: string) => /all 5 creatives are prospecting with no offer/.test(f)), m.reportText(r));
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((_, i) => base(i, i === 2 ? { funnel: "retargeting", angle: "Still thinking about the studs?" } : {}))));
  r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.ok(!r.fails.some((f: string) => /prospecting with no offer/.test(f)), m.reportText(r));
  // Text cards: 40 words at most, read from the type report (round 7's checklist and review card had 44).
  const words = (n: number) => ({ canvas: 1080, texts: [{ text: Array(n).fill("gold").join(" "), font: "Lato", weight: "400", loaded: true, px: 30, contrast: 12, words: n }], fonts: [{ font: "Lato", weight: "400", kerns: true, commaTail: 0.33, stroke: 0.7 }], kern: [], images: [] });
  writeFileSync(path.join(dir, "type-report.json"), JSON.stringify({ "01.html": words(12), "02.html": words(20), "03.html": words(12), "04.html": words(44), "05.html": words(38) }));
  r = m.checkSet(dir, { size: "120x120", buttons: false });
  const card = r.per.find((p: any) => p.file === "04-grid.png");
  assert.ok(card.fails.some((f: string) => /a text card \(notes list\) with 44 words on the image/.test(f)), m.reportText(r));
  assert.ok(!r.per.find((p: any) => p.file === "05-arch.png").fails.some((f: string) => /text card/.test(f)), "38 words on a review card passes");
});

test("brand-facing packs carry the check, and the method gates a set of ads on it", () => {
  assert.ok(TOOL_FILES.some(t => t.name === "check-creative-set.mjs") && BRAND_TOOLS.has("check-creative-set.mjs"));
});
