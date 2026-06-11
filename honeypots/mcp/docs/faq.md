# FAQ

Frequently asked questions about the MCP Server Honeypot.

## General

### What does this honeypot do?

It emulates an exposed MCP (Model Context Protocol) server on port 3000 with
deliberately vulnerable tool definitions, an unauthenticated admin panel, and
fake sensitive resources. It captures all interactions and reports events to STINGAR.

### Is this a real MCP server?

No. The honeypot emulates the MCP protocol but does not connect to any real AI
models or execute any tool calls. All responses are pre-crafted deceptions.

### What attack patterns does it detect?

- Tool enumeration and poisoning reconnaissance
- Unauthorized tool invocations
- Resource exfiltration attempts (honeytoken access)
- Admin panel access
- Prompt injection patterns

## Deployment

### What ports does it use?

- **3000** (configurable) -- the honeypot HTTP port exposed to the internet
- **24284** (internal) -- Fluent forward protocol between honeypot and Fluent Bit sidecar
- **24224** (outbound) -- telemetry forwarding to the STINGAR server

### Can I change the port?

Yes. Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"
```

### Can I run multiple honeypots on the same host?

Yes. Each honeypot should use a different host port and a unique Fluent Bit
container name.

### What architectures are supported?

The Docker image supports both `linux/amd64` and `linux/arm64`.

## Security

### Is the honeypot safe to run?

Yes. The honeypot does not execute any tool calls or attacker payloads. All
"sensitive" data exposed is fake (honeytokens) designed to trigger alerts.

### Can attackers use the honeypot to attack other systems?

No. The honeypot only responds to incoming requests -- it does not make outbound
connections to attacker-specified targets.

## Telemetry

### What data is sent to STINGAR?

Each event includes: source IP/port, timestamp, MCP method, parameters,
event classification, and session metadata.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to the container's stdout (viewable via `docker compose logs`).

### How do I verify events are reaching STINGAR?

```bash
docker compose logs fluentbit
```

Look for connection confirmations, not error messages.
