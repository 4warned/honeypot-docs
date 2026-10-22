# Running WordPress PHP2Shell Honeypot

Operational guide for `4warned/hp-php2shell`.

## About PHP2Shell

PHP2Shell is the public name for two critical PHP engine flaws disclosed 2026-10-21:

- **CVE-2026-109618** — OOM / upload-progress path memory corruption
- **CVE-2026-109619** — stale global state after fatal errors across worker requests

Both are CVSS 9.2 class issues in PHP itself (not WordPress plugins). This honeypot only **baits and logs** probe-shaped traffic; it never executes payloads.

## Starting

```bash
docker compose up -d
```

## Stopping

```bash
docker compose down
```

## Verifying Operation

### Container status

```bash
docker compose ps
```

### Fingerprint

```bash
curl -sI http://localhost:80/
# Expect: Server: Apache/2.4.58 (Unix) and X-Powered-By: PHP/8.3.24
```

### WordPress surface

```bash
curl -s http://localhost:80/wp-login.php | head
curl -sI http://localhost:80/readme.html
```

### CVE probe surface (safe / benign)

```bash
# CVE-2026-109618 shaped multipart
curl -sD - -o /tmp/php2shell-body.txt \
  -X POST 'http://localhost:80/wp-admin/async-upload.php' \
  -H 'Content-Type: multipart/form-data; boundary=----BOUND' \
  --data-binary $'------BOUND\r\nContent-Disposition: form-data; name="async-upload"; filename="x.bin"\r\n\r\nAAAA\r\n------BOUND--\r\n'

# Replay bait PHPSESSID -> CVE-2026-109619 attribution
COOKIE=$(awk -F'[=;]' 'tolower($0) ~ /set-cookie: *phpsessid/ {print $2; exit}' /dev/stdin <<<"$(curl -sD - -o /dev/null \
  -X POST 'http://localhost:80/wp-admin/async-upload.php' \
  -H 'Content-Type: multipart/form-data; boundary=----BOUND' \
  --data-binary $'------BOUND\r\nContent-Disposition: form-data; name="f"; filename="x"\r\n\r\nx\r\n------BOUND--\r\n')")
curl -sD - -o /dev/null -H "Cookie: PHPSESSID=${COOKIE}" http://localhost:80/
```

## Monitoring

### View logs

```bash
docker compose logs -f
docker compose logs -f http-honeypot
docker compose logs --tail=100 http-honeypot
```

Look for lines containing `CVE-2026-109618` or `CVE-2026-109619`.

### JSON log (inside container)

```bash
docker compose exec http-honeypot cat logs/honeypot.json | tail
```

Events for probes include `cve_id`, method, path, content-type, body size, and bait issued/replayed flags.

### STINGAR

```bash
docker compose logs fluentbit
```

## Health Checks

```bash
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q http-honeypot)
```

## Resource Usage

```bash
docker stats --no-stream
```

## Next Steps

- [Configuration](configuration.md)
- [Troubleshooting](troubleshooting.md)
