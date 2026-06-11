# MCP Server Honeypot

## Overview

The MCP (Model Context Protocol) Server Honeypot emulates an exposed MCP server on port 3000. It presents deliberately vulnerable tool definitions (tool poisoning bait), an unauthenticated admin panel, and fake sensitive resources to attract and detect attackers targeting AI/LLM infrastructure.

## Key Features

- **Streamable HTTP and SSE transports** -- supports both modern and legacy MCP clients
- **Tool poisoning bait** -- exposes fake tools with vulnerable definitions
- **Unauthenticated admin panel** -- attracts privilege escalation attempts
- **Fake sensitive resources** -- honeytokens that trigger alerts on access
- **STINGAR integration** -- all events forwarded via Fluent Bit

## Deployment

The honeypot is delivered as a Docker image (`4warned/hp-mcp:latest`) and deployed using Docker Compose with a Fluent Bit sidecar for STINGAR telemetry.

## Quick Start

```bash
mkdir -p ~/honeypots/mcp && cd ~/honeypots/mcp
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
