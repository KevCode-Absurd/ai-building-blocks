# Import from orchestra-research/AI-research-SKILLs, 2026-10-20

98 skills found at commit 773a529. 12 ready to import, 42 to check against a skill we have, 0 to fix first, 44 skipped. Written: 54.

| Skill | Our name | Job | Licence | Decision | Closest we have | Notes |
|---|---|---|---|---|---|---|
| `0-autoresearch-skill` | Research project runner | research-topics | MIT | import | Research paper summarizer (14%), Metric-driven file improver (14%) | - |
| `01-model-architecture/litgpt` | LitGPT model trainer | build-software | MIT | check: may repeat a skill we have | LLM fine-tuning guide (25%), Tiny GPT trainer (21%) | - |
| `01-model-architecture/mamba` | - | - | MIT | skip: Library overview for one model type, no clear job for you. | Faster model reply setup (12%), Low-memory fine-tuning guide (11%) | - |
| `01-model-architecture/nanogpt` | Tiny GPT trainer | build-software | MIT | check: may repeat a skill we have | LitGPT model trainer (21%), Tokenizer trainer (14%) | - |
| `01-model-architecture/rwkv` | - | - | MIT | skip: Library overview for one model type, no clear job for you. | AI agent workflow designer (12%), Tiny GPT trainer (11%) | - |
| `01-model-architecture/torchtitan` | - | - | MIT | skip: Large-scale pretraining on hundreds of GPUs; very narrow, and overlaps the other distributed training guides. | Mixture of experts trainer (16%), Training loop tidier (16%) | - |
| `02-tokenization/huggingface-tokenizers` | Tokenizer trainer | build-software | MIT | import | Tiny GPT trainer (15%), Model preference tuning guide (12%) | - |
| `02-tokenization/sentencepiece` | - | - | MIT | skip: Near-copy of the Tokenizer trainer job; kept the Hugging Face one. | Tokenizer trainer (26%), Task language demand checker (12%) | - |
| `03-fine-tuning/axolotl` | - | - | MIT | skip: Near-copy of the fine-tuning guides; kept PEFT and TRL. | LLM fine-tuning guide (36%), Language model trainer (32%) | - |
| `03-fine-tuning/llama-factory` | - | - | MIT | skip: Thin wrapper around a library's docs; near-copy of other fine-tuning guides. | LitGPT model trainer (25%), Local AI model setup (22%) | - |
| `03-fine-tuning/peft` | Low-memory fine-tuning guide | build-software | MIT | check: may repeat a skill we have | LLM fine-tuning guide (31%), Model preference tuning guide (22%) | - |
| `03-fine-tuning/unsloth` | - | - | MIT | skip: Thin, and we already list an Unsloth fine-tuning guide from another source. | LLM fine-tuning guide (44%), Low-memory fine-tuning guide (31%) | - |
| `04-mechanistic-interpretability/nnsight` | - | - | MIT | skip: Near-copy of the Model internals inspector; also leans on a remote service. | Model internals inspector (17%), Model training recipe finder (13%) | - |
| `04-mechanistic-interpretability/pyvene` | - | - | MIT | skip: Near-copy of the Model internals inspector job. | Model internals inspector (19%), Behaviour group finder (14%) | - |
| `04-mechanistic-interpretability/saelens` | Model feature finder | research-topics | MIT | check: may repeat a skill we have | Model internals inspector (15%), Data classifier comparer (11%) | - |
| `04-mechanistic-interpretability/transformer-lens` | Model internals inspector | research-topics | MIT | import | Model feature finder (15%), Strategy doc interviewer (11%) | - |
| `05-data-processing/nemo-curator` | Training data cleaner | build-software | MIT | check: may repeat a skill we have | AI app guardrails builder (15%), Context package cleaner (12%) | - |
| `05-data-processing/ray-data` | - | - | MIT | skip: General data-processing library guide; thin on a clear job. | Model training builder (19%), Rented GPU server setup helper (18%) | - |
| `06-post-training/grpo-rl-training` | - | - | MIT | skip: Near-copy of the TRL guide, which already covers GRPO. | Language model trainer (37%), Model preference tuning guide (32%) | - |
| `06-post-training/miles` | - | - | MIT | skip: Niche reinforcement-learning framework; fork of slime; near-copy. | vLLM model server setup (15%), Mixture of experts trainer (13%) | - |
| `06-post-training/openrlhf` | - | - | MIT | skip: Near-copy of the TRL guide for large clusters. | Model preference tuning guide (26%), Language model trainer (22%) | - |
| `06-post-training/simpo` | - | - | MIT | skip: One training method already covered by the TRL guide. | Model preference tuning guide (29%), Postgres query tuner (12%) | - |
| `06-post-training/slime` | - | - | MIT | skip: Niche reinforcement-learning framework; near-copy of the TRL guide. | Model training builder (11%), Agent self-improvement loop builder (11%) | - |
| `06-post-training/torchforge` | - | - | MIT | skip: Niche reinforcement-learning framework; near-copy of the TRL guide. | Agent self-improvement loop builder (10%), Logo and brand kit designer (9%) | - |
| `06-post-training/trl-fine-tuning` | Model preference tuning guide | build-software | MIT | check: may repeat a skill we have | Language model trainer (51%), LLM fine-tuning guide (26%) | - |
| `06-post-training/verl` | - | - | MIT | skip: Near-copy of the TRL guide for large clusters. | Model preference tuning guide (31%), Language model trainer (18%) | - |
| `07-safety-alignment/constitutional-ai` | - | - | MIT | skip: Describes a training method; no clear job for you beyond the TRL guide. | Model preference tuning guide (11%), Single-point rubric builder (11%) | - |
| `07-safety-alignment/llamaguard` | - | - | MIT | skip: Near-copy of the AI app guardrails builder job. | Agent-friendly CLI designer (14%), Prompt attack detector (12%) | - |
| `07-safety-alignment/nemo-guardrails` | AI app guardrails builder | build-software | MIT | check: may repeat a skill we have | Training data cleaner (16%), Agent-friendly CLI designer (15%) | - |
| `07-safety-alignment/prompt-guard` | Prompt attack detector | build-software | MIT | check: may repeat a skill we have | AI app injection defender (18%), AI system attack tester (17%) | - |
| `08-distributed-training/accelerate` | Multi-GPU training setup helper | build-software | MIT | check: may repeat a skill we have | Training loop tidier (32%), Low-memory fine-tuning guide (12%) | - |
| `08-distributed-training/deepspeed` | - | - | MIT | skip: Near-copy of the multi-GPU setup helper; kept the simplest. | Multi-GPU training setup helper (32%), Mixture of experts trainer (22%) | - |
| `08-distributed-training/megatron-core` | - | - | MIT | skip: Very large-scale training only; near-copy of other multi-GPU guides. | vLLM model server setup (16%), Mixture of experts trainer (16%) | - |
| `08-distributed-training/pytorch-fsdp2` | - | - | MIT | skip: Near-copy of the multi-GPU setup helper. | Multi-GPU training setup helper (25%), Training loop tidier (18%) | - |
| `08-distributed-training/pytorch-lightning` | Training loop tidier | build-software | MIT | check: may repeat a skill we have | Multi-GPU training setup helper (31%), Folder tidier (14%) | - |
| `08-distributed-training/ray-train` | - | - | MIT | skip: Near-copy of the multi-GPU setup helper. | Training loop tidier (19%), Multi-GPU training setup helper (17%) | - |
| `09-infrastructure/lambda-labs` | Rented GPU server setup helper | build-software | MIT | check: may repeat a skill we have | Cloud GPU job runner (26%), FAISS similarity search builder (11%) | - |
| `09-infrastructure/modal` | Cloud GPU job runner | ship-and-host | MIT | check: may repeat a skill we have | Rented GPU server setup helper (26%), Model launch engineer (23%) | - |
| `09-infrastructure/skypilot` | - | - | MIT | skip: Near-copy of the cloud GPU guides, and needs paid cloud accounts. | Cloud GPU job runner (32%), Rented GPU server setup helper (23%) | - |
| `10-optimization/awq` | Model size reducer | build-software | MIT | check: may repeat a skill we have | vLLM model server setup (27%), Low-memory fine-tuning guide (22%) | - |
| `10-optimization/bitsandbytes` | - | - | MIT | skip: Near-copy of the Model size reducer job. | Low-memory fine-tuning guide (36%), Model size reducer (28%) | - |
| `10-optimization/flash-attention` | - | - | MIT | skip: Thin guide to one speed-up library. | vLLM model server setup (18%), Faster model reply setup (17%) | - |
| `10-optimization/gguf` | Local model converter | build-software | MIT | check: may repeat a skill we have | Local model runner for laptops (48%), Model size reducer (21%) | - |
| `10-optimization/gptq` | - | - | MIT | skip: Near-copy of the Model size reducer job. | Model size reducer (42%), Low-memory fine-tuning guide (35%) | - |
| `10-optimization/hqq` | - | - | MIT | skip: Near-copy of the Model size reducer job. | vLLM model server setup (19%), Local model converter (17%) | - |
| `10-optimization/ml-training-recipes` | Model training recipe finder | build-software | MIT | import | AI model training debugger (12%), Model training builder (12%) | - |
| `11-evaluation/bigcode-evaluation-harness` | - | - | MIT | skip: Near-copy of the benchmark runner, for code models only. | Language model benchmark runner (33%), Social media results analyst (22%) | - |
| `11-evaluation/lm-evaluation-harness` | Language model benchmark runner | build-software | MIT | check: may repeat a skill we have | Social media results analyst (17%), Subject writing frame maker (13%) | - |
| `11-evaluation/nemo-evaluator` | - | - | MIT | skip: Near-copy of the benchmark runner; heavier setup. | Language model benchmark runner (24%), Docker Compose setter (12%) | - |
| `12-inference-serving/llama-cpp` | Local model runner for laptops | build-software | MIT | check: may repeat a skill we have | Local model converter (55%), Local AI model setup (20%) | - |
| `12-inference-serving/sglang` | - | - | MIT | skip: Same job as the vLLM model server setup we list; kept the clearer one | vLLM model server setup (17%), AI data extractor builder (17%) | - |
| `12-inference-serving/tensorrt-llm` | - | - | MIT | skip: Same job as the vLLM model server setup; works only on NVIDIA datacenter GPUs | vLLM model server setup (33%), Local model runner for laptops (20%) | - |
| `12-inference-serving/vllm` | vLLM model server setup | build-software | MIT | check: may repeat a skill we have | Model size reducer (22%), Faster model reply setup (21%) | - |
| `13-mlops/mlflow` | MLflow experiment tracker | track-numbers | MIT | check: may repeat a skill we have | Model run tracker (22%), Cloud GPU job runner (16%) | - |
| `13-mlops/swanlab` | - | - | MIT | skip: Near-copy of the MLflow experiment tracker and Training curve viewer | Feature memory keeper (16%), Attribution model chooser (14%) | - |
| `13-mlops/tensorboard` | Training curve viewer | track-numbers | MIT | check: may repeat a skill we have | MATLAB chart maker (18%), MLflow experiment tracker (15%) | - |
| `13-mlops/weights-and-biases` | - | - | MIT | skip: Same job as the MLflow experiment tracker; needs a hosted account; kept the open-source one | MLflow experiment tracker (27%), Training curve viewer (20%) | - |
| `14-agents/a-evolve` | Agent self-improvement loop builder | build-software | MIT | check: may repeat a skill we have | AI answer testing planner (20%), Agent prompt writer (17%) | - |
| `14-agents/autogpt` | - | - | MIT | skip: Platform for its own visual agents; overlaps the Agent team builder | Agent team builder (21%), Research project runner (16%) | - |
| `14-agents/crewai` | Agent team builder | build-software | MIT | check: may repeat a skill we have | AI agent workflow designer (20%), AI app and chatbot builder (15%) | - |
| `14-agents/langchain` | AI app and chatbot builder | build-software | MIT | check: may repeat a skill we have | Document question answerer builder (35%), Agent team builder (22%) | - |
| `14-agents/llamaindex` | Document question answerer builder | build-software | MIT | check: may repeat a skill we have | AI app and chatbot builder (34%), Chroma search database setup (18%) | - |
| `15-rag/chroma` | Chroma search database setup | build-software | MIT | check: may repeat a skill we have | Text embedding maker (34%), FAISS similarity search builder (24%) | - |
| `15-rag/faiss` | FAISS similarity search builder | build-software | MIT | check: may repeat a skill we have | Chroma search database setup (24%), Text embedding maker (20%) | - |
| `15-rag/pinecone` | - | - | MIT | skip: Same job as the Chroma search database setup, and needs a paid hosted service | Chroma search database setup (28%), FAISS similarity search builder (16%) | - |
| `15-rag/qdrant` | - | - | MIT | skip: Near-copy of the Chroma search database setup and FAISS builder | AI app and chatbot builder (19%), Text embedding maker (18%) | - |
| `15-rag/sentence-transformers` | Text embedding maker | build-software | MIT | check: may repeat a skill we have | Chroma search database setup (33%), Embedding model trainer (26%) | - |
| `16-prompt-engineering/dspy` | DSPy prompt optimizer | build-software | MIT | import | RAG pipeline designer (13%), Online worked example builder (13%) | - |
| `16-prompt-engineering/guidance` | - | - | MIT | skip: Same job as the Guaranteed format generator and Structured data extractor | Guaranteed format generator (30%), AI data extractor builder (17%) | - |
| `16-prompt-engineering/instructor` | Structured data extractor | build-software | MIT | check: may repeat a skill we have | AI data extractor builder (23%), Guaranteed format generator (19%) | - |
| `16-prompt-engineering/outlines` | Guaranteed format generator | build-software | MIT | check: may repeat a skill we have | Structured data extractor (19%), vLLM model server setup (13%) | - |
| `17-observability/langsmith` | LangSmith AI app monitor | build-software | MIT | check: may repeat a skill we have | Phoenix AI app tracer (55%), Monitoring system planner (28%) | - |
| `17-observability/phoenix` | Phoenix AI app tracer | build-software | MIT | check: may repeat a skill we have | LangSmith AI app monitor (55%), Monitoring system planner (27%) | - |
| `18-multimodal/audiocraft` | Text to music maker | build-software | MIT | import | Stable Diffusion image maker (14%), Audio plugin writer (11%) | - |
| `18-multimodal/blip-2` | - | - | MIT | skip: Near-copy of the Image and text matcher and Picture chat assistant builder | Text embedding maker (26%), Picture chat assistant builder (26%) | - |
| `18-multimodal/clip` | Image and text matcher | build-software | MIT | check: may repeat a skill we have | Picture chat assistant builder (27%), Embedding model trainer (22%) | - |
| `18-multimodal/cosmos-policy` | - | - | MIT | skip: Narrow robot benchmark setup for one NVIDIA project; Robot model fine-tuner covers the job | Robot model fine-tuner (21%), Local model runner for laptops (13%) | - |
| `18-multimodal/llava` | Picture chat assistant builder | build-software | MIT | check: may repeat a skill we have | Image and text matcher (23%), AI assistant interface style guide writer (20%) | - |
| `18-multimodal/openpi` | Robot model fine-tuner | build-software | MIT | check: may repeat a skill we have | vLLM model server setup (18%), Low-memory fine-tuning guide (17%) | - |
| `18-multimodal/openvla-oft` | - | - | MIT | skip: Near-copy of the Robot model fine-tuner | Robot model fine-tuner (28%), LLM fine-tuning guide (17%) | - |
| `18-multimodal/segment-anything` | Image object cutter | build-software | MIT | import | Product line cutter (15%), Motion graphics video build planner (14%) | - |
| `18-multimodal/stable-diffusion` | Stable Diffusion image maker | make-images | MIT | check: may repeat a skill we have | Text embedding maker (20%), Marketing image maker (17%) | - |
| `18-multimodal/whisper` | Whisper speech transcriber | work-with-audio | MIT | check: may repeat a skill we have | Recording transcriber (20%), Meeting notes maker (20%) | - |
| `19-emerging-techniques/knowledge-distillation` | Small model trainer from a big one | build-software | MIT | import | Mixture of experts trainer (14%), Faster model reply setup (12%) | - |
| `19-emerging-techniques/long-context` | Longer context stretcher | build-software | MIT | import | Text embedding maker (12%), Faster model reply setup (12%) | - |
| `19-emerging-techniques/model-merging` | Model merger | build-software | MIT | import | Skill builder (14%), LitGPT model trainer (10%) | - |
| `19-emerging-techniques/model-pruning` | - | - | MIT | skip: Same job as the Small model trainer from a big one: make a model smaller | Faster model reply setup (16%), Model size reducer (16%) | - |
| `19-emerging-techniques/moe-training` | Mixture of experts trainer | build-software | MIT | import | Small model trainer from a big one (14%), Model training builder (13%) | - |
| `19-emerging-techniques/speculative-decoding` | Faster model reply setup | build-software | MIT | check: may repeat a skill we have | vLLM model server setup (21%), Model size reducer (16%) | - |
| `20-ml-paper-writing/academic-plotting` | Research paper figure maker | research-topics | MIT | check: may repeat a skill we have | Chart maker (25%), Python chart maker (19%) | - |
| `20-ml-paper-writing/ml-paper-writing` | AI research paper writer | research-topics | MIT | check: may repeat a skill we have | Systems paper writer (37%), Research paper figure maker (19%) | - |
| `20-ml-paper-writing/presenting-conference-talks` | Conference talk slide maker | research-topics | MIT | check: may repeat a skill we have | Document file generator (21%), LibreOffice slide builder (20%) | - |
| `20-ml-paper-writing/systems-paper-writing` | Systems paper writer | research-topics | MIT | check: may repeat a skill we have | AI research paper writer (37%), Conference talk slide maker (15%) | - |
| `21-research-ideation/brainstorming-research-ideas` | Research idea finder | research-topics | MIT | check: may repeat a skill we have | Original research idea generator (27%), Research problem picker (21%) | - |
| `21-research-ideation/creative-thinking-for-research` | Original research idea generator | research-topics | MIT | check: may repeat a skill we have | Research idea finder (28%), Subject thinking task writer (11%) | - |
| `22-agent-native-research-artifact/compiler` | Paper and repo to structured notes | research-topics | MIT | import | Code ownership analyst (11%), Deep reading guide (10%) | - |
| `22-agent-native-research-artifact/research-manager` | - | - | MIT | skip: Only works inside the ara/ folder this set creates | Feature memory keeper (16%), Paper and repo to structured notes (13%) | - |
| `22-agent-native-research-artifact/rigor-reviewer` | - | - | MIT | skip: Only works on the research folder format this set creates | Paper and repo to structured notes (14%), Pull request risk reviewer (10%) | - |
