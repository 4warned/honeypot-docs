# Configuration Guide

Configuration reference for the SYNsor Packet Monitoring Honeypot.

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Container orchestration, capabilities, networking |
| `stingar-hp.env` | STINGAR sensor credentials and telemetry routing |
| `configs/ports.txt` | TCP ports to monitor (one per line) |

## stingar-hp.env Variables

| Variable | Description |
|----------|-------------|
| `HONEYPOT_IDENT` | Unique sensor UUID (provided by STINGAR admin) |
| `HONEYPOT_HOST` | Human-readable sensor hostname |
| `HONEYPOT_IP` | External IP address of the honeypot host |
| `HONEYPOT_TYPE` | Sensor type (`synsor`) |
| `TAGS` | Comma-separated tags for filtering (e.g., `synsor,packet-monitor`) |
| `FLUENTD_HOST` | STINGAR server IP/hostname |
| `FLUENTD_PORT` | STINGAR Fluent forward port (default: `24224`) |
| `FLUENTBIT_HOST` | Fluent Bit hostname (use `localhost` with host networking) |
| `FLUENTBIT_PORT` | Fluent Bit forward input port (default: `24284`) |
| `FLUENTBIT_APP` | Fluent Bit application tag (default: `stingar`) |
| `NETWORK_INTERFACE` | Network interface to monitor (default: `any`) |
| `DEBUG` | Set to `true` for verbose logging |

## Port Configuration

### Monitored Ports

Edit `configs/ports.txt` to specify which TCP ports SYNsor monitors:

```text
22
80
443
3306
3389
5432
8080
8443
```

One port per line. SYNsor will detect SYN packets and connection attempts to
these ports.

### Network Interface

Set `NETWORK_INTERFACE` in `stingar-hp.env` to specify which interface to
monitor:

- `any` -- monitor all interfaces (default)
- `eth0` -- monitor a specific interface
- `ens5` -- AWS-style interface name

## Host Networking

SYNsor uses `network_mode: host` because raw socket capture requires direct
access to the host's network stack. This means:

- No port mapping is needed in `docker-compose.yml`
- The honeypot sees real source IPs (no NAT)
- Fluent Bit is accessed via `localhost` from the honeypot container

## Detection Tuning

### Nmap Pattern Recognition

SYNsor automatically detects common scan patterns:

- Top 1000 ports scan
- Sequential port ranges
- Aggressive scan (-A flag)
- Service detection patterns

These patterns are built into the binary and do not require configuration.

## Logging Configuration

### Log Output

All events are forwarded to your **STINGAR** server via the Fluent Bit sidecar.

### Debug Mode

Set `DEBUG=true` in `stingar-hp.env` for verbose packet-level logging:

```bash
DEBUG=true
```

## Networking

### Firewall Considerations

Since SYNsor uses host networking, ensure:

- The monitored ports are NOT blocked by the host firewall (SYNsor needs to see the SYN packets)
- Outbound port 24224 (TCP) is allowed for STINGAR telemetry
- Port 24284 is accessible on localhost for Fluent Bit

## Next Steps

- [Running Guide](running.md) -- operation and monitoring
- [Troubleshooting](troubleshooting.md) -- resolve issues
