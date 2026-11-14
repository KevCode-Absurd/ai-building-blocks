// Creative-set check (14 Nov 2026): the Gehna run 2 creatives repeated one template on 8 of 20 though the rule said
// at least 4 layouts, so the check reads layouts from the pixels, not from what the maker says. It also catches the
// slips the judges found: "₹10.000", an empty button, a review quote on the wrong product.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import zlib from "node:zlib";
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
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((file, i) => ({ file, layout: file.slice(3, -4), format: formats[i], product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now", price: "₹21,130" }))));
  const r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.equal(r.ok, true, m.reportText(r));
  assert.equal(r.layouts.length, 4);
  const img = m.decodePng(png(S, S, T.arch(1))), mirror = m.decodePng(png(S, S, (x, y) => T.arch(1)(S - 1 - x, y)));
  assert.ok(m.shapeDistance(m.shapeOf(img), m.shapeOf(mirror)) < 0.05, "an arch on the left matches one on the right");
});

test("the manifest checks catch the slips the Gehna judges found", async () => {
  const m = await load(tool);
  assert.deepEqual(m.textIssues({ headline: "Real 18K gold. Under ₹10.000.", cta: "Shop now" }), ['headline writes money the wrong way ("₹10.000"): use ₹10,000 or ₹1,00,000']);
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
  const entry = (file: string, i: number, extra = {}) => ({ file, layout: spec[i], format: "product", product: `Piece ${i}`, product_box: [0.2, 0.2, 0.6, 0.6], headline: "Gold for every day.", cta: "Shop now", cta_box: box, ...extra });
  // Six real buttons, and four creatives that only claim one: those four fail, and 6 of 10 is under 70%.
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((f, i) => entry(f, i))));
  let r = m.checkSet(dir, { size: "120x120" });
  assert.equal(r.per.filter((p: any) => p.fails.some((f: string) => /does not look like a button/.test(f))).length, 4);
  assert.ok(r.fails.some((f: string) => /only 6 of 10 creatives show a button/.test(f)));
  assert.ok(r.fails.some((f: string) => /only 0 native formats/.test(f)));
  assert.ok(r.notes.some((n: string) => /local or seasonal moment/.test(n)));
  // Real buttons on 7 of 10 would pass; here, give the set 3 native formats and a moment, and drop the buttons rule.
  const fmts = ["notes list", "chat", "18K vs 22K table", "product", "explainer", "product", "product", "product", "product", "product"];
  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files.map((f, i) => entry(f, i, { format: fmts[i], moment: i === 0 ? "Margazhi season" : undefined, cta_box: i < 6 ? box : undefined }))));
  r = m.checkSet(dir, { size: "120x120", buttons: false, type: false });
  assert.equal(r.ok, true, m.reportText(r));
  assert.equal(m.nativeFormat("WhatsApp chat"), "chat");
  assert.equal(m.nativeFormat("split photo panel"), null);
});

test("absolute claims need a source; everyday words do not", async () => {
  const m = await load(tool);
  assert.match(m.claimIssues({ headline: "Every stone we set is natural." }).fails[0], /absolute claim \("Every stone"\)/);
  assert.match(m.claimIssues({ body: "Every Gehna piece has all three." }).fails[0], /"Every Gehna piece"/);
  assert.deepEqual(m.claimIssues({ headline: "Every stone we set is natural.", claim_source: "FAQ: all gemstones natural; lab-grown line is diamonds only" }).fails, []);
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
  assert.ok(r.fails.some((f: string) => /Bodoni Moda does not kern "Wo"/.test(f)), r.fails.join("\n"));
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
  assert.equal(r.per.filter((p: any) => p.fails.some((f: string) => /does not kern "Wo"/.test(f))).length, 10, "01.html matches 01-arch.png");
  // page.evaluate sends only the function's source to the browser, so it must not lean on anything in the module.
  const src = m.typeProbe.toString();
  for (const name of ["RULES", "short(", "path.", "fs.", "typeIssues"]) assert.ok(!src.includes(name), `typeProbe uses ${name}`);
});

test("brand-facing packs carry the check, and the method gates a set of ads on it", () => {
  assert.ok(TOOL_FILES.some(t => t.name === "check-creative-set.mjs") && BRAND_TOOLS.has("check-creative-set.mjs"));
});
