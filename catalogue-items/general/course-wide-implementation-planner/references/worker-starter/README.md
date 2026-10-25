# Complete Worker Starter

A functional minimal multi-agent worker. Two agents, one queue, one Slack router, one heartbeat. Boot it, watch the logs, extend it.

This is the shape your production worker will take. It uses the same layering and setter injection you saw in Lesson 31.

---

## What you get

- `worker/agent-system.ts` - the 10-phase boot sequence
- `lib/agents/core/base-agent.ts` - the BaseAgent contract
- `lib/agents/core/job-queue.ts` - BullMQ wrapper
- `lib/agents/core/slack-router.ts` - Socket Mode + `!command` dispatcher
- `lib/agents/core/heartbeat-runner.ts` - cron-triggered periodic work
- `lib/agents/echo/agent.ts` - echoes back anything you send
- `lib/agents/monitor/agent.ts` - fake monitor that emits findings on a schedule

Everything here compiles with `tsc --noEmit`. Nothing in here reaches across layers or depends on anything outside `lib/` and `worker/`.

---

## Prerequisites

- Node 20+
- A Redis instance (local or Upstash)
- A Slack app with Socket Mode enabled
  - Bot scopes: `chat:write`, `commands`, `channels:history`, `reactions:read`
  - Event subscriptions: `message.channels`, `reaction_added`
  - App-level token with `connections:write`

---

## Setup

```bash
cp .env.example .env.local
# Fill in your tokens and Redis URL
npm install
npm run dev
```

If everything wires up, you will see:

```
[AgentSystem] Environment: development
[AgentSystem] Redis connected
[AgentSystem] 2 agents registered
[AgentSystem] Slack connected via Socket Mode
[AgentSystem] Heartbeat scheduled (every minute for monitor)
[AgentSystem] Worker started with concurrency=5
[AgentSystem] Ready.
```

---

## Try it

1. Invite your bot to a test channel.
2. Post `!echo hello world`. You should see a reply within a second.
3. Wait one minute. The monitor will post a synthetic finding.

---

## Extend it

- Add a third agent: copy `lib/agents/echo/agent.ts`, change the id, register it in `worker/agent-system.ts`.
- Add a monitoring check: call `monitoringAgent.addCheck({ cron, fn })` in its constructor.
- Add a slash command: extend `slackRouter.registerCommand('command', handler)`.

This starter intentionally omits: proposals, budgets, delegation, learning. Add them one at a time using the lessons from Course 2.
