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
  // One pattern per job, fading out from the card's bottom-right corner the same way.
  for (const [job, on] of Object.entries(PATTERNS)) {
    root.style.setProperty(`--pat-${job}`, cells(40, 40, (x, y) => {
      const d = Math.hypot(40 - x, 40 - y) / 40;
      return on(x, y) && B4[y % 4][x % 4] < Math.max(0, 1 - d) * 34;
    }));
  }
}

/** A small repeating picture of each job, drawn in lit cells. */
const PATTERNS: Record<string, (x: number, y: number) => boolean> = {
  "write-ad-copy": (x, y) => y % 4 === 1 && (x + 7 * Math.floor(y / 4)) % 13 < 10, // lines of text
  "make-image-ads": (x, y) => (Math.floor(x / 3) + Math.floor(y / 3)) % 2 === 0, // checks
  "make-video-ads": (x, y) => x % 6 < 4 && !(x % 6 === 1 && y % 4 === 1), // film strip
  "plan-ad-tests": (x, y) => (x % 8 === 3 && y % 8 > 0 && y % 8 < 7) || (y % 8 === 3 && x % 8 > 0 && x % 8 < 7), // plus signs
  "check-ads": (x, y) => { const a = x % 10, b = y % 10; return (a <= 3 && b >= 4 + a - 1 && b <= 5 + a) || (a >= 3 && a <= 8 && b >= 8 - a + 3 - 1 && b <= 8 - a + 3 + 1 && b < 9); }, // ticks
  "read-ad-results": (x, y) => x % 4 < 2 && 39 - y < 8 + ((x * 7) % 23) + Math.floor(x / 2), // bar chart
  "audit-landing-page": (x, y) => x % 5 < 2 && y % 5 < 2, // dot grid
  "write-landing-page": (x, y) => y % 5 !== 0 && (x + (Math.floor(y / 5) % 2) * 4) % 8 !== 0, // blocks of a page
  "product-photos": (x, y) => Math.round(Math.hypot(40 - x, 40 - y)) % 4 === 0, // a lens
  "understand-customers": (x, y) => { const a = (x + (Math.floor(y / 8) % 2) * 4) % 8, b = y % 8; return (b <= 1 && a >= 3 && a <= 4) || (b >= 3 && b <= 5 && a >= 2 && a <= 5); }, // a crowd
  "brand-file": (x, y) => (x - y + 40) % 5 < 2, // stripes
  "study-competitors": (x, y) => Math.abs(y % 6 - 2.5 - 2 * Math.sin(x / 2.5)) < 0.8, // waves
  "make-offer": (x, y) => Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5) < 3, // diamonds
  "grow-social": (x, y) => { const a = x % 8, b = y % 8; return (b <= 3 && Math.abs(a - 3.5) <= b + 0.5) || (b > 3 && b < 7 && a >= 3 && a <= 4); }, // arrows going up
  "set-up-ai": (x, y) => (((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) + 1) % 1 < 0.4, // bits
  "think-with-minds": (x, y) => Math.round(Math.hypot((x % 10) - 4.5, (y % 10) - 4.5)) === 3, // rings
  "test-an-idea": (x, y) => { const a = x % 8, b = y % 8; return b === 6 && a < 7 || (a === 3 && b < 6 && b % 2 === 0); }, // question marks of a sort
  "plan-strategy": (x, y) => (x % 8 === 0 || y % 8 === 0) && (x + y) % 2 === 0, // a map grid
  "build-product": (x, y) => x % 6 < 4 && y % 6 < 4 && !(x % 6 === 1 && y % 6 === 1), // bricks
  "build-software": (x, y) => y % 3 === 0 && x % 12 < 3 + (Math.floor(y / 3) * 5) % 9, // lines of code
  "sell-and-negotiate": (x, y) => Math.abs((x % 10) - (y % 10)) < 1 || Math.abs((x % 10) + (y % 10) - 9) < 1, // crosses
  "lead-people": (x, y) => { const a = x % 10, b = y % 10; return (b < 2 && a >= 4 && a <= 5) || (b >= 3 && b <= 4 && a >= 1 && a <= 8); }, // one ahead of many
  "speak-and-persuade": (x, y) => Math.round(Math.hypot(x % 12, (y % 12) - 6)) % 3 === 0 && x % 12 > 1, // sound waves
  "write-and-tell-stories": (x, y) => y % 5 === 2 && (x + 3 * Math.floor(y / 5)) % 9 < 7, // lines of a page
  "design-work": (x, y) => Math.abs(Math.hypot((x % 8) - 3.5, (y % 8) - 3.5) - 2.5) < 0.7, // circles
  "think-and-decide": (x, y) => (x % 8 === 4 && y % 8 < 4) || (y % 8 === 4 && x % 8 >= 4) || (y % 8 === 4 + (4 - (x % 8)) && x % 8 < 4), // forks
  "money-and-investing": (x, y) => x % 4 < 2 && 39 - y < ((x * 3) % 17) + x / 2, // rising bars
};

/** 8 by 8 icons for the job functions. # is a lit pixel. */
export const ICONS: Record<string, string[]> = {
  copywriter: ["......#.", ".....###", "....###.", "...###..", "..###...", ".###....", ".##.....", "#......."],
  "media-buyer": ["......##", "......##", "...##.##", "...##.##", "##.##.##", "##.##.##", "........", "########"],
  ads: ["######..", "#....#..", "#.#..#..", "######..", "..######", "..#.#..#", "..#.##.#", "..######"],
  photos: ["........", "..##....", "########", "#..##..#", "#.#..#.#", "#..##..#", "########", "........"],
  cro: ["#.......", "##......", "###.....", "####....", "#####...", "###.....", "#.##....", "...##..."],
  strategist: ["..####..", ".#....#.", "#..##..#", "#.####.#", "#.####.#", "#..##..#", ".#....#.", "..####.."],
  social: ["........", ".##..##.", "########", "########", ".######.", "..####..", "...##...", "........"],
  founder: ["..#..#..", ".######.", "##....##", ".#.##.#.", ".#.##.#.", "##....##", ".######.", "..#..#.."],
  minds: ["..####..", ".#....#.", "#..##..#", "#.#..#.#", "#..##..#", ".#....#.", "..#..#..", "..####.."],
  validator: ["..####..", ".#....#.", "......#.", ".....#..", "....#...", "....#...", "........", "....#..."],
  strategy: ["#.......", "##....#.", "#.#..#..", "#..##...", "#.......", "#....#..", "#...#.#.", "########"],
  product: ["...##...", "..####..", ".##..##.", "##....##", "########", "#......#", "#......#", "########"],
  seller: ["........", "##....##", "###..###", ".######.", "..####..", ".######.", "###..###", "........"],
  leader: ["...##...", "...##...", "........", ".##..##.", ".##..##.", "........", "##.##.##", "##.##.##"],
  writer: ["########", "#......#", "#.####.#", "#......#", "#.####.#", "#......#", "#.##...#", "########"],
  maker: ["......##", ".....###", "....###.", "...###..", "..###...", ".##.....", "#.#.....", "##......"],
  thinker: ["...##...", "..#..#..", ".#....#.", ".#....#.", "..#..#..", "...##...", "...##...", "..####.."],
};
