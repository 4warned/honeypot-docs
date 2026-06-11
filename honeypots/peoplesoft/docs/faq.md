# FAQ

Frequently asked questions about the PeopleSoft CVE-2026-35273 Honeypot.

## General

### What does this honeypot do?

It emulates an Oracle PeopleSoft PeopleTools 8.62 server with the Updates
Environment Management component vulnerable to CVE-2026-35273. It captures
attacker activity (scans, login attempts, exploitation attempts) and reports
events to a centralized STINGAR telemetry platform.

### Is this a real PeopleSoft instance?

No. The honeypot emulates the HTTP responses of a PeopleSoft server but does
not run any Oracle software. No actual vulnerability exists -- exploitation
payloads are logged but never executed.

### What CVE does it emulate?

**CVE-2026-35273** -- a critical (CVSS 9.8) remote code execution vulnerability
in the Updates Environment Management component of PeopleSoft PeopleTools 8.61
and 8.62. It allows unauthenticated attackers to execute arbitrary code via HTTP.

## Deployment

### What ports does it use?

- **8000** (configurable) -- the honeypot HTTP port exposed to the internet
- **24284** (internal) -- Fluent forward protocol between honeypot and Fluent Bit sidecar
- **24224** (outbound) -- telemetry forwarding to the STINGAR server

### Can I run it on port 80?

Yes. Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "80:8000"
```

### Can I run multiple honeypots on the same host?

Yes. Each honeypot should use a different host port and a unique Fluent Bit
container name. Adjust port mappings and `container_name` values accordingly.

### What architectures are supported?

The Docker image supports both `linux/amd64` and `linux/arm64`.

## Security

### Is the honeypot safe to run?

Yes. The honeypot does not execute any attacker payloads. It only parses,
classifies, and logs them. All containers run with Docker network isolation.

### Can attackers use the honeypot to attack other systems?

No. The honeypot only responds to incoming requests -- it does not make outbound
connections to attacker-specified targets.

### Does it store credentials?

Login attempts are logged (username only) and forwarded to STINGAR for analysis.
Passwords are not stored in plaintext logs.

## Telemetry

### What data is sent to STINGAR?

Each event includes: source IP/port, timestamp, HTTP method, request path,
headers, event classification, and any detected exploitation patterns.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to the container's stdout (viewable via `docker compose logs`).

### How do I verify events are reaching STINGAR?

Check Fluent Bit logs for successful delivery:

```bash
docker compose logs fluentbit
```

Look for connection confirmations, not error messages.
