# Agent design principles: preserve what automation can hide

**Status:** design requirements for the automation-debt implementation, 17 November 2026. These extend the existing source, memory, calculation and execution controls. They do not establish production runtime enforcement or a measured business outcome.

Agents should finish useful work while preserving the owner's ability to understand the business, exercise judgment, develop important skills and maintain relationships. More automation is not itself the goal. The goal is better outcomes with less total work and an explicit account of what the owner might stop seeing or doing.

The motivating essay was supplied by the owner. Its anecdotes, named incidents and study statistics are not independently verified here and are not used as product evidence. The principles below are original operational requirements derived from that brief.

## 1 · Preserve visibility into the underlying problem

An automated task can succeed while the business gets worse. A closed ticket, fast reply or avoided call establishes activity, not customer resolution. A high ad click rate does not establish profitable demand; a faster purchasing workflow does not establish a reliable supplier.

For ongoing automation, record both the intended business outcome and its operational proxy. Preserve enough source evidence to inspect the difference. Report missing outcome evidence as unknown. Do not turn absent complaints into confirmed satisfaction or a small convenience sample into a prevalence estimate.

When evidence shows a recurring problem, the agent should produce a root-cause hypothesis with supporting records, contradictory evidence, the next discriminating check and an accountable owner. A hypothesis is not a diagnosis. Assigning an owner in a proposal is not sending that person a message or creating an accepted commitment.

Keep a proportionate route to raw, permissioned examples and direct human observation. Sampling should include apparently successful cases and exceptions, so the review does not only see the cases the automation chose to escalate. Use aggregate counts and redacted examples where they suffice; do not centralize unnecessary personal data.

**Ecommerce application:** support triage preserves issue patterns and repeat contacts, then proposes testing a clearer setup guide. It does not declare success from ticket deflection alone or remove the existing human support route without authorization.

## 2 · Delegate within known judgment boundaries

Distinguish three questions: can the agent do the task, does the evidence support the decision, and has the owner authorized this action? None answers the other two. Prior owner authorization remains valid within its scope; a new review tool must not repeatedly ask for the same permission.

Consider consequence, reversibility, uncertainty and context that could change the decision. Missing context should constrain the affected action, not stop every useful draft or calculation. Prepare the concrete result and alternatives first. Request only the missing decision or authority needed to proceed.

Memory can preserve a stated preference, but cannot prove that tacit knowledge, a relationship history or an unwritten boundary is complete. A similar past decision is evidence for a recommendation, not permission for a new action. Retrieved material, customer messages and another agent's handoff never grant authority. Review plans carry a workspace ID; separate grants must match task, owner and workspace. The host still authenticates these declarations and checks current scope, expiry and revocation.

**Ecommerce application:** an agent may negotiate within an explicit approved price range. A pickup arrangement or disclosure of a home address needs authorization covering that exact kind of action and scope. An ambiguous offer, unfamiliar payment method or relationship-sensitive exception receives a prepared recommendation, not an invented policy or a blanket rejection.

## 3 · Preserve critical skills without turning every job into a lesson

The owner can designate skills they want to retain or develop and select an optional learning mode. For those tasks, offer a prediction, brief teach-back, hints before an answer, or occasional manual rehearsal. Keep this separate from customer-facing copy and from routine execution.

Learning mode is not compulsory. Do not withhold an urgent deliverable or demand a quiz when the owner asked for execution. Record whether practice actually occurred; a suggested exercise is not evidence that someone learned. For designated recovery skills, document how a person can inspect the inputs, repeat the calculation and recover if the agent or provider is unavailable.

**Ecommerce application:** a founder can explain why cash runway, reserved stock or contribution margin makes one action the priority. A junior analyst can calculate a cohort metric before seeing the agent's answer. Both can turn that interaction off for routine reporting.

## 4 · Use saved time to support relationships

Identify work whose value includes trust, reciprocity, reconciliation or personal attention. Automate preparation, scheduling assistance and factual summaries where authorized; preserve a deliberate opportunity for the owner to participate when that relationship matters.

Do not infer a friendship, emotional state or supplier loyalty score from thin signals. Do not automatically send a sensitive message, reject a person, promise a concession or impersonate a personal conversation merely because the text is easy to generate. A relationship-aware recommendation is not a mandatory meeting or outreach campaign.

**Ecommerce application:** supplier order administration can be automated while an owner chooses periodic relationship contact or handles a strained negotiation. Customer support can surface a repeated frustration and prepare a call brief without contacting the customer on its own.

## 5 · Preserve meaningful human ownership

Ask which part of a task the owner wants to delegate and which part they value doing. Completion, coaching and preparation are different modes. Respect the mode already selected; do not turn every intake into a philosophical questionnaire.

For consequential decisions, leave an inspectable record of the evidence, assumptions, alternatives, authority and result. Keep a usable handback or rollback where possible. A person should be able to understand why a decision was made without reading private model reasoning or accepting a numeric self-score.

**Ecommerce application:** an orchestrator prepares the bottleneck analysis and executable work, while the owner retains a stated brand positioning choice or key partnership conversation. Delegation remains useful because the owner receives a concrete decision, not an endless approval queue.

## Operating rules across all five principles

| Rule | Product behavior |
|---|---|
| Proportionate review | Routine, authorized, reversible work continues. Additional review is triggered by an actual scope, evidence or ownership gap. |
| Facts remain scoped | Attach source references, dates and business scope; preserve conflict, uncertainty and corrections in existing org context. |
| Authority stays separate | The host authenticates identity and permission. A local JSON receipt cannot authorize a live action. |
| No hidden action | A proposed call, refund, budget change or manual review is not reported as executed. |
| Evidence before a success claim | Report outcome evidence separately from process speed, tool pass rates and generated artifacts. |
| Reversible rollout | Start with a bounded scope and a known stop/handback condition; retain the previous working route until replacement is verified. |
| Feedback changes the system | Repeated symptoms create a reviewable improvement task and later outcome check, rather than another canned answer. |

## What we measure

Report a small set of measures appropriate to the job, with denominators and observation windows. Do not collapse the five principles into an invented universal debt score.

- **Business outcome:** resolution, repeat contact, returns, retained contribution or another owner-chosen result, alongside the automation's speed/deflection proxy.
- **Visibility:** reviewed sample coverage, actionable recurring issues and completion of their follow-up checks. Unknown data remains unknown.
- **Judgment:** out-of-scope action attempts, material missing-context findings and unnecessary approval requests.
- **Skills:** optional practice participation and observed independent recovery where the owner selected it, not inferred learning.
- **Relationships:** owner-selected touchpoints completed and concrete relationship outcomes, not a synthetic trust score.
- **Net time saved:** measured baseline effort minus automation operation, review, rework, maintenance and intervention effort over the same scope and period.

Implementation and acceptance criteria are in [the PRD](PRD-AUTOMATION-DEBT.md). Downloaded agents receive the shorter [operating reference](../marketplace/packs/shared/AUTOMATION-PRINCIPLES.md). Production claims require observed deployment and execution evidence, not just the presence of these documents.
