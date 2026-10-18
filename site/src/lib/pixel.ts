// Pixel art and dithering, drawn the way old screens did it: an ordered (Bayer) dither,
// where each cell has a threshold and a shade turns into more or fewer lit cells.

/** An n by n Bayer matrix (n a power of 2): values 0..n*n-1, spread so neighbours never light up together. */
export function bayer(n: number): number[][] {
  let m = [[0]];
  while (m.length < n) {
    const k = m.length;
    m = Array.from({ length: k * 2 }, (_, y) =>
      Array.from({ length: k * 2 }, (_, x) => 4 * m[y % k][x % k] + [0, 2, 3, 1][(y >= k ? 2 : 0) + (x >= k ? 1 : 0)]));
  }
  return m;
}
const B4 = bayer(4);
export const B8 = bayer(8);

/** One SVG path of 1x1 squares, for every cell where on(x, y) is true. */
function cells(w: number, h: number, on: (x: number, y: number) => boolean) {
  let d = "";
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (on(x, y)) d += `M${x} ${y}h1v1h-1z`;
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><path d="${d}"/></svg>`)}")`;
}

/** Dither masks, set once as CSS variables so any element can use them with mask-image. */
export function installDither(root = document.documentElement) {
  // Fades in from left (empty) to right (solid), 4 cells tall, to repeat down an edge.
  root.style.setProperty("--dither-x", cells(48, 4, (x, y) => B4[y % 4][x % 4] < ((x + 0.5) / 48) * 16));
  // Fades in from top (empty) to bottom (solid), to repeat along a band.
  root.style.setProperty("--dither-y", cells(4, 32, (x, y) => B4[y % 4][x % 4] < ((y + 0.5) / 32) * 16));
  // Solid in the bottom-right corner, fading out towards the top-left.
  root.style.setProperty("--dither-corner", cells(40, 40, (x, y) => {
    const d = Math.hypot(40 - x, 40 - y) / 40;
    return B4[y % 4][x % 4] < Math.max(0, 1 - d) * 18;
  }));
}

/** 8 by 8 icons for the job functions. # is a lit pixel. */
export const ICONS: Record<string, string[]> = {
  copywriter: ["......#.", ".....###", "....###.", "...###..", "..###...", ".###....", ".##.....", "#......."],
  "media-buyer": ["......##", "......##", "...##.##", "...##.##", "##.##.##", "##.##.##", "........", "########"],
  designer: ["........", "########", "#......#", "#....#.#", "#..#...#", "#.###.##", "########", "........"],
  video: ["########", "#......#", "#..#...#", "#..##..#", "#..###.#", "#..##..#", "#..#...#", "########"],
  cro: ["#.......", "##......", "###.....", "####....", "#####...", "###.....", "#.##....", "...##..."],
  strategist: ["..####..", ".#....#.", "#..##..#", "#.####.#", "#.####.#", "#..##..#", ".#....#.", "..####.."],
  social: ["........", ".##..##.", "########", "########", ".######.", "..####..", "...##...", "........"],
  founder: ["..#..#..", ".######.", "##....##", ".#.##.#.", ".#.##.#.", "##....##", ".######.", "..#..#.."],
};
