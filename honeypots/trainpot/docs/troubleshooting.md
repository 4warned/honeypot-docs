# Troubleshooting

Common issues and solutions for the Trainpot Honeypot.

## Container Issues

### Container Won't Start

**Problem**: Container fails to start or exits immediately.

**Solutions**:

```bash
docker compose logs trainpot
docker images | grep trainpot
docker compose pull
```

### Container Keeps Restarting

**Problem**: Container starts but restarts repeatedly.

**Solutions**:

- Check if ports 80/443 are already in use: `lsof -i :80` / `lsof -i :443`
- Review container logs: `docker compose logs --tail=50 trainpot`
- Verify `stingar-hp.env` exists and is readable

## Network Issues

### Port Not Accessible

**Problem**: Cannot reach the honeypot from external hosts.

**Solutions**:

- Verify the container is running: `docker compose ps`
- Test locally: `curl http://localhost/`
- Check host firewall allows inbound on ports 80 and 443
- Verify port mapping in `docker-compose.yml`

## Content Issues

### Custom Content Not Showing

**Problem**: Content changes are not reflected.

**Solutions**:

- Verify the volume mount exists in `docker-compose.yml`: `./content:/opt/trainpot-hp/content`
- Check files are in the correct directory: `ls ./content/`
- Verify file permissions: `chmod -R 644 content/*`

### TLS Not Working

**Problem**: HTTPS connections fail.

**Solutions**:

- Verify cert volume is uncommented in `docker-compose.yml`
- Check certificate files exist: `ls ./certs/tls.crt ./certs/tls.key`
- Verify cert format (must be PEM encoded)
- Restart after enabling: `docker compose up -d`

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

To see detailed request logging:

```bash
docker compose logs -f trainpot
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
