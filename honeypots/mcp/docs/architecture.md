# Architecture

Technical architecture of the MCP Server Honeypot.

## System Overview

The honeypot is deployed as a Docker Compose stack with two containers:

```
                    Internet
                       |
                  Port 3000
                       |
            +----------+-----------+
            |   MCP Honeypot       |
            |  (4warned/hp-        |
            |   mcp:latest)        |
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

Emulates an MCP server with:

- **Streamable HTTP transport** -- modern MCP protocol (2025-11-05)
- **SSE transport** -- legacy Server-Sent Events for older clients
- **Tool definitions** -- deliberately vulnerable tool poisoning bait
- **Resource endpoints** -- fake sensitive data (honeytokens)
- **Admin panel** -- unauthenticated endpoint to attract privilege escalation

### Fluent Bit Sidecar

Receives structured events from the honeypot via Fluent forward protocol
and transmits them to the STINGAR server for centralized collection and analysis.

## Data Flow

1. Attacker connects to port 3000 (HTTP/SSE)
2. Honeypot processes MCP protocol messages and generates realistic responses
3. Interaction is classified by type (initialization, tool call, resource access, etc.)
4. Event is forwarded to Fluent Bit via the forward protocol
5. Fluent Bit delivers event to STINGAR server

## MCP Protocol Emulation

The honeypot implements MCP protocol version `2025-11-05` with:

- `initialize` -- server capability negotiation
- `tools/list` -- exposes poisoned tool definitions
- `tools/call` -- captures tool invocation attempts
- `resources/list` / `resources/read` -- honeytokens (fake API keys, credentials)
- `prompts/list` / `prompts/get` -- prompt injection detection

## Detection Capabilities

- **Tool poisoning reconnaissance** -- enumeration of vulnerable tool definitions
- **Unauthorized tool execution** -- attempts to invoke dangerous tools
- **Resource exfiltration** -- accessing fake credentials and secrets
- **Admin escalation** -- probing the unauthenticated admin panel
- **Prompt injection** -- malicious prompt patterns in tool arguments

## Security Considerations

- The honeypot does not execute any tool calls -- it only logs and responds
- All "sensitive" resources are honeytokens (fake data designed to trigger alerts)
- The Fluent Bit sidecar binds only to localhost (127.0.0.1) on the host
- Docker network isolation prevents lateral movement

## Next Steps

- [Configuration](configuration.md) -- customize the deployment
- [Running Guide](running.md) -- operation and monitoring
