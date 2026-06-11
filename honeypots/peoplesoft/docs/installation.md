# Installation Guide

Deployment guide for the PeopleSoft CVE-2026-35273 Honeypot.

## Prerequisites

### System Requirements

- **Operating System**: Linux (amd64 or arm64)
- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Network Access**: Firewall rules allowing inbound traffic on port 8000

### STINGAR Requirements

- A registered STINGAR sensor identity (provides `stingar-hp.env` credentials)
- Network connectivity from the honeypot host to the STINGAR server on port 24224

## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/peoplesoft && cd ~/honeypots/peoplesoft
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  peoplesoft-honeypot:
    image: 4warned/hp-peoplesoft:latest
    depends_on:
      - fluentbit
    env_file: stingar-hp.env
    links:
      - fluentbit:fluentbit
    ports:
      - "8000:8000"
    environment:
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=8000
      - HONEYPOT_TYPE=${HONEYPOT_TYPE:-peoplesoft}
      - FLUENTBIT_HOST=fluentbit
      - FLUENTBIT_PORT=${FLUENTBIT_PORT:-24284}
      - FLUENTBIT_APP=${FLUENTBIT_APP:-stingar}
    restart: unless-stopped
    networks:
      - honeypot-network

  fluentbit:
    image: 4warned/fluentbit
    container_name: fluentbit-peoplesoft
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
HONEYPOT_TYPE=peoplesoft
TAGS=cve-2026-35273,peoplesoft
FLUENTD_HOST=<stingar-server-ip>
FLUENTD_PORT=24224
```

### Step 4: Deploy

```bash
docker compose up -d
```

### Step 5: Verify

```bash
# Check containers are running
docker compose ps

# Test the honeypot is responding
curl http://localhost:8000/ps/signon.html
```

You should see the PeopleSoft login page HTML response.

## Port Configuration

The default port is **8000**. To change the exposed port, edit the `ports` mapping
in `docker-compose.yml`:

```yaml
ports:
  - "80:8000"    # Expose on standard HTTP port for maximum realism
```

## Upgrading

```bash
# Pull the latest image
docker compose pull

# Restart with the new image
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
