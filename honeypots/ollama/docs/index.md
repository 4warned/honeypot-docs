# Ollama CVE-2024-37032 Honeypot

## Overview

A high-fidelity honeypot emulating the **Ollama LLM Inference Server** with
the SSRF vulnerability **CVE-2024-37032** ("Probllama", CVSS 9.1).

This honeypot captures attacker activity targeting Ollama instances and
forwards telemetry to a centralized STINGAR platform.

## CVE-2024-37032

| Field | Value |
|-------|-------|
| CVE ID | CVE-2024-37032 |
| CVSS Score | 9.1 (Critical) |
| Product | Ollama |
| Vulnerability | Server-Side Request Forgery (SSRF) via `/api/pull` |
| Affected Versions | < 0.1.34 |
| Attack Vector | Network (HTTP), unauthenticated |
| Impact | File read/write, potential RCE |

## Key Features

- **Realistic Ollama API emulation** -- `/api/generate`, `/api/chat`, `/api/pull`, `/api/tags`
- **SSRF detection** -- identifies exploitation of the `/api/pull` endpoint
- **Model listing** -- returns realistic model metadata
- **STINGAR integration** -- events forwarded via Fluent Bit
- **Docker deployment** -- multi-arch image with Docker Compose stack

## Emulated Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Version info |
| `/api/tags` | GET | List available models |
| `/api/generate` | POST | Text generation |
| `/api/chat` | POST | Chat completion |
| `/api/pull` | POST | **CVE attack surface** (SSRF) |
| `/api/show` | POST | Model details |
| `/api/delete` | DELETE | Model deletion |

## Quick Start

```bash
docker compose up -d

# Verify
curl http://localhost:11434/api/tags
```

## Docker Image

```bash
docker pull 4warned/hp-ollama:latest
```

Available on [Docker Hub](https://hub.docker.com/r/4warned/hp-ollama).

## Next Steps

- [Installation Guide](installation.md) -- deployment instructions
- [Configuration Guide](configuration.md) -- customize for your environment
- [Running Guide](running.md) -- operation and monitoring
- [Architecture](architecture.md) -- system design
- [Troubleshooting](troubleshooting.md) -- common issues
