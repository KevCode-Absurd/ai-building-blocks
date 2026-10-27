---
name: moe-training
description: Train Mixture of Experts (MoE) models using DeepSpeed or HuggingFace. Use when training large-scale models with limited compute, implementing sparse architectures like Mixtral 8x7B or DeepSeek-V3, or scaling model capacity without proportional compute increase. Covers MoE architectures, routing mechanisms, load balancing, expert parallelism, and inference optimization.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Emerging Techniques, MoE, Mixture Of Experts, Sparse Models, DeepSpeed, Expert Parallelism, Mixtral, DeepSeek, Routing, Load Balancing, Efficient Training]
dependencies: [deepspeed, transformers, torch, accelerate]
---

# MoE Training: Mixture of Experts

## When to Use This Skill

Use MoE Training when you need to:
- **Train larger models** with limited compute (check the savings on your own setup before you plan around them)
- **Scale model capacity** without proportional compute increase
- **Achieve better performance** per compute budget than dense models
- **Specialize experts** for different domains/tasks/languages
- **Reduce inference latency** with sparse activation (only 13B/47B params active in Mixtral)
- **Implement SOTA models** like Mixtral 8x7B, DeepSeek-V3, Switch Transformers

**Notable MoE Models**: Mixtral 8x7B (Mistral AI), DeepSeek-V3, Switch Transformers (Google), GLaM (Google), NLLB-MoE (Meta)

## When Not to Use This Skill

- You have one GPU or a small dataset: use a dense model, or fine-tune an existing MoE model instead
- You only want to run or serve a finished MoE model: use an inference tool, not training code
- You need a first working model fast: MoE adds routing, balancing and multi-GPU setup that dense training does not

## Output Format

Give the user, in order:

1. **Recommended setup**: framework (plain PyTorch, DeepSpeed, Megatron-DeepSpeed or Hugging Face), expert count, top-k, and why it fits their budget and data.
2. **Code**: the sparse layer and the training script or config for that framework, taken from this file and its references.
3. **Settings to check**: learning rate, auxiliary loss weight, router z-loss weight, capacity factor. Label each as a starting point, not a proven value.
4. **Install steps**: exact commands and versions to confirm.
5. **What to watch**: expert usage balance, loss, gradient size, dropped tokens. If a run fails, check the GPU setup with the multi-GPU training setup helper before you retry.
6. **Open questions**: anything missing, marked MISSING.

If the compute budget, GPU count or goal is missing, ask once, then mark it MISSING. Never invent budgets, model sizes or speed-up figures. Say that code here is a starting sketch: the user must run it on their own GPUs and check flags against the version of DeepSpeed or Megatron-DeepSpeed they install.

If you have a server plan from an earlier step, take the GPU count and budget from it. If you share your existing training code, build on it.

## Installation

```bash
# DeepSpeed with MoE support
pip install deepspeed>=0.6.0

# Megatron-DeepSpeed for large-scale training
git clone https://github.com/microsoft/Megatron-DeepSpeed
cd Megatron-DeepSpeed
pip install -r requirements.txt

# Alternative: HuggingFace Transformers
pip install transformers accelerate
```

## Quick Start

### Basic MoE Architecture

```python
import torch
import torch.nn as nn

class MoELayer(nn.Module):
    """Sparse Mixture of Experts layer."""

    def __init__(self, hidden_size, num_experts=8, top_k=2):
        super().__init__()
        self.num_experts = num_experts
        self.top_k = top_k

        # Expert networks (FFN)
        self.experts = nn.ModuleList([
            nn.Sequential(
                nn.Linear(hidden_size, 4 * hidden_size),
                nn.GELU(),
                nn.Linear(4 * hidden_size, hidden_size)
            )
            for _ in range(num_experts)
        ])

        # Gating network (router)
        self.gate = nn.Linear(hidden_size, num_experts)

    def forward(self, x):
        # x shape: (batch_size, seq_len, hidden_size)
        batch_size, seq_len, hidden_size = x.shape

        # Flatten for routing
        x_flat = x.view(-1, hidden_size)  # (batch_size * seq_len, hidden_size)

        # Compute gate scores
        gate_logits = self.gate(x_flat)  # (batch_size * seq_len, num_experts)

        # Top-k routing
        gate_scores = torch.softmax(gate_logits, dim=-1)
        topk_scores, topk_indices = torch.topk(gate_scores, self.top_k, dim=-1)

        # Normalize top-k scores
        topk_scores = topk_scores / topk_scores.sum(dim=-1, keepdim=True)

        # Dispatch and combine expert outputs
        output = torch.zeros_like(x_flat)

        for i in range(self.top_k):
            expert_idx = topk_indices[:, i]
            expert_scores = topk_scores[:, i].unsqueeze(-1)

            # Route tokens to experts
            for expert_id in range(self.num_experts):
                mask = (expert_idx == expert_id)
                if mask.any():
                    expert_input = x_flat[mask]
                    expert_output = self.experts[expert_id](expert_input)
                    output[mask] += expert_scores[mask] * expert_output

        # Reshape back
        return output.view(batch_size, seq_len, hidden_size)
```

### DeepSpeed MoE Training

Flag names below follow the Megatron-DeepSpeed examples. They change between versions, so check them against the repo you install. The entry-point name (`pretrain_gpt_moe.py` here, `pretrain_moe.py` in a later example) also differs between versions: use the one that exists in your checkout, and treat both commands as outlines until `--help` confirms every flag.

```bash
# Training script with MoE
deepspeed pretrain_gpt_moe.py \
  --num-layers 24 \
  --hidden-size 1024 \
  --num-attention-heads 16 \
  --seq-length 2048 \
  --max-position-embeddings 2048 \
  --micro-batch-size 4 \
  --global-batch-size 256 \
  --train-iters 500000 \
  --lr 0.0001 \
  --min-lr 0.00001 \
  --lr-decay-style cosine \
  --num-experts 128 \
  --moe-expert-parallel-size 4 \
  --moe-loss-coeff 0.01 \
  --moe-train-capacity-factor 1.25 \
  --moe-eval-capacity-factor 2.0 \
  --fp16 \
  --deepspeed_config ds_config.json
```

## Core Concepts

### 1. MoE Architecture

**Key Components:**
- **Experts**: Multiple specialized FFN networks (typically 8-128)
- **Router/Gate**: Learned network that selects which experts to use
- **Top-k Routing**: Activate only k experts per token (k=1 or k=2)
- **Load Balancing**: Ensure even expert utilization

```
Input Token
    ↓
Router (Gate Network)
    ↓
Top-k Expert Selection (e.g., 2 out of 8)
    ↓
Expert 1 (weight: 0.6) + Expert 5 (weight: 0.4)
    ↓
Weighted Combination
    ↓
Output
```

### 2. Routing Mechanisms

**Top-1 Routing (Switch Transformer):**
```python
# Simplest routing: one expert per token
gate_logits = router(x)  # (batch, seq_len, num_experts)
expert_idx = torch.argmax(gate_logits, dim=-1)  # Hard routing
```

**Top-2 Routing (Mixtral):**
```python
# Top-2: two experts per token (a sketch of the weights only.
# For the full dispatch of tokens to experts, see MoELayer above.)
gate_scores = torch.softmax(router(x), dim=-1)
top2_scores, top2_indices = torch.topk(gate_scores, k=2, dim=-1)

# Normalize scores
top2_scores = top2_scores / top2_scores.sum(dim=-1, keepdim=True)

# Combine: for each token, add (score x output of its chosen expert).
# Only the chosen experts run for that token, not all of them.
```

**Expert Choice Routing:**
```python
# Experts choose top-k tokens (instead of tokens choosing experts)
# Guarantees perfect load balancing
expert_scores = router(x).transpose(-1, -2)  # (batch, num_experts, seq_len)
topk_tokens = torch.topk(expert_scores, k=capacity_per_expert, dim=-1)
```

### 3. Load Balancing

**Auxiliary Loss:**
```python
def load_balancing_loss(gate_logits, expert_indices, num_experts):
    """Encourage uniform expert usage."""
    # Fraction of tokens routed to each expert
    expert_counts = torch.bincount(expert_indices.flatten(), minlength=num_experts)
    expert_fraction = expert_counts.float() / expert_indices.numel()

    # Gate probability for each expert (average across tokens)
    gate_probs = torch.softmax(gate_logits, dim=-1).mean(dim=0)

    # Auxiliary loss: encourage alignment
    aux_loss = num_experts * (expert_fraction * gate_probs).sum()

    return aux_loss

# Add to main loss
total_loss = language_model_loss + 0.01 * load_balancing_loss(...)
```

**Router Z-Loss (Stability):**
```python
def router_z_loss(logits):
    """Penalise large router logits to keep training stable."""
    z_loss = torch.logsumexp(logits, dim=-1).pow(2).mean()
    return z_loss

total_loss = lm_loss + 0.01 * aux_loss + 0.001 * router_z_loss(gate_logits)
```

### 4. Expert Parallelism

```python
# DeepSpeed configuration
{
  "train_batch_size": 256,
  "fp16": {"enabled": true},
  "moe": {
    "enabled": true,
    "num_experts": 128,
    "expert_parallel_size": 8,  # Distribute 128 experts across 8 GPUs
    "capacity_factor": 1.25,    # Expert capacity = tokens_per_batch * capacity_factor / num_experts
    "drop_tokens": true,        # Drop tokens exceeding capacity
    "use_residual": false
  }
}
```

## Training Configuration

### DeepSpeed MoE Config

```json
{
  "train_batch_size": 256,
  "gradient_accumulation_steps": 1,
  "optimizer": {
    "type": "Adam",
    "params": {
      "lr": 0.0001,
      "betas": [0.9, 0.999],
      "eps": 1e-8
    }
  },
  "fp16": {
    "enabled": true,
    "loss_scale": 0,
    "initial_scale_power": 16
  },
  "moe": {
    "enabled": true,
    "num_experts": 128,
    "expert_parallel_size": 8,
    "moe_loss_coeff": 0.01,
    "train_capacity_factor": 1.25,
    "eval_capacity_factor": 2.0,
    "min_capacity": 4,
    "drop_tokens": true,
    "use_residual": false,
    "use_tutel": false
  },
  "zero_optimization": {
    "stage": 1
  }
}
```

### Training Script

This file uses two entry-point names, `pretrain_gpt_moe.py` above and `pretrain_moe.py` below. They come from different Megatron-DeepSpeed versions. Use the entry-point script that exists in the version you install, and check each flag against its `--help`.

```bash
#!/bin/bash

# Mixtral-style MoE training
deepspeed --num_gpus 8 pretrain_moe.py \
  --model-parallel-size 1 \
  --num-layers 32 \
  --hidden-size 4096 \
  --num-attention-heads 32 \
  --seq-length 2048 \
  --max-position-embeddings 4096 \
  --micro-batch-size 2 \
  --global-batch-size 256 \
  --train-iters 500000 \
  --save-interval 5000 \
  --eval-interval 1000 \
  --eval-iters 100 \
  --lr 0.0001 \
  --min-lr 0.00001 \
  --lr-decay-style cosine \
  --lr-warmup-iters 2000 \
  --clip-grad 1.0 \
  --weight-decay 0.1 \
  --num-experts 8 \
  --moe-expert-parallel-size 4 \
  --moe-loss-coeff 0.01 \
  --moe-train-capacity-factor 1.25 \
  --moe-eval-capacity-factor 2.0 \
  --disable-moe-token-dropping \
  --fp16 \
  --deepspeed \
  --deepspeed_config ds_config_moe.json \
  --data-path /path/to/data \
  --vocab-file /path/to/vocab.json \
  --merge-file /path/to/merges.txt
```

## Advanced Patterns

### Mixtral 8x7B Architecture

```python
class MixtralMoEBlock(nn.Module):
    """Mixtral-style MoE block with 8 experts, top-2 routing."""

    def __init__(self, config):
        super().__init__()
        self.hidden_dim = config.hidden_size
        self.ffn_dim = config.intermediate_size
        self.num_experts = config.num_local_experts  # 8
        self.top_k = config.num_experts_per_tok       # 2

        # 8 expert FFNs
        self.experts = nn.ModuleList([
            nn.Sequential(
                nn.Linear(self.hidden_dim, self.ffn_dim, bias=False),
                nn.SiLU(),
                nn.Linear(self.ffn_dim, self.hidden_dim, bias=False)
            )
            for _ in range(self.num_experts)
        ])

        # Router
        self.gate = nn.Linear(self.hidden_dim, self.num_experts, bias=False)

    def forward(self, hidden_states):
        batch_size, sequence_length, hidden_dim = hidden_states.shape

        # Flatten
        hidden_states = hidden_states.view(-1, hidden_dim)

        # Router logits
        router_logits = self.gate(hidden_states)  # (batch * seq_len, num_experts)

        # Softmax and top-2
        routing_weights = torch.softmax(router_logits, dim=1)
        routing_weights, selected_experts = torch.topk(routing_weights, self.top_k, dim=-1)

        # Normalize routing weights
        routing_weights /= routing_weights.sum(dim=-1, keepdim=True)

        # Initialize output
        final_hidden_states = torch.zeros_like(hidden_states)

        # Route to experts
        for expert_idx in range(self.num_experts):
            expert_layer = self.experts[expert_idx]
            idx, top_x = torch.where(selected_experts == expert_idx)

            if idx.shape[0] == 0:
                continue

            # Current expert tokens
            current_hidden_states = hidden_states[idx]

            # Expert forward
            current_hidden_states = expert_layer(current_hidden_states)

            # Weighted by routing scores
            current_hidden_states *= routing_weights[idx, top_x, None]

            # Accumulate
            final_hidden_states.index_add_(0, idx, current_hidden_states)

        # Reshape
        return final_hidden_states.view(batch_size, sequence_length, hidden_dim)
```

### PR-MoE (Pyramid-Residual-MoE)

```bash
# DeepSpeed PR-MoE (Pyramid-Residual MoE): fewer experts in early layers, more in later ones.
# See the DeepSpeed MoE paper for its measured efficiency gains.
deepspeed pretrain_gpt_moe.py \
  --num-layers 24 \
  --hidden-size 1024 \
  --num-attention-heads 16 \
  --num-experts "[128, 64, 32, 16]" \
  --mlp-type residual \
  --moe-expert-parallel-size 4 \
  --moe-loss-coeff 0.01 \
  --fp16
```

## Best Practices

### 1. Expert Count Selection

```python
# Rule of thumb: More experts = more capacity, but diminishing returns
# Typical configurations:
# - Small models (1B-7B): 8-16 experts
# - Medium models (7B-30B): 8-64 experts
# - Large models (30B+): 64-256 experts

# Example: Mixtral 8x7B
# Total params: about 47B (the experts share the attention layers)
# Active params: about 13B per token (2 experts, top-2 routing)
# Result: 47B of capacity with about 13B of compute per token
```

### 2. Capacity Factor Tuning

```python
# Capacity = (tokens_per_batch / num_experts) * capacity_factor

# Training: Lower capacity (faster, drops some tokens)
train_capacity_factor = 1.25  # 25% buffer

# Evaluation: Higher capacity (no dropping)
eval_capacity_factor = 2.0    # 100% buffer

# Formula:
expert_capacity = int((seq_len * batch_size / num_experts) * capacity_factor)
```

### 3. Learning Rate Guidelines

```python
# A common starting point: MoE models often need a lower LR than dense models.
# Treat these as example values, and tune on your own runs.
# - Dense model: lr = 6e-4
# - MoE model: lr = 1e-4

# A longer decay schedule is also common
dense_lr_decay_iters = 300000
moe_lr_decay_iters = 500000
```

### 4. Loss Coefficient Tuning

```python
# Start with standard values
moe_loss_coeff = 0.01    # Auxiliary loss (load balancing)
router_z_loss_coeff = 0.001  # Router entropy (stability)

# The 2.0 usage ratio, the 10.0 grad-norm limit and the new coefficients below are untested guesses.
# They are not proven values. Watch your own training curves and pick your own limits.
# If load imbalance persists, increase aux loss
if max_expert_usage / min_expert_usage > 2.0:
    moe_loss_coeff = 0.1  # Stronger load balancing

# If training unstable, increase z-loss
if grad_norm > 10.0:
    router_z_loss_coeff = 0.01
```

### 5. Avoid Common Pitfalls

```python
# ❌ Bad: Using same LR as dense model
optimizer = Adam(model.parameters(), lr=6e-4)

# ✅ Good: Lower LR for MoE
# Split the parameters by name. Adjust the test to match your layer names.
moe_params = [p for n, p in model.named_parameters() if 'expert' in n or 'router' in n or 'gate' in n]
non_moe_params = [p for n, p in model.named_parameters() if not ('expert' in n or 'router' in n or 'gate' in n)]
optimizer = Adam([
    {'params': non_moe_params, 'lr': 6e-4},
    {'params': moe_params, 'lr': 1e-4}
])

# ❌ Bad: No load balancing
loss = lm_loss

# ✅ Good: Add auxiliary loss
loss = lm_loss + 0.01 * aux_loss + 0.001 * z_loss

# ❌ Bad: Too many experts for small dataset
num_experts = 128  # Overfitting risk

# ✅ Good: Match experts to data diversity
num_experts = 8  # Better for small datasets
```

## Inference Optimization

### Sparse Inference

```python
# Only activate top-k experts (huge memory savings)
@torch.no_grad()
def moe_inference(x, model, top_k=2):
    """Sparse MoE inference sketch: only load k experts.
    model.load_expert is NOT a real API. You must write it yourself
    (for example, load expert weights from disk or CPU memory on demand).
    This is an outline, not code that runs as written."""
    # Router
    gate_logits = model.gate(x)
    topk_scores, topk_indices = torch.topk(
        torch.softmax(gate_logits, dim=-1),
        k=top_k,
        dim=-1
    )

    # Load and run only top-k experts
    output = torch.zeros_like(x)
    for i in range(top_k):
        expert_idx = topk_indices[:, i]
        # Load expert from disk/offload if needed
        expert = model.load_expert(expert_idx)
        output += topk_scores[:, i:i+1] * expert(x)

    return output
```

## Resources

- **DeepSpeed MoE Tutorial**: https://www.deepspeed.ai/tutorials/mixture-of-experts-nlg/
- **Mixtral Paper**: https://arxiv.org/abs/2401.04088
- **Switch Transformers**: https://arxiv.org/abs/2101.03961
- **HuggingFace MoE Guide**: https://huggingface.co/blog/moe
- **NVIDIA MoE Blog**: https://developer.nvidia.com/blog/applying-mixture-of-experts-in-llm-architectures/

## See Also

- `references/architectures.md` - MoE model architectures (Mixtral, Switch, DeepSeek-V3)
- `references/training.md` - Advanced training techniques and optimization
- `references/inference.md` - Production deployment and serving patterns


