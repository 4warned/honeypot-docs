# Configuration Guide

Configuration reference for the Trainpot AI Scraper Detection Honeypot.

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Container orchestration, ports, volumes, networking |
| `stingar-hp.env` | STINGAR sensor credentials and telemetry routing |
| `content/` directory | Customizable website content served by the honeypot |

## stingar-hp.env Variables

| Variable | Description |
|----------|-------------|
| `HONEYPOT_IDENT` | Unique sensor UUID (provided by STINGAR admin) |
| `HONEYPOT_HOST` | Human-readable sensor hostname |
| `HONEYPOT_IP` | External IP address of the honeypot host |
| `HONEYPOT_TYPE` | Sensor type (`trainpot`) |
| `TAGS` | Comma-separated tags for filtering (e.g., `trainpot,ai-scraper`) |
| `FLUENTD_HOST` | STINGAR server IP/hostname |
| `FLUENTD_PORT` | STINGAR Fluent forward port (default: `24224`) |
| `FLUENTBIT_HOST` | Fluent Bit sidecar hostname (default: `fluentbit`) |
| `FLUENTBIT_PORT` | Fluent Bit forward input port (default: `24284`) |
| `FLUENTBIT_APP` | Fluent Bit application tag (default: `stingar`) |

## Port Configuration

### Changing Ports

Edit `docker-compose.yml` to change port mappings:

```yaml
ports:
  - "8080:80"     # HTTP on alternative port
  - "8443:443"    # HTTPS on alternative port
```

## Content Configuration

The honeypot serves content from `./content` mounted at `/opt/trainpot-hp/content`.
This includes:

- HTML pages (fake course materials, research papers)
- PDF documents
- `robots.txt` -- defines disallowed paths for crawlers
- `sitemap.xml` -- lists disallowed URLs as traps

See [Custom Content Guide](custom-content.md) for details on customization.

## Detection Configuration

### Rate Limiting

Default: 60 requests per 60 seconds per IP. Exceeding this threshold flags the
IP with `rate_exceeded: true` in STINGAR events.

### robots.txt Enforcement

All paths listed in `Disallow` directives of `robots.txt` are monitored.
Requests to these paths generate violation events.

## Logging Configuration

### Log Output

All interactions are forwarded to your **STINGAR** server via the Fluent Bit sidecar.

## Networking

### Firewall Rules

| Port | Direction | Purpose |
|------|-----------|---------|
| 80 | Inbound | HTTP honeypot traffic |
| 443 | Inbound | HTTPS honeypot traffic |
| 24224 | Outbound | STINGAR telemetry (Fluent forward) |

### Docker Network

The honeypot and Fluent Bit sidecar communicate over an internal Docker bridge
network (`honeypot-network`).

## Next Steps

- [Custom Content](custom-content.md) -- customize honeypot pages
- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
