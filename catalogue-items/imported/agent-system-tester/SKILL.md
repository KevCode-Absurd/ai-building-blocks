---
name: evaluation
description: "Build evaluation frameworks for agent systems. Use when testing agent performance systematically, validating context engineering choices, or measuring improvements over time."
risk: safe
source: "https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/evaluation"
date_added: "2026-02-27"
---

## When to Use This Skill

Build evaluation frameworks for agent systems

Use this skill when working with build evaluation frameworks for agent systems.

If you already have a scoring guide for judging the agent's answers, give it as a document and use it as the rubric.
# Evaluation Methods for Agent Systems

Evaluation of agent systems requires different approaches than traditional software or even standard language model applications. Agents make dynamic decisions, are non-deterministic between runs, and often lack single correct answers. Effective evaluation must account for these characteristics while providing actionable feedback. A robust evaluation framework enables continuous improvement, catches regressions, and validates that context engineering choices achieve intended effects.

## When to Use
Activate this skill when:
- Testing agent performance systematically
- Validating context engineering choices
- Measuring improvements over time
- Catching regressions before deployment
- Building quality gates for agent pipelines
- Comparing different agent configurations
- Evaluating production systems continuously

## Core Concepts

Agent evaluation requires outcome-focused approaches that account for non-determinism and multiple valid paths. Multi-dimensional rubrics capture various quality aspects: factual accuracy, completeness, citation accuracy, source quality, and tool efficiency. LLM-as-judge provides scalable evaluation while human evaluation catches edge cases.

The key insight is that agents may find alternative paths to goals—the evaluation should judge whether they achieve right outcomes while following reasonable processes.

**Performance Drivers: Tokens, Tool Calls and Model**
> **AI Blocks note:** the original author quotes variance percentages from the BrowseComp research and a claim that model upgrades beat extra tokens. No source link is given, so we have removed the figures and the claim. The general point is a starting idea, not a measured fact. Tell the user to measure token use, tool calls and model choice on their own agent.

The original author says three factors drive most of the difference in how well a browsing agent scores: how many tokens it uses, how many tool calls it makes, and which model it runs on. Token use is the biggest of the three.

What this means for evaluation design:
- **Token budgets matter**: Evaluate agents with realistic token budgets, not unlimited resources
- **Measure before you choose**: Compare a model change against a bigger token budget on your own agent. Do not assume either one wins
- **Multi-agent set-ups**: Splitting work across agents with separate context windows is one design to test, not a proven winner

## Detailed Topics

### Evaluation Challenges

**Non-Determinism and Multiple Valid Paths**
Agents may take completely different valid paths to reach goals. One agent might search three sources while another searches ten. They might use different tools to find the same answer. Traditional evaluations that check for specific steps fail in this context.

The solution is outcome-focused evaluation that judges whether agents achieve right outcomes while following reasonable processes.

**Context-Dependent Failures**
Agent failures often depend on context in subtle ways. An agent might succeed on simple queries but fail on complex ones. It might work well with one tool set but fail with another. Failures may emerge only after extended interaction when context accumulates.

Evaluation must cover a range of complexity levels and test extended interactions, not just isolated queries.

**Composite Quality Dimensions**
Agent quality is not a single dimension. It includes factual accuracy, completeness, coherence, tool efficiency, and process quality. An agent might score high on accuracy but low in efficiency, or vice versa.

Evaluation rubrics must capture multiple dimensions with appropriate weighting for the use case.

### Evaluation Rubric Design

**Multi-Dimensional Rubric**
Effective rubrics cover key dimensions with descriptive levels:

Factual accuracy: Claims match ground truth (excellent to failed)

Completeness: Output covers requested aspects (excellent to failed)

Citation accuracy: Citations match claimed sources (excellent to failed)

Source quality: Uses appropriate primary sources (excellent to failed)

Tool efficiency: Uses right tools reasonable number of times (excellent to failed)

**Rubric Scoring**
Convert dimension assessments to numeric scores (0.0 to 1.0) with appropriate weighting. Calculate weighted overall scores. Determine passing threshold based on use case requirements.

### Evaluation Methodologies

**LLM-as-Judge**
LLM-based evaluation scales to large test sets and provides consistent judgments. The key is designing effective evaluation prompts that capture the dimensions of interest.

Provide clear task description, agent output, ground truth (if available), evaluation scale with level descriptions, and request structured judgment.

**Human Evaluation**
Human evaluation catches what automation misses. Humans notice hallucinated answers on unusual queries, system failures, and subtle biases that automated evaluation misses.

Effective human evaluation covers edge cases, samples systematically, tracks patterns, and provides contextual understanding.

**End-State Evaluation**
For agents that mutate persistent state, end-state evaluation focuses on whether the final state matches expectations rather than how the agent got there.

### Test Set Design

**Sample Selection**
Start with small samples during development. Early in agent development, changes have dramatic impacts because there is abundant low-hanging fruit. Small test sets reveal large effects.

Sample from real usage patterns. Add known edge cases. Ensure coverage across complexity levels.

**Complexity Stratification**
Test sets should span complexity levels: simple (single tool call), medium (multiple tool calls), complex (many tool calls, significant ambiguity), and very complex (extended interaction, deep reasoning).

### Context Engineering Evaluation

**Testing Context Strategies**
Context engineering choices should be validated through systematic evaluation. Run agents with different context strategies on the same test set. Compare quality scores, token usage, and efficiency metrics.

**Degradation Testing**
Test how context degradation affects performance by running agents at different context sizes. Identify performance cliffs where context becomes problematic. Establish safe operating limits.

### Continuous Evaluation

**Evaluation Pipeline**
Build evaluation pipelines that run automatically on agent changes. Track results over time. Compare versions to identify improvements or regressions.

**Monitoring Production**
Track evaluation metrics in production by sampling interactions and evaluating randomly. Set alerts for quality drops. Maintain dashboards for trend analysis.

## Practical Guidance

### Building Evaluation Frameworks

1. Define quality dimensions relevant to your use case
2. Create rubrics with clear, actionable level descriptions
3. Build test sets from real usage patterns and edge cases
4. Implement automated evaluation pipelines
5. Establish baseline metrics before making changes
6. Run evaluations on all significant changes
7. Track metrics over time for trend analysis
8. Supplement automated evaluation with human review

### Avoiding Evaluation Pitfalls

Overfitting to specific paths: Evaluate outcomes, not specific steps.
Ignoring edge cases: Include diverse test scenarios.
Single-metric obsession: Use multi-dimensional rubrics.
Neglecting context effects: Test with realistic context sizes.
Skipping human evaluation: Automated evaluation misses subtle issues.

## Examples

**Example 1: Simple Evaluation** (illustrative sketch only: `load_rubric`, `assess_dimension` and `weighted_average` are not defined here. They stand for a rubric loader, a judge that scores one dimension, and a weighted average. The 0.7 pass mark is only an example.)
```python
def evaluate_agent_response(response, expected):
    rubric = load_rubric()
    scores = {}
    for dimension, config in rubric.items():
        scores[dimension] = assess_dimension(response, expected, dimension)
    overall = weighted_average(scores, config["weights"])
    return {"passed": overall >= 0.7, "scores": scores}
```

**Example 2: Test Set Structure**

Test sets should span multiple complexity levels to ensure comprehensive evaluation:

```python
test_set = [
    {
        "name": "simple_lookup",
        "input": "What is the capital of France?",
        "expected": {"type": "fact", "answer": "Paris"},
        "complexity": "simple",
        "description": "Single tool call, factual lookup"
    },
    {
        "name": "medium_query",
        "input": "Compare the revenue of Apple and Microsoft last quarter",
        "complexity": "medium",
        "description": "Multiple tool calls, comparison logic"
    },
    {
        "name": "multi_step_reasoning",
        "input": "Analyze sales data from Q1-Q4 and create a summary report with trends",
        "complexity": "complex",
        "description": "Many tool calls, aggregation, analysis"
    },
    {
        "name": "research_synthesis",
        "input": "Research emerging AI technologies, evaluate their potential impact, and recommend adoption strategy",
        "complexity": "very_complex",
        "description": "Extended interaction, deep reasoning, synthesis"
    }
]
```

## Guidelines

1. Use multi-dimensional rubrics, not single metrics
2. Evaluate outcomes, not specific execution paths
3. Cover complexity levels from simple to complex
4. Test with realistic context sizes and histories
5. Run evaluations continuously, not just before release
6. Supplement LLM evaluation with human review
7. Track metrics over time for trend detection
8. Set clear pass/fail thresholds based on use case

## Integration

This skill connects to all other skills as a cross-cutting concern:

- context-fundamentals - Evaluating context usage
- context-degradation - Detecting degradation
- context-optimization - Measuring optimization effectiveness
- multi-agent-patterns - Evaluating coordination
- tool-design - Evaluating tool effectiveness
- memory-systems - Evaluating memory quality

## References

Internal reference:
- Metrics Reference - Detailed evaluation metrics and implementation

### References

Internal skills:
- All other skills connect to evaluation for quality measurement

External resources:
- LLM evaluation benchmarks
- Agent evaluation research papers
- Production monitoring practices

---

## Skill Metadata

**Created**: 2025-12-20
**Last Updated**: 2025-12-20
**Author**: Agent Skills for Context Engineering Contributors
**Version**: 1.0.0

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
