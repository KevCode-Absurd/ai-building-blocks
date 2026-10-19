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

// Preact runs the same React code at a fraction of the size: react and react-dom are aliased to preact/compat.
export default defineConfig({
  plugins: [preact(), devComments()],
  server: { port: 5180, fs: { allow: [".."] } }, // the mini tools' formula files live in ../mini-tools
  build: { target: "es2020", modulePreload: { polyfill: false }, cssCodeSplit: true },
});
