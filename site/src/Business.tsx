import { Suspense, lazy, useEffect } from "react";
import { hasBusiness, useBusiness } from "./lib/business";

const OPEN = "abb:business-open";
/** Opens the me.md drawer from anywhere on the site. */
export const openBusiness = () => window.dispatchEvent(new Event(OPEN));
export function useBusinessOpener(open: () => void) {
  useEffect(() => { window.addEventListener(OPEN, open); return () => window.removeEventListener(OPEN, open); }, [open]);
}

// The drawer's code (and its copyable prompt) loads only when someone opens it, so the first page stays light.
const Drawer = lazy(() => import("./BusinessDrawer"));
/** Your me.md, saved once. Every skill you copy and every workflow you download carries the parts it needs. */
export function BusinessDrawer(props: { onClose: () => void; toast: (m: string) => void }) {
  return <Suspense fallback={null}><Drawer {...props} /></Suspense>;
}

/** One line near the copy buttons: whether your me.md is added, and a way to change it. */
export function BusinessNote() {
  const b = useBusiness();
  return (
    <p className="biz-note" data-testid="business-note">
      {hasBusiness(b)
        ? <>Your brand file is included · <button className="link-btn" onClick={openBusiness}>Edit</button></>
        : <><button className="link-btn" onClick={openBusiness} data-testid="business-add">Add your brand file</button> so this fits you</>}
    </p>
  );
}
