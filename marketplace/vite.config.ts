import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// The browser app. The Worker (src/worker.ts) is bundled separately by wrangler and serves dist/ as static assets.
export default defineConfig({
  plugins: [preact()],
  build: { outDir: "dist", emptyOutDir: true, sourcemap: false, target: "es2022" },
  server: {
    port: 5291,
    // `npm run worker:dev` serves the API on 5290; the Vite dev server forwards API calls there.
    proxy: { "/api": "http://localhost:5290", "/mcp": "http://localhost:5290", "/oauth": "http://localhost:5290" },
  },
});
