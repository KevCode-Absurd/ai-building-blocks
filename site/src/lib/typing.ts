import { useCallback, useEffect, useRef, useState } from "react";

const still = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Types `text` out over about `ms` milliseconds once `run` is true, the way an AI streams an answer.
 *  Changing `restart` types it again from the start. Returns how many characters are showing. People who ask for reduced motion get the whole text at once. */
export function useTyped(text: string, run: boolean, ms: number, restart = 0) {
  const [n, setN] = useState(() => (still() ? text.length : 0));
  const [round, setRound] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!run || still()) { if (still()) setN(text.length); return; }
    setN(0);
    const t0 = performance.now();
    const step = (now: number) => {
      // Ease out a little, so it starts quick and settles at the end.
      const p = Math.min(1, (now - t0) / ms);
      const next = Math.round(text.length * (1 - (1 - p) ** 1.6));
      setN(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [text, run, ms, round, restart]);
  const replay = useCallback(() => setRound((r) => r + 1), []);
  const skip = useCallback(() => { cancelAnimationFrame(raf.current); setN(text.length); }, [text]);
  return { n, done: n >= text.length, replay, skip };
}

/** True once the element has scrolled into view. */
export function useSeen<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}
