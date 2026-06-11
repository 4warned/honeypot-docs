# Installation Guide

Deployment guide for the OpenClaw AI Gateway Honeypot.

## Prerequisites

### System Requirements

- **Operating System**: Linux (amd64 or arm64)
- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Network Access**: Firewall rules allowing inbound traffic on port 18789

### STINGAR Requirements

- A registered STINGAR sensor identity (provides `stingar-hp.env` credentials)
- Network connectivity from the honeypot host to the STINGAR server on port 24224

## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/openclaw && cd ~/honeypots/openclaw
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  openclaw-honeypot:
    image: 4warned/hp-openclaw:latest
    depends_on:
      - fluentbit
    env_file: stingar-hp.env
    links:
      - fluentbit:fluentbit
    ports:
      - "18789:18789"
    environment:
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=18789
      - HONEYPOT_TYPE=${HONEYPOT_TYPE:-openclaw}
      - FLUENTBIT_HOST=fluentbit
      - FLUENTBIT_PORT=${FLUENTBIT_PORT:-24284}
      - FLUENTBIT_APP=${FLUENTBIT_APP:-stingar}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python3", "/opt/openclaw/checkin.py", "-i", "${HONEYPOT_IDENT}", "-n", "${HONEYPOT_HOST}", "-a", "${HONEYPOT_IP}", "-t", "${HONEYPOT_TYPE:-openclaw}", "--tags", "${TAGS}", "--fluent-host", "${FLUENTBIT_HOST:-fluentbit}", "--fluent-port", "${FLUENTBIT_PORT:-24284}", "--fluent-app", "${FLUENTBIT_APP:-stingar}"]
      interval: ${HONEYPOT_HEALTHCHECK_INTERVAL:-30s}
      timeout: ${HONEYPOT_HEALTHCHECK_TIMEOUT:-10s}
      retries: 1
      start_period: 15s
    networks:
      - honeypot-network

  fluentbit:
    image: 4warned/fluentbit
    container_name: fluentbit-openclaw
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
HONEYPOT_TYPE=openclaw
TAGS=openclaw,ai-gateway
FLUENTD_HOST=<stingar-server-ip>
FLUENTD_PORT=24224
```

### Step 4: Deploy

```bash
docker compose up -d
```

### Step 5: Verify

```bash
docker compose ps
```

Both `openclaw-honeypot` and `fluentbit-openclaw` should show as "Up".

## Port Configuration

The default port is **18789**. To change the exposed port, edit the `ports` mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:18789"    # Expose on alternative port
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

- [Configuration Guide](configuration.md) -- customize settings
- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
