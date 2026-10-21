# FAQ

Frequently asked questions about HTTP Artifactory Honeypot.

## General

### What does this honeypot do?

It emulates a HTTP service on port 8081.
All attacker interactions are logged and forwarded to a centralized STINGAR
telemetry platform for analysis.

### Is this a real vulnerable service?

No. The honeypot emulates the responses of the target service but does not
run the actual software. No real vulnerability exists -- exploitation
payloads are logged but never executed.



## Deployment

### What ports does it use?

- **8081** (configurable) -- the honeypot port exposed to the network
- **24284** (internal) -- Fluent forward protocol between honeypot and sidecar
- **24224** (outbound) -- telemetry forwarding to the STINGAR server

### Can I run multiple honeypots on the same host?

Yes. Each honeypot should use a different host port and a unique Fluent Bit
container name.

### What architectures are supported?

The Docker image supports both `linux/amd64` and `linux/arm64`.

## Security

### Is the honeypot safe to run?

Yes. The honeypot does not execute any attacker payloads. It only parses,
classifies, and logs them. All containers run with Docker network isolation.

## Telemetry

### What data is sent to STINGAR?

Each event includes: source IP/port, timestamp, request method, path,
headers, event classification, and any detected exploitation patterns.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to the container's stdout (viewable via `docker compose logs`).