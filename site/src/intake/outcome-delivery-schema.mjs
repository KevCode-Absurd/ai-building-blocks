// JSON schemas shared by local and remote MCP preparation tools.
const text = (maxLength = 2000) => ({ type: 'string', minLength: 1, maxLength });
const identifier = { ...text(80), pattern: '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$' };
const list = (items, maxItems = 30, minItems = 0) => ({ type: 'array', items, maxItems, minItems });
const texts = list(text(), 30, 1), refs = list(identifier);
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
export const outcomeDeliverySchema = object({
  before: text(3000), after: text(3000), metric: text(), guardrails: texts,
  evidence_reviews: list(object({ source_id: identifier, status: { type: 'string', enum: ['CHECKED', 'LIMITED', 'UNRELIABLE'] }, checks: texts, limitation: text() }), 40),
  data_requests: list(object({ data_id: identifier, owner: text(300), route: { type: 'string', enum: ['MCP', 'CSV', 'FILE'] }, steps: texts, fields: texts, alternative: text() }), 40),
  recommendations: list(object({
    id: identifier, title: text(300), rank: { type: 'integer', minimum: 1, maximum: 30 }, finding_ids: refs, work_ids: { ...refs, minItems: 1 },
    reason: text(), expected_effect: text(), tradeoffs: text(),
    measurement: object({ metric: text(), comparison: text(), window: text(), decision_rule: text(), guardrails: texts, limitations: text() }),
    fallback: object({ when: text(), deliverable: text(), next_step: text() })
  }), 30, 1)
});
