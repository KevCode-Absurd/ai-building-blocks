// The owner pages for the outcome orchestrator (/get-it-done and its two sub-pages). App.tsx mounts this one lazy route;
// the pages' code loads only when someone opens them, and they need no library data.
import { lazy } from "react";
import { StartupReady } from "../StartupReady";

export const OUTCOME_ROOT = "/get-it-done";
export const isOutcomePath = (path: string) => path === OUTCOME_ROOT || path.startsWith(`${OUTCOME_ROOT}/`);
export const OutcomesRoute = lazy(async () => {
  const { default: Page } = await import("./OutcomesPage");
  return { default: (props: { path: string; toast: (message: string) => void }) => <><Page {...props} /><StartupReady /></> };
});
