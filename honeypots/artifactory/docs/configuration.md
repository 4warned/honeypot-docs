# Configuration Guide

Configuration reference for HTTP Artifactory Honeypot.

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Container orchestration, ports, networking |
| `stingar-hp.env` | STINGAR sensor credentials and telemetry routing |

## Environment Variables

### docker-compose.yml Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Bind address inside the container |
| `PORT` | `8081` | Listen port inside the container |
| `LOG_LEVEL` | `INFO` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `HONEYPOT_TYPE` | `http` | Honeypot type identifier sent to STINGAR |
| `FLUENTBIT_HOST` | `fluentbit` | Fluent Bit sidecar hostname |
| `FLUENTBIT_PORT` | `24284` | Fluent Bit forward input port |
| `FLUENTBIT_APP` | `stingar` | Fluent Bit application tag |

### stingar-hp.env Variables

| Variable | Description |
|----------|-------------|
| `HONEYPOT_IDENT` | Unique sensor UUID (provided by STINGAR admin) |
| `HONEYPOT_HOST` | Human-readable sensor hostname |
| `HONEYPOT_IP` | External IP address of the honeypot host |
| `HONEYPOT_TYPE` | Sensor type (`http`) |
| `TAGS` | Comma-separated tags for filtering |
| `FLUENTD_HOST` | STINGAR server IP/hostname |
| `FLUENTD_PORT` | STINGAR Fluent forward port (default: `24224`) |

## Port Configuration

Edit `docker-compose.yml` to change the host port:

```yaml
ports:
  - "80:8081"      # Expose on standard HTTP port
```

## Logging

All interactions are forwarded to your **STINGAR** server via the Fluent Bit sidecar.

### Log Verbosity

Set `LOG_LEVEL` in `docker-compose.yml`:

- `DEBUG` -- all requests
- `INFO` -- standard operation (recommended)
- `WARNING` -- only suspicious activity
- `ERROR` -- only failures

## Networking

| Port | Direction | Purpose |
|------|-----------|---------|
| 8081 (or custom) | Inbound | Honeypot traffic from attackers |
| 24224 | Outbound | STINGAR telemetry (Fluent forward) |

## Next Steps

- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues