# Configuration Guide

Configuration reference for the OpenClaw AI Gateway Honeypot.

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
| `PORT` | `18789` | Listen port inside the container |
| `LOG_LEVEL` | `INFO` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `HONEYPOT_TYPE` | `openclaw` | Honeypot type identifier sent to STINGAR |
| `FLUENTBIT_HOST` | `fluentbit` | Fluent Bit sidecar hostname |
| `FLUENTBIT_PORT` | `24284` | Fluent Bit forward input port |
| `FLUENTBIT_APP` | `stingar` | Fluent Bit application tag |

### stingar-hp.env Variables

| Variable | Description |
|----------|-------------|
| `HONEYPOT_IDENT` | Unique sensor UUID (provided by STINGAR admin) |
| `HONEYPOT_HOST` | Human-readable sensor hostname |
| `HONEYPOT_IP` | External IP address of the honeypot host |
| `HONEYPOT_TYPE` | Sensor type (`openclaw`) |
| `TAGS` | Comma-separated tags for filtering (e.g., `openclaw,ai-gateway`) |
| `FLUENTD_HOST` | STINGAR server IP/hostname |
| `FLUENTD_PORT` | STINGAR Fluent forward port (default: `24224`) |

## Port Configuration

### Changing the External Port

Edit `docker-compose.yml` to change which host port maps to the container:

```yaml
ports:
  - "8080:18789"    # Alternative port
```

## Logging Configuration

### Log Output

All interactions are forwarded to your **STINGAR** server via the Fluent Bit sidecar.

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
| 18789 (or custom) | Inbound | Honeypot traffic from attackers |
| 24224 | Outbound | STINGAR telemetry (Fluent forward) |

### Docker Network

The honeypot and Fluent Bit sidecar communicate over an internal Docker bridge
network (`honeypot-network`). No host-level configuration is needed for this.

## Next Steps

- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
