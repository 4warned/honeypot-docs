# Installation Guide

Deployment guide for the Trainpot AI Scraper Detection Honeypot.

## Prerequisites

### System Requirements

- **Operating System**: Linux (amd64 or arm64)
- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Network Access**: Firewall rules allowing inbound traffic on ports 80 and 443

### STINGAR Requirements

- A registered STINGAR sensor identity (provides `stingar-hp.env` credentials)
- Network connectivity from the honeypot host to the STINGAR server on port 24224

## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/trainpot && cd ~/honeypots/trainpot
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  trainpot:
    image: 4warned/trainpot:latest
    depends_on:
      - fluentbit
    env_file: stingar-hp.env
    links:
      - fluentbit:fluentbit
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./content:/opt/trainpot-hp/content
      # Uncomment to use custom TLS certs (tls.crt, tls.key):
      # - ./certs:/opt/trainpot-hp/certs:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python3", "/opt/trainpot-hp/scripts/checkin.py", "-i", "${HONEYPOT_IDENT}", "-n", "${HONEYPOT_HOST}", "-a", "${HONEYPOT_IP}", "-t", "trainpot", "--tags", "${TAGS}", "--fluent-host", "${FLUENTBIT_HOST}", "--fluent-port", "${FLUENTBIT_PORT}", "--fluent-app", "${FLUENTBIT_APP}"]
      interval: ${HONEYPOT_HEALTHCHECK_INTERVAL:-60s}
      timeout: ${HONEYPOT_HEALTHCHECK_TIMEOUT:-30s}
      retries: 1
      start_period: 15s
    networks:
      - honeypot-network

  fluentbit:
    image: 4warned/fluentbit:latest
    env_file: stingar-hp.env
    restart: unless-stopped
    ports:
      - "127.0.0.1:24284:24284"
      - "127.0.0.1:24284:24284/udp"
    networks:
      - honeypot-network

networks:
  honeypot-network:
    driver: bridge
```

### Step 3: Configure `stingar-hp.env`

Create a `stingar-hp.env` file with the credentials provided by your STINGAR administrator:

```bash
HONEYPOT_IDENT=<your-sensor-uuid>
HONEYPOT_HOST=<your-hostname>
HONEYPOT_IP=<your-external-ip>
HONEYPOT_TYPE=trainpot
TAGS=trainpot,ai-scraper
FLUENTD_HOST=<stingar-server-ip>
FLUENTD_PORT=24224
FLUENTBIT_HOST=fluentbit
FLUENTBIT_PORT=24284
FLUENTBIT_APP=stingar
```

### Step 4: Create content directory

```bash
mkdir -p content
```

The container ships with default content. To customize, place your own HTML, CSS,
PDFs, `robots.txt`, and `sitemap.xml` in the `./content` directory.
See the [Custom Content Guide](custom-content.md).

### Step 5: Deploy

```bash
docker compose up -d
```

### Step 6: Verify

```bash
docker compose ps

# Test HTTP
curl http://localhost/

# Test robots.txt
curl http://localhost/robots.txt
```

## TLS Configuration

To enable HTTPS with custom certificates:

1. Create a `certs` directory: `mkdir -p certs`
2. Place `tls.crt` and `tls.key` in the directory
3. Uncomment the certs volume in `docker-compose.yml`:
   ```yaml
   - ./certs:/opt/trainpot-hp/certs:ro
   ```
4. Restart: `docker compose up -d`

## Upgrading

```bash
docker compose pull
docker compose up -d
```

## Uninstalling

```bash
docker compose down
```

## Next Steps

- [Configuration Guide](configuration.md) -- customize settings
- [Custom Content](custom-content.md) -- customize honeypot pages
- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
