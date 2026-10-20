# Import from orchestra-research/AI-research-SKILLs, 2026-10-20

49 skills found at commit 773a529. 35 ready to import, 0 to check against a skill we have, 0 to fix first, 14 skipped. Dry run: nothing written.

| Skill | Our name | Job | Licence | Decision | Closest we have | Notes |
|---|---|---|---|---|---|---|
| `12-inference-serving/llama-cpp` | Local model runner for laptops | build-software | MIT | import | - | - |
| `12-inference-serving/sglang` | - | - | MIT | skip: Same job as the vLLM model server setup we list; kept the clearer one | AI workflow handoff planner (8%) | - |
| `12-inference-serving/tensorrt-llm` | - | - | MIT | skip: Same job as the vLLM model server setup; works only on NVIDIA datacenter GPUs | - | - |
| `12-inference-serving/vllm` | vLLM model server setup | build-software | MIT | import | Price-first cost planner (8%), AI model training debugger (7%) | - |
| `13-mlops/mlflow` | MLflow experiment tracker | track-numbers | MIT | import | Direct selling model check (11%), AI model training debugger (9%) | - |
| `13-mlops/swanlab` | - | - | MIT | skip: Near-copy of the MLflow experiment tracker and Training curve viewer | Online media buy auditor (11%), Workflow builder from a long source (9%) | - |
| `13-mlops/tensorboard` | Training curve viewer | track-numbers | MIT | import | Google Ads report auditor (12%), Pre-launch ad checker (7%) | - |
| `13-mlops/weights-and-biases` | - | - | MIT | skip: Same job as the MLflow experiment tracker; needs a hosted account; kept the open-source one | AI model training debugger (8%), MVP experiment planner (6%) | - |
| `14-agents/a-evolve` | Agent self-improvement loop builder | build-software | MIT | import | Honest persuasion editor (8%), AI coding agent rules writer (7%) | - |
| `14-agents/autogpt` | - | - | MIT | skip: Platform for its own visual agents; overlaps the Agent team builder | Direct selling model check (10%), Visual system rules writer (9%) | - |
| `14-agents/crewai` | Agent team builder | build-software | MIT | import | New leader first message writer (10%), Role task breakdown for AI help (9%) | - |
| `14-agents/langchain` | AI app and chatbot builder | build-software | MIT | import | AI coding agent rules writer (7%), Earnings value range builder (7%) | - |
| `14-agents/llamaindex` | Document question answerer builder | build-software | MIT | import | Selling points writer (9%), Prospecting block planner (7%) | - |
| `15-rag/chroma` | Chroma search database setup | build-software | MIT | import | Local production opportunity scanner (9%), Get a full product photoshoot from phone photos (8%) | - |
| `15-rag/faiss` | FAISS similarity search builder | build-software | MIT | import | Decision checklist runner (7%), Google Ads report auditor (7%) | - |
| `15-rag/pinecone` | - | - | MIT | skip: Same job as the Chroma search database setup, and needs a paid hosted service | Local production opportunity scanner (9%) | - |
| `15-rag/qdrant` | - | - | MIT | skip: Near-copy of the Chroma search database setup and FAISS builder | Google Ads report auditor (8%), Business value range calculator (6%) | - |
| `15-rag/sentence-transformers` | Text embedding maker | build-software | MIT | import | Specific knowledge finder (8%), Icon set planner (6%) | - |
| `16-prompt-engineering/dspy` | DSPy prompt optimizer | build-software | MIT | import | AI coding agent rules writer (8%), AI model training debugger (7%) | - |
| `16-prompt-engineering/guidance` | - | - | MIT | skip: Same job as the Guaranteed format generator and Structured data extractor | Site search basics checker (9%), Input metric picker (8%) | - |
| `16-prompt-engineering/instructor` | Structured data extractor | build-software | MIT | import | Coupon and form fixer (7%), Learning milestone planner (7%) | - |
| `16-prompt-engineering/outlines` | Guaranteed format generator | build-software | MIT | import | Sales letter outline planner (9%), Delivery option generator (9%) | - |
| `17-observability/langsmith` | LangSmith AI app monitor | build-software | MIT | import | Usability heuristic reviewer (9%), Input metric picker (9%) | - |
| `17-observability/phoenix` | Phoenix AI app tracer | build-software | MIT | import | Problem root cause tracer (10%), Startup idea tester (9%) | - |
| `18-multimodal/audiocraft` | Text to music maker | build-software | MIT | import | Video ad edit planner (9%), Founder video ad script writer (9%) | - |
| `18-multimodal/blip-2` | - | - | MIT | skip: Near-copy of the Image and text matcher and Picture chat assistant builder | Reference-style product photo maker (8%), Chat screenshot image ad maker (8%) | - |
| `18-multimodal/clip` | Image and text matcher | build-software | MIT | import | Claim and proof matcher (10%), AI model training debugger (9%) | - |
| `18-multimodal/cosmos-policy` | - | - | MIT | skip: Narrow robot benchmark setup for one NVIDIA project; Robot model fine-tuner covers the job | - | - |
| `18-multimodal/llava` | Picture chat assistant builder | build-software | MIT | import | AI model training debugger (9%), Fact-based ad copy writer (8%) | - |
| `18-multimodal/openpi` | Robot model fine-tuner | build-software | MIT | import | AI model training debugger (13%), Landing page 30-point checker (6%) | - |
| `18-multimodal/openvla-oft` | - | - | MIT | skip: Near-copy of the Robot model fine-tuner | AI model training debugger (12%), Invented society planner (9%) | - |
| `18-multimodal/segment-anything` | Image object cutter | build-software | MIT | import | Product line cutter (13%), Motion graphics video build planner (10%) | - |
| `18-multimodal/stable-diffusion` | Stable Diffusion image maker | make-images | MIT | import | Shopify theme code writer (10%), Image ad maker with exact text (9%) | - |
| `18-multimodal/whisper` | Whisper speech transcriber | work-with-audio | MIT | import | Workflow builder from a long source (10%), Plain English editor (8%) | - |
| `19-emerging-techniques/knowledge-distillation` | Small model trainer from a big one | build-software | MIT | import | No-brainer question settler (6%), Name family planner (6%) | - |
| `19-emerging-techniques/long-context` | Longer context stretcher | build-software | MIT | import | Icon set planner (7%), Second-order effects tracer (7%) | - |
| `19-emerging-techniques/model-merging` | Model merger | build-software | MIT | import | Sales agent training planner (8%), Culture-fit hiring planner (6%) | - |
| `19-emerging-techniques/model-pruning` | - | - | MIT | skip: Same job as the Small model trainer from a big one: make a model smaller | One-symbol concept finder (8%), Blitzscale readiness checker (6%) | - |
| `19-emerging-techniques/moe-training` | Mixture of experts trainer | build-software | MIT | import | - | - |
| `19-emerging-techniques/speculative-decoding` | Faster model reply setup | build-software | MIT | import | Blitzscale readiness checker (9%), Give before ask sequence planner (8%) | - |
| `20-ml-paper-writing/academic-plotting` | Research paper figure maker | research-topics | MIT | import | Tracker chart image ad maker (7%), Landing page design planner (7%) | - |
| `20-ml-paper-writing/ml-paper-writing` | AI research paper writer | research-topics | MIT | import | Visual system rules writer (8%) | - |
| `20-ml-paper-writing/presenting-conference-talks` | Conference talk slide maker | research-topics | MIT | import | Talk tension planner (10%), Founder video ad script writer (8%) | - |
| `20-ml-paper-writing/systems-paper-writing` | Systems paper writer | research-topics | MIT | import | Visual system rules writer (9%), Writing log reviewer (9%) | - |
| `21-research-ideation/brainstorming-research-ideas` | Research idea finder | research-topics | MIT | import | Pivot or persevere decider (11%), Early or broken checker (9%) | - |
| `21-research-ideation/creative-thinking-for-research` | Original research idea generator | research-topics | MIT | import | Unlikely pairing idea generator (9%), Serial story planner (7%) | - |
| `22-agent-native-research-artifact/compiler` | Paper and repo to structured notes | research-topics | MIT | import | Function purity refactor planner (9%), Usability heuristic reviewer (7%) | - |
| `22-agent-native-research-artifact/research-manager` | - | - | MIT | skip: Only works inside the ara/ folder this set creates | AI coding agent rules writer (11%), Usability heuristic reviewer (10%) | - |
| `22-agent-native-research-artifact/rigor-reviewer` | - | - | MIT | skip: Only works on the research folder format this set creates | Stalled deal indecision checker (8%), Hardest objections answer writer (8%) | - |
