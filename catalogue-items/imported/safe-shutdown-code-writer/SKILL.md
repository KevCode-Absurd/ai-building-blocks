---
name: graceful-shutdown
description: "Implement graceful shutdown for servers and workers: drain connections, finish in-flight work, release resources, and exit cleanly on SIGTERM/SIGINT."
category: development
risk: safe
source: self
source_type: self
date_added: "2026-08-27"
author: Prajeeth-12
tags: [graceful-shutdown, signals, SIGTERM, SIGINT, drain, health-check, kubernetes, docker, production, resilience]
tools: [claude, cursor, codex, gemini]
license: "MIT"
---

# Graceful Shutdown

## Overview

A skill for implementing graceful shutdown in servers, workers, and long-running processes. Ensures in-flight requests complete, background jobs finish or checkpoint, database connections close cleanly, and the process exits with a proper status code. Essential for zero-downtime deployments in container orchestrators (Kubernetes, ECS, Docker Compose) and bare-metal process managers (systemd, PM2).

## When to Use This Skill

- Use when building an HTTP server that must not drop active connections during deploys
- Use when writing a background worker that processes jobs from a queue
- Use when deploying to Kubernetes, Docker, or any environment that sends SIGTERM before killing
- Use when the user says "graceful shutdown", "drain connections", "handle SIGTERM", "zero downtime", or "don't kill active requests"
- Use when implementing health check endpoints (`/healthz`, `/readyz`) for orchestrators

## When Not to Use

- Short-lived scripts, one-off jobs and serverless functions. They do not run a long-lived process, so there is nothing to drain. Use the platform's own shutdown notes instead.
- The user wants load balancing, autoscaling or Kubernetes rollout design. This skill only covers the app's side of a stop.
- The app's code is not available. Ask for it first.

## What You Need

- The server or worker code: the file where the process starts and where connections, queues or timers are opened.
- The language and framework (for example Node with Express, or Python with FastAPI under Uvicorn).
- The longest time a request or job can take, and any stop time the host allows (Kubernetes `terminationGracePeriodSeconds`, Docker `stop_timeout`, or the platform's own limit).
- Where it is deployed (optional but useful).

If the code or the framework is missing, ask once. If the longest request time or the host's stop time is missing, write `MISSING: <what>`, use the 25 second drain and 30 second host defaults in the examples, and say they are placeholders to check. Never invent code the user did not share: show only the lines to add or change.

## Output

Return:

1. **Shutdown plan**: the order your app will stop things, in 4 to 6 plain lines (stop new work, flip readiness, drain, close resources, exit).
2. **The code**: the signal handler, the stop-new-work step, the drain with a deadline, and the resource cleanup, fitted to the user's code. Mark each change by file.
3. **Health endpoints**: `/healthz` and `/readyz`, if the app has none.
4. **Settings to change**: the host's grace period and drain time, with the rule `drain time < host stop time`.
5. **A test**: how to send SIGTERM in a test and check that no request is dropped.
6. **Not covered**: WebSocket or SSE connections, clustered workers, or anything else the code needs and this answer did not handle.

## How It Works

### Step 1: Register signal handlers early

Trap `SIGTERM` (orchestrator shutdown) and `SIGINT` (Ctrl+C) at process startup. Set a flag so the application knows it is shutting down.

```typescript
let isShuttingDown = false;

function onShutdownSignal(signal: string): void {
  if (isShuttingDown) return; // prevent double-shutdown
  isShuttingDown = true;
  console.log(`Received ${signal}, starting graceful shutdown...`);
  void shutdown(server); // see Step 2; `server` is your http.Server
}

process.on("SIGTERM", () => onShutdownSignal("SIGTERM"));
process.on("SIGINT", () => onShutdownSignal("SIGINT"));
```

### Step 2: Stop accepting new work

Immediately stop the server from accepting new connections. For HTTP servers, call `server.close()`. For queue workers, stop polling for new jobs.

```typescript
import type { Server } from "node:http";

// `server` is the http.Server your app created with createServer(app)
// or app.listen(). Pass it in, or import it from where you create it.
async function shutdown(server: Server): Promise<void> {
  // 1. Mark readiness as not-ready. isShuttingDown is already true (Step 1),
  //    so the /readyz handler in Step 4 returns 503 from this point and
  //    load balancers stop routing.

  // 2. Stop accepting new connections
  server.close(() => {
    console.log("Server closed — no new connections accepted");
  });

  // 3. Drain in-flight work, release resources, and exit (Step 3)
  await drainAndExit();
}
```

In Step 1, call it as `shutdown(server)` from `onShutdownSignal`.

### Step 3: Drain in-flight work with a deadline

Wait for active requests and background tasks to finish, but enforce a hard deadline so the process never hangs indefinitely.

```typescript
const DRAIN_TIMEOUT_MS = 25_000; // must be less than orchestrator's terminationGracePeriodSeconds

async function drainAndExit(): Promise<void> {
  const deadline = setTimeout(() => {
    console.error("Drain timeout reached — forcing exit");
    process.exit(1);
  }, DRAIN_TIMEOUT_MS);
  deadline.unref(); // don't keep the event loop alive just for the timer

  try {
    // Wait for active connections to finish
    await waitForActiveConnections();

    // Flush buffered data (logs, metrics, queues)
    await flushBuffers();

    // Close external resource handles
    await closeResources();

    console.log("Graceful shutdown complete");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}
```

### Step 4: Implement readiness and liveness probes

Orchestrators use these to decide whether to route traffic and whether to restart the container. Liveness proves the process is alive; readiness controls whether traffic is routed. While the listener is still available during a drain, keep liveness healthy and return 503 only from readiness. After the listener closes, new probes cannot connect, so do not promise that HTTP liveness remains reachable for the entire termination window.

```typescript
import { createServer, IncomingMessage, ServerResponse } from "node:http";

function handleHealthCheck(req: IncomingMessage, res: ServerResponse): void {
  if (req.url === "/healthz") {
    // Keep liveness distinct from readiness while the listener is available.
    // Drain-rejection middleware must not turn this endpoint into a 503.
    res.writeHead(200).end("ok");
    return;
  }

  if (req.url === "/readyz") {
    // Readiness: 503 during shutdown so the load balancer stops routing.
    if (isShuttingDown) {
      res.writeHead(503).end("shutting down");
    } else {
      res.writeHead(200).end("ready");
    }
    return;
  }
}
```

### Step 5: Track active connections

Maintain a count of in-flight requests so you know when draining is complete. Use a once guard covering both `finish` and `close` events so that client disconnects (aborted requests) correctly decrement the counter.

```typescript
let activeConnections = 0;
let drainResolve: (() => void) | null = null;

function trackRequest(res: ServerResponse): void {
  activeConnections++;
  let counted = true;
  function release(): void {
    if (!counted) return;
    counted = false;
    activeConnections--;
    if (isShuttingDown && activeConnections === 0 && drainResolve) {
      drainResolve();
    }
  }
  res.on("finish", release);
  res.on("close", release);
}

function waitForActiveConnections(): Promise<void> {
  if (activeConnections === 0) return Promise.resolve();
  return new Promise((resolve) => {
    drainResolve = resolve;
  });
}
```

## Examples

### Example 1: Express.js server with graceful shutdown

```typescript
import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
let isShuttingDown = false;
let activeRequests = 0;
let drainResolve: (() => void) | null = null;

// Health endpoints — registered BEFORE the drain-rejection middleware so it
// cannot turn liveness into a 503 while the listener is still available.
app.get("/healthz", (_, res) => res.send("ok"));
app.get("/readyz", (_, res) => {
  res.status(isShuttingDown ? 503 : 200).send(isShuttingDown ? "draining" : "ready");
});

// Track in-flight requests and reject new application work during drain.
app.use((req, res, next) => {
  if (isShuttingDown) {
    res.setHeader("Connection", "close");
    res.status(503).json({ error: "Server is shutting down" });
    return;
  }

  activeRequests++;
  let counted = true;
  function release(): void {
    if (!counted) return;
    counted = false;
    activeRequests--;
    if (isShuttingDown && activeRequests === 0 && drainResolve) {
      drainResolve();
    }
  }
  // Listen for both finish (normal) and close (client abort) so the
  // counter always decrements. The once guard prevents double-decrement
  // when both events fire.
  res.on("finish", release);
  res.on("close", release);
  next();
});

// Application routes
app.get("/api/data", async (req, res) => {
  const data = await fetchData();
  res.json(data);
});

// Graceful shutdown
function shutdown(signal: string): void {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received — draining ${activeRequests} active requests`);

  server.close();

  const forceExit = setTimeout(() => {
    console.error("Forced exit — drain timeout exceeded");
    process.exit(1);
  }, 25_000);
  forceExit.unref();

  if (activeRequests === 0) {
    console.log("No active requests — exiting cleanly");
    process.exit(0);
  }

  drainResolve = () => {
    console.log("All requests drained — exiting cleanly");
    process.exit(0);
  };
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.listen(3000, () => console.log("Server ready on :3000"));
```

### Example 2: Python FastAPI under Uvicorn

Uvicorn owns SIGTERM handling and request draining. It stops accepting new connections, asks existing connections to shut down, waits for connections and tasks up to `--timeout-graceful-shutdown`, and only then sends the ASGI lifespan shutdown event. Do not replace its signal handler or wait for requests again inside `lifespan`; use that hook to release application resources after Uvicorn's drain.

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db_pool = await open_database_pool()
    try:
        yield
    finally:
        # Uvicorn has already completed or timed out its request drain.
        await app.state.db_pool.close()


app = FastAPI(lifespan=lifespan)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/readyz")
async def readyz():
    return {"status": "ready"}
```

Run Uvicorn with a deadline shorter than the orchestrator's kill timeout:

```bash
uvicorn app:app --timeout-graceful-shutdown 25
```

If readiness must turn 503 before SIGTERM, coordinate a separately secured and tested pre-stop drain signal plus a propagation delay. FastAPI's lifespan shutdown hook is too late for that transition because Uvicorn invokes it after request draining.

### Example 3: Background worker with checkpoint

```typescript
import { parentPort } from "node:worker_threads";

let isShuttingDown = false;
let currentJob: { id: string; checkpoint: () => Promise<void> } | null = null;
let loopDone: Promise<void> = Promise.resolve(); // set when the poll loop starts

process.on("SIGTERM", async () => {
  isShuttingDown = true; // the poll loop stops taking new jobs
  console.log("Worker shutting down — finishing current job");

  // Wait for the loop to finish the job it is running, up to a deadline
  // that is shorter than the host's kill timeout.
  const deadline = new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), 25_000).unref());
  const result = await Promise.race([loopDone.then(() => "done" as const), deadline]);

  if (result === "timeout" && currentJob) {
    await currentJob.checkpoint();
    console.log(`Job ${currentJob.id} checkpointed`);
  }

  process.exit(result === "done" ? 0 : 1);
});

async function processJobs(queue: JobQueue): Promise<void> {
  while (!isShuttingDown) {
    const job = await queue.poll({ timeout: 5000 });
    if (!job) continue;

    currentJob = job;
    await job.execute();
    await queue.ack(job.id);
    currentJob = null;
  }
}

// Start the loop and keep its promise so the handler can wait for it.
// This line is required, or the shutdown handler waits on an already-finished promise:
loopDone = processJobs(queue);
```

## Best Practices

- Always set a drain timeout shorter than the orchestrator's kill timeout (`terminationGracePeriodSeconds` in Kubernetes defaults to 30s — use 25s for your drain)
- Return `Connection: close` header on responses sent during draining so HTTP/1.1 clients don't reuse the connection
- Reject new requests with 503 during shutdown so load balancers learn faster
- Unref your force-exit timer so it doesn't keep the event loop alive after all work is done
- Flush async buffers (log transports, metric aggregators, write-ahead logs) before exiting
- Use `process.exit(0)` for clean shutdown and `process.exit(1)` for timeout/error so orchestrators can distinguish the two
- Test shutdown behavior explicitly — simulate SIGTERM in integration tests and verify no requests are dropped

## Common Pitfalls

- **Problem:** Drain-rejection middleware turns both readiness and liveness into 503 while the HTTP listener is still available.
  **Solution:** Register health routes before that middleware and flip only readiness. Once the listener closes, new probes may no longer connect; the shutdown deadline, not a promise of HTTP liveness, bounds termination.

- **Problem:** Drain hangs until the force-exit timeout even though all clients have disconnected.
  **Solution:** Track request completion with both `finish` and `close` events (Node.js) or equivalent. If a client aborts the connection, `finish` may never fire — `close` will. Use a once guard to prevent double-decrementing the counter.

- **Problem:** A FastAPI application replaces Uvicorn's SIGTERM handler or waits for in-flight requests inside lifespan shutdown.
  **Solution:** Let Uvicorn own signal handling, connection/task draining, and `--timeout-graceful-shutdown`. Use lifespan shutdown for resource cleanup; it runs after Uvicorn's request-drain phase.

- **Problem:** Kubernetes kills the pod before connections drain because `terminationGracePeriodSeconds` is too short.
  **Solution:** Set it to at least drain timeout + 5s buffer. If your longest request takes 60s, use `terminationGracePeriodSeconds: 70` and drain timeout of 65s.

- **Problem:** Load balancer keeps sending traffic after SIGTERM because readiness probe still returns 200.
  **Solution:** Flip the readiness probe to 503 immediately on signal receipt — before starting to drain.

- **Problem:** `server.close()` resolves instantly but connections remain open (keep-alive).
  **Solution:** Track connections manually and destroy idle keep-alive sockets on shutdown. Active sockets with in-flight requests should drain normally.

- **Problem:** Double shutdown from both SIGTERM and SIGINT (e.g., Docker sends SIGTERM then user hits Ctrl+C).
  **Solution:** Guard with a `isShuttingDown` flag — ignore the second signal.

- **Problem:** Deadlocked process never exits because drain waits forever.
  **Solution:** Always have a hard force-exit timeout as the final backstop.

## Kubernetes Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: app
          livenessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /readyz
              port: 3000
            initialDelaySeconds: 2
            periodSeconds: 5
```

## Limitations

- This skill does not replace environment-specific validation, testing, or expert review.
- WebSocket and SSE connections require application-level close frames before severing — `server.close()` alone won't gracefully end them.
- In clustered/multi-process setups (e.g., Node.js `cluster` module), each worker must handle signals independently.
- Some cloud platforms (Heroku, Railway) send SIGTERM with very short grace periods (10-30s) — adjust drain timeouts accordingly.

## Credit and licence

Written by Prajeeth-12 (the front matter above lists MIT for the skill). This copy comes from the `sickn33/agentic-awesome-skills` collection, whose written content is under CC BY 4.0 (see `LICENSE-CONTENT`). Keep the credit to Prajeeth-12 and sickn33 when you reuse it.

## Related Skills

- `@api-rate-limit-handler` — Resilient retry and backoff for outbound requests
- `@circuit-breaker` — When to stop retrying entirely and fail fast
- `@error-handling` — Structured error handling patterns
