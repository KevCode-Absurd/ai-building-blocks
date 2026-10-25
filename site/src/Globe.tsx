import { useEffect, useRef } from "react";
import { LAND, LAND_H, LAND_W } from "./landmask";
import "./globe.css";

// The world, drawn in 0s and 1s, turning slowly behind the hero.
// Land is digits, sea is faint dots. Point at it and the digits near the cursor light up in colour and scramble;
// hover over the globe and the whole map takes on colour. Drag it to spin it.
// It holds still for people who ask for reduced motion (pointing and dragging still work),
// and pauses when it is off screen or the tab is hidden.
const N = 12000;
const MOBILE_N = 4200;
const SPEED = 0.045; // radians per second: one gentle turn in about 140 seconds
const REACH = 150; // px around the cursor that light up
const REGION_COUNT = 3;

const land = (() => {
  const bin = atob(LAND);
  return (lat: number, lon: number) => {
    const r = Math.min(LAND_H - 1, Math.max(0, Math.floor(90 - lat)));
    const c = Math.min(LAND_W - 1, Math.max(0, Math.floor(lon + 180)));
    const i = r * LAND_W + c;
    return ((bin.charCodeAt(i >> 3) >> (i & 7)) & 1) === 1;
  };
})();

type Pt = { x: number; y: number; z: number; land: boolean; hue: number; c: "0" | "1"; glow: number };
type Region = { x: number; y: number; z: number; edge: number; age: number; duration: number };

export default function Globe({ calm = false }: { calm?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const host = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const still = calm || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(hover: none)").matches;

    // Even points on a sphere; east is to the right when longitude 0 faces you.
    const pts: Pt[] = [];
    // This is decorative art, so keep the mobile canvas light enough to leave
    // the main thread free for the page and its controls.
    // Keep the binary pattern dense enough to read as a globe on small screens;
    // the deferred canvas can spend its budget on decoration after the hero paints.
    const pointCount = touch ? MOBILE_N : N;
    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (2 * (i + 0.5)) / pointCount;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      const x = Math.cos(t) * r, z = Math.sin(t) * r;
      const lat = (Math.asin(y) * 180) / Math.PI, lon = (Math.atan2(x, z) * 180) / Math.PI;
      const isLand = land(lat, lon);
      if (!isLand && i % 2) continue; // half the sea is enough to show the outline
      pts.push({ x, y, z, land: isLand, hue: (lon + 180 + lat * 0.8 + 360) % 360, c: Math.random() < 0.5 ? "0" : "1", glow: 0 });
    }

    let w = 0, h = 0, dpr = 1, angle = -1.4, tilt = 0.42, spin = 0, last = performance.now(), raf = 0, visible = true;
    let rgb = "0,0,0", font = "monospace", dark = false;
    let px = -9999, py = -9999, hov = 0, hovTarget = 0, tapFade = 0;
    let drag: { x: number; y: number; t: number; pointerId: number; touch: boolean } | null = null;
    const sprites = new Map<string, HTMLCanvasElement>();

    // Patches live on the sphere, so they turn with the continents. Start each
    // new pulse on visible land and keep just a few separated areas lit at once.
    const landPoints = pts.filter(p => p.land);
    const regions: Region[] = [];
    const newRegion = (replacing?: Region): Region => {
      const ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), st = Math.sin(tilt);
      const candidates = landPoints.filter(p => {
        const depth = p.y * st + (-p.x * sa + p.z * ca) * ct;
        return depth > 0.35 && regions.every(r => r === replacing || p.x * r.x + p.y * r.y + p.z * r.z < 0.85);
      });
      const pool = candidates.length ? candidates : landPoints;
      const p = pool[Math.floor(Math.random() * pool.length)];
      return { x: p.x, y: p.y, z: p.z, edge: Math.cos(0.26 + Math.random() * 0.12), age: 0, duration: 3.6 + Math.random() * 2 };
    };
    if (!still) {
      for (let i = 0; i < REGION_COUNT; i++) {
        const region = newRegion();
        region.age = region.duration * (0.2 + i * 0.2);
        regions.push(region);
      }
    }

    const SIZES = [8, 10.5, 13, 15.5];
    // Digits shrink with the globe, so a small screen doesn't pile them on top of each other.
    let fs = 0.9;
    // Each digit is drawn once per size and colour, then stamped, so thousands of digits stay cheap.
    const sprite = (ch: string, band: number, hueStep: number) => {
      const key = `${ch}${band}:${hueStep}`;
      let s = sprites.get(key);
      if (!s) {
        const size = SIZES[band] * fs;
        s = document.createElement("canvas");
        s.width = s.height = Math.ceil(size * 1.3 * dpr);
        const g = s.getContext("2d")!;
        g.scale(dpr, dpr);
        g.font = `500 ${size}px ${font}`;
        g.textAlign = "center"; g.textBaseline = "middle";
        g.fillStyle = hueStep < 0 ? `rgb(${rgb})` : `hsl(${hueStep * 15} 85% ${dark ? 64 : 46}%)`;
        g.fillText(ch, (size * 1.3) / 2, (size * 1.3) / 2);
        sprites.set(key, s);
      }
      return s;
    };

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      rgb = cs.getPropertyValue("--globe-rgb").trim() || "0,0,0";
      font = cs.getPropertyValue("--mono").trim() || "monospace";
      dark = rgb.startsWith("255");
      sprites.clear();
    };
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const next = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
      if (next !== dpr) sprites.clear();
      dpr = next; w = box.width; h = box.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const f = Math.max(0.55, Math.min(0.9, (geom().R / 430) * 0.9 + 0.2));
      if (Math.abs(f - fs) > 0.01) { fs = f; sprites.clear(); }
    };
    const geom = () => ({ R: Math.min(w * 0.46, h * 0.46, 430), cx: w / 2, cy: h * 0.5 });

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const { R, cx, cy } = geom();
      const ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), st = Math.sin(tilt);
      const shift = (performance.now() / 1000) * 24; // colours drift slowly round the map
      const near = Math.max(tapFade, px > -9000 ? 1 : 0);
      const pulses = regions.map(r => Math.sin(Math.PI * r.age / r.duration) ** 2);
      ctx.fillStyle = `rgba(${rgb},${dark ? 0.16 : 0.12})`;
      for (const p of pts) {
        const x = p.x * ca + p.z * sa, z0 = -p.x * sa + p.z * ca;
        const y = p.y * ct - z0 * st, z = p.y * st + z0 * ct;
        const sx = cx + x * R, sy = cy - y * R;
        if (!p.land || z < 0) {
          // Sea, and the far side of the world: a dot, fainter the further away.
          if (z < -0.2) continue;
          ctx.globalAlpha = p.land ? 0.5 : 0.25 + 0.75 * Math.max(0, z);
          ctx.fillRect(sx - 0.6, sy - 0.6, 1.2, 1.2);
          continue;
        }
        let k = 0;
        if (near) {
          const dx = sx - px, dy = sy - py, d2 = dx * dx + dy * dy;
          if (d2 < REACH * REACH) { const f = 1 - Math.sqrt(d2) / REACH; k = f * f * near; }
        }
        if (k > 0.02 && Math.random() < k * 0.12 * dt * 60) { p.c = p.c === "0" ? "1" : "0"; p.glow = Math.max(p.glow, 0.6); }
        let regionGlow = 0;
        for (let i = 0; i < regions.length; i++) {
          const r = regions[i];
          const dot = p.x * r.x + p.y * r.y + p.z * r.z;
          const falloff = Math.max(0, (dot - r.edge) / (1 - r.edge));
          regionGlow = Math.max(regionGlow, falloff * falloff * pulses[i]);
        }
        const band = Math.min(3, Math.floor(z * 4));
        const colour = hov * 0.7 + k > 0.18 || (!still && p.glow > 0.2);
        const hueStep = Math.floor(((p.hue + shift) % 360) / 15);
        const s = sprite(p.c, band, colour ? hueStep : -1);
        const scale = 1 + 0.7 * k + 0.12 * regionGlow;
        // Keep the land silhouette visible at a glance; the previous low baseline
        // opacity made the binary continents disappear into the hero on phones.
        const alpha = Math.min(0.92, 0.2 + 0.66 * z * z + p.glow * 0.45 + k * 0.6 + (colour ? hov * 0.12 : 0));
        ctx.globalAlpha = alpha;
        const sw = (s.width / dpr) * scale;
        ctx.drawImage(s, sx - sw / 2, sy - sw / 2, sw, sw);
        // Blend the coloured digits in continuously, including at patch edges.
        if (regionGlow > 0.005) {
          ctx.globalAlpha = regionGlow * 0.85;
          ctx.drawImage(sprite(p.c, band, hueStep), sx - sw / 2, sy - sw / 2, sw, sw);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      // Idle decoration needs fewer frames than active pointer feedback, especially on phones.
      if (!still && !drag && !hovTarget && !tapFade && now - last < (touch ? 1000 / 15 : 1000 / 24) - 1) {
        raf = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!drag) {
        angle += (still ? 0 : SPEED) * dt + spin * dt;
        spin *= Math.exp(-dt * 2.2);
        if (Math.abs(spin) < 0.002) spin = 0;
      }
      hov += (hovTarget - hov) * Math.min(1, dt * 5);
      tapFade = Math.max(0, tapFade - dt * 0.8);
      for (let i = 0; i < regions.length; i++) {
        regions[i].age += dt;
        if (regions[i].age >= regions[i].duration) regions[i] = newRegion(regions[i]);
      }
      for (const p of pts) {
        if (!p.land) continue;
        if (p.glow > 0) p.glow = Math.max(0, p.glow - dt * 0.9);
      }
      draw(dt);
      const busy = !still || drag || spin || Math.abs(hovTarget - hov) > 0.01 || px > -9000 || tapFade > 0;
      raf = busy && visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } };

    // Pointing and dragging. The globe sits behind the words, so listen on the hero and leave links and text alone.
    const local = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    const onTheGlobe = (x: number, y: number) => { const { R, cx, cy } = geom(); return Math.hypot(x - cx, y - cy) < R * 1.04; };
    const blocked = (e: PointerEvent) => !!(e.target as Element | null)?.closest?.(e.pointerType === "mouse" ? "a, button, input, h1, .lede" : "a, button, input");
    const dragMove = (e: PointerEvent) => {
      if (!drag || drag.pointerId !== e.pointerId) return;
      const p = local(e);
      {
        const { R } = geom();
        const dx = p.x - drag.x, dy = p.y - drag.y, dtm = Math.max(1, e.timeStamp - drag.t);
        angle += dx / R; tilt = Math.max(-0.2, Math.min(0.9, tilt + dy / R));
        spin = Math.max(-6, Math.min(6, ((dx / R) * 1000) / dtm));
        drag = { ...drag, x: p.x, y: p.y, t: e.timeStamp };
        if (drag.touch) { px = p.x; py = p.y; tapFade = 1; }
      }
      start();
    };
    const move = (e: PointerEvent) => {
      const p = local(e);
      if (e.pointerType === "mouse") { px = p.x; py = p.y; hovTarget = onTheGlobe(p.x, p.y) ? 1 : 0; host.classList.toggle("globe-hot", hovTarget === 1); }
      start();
    };
    const leave = () => { px = py = -9999; hovTarget = 0; host.classList.remove("globe-hot"); start(); };
    const down = (e: PointerEvent) => {
      const p = local(e);
      if (drag || !e.isPrimary || e.button !== 0 || blocked(e) || !onTheGlobe(p.x, p.y)) return;
      const isTouch = e.pointerType !== "mouse";
      drag = { x: p.x, y: p.y, t: e.timeStamp, pointerId: e.pointerId, touch: isTouch }; spin = 0;
      if (isTouch) { px = p.x; py = p.y; tapFade = 1; hovTarget = 0.3; }
      host.setPointerCapture(e.pointerId);
      host.classList.add("globe-drag");
      document.body.classList.add("globe-dragging"); // no text gets selected while spinning
      window.getSelection()?.removeAllRanges();
      if (!isTouch) e.preventDefault();
      start();
    };
    const up = (e: PointerEvent) => {
      if (!drag || drag.pointerId !== e.pointerId) return;
      const ended = drag; drag = null;
      if (host.hasPointerCapture(ended.pointerId)) host.releasePointerCapture(ended.pointerId);
      if (ended.touch) { px = py = -9999; hovTarget = 0; }
      if (e.type === "pointercancel" || e.type === "lostpointercapture") spin = 0;
      host.classList.remove("globe-drag"); document.body.classList.remove("globe-dragging"); start();
    };
    const noSelect = (e: Event) => { if (drag) e.preventDefault(); };

    readTheme(); resize(); draw(0);
    const ro = new ResizeObserver(() => { resize(); draw(0); });
    ro.observe(canvas);
    const mo = new MutationObserver(() => { readTheme(); draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    host.addEventListener("lostpointercapture", up);
    window.addEventListener("pointermove", dragMove);
    document.addEventListener("selectstart", noSelect);
    document.fonts?.ready.then(() => { sprites.clear(); draw(0); });
    start();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); host.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up); window.removeEventListener("pointermove", dragMove);
      window.removeEventListener("pointercancel", up); host.removeEventListener("lostpointercapture", up);
      document.removeEventListener("selectstart", noSelect); document.body.classList.remove("globe-dragging");
    };
  }, [calm]);
  return <canvas ref={ref} className="globe" aria-hidden="true" data-testid="globe" />;
}
