# Architecture

Technical architecture and design of the Ollama API Honeypot.

## System Architecture

This honeypot emulates an Ollama inference server (v0.7.1) on port 11434
using Python's stdlib `http.server`. It targets two CVEs and provides
realistic JSON responses to all standard Ollama REST API endpoints.

## Protocol Implementation

### HTTP REST API

- **Primary Port**: 11434
- **Protocol**: HTTP/1.1
- **Transport**: TCP
- **Content-Type**: application/json

### Emulated Endpoints

| Route | Method | Event Type | Purpose |
|---|---|---|---|
| `/` | GET | `ollama-scan` | Root liveness probe ("Ollama is running") |
| `/api/tags` | GET | `ollama-model-enum` | Model enumeration |
| `/api/version` | GET | `ollama-scan` | Version fingerprinting |
| `/api/ps` | GET | `ollama-scan` | Running model probe |
| `/api/generate` | POST | `ollama-generate-abuse` | Text generation (captures prompt) |
| `/api/chat` | POST | `ollama-chat-abuse` | Chat completion (captures prompt) |
| `/api/pull` | POST | `ollama-pull-ssrf` / `ollama-model-enum` | Model pull / SSRF detection |
| `/api/delete` | DELETE | `ollama-model-delete` | Model deletion |
| `/api/show` | POST | `ollama-scan` | Model metadata |
| `/api/embed` | POST | `ollama-scan` | Embedding generation |
| `/api/embeddings` | POST | `ollama-scan` | Embedding generation (alias) |

## CVE Emulation

### CVE-2024-37032 ("Probllama") -- SSRF via /api/pull

Ollama before 0.1.34 does not validate model registry hostnames.
An attacker can supply a model name with an attacker-controlled
registry prefix (e.g., `attacker.com/evil-model:latest` or
`192.168.1.100:5000/evil:latest`), causing the server to fetch
a malicious model from external infrastructure.

The honeypot detects SSRF attempts by checking whether the model
name in `/api/pull` contains a custom registry prefix (IP, FQDN,
or hostname with port before the first `/`). Detected attempts are
logged with event type `ollama-pull-ssrf` and the extracted registry
hostname.

### CVE-2025-63389 -- Unauthenticated API Access

All Ollama inference and management APIs are exposed without any
authentication. The honeypot replicates this by accepting all
requests without credentials, logging every interaction.

## Data Capture

- **Generate/Chat**: Model name and a rune-safe, 200-character-max
  truncated prompt snippet from the request body.
- **Pull**: Full model name, plus extracted SSRF registry hostname
  when a custom registry prefix is detected.
- **Delete**: Target model name.

## Fake Model Inventory

The honeypot advertises two models via `/api/tags`:
- `llama3.2:latest` (3.2B parameters, Q4_K_M)
- `llama3.1:8b` (8.0B parameters, Q4_0)

Version endpoint returns `0.7.1`. Generate and chat endpoints return
`done: true` with realistic timing fields.

## Component Overview

1. **HTTP Request Handler** (`OllamaRequestHandler`): Routes requests
   to endpoint-specific handlers, parses JSON bodies, generates responses.
2. **SSRF Detector** (`_detect_ssrf`): Regex-based detection of custom
   registry prefixes in model pull requests.
3. **Event Logger** (`_log_event`): Unified logging to console + output
   manager (Stingar / JSON file).
4. **Output Manager**: Centralized interface routing events to Stingar
   (Fluent protocol) and JSON file backends.

## Data Flow

```
HTTP Request --> OllamaRequestHandler --> Endpoint Handler --> JSON Response
                                  |
                           _log_event()
                                  |
                          Output Manager
                                  |
                    +-------------+-------------+
                    |                           |
              Stingar/Fluent              JSON File Log
                    |                           |
            Threat Intelligence          Local Analysis
```

## Security Considerations

- **Non-root User**: Runs as UID 1000 in Docker
- **Network Isolation**: Docker bridge network
- **No Real Models**: All inference responses are static fakes
- **Prompt Truncation**: Captured prompts capped at 200 characters
