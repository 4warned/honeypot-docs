# OpenClaw Honeypot

## Overview

OpenClaw is a WebSocket/JSON-RPC honeypot that emulates an AI agent gateway on port 18789. It attracts attackers who probe AI infrastructure by presenting a realistic OpenClaw API endpoint, capturing reconnaissance, enumeration, and exploitation attempts.

## Key Features

- **WebSocket/JSON-RPC emulation** -- realistic AI gateway API responses
- **Three-phase attack detection** -- recon, enumeration, exploitation
- **STINGAR integration** -- all events forwarded via Fluent Bit
- **Docker deployment** -- single `docker-compose.yml` for the complete stack

## Deployment

The honeypot is delivered as a Docker image (`4warned/hp-openclaw:latest`) and deployed using Docker Compose with a Fluent Bit sidecar for STINGAR telemetry.

## Quick Start

```bash
mkdir -p ~/honeypots/openclaw && cd ~/honeypots/openclaw
# Create docker-compose.yml and stingar-hp.env (see Installation Guide)
docker compose up -d
```

## Next Steps

- [Installation](installation.md) -- deploy the honeypot
- [Configuration](configuration.md) -- customize settings
- [Running](running.md) -- operation and monitoring
- [Architecture](architecture.md) -- how it works
- [Troubleshooting](troubleshooting.md) -- resolve issues
- [FAQ](faq.md) -- common questions
