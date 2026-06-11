# Troubleshooting

Common issues and solutions for the PeopleSoft CVE-2026-35273 Honeypot.

## Container Issues

### Container Won't Start

**Problem**: Container fails to start or exits immediately.

**Solutions**:

```bash
# Check logs for error messages
docker compose logs peoplesoft-honeypot

# Verify the image was pulled successfully
docker images | grep hp-peoplesoft

# Re-pull the image
docker compose pull
```

### Container Keeps Restarting

**Problem**: Container starts but restarts repeatedly.

**Solutions**:

- Check if port 8000 is already in use: `lsof -i :8000`
- Review container logs: `docker compose logs --tail=50 peoplesoft-honeypot`
- Verify `stingar-hp.env` exists and is readable

## Network Issues

### Port Not Accessible

**Problem**: Cannot reach the honeypot from external hosts.

**Solutions**:

- Verify the container is running: `docker compose ps`
- Test locally first: `curl http://localhost:8000/ps/signon.html`
- Check host firewall allows inbound on port 8000
- Verify port mapping in `docker-compose.yml`

### Connection Refused

**Problem**: `curl: (7) Failed to connect to localhost port 8000: Connection refused`

**Solutions**:

- Container may not be running: `docker compose ps`
- Container may still be starting: wait 15 seconds and retry
- Port conflict: another service is using port 8000

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

4. Check the honeypot is actually receiving traffic:
   ```bash
   docker compose logs -f peoplesoft-honeypot
   ```

### Fluent Bit Cannot Connect

**Problem**: Fluent Bit logs show connection errors.

**Solutions**:

- Verify STINGAR server is reachable from the Docker host
- Check that outbound port 24224 (TCP) is allowed by the host firewall
- Confirm `FLUENTD_HOST` in `stingar-hp.env` is correct

## Log Issues

### No Local JSON Logs

**Problem**: `./logs/honeypot.json` is empty or missing.

**Solutions**:

- Ensure the `./logs` directory exists: `mkdir -p logs`
- Check volume mount in `docker-compose.yml` maps `./logs:/app/logs`
- Verify the honeypot is receiving traffic (check container logs)

### Logs Growing Too Large

**Problem**: JSON log file consuming too much disk.

**Solutions**:

- Set up logrotate (see [Running Guide](running.md#log-rotation))
- Or manually truncate: `> logs/honeypot.json`

## Debug Mode

To enable verbose logging for diagnosing issues:

```yaml
environment:
  - LOG_LEVEL=DEBUG
```

Then restart:

```bash
docker compose up -d
docker compose logs -f peoplesoft-honeypot
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
