---
name: mcp-server-security
description: Hardens MCP servers against MCP-specific attacks - tool poisoning, rug pulls, prompt injection via tool results, session hijacking, SSRF, command injection - with guardrails-in-code, sandboxing, audit logging, kill switches. Use for securing, hardening, threat-modeling, or security-reviewing an MCP server or vetting a third-party one. Not for OAuth/token wiring or generic appsec scans.
---

# mcp-server-security

MCP security is not ordinary API security: the caller is a manipulable LLM, the
server's own metadata is executable-ish content in someone else's context, and
agents retry, parallelize, and obey instructions found in data. This skill
encodes the attack classes documented in real disclosures and the defenses that
counter them. Auth mechanics (OAuth, audiences, tokens) live in
`mcp-server-auth`; this skill assumes identity exists and hardens everything else.

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

## When NOT to use

- Implementing OAuth/discovery/token validation → `mcp-server-auth`.
- Building the server / transport wiring → `mcp-server-implementation`
  (the Origin/localhost/session-ID floors are set there; this skill explains
  the attacks behind them).
- Generic web/infra scanning, container CVEs, non-MCP pentesting.

## Workflow

### 1. Threat-model against the MCP taxonomy

Walk `references/threats.md` (each attack: mechanism, real incident, defenses).
Summary table:

| Attack | One-line mechanism | Canonical defense |
| --- | --- | --- |
| Tool poisoning | hostile instructions in descriptions/schema fields the user never sees | pin + hash descriptions; scan in CI; client-side re-approval |
| Rug pull | benign tool swapped post-approval via `list_changed` | version-pin servers; alert on description drift |
| Injection via tool results | fetched/user content carries instructions the model obeys | delimit + sanitize all external content; treat output as untrusted input |
| Confused deputy | server's own credential exercised on behalf of the wrong caller | per-client consent; audience validation (see `mcp-server-auth`) |
| Session hijacking | guessable/replayed session IDs | crypto-random IDs bound to user identity; sessions never = auth |
| SSRF | tool or discovery fetches attacker-chosen URLs | scheme/host allowlists; block private + metadata ranges pre-fetch |
| Command injection | tool args reaching a shell / stdio params executed | no shell-out with user input; safe APIs; treat local servers as code execution |
| Supply chain | malicious/compromised server package | pin versions; review; sandbox; registries don't vet for you |
| Denial of wallet | unbounded expensive calls (OWASP LLM10) | per-identity quotas, cost caps, `retry-after` |

### 2. Guardrails in code, not prompts

Test: *if the system prompt were deleted, would the constraint still hold?*
Amount caps, tenancy checks, jurisdiction rules, "never delete without
confirmation" — all `if` + refuse in the handler, never instructions in a
description. Make reads easy, writes expensive:

- Destructive tools: explicit confirmation gate (elicitation where supported,
  or a two-step confirm token), honest `destructiveHint`, separate write scope.
- **Idempotency keys on every mutating tool** — agents retry by design; store
  `(caller, key)` with a TTL, return the original result on replay.
- Validate inputs at two layers: schema at the protocol boundary, business
  rules in the handler (path traversal: resolve + verify inside root; never
  interpolate into SQL/shell).

### 3. Contain the blast radius

- Run servers sandboxed: container/micro-VM, non-root, read-only FS where
  possible, minimal egress allowlist. Treat third-party local servers as
  arbitrary code execution on the host — because stdio servers are exactly
  that (the SDKs' param-to-shell behavior is documented as by-design).
- Secrets: environment/secret manager only; never in code, client-config args,
  or logs. Short-lived credentials where the backend allows.
- Per-tool rate limits AND per-identity cost quotas; a **kill switch** per tool
  (feature flag/Redis set) that disables it without a redeploy.
- Egress DLP for tools returning records: redact PII/credentials fields the
  caller's scope doesn't justify.

### 4. Audit everything, tamper-evidently

One audit event per tool call: caller identity, tool, sanitized args (or a
safe summary), outcome, latency, session — to a separate append-only store
(SIEM), not the app database. A web-access log is not an audit trail;
compliance regimes (SOC 2, HIPAA, PCI) expect attributable, tamper-evident
records. Never log tokens or raw secrets. Alert on: guardrail-block spikes,
description drift, per-caller cost anomalies, session-length outliers.

### 5. Sanitize the model-facing surface

- Wrap external/tool-fetched content in explicit delimiters
  (`<external_data source="...">`) and screen for injection phrases before
  returning — code-level, applied unconditionally; neither delimiting nor
  screening is sufficient alone.
- Never echo unfiltered third-party content into errors or descriptions.
- Annotations are UX hints; clients must not trust them from untrusted
  servers — never rely on your own annotations as an access control.

### 6. Gate it in CI

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/security_checklist.py" --repo .
```

prints the deterministic checklist (pinning, secrets, drift detection,
guardrail evals) with PASS/FAIL per item where detectable, TODO where
judgment is needed; non-zero exit on failures. Add
description-drift scanning (e.g. `mcp-scan`-class tooling) and a guardrail
regression eval (a prohibited action must be refused) to the pipeline —
methodology in `mcp-server-testing`.

## Output spec

A hardened server: taxonomy reviewed with written dispositions; destructive
tools confirmed + idempotent; two-layer validation; sandboxed runtime with
minimal egress; per-tool limits + kill switches; separate audit store wired;
external content delimited/sanitized; CI running the checklist + drift
detection; secrets and logs clean.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI agent attack tester](https://useaiblocks.com/skills/ai-agent-attack-tester). It takes the security report.
- The [Prompt injection defender](https://useaiblocks.com/skills/prompt-injection-defender). It takes the security report.
- The [MCP server publisher](https://useaiblocks.com/skills/mcp-server-publisher). It takes the security report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Gotchas

- **Stronger models are MORE injectable via tool results**, not less — better
  instruction-following widens this attack. Never reason "the model will
  ignore it".
- Vet third-party servers like dependencies with hands: review, pin the
  version, hash the tool descriptions, sandbox. Registries (official one
  included) do not security-review listings.
- Several defenses are the **client's** job (consent UI, re-approval on
  change, sandboxing the server process) — a perfect server still needs a
  competent host; say so in your security docs.
- Institutional baselines exist — NSA's MCP CSI, OWASP GenAI's secure-MCP
  guide, CSA's agentic-security practices — cite them to auditors instead of
  arguing from blogs (index in `references/threats.md`).
- Real incidents to learn from, not repeat: postmark-mcp (npm server silently
  BCC'ing mail), CVE-2025-6514 (mcp-remote RCE), CVE-2025-49596 (old
  Inspector), SSRF-via-discovery in both major SDKs.

## Pointers

- `references/threats.md` — full taxonomy with mechanisms, disclosed
  incidents/CVEs, defenses, and the institutional-guidance index.
- `scripts/security_checklist.py` — deterministic CI checklist runner.
