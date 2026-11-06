// A small router and JSON helpers. Every API route is { method, path, handler } and lives in its module's routes.ts.
import type { Env } from "../env.ts";
import { authenticate, type AuthUser } from "./auth.ts";

export class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const fail = (status: number, code: string, message: string): never => {
  throw new HttpError(status, code, message);
};

const SECURITY_HEADERS: Record<string, string> = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...SECURITY_HEADERS, ...headers } });
}

export function errorResponse(status: number, code: string, message: string): Response {
  return json({ error: { code, message } }, status);
}

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Ctx {
  req: Request;
  env: Env;
  url: URL;
  params: Record<string, string>;
  exec: ExecutionContext;
  /** The signed-in user, or a 401 error. Cached per request. */
  user(): Promise<AuthUser>;
  /** The signed-in user, or null when nobody is signed in. */
  maybeUser(): Promise<AuthUser | null>;
  /** The parsed JSON body (max 256 KB), or a 400 error. */
  body<T = Record<string, unknown>>(): Promise<T>;
}

export interface Route {
  method: Method;
  /** Path pattern such as "/api/jobs/:id". Parameters match one path segment. */
  path: string;
  handler: (ctx: Ctx) => Promise<Response> | Response;
}

interface Compiled { route: Route; regex: RegExp; keys: string[] }

export function compile(routes: Route[]): Compiled[] {
  return routes.map(route => {
    const keys: string[] = [];
    const pattern = route.path.replace(/\/+$/, "").replace(/:([a-zA-Z_]+)/g, (_m, key) => { keys.push(key); return "([^/]+)"; });
    return { route, keys, regex: new RegExp(`^${pattern}/?$`) };
  });
}

const MAX_BODY = 256 * 1024;

export async function dispatch(compiled: Compiled[], req: Request, env: Env, exec: ExecutionContext): Promise<Response | null> {
  const url = new URL(req.url);
  let pathMatched = false;
  for (const { route, regex, keys } of compiled) {
    const m = regex.exec(url.pathname);
    if (!m) continue;
    pathMatched = true;
    if (route.method !== req.method) continue;
    const params: Record<string, string> = {};
    keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
    let cachedUser: Promise<AuthUser | null> | null = null;
    let cachedBody: Promise<unknown> | null = null;
    const maybeUser = () => (cachedUser ??= authenticate(req, env));
    const ctx: Ctx = {
      req, env, url, params, exec,
      maybeUser,
      async user() {
        const u = await maybeUser();
        if (!u) fail(401, "sign_in_required", "Sign in to continue.");
        return u!;
      },
      body<T>() {
        cachedBody ??= (async () => {
          const text = await req.text();
          if (text.length > MAX_BODY) fail(413, "body_too_large", "That request is too large.");
          if (!text) return {};
          try { return JSON.parse(text); } catch { return fail(400, "invalid_json", "Send a JSON body."); }
        })();
        return cachedBody as Promise<T>;
      },
    };
    try {
      return await route.handler(ctx);
    } catch (err) {
      if (err instanceof HttpError) return errorResponse(err.status, err.code, err.message);
      const message = err instanceof Error ? err.message : String(err);
      if (/rubric_frozen|agent_version_immutable|events_append_only/.test(message)) return errorResponse(409, "record_locked", "That record can no longer be changed.");
      console.error("route_error", route.method, route.path, message);
      return errorResponse(500, "server_error", "Something went wrong on our side. Try again in a minute.");
    }
  }
  if (pathMatched) return errorResponse(405, "method_not_allowed", "That method is not allowed here.");
  return null;
}

// ---------- Small input helpers ----------

export function str(value: unknown, field: string, { min = 1, max = 5000, optional = false } = {}): string {
  if (value === undefined || value === null || value === "") {
    if (optional) return "";
    return fail(400, "invalid_input", `Fill in ${field}.`);
  }
  if (typeof value !== "string") return fail(400, "invalid_input", `${field} must be text.`);
  const v = value.trim();
  if (v.length < min) return fail(400, "invalid_input", `${field} is too short.`);
  if (v.length > max) return fail(400, "invalid_input", `${field} is too long (max ${max} characters).`);
  return v;
}

export function int(value: unknown, field: string, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}): number {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isInteger(n) || n < min || n > max) return fail(400, "invalid_input", `${field} must be a whole number from ${min} to ${max}.`);
  return n;
}

export function oneOf<T extends string>(value: unknown, field: string, options: readonly T[]): T {
  if (typeof value !== "string" || !options.includes(value as T)) return fail(400, "invalid_input", `${field} must be one of: ${options.join(", ")}.`);
  return value as T;
}
