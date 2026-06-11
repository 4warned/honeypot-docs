# Architecture

Technical architecture of the Ollama CVE-2024-37032 Honeypot.

## System Overview

```
                    Internet
                       |
                  Port 11434
                       |
            ┌──────────┴──────────┐
            │   Ollama Honeypot    │
            │  (4warned/hp-ollama) │
            └──────────┬──────────┘
                       |
              Fluent Forward (24284)
                       |
            ┌──────────┴──────────┐
            │    Fluent Bit        │
            │  (4warned/fluentbit) │
            └──────────┬──────────┘
                       |
              TCP (24224)
                       |
            ┌──────────┴──────────┐
            │   STINGAR Server     │
            └─────────────────────┘
```

## CVE Emulation

The honeypot emulates CVE-2024-37032 ("Probllama") -- an SSRF vulnerability
in Ollama's `/api/pull` endpoint that allows reading/writing arbitrary files
on the server via crafted model registry URLs.

POST bodies to `/api/pull` are inspected for SSRF indicators (file:// URLs,
internal IP targets, path traversal patterns) and classified accordingly.

## Detection Capabilities

- **API enumeration** -- model listing, version probing
- **SSRF exploitation** -- malicious `/api/pull` requests
- **Prompt injection research** -- unusual generation/chat payloads

## Security

- No models are loaded or executed
- No attacker payloads are processed
- Docker network isolation between containers

## Next Steps

- [Configuration](configuration.md) -- customize the deployment
- [Running Guide](running.md) -- operation and monitoring
