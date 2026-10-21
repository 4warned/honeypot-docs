# Troubleshooting

Common issues and solutions for HTTP Artifactory Honeypot.

## Container Issues

### Container Won't Start

```bash
docker compose logs http-honeypot
docker compose pull
docker compose up -d
```

### Container Keeps Restarting

- Check if port 8081 is already in use: `lsof -i :8081`
- Review logs: `docker compose logs --tail=50`
- Verify `stingar-hp.env` exists and is readable

## Network Issues

### Port Not Accessible

- Verify the container is running: `docker compose ps`
- Test locally: `curl http://localhost:8081/`
- Check host firewall allows inbound on port 8081
- Verify port mapping in `docker-compose.yml`

### Connection Refused

- Container may not be running: `docker compose ps`
- Container may still be starting: wait 15 seconds and retry
- Port conflict: another service is using port 8081

## STINGAR / Telemetry Issues

### Events Not Appearing in STINGAR

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

## Debug Mode

Set `LOG_LEVEL=DEBUG` in `docker-compose.yml`, then:

```bash
docker compose up -d
docker compose logs -f http-honeypot
```

## Getting Help

1. Collect logs: `docker compose logs > honeypot-debug.log 2>&1`
2. Note your Docker version: `docker --version`
3. Contact your STINGAR administrator with the debug log

## Next Steps

- [Configuration](configuration.md) -- review settings
- [FAQ](faq.md) -- common questions