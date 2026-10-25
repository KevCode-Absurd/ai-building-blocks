

The daily 6 AM job that grades agents' past recommendations against actual outcomes. Math-first scoring with LLM explanation. Pattern detection across 8+ instances.Reflection Prompt PackThe prompts the self-reflection runner uses to explain graded outcomes and generate lessons. Edit per agent. Each prompt assumes the scoring math has already been done; the LLM only explains, never grades.Prompt 1: Correction Lesson (accuracy under 50%)Purpose: Turn repeated failures into a clear rule the agent can apply next time.You are generating a correction lesson for an AI agent based on its past
recommendations. The scoring is already done. You are not grading. You are
turning the pattern into a rule the agent can apply next time.

Agent: {{agent_id}}
Recommendation type: {{recommendation_type}}
Instances graded: {{instance_count}}
Accuracy: {{accuracy_pct}}% (threshold for correction: below 50%)

Recent outcomes:
{{outcome_summary}}

Most common failure mode (from classifications): {{failure_pattern}}

Write a single-paragraph correction lesson. Under 60 words. Actionable.

Format:
  - Start with the rule in imperative voice ("Stop X" or "Raise Y threshold").
  - Follow with one sentence of reasoning grounded in the data above.
  - End with the condition under which the rule does NOT apply, if relevant.

Do not use em dashes. Do not hedge ("maybe", "perhaps", "might"). State the rule.
Do not reference the accuracy number explicitly. The lesson should stand alone.Prompt 2: Reinforcement Lesson (accuracy over 85%)Purpose: Preserve what’s working and make it repeatable.You are generating a reinforcement lesson for an AI agent. Its recommendations
in this category are consistently accurate. Tell it to keep doing what works
and why, so the pattern is preserved if the agent's prompt or model changes.

Agent: {{agent_id}}
Recommendation type: {{recommendation_type}}
Instances graded: {{instance_count}}
Accuracy: {{accuracy_pct}}%

Recent outcomes:
{{outcome_summary}}

What signals preceded the correct calls: {{signal_summary}}

Write a single-paragraph reinforcement lesson. Under 60 words. Imperative voice.

Format:
  - Start with "When evaluating {{recommendation_type}}" or similar.
  - Name the specific signals that reliably lead to correct calls.
  - End with the confidence phrase the agent should use when these signals are present.

No em dashes. No hedging. State the pattern.Prompt 3: Threshold Adjustment LessonPurpose: Tune monitoring thresholds to reduce false positives or missed signals.You are adjusting a threshold that the agent uses inside its monitoring checks.
Outcomes show the current threshold is generating false positives or missing
real signals.

Agent: {{agent_id}}
Metric: {{metric}}
Current threshold: {{current_threshold}}
Suggested direction: {{adjustment_direction}} (tighten / loosen)

Outcomes when the threshold fired:
{{fire_outcomes}}

Outcomes when the threshold should have fired but did not:
{{miss_outcomes}}

Write a single-paragraph lesson that specifies:
  - The metric and current threshold
  - The adjustment (tighter, looser, or conditional)
  - The reason based on the outcomes

Under 60 words. No em dashes.Prompt 4: Cross-Agent Pattern LessonPurpose: Fix shared mistakes across multiple agents.Multiple agents show the same accuracy problem for a shared recommendation
type. The lesson applies to all of them.

Involved agents: {{agent_list}}
Recommendation type: {{recommendation_type}}
Combined instances: {{total_instances}}
Per-agent accuracy: {{per_agent_accuracy}}

Sample outcomes:
{{outcome_summary}}

Write a single-paragraph shared lesson under 70 words.

Format:
  - Start with "Across agents," and state the rule.
  - Reference the shared evaluation criterion that is failing (not per-agent quirks).
  - End with the correction all listed agents should apply.

No em dashes. Imperative voice.Prompt 5: Lesson Validation Check (weekly)Purpose: Verify if existing lessons still hold true over time.Evaluate whether an existing lesson is still accurate based on recent outcomes.

Lesson:
"{{lesson_text}}"

Created: {{created_at}}
Maturity: {{maturity}}
Agent: {{agent_id}}

Last 30 days of outcomes for this recommendation type:
{{recent_outcomes}}

Answer in this format:
  STATUS: validated | unchanged | contradicted
  REASON: one sentence
  SUGGESTED_MATURITY: draft | validated | trusted | archived

If contradicted, explain what the new pattern shows that contradicts the lesson.
No em dashes.Placeholder Conventions- {{outcome_summary}} → Bulleted list of 5–10 recent outcomes with score, classification, and actual change - {{failure_pattern}} → One sentence naming the most common error mode - {{signal_summary}} → Comma-separated signals that preceded correct calls - {{per_agent_accuracy}} → Table of agent ID and accuracyTuning Guidelines- If lessons are too generic → add more detail to {{outcome_summary}} - If lessons are too specific (overfitting) → reduce sample size and add instruction:“Do not reference specific clients”
