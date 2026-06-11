# Running the Honeypot

Operational guide for the Trainpot AI Scraper Detection Honeypot.

## About Trainpot

Trainpot detects AI crawlers and LLM training scrapers by serving a realistic
website with robots.txt traps, sitemap-based canaries, and rate limiting. Crawlers
that violate robots.txt rules, skip robots.txt before crawling, or exceed rate
limits are identified and reported to STINGAR.

## Starting the Honeypot

```bash
docker compose up -d
```

## Stopping the Honeypot

```bash
docker compose down
```

## Verifying Operation

### Check Container Status

```bash
docker compose ps
```

Both `trainpot` and `fluentbit` should show as "Up".

### Test Endpoints

```bash
# Homepage
curl http://localhost/

# robots.txt
curl http://localhost/robots.txt

# Sitemap
curl http://localhost/sitemap.xml
```

## Monitoring

### View Logs

```bash
# Follow all logs
docker compose logs -f

# View only honeypot logs
docker compose logs -f trainpot

# View last 100 lines
docker compose logs --tail=100
```

### STINGAR Events

Events are forwarded to your STINGAR server via the Fluent Bit sidecar.
Verify the sidecar is connected:

```bash
docker compose logs fluentbit
```

## Event Types

The honeypot classifies interactions into the following event types:

| Event Type | Description |
|------------|-------------|
| `robots_violation` | Request to a path disallowed in robots.txt |
| `crawl_first` | Accessed disallowed path without first requesting robots.txt |
| `rate_exceeded` | IP exceeded the rate limit threshold |
| `sitemap_trap` | Accessed a URL listed in sitemap that is disallowed |
| `normal_request` | Standard request to an allowed path |

### Event Fields

Each event includes:

- Source IP and port
- Request path and method
- User-Agent string
- JA3/JA4 TLS fingerprints (HTTPS only)
- Violation type flags
- Timestamp

## Health Checks

The container includes a built-in health check. View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q trainpot)
```

## Resource Usage

```bash
docker stats --no-stream
```

Trainpot is lightweight -- typical usage is under 100MB RAM.

## Next Steps

- [Configuration](configuration.md) -- adjust settings
- [Custom Content](custom-content.md) -- customize honeypot pages
- [Troubleshooting](troubleshooting.md) -- resolve issues
