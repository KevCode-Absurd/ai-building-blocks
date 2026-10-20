// A mind's pixel portrait (lib/face.ts). It blinks now and then, each face on its own clock,
// and stays still for people who ask for reduced motion.
import { useMemo } from "react";
import { type Face, backdrop, drawFace, facePaths, hashOf } from "./lib/face";

export default function PixelFace({ face, area, slug, size = 64, className = "" }: { face?: Face; area?: string; slug: string; size?: number; className?: string }) {
  const art = useMemo(() => {
    const seed = hashOf(slug);
    const { grid, eyes, ink } = drawFace(face ?? {});
    return { seed, paths: facePaths(grid), eyes, ink, bg: backdrop(area ?? "mind", seed) };
  }, [face, area, slug]);
  return (
    <svg className={`pface ${className}`} width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true"
      style={{ ["--blink-delay" as string]: `${(art.seed % 70) / 10}s` }}>
      <rect width="16" height="16" fill={art.bg.base} />
      <path d={art.bg.d} fill={art.bg.tint} />
      {art.paths.map((p) => <path key={p.fill} d={p.d} fill={p.fill} />)}
      <g className="pface-eyes" fill={art.ink}>{art.eyes.map(([x, y]) => <rect key={x} x={x} y={y} width="1" height="1" />)}</g>
    </svg>
  );
}
