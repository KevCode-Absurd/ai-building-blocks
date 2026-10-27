import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./hub.css";
import App from "./App";
import { Persistence } from "./AccountPersistence";
import PublicOpening from "./PublicOpening";
import { CommunityStars } from "./CommunityStars";
import { installDither } from "./lib/pixel";
import { keepInitialHtml } from "./lib/public-opening";

installDither();

// Built pages arrive with a plain first screen for search engines (scripts/prerender.mjs); the app replaces it.
const root = document.getElementById("root")!;
const publicOpeningHtml = root.innerHTML;
keepInitialHtml(publicOpeningHtml);
root.replaceChildren();
createRoot(root).render(
  <StrictMode>
    <Persistence publicFallback={<PublicOpening html={publicOpeningHtml} />}><CommunityStars><App /></CommunityStars></Persistence>
  </StrictMode>,
);
