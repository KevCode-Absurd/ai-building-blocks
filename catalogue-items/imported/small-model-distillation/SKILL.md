---
name: knowledge-distillation
description: Compress large language models using knowledge distillation from teacher to student models. Use when deploying smaller models with retained performance, transferring GPT-4 capabilities to open-source models, or reducing inference costs. Covers temperature scaling, soft targets, reverse KLD, logit distillation, and MiniLLM training strategies.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Emerging Techniques, Knowledge Distillation, Model Compression, Teacher-Student, MiniLLM, Reverse KLD, Soft Targets, Temperature Scaling, Logit Distillation, Model Transfer]
dependencies: [transformers, torch, datasets]
---

# Knowledge Distillation: Compressing LLMs

## What you need

- The teacher model (the large one) and the student model (the small one you want to train), by name.
- Training prompts or text for the task, and a separate set of held-out prompts for testing. Say how many of each you have.
- A computer with a GPU, Python, and the `transformers`, `torch` and `datasets` packages. Training needs real GPU time, which costs money on a rented machine.
- Access to both models. Some models, such as the `meta-llama` ones in the examples below, are gated: you must accept their licence on Hugging Face and log in first.
- If the teacher is a hosted model, its terms of use. Some providers do not allow their outputs to train other models. Check before you generate data.

If the models, the task data or the GPU are missing, ask once. If still missing, write `MISSING: <what>`, give the plan only, and say the code is untested. Never invent training data, scores or model sizes. A chat cannot run training: write the script, and ask the user to run it and paste back the loss and the test results.

## Steps

1. Confirm the teacher, the student, the task and the held-out test prompts. Check the size gap: a very large gap can make the student hard to train, so suggest a closer pair or two stages if the gap is big.
2. Choose the method: response distillation if you only have teacher text (hosted teacher), soft-target or logit distillation if you can read the teacher's probabilities, reverse KL (MiniLLM) for free-text generation. Say why in one sentence.
3. Set temperature and the loss weight (alpha). Start from the values in this file and say they are starting points to tune.
4. Write the training script from the matching section below. Fix any helper that is not defined in this file before you hand it over.
5. Before the comparison, ask the user to set a pass bar for their task (for example, the student scores within a stated gap of the teacher on the held-out prompts). Then write the comparison step: run teacher and student on the held-out prompts, and score both with the task's own check (an accuracy test, a rubric, or a human read of 20 or more answers).
6. Tell the user how to read the result: the student is worth keeping only if it meets the bar they set in step 5. If it misses, suggest a closer teacher-student pair, a two-stage distillation, or a hosted API. If it passes, keep the model and the held-out prompts so you can re-test after any change.

## Output

Return, in this order:

1. **Plan**: teacher, student, method, and why, in a few lines.
2. **Training script**: the full code, with the loss, temperature and alpha filled in and a note on each.
3. **Settings table**: temperature, alpha, learning rate, epochs, batch size, each marked "start here, then tune".
4. **Comparison script**: runs both models on the held-out prompts and prints the answers side by side with the score.
5. **Cost and access notes**: the GPU memory and time you expect to need if known, gated model access, and teacher terms of use. Mark anything you do not know as "not known".
6. **Not checked**: anything you could not test.

Do not promise how much of the teacher's quality the student will keep. Say it must be measured on the user's held-out prompts.

## When not to use

- The teacher and student are close in size. A plain fine-tune of the student may be enough. Use the LLM fine-tuning guide.
- You have no GPU. A hosted API or a smaller off-the-shelf model may cost less.
- You only need the model to answer in your style. A prompt or a light fine-tune is simpler.

## When to Use This Skill

Use Knowledge Distillation when you need to:
- **Compress models** from a large teacher (such as 70B) to a smaller student (such as 7B), then test how much quality you kept on your own task
- **Transfer capabilities** from proprietary models (GPT-4) to open-source (LLaMA, Mistral)
- **Reduce inference costs** by deploying smaller student models
- **Create specialized models** by distilling domain-specific knowledge
- **Improve small models** using synthetic data from large teachers

**Key Techniques**: Temperature scaling, soft targets, reverse KLD (MiniLLM), logit distillation, response distillation

**Papers**: Hinton et al. 2015 (arXiv 1503.02531), MiniLLM (arXiv 2306.08543), KD Survey (arXiv 2402.13116)

## Installation

```bash
# Standard transformers
pip install transformers datasets accelerate

# For training
pip install torch deepspeed wandb

# Optional: MiniLLM implementation
git clone https://github.com/microsoft/LMOps
cd LMOps/minillm
pip install -e .
```

## Quick Start

> **Cost and memory warning.** The example loads a 70B teacher and a 7B student. In float16 the 70B model alone needs far more memory than one consumer GPU has, and renting enough GPUs costs real money. Before the user runs anything, estimate the memory and cost for their model pair and get a yes. For a first test, use a much smaller pair.

### Basic Knowledge Distillation

Before you run: define `dataset` first. A minimal version, using your own prompts in `my_prompts`:

```python
my_prompts = ["[YOUR TRAINING PROMPT 1]", "[YOUR TRAINING PROMPT 2]"]  # replace with your task prompts

def encode(text):
    enc = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    return {"input_ids": enc["input_ids"][0], "attention_mask": enc["attention_mask"][0], "labels": enc["input_ids"][0].clone()}

dataset = [encode(t) for t in my_prompts]
# With batch_size=1 each item needs a batch dimension: use a collate function that stacks (or unsqueezes) the tensors.
```

Run this after the tokenizer is loaded in step 1 below, and move each batch to the models' devices (`batch = {k: v.to(student.device) for k, v in batch.items()}`) before the forward pass. The teacher and the student may sit on different devices.

```python
import torch
import torch.nn.functional as F
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments

# 1. Load teacher (large) and student (small) models
teacher = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-70b-hf",  # Large teacher
    torch_dtype=torch.float16,
    device_map="auto"
)

student = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",  # Small student
    torch_dtype=torch.float16,
    device_map="cuda:0"
)

tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-70b-hf")

# Setup the loop below needs (add your own task data)
from torch.utils.data import DataLoader
from torch.optim import AdamW

# dataset: YOU MUST DEFINE THIS. A list or torch Dataset of your tokenised prompts,
# each item holding input_ids, attention_mask and labels (see the datasets package).
# The code below will not run until you define it.
dataloader = DataLoader(dataset, batch_size=1, shuffle=True)
optimizer = AdamW(student.parameters(), lr=1e-5)
# Move each batch to the same device as the models before the forward pass.

# 2. Define distillation loss
def distillation_loss(student_logits, teacher_logits, labels, temperature=2.0, alpha=0.5):
    """
    Combine hard loss (cross-entropy) with soft loss (KL divergence).

    Args:
        temperature: Softens probability distributions (higher = softer)
        alpha: Weight for distillation loss (1-alpha for hard loss)
    """
    # Hard loss: Standard cross-entropy with true labels
    hard_loss = F.cross_entropy(student_logits.view(-1, student_logits.size(-1)), labels.view(-1))

    # Soft loss: KL divergence between student and teacher
    soft_targets = F.softmax(teacher_logits / temperature, dim=-1)
    soft_student = F.log_softmax(student_logits / temperature, dim=-1)
    soft_loss = F.kl_div(soft_student, soft_targets, reduction='batchmean') * (temperature ** 2)

    # Combined loss
    return alpha * soft_loss + (1 - alpha) * hard_loss

# 3. Training loop
for batch in dataloader:
    # Teacher forward (no grad)
    with torch.no_grad():
        teacher_outputs = teacher(**batch)
        # The teacher (device_map="auto") and the student (cuda:0) can sit on different
        # devices. Move the teacher logits to the student's device before the loss.
        teacher_logits = teacher_outputs.logits.to(student.device)

    # Student forward
    student_outputs = student(**batch)
    student_logits = student_outputs.logits

    # Compute distillation loss
    loss = distillation_loss(
        student_logits,
        teacher_logits,
        batch['labels'],
        temperature=2.0,
        alpha=0.7  # 70% soft, 30% hard
    )

    # Backward and optimize
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
```

### Per-token reverse KL (simplified, not full MiniLLM)

**Source of the idea**: arXiv 2306.08543 (MiniLLM)

**Read this first**: the code below is a simplified per-token reverse KL. It is not the MiniLLM method. MiniLLM trains on text the student samples and uses a policy gradient (see references/minillm.md). Do not tell the user they ran MiniLLM.

**Idea**: use reverse KL instead of forward KL, which the paper argues suits free-text generation.

```python
def reverse_kl_loss(student_logits, teacher_logits, temperature=1.0):
    """
    Reverse KL divergence: KL(Student || Teacher), token by token.
    This is a simple per-token form for teaching. MiniLLM itself trains on
    text the student samples and uses a policy gradient (see references/minillm.md).
    """
    log_p_student = F.log_softmax(student_logits / temperature, dim=-1)
    log_p_teacher = F.log_softmax(teacher_logits / temperature, dim=-1).detach()
    p_student = log_p_student.exp()

    # Reverse KL: sum over the student's own distribution of
    # p_student * (log p_student - log p_teacher)
    reverse_kl = (p_student * (log_p_student - log_p_teacher)).sum(dim=-1).mean()

    return reverse_kl * (temperature ** 2)

# Training with the simplified reverse KL (needs the teacher, student, dataloader and optimizer from Quick Start above)
for batch in dataloader:
    with torch.no_grad():
        teacher_logits = teacher(**batch).logits

    student_logits = student(**batch).logits

    # Reverse KL (the paper argues it suits generation; test it on your task)
    loss = reverse_kl_loss(student_logits, teacher_logits, temperature=1.0)

    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
```

**Why reverse KL?**
- **Forward KL** (standard, `KL(Teacher || Student)`): the student is pushed to put some probability on everything the teacher can say, including rare outputs. It can end up spreading probability onto text the teacher would not write.
- **Reverse KL** (MiniLLM, `KL(Student || Teacher)`): the student is pushed to stay inside what the teacher likes. It tends to focus on the teacher's main modes.
- The MiniLLM paper argues reverse KL suits free-text generation. Test both on your task before you pick one.

### Response Distillation

```python
# Generate synthetic data from teacher, train student to imitate
# Needs the teacher, student and tokenizer loaded as in Quick Start above.
from transformers import DataCollatorForLanguageModeling, Trainer, TrainingArguments

# 1. Generate synthetic responses from teacher
prompts = ["Explain AI:", "What is ML?", "Define NLP:"]

teacher_responses = []
for prompt in prompts:
    inputs = tokenizer(prompt, return_tensors='pt').to(teacher.device)
    outputs = teacher.generate(**inputs, max_new_tokens=256, do_sample=True, temperature=0.7)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    teacher_responses.append(response)

# 2. Train student on teacher's responses (standard fine-tuning)
# Tokenise first: Trainer needs input_ids, attention_mask and labels, not raw text.
tokenizer.pad_token = tokenizer.pad_token or tokenizer.eos_token
train_dataset = []
for prompt, response in zip(prompts, teacher_responses):
    enc = tokenizer(f"{prompt}\n{response}", truncation=True, max_length=512)
    enc["labels"] = enc["input_ids"].copy()
    train_dataset.append(enc)

# 3. Fine-tune student
trainer = Trainer(
    model=student,
    args=TrainingArguments(output_dir="./student", num_train_epochs=3, learning_rate=2e-5),
    train_dataset=train_dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
)
trainer.train()
```

## Core Concepts

### 1. Temperature Scaling

**Purpose**: Soften probability distributions to expose teacher's uncertainty.

```python
# Low temperature (T=1): Sharp distribution
logits = [3.0, 2.0, 1.0]
probs_T1 = softmax(logits / 1.0)  # [0.67, 0.24, 0.09]

# High temperature (T=4): Soft distribution
probs_T4 = softmax(logits / 4.0)  # [0.42, 0.34, 0.24]

# Higher T reveals more information about relative rankings
```

**Rule**: Use T=2-5 for distillation (2 is common default).

### 2. Loss Function Components

```python
# Total loss = alpha * soft_loss + (1 - alpha) * hard_loss

# Soft loss: Learn from teacher's knowledge
soft_loss = KL(teacher || student)   # what F.kl_div(log_softmax(student), softmax(teacher)) computes

# Hard loss: Learn from ground truth labels
hard_loss = CrossEntropy(student_output, true_labels)

# Typical values:
alpha = 0.5  # Balanced
alpha = 0.7  # More emphasis on teacher
alpha = 0.3  # More emphasis on labels
```

### 3. Forward vs Reverse KLD

```python
# Forward KL: KL(Teacher || Student)   (the standard soft-target loss above)
# - Mode-covering: student tries to give some probability to everything the teacher can output
# - Common choice for classification

# Reverse KL: KL(Student || Teacher)   (MiniLLM)
# - Mode-seeking: student concentrates on the teacher's main behaviours
# - Argued in the MiniLLM paper to suit text generation
```

## Training Strategies

### Strategy 1: Logit Distillation

```python
# Train student to match teacher's logits directly

def logit_distillation_trainer(student, teacher, dataloader, temperature=2.0):
    optimizer = torch.optim.AdamW(student.parameters(), lr=2e-5)

    for epoch in range(3):
        for batch in dataloader:
            # Get logits
            with torch.no_grad():
                teacher_logits = teacher(**batch).logits

            student_logits = student(**batch).logits

            # MSE on logits (alternative to KLD)
            loss = F.mse_loss(student_logits, teacher_logits)

            # Or use KLD
            # loss = F.kl_div(
            #     F.log_softmax(student_logits/temperature, dim=-1),
            #     F.softmax(teacher_logits/temperature, dim=-1),
            #     reduction='batchmean'
            # ) * (temperature ** 2)

            loss.backward()
            optimizer.step()
            optimizer.zero_grad()

    return student
```

### Strategy 2: Two-Stage Distillation

```python
# Stage 1: Distill from teacher
student = distill(teacher, student, epochs=5)

# Stage 2: Fine-tune on task-specific data
student = fine_tune(student, task_data, epochs=3)

# Often helps on a specific task. Compare with single-stage on your own data.
```

### Strategy 3: Multi-Teacher Distillation

```python
# Learn from multiple expert teachers

def multi_teacher_distillation(student, teachers, batch):
    """Distill from ensemble of teachers."""
    teacher_logits_list = []

    # Get logits from all teachers
    with torch.no_grad():
        for teacher in teachers:
            logits = teacher(**batch).logits
            teacher_logits_list.append(logits)

    # Average teacher predictions
    avg_teacher_logits = torch.stack(teacher_logits_list).mean(dim=0)

    # Student learns from ensemble
    student_logits = student(**batch).logits
    loss = F.kl_div(
        F.log_softmax(student_logits, dim=-1),
        F.softmax(avg_teacher_logits, dim=-1),
        reduction='batchmean'
    )

    return loss
```

## Production Deployment

### Complete Training Script

You must define `train_dataset` yourself before you call this. Use the tokenised items from Quick Start (each with input_ids, attention_mask and labels). The cost and memory warning above applies to the default model names.

```python
import torch
import torch.nn.functional as F
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling,
)

# train_dataset: YOU MUST DEFINE THIS before running (list of tokenised items)

def train_distilled_model(
    teacher_name="meta-llama/Llama-2-70b-hf",
    student_name="meta-llama/Llama-2-7b-hf",
    output_dir="./distilled-llama-7b",
    temperature=2.0,
    alpha=0.7,
):
    # Load models
    teacher = AutoModelForCausalLM.from_pretrained(teacher_name, torch_dtype=torch.float16, device_map="auto")
    student = AutoModelForCausalLM.from_pretrained(student_name, torch_dtype=torch.float16)
    tokenizer = AutoTokenizer.from_pretrained(teacher_name)

    # Custom trainer with distillation
    class DistillationTrainer(Trainer):
        def compute_loss(self, model, inputs, return_outputs=False):
            # Student forward
            outputs_student = model(**inputs)
            student_logits = outputs_student.logits

            # Teacher forward (no grad)
            with torch.no_grad():
                outputs_teacher = teacher(**inputs)
                teacher_logits = outputs_teacher.logits

            # Distillation loss
            soft_targets = F.softmax(teacher_logits / temperature, dim=-1)
            soft_student = F.log_softmax(student_logits / temperature, dim=-1)
            soft_loss = F.kl_div(soft_student, soft_targets, reduction='batchmean') * (temperature ** 2)

            # Hard loss
            hard_loss = outputs_student.loss

            # Combined
            loss = alpha * soft_loss + (1 - alpha) * hard_loss

            return (loss, outputs_student) if return_outputs else loss

    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=8,
        learning_rate=2e-5,
        warmup_steps=500,
        logging_steps=100,
        save_steps=1000,
        bf16=True,
        gradient_checkpointing=True,
    )

    # Train
    trainer = DistillationTrainer(
        model=student,
        args=training_args,
        train_dataset=train_dataset,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )

    trainer.train()
    student.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

# Usage
train_distilled_model(
    teacher_name="meta-llama/Llama-2-70b-hf",
    student_name="meta-llama/Llama-2-7b-hf",
    temperature=2.0,
    alpha=0.7
)
```

## Best Practices

### 1. Hyperparameter Selection

```python
# Temperature
T = 1.0  # Sharp (less knowledge transfer)
T = 2.0  # Standard (good balance)
T = 5.0  # Soft (more knowledge transfer)

# Alpha (weight)
alpha = 0.5  # Balanced
alpha = 0.7  # Emphasize teacher knowledge
alpha = 0.9  # Strong distillation

# Rule: Higher T + higher alpha = stronger distillation
```

### 2. Model Size Ratio

```python
# Rule of thumb from the original skill, not tested here.
# Try a closer pair first if results are poor.
# Ratios (teacher/student)
70B / 7B = 10×    # Excellent
13B / 1B = 13×    # Good
7B / 1B = 7×      # Acceptable

# Avoid too large gap
70B / 1B = 70×    # Very large gap: harder to train, try two stages
```

### 3. Data Quality

```python
# Mix teacher-generated data with real data.
# An often-quoted split is about 70% teacher-generated and 30% real.
# That split is an untested rule of thumb with no source here.
# Treat it as a starting point and check it on your held-out test prompts.
train_data = {
    "teacher_generated": "[SHARE, tune on held-out test]",
    "real_data": "[SHARE, tune on held-out test]"
}

# Real data only does not use the teacher fully. Teacher data only can copy the
# teacher's mistakes. Test both against your held-out prompts.
```

## Evaluation

```python
from transformers import pipeline

# Compare student vs teacher
teacher_pipe = pipeline("text-generation", model=teacher)
student_pipe = pipeline("text-generation", model=student)

prompts = ["Explain quantum computing:", "What is AI?"]

for prompt in prompts:
    teacher_out = teacher_pipe(prompt, max_new_tokens=100)
    student_out = student_pipe(prompt, max_new_tokens=100)

    print(f"Prompt: {prompt}")
    print(f"Teacher: {teacher_out[0]['generated_text']}")
    print(f"Student: {student_out[0]['generated_text']}")
    # Score both answers with your own check on a held-out set:
    # an exact-match or accuracy test, a rubric, or a human read of 20 or more answers.
    # Do not train and test on the same prompts.
```

## Resources

- **Hinton et al. 2015 (Foundational)**: https://arxiv.org/abs/1503.02531
- **MiniLLM (Reverse KLD)**: https://arxiv.org/abs/2306.08543
- **KD Survey for LLMs (2024)**: https://arxiv.org/abs/2402.13116
- **MiniLLM GitHub**: https://github.com/microsoft/LMOps/tree/main/minillm

## Credit and licence

Written by Orchestra Research (`orchestra-research/AI-research-SKILLs`), under the MIT licence in `LICENSE`. Keep the credit when you reuse it. The papers listed above are the authority on the methods. The model weights and datasets you load have their own licences.
