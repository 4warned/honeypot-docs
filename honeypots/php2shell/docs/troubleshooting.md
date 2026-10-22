# Troubleshooting

Common issues for WordPress PHP2Shell (`4warned/hp-php2shell`).

## Container Issues

### Container will not start

```bash
docker compose logs http-honeypot
docker compose pull
docker compose up -d
```

Confirm the image name is `4warned/hp-php2shell:latest` (not an older `hp-http` tag).

### Container keeps restarting

- Port 80 already in use: `lsof -i :80` (or change the host mapping)
- Review logs: `docker compose logs --tail=50 http-honeypot`
- Verify `stingar-hp.env` exists and is readable next to `docker-compose.yml`

## Network Issues

### Port not accessible

- `docker compose ps`
- `curl -sI http://localhost:80/`
- Host firewall allows inbound on the mapped port
- Port mapping in `docker-compose.yml` is correct (`"8080:80"` if not using host 80)

### Connection refused

- Container still starting — wait for healthcheck `start_period` (~20s)
- Wrong host port in the `curl` URL

## Fingerprint / bait issues

### Missing `X-Powered-By: PHP/8.3.24`

```bash
curl -sI http://localhost:80/ | grep -i powered
```

If absent, you may be hitting a different service on that port.

### Multipart probe does not return 500 / PHPSESSID

- Use `Content-Type: multipart/form-data` with a real multipart body
- Target a probe path such as `/wp-admin/async-upload.php` or `/wp-admin/admin-ajax.php`
- Check logs for `CVE-2026-109618`

### No `CVE-2026-109619` after cookie replay

- Capture `Set-Cookie: PHPSESSID=php2shellbait_...` from the 618 response
- Replay that exact cookie value on a follow-up request to the same instance
- Bait tokens are in-memory per process; restarting the container clears them

## STINGAR / Telemetry

### Events not appearing in STINGAR

1. Fluent Bit running?

   ```bash
   docker compose ps fluentbit
   docker compose logs fluentbit
   ```

2. Check `stingar-hp.env`:
   - `FLUENTD_HOST` → STINGAR server
   - `FLUENTD_PORT` → usually `24224`
   - `HONEYPOT_IDENT` → registered sensor UUID

3. Connectivity:

   ```bash
   docker compose exec fluentbit nc -zv <STINGAR_SERVER_IP> 24224
   ```

### JSON log empty

```bash
docker compose exec http-honeypot ls -la logs/
docker compose exec http-honeypot tail logs/honeypot.json
```

Ensure `jsonlog` is enabled in the image `default.cfg` (it is on by default for this build).

## Debug Mode

```bash
# In docker-compose.yml environment:
# - LOG_LEVEL=DEBUG
docker compose up -d
docker compose logs -f http-honeypot
```

## Getting Help

1. `docker compose logs > honeypot-debug.log 2>&1`
2. `docker --version`
3. Contact your STINGAR administrator with the debug log and sensor UUID

## Next Steps

- [Configuration](configuration.md)
- [FAQ](faq.md)
