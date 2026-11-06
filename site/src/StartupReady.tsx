import {createContext,useContext,useLayoutEffect} from "react";
export const StartupContext = createContext(false);

/** The longest the page waits for its loading cover to paint before showing the app anyway. */
export const COVER_PAINT_CAP_MS = 1500;

/** Tell the first-paint script (index.html) that the app is ready, once the loading cover has painted.
 *  When the app was ready before the browser's first frame (a fast connection or cached code), the app's own paint
 *  became the page's first and largest paint, so lab tests timed the main paint after every script and data file
 *  (Lighthouse mobile LCP 3 to 7 s on item pages, against about 2 s for the cover). Waiting for the cover's first
 *  contentful paint, and for its heading font where the cover has one, costs at most a frame on a normal load. */
export function announceReady() {
  const go = () => document.dispatchEvent(new Event("abb:ready"));
  const cover = document.getElementById("app-loader");
  if (!cover || typeof PerformanceObserver === "undefined" || typeof performance?.getEntriesByName !== "function") return go();
  const painted = performance.getEntriesByName("first-contentful-paint").length > 0 ? Promise.resolve() : new Promise<void>(resolve => {
    try {
      const observer = new PerformanceObserver(list => { if (list.getEntriesByName("first-contentful-paint").length) { observer.disconnect(); resolve(); } });
      observer.observe({ type: "paint", buffered: true });
    } catch { resolve(); }
  });
  // Covers with a page picture draw their heading in "AI Blocks Shell" (index.html), a blocking face of the preloaded
  // Space Grotesk, so the app's later paint of the same words is never larger than the cover's.
  const font = cover.querySelector(".page-shell") && document.fonts?.load
    ? document.fonts.load('600 34px "AI Blocks Shell"').then(() => undefined, () => undefined) : Promise.resolve();
  let sent = false;
  const once = () => { if (!sent) { sent = true; go(); } };
  void Promise.all([painted, font]).then(once);
  setTimeout(once, COVER_PAINT_CAP_MS);
}

/** Runs only when the home screen or a resolved route has actually committed. */
export function StartupReady() {
  const ready = useContext(StartupContext);
  useLayoutEffect(() => {
    if (ready) announceReady();
  }, [ready]);
  return null;
}
