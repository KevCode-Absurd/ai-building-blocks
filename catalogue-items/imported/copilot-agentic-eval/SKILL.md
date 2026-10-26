---
name: agentic-eval
description: |
  Patterns and techniques for evaluating and improving AI agent outputs. Use this skill when:
  - Implementing self-critique and reflection loops
  - Building evaluator-optimizer pipelines for quality-critical generation
  - Creating test-driven code refinement workflows
  - Designing rubric-based or LLM-as-judge evaluation systems
  - Adding iterative improvement to agent outputs (code, reports, analysis)
  - Measuring and improving agent response quality
---

# Agentic Evaluation Patterns

Patterns for self-improvement through iterative evaluation and refinement.

## Overview

Evaluation patterns enable agents to assess and improve their own outputs, moving beyond single-shot generation to iterative refinement loops.

```
Generate → Evaluate → Critique → Refine → Output
    ↑                              │
    └──────────────────────────────┘
```

## When to Use

- **Quality-critical generation**: Code, reports, analysis requiring high accuracy
- **Tasks with clear evaluation criteria**: Defined success metrics exist
- **Content requiring specific standards**: Style guides, compliance, formatting

## When Not to Use

- A one-off answer you will read yourself: just ask for a fix.
- No clear way to say what "good" means: write that first, then come back.
- You want to improve the agent's prompts and skills over many runs: use the Agent self-improvement loop builder.
- You want a test plan with pass marks before you ship an agent: use the Agent system tester.

## What You Give It

Ask once for any that are missing. If one is still missing, write MISSING and say what it changes. Never invent criteria or sample outputs.

1. The task the agent does, in the exact words it is given today.
2. What a good answer must do (the success criteria), in plain sentences.
3. One good example answer and one bad one (optional, but they sharpen the rubric).
4. How the person will run it: pasting into a chat by hand, or in code (and the language) (optional).

## Steps

1. **Turn the criteria into a rubric.** Keep 3 to 5 dimensions. Give each a weight and a clear pass line a person could check.
2. **Pick the pattern.** Basic reflection for one answer, evaluator and optimizer when judging should be separate, code reflection when tests can run, LLM-as-judge when comparing two answers.
3. **Write the critique prompt.** It must return one line per rubric item: PASS or FAIL, plus one sentence of feedback.
4. **Write the refine prompt.** It must fix only the failed items and keep everything that passed.
5. **Set the stop rules.** Maximum 3 rounds (up to 5 at most), stop when everything passes, and stop early if a round does not improve the score.
6. **Rewrite the agent's task prompt** so the rubric is part of it from the start.
7. **Say how to run it.** In a chat: paste the task, then the critique prompt, then the refine prompt, and repeat. In code: use the matching pattern below.

## Output

Return these in order.

1. **Rewritten task prompt**: the agent's task with the success criteria built in.
2. **Rubric table**: `<dimension>` | `<weight>` | `<pass line>` | `<feedback field>`.
3. **Critique prompt**: ready to paste.
4. **Refine prompt**: ready to paste.
5. **Stop rules**: maximum rounds, pass threshold, and the no-progress rule.
6. **How to run it**: chat steps, or the code pattern chosen with its placeholders explained.
7. **Gaps and next steps**: every MISSING input, and a reminder to try the loop on three real tasks and read the results before you trust it.

## Notes on the Code

- `llm(...)` stands for whatever function sends a prompt to your AI and returns text. You supply it. `run_tests(...)` stands for your own test runner. The patterns will not run until you supply both.
- Models sometimes return text that is not valid JSON. Wrap `json.loads` in a try block. If parsing fails, ask once more for JSON only, then stop and show the raw reply instead of guessing.
- A model grading its own work tends to be easy on itself. For important work, have a person or a second model check a sample.
- Each round adds at least two AI calls, one to judge and one to fix, so a loop costs more than a single answer.

---

## Pattern 1: Basic Reflection

Agent evaluates and improves its own output through self-critique.

```python
import json

def reflect_and_refine(task: str, criteria: list[str], max_iterations: int = 3) -> str:
    """Generate with reflection loop."""
    output = llm(f"Complete this task:\n{task}")
    
    for i in range(max_iterations):
        # Self-critique
        critique = llm(f"""
        Evaluate this output against criteria: {criteria}
        Output: {output}
        Rate each: PASS/FAIL with feedback as JSON.
        """)
        
        critique_data = json.loads(critique)
        all_pass = all(c["status"] == "PASS" for c in critique_data.values())
        if all_pass:
            return output
        
        # Refine based on critique
        failed = {k: v["feedback"] for k, v in critique_data.items() if v["status"] == "FAIL"}
        output = llm(f"Improve to address: {failed}\nOriginal: {output}")
    
    return output
```

**Key insight**: Use structured JSON output for reliable parsing of critique results.

---

## Pattern 2: Evaluator-Optimizer

Separate generation and evaluation into distinct components for clearer responsibilities.

```python
class EvaluatorOptimizer:
    def __init__(self, score_threshold: float = 0.8):
        self.score_threshold = score_threshold
    
    def generate(self, task: str) -> str:
        return llm(f"Complete: {task}")
    
    def evaluate(self, output: str, task: str) -> dict:
        return json.loads(llm(f"""
        Evaluate output for task: {task}
        Output: {output}
        Return JSON: {{"overall_score": 0-1, "dimensions": {{"accuracy": ..., "clarity": ...}}}}
        """))
    
    def optimize(self, output: str, feedback: dict) -> str:
        return llm(f"Improve based on feedback: {feedback}\nOutput: {output}")
    
    def run(self, task: str, max_iterations: int = 3) -> str:
        output = self.generate(task)
        for _ in range(max_iterations):
            evaluation = self.evaluate(output, task)
            if evaluation["overall_score"] >= self.score_threshold:
                break
            output = self.optimize(output, evaluation)
        return output
```

---

## Pattern 3: Code-Specific Reflection

Test-driven refinement loop for code generation.

```python
class CodeReflector:
    def reflect_and_fix(self, spec: str, max_iterations: int = 3) -> str:
        code = llm(f"Write Python code for: {spec}")
        tests = llm(f"Generate pytest tests for: {spec}\nCode: {code}")
        
        for _ in range(max_iterations):
            result = run_tests(code, tests)
            if result["success"]:
                return code
            code = llm(f"Fix error: {result['error']}\nCode: {code}")
        return code
```

---

## Evaluation Strategies

### Outcome-Based
Evaluate whether output achieves the expected result.

```python
def evaluate_outcome(task: str, output: str, expected: str) -> str:
    return llm(f"Does output achieve expected outcome? Task: {task}, Expected: {expected}, Output: {output}")
```

### LLM-as-Judge
Use LLM to compare and rank outputs.

```python
def llm_judge(output_a: str, output_b: str, criteria: str) -> str:
    return llm(f"Compare outputs A and B for {criteria}. Which is better and why?")
```

### Rubric-Based
Score outputs against weighted dimensions.

```python
RUBRIC = {
    "accuracy": {"weight": 0.4},
    "clarity": {"weight": 0.3},
    "completeness": {"weight": 0.3}
}

def evaluate_with_rubric(output: str, rubric: dict) -> float:
    scores = json.loads(llm(f"Rate 1-5 for each dimension: {list(rubric.keys())}\nOutput: {output}"))
    return sum(scores[d] * rubric[d]["weight"] for d in rubric) / 5
```

---

## Best Practices

| Practice | Rationale |
|----------|-----------|
| **Clear criteria** | Define specific, measurable evaluation criteria upfront |
| **Iteration limits** | Set max iterations (3-5) to prevent infinite loops |
| **Convergence check** | Stop if output score isn't improving between iterations |
| **Log history** | Keep full trajectory for debugging and analysis |
| **Structured output** | Use JSON for reliable parsing of evaluation results |

---

## Quick Start Checklist

```markdown
## Evaluation Implementation Checklist

### Setup
- [ ] Define evaluation criteria/rubric
- [ ] Set score threshold for "good enough"
- [ ] Configure max iterations (default: 3)

### Implementation
- [ ] Implement generate() function
- [ ] Implement evaluate() function with structured output
- [ ] Implement optimize() function
- [ ] Wire up the refinement loop

### Safety
- [ ] Add convergence detection
- [ ] Log all iterations for debugging
- [ ] Handle evaluation parse failures gracefully
```
