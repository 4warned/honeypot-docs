# STINGAR Honeypot Documentation

Welcome to the public documentation portal for **STINGAR** honeypot deployments.

Each honeypot emulates a specific vulnerable service or monitors network activity,
and is designed to detect, log, and report attacker activity to a centralized
STINGAR telemetry platform.

## Available Honeypots

| Honeypot | Type | Description | Port | Documentation |
|----------|------|-------------|------|---------------|
| PeopleSoft | CVE Emulation | Oracle PeopleSoft RCE (CVE-2026-35273) | 8000 | [Docs](https://hp-peoplesoft.readthedocs.io/en/latest/) |
| Ollama | CVE Emulation | Ollama LLM SSRF (CVE-2024-37032) | 11434 | [Docs](https://hp-ollama.readthedocs.io/en/latest/) |
| OpenClaw | AI Gateway | WebSocket/JSON-RPC AI agent gateway | 18789 | [Docs](https://hp-openclaw.readthedocs.io/en/latest/) |
| MCP Server | AI Infrastructure | Model Context Protocol server with tool poisoning | 3000 | [Docs](https://hp-mcp.readthedocs.io/en/latest/) |
| Trainpot | AI Scraper Detection | Detects AI crawlers and LLM training scrapers | 80/443 | [Docs](https://hp-trainpot.readthedocs.io/en/latest/) |
| SYNsor | Packet Monitor | Multi-protocol packet monitoring (TCP/ICMP/UDP) | Host | [Docs](https://hp-synsor.readthedocs.io/en/latest/) |

## Architecture

All honeypots follow a common architecture:

- **Service emulation** -- realistic protocols, endpoints, headers, and responses
- **STINGAR integration** -- events forwarded via Fluent Bit sidecar to centralized telemetry
- **Docker deployment** -- multi-arch images published to [Docker Hub](https://hub.docker.com/)
- **Event classification** -- each interaction is categorized by type (scan, exploit, recon, etc.)

## Deployment

Each honeypot ships as a Docker Compose stack with two containers:

1. The honeypot service container
2. A Fluent Bit sidecar for STINGAR event forwarding

```bash
docker compose up -d
```

See individual honeypot documentation for specific deployment instructions.

## Quick Links

- [Forewarned Home](https://forewarned.io)
