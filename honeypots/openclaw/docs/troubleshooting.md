# Troubleshooting

Common issues and solutions for the OpenClaw AI Gateway Honeypot.

## Container Issues

### Container Won't Start

**Problem**: Container fails to start or exits immediately.

**Solutions**:

```bash
docker compose logs openclaw-honeypot
docker images | grep hp-openclaw
docker compose pull
```

### Container Keeps Restarting

**Problem**: Container starts but restarts repeatedly.

**Solutions**:

- Check if port 18789 is already in use: `lsof -i :18789`
- Review container logs: `docker compose logs --tail=50 openclaw-honeypot`
- Verify `stingar-hp.env` exists and is readable

## Network Issues

### Port Not Accessible

**Problem**: Cannot reach the honeypot from external hosts.

**Solutions**:

- Verify the container is running: `docker compose ps`
- Test locally first: `curl http://localhost:18789/`
- Check host firewall allows inbound on port 18789
- Verify port mapping in `docker-compose.yml`

### Connection Refused

**Problem**: `curl: (7) Failed to connect to localhost port 18789: Connection refused`

**Solutions**:

- Container may not be running: `docker compose ps`
- Container may still be starting: wait 15 seconds and retry
- Port conflict: another service is using port 18789

## STINGAR / Telemetry Issues

### Events Not Appearing in STINGAR

**Problem**: Honeypot is running but no events show in the STINGAR dashboard.

**Solutions**:

1. Verify Fluent Bit sidecar is running:
   ```bash
   docker compose ps fluentbit
   docker compose logs fluentbit
   ```

2. Verify `stingar-hp.env` has correct values:
   - `FLUENTD_HOST` must point to your STINGAR server
   - `FLUENTD_PORT` should be `24224`
   - `HONEYPOT_IDENT` must be a valid registered sensor UUID

3. Test network connectivity to STINGAR:
   ```bash
   docker compose exec fluentbit nc -zv <STINGAR_SERVER_IP> 24224
   ```

### Fluent Bit Cannot Connect

**Problem**: Fluent Bit logs show connection errors.

**Solutions**:

- Verify STINGAR server is reachable from the Docker host
- Check that outbound port 24224 (TCP) is allowed by the host firewall
- Confirm `FLUENTD_HOST` in `stingar-hp.env` is correct

## Debug Mode

To enable verbose logging:

```yaml
environment:
  - LOG_LEVEL=DEBUG
```

Then restart:

```bash
docker compose up -d
docker compose logs -f openclaw-honeypot
```

## Getting Help

If issues persist:

1. Collect logs: `docker compose logs > honeypot-debug.log 2>&1`
2. Note your Docker version: `docker --version`
3. Note your OS: `uname -a`
4. Contact your STINGAR administrator with the debug log

## Next Steps

- [Configuration](configuration.md) -- review settings
- [FAQ](faq.md) -- common questions
