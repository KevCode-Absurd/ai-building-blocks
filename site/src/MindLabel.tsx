// Role labels on the minds (catalogue-items/minds/_labels.yaml): Investor, Founder, Designer and so on.
// Each one wears a 7 by 7 pixel icon drawn in the same hand as the pixel faces, so a badge reads at a glance.
import type { Catalogue } from "./lib/data";

const ICONS: Record<string, string[]> = {
  founder: ["...#...", "..###..", "..#.#..", "..###..", ".#####.", "#.#.#.#", "..#.#.."],
  investor: [".....##", "......#", "....#.#", "#..#...", "##.#...", "####...", "#######"],
  operator: ["..#.#..", ".#####.", "##...##", ".#.#.#.", "##...##", ".#####.", "..#.#.."],
  product: ["..###..", ".#...#.", "#######", "#..#..#", "#..#..#", "#..#..#", "#######"],
  marketer: ["......#", "....###", "####..#", "#.#...#", "####..#", ".#..###", ".#....#"],
  copywriter: ["##..##.", "##..##.", ".#...#.", "#...#..", ".......", "#######", "......."],
  seller: ["####...", "#..##..", "#.#.##.", "#...###", ".#...##", "..#..#.", "...##.."],
  creator: ["#######", "#.#...#", "#.##..#", "#.###.#", "#.##..#", "#.#...#", "#######"],
  designer: ["...#...", "..#.#..", "..###..", ".#...#.", ".#...#.", "#.....#", "#.....#"],
  artist: [".#####.", "#.....#", "#.#.#.#", "#.....#", "#..####", "#..#...", ".###..."],
  musician: ["..####.", "..#..#.", "..#..#.", "..#..#.", "###.##.", "###.##.", "......."],
  filmmaker: ["#.#.#.#", "#######", ".......", "#######", "#.....#", "#.....#", "#######"],
  writer: ["##...##", "#.#.#.#", "#.#.#.#", "#.#.#.#", "#.#.#.#", "##.#.##", "...#..."],
  scientist: ["..###..", "...#...", "...#...", "..#.#..", ".#...#.", "#.###.#", "#######"],
  inventor: ["..###..", ".#...#.", "#.....#", "#..#..#", ".#.#.#.", "..###..", "..###.."],
  engineer: ["..#.#..", ".#...#.", "#..#..#", "#..#..#", "#..#..#", ".#...#.", "..#.#.."],
  thinker: [".#####.", "#.....#", "#.##..#", "#..#..#", ".#####.", "..##...", ".#....."],
  psychologist: ["..###..", ".#...#.", "#..#..#", "#.#.#.#", "#..#..#", ".#...#.", "..###.."],
  economist: ["..###..", ".#.#.#.", ".#.#...", "..###..", "...#.#.", ".#.#.#.", "..###.."],
  strategist: ["...#...", "..###..", ".#.#.#.", "###.###", ".#.#.#.", "..###..", "...#..."],
  leader: ["#..#..#", "##.#.##", "#######", "#######", "#.....#", "#######", "......."],
  coach: ["...#...", "..###..", "#######", ".#####.", "..###..", ".##.##.", ".#...#."],
};

/** The pixel icon for a label, in the text colour. */
export function LabelIcon({ id, size = 14 }: { id: string; size?: number }) {
  const rows = ICONS[id];
  if (!rows) return null;
  return (
    <svg className="lb-icon" width={size} height={size} viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((r, y) => [...r].map((ch, x) => (ch === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)))}
    </svg>
  );
}

/** A mind's labels as a row of badges. The first one is what they're most known for, so it's drawn solid. */
export function LabelBadges({ c, labels, max = 3, size = "md" }: { c: Catalogue; labels?: string[]; max?: number; size?: "sm" | "md" }) {
  const names = c.minds?.labels ?? {};
  const shown = (labels ?? []).filter((l) => names[l]).slice(0, max);
  if (!shown.length) return null;
  return (
    <span className={`labels labels-${size}`} data-testid="mind-labels">
      {shown.map((l, i) => (
        <span key={l} className={`lb${i === 0 ? " lb-main" : ""}`} data-label={l}>
          <LabelIcon id={l} size={size === "sm" ? 11 : 13} />
          {names[l]}
        </span>
      ))}
    </span>
  );
}
