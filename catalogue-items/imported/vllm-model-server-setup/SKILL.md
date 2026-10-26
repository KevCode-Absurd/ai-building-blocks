---
name: serving-llms-vllm
description: Serves LLMs with high throughput using vLLM's PagedAttention and continuous batching. Use when deploying production LLM APIs, optimizing inference latency/throughput, or serving models with limited GPU memory. Supports OpenAI-compatible endpoints, quantization (GPTQ/AWQ/FP8), and tensor parallelism.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [vLLM, Inference Serving, PagedAttention, Continuous Batching, High Throughput, Production, OpenAI API, Quantization, Tensor Parallelism]
dependencies: [vllm, torch, transformers]
---

# vLLM - High-Performance LLM Serving

vLLM serves open language models with PagedAttention (a block-based KV cache) and continuous batching (mixing prefill and decode requests). It gives you an OpenAI-compatible endpoint.

## Before you start

Ask once for anything missing. Never invent a model name, GPU or target.

1. **Model.** The exact Hugging Face model ID. Gated models (such as Llama) need a Hugging Face token and an accepted licence. Tell the user to set the token as an environment variable themselves, and never ask for it in chat.
2. **GPU.** Type, memory per card and how many. vLLM needs a supported GPU. NVIDIA is the main path. AMD ROCm and others are covered in the vLLM docs.
3. **Target.** Expected users at once, and a response-time goal if they have one. If they have none, say so and set a goal to measure, not a guess.
4. **Quantized model OK?** (optional) Smaller files that fit smaller cards, with some quality risk.

If your AI cannot run commands on the user's GPU machine, write the commands, say they are untested, and ask the user to paste the output of each step.

Flag names change between vLLM versions. Run `vllm serve --help` on the user's install and check each flag below against it before you use it.

## When not to use

- No GPU, or you want CPU or laptop use for one person: use llama.cpp.
- You want a quick one-off script or research test: Hugging Face transformers is simpler.
- You need the absolute top speed on NVIDIA only, and can accept a longer setup: look at TensorRT-LLM.
- You do not want to run servers. Use a hosted API instead.

## Quick start

**Install** (in a clean Python environment):
```bash
pip install vllm
```

**Start the OpenAI-compatible server** (use the user's model ID in place of `<model-id>`):
```bash
vllm serve <model-id>
```

**Test call with the OpenAI client:**
```bash
python -c "
from openai import OpenAI
client = OpenAI(base_url='http://localhost:8000/v1', api_key='EMPTY')
print(client.chat.completions.create(
    model='<model-id>',
    messages=[{'role': 'user', 'content': 'Hello!'}]
).choices[0].message.content)
"
```

Offline use, with no server (for large batches):
```python
from vllm import LLM, SamplingParams

llm = LLM(model="<model-id>")
sampling = SamplingParams(temperature=0.7, max_tokens=256)
outputs = llm.generate(["Explain quantum computing"], sampling)
print(outputs[0].outputs[0].text)
```

## Workflow 1: Production API deployment

Copy this checklist and track progress:

```
Deployment Progress:
- [ ] Step 1: Configure server settings
- [ ] Step 2: Test with limited traffic
- [ ] Step 3: Check metrics
- [ ] Step 4: Lock down access
- [ ] Step 5: Deploy and verify against your own targets
```

**Step 1: Configure server settings**

Start from these and change one setting at a time:

```bash
# A model that fits on one GPU
vllm serve <model-id> \
  --gpu-memory-utilization 0.9 \
  --max-model-len 8192 \
  --port 8000

# A model too big for one GPU: split it across GPUs
vllm serve <model-id> \
  --tensor-parallel-size 4 \
  --gpu-memory-utilization 0.9 \
  --port 8000

# A quantized model (use a model that was already quantized with this method)
vllm serve <awq-model-id> \
  --quantization awq \
  --gpu-memory-utilization 0.9 \
  --port 8000

# Repeated prompt starts, such as a long shared system prompt
vllm serve <model-id> --enable-prefix-caching
```

Tensor parallel size must divide the model's number of attention heads evenly. Two, four and eight GPUs usually work. Check the model's config, and do not assume any size will.

**Step 2: Test with limited traffic**

Send light, realistic traffic before real users. A tool such as `locust` works. Record these on the user's own setup:

- Time to first token (how long before the reply starts)
- Requests handled per second
- GPU memory use (`nvidia-smi`)
- Any out-of-memory errors in the log

Compare them with the target from "Before you start". If there was no target, write down what you measured and let the user decide if it is enough.

**Step 3: Check metrics**

The server exposes Prometheus metrics at `/metrics` on the server port. Check the vLLM docs for your version.
```bash
curl http://localhost:8000/metrics | grep vllm
```
Watch the first-token time, the number of running requests and the cache use.

**Step 4: Lock down access**

- Binding to `--host 0.0.0.0` makes the server reachable from other machines. Only do it behind a firewall or a gateway that requires sign-in.
- Set an API key (`--api-key`) or put an authenticating proxy in front of the server.
- Use `--trust-remote-code` only for a model you trust. It runs code that comes with the model.
- Never put tokens or keys in a command that is saved in shared notes.

**Step 5: Deploy and verify**

Docker gives a repeatable setup:
```bash
docker run --gpus all -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model <model-id> \
  --gpu-memory-utilization 0.9
```
Repeat the Step 2 test against it. Pass only if the numbers meet the user's targets and the logs show no out-of-memory errors.

## Workflow 2: Offline batch inference

For large sets of prompts, without a server.

```
Batch Processing:
- [ ] Step 1: Prepare input data
- [ ] Step 2: Configure the engine
- [ ] Step 3: Run batch inference
- [ ] Step 4: Save results
```

**Step 1: Prepare input data**
```python
prompts = []
with open("prompts.txt") as f:
    prompts = [line.strip() for line in f]
print(f"Loaded {len(prompts)} prompts")
```
If `prompts.txt` is missing, ask the user for it. Do not make up prompts.

**Step 2: Configure the engine**
```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="<model-id>",
    tensor_parallel_size=2,  # number of GPUs; set to 1 for a single GPU
    gpu_memory_utilization=0.9,
    max_model_len=4096
)

sampling = SamplingParams(
    temperature=0.7,
    top_p=0.95,
    max_tokens=512
)
```

**Step 3: Run**
```python
outputs = llm.generate(prompts, sampling)  # vLLM batches internally
```

**Step 4: Save results**
```python
import json
with open("results.jsonl", "w") as f:
    for output in outputs:
        f.write(json.dumps({
            "prompt": output.prompt,
            "generated": output.outputs[0].text,
            "tokens": len(output.outputs[0].token_ids),
        }) + "\n")
print(f"Processed {len(outputs)} prompts")
```

## Workflow 3: Quantized model serving

Fit a big model on less GPU memory.

```
Quantization Setup:
- [ ] Step 1: Choose the method
- [ ] Step 2: Find a pre-quantized model
- [ ] Step 3: Launch with the matching flag
- [ ] Step 4: Check quality
```

**Step 1: Choose the method**

- **AWQ**: common for large models, usually a small quality loss.
- **GPTQ**: wide model support.
- **FP8**: needs GPUs that support it, such as H100.

Check the vLLM quantization docs for which methods your GPU supports.

**Step 2: Find a pre-quantized model**

Search Hugging Face for a model already quantized with the method you chose. Use a source you trust and read its model card.

**Step 3: Launch**
```bash
vllm serve <quantized-model-id> --quantization awq --gpu-memory-utilization 0.9
```
Use the flag that matches the model's method. Read the memory use from `nvidia-smi` and report it. Do not quote a figure you did not measure.

**Step 4: Check quality**

Send the same 10 to 20 real prompts to the quantized and the full model if both fit. Compare the answers on the user's own task. Report any drop you see.

## Common issues

**Out of memory when loading**
```bash
vllm serve <model-id> --gpu-memory-utilization 0.7 --max-model-len 4096
```
Or use a quantized model.

**Slow first token**
Try `--enable-prefix-caching` for repeated prompt starts. Try `--enable-chunked-prefill` for long prompts.

**Model not found, or access denied**
Check the model ID spelling first. For gated models, check the user has accepted the licence and set their Hugging Face token. Use `--trust-remote-code` only if the model card says it needs it and you trust the source.

**Low throughput**
Check `nvidia-smi` for idle GPU time. Raise `--max-num-seqs` slowly and watch memory.

**Slower than expected on several GPUs**
Check that the GPUs are linked well and that tensor parallel size divides the attention heads. Speculative decoding can help. Its flags change by version, so check the docs.

## Output

End with these, in this order:

1. **Launch command**: the one command to start the server, in a code block.
2. **Settings table**: model, GPU count, memory use setting, context length, port, quantization, and a reason for each choice.
3. **Test result**: the test call and the reply, or "not run" with the reason.
4. **Measured numbers**: first-token time, requests per second and GPU memory, as measured, or "not measured".
5. **Go-live checklist**: access locked down, token set, logs clean, targets met. Mark each done or not done.
6. **Next**: the one thing to do next, such as a longer load test.

## Advanced topics

**Server deployment patterns**: See [references/server-deployment.md](references/server-deployment.md) for Docker, Kubernetes, and load balancing configurations.

**Performance optimization**: See [references/optimization.md](references/optimization.md) for PagedAttention tuning, continuous batching details, and benchmark results.

**Quantization guide**: See [references/quantization.md](references/quantization.md) for AWQ/GPTQ/FP8 setup, model preparation, and accuracy comparisons.

**Troubleshooting**: See [references/troubleshooting.md](references/troubleshooting.md) for detailed error messages, debugging steps, and performance diagnostics.

## Hardware

Memory needs depend on the model, the context length and the number of users. Work out the need from the model card and measure it. As a rough guide, small models fit one 24 GB to 40 GB card, and large models need several cards or a quantized version.

Supported platforms: NVIDIA (primary), AMD ROCm, Intel GPUs, TPUs. Check the vLLM docs for your hardware.

## Resources

- Official docs: https://docs.vllm.ai
- GitHub: https://github.com/vllm-project/vllm
- Paper: "Efficient Memory Management for Large Language Model Serving with PagedAttention" (SOSP 2023)
- Community: https://discuss.vllm.ai
