---
name: kubernetes-operator
description: Use when building a Kubernetes Operator — custom controllers that reconcile CRD state. Triggers on "build an operator", "CRD design", "reconcile loop", "controller-runtime", "kubebuilder", "operator-sdk", "metacontroller", "KOPF", "operator capability levels", or "custom resource". Ships CRD validator, reconcile-loop linter, and OperatorHub capability auditor (all stdlib Python), 4 references on the operator pattern + CRD design + reconcile patterns + tooling landscape, and a /operator-audit slash command. NOT a generic k8s skill — specifically the Operator pattern.
context: fork
version: 2.9.0
author: claude-code-skills
license: MIT
tags: [kubernetes, operator, crd, controller-runtime, kubebuilder, operator-sdk, metacontroller, kopf, reconcile, devops]
compatible_tools: [claude-code, codex-cli, cursor, antigravity, opencode, gemini-cli]
---

# Kubernetes Operator

Build operators that reconcile correctly. Most operator bugs are not Kubernetes bugs — they are reconcile-loop bugs: missing finalizers, blocking calls, no requeue on transient errors, status drift, RBAC over-grants. This skill flags likely instances of them before they reach a cluster. Its lint scripts use pattern checks and can miss issues, so still read the code.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Building a new Kubernetes Operator (controller for a CRD)
- Reviewing an existing operator for capability-level gaps
- Auditing a CRD spec for status/conditions/finalizer correctness
- Choosing a framework (controller-runtime / kubebuilder / operator-sdk / metacontroller / KOPF)
- Designing the API surface of a Custom Resource
- Hardening RBAC, leader election, or webhook validation

## When NOT to use

- Plain Helm chart packaging → use `helm-chart-builder`
- Standard kubectl operations / blue-green deploys → use `senior-devops`
- General k8s security posture → use `cloud-security`
- "I want to run a workload" — that's a Deployment / Job, not an operator

## Core principle: an operator is a reconcile loop, not a script

```
observe(actual) → desired = read(spec) → diff(actual, desired) → act → update(status)
                                                                          ↓
                                                                   requeue / done
```

Operators that fail are the ones that:
1. Treat reconcile as imperative (do this, then this, then this) instead of declarative (make actual=desired, idempotently)
2. Don't requeue transient failures
3. Don't use finalizers, leaving orphan resources
4. Mutate spec instead of status
5. Don't use the status subresource (status updates trigger spec reconciles → loop)
6. Block in reconcile (long HTTP calls, locks)
7. Forget leader election → split-brain on multi-replica deploys

The 3 tools below catch each of these.

## Quick start

```bash
SKILL=engineering/kubernetes-operator/skills/kubernetes-operator

# Validate a CRD design
python "$SKILL/scripts/crd_validator.py" --crd config/crd/myapp.yaml

# Lint a Go reconcile function
python "$SKILL/scripts/reconcile_lint.py" --controller controllers/myapp_controller.go

# Score against OperatorHub Capability Levels (1-5)
python "$SKILL/scripts/operator_capability_audit.py" --operator-dir .
```

## The 3 Python tools

All stdlib-only. Run with `--help`.

### `crd_validator.py`

Validates a CRD YAML against operator-pattern best practices.

```bash
python scripts/crd_validator.py --crd config/crd/myapp.yaml
python scripts/crd_validator.py --crd config/crd/ --format json
```

**Checks:**
- `spec.versions[*].subresources.status` is set (status subresource)
- `spec.scope` is `Namespaced` (not `Cluster`) unless explicitly justified
- Singular and listKind defined
- `spec.versions[*].schema.openAPIV3Schema` has type definitions (no `x-kubernetes-preserve-unknown-fields: true` at top level)
- A version is marked `served: true` AND `storage: true`
- Conditions array is in the schema (allows `metav1.Conditions`)
- Printer columns include `Age` and `Status`/`Phase`

### `reconcile_lint.py`

Lints a Go controller reconcile function for anti-patterns.

```bash
python scripts/reconcile_lint.py --controller controllers/myapp_controller.go
```

**Checks (regex-based heuristics):**
- Returns are `(ctrl.Result, error)` shape
- Errors trigger a non-zero requeue (`return ctrl.Result{Requeue: true}, err`)
- `client.Update()` on the spec object is flagged (controllers should update only status)
- `time.Sleep` inside reconcile is flagged (use `RequeueAfter`)
- HTTP calls without context cancellation are flagged
- Missing `defer` after a finalizer add
- No `IsConditionTrue` / `SetCondition` calls when conditions present in CRD
- Reconcile function exceeds 80 lines (extract subroutines)

### `operator_capability_audit.py`

Scores an operator against OperatorHub's 5 Capability Levels.

```bash
python scripts/operator_capability_audit.py --operator-dir .
```

**Levels:**
- **L1 — Basic Install:** CRD defined, controller deploys it
- **L2 — Seamless Upgrades:** PDBs, conversion webhooks, version skew strategy
- **L3 — Full Lifecycle:** backups, restores, failure recovery
- **L4 — Deep Insights:** metrics endpoint, Prometheus rules, alerts
- **L5 — Auto Pilot:** auto-scaling, auto-tuning, anomaly detection

Reports current level + concrete next steps to advance one level. The report is a text report with sections for CRD findings, lint findings, the current level and next steps.

## Tooling landscape

Pick a framework based on language and complexity. See `references/tooling_landscape.md`.

| Framework | Language | Best for | Maintenance |
|---|---|---|---|
| **controller-runtime** | Go | Production-grade, low-level control | Active (sig-api-machinery) |
| **kubebuilder** | Go | Standard scaffolding, opinionated | Active (Kubernetes SIGs) |
| **operator-sdk** | Go / Helm / Ansible | OpenShift / mixed-paradigm teams | Active (Red Hat) |
| **metacontroller** | Any (webhook-based) | Polyglot teams, avoiding Go | Less active |
| **KOPF** | Python | Python shops, async-first | Active (community) |
| **java-operator-sdk** | Java | JVM shops | Active (Red Hat / Java SIG) |

Decision rules:
- New operator + Go shop → kubebuilder
- New operator + Python shop → KOPF
- New operator + can't pick a language → metacontroller
- OpenShift target → operator-sdk

## CRD design principles

See `references/crd_design.md` for full detail. Quick rules:

1. **status is the source of truth for the controller's view of the world.** Spec is what the user wants; status is what the controller observed.
2. **Use the status subresource.** Without it, status updates re-trigger reconcile (loop).
3. **Use Conditions.** `Ready`, `Reconciling`, `Degraded`. Each carries a reason and message.
4. **Add finalizers.** Without finalizers, deletion races the controller and orphans external resources.
5. **Version your CRD from day 1.** `v1alpha1` → `v1beta1` → `v1`. Plan a conversion webhook.
6. **Validate via OpenAPI v3 schema.** Don't rely on the controller for validation that should fail at admission.
7. **Use `additionalPrinterColumns` for `kubectl get`.** Show `Age`, `Phase`, `Ready` at minimum.
8. **Namespace your CRDs unless they manage cluster-scoped resources.**

## Reconcile loop principles

See `references/reconcile_loop.md` for full detail. Quick rules:

1. **Idempotent.** Reconciling the same state twice → same result, zero side effects.
2. **Read once, decide, act.** Don't observe the world repeatedly during reconcile.
3. **Update status, not spec.** Spec belongs to the user.
4. **Return errors that requeue.** Use `ctrl.Result{RequeueAfter: ...}` for known transient cases.
5. **Never block.** No `time.Sleep`. No long HTTP calls without context.
6. **Use the cache.** Read via the controller's cached client; only escape the cache for a specific reason.
7. **Leader-elect when running >1 replica.** Otherwise enable single-replica mode.
8. **Set OwnerReferences.** Cascading deletion is the operator pattern's free gift.

## Workflows

### Workflow 1: Bootstrap a new operator (Go + kubebuilder)

```
1. Pick a Group/Version/Kind: e.g., apps.example.com/v1alpha1, kind=MyApp
2. kubebuilder init --domain example.com --repo github.com/org/myapp-operator
3. kubebuilder create api --group apps --version v1alpha1 --kind MyApp
4. Run crd_validator.py on config/crd/bases/apps.example.com_myapps.yaml
   → Fix every WARN before writing controller code
5. Implement the reconcile function (write the simplest correct version first, and add features only after it works)
6. Run reconcile_lint.py on controllers/myapp_controller.go
7. Run operator_capability_audit.py --operator-dir . — confirm L1
8. Test in a kind cluster: kubectl apply -f config/samples/
9. Add status conditions; aim for L2 in the same PR
```

### Workflow 2: Audit an existing operator

```
1. Run operator_capability_audit.py --operator-dir <path>
2. Run crd_validator.py --crd config/crd/
3. Run reconcile_lint.py --controller controllers/
4. Triage findings:
   - FAIL → block release; fix before next deploy
   - WARN → file an issue; fix in next 30 days
5. Document current capability level in README; commit
6. Plan one capability level advancement per quarter
```

### Workflow 3: Choose a framework

```
1. Identify primary language constraint (team skill)
2. Identify deployment target (vanilla k8s vs OpenShift)
3. Identify operator complexity (single CRD vs multi-CRD vs cluster-wide)
4. Cross-reference with references/tooling_landscape.md
5. Build a 1-week proof-of-concept before committing
```

## References

- `references/operator_pattern.md` — what an operator IS, when to use vs alternatives
- `references/crd_design.md` — CRD design principles, versioning, conversion webhooks
- `references/reconcile_loop.md` — reconcile patterns, error handling, idempotency
- `references/tooling_landscape.md` — framework comparison + decision tree

## Slash command

`/operator-audit` — Run all 3 tools on an operator repo and produce a markdown report.

## Asset templates

- `assets/crd_template.yaml` — CRD with status subresource, conditions, finalizer hint, printer columns
- `assets/reconcile_skeleton.go` — Go controller reconcile function with idempotency, conditions, finalizers, requeue patterns

## Anti-patterns

- **`time.Sleep(30 * time.Second)` inside reconcile** — block other reconciles. Use `RequeueAfter`.
- **`r.Client.Update(ctx, obj)` to set status** — use `r.Status().Update(ctx, obj)` instead.
- **No leader election + 2+ replicas** — split-brain.
- **No finalizer** — external resources orphan on deletion.
- **CRD without status subresource** — status updates trigger spec reconciles (infinite loop).
- **Reconcile function > 200 lines** — extract reconcileXxx subroutines per condition.
- **`x-kubernetes-preserve-unknown-fields: true` on spec root** — defeats validation.
- **Imperative reconcile** — "if creating, do A; if updating, do B; if deleting, do C". Wrong shape. Reconcile = make actual=desired, regardless of how we got here.

## Verifiable success

A team using this skill should achieve:

- 100% of new CRDs pass `crd_validator.py` before merge
- All reconcile functions pass `reconcile_lint.py` strict mode
- Operators reach OperatorHub Capability Level 3 (Full Lifecycle) before public release
- Mean time to fix a reconcile bug: <1 day (no infinite loops in production)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Simple code coach](https://useaiblocks.com/skills/simple-code-coach). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
