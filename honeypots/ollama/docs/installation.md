# Installation Guide

Deployment guide for the Ollama CVE-2024-37032 Honeypot.

## Prerequisites

- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Network Access**: Firewall rules allowing inbound traffic on port 11434
- **STINGAR**: A registered sensor identity (`stingar-hp.env` credentials)

## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/ollama && cd ~/honeypots/ollama
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  ollama-honeypot:
    image: 4warned/hp-ollama:latest
    depends_on:
      - fluentbit
    env_file: stingar-hp.env
    links:
      - fluentbit:fluentbit
    ports:
      - "11434:11434"
    environment:
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=11434
      - HONEYPOT_TYPE=ollama
      - FLUENTBIT_HOST=fluentbit
      - FLUENTBIT_PORT=24284
      - FLUENTBIT_APP=stingar
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - honeypot-network

  fluentbit:
    image: 4warned/fluentbit
    container_name: fluentbit-ollama
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

```bash
HONEYPOT_IDENT=<your-sensor-uuid>
HONEYPOT_HOST=<your-hostname>
HONEYPOT_IP=<your-external-ip>
HONEYPOT_TYPE=ollama
TAGS=cve-2024-37032,ollama
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
curl http://localhost:11434/api/tags
```

## Upgrading

```bash
docker compose pull
docker compose up -d
```

## Next Steps

- [Configuration Guide](configuration.md) -- customize settings
- [Running Guide](running.md) -- operation and monitoring
