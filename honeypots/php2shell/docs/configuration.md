# Configuration Guide

Configuration reference for WordPress PHP2Shell (`4warned/hp-php2shell`).

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Container orchestration, ports, networking, image |
| `stingar-hp.env` | STINGAR sensor credentials and telemetry routing |
| `default.cfg` (in image) | JSON log + STINGAR defaults inside the container |

## Environment Variables

### docker-compose.yml

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Bind address inside the container |
| `PORT` | `80` | Listen port inside the container |
| `LOG_LEVEL` | `INFO` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `HONEYPOT_TYPE` | `http` | Honeypot type identifier sent to STINGAR |
| `FLUENTBIT_HOST` | `fluentbit` | Fluent Bit sidecar hostname |
| `FLUENTBIT_PORT` | `24284` | Fluent Bit forward input port |
| `FLUENTBIT_APP` | `stingar` | Fluent Bit application tag |

### stingar-hp.env

| Variable | Description |
|----------|-------------|
| `HONEYPOT_IDENT` | Unique sensor UUID (from STINGAR admin) |
| `HONEYPOT_HOST` | Human-readable sensor hostname |
| `HONEYPOT_IP` | External IP of the honeypot host |
| `HONEYPOT_TYPE` | Sensor type (`http`) |
| `TAGS` | Suggested: `php2shell,wordpress,cve-2026-109618,cve-2026-109619` |
| `FLUENTD_HOST` | STINGAR server IP/hostname |
| `FLUENTD_PORT` | STINGAR Fluent forward port (default `24224`) |

## Port Configuration

```yaml
ports:
  - "80:80"       # default
  # - "8080:80"   # alternate host port
```

## Logging

Interactions go to:

1. Container stdout / `docker compose logs`
2. JSON file `logs/honeypot.json` inside the container (when enabled)
3. STINGAR via Fluent Bit (when `stingar-hp.env` is configured)

PHP2Shell probe events include:

- `cve_id` — `CVE-2026-109618` or `CVE-2026-109619`
- `method`, `path`, `content_type`, `body_size`
- `bait_phpsessid_issued` / `bait_phpsessid_replayed`

### Log verbosity

Set `LOG_LEVEL` in `docker-compose.yml`:

- `DEBUG` — verbose request detail
- `INFO` — standard operation (recommended)
- `WARNING` / `ERROR` — quieter

## Networking

| Port | Direction | Purpose |
|------|-----------|---------|
| 80 (or custom host map) | Inbound | Attacker / scanner traffic |
| 24284 | Internal | Honeypot → Fluent Bit |
| 24224 | Outbound | Fluent Bit → STINGAR |

## Fingerprint knobs

The image fingerprints as:

- `Server: Apache/2.4.58 (Unix)`
- `X-Powered-By: PHP/8.3.24`
- WordPress-looking HTML (home, login, admin, readme)

These are set in application code / middleware, not via compose env.

## Next Steps

- [Running Guide](running.md)
- [Troubleshooting](troubleshooting.md)
