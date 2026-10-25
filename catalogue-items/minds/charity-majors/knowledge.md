# Charity Majors: what she knew and believed

## In one paragraph

Charity Majors argues for understanding software through the experience of individual requests and for connecting that understanding to the people responsible for operating it. Honeycomb's current leadership page identifies her as a cofounder and technical leader; it was checked on 23 October 2026 and supports recording her as living. [S1] Her writing distinguishes exploratory debugging from predefined monitoring, insists on useful context and challenges the idea that exhausting on-call work is inevitable. Her career essay treats management as a different profession rather than a mandatory promotion. [S2][S3][S4][S5] This profile applies those methods to ordinary service failures, instrumentation reviews, alert burden and career decisions. The scenarios are original applications, not claims that she reviewed a user's system.

## Core ideas

### 1. A dashboard cannot contain every future question

In her observability-tool essay, Majors distinguishes checking known conditions from investigating states that were not predicted in advance. [S2] The practical concern is whether the available evidence lets an engineer pursue a new question when the familiar graphs do not explain the symptom.

Our application begins with a report that a few customers cannot finish checkout even though overall health looks normal. Write the affected task and identify the relevant requests. Ask what successful and failed examples have in common and where they differ. Do not require the failure to resemble yesterday's incident before taking it seriously. The output is a question sequence tied to evidence, with any unavailable data called out. If the current telemetry cannot distinguish the cases, that is an instrumentation limitation to address, not proof that the customers' report is mistaken. A useful investigation makes the next question possible without pretending that every possible question was anticipated.

### 2. Preserve relationships that aggregation can erase

Her tool essay argues for structured events carrying request context and relationships that enable detailed investigation. [S2] The important distinction is between knowing that something happened and being able to connect it to the rest of the relevant execution.

For an original instrumentation review, choose one request journey and list the questions needed to understand a failure. Identify which fields connect its stages, which describe environment or outcome and which are merely convenient decoration. Use approved synthetic or appropriately minimised data for the example. Do not copy secrets or unnecessary personal content into telemetry simply because richer context is useful. Return an event sketch with a reason for each field, handling requirements and a query the field enables. The goal is enough connected evidence for the actual debugging task. It is not a licence to collect everything indefinitely or an assumption that any particular vendor automatically provides complete understanding.

### 3. Let one answer determine the next question

The same essay advocates iterative exploration: ask a question, inspect the answer and use it to formulate the next one. It contrasts this with guessing from a familiar dashboard shape. [S2] This gives debugging an explicit evidential path.

Our exercise is a hypothesis log for an intermittent login failure. Start with the observed difference, such as one client version failing more often, rather than a favoured cause. Record the query, result and the next discriminating question. If the result does not support the hypothesis, retain it and change direction. A pattern is a clue; it does not establish causation by itself. Return the evidence path in enough detail that another engineer can continue or challenge it. This is especially useful during a handover, where an unexplained confident conclusion can waste time while a short sequence of tested questions can preserve the investigation's real progress.

### 4. Strong rhetoric should not freeze an old position

In her 2025 metrics essay, Majors explicitly revisits the limits of her earlier stance. She distinguishes infrastructure-level signals from contextual application investigation and acknowledges that teams need metrics as part of their operating toolkit. [S3] A profile that simply says she rejects all metrics would misrepresent the selected record.

Our application is a monitoring inventory that assigns a purpose to each signal. Some observations help identify resource pressure; others help explain a particular person's failed request. Ask whether the tool and data shape preserve what that question requires. Avoid turning a naming dispute into a purchasing rule. Return a capability map showing the question, current evidence and missing connection. A mixed system can still be evaluated by what engineers can actually learn from it. The useful standard is the ability to investigate the task, not allegiance to a slogan about which data format is morally superior.

### 5. On-call ownership is a two-way commitment

In her actual Tech Lead Journal answers, Majors pairs engineers' responsibility for their code with management's responsibility to make on-call sustainable. She recommends tracking out-of-hours pages, providing time to fix causes and recognising individual exceptions. [S4] Shared ownership does not justify unlimited exposure to interruption.

For a practical review, collect a limited record of pages: what happened, whether immediate action was needed, the effect on the responder and whether corrective work received time. Distinguish an alert that informs later work from one that truly needs to wake a person. Keep any changes to paging subject to the service's actual requirements; do not delete safeguards by slogan. Return a burden review with the highest-priority repair, an escalation path and a manager-owned action. The outcome should reduce recurring harm and improve operability, rather than simply rotate the same unresolved pain among more people.

### 6. Management and engineering require different attention

Her pendulum essay rejects treating management as the only route to progression. It describes moving between engineering and management over time, while warning that doing both demanding jobs simultaneously creates conflicting attention requirements. [S5] This is an argument for intentional role choice, not a universal schedule for changing roles.

Our career exercise compares the actual weekly work of two available roles. List the responsibilities, interruptions, learning needs and support each entails. Ask what the person wants to practise next and what commitments they would need to hand over. A prestigious title may conceal a job they do not want, while returning to hands-on work may require deliberate skill rebuilding. Return a conversation plan with concrete questions about scope, expectations and reversibility. Avoid telling someone to resign or move immediately on the strength of an essay. The method helps them evaluate the profession they would actually be entering.

## How she approaches a problem

The selected debugging and operations sources connect technical understanding with a working feedback relationship. Engineers need evidence they can interrogate, and the organisation must allow them to act on what they learn. [S2][S4] Our synthesis follows the user's symptom, preserves the relevant request context and ends with both an explanation and a responsibility for the remaining repair.

Imagine a support ticket says that one customer's upload fails. Begin with the task and the boundaries of the observed failure. Compare a failing request with a successful one using appropriate authorised data. Ask a question that distinguishes plausible explanations, then inspect the answer before choosing the next query. If the evidence points to a client-specific path, examine that path rather than announcing that the healthy global chart disproves a problem. If the necessary context was never captured, propose a limited instrumentation change and say what remains unknown about the current incident.

After the immediate repair, examine whether the same gap burdens the on-call person repeatedly. A technical fix without time, ownership or a usable handover can leave the operational pattern intact. Conversely, a rota change cannot explain a failure whose evidence has been discarded. The practical deliverable connects the request investigation to the improvement the responsible team can sustain.

## Where this is useful

Use this profile when a service is mostly healthy yet a subset of requests fails, when an incident investigation relies on one veteran's memory or when on-call repeatedly consumes the team's rest. It can help review whether telemetry answers real questions and whether an operational responsibility comes with the time and authority to improve the system.

The career application is particularly concrete: compare engineering and management as actual jobs, then prepare questions about attention, support and skill development. [S5] Another sensible transfer is to a volunteer service rota: record recurring interruptions, establish backup and reserve time to repair the cause. That analogy does not impose software on-call practices on every kind of community work; it transfers the reciprocal responsibility between doing the work and making the conditions workable.

## Their work and record

The official leadership record describes Majors's systems background and coauthored books. [S1] This profile reads her tool essay, her later metrics revision, actual interview answers and the pendulum essay. [S2][S3][S4][S5] Those five sources are the evidence base. The books themselves are not claimed as read, and event descriptions or podcast summaries are not substituted for interview answers.

The technical essays also have a commercial context: she writes as a vendor cofounder discussing the capabilities her company values. [S1][S2][S3] The applications here therefore ask about observable capabilities rather than repeating comparative product claims. They do not promise that a tool can answer every possible question regardless of instrumentation, access or retention.

## What can be criticised

Rich contextual telemetry has costs in collection, storage, interpretation and privacy. An instruction to preserve context can become careless overcollection if no one asks which information is necessary. Our correction is a field-by-field purpose and handling review tied to actual questions. The instrumentation should make an investigation possible without casually exposing secrets or retaining irrelevant personal material.

Strong contrasts between monitoring and observability can also obscure practical overlap. The later metrics essay supplies an explicit revision rather than allowing the earlier rhetoric to stand alone. [S3] Our capability map keeps the question central and avoids inferring that a particular architecture or terminology is the only legitimate way to operate a small service.

## Blind spots to watch

Do not equate a correlation with the cause of an incident. Do not infer a request's entire history from an aggregate. Do not promise arbitrary exploration when the relevant evidence was never captured. Keep the query trail and its limits visible.

For on-call, distinguish responsibility from unlimited availability. Individual constraints matter, and a local burden review does not establish universal staffing or compensation rules. For career choices, examine the actual role and support rather than using a title as a proxy for progress. The useful output makes both technical and human commitments explicit.

## Short phrases on the record

- "The Engineer/Manager Pendulum" names the career essay. [S5]
- "So You Want To Build An Observability Tool" names the capabilities essay. [S2]

All scenarios in this profile are original applications of the cited methods.
