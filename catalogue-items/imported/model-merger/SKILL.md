---
name: model-merging
description: Merge multiple fine-tuned models using mergekit to combine capabilities without retraining. Use when creating specialized models by blending domain-specific expertise (math + coding + chat), improving performance beyond single models, or experimenting rapidly with model variants. Covers SLERP, TIES-Merging, DARE, Task Arithmetic, linear merging, and production deployment strategies.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Emerging Techniques, Model Merging, Mergekit, SLERP, TIES, DARE, Task Arithmetic, Model Fusion, No Retraining, Multi-Capability, Arcee AI]
dependencies: [mergekit, transformers, torch]
---

# Model Merging: Combining Pre-trained Models

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **The AI model** (yours): the trained model file, such as a checkpoint or ONNX file.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the AI model. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use This Skill

Use Model Merging when you need to:
- **Combine capabilities** from multiple fine-tuned models without retraining
- **Create specialized models** by blending domain-specific expertise (math + coding + chat)
- **Improve performance** beyond single models on some benchmarks (test your own merge; gains vary)
- **Reduce training costs** - no GPUs needed, merges run on CPU
- **Experiment rapidly** - try new model variants much faster than training from scratch (time depends on model size and your hardware)
- **Preserve multiple skills** - merge without catastrophic forgetting

**Check licences first**: before you merge, confirm each parent model's licence allows merging and your intended use (some forbid commercial use or derivatives). Keep the parents' licence files with the merged model and name the parents in its model card.

**Success Stories**: many models on HuggingFace are made by merging. Check the model cards for their results.

**Tools**: mergekit (Arcee AI), LazyMergekit, Model Soup

## Installation

```bash
# Install mergekit
git clone https://github.com/arcee-ai/mergekit.git
cd mergekit
pip install -e .

# Or via pip
pip install mergekit

# Optional: Transformer library
pip install transformers torch
```

## Quick Start

### Simple Linear Merge

```yaml
# config.yml - Merge two models with equal weights
merge_method: linear
models:
  - model: mistralai/Mistral-7B-v0.1
    parameters:
      weight: 0.5
  - model: teknium/OpenHermes-2.5-Mistral-7B
    parameters:
      weight: 0.5
dtype: bfloat16
```

```bash
# Run merge
mergekit-yaml config.yml ./merged-model   # add --cuda if you have a GPU (optional; CPU works)

# Use merged model
python -c "from transformers import AutoModelForCausalLM; m = AutoModelForCausalLM.from_pretrained('./merged-model'); print(m.config.model_type)"
```

### SLERP Merge (Best for 2 Models)

```yaml
# config.yml - Spherical interpolation
merge_method: slerp
slices:
  - sources:
      - model: mistralai/Mistral-7B-v0.1
        layer_range: [0, 32]
      - model: teknium/OpenHermes-2.5-Mistral-7B
        layer_range: [0, 32]
parameters:
  t: 0.5  # Interpolation factor (0=model1, 1=model2)
dtype: bfloat16
```

## Core Concepts

### 1. Merge Methods

**Linear (Model Soup)**
- Simple weighted average of parameters
- Fast, works well for similar models
- Can merge 2+ models (`w1 + w2 + ... = 1`)

**SLERP (Spherical Linear Interpolation)**
- Interpolates along sphere in weight space
- Preserves magnitude of weight vectors
- Best for merging 2 models
- Smoother than linear

```python
# SLERP formula
merged = (sin((1-t)*θ) / sin(θ)) * model1 + (sin(t*θ) / sin(θ)) * model2
# where θ = arccos(dot(model1, model2))
# t ∈ [0, 1]
```

**Task Arithmetic**
- Extract "task vectors" (fine-tuned - base)
- Combine task vectors, add to base
- Good for merging multiple specialized models (`merged = base + α₁·tv₁ + α₂·tv₂`)

**TIES-Merging**
- Task arithmetic + sparsification
- Resolves sign conflicts in parameters
- Best for merging many task-specific models

**DARE (Drop And REscale)**
- Randomly drops fine-tuned parameters
- Rescales remaining parameters
- Reduces redundancy, maintains performance

### 2. Configuration Structure

```yaml
# Basic structure
merge_method: <method>  # linear, slerp, ties, dare_ties, task_arithmetic
base_model: <path>      # Optional: base model for task arithmetic

models:
  - model: <path/to/model1>
    parameters:
      weight: <float>   # Merge weight
      density: <float>  # For TIES/DARE

  - model: <path/to/model2>
    parameters:
      weight: <float>

parameters:
  # Method-specific parameters

dtype: <dtype>  # bfloat16, float16, float32

# Optional
slices:  # Layer-wise merging
tokenizer:  # Tokenizer configuration
```

## Merge Methods Guide

### Linear Merge

**Best for**: Simple model combinations, equal weighting

```yaml
merge_method: linear
models:
  - model: WizardLM/WizardMath-7B-V1.1
    parameters:
      weight: 0.4
  - model: teknium/OpenHermes-2.5-Mistral-7B
    parameters:
      weight: 0.3
  - model: NousResearch/Nous-Hermes-2-Mistral-7B-DPO
    parameters:
      weight: 0.3
dtype: bfloat16
```

### SLERP Merge

**Best for**: Two models, smooth interpolation

```yaml
merge_method: slerp
slices:
  - sources:
      - model: mistralai/Mistral-7B-v0.1
        layer_range: [0, 32]
      - model: teknium/OpenHermes-2.5-Mistral-7B
        layer_range: [0, 32]
parameters:
  t: 0.5  # 0.0 = first model, 1.0 = second model
dtype: bfloat16
```

**Layer-specific SLERP:**

```yaml
merge_method: slerp
slices:
  - sources:
      - model: model_a
        layer_range: [0, 32]
      - model: model_b
        layer_range: [0, 32]
parameters:
  t:
    - filter: self_attn    # Attention layers
      value: 0.3
    - filter: mlp          # MLP layers
      value: 0.7
    - value: 0.5           # Default for other layers
dtype: bfloat16
```

### Task Arithmetic

**Best for**: Combining specialized skills

```yaml
merge_method: task_arithmetic
base_model: mistralai/Mistral-7B-v0.1
models:
  - model: WizardLM/WizardMath-7B-V1.1  # Math
    parameters:
      weight: 0.5
  - model: teknium/OpenHermes-2.5-Mistral-7B  # Chat
    parameters:
      weight: 0.3
  - model: ajibawa-2023/Code-Mistral-7B  # Code
    parameters:
      weight: 0.2
dtype: bfloat16
```

### TIES-Merging

**Best for**: Many models, resolving conflicts

```yaml
merge_method: ties
base_model: mistralai/Mistral-7B-v0.1
models:
  - model: WizardLM/WizardMath-7B-V1.1
    parameters:
      density: 0.5  # Keep top 50% of parameters
      weight: 1.0
  - model: teknium/OpenHermes-2.5-Mistral-7B
    parameters:
      density: 0.5
      weight: 1.0
  - model: NousResearch/Nous-Hermes-2-Mistral-7B-DPO
    parameters:
      density: 0.5
      weight: 1.0
parameters:
  normalize: true
dtype: bfloat16
```

### DARE Merge

**Best for**: Reducing redundancy

```yaml
merge_method: dare_ties
base_model: mistralai/Mistral-7B-v0.1
models:
  - model: WizardLM/WizardMath-7B-V1.1
    parameters:
      density: 0.5    # Drop 50% of deltas
      weight: 0.6
  - model: teknium/OpenHermes-2.5-Mistral-7B
    parameters:
      density: 0.5
      weight: 0.4
parameters:
  int8_mask: true  # Use int8 for masks (saves memory)
dtype: bfloat16
```

## Advanced Patterns

### Layer-wise Merging

```yaml
# Different models for different layers
merge_method: passthrough
slices:
  - sources:
      - model: mistralai/Mistral-7B-v0.1
        layer_range: [0, 16]   # First half
  - sources:
      - model: teknium/OpenHermes-2.5-Mistral-7B
        layer_range: [16, 32]  # Second half
dtype: bfloat16
```

### MoE from Merged Models

```yaml
# Create Mixture of Experts
merge_method: moe
base_model: mistralai/Mistral-7B-v0.1
experts:
  - source_model: WizardLM/WizardMath-7B-V1.1
    positive_prompts:
      - "math"
      - "calculate"
  - source_model: teknium/OpenHermes-2.5-Mistral-7B
    positive_prompts:
      - "chat"
      - "conversation"
  - source_model: ajibawa-2023/Code-Mistral-7B
    positive_prompts:
      - "code"
      - "python"
dtype: bfloat16
```

### Tokenizer Merging

Unverified (note added by AI Blocks): check this `tokenizer` block against the current mergekit docs before you run it. Its keys have changed between mergekit versions.

```yaml
merge_method: linear
models:
  - model: mistralai/Mistral-7B-v0.1
  - model: custom/specialized-model

tokenizer:
  source: "union"  # Combine vocabularies from both models
  tokens:
    <|special_token|>:
      source: "custom/specialized-model"
```

## Best Practices

### 1. Model Compatibility

```python
# ✅ Good: Same architecture
models = [
    "mistralai/Mistral-7B-v0.1",
    "teknium/OpenHermes-2.5-Mistral-7B",  # Both Mistral 7B
]

# ❌ Bad: Different architectures
models = [
    "meta-llama/Llama-2-7b-hf",  # Llama
    "mistralai/Mistral-7B-v0.1",  # Mistral (incompatible!)
]
```

### 2. Weight Selection

```yaml
# Which rule applies depends on the method (note added by AI Blocks):
# - linear: weights are usually set to sum to 1.0 (mergekit normalises them by default)
# - task_arithmetic, ties, dare_ties: weights scale each task vector and need not sum to 1
# - slerp: uses t, not weights
# ✅ Good for linear: Weights sum to 1.0
models:
  - model: model_a
    parameters:
      weight: 0.6
  - model: model_b
    parameters:
      weight: 0.4  # 0.6 + 0.4 = 1.0

# ⚠️  Acceptable: Weights don't sum to 1 (for task arithmetic)
models:
  - model: model_a
    parameters:
      weight: 0.8
  - model: model_b
    parameters:
      weight: 0.8  # May boost performance
```

**Unsupervised Coefficient Tuning (no labeled data needed)**

Instead of manual search, use *generation consistency*: merge with several candidate coefficients, generate responses on a small unlabeled subset, and pick the coefficient whose outputs are most similar to those of its neighbors. Consistent outputs signal a stable, well-performing merge region (AdaMMS, arXiv:2503.23733).

```python
# Pseudocode — see references/coefficient-tuning.md for full implementation
candidates = [0.3, 0.4, 0.5, 0.6, 0.7]
for alpha in candidates:
    merged_paths[alpha] = merge_with_coefficient(alpha, model_a, model_b)
    responses[alpha]    = generate_responses(merged_paths[alpha], eval_prompts)

# Score each alpha by similarity to its neighbors (alpha ± 0.1)
best_alpha = max(candidates, key=lambda a: generation_consistency(a, responses))
```

See **[references/coefficient-tuning.md](references/coefficient-tuning.md)** for the full algorithm, similarity metrics, multi-coefficient search, and end-to-end pipeline.

### 3. Method Selection

```python
# Choose merge method based on use case:

# 2 models, smooth blend → SLERP
merge_method = "slerp"

# 3+ models, simple average → Linear
merge_method = "linear"

# Multiple task-specific models → Task Arithmetic or TIES
merge_method = "ties"

# Want to reduce redundancy → DARE
merge_method = "dare_ties"
```

### 4. Density Tuning (TIES/DARE)

```yaml
# Start conservative (keep more parameters)
parameters:
  density: 0.8  # Keep 80%

# If performance good, increase sparsity
parameters:
  density: 0.5  # Keep 50%

# If performance degrades, reduce sparsity
parameters:
  density: 0.9  # Keep 90%
```

### 5. Layer-specific Merging

Preserve the base model's first/last layers (often best left untouched) and merge only the middle via `merge_method: passthrough` with `slices` — see the [Layer-wise Merging](#layer-wise-merging) pattern above.

## Evaluation & Testing

### Benchmark Merged Models

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load merged model
model = AutoModelForCausalLM.from_pretrained("./merged-model")
tokenizer = AutoTokenizer.from_pretrained("./merged-model")

# Test on various tasks
test_prompts = {
    "math": "Calculate: 25 * 17 =",
    "code": "Write a Python function to reverse a string:",
    "chat": "What is the capital of France?",
}

for task, prompt in test_prompts.items():
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=100)
    print(f"{task}: {tokenizer.decode(outputs[0])}")
```

### Common Benchmarks

- **Open LLM Leaderboard**: General capabilities
- **MT-Bench**: Multi-turn conversation
- **MMLU**: Multitask accuracy
- **HumanEval**: Code generation
- **GSM8K**: Math reasoning

## Production Deployment

### Save and Upload

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load merged model
model = AutoModelForCausalLM.from_pretrained("./merged-model")
tokenizer = AutoTokenizer.from_pretrained("./merged-model")

# Upload to HuggingFace Hub
model.push_to_hub("username/my-merged-model")
tokenizer.push_to_hub("username/my-merged-model")
```

### Quantize Merged Model

The scripts for this step are not part of this item and are not part of mergekit. They come from other projects, so get them from the project's own page and check its current docs before you run anything:

```bash
# GGUF: use the convert and quantize tools from the llama.cpp project (https://github.com/ggml-org/llama.cpp)
python convert_hf_to_gguf.py ./merged-model --outtype f16 --outfile merged-model.gguf
./llama-quantize merged-model.gguf merged-model-q4.gguf Q4_K_M

# GPTQ: use a GPTQ library such as GPTQModel or AutoGPTQ. Follow that library's own quantize example.
```

## Common Pitfalls

- **Mismatched architectures** — only merge models that share the same architecture (e.g., don't mix Llama and Mistral).
- **Over-weighting one model** (e.g., `0.95 / 0.05`) — keep weights balanced, typically in the 0.3–0.7 range.
- **Skipping evaluation** — always benchmark a merged model before deploying (see the Evaluation & Testing section above).

## Resources

- **mergekit GitHub**: https://github.com/arcee-ai/mergekit
- **HuggingFace Tutorial**: https://huggingface.co/blog/mlabonne/merge-models
- **LazyMergekit**: Automated merging notebook
- **TIES Paper**: https://arxiv.org/abs/2306.01708
- **DARE Paper**: https://arxiv.org/abs/2311.03099

## See Also

- `references/methods.md` - Deep dive into merge algorithms
- `references/examples.md` - Real-world merge configurations
- `references/evaluation.md` - Benchmarking and testing strategies
- `references/coefficient-tuning.md` - Unsupervised coefficient search via generation consistency (AdaMMS, arXiv:2503.23733)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Language model benchmark runner](https://useaiblocks.com/skills/language-model-benchmark-runner). It takes the AI model.
- The [AWQ model compression planner](https://useaiblocks.com/skills/model-size-reducer). It takes the AI model.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
