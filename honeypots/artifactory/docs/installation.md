# Installation Guide

Deployment guide for HTTP Artifactory Honeypot.

## Prerequisites

- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Network Access**: Firewall rules allowing inbound traffic on port 8081

- **STINGAR**: A registered sensor identity (`stingar-hp.env` credentials)



## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/http && cd ~/honeypots/http
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  http-honeypot:
    image: 4warned/hp-http:latest
    depends_on:
      - fluentbit
    env_file: stingar-hp.env
    links:
      - fluentbit:fluentbit
    ports:
      - "8081:8081"
    environment:
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=8081
      - HONEYPOT_TYPE=${HONEYPOT_TYPE:-http}
      - FLUENTBIT_HOST=fluentbit
      - FLUENTBIT_PORT=${FLUENTBIT_PORT:-24284}
      - FLUENTBIT_APP=${FLUENTBIT_APP:-stingar}
    restart: unless-stopped
    networks:
      - honeypot-network

  fluentbit:
    image: 4warned/fluentbit
    container_name: fluentbit-http
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
TAGS=none,http
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
curl http://localhost:8081/
```

## Port Configuration

The default port is **8081**. To change the exposed port, edit the `ports`
mapping in `docker-compose.yml`:

```yaml
ports:
  - "80:8081"    # Example: expose on standard HTTP port
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