import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import preact from "@preact/preset-vite";
import { handleComments, memoryStore } from "./src/server/comments";

/** /api/comments on the dev server: the live site's handler with an in-memory store (the live site uses D1). */
function devComments(): Plugin {
  const store = memoryStore();
  return {
    name: "dev-comments",
    configureServer(server) {
      server.middlewares.use("/api/comments", async (req, res) => {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const body = ["GET", "HEAD"].includes(req.method ?? "GET") ? undefined : Buffer.concat(chunks);
        const request = new Request(`http://localhost/api/comments${req.url === "/" ? "" : req.url}`, { method: req.method, headers: req.headers as Record<string, string>, body });
        const out = await handleComments(request, store, { ip: req.socket.remoteAddress ?? "", teamToken: process.env.COMMENTS_TEAM_TOKEN || "dev-team-token", limit: false });
        res.statusCode = out.status;
        out.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(await out.text());
      });
    },
  };
}

/**
 * The saved example app (public/example-app, made by tools/example-app) served the way Cloudflare Pages serves it:
 * /example-app/scripts is scripts.html, a folder is its index.html, and anything missing gets the tour's 404 page.
 */
function exampleApp(): Plugin {
  const root = path.resolve("public");
  const serve = (req: { url?: string }, res: import("node:http").ServerResponse, next: () => void) => {
    const url = new URL(req.url ?? "/", "http://x");
    const p = decodeURIComponent(url.pathname);
    if (!p.startsWith("/example-app") || !fs.existsSync(path.join(root, "example-app"))) return next();
    const file = [p, `${p.replace(/\/$/, "")}.html`, path.posix.join(p, "index.html")].map((f) => path.join(root, f)).find((f) => f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile());
    if (file && !file.endsWith(".html")) return next(); // pictures, scripts and styles: Vite serves public files itself
    res.setHeader("content-type", "text/html; charset=utf-8");
    if (!file) res.statusCode = 404;
    res.end(fs.readFileSync(file ?? path.join(root, "example-app", "404.html")));
  };
  return {
    name: "example-app",
    configureServer(server) { server.middlewares.use(serve); },
    configurePreviewServer(server) { server.middlewares.use(serve); },
  };
}

// Preact runs the same React code at a fraction of the size: react and react-dom are aliased to preact/compat.
export default defineConfig({
  plugins: [preact(), devComments(), exampleApp()],
  server: { port: 5180, fs: { allow: [".."] } }, // the mini tools' formula files live in ../mini-tools
  build: { target: "es2020", modulePreload: { polyfill: false }, cssCodeSplit: true },
});
