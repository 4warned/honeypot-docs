# Architecture

Technical architecture of the WordPress PHP2Shell honeypot.

## System Overview

Deployed as a Docker Compose stack with two containers:

```
                    Internet
                       |
                  Port 80
                       |
            +----------v----------+
            |  Honeypot            |
            |  4warned/hp-php2shell|
            +----------+----------+
                       |
              Fluent Forward (24284)
                       |
            +----------v----------+
            |  Fluent Bit          |
            |  4warned/fluentbit   |
            +----------+----------+
                       |
              TCP (24224)
                       |
            +----------v----------+
            |  STINGAR Server      |
            +---------------------+
```

## Components

### Honeypot container (`4warned/hp-php2shell`)

Flask application that:

- Presents a WordPress / Apache / unpatched PHP fingerprint
- Accepts normal WP surface traffic (`/`, `/wp-login.php`, `/wp-admin/`, `/xmlrpc.php`, …)
- Detects PHP2Shell **probe-shaped** requests and emits per-CVE events
- Returns believable PHP fatal / OOM HTML and optional bait `PHPSESSID` cookies
- Never runs real PHP and never executes attacker code

### Fluent Bit sidecar

Receives structured events and forwards them to STINGAR.

## Probe surface

```
Attacker
   |  GET /  (fingerprint)
   v
Honeypot --> WordPress HTML + X-Powered-By: PHP/8.3.24
   |
   |  multipart POST /wp-admin/async-upload.php
   v
Honeypot --> log cve_id=CVE-2026-109618
         --> HTTP 500 OOM HTML + Set-Cookie PHPSESSID=php2shellbait_...
   |
   |  GET / with bait Cookie
   v
Honeypot --> log cve_id=CVE-2026-109619
         --> HTTP 500 fatal-error HTML
```

| CVE | Trigger | Response |
|---|---|---|
| CVE-2026-109618 | Multipart / upload-progress style POST on WP entrypoints | 500 + bait `PHPSESSID` |
| CVE-2026-109619 | Replay of issued bait `PHPSESSID` | 500 fatal-error style page |

## Data Flow

1. Client connects to port 80
2. Honeypot classifies the request (normal WP vs PHP2Shell probe)
3. Event written to JSON log and forwarded to Fluent Bit (when enabled)
4. Fluent Bit delivers the event to STINGAR

## Security Considerations

- No real remote code execution or shell handlers
- Bait `PHPSESSID` values are opaque fake tokens, not process memory
- Fluent Bit host ports bind to `127.0.0.1` only
- Containers use `restart: unless-stopped` and an isolated Compose network

## Next Steps

- [Configuration](configuration.md)
- [Running Guide](running.md)
