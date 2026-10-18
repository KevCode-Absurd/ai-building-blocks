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

/** On touch screens there's no hover, so text writes itself as you scroll: none showing as the element
 *  comes up from the bottom of the screen, all of it by the time it's a third of the way up. Returns null on other screens. */
export function useScrollTyped<T extends Element>(len: number) {
  const ref = useRef<T>(null);
  const [touch] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(hover: none)").matches && !still());
  const [n, setN] = useState(len);
  useEffect(() => {
    const el = ref.current;
    if (!touch || !el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const top = el.getBoundingClientRect().top, vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.3)));
      setN(Math.round(len * p));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    // Only listen while the element is near the screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { addEventListener("scroll", onScroll, { passive: true }); onScroll(); }
      else removeEventListener("scroll", onScroll);
    }, { rootMargin: "20% 0px" });
    io.observe(el);
    measure();
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [touch, len]);
  return [ref, touch ? n : null] as const;
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
