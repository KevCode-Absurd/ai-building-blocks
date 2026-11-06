// API routes for the mcp module. Paths and owners are listed in ARCHITECTURE.md.
// Importing oauth.ts registers the bearer-token verifier for MCP access tokens.
import type { Ctx, Method, Route } from "../../core/http.ts";
import { errorResponse } from "../../core/http.ts";
import type { Env } from "../../env.ts";
import {
  approve, authorize, authorizationServerMetadata, cleanupExpired, getAuthRequest, listConnections, machineJson,
  preflight, protectedResourceMetadata, register, revoke, revokeConnection, token,
} from "./oauth.ts";
import { handleMcp } from "./server.ts";
import { cleanupRateCounts } from "./limits.ts";

const OPTIONS: Method = "OPTIONS";
const PUBLIC_CACHE = { "cache-control": "public, max-age=300" };

/** The consent page is part of the browser app, but /oauth/* reaches the Worker first, so serve the app shell here. */
async function consentShell(ctx: Ctx): Promise<Response> {
  if (!ctx.env.ASSETS) return errorResponse(503, "app_not_built", "The website is not built here. Run vite build first.");
  const shell = await ctx.env.ASSETS.fetch(new Request(new URL("/", ctx.url)));
  if (!shell.ok) return errorResponse(503, "app_not_built", "The website is not available right now. Try again in a minute.");
  const headers = new Headers(shell.headers);
  // The consent page must never be framed (clickjacking), cached, or leak its link to other sites.
  headers.set("x-frame-options", "DENY");
  headers.set("content-security-policy", "frame-ancestors 'none'");
  headers.set("cache-control", "no-store");
  headers.set("referrer-policy", "no-referrer");
  headers.set("x-robots-tag", "noindex");
  return new Response(shell.body, { status: 200, headers });
}

const machinePaths = ["/.well-known/oauth-authorization-server", "/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp", "/oauth/register", "/oauth/token", "/oauth/revoke", "/mcp"];

export const routes: Route[] = [
  { method: "GET", path: "/.well-known/oauth-authorization-server", handler: ctx => machineJson(200, authorizationServerMetadata(ctx.env), PUBLIC_CACHE) },
  { method: "GET", path: "/.well-known/oauth-protected-resource", handler: ctx => machineJson(200, protectedResourceMetadata(ctx.env), PUBLIC_CACHE) },
  // RFC 9728 path form for the resource https://<origin>/mcp.
  { method: "GET", path: "/.well-known/oauth-protected-resource/mcp", handler: ctx => machineJson(200, protectedResourceMetadata(ctx.env), PUBLIC_CACHE) },
  { method: "POST", path: "/oauth/register", handler: register },
  { method: "GET", path: "/oauth/authorize", handler: authorize },
  { method: "GET", path: "/oauth/consent", handler: consentShell },
  { method: "POST", path: "/oauth/token", handler: token },
  { method: "POST", path: "/oauth/revoke", handler: revoke },
  { method: "GET", path: "/api/oauth/requests/:id", handler: getAuthRequest },
  { method: "POST", path: "/api/oauth/approve", handler: approve },
  { method: "GET", path: "/api/oauth/connections", handler: listConnections },
  { method: "POST", path: "/api/oauth/connections/:id/revoke", handler: revokeConnection },
  { method: "POST", path: "/mcp", handler: handleMcp },
  ...machinePaths.map(path => ({ method: OPTIONS, path, handler: () => preflight() })),
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [cleanupExpired, cleanupRateCounts];
