---
name: llava
description: Large Language and Vision Assistant. Enables visual instruction tuning and image-based conversations. Combines CLIP vision encoder with Vicuna/LLaMA language models. Supports multi-turn image chat, visual question answering, and instruction following. Use for vision-language chatbots or image understanding tasks. Best for conversational image analysis.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [LLaVA, Vision-Language, Multimodal, Visual Question Answering, Image Chat, CLIP, Vicuna, Conversational AI, Instruction Tuning, VQA]
dependencies: [transformers, torch, pillow]
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **An image** (yours): a finished picture.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for an image, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can run the install and test commands on your machine for you, when you allow it.
- **Hugging Face:** It hosts the LLaVA model files that the code downloads.
<!-- /needs -->

## Supporting material availability

This catalog copy does not include these files:

- `scripts/v1_5/pretrain.sh`
- `scripts/v1_5/finetune.sh`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

# LLaVA - Large Language and Vision Assistant

Open-source vision-language model for conversational image understanding.

## When to use LLaVA

**Use when:**
- Building vision-language chatbots
- Visual question answering (VQA)
- Image description and captioning
- Multi-turn image conversations
- Visual instruction following
- Document understanding with images

**Facts to know**:
- Open-source, runs on your own GPU
- Multiple model sizes (7B to 34B parameters)
- Licences: this skill is MIT (Orchestra Research). The LLaVA code and each model's weights have their own licences. Read them on the GitHub and Hugging Face pages before any commercial use

**Do not use when**:
- You have no GPU: a hosted vision service is simpler than running this yourself
- You need exact text from a scan or document: use an OCR tool, since small text is a known weak spot
- You need exact counts or locations of objects: answers here are approximate

**Use alternatives instead**:
- **GPT-4V**: Highest quality, API-based
- **CLIP**: Simple zero-shot classification
- **BLIP-2**: Better for captioning only
- **Flamingo**: Research, not open-source

## Output Format

Walk the user through, then give:

1. **Setup check**: GPU and VRAM found or MISSING, Python version, chosen model size and why.
2. **Commands**: clone, install, and the first run (the CLI command with one image and one question).
3. **Answers**: one text answer per question. For multi-turn chats, the full conversation log in order.
4. **Notes**: anything the model may have got wrong, such as invented details, small text or counts.
5. **Next steps**: save captions to a spreadsheet, add a chat front end such as the Gradio app below, or try a larger model.

If images, questions or GPU details are missing, ask once, then mark them MISSING. Never invent model answers. You cannot see the user's images unless they are attached, and answers only come from running the model on their machine. Code here is a starting point: run it, then report errors back.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Pull request writer](https://useaiblocks.com/skills/pull-request-writer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Quick start

### Installation

```bash
# Clone repository
git clone https://github.com/haotian-liu/LLaVA
cd LLaVA
# Pin the version so a repeat install matches this one.
# v1.2.2.post1 was the newest release tag on 28 Oct 2026. Use a newer tag from the
# repository page if there is one, and write down which tag you used.
git checkout v1.2.2.post1

# Install
pip install -e .
```

### Basic usage

```python
from llava.model.builder import load_pretrained_model
from llava.mm_utils import get_model_name_from_path, process_images, tokenizer_image_token
from llava.constants import IMAGE_TOKEN_INDEX, DEFAULT_IMAGE_TOKEN
from llava.conversation import conv_templates
from PIL import Image
import torch

# Load model
model_path = "liuhaotian/llava-v1.5-7b"
tokenizer, model, image_processor, context_len = load_pretrained_model(
    model_path=model_path,
    model_base=None,
    model_name=get_model_name_from_path(model_path)
)

# Load image
image = Image.open("image.jpg")
image_tensor = process_images([image], image_processor, model.config)
image_tensor = image_tensor.to(model.device, dtype=torch.float16)

# Create conversation
conv = conv_templates["llava_v1"].copy()
conv.append_message(conv.roles[0], DEFAULT_IMAGE_TOKEN + "\nWhat is in this image?")
conv.append_message(conv.roles[1], None)
prompt = conv.get_prompt()

# Generate response
input_ids = tokenizer_image_token(prompt, tokenizer, IMAGE_TOKEN_INDEX, return_tensors='pt').unsqueeze(0).to(model.device)

with torch.inference_mode():
    output_ids = model.generate(
        input_ids,
        images=image_tensor,
        do_sample=True,
        temperature=0.2,
        max_new_tokens=512
    )

response = tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
print(response)
```

### Helper functions used below

The snippets that follow call two helpers, `generate` and `ask`. Define them once after the code in Basic usage has run (it creates `tokenizer`, `model` and `image_processor`).

```python
def generate(conv, model, image):
    """Run one turn. The last message in conv is the new question."""
    prompt = conv.get_prompt()
    image_tensor = process_images([image], image_processor, model.config)
    image_tensor = image_tensor.to(model.device, dtype=torch.float16)
    input_ids = tokenizer_image_token(
        prompt, tokenizer, IMAGE_TOKEN_INDEX, return_tensors='pt'
    ).unsqueeze(0).to(model.device)
    with torch.inference_mode():
        output_ids = model.generate(
            input_ids, images=image_tensor,
            do_sample=True, temperature=0.2, max_new_tokens=512
        )
    return tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()

def ask(model, image, question):
    """One question about one image."""
    conv = conv_templates["llava_v1"].copy()
    conv.append_message(conv.roles[0], DEFAULT_IMAGE_TOKEN + "\n" + question)
    conv.append_message(conv.roles[1], None)
    return generate(conv, model, image)
```

## Available models

| Model | Parameters | VRAM | Quality |
|-------|------------|------|---------|
| LLaVA-v1.5-7B | 7B | ~14 GB | Good |
| LLaVA-v1.5-13B | 13B | ~28 GB | Better |
| LLaVA-v1.6-34B | 34B | ~70 GB | Best |

```python
# Load different models
model_7b = "liuhaotian/llava-v1.5-7b"
model_13b = "liuhaotian/llava-v1.5-13b"
model_34b = "liuhaotian/llava-v1.6-34b"

# 4-bit quantization for lower VRAM
load_4bit = True  # Reduces VRAM by ~4×
```

## CLI usage

```bash
# Single image query
python -m llava.serve.cli \
    --model-path liuhaotian/llava-v1.5-7b \
    --image-file image.jpg \
    --query "What is in this image?"

# Multi-turn conversation
python -m llava.serve.cli \
    --model-path liuhaotian/llava-v1.5-7b \
    --image-file image.jpg
# Then type questions interactively
```

## Web UI (Gradio)

```bash
# Launch Gradio interface
python -m llava.serve.gradio_web_server \
    --model-path liuhaotian/llava-v1.5-7b \
    --load-4bit  # Optional: reduce VRAM

# Access at http://localhost:7860
```

## Multi-turn conversations

Note: `generate` and `ask` are the helpers defined above under Helper functions. They are not part of the LLaVA package.

```python
# Initialize conversation
conv = conv_templates["llava_v1"].copy()

# Turn 1
conv.append_message(conv.roles[0], DEFAULT_IMAGE_TOKEN + "\nWhat is in this image?")
conv.append_message(conv.roles[1], None)
response1 = generate(conv, model, image)

# Turn 2
conv.messages[-1][1] = response1  # Add previous response
conv.append_message(conv.roles[0], "What breed is the dog?")
conv.append_message(conv.roles[1], None)
response2 = generate(conv, model, image)

# Turn 3
conv.messages[-1][1] = response2
conv.append_message(conv.roles[0], "What time of day is it?")
conv.append_message(conv.roles[1], None)
response3 = generate(conv, model, image)
```

## Common tasks

### Image captioning

```python
question = "Describe this image in detail."
response = ask(model, image, question)
```

### Visual question answering

```python
question = "How many people are in the image?"
response = ask(model, image, question)
```

### Object detection (textual)

```python
question = "List all the objects you can see in this image."
response = ask(model, image, question)
```

### Scene understanding

```python
question = "What is happening in this scene?"
response = ask(model, image, question)
```

### Document understanding

```python
question = "What is the main topic of this document?"
response = ask(model, document_image, question)
```

## Training custom model

Training is optional. These scripts (`pretrain.sh` and `finetune.sh`) are not included in this catalogue copy. They live in the original LLaVA repository you clone. Training needs large datasets and several GPUs: only start it when plain use is not enough, and run the scripts from the original repository.

```bash
# Stage 1: Feature alignment (558K image-caption pairs)
bash scripts/v1_5/pretrain.sh

# Stage 2: Visual instruction tuning (150K instruction data)
bash scripts/v1_5/finetune.sh
```

## Quantization (reduce VRAM)

```python
# 4-bit quantization
tokenizer, model, image_processor, context_len = load_pretrained_model(
    model_path="liuhaotian/llava-v1.5-13b",
    model_base=None,
    model_name=get_model_name_from_path("liuhaotian/llava-v1.5-13b"),
    load_4bit=True  # Reduces VRAM ~4×
)

# 8-bit quantization
load_8bit=True  # Reduces VRAM ~2×
```

## Best practices

1. **Start with 7B model** - Good quality, manageable VRAM
2. **Use 4-bit quantization** - Reduces VRAM significantly
3. **GPU required** - CPU inference extremely slow
4. **Clear prompts** - Specific questions get better answers
5. **Multi-turn conversations** - Maintain conversation context
6. **Temperature 0.2-0.7** - Balance creativity/consistency
7. **max_new_tokens 512-1024** - For detailed responses
8. **Batch processing** - Process multiple images sequentially

## Performance

Rough figures from the original skill, not measured by us. Your speed and memory will differ. Check the model cards.

| Model | VRAM (FP16) | VRAM (4-bit) | Speed (tokens/s) |
|-------|-------------|--------------|------------------|
| 7B | ~14 GB | ~4 GB | ~20 |
| 13B | ~28 GB | ~8 GB | ~12 |
| 34B | ~70 GB | ~18 GB | ~5 |

*On A100 GPU*

## Benchmarks

For scores on VQAv2, GQA, MM-Vet and MMBench, see the LLaVA paper and each model card on Hugging Face. They differ by model size and version.

## Limitations

1. **Hallucinations** - May describe things not in image
2. **Spatial reasoning** - Struggles with precise locations
3. **Small text** - Difficulty reading fine print
4. **Object counting** - Imprecise for many objects
5. **VRAM requirements** - Need powerful GPU
6. **Inference speed** - Slower than CLIP

## Integration with frameworks

### LangChain

No working LangChain code is included. To use LLaVA there, wrap the `ask(model, image, question)` helper above in your own custom LLM class and return its answer as a string. Do not present this as a finished integration.

### Gradio App

Note: run the Basic usage code and the helper definitions first, so `model` exists. This snippet is a small sketch of a chat page, not a finished app. It keeps one conversation in memory, so it suits one user at a time. It starts a new conversation when the chat is cleared. The first-question branch depends on `history` being empty, so test one question and one follow-up before you rely on it.

```python
import gradio as gr

web_conv = None  # the running conversation, kept between questions

def chat(text, history, image):
    global web_conv
    if web_conv is None or not history:
        # First question: start a new conversation and attach the image token
        web_conv = conv_templates["llava_v1"].copy()
        text = DEFAULT_IMAGE_TOKEN + "\n" + text
    web_conv.append_message(web_conv.roles[0], text)
    web_conv.append_message(web_conv.roles[1], None)
    reply = generate(web_conv, model, image)
    web_conv.messages[-1][1] = reply  # keep the answer so follow-ups have context
    return reply

demo = gr.ChatInterface(
    chat,
    additional_inputs=[gr.Image(type="pil")],
    title="LLaVA Chat"
)
demo.launch()
```

## Resources

- **GitHub**: https://github.com/haotian-liu/LLaVA
- **Paper**: https://arxiv.org/abs/2304.08485
- **Demo**: https://llava.hliu.cc
- **Models**: https://huggingface.co/liuhaotian
- **Licence**: check the repository and each model card


