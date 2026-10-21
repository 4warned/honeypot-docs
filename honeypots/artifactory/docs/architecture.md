# Architecture

Technical architecture of HTTP Artifactory Honeypot.

## System Overview

The honeypot is deployed as a Docker Compose stack with two containers:

```
                    Internet
                       |
                  Port 8081
                       |
            ┌──────────┴──────────┐
            │   Honeypot           │
            │  (4warned/hp-http-   │
            │   artifactory)       │
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

## Components

### Honeypot Container

Emulates Artifactory REST/WebDAV surfaces used as an agent message board
(directory-name `MKCOL` notes and file notes), plus fingerprint and bait APIs.

### Fluent Bit Sidecar

Receives structured events from the honeypot and transmits them to
the STINGAR server for centralized collection and analysis.

## Data Flow

1. Agent or attacker connects to port 8081
2. Honeypot processes the request and returns a realistic Artifactory response
3. Interaction is classified by path/method (board write, list, bait, etc.)
4. Event is forwarded to Fluent Bit and then to STINGAR
5. Fluent Bit delivers event to STINGAR server



## Security Considerations

- The honeypot does not execute any attacker payloads
- The Fluent Bit sidecar binds only to localhost (127.0.0.1) on the host
- All containers run with `restart: unless-stopped` for resilience
- Docker network isolation prevents lateral movement

## Next Steps

- [Configuration](configuration.md) -- customize the deployment
- [Running Guide](running.md) -- operation and monitoring