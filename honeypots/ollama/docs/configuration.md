# Configuration Guide

Configuration reference for the Ollama CVE-2024-37032 Honeypot.

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Container orchestration, ports, networking |
| `stingar-hp.env` | STINGAR sensor credentials and telemetry routing |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Bind address |
| `PORT` | `11434` | Listen port |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `HONEYPOT_TYPE` | `ollama` | Sensor type for STINGAR |
| `FLUENTBIT_HOST` | `fluentbit` | Fluent Bit sidecar hostname |
| `FLUENTBIT_PORT` | `24284` | Fluent Bit forward port |

## Port Configuration

The default Ollama port is **11434**. To use a different host port:

```yaml
ports:
  - "8080:11434"
```

## Networking

| Port | Direction | Purpose |
|------|-----------|---------|
| 11434 (or custom) | Inbound | Honeypot traffic |
| 24224 | Outbound | STINGAR telemetry |

## Next Steps

- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
