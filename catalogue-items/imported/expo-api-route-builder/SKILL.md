---
name: expo-api-routes
description: Guidelines for creating API routes in Expo Router with EAS Hosting
risk: critical
source: https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-api-routes
source_repo: expo/skills
source_type: official
date_added: 2026-07-01
license: MIT
license_source: https://github.com/expo/skills/blob/main/LICENSE
---

> Licence note (AI Blocks): this copy of the skill text is covered by CC BY 4.0, as the LICENSE-CONTENT file says. The "MIT" in the header above is the original author's claim. Keep the credit to Expo and sickn33.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use API Routes

Use API routes when you need:

- **Server-side secrets** — API keys, database credentials, or tokens that must never reach the client
- **Database operations** — Direct database queries that shouldn't be exposed
- **Third-party API proxies** — Hide API keys when calling external services (OpenAI, Stripe, etc.)
- **Server-side validation** — Validate data before database writes
- **Webhook endpoints** — Receive callbacks from services like Stripe or GitHub
- **Rate limiting** — Control access at the server level
- **Heavy computation** — Offload processing that would be slow on mobile

## When NOT to Use API Routes

Avoid API routes when:

- **Data is already public** — Use direct fetch to public APIs instead
- **No secrets required** — Static data or client-safe operations
- **Real-time updates needed** — Use WebSockets or services like Supabase Realtime
- **Simple CRUD** — Consider Firebase, Supabase, or Convex for managed backends
- **File uploads** — Use direct-to-storage uploads (S3 presigned URLs, Cloudflare R2)
- **Authentication only** — Use Clerk, Auth0, or Firebase Auth instead

## File Structure

API routes live in the `app` directory with `+api.ts` suffix:

```
app/
  api/
    hello+api.ts          → GET /api/hello
    users+api.ts          → /api/users
    users/[id]+api.ts     → /api/users/:id
  (tabs)/
    index.tsx
```

## Basic API Route

```ts
// app/api/hello+api.ts
export function GET(request: Request) {
  return Response.json({ message: "Hello from Expo!" });
}
```

## HTTP Methods

Export named functions for each HTTP method:

```ts
// app/api/items+api.ts
export function GET(request: Request) {
  return Response.json({ items: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ created: body }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return Response.json({ updated: body });
}

export async function DELETE(request: Request) {
  return new Response(null, { status: 204 });
}
```

## Dynamic Routes

```ts
// app/api/users/[id]+api.ts
export function GET(request: Request, { id }: { id: string }) {
  return Response.json({ userId: id });
}
```

## Request Handling

### Query Parameters

```ts
export function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "10";

  return Response.json({ page, limit });
}
```

### Headers

```ts
// This only shows how to read a header. It is NOT real authentication: any text passes.
// Verify the token before you trust it (see the auth middleware below).
export function GET(request: Request) {
  const auth = request.headers.get("Authorization");

  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ authenticated: true });
}
```

### JSON Body

```ts
export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  return Response.json({ success: true });
}
```

## Environment Variables

Use `process.env` for server-side secrets:

```ts
// app/api/ai+api.ts
import { requireAuth } from "../../utils/auth"; // see Authentication Middleware below

export async function POST(request: Request) {
  // A paid API call must never be open to anyone: check the caller first.
  const { userId } = await requireAuth(request);
  // Then apply a per-user limit before spending money, for example with your
  // database or your host's rate-limit feature (limitPerUser is yours to write):
  // await limitPerUser(userId);
  const { prompt } = await request.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "<MODEL NAME>", // replace with a current model name from OpenAI's docs
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return Response.json(data);
}
```

Set environment variables:

- **Local**: Create `.env` file (never commit)
- **EAS Hosting**: Use `eas env:create` or Expo dashboard

## CORS Headers

Add CORS for web clients:

```ts
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export function GET() {
  return Response.json({ data: "value" }, { headers: corsHeaders });
}
```

## Error Handling

```ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Process...
    return Response.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## Testing Locally

Start the development server with API routes:

```bash
npx expo serve
```

This starts a local server at `http://localhost:8081` with full API route support.

Test with curl:

```bash
curl http://localhost:8081/api/hello
curl -X POST http://localhost:8081/api/users -H "Content-Type: application/json" -d '{"name":"Test"}'
```

## Deployment to EAS Hosting

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### Deploy

```bash
eas deploy
```

This builds and deploys your API routes to EAS Hosting (Cloudflare Workers).

### Environment Variables for Production

```bash
# Create a secret. Leave out --value so EAS asks for it, which keeps the key out of your shell history.
eas env:create --name OPENAI_API_KEY --environment production

# Or use the Expo dashboard
```

### Custom Domain

Configure in `eas.json` or Expo dashboard.

### After you deploy

- Test each route with `curl` against the live URL, including a request with no token and a request with bad input.
- Rotate any key that was pasted into a chat, a file in your repo or a shell command.
- Check your EAS usage and set billing alerts, and do the same for the paid services your routes call (OpenAI, Stripe and others).

## EAS Hosting Runtime (Cloudflare Workers)

API routes run on Cloudflare Workers. Key limitations:

### Missing/Limited APIs

- **No Node.js filesystem** — `fs` module unavailable
- **No native Node modules** — Use Web APIs or polyfills
- **Limited execution time** — 30 second timeout for CPU-intensive tasks
- **No persistent connections** — WebSockets require Durable Objects
- **fetch is available** — Use standard fetch for HTTP requests

### Use Web APIs Instead

```ts
// Use Web Crypto instead of Node crypto
const hash = await crypto.subtle.digest(
  "SHA-256",
  new TextEncoder().encode("data")
);

// Use fetch instead of node-fetch
const response = await fetch("https://api.example.com");

// Use Response/Request (already available)
return new Response(JSON.stringify(data), {
  headers: { "Content-Type": "application/json" },
});
```

### Database Options

Since filesystem is unavailable, use cloud databases:

- **Cloudflare D1** — SQLite at the edge
- **Turso** — Distributed SQLite
- **PlanetScale** — Serverless MySQL
- **Supabase** — Postgres with REST API
- **Neon** — Serverless Postgres

Example with Turso:

```ts
// app/api/users+api.ts
import { createClient } from "@libsql/client/web";

const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  const result = await db.execute("SELECT * FROM users");
  return Response.json(result.rows);
}
```

## Calling API Routes from Client

```ts
// From React Native components
const response = await fetch("/api/hello");
const data = await response.json();

// With body
const response = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John" }),
});
```

## Common Patterns

### Authentication Middleware

```ts
// utils/auth.ts
export async function requireAuth(request: Request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // PLACEHOLDER: you MUST replace this before shipping. As written, EVERY request that has a token is
  // refused with a 501, so the route never works until you add a real check.
  // Verify the token with your auth provider (check signature and expiry), then return { userId }.
  // For example: Clerk's verifyToken, Firebase Admin's verifyIdToken, or Supabase's auth.getUser(token).
  // Never change this to accept any token: that would leave the route open to everyone.
  throw new Response(JSON.stringify({ error: "Token check not implemented" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

// app/api/protected+api.ts
import { requireAuth } from "../../utils/auth";

export async function GET(request: Request) {
  const { userId } = await requireAuth(request);
  return Response.json({ userId });
}
```

### Proxy External API

> **TEMPLATE: do not ship as is.** The endpoint and header name come from environment variables you must set from your weather provider's own docs. Until you set them, the route will fail. Do not send your key to any URL you have not checked.

```ts
// app/api/weather+api.ts
import { requireAuth } from "../../utils/auth"; // see Authentication Middleware above

export async function GET(request: Request) {
  // This route spends your provider key, so never leave it open: check the caller first,
  // then apply a per-user limit (see "Rate limit per user" below) before calling the provider.
  const { userId } = await requireAuth(request);
  // await limitPerUser(store, userId, 60, 3600);
  const url = new URL(request.url);
  const city = url.searchParams.get("city");
  // Validate the input before you use it
  if (!city || city.length > 80) {
    return Response.json({ error: "Invalid city" }, { status: 400 });
  }

  // Encode the value, and send the key in a header if the provider allows it.
  // WEATHER_API_URL and WEATHER_API_HEADER are placeholders: set them to the endpoint and the
  // header name your provider documents, and check them before you rely on this example.
  const response = await fetch(
    `${process.env.WEATHER_API_URL!}?city=${encodeURIComponent(city)}`,
    { headers: { [process.env.WEATHER_API_HEADER!]: process.env.WEATHER_API_KEY! } }
  );

  return Response.json(await response.json());
}
```

### Rate limit per user (sketch)

Routes that call a paid service need a limit per caller. Workers do not share memory between requests, so keep the counter in a store you choose (your database or your host's key-value store). This is a sketch: replace `store` and set the numbers yourself.

```ts
// utils/rateLimit.ts
export async function limitPerUser(
  store: { increment(key: string, ttlSeconds: number): Promise<number> },
  userId: string,
  maxPerWindow: number,
  windowSeconds: number
) {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const count = await store.increment(`rl:${userId}:${bucket}`, windowSeconds);
  if (count > maxPerWindow) {
    throw new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

Call it right after `requireAuth` and before the route calls the paid service.

## Rules

- NEVER expose API keys or secrets in client code
- ALWAYS validate and sanitize user input
- Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Handle errors gracefully with try/catch
- Keep API routes focused — one responsibility per endpoint
- Use TypeScript for type safety
- Log errors server-side for debugging
- Put keys in request headers, not in the URL query string, where the provider allows it, so they stay out of logs
- Limit how often each caller can use a route that calls a paid service. See the rate limit sketch above, or use your host's rate-limit feature, and test it before launch

## Limitations

- Use this skill only when the task clearly matches its upstream product or API scope.
- Verify commands, API behavior, pricing, quotas, credentials, and deployment effects against current official documentation before making changes.
- Do not treat generated examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [RoadRunner traffic test scenario writer](https://useaiblocks.com/skills/driving-test-scenario-writer). It takes the code change.
- The [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
