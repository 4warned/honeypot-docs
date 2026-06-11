# Installation Guide

Deployment guide for the SYNsor Multi-Protocol Packet Monitoring Honeypot.

## Prerequisites

### System Requirements

- **Operating System**: Linux (amd64 or arm64)
- **Docker**: Docker 20.10+ and Docker Compose 2.0+
- **Privileges**: Root/sudo access (required for raw socket capture)
- **Network**: The honeypot uses host networking for raw packet access

### STINGAR Requirements

- A registered STINGAR sensor identity (provides `stingar-hp.env` credentials)
- Network connectivity from the honeypot host to the STINGAR server on port 24224

## Deployment

### Step 1: Create a deployment directory

```bash
mkdir -p ~/honeypots/synsor && cd ~/honeypots/synsor
```

### Step 2: Create `docker-compose.yml`

```yaml
services:
  honey-syn:
    image: 4warned/synsor:latest
    container_name: honey-syn
    restart: unless-stopped
    env_file: stingar-hp.env
    cap_add:
      - NET_RAW
      - NET_ADMIN
    user: root
    network_mode: host
    volumes:
      - ./configs:/app/configs:ro
    healthcheck:
      test: ["CMD", "/opt/checkin", "-i", "$HONEYPOT_IDENT", "-n", "$HONEYPOT_HOST", "-a", "$HONEYPOT_IP", "-t", "synsor", "--tags", "$TAGS", "--fluent-host", "localhost", "--fluent-port", "$FLUENTBIT_PORT", "--fluent-app", "$FLUENTBIT_APP"]
      interval: ${HONEYPOT_HEALTHCHECK_INTERVAL:-30s}
      timeout: ${HONEYPOT_HEALTHCHECK_TIMEOUT:-10s}
      retries: 1

  fluentbit:
    image: 4warned/fluentbit
    container_name: fluentbit-syn
    restart: unless-stopped
    env_file: stingar-hp.env
    ports:
      - "127.0.0.1:24284:24284"
      - "127.0.0.1:24284:24284/udp"
```

### Step 3: Configure `stingar-hp.env`

Create a `stingar-hp.env` file with the credentials provided by your STINGAR administrator:

```bash
HONEYPOT_IDENT=<your-sensor-uuid>
HONEYPOT_HOST=<your-hostname>
HONEYPOT_IP=<your-external-ip>
HONEYPOT_TYPE=synsor
TAGS=synsor,packet-monitor
FLUENTD_HOST=<stingar-server-ip>
FLUENTD_PORT=24224
FLUENTBIT_HOST=localhost
FLUENTBIT_PORT=24284
FLUENTBIT_APP=stingar
NETWORK_INTERFACE=any
```

### Step 4: Create port configuration

```bash
mkdir -p configs
```

Create `configs/ports.txt` listing the TCP ports to monitor (one per line):

```text
22
80
443
3389
8080
8443
```

### Step 5: Deploy

```bash
docker compose up -d
```

### Step 6: Verify

```bash
docker compose ps

# Check SYNsor is capturing packets
docker logs honey-syn --tail=20
```

## Important Notes

- SYNsor uses **host networking** (`network_mode: host`) for raw socket access.
  The honeypot monitors packets on the host's network interfaces directly.
- The `NET_RAW` and `NET_ADMIN` capabilities are required for packet capture.
- The Fluent Bit sidecar runs on standard Docker networking and binds to
  `127.0.0.1:24284`. Because the honeypot uses host networking, it connects
  to Fluent Bit via `localhost`.

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
