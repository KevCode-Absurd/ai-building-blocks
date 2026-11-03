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
// While it opens, the loading cover shows a styled picture of the page's header and heading (scripts/lib/page-shell.mjs).
const root = document.getElementById("root")!;
const publicOpeningHtml = root.innerHTML;
keepInitialHtml(publicOpeningHtml);
root.replaceChildren();
createRoot(root).render(
  <StrictMode>
    <Persistence publicFallback={<PublicOpening html={publicOpeningHtml} />}><CommunityStars><App /></CommunityStars></Persistence>
  </StrictMode>,
);
