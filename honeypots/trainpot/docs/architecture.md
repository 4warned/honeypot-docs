# Architecture

Technical architecture of the Trainpot AI Scraper Detection Honeypot.

## System Overview

The honeypot is deployed as a Docker Compose stack with two containers:

```
                    Internet
                       |
              Ports 80 / 443
                       |
            +----------+-----------+
            |   Trainpot Honeypot  |
            |  (4warned/trainpot:  |
            |   latest)            |
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

A Flask-based web server with dual HTTP/HTTPS listeners:

- **HTTP listener (port 80)** -- serves content and detects crawlers
- **HTTPS listener (port 443)** -- same functionality plus JA3/JA4 TLS fingerprinting
- **Content directory** -- customizable HTML, PDFs, robots.txt, sitemap.xml (mounted volume)

### Fluent Bit Sidecar

Receives structured events from the honeypot and transmits them to the STINGAR
server for centralized collection and analysis.

## Detection Logic

### robots.txt Enforcement

At startup, Trainpot parses `robots.txt` to build a list of disallowed paths.
Any request to a disallowed path generates a `robots_violation` event.

### Crawl-First Detection

Trainpot tracks whether each IP has requested `/robots.txt`. If an IP accesses
a disallowed path without first checking robots.txt, the event is flagged with
`crawl_first: true`.

### Sitemap Traps

The sitemap (`sitemap.xml`) lists only disallowed URLs. A well-behaved crawler
that respects robots.txt will never request these URLs. Scrapers that fetch the
sitemap and blindly follow all links are detected.

### Rate-Based Detection

IPs exceeding the configured request threshold (default: 60 requests/60 seconds)
are flagged with `rate_exceeded: true`.

### JA3/JA4 TLS Fingerprinting

HTTPS connections capture TLS ClientHello fingerprints (JA3 and JA4 hashes),
which help identify specific client libraries, bots, and automation tools.

## Data Flow

1. Client connects on port 80 (HTTP) or 443 (HTTPS)
2. If HTTPS, TLS handshake captures JA3/JA4 fingerprints
3. Request is served from the content directory
4. Detection logic evaluates the request against robots.txt rules, rate limits, and crawl-first tracking
5. Event is forwarded to Fluent Bit for STINGAR delivery

## Security Considerations

- The honeypot serves only static content -- no dynamic execution
- All "research papers" and "course materials" are fake
- The Fluent Bit sidecar binds only to localhost (127.0.0.1) on the host
- Docker network isolation prevents lateral movement

## Next Steps

- [Configuration](configuration.md) -- customize the deployment
- [Custom Content](custom-content.md) -- modify served pages
- [Running Guide](running.md) -- operation and monitoring
