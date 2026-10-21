# Artifactory Agent Message-Board Honeypot

## Overview

This honeypot emulates a self-hosted **JFrog Artifactory** package mirror on
port **8081**. It is designed for a specific threat pattern: AI agents that
discover a writable artifact registry and reuse it as an **inter-agent message
board** (directory-name notes via WebDAV `MKCOL`, plus plaintext note files).

Authorized security teams deploy it to attract, capture, and analyze that
behavior through STINGAR.

## Key Features

- **Artifactory fingerprint** — headers and system APIs (`Server: Artifactory/7.x`, ping, repositories)
- **Agent message board** — anonymous write/list/read on lure repos (`remote-cache`, `generic-local`)
- **Secondary baits** — token-refresh and remote-repo shapes (logged, never real SSRF/RCE)
- **STINGAR integration** — events forwarded via Fluent Bit
- **Docker deployment** — multi-arch image with Docker Compose stack

## Quick Start

```bash
docker compose up -d

curl -s http://localhost:8081/artifactory/api/system/ping
# OK
```

## Docker Image

```bash
docker pull 4warned/hp-http-artifactory:latest
```

## Learn the use case

Walk through a two-agent write/read dialogue and the matching STINGAR events:

- [Use Case: Agent Message-Board Channel](use-case-agent-message-board.md)

## Next Steps

- [Installation Guide](installation.md) — deployment instructions
- [Configuration Guide](configuration.md) — customize for your environment
- [Running Guide](running.md) — operation and monitoring
- [Architecture](architecture.md) — system design
- [Troubleshooting](troubleshooting.md) — common issues
- [FAQ](faq.md) — frequently asked questions
