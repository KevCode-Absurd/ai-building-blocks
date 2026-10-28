---
name: llama-cpp
description: Runs LLM inference on CPU, Apple Silicon, and consumer GPUs without NVIDIA hardware. Use for edge deployment, M1/M2/M3 Macs, AMD/Intel GPUs, or when CUDA is unavailable. Supports GGUF quantization (1.5-8 bit) for reduced memory and 4-10× speedup vs PyTorch on CPU.
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Inference Serving, Llama.cpp, CPU Inference, Apple Silicon, Edge Deployment, GGUF, Quantization, Non-NVIDIA, AMD GPUs, Intel GPUs, Embedded]
dependencies: [llama-cpp-python]
---

# llama.cpp

Pure C/C++ LLM inference with minimal dependencies, optimized for CPUs and non-NVIDIA hardware.

**Source check by AI Blocks, 28 Oct 2026:** The [llama.cpp build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md) confirms CMake. The [project options](https://github.com/ggml-org/llama.cpp/blob/master/ggml/CMakeLists.txt) include GGML_METAL, GGML_CUDA and GGML_HIP. CPU, Metal, CUDA and ROCm builds were not run here. GPU toolchains and output paths depend on your platform and CMake generator; check the backend guide for your machine.

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

## When to use llama.cpp

**Use llama.cpp when:**
- Running on CPU-only machines
- Deploying on Apple Silicon (M1/M2/M3/M4)
- Using AMD or Intel GPUs (no CUDA)
- Edge deployment (Raspberry Pi, embedded systems)
- Need simple deployment without Docker/Python

**Use TensorRT-LLM instead when:**
- Have NVIDIA GPUs (A100/H100)
- Need maximum throughput (100K+ tok/s)
- Running in datacenter with CUDA

**Use vLLM instead when:**
- Have NVIDIA GPUs
- Need Python-first API
- Want PagedAttention

## Quick start

### Installation

```bash
# macOS/Linux
brew install llama.cpp

# Or build from source
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

# Default build (some platforms enable a GPU backend by default)
cmake -B build
cmake --build build --config Release

# With Metal (Apple Silicon)
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release

# With CUDA (NVIDIA)
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release

# With ROCm (AMD)
cmake -B build -DGGML_HIP=ON
cmake --build build --config Release
```

AI Blocks note: the original skill used older `make LLAMA_...` flags. We replaced them with the CMake commands current releases use. Look for the programs under `build/bin/`; some CMake generators put release binaries in a configuration subfolder. Check the llama.cpp build docs for your version before you run these commands. If the build fails, report the exact error and do not guess a fix.

### Download model

```bash
# Download from HuggingFace (GGUF format)
huggingface-cli download \
    TheBloke/Llama-2-7B-Chat-GGUF \
    llama-2-7b-chat.Q4_K_M.gguf \
    --local-dir models/

# Or convert from HuggingFace
python convert_hf_to_gguf.py models/llama-2-7b-chat/
```

### Run inference

```bash
# Simple chat (-n 256 sets the maximum number of tokens)
./llama-cli \
    -m models/llama-2-7b-chat.Q4_K_M.gguf \
    -p "Explain quantum computing" \
    -n 256

# Interactive chat
./llama-cli \
    -m models/llama-2-7b-chat.Q4_K_M.gguf \
    --interactive
```

### Server mode

Warning: `--host 0.0.0.0` would make the server reachable from every other device on your network, with no password. Keep `127.0.0.1` for a single laptop. Use `0.0.0.0` only on a network you trust, and put a login in front of it first.

```bash
# Start OpenAI-compatible server. 127.0.0.1 lets only this computer reach it.
# -ngl 32 offloads 32 layers to the GPU.
./llama-server \
    -m models/llama-2-7b-chat.Q4_K_M.gguf \
    --host 127.0.0.1 \
    --port 8080 \
    -ngl 32

# Client request (run this in a second terminal)
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-2-7b-chat",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

## Quantization formats

### GGUF format overview

| Format | Bits | Size (7B) | Speed | Quality | Use Case |
|--------|------|-----------|-------|---------|----------|
| **Q4_K_M** | 4.5 | 4.1 GB | Fast | Good | **Recommended default** |
| Q4_K_S | 4.3 | 3.9 GB | Faster | Lower | Speed critical |
| Q5_K_M | 5.5 | 4.8 GB | Medium | Better | Quality critical |
| Q6_K | 6.5 | 5.5 GB | Slower | Best | Maximum quality |
| Q8_0 | 8.0 | 7.0 GB | Slow | Excellent | Minimal degradation |
| Q2_K | 2.5 | 2.7 GB | Fastest | Poor | Testing only |

### Choosing quantization

```bash
# General use (balanced)
Q4_K_M  # 4-bit, medium quality

# Maximum speed (more degradation)
Q2_K or Q3_K_M

# Maximum quality (slower)
Q6_K or Q8_0

# Very large models (70B, 405B)
Q3_K_M or Q4_K_S  # Lower bits to fit in memory
```

## Hardware acceleration

### Apple Silicon (Metal)

```bash
# Build with Metal
cmake -B build -DGGML_METAL=ON && cmake --build build --config Release

# Run with GPU acceleration (automatic)
# -ngl 999 offloads all layers
./llama-cli -m model.gguf -ngl 999

# Speed varies a lot by chip, model and settings. The original author's example figure is not a promise for your computer.
```

### NVIDIA GPUs (CUDA)

```bash
# Build with CUDA
cmake -B build -DGGML_CUDA=ON && cmake --build build --config Release

# Offload 35 of 40 layers to the GPU
./llama-cli -m model.gguf -ngl 35

# Hybrid CPU+GPU for large models: 20 layers on the GPU, the rest on the CPU
./llama-cli -m llama-70b.Q4_K_M.gguf -ngl 20
```

### AMD GPUs (ROCm)

```bash
# Build with ROCm
cmake -B build -DGGML_HIP=ON && cmake --build build --config Release

# Run with AMD GPU
./llama-cli -m model.gguf -ngl 999
```

## Common patterns

### Batch processing

```bash
# Process multiple prompts from file
cat prompts.txt | ./llama-cli \
    -m model.gguf \
    --batch-size 512 \
    -n 100
```

### Constrained generation

```bash
# JSON output with grammar
./llama-cli \
    -m model.gguf \
    -p "Generate a person: " \
    --grammar-file grammars/json.gbnf

# Outputs valid JSON only
```

### Context size

```bash
# Increase context (default 512). -c 4096 is a 4K window.
./llama-cli \
    -m model.gguf \
    -c 4096

# Very long context (if the model supports it). -c 32768 is a 32K window.
./llama-cli -m model.gguf -c 32768
```

## Performance benchmarks

AI Blocks note: the speeds, speedups and prices below are the original author's example figures. The hardware and test conditions are not stated, so treat them as a rough sense of scale. Never quote them as the user's expected speed or cost.

### CPU performance (Llama 2-7B Q4_K_M)

| CPU | Threads | Speed | Cost |
|-----|---------|-------|------|
| Apple M3 Max | 16 | 50 tok/s | $0 (local) |
| AMD Ryzen 9 7950X | 32 | 35 tok/s | $0.50/hour |
| Intel i9-13900K | 32 | 30 tok/s | $0.40/hour |
| AWS c7i.16xlarge | 64 | 40 tok/s | $2.88/hour |

### GPU acceleration (Llama 2-7B Q4_K_M)

| GPU | Speed | vs CPU | Cost |
|-----|-------|--------|------|
| NVIDIA RTX 4090 | 120 tok/s | 3-4× | $0 (local) |
| NVIDIA A10 | 80 tok/s | 2-3× | $1.00/hour |
| AMD MI250 | 70 tok/s | 2× | $2.00/hour |
| Apple M3 Max (Metal) | 50 tok/s | ~Same | $0 (local) |

## Supported models

**LLaMA family**:
- Llama 2 (7B, 13B, 70B)
- Llama 3 (8B, 70B, 405B)
- Code Llama

**Mistral family**:
- Mistral 7B
- Mixtral 8x7B, 8x22B

**Other**:
- Falcon, BLOOM, GPT-J
- Phi-3, Gemma, Qwen
- LLaVA (vision), Whisper (audio)

**Find models**: https://huggingface.co/models?library=gguf

## References

- **[Quantization Guide](references/quantization.md)** - GGUF formats, conversion, quality comparison
- **[Server Deployment](references/server.md)** - API endpoints, Docker, monitoring
- **[Optimization](references/optimization.md)** - Performance tuning, hybrid CPU+GPU

## Resources

- **GitHub**: https://github.com/ggml-org/llama.cpp
- **Models**: https://huggingface.co/models?library=gguf
- **Discord**: https://discord.gg/llama-cpp

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Simple code coach](https://useaiblocks.com/skills/simple-code-coach). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
