// Pixel portraits for minds: a 16 by 16 face drawn from a few traits in catalogue-items/minds/_avatars.yaml
// (format: catalogue-items/minds/README.md, "Avatars"). Same traits in, same picture out, so a face never shifts.

export type Face = {
  skin?: number; hair?: string; hairColor?: string; beard?: string; beardColor?: string; glasses?: string;
  hat?: string; hatColor?: string; top?: string; color?: string; color2?: string; extra?: string; mouth?: string;
};

const SKIN = ["#f6d7bf", "#ecbf98", "#d6a072", "#b47a4c", "#8a5733", "#5a3820"];
const HAIR: Record<string, string> = {
  black: "#1d1a1a", dark: "#3a281d", brown: "#6a4327", auburn: "#8c3a1d", red: "#c0532a", blonde: "#e2b955",
  sandy: "#b88f5e", grey: "#8f8f92", silver: "#c6c6ca", white: "#efeee9",
};
const CLOTH: Record<string, string> = {
  black: "#1f1f24", white: "#f2f1ec", navy: "#25356b", grey: "#8b8e96", charcoal: "#3c3f47", red: "#c8372f",
  blue: "#2f6fd6", green: "#2f8a4c", brown: "#6b4628", tan: "#c49a6c", purple: "#6c45b8", pink: "#e47aa3",
  yellow: "#efc23a", orange: "#e8742a", teal: "#1f8f8a", cream: "#ece2c8", gold: "#d9a72b", maroon: "#7a2232",
};

const col = (v: string | undefined, table: Record<string, string>, fallback: string) =>
  !v ? fallback : v.startsWith("#") ? v : table[v] ?? fallback;
function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, "0")).join("")}`;
}
/** A small stable number from a slug, for the dither offset and the blink delay. */
export function hashOf(s: string) { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }

const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

/** The picture as a 16x16 grid of colours (null = background), plus where the eyes are so they can blink. */
export function drawFace(f: Face) {
  const G: (string | null)[][] = Array.from({ length: 16 }, () => Array(16).fill(null));
  const put = (x: number, y: number, c: string | null) => { if (x >= 0 && x < 16 && y >= 0 && y < 16) G[y][x] = c; };
  const row = (y: number, x0: number, x1: number, c: string | null) => { for (let x = x0; x <= x1; x++) put(x, y, c); };
  const rect = (x0: number, y0: number, x1: number, y1: number, c: string) => { for (let y = y0; y <= y1; y++) row(y, x0, x1, c); };

  const skin = SKIN[Math.min(6, Math.max(1, f.skin ?? 2)) - 1];
  const skinD = shade(skin, -0.16);
  const hair = col(f.hairColor, HAIR, HAIR.black);
  const hairD = shade(hair, -0.25);
  const beard = col(f.beardColor, HAIR, hair);
  const cloth = col(f.color, CLOTH, CLOTH.black);
  const clothD = shade(cloth, -0.22);
  const c2 = col(f.color2, CLOTH, CLOTH.red);
  const white = CLOTH.white;
  const ink = "#1b1720";
  const style = f.hair ?? "short";
  const longBack = style === "long" || style === "bob" || style === "ponytail" || style === "locs";

  // Hair that falls behind the head and shoulders.
  if (longBack) {
    const end = style === "bob" ? 10 : 13;
    rect(3, 4, 4, end, hairD); rect(11, 4, 12, end, hairD);
    if (style === "long" || style === "locs") { row(13, 2, 4, hairD); row(13, 11, 13, hairD); }
  }
  if (style === "afro") { rect(2, 1, 13, 9, hair); row(0, 5, 10, hair); row(10, 3, 12, hairD); }
  if (style === "curly") { rect(3, 2, 12, 8, hair); row(1, 5, 10, hair); }

  // Body and clothes (rows 12 to 15).
  const top = f.top ?? "tee";
  rect(2, 13, 13, 15, cloth); put(2, 13, null); put(13, 13, null); row(12, 6, 9, cloth);
  rect(3, 14, 3, 15, clothD); rect(12, 14, 12, 15, clothD);
  // Neck.
  put(7, 12, skinD); put(8, 12, skinD);
  switch (top) {
    case "tee": put(7, 13, skinD); put(8, 13, skinD); break;
    case "shirt": put(6, 12, white); put(9, 12, white); put(7, 13, skinD); put(8, 13, skinD); put(6, 13, white); put(9, 13, white); break;
    case "suit": row(13, 6, 9, white); put(7, 13, c2); put(8, 13, c2); put(7, 14, c2); put(8, 14, c2); put(7, 15, c2);
      put(6, 14, clothD); put(9, 14, clothD); break;
    case "suit-open": row(13, 6, 9, white); put(7, 14, white); put(8, 14, white); put(6, 14, clothD); put(9, 14, clothD); put(7, 13, skinD); put(8, 13, skinD); break;
    case "turtleneck": row(12, 6, 9, cloth); row(11, 7, 8, clothD); break;
    case "hoodie": row(12, 5, 10, clothD); put(7, 13, skinD); put(8, 13, skinD); put(6, 14, white); put(9, 14, white); put(6, 15, white); put(9, 15, white); break;
    case "sweater": put(7, 13, white); put(8, 13, white); row(15, 3, 12, clothD); break;
    case "robe": { const drape = shade(cloth, -0.3); for (let i = 0; i < 4; i++) { put(4 + i * 2, 13 + Math.floor(i * 0.7), drape); put(5 + i * 2, 13 + Math.floor(i * 0.7), drape); } put(7, 13, skinD); put(8, 13, skinD); break; }
    case "ruff": { row(12, 4, 11, white); row(13, 4, 11, white); for (let x = 4; x <= 11; x += 2) put(x, 13, shade(white, -0.15)); break; }
    case "blouse": row(13, 6, 9, skinD); put(7, 14, skinD); put(8, 14, skinD); break;
    case "kimono": put(7, 13, skinD); put(8, 13, skinD); put(6, 13, c2); put(9, 13, c2); put(7, 14, c2); put(8, 15, c2); put(6, 12, c2); put(9, 12, c2); break;
    case "labcoat": rect(2, 13, 13, 15, white); put(2, 13, null); put(13, 13, null); row(12, 6, 9, white);
      put(7, 13, cloth); put(8, 13, cloth); put(7, 14, cloth); put(8, 14, cloth); put(6, 14, shade(white, -0.15)); put(9, 14, shade(white, -0.15)); break;
    case "jacket": put(7, 13, c2); put(8, 13, c2); put(7, 14, c2); put(8, 14, c2); put(7, 15, c2); put(8, 15, c2); put(6, 13, clothD); put(9, 13, clothD); break;
  }

  // Head (x 4 to 11, y 3 to 11), ears and face.
  rect(4, 3, 11, 10, skin); row(11, 5, 10, skin); G[3][4] = null; G[3][11] = null;
  put(3, 7, skin); put(3, 8, skinD); put(12, 7, skin); put(12, 8, skinD);
  row(11, 5, 10, skin); put(5, 11, skinD); put(10, 11, skinD);
  put(8, 8, skinD); // nose
  // Eyebrows and eyes.
  const brow = f.hair === "bald" && !f.hairColor ? HAIR.dark : (style === "wild" || f.hairColor === "white" || f.hairColor === "silver") ? hairD : hair;
  put(5, 6, brow); put(6, 6, brow); put(9, 6, brow); put(10, 6, brow);
  // Mouth.
  const lip = shade(skin, -0.4);
  if (f.mouth === "grin") { row(9, 6, 9, lip); put(7, 9, white); put(8, 9, white); row(10, 7, 8, lip); }
  else if (f.mouth === "smile") { put(6, 9, lip); put(9, 9, lip); put(7, 10, lip); put(8, 10, lip); }
  else row(10, 7, 8, lip);

  // Facial hair.
  const bd = f.beard ?? "none";
  // Stubble is a light shadow along the jaw, every other pixel, so it doesn't read as a mask.
  if (bd === "stubble") { for (let y = 10; y <= 11; y++) for (let x = 4; x <= 11; x++) if (G[y][x] === skin && (x + y) % 2 === 0) put(x, y, shade(skin, -0.15)); }
  if (bd === "mustache" || bd === "goatee" || bd === "beard" || bd === "longbeard") { row(9, 6, 9, beard); if (f.mouth === "grin") { put(7, 10, white); put(8, 10, white); } }
  if (bd === "goatee") { put(7, 11, beard); put(8, 11, beard); put(6, 11, beard); put(9, 11, beard); }
  if (bd === "beard" || bd === "longbeard") {
    rect(4, 8, 4, 10, beard); rect(11, 8, 11, 10, beard); row(10, 5, 6, beard); row(10, 9, 10, beard);
    row(11, 5, 10, beard); row(12, 6, 9, beard);
    if (f.mouth !== "grin") { put(7, 10, lip); put(8, 10, lip); }
  }
  if (bd === "longbeard") { row(13, 5, 10, beard); row(14, 6, 9, beard); row(15, 7, 8, beard); put(7, 13, shade(beard, -0.2)); }

  // Hair on top.
  switch (style) {
    case "bald": put(6, 4, shade(skin, 0.35)); put(7, 4, shade(skin, 0.35)); break;
    case "receding": rect(4, 4, 4, 6, hair); rect(11, 4, 11, 6, hair); put(5, 4, hair); put(10, 4, hair); put(6, 3, shade(skin, 0.3)); break;
    case "buzz": row(3, 5, 10, hair); for (let x = 4; x <= 11; x++) put(x, 4, (x % 2) ? hair : shade(skin, -0.3)); put(4, 5, hair); put(11, 5, hair); break;
    case "part": row(2, 5, 10, hair); row(3, 4, 11, hair); row(4, 4, 8, hair); put(4, 5, hair); put(11, 4, hair); put(11, 5, hair); put(9, 2, hairD); put(5, 3, shade(hair, 0.2)); break;
    case "quiff": row(1, 6, 10, hair); row(2, 5, 11, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair); put(4, 5, hair); put(11, 5, hair); put(8, 1, shade(hair, 0.25)); break;
    case "slick": row(2, 5, 10, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair); row(2, 6, 9, shade(hair, 0.18)); break;
    case "spiky": [5, 7, 9].forEach((x) => { put(x, 1, hair); }); [4, 6, 8, 10].forEach((x) => put(x, 1, null)); row(2, 4, 11, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair); break;
    case "curly": for (let x = 3; x <= 12; x++) { put(x, 3, hair); if (x % 2) put(x, 4, hair); } rect(3, 4, 3, 8, hair); rect(12, 4, 12, 8, hair);
      [4, 6, 8, 10].forEach((x) => put(x, 1, hair)); put(5, 2, hairD); put(9, 2, hairD); break;
    case "afro": row(3, 4, 11, hair); for (let x = 4; x <= 11; x++) if (x % 3 === 0) put(x, 4, hair); [3, 6, 9, 12].forEach((x) => put(x, 2, hairD)); break;
    case "wild": row(2, 3, 12, hair); row(3, 2, 13, hair); rect(2, 4, 3, 8, hair); rect(12, 4, 13, 8, hair);
      [2, 5, 8, 11, 13].forEach((x) => put(x, 1, hair)); put(1, 4, hair); put(14, 4, hair); put(1, 6, hair); put(14, 7, hair); put(5, 4, hair); put(9, 4, hair); break;
    case "locs": // long hair in ropes: alternating light and dark strands down each side
      row(2, 5, 10, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair);
      for (let y = 4; y <= 13; y++) for (const x of [2, 3, 4, 11, 12, 13]) if (y > 4 || x === 4 || x === 11) put(x, y, x % 2 ? hair : hairD);
      [5, 7, 9].forEach((x) => put(x, 4, hairD)); break;
    case "long": case "bob": row(2, 5, 10, hair); row(3, 4, 11, hair); row(4, 4, 6, hair); put(11, 4, hair); rect(4, 5, 4, 7, hair); rect(11, 5, 11, 7, hair); break;
    case "bun": row(2, 5, 10, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair); rect(6, 0, 9, 1, hair); put(6, 0, null); put(9, 0, null); break;
    case "ponytail": row(2, 5, 10, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair); rect(12, 4, 13, 9, hair); put(13, 10, hair); break;
    default: row(2, 5, 10, hair); row(3, 4, 11, hair); put(4, 4, hair); put(11, 4, hair); put(4, 5, hair); put(11, 5, hair); put(6, 2, shade(hair, 0.2)); break; // short
  }

  // Hats.
  const hc = col(f.hatColor, CLOTH, CLOTH.charcoal), hcD = shade(hc, -0.25);
  switch (f.hat) {
    case "cap": row(1, 5, 10, hc); row(2, 4, 11, hc); row(3, 4, 11, hc); row(4, 1, 7, hcD); put(8, 1, shade(hc, 0.3)); break;
    case "beanie": row(0, 6, 9, hc); row(1, 5, 10, hc); row(2, 4, 11, hc); row(3, 4, 11, hc); row(4, 4, 11, hcD); break;
    case "beret": row(1, 5, 11, hc); row(2, 3, 12, hc); row(3, 4, 11, hcD); put(8, 0, hc); break;
    case "fedora": row(0, 6, 9, hc); row(1, 5, 10, hc); row(2, 5, 10, hcD); row(3, 2, 13, hc); break;
    case "tophat": rect(5, 0, 10, 2, hc); row(2, 5, 10, c2); row(3, 3, 12, hc); break;
    case "laurel": { const g = "#3f8f3a", gl = "#6fbf55"; [[4, 3], [5, 2], [3, 4], [3, 5], [11, 3], [10, 2], [12, 4], [12, 5]].forEach(([x, y], i) => put(x, y, i % 2 ? gl : g)); break; }
    case "headband": row(4, 4, 11, hc); put(12, 5, hc); break;
    case "turban": row(1, 5, 10, hc); row(2, 4, 11, hc); row(3, 4, 11, hcD); row(4, 4, 11, hc); put(7, 2, hcD); put(8, 3, hc); break;
    case "wrap": row(1, 5, 10, hc); rect(4, 2, 11, 4, hc); rect(3, 4, 3, 9, hc); rect(12, 4, 12, 9, hc); row(3, 5, 10, hcD); break;
  }

  // Glasses.
  // Thin frames are mid grey so the eye inside still shows; thick ones are black above and below the eye.
  const fr = "#5c5c5c";
  switch (f.glasses) {
    case "round": put(5, 7, fr); put(7, 7, fr); put(8, 7, fr); put(10, 7, fr); put(6, 6, fr); put(9, 6, fr); put(6, 8, fr); put(9, 8, fr); break;
    case "square": row(6, 5, 7, fr); row(6, 8, 10, fr); put(5, 7, fr); put(7, 7, fr); put(8, 7, fr); put(10, 7, fr); break;
    case "thick": row(6, 5, 10, ink); row(8, 5, 6, ink); row(8, 9, 10, ink); put(7, 7, ink); put(8, 7, ink); put(4, 7, ink); put(11, 7, ink); break;
    case "sun": row(6, 4, 11, fr); row(7, 5, 10, "#2b2840"); put(5, 7, "#4b4a6e"); put(8, 7, "#4b4a6e"); break;
  }

  // Extras.
  switch (f.extra) {
    case "pearls": [5, 7, 8, 10].forEach((x) => put(x, 13, "#fbf7ee")); put(6, 14, "#fbf7ee"); put(9, 14, "#fbf7ee"); break;
    case "earrings": put(3, 9, CLOTH.gold); put(12, 9, CLOTH.gold); break;
    case "chain": put(6, 13, CLOTH.gold); put(9, 13, CLOTH.gold); put(7, 14, CLOTH.gold); put(8, 14, CLOTH.gold); break;
    case "bowtie": put(6, 13, c2); put(7, 13, shade(c2, -0.25)); put(8, 13, shade(c2, -0.25)); put(9, 13, c2); put(6, 12, c2); put(9, 12, c2); break;
    case "scarf": row(12, 4, 11, c2); row(13, 5, 10, c2); put(9, 14, c2); put(9, 15, shade(c2, -0.2)); break;
  }

  const sunglasses = f.glasses === "sun";
  const eyes: [number, number][] = sunglasses ? [] : [[6, 7], [9, 7]];
  // Black and white: every colour becomes its grey, then a black outline
  // goes round the figure so light and deep skin tones both stand out on the pale backdrop.
  const mono = G.map((r) => r.map((c) => (c ? grey(c) : null)));
  const out = mono.map((r) => [...r]);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    if (mono[y][x]) continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => mono[y + dy]?.[x + dx])) out[y][x] = INK;
  }
  return { grid: out, eyes, ink: INK };
}

const INK = "#111111";
/** A colour's grey: its perceived lightness, a touch darker so pale skin doesn't vanish into white. */
function grey(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  const v = Math.round(255 * Math.min(1, Math.max(0, l * 0.96)));
  const h = v.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

/** One path per colour, so a face is a handful of SVG nodes. */
export function facePaths(grid: (string | null)[][]) {
  const by = new Map<string, string>();
  grid.forEach((r, y) => r.forEach((c, x) => { if (c) by.set(c, (by.get(c) ?? "") + `M${x} ${y}h1v1h-1z`); }));
  return [...by].map(([fill, d]) => ({ fill, d }));
}

/** The dithered backdrop: pale grey, fading to white towards the top left. */
export function backdrop(_area: string, seed: number) {
  const base = "#dedede", tint = "#ffffff";
  let d = "";
  const ox = seed % 4, oy = (seed >>> 2) % 4;
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const t = 1 - Math.hypot(x, y) / 15;
    if (BAYER4[(y + oy) % 4][(x + ox) % 4] < t * 12) d += `M${x} ${y}h1v1h-1z`;
  }
  return { base, tint, d };
}
