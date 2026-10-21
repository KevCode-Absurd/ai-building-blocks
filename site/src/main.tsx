import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { installDither } from "./lib/pixel";

installDither();

// Built pages arrive with a plain first screen for search engines (scripts/prerender.mjs); the app replaces it.
const root = document.getElementById("root")!;
root.replaceChildren();
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
