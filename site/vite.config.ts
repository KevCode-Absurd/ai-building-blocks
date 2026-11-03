import { handleLibrary, memoryLibrary } from "./src/server/account-library";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import preact from "@preact/preset-vite";
import { handleComments, memoryStore } from "./src/server/comments";
import { handleSpaces, memorySpaces } from "./src/server/spaces";
import { decodeCatalogue, handleComposer, memoryComposer } from "./src/server/composer";
import { loadWorkflowEnv } from "../tools/lib/workflow-env.mjs";
import { authenticateUser, authConfigured, handleAccount, verifiedEmails } from "./src/server/auth";
import { handleTranscription, MAX_VOICE_BYTES } from "./src/server/transcription";
import { handleAccountMinds, memoryMinds } from "./src/server/account-minds";
import { devPublicApi } from "./scripts/vite-public-api";
import { handleCommunity } from "./src/server/community";
import { memoryCommunity } from "./src/server/community-store";
import { catalogueAsset, toolNextSteps } from "./scripts/vite-site-data.mjs";

function devSecurity(): Plugin {
  return { name: "dev-security", configureServer(server) {
    server.middlewares.use("/api/security", (_req, res) => {
      res.setHeader("content-type", "application/json"); res.setHeader("cache-control", "no-store");
      res.end('{"required":false}');
    });
  } };
}

function devComposer(): Plugin {
  const store = memoryComposer();
  const minds = memoryMinds();
  const library = memoryLibrary();
  const community = memoryCommunity();
  const communityEnv = loadEnv("development", process.cwd(), "COMMUNITY_");
  const keys = loadWorkflowEnv(path.resolve(".."));
  const auth = loadEnv("development", process.cwd(), "CLERK_");
  const publicAuth = loadEnv("development", process.cwd(), "VITE_CLERK_");
  const env = { ...keys, ...auth, CLERK_PUBLISHABLE_KEY: auth.CLERK_PUBLISHABLE_KEY || publicAuth.VITE_CLERK_PUBLISHABLE_KEY || keys.CLERK_PUBLISHABLE_KEY, WORKFLOW_COMPOSER_ENABLED: keys.WORKFLOW_COMPOSER_ENABLED ?? "true", WORKFLOW_DAILY_CAP_USD: keys.WORKFLOW_DAILY_CAP_USD ?? "10", WORKFLOW_DAILY_ATTEMPT_LIMIT: keys.WORKFLOW_DAILY_ATTEMPT_LIMIT ?? "5" };
  return { name: "dev-composer", configureServer(server) {
    server.middlewares.use("/api/community", async (req, res) => {
      try {
        const chunks: Buffer[] = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 605000) { res.statusCode = 413; res.end('{"error":"Keep the submission under 600 KB."}'); return; } chunks.push(chunk as Buffer); }
        const request = new Request(`http://${req.headers.host}/api/community${req.url === "/" ? "" : req.url}`, { method: req.method, headers: req.headers as Record<string, string>, body: !["GET", "HEAD"].includes(req.method ?? "GET") ? Buffer.concat(chunks) : undefined });
        const out = await handleCommunity(request, { ...env, ...communityEnv }, community, async () => JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8")));
        res.statusCode = out.status; out.headers.forEach((v, k) => res.setHeader(k, v)); res.end(Buffer.from(await out.arrayBuffer()));
      } catch { res.statusCode = 503; res.end('{"error":"Community publishing is temporarily unavailable."}'); }
    });
    server.middlewares.use("/api/library", async (req, res) => {
      try {
        const chunks: Buffer[] = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 4000000) { res.statusCode = 413; res.end('{"error":"Account library is too large."}'); return; } chunks.push(chunk as Buffer); }
        const request = new Request(`http://${req.headers.host}/api/library`, { method: req.method, headers: req.headers as Record<string, string>, body: !["GET", "HEAD"].includes(req.method ?? "GET") ? Buffer.concat(chunks) : undefined });
        const out = await handleLibrary(request, env, library);
        res.statusCode = out.status; out.headers.forEach((v, k) => res.setHeader(k, v)); res.end(await out.text());
      } catch { res.statusCode = 503; res.end('{"error":"Your account library is temporarily unavailable."}'); }
    });
    server.middlewares.use("/api/minds", async (req, res) => {
      try {
        const chunks: Buffer[] = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 900000) { res.statusCode = 413; res.end('{"error":"Mind library is too large."}'); return; } chunks.push(chunk as Buffer); }
        const request = new Request(`http://${req.headers.host}/api/minds`, { method: req.method, headers: req.headers as Record<string, string>, body: !["GET", "HEAD"].includes(req.method ?? "GET") ? Buffer.concat(chunks) : undefined });
        const out = await handleAccountMinds(request, env, minds);
        res.statusCode = out.status; out.headers.forEach((v, k) => res.setHeader(k, v)); res.end(await out.text());
      } catch { res.statusCode = 503; res.end('{"error":"Your account minds are temporarily unavailable."}'); }
    });
    server.middlewares.use("/api/transcribe", async (req, res) => {
      try {
        const chunks: Buffer[] = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > MAX_VOICE_BYTES) { res.statusCode = 413; res.end('{"error":"Recording too large"}'); return; } chunks.push(chunk as Buffer); }
        const request = new Request(`http://${req.headers.host}/api/transcribe`, { method: req.method, headers: req.headers as Record<string, string>, body: req.method === "POST" ? Buffer.concat(chunks) : undefined });
        const out = await handleTranscription(request, { ...env, WORKFLOW_SALT: env.WORKFLOW_SALT || "local-development" }, store, req.socket.remoteAddress ?? "");
        res.statusCode = out.status; out.headers.forEach((v, k) => res.setHeader(k, v)); res.end(await out.text());
      } catch { res.statusCode = 503; res.end('{"error":"Voice input is temporarily unavailable."}'); }
    });
    server.middlewares.use("/api/auth", async (req, res) => {
      try {
        const request = new Request(`http://${req.headers.host}/api/auth${req.url === "/" ? "" : req.url}`, { method: req.method, headers: req.headers as Record<string, string> });
        const out = await handleAccount(request, env, store);
        res.statusCode = out.status; out.headers.forEach((v, k) => res.setHeader(k, v)); res.end(await out.text());
      } catch { res.statusCode = 503; res.end('{"error":"Sign-in is temporarily unavailable."}'); }
    });
    server.middlewares.use("/api/compose", async (req, res) => {
      try {
        const chunks: Buffer[] = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 64000) { res.statusCode = 413; res.end('{"error":"Request too large"}'); return; } chunks.push(chunk as Buffer); }
        const request = new Request(`http://${req.headers.host}/api/compose`, { method: req.method, headers: req.headers as Record<string, string>, body: req.method === "POST" ? Buffer.concat(chunks) : undefined });
        const userId = req.method === "POST" ? await authenticateUser(request, env) : null;
        const out = userId instanceof Response ? userId : await handleComposer(request, async () => decodeCatalogue(JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8"))), { ...env, WORKFLOW_COMPOSER_ENABLED: authConfigured(env) ? env.WORKFLOW_COMPOSER_ENABLED : "false" }, store, req.socket.remoteAddress ?? "", undefined, userId);
        res.statusCode = out.status; out.headers.forEach((v, k) => res.setHeader(k, v)); res.end(await out.text());
      } catch { res.statusCode = 503; res.end('{"error":"The composer is temporarily unavailable. Free assembly still works."}'); }
    });
  } };
}

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

/** /api/spaces on the dev server: the live site's handler with an in-memory store (the live site uses D1). */
function devSpaces(): Plugin {
  const store = memorySpaces();
  const env = { ...loadWorkflowEnv(path.resolve("..")), ...loadEnv("development", process.cwd(), "CLERK_") };
  return {
    name: "dev-spaces",
    configureServer(server) {
      server.middlewares.use("/api/spaces", async (req, res) => {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const body = ["GET", "HEAD"].includes(req.method ?? "GET") ? undefined : Buffer.concat(chunks);
        const request = new Request(`http://${req.headers.host}/api/spaces${req.url === "/" ? "" : req.url}`, { method: req.method, headers: req.headers as Record<string, string>, body });
        const out = await handleSpaces(request, store, { ip: req.socket.remoteAddress ?? "", teamToken: process.env.SPACES_TEAM_TOKEN || "dev-team-token", limit: false, authenticate: () => authenticateUser(request, env), verifiedEmails: user => verifiedEmails(user, env) });
        res.statusCode = out.status;
        out.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(await out.text());
      });
    },
  };
}

/**
 * The saved example app (../example-app-site, made by tools/example-app, deployed as its own Pages project) served the way
 * Cloudflare Pages serves it:
 * /example-app/scripts is scripts.html, a folder is its index.html, and anything missing gets the tour's 404 page.
 */
function exampleApp(): Plugin {
  const root = path.resolve("../example-app-site");
  const TYPES: Record<string, string> = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain; charset=utf-8", ".mp4": "video/mp4", ".webm": "video/webm" };
  const serve = (req: { url?: string }, res: import("node:http").ServerResponse, next: () => void) => {
    const url = new URL(req.url ?? "/", "http://x");
    const p = decodeURIComponent(url.pathname);
    if (!/^\/example-app(\/|$)/.test(p) ||!fs.existsSync(path.join(root, "example-app"))) return next();
    const file = [p, `${p.replace(/\/$/, "")}.html`, path.posix.join(p, "index.html")].map((f) => path.join(root, f)).find((f) => f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile());
    if (file && !file.endsWith(".html")) { res.setHeader("content-type", TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream"); return res.end(fs.readFileSync(file)); }
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
export default defineConfig(({ mode }) => ({
  plugins: [preact(), devPublicApi(), devSecurity(), devComments(), devSpaces(), devComposer(), exampleApp(), catalogueAsset({ root: process.cwd() }), toolNextSteps({ root: process.cwd() })],
  // Only the app entry is source; immutable release snapshots must not be scanned.
  optimizeDeps: { entries: ["index.html"] },
  server: { port: 5180, fs: { allow: [".."] }, ...(mode === "test" ? { hmr: false, watch: null } : {}) }, // tests use a stable snapshot while other tasks edit files
  // Card patterns (src/patterns, scripts/build-dither-css.mjs) stay files so the main stylesheet stays small.
  build: { target: "es2020", modulePreload: { polyfill: false }, cssCodeSplit: true, assetsInlineLimit: (file: string) => /[\\/]src[\\/]patterns[\\/]/.test(file) ? false : undefined, rollupOptions: { input: { main: path.resolve('index.html'), mcpConnect: path.resolve('connect-mcp.html') } } },
}));
