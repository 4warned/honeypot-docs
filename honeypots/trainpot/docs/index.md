# Trainpot Honeypot

## Overview

Trainpot is a web honeypot designed to detect AI crawlers, LLM training scrapers, and automated bots. It mimics a course or research website (HTML, PDFs, syllabus, papers) and logs all HTTP requests. Crawlers that violate robots.txt, access disallowed paths, or exceed rate limits are flagged and reported to STINGAR.

## Key Features

- **robots.txt violation detection** -- flags crawlers accessing disallowed paths
- **Sitemap traps** -- sitemap lists only disallowed URLs to catch non-compliant scrapers
- **Crawl-first detection** -- identifies crawlers that skip robots.txt
- **Rate-based detection** -- flags IPs exceeding configurable request thresholds
- **JA3/JA4 TLS fingerprinting** -- captures TLS client fingerprints on HTTPS connections
- **Customizable content** -- serve your own HTML, PDFs, and static assets via mounted volume
- **STINGAR integration** -- all events forwarded via Fluent Bit

## Deployment

The honeypot is delivered as a Docker image (`4warned/trainpot:latest`) and deployed using Docker Compose with a Fluent Bit sidecar for STINGAR telemetry.

## Quick Start

```bash
mkdir -p ~/honeypots/trainpot && cd ~/honeypots/trainpot
# Create docker-compose.yml and stingar-hp.env (see Installation Guide)
docker compose up -d
```

## Next Steps

- [Installation](installation.md) -- deploy the honeypot
- [Configuration](configuration.md) -- customize settings
- [Running](running.md) -- operation and monitoring
- [Architecture](architecture.md) -- how it works
- [Custom Content](custom-content.md) -- customize honeypot pages
- [Troubleshooting](troubleshooting.md) -- resolve issues
- [FAQ](faq.md) -- common questions
