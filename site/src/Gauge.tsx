// How much thinking a block needs, as a dial: low, medium or high (docs/MINDS-PRD.md §1).
// No model names, because those change every few months. The needle sweeps in once when the page opens.
import { THINKING, type Thinking } from "./lib/data";

const SEGS = 9;
const FILL: Record<Thinking, number> = { low: 3, medium: 6, high: 9 };
const ANGLE: Record<Thinking, number> = { low: -60, medium: 0, high: 60 };
const C = { x: 60, y: 60 }, R = 46;

// One block of the arc, from a to b degrees (0 = left, 180 = right, along the top).
function seg(a: number, b: number) {
  const p = (d: number) => {
    const t = Math.PI - (d * Math.PI) / 180;
    return `${(C.x + R * Math.cos(t)).toFixed(2)} ${(C.y - R * Math.sin(t)).toFixed(2)}`;
  };
  return `M ${p(a)} A ${R} ${R} 0 0 1 ${p(b)}`;
}

export function Gauge({ level, why }: { level: Thinking; why?: string }) {
  const t = THINKING[level];
  const step = 180 / SEGS, gap = 3;
  return (
    <div className={`gauge g-${level}`} data-testid="thinking" data-level={level}>
      <svg viewBox="0 0 120 80" width="120" height="80" role="img" aria-label={`Thinking it needs: ${t.name}`}>
        {Array.from({ length: SEGS }, (_, i) => (
          <path key={i} d={seg(i * step + gap / 2, (i + 1) * step - gap / 2)} className={i < FILL[level] ? "on" : "off"} />
        ))}
        <g className="needle" style={{ ["--to" as string]: `${ANGLE[level]}deg` }}>
          <line x1={C.x} y1={C.y} x2={C.x} y2={C.y - R + 12} />
        </g>
        <circle cx={C.x} cy={C.y} r="4.5" className="hub" />
        <text x={C.x - R} y="75" textAnchor="middle" className="end">Low</text>
        <text x={C.x + R} y="75" textAnchor="middle" className="end">High</text>
      </svg>
      <div className="gauge-text">
        <span className="gauge-k">Thinking it needs</span>
        <b>{t.name}</b>
        <span className="gauge-line">{t.line}</span>
        {why && <span className="gauge-why">{why}</span>}
      </div>
    </div>
  );
}

/** The same level on a card: three bars, filled up to the level. */
export function ThinkBars({ level }: { level: Thinking }) {
  const n = FILL[level] / 3;
  return (
    <span className="think" title={`${THINKING[level].name} thinking`} aria-label={`${THINKING[level].name} thinking`} data-level={level}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}
    </span>
  );
}
