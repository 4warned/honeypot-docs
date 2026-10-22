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

### Verify bait probes (curl)

Replace `HOST` with the honeypot address (for local compose use `localhost` or `localhost:8080` if remapped). Successful probes should produce STINGAR `cve_probe` events with the matching `cve_id`.

**1. WordPress fingerprint**

```bash
curl -sS -D- "http://HOST/" | head -30
```

Expect `200`, WordPress generator meta, and Apache/PHP-style headers (`X-Powered-By: PHP/8.3.24`).

**2. CVE-2026-109618 (multipart bait)**

```bash
curl -sS -D- -o /tmp/618.body -X POST "http://HOST/wp-admin/admin-ajax.php" \
  -F "action=php2shell_upload" \
  -F "file=@/etc/hosts;filename=shell.php"
```

Expect `500`, PHP memory-exhaustion HTML, and `Set-Cookie: PHPSESSID=php2shellbait_...`.

**3. CVE-2026-109619 (replay bait PHPSESSID)**

```bash
COOKIE=$(awk -F': ' 'tolower($1)=="set-cookie"{print $2}' <<< "$(curl -sS -D- -o /dev/null -X POST "http://HOST/wp-admin/admin-ajax.php" -F "action=php2shell_upload" -F "file=@/etc/hosts;filename=shell.php")" | head -1 | cut -d';' -f1)

curl -sS -D- -o /tmp/619.body -X POST "http://HOST/wp-admin/admin-ajax.php" \
  -H "Cookie: $COOKIE" \
  -F "action=continue"
cat /tmp/619.body
```

Expect `500` and an out-of-memory fatal in `wp-includes/functions.php`. Confirm the body with `cat /tmp/619.body` if you used `-o`.

### Missing `X-Powered-By: PHP/8.3.24`

```bash
curl -sI http://localhost:80/ | grep -i powered
```

If absent, you may be hitting a different service on that port.

### Multipart probe does not return 500 / PHPSESSID

- Use `Content-Type: multipart/form-data` with a real multipart body (see curl examples above)
- Target a probe path such as `/wp-admin/async-upload.php` or `/wp-admin/admin-ajax.php`
- Check logs for `CVE-2026-109618`

### No `CVE-2026-109619` after cookie replay

- Capture `Set-Cookie: PHPSESSID=php2shellbait_...` from the 618 response
- Replay that exact cookie value on a follow-up request to the same instance (see curl example above)
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
