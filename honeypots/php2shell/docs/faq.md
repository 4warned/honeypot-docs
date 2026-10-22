# FAQ

Frequently asked questions about the WordPress PHP2Shell honeypot.

## General

### What does this honeypot do?

It looks like a public WordPress site on Apache with an unpatched PHP 8.3.x
runtime and baits probe traffic associated with **PHP2Shell**:

- **CVE-2026-109618**
- **CVE-2026-109619**

Interactions are logged locally and can be forwarded to STINGAR.

### Is this a real vulnerable PHP / WordPress?

No. The honeypot is a Flask behavioral bait. It does not run PHP or WordPress
and does not execute attacker payloads. WordPress/plugin updates also do not
“patch” this image — there is nothing real to patch; operators update the
honeypot image when a newer bait build is published.

### What image should I pull?

```bash
docker pull 4warned/hp-php2shell:latest
```

### What CVEs does it cover?

Both PHP2Shell CVEs (disclosed 2026-10-21):

| CVE | Honeypot behavior |
|---|---|
| CVE-2026-109618 | Multipart / upload-progress style probes → 500 + bait `PHPSESSID` |
| CVE-2026-109619 | Replay of bait `PHPSESSID` → 500 fatal-error style response |

## Deployment

### What ports does it use?

- **80** (configurable host map) — honeypot listener
- **24284** (internal) — honeypot → Fluent Bit
- **24224** (outbound) — Fluent Bit → STINGAR

### Can I run multiple honeypots on the same host?

Yes. Use different host ports and a unique Fluent Bit `container_name` per stack.

### What architectures are supported?

Build for the host you deploy on (`linux/amd64` or `linux/arm64`). Pull
`4warned/hp-php2shell:latest` for the published tag.

## Security

### Is it safe to expose on the internet?

Yes for a honeypot role: payloads are captured and logged, not executed. Still
isolate it on a dedicated host or VLAN like any other deception sensor.

### Does it implement a PHP2Shell exploit?

No. It only recognizes probe-shaped traffic and returns deceptive error pages
plus opaque bait cookies.

## Telemetry

### What data is sent to STINGAR?

Typical fields: source IP/port, timestamp, method, path, headers summary,
`cve_id` when a PHP2Shell probe matched, and bait issued/replayed flags.

### Can I use it without STINGAR?

Yes. Remove the `fluentbit` service from `docker-compose.yml` (or leave
STINGAR disabled). Events still appear in container logs and `logs/honeypot.json`.
