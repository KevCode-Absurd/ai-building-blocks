# Message routing reference

Resolve channel and client scope, build message context, and reject bot loops. Acknowledge the transport event before heavy processing; make duplicate event handling idempotent. Then classify intent, retain conversation context, merge only relevant recent entities, and check the user's access to the classified agent.

Build a durable job with agent, scope, context, input, priority and stable ID. Enqueue it with bounded retries and backoff. In the worker check status, budget and policy, then run the job or heartbeat. The agent may read only scoped data. Return through a response filter, formatter and the original channel/thread.

Reaction feedback and button callbacks use separate handlers. Validate their actor, proposal and scope. They can signal a wakeup but should not create a second visible thread.

Troubleshoot invalid classification, denied permissions, missing channel mapping, unavailable Redis and orphan jobs separately. Latency targets are configuration choices; verify current transport deadlines.
