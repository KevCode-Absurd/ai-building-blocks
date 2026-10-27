---
name: ollama-stack
description: Run local LLM workloads with Ollama, Open WebUI, and GPU-aware tuning
  for private development environments.
category: devops
risk: critical
source: https://github.com/BagelHole/DevOps-Security-Agent-Skills
source_repo: BagelHole/DevOps-Security-Agent-Skills
source_type: community
date_added: '2026-09-20'
license: MIT
license_source: https://github.com/BagelHole/DevOps-Security-Agent-Skills/blob/main/LICENSE
compatibility: Requires the relevant OS/platform tooling and privileged access where
  noted. Docs-only; helper scripts and templates not bundled.
metadata:
  author: devops-skills
  version: '1.0'
---

# Ollama Stack

Deploy a local LLM stack for offline and privacy-first workflows.

## When to Use This Skill

Use this skill when:
- Setting up private/local LLM inference for development
- Building air-gapped AI environments
- Running models on personal hardware (Mac, Linux, Windows with GPU)
- Creating team-shared inference endpoints
- Prototyping before committing to cloud LLM APIs

## When Not to Use

- You want a quick private chat and do not mind a hosted AI: use Claude, ChatGPT or Gemini and skip the setup.
- A shared server for many users or heavy production traffic: this is a single-machine setup. Look at a production inference server instead.
- A computer with under 8 GB of memory: only very small models will run.
- You are not comfortable running commands: ask a technical friend to run the steps with you.

## What You Give It

Ask once for any that are missing. If one is still missing, write MISSING and say what it changes. Never guess hardware.

1. Operating system (Windows, Mac or Linux).
2. Graphics card name and its memory (VRAM), or "Apple Silicon" and total memory, or "no graphics card".
3. What the model is for (chat, coding, searching your own documents, images in and text out).
4. Whether Docker is installed (optional).
5. Whether anyone else must reach it (optional). The default is this machine only.

## Steps

1. **Read the hardware.** Match memory to the Model Selection Guide and pick one starter model. Say why. Sizes in the table are approximate, so tell the person to check the model's page on ollama.com before pulling.
2. **Install Ollama.** Windows and Mac: the installer from ollama.com. Linux: the install command below. The person runs it themselves. Do not run installers for them without being asked.
3. **Pull and test the model.** One `ollama pull`, one `ollama run` with a short question. Say what a good result looks like.
4. **Add the browser chat screen (optional).** Docker Compose with Open WebUI. Only if Docker is installed.
5. **Add the proxy (optional).** LiteLLM only if an app needs one address for several models.
6. **Lock it down.** Keep everything on this machine unless the person asked otherwise. If they asked for access from other machines, explain the risk first and use the reverse proxy pattern in Security.
7. **Check it works.** List the checks in Output.

## Output

Return these in order.

1. **Your setup**: the hardware you read, the starter model and the reason.
2. **Install and start commands**: for the person's operating system only.
3. **Compose file**: only if Docker is used, with secrets as placeholders (see below).
4. **How to know it works**: what the person should see (the model in `ollama list`, a reply in the terminal, Open WebUI loading on `http://localhost:3000`, and a login screen).
5. **Backup and undo notes**: where model files and chat data are stored, and how to stop and remove the setup.
6. **Gaps and next steps**: every MISSING input, and one next step such as trying a second model.

Before any command that changes the machine, remind the person to back up anything important. Never put real passwords or keys in files you show. Use placeholders and tell the person to make their own.

## Prerequisites

- 8 GB+ RAM (16 GB+ recommended for 7B+ models)
- For GPU acceleration: NVIDIA GPU with 6 GB+ VRAM, or Apple Silicon Mac
- Docker (for containerized deployment)
- 20 GB+ disk for model storage

## Quick Start

The install command below is for Linux only. The Docker Compose file further down assumes an NVIDIA graphics card. Say which of your steps are for Linux, Mac, Windows or NVIDIA before you give any commands.

Windows and Mac: download the installer from ollama.com and skip the first command. Check the install script before you run it, since it runs with your account's rights.

```bash
# Install Ollama (Linux)
curl -fsSL https://ollama.com/install.sh -o /tmp/install-ollama.sh && sh /tmp/install-ollama.sh && rm /tmp/install-ollama.sh

# Start the server
ollama serve

# Pull and run a model
ollama pull llama3.1:8b
ollama run llama3.1:8b "Explain Kubernetes pods in one paragraph"

# List available models
ollama list

# Pull specific quantization
ollama pull llama3.1:8b-instruct-q4_K_M
```

## Model Selection Guide

Sizes and memory needs are approximate and the model list changes. Check each model's page on ollama.com for the current size before you pull it.

| Model | Size | VRAM | Best For |
|-------|------|------|----------|
| `llama3.1:8b` | 4.7 GB | 6 GB | General chat, coding |
| `llama3.1:70b` | 40 GB | 48 GB | Complex reasoning |
| `codellama:13b` | 7.4 GB | 10 GB | Code generation |
| `mistral:7b` | 4.1 GB | 6 GB | Fast general tasks |
| `mixtral:8x7b` | 26 GB | 32 GB | High-quality MoE |
| `nomic-embed-text` | 274 MB | 1 GB | Embeddings for RAG |
| `llava:13b` | 8 GB | 10 GB | Vision + text |
| `deepseek-coder-v2:16b` | 9 GB | 12 GB | Code generation |
| `qwen2.5:14b` | 9 GB | 12 GB | Multilingual, reasoning |

## Docker Compose — Full Stack

Notes before you use this file:

- The `deploy` block asks for an NVIDIA graphics card. Remove it for a computer with no NVIDIA card. Docker on a Mac cannot use the Apple graphics chip, so on a Mac run Ollama directly and use Compose only for Open WebUI.
- Every port is published to `127.0.0.1`, so only this machine can reach it.
- `latest` and `main` tags change over time. Pin a version for anything you rely on.
- Create a `.env` file next to this file with your own `WEBUI_SECRET_KEY` and `LITELLM_MASTER_KEY`. Make each a long random value. Do not copy a value from this page.
- The `litellm` service is optional. Delete it if you do not need one address for several models.

```yaml
# docker-compose.yml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "127.0.0.1:11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      # 0.0.0.0 is the inside of the container only. The published port above is local.
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_NUM_PARALLEL=4
      - OLLAMA_MAX_LOADED_MODELS=2
      - OLLAMA_FLASH_ATTENTION=1
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    healthcheck:
      test: ["CMD", "ollama", "list"]
      interval: 30s
      timeout: 10s
      retries: 3

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:8080"
    volumes:
      - webui_data:/app/backend/data
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_AUTH=true
      - WEBUI_SECRET_KEY=${WEBUI_SECRET_KEY:?Set WEBUI_SECRET_KEY in your .env file}
      - DEFAULT_MODELS=llama3.1:8b
    depends_on:
      ollama:
        condition: service_healthy

  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    container_name: litellm
    restart: unless-stopped
    ports:
      - "127.0.0.1:4000:4000"
    environment:
      - LITELLM_MASTER_KEY=${LITELLM_MASTER_KEY:?Set LITELLM_MASTER_KEY in your .env file}
    volumes:
      - ./litellm-config.yaml:/app/config.yaml
    command: ["--config", "/app/config.yaml"]
    depends_on:
      ollama:
        condition: service_healthy

volumes:
  ollama_data:
  webui_data:
```

### LiteLLM Proxy Config

```yaml
# litellm-config.yaml
model_list:
  - model_name: llama3
    litellm_params:
      model: ollama/llama3.1:8b
      api_base: http://ollama:11434
  - model_name: codellama
    litellm_params:
      model: ollama/codellama:13b
      api_base: http://ollama:11434
  - model_name: embeddings
    litellm_params:
      model: ollama/nomic-embed-text
      api_base: http://ollama:11434

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY  # set in your .env file, never hardcode
  max_budget: 0  # unlimited for local
```

## API Usage

Ollama exposes an OpenAI-compatible API:

```bash
# Chat completion
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": false
  }'

# Embeddings
curl http://localhost:11434/v1/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text",
    "input": "The quick brown fox"
  }'

# List models
curl http://localhost:11434/api/tags
```

### Python Client

```python
# pip install ollama
import ollama

# Chat
response = ollama.chat(
    model="llama3.1:8b",
    messages=[{"role": "user", "content": "Explain Docker in 3 sentences"}],
)
print(response["message"]["content"])

# Streaming
for chunk in ollama.chat(
    model="llama3.1:8b",
    messages=[{"role": "user", "content": "Write a haiku about containers"}],
    stream=True,
):
    print(chunk["message"]["content"], end="", flush=True)

# Embeddings
result = ollama.embed(model="nomic-embed-text", input="Hello world")
print(f"Embedding dimensions: {len(result['embeddings'][0])}")
```

### OpenAI SDK Compatibility

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="local-no-key-needed",  # the local endpoint ignores the key, but the library needs a value
)

response = client.chat.completions.create(
    model="llama3.1:8b",
    messages=[{"role": "user", "content": "Hello"}],
)
print(response.choices[0].message.content)
```

## Custom Modelfiles

Create specialized models with custom system prompts and parameters:

```dockerfile
# Modelfile.devops-assistant
FROM llama3.1:8b

SYSTEM """You are a DevOps expert assistant. You provide concise, production-ready
advice about infrastructure, CI/CD, containers, and cloud services.
Always include relevant commands and config examples."""

PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER num_ctx 8192
PARAMETER repeat_penalty 1.1
```

```bash
# Build and use custom model
ollama create devops-assistant -f Modelfile.devops-assistant
ollama run devops-assistant "Set up a GitHub Actions workflow for Docker builds"
```

## GPU Configuration

### NVIDIA

```bash
# Verify GPU access
nvidia-smi
ollama run llama3.1:8b --verbose  # Shows GPU layers loaded

# Environment tuning
export OLLAMA_NUM_PARALLEL=4          # Concurrent requests
export OLLAMA_MAX_LOADED_MODELS=2     # Models in VRAM
export OLLAMA_FLASH_ATTENTION=1       # Faster attention
export CUDA_VISIBLE_DEVICES=0,1       # Multi-GPU
```

### Apple Silicon

```bash
# Metal acceleration is automatic on macOS
# Verify with:
ollama run llama3.1:8b --verbose
# Look for: "metal" in the output

# Optimize for unified memory
export OLLAMA_NUM_PARALLEL=2          # Keep memory headroom
export OLLAMA_MAX_LOADED_MODELS=1     # One model at a time on 16GB
```

## Monitoring

```bash
# Check running models and memory usage
curl http://localhost:11434/api/ps

# Prometheus metrics (if enabled)
curl http://localhost:11434/metrics

# Quick health check script
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/api/tags)
if [ "$response" = "200" ]; then
    echo "Ollama is healthy"
    curl -s http://localhost:11434/api/ps | python3 -m json.tool
else
    echo "Ollama is down (HTTP $response)"
    exit 1
fi
```

## Systemd Service

Linux only. It binds to this machine only. Do not change the host to `0.0.0.0` unless you have put a login and a reverse proxy in front (see Security).

```ini
# /etc/systemd/system/ollama.service
[Unit]
Description=Ollama LLM Server
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=127.0.0.1"
Environment="OLLAMA_NUM_PARALLEL=4"
Environment="OLLAMA_FLASH_ATTENTION=1"
LimitNOFILE=65535

[Install]
WantedBy=default.target
```

```bash
sudo useradd -r -s /bin/false -m -d /usr/share/ollama ollama
sudo systemctl daemon-reload
sudo systemctl enable --now ollama
sudo systemctl status ollama
```

## Security

- Bind to `127.0.0.1` (the default). Ollama has no login of its own, so never expose port 11434 to a network. Use a reverse proxy with a login for remote access.
- Keep real secrets in a `.env` file, out of the Compose file, and out of any place you share.
- Set `WEBUI_AUTH=true` on Open WebUI
- Use nginx with TLS and a login for remote access. The example has a login and an IP allow-list. Do not put it on a network without a login:

```nginx
server {
    listen 443 ssl;
    server_name llm.internal.example.com;
    ssl_certificate /etc/ssl/certs/llm.pem;
    ssl_certificate_key /etc/ssl/private/llm.key;

    location / {
        proxy_pass http://127.0.0.1:11434;
        proxy_set_header Host $host;
        proxy_buffering off;              # Required for streaming
        proxy_read_timeout 600s;          # Long model responses
        auth_basic "Restricted";          # login prompt
        auth_basic_user_file /etc/nginx/.htpasswd;  # create it first, for example with the htpasswd tool
        allow 10.0.0.0/8;
        deny all;
    }
}
```

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Model too slow | Use smaller quantization (`q4_K_M`), enable flash attention |
| Out of memory | Reduce `num_ctx`, use smaller model, set `OLLAMA_MAX_LOADED_MODELS=1` |
| GPU not detected | Check `nvidia-smi`, reinstall CUDA drivers, verify Docker GPU runtime |
| Connection refused | Check `OLLAMA_HOST` setting, verify firewall rules |
| Model download fails | Check disk space and your network, then retry. Do not use `--insecure` unless you run the registry yourself and accept the risk |

## Related Skills

- mac-mini-llm-lab (`mac-mini-llm-lab`) — Apple Silicon optimization
- docker-compose (`docker-compose`) — Service orchestration
- vllm-server (`vllm-server`) — High-throughput production inference
- llm-gateway (`llm-gateway`) — Unified API routing

## Limitations

- Infrastructure commands can disrupt services: confirm target host/scope and have backups/snapshots before mutating state.
- Docs-only import: upstream scripts and templates not bundled.

