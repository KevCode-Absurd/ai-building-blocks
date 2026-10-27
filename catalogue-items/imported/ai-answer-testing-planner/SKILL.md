---
name: llm-evaluation
description: "Master comprehensive evaluation strategies for LLM applications, from automated metrics to human evaluation and A/B testing."
risk: critical
source: community
date_added: "2026-02-27"
---

# LLM Evaluation

Master comprehensive evaluation strategies for LLM applications, from automated metrics to human evaluation and A/B testing.

## Do not use this skill when

- The task is unrelated to llm evaluation
- You need a different domain or tool outside this scope

## What to ask for first

1. What the AI feature does and who uses it (required).
2. What matters most: accuracy, tone, speed or safety (required; ask once if missing).
3. Example inputs with good answers (optional; if none, plan how to collect 5 to 20 and do not invent any).
4. Models or prompts to compare, and the budget for paid judge calls (optional; if no budget is given, mark judge steps as "needs a paid key").

If an input is missing after one question, write MISSING and carry on. Never make up test data, scores or results.

## Instructions

- Clarify goals, constraints, and required inputs.
- Apply relevant best practices and validate outcomes.
- Provide actionable steps and verification.
- Use the examples below; no separate implementation playbook is bundled.

## Output

Return a test plan in this order. Keep it to about one page, with no more than eight sections, one short paragraph or list each. Choose only the scores that fit the task.

1. **Scores to use**: the metric family for the task, and one line on why each fits.
2. **Test set**: how to collect 5 to 20 sample inputs with good answers, and what to leave out.
3. **Human review plan**: scales, who rates, how many answers, and the agreement check.
4. **AI judge set-up**: the judge prompt, the scale, and the step to check it against human ratings.
5. **Baseline and drop rule**: record today's scores, then flag a drop larger than a limit the user picks.
6. **A/B test plan**: only if the feature has live traffic.
7. **Costs and keys**: every step that needs a paid API key, a model download or Python.
8. **Next step**: run the baseline first, then change one thing at a time.

The code below shows patterns. It is not run for you in a chat, and it must be adapted before use.

## Use this skill when

- Measuring LLM application performance systematically
- Comparing different models or prompts
- Detecting performance regressions before deployment
- Validating improvements from prompt changes
- Building confidence in production systems
- Establishing baselines and tracking progress over time
- Debugging unexpected model behavior

## Core Evaluation Types

### 1. Automated Metrics
Fast, repeatable, scalable evaluation using computed scores.

**Text Generation:**
- **BLEU**: N-gram overlap (translation)
- **ROUGE**: Recall-oriented (summarization)
- **METEOR**: Semantic similarity
- **BERTScore**: Embedding-based similarity
- **Perplexity**: Language model confidence

**Classification:**
- **Accuracy**: Percentage correct
- **Precision/Recall/F1**: Class-specific performance
- **Confusion Matrix**: Error patterns
- **AUC-ROC**: Ranking quality

**Retrieval (RAG):**
- **MRR**: Mean Reciprocal Rank
- **NDCG**: Normalized Discounted Cumulative Gain
- **Precision@K**: Relevant in top K
- **Recall@K**: Coverage in top K

### 2. Human Evaluation
Manual assessment for quality aspects difficult to automate.

**Dimensions:**
- **Accuracy**: Factual correctness
- **Coherence**: Logical flow
- **Relevance**: Answers the question
- **Fluency**: Natural language quality
- **Safety**: No harmful content
- **Helpfulness**: Useful to the user

### 3. LLM-as-Judge
Use stronger LLMs to evaluate weaker model outputs.

**Approaches:**
- **Pointwise**: Score individual responses
- **Pairwise**: Compare two responses
- **Reference-based**: Compare to gold standard
- **Reference-free**: Judge without ground truth

## Quick Start

> **AI Blocks note:** the code in this file is a pattern to adapt, not code that runs as written. Names such as `llm_eval`, `check_groundedness` and `call_judge_model` are placeholders that you or a developer must write. In a plain chat, the output is a plan and needs no code.

```python
from llm_eval import EvaluationSuite, Metric

# Define evaluation suite
suite = EvaluationSuite([
    Metric.accuracy(),
    Metric.bleu(),
    Metric.bertscore(),
    Metric.custom(name="groundedness", fn=check_groundedness)
])

# Prepare test cases
test_cases = [
    {
        "input": "What is the capital of France?",
        "expected": "Paris",
        "context": "France is a country in Europe. Paris is its capital."
    },
    # ... more test cases
]

# Run evaluation
results = suite.evaluate(
    model=your_model,
    test_cases=test_cases
)

print(f"Overall Accuracy: {results.metrics['accuracy']}")
print(f"BLEU Score: {results.metrics['bleu']}")
```

## Automated Metrics Implementation

### BLEU Score
```python
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

def calculate_bleu(reference, hypothesis):
    """Calculate BLEU score between reference and hypothesis."""
    smoothie = SmoothingFunction().method4

    return sentence_bleu(
        [reference.split()],
        hypothesis.split(),
        smoothing_function=smoothie
    )

# Usage
bleu = calculate_bleu(
    reference="The cat sat on the mat",
    hypothesis="A cat is sitting on the mat"
)
```

### ROUGE Score
```python
from rouge_score import rouge_scorer

def calculate_rouge(reference, hypothesis):
    """Calculate ROUGE scores."""
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    scores = scorer.score(reference, hypothesis)

    return {
        'rouge1': scores['rouge1'].fmeasure,
        'rouge2': scores['rouge2'].fmeasure,
        'rougeL': scores['rougeL'].fmeasure
    }
```

### BERTScore
```python
from bert_score import score

def calculate_bertscore(references, hypotheses):
    """Calculate BERTScore using pre-trained BERT."""
    P, R, F1 = score(
        hypotheses,
        references,
        lang='en',
        model_type='microsoft/deberta-xlarge-mnli'
    )

    return {
        'precision': P.mean().item(),
        'recall': R.mean().item(),
        'f1': F1.mean().item()
    }
```

### Custom Metrics
```python
def calculate_groundedness(response, context):
    """Check if response is grounded in provided context."""
    # Use NLI model to check entailment
    from transformers import pipeline

    nli = pipeline("text-classification", model="microsoft/deberta-large-mnli")

    result = nli(f"{context} [SEP] {response}")[0]

    # Return confidence that response is entailed by context
    return result['score'] if result['label'] == 'ENTAILMENT' else 0.0

def calculate_toxicity(text):
    """Measure toxicity in generated text."""
    from detoxify import Detoxify

    results = Detoxify('original').predict(text)
    return max(results.values())  # Return highest toxicity score

def calculate_factuality(claim, knowledge_base):
    """Verify factual claims against knowledge base."""
    # Not built. Depends on your knowledge base: retrieval plus NLI, or a fact-checking API.
    # Until you build it, skip this metric and rely on human review for factual accuracy.
    raise NotImplementedError("A verified fact-checking adapter is required")
```

## LLM-as-Judge Patterns

### Single Output Evaluation
```python
def llm_judge_quality(response, question):
    """Use a stronger model to judge response quality. Needs a paid key."""
    prompt = f"""Rate the following response on a scale of 1-10 for:
1. Accuracy (factually correct)
2. Helpfulness (answers the question)
3. Clarity (well-written and understandable)

Question: {question}
Response: {response}

Provide ratings in JSON format:
{{
  "accuracy": <1-10>,
  "helpfulness": <1-10>,
  "clarity": <1-10>,
  "reasoning": "<brief explanation>"
}}
"""

    # call_judge_model is yours to write: one call to the judge model you chose,
    # using your provider's current SDK, with temperature 0. Needs a paid API key.
    reply = call_judge_model(prompt)

    return json.loads(reply)
```

### Pairwise Comparison
```python
def compare_responses(question, response_a, response_b):
    """Compare two responses using LLM judge."""
    prompt = f"""Compare these two responses to the question and determine which is better.

Question: {question}

Response A: {response_a}

Response B: {response_b}

Which response is better and why? Consider accuracy, helpfulness, and clarity.

Answer with JSON:
{{
  "winner": "A" or "B" or "tie",
  "reasoning": "<explanation>",
  "confidence": <1-10>
}}
"""

    # call_judge_model is yours to write: one call to the judge model you chose,
    # using your provider's current SDK, with temperature 0. Needs a paid API key.
    reply = call_judge_model(prompt)

    return json.loads(reply)
```

## Human Evaluation Frameworks

### Annotation Guidelines
```python
class AnnotationTask:
    """Structure for human annotation task."""

    def __init__(self, response, question, context=None):
        self.response = response
        self.question = question
        self.context = context

    def get_annotation_form(self):
        return {
            "question": self.question,
            "context": self.context,
            "response": self.response,
            "ratings": {
                "accuracy": {
                    "scale": "1-5",
                    "description": "Is the response factually correct?"
                },
                "relevance": {
                    "scale": "1-5",
                    "description": "Does it answer the question?"
                },
                "coherence": {
                    "scale": "1-5",
                    "description": "Is it logically consistent?"
                }
            },
            "issues": {
                "factual_error": False,
                "hallucination": False,
                "off_topic": False,
                "unsafe_content": False
            },
            "feedback": ""
        }
```

### Inter-Rater Agreement
```python
from sklearn.metrics import cohen_kappa_score

def calculate_agreement(rater1_scores, rater2_scores):
    """Calculate inter-rater agreement."""
    kappa = cohen_kappa_score(rater1_scores, rater2_scores)

    # Ordered ranges: Boolean dictionary keys overwrite each other.
    interpretation = "Undefined"
    for upper, label in [(0, "Poor"), (0.2, "Slight"), (0.4, "Fair"),
                         (0.6, "Moderate"), (0.8, "Substantial"),
                         (float("inf"), "Almost Perfect")]:
        if kappa < upper:
            interpretation = label
            break

    return {
        "kappa": kappa,
        "interpretation": interpretation
    }
```

## A/B Testing

### Statistical Testing Framework
```python
from scipy import stats
import numpy as np

class ABTest:
    def __init__(self, variant_a_name="A", variant_b_name="B"):
        self.variant_a = {"name": variant_a_name, "scores": []}
        self.variant_b = {"name": variant_b_name, "scores": []}

    def add_result(self, variant, score):
        """Add evaluation result for a variant."""
        if variant == "A":
            self.variant_a["scores"].append(score)
        else:
            self.variant_b["scores"].append(score)

    def analyze(self, alpha=0.05):
        """Perform statistical analysis."""
        a_scores = self.variant_a["scores"]
        b_scores = self.variant_b["scores"]

        if len(a_scores) < 2 or len(b_scores) < 2:
            raise ValueError("At least two observations per independent group are required")
        if not np.all(np.isfinite(a_scores)) or not np.all(np.isfinite(b_scores)):
            raise ValueError("Require finite observations")
        # Illustrative independent-group analysis; use a paired design for matched tasks.
        # T-test
        t_stat, p_value = stats.ttest_ind(a_scores, b_scores)

        # Effect size (Cohen's d)
        pooled_std = np.sqrt((np.std(a_scores)**2 + np.std(b_scores)**2) / 2)
        cohens_d = (np.mean(b_scores) - np.mean(a_scores)) / pooled_std if pooled_std > 0 else None

        return {
            "variant_a_mean": np.mean(a_scores),
            "variant_b_mean": np.mean(b_scores),
            "difference": np.mean(b_scores) - np.mean(a_scores),
            "relative_improvement": ((np.mean(b_scores) - np.mean(a_scores)) / np.mean(a_scores)
                                     if np.mean(a_scores) != 0 else None),
            "p_value": p_value,
            "statistically_significant": p_value < alpha,
            "cohens_d": cohens_d,
            "effect_size": self.interpret_cohens_d(cohens_d) if cohens_d is not None else "undefined",
            "winner": (("B" if np.mean(b_scores) > np.mean(a_scores) else "A")
                       if np.isfinite(p_value) and p_value < alpha and np.mean(b_scores) != np.mean(a_scores)
                       else "inconclusive")
        }

    @staticmethod
    def interpret_cohens_d(d):
        """Interpret Cohen's d effect size."""
        abs_d = abs(d)
        if abs_d < 0.2:
            return "negligible"
        elif abs_d < 0.5:
            return "small"
        elif abs_d < 0.8:
            return "medium"
        else:
            return "large"
```

## Regression Testing

### Regression Detection
```python
class RegressionDetector:
    def __init__(self, baseline_results, threshold=0.05, directions=None):
        import math
        if not baseline_results or not math.isfinite(threshold) or threshold < 0:
            raise ValueError("Require baseline metrics and a finite nonnegative threshold")
        self.baseline = baseline_results
        self.threshold = threshold
        self.directions = directions or {}

    def check_for_regression(self, new_results):
        """Detect if new results show regression."""
        import math
        regressions = []
        missing_metrics = []

        for metric in self.baseline.keys():
            baseline_score = self.baseline[metric]
            new_score = new_results.get(metric)

            if new_score is None:
                missing_metrics.append(metric)
                continue
            if not math.isfinite(baseline_score) or not math.isfinite(new_score):
                raise ValueError("Metrics must be finite")

            # Calculate relative change
            if baseline_score <= 0:
                raise ValueError("Relative regression requires a positive nonzero baseline; use an absolute threshold instead.")
            relative_change = (new_score - baseline_score) / baseline_score

            # Default is higher-is-better; explicitly mark latency/cost as lower.
            direction = self.directions.get(metric, "higher")
            if direction not in {"higher", "lower"}:
                raise ValueError("Unknown metric direction")
            is_regression = (relative_change < -self.threshold if direction == "higher"
                             else relative_change > self.threshold)
            if is_regression:
                regressions.append({
                    "metric": metric,
                    "baseline": baseline_score,
                    "current": new_score,
                    "change": relative_change
                })

        return {
            "has_regression": True if regressions else (None if missing_metrics else False),
            "analysis_complete": not missing_metrics,
            "missing_metrics": missing_metrics,
            "regressions": regressions
        }
```

## Benchmarking

Read [the local benchmark example](references/benchmarking.md) for a bounded runner, adapter prerequisites and incomplete-data handling.

## Local Resources and execution boundaries

The local benchmark reference contains an illustrative runner, not an installed evaluation framework or dataset. Code below illustrates patterns that must be adapted to the project's actual dependencies and validated before use; the `llm_eval` interface is pseudocode, not a promised installed package. Inspect existing SDK versions instead of copying legacy provider calls unchanged.

Use sanitized, representative data and an explicit evaluation budget. Model downloads, hosted inference, paid judge calls and telemetry exports require authorization for the data and cost. Prefer already cached models; do not treat a prompt as a security boundary against instructions embedded in evaluated outputs. Calibrate judge scores against a human-labeled sample and inspect errors, bias and disagreement. Overlap scores do not prove correctness, safety or production readiness.

## Best Practices

1. **Multiple Metrics**: Use diverse metrics for comprehensive view
2. **Representative Data**: Test on real-world, diverse examples
3. **Baselines**: Always compare against baseline performance
4. **Statistical Rigor**: Use proper statistical tests for comparisons
5. **Continuous Evaluation**: Integrate into CI/CD pipeline
6. **Human Validation**: Combine automated metrics with human judgment
7. **Error Analysis**: Investigate failures to understand weaknesses
8. **Version Control**: Track evaluation results over time

## Common Pitfalls

- **Single Metric Obsession**: Optimizing for one metric at the expense of others
- **Small Sample Size**: Drawing conclusions from too few examples
- **Data Contamination**: Testing on training data
- **Ignoring Variance**: Not accounting for statistical uncertainty
- **Metric Mismatch**: Using metrics not aligned with business goals

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
