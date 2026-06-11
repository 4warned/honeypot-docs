# Architecture

Technical architecture of the PeopleSoft CVE-2026-35273 Honeypot.

## System Overview

The honeypot is deployed as a Docker Compose stack with two containers:

```
                    Internet
                       |
                  Port 8000
                       |
            ┌──────────┴──────────┐
            │  PeopleSoft Honeypot │
            │  (4warned/hp-        │
            │   peoplesoft:latest) │
            └──────────┬──────────┘
                       |
               Fluent Forward
              (port 24284, internal)
                       |
            ┌──────────┴──────────┐
            │    Fluent Bit        │
            │  (4warned/fluentbit) │
            └──────────┬──────────┘
                       |
              TCP port 24224
                       |
            ┌──────────┴──────────┐
            │   STINGAR Server     │
            │  (centralized        │
            │   telemetry)         │
            └─────────────────────┘
```

## Components

### Honeypot Container

Emulates an Oracle PeopleSoft PeopleTools 8.62 instance with:

- **PeopleSoft Internet Architecture (PIA)** -- login page, portal servlets
- **PSEMHUB Environment Management Hub** -- the vulnerable component
- **Oracle HTTP Server headers** -- X-ORACLE-DMS-ECID, X-ORACLE-DMS-RID, WebLogic identifiers

### Fluent Bit Sidecar

Receives structured events from the honeypot via Fluent forward protocol
and transmits them to the STINGAR server for centralized collection and analysis.

## Data Flow

1. Attacker connects to port 8000 (HTTP)
2. Honeypot processes request and generates realistic PeopleSoft response
3. Interaction is classified by event type (scan, login, RCE attempt, etc.)
4. Event is logged locally (JSON) and forwarded to Fluent Bit
5. Fluent Bit delivers event to STINGAR server

## CVE Emulation: CVE-2026-35273

The honeypot specifically emulates the Updates Environment Management component
that is the attack surface for CVE-2026-35273:

- `/PSEMHUB/hub/updates` -- accepts GET (recon) and POST (exploitation)
- `/PSEMHUB/hub/updates/apply` -- the RCE trigger endpoint
- `/PSEMHUB/hub/updates/upload` -- malicious payload upload

POST bodies are inspected for known exploitation patterns (Java deserialization,
shell commands, known attacker tooling) and classified accordingly.

## Detection Capabilities

The honeypot detects:

- **Reconnaissance** -- accessing PSEMHUB endpoints, version probing
- **Credential theft** -- login attempts to `/psp/ps/?cmd=login`
- **Exploitation** -- RCE payloads targeting the Updates Environment Management
- **Post-exploitation tooling** -- ShinyHunters patterns (`uon_fanout`, `psappsrv.cfg`)

## Security Considerations

- The honeypot does not execute any payloads -- it only logs and responds
- The Fluent Bit sidecar binds only to localhost (127.0.0.1) on the host
- All containers run with `restart: unless-stopped` for resilience
- Docker network isolation prevents lateral movement

## Next Steps

- [Configuration](configuration.md) -- customize the deployment
- [Running Guide](running.md) -- operation and monitoring
