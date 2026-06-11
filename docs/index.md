# STINGAR Honeypot Documentation

Welcome to the public documentation portal for **STINGAR** honeypot deployments.

Each honeypot emulates a specific vulnerable service and is designed to detect,
log, and report attacker activity to a centralized STINGAR telemetry platform.

## Available Honeypots

| Honeypot | CVE | Service | Port | Status |
|----------|-----|---------|------|--------|
| [PeopleSoft](https://honeypot-docs.readthedocs.io/projects/hp-peoplesoft/en/latest/) | CVE-2026-35273 | Oracle PeopleSoft PeopleTools 8.62 | 8000 | Active |
| [Ollama](https://honeypot-docs.readthedocs.io/projects/hp-ollama/en/latest/) | CVE-2024-37032 | Ollama LLM Inference Server | 11434 | Active |

## Architecture

All honeypots follow a common architecture:

- **HTTP-based service emulation** -- realistic endpoints, headers, and error responses
- **STINGAR integration** -- events forwarded via Fluent Bit sidecar to centralized telemetry
- **Docker deployment** -- multi-arch images published to [Docker Hub](https://hub.docker.com/)
- **Event classification** -- each interaction is categorized by type (scan, login attempt, exploit, etc.)

## Deployment

Each honeypot ships as a Docker Compose stack with two containers:

1. The honeypot service container
2. A Fluent Bit sidecar for STINGAR event forwarding

```bash
# Example: deploy the PeopleSoft honeypot
docker compose up -d
```

## Quick Links

- [Forwarned Home](https://forewarned.io)
