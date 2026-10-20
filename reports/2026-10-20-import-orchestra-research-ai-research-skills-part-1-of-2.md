# Import from orchestra-research/AI-research-SKILLs, 2026-10-20

49 skills found at commit 773a529. 17 ready to import, 2 to check against a skill we have, 0 to fix first, 30 skipped. Dry run: nothing written.

| Skill | Our name | Job | Licence | Decision | Closest we have | Notes |
|---|---|---|---|---|---|---|
| `0-autoresearch-skill` | Research project runner | research-topics | MIT | import | AI coding agent rules writer (8%), Writing log reviewer (8%) | - |
| `01-model-architecture/litgpt` | LitGPT model trainer | build-software | MIT | import | AI model training debugger (15%), AI-fit problem checker (7%) | - |
| `01-model-architecture/mamba` | - | - | MIT | skip: Library overview for one model type, no clear job for you. | Blitzscale readiness checker (7%), Thought experiment planner (7%) | - |
| `01-model-architecture/nanogpt` | Tiny GPT trainer | build-software | MIT | import | Image ad maker with exact text (11%), AI model training debugger (9%) | - |
| `01-model-architecture/rwkv` | - | - | MIT | skip: Library overview for one model type, no clear job for you. | AI model training debugger (9%), Image ad maker with exact text (6%) | - |
| `01-model-architecture/torchtitan` | - | - | MIT | skip: Large-scale pretraining on hundreds of GPUs; very narrow, and overlaps the other distributed training guides. | - | - |
| `02-tokenization/huggingface-tokenizers` | Tokenizer trainer | build-software | MIT | import | - | - |
| `02-tokenization/sentencepiece` | - | - | MIT | skip: Near-copy of the Tokenizer trainer job; kept the Hugging Face one. | Culture-fit hiring planner (7%) | - |
| `03-fine-tuning/axolotl` | - | - | MIT | skip: Near-copy of the fine-tuning guides; kept PEFT and TRL. | AI model training debugger (9%) | - |
| `03-fine-tuning/llama-factory` | - | - | MIT | skip: Thin wrapper around a library's docs; near-copy of other fine-tuning guides. | AI model training debugger (11%), Plain words interface rewriter (10%) | - |
| `03-fine-tuning/peft` | Low-memory fine-tuning guide | build-software | MIT | check: may repeat a skill we have | AI model training debugger (16%), Jingle video ad script writer (7%) | - |
| `03-fine-tuning/unsloth` | - | - | MIT | skip: Thin, and we already list an Unsloth fine-tuning guide from another source. | AI model training debugger (15%), Landing page 30-point checker (10%) | - |
| `04-mechanistic-interpretability/nnsight` | - | - | MIT | skip: Near-copy of the Model internals inspector; also leans on a remote service. | Honest persuasion editor (7%), Seven powers scorecard builder (7%) | - |
| `04-mechanistic-interpretability/pyvene` | - | - | MIT | skip: Near-copy of the Model internals inspector job. | AI model training debugger (7%), Brand and sales budget splitter (7%) | - |
| `04-mechanistic-interpretability/saelens` | Model feature finder | research-topics | MIT | import | Specific knowledge finder (7%), AI model training debugger (7%) | - |
| `04-mechanistic-interpretability/transformer-lens` | Model internals inspector | research-topics | MIT | import | One-change experiment planner (7%), Honest persuasion editor (6%) | - |
| `05-data-processing/nemo-curator` | Training data cleaner | build-software | MIT | import | Customer buying reasons finder (6%), AI model training debugger (6%) | - |
| `05-data-processing/ray-data` | - | - | MIT | skip: General data-processing library guide; thin on a clear job. | AI model training debugger (9%), Prospecting block planner (7%) | - |
| `06-post-training/grpo-rl-training` | - | - | MIT | skip: Near-copy of the TRL guide, which already covers GRPO. | AI model training debugger (21%), Expert and newcomer test planner (8%) | - |
| `06-post-training/miles` | - | - | MIT | skip: Niche reinforcement-learning framework; fork of slime; near-copy. | AI model training debugger (7%), Ad test brief writer (7%) | - |
| `06-post-training/openrlhf` | - | - | MIT | skip: Near-copy of the TRL guide for large clusters. | Guide outreach list planner (10%), Sales route plan builder (7%) | - |
| `06-post-training/simpo` | - | - | MIT | skip: One training method already covered by the TRL guide. | Ownable word picker (9%), Blitzscale readiness checker (8%) | - |
| `06-post-training/slime` | - | - | MIT | skip: Niche reinforcement-learning framework; near-copy of the TRL guide. | AI model training debugger (10%), Workflow builder from a long source (7%) | - |
| `06-post-training/torchforge` | - | - | MIT | skip: Niche reinforcement-learning framework; near-copy of the TRL guide. | Competitor ad gap finder (8%), Competitor ad swipe file builder (7%) | - |
| `06-post-training/trl-fine-tuning` | Model preference tuning guide | build-software | MIT | check: may repeat a skill we have | AI model training debugger (16%), Feedback request script writer (8%) | - |
| `06-post-training/verl` | - | - | MIT | skip: Near-copy of the TRL guide for large clusters. | Growth engine finder (7%), Ad first line writer and scorer (6%) | - |
| `07-safety-alignment/constitutional-ai` | - | - | MIT | skip: Describes a training method; no clear job for you beyond the TRL guide. | Who-keeps-the-gain tester (8%), Identity system planner (8%) | - |
| `07-safety-alignment/llamaguard` | - | - | MIT | skip: Near-copy of the AI app guardrails builder job. | Input metric picker (7%) | - |
| `07-safety-alignment/nemo-guardrails` | AI app guardrails builder | build-software | MIT | import | Input metric picker (8%), Error warning and recovery designer (6%) | - |
| `07-safety-alignment/prompt-guard` | Prompt attack detector | build-software | MIT | import | Publicity-first launch planner (10%), Single image ad planner (9%) | - |
| `08-distributed-training/accelerate` | Multi-GPU training setup helper | build-software | MIT | import | - | - |
| `08-distributed-training/deepspeed` | - | - | MIT | skip: Near-copy of the multi-GPU setup helper; kept the simplest. | Prospecting block planner (6%) | - |
| `08-distributed-training/megatron-core` | - | - | MIT | skip: Very large-scale training only; near-copy of other multi-GPU guides. | - | - |
| `08-distributed-training/pytorch-fsdp2` | - | - | MIT | skip: Near-copy of the multi-GPU setup helper. | Inside-the-mind scene writer (8%), AI model training debugger (7%) | - |
| `08-distributed-training/pytorch-lightning` | Training loop tidier | build-software | MIT | import | Function purity refactor planner (8%), Owner earnings calculator (7%) | - |
| `08-distributed-training/ray-train` | - | - | MIT | skip: Near-copy of the multi-GPU setup helper. | AI model training debugger (17%), Switch story mapper (7%) | - |
| `09-infrastructure/lambda-labs` | Rented GPU server setup helper | build-software | MIT | import | Shopify landing page builder (7%), Daily writing session planner (6%) | - |
| `09-infrastructure/modal` | Cloud GPU job runner | ship-and-host | MIT | import | Customer discovery interview planner (7%), Image style picker for story ads (7%) | - |
| `09-infrastructure/skypilot` | - | - | MIT | skip: Near-copy of the cloud GPU guides, and needs paid cloud accounts. | AI model training debugger (8%), Get image ads strangers stop scrolling for (7%) | - |
| `10-optimization/awq` | Model size reducer | build-software | MIT | import | Plain words interface rewriter (8%), Digital tool audit planner (7%) | - |
| `10-optimization/bitsandbytes` | - | - | MIT | skip: Near-copy of the Model size reducer job. | Cost versus revenue reset planner (7%), AI model training debugger (6%) | - |
| `10-optimization/flash-attention` | - | - | MIT | skip: Thin guide to one speed-up library. | Give before ask sequence planner (8%), Cost versus revenue reset planner (7%) | - |
| `10-optimization/gguf` | Local model converter | build-software | MIT | import | Findings and guesses separator (6%) | - |
| `10-optimization/gptq` | - | - | MIT | skip: Near-copy of the Model size reducer job. | AI model training debugger (11%) | - |
| `10-optimization/hqq` | - | - | MIT | skip: Near-copy of the Model size reducer job. | Share or protect decision brief writer (6%), AI-fit problem checker (6%) | - |
| `10-optimization/ml-training-recipes` | Model training recipe finder | build-software | MIT | import | AI model training debugger (14%) | - |
| `11-evaluation/bigcode-evaluation-harness` | - | - | MIT | skip: Near-copy of the benchmark runner, for code models only. | Defensive stock list builder (9%), AI coding agent rules writer (9%) | - |
| `11-evaluation/lm-evaluation-harness` | Language model benchmark runner | build-software | MIT | import | Defensive stock list builder (8%), Repeatable standards sheet writer (7%) | - |
| `11-evaluation/nemo-evaluator` | - | - | MIT | skip: Near-copy of the benchmark runner; heavier setup. | - | - |
