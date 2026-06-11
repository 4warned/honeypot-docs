# FAQ

Frequently asked questions about the OpenClaw AI Gateway Honeypot.

## General

### What does this honeypot do?

It emulates an OpenClaw AI agent gateway on port 18789, presenting a WebSocket/JSON-RPC
API that attracts attackers targeting AI infrastructure. All interactions are captured
and reported to STINGAR for threat intelligence.

### Is this a real AI gateway?

No. The honeypot emulates the API responses of an OpenClaw gateway but does not
run any actual AI models or agents. No real computation occurs.

### What attack patterns does it detect?

Attackers typically follow a three-phase approach: (1) reconnaissance to discover
the API, (2) enumeration to list available tools and models, and (3) exploitation
to attempt unauthorized actions. The honeypot captures all three phases.

## Deployment

### What ports does it use?

- **18789** (configurable) -- the honeypot WebSocket/HTTP port exposed to the internet
- **24284** (internal) -- Fluent forward protocol between honeypot and Fluent Bit sidecar
- **24224** (outbound) -- telemetry forwarding to the STINGAR server

### Can I change the port?

Yes. Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:18789"
```

### Can I run multiple honeypots on the same host?

Yes. Each honeypot should use a different host port and a unique Fluent Bit
container name.

### What architectures are supported?

The Docker image supports both `linux/amd64` and `linux/arm64`.

## Security

### Is the honeypot safe to run?

Yes. The honeypot does not execute any attacker payloads. It only parses,
classifies, and logs them.

### Can attackers use the honeypot to attack other systems?

No. The honeypot only responds to incoming requests -- it does not make outbound
connections to attacker-specified targets.

## Telemetry

### What data is sent to STINGAR?

Each event includes: source IP/port, timestamp, method called, parameters,
event classification, and session metadata.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to the container's stdout (viewable via `docker compose logs`).

### How do I verify events are reaching STINGAR?

```bash
docker compose logs fluentbit
```

Look for connection confirmations, not error messages.
