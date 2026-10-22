# Installation Guide

Deploy the WordPress PHP2Shell honeypot (`4warned/hp-php2shell`).

## Prerequisites

- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Network Access**: Firewall rules allowing inbound traffic on port 80
- **STINGAR**: A registered sensor identity (`stingar-hp.env` credentials)

## About PHP2Shell

This honeypot is a **behavioral bait** for:

| CVE | What the honeypot captures |
|---|---|
| **CVE-2026-109618** | Multipart / upload-progress style probes; issues a bait `PHPSESSID` |
| **CVE-2026-109619** | Follow-up requests that replay the bait session cookie |

It fingerprints as WordPress on Apache with **PHP/8.3.24** (unpatched relative to the 2026-10-21 PHP security release). It does **not** run a vulnerable PHP engine and does **not** execute attacker payloads.

- **Protocol**: HTTP
- **Port**: 80
- **Image**: `4warned/hp-php2shell:latest`

## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/php2shell && cd ~/honeypots/php2shell
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  http-honeypot:
    image: 4warned/hp-php2shell:latest
    depends_on:
      - fluentbit
    env_file: stingar-hp.env
    links:
      - fluentbit:fluentbit
    ports:
      - "80:80"
    environment:
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=80
      - HONEYPOT_TYPE=${HONEYPOT_TYPE:-http}
      - FLUENTBIT_HOST=fluentbit
      - FLUENTBIT_PORT=${FLUENTBIT_PORT:-24284}
      - FLUENTBIT_APP=${FLUENTBIT_APP:-stingar}
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "python3",
          "-c",
          "import urllib.request; urllib.request.urlopen('http://127.0.0.1:80/', timeout=5)",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    networks:
      - honeypot-network

  fluentbit:
    image: 4warned/fluentbit
    container_name: fluentbit-php2shell
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
HONEYPOT_TYPE=http
TAGS=php2shell,wordpress,cve-2026-109618,cve-2026-109619
FLUENTD_HOST=<stingar-server-ip>
FLUENTD_PORT=24224
```

### Step 4: Deploy

```bash
docker compose pull
docker compose up -d
```

### Step 5: Verify

```bash
docker compose ps

# Fingerprint (expect Apache + X-Powered-By: PHP/8.3.24)
curl -sI http://localhost:80/ | grep -iE 'HTTP|Server|X-Powered-By'

# WordPress-looking home page
curl -s http://localhost:80/ | head
```

### Optional: probe-surface smoke test

Benign multipart POST (should return HTTP 500 and a bait `PHPSESSID`):

```bash
curl -sD - -o /dev/null \
  -X POST 'http://localhost:80/wp-admin/async-upload.php' \
  -H 'Content-Type: multipart/form-data; boundary=----BOUND' \
  --data-binary $'------BOUND\r\nContent-Disposition: form-data; name="async-upload"; filename="x.bin"\r\n\r\nAAAA\r\n------BOUND--\r\n'
```

## Port Configuration

The default host port is **80**. To change it:

```yaml
ports:
  - "8080:80"    # host:container
```

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

- [Configuration Guide](configuration.md)
- [Running Guide](running.md)
- [Troubleshooting](troubleshooting.md)
