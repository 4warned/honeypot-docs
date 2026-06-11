# FAQ

Frequently asked questions about the Trainpot Honeypot.

## General

### What does this honeypot do?

It mimics a research or course website to detect AI crawlers, LLM training
scrapers, and automated bots. Crawlers that violate robots.txt, skip robots.txt,
or exceed rate limits are detected and reported to STINGAR.

### Is this a real website?

No. All content (papers, course materials, etc.) is fake, designed to attract
and identify AI scraping activity.

### What crawlers does it detect?

Any crawler that:
- Accesses paths disallowed in robots.txt
- Follows sitemap links without respecting robots.txt
- Crawls disallowed paths without first requesting robots.txt
- Exceeds the rate limit threshold

## Deployment

### What ports does it use?

- **80** -- HTTP honeypot traffic
- **443** -- HTTPS honeypot traffic (with JA3/JA4 fingerprinting)
- **24284** (internal) -- Fluent forward protocol between honeypot and Fluent Bit
- **24224** (outbound) -- telemetry forwarding to STINGAR

### Do I need TLS certificates?

Optional. The container works on HTTP (port 80) without certificates. HTTPS
(port 443) with JA3/JA4 fingerprinting requires mounting a TLS certificate.

### Can I run it on different ports?

Yes. Change the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"
  - "8443:443"
```

### What architectures are supported?

The Docker image supports both `linux/amd64` and `linux/arm64`.

## Content

### Can I customize the served content?

Yes. Place your own files in the `./content` directory. Changes take effect
immediately without restarting the container.

### Do I need to customize robots.txt?

The default robots.txt works out of the box. Customizing it allows you to
target specific paths that AI scrapers in your environment are likely to probe.

## Security

### Is the honeypot safe to run?

Yes. It only serves static content and logs requests. No dynamic code execution
occurs for incoming requests.

### Can attackers use it to attack other systems?

No. The honeypot only responds to incoming requests.

## Telemetry

### What data is sent to STINGAR?

Each event includes: source IP/port, timestamp, request path, method, User-Agent,
JA3/JA4 fingerprints (HTTPS), violation type, and rate limit status.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml`. Events will
still be logged to the container's stdout (viewable via `docker compose logs`).
