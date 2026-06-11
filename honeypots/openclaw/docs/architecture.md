# Architecture

Technical architecture of the OpenClaw AI Gateway Honeypot.

## System Overview

The honeypot is deployed as a Docker Compose stack with two containers:

```
                    Internet
                       |
                 Port 18789
                       |
            +----------+-----------+
            |  OpenClaw Honeypot   |
            |  (4warned/hp-        |
            |   openclaw:latest)   |
            +----------+-----------+
                       |
               Fluent Forward
              (port 24284, internal)
                       |
            +----------+-----------+
            |    Fluent Bit        |
            |  (4warned/fluentbit) |
            +----------+-----------+
                       |
              TCP port 24224
                       |
            +----------+-----------+
            |   STINGAR Server     |
            |  (centralized        |
            |   telemetry)         |
            +-----------------------+
```

## Components

### Honeypot Container

Emulates an OpenClaw AI agent gateway with:

- **WebSocket endpoint** -- accepts WS upgrade and JSON-RPC messages
- **HTTP fallback** -- serves realistic discovery responses for non-WS clients
- **JSON-RPC API** -- exposes fake tools, models, and agent capabilities

### Fluent Bit Sidecar

Receives structured events from the honeypot via Fluent forward protocol
and transmits them to the STINGAR server for centralized collection and analysis.

## Data Flow

1. Attacker connects to port 18789 (HTTP or WebSocket)
2. Honeypot processes request and generates realistic gateway responses
3. Interaction is classified by phase (recon, enumeration, exploitation)
4. Event is forwarded to Fluent Bit via the forward protocol
5. Fluent Bit delivers event to STINGAR server

## Detection Capabilities

The honeypot detects:

- **Reconnaissance** -- HTTP probes, endpoint discovery, version fingerprinting
- **Enumeration** -- listing tools, models, agents via JSON-RPC
- **Exploitation** -- unauthorized method calls, privilege escalation attempts
- **Persistence** -- repeated connections, session hijacking attempts

## Security Considerations

- The honeypot does not execute any attacker payloads -- it only logs and responds
- The Fluent Bit sidecar binds only to localhost (127.0.0.1) on the host
- All containers run with `restart: unless-stopped` for resilience
- Docker network isolation prevents lateral movement

## Next Steps

- [Configuration](configuration.md) -- customize the deployment
- [Running Guide](running.md) -- operation and monitoring
