# Guided capture and feedback

The expert's current AI conducts the conversation. This module supplies a question queue, validates supplied evidence, and prepares reviewable changes. It does not call a model or observe other chats, screens or files.

## Interview

Start with one task, such as reviewing a product opportunity. Ask about a real case, the procedure, the decisive cue, a changed-fact counterexample, uncertainty, and critique of an unsatisfactory answer. Ask one question at a time using `nextCaptureQuestion`.

An interview answer is evidence. A proposed procedure or heuristic is an interpretation of that evidence. Keep those separate. Never ask for hidden chain of thought or claim to extract neural weights.

## Review work

Use `mode: "work-review"` after the expert directs or corrects real work. Capture the permitted output excerpt or artifact digest, the exact correction, its applicability, its exceptions, and a fresh test case. Organization-specific preferences should include that condition; one client's fact must not become a universal rule.

Artifact digests are references to supplied artifacts. This module does not fetch those artifacts or prove their contents. Captured text can contain private information: select and redact it before sending it to durable storage.

## Proposed learning

`proposeCaptureLearning(agent, session, proposal)` accepts:

```json
{
  "knowledge_changes": [{
    "replaces_id": null,
    "record": {
      "id": "independent-demand",
      "kind": "heuristic",
      "text": "Distinguish repeated tickets from independent customer demand.",
      "conditions": ["Comparing product requests"],
      "exceptions": ["A confirmed contractual dependency changes the priority."]
    }
  }],
  "rubric": [{"id": "evidence", "criterion": "Distinguish independent evidence from repeated requests.", "required": true}],
  "development_cases": [{
    "id": "changed-contract", "family_id": "demand-family", "kind": "counterfactual",
    "prompt": "Synthetic scenario: a confirmed contractual dependency changes the stakes. Explain what changes.",
    "check_ids": ["evidence"]
  }]
}
```

The example is synthetic. It is not evidence that an expert or agent performed well.

Use a new knowledge ID for a correction. Set `replaces_id` to the specific approved rule it replaces. A rejected correction leaves that rule active. Cases may reference criteria already on the agent or introduced in the proposal. They remain visible development cases with no execution or passing result.

The module validates structural references, limits and replacement targets. It does not determine whether a generalization is correct, whether an answer is truthful, or whether two rules contradict semantically. The expert reviews those questions. The host may revise a pending proposal before review; the preview digest changes with it.

## Exact review

1. Call `previewCaptureReview(agent, session, "accept")` or `"reject"`.
2. Show the proposed rules, conditions, exceptions, replacement targets, cases and candidate to the expert.
3. After their decision, call `reviewCaptureLearning` with that decision, `confirmed: true` and the exact `approved_preview_sha256`.
4. Acceptance returns a new parent-linked agent revision and a reviewed session. Rejection returns the original agent and a rejection record.

This is host-reported review. A confirmation field or hash does not independently establish that a particular human reviewed it. Neither decision certifies competence or publishes anything. Evaluation remains `NOT_RUN`.

Captures bind their starting agent digest. If the agent changes, begin a new capture and deliberately carry forward only the relevant evidence. A reviewed session cannot be edited or accepted again. Preserve the prior session for audit; there is no silent rebase.

`captureEvidence` returns stable source bytes excluding the proposal and review. The accepted source digest binds those bytes; it is not a correctness score. Hashes use the same sorted-key application serialization as `agentRecordDigest`, not a claim of RFC 8785 interoperability.

## Boundaries

Up to six interview answers or five work-review answers, 8,000 characters per answer, twelve knowledge changes per proposal, and the existing agent/source/case limits. A host may propose after collecting useful evidence without forcing every question; this does not mean capture is complete. Optional practice cases allow counterfactual, irrelevant-change, missing-evidence, scope and injection probes. Their execution, scoring and held-out evaluation are separate work.
