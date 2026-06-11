# Configuration Guide

Configuration reference for the PeopleSoft CVE-2026-35273 Honeypot.

## Configuration Files

The honeypot requires two configuration files:

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Container orchestration, ports, networking |
| `stingar-hp.env` | STINGAR sensor credentials and telemetry routing |

## Environment Variables

### docker-compose.yml Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Bind address inside the container |
| `PORT` | `8000` | Listen port inside the container |
| `LOG_LEVEL` | `INFO` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `HONEYPOT_TYPE` | `peoplesoft` | Honeypot type identifier sent to STINGAR |
| `FLUENTBIT_HOST` | `fluentbit` | Fluent Bit sidecar hostname |
| `FLUENTBIT_PORT` | `24284` | Fluent Bit forward input port |
| `FLUENTBIT_APP` | `stingar` | Fluent Bit application tag |

### stingar-hp.env Variables

| Variable | Description |
|----------|-------------|
| `HONEYPOT_IDENT` | Unique sensor UUID (provided by STINGAR admin) |
| `HONEYPOT_HOST` | Human-readable sensor hostname |
| `HONEYPOT_IP` | External IP address of the honeypot host |
| `HONEYPOT_TYPE` | Sensor type (`peoplesoft`) |
| `TAGS` | Comma-separated tags for filtering (e.g., `cve-2026-35273,peoplesoft`) |
| `FLUENTD_HOST` | STINGAR server IP/hostname |
| `FLUENTD_PORT` | STINGAR Fluent forward port (default: `24224`) |

## Port Configuration

### Changing the External Port

Edit `docker-compose.yml` to change which host port maps to the container:

```yaml
ports:
  - "80:8000"      # Standard HTTP port (recommended for realism)
  - "8443:8000"    # Alternative port
```

## Logging Configuration

### Log Output

All interactions are logged to:

1. **STINGAR** -- events forwarded via Fluent Bit to your STINGAR server
2. **Local JSON file** -- written to `./logs/honeypot.json` (mounted volume)

### Log Verbosity

Set `LOG_LEVEL` in `docker-compose.yml`:

- `DEBUG` -- all requests including health checks
- `INFO` -- standard operation (recommended)
- `WARNING` -- only suspicious activity
- `ERROR` -- only failures

## Networking

### Firewall Rules

Ensure the following ports are accessible:

| Port | Direction | Purpose |
|------|-----------|---------|
| 8000 (or custom) | Inbound | Honeypot traffic from attackers |
| 24224 | Outbound | STINGAR telemetry (Fluent forward) |

### Docker Network

The honeypot and Fluent Bit sidecar communicate over an internal Docker bridge
network (`honeypot-network`). No host-level configuration is needed for this.

## Example: Production Configuration

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
      - "80:8000"
    environment:
      - LOG_LEVEL=INFO
      - HOST=0.0.0.0
      - PORT=8000
      - HONEYPOT_TYPE=peoplesoft
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
    container_name: fluentbit-peoplesoft
    env_file: stingar-hp.env
    restart: unless-stopped
    networks:
      - honeypot-network

networks:
  honeypot-network:
    driver: bridge
```

## Next Steps

- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
