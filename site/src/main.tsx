import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./hub.css";
import App from "./App";
import { Persistence } from "./AccountPersistence";
import PublicOpening from "./PublicOpening";
import { CommunityStars } from "./CommunityStars";
import "./dither-masks.css";
import { keepInitialHtml } from "./lib/public-opening";
import { installChunkRecovery } from "./lib/chunk-recovery";

// After a deploy, a page opened earlier may ask for code files that were replaced: reload once to get the new ones.
installChunkRecovery();


// Built pages arrive with a plain first screen for search engines (scripts/prerender.mjs); the app replaces it.
let root = document.getElementById("root")!;
const publicOpeningHtml = root.innerHTML;
keepInitialHtml(publicOpeningHtml);
// Item pages keep that screen on view (renamed in place, so nothing repaints) while the app opens in a fresh,
// hidden #root behind it; index.html removes it when the app is ready.
if (document.documentElement.dataset.boot === "loading" && root.querySelector(":scope > [data-static-first]")) {
  const app = document.createElement("div");
  document.documentElement.dataset.boot = "static";
  root.id = "static-view";
  root.after(app);
  app.id = "root";
  root = app;
}
root.replaceChildren();
createRoot(root).render(
  <StrictMode>
    <Persistence publicFallback={<PublicOpening html={publicOpeningHtml} />}><CommunityStars><App /></CommunityStars></Persistence>
  </StrictMode>,
);
