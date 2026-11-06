# Model grader rubric for an eval

**When to use:** Some test cases need judgement (tone, faithfulness to a source, whether an answer is complete) and you want a model to grade them consistently against a written rubric.

```text
You are writing a grading prompt that a second AI model will use to mark the output of our AI feature.

What the feature does: {{feature}}
The quality we are judging (one only): {{criterion}}
Three example outputs that pass and three that fail, with why: {{graded_examples}}
The model that produces the outputs (the grader must be a different one): {{model_under_test}}

Write:
1. A rubric with a pass rule and a fail rule in plain words, with the edge cases spelled out.
2. The grader prompt: role, the rubric, the input it receives (the original input, the source text if any, and the output to grade), and the output format: a JSON object with verdict ("pass" or "fail") and a one-sentence reason.
3. Instructions that the grader must judge only the stated criterion, must not reward length, and must return "fail" when unsure.
4. A calibration plan: run the grader on our six graded examples plus 20 cases a person has marked; report agreement, and list every case where the grader and the person disagree.
5. When to stop trusting the grader and go back to human review.

Prefer a pass or fail verdict over a 1 to 10 score. Keep one grader per criterion.
```
